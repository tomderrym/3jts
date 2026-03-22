import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Truck, RotateCw, ArrowLeft, ArrowRight } from 'https://esm.sh/lucide-react';

// 1. Coupon Banner
export function CouponBanner() {
  return createElement('div', { className: 'w-full bg-white py-3 border-b border-gray-100 flex justify-center items-center px-4 font-sans' },
    createElement('p', { className: 'text-gray-800 text-sm md:text-base font-medium' },
      'Want to save more? Use coupon ',
      createElement('span', { className: 'font-bold text-black' }, 'SAVE20'),
      ' on checkout to save 20% extra!'
    )
  );
}

// 2. Shipping Banner
export function ShippingBanner() {
  return createElement('div', { className: 'w-full bg-gray-50 py-2 px-6 flex justify-end items-center border-b border-gray-100 font-sans' },
    createElement('div', { className: 'flex items-center gap-2 text-gray-900 text-sm font-medium' },
      createElement(Truck, { size: 18 }),
      createElement('span', null, 'Free delivery on orders over $200')
    )
  );
}

// 3. Black Friday Banner
export function BlackFridayBanner() {
  return createElement('div', { className: 'bg-gray-900 text-white py-3 px-4 text-center border-b border-gray-800 font-sans' },
    createElement('div', { className: 'flex justify-center items-center gap-2 text-sm md:text-base' },
      createElement('span', { className: 'font-medium' }, 'Black Friday Deal! Offer ends in:'),
      createElement('span', { className: 'font-bold text-yellow-400 font-mono tracking-widest' }, '21h : 37m : 46s')
    )
  );
}

// 4. Load More Button
export function LoadMoreButton() {
  return createElement('div', { className: 'w-full bg-white py-8 flex justify-center font-sans' },
    createElement('button', { className: 'group flex items-center gap-3 text-xs font-bold text-gray-900 tracking-widest uppercase hover:text-blue-600 transition-colors' },
      createElement(RotateCw, { className: 'w-4 h-4 group-hover:animate-spin' }),
      'Load More Articles'
    )
  );
}

// 5. Pagination Bar
export function PaginationBar() {
  return createElement('div', { className: 'w-full bg-white py-12 px-4 font-sans' },
    createElement('div', { className: 'max-w-6xl mx-auto flex justify-between items-center' },
      createElement('button', { className: 'flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-black tracking-widest uppercase transition-colors group' },
        createElement(ArrowLeft, { className: 'w-4 h-4 text-gray-400 group-hover:text-black transition-colors' }),
        'Load Oldest'
      ),
      createElement('button', { className: 'flex items-center gap-3 text-xs font-bold text-black hover:text-gray-600 tracking-widest uppercase transition-colors group' },
        'Load Newest',
        createElement(ArrowRight, { className: 'w-4 h-4 text-black group-hover:text-gray-600 transition-colors' })
      )
    )
  );
}