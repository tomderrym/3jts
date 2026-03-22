import React from 'https://esm.sh/react@18';
import { createElement, useState } from 'https://esm.sh/react@18';

// 11. Newsletter Widget
export function NewsletterWidget() {
  return createElement('div', { className: 'flex flex-col md:flex-row gap-8 p-8 max-w-5xl mx-auto bg-white font-sans' },
    createElement('div', { className: 'flex-1 bg-gray-100 rounded-xl h-80 md:h-auto' }),
    createElement('div', { className: 'w-full md:w-80 shrink-0' },
      createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-3' }, 'Subscribe to newsletter'),
      createElement('p', { className: 'text-gray-500 text-sm mb-6 leading-relaxed' }, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
      createElement('form', { className: 'space-y-4' },
        createElement('input', { type: 'email', placeholder: 'Enter email address', className: 'w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent' }),
        createElement('button', { className: 'w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition text-sm' }, 'Sign Up')
      )
    )
  );
}

// 12. Follow Me Widget (Buttons)
export function FollowMeWidget() {
  return createElement('div', { className: 'flex flex-col md:flex-row gap-8 p-8 max-w-5xl mx-auto bg-white font-sans' },
    createElement('div', { className: 'flex-1 bg-gray-100 rounded-xl h-80 md:h-auto' }),
    createElement('div', { className: 'w-full md:w-80 shrink-0' },
      createElement('h3', { className: 'text-xs font-bold text-gray-900 uppercase tracking-wider mb-3' }, 'FOLLOW ME ON'),
      createElement('div', { className: 'space-y-3' },
        ['GITHUB', 'WEBSITE', 'INSTAGRAM'].map(net => 
          createElement('a', { key: net, href: '#', className: 'flex items-center justify-center w-full border border-gray-200 rounded-lg px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition uppercase tracking-wide' }, net)
        )
      )
    )
  );
}

// 13. Category Sidebar
export function CategorySidebar() {
  const categories = ["Branding", "Business", "Technology", "How to", "Sports", "Movie"];
  return createElement('div', { className: 'flex flex-col md:flex-row gap-8 p-8 max-w-5xl mx-auto bg-white font-sans' },
    createElement('div', { className: 'flex-1 bg-gray-100 rounded-xl h-64 md:h-auto min-h-[300px]' }),
    createElement('div', { className: 'w-full md:w-64 shrink-0 pt-2' },
      createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-6' }, 'Category'),
      createElement('ul', { className: 'space-y-4' },
        categories.map(cat => createElement('li', { key: cat }, createElement('a', { href: '#', className: 'text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium block' }, cat)))
      )
    )
  );
}

// 14. Thumbnail Selector
export function ThumbnailSelector() {
  const [selected, setSelected] = useState(1);
  return createElement('div', { className: 'p-8 bg-white font-sans' },
    createElement('h3', { className: 'text-sm font-medium text-gray-900 mb-3' }, 'Thumbnail'),
    createElement('div', { className: 'flex gap-4' },
      [1, 2].map(id => 
        createElement('button', {
          key: id,
          onClick: () => setSelected(id),
          className: `w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selected === id ? 'border-gray-900 ring-1 ring-gray-900' : 'border-transparent hover:border-gray-200'}`
        }, createElement('div', { className: 'w-full h-full bg-gray-100 flex items-center justify-center' }, createElement('div', { className: 'w-8 h-10 bg-gray-400 rounded-sm' })))
      )
    )
  );
}