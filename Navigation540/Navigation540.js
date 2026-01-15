// Standalone Navigation540 Block
// Pure React runtime - generated from blueprint
// NO metadata - see meta.json for purpose, tags, category

import React, { createElement } from 'https://esm.sh/react@18';

export default function Navigation540({ title = 'Navigation540', logo = 'http://localhost:3000/img/logo-cloud.092c568.png', items = [] }) {
  return createElement('header', {
    className: 'flex items-center justify-between p-4 bg-white border-b'
  }, [
    createElement('div', {
      key: 'brand',
      className: 'flex items-center gap-2'
    }, [
      logo && createElement('img', {
        key: 'logo',
        src: logo,
        alt: title || 'Logo',
        className: 'h-8'
      }),
      createElement('span', {
        key: 'title',
        className: 'text-xl font-bold'
      }, title)
    ].filter(Boolean)),
    items && Array.isArray(items) && items.length > 0 && createElement('nav', {
      key: 'nav',
      className: 'flex gap-4'
    }, items.map((item, i) => createElement('a', {
      key: i,
      href: typeof item === 'string' ? item : (item.href || '#'),
      className: 'text-gray-700 hover:text-blue-600'
    }, typeof item === 'string' ? item : (item.title || item.name || item))))
  ].filter(Boolean));
}
