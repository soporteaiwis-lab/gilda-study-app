import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/services/firebase';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: 'user' | 'admin';
  isLocal: boolean;
}

// Predefined local users (passwords hashed conceptually - validated at login time)
const LOCAL_USERS: Record<string, { password: string; user: AppUser }> = {
  'gilda': {
    password: '123123',
    user: {
      uid: 'local-gilda-001',
      displayName: 'Gilda Cuvertino',
      email: 'gilda@estudia.app',
      photoURL: null,
      role: 'user',
      isLocal: true,
    }
  },
  'aiwis': {
    password: '123123',
    user: {
      uid: 'local-aiwis-root',
      displayName: 'AIWIS Admin',
      email: 'soporte.aiwis@gmail.com',
      photoURL: null,
      role: 'admin',
      isLocal: true,
    }
  }
};

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInLocal: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function firebaseToAppUser(fbUser: FirebaseUser): AppUser {
  return {
    uid: fbUser.uid,
    displayName: fbUser.displayName || 'Usuario',
    email: fbUser.email || '',
    photoURL: fbUser.photoURL,
    role: 'user',
    isLocal: false,
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved local session
    const savedUser = localStorage.getItem('estudia_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.isLocal) {
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const appUser = firebaseToAppUser(fbUser);
        setUser(appUser);
        localStorage.setItem('estudia_user', JSON.stringify(appUser));
      } else {
        // Only clear if not a local user
        const saved = localStorage.getItem('estudia_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (!parsed.isLocal) {
              setUser(null);
              localStorage.removeItem('estudia_user');
            }
          } catch {
            setUser(null);
            localStorage.removeItem('estudia_user');
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const appUser = firebaseToAppUser(result.user);
      setUser(appUser);
      localStorage.setItem('estudia_user', JSON.stringify(appUser));
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInLocal = async (username: string, password: string) => {
    const entry = LOCAL_USERS[username.toLowerCase()];
    if (!entry) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    if (entry.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }
    setUser(entry.user);
    localStorage.setItem('estudia_user', JSON.stringify(entry.user));
    return { success: true };
  };

  const signOut = async () => {
    const currentUser = user;
    setUser(null);
    localStorage.removeItem('estudia_user');
    if (currentUser && !currentUser.isLocal) {
      try {
        await firebaseSignOut(auth);
      } catch { /* ignore */ }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInLocal, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
