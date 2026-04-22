import { createContext, useContext, useState } from 'react';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
}

const GILDA: AppUser = {
  uid: 'gilda-001',
  displayName: 'Gilda Cuvertino',
  email: 'gilda@estudia.app',
  role: 'user',
};

const ADMIN: AppUser = {
  uid: 'aiwis-root',
  displayName: 'AIWIS Admin',
  email: 'soporte.aiwis@gmail.com',
  role: 'admin',
};

interface AuthContextType {
  user: AppUser;
  switchToAdmin: () => void;
  switchToGilda: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser>(() => {
    const saved = localStorage.getItem('estudia_user_role');
    return saved === 'admin' ? ADMIN : GILDA;
  });

  const switchToAdmin = () => { setUser(ADMIN); localStorage.setItem('estudia_user_role', 'admin'); };
  const switchToGilda = () => { setUser(GILDA); localStorage.setItem('estudia_user_role', 'user'); };

  return (
    <AuthContext.Provider value={{ user, switchToAdmin, switchToGilda, isAdmin: user.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
