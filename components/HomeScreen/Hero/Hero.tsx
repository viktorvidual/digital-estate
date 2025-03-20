import React from 'react';
import { XStack, useMedia } from 'tamagui';
import { MyYStack } from '../../shared';

import { CallToAction } from './CallToAction';
import { Benefits } from './Benefits';
import { HeroMedia } from './HeroMedia';
import { useWindowDimensions } from 'react-native';

export const Hero = () => {
  const media = useMedia();

  const viewPortWidth = useWindowDimensions().width;
  const componentWidth = media.lg ? viewPortWidth - viewPortWidth * 0.3 : viewPortWidth;

  console.log(componentWidth);

  return (
    <MyYStack bg="$blue12" gap="$5" py="$5">
      <XStack>
        {media.lg && <CallToAction componentWidth={componentWidth} />}
        <HeroMedia componentWidth={componentWidth} />
      </XStack>
      {!media.lg && <CallToAction componentWidth={componentWidth} />}
      <Benefits />
    </MyYStack>
  );
};
