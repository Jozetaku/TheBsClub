(() => {
  const googleAdsConversions = {
    directions: 'AW-18339850662/hxWiCLTTpO4cEKbTj6lE',
    contact: 'AW-18339850662/gzNvCLfTpO4cEKbTj6lE'
  };

  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const campaignOffer = document.querySelector('#summer-offer');
  const campaignEnd = campaignOffer?.dataset.campaignEnd;
  if (campaignOffer && campaignEnd) {
    const maximumTimerDelay = 2_147_483_647;
    const endTimestamp = Date.parse(campaignEnd);
    let expiryTimer;

    const syncCampaignOffer = () => {
      if (expiryTimer !== undefined) {
        window.clearTimeout(expiryTimer);
        expiryTimer = undefined;
      }

      const remaining = endTimestamp - Date.now();
      campaignOffer.hidden = !Number.isFinite(endTimestamp) || remaining < 0;
      if (campaignOffer.hidden) return;

      const delay = Math.min(remaining + 1, maximumTimerDelay);
      expiryTimer = window.setTimeout(() => {
        expiryTimer = undefined;
        syncCampaignOffer();
      }, delay);
    };

    syncCampaignOffer();
    document.addEventListener('visibilitychange', syncCampaignOffer);
  }

  const setNavState = (open) => {
    menuToggle?.setAttribute('aria-expanded', String(open));
    primaryNav?.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    const label = menuToggle?.querySelector('.sr-only');
    const openLabel = menuToggle?.dataset.menuOpenLabel || 'Open menu';
    const closeLabel = menuToggle?.dataset.menuCloseLabel || 'Close menu';
    if (label) label.textContent = open ? closeLabel : openLabel;
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
      image: '/images/drink-menu-1.jpg',
      alt: 'The B’s Club bubble tea menu'
    },
    matcha: {
      title: 'Matcha menu',
      image: '/images/matcha-menu.jpg',
      alt: 'The B’s Club matcha menu'
    },
    coffee: {
      title: 'Coffee menu',
      image: '/images/coffee-menu.jpg',
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

  const orderForm = document.querySelector('#order-form');
  const orderStatus = document.querySelector('#order-status');
  const orderDate = orderForm?.elements.orderDate;
  const orderTranslations = {
    en: {
      heading: 'Plan your order.',
      headingAccent: 'Send when ready.',
      intro: 'Tell us what you would like and when you will arrive. We will prepare a clear message for WhatsApp or email.',
      paymentTitle: 'Card payment before preparation',
      paymentCopy: 'We accept debit or credit cards only. Payment must be completed before we prepare food.',
      deliveryTitle: 'Need delivery?',
      deliveryCopy: 'Please order through Uber Eats for delivery to your address.',
      uberButton: 'Open Uber Eats ↗',
      whatsappLabel: 'WhatsApp',
      emailLabel: 'Email',
      languageLegend: '1. Choose your language',
      setLegend: 'Optional: Choose a set',
      setProductLabel: 'Sandwich or Food + Boba set',
      setQuantityLabel: 'Set quantity',
      drinkOneLegend: 'Included Boba drink 1',
      drinkTwoLegend: 'Included Boba drink 2',
      flavourLabel: 'Flavour',
      sweetnessLabel: 'Sweetness',
      iceLabel: 'Ice',
      setPriceLabel: 'Set price',
      nameLabel: 'Your name',
      namePlaceholder: 'Name for the order',
      itemsLegend: '2. What would you like?',
      itemsHelp: 'Choose one or more. Add quantities and custom requests below.',
      foodGroup: 'Food',
      drinksGroup: 'Drinks',
      otherDrink: 'Coffee / other drink',
      detailsLabel: 'Quantities, size and custom requests',
      detailsPlaceholder: 'Example: 2× Green Curry Chicken, not spicy; 1× large Matcha Latte',
      serviceLegend: '3. How will you receive your order?',
      dineIn: 'Dine in',
      pickup: 'Pick up',
      dateLabel: 'Date',
      timeLabel: 'Arrival / pickup time',
      notesLabel: 'Anything else? (optional)',
      notesPlaceholder: 'Allergies, questions or another drink from our menu',
      paymentConfirm: 'I understand that only debit or credit cards are accepted and payment is required before food is prepared.',
      sendWhatsapp: 'Send with WhatsApp',
      sendEmail: 'Send by email',
      privacyNote: 'Your details stay in your browser until you choose WhatsApp or email.',
      itemRequired: 'Please choose at least one food or drink.',
      openingWhatsapp: 'Opening WhatsApp with your order…',
      openingEmail: 'Opening your email app with your order…',
      messageTitle: "Hello The B's Club! I would like to place an order.",
      messageName: 'Name',
      messageItems: 'Order',
      messageDetails: 'Quantities / requests',
      messageService: 'Service',
      messageDate: 'Date',
      messageTime: 'Time',
      messageNotes: 'Notes',
      messagePayment: 'I understand that payment by debit or credit card is required before food preparation.',
      messageClosing: 'Please confirm availability and tell me how I can pay by card. Thank you!',
      serviceDineIn: 'Dine in',
      servicePickup: 'Pick up',
      notProvided: 'Not provided',
      emailSubject: "Order request — The B's Club"
    },
    de: {
      heading: 'Plane deine Bestellung.',
      headingAccent: 'Sende sie, wenn alles stimmt.',
      intro: 'Teile uns mit, was du möchtest und wann du kommst. Wir erstellen daraus eine übersichtliche Nachricht für WhatsApp oder E-Mail.',
      paymentTitle: 'Kartenzahlung vor der Zubereitung',
      paymentCopy: 'Wir akzeptieren nur Debit- oder Kreditkarten. Die Zahlung muss vor der Zubereitung abgeschlossen sein.',
      deliveryTitle: 'Lieferung gewünscht?',
      deliveryCopy: 'Für eine Lieferung an deine Adresse bestelle bitte über Uber Eats.',
      uberButton: 'Uber Eats öffnen ↗',
      whatsappLabel: 'WhatsApp',
      emailLabel: 'E-Mail',
      languageLegend: '1. Sprache wählen',
      setLegend: 'Optional: Set wählen',
      setProductLabel: 'Sandwich- oder Food + Boba-Set',
      setQuantityLabel: 'Set-Menge',
      drinkOneLegend: 'Inklusives Boba-Getränk 1',
      drinkTwoLegend: 'Inklusives Boba-Getränk 2',
      flavourLabel: 'Sorte',
      sweetnessLabel: 'Süsse',
      iceLabel: 'Eis',
      setPriceLabel: 'Set-Preis',
      nameLabel: 'Dein Name',
      namePlaceholder: 'Name für die Bestellung',
      itemsLegend: '2. Was möchtest du bestellen?',
      itemsHelp: 'Wähle eine oder mehrere Optionen. Mengen und Wünsche kannst du unten ergänzen.',
      foodGroup: 'Essen',
      drinksGroup: 'Getränke',
      otherDrink: 'Kaffee / anderes Getränk',
      detailsLabel: 'Mengen, Grösse und besondere Wünsche',
      detailsPlaceholder: 'Beispiel: 2× Green Curry Chicken, nicht scharf; 1× Matcha Latte gross',
      serviceLegend: '3. Wie möchtest du die Bestellung erhalten?',
      dineIn: 'Im Café essen',
      pickup: 'Abholen',
      dateLabel: 'Datum',
      timeLabel: 'Ankunfts- / Abholzeit',
      notesLabel: 'Noch etwas? (optional)',
      notesPlaceholder: 'Allergien, Fragen oder ein anderes Getränk von unserer Karte',
      paymentConfirm: 'Ich verstehe, dass nur Debit- oder Kreditkarten akzeptiert werden und vor der Zubereitung bezahlt werden muss.',
      sendWhatsapp: 'Mit WhatsApp senden',
      sendEmail: 'Per E-Mail senden',
      privacyNote: 'Deine Angaben bleiben im Browser, bis du WhatsApp oder E-Mail auswählst.',
      itemRequired: 'Bitte wähle mindestens ein Essen oder Getränk.',
      openingWhatsapp: 'WhatsApp wird mit deiner Bestellung geöffnet…',
      openingEmail: 'Deine E-Mail-App wird mit der Bestellung geöffnet…',
      messageTitle: "Hallo The B's Club! Ich möchte gerne bestellen.",
      messageName: 'Name',
      messageItems: 'Bestellung',
      messageDetails: 'Mengen / Wünsche',
      messageService: 'Service',
      messageDate: 'Datum',
      messageTime: 'Zeit',
      messageNotes: 'Notizen',
      messagePayment: 'Ich verstehe, dass vor der Zubereitung mit Debit- oder Kreditkarte bezahlt werden muss.',
      messageClosing: 'Bitte bestätigt die Verfügbarkeit und teilt mir mit, wie ich mit Karte bezahlen kann. Vielen Dank!',
      serviceDineIn: 'Im Café essen',
      servicePickup: 'Abholen',
      notProvided: 'Keine Angabe',
      emailSubject: "Bestellanfrage — The B's Club"
    },
    th: {
      heading: 'วางแผนรายการสั่งซื้อ',
      headingAccent: 'พร้อมแล้วส่งหาเราได้เลย',
      intro: 'กรอกสิ่งที่ต้องการและเวลาที่จะมาถึง ระบบจะจัดข้อความให้พร้อมส่งทาง WhatsApp หรืออีเมล',
      paymentTitle: 'ชำระด้วยบัตรก่อนเริ่มเตรียมอาหาร',
      paymentCopy: 'ทางร้านรับเฉพาะบัตรเดบิตหรือเครดิต และต้องชำระเงินก่อนเริ่มทำอาหาร',
      deliveryTitle: 'ต้องการเดลิเวอรี?',
      deliveryCopy: 'กรุณาสั่งผ่าน Uber Eats หากต้องการให้จัดส่งถึงที่อยู่ของคุณ',
      uberButton: 'เปิด Uber Eats ↗',
      whatsappLabel: 'WhatsApp',
      emailLabel: 'อีเมล',
      languageLegend: '1. เลือกภาษาที่ต้องการสื่อสาร',
      setLegend: 'ตัวเลือก: เลือกชุดเมนู',
      setProductLabel: 'ชุดแซนด์วิชหรืออาหาร + Boba',
      setQuantityLabel: 'จำนวนชุด',
      drinkOneLegend: 'Boba ที่รวมในชุด แก้วที่ 1',
      drinkTwoLegend: 'Boba ที่รวมในชุด แก้วที่ 2',
      flavourLabel: 'รสชาติ',
      sweetnessLabel: 'ความหวาน',
      iceLabel: 'น้ำแข็ง',
      setPriceLabel: 'ราคาชุด',
      nameLabel: 'ชื่อของคุณ',
      namePlaceholder: 'ชื่อสำหรับรายการสั่งซื้อ',
      itemsLegend: '2. ต้องการสั่งอะไร?',
      itemsHelp: 'เลือกอย่างน้อย 1 รายการ แล้วระบุจำนวนและคำขอเพิ่มเติมด้านล่าง',
      foodGroup: 'อาหาร',
      drinksGroup: 'เครื่องดื่ม',
      otherDrink: 'กาแฟ / เครื่องดื่มอื่น',
      detailsLabel: 'จำนวน ขนาด และคำขอเพิ่มเติม',
      detailsPlaceholder: 'ตัวอย่าง: Green Curry Chicken 2 ที่ ไม่เผ็ด; Matcha Latte แก้วใหญ่ 1 แก้ว',
      serviceLegend: '3. ต้องการรับอาหารอย่างไร?',
      dineIn: 'รับประทานที่ร้าน',
      pickup: 'มารับที่ร้าน',
      dateLabel: 'วันที่',
      timeLabel: 'เวลาที่จะมาถึง / เวลารับ',
      notesLabel: 'ข้อมูลเพิ่มเติม (ไม่บังคับ)',
      notesPlaceholder: 'ข้อมูลการแพ้อาหาร คำถาม หรือเครื่องดื่มอื่นจากเมนู',
      paymentConfirm: 'ฉันเข้าใจว่าทางร้านรับเฉพาะบัตรเดบิตหรือเครดิต และต้องชำระเงินก่อนเริ่มทำอาหาร',
      sendWhatsapp: 'ส่งทาง WhatsApp',
      sendEmail: 'ส่งทางอีเมล',
      privacyNote: 'ข้อมูลจะอยู่ในเบราว์เซอร์ของคุณจนกว่าจะเลือกส่งทาง WhatsApp หรืออีเมล',
      itemRequired: 'กรุณาเลือกอาหารหรือเครื่องดื่มอย่างน้อย 1 รายการ',
      openingWhatsapp: 'กำลังเปิด WhatsApp พร้อมรายการสั่งซื้อ…',
      openingEmail: 'กำลังเปิดแอปอีเมลพร้อมรายการสั่งซื้อ…',
      messageTitle: "สวัสดี The B's Club ต้องการสั่งอาหาร/เครื่องดื่มค่ะ/ครับ",
      messageName: 'ชื่อ',
      messageItems: 'รายการ',
      messageDetails: 'จำนวน / คำขอเพิ่มเติม',
      messageService: 'การรับอาหาร',
      messageDate: 'วันที่',
      messageTime: 'เวลา',
      messageNotes: 'หมายเหตุ',
      messagePayment: 'รับทราบว่าต้องชำระด้วยบัตรเดบิตหรือเครดิตก่อนเริ่มเตรียมอาหาร',
      messageClosing: 'กรุณายืนยันรายการและแจ้งวิธีชำระด้วยบัตร ขอบคุณค่ะ/ครับ',
      serviceDineIn: 'รับประทานที่ร้าน',
      servicePickup: 'มารับที่ร้าน',
      notProvided: 'ไม่ได้ระบุ',
      emailSubject: "คำขอสั่งอาหาร — The B's Club"
    }
  };

  const pageLanguage = document.body?.dataset?.pageLanguage;
  if (pageLanguage === 'de' || pageLanguage === 'en') {
    const pageLanguageRadio = orderForm?.querySelector(`input[name="language"][value="${pageLanguage}"]`);
    if (pageLanguageRadio) pageLanguageRadio.checked = true;
  }

  const setProduct = orderForm?.elements.setProduct;
  const setQuantity = orderForm?.elements.setQuantity;
  const setPricePreview = document.querySelector('#set-price-preview');
  const drinkModifiers = [...(orderForm?.querySelectorAll('[data-drink-modifier]') || [])];

  const getOrderLanguage = () => orderForm?.elements.language?.value || pageLanguage || 'en';
  const getOrderCopy = () => orderTranslations[getOrderLanguage()] || orderTranslations.en;

  const setOrderLanguage = () => {
    const copy = getOrderCopy();
    document.querySelectorAll('[data-order-i18n]').forEach((element) => {
      const key = element.dataset.orderI18n;
      if (copy[key]) element.textContent = copy[key];
    });
    document.querySelectorAll('[data-order-placeholder]').forEach((element) => {
      const key = element.dataset.orderPlaceholder;
      if (copy[key]) element.placeholder = copy[key];
    });
    const firstItem = orderForm?.querySelector('input[name="items"]');
    firstItem?.setCustomValidity('');
    setProduct?.setCustomValidity('');
    if (orderStatus) orderStatus.textContent = '';
  };

  const getSetItem = () => window.TheBsMenu?.getMenuItem?.(setProduct?.value || '') || null;

  const syncSetModifiers = () => {
    const copy = getOrderCopy();
    const item = getSetItem();
    const requiredDrinks = item ? window.TheBsMenu?.getIncludedDrinkCount?.(item.id) || 0 : 0;

    drinkModifiers.forEach((group, index) => {
      const enabled = index < requiredDrinks;
      group.hidden = !enabled;
      group.querySelectorAll('select').forEach((select) => {
        select.disabled = !enabled;
        select.required = enabled && select.name.startsWith('bobaFlavour');
        select.setCustomValidity('');
        if (!enabled) {
          select.value = '';
        } else if (select.name.startsWith('sweetness') && !select.value) {
          select.value = '50%';
        } else if (select.name.startsWith('ice') && !select.value) {
          select.value = 'Normal';
        }
      });
    });

    if (setQuantity) setQuantity.required = Boolean(item);
    if (setPricePreview) {
      setPricePreview.textContent = item ? `${copy.setPriceLabel}: CHF ${item.price.toFixed(2)}` : '';
    }
    setProduct?.setCustomValidity('');
    orderForm?.querySelector('input[name="items"]')?.setCustomValidity('');
    if (orderStatus) orderStatus.textContent = '';
  };

  if (orderDate) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
    orderDate.min = localToday;
  }

  orderForm?.querySelectorAll('input[name="language"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      setOrderLanguage();
      syncSetModifiers();
    });
  });

  setProduct?.addEventListener('change', () => {
    syncSetModifiers();
    if (setProduct.value && typeof window.gtag === 'function') {
      window.gtag('event', 'set_selection', {
        set_id: setProduct.value,
        language: getOrderLanguage(),
        cta_location: 'order_form'
      });
    }
  });

  document.querySelectorAll('[data-order-set]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!setProduct) return;
      setProduct.value = link.dataset.orderSet || '';
      syncSetModifiers();
      if (setProduct.value && typeof window.gtag === 'function') {
        window.gtag('event', 'set_selection', {
          set_id: setProduct.value,
          language: pageLanguage || getOrderLanguage(),
          cta_location: 'menu_card'
        });
      }
    });
  });

  orderForm?.querySelectorAll('input[name="items"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      orderForm.querySelector('input[name="items"]')?.setCustomValidity('');
      if (orderStatus) orderStatus.textContent = '';
    });
  });

  setOrderLanguage();
  syncSetModifiers();

  const formatOrderDate = (value, language) => {
    if (!value) return '';
    const locale = { en: 'en-GB', de: 'de-CH', th: 'th-TH' }[language] || 'en-GB';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
  };

  orderForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const copy = getOrderCopy();
    const selectedItems = [...orderForm.querySelectorAll('input[name="items"]:checked')].map((item) => item.value);
    const firstItem = orderForm.querySelector('input[name="items"]');
    const selectedSetId = setProduct?.value || '';

    if (selectedItems.length === 0 && !selectedSetId) {
      firstItem?.setCustomValidity(copy.itemRequired);
      firstItem?.reportValidity();
      firstItem?.focus();
      if (orderStatus) orderStatus.textContent = copy.itemRequired;
      return;
    }
    firstItem?.setCustomValidity('');

    const data = new FormData(orderForm);
    const language = getOrderLanguage();
    let setLines = [];

    if (selectedSetId) {
      const drinks = drinkModifiers
        .filter((group) => !group.hidden)
        .map((group) => {
          const flavour = group.querySelector('select[name^="bobaFlavour"]');
          const sweetness = group.querySelector('select[name^="sweetness"]');
          const ice = group.querySelector('select[name^="ice"]');
          return {
            flavour: flavour?.selectedOptions[0]?.textContent.trim() || '',
            sweetness: sweetness?.selectedOptions[0]?.textContent.trim() || '',
            ice: ice?.selectedOptions[0]?.textContent.trim() || ''
          };
        });
      const selection = {
        setId: selectedSetId,
        quantity: Number(setQuantity?.value),
        drinks
      };
      const setLanguage = language === 'de' ? 'de' : 'en';
      const validation = window.TheBsOrder?.validateSetSelection?.(window.TheBsMenu, selection, setLanguage);
      if (!validation?.valid) {
        const message = validation?.errors?.join(' ') || copy.itemRequired;
        setProduct?.setCustomValidity(message);
        setProduct?.reportValidity();
        setProduct?.focus();
        if (orderStatus) orderStatus.textContent = message;
        return;
      }
      setProduct?.setCustomValidity('');
      setLines = window.TheBsOrder.formatSetOrderLines(window.TheBsMenu, selection, setLanguage);
    }

    const service = data.get('service') === 'dine-in' ? copy.serviceDineIn : copy.servicePickup;
    const details = String(data.get('orderDetails') || '').trim() || copy.notProvided;
    const notes = String(data.get('notes') || '').trim() || copy.notProvided;
    const lines = [
      copy.messageTitle,
      '',
      `${copy.messageName}: ${String(data.get('customerName')).trim()}`,
      `${copy.messageItems}: ${selectedItems.join(', ') || copy.notProvided}`,
      ...(setLines.length ? ['', ...setLines] : []),
      `${copy.messageDetails}: ${details}`,
      `${copy.messageService}: ${service}`,
      `${copy.messageDate}: ${formatOrderDate(String(data.get('orderDate')), language)}`,
      `${copy.messageTime}: ${data.get('orderTime')}`,
      `${copy.messageNotes}: ${notes}`,
      '',
      `✓ ${copy.messagePayment}`,
      '',
      copy.messageClosing
    ];
    const message = lines.join('\n');
    const channel = event.submitter?.value || 'whatsapp';

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'order_contact_click', { channel, language, service: data.get('service') });
      window.gtag('event', 'conversion', {
        send_to: googleAdsConversions.contact
      });
    }

    if (channel === 'email') {
      if (orderStatus) orderStatus.textContent = copy.openingEmail;
      const subject = `${copy.emailSubject} — ${String(data.get('customerName')).trim()}`;
      window.location.href = `mailto:bublee.interlaken@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      return;
    }

    if (orderStatus) orderStatus.textContent = copy.openingWhatsapp;
    window.open(`https://wa.me/41767742027?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
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

  document.querySelectorAll('.language-switch a').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'language_switch', {
          language: link.getAttribute('href') === '/en/' ? 'en' : 'de',
          cta_location: 'header'
        });
      }
    });
  });

  document.querySelectorAll('#sandwich-sets details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open && typeof window.gtag === 'function') {
        window.gtag('event', 'sandwich_details_open', {
          set_id: 'sandwich-all',
          language: pageLanguage || getOrderLanguage(),
          cta_location: 'sandwich_details'
        });
      }
    });
  });

  document.querySelector('.sandwich-uber a')?.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'set_uber_eats_click', {
        set_id: 'sandwich-all',
        language: pageLanguage || getOrderLanguage(),
        cta_location: 'sandwich_section'
      });
    }
  });

  document.querySelectorAll('[data-cta="directions"]').forEach((directionsLink) => {
    directionsLink.addEventListener('click', () => {
      const ctaLocation = directionsLink.dataset.ctaLocation || 'unknown';
      const payload = { cta_location: ctaLocation };
      const articleId = document.body.dataset.articleId;
      if (articleId) {
        payload.article_id = articleId;
        payload.language = document.documentElement.lang;
        payload.device_category = window.innerWidth < 768
          ? 'mobile'
          : window.innerWidth < 1024 ? 'tablet' : 'desktop';
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'directions_click', payload);
        window.gtag('event', 'conversion', {
          send_to: googleAdsConversions.directions
        });
      } else {
        if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
        window.dataLayer.push({
          event: 'directions_click',
          ...payload
        });
      }
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
