import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  actions: {
    login: (user: User) => void;
    logout: () => void;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  actions: {
    login: (user: User) => {
      set({ isAuthenticated: true, user });
    },
    logout: () => {
      set({ isAuthenticated: false, user: null });
    }
  }
}));

export type { User };