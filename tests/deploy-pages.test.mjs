import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');

test('publishes every root JavaScript asset referenced by the homepage', () => {
  assert.match(workflow, /cp index\.html styles\.css script\.js cursor\.js \.nojekyll _site\//);
});

test('builds and publishes the review hub at the owned review route', () => {
  assert.match(workflow, /working-directory:\s*review[\s\S]*npm ci[\s\S]*npm run build/);
  assert.match(workflow, /mkdir -p _site\/review/);
  assert.match(workflow, /cp -R review\/dist\/\. _site\/review\//);
});
