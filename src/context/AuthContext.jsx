import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile as updateProfileInDB,
} from "../services/firestoreService";

// ──────────────────────────────────────────────────────
// 🚧 DEV BYPASS: Set to true to skip Firebase auth
//    and use mock user data for viewing dashboard pages.
//    Set back to false when ready to use real auth.
// ──────────────────────────────────────────────────────
const DEV_BYPASS_AUTH = false;

const MOCK_USER = {
  uid: "dev-mock-user-001",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "",
};

const MOCK_PROFILE = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  city: "new_york",
  photoURL: "",
  runsAttended: 12,
  totalDistanceKm: 87,
  totalPoints: 20,
  isAdmin: true,
  stravaConnected: false,
  joinedAt: { toDate: () => new Date("2025-06-15") },
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    DEV_BYPASS_AUTH ? MOCK_USER : null,
  );
  const [userProfile, setUserProfile] = useState(
    DEV_BYPASS_AUTH ? MOCK_PROFILE : null,
  );
  const [loading, setLoading] = useState(DEV_BYPASS_AUTH ? false : true);

  async function signup(email, password, name, city, runningLevel) {
    if (DEV_BYPASS_AUTH) return { user: MOCK_USER };

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, { displayName: name });

    // Create Firestore profile
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    await createUserProfile(userCredential.user.uid, {
      firstName,
      lastName,
      email,
      city: city || "new_york",
      photoURL: "",
      runningLevel: runningLevel || 50,
    });

    // Fetch the profile we just created
    const profile = await getUserProfile(userCredential.user.uid);
    setUserProfile(profile);

    return userCredential;
  }

  function login(email, password) {
    if (DEV_BYPASS_AUTH) return Promise.resolve({ user: MOCK_USER });
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (DEV_BYPASS_AUTH) {
      console.log("[DEV] Logout bypassed in dev mode");
      setCurrentUser(null);
      setUserProfile(null);
      return Promise.resolve();
    }
    setUserProfile(null);
    return signOut(auth);
  }

  async function googleSignIn(city, runningLevel) {
    if (DEV_BYPASS_AUTH) return { user: MOCK_USER };

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if Firestore profile exists; if not, create one
    let profile = await getUserProfile(result.user.uid);
    if (!profile) {
      const nameParts = (result.user.displayName || "").split(" ");
      await createUserProfile(result.user.uid, {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: result.user.email || "",
        city: city || "new_york",
        photoURL: result.user.photoURL || "",
        runningLevel: runningLevel !== undefined ? runningLevel : 50,
      });
      profile = await getUserProfile(result.user.uid);
    }
    setUserProfile(profile);
    return result;
  }

  async function updateUserProfile(data) {
    if (DEV_BYPASS_AUTH) {
      // In dev mode, just update state locally
      setUserProfile((prev) => ({ ...prev, ...data }));
      console.log("[DEV] Profile updated locally:", data);
      return;
    }
    if (!currentUser) return;
    await updateProfileInDB(currentUser.uid, data);
    const updated = await getUserProfile(currentUser.uid);
    setUserProfile(updated);
  }

  useEffect(() => {
    if (DEV_BYPASS_AUTH) {
      console.log(
        "🚧 [DEV] Auth bypass active — using mock user data. Set DEV_BYPASS_AUTH = false in AuthContext.jsx to disable.",
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isAdmin: userProfile?.isAdmin === true,
    signup,
    login,
    logout,
    googleSignIn,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
