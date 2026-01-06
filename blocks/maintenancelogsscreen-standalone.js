/**
 * MaintenanceLogsScreen Component
 * Props: { onBack?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { Upload, Calendar, Edit3, DollarSign, Car, BookOpen, Save, XCircle, FileWarning } from 'lucide-react';

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

interface UserData {
  [email: string]: { profileData?: { name: string; } };
}

const MaintenanceLogsScreen = ({
  onBack,
  userRole,
  currentUserEmail,
  logs,
  setLogs,
  allUsers,
  triggerToast
}: {
  onBack: () => void;
  userRole: 'customer' | 'mechanic' | 'admin';
  currentUserEmail: string;
  logs: MaintenanceLog[];
  setLogs: React.Dispatch<React.SetStateAction<MaintenanceLog[]>>;
  allUsers: UserData;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredLogs = logs
    .filter(log => {
      if (userRole === 'customer') {
        return log.customerEmail === currentUserEmail;
      }
      if (userRole === 'mechanic') {
        return log.mechanicEmail === currentUserEmail;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !description.trim()) {
      triggerToast('Date and Description are required to add a log.', 'error');
      return;
    }

    const newLog: MaintenanceLog = {
      id: Date.now().toString(),
      date,
      description: description.trim(),
      mileage: mileage ? parseFloat(mileage) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      notes: notes.trim(),
      receiptFileName: receiptFile ? receiptFile.name : undefined,
      customerEmail: userRole === 'customer' ? currentUserEmail : undefined,
      mechanicEmail: userRole === 'mechanic' ? currentUserEmail : undefined
    };

    setLogs([...logs, newLog]);
    setDate('');
    setDescription('');
    setMileage('');
    setCost('');
    setNotes('');
    setReceiptFile(null);
    triggerToast('Maintenance log added successfully!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const startEditNotes = (log: MaintenanceLog) => {
    setEditingLogId(log.id);
    setEditingNotes(log.notes || '');
  };

  const saveEditedNotes = (logId: string) => {
    setLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === logId ? { ...log, notes: editingNotes } : log
      )
    );
    setEditingLogId(null);
    setEditingNotes('');
    triggerToast('Notes updated successfully!', 'success');
  };

  const cancelEditNotes = () => {
    setEditingLogId(null);
    setEditingNotes('');
  };

  const getDisplayName = (email: string | undefined) => {
    if (!email) return 'N/A';
    if (allUsers[email] && allUsers[email].profileData?.name) {
      return allUsers[email].profileData.name;
    }
    return email.split('@')[0];
  };

  const renderSkeletonLogs = () => (
    <div className="flex flex-col space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="text-left">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-stretch p-0 w-full h-full overflow-y-auto">
      <HeaderBar
        title="Maintenance Logs"
        rightSlot={(
          <button
            onClick={onBack}
            className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-sm font-semibold text-white shadow-md h-[52px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Back to Dashboard
          </button>
        )}
        sticky
      />

      {(userRole === 'customer' || userRole === 'mechanic') && (
        <div className="w-full max-w-sm mx-auto space-y-6 px-4 py-4 mb-4">
          <h2 className="text-2xl font-semibold text-white">Add New Log</h2>
          <Card>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label htmlFor="logDate" className="block text-slate-300 text-sm font-medium mb-1">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    id="logDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base appearance-none pr-10"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="logDescription" className="block text-slate-300 text-sm font-medium mb-1">Description</label>
                <div className="relative">
                  <input
                    type="text"
                    id="logDescription"
                    placeholder="e.g., Oil Change, Tire Rotation"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base pr-10"
                    required
                  />
                  <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="logMileage" className="block text-slate-300 text-sm font-medium mb-1">Mileage (optional)</label>
                <div className="relative">
                  <input
                    type="number"
                    id="logMileage"
                    placeholder="e.g., 85000"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base pr-10"
                  />
                  <Car className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="logCost" className="block text-slate-300 text-sm font-medium mb-1">Cost (optional)</label>
                <div className="relative">
                  <input
                    type="number"
                    id="logCost"
                    placeholder="e.g., 75.00"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base pr-10"
                  />
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="logNotes" className="block text-slate-300 text-sm font-medium mb-1">Notes (optional)</label>
                <div className="relative">
                  <textarea
                    id="logNotes"
                    placeholder="Any specific details about the service"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full h-auto min-h-[80px] px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base pr-10"
                  ></textarea>
                  <BookOpen className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="receiptUpload" className="block text-slate-300 text-sm font-medium mb-1">Receipt (optional)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="receiptUpload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <label
                    htmlFor="receiptUpload"
                    className="flex items-center justify-center flex-grow h-12 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 border border-slate-600 rounded-lg text-white font-semibold cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                  >
                    <Upload className="mr-2" size={20} />
                    {receiptFile ? receiptFile.name : 'Choose File'}
                  </label>
                </div>
              </div>
              <PrimaryButton type="submit">
                Add Log
              </PrimaryButton>
            </form>
          </Card>
        </div>
      )}

      <div className="w-full max-w-sm mx-auto px-4 pb-4">
        <h2 className="text-2xl font-semibold text-white mt-4 mb-2">Your Logs</h2>
        {isLoading ? (
          renderSkeletonLogs()
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
              <FileWarning size={24} className="text-slate-500" />
            </div>
            <p className="font-medium text-slate-200">No maintenance history yet</p>
            <p className="text-sm max-w-sm">
              {userRole === 'customer'
                ? 'Start tracking your vehicle services by adding your first log above.'
                : 'Your service history with customers will appear here as you add logs.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 animate-[fadeIn_220ms_ease-out]">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="text-left">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-white">{log.description}</h3>
                  <span className="text-sm text-slate-400">{log.date}</span>
                </div>
                {log.mileage && <p className="text-slate-300 text-sm">Mileage: {log.mileage.toLocaleString()}</p>}
                {log.cost && <p className="text-slate-300 text-sm">Cost: ${log.cost.toFixed(2)}</p>}
                {log.customerEmail && userRole !== 'customer' && <p className="text-slate-300 text-sm">Customer: {getDisplayName(log.customerEmail)}</p>}
                {log.mechanicEmail && userRole !== 'mechanic' && <p className="text-slate-300 text-sm">Mechanic: {getDisplayName(log.mechanicEmail)}</p>}

                {editingLogId === log.id && userRole === 'mechanic' ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-base"
                      placeholder="Add/update notes..."
                    ></textarea>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveEditedNotes(log.id)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                      >
                        <Save size={16} className="inline mr-1" /> Save Notes
                      </button>
                      <button
                        onClick={cancelEditNotes}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                      >
                        <XCircle size={16} className="inline mr-1" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-between items-center">
                    {log.notes ? (
                      <p className="text-slate-400 text-sm italic">Notes: {log.notes}</p>
                    ) : (
                      (userRole === 'mechanic') && <p className="text-slate-500 text-sm italic">No notes.</p>
                    )}
                    {userRole === 'mechanic' && (
                      <button
                        onClick={() => startEditNotes(log)}
                        className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[32px]"
                      >
                        <Edit3 size={14} className="inline mr-1" /> Edit Notes
                      </button>
                    )}
                  </div>
                )}
                {log.receiptFileName && <p className="text-blue-400 text-sm mt-1 flex items-center"><Upload size={16} className="mr-1"/>{log.receiptFileName} (Mock)</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceLogsScreen;
