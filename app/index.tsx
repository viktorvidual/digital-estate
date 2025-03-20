import React from 'react';
import { ScrollView } from 'tamagui';
import { Hero, Statistics, HowItWorks, SecondCTA, FAQ } from '@/components/HomeScreen';

export default function HomeScreen() {
  return (
    <ScrollView
      pb={32}
      contentContainerStyle={{
        rowGap: 32,
      }}
    >
      <Hero />
      <Statistics />
      <HowItWorks />
      <SecondCTA />
      <FAQ />
    </ScrollView>
  );
}
