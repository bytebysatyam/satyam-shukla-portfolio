import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Copy, Github, Linkedin, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { contactLinks, profile } from '../../data/profile';
import { createMailto, projectTypes, reasons, validateContact } from '../../lib/contact';
import { ExternalLink } from '../ui/Primitives';

const empty = { name: '', email: '', reason: '', projectType: '', message: '' };

export default function Contact() {
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState({});
  const [draft, setDraft] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const formRef = useRef(null);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  function choose(reason) {
    setData(current => ({ ...current, reason })); setDraft('');
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    formRef.current?.querySelector('input')?.focus({ preventScroll: true });
  }
  function update(event) {
    const { name, value } = event.target;
    setData(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined }));
    setDraft('');
  }
  function submit(event) {
    event.preventDefault();
    const validation = validateContact(data); setErrors(validation);
    if (Object.keys(validation).length) {
      formRef.current?.elements.namedItem(Object.keys(validation)[0])?.focus();
      return;
    }
    setDraft(createMailto(data, profile.email));
  }
  async function copy() {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus('Email address copied.');
      copyTimer.current = setTimeout(() => setCopyStatus(''), 2500);
    } catch { setCopyStatus('Please select and copy the email address above.'); }
  }
  const errorProps = name => ({ 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `${name}-error` : undefined });

  return <section id="contact" tabIndex={-1} className="section contact-section"><div className="container contact-layout">
    <div className="contact-copy">
      <p className="eyebrow">LET’S START A CONVERSATION</p><h2>Let’s Build<br />Something <span>Useful.</span></h2>
      <p>Whether you’re hiring for a software role or need help building a business web solution, feel free to reach out.</p>
      <div className="contact-paths">
        <div><BriefcaseBusiness size={21} aria-hidden="true" /><div><h3>For Hiring / Opportunities</h3><button className="text-link" onClick={() => choose('Job Opportunity')}>Contact Me <ArrowUpRight size={16} aria-hidden="true" /></button></div></div>
        <div><Send size={21} aria-hidden="true" /><div><h3>For Projects / Freelance</h3><button className="text-link" onClick={() => choose('Freelance Project')}>Discuss a Project <ArrowUpRight size={16} aria-hidden="true" /></button></div></div>
      </div>
      <div className="contact-actions" aria-label="Direct contact options">
        <a href={contactLinks.email} className="button button-primary"><Mail size={17} aria-hidden="true" />Email Me</a>
      </div>
      <div className="email-contact"><span>EMAIL</span><div><a href={contactLinks.email}>{profile.email}</a><button className="icon-button" onClick={copy} aria-label="Copy email address">{copyStatus === 'Email address copied.' ? <Check size={17} /> : <Copy size={17} />}</button></div><span className="copy-status" role="status">{copyStatus}</span></div>
      {contactLinks.phones.length > 0 && <div className="contact-numbers" aria-label="Call or WhatsApp either number">
        {contactLinks.phones.map(phone => <div className="contact-number" key={phone.number}>
          <a className="contact-number-label" href={phone.call}><Phone size={16} aria-hidden="true" />{phone.display}</a>
          <div className="button-row"><a href={phone.call} className="button button-secondary"><Phone size={16} aria-hidden="true" />Call Me<span className="sr-only"> on {phone.display}</span></a><ExternalLink href={phone.whatsapp} className="button button-secondary"><MessageCircle size={16} aria-hidden="true" />WhatsApp<span className="sr-only"> on {phone.display}</span></ExternalLink></div>
        </div>)}
      </div>}
      <div className="social-links"><ExternalLink href={profile.github}><Github size={17} aria-hidden="true" />GitHub</ExternalLink><ExternalLink href={profile.linkedin}><Linkedin size={17} aria-hidden="true" />LinkedIn</ExternalLink></div>
    </div>
    <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
      <div className="form-heading"><h3>Tell me what you have in mind.</h3><Mail size={21} aria-hidden="true" /></div><p>New opportunity, a project idea, or just a conversation. Fields marked * are required.</p>
      <div className="form-row">
        <div className="field"><label htmlFor="contact-name">Name *</label><input id="contact-name" name="name" autoComplete="name" placeholder="Your name" value={data.name} onChange={update} required maxLength={100} {...errorProps('name')} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
        <div className="field"><label htmlFor="contact-email">Email *</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={data.email} onChange={update} required maxLength={254} {...errorProps('email')} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
      </div>
      <div className="field"><label htmlFor="contact-reason">Reason for Contact *</label><select id="contact-reason" name="reason" value={data.reason} onChange={update} required {...errorProps('reason')}><option value="">What brings you here?</option>{reasons.map(reason => <option key={reason}>{reason}</option>)}</select>{errors.reason && <span className="field-error" id="reason-error">{errors.reason}</span>}</div>
      {data.reason === 'Freelance Project' && <div className="field"><label htmlFor="project-type">Project Type <span className="optional">(optional)</span></label><select id="project-type" name="projectType" value={data.projectType} onChange={update}><option value="">Select a project type</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select></div>}
      <div className="field"><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" rows={5} placeholder="A little about the role, the project, or what you’re working on…" value={data.message} onChange={update} required minLength={10} maxLength={2000} {...errorProps('message')} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div>
      <button type="submit" className="button button-primary form-submit">Prepare Email <ArrowRight size={17} aria-hidden="true" /></button>
      <p className="form-note">This prepares an email draft. Review and send it in your email app. No information is stored by this website.</p>
      {draft && <div className="draft-ready" role="status"><strong>Your draft is ready to open.</strong><p>Nothing has been sent. Open your email app to review and send your message, or contact me directly using the email address above.</p><a href={draft} className="text-link">Open email draft <ArrowUpRight size={16} aria-hidden="true" /></a></div>}
    </form>
  </div></section>;
}
