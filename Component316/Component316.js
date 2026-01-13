import React, { createElement } from 'https://esm.sh/react@18';

export default function Component316({ plans = 3, highlight = 'middle', billing = 'monthly' }) {
  return createElement('section', { className: 'py-16 grid grid-cols-1 md:grid-cols-3 gap-8' }, [
    plans?.map((plan, i) => createElement('div', { key: i, className: 'p-8 border rounded-lg' }, [
      createElement('h3', { className: 'text-2xl font-bold' }, plan.name),
      createElement('div', { className: 'text-4xl font-bold mt-4' }, plan.price),
      createElement('ul', { className: 'mt-6 space-y-2' }, plan.features?.map((f, j) => 
        createElement('li', { key: j }, f)
      ) || []),
      createElement('button', { className: 'mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded' }, plan.cta || 'Get Started')
    })) || []
  ]);
}
