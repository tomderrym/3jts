/**
 * MechanicAppointmentsScreen Component
 * Props: { onBack?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { ArrowLeft, User, CalendarDays, Clock, CheckCircle, XCircle, CalendarX } from 'lucide-react';

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

const MechanicAppointmentsScreen = ({
  onBack,
  mechanicEmail,
  bookings,
  setBookings,
  allUsers,
  triggerToast
}: {
  onBack: () => void;
  mechanicEmail: string;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allUsers: UserData;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  const mechanicBookings = bookings
    .filter(booking => booking.mechanicEmail === mechanicEmail)
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    setBookings(prevBookings => {
      const updatedBooking = prevBookings.find(booking => booking.id === bookingId);
      if (updatedBooking) {
        triggerToast(
          `Appointment for ${updatedBooking.serviceType} ${newStatus}!`,
          (newStatus === 'confirmed' || newStatus === 'completed') ? 'success' : 'info'
        );
        return prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        );
      }
      return prevBookings;
    });
  };

  const getDisplayName = (email: string) => {
    if (allUsers[email] && allUsers[email].profileData?.name) {
      return allUsers[email].profileData.name;
    }
    return email.split('@')[0];
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              createElement('Skeleton', {className: 'h-4 w-32'})
              createElement('Skeleton', {className: 'h-5 w-20 rounded-full'})
            </div>
            createElement('Skeleton', {className: 'h-3 w-40'})
            createElement('Skeleton', {className: 'h-3 w-32'})
            createElement('Skeleton', {className: 'h-3 w-28'})
          </div>
        </Card>
      ))}
    </div>
  );

  return createElement('div', {className: 'flex flex-col items-stretch p-0 w-full h-full overflow-y-auto'}, '<HeaderBar
        title="My Appointments"
        leftSlot={(
          <button
            onClick={onBack}
            className="h-[50px] w-[50px] flex items-center justify-center text-indigo-400 hover:text-indigo-300 active:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Back"
          >
            createElement('ArrowLeft', null)
          </button>
        )}
        sticky
      />

      <div className="w-full max-w-sm mx-auto space-y-4 px-4 py-4">
        {isLoading ? (
          renderSkeletons()
        ) : mechanicBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
              createElement('CalendarX', {className: 'text-slate-500'})
            </div>
            createElement('p', {className: 'font-medium text-slate-200'}, 'No appointments scheduled')
            createElement('p', {className: 'text-sm max-w-sm'}, 'New customer bookings will appear here for you to accept, decline, or complete.')') : (
          <div className="space-y-4 animate-[fadeIn_220ms_ease-out]">
            {mechanicBookings.map((booking) => (
              <Card key={booking.id} className="text-left">
                <div className="flex justify-between items-center mb-2">
                  createElement('h3', {className: 'text-lg font-bold text-white'}, '{booking.serviceType}')
                  createElement('span', null, '{booking.status}')
                </div>
                <p className="text-slate-300 text-sm flex items-center mb-1">createElement('User', {className: 'mr-2'})Customer: {getDisplayName(booking.customerEmail)}</p>
                <p className="text-slate-300 text-sm flex items-center mb-1">createElement('CalendarDays', {className: 'mr-2'})Date: {booking.date}</p>
                <p className="text-slate-300 text-sm flex items-center mb-4">createElement('Clock', {className: 'mr-2'})Time: {booking.time}</p>

                {booking.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[40px] flex items-center justify-center"
                    >
                      createElement('CheckCircle', {className: 'inline mr-1'}) Accept
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[40px] flex items-center justify-center"
                    >
                      createElement('XCircle', {className: 'inline mr-1'}) Decline
                    </button>
                  </div>
                )}
                 {booking.status === 'confirmed' && (
                  createElement('button', null, 'handleUpdateBookingStatus(booking.id, 'completed')}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[40px] flex items-center justify-center mt-4"
                  >
                    Mark as Completed')
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicAppointmentsScreen;
