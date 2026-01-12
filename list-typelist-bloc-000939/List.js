import React, { createElement } from 'https://esm.sh/react@18';

export default function List({ layout = 'vertical', density = 'compact', dividers = true }) {
  return createElement('ul', { className: 'space-y-2' }, [
    items?.map((item, i) => createElement('li', { key: i, className: 'py-2' }, item))
      || []
  ]);
}
