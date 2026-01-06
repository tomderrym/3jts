/**
 * BrowseMechanicsScreen Component
 * Props: { onBack?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { ArrowLeft, Car, MapPin, Star, Search, CalendarDays, Clock, CheckCircle, Inbox } from 'lucide-react';

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

interface Booking {
  id: string;
  customerEmail: string;
  mechanicEmail: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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

const BrowseMechanicsScreen = ({
  onBack,
  mechanics,
  customerEmail,
  bookings,
  setBookings,
  allUsers,
  triggerToast,
  allReviews, 
  onAddReview,
  mechanicAvailability,
  setMechanicAvailability,
  onBookAvailabilitySlot 
}: {
  onBack: () => void;
  mechanics: Mechanic[];
  customerEmail: string;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allUsers: { [email: string]: User };
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  allReviews: Review[]; 
  onAddReview: (newReview: Omit<Review, 'id' | 'timestamp'> & { mechanicEmail: string; customerEmail: string }) => void; 
  mechanicAvailability: AvailabilitySlot[];
  setMechanicAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>; 
  onBookAvailabilitySlot: (slotId: string) => void; 
}) => {
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false); 
  const [serviceType, setServiceType] = useState('');
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<AvailabilitySlot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  const [newReviewComment, setNewReviewComment] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  const getDisplayName = (email: string) => {
    if (allUsers[email] && allUsers[email].profileData?.name) {
      return allUsers[email].profileData.name;
    }
    return email.split('@')[0];
  };

  const handleRequestAppointment = () => {
    if (!selectedMechanic || !serviceType.trim() || !selectedSlotForBooking) {
      triggerToast('Please select a service type and an availability slot.', 'error');
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      customerEmail,
      mechanicEmail: selectedMechanic.email,
      serviceType: serviceType.trim(),
      date: selectedSlotForBooking.date,
      time: selectedSlotForBooking.startTime,
      status: 'pending'
    };

    setBookings((prevBookings) => [...prevBookings, newBooking]);
    onBookAvailabilitySlot(selectedSlotForBooking.id);

    triggerToast(`Appointment requested with ${getDisplayName(selectedMechanic.email)} for ${serviceType.trim()} on ${selectedSlotForBooking.date} at ${selectedSlotForBooking.startTime}.`, 'success');
    setShowBookingForm(false);
    setSelectedMechanic(null);
    setServiceType('');
    setSelectedSlotForBooking(null);
  };

  const handleSubmitReview = () => {
    if (!selectedMechanic || !newReviewRating || !newReviewComment.trim()) {
      triggerToast('Please provide a rating (1-5 stars) and a comment.', 'error');
      return;
    }
    if (newReviewRating < 1 || newReviewRating > 5) {
      triggerToast('Rating must be between 1 and 5 stars.', 'error');
      return;
    }

    onAddReview({
      mechanicEmail: selectedMechanic.email,
      customerEmail,
      rating: newReviewRating,
      comment: newReviewComment.trim()
    });

    setNewReviewRating(0);
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  const filteredMechanics = mechanics.filter(mechanic => {
    const name = getDisplayName(mechanic.email).toLowerCase();
    const services = mechanic.profileData?.services?.map((s: string) => s.toLowerCase()).join(' ') || '';
    const lowerSearchTerm = searchTerm.toLowerCase();
    return name.includes(lowerSearchTerm) || services.includes(lowerSearchTerm);
  });

  const today = new Date().toISOString().split('T')[0]; 

  const handleBackFromMechanicProfile = () => {
    setSelectedMechanic(null);
    setShowBookingForm(false);
    setShowReviewForm(false);
    setServiceType('');
    setSelectedSlotForBooking(null);
    setNewReviewRating(0);
    setNewReviewComment('');
  };

  if (selectedMechanic) {
    const mechanicReviews = allReviews.filter(r => r.mechanicEmail === selectedMechanic.email);
    const averageRating = mechanicReviews.length > 0 
      ? (mechanicReviews.reduce((sum, review) => sum + review.rating, 0) / mechanicReviews.length).toFixed(1)
      : 'N/A';
    const reviewCount = mechanicReviews.length;

    const relevantAvailability = mechanicAvailability
      .filter(slot => 
        slot.mechanicEmail === selectedMechanic.email && 
        new Date(slot.date) >= new Date(today)
      )
      .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime());

    if (showBookingForm) {
      return (
        <div className="flex flex-col items-stretch p-0 w-full h-full overflow-y-auto">
          <HeaderBar
            title="Request Appointment"
            leftSlot={(
              <button
                onClick={() => setShowBookingForm(false)}
                className="h-[50px] w-[50px] flex items-center justify-center text-indigo-400 hover:text-indigo-300 active:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                aria-label="Back"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            sticky
          />

          <div className="w-full max-w-sm mx-auto space-y-4 px-4 py-4">
            <Card>
              <h3 className="text-xl font-bold text-white mb-2">Booking with {getDisplayName(selectedMechanic.email)}</h3>
              <p className="text-slate-400 text-sm mb-4">Services: {selectedMechanic.profileData?.services?.join(', ') || 'N/A'}</p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="serviceType" className="block text-slate-300 text-sm font-medium mb-1">Service Type</label>
                  <input
                    type="text"
                    id="serviceType"
                    placeholder="e.g., Oil Change, Brake Inspection"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="availabilitySlot" className="block text-slate-300 text-sm font-medium mb-1">Select an Available Slot</label>
                  {relevantAvailability.length === 0 ? (
                    <p className="text-slate-400 text-sm">No available slots for this mechanic.</p>
                  ) : (
                    <div className="space-y-2">
                      {relevantAvailability.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlotForBooking(slot)}
                          className={`w-full text-left p-3 rounded-lg transition-colors duration-150 flex items-center justify-between min-h-[50px]
                            ${selectedSlotForBooking?.id === slot.id ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500'}
                          `}
                        >
                          <div>
                            <p className="font-semibold flex items-center text-sm"><CalendarDays size={16} className="mr-2" />{slot.date}</p>
                            <p className="text-xs text-slate-300 flex items-center mt-1"><Clock size={14} className="mr-2" />{slot.startTime} - {slot.endTime}</p>
                          </div>
                          {selectedSlotForBooking?.id === slot.id && <CheckCircle size={20} className="text-green-300" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <PrimaryButton
                onClick={handleRequestAppointment}
                className="mt-6 disabled:bg-indigo-800"
                disabled={!selectedSlotForBooking}
              >
                Submit Appointment Request
              </PrimaryButton>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-stretch p-0 w-full h-full overflow-y-auto">
        <HeaderBar
          title="Mechanic Profile"
          leftSlot={(
            <button
              onClick={handleBackFromMechanicProfile}
              className="h-[50px] w-[50px] flex items-center justify-center text-indigo-400 hover:text-indigo-300 active:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          sticky
        />

        <div className="w-full max-w-sm mx-auto space-y-4 px-4 py-4">
          <Card>
            <h3 className="text-xl font-bold text-white mb-2">{getDisplayName(selectedMechanic.email)}</h3>
            <p className="text-slate-400 text-sm flex items-center mb-1"><MapPin size={16} className="mr-2" />{selectedMechanic.profileData?.distance || 'N/A'} - {selectedMechanic.profileData?.address || 'N/A'}</p>
            <p className="text-slate-400 text-sm">Services: {selectedMechanic.profileData?.services?.join(', ') || 'N/A'}</p>
            <p className="text-yellow-400 text-sm flex items-center mt-2 mb-4">
              <Star size={16} className="mr-1 fill-yellow-400" />
              {averageRating} ({reviewCount} reviews)
            </p>
            
            <PrimaryButton
              onClick={() => setShowBookingForm(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-800 focus-visible:ring-emerald-500 mb-4"
            >
              Request Appointment
            </PrimaryButton>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <h4 className="text-xl font-semibold text-white mb-3">Available Slots</h4>
              {relevantAvailability.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No upcoming availability slots.</p>
              ) : (
                <div className="space-y-2">
                  {relevantAvailability.map(slot => (
                    <div key={slot.id} className="bg-slate-700 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold flex items-center text-white text-base"><CalendarDays size={16} className="mr-2" />{slot.date}</p>
                        <p className="text-slate-300 text-sm flex items-center mt-1"><Clock size={14} className="mr-2" />{slot.startTime} - {slot.endTime}</p>
                      </div>
                      <button
                        onClick={() => { setSelectedSlotForBooking(slot); setShowBookingForm(true); }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[32px]"
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <h4 className="text-xl font-semibold text-white mb-3">Customer Reviews</h4>
              {reviewCount === 0 ? (
                <p className="text-slate-400 text-sm italic">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {mechanicReviews.map(review => (
                    <div key={review.id} className="bg-slate-700 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={16} className={`mr-1 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500'}`} />
                        ))}
                        <p className="text-sm font-semibold text-white ml-2">{getDisplayName(review.customerEmail)}</p>
                      </div>
                      <p className="text-slate-300 text-sm mb-1">{review.comment}</p>
                      <p className="text-xs text-slate-500 text-right">{new Date(review.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 flex items-center justify-center"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>

              {showReviewForm && ( 
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Your Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={28}
                          className={`cursor-pointer ${star <= newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500'}`}
                          onClick={() => setNewReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reviewComment" className="block text-slate-300 text-sm font-medium mb-1">Your Comment</label>
                    <textarea
                      id="reviewComment"
                      placeholder="Share your experience..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    className="w-full h-12 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch p-0 w-full h-full overflow-y-auto">
      <HeaderBar
        title="Browse Mechanics"
        leftSlot={(
          <button
            onClick={onBack}
            className="h-[50px] w-[50px] flex items-center justify-center text-indigo-400 hover:text-indigo-300 active:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        sticky
      />

      <div className="w-full max-w-sm mx-auto space-y-4 px-4 py-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx}>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-52" />
                  <Skeleton className="h-3 w-44" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredMechanics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
              <Inbox size={24} className="text-slate-500" />
            </div>
            <p className="font-medium text-slate-200">No mechanics found</p>
            <p className="text-sm max-w-sm">
              Try adjusting your search or check again later as new mechanics join the platform.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-[fadeIn_220ms_ease-out]">
            {filteredMechanics.map((mechanic) => {
              const mechanicReviews = allReviews.filter(r => r.mechanicEmail === mechanic.email);
              const averageRating = mechanicReviews.length > 0 
                ? (mechanicReviews.reduce((sum, review) => sum + review.rating, 0) / mechanicReviews.length).toFixed(1)
                : 'N/A';
              const reviewCount = mechanicReviews.length;

              return (
                <button
                  key={mechanic.email}
                  onClick={() => setSelectedMechanic(mechanic)}
                  className="w-full bg-slate-800 p-4 rounded-lg shadow-lg text-left hover:bg-slate-700 active:bg-slate-600 transition-colors duration-150 border border-slate-700 min-h-[68px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <h3 className="text-lg font-bold text-white mb-1">{getDisplayName(mechanic.email)}</h3>
                  <p className="text-slate-400 text-sm flex items-center mb-1"><MapPin size={16} className="mr-2" />{mechanic.profileData?.distance || 'N/A'} - {mechanic.profileData?.address || 'N/A'}</p>
                  <p className="text-slate-400 text-sm">Services: {mechanic.profileData?.services?.join(', ') || 'N/A'}</p>
                  <p className="text-yellow-400 text-sm flex items-center mt-2">
                    <Star size={16} className="mr-1 fill-yellow-400" />
                    {averageRating} ({reviewCount} reviews)
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseMechanicsScreen;
