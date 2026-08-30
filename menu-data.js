(function exposeMenuCatalog(root, factory) {
  const catalog = factory();
  if (typeof module === 'object' && module.exports) module.exports = catalog;
  if (root) root.TheBsMenu = catalog;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createMenuCatalog() {
  const names = Object.freeze({
    'sandwich-regular': Object.freeze({ de: 'Regular Sandwich-Set', en: 'Regular Sandwich Set' }),
    'sandwich-double': Object.freeze({ de: 'Double Sandwich-Set', en: 'Double Sandwich Set' }),
    'sandwich-sharing': Object.freeze({ de: 'Sharing Sandwich-Set', en: 'Sharing Sandwich Set' }),
    'katsu-chicken': Object.freeze({
      de: 'Crispy Chicken Katsu Curry + Boba-Getränk nach Wahl',
      en: 'Crispy Chicken Katsu Curry + Any Boba Drink'
    }),
    'red-curry-chicken': Object.freeze({
      de: 'Thai Red Curry Chicken + Boba-Getränk nach Wahl',
      en: 'Thai Red Curry Chicken + Any Boba Drink'
    }),
    'green-curry-chicken': Object.freeze({
      de: 'Thai Green Curry Chicken + Boba-Getränk nach Wahl',
      en: 'Thai Green Curry Chicken + Any Boba Drink'
    }),
    'thai-basil-chicken': Object.freeze({
      de: 'Thai Basil Chicken + Boba-Getränk nach Wahl',
      en: 'Thai Basil Chicken + Any Boba Drink'
    }),
    'red-curry-tofu': Object.freeze({
      de: 'Thai Red Curry Tofu + Boba-Getränk nach Wahl',
      en: 'Thai Red Curry Tofu + Any Boba Drink'
    }),
    'green-curry-tofu': Object.freeze({
      de: 'Thai Green Curry Tofu + Boba-Getränk nach Wahl',
      en: 'Thai Green Curry Tofu + Any Boba Drink'
    })
  });

  const freezeItem = (item) => Object.freeze({ ...item, name: names[item.id] });

  const sandwichSets = Object.freeze([
    freezeItem({
      id: 'sandwich-regular',
      kind: 'sandwich',
      price: 16.90,
      sandwiches: 1,
      drinks: 1,
      surcharge: 0,
      protein: 'pork',
      image: '/images/campaign/v5/sandwich-regular.jpg'
    }),
    freezeItem({
      id: 'sandwich-double',
      kind: 'sandwich',
      price: 24.90,
      sandwiches: 2,
      drinks: 1,
      surcharge: 0,
      protein: 'pork',
      image: '/images/campaign/v5/sandwich-double.jpg'
    }),
    freezeItem({
      id: 'sandwich-sharing',
      kind: 'sandwich',
      price: 31.90,
      sandwiches: 2,
      drinks: 2,
      surcharge: 0,
      protein: 'pork',
      image: '/images/campaign/v5/sandwich-sharing.jpg'
    })
  ]);

  const foodCombos = Object.freeze([
    { id: 'katsu-chicken', price: 23.90, protein: 'chicken' },
    { id: 'red-curry-chicken', price: 24.90, protein: 'chicken' },
    { id: 'green-curry-chicken', price: 24.90, protein: 'chicken' },
    { id: 'thai-basil-chicken', price: 24.90, protein: 'chicken' },
    { id: 'red-curry-tofu', price: 23.90, protein: 'tofu' },
    { id: 'green-curry-tofu', price: 23.90, protein: 'tofu' }
  ].map((item) => freezeItem({
    ...item,
    kind: 'food-boba',
    sandwiches: 0,
    drinks: 1,
    surcharge: 0,
    image: `/images/campaign/v5/food-boba-${item.id}.jpg`
  })));

  const allItems = Object.freeze([...sandwichSets, ...foodCombos]);
  const getMenuItem = (id) => allItems.find((item) => item.id === id) || null;
  const getIncludedDrinkCount = (id) => getMenuItem(id)?.drinks || 0;

  return Object.freeze({ sandwichSets, foodCombos, allItems, getMenuItem, getIncludedDrinkCount });
}));
