/**
 * Meditation Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { ArrowLeft, Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MeditationTrack {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: 'guided' | 'ambient' | 'visualization' | 'body-scan' | 'loving-kindness';
  backgroundSound?: string;
  script: MeditationScript[];
}

interface MeditationScript {
  time: number; // seconds from start
  text: string;
  pause?: number; // pause after speaking (seconds)
}

const MEDITATION_TRACKS: MeditationTrack[] = [
  {
    id: 'peace-foundation',
    title: 'Peace Foundation',
    description: 'Connect with inner peace and stillness',
    duration: 600,
    category: 'guided',
    backgroundSound: 'tibetan',
    script: [
      { time: 0, text: 'Welcome. Find a comfortable seated position. Close your eyes gently.', pause: 5 },
      { time: 10, text: 'Begin by taking three deep breaths. Inhale... and exhale...', pause: 20 },
      { time: 35, text: 'Notice the stillness within you. This is your natural state of peace.', pause: 10 },
      { time: 50, text: 'With each breath, sink deeper into this peaceful center.', pause: 15 },
      { time: 70, text: 'Imagine a warm, golden light at your heart center.', pause: 10 },
      { time: 85, text: 'This light represents your inner peace, always present, always accessible.', pause: 20 },
      { time: 110, text: 'Allow this light to expand with each breath, filling your entire body.', pause: 30 },
      { time: 145, text: 'Peace is not something to achieve. It is something to remember.', pause: 20 },
      { time: 170, text: 'Rest in this awareness. Simply be.', pause: 400 },
      { time: 575, text: 'Slowly begin to deepen your breath.', pause: 10 },
      { time: 590, text: 'When you\'re ready, gently open your eyes. Carry this peace with you.', pause: 10 },
    ],
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness (Metta)',
    description: 'Cultivate compassion for yourself and others',
    duration: 480,
    category: 'loving-kindness',
    backgroundSound: 'chimes',
    script: [
      { time: 0, text: 'Settle into a comfortable position. Take a few deep breaths.', pause: 10 },
      { time: 15, text: 'Begin by directing loving-kindness toward yourself.', pause: 5 },
      { time: 25, text: 'May I be happy. May I be healthy. May I be safe. May I live with ease.', pause: 20 },
      { time: 50, text: 'Feel the warmth of these wishes in your heart.', pause: 15 },
      { time: 70, text: 'Now think of someone you love dearly.', pause: 10 },
      { time: 85, text: 'May you be happy. May you be healthy. May you be safe. May you live with ease.', pause: 20 },
      { time: 110, text: 'Extend this loving-kindness to a neutral person, someone you see but don\'t know well.', pause: 10 },
      { time: 125, text: 'May you be happy. May you be healthy. May you be safe. May you live with ease.', pause: 20 },
      { time: 150, text: 'Now, if you feel ready, think of someone you find difficult.', pause: 10 },
      { time: 165, text: 'May you be happy. May you be healthy. May you be safe. May you live with ease.', pause: 20 },
      { time: 190, text: 'Finally, extend loving-kindness to all beings everywhere.', pause: 10 },
      { time: 205, text: 'May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease.', pause: 250 },
      { time: 460, text: 'Take a moment to rest in the spaciousness of universal love.', pause: 15 },
      { time: 480, text: 'Slowly return your awareness to the room. Open your eyes when ready.', pause: 0 },
    ],
  },
  {
    id: 'body-scan',
    title: 'Body Scan Relaxation',
    description: 'Release tension and connect with your body',
    duration: 720,
    category: 'body-scan',
    backgroundSound: 'ocean',
    script: [
      { time: 0, text: 'Lie down in a comfortable position. Let your body be supported.', pause: 10 },
      { time: 15, text: 'Take three deep breaths. With each exhale, allow your body to relax.', pause: 20 },
      { time: 40, text: 'Bring your attention to your feet. Notice any sensations.', pause: 15 },
      { time: 60, text: 'Imagine tension melting away from your feet with each breath.', pause: 20 },
      { time: 85, text: 'Move your awareness to your lower legs. Relax them completely.', pause: 20 },
      { time: 110, text: 'Continue to your thighs. Feel them soften and release.', pause: 20 },
      { time: 135, text: 'Notice your hips and pelvis. Allow any tightness to dissolve.', pause: 20 },
      { time: 160, text: 'Bring attention to your lower back. Breathe into any tension.', pause: 20 },
      { time: 185, text: 'Feel your belly rise and fall with each breath. Soft and easy.', pause: 20 },
      { time: 210, text: 'Move to your chest and upper back. Release and let go.', pause: 20 },
      { time: 235, text: 'Notice your shoulders. Often we hold stress here. Let it melt away.', pause: 25 },
      { time: 265, text: 'Relax your arms, from shoulders to fingertips.', pause: 20 },
      { time: 290, text: 'Bring awareness to your neck. Gently release any tightness.', pause: 20 },
      { time: 315, text: 'Relax your jaw, your face, your forehead.', pause: 20 },
      { time: 340, text: 'Your entire body is now relaxed, peaceful, at ease.', pause: 350 },
      { time: 695, text: 'Begin to deepen your breath. Wiggle your fingers and toes.', pause: 15 },
      { time: 715, text: 'When ready, slowly open your eyes. Move gently as you return.', pause: 5 },
    ],
  },
  {
    id: 'morning-intention',
    title: 'Morning Intention Setting',
    description: 'Start your day with clarity and purpose',
    duration: 300,
    category: 'visualization',
    backgroundSound: 'forest',
    script: [
      { time: 0, text: 'Good morning. Find a comfortable seat. Let your eyes close gently.', pause: 10 },
      { time: 15, text: 'Take three deep breaths, welcoming this new day.', pause: 15 },
      { time: 35, text: 'Ask yourself: What do I want to cultivate today?', pause: 30 },
      { time: 70, text: 'Perhaps it\'s patience, joy, focus, or compassion.', pause: 15 },
      { time: 90, text: 'Choose one quality to embody throughout your day.', pause: 20 },
      { time: 115, text: 'Visualize yourself moving through your day with this quality.', pause: 30 },
      { time: 150, text: 'See yourself responding to challenges with grace.', pause: 20 },
      { time: 175, text: 'Feel the satisfaction of living aligned with your intention.', pause: 20 },
      { time: 200, text: 'Take a deep breath and anchor this intention in your heart.', pause: 15 },
      { time: 220, text: 'Remember: you can return to this intention at any moment.', pause: 30 },
      { time: 255, text: 'Take one more deep breath.', pause: 10 },
      { time: 270, text: 'When you\'re ready, open your eyes. Carry this intention with you.', pause: 30 },
    ],
  },
];

interface MeditationProps {
  onBack?: () => void;
}

export default function Meditation: React.FC<MeditationProps> = ({ onBack }) => {
  const [selectedTrack, setSelectedTrack] = React.useState<MeditationTrack | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(0.7);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentScriptIndex, setCurrentScriptIndex] = React.useState(0);
  const audioGeneratorRef = React.useRef<AudioGenerator | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const speechTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Initialize AudioGenerator
  React.useEffect(() => {
    audioGeneratorRef.current = new AudioGenerator();
    
    return () => {
      if (audioGeneratorRef.current) {
        audioGeneratorRef.current.destroy();
        audioGeneratorRef.current = null;
      }
    };
  }, []);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = isMuted ? 0 : volume;
    utterance.rate = 0.75; // Slower, more calming pace
    utterance.pitch = 0.9; // Slightly lower pitch for warmth
    utterance.lang = 'en-US';

    // Try to find the calmest, most soothing voice available
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for calm voices
    const preferredVoiceNames = [
      'google us english',
      'microsoft zira',
      'samantha',
      'karen',
      'victoria',
      'amelie',
      'serena',
      'fiona'
    ];
    
    // First try to find by name
    let preferredVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      return preferredVoiceNames.some(preferred => name.includes(preferred));
    });
    
    // If not found, look for any female voice (typically calmer)
    if (!preferredVoice) {
      preferredVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('woman') ||
        (v.lang.startsWith('en') && !v.name.toLowerCase().includes('male'))
      );
    }
    
    // Fallback to any English voice
    if (!preferredVoice) {
      preferredVoice = voices.find(v => v.lang.startsWith('en'));
    }
    
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    if (isPlaying && selectedTrack) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next >= selectedTrack.duration) {
            setIsPlaying(false);
            return selectedTrack.duration;
          }
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, selectedTrack]);

  React.useEffect(() => {
    if (!isPlaying || !selectedTrack) return;

    const currentScript = selectedTrack.script[currentScriptIndex];
    if (currentScript && currentTime >= currentScript.time) {
      speak(currentScript.text);
      setCurrentScriptIndex(prev => prev + 1);
    }
  }, [currentTime, isPlaying, selectedTrack, currentScriptIndex, isMuted, volume]);

  React.useEffect(() => {
    if (selectedTrack?.backgroundSound && audioGeneratorRef.current) {
      const soundMap: { [key: string]: () => void } = {
        'tibetan': () => audioGeneratorRef.current?.createTibetanBowl(),
        'chimes': () => audioGeneratorRef.current?.createWindChimes(),
        'ocean': () => audioGeneratorRef.current?.createOceanWaves(),
        'forest': () => audioGeneratorRef.current?.createForestAmbience(),
        'rain': () => audioGeneratorRef.current?.createRain(),
        'stream': () => audioGeneratorRef.current?.createStream(),
      };
      
      const playSound = soundMap[selectedTrack.backgroundSound];
      if (playSound) {
        playSound();
      }
      audioGeneratorRef.current.setVolume(isMuted ? 0 : volume * 0.3);
    }
  }, [selectedTrack, isMuted, volume]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentScriptIndex(0);
    if (audioGeneratorRef.current) {
      audioGeneratorRef.current.stop();
    }
    window.speechSynthesis?.cancel();
  };

  const handleTrackSelect = (track: MeditationTrack) => {
    handleStop();
    setSelectedTrack(track);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = selectedTrack ? (currentTime / selectedTrack.duration) * 100 : 0;

  if (selectedTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              handleStop();
              setSelectedTrack(null);
            }}
            className="mb-6 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-3xl mb-3">{selectedTrack.title}</h1>
            <p className="text-slate-400">{selectedTrack.description}</p>
            <div className="mt-2 text-sm text-slate-500">
              {selectedTrack.category.replace('-', ' ').toUpperCase()} • {Math.floor(selectedTrack.duration / 60)} MIN
            </div>
          </div>

          {/* Meditation Circle */}
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-500/40 to-violet-500/40 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-12 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">{formatTime(currentTime)}</div>
                <div className="text-sm text-slate-400">
                  {formatTime(selectedTrack.duration - currentTime)} left
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <Progress value={progress} className="mb-6" />

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStop}
              className="text-slate-400 hover:text-white"
            >
              <SkipForward className="w-5 h-5 rotate-180" />
            </Button>
            
            <Button
              size="icon"
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setCurrentTime(selectedTrack.duration);
                handleStop();
              }}
              className="text-slate-400 hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={([v]) => {
                  setVolume(v / 100);
                  setIsMuted(false);
                }}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mb-6 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl mb-3">Guided Meditation</h1>
          <p className="text-slate-400">Journey inward with compassionate guidance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEDITATION_TRACKS.map((track) => (
            <Card
              key={track.id}
              className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => handleTrackSelect(track)}
            >
              <h3 className="text-lg mb-2">{track.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{track.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                  {track.category.replace('-', ' ')}
                </span>
                <span className="text-slate-500">{Math.floor(track.duration / 60)} min</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};