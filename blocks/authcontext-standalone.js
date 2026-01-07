/**
 * Auth Context
 * Provides authentication state and methods throughout the app
 */

import React, {  createContext, useContext, useEffect, useState, useMemo, useCallback  } from 'https://esm.sh/react@18';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  userType: UserType;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export default function AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType>('car_owner');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state once
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const currentSession = await authService.getCurrentSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoading(false);
        }
      } catch (error: any) {
        // Handle errors gracefully - missing session is normal when not logged in
        // Suppress "Auth session missing" errors completely - they're expected
        const errorStr = error?.message || String(error);
        if (!errorStr.includes('Auth session missing') && 
            !errorStr.includes('AuthSessionMissingError') &&
            !errorStr.includes('session_missing')) {
          console.error('Auth initialization error:', error);
        }
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    init();

    // Subscribe to auth changes - SYNCHRONOUS ONLY
    const { unsubscribe } = authService.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      
      console.log('Auth event:', event);

      // Update state synchronously - NO async operations here
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setUserType('car_owner');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(newSession);
        setUser(newSession?.user || null);
      }
      // Do NOT load profile here - it causes loops
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []); // Run once only

  // Load profile separately when user changes
  useEffect(() => {
    let mounted = true;
    let isFetching = false;

    const loadProfile = async () => {
      if (!user?.id) {
        setUserProfile(null);
        setUserType('car_owner');
        return;
      }

      // Prevent concurrent fetches
      if (isFetching) {
        return;
      }

      isFetching = true;

      try {
        const profile = await authService.getOrCreateUserProfile(user.id);
        if (mounted && profile) {
          setUserProfile(profile);
          setUserType(profile.user_type);
        } else if (mounted && !profile) {
          // Profile fetch failed but user exists - use fallback
          setUserType('car_owner');
        }
      } catch (error) {
        console.error('Profile load error:', error);
        if (mounted) {
          // Set fallback on error
          setUserType('car_owner');
        }
      } finally {
        isFetching = false;
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user?.id]); // Only re-run when user ID changes

  // Memoize callbacks to prevent context value from changing on every render
  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await authService.signInWithEmail(email, password);
    setIsLoading(false);
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata: any) => {
    setIsLoading(true);
    const { error } = await authService.signUpWithEmail(email, password, metadata);
    setIsLoading(false);
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setUserType('car_owner');
    setIsLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profile = await authService.getUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
        setUserType(profile.user_type);
      }
    }
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      session,
      userProfile,
      userType,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, session, userProfile, userType, isLoading, signIn, signUp, signOut, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};