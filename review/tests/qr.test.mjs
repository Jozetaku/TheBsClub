import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';

const source = readFileSync(new URL('../src/assets/the-b-review-qr.png', import.meta.url));
const built = readFileSync(new URL('../dist/assets/the-bs-club-review-qr.png', import.meta.url));
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('copies the approved owner QR without changing a byte', () => {
  assert.equal(hash(built), hash(source));
});

test('approved owner QR opens the canonical review hub', () => {
  const png = PNG.sync.read(source);
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.equal(result?.data, 'https://www.thebsclub.ch/review/');
});
