import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const homepage = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const homepageCss = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const stationHtml = readFileSync(new URL('../music/index.html', import.meta.url), 'utf8');
const stationScript = readFileSync(new URL('../music/app.js', import.meta.url), 'utf8');
const stationCss = readFileSync(new URL('../music/station-theme.css', import.meta.url), 'utf8');
const pagesWorkflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');

test('introduces Global Music Radio as a prominent branded homepage section', () => {
  assert.match(homepage, /<section class="section music-station-teaser" id="music">/);
  assert.match(homepage, /href="music\/" target="_blank" rel="noopener">Open Global Music Radio/);
  assert.match(homepage, /href="#music">Music<\/a>/);
  assert.match(homepage, /126 secure live stations from 38 countries/);
  assert.doesNotMatch(homepage, /<iframe[^>]+music/i);
});

test('uses the search-friendly The B’s Club Global Music Radio name throughout the station', () => {
  assert.match(stationHtml, /<title>Free Global Music Radio \| The B's Club Interlaken<\/title>/);
  assert.match(stationHtml, /<h1>The B's Club <span class="music-word">Global Music<\/span> <em>Radio<\/em><\/h1>/);
  assert.match(stationHtml, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/music\/"\/>/);
  assert.match(stationHtml, /Back to café &amp; food/);
  assert.doesNotMatch(stationHtml, /Zetaku|Kimi|sdk-seed/i);
  assert.doesNotMatch(stationScript, /Zetaku|Kimi/i);
  assert.doesNotMatch(stationCss, /Zetaku|Kimi/i);
});

test('publishes a substantial HTTPS-only playable directory on the secure café site', () => {
  const stationJson = stationHtml.match(/const STATIONS = (\[[\s\S]*?\]);\s*<\/script>/)?.[1];
  assert.ok(stationJson, 'expected the embedded station directory');
  const stations = JSON.parse(stationJson);
  const secureStations = stations.filter((station) => station.url.startsWith('https://'));
  const secureCountries = new Set(secureStations.map((station) => station.cc));
  assert.ok(secureStations.length >= 120, `expected at least 120 secure streams, found ${secureStations.length}`);
  assert.ok(secureCountries.size >= 35, `expected at least 35 secure countries, found ${secureCountries.size}`);
  assert.match(stationScript, /const SECURE_STATIONS = STATIONS\.filter/);
  assert.match(stationScript, /filtered: SECURE_STATIONS\.slice\(\)/);
  assert.match(stationScript, /setStations\(SECURE_STATIONS\)/);
});

test('keeps playback user initiated and supports background media controls', () => {
  assert.match(stationScript, /const audio = new Audio\(\)/);
  assert.match(stationScript, /audio\.preload = 'none'/);
  assert.doesNotMatch(stationHtml, /autoplay/);
  assert.match(stationScript, /navigator\.mediaSession\.metadata = new MediaMetadata/);
  assert.match(stationScript, /setActionHandler\('nexttrack'/);
  assert.match(stationScript, /document\.title = st\.name \+ " · The B's Club Global Music Radio"/);
});

test('matches the café palette and adapts both entry section and station to mobile', () => {
  assert.match(homepageCss, /\.music-teaser-grid\s*\{[^}]*display:\s*grid/);
  assert.match(homepageCss, /\.music-launch\s*\{[^}]*background:\s*var\(--sun\)/);
  assert.match(homepageCss, /@media\s*\(max-width:\s*980px\)[\s\S]*\.music-teaser-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(stationCss, /--z-basalt:\s*#0D3028/);
  assert.match(stationCss, /--z-mai:\s*#F5C84B/);
  assert.match(stationHtml, /@media \(max-width:900px\)/);
});

test('includes the music application in the GitHub Pages artifact', () => {
  assert.match(pagesWorkflow, /cp -R music _site\/music/);
});
