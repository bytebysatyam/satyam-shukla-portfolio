import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { profile } from '../../data/profile';
import { ExternalLink, Portrait, ResumeButton } from '../ui/Primitives';

export default function About() {
  return <section id="about" className="section about-section"><div className="container about-layout"><div className="about-portrait"><Portrait compact /><div className="about-caption"><span className="status-dot" /><span>Always learning. Always building.</span><ArrowUpRight size={19} /></div></div><div className="about-copy"><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curious by nature.<br /><span className="muted-title">Practical by approach.</span></h2>{profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="button-row"><ResumeButton /><ExternalLink href={profile.github} className="social-button"><Github size={19} />GitHub</ExternalLink><ExternalLink href={profile.linkedin} className="social-button"><Linkedin size={19} />LinkedIn</ExternalLink></div></div></div></section>;
}
