import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
// Zustand store to manage user session

type SessionStore = {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<SessionStore>(set => ({
  session: null,
  user: null,
  setSession: session => {
    set({
      session,
      user: session?.user || null,
    });
  },
}));
