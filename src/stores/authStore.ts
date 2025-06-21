
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string } | null;
  isProfileComplete: boolean;
  setLoggedIn: (status: boolean) => void;
  setUser: (user: { id: string } | null) => void;
  setProfileComplete: (complete: boolean) => void;
}

export const authStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  isProfileComplete: true, // Default true para não afetar usuários existentes
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUser: (user) => set({ user }),
  setProfileComplete: (complete) => set({ isProfileComplete: complete }),
}));
