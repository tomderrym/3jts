import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { MessageSquare, Twitter, Send, Youtube } from 'https://esm.sh/lucide-react';

// 24. Blog Content (Article Detail)
export function BlogContent() {
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-3xl mx-auto font-sans' },
    createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Discover the most best solution for building landing pages'),
    createElement('div', { className: 'w-20 h-1 bg-gray-200 rounded mb-8 mt-4' }),
    createElement('div', { className: 'space-y-4 text-gray-300' },
      createElement('div', { className: 'h-4 bg-gray-100 rounded w-full' }),
      createElement('div', { className: 'h-4 bg-gray-100 rounded w-11/12' }),
      createElement('div', { className: 'h-4 bg-gray-100 rounded w-full' }),
      createElement('div', { className: 'h-4 bg-gray-400 rounded w-2/3 my-6' }), // Darker line
      createElement('div', { className: 'h-4 bg-gray-100 rounded w-full' }),
      createElement('div', { className: 'h-4 bg-gray-100 rounded w-10/12' }),
      createElement('div', { className: 'h-4 bg-gray-100 rounded w-full' }),
      createElement('div', { className: 'h-2 bg-purple-400 rounded w-1/2 mt-8' }), // Accent
      createElement('div', { className: 'h-2 bg-gray-50 rounded w-full mt-2' })
    )
  );
}

// 25. Blog List Sidebar
export function BlogListSidebar() {
  const items = [1, 2, 3, 4, 5, 6];
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto font-sans' },
    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6' },
      items.map(item => createElement('div', { key: item, className: 'flex gap-4 items-start group cursor-pointer' },
        createElement('div', { className: 'w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0' },
          createElement('img', { src: `https://source.unsplash.com/random/100x100?sig=${item}`, className: 'w-full h-full object-cover group-hover:scale-105 transition-transform' })
        ),
        createElement('div', null,
          createElement('div', { className: 'flex items-center gap-2 text-xs text-gray-400 mb-1' },
            createElement('span', null, 'Growth'), createElement('span', null, '•'), createElement('span', null, 'April 09, 2022')
          ),
          createElement('h4', { className: 'text-sm font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition-colors' }, 'How a visual artist redefines success in graphic design')
        )
      ))
    )
  );
}

// 26. Author Card
export function AuthorCard() {
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto font-sans' },
    createElement('div', { className: 'flex flex-col sm:flex-row items-start gap-6' },
      createElement('div', { className: 'w-16 h-16 rounded-xl bg-purple-600 flex items-center justify-center shrink-0' },
        createElement('div', { className: 'w-8 h-8 rounded-full border-4 border-white opacity-80' })
      ),
      createElement('div', { className: 'flex-1' },
        createElement('h3', { className: 'text-xl font-bold text-gray-900 mb-2' }, 'ClarityUI Team'),
        createElement('p', { className: 'text-gray-500 text-sm leading-relaxed mb-6' }, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim dignissim venenatis, donec maecenas.'),
        createElement('div', { className: 'border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4' },
          createElement('span', { className: 'text-sm text-gray-500' }, 'Follow ClarityUI Team on:'),
          createElement('div', { className: 'flex gap-4 text-gray-400' },
            createElement(MessageSquare, { className: 'w-5 h-5 hover:text-purple-600 cursor-pointer' }),
            createElement(Twitter, { className: 'w-5 h-5 hover:text-blue-400 cursor-pointer' }),
            createElement(Send, { className: 'w-5 h-5 hover:text-blue-500 cursor-pointer' }),
            createElement(Youtube, { className: 'w-5 h-5 hover:text-red-500 cursor-pointer' })
          )
        )
      )
    )
  );
}

// 27. Blog Grid (White)
export function BlogGridWhite() {
  const posts = [1, 2, 3, 4, 5, 6];
  return createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-6xl mx-auto font-sans' },
    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
      posts.map(post => createElement('div', { key: post, className: 'group cursor-pointer' },
        createElement('div', { className: 'aspect-video rounded-xl bg-gray-100 overflow-hidden mb-4' },
          createElement('img', { src: `https://source.unsplash.com/random/400x300?sig=${post}`, className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' })
        ),
        createElement('div', { className: 'flex items-center gap-2 text-xs text-gray-400 mb-2' },
          createElement('span', { className: 'font-medium text-gray-500' }, 'Growth'), createElement('span', null, '•'), createElement('span', null, 'April 09, 2022')
        ),
        createElement('h3', { className: 'text-lg font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition-colors' }, 'How a visual artist redefines success in graphic design')
      ))
    )
  );
}