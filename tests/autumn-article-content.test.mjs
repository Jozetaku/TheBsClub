import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const articlePaths = {
  en: '../en/articles/autumn-interlaken/index.html',
  de: '../de/artikel/herbst-interlaken/index.html'
};

const artworkPath = (filename) => new URL(
  `../articles/autumn-interlaken/${filename}`,
  import.meta.url
);

const readArticle = (locale) => readFileSync(
  new URL(articlePaths[locale], import.meta.url),
  'utf8'
);

const occurrences = (source, pattern) => source.match(pattern)?.length ?? 0;
const attributeValues = (source, attribute) => [
  ...source.matchAll(new RegExp(`\\b${attribute}(?:="([^"]*)")?`, 'g'))
].map((match) => match[1] ?? '');
const sourceUrls = (source) => [
  ...source.matchAll(/<(?:a)\b[^>]*class="source-link"[^>]*href="([^"]+)"/g),
  ...((source.match(/<section class="article-sources"[\s\S]*?<\/section>/)?.[0] ?? '')
    .matchAll(/<a\b[^>]*href="([^"]+)"/g))
].map((match) => match[1]).sort();

test('autumn artwork assets are original self-contained vectors', () => {
  const svgFiles = [
    'interlaken-autumn-map.svg',
    'pack-city.svg',
    'pack-viewpoint.svg',
    'pack-travel.svg'
  ];

  for (const filename of svgFiles) {
    const file = artworkPath(filename);
    assert.ok(existsSync(file), `${filename} should exist`);
    const svg = readFileSync(file, 'utf8');

    assert.match(svg, /<svg\b/i);
    assert.doesNotMatch(svg, /<image\b/i, `${filename} must not embed raster artwork`);
    assert.doesNotMatch(
      svg,
      /(?:href|xlink:href)="(?:https?:|\/\/|data:)|url\(\s*["']?(?:https?:|\/\/|data:)/i,
      `${filename} must not load external content`
    );
    assert.doesNotMatch(svg, /<text\b/i, `${filename} keeps human-readable labels in HTML`);
  }

  const map = readFileSync(artworkPath('interlaken-autumn-map.svg'), 'utf8');
  assert.match(map, /viewBox="0 0 1400 900"/);
  assert.match(map, /#6FAFB5/i, 'the geographic lake blue belongs in the map artwork');
  assert.doesNotMatch(map, /class="roads"/i, 'the illustration must not introduce a road network');
  const larchLeaves = map.match(/<g class="larch-leaves"[\s\S]*?<\/g>/i)?.[0] ?? '';
  assert.match(larchLeaves, /fill="#B78A45"/i, 'the map should include golden larch leaves');
  assert.match(larchLeaves, /fill="#EF725D"/i, 'the map should include coral larch leaves');

  for (const filename of svgFiles.slice(1)) {
    const svg = readFileSync(artworkPath(filename), 'utf8');
    const coldCups = occurrences(svg, /class="cold-cup"/g);
    const sealingLids = occurrences(svg, /class="sealing-lid"/g);
    assert.ok(coldCups > 0, `${filename} should show at least one cold cup`);
    assert.equal(sealingLids, coldCups, `${filename} should visibly seal every cold cup`);
  }
});

test('autumn social artwork is the required 1200 by 630 PNG', () => {
  const file = artworkPath('interlaken-autumn-social.png');
  assert.ok(existsSync(file), 'interlaken-autumn-social.png should exist');
  const png = readFileSync(file);

  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length > 10_000, 'social artwork should contain a rendered composition');
});

test('localized articles preserve the latest official logo and custom cursor shell', () => {
  for (const locale of Object.keys(articlePaths)) {
    const article = readArticle(locale);
    const header = article.match(/<header class="site-header"[\s\S]*?<\/header>/)?.[0] ?? '';
    const footer = article.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0] ?? '';

    assert.match(header, /class="official-logo"/);
    assert.match(header, /src="\/images\/logo-official\.png"/);
    assert.match(footer, /class="footer-logo"/);
    assert.match(footer, /src="\/images\/logo-official\.png"/);
    assert.equal(occurrences(article, /\/images\/logo-official\.png/g), 2);

    assert.match(article, /<script src="\/cursor\.js\?v=20260815-2" defer><\/script>/);
    assert.match(article, /<div class="boba-cursor" id="boba-cursor" aria-hidden="true">/);
    assert.match(article, /class="matcha-cursor-foam"/);
    assert.match(article, /class="matcha-cursor-layer"/);
    assert.match(article, /class="cursor-pearls"/);
  }
});

