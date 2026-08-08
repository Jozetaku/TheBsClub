import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../cursor.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const loadCursor = ({ finePointer = true, reducedMotion = false } = {}) => {
  const listeners = new Map();
  const classes = new Set();
  const cursor = {
    style: { setProperty(name, value) { this[name] = value; } },
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      toggle: (name, force) => force ? classes.add(name) : classes.delete(name)
    }
  };
  const documentRef = {
    querySelector: (selector) => selector === '#boba-cursor' ? cursor : null,
    addEventListener(type, handler) { listeners.set(type, handler); },
    removeEventListener(type) { listeners.delete(type); }
  };
  const windowRef = {
    matchMedia(query) {
      return { matches: query.includes('prefers-reduced-motion') ? reducedMotion : finePointer };
    },
    requestAnimationFrame(callback) { callback(); return 1; },
    cancelAnimationFrame() {}
  };
  const window = { document: documentRef, ...windowRef };
  vm.runInNewContext(source, { window, document: documentRef });
  return { api: window.TheBsClubCursor, cursor, classes, listeners, documentRef, windowRef };
};

test('enables only for a fine hover pointer', () => {
  const enabled = loadCursor({ finePointer: true });
  assert.equal(enabled.api.initBubbleTeaCursor({ documentRef: enabled.documentRef, windowRef: enabled.windowRef }).enabled, true);
  const disabled = loadCursor({ finePointer: false });
  assert.equal(disabled.api.initBubbleTeaCursor({ documentRef: disabled.documentRef, windowRef: disabled.windowRef }).enabled, false);
});

test('uses the pointer coordinates as the straw-tip hotspot', () => {
  const fixture = loadCursor();
  fixture.api.initBubbleTeaCursor({ documentRef: fixture.documentRef, windowRef: fixture.windowRef });
  fixture.listeners.get('pointermove')({ clientX: 120, clientY: 80, target: { closest: () => null } });
  assert.equal(fixture.cursor.style['--cursor-x'], '120px');
  assert.equal(fixture.cursor.style['--cursor-y'], '80px');
  assert.ok(fixture.classes.has('is-visible'));
});

test('toggles interactive and click states and removes listeners on destroy', () => {
  const fixture = loadCursor();
  const controller = fixture.api.initBubbleTeaCursor({ documentRef: fixture.documentRef, windowRef: fixture.windowRef });
  fixture.listeners.get('pointermove')({ clientX: 8, clientY: 12, target: { closest: (selector) => selector.includes('a, button') } });
  assert.ok(fixture.classes.has('is-hovering'));
  fixture.listeners.get('pointerdown')();
  assert.ok(fixture.classes.has('is-clicking'));
  fixture.listeners.get('pointerup')();
  assert.ok(!fixture.classes.has('is-clicking'));
  controller.destroy();
  assert.equal(fixture.listeners.has('pointermove'), false);
  assert.equal(fixture.listeners.has('pointerdown'), false);
  assert.equal(fixture.listeners.has('pointerup'), false);
});

test('renders a clean Matcha Latte cursor while preserving the straw-tip hotspot', () => {
  const cursorMarkup = html.match(/<div class="boba-cursor"[\s\S]*?<\/div>\s*<\/body>/)?.[0] ?? '';
  assert.match(cursorMarkup, /matcha-cursor-foam/);
  assert.match(cursorMarkup, /matcha-cursor-layer/);
  assert.match(cursorMarkup, /cursor-pearls/);
  assert.doesNotMatch(cursorMarkup, /brown-sugar-line/);
  assert.doesNotMatch(cursorMarkup, /<b>B<\/b>/);
  assert.match(css, /\.matcha-cursor-layer\s*\{[^}]*linear-gradient/);
  assert.match(css, /\.matcha-cursor-foam\s*\{/);
});
