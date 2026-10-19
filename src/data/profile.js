export const profile = {
  name: 'Satyam Shukla',
  title: 'Full Stack Developer',
  positioning: 'Full Stack Developer | Business Websites | Web Applications | Lead Systems | Automation',
  email: 'shuklasatyam48890@gmail.com',
  github: 'https://github.com/bytebysatyam',
  linkedin: 'https://www.linkedin.com/in/satyamshukla10/',
  phones: [
    { number: '+919670821668', display: '+91 96708 21668' },
    { number: '+918957879657', display: '+91 89578 79657' },
  ], // Each configured number supports both calls and WhatsApp.
  whatsappMessage: 'Hi Satyam, I came across your portfolio and would like to discuss an opportunity/project.',
  website: 'https://satyam-shukla-portfolio-jet.vercel.app',
  repository: 'https://github.com/bytebysatyam/satyam-shukla-portfolio',
  photo: '/src/assets/profile/profile.jpg',
  resume: '/resume/Satyam-Shukla-Resume.pdf',
  availability: 'Open to Full-Time Opportunities & Freelance Projects',
  about: [
    "I'm Satyam Shukla, a Full Stack Developer focused on building production-oriented web applications, business websites, lead-management systems and practical automation solutions.",
    'My work includes frontend and backend development, APIs, databases, CRM workflows, quotation systems, payment flows, analytics, SEO improvements, debugging and deployment.',
    'I enjoy working on projects where technology solves a real business or user problem. I am comfortable moving between implementation, debugging, integration and requirement understanding.',
    'My goal is to build reliable, maintainable software while continuously improving my engineering, product and customer-facing skills.',
    'I am open to both full-time software opportunities and selected freelance projects.',
  ],
};

export function buildContactLinks(config) {
  return {
    email: config.email ? `mailto:${config.email}` : '',
    phones: (config.phones || []).filter(phone => phone?.number).map(phone => ({
      number: phone.number,
      display: phone.display || phone.number,
      call: `tel:${phone.number.replace(/[^+\d]/g, '')}`,
      whatsapp: `https://wa.me/${phone.number.replace(/\D/g, '')}?text=${encodeURIComponent(config.whatsappMessage || '')}`,
    })),
  };
}

export const contactLinks = buildContactLinks(profile);

export const siteMetadata = {
  title: `${profile.name} | ${profile.title} | React, Node.js & Web Applications`,
  description: 'Full Stack Developer experienced in React, Node.js, APIs, databases, CRM workflows, production debugging, deployment and business-focused web applications.',
  caseTitle: `India Trade Overseas Case Study | ${profile.name}`,
  caseDescription: 'Full stack contributions to a B2B trade platform: React interfaces, Node.js APIs, MongoDB data workflows, lead management, integrations and production debugging.',
};

export const credentials = [
  { name: 'India Trade Overseas', detail: 'Full Stack Development', file: '' },
  { name: 'THDC India Limited', detail: 'IT Department Training', file: '' },
  { name: 'ExcelR', detail: 'Java Full Stack Training', file: '' },
  // Add verified certificates here: { name: 'Certificate title', detail: 'Issuer', file: '/certificates/file.pdf' }
];

export const additionalCertificate = { name: '', detail: '', file: '' }; // Editable placeholder; hidden until named.
