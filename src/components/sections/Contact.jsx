import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Copy, Github, Linkedin, Mail, Phone, Send } from 'lucide-react';
import { profile } from '../../data/profile';
import { createMailto, projectTypes, reasons, validateContact } from '../../lib/contact';
import { ExternalLink } from '../ui/Primitives';

const empty = { name: '', email: '', reason: '', projectType: '', message: '' };
export default function Contact() {
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState({});
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const formRef = useRef(null);
  function choose(reason) {
    setData(current => ({ ...current, reason })); setDraft('');
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    setTimeout(() => formRef.current?.querySelector('input')?.focus({ preventScroll: true }), 100);
  }
  function update(event) { setData(current => ({ ...current, [event.target.name]: event.target.value })); setDraft(''); }
  function submit(event) {
    event.preventDefault();
    const validation = validateContact(data); setErrors(validation);
    if (Object.keys(validation).length) { formRef.current?.elements.namedItem(Object.keys(validation)[0])?.focus(); return; }
    setDraft(createMailto(data, profile.email));
  }
  async function copy() {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setCopyError(false); setTimeout(() => setCopied(false), 2500); }
    catch { setCopyError(true); }
  }
  const errorProps = name => ({ 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `${name}-error` : undefined });
  return <section id="contact" className="section contact-section"><div className="container contact-layout"><div className="contact-copy"><p className="eyebrow">LET’S START A CONVERSATION</p><h2>Let’s Build<br />Something <span>Useful.</span></h2><p>Whether you’re hiring for a software role or need help building a business web solution, feel free to reach out.</p><div className="contact-paths"><div><BriefcaseBusiness size={19} /><div><h3>For Hiring / Opportunities</h3><button className="text-link" onClick={() => choose('Job Opportunity')}>Contact Me <ArrowUpRight size={16} /></button></div></div><div><Send size={19} /><div><h3>For Projects / Freelance</h3><button className="text-link" onClick={() => choose('Freelance Project')}>Discuss a Project <ArrowUpRight size={16} /></button></div></div></div><div className="email-contact"><span>PREFER EMAIL?</span><div><a href={`mailto:${profile.email}`}>{profile.email}</a><button className="icon-button" onClick={copy} aria-label="Copy email address">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div><span className="copy-status" role="status">{copied ? 'Email address copied.' : copyError ? 'Please select and copy the email address above.' : ''}</span></div><div className="social-links"><ExternalLink href={profile.github}><Github size={17} />GitHub</ExternalLink><ExternalLink href={profile.linkedin}><Linkedin size={17} />LinkedIn</ExternalLink>{profile.phone && <a href={`tel:${profile.phone}`}><Phone size={17} />Call</a>}{profile.phone && <ExternalLink href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}>WhatsApp</ExternalLink>}</div></div><form ref={formRef} className="contact-form" onSubmit={submit} noValidate><div className="form-heading"><h3>Tell me what you have in mind.</h3><span><Mail size={19} /></span></div><p>New opportunity, a project idea, or just a conversation.</p><div className="form-row"><div className="field"><label htmlFor="contact-name">Name <span>*</span></label><input id="contact-name" name="name" autoComplete="name" placeholder="Your name" value={data.name} onChange={update} required maxLength={100} {...errorProps('name')} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div><div className="field"><label htmlFor="contact-email">Email <span>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={data.email} onChange={update} required maxLength={254} {...errorProps('email')} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div></div><div className="field"><label htmlFor="contact-reason">Reason for Contact <span>*</span></label><select id="contact-reason" name="reason" value={data.reason} onChange={update} required {...errorProps('reason')}><option value="">What brings you here?</option>{reasons.map(reason => <option key={reason}>{reason}</option>)}</select>{errors.reason && <span className="field-error" id="reason-error">{errors.reason}</span>}</div>{data.reason === 'Freelance Project' && <div className="field"><label htmlFor="project-type">Project Type <span className="optional">(optional)</span></label><select id="project-type" name="projectType" value={data.projectType} onChange={update}><option value="">Select a project type</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select></div>}<div className="field"><label htmlFor="contact-message">Message <span>*</span></label><textarea id="contact-message" name="message" rows={5} placeholder="A little about the role, the project, or what you’re working on…" value={data.message} onChange={update} required minLength={10} maxLength={2000} {...errorProps('message')} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div><button type="submit" className="button button-primary form-submit">Prepare Email <ArrowRight size={17} /></button><p className="form-note">This prepares an email draft. You’ll review and send it in your email app. No information is stored by this website.</p>{draft && <div className="draft-ready" role="status"><strong>Your draft is ready to open.</strong><p>Nothing has been sent. Open your email app to review and send your message, or email me directly using the address above.</p><a href={draft} className="text-link">Open email draft <ArrowUpRight size={16} /></a></div>}</form></div></section>;
}
