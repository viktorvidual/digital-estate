import React from 'react';
import { YStack, XStack, Image, useMedia } from 'tamagui';
import { MyYStack } from '../shared';
import { CallToAction } from './CallToAction';
import { Benefits } from './Benefits';

export const Hero = () => {
  const media = useMedia();

  return (
    <MyYStack bg="$blue12" gap="$5" py="$5">
      <XStack>
        {media.lg && <CallToAction />}

        <YStack width="100%" height={'50vh'} $lg={{ width: '60%', height: '60vh' }}>
          <Image
            source={require('@/assets/samples/2_Furnished-Troshevo-Living-Room-Living Room-Modern.jpg')}
            maxWidth="100%"
            maxHeight="100%"
            rounded="$8"
          />
        </YStack>
      </XStack>
      {!media.lg && <CallToAction />}
      <Benefits />
    </MyYStack>
  );
};
