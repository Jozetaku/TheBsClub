import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const rgb = (hex) => [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
const luminance = (hex) => rgb(hex)
  .map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  })
  .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrastRatio = (foreground, background) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
const blend = (foreground, background, alpha) => `#${rgb(foreground)
  .map((channel, index) => Math.round(channel * alpha + rgb(background)[index] * (1 - alpha)))
  .map((channel) => channel.toString(16).padStart(2, '0'))
  .join('')}`;

test('uses the confirmed website, hours, and phone everywhere', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /"url": "https:\/\/thebsclub\.ch\/"/);
  assert.doesNotMatch(html, /https:\/\/www\.thebsclub\.ch/);
  assert.doesNotMatch(html, /10:00/);
  assert.doesNotMatch(html, /7742027|774 20 27/);
  assert.match(html, /11:00–19:00/);
  assert.match(html, /tel:\+41762262722/);
  assert.match(html, /\+41 76 226 27 22/);
});

test('keeps repository launch notes aligned with confirmed details', () => {
  assert.doesNotMatch(readme, /774 20 27/);
  assert.match(readme, /\+41 76 226 27 22/);
  assert.match(readme, /Every day: `11:00–19:00`/);
});

test('puts directions first and retains menu and Uber Eats paths', () => {
  const heroActions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const mobileActions = html.match(/<div class="mobile-actions"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(heroActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Get Directions/);
  assert.match(heroActions, />View Menu\b/);
  assert.match(heroActions, /https:\/\/www\.ubereats\.com\/ch\/store\/bublee-interlaken\/Ik4zv95aWhWzt0lYSbjaMQ/);
  assert.match(mobileActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Directions/);
  assert.match(mobileActions, /<button class="menu-open" type="button" data-menu="bubble">Menu<\/button>/);
  assert.match(mobileActions, />Uber Eats/);
});

test('marks every directions surface for delegated tracking', () => {
  assert.match(html, /<script src="script\.js\?v=20260718-3" defer><\/script>/);
  assert.doesNotMatch(html, /(?:analytics|tracking|cta)\.js/);
  const trackedDirections = html.match(/data-cta="directions"/g) ?? [];
  assert.ok(trackedDirections.length >= 5, `expected at least 5 tracked directions links, found ${trackedDirections.length}`);
  for (const location of ['header', 'hero', 'visit', 'map_card', 'mobile']) {
    assert.match(html, new RegExp(`data-cta-location="${location}"`));
  }
});

test('offers analytics consent and persistent privacy settings', () => {
  assert.match(html, /id="analytics-consent"/);
  assert.match(html, /data-consent-choice="granted"[^>]*>Accept Analytics</);
  assert.match(html, /data-consent-choice="denied"[^>]*>Reject</);
  assert.match(html, /id="privacy-settings"[^>]*>Privacy settings</);
});

test('keeps the consent bar above mobile quick actions', () => {
  assert.match(css, /\.consent-banner\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.consent-banner\s*\{[\s\S]*bottom:\s*calc\(78px\s*\+\s*env\(safe-area-inset-bottom\)\)/);
});

test('does not advertise unavailable products and features the current Signature Latte', () => {
  assert.doesNotMatch(html, /brunch|breakfast|avocado toast|all-day comfort food|waffles?|strawberry-waffle/i);
  assert.match(html, /<title>The B's Club — Coffee, Matcha &amp; Bubble Tea in Interlaken<\/title>/);
  assert.match(html, /"servesCuisine": \["Coffee", "Bubble Tea", "Matcha"\]/);
  assert.match(html, /Coffee, matcha, bubble tea and colourful drinks\./);
  assert.match(html, /SIGNATURE LATTE/);
  assert.match(html, /images\/signature-latte\.jpg/);
  assert.match(html, /<p>Hot coffee<\/p><h3>Signature Latte<\/h3>/);
  assert.match(html, /<strong>CHF 4\.90<\/strong>/);
  assert.doesNotMatch(html, /signature-latte-hot-concept-v1\.png/);
  assert.match(html, /Drop in for coffee, a colourful afternoon pick-me-up or a sweet finish to your day\./);
});

test('features Yummy Strawberry with an optimized local image', () => {
  const imageUrl = new URL('../images/yummy-strawberry-campaign.webp', import.meta.url);
  assert.ok(existsSync(imageUrl), 'Yummy Strawberry campaign image should exist');
  assert.ok(statSync(imageUrl).size < 300_000, 'Yummy Strawberry image should stay below 300 KB');
  assert.match(html, /images\/yummy-strawberry-campaign\.webp/);
  assert.match(html, /<h3>Yummy Strawberry<\/h3>/);
  assert.match(html, /<strong>CHF 7\.90<\/strong>/);
});

test('keeps the hero caption clear of the overlapping side image', () => {
  const captionRule = css.match(/\.hero-image figcaption\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(captionRule, /right:\s*auto/);
  assert.match(captionRule, /width:\s*max-content/);
  assert.match(captionRule, /max-width:\s*calc\(100%\s*-\s*40px\)/);
  assert.match(captionRule, /z-index:\s*2/);
});

test('shows the complete Yummy Strawberry cup in both scoped frames', () => {
  const productRule = css.match(/\.product-image-yummy img\s*\{([^}]*)\}/)?.[1] ?? '';
  const storyRule = css.match(/\.story-visual \.story-photo-yummy\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(html, /class="product-image product-image-yummy"/);
  assert.match(html, /class="story-photo-two story-photo-yummy"/);
  assert.match(productRule, /object-fit:\s*contain/);
  assert.match(productRule, /object-position:\s*center/);
  assert.match(storyRule, /object-fit:\s*contain/);
  assert.match(storyRule, /object-position:\s*center/);
});

test('publishes the approved BS12 walk-in offer', () => {
  const imageUrl = new URL('../images/summer-drinks-campaign.webp', import.meta.url);
  const campaignHtml = html.match(/<section class="summer-offer"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(existsSync(imageUrl), 'campaign trio image should exist');
  assert.ok(statSync(imageUrl).size < 450_000, 'campaign trio image should stay below 450 KB');
  assert.match(html, /<noscript><style>#summer-offer\[hidden\] \{ display: block !important; \}<\/style><\/noscript>/);
  assert.match(campaignHtml, /id="summer-offer"[^>]*hidden[^>]*data-campaign-end="2026-08-31T21:59:59Z"/);
  assert.match(campaignHtml, /3 drinks\. 1 summer offer\./);
  assert.match(campaignHtml, /Pick yours and save 12% in store\./);
  assert.match(campaignHtml, /Show code <strong>BS12<\/strong> at checkout/);
  assert.match(campaignHtml, /Brown Sugar Milk Tea[\s\S]*?<del>CHF 7\.90<\/del>[\s\S]*?<strong>CHF 6\.95<\/strong>/);
  assert.match(campaignHtml, /Yummy Strawberry[\s\S]*?<del>CHF 7\.90<\/del>[\s\S]*?<strong>CHF 6\.95<\/strong>/);
  assert.match(campaignHtml, /Matcha Latte[\s\S]*?<del>CHF 8\.90<\/del>[\s\S]*?<strong>CHF 7\.80<\/strong>/);
  const termsHtml = campaignHtml.match(/<div class="summer-offer-actions">[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] ?? '';
  const renderedTerms = termsHtml.replace(/<br\s*\/?\s*>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  assert.equal(renderedTerms, 'In store only · Until 31 August 2026');
  assert.match(campaignHtml, /data-cta="directions" data-cta-location="campaign"/);
  assert.match(html, /<script src="script\.js\?v=20260718-3" defer><\/script>/);
});

test('keeps campaign text readable on the coral-to-amber background', () => {
  const emphasizedHeadingRule = css.match(/\.summer-offer-copy h2 em\s*\{([^}]*)\}/)?.[1] ?? '';
  const oldPriceRule = css.match(/\.summer-price-row del\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(emphasizedHeadingRule, /color:\s*#3a211b/);
  assert.match(oldPriceRule, /color:\s*#4a342d/);
  assert.doesNotMatch(oldPriceRule, /opacity:|text-shadow:/);

  for (const gradientColor of ['#ef725d', '#f5ae51']) {
    assert.ok(contrastRatio('#3a211b', gradientColor) >= 4.5);
    const priceRowBackground = blend('#ffffff', gradientColor, 0.68);
    assert.ok(contrastRatio('#4a342d', priceRowBackground) >= 4.5);
  }
});

test('blends the complete desktop campaign trio into its full-bleed backdrop', () => {
  const desktopImageRule = css.match(/\.summer-offer-media img\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(css, /\.summer-offer-media::before\s*\{[^}]*background-image:\s*url\("images\/summer-drinks-campaign\.webp"\)[^}]*filter:\s*blur\(/);
  assert.match(desktopImageRule, /position:\s*absolute/);
  assert.match(desktopImageRule, /aspect-ratio:\s*3\s*\/\s*2/);
  assert.match(desktopImageRule, /object-fit:\s*contain/);
  assert.match(desktopImageRule, /-webkit-mask-image:\s*linear-gradient\(/);
  assert.match(desktopImageRule, /(?:^|;)\s*mask-image:\s*linear-gradient\(/);
});

test('adds safe space around the campaign trio below the desktop breakpoint', () => {
  const responsiveImageRule = css.match(/@media\s*\(max-width:\s*960px\)\s*\{[\s\S]*?\.summer-offer-media img\s*\{([^}]*)\}/)?.[1] ?? '';
  const mobileImageRule = css.match(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*?\.summer-offer-media img\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(responsiveImageRule, /position:\s*relative/);
  assert.match(responsiveImageRule, /height:\s*100%/);
  assert.match(responsiveImageRule, /object-fit:\s*contain/);
  assert.match(responsiveImageRule, /transform:\s*none/);
  assert.match(mobileImageRule, /width:\s*90%/);
  assert.match(mobileImageRule, /margin-inline:\s*auto/);
});
