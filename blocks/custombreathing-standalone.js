/**
 * CustomBreathing Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { ArrowLeft, Play, Save, Trash2 } from 'lucide-react';

interface CustomPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  inhaleHold: number;
  exhale: number;
  exhaleHold: number;
  rounds: number;
  createdAt: number;
}

interface CustomBreathingProps {
  onBack: () => void;
}

export default function CustomBreathing: React.FC<CustomBreathingProps> = ({ onBack }) => {
  const [savedPatterns, setSavedPatterns] = React.useState<CustomPattern[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(false);
  const [previewPattern, setPreviewPattern] = React.useState<CustomPattern | null>(null);
  
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [inhale, setInhale] = React.useState(4);
  const [inhaleHold, setInhaleHold] = React.useState(4);
  const [exhale, setExhale] = React.useState(4);
  const [exhaleHold, setExhaleHold] = React.useState(4);
  const [rounds, setRounds] = React.useState(5);

  React.useEffect(() => {
    const stored = localStorage.getItem('movethemind_custom_patterns');
    if (stored) {
      setSavedPatterns(JSON.parse(stored));
    }
  }, []);

  const savePattern = () => {
    if (!name.trim()) {
      alert('Please enter a name for your pattern');
      return;
    }

    const newPattern: CustomPattern = {
      id: Date.now().toString(),
      name,
      description,
      inhale,
      inhaleHold,
      exhale,
      exhaleHold,
      rounds,
      createdAt: Date.now(),
    };

    const updated = [...savedPatterns, newPattern];
    setSavedPatterns(updated);
    localStorage.setItem('movethemind_custom_patterns', JSON.stringify(updated));
    
    // Reset form
    setName('');
    setDescription('');
    setInhale(4);
    setInhaleHold(4);
    setExhale(4);
    setExhaleHold(4);
    setRounds(5);
    setIsCreating(false);
  };

  const deletePattern = (id: string) => {
    const updated = savedPatterns.filter(p => p.id !== id);
    setSavedPatterns(updated);
    localStorage.setItem('movethemind_custom_patterns', JSON.stringify(updated));
  };

  const startPreview = (pattern?: CustomPattern) => {
    if (pattern) {
      setPreviewPattern(pattern);
    } else {
      setPreviewPattern({
        id: 'preview',
        name: name || 'Preview',
        description,
        inhale,
        inhaleHold,
        exhale,
        exhaleHold,
        rounds,
        createdAt: Date.now(),
      });
    }
    setIsPreview(true);
  };

  if (isPreview && previewPattern) {
    return (
      <BreathingSession
        challengeName={previewPattern.name}
        levelNumber={1}
        onBack={() => {
          setIsPreview(false);
          setPreviewPattern(null);
        }}
        defaultSettings={{
          inhale: previewPattern.inhale,
          inhaleHold: previewPattern.inhaleHold,
          exhale: previewPattern.exhale,
          exhaleHold: previewPattern.exhaleHold,
          rounds: previewPattern.rounds,
        }}
      />
    );
  }

  const totalCycleTime = inhale + inhaleHold + exhale + exhaleHold;
  const totalSessionTime = totalCycleTime * rounds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl mb-2">Custom Breathing</h1>
            <p className="text-slate-400">Create your perfect breathing pattern</p>
          </div>
          <div className="w-10" />
        </div>

        {!isCreating && savedPatterns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No custom patterns yet</p>
            <Button onClick={() => setIsCreating(true)} className="bg-blue-500 hover:bg-blue-600">
              Create Your First Pattern
            </Button>
          </div>
        )}

        {!isCreating && savedPatterns.length > 0 && (
          <>
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full mb-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
            >
              Create New Pattern
            </Button>

            <div className="space-y-4">
              {savedPatterns.map((pattern) => (
                <Card key={pattern.id} className="p-4 bg-slate-800/50 border-slate-700/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{pattern.name}</h3>
                      {pattern.description && (
                        <p className="text-sm text-slate-400 mb-2">{pattern.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{pattern.inhale}s inhale</span>
                        <span>→</span>
                        <span>{pattern.inhaleHold}s hold</span>
                        <span>→</span>
                        <span>{pattern.exhale}s exhale</span>
                        <span>→</span>
                        <span>{pattern.exhaleHold}s hold</span>
                        <span className="ml-2">({pattern.rounds} rounds)</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startPreview(pattern)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deletePattern(pattern.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {isCreating && (
          <div className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700/50">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Pattern Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Morning Breath"
                    className="mt-2 bg-slate-900/50 border-slate-700"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this pattern for?"
                    className="mt-2 bg-slate-900/50 border-slate-700"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700/50">
              <h3 className="text-lg mb-4">Breathing Pattern</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Inhale Duration</Label>
                    <span className="text-blue-400">{inhale}s</span>
                  </div>
                  <Slider
                    value={[inhale]}
                    onValueChange={([v]) => setInhale(v)}
                    min={1}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Inhale Hold</Label>
                    <span className="text-violet-400">{inhaleHold}s</span>
                  </div>
                  <Slider
                    value={[inhaleHold]}
                    onValueChange={([v]) => setInhaleHold(v)}
                    min={0}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Exhale Duration</Label>
                    <span className="text-cyan-400">{exhale}s</span>
                  </div>
                  <Slider
                    value={[exhale]}
                    onValueChange={([v]) => setExhale(v)}
                    min={1}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Exhale Hold</Label>
                    <span className="text-slate-400">{exhaleHold}s</span>
                  </div>
                  <Slider
                    value={[exhaleHold]}
                    onValueChange={([v]) => setExhaleHold(v)}
                    min={0}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Number of Rounds</Label>
                    <span className="text-amber-400">{rounds}</span>
                  </div>
                  <Slider
                    value={[rounds]}
                    onValueChange={([v]) => setRounds(v)}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-slate-900/50">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Cycle Duration:</span>
                  <span className="text-white">{totalCycleTime}s</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-400">Total Session:</span>
                  <span className="text-white">{Math.floor(totalSessionTime / 60)}m {totalSessionTime % 60}s</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => startPreview()}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={savePattern}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
