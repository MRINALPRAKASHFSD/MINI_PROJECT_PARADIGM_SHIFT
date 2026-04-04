import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user, token) => {
        set({
          user,
          token: token || null,
          isAuthenticated: !!user,
          loading: false,
        });
        if (token) localStorage.setItem('token', token);
      },

      setLoading: (loading) => set({ loading }),

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);