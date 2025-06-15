
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string } | null;
  setLoggedIn: (status: boolean) => void;
  setUser: (user: { id: string } | null) => void;
}

// Função para recuperar o userId inicial (se existir)
const getInitialUser = (): { id: string } | null => {
  try {
    const id = localStorage.getItem('userId');
    return id ? { id } : null;
  } catch (e) {
    return null;
  }
};

const getInitialState = (): boolean => {
  try {
    return localStorage.getItem('autenticado') === 'true';
  } catch (e) {
    return false;
  }
};

export const authStore = create<AuthState>((set) => ({
  isLoggedIn: getInitialState(),
  user: getInitialUser(),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUser: (user) => set({ user }),
}));
