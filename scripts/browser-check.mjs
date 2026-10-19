import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

// Optional local QA with installed Chrome; no browser dependency or download required.
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:5173';
const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const output = resolve('test-results');
await mkdir(output, { recursive: true });
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9223', `--user-data-dir=${resolve('.browser-profile')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(done => setTimeout(done, ms));
let ws;
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try { target = await (await fetch('http://127.0.0.1:9223/json/new', { method: 'PUT' })).json(); break; } catch { await delay(200); }
  }
  assert.ok(target?.webSocketDebuggerUrl, 'Chrome debugger started');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((done, reject) => { ws.onopen = done; ws.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  const exceptions = [];
  const consoleErrors = [];
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push(message.params.args.map(arg => arg.value || arg.description).join(' '));
    if (message.id && pending.has(message.id)) {
      const { done, reject, timer } = pending.get(message.id);
      clearTimeout(timer); pending.delete(message.id);
      message.error ? reject(new Error(JSON.stringify(message.error))) : done(message.result);
    }
  };
  function command(method, params = {}) {
    return new Promise((done, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 20000);
      pending.set(id, { done, reject, timer }); ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function until(expression) {
    for (let i = 0; i < 160; i++) { if (await evaluate(expression)) return; await delay(150); }
    throw new Error(`Condition timed out: ${expression}; diagnostics: ${JSON.stringify(await evaluate('({ready:document.readyState,url:location.href,text:document.body.innerText.slice(0,1200)})'))}; exceptions: ${JSON.stringify(exceptions)}; console: ${JSON.stringify(consoleErrors)}`);
  }
  async function navigate(path) { await command('Page.navigate', { url: `${origin}${path}` }); await until('document.readyState !== "loading" && !!document.querySelector("h1")'); }
  await command('Page.enable'); await command('Runtime.enable'); await command('Page.bringToFront');
  const widths = [360, 390, 768, 1024, 1440];
  const report = [];
  await navigate('/');
  await evaluate('Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,5000))]).then(()=>true)');
  for (const width of widths) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: false });
    await delay(200);
    const dimensions = await evaluate('({viewport:innerWidth,document:document.documentElement.scrollWidth,h1:document.querySelectorAll("h1").length})');
    assert.ok(dimensions.document <= width, `Home has no overflow at ${width}: ${dimensions.document}`);
    assert.equal(dimensions.h1, 1);
    if (width === 360 || width === 1440) {
      const shot = await command('Page.captureScreenshot', { format: 'png' });
      await writeFile(resolve(output, `home-${width}.png`), Buffer.from(shot.data, 'base64'));
    }
    report.push(`Homepage ${width}px: no overflow, one h1`);
  }
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await evaluate('document.querySelector(".menu-toggle").click()');
  assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'true');
  await evaluate('document.querySelectorAll(".navigation a")[1].click()');
  await until('location.hash === "#experience"');
  assert.equal(await evaluate('document.querySelector(".menu-toggle").getAttribute("aria-expanded")'), 'false');
  report.push('Mobile menu opens, navigates, and closes');
  await evaluate('document.querySelector(".hero .button-secondary").click()');
  await until('!!document.querySelector("dialog[open]") && document.querySelector("dialog").textContent.includes("hasn’t been added")');
  assert.ok(await evaluate('document.querySelector("dialog a").href.startsWith("mailto:")'));
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await until('!document.querySelector("dialog[open]")');
  report.push('Missing-resume fallback and Escape dismissal verified');
  await evaluate('document.querySelector(".contact-form button[type=submit]").click()');
  assert.equal(await evaluate('document.querySelectorAll(".field-error").length'), 4);
  await evaluate('document.querySelectorAll(".contact-paths button")[1].click()');
  await until('!!document.querySelector("#project-type")');
  await evaluate(`(() => {
    const set = (selector, value) => { const node = document.querySelector(selector); Object.getOwnPropertyDescriptor(node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set.call(node, value); node.dispatchEvent(new Event('input', { bubbles: true })); };
    set('#contact-name', 'Browser Test'); set('#contact-email', 'test@example.com'); set('#contact-message', 'A business website enquiry prepared during local QA.');
  })()`);
  await evaluate('document.querySelector(".contact-form button[type=submit]").click()');
  await until('!!document.querySelector(".draft-ready a")');
  const draft = await evaluate('document.querySelector(".draft-ready a").href');
  assert.ok(new URL(draft).searchParams.get('body').includes('A business website enquiry'));
  assert.ok(new URL(draft).searchParams.get('subject').includes('Freelance Project'));
  report.push('Contact errors, freelance field and encoded email draft verified; no email sent');
  assert.ok(await evaluate('[...document.querySelectorAll("a")].filter(a=>a.getAttribute("href")?.startsWith("#")).every(a=>document.getElementById(a.getAttribute("href").slice(1)))'));
  const social = await evaluate('[...document.querySelectorAll(".contact-copy .social-links a")].map(a=>a.href)');
  assert.ok(social.includes('https://github.com/bytebysatyam'));
  assert.ok(social.includes('https://www.linkedin.com/in/satyamshukla10/'));
  assert.ok(!(await evaluate('[...document.querySelectorAll("a")].some(a=>a.href.startsWith("tel:"))')));
  report.push('Internal anchors and supplied social URLs verified; empty phone hidden');
  await navigate('/work/india-trade-overseas');
  await until('document.title.includes("Case Study")');
  for (const width of widths) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: false });
    await delay(100);
    assert.ok(await evaluate(`document.documentElement.scrollWidth <= ${width}`), `Case study no overflow at ${width}`);
    report.push(`Case study ${width}px: no overflow`);
  }
  assert.equal(await evaluate('document.querySelectorAll(".case-screenshots figure").length'), 7);
  assert.ok(await evaluate('document.querySelector("meta[name=description]").content.includes("Node.js APIs")'));
  await navigate('/not-a-page');
  await until('document.title.includes("Page not found")');
  report.push('Direct case-study route, metadata, seven screenshot placeholders and 404 verified');
  assert.deepEqual(exceptions, [], 'No runtime exceptions');
  assert.deepEqual(consoleErrors, [], 'No console errors');
  report.push('No uncaught browser runtime exceptions or console errors');
  await writeFile(resolve(output, 'browser-report.json'), JSON.stringify({ origin, checks: report }, null, 2));
  console.log(report.join('\n'));
} finally {
  if (ws?.readyState === WebSocket.OPEN) { ws.send(JSON.stringify({ id: 99999, method: 'Browser.close' })); ws.close(); }
  browser.kill();
}
