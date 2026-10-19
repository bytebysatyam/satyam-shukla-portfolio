import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SEO from './components/ui/SEO';
const ProjectCaseStudy = lazy(() => import('./pages/ProjectCaseStudy'));

function NotFound() {
  return <div className="container not-found"><SEO title="Page not found | Satyam Shukla" description="Return to Satyam Shukla’s portfolio to explore projects, experience and contact details." /><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>Let’s get you back<br />to the useful stuff.</h1><Link className="button button-primary" to="/">Back to the portfolio</Link></div>;
}
export default function App() {
  return <Suspense fallback={<div className="route-loading" role="status">Opening case study…</div>}><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="work/india-trade-overseas" element={<ProjectCaseStudy />} /><Route path="*" element={<NotFound />} /></Route></Routes></Suspense>;
}
