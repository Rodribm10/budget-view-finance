
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

export const authStore = create<AuthState>((set) => ({
  isLoggedIn: localStorage.getItem('autenticado') === 'true',
  setLoggedIn: (status) => set({ isLoggedIn: status }),
}));
