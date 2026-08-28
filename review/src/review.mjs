const CONSENT_KEY = 'thebsclub_review_analytics_consent';
const MEASUREMENT_ID = 'G-JS838K2PY5';

export const shareHub = async ({ navigatorObject, clipboard, url }) => {
  if (typeof navigatorObject?.share === 'function') {
    try {
      await navigatorObject.share({ title: "The B's Club", url });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'manual';
    }
  }
  if (typeof clipboard?.writeText === 'function') {
    try {
      await clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'manual';
    }
  }
  return 'manual';
};

export const createActionEvent = (action, source) => ({
  event: 'review_hub_action',
  action_name: action,
  qr_source: source || 'direct'
});

const initialiseBrowser = () => {
  const consentBanner = document.querySelector('[data-consent-banner]');
  const privacyButton = document.querySelector('[data-privacy-settings]');
  const shareButton = document.querySelector('[data-share-url]');
  const shareStatus = document.querySelector('[data-share-status]');
  const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
  let analyticsAllowed = false;
  let analyticsLoaded = false;

  const updateConsentMode = (value) => {
    window.gtag?.('consent', 'update', {
      analytics_storage: value === 'accept' ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.append(script);
    window.gtag?.('js', new Date());
    window.gtag?.('config', MEASUREMENT_ID, { anonymize_ip: true });
  };

  const applyConsent = (value, persist = true) => {
    analyticsAllowed = value === 'accept';
    updateConsentMode(value);
    if (analyticsAllowed) loadAnalytics();
    if (persist) localStorage.setItem(CONSENT_KEY, value);
    if (consentBanner) consentBanner.hidden = true;
  };

  const storedConsent = localStorage.getItem(CONSENT_KEY);
  if (storedConsent === 'accept' || storedConsent === 'deny') {
    applyConsent(storedConsent, false);
  } else if (consentBanner) {
    consentBanner.hidden = false;
  }

  consentBanner?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent]');
    if (button) applyConsent(button.dataset.consent);
  });

  privacyButton?.addEventListener('click', () => {
    if (consentBanner) consentBanner.hidden = false;
  });

  shareButton?.addEventListener('click', async () => {
    shareButton.disabled = true;
    const result = await shareHub({
      navigatorObject: navigator,
      clipboard: navigator.clipboard,
      url: shareButton.dataset.shareUrl
    });
    const messages = {
      shared: 'Shared — thank you!',
      copied: 'Link copied to your clipboard.',
      manual: 'Copy the visible link below to share this page.'
    };
    if (shareStatus) shareStatus.textContent = messages[result];
    shareButton.disabled = false;
  });

  document.addEventListener('click', (event) => {
    const actionLink = event.target.closest('[data-action]');
    if (!actionLink || !analyticsAllowed) return;
    const actionEvent = createActionEvent(actionLink.dataset.action, source);
    window.gtag?.('event', actionEvent.event, {
      action_name: actionEvent.action_name,
      qr_source: actionEvent.qr_source
    });
  });
};

if (typeof document !== 'undefined') initialiseBrowser();
