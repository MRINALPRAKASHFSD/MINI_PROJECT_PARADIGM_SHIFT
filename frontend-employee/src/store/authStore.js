import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user, token, refreshToken = null) => {
        set({
          user,
          token: token || null,
          refreshToken: refreshToken || null,
          isAuthenticated: !!user,
          loading: false,
        });
        if (token) localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      },

      setLoading: (loading) => set({ loading }),

      updateUser: async (updates) => {
        try {
          const api = (await import('../services/api.js')).default;
          // The auth me route is /auth/me or maybe we just put directly
          const { data } = await api.put('/auth/me', updates);
          set((state) => ({ user: { ...state.user, ...data.user } }));
          return data.user;
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);