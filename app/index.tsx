import React from 'react';

import { Hero } from '@/components/Hero/Hero';
import { ScrollView } from 'tamagui';
export default function HomeScreen() {
  return (
    <ScrollView>
      <Hero />
    </ScrollView>
  );
}
