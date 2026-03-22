import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { AlignJustify, Globe, Award, Star, ArrowUpRight, Apple, Play } from 'https://esm.sh/lucide-react';

// 8. Quality Features
export function QualityFeatures() {
  const features = [
    { title: "New gift every day", text: "Lorem ipsum dolor sit amet, consectetur adipis elit." },
    { title: "Exclusivity at it’s best", text: "Lorem ipsum dolor sit amet, consectetur adipis elit." },
    { title: "High value content", text: "Lorem ipsum dolor sit amet, consectetur adipis elit." },
  ];
  return createElement('div', { className: 'bg-white py-20 px-4 font-sans' },
    createElement('div', { className: 'max-w-6xl mx-auto' },
      createElement('div', { className: 'mb-16 max-w-2xl' },
        createElement('h2', { className: 'text-3xl font-bold text-gray-900 mb-4' }, 'A Collection of Quality'),
        createElement('p', { className: 'text-gray-500 leading-relaxed' }, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      ),
      createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-12' },
        features.map((f, i) => createElement('div', { key: i, className: 'space-y-4' },
          createElement('div', { className: 'mb-6' }, createElement(AlignJustify, { className: 'w-8 h-8 text-gray-900', strokeWidth: 2 })),
          createElement('h3', { className: 'text-lg font-bold text-gray-900' }, f.title),
          createElement('p', { className: 'text-sm text-gray-500 leading-relaxed' }, f.text)
        ))
      )
    )
  );
}

// 9. Blue CTA Section
export function BlueCTASection() {
  return createElement('div', { className: 'bg-blue-600 text-white py-20 px-4 text-center font-sans' },
    createElement('div', { className: 'max-w-4xl mx-auto' },
      createElement('h2', { className: 'text-3xl md:text-5xl font-bold mb-12 leading-tight' }, 'Start building high performing website ', createElement('br'), ' & grow your business fast.'),
      createElement('div', { className: 'flex flex-wrap justify-center gap-12 mb-12' },
        // Simple badges representation
        createElement('div', { className: 'flex flex-col items-center' }, createElement('span', { className: 'text-2xl font-bold' }, 'G2'), createElement('p', { className: 'text-xs mt-2' }, '4.7 RATING')),
        createElement('div', { className: 'flex flex-col items-center' }, createElement(Globe, { className: 'w-8 h-8' }), createElement('p', { className: 'text-xs mt-2' }, 'ISO CERTIFIED')),
        createElement('div', { className: 'flex flex-col items-center' }, createElement(Award, { className: 'w-8 h-8' }), createElement('p', { className: 'text-xs mt-2' }, 'CAPTERRA'))
      ),
      createElement('div', { className: 'flex flex-col items-center gap-6' },
        createElement('button', { className: 'bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition shadow-lg' }, 'Start using LandingFolio'),
        createElement('a', { href: '#', className: 'flex items-center gap-2 font-semibold hover:underline' }, 'Try live demo ', createElement(ArrowUpRight, { className: 'w-4 h-4' }))
      )
    )
  );
}

// 10. Crypto App Download (Mockup)
export function CryptoAppDownload() {
  return createElement('div', { className: 'bg-[#0B1120] text-white py-20 px-4 overflow-hidden font-sans' },
    createElement('div', { className: 'max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20' },
      createElement('div', { className: 'relative w-full md:w-1/2 flex justify-center md:justify-end' },
        createElement('div', { className: 'relative w-64 md:w-72 h-[500px] bg-gray-800 rounded-[2.5rem] border-8 border-gray-700 shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition duration-500' })
      ),
      createElement('div', { className: 'w-full md:w-1/2 text-center md:text-left' },
        createElement('h2', { className: 'text-4xl md:text-5xl font-bold leading-tight mb-6' }, 'Manage your projects ', createElement('br'), ' from your mobile ⚡'),
        createElement('p', { className: 'text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto md:mx-0' }, 'Download the app to manage your projects and keep track of progress.'),
        createElement('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10' },
          createElement('button', { className: 'flex items-center gap-3 px-5 py-2.5 bg-black border border-gray-700 rounded-lg hover:bg-gray-900 transition' },
             createElement(Apple, { className: 'w-8 h-8 fill-current' }),
             createElement('div', { className: 'text-left' }, createElement('div', { className: 'text-[10px] uppercase text-gray-400 font-semibold' }, 'Download on the'), createElement('div', { className: 'text-lg font-bold leading-none' }, 'App Store'))
          ),
          createElement('button', { className: 'flex items-center gap-3 px-5 py-2.5 bg-black border border-gray-700 rounded-lg hover:bg-gray-900 transition' },
             createElement(Play, { className: 'w-7 h-7 fill-current' }),
             createElement('div', { className: 'text-left' }, createElement('div', { className: 'text-[10px] uppercase text-gray-400 font-semibold' }, 'GET IT ON'), createElement('div', { className: 'text-lg font-bold leading-none' }, 'Google Play'))
          )
        )
      )
    )
  );
}