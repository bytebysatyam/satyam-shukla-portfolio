import Hero from '../components/Hero';
import Work from '../components/sections/Work';
import Experience from '../components/sections/Experience';
import { Services, Skills } from '../components/sections/Capabilities';
import About from '../components/sections/About';
import Contact from '../components/sections/Contact';
import SEO from '../components/ui/SEO';
import { siteMetadata } from '../data/profile';

export default function Home() {
  return <><SEO title={siteMetadata.title} description={siteMetadata.description} /><Hero /><Work /><Experience /><Services /><Skills /><About /><Contact /></>;
}
