import React, { createElement } from 'https://esm.sh/react@18';

export default function Card({ media = 'none', actions = 0, elevation = 'flat' }) {
  return createElement('div', { className: 'p-6 rounded-lg border border-gray-200' }, [
    image && createElement('img', { src: image, alt: 'Card', className: 'w-full rounded mb-4' }),
    createElement('h3', { className: 'text-xl font-semibold' }, title || 'Card Title'),
    createElement('p', { className: 'mt-2 text-gray-600' }, description || 'Card description')
  ]);
}
