/**
 * AppRouter Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';







export default function AppRouter: React.FC = () => {
  return createElement('BrowserRouter', null, '<Routes>
        createElement('Route', {path: '/'})} />
        createElement('Route', {path: '/login'})} />
        createElement('Route', {path: '/signup'})} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              createElement('DashboardPage', null)
            </ProtectedRoute>
          }
        />
        <Route
          path="/studio/:appId?"
          element={
            <ProtectedRoute>
              createElement('StudioPage', null)
            </ProtectedRoute>
          }
        />
        createElement('Route', {path: '*', to: '/'})} />
      </Routes>');
};

