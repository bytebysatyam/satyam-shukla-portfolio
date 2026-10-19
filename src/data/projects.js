export const projects = [
  {
    id: 'india-trade-overseas', name: 'India Trade Overseas', category: 'Production experience', title: 'B2B Trade Platform, Lead Workflows & Business Systems', role: 'Full Stack Developer',
    summary: 'Worked on a production-oriented B2B platform supporting product discovery, buyer enquiries, lead management, quotation workflows, payments, CRM-related processes, analytics, SEO improvements and operational web workflows.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    tech: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git', 'Deployment', 'SEO', 'Analytics', 'CRM workflows', 'Payment workflows'],
    repo: '',
    live: 'https://www.indiatradeoverseas.com/', // Official company website, supplied by Satyam.
    proprietary: true,
    screenshots: ['home', 'product', 'lead', 'crm', 'quotation', 'payment', 'mobile'].map(name => ({
      label: { home: 'Platform homepage', product: 'Product discovery', lead: 'Buyer enquiry', crm: 'CRM workflow', quotation: 'Quotation workflow', payment: 'Payment journey', mobile: 'Mobile experience' }[name],
      path: `/src/assets/projects/ito/${name}-placeholder.jpg`,
    })), // Only existing, approved images render; no missing screenshot gallery is shown.
    sections: [
      { title: 'Overview', text: 'A business-facing B2B platform with interconnected product, enquiry, lead and payment journeys. This case study describes my contributions as a Full Stack Developer.' },
      { title: 'Business Context', text: 'Buyers need to discover relevant products, communicate requirements and move through clear commercial workflows. Business teams need structured information to handle enquiries, quotations and follow-up.' },
      { title: 'My Role', text: 'Contributed across frontend implementation, backend/API integration, business workflows, debugging and deployment. Work included code review and refining production-facing journeys.' },
      { title: 'Problem / Requirement', text: 'Connect buyer-facing interfaces with structured lead handling and operational systems, while keeping product pages, forms and payment journeys usable across devices.' },
      { title: 'What I Worked On', items: ['Buyer enquiry flows and structured requirement forms.', 'Quotation workflows and CRM-related lead management.', 'Payment journeys and business conversion paths.', 'Analytics-related implementation and SEO improvements.'] },
      { title: 'Frontend Contribution', items: ['Developed React components and responsive UI.', 'Implemented business and product pages.', 'Worked on form flows, user interactions and frontend/backend API integration.'] },
      { title: 'Backend & API Contribution', items: ['Worked with Node.js / Express APIs and backend workflow integration.', 'Contributed to data persistence and lead processing.', 'Debugged APIs and investigated integration issues.'] },
      { title: 'Data & Workflow Handling', text: 'Worked with MongoDB-based business data workflows, including lead/contact persistence where relevant. Connected structured enquiry inputs to backend processing and CRM-related operational flows.' },
      { title: 'Integrations', items: ['Frontend/backend API connections.', 'CRM-related workflows and payment integration.', 'Analytics-related implementation across business journeys.'] },
      { title: 'Debugging & Production Work', text: 'Used Git-based development and code review, investigated frontend/backend issues, contributed to deployment and production issue resolution, and refined workflows as requirements became clearer.' },
      { title: 'Key Engineering Learnings', items: ['Consider the complete journey from user input to stored data and operational follow-up.', 'Investigate problems across interface, API and data boundaries.', 'Keep implementation decisions grounded in business requirements and maintainability.'] },
    ],
  },
  {
    id: 'thdc', name: 'THDC India Limited', category: 'Training project', title: 'Web-Based Complaint & Leave Management System',
    summary: 'A database-backed web application developed during IT Department training, connecting employee requests with admin responses and approvals.',
    tags: ['ASP.NET Core MVC', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'IIS'], repo: '', live: '',
    screenshot: '/src/assets/projects/thdc/ui-placeholder.jpg',
    visualLabel: 'Illustrative UI reconstruction',
    visualAlt: 'Generated UI reconstruction showing complaint submission, complaint tracking and leave-management workflows; not a historical THDC screenshot.',
    visualNote: 'Generated representation of the workflow. Shown figures are illustrative, not project metrics.',
    role: 'IT Department Summer Trainee / Web Application Project',
    details: [
      { title: 'Problem', text: 'Provide a structured workflow for employee complaints and leave requests, with separate employee and admin interactions.' },
      { title: 'Solution & workflow', text: 'Developed registration/login, session-based access, complaint submission, My Complaints, admin responses, leave applications, approvals and a dashboard connected to MySQL.' },
      { title: 'My role', text: 'Developed the web application during IT Department summer training using ASP.NET Core MVC, HTML, CSS and JavaScript, with database integration and IIS deployment exposure.' },
      { title: 'What I learned', text: 'Connected CRUD operations with role-based workflows, session handling, database persistence and deployment requirements.' },
    ],
    features: ['Login/Register, session handling and role-based access', 'Complaint submission, My Complaints and admin response', 'Leave application, approval and dashboard', 'MySQL-backed CRUD and internal workflows', 'Admin/user separation and IIS deployment experience'],
  },
  {
    id: 'gesture-mouse', name: 'Hand Gesture Virtual Mouse', category: 'Computer vision project', title: 'A different way to interact',
    summary: 'A computer-vision project enabling cursor and system interactions through real-time hand gestures.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'PyAutoGUI'], repo: '', live: '',
    screenshot: '/src/assets/projects/gesture-mouse/demo-placeholder.jpg',
    visualLabel: 'Project demo visual',
    visualAlt: 'Generated illustration of hand tracking and cursor interaction for the Hand Gesture Virtual Mouse project, not a recording of a live demo.',
    visualNote: 'Generated illustration, not a captured live demonstration.',
    features: ['Real-time hand tracking and gesture detection', 'Cursor movement, click interaction and gesture-triggered interaction', 'Notepad trigger through a configured gesture', 'Computer vision processing and library integration', 'Debugging and dependency/version troubleshooting'],
  },
  // Editable future project: add only verified details, then set enabled to true.
  { id: 'next-project', enabled: false, name: 'Full Stack Web Application', category: 'Project placeholder', summary: 'Details will be added when the project is ready to share.', tags: [], repo: '', live: '' },
];
