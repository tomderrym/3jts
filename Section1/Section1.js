import React, { createElement } from 'https://esm.sh/react@18';

export default function Section1({ layout = 'single', padding = 'none', background = 'transparent' }) {
  return createElement('section', { className: 'py-16 max-w-6xl mx-auto px-4' }, [
    content || children || 'Section content'
  ]);
}
