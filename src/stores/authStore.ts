
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

// Initialize with the persisted value from localStorage
const getInitialState = (): boolean => {
  try {
    return localStorage.getItem('autenticado') === 'true';
  } catch (e) {
    return false;
  }
};

export const authStore = create<AuthState>((set) => ({
  isLoggedIn: getInitialState(),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
}));
