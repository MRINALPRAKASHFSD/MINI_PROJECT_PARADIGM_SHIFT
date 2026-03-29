// ============================================================
// Firebase Configuration (graceful fallback when not configured)
// ============================================================

let app = null;
let auth = null;
let db = null;
let storage = null;
let realtimeDb = null;
let googleProvider = null;
let microsoftProvider = null;

// ⚡ DEMO MODE: Set to false to run with static data (no Firebase needed)
// To re-enable Firebase, change this to check env vars:
//   const FIREBASE_CONFIGURED = !!(import.meta.env.VITE_FIREBASE_API_KEY && ...);
const FIREBASE_CONFIGURED = false;

if (FIREBASE_CONFIGURED) {
  // --- Dynamic imports at module level for Firebase ---
  const { initializeApp } = await import("firebase/app");
  const firebaseAuth = await import("firebase/auth");
  const firebaseFirestore = await import("firebase/firestore");
  const { getStorage: _getStorage } = await import("firebase/storage");
  const { getDatabase: _getDatabase } = await import("firebase/database");

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = firebaseAuth.getAuth(app);
  db = firebaseFirestore.getFirestore(app);
  storage = _getStorage(app);
  realtimeDb = _getDatabase(app);

  googleProvider = new firebaseAuth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
  microsoftProvider = new firebaseAuth.OAuthProvider("microsoft.com");

  console.log("[Firebase] initialized:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
} else {
  console.warn(
    "[Firebase] Not configured — running in STATIC/DEMO mode. " +
    "To enable Firebase, create frontend-employee/.env with VITE_FIREBASE_* vars."
  );
}

// --- Export services (may be null in demo mode) ---
export { app, auth, db, storage, realtimeDb, googleProvider, microsoftProvider, FIREBASE_CONFIGURED };

// ============================================================
// Auth Functions (with graceful demo-mode fallbacks)
// ============================================================

// Helper: create a mock user object
function createMockUser(email, name) {
  return {
    uid: "demo-user-" + Date.now(),
    email: email || "demo@company.com",
    displayName: name || "Demo User",
    name: name || "Demo User",
    photoURL: null,
    providerData: [],
  };
}

export async function handleAuthRedirectResult() {
  if (!FIREBASE_CONFIGURED) return { success: true, user: null };
  try {
    const { getRedirectResult } = await import("firebase/auth");
    const result = await getRedirectResult(auth);
    const user = result?.user;
    if (!user) return { success: true, user: null };
    return { success: true, user };
  } catch (error) {
    console.error("[handleAuthRedirectResult] error:", error);
    return { success: false, error: "Redirect sign-in failed." };
  }
}

export async function registerWithEmail(email, password, displayName) {
  if (!FIREBASE_CONFIGURED) {
    // Demo mode: instant success
    return { success: true, user: createMockUser(email, displayName) };
  }
  try {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    return { success: true, user };
  } catch (error) {
    console.error("[registerWithEmail] error:", error);
    return { success: false, error: error?.message || "Registration failed." };
  }
}

export async function loginWithEmail(email, password, rememberMe = false) {
  if (!FIREBASE_CONFIGURED) {
    // Demo mode: instant success
    return { success: true, user: createMockUser(email, "Employee") };
  }
  try {
    const { setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword } = await import("firebase/auth");
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("[loginWithEmail] error:", error);
    return { success: false, error: error?.message || "Login failed." };
  }
}

export async function loginWithGoogle() {
  if (!FIREBASE_CONFIGURED) {
    return { success: true, user: createMockUser("google@demo.com", "Google User") };
  }
  try {
    const { signInWithPopup } = await import("firebase/auth");
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("[loginWithGoogle] error:", error);
    return { success: false, error: error?.message || "Google login failed." };
  }
}

export async function loginWithMicrosoft() {
  if (!FIREBASE_CONFIGURED) {
    return { success: true, user: createMockUser("ms@demo.com", "Microsoft User") };
  }
  try {
    const { signInWithPopup } = await import("firebase/auth");
    const result = await signInWithPopup(auth, microsoftProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("[loginWithMicrosoft] error:", error);
    return { success: false, error: error?.message || "Microsoft login failed." };
  }
}

export async function resetPassword(email) {
  if (!FIREBASE_CONFIGURED) {
    return { success: true, message: "Password reset email sent! (demo mode)" };
  }
  try {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent! Check your inbox." };
  } catch (error) {
    console.error("[resetPassword] error:", error);
    return { success: false, error: error?.message || "Failed to send reset email." };
  }
}

export async function logout() {
  if (!FIREBASE_CONFIGURED) {
    return { success: true };
  }
  try {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
    localStorage.removeItem("rememberMe");
    return { success: true };
  } catch (error) {
    console.error("[logout] error:", error);
    return { success: false, error: "Logout failed." };
  }
}

// ============================================================
// Firestore Functions
// ============================================================

export async function getUserData(uid) {
  if (!FIREBASE_CONFIGURED) {
    return { success: true, data: { uid, role: "employee", profileComplete: true } };
  }
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) return { success: true, data: userDoc.data() };
    return { success: false, error: "User not found" };
  } catch (error) {
    console.error("[getUserData] error:", error);
    return { success: false, error: "Failed to fetch user data." };
  }
}

export async function updateUserProfile(uid, data) {
  if (!FIREBASE_CONFIGURED) {
    return { success: true };
  }
  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error("[updateUserProfile] error:", error);
    return { success: false, error: "Failed to update profile." };
  }
}

export default app;