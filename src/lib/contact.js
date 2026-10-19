export const reasons = ['Job Opportunity', 'Freelance Project', 'Collaboration', 'Technical Discussion', 'Other'];
export const projectTypes = ['Business Website', 'Website Redesign', 'Full Stack Application', 'Lead / CRM System', 'Automation / Integration', 'Maintenance / Improvements'];
export function validateContact(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!reasons.includes(data.reason)) errors.reason = 'Please choose a reason for contacting me.';
  if (data.message.trim().length < 10) errors.message = 'Please include at least 10 characters about your enquiry.';
  return errors;
}
export function createMailto(data, email) {
  const subject = `${data.reason} — ${data.name.trim()}`;
  const body = [`Name: ${data.name.trim()}`, `Email: ${data.email.trim()}`, `Reason: ${data.reason}`, data.reason === 'Freelance Project' && data.projectType ? `Project type: ${data.projectType}` : '', '', data.message.trim()].filter(line => line !== false).join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
