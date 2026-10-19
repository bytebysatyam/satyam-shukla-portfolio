import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download, FileText, Image, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { assetUrl } from '../../lib/assets';

export function SectionHeading({ label, title, children, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{label}</p><h2>{title}</h2>{children && <p className="section-intro">{children}</p>}</div>{action}</div>;
}
export function Tags({ items }) { return <ul className="tags" aria-label="Technologies">{items.map(item => <li key={item}>{item}</li>)}</ul>; }
export function ExternalLink({ href, children, className = '' }) {
  const url = assetUrl(href);
  if (!url) return null;
  return <a className={className} href={url} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>;
}
export function Screenshot({ path, label, className = '' }) {
  const source = assetUrl(path);
  const [failed, setFailed] = useState(false);
  return <figure className={`screenshot ${className}`}>{source && !failed ? <img src={source} onError={() => setFailed(true)} alt={label} loading="lazy" /> : <div className="screenshot-empty"><span className="placeholder-icon"><Image size={23} aria-hidden="true" /></span><strong>{label}</strong><span>Project screenshot will be added here.</span></div>}<figcaption>{label}</figcaption></figure>;
}
export function Portrait({ compact = false }) {
  const source = assetUrl(profile.photo);
  const [failed, setFailed] = useState(false);
  return <div className={`portrait ${compact ? 'portrait-compact' : ''}`}>{source && !failed ? <img src={source} onError={() => setFailed(true)} alt="Satyam Shukla" /> : <><span className="portrait-orbit orbit-one" /><span className="portrait-orbit orbit-two" /><span className="portrait-monogram" aria-label="Satyam Shukla profile photo placeholder">ss<span>.</span></span><span className="portrait-caption">PROFILE PHOTO COMING SOON</span></>}</div>;
}
export function ResumeButton({ className = 'button button-secondary' }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('checking');
  const dialogRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog.showModal();
    const controller = new AbortController();
    setStatus('checking');
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch(profile.resume, { signal: controller.signal }).then(async response => {
      const header = new Uint8Array(await response.arrayBuffer()).slice(0, 5);
      setStatus(response.ok && String.fromCharCode(...header) === '%PDF-' ? 'ready' : 'missing');
    }).catch(() => setStatus('missing')).finally(() => clearTimeout(timer));
    return () => { controller.abort(); clearTimeout(timer); if (dialog.open) dialog.close(); };
  }, [open]);
  function close() { setOpen(false); buttonRef.current?.focus(); }
  return <><button ref={buttonRef} className={className} onClick={() => setOpen(true)}><FileText size={16} aria-hidden="true" />View Resume</button>{open && <dialog className="resume-dialog" ref={dialogRef} aria-labelledby="resume-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}><button className="icon-button dialog-close" aria-label="Close resume dialog" onClick={close}><X size={20} /></button><span className="modal-symbol"><FileText size={28} /></span><p className="eyebrow">THE NEXT CONVERSATION</p><h2 id="resume-title">Satyam’s resume</h2>{status === 'checking' ? <p role="status">Checking resume availability…</p> : status === 'ready' ? <><p>A closer look at my experience and technical background.</p><div className="button-row"><a className="button button-primary" href={profile.resume} target="_blank" rel="noreferrer">Open PDF <ArrowUpRight size={16} /></a><a className="button button-secondary" href={profile.resume} download><Download size={16} />Download</a></div></> : <><p>The resume PDF hasn’t been added to this portfolio yet. You can request the latest copy directly by email.</p><a className="button button-primary" href={`mailto:${profile.email}?subject=Resume%20request`}>Request my resume <ArrowUpRight size={16} /></a></>}</dialog>}</>;
}
