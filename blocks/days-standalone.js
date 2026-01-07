/**
 * Routines Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Plus, ArrowLeft, Check, Calendar, Clock, Repeat, Bell, Trash2, Edit2, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface Routine {
  id: string;
  title: string;
  description?: string;
  type: 'routine' | 'task' | 'reminder';
  schedule: {
    type: 'daily' | 'weekly' | 'custom';
    time?: string; // HH:MM format
    days?: number[]; // 0-6 for Sunday-Saturday
    dates?: number[]; // days of month
  };
  notifications: boolean;
  completed: {
    [date: string]: boolean; // YYYY-MM-DD format
  };
  createdAt: number;
  streak: number;
  longestStreak: number;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface RoutinesProps {
  onBack?: () => void;
  accessToken?: string;
}

export default function Routines: React.FC<RoutinesProps> = ({ onBack, accessToken }) => {
  const [routines, setRoutines] = React.useState<Routine[]>([]);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [editingRoutine, setEditingRoutine] = React.useState<Routine | null>(null);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>('default');

  // Form state
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = React.useState<'routine' | 'task' | 'reminder'>('routine');
  const [scheduleType, setScheduleType] = React.useState<'daily' | 'weekly' | 'custom'>('daily');
  const [time, setTime] = React.useState('09:00');
  const [selectedDays, setSelectedDays] = React.useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
  const [enableNotifications, setEnableNotifications] = React.useState(true);

  React.useEffect(() => {
    if (accessToken) {
      fetchRoutines();
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Schedule notification checks
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [accessToken]);

  const fetchRoutines = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-291c16de/routines`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.routines) {
        setRoutines(data.routines);
      }
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast.error('Failed to load routines');
    }
  };

  const saveRoutineToServer = async (routine: Routine) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-291c16de/routines`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routine),
        }
      );
      
      if (!response.ok) throw new Error('Failed to save routine');
      return await response.json();
    } catch (error) {
      console.error('Error saving routine:', error);
      toast.error('Failed to save routine');
      throw error;
    }
  };

  const deleteRoutineFromServer = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-291c16de/routines/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to delete routine');
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast.error('Failed to delete routine');
      throw error;
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  const sendNotification = (routine: Routine) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MoveTheMind Reminder', {
        body: `Time for: ${routine.title}`,
        icon: '/icon.png',
        badge: '/icon.png',
        tag: routine.id,
        requireInteraction: true,
      });
    }
  };

  const checkNotifications = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDate = now.toISOString().split('T')[0];

    routines.forEach(routine => {
      if (!routine.notifications) return;
      if (routine.completed[currentDate]) return; // Already completed today

      const shouldNotify = 
        (routine.schedule.type === 'daily' && routine.schedule.time === currentTime) ||
        (routine.schedule.type === 'weekly' && routine.schedule.days?.includes(currentDay) && routine.schedule.time === currentTime);

      if (shouldNotify) {
        sendNotification(routine);
      }
    });
  };

  const calculateStreak = (routine: Routine): number => {
    const today = new Date();
    let streak = 0;
    let date = new Date(today);

    // Check backwards from today
    while (true) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      // Check if this day should be counted based on schedule
      const shouldCount = 
        routine.schedule.type === 'daily' ||
        (routine.schedule.type === 'weekly' && routine.schedule.days?.includes(dayOfWeek));

      if (shouldCount) {
        if (routine.completed[dateStr]) {
          streak++;
        } else {
          break;
        }
      }

      date.setDate(date.getDate() - 1);
      
      // Don't go back more than 365 days
      if (streak > 365) break;
    }

    return streak;
  };

  const toggleComplete = async (routineId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Find routine to update
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    const newCompleted = {
      ...routine.completed,
      [today]: !routine.completed[today],
    };
    const newStreak = calculateStreak({ ...routine, completed: newCompleted });
    const newLongestStreak = Math.max(newStreak, routine.longestStreak);

    const updatedRoutine = {
      ...routine,
      completed: newCompleted,
      streak: newStreak,
      longestStreak: newLongestStreak,
    };

    // Optimistic update
    setRoutines(prev => prev.map(r => r.id === routineId ? updatedRoutine : r));

    // Sync to server
    await saveRoutineToServer(updatedRoutine);
    toast.success('Routine updated!');
  };

  const createRoutine = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (enableNotifications) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error('Notification permission denied');
      }
    }

    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      title,
      description,
      type,
      schedule: {
        type: scheduleType,
        time: scheduleType !== 'custom' ? time : undefined,
        days: scheduleType === 'weekly' ? selectedDays : undefined,
      },
      notifications: enableNotifications,
      completed: {},
      createdAt: Date.now(),
      streak: 0,
      longestStreak: 0,
    };

    // Optimistic update
    setRoutines(prev => [...prev, newRoutine]);
    resetForm();
    setShowCreateDialog(false);

    // Sync to server
    await saveRoutineToServer(newRoutine);
    toast.success('Routine created!');
  };

  const updateRoutine = async () => {
    if (!editingRoutine || !title.trim()) return;

    if (enableNotifications && notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }

    const updatedRoutine = {
      ...editingRoutine,
      title,
      description,
      type,
      schedule: {
        type: scheduleType,
        time: scheduleType !== 'custom' ? time : undefined,
        days: scheduleType === 'weekly' ? selectedDays : undefined,
      },
      notifications: enableNotifications,
    };

    // Optimistic update
    setRoutines(prev => prev.map(r => r.id === editingRoutine.id ? updatedRoutine : r));
    
    resetForm();
    setEditingRoutine(null);

    // Sync to server
    await saveRoutineToServer(updatedRoutine);
    toast.success('Routine updated!');
  };

  const deleteRoutine = async (id: string) => {
    // Optimistic update
    setRoutines(prev => prev.filter(r => r.id !== id));
    
    // Sync to server
    await deleteRoutineFromServer(id);
    toast.success('Routine deleted');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('routine');
    setScheduleType('daily');
    setTime('09:00');
    setSelectedDays([1, 2, 3, 4, 5]);
    setEnableNotifications(true);
  };

  const openEditDialog = (routine: Routine) => {
    setEditingRoutine(routine);
    setTitle(routine.title);
    setDescription(routine.description || '');
    setType(routine.type);
    setScheduleType(routine.schedule.type);
    setTime(routine.schedule.time || '09:00');
    setSelectedDays(routine.schedule.days || [1, 2, 3, 4, 5]);
    setEnableNotifications(routine.notifications);
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const today = new Date().toISOString().split('T')[0];
  const todayRoutines = routines.filter(r => {
    const dayOfWeek = new Date().getDay();
    return r.schedule.type === 'daily' || r.schedule.days?.includes(dayOfWeek);
  });

  return createElement('div', {className: 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6'}, '<div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              createElement('ArrowLeft', {className: 'w-5 h-5'})
            </Button>
          )}
          <div className="flex-1 text-center">
            createElement('h1', {className: 'text-3xl mb-2'}, 'Routines & Habits')
            createElement('p', {className: 'text-slate-400'}, 'Build consistency, track progress')
          </div>
          <Button
            size="icon"
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            createElement('Plus', {className: 'w-5 h-5'})
          </Button>
        </div>

        {/* Today's Tasks */}
        {todayRoutines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              createElement('Calendar', {className: 'w-5 h-5 text-blue-400'})
              Today's Routines
            </h2>
            <div className="space-y-3">
              {todayRoutines.map(routine => (
                <Card
                  key={routine.id}
                  className={`p-4 ${
                    routine.completed[today]
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-slate-800/50 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleComplete(routine.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        routine.completed[today]
                          ? 'bg-green-500 border-green-500'
                          : 'border-slate-600 hover:border-blue-500'
                      }`}
                    >
                      {routine.completed[today] && createElement('Check', {className: 'w-4 h-4 text-white'})}
                    </button>
                    
                    <div className="flex-1">
                      createElement('h3', null, '{routine.title}')
                      {routine.description && (
                        createElement('p', {className: 'text-sm text-slate-400 mt-1'}, '{routine.description}')
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        {routine.schedule.time && (
                          <span className="flex items-center gap-1">
                            createElement('Clock', {className: 'w-3 h-3'})
                            {routine.schedule.time}
                          </span>
                        )}
                        {routine.streak > 0 && (
                          <span className="flex items-center gap-1 text-orange-400">
                            createElement('Flame', {className: 'w-3 h-3'})
                            {routine.streak} day streak
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(routine)}
                        className="text-slate-400 hover:text-white"
                      >
                        createElement('Edit2', {className: 'w-4 h-4'})
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRoutine(routine.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        createElement('Trash2', {className: 'w-4 h-4'})
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>')}

        {/* All Routines */}
        {routines.length === 0 ? (
          <div className="text-center py-12">
            createElement('Calendar', {className: 'w-12 h-12 text-slate-600 mx-auto mb-4'})
            createElement('p', {className: 'text-slate-400 mb-4'}, 'No routines yet')
            createElement('Button', null, 'setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600">
              Create Your First Routine')
          </div>
        ) : (
          <div>
            createElement('h2', {className: 'text-xl mb-4'}, 'All Routines')
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routines.map(routine => (
                <Card key={routine.id} className="p-4 bg-slate-800/50 border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      createElement('h3', {className: 'mb-1'}, '{routine.title}')
                      {routine.description && (
                        createElement('p', {className: 'text-sm text-slate-400'}, '{routine.description}')
                      )}
                    </div>
                    createElement('span', {className: 'px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400'}, '{routine.type}')
                  </div>

                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      createElement('Repeat', {className: 'w-4 h-4'})
                      createElement('span', null, '{routine.schedule.type === 'daily' && 'Every day'}
                        {routine.schedule.type === 'weekly' && 
                          routine.schedule.days?.map(d => DAYS_OF_WEEK[d]).join(', ')}')
                    </div>
                    {routine.schedule.time && (
                      <div className="flex items-center gap-2">
                        createElement('Clock', {className: 'w-4 h-4'})
                        createElement('span', null, '{routine.schedule.time}')
                      </div>
                    )}
                    {routine.notifications && (
                      <div className="flex items-center gap-2">
                        createElement('Bell', {className: 'w-4 h-4'})
                        createElement('span', null, 'Notifications enabled')
                      </div>
                    )}
                  </div>

                  {routine.longestStreak > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-orange-400">
                        createElement('Flame', {className: 'w-4 h-4'})
                        Current: {routine.streak} days
                      </span>
                      createElement('span', {className: 'text-slate-500'}, 'Best: {routine.longestStreak} days')
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showCreateDialog || editingRoutine !== null} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingRoutine(null);
            resetForm();
          }
        }}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              createElement('DialogTitle', null, '{editingRoutine ? 'Edit Routine' : 'Create Routine'}')
              createElement('DialogDescription', null, '{editingRoutine ? 'Update your daily routine and schedule' : 'Create a new daily routine to build consistent habits'}')
            </DialogHeader>

            <div className="space-y-4">
              <div>
                createElement('Label', null, 'Title *')
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning meditation"
                  className="mt-2 bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                createElement('Label', null, 'Description')
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  className="mt-2 bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                createElement('Label', null, 'Type')
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger className="mt-2 bg-slate-800 border-slate-700">
                    createElement('SelectValue', null)
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    createElement('SelectItem', {value: 'routine'}, 'Routine')
                    createElement('SelectItem', {value: 'task'}, 'Task')
                    createElement('SelectItem', {value: 'reminder'}, 'Reminder')
                  </SelectContent>
                </Select>
              </div>

              <div>
                createElement('Label', null, 'Schedule')
                <Select value={scheduleType} onValueChange={(v: any) => setScheduleType(v)}>
                  <SelectTrigger className="mt-2 bg-slate-800 border-slate-700">
                    createElement('SelectValue', null)
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    createElement('SelectItem', {value: 'daily'}, 'Daily')
                    createElement('SelectItem', {value: 'weekly'}, 'Weekly')
                  </SelectContent>
                </Select>
              </div>

              {scheduleType === 'weekly' && (
                <div>
                  createElement('Label', null, 'Days of Week')
                  <div className="flex gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day, index) => (
                      createElement('button', null, 'toggleDay(index)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedDays.includes(index)
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {day[0]}')
                    ))}
                  </div>
                </div>
              )}

              {scheduleType !== 'custom' && (
                <div>
                  createElement('Label', null, 'Time')
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                createElement('Label', null, 'Enable Notifications')
                createElement('Switch', {onCheckedChange: setEnableNotifications})
              </div>

              <div className="flex gap-3 pt-4">
                createElement('Button', {variant: 'outline'}, '{
                    setShowCreateDialog(false);
                    setEditingRoutine(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel')
                createElement('Button', {className: 'flex-1 bg-blue-500 hover:bg-blue-600', onClick: editingRoutine ? updateRoutine : createRoutine}, '{editingRoutine ? 'Update' : 'Create'}')
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
