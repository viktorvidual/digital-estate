import React from 'react';
import { ScrollView } from 'tamagui';
import { Hero, Statistics, HowItWorks, SecondCTA, FAQ } from '@/components/HomeScreen';

export default function HomeScreen() {
  return (
    <>
      <Hero />
      <Statistics />
      <HowItWorks />
      <SecondCTA />
      <FAQ />
    </>
  );
}
