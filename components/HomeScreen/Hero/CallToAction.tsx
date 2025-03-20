import React from 'react';
import { YStack, SizableText, Button, useMedia } from 'tamagui';

export const CallToAction = () => {
  const media = useMedia();

  const width = media['2xl'] ? '50%' : media.lg ? '40%' : '100%';

  console.log(width);

  return (
    <YStack justify="center" width={width} $lg={{ height: '60vh', pr: '$8', maxHeight: 600 }}>
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
