import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

export default function LatestNFTs() {
  const nfts = [
    { name: "Kitchen", color: "bg-blue-300" },
    { name: "Speedwell", color: "bg-green-200" },
    { name: "High Kingdom Warrior", color: "bg-orange-200" },
    { name: "The Dude", color: "bg-teal-200" },
    { name: "Tough Nut", color: "bg-pink-200" },
  ];

  return createElement('div', { className: 'bg-white py-16 px-4 font-sans' },
    createElement('div', { className: 'max-w-7xl mx-auto' },
      createElement('div', { className: 'text-center mb-12' },
        createElement('h2', { className: 'text-3xl font-bold text-gray-900 mb-3' }, 'Latest NFTs'),
        createElement('p', { className: 'text-gray-500 text-sm' }, 
          'In a creative workplace, employees responsibly try different solutions'
        )
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6' },
        nfts.map((nft, idx) => 
          createElement('div', { key: idx, className: 'border border-gray-100 shadow-sm rounded-none hover:shadow-md transition-shadow' },
            // Image Area
            createElement('div', { className: `aspect-square w-full ${nft.color} flex items-end justify-center overflow-hidden` },
              createElement('div', { className: 'w-24 h-40 bg-gray-400/20 rounded-t-xl backdrop-blur-sm transform translate-y-4' })
            ),
            // Content
            createElement('div', { className: 'p-4' },
              createElement('h3', { className: 'font-bold text-gray-900 mb-4 text-sm' }, nft.name),
              createElement('div', { className: 'flex justify-between items-center text-xs text-gray-500 mb-4' },
                createElement('span', null, 'Price'),
                createElement('div', { className: 'font-medium text-gray-900' }, 
                  '1.4 ETH ',
                  createElement('span', { className: 'text-gray-400 font-normal' }, '(2,352 USD)')
                )
              ),
              createElement('button', { className: 'w-full border border-gray-900 text-xs font-bold py-3 uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors' }, 'Buy on OpenSea')
            )
          )
        )
      )
    )
  );
}