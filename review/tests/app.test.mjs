import test from 'node:test';
import assert from 'node:assert/strict';
import { createActionEvent, shareHub } from '../src/review.mjs';

test('uses native share before clipboard fallback', async () => {
  const calls = [];
  const result = await shareHub({
    navigatorObject: { share: async (payload) => calls.push(payload) },
    clipboard: null,
    url: 'https://www.thebsclub.ch/review/'
  });
  assert.equal(result, 'shared');
  assert.equal(calls[0].url, 'https://www.thebsclub.ch/review/');
});

test('copies when native share is unavailable and returns manual when both fail', async () => {
  let copied = '';
  assert.equal(await shareHub({
    navigatorObject: {},
    clipboard: { writeText: async (value) => { copied = value; } },
    url: 'https://www.thebsclub.ch/review/'
  }), 'copied');
  assert.equal(copied, 'https://www.thebsclub.ch/review/');
  assert.equal(await shareHub({
    navigatorObject: {},
    clipboard: null,
    url: 'https://www.thebsclub.ch/review/'
  }), 'manual');
});

test('creates an aggregate event without personal data', () => {
  assert.deepEqual(createActionEvent('google_review', 'in_store'), {
    event: 'review_hub_action',
    action_name: 'google_review',
    qr_source: 'in_store'
  });
});
