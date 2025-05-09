import React from 'react';
import { YStack, SizableText, Button, useMedia } from 'tamagui';
import { MyText } from '../../shared/MyText/MyText';
import { useAuthStore } from '@/stores';
import { router } from 'expo-router';

export const CallToAction = () => {
  const { customer } = useAuthStore();

  const media = useMedia();

  return (
    <YStack justify="center" width={'100%'} $lg={{ width: '40%', pr: '$8' }}>
      <YStack gap="$4">
        <MyText type="title" fontWeight="bold" color="white">
          Виртуално Обзавеждане {!media.md && '\n'}с Един Клик
        </MyText>

        <SizableText size="$6" color="white">
          Качете снимка и нашият AI ще добави мебели за секунди.
        </SizableText>

        <Button
          bg="$blue10"
          onPress={() =>
            router.navigate(customer?.stripeSubscriptionStatus ? '/my-photos' : '/pricing')
          }
        >
          <SizableText size="$6" fontWeight="bold" color="white">
            {customer?.stripeSubscriptionStatus ? 'Моите Снимки' : 'Обзаведи Сега'}
          </SizableText>
        </Button>
      </YStack>
    </YStack>
  );
};
