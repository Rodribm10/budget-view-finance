
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string } | null;
  session: any;
  isProfileComplete: boolean;
  setLoggedIn: (status: boolean) => void;
  setUser: (user: { id: string } | null) => void;
  setSession: (session: any) => void;
  setProfileComplete: (complete: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  session: null,
  isProfileComplete: true, // Default true para não afetar usuários existentes
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfileComplete: (complete) => set({ isProfileComplete: complete }),
}));
