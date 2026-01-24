import React, { createElement } from 'https://esm.sh/react@18';

export default function Toolbar({ layout = 'horizontal', actions = 1, search = true }) {
  return createElement('div', { className: 'flex items-center gap-4 p-4 border-b flex items-center gap-4' }, [
    actions?.map((action, i) => createElement('button', { key: i, className: 'px-4 py-2 border rounded' }, action.label || action))
      || []
  ]);
}
