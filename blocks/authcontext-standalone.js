/**
 * AuthContext Component
 * Props: { email?: any }
 */
import React, {  createContext, useState, useContext, ReactNode, useEffect  } from 'https://esm.sh/react@18';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoadingAuth: boolean; 
}

export default function AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const storedLoginStatus = localStorage.getItem('isLoggedIn');
      if (storedLoginStatus === 'true') {
        setIsLoggedIn(true);
      }
      setIsLoadingAuth(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    console.log(`User ${email} logged in.`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    console.log('User logged out.');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
