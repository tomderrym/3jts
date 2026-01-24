import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

// 22. Celebration Kit CTA
export function CelebrationKitCTA() {
  return createElement('div', { className: 'w-full bg-white py-12 px-4 border-b border-gray-100 font-sans' },
    createElement('div', { className: 'max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8' },
      createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center md:text-left' }, 'Get full access to ', createElement('br'), ' Celebration kit'),
      createElement('div', { className: 'flex w-full md:w-auto max-w-md' },
        createElement('input', { type: 'email', placeholder: 'Enter email to get started', className: 'flex-1 border border-gray-200 rounded-l-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600' }),
        createElement('button', { className: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-r-lg text-sm transition-colors whitespace-nowrap' }, 'Get Started Free')
      )
    )
  );
}

// 23. Instagram Sidebar Widget
export function InstagramSidebar() {
  return createElement('div', { className: 'flex flex-col md:flex-row gap-8 p-8 max-w-5xl mx-auto bg-white font-sans' },
    createElement('div', { className: 'flex-1 bg-gray-100 rounded-xl h-80 md:h-auto min-h-[400px]' }),
    createElement('div', { className: 'w-full md:w-64 shrink-0' },
      createElement('div', { className: 'bg-white border border-gray-100 p-6 shadow-sm' },
        createElement('h3', { className: 'text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4' }, 'Follow us on Instagram'),
        createElement('div', { className: 'grid grid-cols-2 gap-2' },
          [1, 2, 3, 4, 5, 6].map(item => createElement('a', { key: item, href: '#', className: 'aspect-square bg-gray-200 overflow-hidden group relative' },
            createElement('img', { src: `https://source.unsplash.com/random/200x200?interior&sig=${item}`, className: 'w-full h-full object-cover group-hover:scale-110 transition duration-500' }),
            createElement('div', { className: 'absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' })
          ))
        )
      )
    )
  );
}