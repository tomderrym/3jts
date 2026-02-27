/**
 * Protected Route Component
 * Ensures user is authenticated before rendering children
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React from 'https://esm.sh/react@18';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType;
}

export default function ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type matches required type
  if (requiredUserType && userType !== requiredUserType) {
    // Determine the appropriate redirect path based on user type
    const redirectPath =
      userType === 'mechanic'
        ? '/mechanic-dashboard'
        : userType === 'dealer'
        ? '/dealer-dashboard'
        : userType === 'electrician'
        ? '/electrician-dashboard'
        : '/home';
    
    // Prevent infinite redirect loops
    // Only redirect if:
    // 1. We're not already at the redirect path
    // 2. The redirect path is different from current path
    if (location.pathname !== redirectPath && location.pathname !== '/home') {
      console.warn(`User type mismatch: ${userType} tried to access route requiring ${requiredUserType}. Redirecting to ${redirectPath}`);
      return <Navigate to={redirectPath} replace />;
    }
    
    // If we're already at the target path or /home, just render children
    // This prevents redirect loops for edge cases
    if (location.pathname === redirectPath || location.pathname === '/home') {
      return <>{children}</>;
    }
  }

  return <>{children}</>;
};