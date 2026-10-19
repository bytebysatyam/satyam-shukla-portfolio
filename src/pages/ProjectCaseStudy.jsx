import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { siteMetadata } from '../data/profile';
import { assetUrl } from '../lib/assets';
import { ExternalLink, Screenshot, Tags } from '../components/ui/Primitives';
import SEO from '../components/ui/SEO';

export default function ProjectCaseStudy() {
  const project = projects[0];
  const screenshots = project.screenshots.filter(shot => assetUrl(shot.path));
  return <>
    <SEO title={siteMetadata.caseTitle} description={siteMetadata.caseDescription} path="/work/india-trade-overseas" />
    <div className="case-hero"><div className="container">
      <Link className="text-link back-link" to="/#work"><ArrowLeft size={16} aria-hidden="true" />Back to selected work</Link>
      <p className="eyebrow">CASE STUDY / PRODUCTION EXPERIENCE</p><h1>{project.name}<span className="accent-dot">.</span></h1>
      <p className="case-subtitle">{project.title}</p><p className="case-summary">{project.summary}</p>
      <div className="case-facts"><div><span>MY ROLE</span><strong>{project.role}</strong></div><div><span>FOCUS</span><strong>Business workflows & integrations</strong></div><div><span>CONTEXT</span><strong>Production-oriented B2B platform</strong></div></div>
      <Tags items={project.tags} />
      <div className="case-live-link"><ExternalLink href={project.live} className="button button-primary">Visit Live Website</ExternalLink><p className="proprietary-note">Source code is proprietary and is not publicly available.</p></div>
    </div></div>
    <div className="container case-layout">
      <aside className="case-sidebar"><p className="eyebrow">IN THIS CASE STUDY</p><nav aria-label="Case study contents">
        {project.sections.map((section, i) => <a href={`#section-${i}`} key={section.title}>{section.title}</a>)}<a href="#tech-stack">Tech Stack</a>{screenshots.length > 0 && <a href="#screenshots">Screenshots</a>}
      </nav></aside>
      <div className="case-content">
        {project.sections.map((section, i) => <section className="case-section" id={`section-${i}`} key={section.title}><span className="case-section-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h2>{section.title}</h2>{section.text && <p>{section.text}</p>}{section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}
        <section id="tech-stack" className="case-section"><p className="eyebrow">TOOLS & PRACTICES</p><h2>Tech Stack</h2><Tags items={project.tech} /></section>
        {screenshots.length > 0 && <section id="screenshots" className="case-section"><h2>Screenshots</h2><div className="case-screenshots">{screenshots.map(shot => <Screenshot key={shot.path} {...shot} />)}</div></section>}
        <div className="case-cta"><p className="eyebrow">HAVE A SIMILAR CHALLENGE?</p><h2>Let’s talk about your next build.</h2><Link to="/#contact" className="button button-primary">Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </div>
  </>;
}
