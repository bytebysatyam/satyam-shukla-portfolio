import Hero from '../components/Hero';
import Work from '../components/sections/Work';
import Experience from '../components/sections/Experience';
import { Services, Skills } from '../components/sections/Capabilities';
import About from '../components/sections/About';
import Contact from '../components/sections/Contact';
import SEO from '../components/ui/SEO';

export default function Home() {
  return <><SEO title="Satyam Shukla | Full Stack Developer | React, Node.js & Web Applications" description="Full Stack Developer experienced in React, Node.js, APIs, databases, CRM workflows, production debugging, deployment and business-focused web applications." /><Hero /><Work /><Experience /><Services /><Skills /><About /><Contact /></>;
}
