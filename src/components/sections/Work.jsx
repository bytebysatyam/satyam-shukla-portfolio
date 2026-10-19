import { ArrowRight, ArrowUpRight, Braces, Check, Github, Hand, LayoutDashboard, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { assetUrl } from '../../lib/assets';
import { ExternalLink, Screenshot, SectionHeading, Tags } from '../ui/Primitives';

function WorkflowVisual() {
  return <div className="workflow-visual" role="img" aria-label="Illustrative diagram connecting product discovery, buyer enquiries, lead handling, quotations and payments">
    <div className="mock-browser" aria-hidden="true"><span /><span /><span /><div>Business workflow / overview</div><Braces size={15} /></div>
    <div className="workflow-body" aria-hidden="true">
      <div className="mock-sidebar"><span className="mock-logo">ito<span>.</span></span>{[LayoutDashboard, Braces, Hand, Check].map((Icon, i) => <span key={i} className={i === 0 ? 'mock-nav active' : 'mock-nav'}><Icon size={15} /></span>)}</div>
      <div className="workflow-canvas">
        <div className="workflow-title"><span>Connected business journeys</span><span className="live-pill">WORKFLOW</span></div>
        <div className="workflow-nodes">
          <div className="workflow-node"><span className="node-icon"><LayoutDashboard size={18} /></span><strong>Product discovery</strong><span>Business & product pages</span></div><div className="node-connector" />
          <div className="workflow-node"><span className="node-icon"><Braces size={18} /></span><strong>Buyer enquiry</strong><span>Structured requirements</span></div><div className="node-connector" />
          <div className="workflow-node accent-node"><span className="node-icon"><Check size={18} /></span><strong>Lead → quotation → payment</strong><span>Connected operational workflows</span></div>
        </div><div className="workflow-foot"><span>REACT</span><span>REST APIs</span><span>MONGODB</span></div>
      </div>
    </div><p className="illustration-label">ILLUSTRATIVE WORKFLOW · CONTRIBUTION OVERVIEW</p>
  </div>;
}

export default function Work() {
  const flagship = projects[0];
  const cover = flagship.screenshots.find(shot => assetUrl(shot.path));
  return <section id="work" tabIndex={-1} className="section work-section">
    <div className="container">
      <SectionHeading label="PROJECTS & CONTRIBUTIONS" title={<>Selected Work<span className="accent-dot">.</span></>} action={<ExternalLink href={profile.github} className="text-link">Explore GitHub <Github size={16} /></ExternalLink>}>Production-oriented projects focused on business workflows, usability, integrations and real-world implementation.</SectionHeading>
      <article className="flagship-card">
        <div className="flagship-copy">
          <span className="project-kicker"><span />PRODUCTION EXPERIENCE <span className="kicker-line" /> FEATURED</span>
          <h3>{flagship.name}</h3><h4>{flagship.title}</h4><p>{flagship.summary}</p><Tags items={flagship.tags} />
          <div className="project-role"><span>MY ROLE</span>{flagship.role}</div>
          <div className="button-row"><ExternalLink href={flagship.live} className="button button-primary">Visit Live Website</ExternalLink><Link className="text-link" to="/work/india-trade-overseas">Explore the case study <ArrowUpRight size={18} /></Link></div>
          <p className="proprietary-note">Source code is proprietary and is not publicly available.</p>
        </div>
        <div className="flagship-visual">{cover ? <Screenshot {...cover} /> : <WorkflowVisual />}<div className="flagship-bottom"><span>Business workflows, connected.</span><MoveUpRight size={22} aria-hidden="true" /></div></div>
      </article>
      <div className="supporting-projects">
        {projects.slice(1).filter(project => project.enabled !== false).map((project, i) => <article className="project-card" key={project.id}>
          <div className={`project-preview preview-${project.id}`}><Screenshot path={project.screenshot} label={project.name} alt={project.visualAlt} caption={project.visualLabel} note={project.visualNote} /><span className="project-index" aria-hidden="true">0{i + 2}</span></div>
          <div className="project-card-body">
            <p className="eyebrow">{project.category}</p><h3>{project.name}</h3><h4>{project.title}</h4><p>{project.summary}</p><Tags items={project.tags} />
            <details><summary>Explore implementation <ArrowRight size={16} aria-hidden="true" /></summary>
              {project.details?.map(detail => <div className="project-detail" key={detail.title}><h5>{detail.title}</h5><p>{detail.text}</p></div>)}
              <ul className="detail-list">{project.features?.map(feature => <li key={feature}>{feature}</li>)}</ul>
            </details>
            {!project.proprietary && project.repo && <ExternalLink href={project.repo} className="text-link">Source code <Github size={16} /></ExternalLink>}
            {project.live && <ExternalLink href={project.live} className="text-link">View project</ExternalLink>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
