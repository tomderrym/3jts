import React, { createElement } from 'https://esm.sh/react@18';

export default function Testimonials({ layout = 'grid', avatar = true, quoteStyle = 'short' }) {
  return createElement('section', { className: 'py-16 grid grid-cols-1 md:grid-cols-3 gap-8' }, [
    testimonials?.map((testimonial, i) => createElement('div', { key: i, className: 'p-6 border rounded-lg' }, [
      createElement('p', { className: 'text-gray-700' }, testimonial.quote),
      createElement('div', { className: 'mt-4 flex items-center' }, [
        createElement('div', { className: 'font-semibold' }, testimonial.author),
        createElement('div', { className: 'text-sm text-gray-500 ml-2' }, testimonial.role)
      ])
    })) || []
  ]);
}
