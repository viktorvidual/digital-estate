import React from 'react';
import { ScrollView } from 'tamagui';
import { Hero, Statistics, HowItWorks } from '@/components/HomeScreen';
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
      <HowItWorks />
    </ScrollView>
  );
}
