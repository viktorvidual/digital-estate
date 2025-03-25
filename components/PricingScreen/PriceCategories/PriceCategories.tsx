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
      monthly: number;
      yearly: number;
    };
  };
}) => {
  const media = useMedia();

  const { selectedPricing } = usePricingStore();
  const price = selectedPricing === 'monthly' ? category.price.monthly : category.price.yearly;

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

        <XStack mt="$3" gap="$2" alignItems="center">
          <MyText fw="bold" size="$8">
            {price}
          </MyText>
          <MyText fw="medium">лв. / месец</MyText>
        </XStack>

        <XStack mt="$3" gap="$2" alignItems="center">
          <MyText size="$4">{(price / category.photos).toFixed(2)}</MyText>
          <MyText size="$4">лв. / снимка</MyText>
        </XStack>

        <Button mt="$3" bg="$blue10" borderRadius="$10">
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
  borderRadius: '$10',
  backgroundColor: 'white',
  padding: 8,
  width: '100%',
  $lg: {
    width: '23%',
  },
});

const CategoryInnerContainer = styled(YStack, {
  borderRadius: '$9',
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
      monthly: 40,
      yearly: 26,
    },
  },
  {
    name: 'Стандарт',
    subtitle: 'За агенти',
    photos: 20,
    price: {
      monthly: 56,
      yearly: 32,
    },
  },
  {
    name: 'Професионален',
    subtitle: 'За топ брокери',
    photos: 60,
    price: {
      monthly: 128,
      yearly: 63,
    },
  },
  {
    name: 'Премиум',
    subtitle: 'За екипи, брокерски къщи и фотографи',
    photos: 100,
    price: {
      monthly: 0,
      yearly: 0,
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
