import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { ExternalLink, ResumeButton } from '../ui/Primitives';

const links = ['Work', 'Experience', 'Services', 'Skills', 'About', 'Contact'];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    if (!location.hash) { window.scrollTo(0, 0); return; }
    const timer = setTimeout(() => {
      const section = document.getElementById(location.hash.slice(1));
      section?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      section?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/') { setActive(''); return; }
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-15% 0px -65% 0px' });
    links.forEach(label => { const section = document.getElementById(label.toLowerCase()); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => navRef.current?.querySelector('a')?.focus(), 0);
    function close(returnFocus = false) { setMenuOpen(false); if (returnFocus) menuRef.current?.focus(); }
    function outside(event) { if (!navRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) close(); }
    function keyboard(event) {
      if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      if (event.key !== 'Tab' || document.querySelector('dialog[open]')) return;
      const focusable = [menuRef.current, ...navRef.current.querySelectorAll('a, button')];
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    function resize() { if (window.innerWidth > 700) close(); }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keyboard);
    window.addEventListener('resize', resize);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keyboard);
      window.removeEventListener('resize', resize);
    };
  }, [menuOpen]);

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label={`${profile.name} home`}><span className="brand-mark" aria-hidden="true">s.</span><span>{profile.name}<span className="brand-dot">.</span></span></Link>
        <nav ref={navRef} id="main-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
          {links.map(label => <Link key={label} to={`/#${label.toLowerCase()}`} aria-current={active === label.toLowerCase() ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          <ResumeButton className="button button-primary nav-resume" onOpen={() => setMenuOpen(false)} onClose={() => { if (window.innerWidth <= 700) menuRef.current?.focus(); }} />
        </nav>
        <button ref={menuRef} className="icon-button menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    {menuOpen && <div className="menu-backdrop" aria-hidden="true" />}
    <main id="main" tabIndex={-1}><Outlet /></main>
    <footer className="footer">
      <div className="container footer-top">
        <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true">s.</span><span>{profile.name}<span className="brand-dot">.</span></span></Link>
        <p>Thoughtful software. Practical solutions.</p>
        <div className="social-links"><ExternalLink href={profile.github}><Github size={17} />GitHub</ExternalLink><ExternalLink href={profile.linkedin}><Linkedin size={17} />LinkedIn</ExternalLink></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><ExternalLink href={profile.repository}>Portfolio source</ExternalLink><Link to="/#contact">Let’s work together <ArrowUpRight size={14} /></Link></div>
    </footer>
  </>;
}
