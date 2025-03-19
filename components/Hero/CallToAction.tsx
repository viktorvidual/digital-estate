import React from 'react';
import { YStack, SizableText, Button } from 'tamagui';

export const CallToAction = () => {
  return (
    <YStack
      justify="center"
      items="center"
      width="100%"
      pr="$0"
      $lg={{ height: '60vh', width: '40%', pr: '$8' }}
    >
      <YStack gap="$4">
        <SizableText size="$10" fontWeight="bold" color="white">
          Виртуално Обзавеждане{'\n'}с Един Клик
        </SizableText>
        <SizableText size="$6" color="white">
          Качете снимка и нашият AI ще добави мебели за секунди.
        </SizableText>
        <Button bg="$blue10">
          <SizableText size="$6" fontWeight="bold" color="white">
            Изполвай Сега
          </SizableText>
        </Button>
      </YStack>
    </YStack>
  );
};
