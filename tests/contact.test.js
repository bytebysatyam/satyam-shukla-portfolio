import assert from 'node:assert/strict';
import test from 'node:test';
import { createMailto, validateContact } from '../src/lib/contact.js';

const valid = { name: 'Alex & Co', email: 'alex@example.com', reason: 'Job Opportunity', projectType: '', message: 'Let’s discuss a software role.\nA second line & some details.' };
test('requires a name, valid email, known reason and useful message', () => {
  assert.deepEqual(Object.keys(validateContact({ name: ' ', email: 'bad@', reason: 'unknown', message: 'short' })), ['name', 'email', 'reason', 'message']);
  assert.deepEqual(validateContact(valid), {});
});
test('email draft safely encodes user content and preserves line breaks', () => {
  const draft = createMailto(valid, 'owner@example.com');
  const url = new URL(draft);
  assert.equal(url.pathname, 'owner@example.com');
  assert.equal(url.searchParams.get('subject'), 'Job Opportunity — Alex & Co');
  assert.ok(url.searchParams.get('body').includes(valid.message));
  assert.ok(!url.searchParams.get('body').includes('Project type:'));
});
test('project type appears only for freelance enquiries', () => {
  const freelance = new URL(createMailto({ ...valid, reason: 'Freelance Project', projectType: 'Lead / CRM System' }, 'owner@example.com'));
  assert.ok(freelance.searchParams.get('body').includes('Project type: Lead / CRM System'));
  const hiring = new URL(createMailto({ ...valid, projectType: 'Lead / CRM System' }, 'owner@example.com'));
  assert.ok(!hiring.searchParams.get('body').includes('Project type:'));
});
