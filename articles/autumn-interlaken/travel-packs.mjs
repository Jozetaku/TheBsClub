export const TRIP_TYPES = ['city', 'viewpoint', 'travel'];
export const PACK_STATUSES = ['active', 'limited', 'unavailable'];
export const APPROVED_PRODUCTS = new Map([
  ['Brown Sugar Milk Tea', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Yummy Strawberry', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Iced Matcha Latte', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Mango Tea', { type: 'drink', packagingType: 'sealed-cold-cup' }],
  ['Spicy Basil Chicken', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Spicy Basil Tofu', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Green Curry Chicken', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Green Curry Tofu', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Red Curry Chicken', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Red Curry Tofu', { type: 'meal', packagingType: 'takeaway-bowl' }],
  ['Crispy Chicken Katsu Curry', { type: 'meal', packagingType: 'takeaway-bowl' }]
]);

const drinks = (names, role) => names.map((name) => ({
  name,
  type: 'drink',
  role,
  packagingType: 'sealed-cold-cup'
}));

const meals = (role) => [
  'Spicy Basil Chicken',
  'Spicy Basil Tofu',
  'Green Curry Chicken',
  'Green Curry Tofu',
  'Red Curry Chicken',
  'Red Curry Tofu',
  'Crispy Chicken Katsu Curry'
].map((name) => ({
  name,
  type: 'meal',
  role,
  packagingType: 'takeaway-bowl'
}));

export const travelPacks = [
  {
    packId: 'autumn-city-pack',
    season: 'autumn',
    tripType: 'city',
    status: 'active',
    updatedAt: '2026-08-27',
    locales: {
      en: {
        title: 'City stroll pack',
        description: 'Cold drinks selected for an easy walk around Interlaken.'
      },
      de: {
        title: 'Paket für den Stadtbummel',
        description: 'Kalte Getränke für einen entspannten Spaziergang durch Interlaken.'
      }
    },
    carryNote: {
      en: 'Cold drinks are sealed for easy carrying.',
      de: 'Kalte Getränke sind für einfachen Transport versiegelt.'
    },
    productItems: [
      ...drinks(['Yummy Strawberry', 'Mango Tea'], 'featured'),
      ...drinks(['Brown Sugar Milk Tea', 'Iced Matcha Latte'], 'optional')
    ],
    dietaryTags: [],
    image: '/articles/autumn-interlaken/pack-city.svg',
    menuUrl: '/#favourites',
    packagingType: 'sealed-cold-cup'
  },
  {
    packId: 'autumn-viewpoint-pack',
    season: 'autumn',
    tripType: 'viewpoint',
    status: 'active',
    updatedAt: '2026-08-27',
    locales: {
      en: {
        title: 'Viewpoint pack',
        description: 'A sealed drink for the climb, with meals to enjoy promptly.'
      },
      de: {
        title: 'Paket für den Aussichtspunkt',
        description: 'Ein versiegeltes Getränk für den Aufstieg, dazu Mahlzeiten zum zeitnahen Geniessen.'
      }
    },
    carryNote: {
      en: 'Drinks are sealed for easy carrying; meals are labelled consume promptly.',
      de: 'Getränke sind für einfachen Transport versiegelt; Mahlzeiten sind zum zeitnahen Geniessen gekennzeichnet.'
    },
    productItems: [
      ...drinks(['Yummy Strawberry', 'Mango Tea'], 'featured'),
      ...meals('optional')
    ],
    dietaryTags: [],
    image: '/articles/autumn-interlaken/pack-viewpoint.svg',
    menuUrl: '/#favourites',
    packagingType: 'sealed-cold-cup'
  },
  {
    packId: 'autumn-travel-pack',
    season: 'autumn',
    tripType: 'travel',
    status: 'active',
    updatedAt: '2026-08-27',
    locales: {
      en: {
        title: 'Travel pack',
        description: 'Sealed cold drinks for the journey, with eat-soon meal additions.'
      },
      de: {
        title: 'Reisepaket',
        description: 'Versiegelte Kaltgetränke für unterwegs, mit Mahlzeiten zum baldigen Essen.'
      }
    },
    carryNote: {
      en: 'Cold cups are sealed for easy carrying; meals are eat-soon additions, not all-day travel items.',
      de: 'Kaltbecher sind für einfachen Transport versiegelt; Mahlzeiten bitte bald essen, nicht für den ganzen Tag unterwegs.'
    },
    productItems: [
      ...drinks(['Mango Tea', 'Yummy Strawberry'], 'featured'),
      ...drinks(['Brown Sugar Milk Tea', 'Iced Matcha Latte'], 'optional'),
      ...meals('optional')
    ],
    dietaryTags: [],
    image: '/articles/autumn-interlaken/pack-travel.svg',
    menuUrl: '/#favourites',
    packagingType: 'sealed-cold-cup'
  }
];
