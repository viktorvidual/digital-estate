import React from 'react';
import { usePricingStore } from '@/stores';
import { MyText, MyXStack } from '@/components/shared';
import { styled, useMedia, YStack, XStack, Button } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

export const PriceCategories = () => {
  return (
    <MyXStack justify="space-between" flexWrap="wrap" gap="$3">
      {CATEGORIES.map(category => (
        <Category key={category.name} category={category} />
      ))}
    </MyXStack>
  );
};

const Category = ({
  category,
}: {
  category: {
    name: string;
    subtitle: string;
    photos: number;
    price: {
      monthly: {
        amount: number;
        priceId: string;
      };
      yearly: {
        amount: number;
        priceId: string;
      };
    };
  };
}) => {
  const media = useMedia();

  const { selectedPricing } = usePricingStore();
  const price = selectedPricing === 'monthly' ? category.price.monthly : category.price.yearly;

  const onPress = async (stripeId: string) => {
    const response = await fetch('/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId: stripeId }),
    });

    const data = await response.json();

    if (data.sessionId) {
      window.location.href = data.url;
    }

    if (data.error) {
      console.error(data.error);
    }
  };

  return (
    <CategoryContainer>
      <CategoryInnerContainer>
        <MyText size="$6" fw="bold">
          {category.name}
        </MyText>

        <MyText size="$4">{category.subtitle}</MyText>

        <XStack mt="$3" gap="$2" alignItems="center">
          <MyText fw="bold" type="title">
            {category.photos}
          </MyText>
          <MyText fw="medium">снимки / месец</MyText>
        </XStack>

        <XStack width={'100%'} justify={'space-between'}>
          <YStack>
            <XStack mt="$3" gap="$2" alignItems="center">
              <MyText fw="bold" size="$8">
                {price.amount}лв
              </MyText>
              <MyText fw="medium">/ месец</MyText>
            </XStack>

            <XStack mt="$3" gap="$2" alignItems="center">
              <MyText size="$4">{(price.amount / category.photos).toFixed(2)}лв</MyText>
              <MyText size="$4">/ снимка</MyText>
            </XStack>
          </YStack>

          {!media.lg && selectedPricing === 'monthly' && (
            <YStack mt="$3" alignSelf="center" bg="$blue12" p="$2" rounded="$6" items={'center'}>
              <MyText size="$3" color="$green7">
                Само{' '}
                <MyText fw="bold" color="$green7">
                  {category.price.yearly.amount}лв
                </MyText>{' '}
              </MyText>
              <MyText size="$3" color="$green7">
                {' '}
                (м. с год. план)
              </MyText>
            </YStack>
          )}
        </XStack>

        {selectedPricing === 'monthly' && media.lg && (
          <XStack mt="$3" alignSelf="center" bg="$blue12" p="$1" px={12} rounded="$6">
            <MyText size="$3" color="$green7">
              Само{' '}
              <MyText fw="bold" color="$green7">
                {category.price.yearly.amount}лв
              </MyText>{' '}
              (м. с год. план)
            </MyText>
          </XStack>
        )}

        <Button
          mt="$3"
          bg="$blue10"
          borderRadius="$10"
          width={'100%'}
          rounded="$6"
          onPress={() => onPress(price.priceId)}
        >
          <MyText fw="bold" color="white">
            Избери
          </MyText>
        </Button>
      </CategoryInnerContainer>
      {media.lg && <Benefits />}
    </CategoryContainer>
  );
};

const Benefits = () => {
  return (
    <YStack p="$3" gap={'$2'}>
      {BENEFITS.map(benefit => (
        <XStack key={benefit} alignItems="center" gap="$2">
          <Check size={12} color="$blue10" />
          <MyText size="$4" fw="medium">
            {benefit}
          </MyText>
        </XStack>
      ))}
    </YStack>
  );
};

const CategoryContainer = styled(YStack, {
  rounded: '$6',
  backgroundColor: 'white',
  padding: 8,
  width: '100%',
  $lg: {
    width: '24%',
  },
});

const CategoryInnerContainer = styled(YStack, {
  rounded: '$5',
  backgroundColor: 'white',
  padding: '$4',
  width: '100%',
  bg: '#EDF1F8',
});

const CATEGORIES = [
  {
    name: 'Базов',
    subtitle: 'За да опитате',
    photos: 6,
    price: {
      monthly: {
        amount: 40,
        priceId: 'price_1R6sl4G2OXqPrYSSvazdo4gk',
      },
      yearly: {
        amount: 26,
        priceId: 'price_1R6vbhG2OXqPrYSSAr9s6jWP',
      },
    },
  },
  {
    name: 'Стандарт',
    subtitle: 'За агенти',
    photos: 20,
    price: {
      monthly: {
        amount: 56,
        priceId: 'price_1R6v52G2OXqPrYSSrRPCqvqD',
      },
      yearly: {
        amount: 32,
        priceId: 'price_1R6v64G2OXqPrYSSg67QbnUA',
      },
    },
  },
  {
    name: 'Професионален',
    subtitle: 'За топ брокери',
    photos: 60,
    price: {
      monthly: {
        amount: 128,
        priceId: 'price_1R6v6tG2OXqPrYSSmPgFZiJl',
      },
      yearly: {
        amount: 63,
        priceId: 'price_1R6v8SG2OXqPrYSSo9Y82HQT',
      },
    },
  },
  {
    name: 'Премиум',
    subtitle: 'За екипи, брокерски къщи и фотографи',
    photos: 100,
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

const BENEFITS = [
  'Неограничен брой визуализации',
  'Всички стилове обзавеждане',
  'Всички видове стаи',
  'Премахване на мебели',
  '15 секунди време за обработка',
  'Съхранение на изображенията',
];
