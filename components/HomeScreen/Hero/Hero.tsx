import React from 'react';
import { YStack, XStack, Image, useMedia } from 'tamagui';
import { MyYStack } from '../../shared';

import { CallToAction } from './CallToAction';
import { Benefits } from './Benefits';
import { HeroMedia } from './HeroMedia';

export const Hero = () => {
  const media = useMedia();

  return (
    <MyYStack bg="$blue12" gap="$5" py="$5">
      <XStack>
        {media.lg && <CallToAction />}
        <HeroMedia />
      </XStack>
      {!media.lg && <CallToAction />}
      <Benefits />
    </MyYStack>
  );
};
