import { create } from 'zustand';

interface SideBarStore {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isSideBarOpen: boolean) => void;
}

export const useSideBarStore = create<SideBarStore>(set => ({
  isSideBarOpen: false,
  setIsSideBarOpen: (isSideBarOpen: boolean) => set({ isSideBarOpen }),
}));
