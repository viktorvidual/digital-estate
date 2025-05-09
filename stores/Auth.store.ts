import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
// Zustand store to manage user session

export type Customer = {
  id: number;
  createdAt: string;
  uuid: string;
  email: string;
  userId: string;
  imageCount: number;
  stripeCustomerId: string;
  stripeSubscriptionId: null | string;
  stripePlanName: string;
  stripePlanDescription: string;
  stripeSubscriptionExpiry: string;
  stripeSubscriptionStatus: 'active' | 'canceled';
  stripePlanInterval: 'year' | 'month';
};

type SessionStore = {
  session: Session | null;
  user: User | null;
  customer: Customer | null;
  setSession: (session: Session | null, customer: Customer | null) => void;
  setCustomer: (customer: Customer | null) => void;
  setImageCount: (imageCount: number) => void;
};

export const useAuthStore = create<SessionStore>((set, get) => ({
  session: null,
  user: null,
  customer: null,
  setSession: (session, customer) => {
    set({
      session,
      user: session?.user || null,
      customer,
    });
  },
  setCustomer: customer => {
    set({
      customer,
    });
  },
  setImageCount: (imageCount: number) => {
    const { customer } = get();
    if (customer) {
      set({
        customer: {
          ...customer,
          imageCount,
        },
      });
    }
  },
}));
