import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Apple, Play } from 'https://esm.sh/lucide-react';

export default function AppDownload() {
  return createElement('div', { className: 'bg-black text-white py-24 px-4 overflow-hidden font-sans' },
    createElement('div', { className: 'max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24' },
      // Mockup
      createElement('div', { className: 'relative w-64 md:w-80 shrink-0' },
        createElement('div', { className: 'border-[14px] border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl bg-gray-900 h-[500px] md:h-[600px] relative z-10' },
          createElement('div', { className: 'w-full h-full bg-gray-900 flex items-center justify-center' },
            createElement('div', { className: 'w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-80 animate-pulse' })
          ),
          createElement('div', { className: 'absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl w-32 mx-auto' })
        )
      ),
      // Content
      createElement('div', { className: 'flex-1 text-center md:text-left' },
        createElement('p', { className: 'text-purple-500 font-bold tracking-widest text-xs uppercase mb-4' }, 'Try on mobile'),
        createElement('h2', { className: 'text-4xl md:text-6xl font-medium leading-tight mb-8' }, 'Download our app for free'),
        createElement('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center md:justify-start' },
          // Apple Button
          createElement('button', { className: 'flex items-center gap-3 px-4 py-2 bg-transparent border border-gray-600 rounded-xl hover:bg-gray-800 transition' },
            createElement(Apple, { className: 'w-8 h-8 fill-current' }),
            createElement('div', { className: 'text-left' },
              createElement('div', { className: 'text-[10px] uppercase text-gray-400 font-semibold' }, 'Download on the'),
              createElement('div', { className: 'text-lg font-bold leading-none' }, 'App Store')
            )
          ),
          // Google Button
          createElement('button', { className: 'flex items-center gap-3 px-4 py-2 bg-transparent border border-gray-600 rounded-xl hover:bg-gray-800 transition' },
            createElement(Play, { className: 'w-7 h-7 fill-current' }),
            createElement('div', { className: 'text-left' },
              createElement('div', { className: 'text-[10px] uppercase text-gray-400 font-semibold' }, 'Get it on'),
              createElement('div', { className: 'text-lg font-bold leading-none' }, 'Google Play')
            )
          )
        )
      )
    )
  );
}