test('localized maps expose seven independent semantic hotspots', () => {
  const expectedLabels = {
    en: [
      'The B, starting point',
      '1, Höhematte',
      '2, Japanese Garden and former monastery',
      '3, Aare promenade',
      '4, Unterseen old town',
      '5, Harder Kulm',
      '6, Lake Brienz'
    ],
    de: [
      'The B, Ausgangspunkt',
      '1, Höhematte',
      '2, Japanischer Garten und ehemaliges Kloster',
      '3, Aarepromenade',
      '4, Altstadt Unterseen',
      '5, Harder Kulm',
      '6, Brienzersee'
    ]
  };

  for (const locale of Object.keys(articlePaths)) {
    const article = readArticle(locale);
    const map = article.match(/<div class="article-map">[\s\S]*?<\/div>/)?.[0] ?? '';
    const anchors = [...map.matchAll(/<a\b[^>]*class="[^"]*\bmap-hotspot\b[^"]*"[^>]*>/g)]
      .map((match) => match[0]);

    assert.equal(anchors.length, 7);
    assert.match(map, /<img\b[^>]*class="article-map-art"[^>]*alt=""/);
    assert.deepEqual(
      anchors.map((anchor) => anchor.match(/\baria-label="([^"]+)"/)?.[1]),
      expectedLabels[locale]
    );
    for (const anchor of anchors) {
      assert.match(anchor, /style="[^"]*--x:\s*\d+%;\s*--y:\s*\d+%;?"/);
      assert.match(anchor, /href="#(?:directions|place-[^"]+)"/);
    }
  }
});

test('article CSS fulfils the responsive editorial and accessibility contract', () => {
  const file = artworkPath('article.css');
  assert.ok(existsSync(file), 'article.css should exist');
  const css = readFileSync(file, 'utf8');

  assert.doesNotMatch(css, /:root\s*{/, 'article CSS must not add global color variables');
  for (const token of ['ink', 'ink-deep', 'ink-soft', 'cream', 'paper', 'sand', 'gold', 'coral', 'line']) {
    assert.match(css, new RegExp(`var\\(--${token}\\)`), `article CSS should reuse --${token}`);
  }
  assert.doesNotMatch(css, /#6FAFB5/i, 'lake blue must not color article UI controls');

  assert.match(css, /\.editorial-narrow\s*{[^}]*max-width:/s);
  assert.match(css, /\.map-section\s*{[^}]*position:\s*sticky/s);
  assert.match(css, /\.destination:nth-child\(even\)/);
  assert.match(css, /\.destination-number\s*{[^}]*color:\s*var\(--gold\)/s);
  assert.doesNotMatch(
    css,
    /min-height:\s*980px/,
    'the old tall-monitor-only sticky threshold must be removed'
  );
  assert.match(
    css,
    /@media\s*\(min-width:\s*1200px\)\s*and\s*\(min-height:\s*700px\)[\s\S]*?\.journey-layout\s*{[^}]*grid-template-columns:[^}]*}[\s\S]*?\.map-section\s*{[^}]*position:\s*sticky;[^}]*top:\s*clamp\(76px,\s*8vh,\s*94px\);[^}]*padding:\s*28px\s+0\s+24px;[^}]*}[\s\S]*?\.article-map\s*{[^}]*height:\s*clamp\(340px,\s*52vh,\s*500px\);[^}]*aspect-ratio:\s*auto/s,
    'the two-column layout and viewport-sized sticky rail must share one safe media condition'
  );
  assert.match(
    css,
    /@media\s*\(min-width:\s*1200px\)\s*and\s*\(min-height:\s*700px\)[\s\S]*?\.destination-grid\s*{[^}]*grid-template-columns:\s*96px\s+minmax\(0,\s*1fr\);[^}]*}[\s\S]*?\.destination:nth-child\(even\) \.destination-grid\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+96px;[^}]*}[\s\S]*?\.destination-number\s*{[^}]*font-size:\s*80px/s,
    'desktop destinations must use symmetric tracks sized for every 80px numeral pair'
  );
  assert.match(
    css,
    /\.article-hero\s*{[^}]*padding:\s*clamp\(68px,\s*7vw,\s*104px\)\s+0\s+clamp\(74px,\s*7\.5vw,\s*112px\)/s,
    'desktop hero spacing must preserve impact without consuming a full viewport'
  );
  assert.match(
    css,
    /\.article-section\s*{[^}]*padding:\s*clamp\(76px,\s*7vw,\s*104px\)\s+0/s,
    'shared editorial sections must use the approved compact rhythm'
  );
  assert.match(css, /\.travel-packs \.section-heading\s*{[^}]*margin-bottom:\s*44px/s);
  assert.match(css, /\.faq-list article\s*{[^}]*padding:\s*26px\s+0/s);
  assert.match(css, /\.pack-status\[data-status="active"\]/);
  assert.match(css, /\.pack-status\[data-status="limited"\]/);
  assert.match(css, /\.pack-status\[data-status="unavailable"\]/);
  assert.match(css, /\.faq-list article \+ article/);
  assert.match(css, /\.article-directions\s*{[^}]*background:\s*var\(--ink-deep\)/s);

  assert.match(css, /\.map-hotspot:focus-visible\s*{[^}]*outline:\s*3px\s+solid\s+var\(--coral\)/s);
  assert.match(css, /\.map-hotspot\s*{[^}]*width:\s*36px;[^}]*height:\s*36px/s);
  assert.match(
    css,
    /\.map-hotspot strong\s*{[^}]*position:\s*absolute;[^}]*left:\s*calc\(100%\s*\+\s*8px\)/s,
    'labels must not shift hotspot centres away from their SVG route nodes'
  );
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(min-width:\s*1200px\)/, 'article should define its 1440-safe layout');
  assert.match(css, /@media\s*\(max-width:\s*820px\)/, 'article should define its 768-safe layout');
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*?width:\s*calc\(100%\s*-\s*48px\)/);
  assert.match(css, /@media\s*\(max-width:\s*380px\)/, 'article should define its 360-safe layout');

  assert.match(
    css,
    /@media\s*\(max-width:\s*820px\)[\s\S]*?\.journey-layout\s*{[^}]*grid-template-columns:\s*1fr/s
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*820px\)[\s\S]*?\.map-hotspot strong\s*{[^}]*display:\s*none/s
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*560px\)[\s\S]*?padding-bottom:\s*calc\(68px\s*\+\s*env\(safe-area-inset-bottom\)\)/
  );
});

