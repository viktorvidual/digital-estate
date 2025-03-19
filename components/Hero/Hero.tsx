import React from 'react';
import { YStack, XStack, Image, SizableText, useMedia, Button, Text } from 'tamagui';
import { MyYStack } from '@/components/shared/YStack/YStack';

const CallToAction = () => {
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

export const Hero = () => {
  const media = useMedia();

  return (
    <MyYStack bg="$blue12">
      <XStack my="$5">
        {media.lg && <CallToAction />}

        <YStack width="100%" height={'50vh'} $lg={{ width: '60%', height: '60vh' }}>
          <Image
            source={require('@/assets/samples/2_Furnished-Troshevo-Living-Room-Living Room-Modern.jpg')}
            maxWidth="100%"
            maxHeight="100%"
            rounded="$4"
          />
        </YStack>
      </XStack>
      {!media.lg && <CallToAction />}
    </MyYStack>
  );
};
