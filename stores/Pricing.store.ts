import { create } from 'zustand';

interface PricingStore {
  selectedPricing: 'monthly' | 'yearly';
  setSelectedPricing: (selected: 'monthly' | 'yearly') => void;
}

export const usePricingStore = create<PricingStore>(set => ({
  selectedPricing: 'monthly',
  setSelectedPricing: selected => set({ selectedPricing: selected }),
}));
