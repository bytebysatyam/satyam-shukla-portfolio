import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download, FileText, Image, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { assetUrl } from '../../lib/assets';

export function SectionHeading({ label, title, children, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{label}</p><h2>{title}</h2>{children && <p className="section-intro">{children}</p>}</div>{action}</div>;
}

export function Tags({ items }) {
  return <ul className="tags" aria-label="Technologies">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

export function ExternalLink({ href, children, className = '' }) {
  const url = assetUrl(href);
  if (!url || !/^(https?:\/\/|\/)/i.test(url) || url.startsWith('//')) return null;
  return <a className={className} href={url} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>;
}

export function Screenshot({ path, label, alt = label, caption = label, note, className = '' }) {
  const source = assetUrl(path);
  const [failedSource, setFailedSource] = useState('');
  return <figure className={`screenshot ${className}`}>
    {source && failedSource !== source ? <img src={source} onError={() => setFailedSource(source)} alt={alt} loading="lazy" decoding="async" width="1672" height="941" /> : <div className="screenshot-empty"><span className="placeholder-icon"><Image size={23} aria-hidden="true" /></span><strong>{label}</strong><span>Project visual is not available yet.</span></div>}
    <figcaption>{caption}{note && <span className="visual-note">{note}</span>}</figcaption>
  </figure>;
}

export function Portrait() {
  const source = assetUrl(profile.photo);
  const [failed, setFailed] = useState(false);
  return <div className="portrait">
    {source && !failed ? <img src={source} onError={() => setFailed(true)} alt={`${profile.name}, ${profile.title}`} width="991" height="1280" fetchPriority="high" decoding="async" /> : <><span className="portrait-orbit orbit-one" /><span className="portrait-orbit orbit-two" /><span className="portrait-monogram" aria-label={`${profile.name} profile placeholder`}>ss<span>.</span></span><span className="portrait-caption">{profile.name.toUpperCase()}</span></>}
  </div>;
}

export function ResumeButton({ className = 'button button-secondary', download = false, onOpen, onClose }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('checking');
  const dialogRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const controller = new AbortController();
    let current = true;
    setStatus('checking');
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch(profile.resume, { signal: controller.signal }).then(async response => {
      const header = new Uint8Array(await response.arrayBuffer()).slice(0, 5);
      if (current) setStatus(response.ok && String.fromCharCode(...header) === '%PDF-' ? 'ready' : 'missing');
    }).catch(() => { if (current) setStatus('missing'); }).finally(() => clearTimeout(timer));
    return () => {
      current = false; controller.abort(); clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);
  function close() {
    setOpen(false);
    onClose?.();
    if (buttonRef.current?.offsetParent !== null) buttonRef.current?.focus();
  }
  return <>
    <button ref={buttonRef} className={className} onClick={() => { onOpen?.(); setOpen(true); }}>{download ? <Download size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}{download ? 'Download Resume' : 'View Resume'}</button>
    {open && <dialog className="resume-dialog" ref={dialogRef} aria-label={`${profile.name} resume`} onCancel={close} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); } }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <button className="icon-button dialog-close" aria-label="Close resume dialog" onClick={close}><X size={20} /></button>
      <span className="modal-symbol"><FileText size={28} aria-hidden="true" /></span>
      <p className="eyebrow">EXPERIENCE & TECHNICAL BACKGROUND</p><h2>{profile.name}’s resume</h2>
      {status === 'checking' ? <p role="status">Checking resume availability…</p> : status === 'ready' ? <>
        <p>Explore my experience, projects and technical background.</p>
        <div className="button-row"><a className="button button-primary" href={profile.resume} target="_blank" rel="noopener noreferrer">View Resume <ArrowUpRight size={16} aria-hidden="true" /></a><a className="button button-secondary" href={profile.resume} download><Download size={16} aria-hidden="true" />Download Resume</a></div>
      </> : <><p>The resume PDF is currently unavailable. You can request the latest copy directly by email.</p><a className="button button-primary" href={`mailto:${profile.email}?subject=Resume%20request`}>Request my resume <ArrowUpRight size={16} aria-hidden="true" /></a></>}
    </dialog>}
  </>;
}
