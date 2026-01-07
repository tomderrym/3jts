/**
 * MechanicHomeScreen Component
 * Props: { userRole?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { Settings, Clock, Star } from 'lucide-react';

interface Message {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  text: string;
  timestamp: string;
}

interface MaintenanceLog {
  id: string;
  date: string;
  description: string;
  mileage?: number;
  cost?: number;
  notes?: string;
  receiptFileName?: string;
  mechanicEmail?: string;
  customerEmail?: string;
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

interface User {
  email: string;
  profileData?: any;
}

interface AvailabilitySlot {
  id: string;
  mechanicEmail: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Review {
  id: string;
  mechanicEmail: string;
  customerEmail: string;
  rating: number; 
  comment: string;
  timestamp: string;
}

const MechanicHomeScreen = ({
  userRole,
  userEmail,
  onLogout,
  messages,
  setMessages,
  unreadCounts,
  setUnreadCounts,
  currentChatPartnerEmail,
  setCurrentChatPartnerEmail,
  totalUnreadMessages,
  logs,
  setLogs,
  bookings,
  setBookings,
  mechanicAvailability,
  setMechanicAvailability,
  allUsers,
  onEditProfile,
  onOpenMessaging,
  triggerToast,
  allReviews 
}: {
  userRole: string;
  userEmail: string;
  onLogout: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  unreadCounts: Record<string, number>;
  setUnreadCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  currentChatPartnerEmail: string | null;
  setCurrentChatPartnerEmail: (email: string | null) => void;
  totalUnreadMessages: number;
  logs: MaintenanceLog[];
  setLogs: React.Dispatch<React.SetStateAction<MaintenanceLog[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  mechanicAvailability: AvailabilitySlot[];
  setMechanicAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  allUsers: { [email: string]: User };
  onEditProfile: () => void;
  onOpenMessaging: () => void;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  allReviews: Review[]; 
}) => {
  const [mechanicCurrentView, setMechanicCurrentView] = useState<'dashboard' | 'myAppointments' | 'maintenanceLogs' | 'myAvailability'>('dashboard');

  const mechanicReviews = allReviews.filter(r => r.mechanicEmail === userEmail);
  const averageRating = mechanicReviews.length > 0 
    ? (mechanicReviews.reduce((sum, review) => sum + review.rating, 0) / mechanicReviews.length).toFixed(1)
    : 'N/A';
  const reviewCount = mechanicReviews.length;

  return createElement('div', {className: 'flex flex-col items-stretch w-full h-full'}, '<HeaderBar
        title="FilOzAutoCare"
        leftSlot={(
          <button
            onClick={onEditProfile}
            className="h-[50px] w-[50px] bg-gray-600 hover:bg-gray-500 text-white rounded-xl shadow-md flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Edit Profile"
          >
            createElement('Settings', null)
          </button>
        )}
        rightSlot={(
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenMessaging}
              className="relative px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white shadow-md h-[52px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Messages
              {totalUnreadMessages > 0 && (
                createElement('span', {className: 'absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'}, '{totalUnreadMessages}')
              )}
            </button>
            createElement('button', {className: 'px-4 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white shadow-md h-[52px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900', onClick: onLogout}, 'Logout')')}
        sticky
      />

      {mechanicCurrentView === 'dashboard' && (
        <div className="w-full max-w-sm mx-auto text-center space-y-6 px-4 py-4">
          createElement('p', {className: 'text-xl text-slate-200'}, 'Welcome, {userEmail.split('@')[0]}!')
          createElement('h2', {className: 'text-2xl font-semibold text-white'}, 'Mechanic Dashboard')
          createElement('p', {className: 'text-slate-400'}, 'Manage your services, appointments, and profile here.')

          <div className="flex items-center justify-center text-yellow-400 text-lg">
            createElement('Star', {className: 'mr-2 fill-yellow-400'})
            createElement('span', null, '{averageRating} ({reviewCount} reviews)')
          </div>

          createElement('PrimaryButton', null, 'setMechanicCurrentView('myAppointments')}>
            View My Appointments')
          createElement('PrimaryButton', {className: 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 focus-visible:ring-indigo-500', onClick: onEditProfile}, 'Edit Profile & Services')
          createElement('PrimaryButton', null, 'setMechanicCurrentView('maintenanceLogs')}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 focus-visible:ring-emerald-500"
          >
            View & Update Maintenance Logs')
          <PrimaryButton
            onClick={() => setMechanicCurrentView('myAvailability')}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 focus-visible:ring-orange-500 flex items-center justify-center"
          >
            createElement('Clock', {className: 'mr-2'}) Manage My Availability
          </PrimaryButton>
        </div>
      )}

      {mechanicCurrentView === 'maintenanceLogs' && (
        <MaintenanceLogsScreen
          userRole={userRole as 'customer' | 'mechanic' | 'admin'}
          currentUserEmail={userEmail}
          onBack={() => setMechanicCurrentView('dashboard')}
          logs={logs}
          setLogs={setLogs}
          allUsers={allUsers}
          triggerToast={triggerToast}
        />
      )}

      {mechanicCurrentView === 'myAppointments' && (
        <MechanicAppointmentsScreen
          onBack={() => setMechanicCurrentView('dashboard')}
          mechanicEmail={userEmail}
          bookings={bookings}
          setBookings={setBookings}
          allUsers={allUsers}
          triggerToast={triggerToast}
        />
      )}

      {mechanicCurrentView === 'myAvailability' && (
        <MechanicAvailabilityScreen
          onBack={() => setMechanicCurrentView('dashboard')}
          mechanicEmail={userEmail}
          mechanicAvailability={mechanicAvailability}
          setMechanicAvailability={setMechanicAvailability}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
};

export default MechanicHomeScreen;
