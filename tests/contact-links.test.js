import assert from 'node:assert/strict';
import test from 'node:test';
import { buildContactLinks, contactLinks, profile } from '../src/data/profile.js';

test('both supplied numbers have calling and WhatsApp actions', () => {
  assert.deepEqual(contactLinks.phones.map(phone => phone.call), ['tel:+919670821668', 'tel:+918957879657']);
  assert.deepEqual(contactLinks.phones.map(phone => new URL(phone.whatsapp).pathname), ['/919670821668', '/918957879657']);
  for (const phone of contactLinks.phones) {
    assert.equal(new URL(phone.whatsapp).searchParams.get('text'), profile.whatsappMessage);
  }
});

test('missing or empty contact numbers never create empty actions', () => {
  for (const phones of [undefined, null, [], [null, { number: '' }]]) {
    assert.deepEqual(buildContactLinks({ phones }).phones, []);
  }
});

test('dialing and WhatsApp strip display punctuation without losing country code', () => {
  const [phone] = buildContactLinks({ phones: [{ number: '+91 96708 21668' }], whatsappMessage: 'Hello & welcome' }).phones;
  assert.equal(phone.call, 'tel:+919670821668');
  assert.equal(new URL(phone.whatsapp).pathname, '/919670821668');
  assert.equal(new URL(phone.whatsapp).searchParams.get('text'), 'Hello & welcome');
});
