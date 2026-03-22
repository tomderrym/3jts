import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { ArrowLeft, ArrowRight } from 'https://esm.sh/lucide-react';

// 17. Latest NFTs (Place Bid)
export function LatestNFTsBid() {
  const nfts = [
    { name: "Kitchen", color: "bg-blue-300" },
    { name: "Speedwell", color: "bg-green-200" },
    { name: "High Kingdom", color: "bg-orange-200" },
    { name: "The Dude", color: "bg-teal-200" },
    { name: "Tough Nut", color: "bg-pink-200" },
  ];
  return createElement('div', { className: 'bg-white py-16 px-4 font-sans' },
    createElement('div', { className: 'max-w-7xl mx-auto' },
      createElement('div', { className: 'text-center mb-12' },
        createElement('h2', { className: 'text-3xl font-bold text-gray-900 mb-3' }, 'Latest NFTs'),
        createElement('p', { className: 'text-gray-500 text-sm' }, 'In a creative workplace, employees responsibly try different solutions')
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6' },
        nfts.map((nft, idx) => createElement('div', { key: idx, className: 'border border-gray-100 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white' },
          createElement('div', { className: `aspect-square w-full ${nft.color} flex items-end justify-center relative` },
            createElement('div', { className: 'w-24 h-40 bg-black/10 rounded-t-xl transform translate-y-4' })
          ),
          createElement('div', { className: 'p-4' },
            createElement('div', { className: 'flex justify-between items-start mb-4' },
              createElement('h3', { className: 'font-bold text-gray-900 text-sm' }, nft.name),
              createElement('div', { className: 'w-6 h-6 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-[8px] text-white font-bold' }, 'FA')
            ),
            createElement('div', { className: 'flex justify-between items-center text-xs text-gray-500 mb-4' },
              createElement('span', null, 'Price'),
              createElement('div', { className: 'font-medium text-gray-900' }, '1.4 ETH ', createElement('span', { className: 'text-gray-400 font-normal' }, '(2,352 USD)'))
            ),
            createElement('button', { className: 'w-full border border-gray-200 text-xs font-bold py-3 uppercase tracking-wider text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors rounded' }, 'Place Bid')
          )
        ))
      )
    )
  );
}

// 18. Featured NFTs (Dark Cards with Stats)
export function FeaturedNFTsDark() {
  const nfts = [
    { title: "Grave Digger", bg: "bg-gray-200" },
    { title: "Cujo", bg: "bg-blue-100" },
    { title: "Drugstore Cowboy", bg: "bg-pink-100" },
    { title: "Keystone", bg: "bg-gray-300" }
  ];
  return createElement('div', { className: 'bg-white py-12 px-4 font-sans' },
    createElement('div', { className: 'max-w-7xl mx-auto' },
      createElement('div', { className: 'flex justify-between items-center mb-8' },
        createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Featured NFTs'),
        createElement('div', { className: 'flex gap-2' },
          createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-900 transition' }, createElement(ArrowLeft, { className: 'w-5 h-5' })),
          createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-900 transition' }, createElement(ArrowRight, { className: 'w-5 h-5' }))
        )
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
        nfts.map((nft, idx) => createElement('div', { key: idx, className: 'bg-[#1A202C] rounded-lg overflow-hidden group' },
          createElement('div', { className: 'p-3' },
            createElement('div', { className: `aspect-square ${nft.bg} rounded-lg flex items-end justify-center overflow-hidden` },
              createElement('div', { className: 'w-20 h-32 bg-black/10 rounded-t-lg backdrop-blur-sm transform translate-y-2' })
            )
          ),
          createElement('div', { className: 'px-4 pb-6 pt-2' },
            createElement('h3', { className: 'text-white font-bold text-lg' }, nft.title),
            createElement('p', { className: 'text-gray-500 text-xs mb-4' }, '3233 NFTs'),
            createElement('div', { className: 'border-t border-gray-700 pt-4 flex justify-between items-center' },
              createElement('div', null, createElement('p', { className: 'text-[10px] text-gray-400 uppercase tracking-wide' }, 'FLOOR'), createElement('p', { className: 'text-white font-bold text-sm' }, '2.1 SOL')),
              createElement('div', { className: 'text-right' }, createElement('p', { className: 'text-[10px] text-gray-400 uppercase tracking-wide' }, '30D AVG PRICE'), createElement('p', { className: 'text-white font-bold text-sm' }, '1.9 SOL'))
            )
          )
        ))
      )
    )
  );
}

// 19. Featured Drops (Cartoon)
export function FeaturedDrops() {
  const drops = [
    { title: "Psycho Thinker", count: "307/1000", img: "bg-blue-400" },
    { title: "Washer", count: "184/1000", img: "bg-green-400" },
    { title: "Tough Nut", count: "97/1000", img: "bg-yellow-300" },
    { title: "The Dude", count: "42/1000", img: "bg-teal-700" }
  ];
  return createElement('div', { className: 'bg-white py-16 px-4 font-sans' },
    createElement('div', { className: 'max-w-7xl mx-auto' },
      createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-center mb-10 gap-4' },
        createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Featured Drops'),
        createElement('button', { className: 'px-6 py-2 border border-gray-300 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition' }, 'All Featured Drops')
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' },
        drops.map((drop, idx) => createElement('div', { key: idx, className: 'group' },
          createElement('div', { className: `aspect-square rounded-lg mb-4 overflow-hidden ${drop.img} relative flex items-center justify-center` },
            createElement('div', { className: 'text-white text-9xl font-bold opacity-30 select-none' }, '?')
          ),
          createElement('div', { className: 'flex justify-between items-baseline mb-4' },
            createElement('h3', { className: 'text-sm font-bold text-gray-900' }, drop.title),
            createElement('span', { className: 'text-xs text-gray-400' }, drop.count)
          ),
          createElement('button', { className: 'w-full border border-gray-200 text-xs font-bold text-gray-500 py-3 uppercase tracking-wider rounded hover:border-gray-900 hover:text-gray-900 transition' }, 'See on OpenSea')
        ))
      )
    )
  );
}