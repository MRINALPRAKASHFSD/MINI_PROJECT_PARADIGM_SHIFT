import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({ 
        user: {
          ... userData,
          profileComplete: userData.profileComplete || false,
          role: userData.role || 'Employee',
          department: userData.department || 'Engineering',
          skills: userData.skills || [],
          salary: userData.salary || 75000,
          joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
          leaves: userData.leaves || {
            casual: { total: 12, used: 2, available: 10 },
            sick: { total: 10, used: 1, available:  9 },
            annual:  { total: 20, used: 5, available:  15 },
            unpaid: { total: 0, used: 0, available: 0 }
          },
          benefits: userData.benefits || {
            healthInsurance: true,
            providentFund: true,
            bonus: 10000,
            transportation: 5000
          }
        },
        isAuthenticated: true 
      }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateProfile: (profileData) => set((state) => ({
        user:  { ...state.user, ...profileData, profileComplete: true }
      })),
      
      updateLeaves: (leaveData) => set((state) => ({
        user: { 
          ...state.user, 
          leaves: { ...state. user.leaves, ...leaveData }
        }
      }))
    }),
    {
      name: 'auth-storage',
    }
  )
);