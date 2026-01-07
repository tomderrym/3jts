/**
 * JournalComponent Component
 * Props: { amount?: any, activity?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
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

  return createElement('div', {className: 'space-y-6'}, '<Card className="p-4 bg-slate-800/50 border-slate-700/50">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            createElement('Search', {className: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400'})
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className="pl-10 bg-slate-900/50 border-slate-700"
            />
          </div>
          <Select value={filterEnergy} onValueChange={setFilterEnergy}>
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700">
              createElement('SelectValue', {placeholder: 'Filter'})
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              createElement('SelectItem', {value: 'all'}, 'All Energies')
              {energies.map(e => (
                createElement('SelectItem', null, '{e.name}')
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600">
            createElement('Plus', {className: 'w-4 h-4 mr-2'})
            New Entry
          </Button>
        </div>
      </Card>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          createElement('p', {className: 'text-slate-400 mb-4'}, 'No journal entries yet')
          createElement('Button', null, 'setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600">
            Write Your First Entry')') : (
        <div className="space-y-4">
          {filteredEntries.map(entry => {
            const energy = energies.find(e => e.id === entry.energyTag);
            return createElement('Card', {className: 'p-4 bg-slate-800/50 border-slate-700/50'}, '<div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    createElement('Calendar', {className: 'w-3 h-3'})
                    {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 -mt-2"
                  >
                    createElement('Trash2', {className: 'w-4 h-4'})
                  </Button>
                </div>
                
                createElement('p', {className: 'text-slate-300 whitespace-pre-wrap mb-3'}, '{entry.content}')
                
                <div className="flex items-center gap-2">
                  {energy && (
                    createElement('span', null, '{energy.name}')
                  )}
                  {entry.mood && (
                    createElement('span', {className: 'px-2 py-1 rounded text-xs bg-slate-700 text-slate-300'}, '{entry.mood}')
                  )}
                </div>');
          })}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            createElement('DialogTitle', null, 'New Journal Entry')
            createElement('DialogDescription', null, 'Capture your thoughts, feelings, and reflections on your journey')
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
                createElement('label', {className: 'text-sm text-slate-400 mb-2 block'}, 'Energy Tag (Optional)')
                <Select value={energyTag} onValueChange={setEnergyTag}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    createElement('SelectValue', {placeholder: 'Select energy...'})
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    createElement('SelectItem', null, 'None')
                    {energies.map(e => (
                      createElement('SelectItem', null, '{e.name}')
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                createElement('label', {className: 'text-sm text-slate-400 mb-2 block'}, 'Mood (Optional)')
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    createElement('SelectValue', {placeholder: 'How do you feel?'})
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    createElement('SelectItem', null, 'None')
                    createElement('SelectItem', {value: 'peaceful'}, 'Peaceful')
                    createElement('SelectItem', {value: 'grateful'}, 'Grateful')
                    createElement('SelectItem', {value: 'energized'}, 'Energized')
                    createElement('SelectItem', {value: 'reflective'}, 'Reflective')
                    createElement('SelectItem', {value: 'challenged'}, 'Challenged')
                    createElement('SelectItem', {value: 'hopeful'}, 'Hopeful')
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              createElement('Button', {variant: 'outline'}, 'setShowCreateDialog(false)} className="flex-1">
                Cancel')
              createElement('Button', {className: 'flex-1 bg-blue-500 hover:bg-blue-600', onClick: saveEntry}, 'Save Entry')
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
