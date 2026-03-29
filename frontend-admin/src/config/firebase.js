// ============================================================
// Firebase Configuration for Admin Portal
// (graceful fallback when not configured)
// ============================================================

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

// ⚡ DEMO MODE: Set to false to run with static data (no Firebase needed)
const FIREBASE_CONFIGURED = false;

if (FIREBASE_CONFIGURED) {
  const { initializeApp } = await import("firebase/app");
  const firebaseAuth = await import("firebase/auth");
  const firebaseFirestore = await import("firebase/firestore");

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = firebaseAuth.getAuth(app);
  db = firebaseFirestore.getFirestore(app);
  googleProvider = new firebaseAuth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  console.log("[Firebase Admin] initialized:", { projectId: firebaseConfig.projectId });
} else {
  console.warn(
    "[Firebase Admin] Not configured — running in DEMO mode. " +
    "To enable, create frontend-admin/.env with VITE_FIREBASE_* vars."
  );
}

export { app, auth, db, googleProvider, FIREBASE_CONFIGURED };

// ============================================================
// Auth Functions (demo-mode fallbacks)
// ============================================================

function createMockAdmin(email, name) {
  return {
    uid: "admin-" + Date.now(),
    email: email || "admin@paradigmshift.com",
    displayName: name || "Admin User",
    name: name || "Admin User",
    photoURL: null,
    role: "admin",
  };
}

// Demo admin credentials
const DEMO_ADMINS = [
  { email: 'admin@paradigmshift.com', password: 'admin123', name: 'Vikram Patel', role: 'Super Admin' },
  { email: 'hr@paradigmshift.com', password: 'hr123', name: 'Ananya Gupta', role: 'HR Manager' },
];

export async function loginWithEmail(email, password) {
  if (!FIREBASE_CONFIGURED) {
    const admin = DEMO_ADMINS.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (admin) {
      return { success: true, user: createMockAdmin(admin.email, admin.name) };
    }
    return { success: false, error: "Invalid email or password. Use admin@paradigmshift.com / admin123" };
  }
  try {
    const { setPersistence, browserLocalPersistence, signInWithEmailAndPassword } = await import("firebase/auth");
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error?.message || "Login failed." };
  }
}

export async function loginWithGoogle() {
  if (!FIREBASE_CONFIGURED) {
    return { success: true, user: createMockAdmin("admin.google@paradigmshift.com", "Google Admin") };
  }
  try {
    const { signInWithPopup } = await import("firebase/auth");
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error?.message || "Google login failed." };
  }
}

export async function logout() {
  if (!FIREBASE_CONFIGURED) {
    return { success: true };
  }
  try {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Logout failed." };
  }
}

export default app;
