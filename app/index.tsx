import React from 'react';
import { YStack, useMedia } from 'tamagui';
import { Header } from '@/components/Header/Header';
export default function HomeScreen() {
  const media = useMedia();

  const xWidth = media.lg ? '80%' : '100%';

  return (
    <YStack flex={1} items="center" p={'$4'} fullscreen>
      <YStack width={xWidth}>
        <Header />
      </YStack>
    </YStack>
  );
}
