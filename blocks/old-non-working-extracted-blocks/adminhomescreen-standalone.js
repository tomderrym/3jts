/**
 * AdminHomeScreen Component
 * Props: { onLogout?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';

interface User {
  email: string;
  passwordHash: string;
  role: 'customer' | 'mechanic' | 'admin';
  profileComplete: boolean;
  profileData?: any;
}

interface Booking {
  id: string;
  customerEmail: string;
  mechanicEmail: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const AdminHomeScreen = ({
  onLogout,
  users,
  onUserUpdate,
  onUserRemoval,
  bookings,
  setBookings,
  triggerToast
}: {
  onLogout: () => void;
  users: User[];
  onUserUpdate: (user: User) => void;
  onUserRemoval: (email: string) => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>; 
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'userManagement' | 'bookingsView'>('dashboard');

  const renderDashboard = () => (
    <div className="flex flex-col items-center px-4 py-4 w-full h-full max-w-sm mx-auto space-y-6">
      createElement('h2', {className: 'text-2xl font-semibold text-white'}, 'Admin Dashboard')
      createElement('p', {className: 'text-slate-400 text-center'}, 'Manage users and bookings for FilOzAutoCare.')
      createElement('PrimaryButton', null, 'setCurrentView('userManagement')}>
        User Management')
      createElement('PrimaryButton', null, 'setCurrentView('bookingsView')}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 focus-visible:ring-emerald-500"
      >
        View Bookings')
    </div>
  );

  return createElement('div', {className: 'flex flex-col items-stretch w-full h-full'}, 'createElement('HeaderBar', {title: 'Admin Panel'})

      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'userManagement' && (
        <UserManagementScreen
          users={users}
          onUserUpdate={onUserUpdate}
          onUserRemoval={onUserRemoval}
          onBack={() => setCurrentView('dashboard')}
          triggerToast={triggerToast}
        />
      )}
      {currentView === 'bookingsView' && (
        <BookingsViewScreen 
          onBack={() => setCurrentView('dashboard')}
          bookings={bookings}
          setBookings={setBookings}
          triggerToast={triggerToast}
        />
      )}');
};

export default AdminHomeScreen;
