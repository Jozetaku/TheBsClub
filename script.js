(() => {
  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setNavState = (open) => {
    menuToggle?.setAttribute('aria-expanded', String(open));
    primaryNav?.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    const label = menuToggle?.querySelector('.sr-only');
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
  };

  menuToggle?.addEventListener('click', () => {
    setNavState(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  primaryNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setNavState(false);
      menuToggle.focus();
    }
  });

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px' });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const menuDialog = document.querySelector('#menu-dialog');
  const dialogImage = document.querySelector('#menu-dialog-image');
  const dialogTitle = document.querySelector('#menu-dialog-title');
  const dialogTabs = document.querySelectorAll('[data-dialog-menu]');
  const dialogClose = document.querySelector('.dialog-close');
  const dialogBackdrop = document.querySelector('#dialog-backdrop');
  const menuData = {
    bubble: {
      title: 'Bubble tea menu',
      image: 'images/drink-menu-1.jpg',
      alt: 'The B’s Club bubble tea menu'
    },
    matcha: {
      title: 'Matcha menu',
      image: 'images/matcha-menu.jpg',
      alt: 'The B’s Club matcha menu'
    },
    coffee: {
      title: 'Coffee menu',
      image: 'images/coffee-menu.jpg',
      alt: 'The B’s Club coffee and tea menu'
    }
  };

  const selectMenu = (key) => {
    const selected = menuData[key] || menuData.bubble;
    if (dialogImage) {
      dialogImage.src = selected.image;
      dialogImage.alt = selected.alt;
    }
    if (dialogTitle) dialogTitle.textContent = selected.title;
    dialogTabs.forEach((tab) => {
      const active = tab.dataset.dialogMenu === key;
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
  };

  document.querySelectorAll('.menu-open').forEach((button) => {
    button.addEventListener('click', () => {
      selectMenu(button.dataset.menu);
      if (typeof menuDialog?.showModal === 'function') {
        menuDialog.showModal();
      } else if (menuDialog) {
        menuDialog.setAttribute('open', '');
        menuDialog.classList.add('is-fallback-open');
        if (dialogBackdrop) dialogBackdrop.hidden = false;
        document.body.classList.add('dialog-open');
      }
    });
  });

  dialogTabs.forEach((tab) => {
    tab.addEventListener('click', () => selectMenu(tab.dataset.dialogMenu));
  });

  const closeDialog = () => {
    if (typeof menuDialog?.close === 'function' && menuDialog.open && !menuDialog.classList.contains('is-fallback-open')) {
      menuDialog.close();
    } else if (menuDialog) {
      menuDialog.removeAttribute('open');
      menuDialog.classList.remove('is-fallback-open');
      if (dialogBackdrop) dialogBackdrop.hidden = true;
      document.body.classList.remove('dialog-open');
    }
  };

  dialogClose?.addEventListener('click', closeDialog);
  dialogBackdrop?.addEventListener('click', closeDialog);
  menuDialog?.addEventListener('click', (event) => {
    if (event.target === menuDialog && typeof menuDialog.close === 'function') closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuDialog?.classList.contains('is-fallback-open')) closeDialog();
  });

  const consentKey = 'thebsclub_analytics_consent';
  const consentBanner = document.querySelector('#analytics-consent');
  const consentButtons = document.querySelectorAll('[data-consent-choice]');
  const privacySettings = document.querySelector('#privacy-settings');

  const readConsent = () => {
    try {
      const value = window.localStorage?.getItem(consentKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  };

  const applyConsent = (choice, persist = true) => {
    const analyticsStorage = choice === 'granted' ? 'granted' : 'denied';
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: analyticsStorage,
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    if (persist) {
      try {
        window.localStorage?.setItem(consentKey, analyticsStorage);
      } catch {
        // Keep the in-page choice even when storage is unavailable.
      }
    }
    if (consentBanner) consentBanner.hidden = true;
  };

  const storedConsent = readConsent();
  if (storedConsent) {
    applyConsent(storedConsent, false);
  } else if (consentBanner) {
    consentBanner.hidden = false;
  }

  consentButtons.forEach((button) => {
    button.addEventListener('click', () => applyConsent(button.dataset.consentChoice));
  });

  privacySettings?.addEventListener('click', () => {
    if (consentBanner) consentBanner.hidden = false;
    consentButtons[0]?.focus();
  });

  document.querySelectorAll('[data-cta="directions"]').forEach((directionsLink) => {
    directionsLink.addEventListener('click', () => {
      const ctaLocation = directionsLink.dataset.ctaLocation || 'unknown';
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
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
