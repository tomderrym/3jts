import React, { createElement } from 'https://esm.sh/react@18';

export default function Modal1({ size = 'sm', closable = true, backdrop = true }) {
  return createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center' }, [
    createElement('div', { className: 'bg-white rounded-lg p-6 max-w-md' }, [
      createElement('h2', { className: 'text-2xl font-bold mb-4' }, title || 'Modal'),
      createElement('div', {}, content || children),
      closable && createElement('button', { className: 'mt-4 px-4 py-2 bg-gray-200 rounded' }, 'Close')
    ])
  ]);
}
