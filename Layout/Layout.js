// Standalone Layout Block
// Pure React runtime - generated from blueprint
// NO metadata - see meta.json for purpose, tags, category

import React, { createElement } from 'https://esm.sh/react@18';

export default function Layout({ title = 'Layout', text = '', href = '' }) {
  return createElement('div', {
    className: 'p-4'
  }, [
    createElement('h2', {
      key: 'title',
      className: 'text-xl font-semibold mb-2'
    }, title),
    text && createElement('p', {
      key: 'text',
      className: 'text-gray-600'
    }, text),
    
  ].filter(Boolean));
}
