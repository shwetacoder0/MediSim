import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../supabase';
import { getCurrentUser, getUserProfile } from '../auth';

// Define types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  subscription_status: string;
  [key: string]: any; // Allow for additional properties
}

export interface User {
  id: string;
  email?: string;
  [key: string]: any; // Allow for additional properties
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user data
  const loadUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);

        // Get additional profile data
        try {
          const userProfile = await getUserProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user on mount
  useEffect(() => {
    loadUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            try {
              const userProfile = await getUserProfile();
              setProfile(userProfile);
            } catch (error) {
              console.error('Error loading user profile after auth change:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
