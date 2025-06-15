
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string } | null;
  setLoggedIn: (status: boolean) => void;
  setUser: (user: { id: string } | null) => void;
}

export const authStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUser: (user) => set({ user }),
}));