test('English autumn guide is a complete semantic article', () => {
  const en = readArticle('en');

  assert.match(en, /<body\s+data-article-id="autumn-interlaken">/);
  assert.equal(occurrences(en, /<h1\b/g), 1);
  assert.match(en, /<h1>Interlaken in Autumn: A Golden Day Between Two Lakes<\/h1>/);

  for (const id of [
    'place-hohematte',
    'place-japanese-garden',
    'place-aare',
    'place-unterseen',
    'place-harder-kulm',
    'place-lake-brienz'
  ]) {
    assert.match(en, new RegExp(`id="${id}"`));
  }

  for (const route of ['Easy Town Walk', 'Two-Lakes Viewpoint', 'Lake Brienz Day']) {
    assert.match(en, new RegExp(`>${route}<`));
  }

  const heroActions = en.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.ok(heroActions.indexOf('data-cta="directions"') >= 0);
  assert.ok(heroActions.indexOf('data-cta="directions"') < heroActions.indexOf('href="#travel-packs"'));

  const faq = en.match(/<section[^>]*id="faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.equal(occurrences(faq, /<h3\b/g), 6);
  assert.match(faq, /<h3>Is Harder Kulm open in autumn\?<\/h3>/);
  assert.match(faq, /<h3>How do I reach The B from central Interlaken\?<\/h3>/);
  assert.match(faq, /seasonal fact box/i);
  assert.doesNotMatch(faq, /29 November/i);
  assert.match(faq, /Jungfraustrasse 46/);
  assert.equal(occurrences(en, /\bfall\b/gi), 1);
});

test('English guide remains useful without JavaScript', () => {
  const en = readArticle('en');
  const withoutNoscript = en.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '');
  const packs = withoutNoscript.match(/<section[^>]*id="travel-packs"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.equal(occurrences(packs, /data-pack-card/g), 3);
  assert.match(packs, /City stroll pack/);
  assert.match(packs, /Viewpoint pack/);
  assert.match(packs, /Travel pack/);
  assert.match(packs, /href="\/#favourites"[^>]*>[^<]*(?:current menu|Current menu)/);
  assert.match(en, /href="\/#favourites"/);
});

test('English guide preserves the approved factual boundaries', () => {
  const en = readArticle('en');

  assert.match(en, /active paraglider landing area/i);
  assert.match(en, /wet leaves/i);
  assert.match(en, /3 April–29 November 2026/);
  assert.match(en, /3 April–6 December 2026/);
  assert.equal(occurrences(en, /after 11 October/gi), 1);
  assert.match(en, /sealed for easy carrying/i);
  assert.match(en, /bring a suitable reusable flask/i);
  assert.match(en, /consume promptly|keep appropriately chilled/i);
  assert.doesNotMatch(en, /leak[- ]?proof|guaranteed foliage|all-day hiking food/i);

  for (const duration of [
    '15–30 minutes',
    '15–25 minutes',
    '20–30-minute',
    '20–40 minutes',
    '1–2 hours',
    '2–3 hours'
  ]) {
    assert.match(en, new RegExp(duration));
  }
});

test('keeps destination ids and localized transport facts unique', () => {
  const articles = { en: readArticle('en'), de: readArticle('de') };
  const placeIds = [
    'place-hohematte',
    'place-japanese-garden',
    'place-aare',
    'place-unterseen',
    'place-harder-kulm',
    'place-lake-brienz'
  ];
  const transportFacts = {
    en: [
      /3 April–29 November 2026/g,
      /3 April–6 December 2026/g,
      /after 11 October/gi
    ],
    de: [
      /3\. April bis 29\. November 2026/g,
      /3\. April bis 6\. Dezember 2026/g,
      /Nach dem 11\. Oktober/gi
    ]
  };

  for (const [locale, html] of Object.entries(articles)) {
    for (const id of placeIds) {
      assert.equal(occurrences(html, new RegExp(`\\bid="${id}"`, 'g')), 1, `${locale} #${id}`);
    }
    for (const fact of transportFacts[locale]) {
      assert.equal(occurrences(html, fact), 1, `${locale} ${fact}`);
    }
  }
});

test('omits prices and numeric last-departure promises from both articles', () => {
  const price = /(?:\b(?:CHF|SFr\.?|EUR)\s*\d|\d\s*(?:CHF|SFr\.?|EUR)\b|€\s*\d|\d\s*€)/i;
  const lastService = /\b(?:last (?:departure|return|descent)|letzte (?:Abfahrt|Rückfahrt|Rueckfahrt|Talfahrt))\b/i;
  const clockTime = /\b(?:[01]?\d|2[0-3])[:.]\d{2}\b/;

  for (const locale of Object.keys(articlePaths)) {
    const html = readArticle(locale);
    assert.doesNotMatch(html, price, `${locale} must not publish a price`);

    const visibleText = html
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    for (const sentence of visibleText.split(/[.!?](?:\s|$)/)) {
      if (lastService.test(sentence)) {
        assert.doesNotMatch(sentence, clockTime, `${locale} must defer the last service time to the live operator`);
      }
    }
  }
});

test('English guide follows the required editorial and shared-shell order', () => {
  const en = readArticle('en');
  const orderedMarkers = [
    '<header class="site-header"',
    'Home / Autumn Guide',
    'Autumn Field Guide',
    'Before You Go',
    'class="article-map"',
    'id="place-hohematte"',
    'id="place-japanese-garden"',
    'id="place-aare"',
    'id="place-unterseen"',
    'id="place-harder-kulm"',
    'id="place-lake-brienz"',
    'Choose Your Pace',
    '2026 seasonal transport',
    'id="travel-packs"',
    'id="faq"',
    'id="directions"',
    'Sources and last checked',
    '<footer class="footer"',
    'id="analytics-consent"',
    '<script src="/script.js?v=20260827-1" defer></script>',
    '<script type="module" src="/articles/autumn-interlaken/article.mjs"></script>'
  ];

  let cursor = -1;
  for (const marker of orderedMarkers) {
    const next = en.indexOf(marker);
    assert.ok(next > cursor, `expected ${marker} after the previous required section`);
    cursor = next;
  }

  assert.match(en, /Jungfraustrasse 46, 3800 Interlaken/);
  assert.match(en, /11:00–20:00/);
  assert.match(en, /tel:\+41767742027/);
  assert.match(en, /\+41 76 774 20 27/);
  assert.match(en, /href="\/de\/artikel\/herbst-interlaken\/"[^>]*>DE<\/a>/);
});

test('German autumn guide mirrors the approved bilingual content contract', () => {
  const en = readArticle('en');
  const de = readArticle('de');

  assert.match(de, /<html lang="de">/);
  assert.equal(occurrences(de, /<h1\b/g), 1);
  assert.match(de, /<h1>Interlaken im Herbst: Ein goldener Tag zwischen zwei Seen<\/h1>/);

  for (const id of [
    'place-hohematte',
    'place-japanese-garden',
    'place-aare',
    'place-unterseen',
    'place-harder-kulm',
    'place-lake-brienz'
  ]) {
    assert.match(de, new RegExp(`id="${id}"`));
  }

  assert.equal(occurrences(de, /data-pack-card/g), 3);
  const faq = de.match(/<section[^>]*id="faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.equal(occurrences(faq, /<h3\b/g), 6);
  assert.match(faq, /<h3>Ist der Harder Kulm im Herbst geöffnet\?<\/h3>/);
  assert.match(faq, /<h3>Wie erreiche ich The B vom Zentrum Interlakens aus\?<\/h3>/);
  assert.match(faq, /Saison-Faktenbox/i);
  assert.doesNotMatch(faq, /29\. November/i);
  assert.match(faq, /Jungfraustrasse 46/);

  assert.deepEqual(attributeValues(de, 'data-place'), attributeValues(en, 'data-place'));
  assert.deepEqual(attributeValues(de, 'data-pack-card'), attributeValues(en, 'data-pack-card'));
  assert.deepEqual(attributeValues(de, 'data-article-event'), attributeValues(en, 'data-article-event'));
  assert.deepEqual(sourceUrls(de), sourceUrls(en));

  assert.doesNotMatch(de, /ortsrundgang-in-interlaken-what-can-i-do-in-1-hour/);
  assert.doesNotMatch(en, /ortsrundgang-in-interlaken-what-can-i-do-in-1-hour/);

  for (const url of [
    'https://www.interlaken.swiss/en/experiences/poi/japanese-garden-interlaken',
    'https://www.interlaken.swiss/en/experiences/poi/unterseen-old-town',
    'https://www.google.com/maps/search/?api=1&amp;query=H%C3%B6hematte+Interlaken',
    'https://www.google.com/maps/search/?api=1&amp;query=Aare+promenade+Interlaken',
    'https://www.jungfrau.ch/en-gb/harder-kulm',
    'https://www.jungfrau.ch/en-gb/live/operating-info/',
    'https://www.bls.ch/en/freizeit-und-ferien/ausfluege/schifffahrt-brienzersee',
    'https://www.bls.ch/en/fahren/fahrplan'
  ]) {
    assert.match(de, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(de, /f[uü]r unterwegs versiegelt/i);
  assert.match(de, /passende wiederverwendbare Thermosflasche mitbringen/i);
  assert.match(de, /zeitnah konsumieren oder ausreichend k[uü]hl halten/i);
  assert.doesNotMatch(de, /ß/);
});

test('Japanese Garden and Unterseen use destination-specific first-party fact links in both locales', () => {
  const expected = {
    'place-japanese-garden': 'https://www.interlaken.swiss/en/experiences/poi/japanese-garden-interlaken',
    'place-unterseen': 'https://www.interlaken.swiss/en/experiences/poi/unterseen-old-town'
  };

  for (const locale of Object.keys(articlePaths)) {
    const html = readArticle(locale);
    const sources = html.match(/<section class="article-sources"[\s\S]*?<\/section>/)?.[0] ?? '';
    for (const [id, url] of Object.entries(expected)) {
      const destination = html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';
      assert.match(destination, new RegExp(`href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
      assert.match(sources, new RegExp(`href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    }
    assert.doesNotMatch(html, /query=(?:Japanese\+Garden\+Interlaken|Unterseen\+old\+town)/);
  }
});

test('localized article menu toggles expose matching accessible open and close labels', () => {
  const en = readArticle('en');
  const de = readArticle('de');
  const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

  assert.match(en, /class="menu-toggle"[^>]*data-menu-open-label="Open menu"[^>]*data-menu-close-label="Close menu"/);
  assert.match(de, /class="menu-toggle"[^>]*data-menu-open-label="Menü öffnen"[^>]*data-menu-close-label="Menü schliessen"/);
  assert.match(script, /dataset\.menuOpenLabel/);
  assert.match(script, /dataset\.menuCloseLabel/);
});
