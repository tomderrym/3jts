import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Search, ArrowRight } from 'https://esm.sh/lucide-react';

// 31. Bread Hero Section
export function BreadHero() {
  return createElement('div', { className: 'bg-black text-white pt-24 pb-0 px-4 overflow-hidden relative min-h-[600px] flex flex-col items-center font-serif' },
    // Content
    createElement('div', { className: 'text-center z-10 max-w-3xl mx-auto mb-12' },
      createElement('span', { className: 'text-gray-400 text-sm mb-4 block tracking-wide font-sans' }, 'Discover our lessons'),
      createElement('h1', { className: 'text-5xl md:text-6xl font-serif leading-tight mb-8' },
        'Start your journey to ', createElement('br'),
        createElement('span', { className: 'italic font-light' }, 'making bread')
      ),
      createElement('button', { className: 'bg-white text-black font-medium px-8 py-3 rounded-full hover:bg-gray-200 transition font-sans' }, 'Get Started')
    ),
    // Hero Image
    createElement('div', { className: 'w-full max-w-4xl mt-auto' },
      createElement('img', {
        src: 'https://images.unsplash.com/photo-1585476679829-0f2c9b4e760c?auto=format&fit=crop&q=80&w=1200',
        alt: 'Sourdough bread loaf',
        className: 'w-full object-cover rounded-t-[2rem] md:rounded-t-[4rem] shadow-2xl h-64 md:h-96'
      })
    ),
    // Bottom Fade
    createElement('div', { className: 'absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent opacity-50' })
  );
}

// 32. Dark Blog Index (With Search)
export function BlogIndexWithSearch() {
  const posts = [1, 2, 3];
  return createElement('div', { className: 'min-h-screen bg-black text-white py-20 px-4 font-serif' },
    createElement('div', { className: 'max-w-6xl mx-auto' },
      // Header & Search
      createElement('div', { className: 'text-center mb-12' },
        createElement('h1', { className: 'text-4xl md:text-5xl font-serif mb-4' },
          'Our Blog ', createElement('span', { className: 'italic' }, 'Bread & Butter')
        ),
        createElement('p', { className: 'text-gray-400 max-w-lg mx-auto mb-8 text-sm md:text-base font-sans' },
          'Vestibulum in nisi, in sollicitudin at dolor quam sed. ', createElement('br'), 'Donec pellentesque pulvinar tempor tincidunt.'
        ),
        // Search Bar
        createElement('div', { className: 'max-w-md mx-auto relative font-sans' },
          createElement(Search, { className: 'absolute left-4 top-1/2 -translate-y-1/2 text-white w-4 h-4' }),
          createElement('input', {
            type: 'text',
            placeholder: 'Search',
            className: 'w-full bg-transparent border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gray-500 placeholder-white'
          })
        )
      ),
      // Grid
      createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 font-sans' },
        posts.map(item => createElement('div', { key: item, className: 'bg-black border border-gray-900/50 rounded-lg overflow-hidden group hover:border-gray-800 transition' },
          createElement('div', { className: 'h-48 overflow-hidden' },
            createElement('img', {
              src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
              className: 'w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80'
            })
          ),
          createElement('div', { className: 'p-6' },
            createElement('h3', { className: 'text-xl font-serif mb-3 leading-snug' }, 'Arcu, pulvinar curabitur aliquet eros, odio tristique lacinia facilisis.'),
            createElement('p', { className: 'text-gray-500 text-sm leading-relaxed mb-6' }, 'Ut dignissim ultricies a erat sit aenean sed volutpat commodo. Adipiscing lacus id diam massa magnis nulla non.'),
            createElement('a', { href: '#', className: 'inline-flex items-center text-sm text-white hover:text-gray-300 transition gap-2' },
              'Read More ', createElement(ArrowRight, { className: 'w-4 h-4' })
            )
          )
        ))
      )
    )
  );
}