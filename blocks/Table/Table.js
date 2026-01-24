import React, { createElement } from 'https://esm.sh/react@18';

export default function Table({ columns = 2, sortable = true, selectable = true }) {
  return createElement('table', { className: 'w-full border-collapse' }, [
    createElement('thead', {}, [
      createElement('tr', {}, headers?.map((h, i) => createElement('th', { key: i, className: 'border p-2' }, h)) || [])
    ]),
    createElement('tbody', {}, rows?.map((row, i) => 
      createElement('tr', { key: i }, row.map((cell, j) => createElement('td', { key: j, className: 'border p-2' }, cell)))
    ) || [])
  ]);
}
