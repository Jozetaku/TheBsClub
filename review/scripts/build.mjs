import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BUSINESS, REVIEW_LINKS, TESTIMONIALS } from '../src/links.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const reviewRoot = resolve(scriptDirectory, '..');
const repositoryRoot = resolve(reviewRoot, '..');
const sourceRoot = join(reviewRoot, 'src');
const distRoot = join(reviewRoot, 'dist');
const distAssets = join(distRoot, 'assets');

export const renderTemplate = (template, values) => template.replace(/\{\{([A-Za-z0-9]+)\}\}/g, (match, key) => {
  if (!(key in values)) throw new Error(`Missing template value: ${key}`);
  return String(values[key]);
});

export const assertNoPlaceholders = (html) => {
  const unresolved = html.match(/\{\{[^}]+\}\}/g);
  if (unresolved) throw new Error(`Unresolved template placeholders: ${unresolved.join(', ')}`);
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const renderTestimonials = () => TESTIMONIALS.map(({ author, platform, quote }, index) => `
          <figure class="testimonial-card testimonial-card-${index + 1}">
            <div class="testimonial-stars" aria-label="Five out of five stars">★★★★★</div>
            <blockquote>“${escapeHtml(quote)}”</blockquote>
            <figcaption><strong>${escapeHtml(author)}</strong><span>${escapeHtml(platform)}</span></figcaption>
          </figure>`).join('');

const copyOptionalAsset = async (filename) => {
  const source = join(sourceRoot, filename);
  if (existsSync(source)) await copyFile(source, join(distRoot, filename));
};

export const build = async () => {
  await rm(distRoot, { recursive: true, force: true });
  await mkdir(distAssets, { recursive: true });

  const template = await readFile(join(sourceRoot, 'index.template.html'), 'utf8');
  const values = {
    ...Object.fromEntries(Object.entries(REVIEW_LINKS).map(([key, value]) => [key, escapeHtml(value)])),
    ...Object.fromEntries(Object.entries(BUSINESS).map(([key, value]) => [key, escapeHtml(value)])),
    testimonialsHtml: renderTestimonials()
  };
  const html = renderTemplate(template, values);
  assertNoPlaceholders(html);

  await writeFile(join(distRoot, 'index.html'), html);
  await copyFile(join(repositoryRoot, 'images', 'logo-official.png'), join(distAssets, 'logo-official.png'));
  await copyFile(
    join(sourceRoot, 'assets', 'the-b-review-qr.png'),
    join(distAssets, 'the-bs-club-review-qr.png')
  );
  await copyOptionalAsset('review.css');
  await copyOptionalAsset('review.mjs');
};

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await build();
}
