import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

// 28. Simple Newsletter (White)
export function SimpleNewsletter() {
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto text-center font-sans' },
    createElement('h3', { className: 'text-2xl font-bold text-gray-900 mb-2' }, 'Join the mailing list'),
    createElement('p', { className: 'text-gray-400 mb-8 max-w-sm mx-auto text-sm' }, 'Stay up to date with the latest news and updates from our team.'),
    createElement('div', { className: 'flex flex-col sm:flex-row gap-3 max-w-md mx-auto' },
      createElement('input', { type: 'email', placeholder: 'Email address', className: 'flex-1 bg-gray-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-100 outline-none text-gray-700' }),
      createElement('button', { className: 'bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg px-6 py-3 text-sm transition-colors' }, 'Subscribe')
    ),
    createElement('div', { className: 'h-1 w-32 bg-gray-100 mx-auto mt-8 rounded-full' })
  );
}

// 29. Blog Items (Read Our Blog)
export function BlogItems() {
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto font-sans' },
    createElement('div', { className: 'text-center mb-8' },
      createElement('h3', { className: 'text-xl font-bold text-gray-900' }, 'Read our blog'),
      createElement('div', { className: 'h-1 w-24 bg-gray-200 mx-auto mt-2 rounded' }),
      createElement('div', { className: 'h-1 w-16 bg-gray-100 mx-auto mt-1 rounded' })
    ),
    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
      [1, 2].map(i => createElement('div', { key: i },
        createElement('div', { className: 'h-32 bg-gray-50 rounded-xl mb-4 w-full' }),
        createElement('div', { className: 'h-3 bg-gray-200 rounded w-3/4 mb-2' }),
        createElement('div', { className: 'h-3 bg-gray-200 rounded w-1/2 mb-4' }),
        createElement('button', { className: 'bg-purple-600 text-white text-xs font-bold py-2 px-6 rounded-full' }, 'Read More')
      ))
    )
  );
}

// 30. Instagram Gallery Widget (Sidebar with Content Placeholder)
export function InstagramGalleryWidget() {
  const images = [1, 2, 3, 4, 5, 6];
  return createElement('div', { className: 'flex flex-col md:flex-row gap-8 p-8 max-w-5xl mx-auto bg-white font-sans' },
    // Main Content Placeholder
    createElement('div', { className: 'flex-1 bg-gray-100 rounded-xl h-96 md:h-auto' }),
    // Sidebar Widget
    createElement('div', { className: 'w-full md:w-72 shrink-0' },
      createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-6' }, 'Instagram Gallery'),
      createElement('div', { className: 'grid grid-cols-3 gap-2' },
        images.map(item => createElement('a', { key: item, href: '#', className: 'block aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition' },
          createElement('img', { src: `https://source.unsplash.com/random/150x150?interior&sig=${item}`, className: 'w-full h-full object-cover' })
        ))
      )
    )
  );
}