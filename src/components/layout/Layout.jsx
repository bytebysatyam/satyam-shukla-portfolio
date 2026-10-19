import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { ExternalLink, ResumeButton } from '../ui/Primitives';

const links = ['Work', 'Experience', 'Services', 'Skills', 'About', 'Contact'];
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) {
      const timer = setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' }), 50);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    function escape(event) { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuRef.current?.focus(); } }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);
  return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><div className="container nav-inner"><Link className="brand" to="/" aria-label="Satyam Shukla home"><span className="brand-mark">s.</span><span>Satyam Shukla<span className="brand-dot">.</span></span></Link><nav id="main-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{links.map(label => <Link key={label} to={`/#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{label}</Link>)}<ResumeButton className="button button-primary nav-resume" /></nav><button ref={menuRef} className="icon-button menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header><main id="main" tabIndex={-1}><Outlet /></main><footer className="footer"><div className="container footer-top"><Link className="brand" to="/"><span className="brand-mark">s.</span><span>Satyam Shukla<span className="brand-dot">.</span></span></Link><p>Thoughtful software. Practical solutions.</p><div className="social-links"><ExternalLink href={profile.github}><Github size={17} />GitHub</ExternalLink><ExternalLink href={profile.linkedin}><Linkedin size={17} />LinkedIn</ExternalLink></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Satyam Shukla</span><span>Built with React. Made with intention.</span><Link to="/#contact">Let’s work together <ArrowUpRight size={14} /></Link></div></footer></>;
}
