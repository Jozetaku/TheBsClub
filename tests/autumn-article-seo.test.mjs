import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const businessId = 'https://thebsclub.ch/#business';
const imageUrl = 'https://thebsclub.ch/articles/autumn-interlaken/interlaken-autumn-social.png';
const expectedDate = '2026-08-27';

const locales = {
  en: {
    path: '../en/articles/autumn-interlaken/index.html',
    url: 'https://thebsclub.ch/en/articles/autumn-interlaken',
    title: 'Interlaken in Autumn: 6 Places to Visit | The B',
    description: 'Find six beautiful places to visit in Interlaken this autumn, from Höhematte to Lake Brienz, plus three easy travel packs and directions to The B.',
    headline: 'Interlaken in Autumn: A Golden Day Between Two Lakes',
    breadcrumb: 'Autumn Guide',
    places: [
      ['place-hohematte', 'Höhematte'],
      ['place-japanese-garden', 'Japanese Garden and former monastery'],
      ['place-aare', 'Aare promenade'],
      ['place-unterseen', 'Unterseen old town'],
      ['place-harder-kulm', 'Harder Kulm'],
      ['place-lake-brienz', 'Lake Brienz']
    ]
  },
  de: {
    path: '../de/artikel/herbst-interlaken/index.html',
    url: 'https://thebsclub.ch/de/artikel/herbst-interlaken',
    title: 'Interlaken im Herbst: 6 schöne Orte | The B',
    description: 'Entdecke sechs schöne Orte in Interlaken im Herbst – von der Höhematte bis zum Brienzersee – plus drei Herbst-Packs und den Weg zu The B.',
    headline: 'Interlaken im Herbst: Ein goldener Tag zwischen zwei Seen',
    breadcrumb: 'Herbst-Guide',
    places: [
      ['place-hohematte', 'Höhematte'],
      ['place-japanese-garden', 'Japanischer Garten und ehemaliges Kloster'],
      ['place-aare', 'Aarepromenade'],
      ['place-unterseen', 'Altstadt Unterseen'],
      ['place-harder-kulm', 'Harder Kulm'],
      ['place-lake-brienz', 'Brienzersee']
    ]
  }
};

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]])
);
const headTags = (html, name) => {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  return [...head.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => attributes(match[0]));
};
const metaContent = (html, key, value) => {
  const tag = headTags(html, 'meta').find((item) => item[key] === value);
  assert.ok(tag, `missing meta ${key}="${value}"`);
  return tag.content;
};
const jsonLd = (html) => [...html.matchAll(
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
)].map((match) => JSON.parse(match[1]));

test('localized article metadata uses the approved search and social presentation', () => {
  const alternateUrls = Object.fromEntries(
    Object.entries(locales).map(([locale, config]) => [locale, config.url])
  );

  for (const [locale, config] of Object.entries(locales)) {
    const html = read(config.path);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.equal(title, config.title);
    assert.equal(metaContent(html, 'name', 'description'), config.description);
    assert.equal(metaContent(html, 'property', 'og:type'), 'article');
    assert.equal(metaContent(html, 'property', 'og:title'), config.title);
    assert.equal(metaContent(html, 'property', 'og:description'), config.description);
    assert.equal(metaContent(html, 'property', 'og:url'), config.url);
    assert.equal(metaContent(html, 'property', 'og:image'), imageUrl);

    const links = headTags(html, 'link');
    const canonicals = links.filter((link) => link.rel === 'canonical');
    assert.deepEqual(canonicals.map((link) => link.href), [config.url]);

    const alternates = links.filter((link) => link.rel === 'alternate');
    assert.deepEqual(
      Object.fromEntries(alternates.map((link) => [link.hreflang, link.href])),
      alternateUrls,
      `${locale} must expose only reciprocal en/de alternates`
    );
    assert.equal(alternates.length, 2);
    assert.ok(!alternates.some((link) => link.hreflang === 'x-default'));
  }
});

test('homepage publishes the stable business identity used by article publishers', () => {
  const homepageSchemas = jsonLd(read('../index.html'));
  const business = homepageSchemas.find((schema) => schema['@type'] === 'CafeOrCoffeeShop');

  assert.ok(business, 'missing homepage CafeOrCoffeeShop schema');
  assert.equal(business['@id'], businessId);
});

test('localized JSON-LD graphs contain complete Article, breadcrumb and place discovery data', () => {
  for (const [locale, config] of Object.entries(locales)) {
    const schemas = jsonLd(read(config.path));
    assert.equal(schemas.length, 1, `${locale} must use one JSON-LD script`);
    assert.equal(schemas[0]['@context'], 'https://schema.org');
    assert.ok(Array.isArray(schemas[0]['@graph']));

    const graph = schemas[0]['@graph'];
    const article = graph.find((node) => node['@type'] === 'Article');
    assert.ok(article, `${locale} Article node missing`);
    assert.equal(article.headline, config.headline);
    assert.equal(article.description, config.description);
    assert.equal(article.inLanguage, locale);
    assert.equal(article.datePublished, expectedDate);
    assert.equal(article.dateModified, expectedDate);
    assert.deepEqual(article.author, { '@id': businessId });
    assert.deepEqual(article.publisher, { '@id': businessId });
    assert.deepEqual(article.mainEntityOfPage, { '@type': 'WebPage', '@id': config.url });
    assert.equal(article.image, imageUrl);

    const placeNodes = graph.filter((node) => node['@type'] === 'Place');
    const expectedPlaces = config.places.map(([fragment, name]) => ({
      '@type': 'Place',
      '@id': `${config.url}#${fragment}`,
      name
    }));
    assert.deepEqual(placeNodes, expectedPlaces);
    assert.deepEqual(
      article.mentions,
      expectedPlaces.map((place) => ({ '@id': place['@id'] }))
    );

    const breadcrumbs = graph.find((node) => node['@type'] === 'BreadcrumbList');
    assert.ok(breadcrumbs, `${locale} BreadcrumbList node missing`);
    assert.deepEqual(breadcrumbs.itemListElement, [
      { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Home' : 'Startseite', item: 'https://thebsclub.ch/' },
      { '@type': 'ListItem', position: 2, name: config.breadcrumb, item: config.url }
    ]);

    assert.ok(!graph.some((node) => node['@type'] === 'FAQPage'));
    assert.ok(!graph.some((node) => node['@id'] === businessId), 'article must reference, not redefine, the business');
  }
});

test('sitemap lists the homepage and both localized articles with reciprocal alternates', () => {
  const sitemap = read('../sitemap.xml');
  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);

  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
    alternates: [...match[1].matchAll(/<xhtml:link\b([^>]*)\/>/g)].map((link) => attributes(link[1]))
  }));
  assert.deepEqual(entries.map((entry) => entry.loc), [
    'https://thebsclub.ch/',
    locales.en.url,
    locales.de.url
  ]);

  assert.deepEqual(entries[0].alternates, []);
  const expectedAlternates = [
    { rel: 'alternate', hreflang: 'en', href: locales.en.url },
    { rel: 'alternate', hreflang: 'de', href: locales.de.url }
  ];
  assert.deepEqual(entries[1].alternates, expectedAlternates);
  assert.deepEqual(entries[2].alternates, expectedAlternates);
  assert.doesNotMatch(sitemap, /x-default|\/articles<|\/artikel</);
});
