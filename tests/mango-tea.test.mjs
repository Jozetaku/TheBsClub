import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const german = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const english = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');

test('publishes the approved Bublee Mango Tea asset and canonical copy', () => {
  const asset = '/images/campaign/v2/mango-tea.png';
  assert.ok(existsSync(new URL(`..${asset}`, import.meta.url)));
  assert.match(english, new RegExp(`src="${asset}"[^>]*width="1080"[^>]*height="1350"`));
  assert.match(german, new RegExp(`src="${asset}"[^>]*width="1080"[^>]*height="1350"`));
  assert.match(english, /Golden mango tea with a bright tropical finish and juicy lychee popping boba\./);
  assert.match(german, /Goldener Mango-Tee mit tropisch-frischem Geschmack und saftigen Lychee-Popping-Boba\./);
});
