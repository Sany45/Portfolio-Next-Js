import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { auth } from "./firebase";


/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Promise with user credentials or error
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: handleAuthError(error)
    };
  }
};

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise} - Promise with user credentials or error
 */
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }

    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error("Error signing up:", error);
    return {
      success: false,
      error: handleAuthError(error)
    };
  }
};

/**
 * Send password reset email to user
 * @param {string} email - User's email
 * @returns {Promise} - Promise with success or error
 */
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset email sent. Check your inbox."
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: handleAuthError(error)
    };
  }
};

/**
 * Sign out the current user
 * @returns {Promise} - Promise with success or error
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return {
      success: true,
      message: "Signed out successfully"
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the current authenticated user
 * @returns {Object|null} - Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Update user profile information
 * @param {Object} profileData - Object containing displayName and/or photoURL
 * @returns {Promise} - Promise with success or error
 */
export const updateUserProfile = async (profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "No authenticated user found"
      };
    }

    await updateProfile(user, profileData);
    return {
      success: true,
      message: "Profile updated successfully"
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise} - Promise with success or error
 */
export const updateUserEmail = async (newEmail, password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "No authenticated user found"
      };
    }

    // Re-authenticate user before changing email
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    await updateEmail(user, newEmail);
    return {
      success: true,
      message: "Email updated successfully"
    };
  } catch (error) {
    console.error("Error updating email:", error);
    return {
      success: false,
      error: handleAuthError(error)
    };
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Promise with success or error
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "No authenticated user found"
      };
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
    return {
      success: true,
      message: "Password updated successfully"
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: handleAuthError(error)
    };
  }
};

/**
 * Handle Firebase authentication errors with user-friendly messages
 * @param {Error} error - Firebase auth error
 * @returns {string} - User-friendly error message
 */
const handleAuthError = (error) => {
  const errorCode = error.code;

  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already in use. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

/**
 * Listen for authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
