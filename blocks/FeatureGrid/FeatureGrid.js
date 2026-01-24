import React, { createElement } from 'https://esm.sh/react@18';

export default function FeatureGrid({ columns = 3, alignment = 'center', density = 'comfortable', icon = 'filled' }) {
  return createElement('section', { className: 'py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-16' }, [
    features?.map((feature, i) => createElement('div', { key: i, className: 'p-6' }, [
      feature.icon && createElement('div', { className: 'w-12 h-12 bg-blue-100 rounded' }),
      createElement('h3', { className: 'text-xl font-semibold mt-4' }, feature.title),
      createElement('p', { className: 'text-gray-600 mt-2' }, feature.description)
    })) || []
  ]);
}
