import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { contactLinks, profile } from '../src/data/profile.js';

// Run against a local production preview. No emails, calls or WhatsApp messages are sent.
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4173';
const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const output = resolve('test-results');
const browserProfile = resolve('.browser-profile', `qa-${process.pid}`);
await mkdir(output, { recursive: true });
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${browserProfile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(done => setTimeout(done, ms));
let launchError;
browser.on('error', error => { launchError = error; });
let ws;
try {
  let target;
  for (let i = 0; i < 80; i++) {
    if (launchError) throw launchError;
    try {
      const port = (await readFile(resolve(browserProfile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
      target = await (await fetch(`http://127.0.0.1:${port}/json/new`, { method: 'PUT' })).json();
      break;
    } catch { await delay(150); }
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
    if (message.method === 'Fetch.requestPaused') {
      command('Fetch.fulfillRequest', { requestId: message.params.requestId, responseCode: 404, responseHeaders: [{ name: 'Content-Type', value: 'text/plain' }], body: Buffer.from('Resume unavailable during QA').toString('base64') }).catch(error => exceptions.push(error.message));
    }
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
    for (let i = 0; i < 160; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw new Error(`Condition timed out: ${expression}; diagnostics: ${JSON.stringify(await evaluate('({url:location.href,text:document.body.innerText.slice(0,700)})'))}; exceptions: ${JSON.stringify(exceptions)}; console: ${JSON.stringify(consoleErrors)}`);
  }
  async function navigate(path) { await command('Page.navigate', { url: `${origin}${path}` }); await until('document.readyState !== "loading" && !!document.querySelector("h1")'); }
  async function viewport(width, height = 950) { await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }); await delay(100); }
  async function key(key, code, virtual, shift = false) {
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual, modifiers: shift ? 8 : 0 });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual, modifiers: shift ? 8 : 0 });
  }
  async function screenshot(name) {
    const shot = await command('Page.captureScreenshot', { format: 'png' });
    await writeFile(resolve(output, name), Buffer.from(shot.data, 'base64'));
  }
  await command('Page.enable'); await command('Runtime.enable'); await command('Page.bringToFront');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1600];
  const report = [];
  await navigate('/');
  for (const width of widths) {
    await viewport(width);
    assert.ok(await evaluate(`document.documentElement.scrollWidth <= ${width}`), `Homepage has no overflow at ${width}`);
    assert.equal(await evaluate('document.querySelectorAll("h1").length'), 1);
    if (width === 320 || width === 1440) await screenshot(`home-${width}.png`);
    report.push(`Homepage ${width}px: no overflow, one h1`);
  }
  assert.equal(await evaluate('document.querySelectorAll(".portrait img").length'), 1, 'Profile photo appears once');
  assert.ok(await evaluate('document.querySelector(".portrait img").complete && document.querySelector(".portrait img").naturalWidth > 0'));
  await evaluate('document.querySelector("#work").scrollIntoView()');
  await until('[...document.querySelectorAll(".project-preview img")].every(img=>img.complete && img.naturalWidth>0)');
  assert.ok(await evaluate('[...document.querySelectorAll(".project-preview figcaption")].every(node=>/generated/i.test(node.textContent))'));
  assert.ok(await evaluate('[...document.querySelectorAll("a[target=_blank]")].every(a=>a.rel.includes("noopener") && a.rel.includes("noreferrer"))'));
  await viewport(1440);
  await evaluate('document.querySelector("#work").scrollIntoView()'); await screenshot('selected-work-1440.png');
  report.push('One loaded profile photo, two loaded and honestly labeled generated project visuals, safe external targets');

  await viewport(390, 844);
  await evaluate('window.scrollTo(0,0); document.querySelector(".menu-toggle").click()');
  await until('document.body.style.overflow === "hidden"');
  await key('Tab', 'Tab', 9, true);
  assert.ok(await evaluate('document.activeElement.closest("header") !== null'), 'Menu keeps keyboard focus in header');
  await key('Escape', 'Escape', 27);
  await until('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false" && document.body.style.overflow !== "hidden"');
  assert.ok(await evaluate('document.activeElement === document.querySelector(".menu-toggle")'));
  await evaluate('document.querySelector(".menu-toggle").click()');
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', x: 10, y: 800, button: 'left', clickCount: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 10, y: 800, button: 'left', clickCount: 1 });
  await until('document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false"');
  await evaluate('document.querySelector(".menu-toggle").click()');
  await evaluate('document.querySelectorAll(".navigation a")[1].click()');
  await until('location.hash === "#experience" && document.body.style.overflow !== "hidden"');
  report.push('Mobile menu: focus containment, Escape and focus return, outside click, navigation and scroll unlock');

  await evaluate('document.querySelector(".hero .button-secondary").click()');
  await until('!!document.querySelector("dialog[open] a[download]")');
  assert.ok(await evaluate('document.querySelector("dialog a[download]").href.endsWith("/resume/Satyam-Shukla-Resume.pdf")'));
  assert.ok(await evaluate('fetch("/resume/Satyam-Shukla-Resume.pdf").then(r=>r.arrayBuffer()).then(b=>String.fromCharCode(...new Uint8Array(b).slice(0,5)) === "%PDF-")'));
  await key('Tab', 'Tab', 9);
  assert.ok(await evaluate('document.activeElement.closest("dialog") !== null'));
  await key('Escape', 'Escape', 27);
  await until('!document.querySelector("dialog[open]") && document.body.style.overflow !== "hidden"');
  assert.ok(await evaluate('document.activeElement === document.querySelector(".hero .button-secondary")'));
  await command('Fetch.enable', { patterns: [{ urlPattern: '*resume/Satyam-Shukla-Resume.pdf', requestStage: 'Request' }] });
  await evaluate('document.querySelector(".hero .button-secondary").click()');
  await until('document.querySelector("dialog")?.textContent.includes("currently unavailable")');
  assert.ok(await evaluate('document.querySelector("dialog a").href.startsWith("mailto:")'));
  assert.equal(await evaluate('document.querySelectorAll("dialog a[download]").length'), 0);
  await key('Escape', 'Escape', 27); await until('!document.querySelector("dialog[open]")');
  await command('Fetch.disable');
  report.push('Real resume PDF, view/download links, modal focus, Escape, body unlock and simulated missing-PDF fallback');

  await evaluate('document.querySelector(".contact-form button[type=submit]").click()');
  assert.equal(await evaluate('document.querySelectorAll(".field-error").length'), 4);
  await evaluate('document.querySelectorAll(".contact-paths button")[1].click()'); await until('!!document.querySelector("#project-type")');
  await evaluate(`(() => {
    const set = (selector, value) => { const node = document.querySelector(selector); Object.getOwnPropertyDescriptor(node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set.call(node, value); node.dispatchEvent(new Event('input', { bubbles: true })); };
    set('#contact-name', 'Browser Test'); set('#contact-email', 'test@example.com'); set('#contact-message', 'A business website enquiry prepared during local QA.');
  })()`);
  await evaluate('document.querySelector(".contact-form button[type=submit]").click()'); await until('!!document.querySelector(".draft-ready a")');
  const draft = new URL(await evaluate('document.querySelector(".draft-ready a").href'));
  assert.ok(draft.searchParams.get('body').includes('A business website enquiry'));
  assert.ok(draft.searchParams.get('subject').includes('Freelance Project'));
  const anchors = await evaluate('[...document.querySelectorAll(".contact-copy a")].map(a=>a.href)');
  for (const href of [profile.github, profile.linkedin, contactLinks.email, ...contactLinks.phones.flatMap(phone => [phone.call, phone.whatsapp])]) assert.ok(anchors.includes(href), `Contact link ${href}`);
  assert.ok(await evaluate('[...document.querySelectorAll("a")].filter(a=>a.getAttribute("href")?.startsWith("#")).every(a=>document.getElementById(a.getAttribute("href").slice(1)))'));
  await evaluate('document.querySelector("#contact").scrollIntoView()'); await screenshot('contact-390.png');
  report.push('Form validation, freelance field, truthful encoded email draft, all contact URLs and internal anchors');
  await command('Accessibility.enable');
  const tree = await command('Accessibility.getFullAXTree');
  const unnamed = tree.nodes.filter(node => !node.ignored && ['button','link','textbox','combobox'].includes(node.role?.value) && !node.name?.value?.trim());
  assert.equal(unnamed.length, 0, 'Interactive controls have accessible names');
  report.push('Accessibility tree: no unnamed buttons, links, text fields or selects');
  await evaluate('document.querySelector(".project-preview img").src = "data:image/jpeg;base64,aW52YWxpZA=="');
  await until('document.querySelectorAll(".project-preview .screenshot-empty").length === 1');
  report.push('Failed image decode renders a designed fallback without a broken image icon');

  await navigate('/work/india-trade-overseas'); await until('document.title.includes("Case Study")');
  for (const width of widths) {
    await viewport(width);
    assert.ok(await evaluate(`document.documentElement.scrollWidth <= ${width}`), `Case study has no overflow at ${width}`);
    report.push(`Case study ${width}px: no overflow`);
  }
  await viewport(390); await screenshot('case-study-390.png');
  assert.ok(await evaluate('document.querySelector(".case-live-link a").href === "https://www.indiatradeoverseas.com/"'));
  assert.ok(await evaluate('document.querySelector(".proprietary-note").textContent.includes("proprietary")'));
  assert.equal(await evaluate('document.querySelectorAll(".case-content a[href*=github]").length'), 0);
  assert.ok(await evaluate('document.querySelector("link[rel=canonical]").href.endsWith("/work/india-trade-overseas")'));
  assert.ok(await evaluate('document.querySelector("meta[name=description]").content.includes("Node.js APIs")'));
  await navigate('/not-a-page'); await until('document.title.includes("Page not found")');
  assert.ok(await evaluate('document.querySelector("meta[name=robots]").content.includes("noindex")'));
  report.push('Direct case-study load, official ITO URL, proprietary source handling, route metadata and noindex 404');
  await command('Emulation.setScriptExecutionDisabled', { value: true });
  await command('Page.navigate', { url: `${origin}/` });
  await until('!!document.querySelector("noscript h1")');
  assert.ok(await evaluate('document.querySelector("noscript a").href.startsWith("mailto:")'));
  await command('Emulation.setScriptExecutionDisabled', { value: false });
  report.push('Useful no-JavaScript contact fallback');
  assert.deepEqual(exceptions, [], 'No runtime exceptions');
  assert.deepEqual(consoleErrors, [], 'No console errors');
  report.push('No uncaught runtime exceptions or console errors');
  await writeFile(resolve(output, 'browser-report.json'), JSON.stringify({ origin, checks: report }, null, 2));
  console.log(report.join('\n'));
} finally {
  if (ws?.readyState === WebSocket.OPEN) { ws.send(JSON.stringify({ id: 99999, method: 'Browser.close' })); ws.close(); }
  browser.kill();
}
