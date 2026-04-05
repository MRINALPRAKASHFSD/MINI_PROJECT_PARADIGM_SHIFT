// ============================================================
// Auth Configuration — Backend API (Paradigm Shift)
// ============================================================
// This replaces Firebase auth with our Express/MongoDB backend.
// All auth goes through http://localhost:5050/api/auth

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import api from '../services/api';

// Prefer env-provided Firebase config (Vercel/Vite) and fall back to baked defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCgkb1Lzk8eKLLOicMcKb4TlbaEcpomTqQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "paradigmshift-f7332.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "paradigmshift-f7332",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "paradigmshift-f7332.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "578218611526",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:578218611526:web:6654d7b717247bcb054b47",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8V31V133QV"
};

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn("[Firebase] Using built-in fallback config. Set VITE_FIREBASE_* env vars in production.");
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const FIREBASE_CONFIGURED = true;

// ── Auth Functions (Backend API) ─────────────────────────────

export async function signInWithGooglePlatform() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Handshake with Custom Backend via Google OAuth profile data
    const { data } = await api.post('/auth/google', {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
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
        department: data.user.department,
        designation: data.user.designation,
        employeeId: data.user.employeeId,
        photoURL: data.user.avatar || null,
        ...data.user,
      },
      token: data.token,
    };
  } catch (error) {
    console.error("Google Auth Error:", error);
    return { success: false, error: 'Google sign-in failed. Please try again or use standard login.' };
  }
}

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

export default app;// Sun Apr  5 08:38:02 IST 2026
