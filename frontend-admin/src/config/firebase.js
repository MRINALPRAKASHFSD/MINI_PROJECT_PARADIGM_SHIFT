// ============================================================
// Auth Configuration — Backend API (Admin)
// ============================================================

import api from '../services/api';

export const app = null;
export const auth = null;
export const db = null;
export const googleProvider = null;
export const FIREBASE_CONFIGURED = false;

// ── Auth Functions (Backend API) ─────────────────────────────

export async function loginWithEmail(email, password) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    
    // Check if user is admin
    if (data.user.role !== 'admin' && data.user.role !== 'hr') {
      return { success: false, error: 'Unauthorized: Admin or HR access required.' };
    }

    // Store JWT - Handled by authStore persist

    return {
      success: true,
      user: {
        uid: data.user._id,
        email: data.user.email,
        displayName: data.user.name,
        name: data.user.name,
        role: data.user.role,
        department: data.user.department,
        photoURL: data.user.avatar || null,
        ...data.user,
      },
      token: data.token,
    };
  } catch (error) {
    const msg = error.response?.data?.error || 'Login failed. Check your credentials.';
    return { success: false, error: msg };
  }
}

export async function loginWithGoogle() {
  return { success: false, error: 'Google login is not available for admins.' };
}

export async function logout() {
  localStorage.removeItem('admin-token');
  localStorage.removeItem('admin-auth-storage');
  return { success: true };
}

export default app;
