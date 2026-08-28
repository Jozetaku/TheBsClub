import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = [
  '../index.html',
  '../en/articles/autumn-interlaken/index.html',
  '../de/artikel/herbst-interlaken/index.html',
  '../README.md'
];
const contents = files.map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));

test('publishes the confirmed public telephone everywhere', () => {
  for (const content of contents) {
    assert.doesNotMatch(content, /(?:\+41 76 226 27 22|\+41762262722)/);
  }
  assert.match(contents[0], /tel:\+41767742027/);
  assert.match(contents[0], /\+41 76 774 20 27/);
  assert.match(contents[1], /tel:\+41767742027/);
  assert.match(contents[2], /tel:\+41767742027/);
});

test('publishes daily 11:00–20:00 hours everywhere', () => {
  for (const content of contents) {
    assert.doesNotMatch(content, /11:00[–-]19:00|to 19:00|until 19:00|"closes":\s*"19:00"/);
  }
  assert.match(contents[0], /11:00[–-]20:00/);
  assert.match(contents[0], /"closes":\s*"20:00"/);
  assert.match(contents[1], /11:00[–-]20:00/);
  assert.match(contents[2], /11:00[–-]20:00/);
});
