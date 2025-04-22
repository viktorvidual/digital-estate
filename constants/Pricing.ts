import { IsProduction } from '.';

const CATEGORIES_DEV = [
  {
    name: 'Базов',
    subtitle: 'За да опитате',
    photos: 6,
    price: {
      monthly: {
        amount: 39,
        priceId: 'price_1R9PddG2OXqPrYSSIWElH4sb',
      },
      yearly: {
        amount: 25,
        priceId: 'price_1R9PeJG2OXqPrYSSNDZi3uzG',
      },
    },
  },
  {
    name: 'Стандарт',
    subtitle: 'За агенти',
    photos: 20,
    price: {
      monthly: {
        amount: 55,
        priceId: 'price_1R9PiOG2OXqPrYSSelXUORjC',
      },
      yearly: {
        amount: 29,
        priceId: 'price_1R9PjfG2OXqPrYSSovzapmXb',
      },
    },
  },
  {
    name: 'Про',
    subtitle: 'За топ брокери',
    photos: 60,
    price: {
      monthly: {
        amount: 123,
        priceId: 'price_1R9PkBG2OXqPrYSSKTyORJjy',
      },
      yearly: {
        amount: 61,
        priceId: 'price_1R9PkeG2OXqPrYSShcpB8H4T',
      },
    },
  },
  {
    name: 'Бизнес',
    subtitle: 'За екипи, брокерски къщи и фотографи',
    photos: '60',
    price: {
      monthly: {
        amount: 0,
        priceId: '',
      },
      yearly: {
        amount: 0,
        priceId: '',
      },
    },
  },
];

const CATEGORIES_PROD = [
  {
    name: 'Базов',
    subtitle: 'За да опитате',
    photos: 6,
    price: {
      monthly: {
        amount: 39,
        priceId: 'price_1RGanuG2OXqPrYSSMH9HnmgC',
      },
      yearly: {
        amount: 25,
        priceId: 'price_1RGapHG2OXqPrYSSrQ9kAmE0',
      },
    },
  },
  {
    name: 'Стандарт',
    subtitle: 'За агенти',
    photos: 20,
    price: {
      monthly: {
        amount: 55,
        priceId: 'price_1RGaunG2OXqPrYSSwje4xmrt',
      },
      yearly: {
        amount: 29,
        priceId: 'price_1RGaxCG2OXqPrYSS2XjsxCBV',
      },
    },
  },
  {
    name: 'Про',
    subtitle: 'За топ брокери',
    photos: 60,
    price: {
      monthly: {
        amount: 123,
        priceId: 'price_1RGb2DG2OXqPrYSSOaVVvfIN',
      },
      yearly: {
        amount: 61,
        priceId: 'price_1RGb3kG2OXqPrYSSwFrFCOcY',
      },
    },
  },
  {
    name: 'Бизнес',
    subtitle: 'За екипи, брокерски къщи и фотографи',
    photos: '60',
    price: {
      monthly: {
        amount: 0,
        priceId: '',
      },
      yearly: {
        amount: 0,
        priceId: '',
      },
    },
  },
];

export const CATEGORIES = IsProduction ? CATEGORIES_PROD : CATEGORIES_DEV;
