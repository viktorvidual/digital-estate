import React from 'react';
import { YStack, Button, XStack, View, styled, useMedia } from 'tamagui';
import { MyXStack, MyText } from '@/components/shared';
import { BedDouble, MousePointerClick, Clock, Wallet, RefreshCcw } from '@tamagui/lucide-icons';
import { IconContainer } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { router } from 'expo-router';
import { ElementContainer } from './SecondCTA.styles';

const ELEMENTS = [
  {
    title: 'Лесно използване',
    description: 'Премахнете съществуващите мебели и добавете нови с един клик.',
    icon: () => <MousePointerClick size={20} color="$green8" />,
  },
  {
    title: 'Най-ниска цена',
    description:
      'Само за 26 лв. на  месец, можете да обзаведете вирутално до 6 стаи, 95% по-изгодно от алтернативите',
    icon: () => <Wallet size={20} color="$green8" />,
  },
  {
    title: 'Незабавни резултати',
    description: 'Генерирай снимки, готови за публикуване, само за 20 секунди.',
    icon: () => <Clock size={20} color="$green8" />,
  },
  {
    title: 'Гъвкави промени',
    description:
      'Имахте нещо друго предвид? Генерирайте още дизайни в различни стилове за секунди.',
    icon: () => <RefreshCcw size={20} color="$green8" />,
  },
];

export const SecondCTA = () => {
  const { customer } = useAuthStore();
  const media = useMedia();

  return (
    <MyXStack>
      <YStack width="100%" bg="$blue12" p="$6" rounded="$5" gap="$4">
        <XStack width={'100%'} gap="$4">
          <CTA showButton={media.lg} />
          {media.lg && <Elements />}
        </XStack>

        {!media.lg && (
          <>
            <Elements />
            <Button
              bg="$blue10"
              rounded="$5"
              p="$4"
              width={'100%'}
              onPress={() =>
                router.navigate(customer?.stripeSubscriptionStatus ? '/my-photos' : '/pricing')
              }
            >
              <MyText color="white" fw="bold">
                {customer?.stripeSubscriptionStatus ? 'Моите Снимки' : 'Oбзаведи Сега'}
              </MyText>
            </Button>
          </>
        )}
      </YStack>
    </MyXStack>
  );
};

const Elements = () => {
  return (
    <XStack
      width="100%"
      flexWrap="wrap"
      $lg={{
        width: '60%',
      }}
      gap="$2"
    >
      {ELEMENTS.map(el => {
        return (
          <ElementContainer key={el.title}>
            {el.icon()}
            <MyText color="white" fw="bold" size="$6">
              {el.title}
            </MyText>
            <MyText color="white">{el.description}</MyText>
          </ElementContainer>
        );
      })}
    </XStack>
  );
};

const CTA = ({ showButton }: { showButton?: boolean }) => {
  const { customer } = useAuthStore();

  return (
    <YStack width="100%" $lg={{ width: '40%' }} gap="$4" p="$2" justify={'center'}>
      <XStack items="center" gap="$2">
        <IconContainer>
          <BedDouble size={16} color="white" />
        </IconContainer>
        <MyText color="white" size="#2" fw="bold">
          Улеснено обзавеждане
        </MyText>
      </XStack>
      <MyText color="white" size="$9" fw="bold">
        Привлечи внимание с виртуално обзавеждане
      </MyText>
      <MyText color="white">
        Вижте защо ние сме най-бързо развиващата се компания за виртуално обзавеждане на българския
        пазар.
      </MyText>
      {showButton && (
        <Button
          bg="$blue10"
          rounded="$5"
          p="$4"
          width={'100%'}
          onPress={() =>
            router.navigate(customer?.stripeSubscriptionStatus ? '/my-photos' : '/pricing')
          }
        >
          <MyText color="white" fw="bold">
            {customer?.stripeSubscriptionStatus ? 'Моите Снимки' : 'Изполвай Сега'}
          </MyText>
        </Button>
      )}
    </YStack>
  );
};
