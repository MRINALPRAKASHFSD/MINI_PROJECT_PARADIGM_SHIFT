import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FIREBASE_CONFIGURED, auth } from '../config/firebase';

const DEMO_USER = {
  uid: 'demo-001',
  email: 'rajesh.kumar@techsolutions.in',
  displayName: 'Rajesh Kumar',
  name: 'Rajesh Kumar',
  photoURL: null,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: FIREBASE_CONFIGURED ? null : DEMO_USER,
      isAuthenticated: !FIREBASE_CONFIGURED,
      loading: FIREBASE_CONFIGURED,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user, loading: false });
      },
      setLoading: (loading) => set({ loading }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      merge: (persistedState, currentState) => {
        if (!FIREBASE_CONFIGURED) {
          return {
            ...currentState,
            ...persistedState,
            user: persistedState?.user || DEMO_USER,
            isAuthenticated: true,
            loading: false,
          };
        }
        return { ...currentState, ...persistedState };
      },
    }
  )
);

if (FIREBASE_CONFIGURED && auth) {
  import('firebase/auth').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(auth, (user) => {
      useAuthStore.getState().setUser(user);
    });
  });
}