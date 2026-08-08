import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const files = [
  '../../images/logo-official-high-contrast.png',
  '../../images/logo-official-high-contrast-white-preview.png',
];

test('high-contrast logo master and white preview exist as useful PNG assets', async () => {
  for (const file of files) {
    const url = new URL(file, import.meta.url);
    await access(url);
    const bytes = await readFile(url);
    assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
    assert.ok(bytes.readUInt32BE(16) >= 1000);
    assert.ok(bytes.readUInt32BE(20) >= 1000);
  }
});
