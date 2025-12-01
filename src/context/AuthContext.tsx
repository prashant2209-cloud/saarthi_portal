import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { User, authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, location?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; location?: string; bio?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken, signOut } = useClerkAuth();

  // Convert Clerk user to our User type
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || '',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    avatar: clerkUser.imageUrl,
    location: '', // Will be updated from backend
    bio: '',
    role: 'user',
    issuesReported: 0,
    issuesResolved: 0,
    reputation: 0,
    createdAt: clerkUser.createdAt?.toISOString() || '',
  } : null;

  const login = async (email: string, password: string) => {
    // Clerk handles login via SignIn component
    throw new Error('Use Clerk SignIn component for login');
  };

  const register = async (name: string, email: string, password: string, location?: string) => {
    // Clerk handles registration via SignUp component
    throw new Error('Use Clerk SignUp component for registration');
  };

  const logout = async () => {
    await signOut();
  };

  const updateProfile = async (data: { name?: string; location?: string; bio?: string }) => {
    if (!user) throw new Error('No user logged in');

    const response = await authAPI.updateProfile(data);
    // Note: Clerk user data is managed by Clerk, backend syncs additional data
  };

  const value: AuthContextType = {
    user,
    token: null, // Clerk manages tokens internally
    loading: !isLoaded,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
