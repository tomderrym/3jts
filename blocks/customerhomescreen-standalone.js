/**
 * CustomerHomeScreen Component
 * Props: { userRole?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { Settings } from 'lucide-react';

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
  passwordHash: string;
  role: 'customer' | 'mechanic' | 'admin';
  profileComplete: boolean;
  profileData?: any;
}

interface Mechanic extends User {
  profileData?: { 
    name: string;
    address: string;
    services: string[];
    rating?: number; 
    reviewsCount?: number; 
    distance?: string; 
  };
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

const CustomerHomeScreen = ({
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
  mechanics,
  bookings,
  setBookings,
  allUsers,
  onEditProfile,
  onOpenMessaging,
  triggerToast,
  allReviews, 
  onAddReview, 
  mechanicAvailability,
  setMechanicAvailability,
  onBookAvailabilitySlot
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
  mechanics: Mechanic[];
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allUsers: { [email: string]: User };
  onEditProfile: () => void;
  onOpenMessaging: () => void;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  allReviews: Review[]; 
  onAddReview: (newReview: Omit<Review, 'id' | 'timestamp'> & { mechanicEmail: string; customerEmail: string }) => void; 
  mechanicAvailability: AvailabilitySlot[];
  setMechanicAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  onBookAvailabilitySlot: (slotId: string) => void;
}) => {
  const [customerCurrentView, setCustomerCurrentView] = useState<'dashboard' | 'browseMechanics' | 'maintenanceLogs'>('dashboard');

  const renderDashboard = () => (
    <div className="w-full max-w-sm mx-auto text-center space-y-6 px-4 py-4">
      createElement('p', {className: 'text-xl text-slate-200'}, 'Welcome, {userEmail.split('@')[0]}!')
      createElement('h2', {className: 'text-2xl font-semibold text-white'}, 'Customer Dashboard')
      createElement('PrimaryButton', null, 'setCustomerCurrentView('browseMechanics')}>
        Browse Mechanics')
      createElement('PrimaryButton', null, 'setCustomerCurrentView('maintenanceLogs')}
        className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 focus-visible:ring-purple-500"
      >
        View Maintenance Logs')
    </div>
  );

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

      <div className="flex-1 flex flex-col items-center">
        {customerCurrentView === 'dashboard' && renderDashboard()}
        {customerCurrentView === 'maintenanceLogs' && (
          <MaintenanceLogsScreen
            userRole={userRole as 'customer' | 'mechanic' | 'admin'}
            currentUserEmail={userEmail}
            onBack={() => setCustomerCurrentView('dashboard')}
            logs={logs}
            setLogs={setLogs}
            allUsers={allUsers}
            triggerToast={triggerToast}
          />
        )}
        {customerCurrentView === 'browseMechanics' && (
          <BrowseMechanicsScreen
            onBack={() => setCustomerCurrentView('dashboard')}
            mechanics={mechanics}
            customerEmail={userEmail}
            bookings={bookings}
            setBookings={setBookings}
            allUsers={allUsers}
            triggerToast={triggerToast}
            allReviews={allReviews}
            onAddReview={onAddReview}
            mechanicAvailability={mechanicAvailability}
            setMechanicAvailability={setMechanicAvailability}
            onBookAvailabilitySlot={onBookAvailabilitySlot}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerHomeScreen;
