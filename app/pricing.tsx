import React from 'react';
import { PricingHeader, PriceCategories, PricingFAQ } from '@/components/PricingScreen';
import { BlueBackground } from '@/components/ui';

export default function PricingScreen() {
  return (
    <>
      <BlueBackground />
      <PricingHeader />
      <PriceCategories />
      <PricingFAQ />
    </>
  );
}
