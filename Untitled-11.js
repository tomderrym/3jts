import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Search, ArrowRight } from 'https://esm.sh/lucide-react';

// 6. Subscription Section (Dark Bread)
export function SubscriptionSection() {
  return createElement('div', { className: 'bg-black py-16 px-4 font-serif' },
    createElement('div', { className: 'max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6' },
      // Card 1
      createElement('div', { className: 'relative h-96 rounded-lg overflow-hidden group' },
        createElement('img', { 
          src: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600', 
          className: 'w-full h-full object-cover opacity-80' 
        }),
        createElement('div', { className: 'absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/90 to-transparent w-full' },
          createElement('span', { className: 'text-gray-400 italic font-serif text-sm block mb-1' }, 'Kneading'),
          createElement('p', { className: 'text-white text-lg font-serif leading-snug' }, 'In tortor, maecenas purus dis tortor blandit ut turpis pretium.')
        )
      ),
      // Card 2
      createElement('div', { className: 'relative h-96 rounded-lg overflow-hidden' },
        createElement('img', { 
          src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600', 
          className: 'w-full h-full object-cover opacity-80' 
        }),
        createElement('div', { className: 'absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/90 to-transparent w-full' },
          createElement('span', { className: 'text-gray-400 italic font-serif text-sm block mb-1' }, 'Kneading'),
          createElement('p', { className: 'text-white text-lg font-serif leading-snug' }, 'Vivamus et mauris nisl vel nunc posuere ipsum ultrices.')
        )
      ),
      // Card 3: Form
      createElement('div', { className: 'bg-white rounded-lg p-8 flex flex-col justify-center h-96' },
        createElement('h3', { className: 'text-3xl font-serif text-black leading-tight mb-4' },
          'Subscribe to ', createElement('br'),
          createElement('span', { className: 'italic font-bold' }, 'Bread & Butter')
        ),
        createElement('p', { className: 'text-gray-500 text-sm mb-8 leading-relaxed font-sans' }, 'Aliquam quisque scelerisque nunc magna tristique nulla aliquet in semper.'),
        createElement('div', { className: 'space-y-4 font-sans' },
          createElement('input', { type: 'email', placeholder: 'Type your e-mail', className: 'w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black transition' }),
          createElement('button', { className: 'bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition' }, 'Send')
        )
      )
    )
  );
}

// 7. Blog Split Layout
export function BlogSplitLayout() {
  return createElement('div', { className: 'bg-black text-white py-20 px-4 font-serif' },
    createElement('div', { className: 'max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center' },
      createElement('div', { className: 'lg:col-span-1 space-y-6' },
        createElement('h2', { className: 'text-5xl md:text-6xl font-serif leading-none' }, 'Our Blog ', createElement('br'), createElement('span', { className: 'italic font-light' }, 'Bread & ', createElement('br'), ' Butter')),
        createElement('p', { className: 'text-gray-500 text-sm leading-relaxed max-w-xs font-sans' }, 'Vestibulum in nisi, in sollicitudin at dolor quam sed.'),
        createElement('button', { className: 'flex items-center gap-2 px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition text-sm font-medium mt-4 font-sans' }, 'Read All ', createElement(ArrowRight, { className: 'w-4 h-4' }))
      ),
      createElement('div', { className: 'lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4' },
        [1, 2, 3, 4].map(item => createElement('div', { key: item, className: 'bg-transparent border border-gray-800 rounded-lg overflow-hidden flex items-center h-32 group hover:border-gray-600 transition' },
          createElement('div', { className: 'w-24 h-full shrink-0' }, createElement('img', { src: `https://source.unsplash.com/random/200x200?bakery&sig=${item}`, className: 'w-full h-full object-cover opacity-80' })),
          createElement('div', { className: 'p-4' }, createElement('p', { className: 'text-sm font-serif leading-snug text-gray-200' }, 'Arcu, pulvinar curabitur aliquet eros, odio tristique lacinia.'))
        ))
      )
    )
  );
}