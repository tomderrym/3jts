import React, { createElement } from 'https://esm.sh/react@18';

export default function ContentSplit2({ mediaSize = 'sm', mediaPosition = 'left', verticalAlign = 'top' }) {
  return createElement('section', { className: 'py-16 grid md:grid-cols-2 gap-12' }, [
    createElement('div', { key: 'content' }, [
      createElement('h2', { className: 'text-3xl font-bold' }, title || 'Title'),
      createElement('p', { className: 'mt-4' }, description || 'Description')
    ]),
    createElement('div', { key: 'media' }, image ? createElement('img', { src: image, alt: 'Content' }) : null)
  ]);
}
