import React from 'https://esm.sh/react@18';
import { createElement, useState } from 'https://esm.sh/react@18';
import { MapPin, Mail, Phone, Twitter, Facebook, Instagram, Github } from 'https://esm.sh/lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted (check console)');
    console.log(formData);
  };

  // Helper for input fields to reduce code verbosity
  const renderInput = (label, name, type = 'text') => {
    return createElement('div', { className: 'space-y-2' },
      createElement('label', { className: 'text-sm font-medium text-gray-700' }, label),
      createElement('input', {
        type: type,
        name: name,
        value: formData[name],
        onChange: handleChange,
        className: 'w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
      })
    );
  };

  return createElement('div', { className: 'min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex flex-col items-center justify-center p-4 font-sans' },
    // Header
    createElement('div', { className: 'text-center text-white mb-12' },
      createElement('h1', { className: 'text-4xl font-bold mb-4' }, 'Contact us'),
      createElement('p', { className: 'text-gray-200 max-w-lg mx-auto' }, 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.')
    ),
    // Main Card
    createElement('div', { className: 'bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-2' },
      // Left: Form
      createElement('div', { className: 'p-8 md:p-12' },
        createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-8' }, 'Send us a message'),
        createElement('form', { onSubmit: handleSubmit, className: 'space-y-6' },
          createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
            renderInput('Your name', 'name'),
            renderInput('Your email', 'email', 'email')
          ),
          createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
            renderInput('Phone number', 'phone', 'tel'),
            renderInput('Company name', 'company')
          ),
          createElement('div', { className: 'space-y-2' },
            createElement('label', { className: 'text-sm font-medium text-gray-700' }, 'Message'),
            createElement('textarea', {
              name: 'message',
              rows: 4,
              onChange: handleChange,
              className: 'w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            })
          ),
          createElement('button', { className: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200' }, 'Send')
        )
      ),
      // Right: Info
      createElement('div', { className: 'bg-gray-50 p-8 md:p-12 flex flex-col justify-between' },
        createElement('div', null,
          createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-8' }, 'Contact info'),
          createElement('div', { className: 'space-y-6 text-gray-600' },
            createElement('div', { className: 'flex items-start gap-4' },
              createElement(MapPin, { className: 'w-6 h-6 text-blue-600 shrink-0 mt-1' }),
              createElement('p', null, '8502 Preston Rd. Inglewood, Maine 98380, USA')
            ),
            createElement('div', { className: 'flex items-center gap-4' },
              createElement(Mail, { className: 'w-6 h-6 text-blue-600 shrink-0' }),
              createElement('p', null, 'kenzi.lawson@example.com')
            ),
            createElement('div', { className: 'flex items-start gap-4' },
              createElement(Phone, { className: 'w-6 h-6 text-blue-600 shrink-0 mt-1' }),
              createElement('div', { className: 'space-y-1' },
                createElement('p', null, '(316) 555-0116'),
                createElement('p', null, '(316) 555-0117')
              )
            )
          )
        ),
        createElement('div', { className: 'mt-12' },
          createElement('p', { className: 'font-semibold text-gray-900 mb-4' }, 'Follow us on'),
          createElement('div', { className: 'flex gap-4' },
            [Twitter, Facebook, Instagram, Github].map((Icon, idx) => 
              createElement('a', { key: idx, href: '#', className: 'w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition text-gray-700' }, 
                createElement(Icon, { size: 18 })
              )
            )
          )
        )
      )
    )
  );
}