(() => {
  document.addEventListener('click', (event) => {
    const link = event.target?.closest?.('[data-cta="directions"]');
    if (!link) return;

    const ctaLocation = link.dataset.ctaLocation || 'unknown';
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push({
      event: 'directions_click',
      cta_location: ctaLocation
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'directions_click', {
        cta_location: ctaLocation
      });
    }
  });
})();

