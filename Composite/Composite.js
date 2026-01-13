import React, { createElement } from 'https://esm.sh/react@18';

export default function Composite({  }) {
  return createElement('div', { className: 'composite' }, children || []);
}
