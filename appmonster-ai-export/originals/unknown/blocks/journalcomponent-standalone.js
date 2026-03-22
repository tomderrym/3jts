/**
 * JournalComponent Component
 * Props: { amount?: any, activity?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { Plus, Trash2, Tag, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  content: string;
  energyTag?: string;
  mood?: string;
  timestamp: number;
}

interface JournalComponentProps {
  energies: any[];
  onXPEarned?: (amount: number, activity: string) => void;
}

export default function JournalComponent: React.FC<JournalComponentProps> = ({ energies, onXPEarned }) => {
  const [entries, setEntries] = React.useState<JournalEntry[]>([]);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [energyTag, setEnergyTag] = React.useState('');
  const [mood, setMood] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterEnergy, setFilterEnergy] = React.useState('all');

  React.useEffect(() => {
    const stored = localStorage.getItem('movethemind_journal');
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntry = () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      energyTag,
      mood,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('movethemind_journal', JSON.stringify(updated));
    
    setContent('');
    setEnergyTag('');
    setMood('');
    setShowCreateDialog(false);
    
    onXPEarned?.(5, 'Journal Entry');
    toast.success('Entry saved');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('movethemind_journal', JSON.stringify(updated));
    toast.success('Entry deleted');
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterEnergy === 'all' || entry.energyTag === filterEnergy;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-slate-800/50 border-slate-700/50">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className="pl-10 bg-slate-900/50 border-slate-700"
            />
          </div>
          <Select value={filterEnergy} onValueChange={setFilterEnergy}>
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Energies</SelectItem>
              {energies.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      </Card>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No journal entries yet</p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600">
            Write Your First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(entry => {
            const energy = energies.find(e => e.id === entry.energyTag);
            return (
              <Card key={entry.id} className="p-4 bg-slate-800/50 border-slate-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 -mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-slate-300 whitespace-pre-wrap mb-3">{entry.content}</p>
                
                <div className="flex items-center gap-2">
                  {energy && (
                    <span className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${energy.color} bg-opacity-20`}>
                      {energy.name}
                    </span>
                  )}
                  {entry.mood && (
                    <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">
                      {entry.mood}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
            <DialogDescription>
              Capture your thoughts, feelings, and reflections on your journey
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Reflect on your journey..."
                className="min-h-[200px] bg-slate-800 border-slate-700 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Energy Tag (Optional)</label>
                <Select value={energyTag} onValueChange={setEnergyTag}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select energy..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="">None</SelectItem>
                    {energies.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Mood (Optional)</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="How do you feel?" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="peaceful">Peaceful</SelectItem>
                    <SelectItem value="grateful">Grateful</SelectItem>
                    <SelectItem value="energized">Energized</SelectItem>
                    <SelectItem value="reflective">Reflective</SelectItem>
                    <SelectItem value="challenged">Challenged</SelectItem>
                    <SelectItem value="hopeful">Hopeful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveEntry} className="flex-1 bg-blue-500 hover:bg-blue-600">
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
