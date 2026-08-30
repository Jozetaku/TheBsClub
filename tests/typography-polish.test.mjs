import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const home = read('../styles.css');
const article = read('../articles/autumn-interlaken/article.css');
const review = read('../review/src/review.css');
const music = read('../music/station-theme.css');

test('reduces every non-radio H1 by exactly two pixels', () => {
  assert.match(home, /font-size:\s*calc\(clamp\(54px, 6vw, 88px\) - 2px\)/);
  assert.match(home, /font-size:\s*calc\(clamp\(52px, 11\.5vw, 78px\) - 2px\)/);
  assert.match(home, /font-size:\s*calc\(clamp\(45px, 14vw, 62px\) - 2px\)/);

  assert.match(article, /font-size:\s*calc\(clamp\(52px, 7\.1vw, 96px\) - 2px\)/);
  assert.match(article, /font-size:\s*calc\(clamp\(42px, 13vw, 57px\) - 2px\)/);
  assert.match(article, /@media \(max-width: 380px\)[\s\S]*?\.article-hero h1\s*\{[^}]*font-size:\s*37px/);
  assert.match(review, /font-size:\s*calc\(clamp\(48px, 14vw, 76px\) - 2px\)/);
  assert.match(review, /font-size:\s*calc\(clamp\(68px, 9vw, 76px\) - 2px\)/);
});

test('uses relaxed context-specific heading line boxes', () => {
  assert.match(home, /\.hero-copy h1\s*\{[^}]*line-height:\s*\.94/s);
  assert.match(home, /\.hero-tagline\s*\{[^}]*line-height:\s*1\.08/s);
  assert.match(article, /\.article-hero h1\s*\{[^}]*line-height:\s*1\.02/s);
  assert.match(article, /@media \(max-width: 560px\)[\s\S]*?\.article-hero h1\s*\{[^}]*line-height:\s*1\.04/s);
  assert.match(review, /\.welcome h1\s*\{[^}]*line-height:\s*0\.96/s);
});

test('leaves Global Music Radio typography unchanged', () => {
  assert.match(music, /h1 \{ font-size: clamp\(3\.2rem, 8vw, 6\.5rem\);\s+line-height: \.94/);
  assert.doesNotMatch(music, /calc\(clamp\(3\.2rem, 8vw, 6\.5rem\) - 2px\)/);
});
