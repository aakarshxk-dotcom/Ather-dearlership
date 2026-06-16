import { create } from 'zustand';

export type ViewMode = 'home' | 'apply' | 'gallery' | 'admin';

interface AppState {
  viewMode: ViewMode;
  adminAuthenticated: boolean;
  adminName: string;
  authChecked: boolean;
  setViewMode: (mode: ViewMode) => void;
  setAdminAuthenticated: (auth: boolean, name?: string) => void;
  setAuthChecked: (checked: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'home',
  adminAuthenticated: false,
  adminName: '',
  authChecked: false,
  setViewMode: (mode) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    set({ viewMode: mode });
  },
  setAdminAuthenticated: (auth, name = '') =>
    set({ adminAuthenticated: auth, adminName: name, authChecked: true }),
  setAuthChecked: (checked) => set({ authChecked: checked }),
}));
