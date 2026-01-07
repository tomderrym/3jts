import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
/**
 * MANTRAS Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import { useState } from 'react';
import { ArrowLeft, Heart, Copy, Check } from 'lucide-react';

interface Mantra {
  id: string;
  text: string;
  translation: string;
  energy: 'Peace' | 'Love' | 'Infinity' | 'Belief' | 'Harmony' | 'Unity';
  origin: string;
  description: string;
  pronunciation?: string;
}

export default function MANTRAS: Mantra[] = [
  {
    id: '1',
    text: 'Om Shanti Shanti Shanti',
    translation: 'Peace, Peace, Peace',
    energy: 'Peace',
    origin: 'Sanskrit',
    description: 'A sacred invocation for peace on all levels - physical, mental, and spiritual',
    pronunciation: 'Ohm Shahn-tee Shahn-tee Shahn-tee',
  },
  {
    id: '2',
    text: 'Lokah Samastah Sukhino Bhavantu',
    translation: 'May all beings everywhere be happy and free',
    energy: 'Unity',
    origin: 'Sanskrit',
    description: 'A mantra of compassion that extends loving-kindness to all beings',
    pronunciation: 'Loh-kah Sah-mah-stah Su-kee-no Bah-vahn-tu',
  },
  {
    id: '3',
    text: 'Om Mani Padme Hum',
    translation: 'The jewel is in the lotus',
    energy: 'Love',
    origin: 'Tibetan Buddhist',
    description: 'The mantra of compassion, awakening the loving-kindness within',
    pronunciation: 'Ohm Mah-nee Pahd-may Hoom',
  },
  {
    id: '4',
    text: 'So Hum',
    translation: 'I am that',
    energy: 'Infinity',
    origin: 'Sanskrit',
    description: 'Connects your breath to the universal consciousness',
    pronunciation: 'Soh Hum',
  },
  {
    id: '5',
    text: 'I am worthy of all good things',
    translation: 'Affirmation of self-worth',
    energy: 'Belief',
    origin: 'Modern Affirmation',
    description: 'Cultivates self-belief and opens you to receiving abundance',
  },
  {
    id: '6',
    text: 'Om Namah Shivaya',
    translation: 'I honor the divine within',
    energy: 'Harmony',
    origin: 'Sanskrit',
    description: 'Honors the transformation and divine consciousness within',
    pronunciation: 'Ohm Nah-mah Shee-vah-yah',
  },
  {
    id: '7',
    text: 'Gate Gate Paragate Parasamgate Bodhi Svaha',
    translation: 'Gone, gone, gone beyond, gone altogether beyond',
    energy: 'Infinity',
    origin: 'Heart Sutra',
    description: 'Celebrates transcendence and liberation from suffering',
    pronunciation: 'Gah-tay Gah-tay Pah-rah-gah-tay Pah-rah-sahm-gah-tay Boh-dee Svah-hah',
  },
  {
    id: '8',
    text: 'Sat Nam',
    translation: 'Truth is my identity',
    energy: 'Belief',
    origin: 'Kundalini',
    description: 'Affirms your true nature and authentic self',
    pronunciation: 'Saht Nahm',
  },
  {
    id: '9',
    text: 'Ra Ma Da Sa Sa Say So Hung',
    translation: 'Sun, Moon, Earth, Infinity, I am Thou',
    energy: 'Harmony',
    origin: 'Kundalini',
    description: 'A healing mantra that balances all elements',
    pronunciation: 'Rah Mah Dah Sah Sah Say So Hung',
  },
  {
    id: '10',
    text: 'I am peace, I am love, I am light',
    translation: 'Affirmation of divine qualities',
    energy: 'Peace',
    origin: 'Modern Affirmation',
    description: 'Embodies the sacred qualities of your highest self',
  },
  {
    id: '11',
    text: 'Om Gam Ganapataye Namaha',
    translation: 'Salutations to the remover of obstacles',
    energy: 'Belief',
    origin: 'Sanskrit',
    description: 'Invokes inner strength to overcome challenges',
    pronunciation: 'Ohm Gahm Gah-nah-pah-tah-yay Nah-mah-hah',
  },
  {
    id: '12',
    text: 'Aham Prema',
    translation: 'I am divine love',
    energy: 'Love',
    origin: 'Sanskrit',
    description: 'Awakens the pure love that is your true essence',
    pronunciation: 'Ah-ham Pray-mah',
  },
];

const ENERGY_COLORS = {
  Peace: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  Love: 'from-rose-500/20 to-pink-600/5 border-rose-500/20',
  Infinity: 'from-purple-500/20 to-indigo-600/5 border-purple-500/20',
  Belief: 'from-amber-500/20 to-yellow-600/5 border-amber-500/20',
  Harmony: 'from-green-500/20 to-emerald-600/5 border-green-500/20',
  Unity: 'from-cyan-500/20 to-teal-600/5 border-cyan-500/20',
};

const ENERGY_ICONS = {
  Peace: '🕊️',
  Love: '💗',
  Infinity: '∞',
  Belief: '⭐',
  Harmony: '☯️',
  Unity: '🌐',
};

interface MantraLibraryProps {
  onBack: () => void;
}

export function MantraLibrary({ onBack }: MantraLibraryProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMantras = activeTab === 'all'
    ? MANTRAS
    : activeTab === 'favorites'
    ? MANTRAS.filter((m) => favorites.has(m.id))
    : MANTRAS.filter((m) => m.energy.toLowerCase() === activeTab);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const copyMantra = (mantra: Mantra) => {
    const text = `${mantra.text}\n${mantra.translation}\n\n${mantra.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(mantra.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return createElement('div', {className: 'min-h-screen p-6 pb-24'}, '<div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            createElement('ArrowLeft', {className: 'w-5 h-5 text-foreground'})
          </button>
          <div className="flex-1">
            createElement('h1', {className: 'text-foreground'}, 'Sacred Mantras')
            createElement('p', {className: 'text-sm text-muted-foreground'}, 'Words of power and transformation')
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            createElement('div', {className: 'text-2xl'}, '🙏')
            <div>
              createElement('h3', {className: 'text-foreground mb-1'}, 'How to Use Mantras')
              createElement('p', {className: 'text-sm text-muted-foreground leading-relaxed'}, 'Repeat silently or aloud during meditation. Focus on the vibration and meaning. 
                Let the mantra become your anchor, guiding you deeper into presence.')
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            createElement('TabsTrigger', {value: 'all'}, 'All')
            <TabsTrigger value="favorites">
              createElement('Heart', {className: 'w-4 h-4 mr-1'})
              Saved
            </TabsTrigger>
            createElement('TabsTrigger', {value: 'peace'}, 'Peace')
            createElement('TabsTrigger', {value: 'love'}, 'Love')
          </TabsList>
        </Tabs>

        {/* Secondary Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['infinity', 'belief', 'harmony', 'unity'].map((energy) => (
            createElement('button', null, 'setActiveTab(energy)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeTab === energy
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted/30 text-muted-foreground border border-transparent hover:border-primary/20'
              }`}
            >
              {energy.charAt(0).toUpperCase() + energy.slice(1)}')
          ))}
        </div>

        {/* Mantras List */}
        {filteredMantras.length === 0 ? (
          <Card className="p-8 text-center bg-card border-primary/20">
            createElement('div', {className: 'text-4xl mb-3'}, '🤍')
            createElement('p', {className: 'text-muted-foreground'}, '{activeTab === 'favorites' 
                ? 'No saved mantras yet. Tap the heart to save your favorites.'
                : 'No mantras found in this category.'}')
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMantras.map((mantra) => (
              <Card
                key={mantra.id}
                className={`p-5 bg-gradient-to-br ${ENERGY_COLORS[mantra.energy]}`}
              >
                <div className="flex items-start gap-4">
                  createElement('div', {className: 'text-3xl pt-1'}, '{ENERGY_ICONS[mantra.energy]}')
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        createElement('Badge', {className: 'mb-2 text-xs border-primary/30 text-primary', variant: 'outline'}, '{mantra.energy}')
                        createElement('p', {className: 'text-foreground mb-1 italic leading-relaxed'}, '"{mantra.text}"')
                        createElement('p', {className: 'text-sm text-muted-foreground mb-2'}, '{mantra.translation}')
                      </div>
                      <button
                        onClick={() => toggleFavorite(mantra.id)}
                        className={`p-2 rounded-full transition-all ${
                          favorites.has(mantra.id)
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        createElement('Heart', null)
                      </button>
                    </div>

                    {mantra.pronunciation && (
                      <div className="mb-2 p-2 rounded bg-card/50">
                        <p className="text-xs text-muted-foreground">
                          Pronunciation: createElement('span', {className: 'text-foreground'}, '{mantra.pronunciation}')
                        </p>')}

                    createElement('p', {className: 'text-sm text-foreground/80 mb-3 leading-relaxed'}, '{mantra.description}')

                    <div className="flex items-center justify-between">
                      createElement('span', {className: 'text-xs text-muted-foreground'}, '{mantra.origin}')
                      <button
                        onClick={() => copyMantra(mantra)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/70 hover:bg-card transition-colors text-xs text-foreground"
                      >
                        {copiedId === mantra.id ? (
                          <>
                            createElement('Check', {className: 'w-3 h-3'})
                            Copied
                          </>
                        ) : (
                          <>
                            createElement('Copy', {className: 'w-3 h-3'})
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
