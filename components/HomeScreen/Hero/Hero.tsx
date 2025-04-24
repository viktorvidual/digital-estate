import React from 'react';
import { XStack, useMedia, View } from 'tamagui';
import { MyYStack } from '../../shared';

import { CallToAction } from './CallToAction';
import { Benefits } from './Benefits';
import { HeroMedia } from './HeroMedia';
import { useWindowDimensions } from 'react-native';

export const Hero = () => {
  const media = useMedia();

  const viewPortWidth = useWindowDimensions().width;

  return (
    <MyYStack bg="$blue12" py="$5">
      <XStack>
        {media.lg && <CallToAction />}
        <View
          width="100%"
          $lg={{
            width: '60%',
          }}
        >
          <HeroMedia />
        </View>
      </XStack>
      {!media.lg && <CallToAction />}
      <Benefits />
    </MyYStack>
  );
};
