import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => {
        console.log('📝 Setting user in store:', user?.email || 'No user');
        set({ 
          user, 
          isAuthenticated: !!user,
          loading: false 
        });
      },

      setLoading: (loading) => set({ loading }),

      logout: () => {
        console.log('📝 Clearing user from store');
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// 🔥 IMPORTANT: Listen to Firebase auth state changes
onAuthStateChanged(auth, (user) => {
  console.log('🔔 Auth state changed:', user?.email || 'No user');
  useAuthStore.getState().setUser(user);
});

console.log('✅ Auth store initialized');