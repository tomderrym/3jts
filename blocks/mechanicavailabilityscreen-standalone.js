/**
 * MechanicAvailabilityScreen Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useCallback, useEffect  } from 'https://esm.sh/react@18';
import { ArrowLeft, PlusCircle, Trash2, Calendar, Clock, CalendarClock } from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  mechanicEmail: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface MechanicAvailabilityScreenProps {
  onBack: () => void;
  mechanicEmail: string;
  mechanicAvailability: AvailabilitySlot[];
  setMechanicAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const MechanicAvailabilityScreen = ({
  onBack,
  mechanicEmail,
  mechanicAvailability,
  setMechanicAvailability,
  triggerToast
}: MechanicAvailabilityScreenProps) => {
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredAvailability = mechanicAvailability
    .filter(slot => slot.mechanicEmail === mechanicEmail)
    .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime());

  const today = new Date().toISOString().split('T')[0];

  const handleAddSlot = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!newDate || !newStartTime || !newEndTime) {
      triggerToast('Please fill in all fields for the availability slot.', 'error');
      return;
    }

    if (new Date(newDate) < new Date(today)) {
      triggerToast('Availability date cannot be in the past.', 'error');
      return;
    }

    if (newStartTime >= newEndTime) {
      triggerToast('End time must be after start time.', 'error');
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      mechanicEmail,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    setMechanicAvailability(prev => [...prev, newSlot]);
    triggerToast('Availability slot added!', 'success');
    setNewDate('');
    setNewStartTime('');
    setNewEndTime('');
  }, [newDate, newStartTime, newEndTime, mechanicEmail, setMechanicAvailability, triggerToast, today]);

  const handleDeleteSlot = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      setMechanicAvailability(prev => prev.filter(slot => slot.id !== id));
      triggerToast('Availability slot deleted.', 'info');
    }
  }, [setMechanicAvailability, triggerToast]);

  const renderSkeletons = () => (
    <div className="flex flex-col space-y-4 mt-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="flex items-center justify-between">
          <div className="space-y-2">
            createElement('Skeleton', {className: 'h-4 w-32'})
            createElement('Skeleton', {className: 'h-3 w-28'})
          </div>
          createElement('Skeleton', {className: 'h-9 w-10'})
        </Card>
      ))}
    </div>
  );

  return createElement('div', {className: 'flex flex-col items-stretch p-0 w-full h-full overflow-y-auto'}, '<HeaderBar
        title="My Availability"
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

      <div className="w-full max-w-sm mx-auto space-y-6 px-4 py-4 mb-4">
        createElement('h2', {className: 'text-2xl font-semibold text-white'}, 'Add New Availability')
        <Card>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div>
              createElement('label', {className: 'block text-slate-300 text-sm font-medium mb-1', htmlFor: 'slotDate'}, 'Date')
              <input
                type="date"
                id="slotDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base appearance-none"
                min={today}
                required
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                createElement('label', {className: 'block text-slate-300 text-sm font-medium mb-1', htmlFor: 'startTime'}, 'Start Time')
                <input
                  type="time"
                  id="startTime"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base appearance-none"
                  required
                />
              </div>
              <div className="flex-1">
                createElement('label', {className: 'block text-slate-300 text-sm font-medium mb-1', htmlFor: 'endTime'}, 'End Time')
                <input
                  type="time"
                  id="endTime"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base appearance-none"
                  required
                />
              </div>
            </div>
            <PrimaryButton type="submit" className="flex items-center justify-center">
              createElement('PlusCircle', {className: 'mr-2'}) Add Slot
            </PrimaryButton>
          </form>
        </Card>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 pb-4">
        createElement('h2', {className: 'text-2xl font-semibold text-white mt-4'}, 'Your Current Availability')
        {isLoading ? (
          renderSkeletons()
        ) : filteredAvailability.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-4 py-8 text-center text-slate-400 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
              createElement('CalendarClock', {className: 'text-slate-500'})
            </div>
            createElement('p', {className: 'font-medium text-slate-200'}, 'No availability slots set')
            createElement('p', {className: 'text-sm max-w-sm'}, 'Add times you are available so customers can request appointments with you.')') : (
          <div className="flex flex-col space-y-4 mt-4 animate-[fadeIn_220ms_ease-out]">
            {filteredAvailability.map((slot) => (
              <Card key={slot.id} className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white flex items-center">createElement('Calendar', {className: 'mr-2'}){slot.date}</p>
                  <p className="text-slate-300 text-sm flex items-center mt-1">createElement('Clock', {className: 'mr-2'}){slot.startTime} - {slot.endTime}</p>
                </div>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="p-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[40px] flex items-center justify-center"
                  aria-label="Delete slot"
                >
                  createElement('Trash2', null)
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicAvailabilityScreen;
