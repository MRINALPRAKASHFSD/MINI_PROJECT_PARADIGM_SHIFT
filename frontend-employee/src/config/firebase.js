import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// 👉 ADD FOR REALTIME DATABASE!
import { getDatabase } from 'firebase/database';

// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCgkb1Lzk8eKLLOicMcKb4TlbaEcpomTqQ",
  authDomain: "paradigmshift-f7332.firebaseapp.com",
  projectId: "paradigmshift-f7332",
  storageBucket: "paradigmshift-f7332.firebasestorage.app",
  messagingSenderId: "578218611526",
  appId: "1:578218611526:web:6654d7b717247bcb054b47",
  measurementId: "G-8V31V133QV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// 👉 REALTIME DB EXPORT (add this!)
export const realtimeDb = getDatabase(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// ==================== AUTH FUNCTIONS ====================

export const registerWithEmail = async (email, password, displayName) => {
  try {
    console.log('📝 Registering new user:', email);   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Update profile with display name
    await updateProfile(user, { displayName });
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: 'employee',
      createdAt: serverTimestamp(),
      profileComplete: false,
      authProvider: 'email'
    });
    console.log('✅ User registered successfully:', user.email);
    return { success: true, user };
  } catch (error) {
    console.error('❌ Registration error:', error);  
    let errorMessage = 'Registration failed. Please try again.';  
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please login instead.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }
    return { success: false, error: errorMessage };
  }
};

export const loginWithEmail = async (email, password, rememberMe = false) => {
  try {
    console.log('🔑 Logging in with email:', email);  
    const userCredential = await signInWithEmailAndPassword(auth, email, password); 
    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    console.log('✅ Email login successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Login error:', error);  
    let errorMessage = 'Login failed. Please try again.';    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    return { success: false, error: errorMessage };
  }
};

export const loginWithGoogle = async () => {
  try {
    console.log('🔵 Starting Google login...');
    console.log('Auth provider configured:', googleProvider);
    // Attempt popup sign-in
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;  
    console.log('✅ Google authentication successful:', user.email);
    console.log('User details:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });  
    // Check if user document exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);  
    if (!userDoc.exists()) {
      console.log('📝 Creating new user document in Firestore...');
      // Create new user document
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'employee',
        createdAt: serverTimestamp(),
        profileComplete: false,
        authProvider: 'google',
        lastLogin: serverTimestamp()
      });
      console.log('✅ User document created successfully');
    } else {
      console.log('✅ User document exists, updating last login...');
      // Update last login time
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      console.log('✅ Last login updated');
    }
    console.log('✅ Google login completed successfully');
    return { success: true, user };
  } catch (error) {
    console.error('❌ Google login error:', error);  
    let errorMessage = 'Google login failed. Please try again.';  
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login cancelled. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup blocked by browser. Please allow popups and try again.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Please contact support.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Only one popup request is allowed at a time.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    return { success: false, error: errorMessage };
  }
};

export const loginWithMicrosoft = async () => {
  try {
    console.log('🔵 Starting Microsoft login...');
    const result = await signInWithPopup(auth, microsoftProvider); 
    const user = result.user;
    console.log('✅ Microsoft authentication successful:', user.email); 
    // Check if user document exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      console.log('📝 Creating new user document...');
      // Create new user document
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'employee',
        createdAt: serverTimestamp(),
        profileComplete: false,
        authProvider: 'microsoft',
        lastLogin: serverTimestamp()
      });
    } else {
      // Update last login
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
    }
    console.log('✅ Microsoft login completed successfully');
    return { success: true, user };
  } catch (error) {
    console.error('❌ Microsoft login error:', error); 
    let errorMessage = 'Microsoft login failed. Please try again.'; 
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login cancelled. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup blocked by browser. Please allow popups and try again.';
    }
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = async (email) => {
  try {
    console.log('📧 Sending password reset email to:', email);   
    await sendPasswordResetEmail(auth, email);   
    console.log('✅ Password reset email sent');
    return { success: true, message: 'Password reset email sent! Check your inbox.' };
  } catch (error) {
    console.error('❌ Password reset error:', error);    
    let errorMessage = 'Failed to send reset email. Please try again.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }
    return { success: false, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    console.log('🚪 Logging out...');
    await signOut(auth);
    localStorage.removeItem('rememberMe');
    console.log('✅ Logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== FIRESTORE FUNCTIONS ====================

export const getUserData = async (uid) => {
  try {
    console.log('📖 Fetching user data for:', uid);
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      console.log('✅ User data found');
      return { success: true, data: userDoc.data() };
    } else {
      console.log('❌ User not found in Firestore');
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('❌ Get user data error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    console.log('📝 Updating user profile:', uid); 
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Update profile error:', error);
    return { success: false, error: error.message };
  }
};

console.log('🔥 Firebase initialized successfully');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);

export default app;