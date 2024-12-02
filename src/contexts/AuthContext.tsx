import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN_PRINCIPAL' | 'ADMIN_SECONDAIRE' | 'USER';
  coordination?: string;
  permissions: string[];
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAdmin(user.role === 'ADMIN_PRINCIPAL' || user.role === 'ADMIN_SECONDAIRE');
      } catch (err) {
        localStorage.removeItem('user');
        console.error('Invalid stored user data:', err);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      if (email === 'narindra.defis@gmail.com' && password === 'FihinoTsifoina') {
        const mockUser: User = {
          id: '1',
          email: 'narindra.defis@gmail.com',
          name: 'Narindra',
          role: 'ADMIN_PRINCIPAL',
          coordination: 'UCP',
          permissions: ['CIR_FIANARANTSOA', 'CIR_MANAKARA', 'CIR_FORT_DAUPHIN', 'UCP']
        };
        
        setCurrentUser(mockUser);
        setIsAdmin(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        navigate('/');
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de la déconnexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAdmin,
    signIn,
    signOut,
    loading,
    error
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}