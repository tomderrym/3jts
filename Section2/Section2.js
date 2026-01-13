import React, { createElement } from 'https://esm.sh/react@18';

export default function Section2({ links = 0, layout = 'simple', social = true, newsletter = true }) {
  return createElement('footer', { className: 'py-12 bg-gray-50' }, [
    columns?.map((col, i) => createElement('div', { key: i }, [
      createElement('h4', { className: 'font-semibold' }, col.title),
      createElement('ul', { className: 'mt-4 space-y-2' }, col.links?.map((link, j) => 
        createElement('li', { key: j }, createElement('a', { href: link.href }, link.label))
      ) || []))
    ])) || []
  ]);
}
