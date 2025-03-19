import React from 'react';

import { Hero, Statistics } from '@/components/HomeScreen';
import { ScrollView } from 'tamagui';
export default function HomeScreen() {
  return (
    <ScrollView
      pb={'$4'}
      contentContainerStyle={{
        rowGap: 32,
      }}
    >
      <Hero />
      <Statistics />
    </ScrollView>
  );
}
