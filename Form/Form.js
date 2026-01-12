import React, { createElement } from 'https://esm.sh/react@18';

export default function Form({ layout = 'inline', fields = 6, submitStyle = 'primary' }) {
  return createElement('form', { className: 'flex flex-row gap-4' }, [
    fields?.map((field, i) => createElement('div', { key: i, className: 'mb-4' }, [
      createElement('label', { className: 'block mb-2' }, field.label),
      createElement('input', { type: field.type || 'text', className: 'w-full px-4 py-2 border rounded' })
    ])) || [],
    createElement('button', { type: 'submit', className: 'mt-4 px-6 py-2 bg-blue-500 text-white rounded' }, submitText || 'Submit')
  ]);
}
