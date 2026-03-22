import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

export default function FeaturedPost() {
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto font-sans' },
    // Image container
    createElement('div', { className: 'w-full md:w-1/2 h-64 rounded-xl overflow-hidden bg-gray-100' },
      createElement('img', {
        src: 'https://images.unsplash.com/photo-1522075469751-3a3694c2dd77?auto=format&fit=crop&w=800&q=80',
        alt: 'Featured',
        className: 'w-full h-full object-cover'
      })
    ),
    // Content container
    createElement('div', { className: 'w-full md:w-1/2 space-y-4' },
      createElement('h2', { className: 'text-2xl font-bold text-gray-900 leading-tight' }, 
        'The unseen of spending three years at Pixelgrade'
      ),
      createElement('p', { className: 'text-gray-500 leading-relaxed' }, 
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non nibh purus vitae gravida habitasse duis faucibus.'
      ),
      createElement('div', { className: 'flex items-center gap-3 mt-4 pt-4 border-t border-gray-50' },
        createElement('img', {
          src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
          alt: 'Author',
          className: 'w-10 h-10 rounded-full object-cover'
        }),
        createElement('div', null,
          createElement('p', { className: 'text-sm font-semibold text-gray-900' }, 'Jane Cooper'),
          createElement('p', { className: 'text-xs text-gray-400 uppercase tracking-wide' }, '3 Days Ago')
        )
      )
    )
  );
}