/**
 * AFFIRMATIONS Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';

export type VoiceGuideType = 'male' | 'female' | 'none';
export type VoiceLanguage = 'en' | 'es' | 'fr' | 'de';

interface VoiceGuideConfig {
  enabled: boolean;
  type: VoiceGuideType;
  volume: number;
  language: VoiceLanguage;
  includeAffirmations: boolean;
}

export const useVoiceGuide = () => {
  const [config, setConfig] = React.useState<VoiceGuideConfig>({
    enabled: false,
    type: 'female',
    volume: 0.7,
    language: 'en',
    includeAffirmations: false,
  });

  const speak = (text: string) => {
    if (!config.enabled || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = config.volume;
    utterance.rate = 0.9;
    utterance.pitch = config.type === 'female' ? 1.2 : 0.8;
    utterance.lang = config.language === 'en' ? 'en-US' : config.language;

    // Try to select appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(voice => {
        const isFemale = voice.name.toLowerCase().includes('female') || 
                        voice.name.toLowerCase().includes('samantha') ||
                        voice.name.toLowerCase().includes('victoria');
        const isMale = voice.name.toLowerCase().includes('male') ||
                      voice.name.toLowerCase().includes('daniel') ||
                      voice.name.toLowerCase().includes('alex');
        
        if (config.type === 'female' && isFemale) return true;
        if (config.type === 'male' && isMale) return true;
        return false;
      });
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  const guideInhale = () => {
    speak('Breathe in');
  };

  const guideInhaleHold = () => {
    speak('Hold');
  };

  const guideExhale = () => {
    speak('Breathe out');
  };

  const guideExhaleHold = () => {
    speak('Hold');
  };

  const guideComplete = () => {
    speak('Session complete. Well done.');
  };

  const guideAffirmation = (affirmation: string) => {
    if (config.includeAffirmations) {
      speak(affirmation);
    }
  };

  const updateConfig = (updates: Partial<VoiceGuideConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return {
    config,
    updateConfig,
    speak,
    guideInhale,
    guideInhaleHold,
    guideExhale,
    guideExhaleHold,
    guideComplete,
    guideAffirmation,
  };
};

export default function AFFIRMATIONS = [
  "I am calm and centered",
  "I am present in this moment",
  "I release all tension",
  "I am at peace",
  "I breathe in clarity, I breathe out stress",
  "I am grounded and balanced",
  "I trust the process",
  "I am strong and resilient",
  "I embrace stillness",
  "I am connected to my breath",
];

export const getRandomAffirmation = (): string => {
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
};
