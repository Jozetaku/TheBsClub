(() => {
  const nativeSelector = 'input, textarea, select, [contenteditable="true"], .native-cursor';

  const initBubbleTeaCursor = ({ documentRef = document, windowRef = window } = {}) => {
    const cursor = documentRef.querySelector('#boba-cursor');
    const finePointer = windowRef.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!cursor || !finePointer) return { enabled: false, destroy() {} };

    const reducedMotion = windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      cursor.style.setProperty('--cursor-x', `${x}px`);
      cursor.style.setProperty('--cursor-y', `${y}px`);
      cursor.classList.add('is-visible');
      frame = 0;
    };
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.toggle('is-native', Boolean(event.target?.closest?.(nativeSelector)));
      cursor.classList.toggle('is-hovering', Boolean(event.target?.closest?.('a, button, [role="button"]')));
      if (!frame) frame = windowRef.requestAnimationFrame(render);
    };
    const onDown = () => { if (!reducedMotion) cursor.classList.add('is-clicking'); };
    const onUp = () => cursor.classList.remove('is-clicking');

    documentRef.addEventListener('pointermove', onMove, { passive: true });
    documentRef.addEventListener('pointerdown', onDown, { passive: true });
    documentRef.addEventListener('pointerup', onUp, { passive: true });

    return {
      enabled: true,
      destroy() {
        documentRef.removeEventListener('pointermove', onMove);
        documentRef.removeEventListener('pointerdown', onDown);
        documentRef.removeEventListener('pointerup', onUp);
        if (frame) windowRef.cancelAnimationFrame(frame);
      }
    };
  };

  window.TheBsClubCursor = Object.freeze({ initBubbleTeaCursor });
  initBubbleTeaCursor();
})();
