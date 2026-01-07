/**
 * Bookings Screen
 * View all service bookings for the current user
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BookingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { bookings, setBookings } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    loadBookings();

    // Show success message if redirected from booking creation
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, []);

  const loadBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await bookingsService.getServiceBookings(user.id, 'customer');
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return createElement('CheckCircle', {className: 'h-3 w-3'});
      case 'cancelled':
        return createElement('XCircle', {className: 'h-3 w-3'});
      case 'in_progress':
        return createElement('Loader2', {className: 'h-3 w-3 animate-spin'});
      default:
        return createElement('Clock', {className: 'h-3 w-3'});
    }
  };

  const filteredBookings =
    activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);

  const renderBookingCard = (booking: BookingWithDetails) => {
    const mechanicProfile = booking.mechanic_profiles;
    const userProfile = mechanicProfile?.user_profiles
      ? Array.isArray(mechanicProfile.user_profiles)
        ? mechanicProfile.user_profiles[0]
        : mechanicProfile.user_profiles
      : null;

    return createElement('Card', {className: 'cursor-pointer hover:shadow-md transition-shadow'}, 'navigate(`/booking/${booking.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              createElement('AvatarImage', null)
              createElement('AvatarFallback', null, '{userProfile?.full_name?.charAt(0) || 'M'}')
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                createElement('h3', {className: 'font-semibold truncate'}, '{userProfile?.full_name || 'Mechanic'}')
                createElement('Badge', {variant: 'outline'}, '{getStatusIcon(booking.status)}
                  {booking.status.replace('_', ' ')}')
              </div>

              {booking.mechanic_services?.service_name && (
                createElement('p', {className: 'text-sm text-muted-foreground mb-2'}, '{booking.mechanic_services.service_name}')
              )}

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  createElement('Calendar', {className: 'h-3 w-3'})
                  createElement('span', null, '{new Date(booking.booking_date).toLocaleDateString()} at{' '}
                    {new Date(booking.booking_date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}')
                </div>

                {booking.service_location && (
                  <div className="flex items-center gap-1">
                    createElement('MapPin', {className: 'h-3 w-3'})
                    createElement('span', {className: 'truncate'}, '{booking.service_location}')
                  </div>
                )}

                <div className="flex items-center gap-1">
                  createElement('DollarSign', {className: 'h-3 w-3'})
                  createElement('span', {className: 'font-medium text-primary'}, '${Number(booking.total_amount).toFixed(2)}')
                </div>
              </div>

              createElement('p', {className: 'text-xs text-muted-foreground mt-2'}, '{formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}')
            </div>
          </div>
        </CardContent>');
  };

  return createElement('div', {className: 'min-h-screen bg-background pb-20'}, '{/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              createElement('ChevronLeft', {className: 'h-6 w-6'})
            </Button>
            createElement('h1', {className: 'text-2xl flex-1'}, 'My Bookings')
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/service-booking')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              createElement('Plus', {className: 'h-5 w-5'})
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            createElement('TabsTrigger', {value: 'all'}, 'All')
            createElement('TabsTrigger', {value: 'pending'}, 'Pending')
            createElement('TabsTrigger', {value: 'completed'}, 'Completed')
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    createElement('Skeleton', {className: 'h-12 w-12 rounded-full'})
                    <div className="flex-1 space-y-2">
                      createElement('Skeleton', {className: 'h-5 w-32'})
                      createElement('Skeleton', {className: 'h-4 w-48'})
                      createElement('Skeleton', {className: 'h-4 w-40'})
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}')}

        {/* Empty State */}
        {!isLoading && filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              createElement('Calendar', {className: 'h-12 w-12 text-muted-foreground mx-auto mb-4'})
              createElement('h3', {className: 'font-semibold mb-2'}, 'No bookings found')
              createElement('p', {className: 'text-sm text-muted-foreground mb-4'}, '{activeTab === 'all'
                  ? "You haven't made any bookings yet"
                  : `No ${activeTab} bookings`}')
              <Button onClick={() => navigate('/service-booking')}>
                createElement('Plus', {className: 'mr-2 h-4 w-4'})
                Book a Service
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        {!isLoading && filteredBookings.length > 0 && (
          createElement('div', {className: 'space-y-3'}, '{filteredBookings.map((booking) => renderBookingCard(booking))}')
        )}
      </div>
    </div>
  );
};
