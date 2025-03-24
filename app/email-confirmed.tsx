import React from 'react';
import { MyXStack, MyText, MyYStack } from '@/components/shared';
import { router } from 'expo-router';
import { Button, YStack } from 'tamagui';

export default function ConfirmEmailScreen() {
  return (
    <MyYStack justify="center" items="center" flex={1}>
      <YStack width={'100%'} gap="$3" $lg={{ width: 500 }}>
        <MyText type="title" fw="bold" text="center">
          Вашият имейл е потвърден.
        </MyText>
        <Button onPress={() => router.navigate('/login')} bg="$blue10">
          <MyText size="$4" fw="bold" color="white">
            Вход
          </MyText>
        </Button>
      </YStack>
    </MyYStack>
  );
}
