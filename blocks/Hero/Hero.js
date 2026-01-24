import React, { createElement } from 'https://esm.sh/react@18';

export default function Hero({ layout = 'split', textAlign = 'center', media = 'image', ctaCount = 1, emphasis = 'media' }) {
  return createElement('section', { className: 'py-20 grid md:grid-cols-2 gap-12 items-center text-center' }, [
    createElement('div', { key: 'content' }, [
      createElement('h1', { className: 'text-4xl font-bold' }, headline || 'Hero Title'),
      createElement('p', { className: 'text-lg mt-4' }, subtext || 'Hero subtitle'),
      cta && createElement('button', { className: 'mt-6 px-6 py-3 bg-blue-500 text-white rounded' }, cta)
    ]),
    createElement('div', { key: 'media' }, image ? createElement('img', { src: image, alt: 'Hero' }) : null)
  ]);
}
