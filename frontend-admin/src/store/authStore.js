import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FIREBASE_CONFIGURED, auth } from '../config/firebase';

const DEMO_ADMIN = {
  uid: 'admin-001',
  email: 'admin@paradigmshift.com',
  displayName: 'Vikram Patel',
  name: 'Vikram Patel',
  photoURL: null,
  role: 'Super Admin',
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) => {
        if (user) {
          localStorage.setItem('adminToken', 'admin-token-active');
          localStorage.setItem('adminEmail', user.email || '');
        }
        set({ user, isAuthenticated: !!user, loading: false });
      },

      setLoading: (loading) => set({ loading }),

      logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'admin-auth-storage',
      version: 1,
    }
  )
);

// Listen for Firebase auth state changes (only when Firebase is configured)
if (FIREBASE_CONFIGURED && auth) {
  import('firebase/auth').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(auth, (user) => {
      useAuthStore.getState().setUser(user);
    });
  });
}
