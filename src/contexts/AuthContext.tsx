import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  remainingDownloads: number;
  totalDownloads: number;
  serialCode: string;
  plan: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  register: (name: string, phone: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: 1,
  name: 'أحمد محمد الفني',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  remainingDownloads: 47,
  totalDownloads: 153,
  serialCode: 'STV-2024-A7X9K',
  plan: 'احترافي',
  joinDate: '2024-01-15',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (_email: string, _password: string) => {
    setUser(mockUser);
  };

  const loginWithGoogle = () => {
    setUser(mockUser);
  };

  const loginWithFacebook = () => {
    setUser(mockUser);
  };

  const register = (name: string, phone: string, email: string, _password: string) => {
    setUser({ ...mockUser, name, phone, email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, loginWithFacebook, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
