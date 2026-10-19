import { Code2, Database, Github, Layers, Linkedin } from 'lucide-react';
import { profile } from '../../data/profile';
import { ExternalLink, ResumeButton } from '../ui/Primitives';

const approach = [
  { icon: Layers, title: 'Start with the workflow', text: 'Understand the users, requirements and business context.' },
  { icon: Code2, title: 'Connect the whole stack', text: 'Build clear interfaces with reliable APIs and integrations.' },
  { icon: Database, title: 'Think beyond the release', text: 'Debug, maintain and refine the software people depend on.' },
];

export default function About() {
  return <section id="about" tabIndex={-1} className="section about-section">
    <div className="container about-layout">

      <div className="about-copy">
        <p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curious by nature.<br /><span className="muted-title">Practical by approach.</span></h2>
        {profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className="button-row"><ResumeButton /><ResumeButton download /><ExternalLink href={profile.github} className="social-button"><Github size={19} />GitHub</ExternalLink><ExternalLink href={profile.linkedin} className="social-button"><Linkedin size={19} />LinkedIn</ExternalLink></div>
      </div>
      <aside className="approach-panel" aria-labelledby="approach-title">
        <p className="eyebrow">MY APPROACH</p><h3 id="approach-title">Understand the problem.<br />Build something useful.</h3>
        {approach.map(({ icon: Icon, title, text }) => <div className="approach-item" key={title}><Icon size={22} aria-hidden="true" /><div><h4>{title}</h4><p>{text}</p></div></div>)}
        <p className="approach-status"><span className="status-dot" />Always learning. Always building.</p>
      </aside>
    </div>
  </section>;
}
