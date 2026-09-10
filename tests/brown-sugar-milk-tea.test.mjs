import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const german = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const english = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('publishes the approved Bublee Brown Sugar Milk Tea v6 asset and canonical copy', () => {
  const asset = '/images/campaign/v2/brown-sugar-milk-tea.png';
  assert.ok(existsSync(new URL(`..${asset}`, import.meta.url)));

  assert.match(english, new RegExp(`src="${asset}"[^>]*width="1080"[^>]*height="1350"`));
  assert.match(german, new RegExp(`src="${asset}"[^>]*width="1080"[^>]*height="1350"`));

  assert.match(
    english,
    /Creamy milk tea swirled with rich brown sugar and finished with chewy tapioca pearls\./,
  );
  assert.match(
    german,
    /Cremiger Milchtee mit kräftigem Braunzucker und bissfesten Tapiokaperlen\./,
  );

  assert.match(
    english,
    /"image": "https:\/\/www\.thebsclub\.ch\/images\/campaign\/v2\/brown-sugar-milk-tea\.png"/,
  );
  assert.match(
    german,
    /"image": "https:\/\/www\.thebsclub\.ch\/images\/campaign\/v2\/brown-sugar-milk-tea\.png"/,
  );

  assert.match(
    css,
    /\.bestseller-card\[data-drink="Brown Sugar Milk Tea"\]\s*\{[^}]*--cup-scale:\s*1\.20;[^}]*--cup-y:\s*0px/,
  );
});
