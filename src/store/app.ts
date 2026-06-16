import { create } from 'zustand';

export type ViewMode = 'home' | 'apply' | 'gallery' | 'admin';

interface AppState {
  viewMode: ViewMode;
  adminAuthenticated: boolean;
  adminName: string;
  setViewMode: (mode: ViewMode) => void;
  setAdminAuthenticated: (auth: boolean, name?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'home',
  adminAuthenticated: false,
  adminName: '',
  setViewMode: (mode) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ viewMode: mode });
  },
  setAdminAuthenticated: (auth, name = '') => set({ adminAuthenticated: auth, adminName: name }),
}));