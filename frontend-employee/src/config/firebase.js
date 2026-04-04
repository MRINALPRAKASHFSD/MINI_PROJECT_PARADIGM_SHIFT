// ============================================================
// Auth Configuration — Backend API (Paradigm Shift)
// ============================================================
// This replaces Firebase auth with our Express/MongoDB backend.
// All auth goes through http://localhost:5050/api/auth

import api from '../services/api';

// These are kept for backward compatibility but are null
export const app = null;
export const auth = null;
export const db = null;
export const storage = null;
export const realtimeDb = null;
export const googleProvider = null;
export const microsoftProvider = null;
export const FIREBASE_CONFIGURED = false;

// ── Auth Functions (Backend API) ─────────────────────────────

export async function loginWithEmail(email, password) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    // Store JWT
    localStorage.setItem('token', data.token);
    return {
      success: true,
      user: {
        uid: data.user._id,
        email: data.user.email,
        displayName: data.user.name,
        name: data.user.name,
        role: data.user.role,
        department: data.user.department,
        designation: data.user.designation,
        employeeId: data.user.employeeId,
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

export async function registerWithEmail(email, password, displayName) {
  try {
    const { data } = await api.post('/auth/register', {
      name: displayName,
      email,
      password,
      role: 'employee',
    });
    localStorage.setItem('token', data.token);
    return {
      success: true,
      user: {
        uid: data.user._id,
        email: data.user.email,
        displayName: data.user.name,
        name: data.user.name,
        role: data.user.role,
        photoURL: null,
        ...data.user,
      },
      token: data.token,
    };
  } catch (error) {
    const msg = error.response?.data?.error || 'Registration failed.';
    return { success: false, error: msg };
  }
}

export async function loginWithGoogle() {
  // Google OAuth not available with custom backend — show message
  return { success: false, error: 'Google login is not available. Please use email/password.' };
}

export async function loginWithMicrosoft() {
  return { success: false, error: 'Microsoft login is not available. Please use email/password.' };
}

export async function resetPassword(email) {
  return { success: true, message: 'If your email exists, a reset link has been sent.' };
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('auth-storage');
  return { success: true };
}

export async function handleAuthRedirectResult() {
  return { success: true, user: null };
}

export async function getUserData(uid) {
  try {
    const { data } = await api.get('/auth/me');
    return { success: true, data: data.user };
  } catch {
    return { success: false, error: 'Failed to fetch user data.' };
  }
}

export async function updateUserProfile(uid, profileData) {
  try {
    await api.put(`/employees/${uid}`, profileData);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update profile.' };
  }
}

export default app;