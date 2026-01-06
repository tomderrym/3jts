/**
 * BookingsViewScreen Component
 * Props: { onBack?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { CalendarDays, Car, User, Clock, Inbox } from 'lucide-react';

interface Booking {
  id: string;
  customerEmail: string;
  mechanicEmail: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface UserData {
  [email: string]: { profileData?: { name: string; } };
}

const BookingsViewScreen = ({
  onBack,
  bookings,
  setBookings,
  allUsers,
  triggerToast
}: {
  onBack: () => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allUsers?: UserData;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) => {
  void setBookings;
  void triggerToast;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  const getDisplayName = (email: string) => {
    if (allUsers && allUsers[email] && allUsers[email].profileData?.name) {
      return allUsers[email].profileData.name;
    }
    return email.split('@')[0];
  };

  const renderSkeletonList = () => (
    <Card>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col items-stretch p-0 w-full h-full overflow-y-auto">
      <HeaderBar
        title="Bookings View"
        rightSlot={(
          <button
            onClick={onBack}
            className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-sm font-semibold text-white shadow-md h-[52px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Back
          </button>
        )}
        sticky
      />

      <div className="w-full max-w-2xl mx-auto space-y-4 px-4 py-4">
        {isLoading ? (
          renderSkeletonList()
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
              <Inbox size={24} className="text-slate-500" />
            </div>
            <p className="font-medium text-slate-200">No bookings yet</p>
            <p className="text-sm max-w-sm">
              New customer appointments will appear here once they are requested.
            </p>
          </div>
        ) : (
          <Card>
            <div className="space-y-4 animate-[fadeIn_220ms_ease-out]">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 bg-slate-800/80 rounded-lg shadow-sm border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-white">{booking.serviceType}</h3>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full
                      ${booking.status === 'confirmed' ? 'bg-green-500 text-white'
                        : booking.status === 'pending' ? 'bg-yellow-500 text-slate-900'
                        : booking.status === 'completed' ? 'bg-blue-500 text-white'
                        : 'bg-red-500 text-white'}
                    `}>{booking.status}</span>
                  </div>
                  <p className="text-slate-300 text-sm flex items-center mb-1"><User size={16} className="mr-2" />Customer: {getDisplayName(booking.customerEmail)}</p>
                  <p className="text-slate-300 text-sm flex items-center mb-1"><Car size={16} className="mr-2" />Mechanic: {getDisplayName(booking.mechanicEmail)}</p>
                  <p className="text-slate-300 text-sm flex items-center mb-1"><CalendarDays size={16} className="mr-2" />Date: {booking.date}</p>
                  <p className="text-slate-300 text-sm flex items-center"><Clock size={16} className="mr-2" />Time: {booking.time}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingsViewScreen;
