(function exposeOrderBuilder(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TheBsOrder = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createOrderBuilder() {
  const labels = Object.freeze({
    de: Object.freeze({
      quantity: 'Menge',
      price: 'Set-Preis',
      drink: 'Getränk',
      sweetness: 'Süsse',
      ice: 'Eis',
      unknownSet: 'Unbekanntes Set.',
      quantityError: 'Die Menge muss eine ganze Zahl zwischen 1 und 20 sein.',
      drinkCount: 'Bitte wähle die richtige Anzahl Boba-Getränke.',
      flavour: 'Bitte wähle für jedes Boba-Getränk eine Sorte.'
    }),
    en: Object.freeze({
      quantity: 'Quantity',
      price: 'Set price',
      drink: 'Drink',
      sweetness: 'Sweetness',
      ice: 'Ice',
      unknownSet: 'Unknown set.',
      quantityError: 'Quantity must be a whole number between 1 and 20.',
      drinkCount: 'Choose the correct number of Boba drinks.',
      flavour: 'Choose a flavour for every Boba drink.'
    })
  });

  const getLabels = (language) => labels[language === 'de' ? 'de' : 'en'];
  const getItem = (catalog, id) => {
    if (!catalog || !id) return null;
    if (typeof catalog.getMenuItem === 'function') return catalog.getMenuItem(id);
    return Array.isArray(catalog.allItems)
      ? catalog.allItems.find((item) => item.id === id) || null
      : null;
  };

  function validateSetSelection(catalog, selection, language = 'en') {
    const copy = getLabels(language);
    const errors = [];
    const item = getItem(catalog, selection?.setId);

    if (!item) errors.push(copy.unknownSet);
    if (!Number.isInteger(selection?.quantity) || selection.quantity < 1 || selection.quantity > 20) {
      errors.push(copy.quantityError);
    }

    const drinks = Array.isArray(selection?.drinks) ? selection.drinks : [];
    const requiredDrinks = item ? Number(item.drinks) : 0;
    if (item && drinks.length !== requiredDrinks) errors.push(copy.drinkCount);
    if (drinks.some((drink) => !drink || typeof drink !== 'object' || !String(drink.flavour || '').trim())) {
      errors.push(copy.flavour);
    }

    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
  }

  function formatSetOrderLines(catalog, selection, language = 'en') {
    const validation = validateSetSelection(catalog, selection, language);
    if (!validation.valid) throw new TypeError(validation.errors.join(' '));

    const locale = language === 'de' ? 'de' : 'en';
    const copy = getLabels(locale);
    const item = getItem(catalog, selection.setId);
    const lines = [
      item.name[locale],
      `${copy.quantity}: ${selection.quantity}`,
      `${copy.price}: CHF ${item.price.toFixed(2)}`
    ];

    selection.drinks.forEach((drink, index) => {
      const parts = [`${copy.drink} ${index + 1}: ${String(drink.flavour).trim()}`];
      if (String(drink.sweetness || '').trim()) parts.push(`${copy.sweetness}: ${String(drink.sweetness).trim()}`);
      if (String(drink.ice || '').trim()) parts.push(`${copy.ice}: ${String(drink.ice).trim()}`);
      lines.push(parts.join(' · '));
    });

    return Object.freeze(lines);
  }

  return Object.freeze({ validateSetSelection, formatSetOrderLines });
}));
