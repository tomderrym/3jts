import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Twitter, Mail } from 'https://esm.sh/lucide-react';

// 15. Baker Street Sign-In
export function BakerSignIn() {
  return createElement('div', { className: 'bg-[#111111] min-h-[600px] flex flex-col md:flex-row font-serif' },
    // Left Content
    createElement('div', { className: 'w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center' },
      createElement('div', { className: 'max-w-md mx-auto w-full' },
        createElement('div', { className: 'mb-12' },
          createElement('h1', { className: 'text-4xl md:text-5xl text-white mb-2' }, 'Welcome to'),
          createElement('div', { className: 'flex items-center gap-3 text-white text-3xl italic' },
            createElement('span', { className: 'text-4xl' }, '🌿'),
            createElement('span', null, 'BakerSTREET')
          )
        ),
        createElement('div', { className: 'space-y-4 font-sans' },
          createElement('button', { className: 'w-full flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#252525] text-white py-4 rounded-full transition duration-200 font-medium border border-gray-800' },
            createElement(Twitter, { className: 'w-5 h-5 fill-white' }), 'Sign in with Twitter'
          ),
          createElement('button', { className: 'w-full flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#252525] text-white py-4 rounded-full transition duration-200 font-medium border border-gray-800' },
            // Google SVG
            createElement('svg', { className: 'w-5 h-5', viewBox: '0 0 24 24', fill: 'white' }, createElement('path', { d: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.053-1.147 7.92-3.067 1.947-1.947 2.533-5.04 2.533-7.573 0-.52-.053-1.04-.16-1.52h-10.293z' })),
            'Sign in with Google'
          ),
          createElement('button', { className: 'w-full flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#252525] text-white py-4 rounded-full transition duration-200 font-medium border border-gray-800' },
            createElement(Mail, { className: 'w-5 h-5' }), 'Sign in with email'
          )
        )
      )
    ),
    // Right Image
    createElement('div', { className: 'w-full md:w-1/2 h-64 md:h-auto relative bg-gray-900' },
      createElement('img', { 
        src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000',
        className: 'absolute inset-0 w-full h-full object-cover opacity-80'
      }),
      createElement('div', { className: 'absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-transparent md:bg-gradient-to-r' })
    )
  );
}

// 16. Dark Sign-Up Form (Horizontal)
export function DarkSignUpForm() {
  return createElement('div', { className: 'bg-black text-white py-20 px-4 font-sans' },
    createElement('div', { className: 'max-w-6xl mx-auto text-center' },
      createElement('h2', { className: 'text-4xl md:text-5xl font-serif mb-4' }, 
        'Urna, suspendisse ut ', createElement('span', { className: 'italic' }, 'facilisis duis')
      ),
      createElement('p', { className: 'text-gray-500 mb-12 max-w-lg mx-auto' }, 'Amet id suspendisse viverra justo. Euismod venenatis, ut et ut hendrerit.'),
      createElement('form', { className: 'flex flex-col md:flex-row gap-4 max-w-4xl mx-auto items-stretch' },
        createElement('input', { type: 'text', placeholder: 'Full Name', className: 'flex-1 bg-transparent border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition' }),
        createElement('input', { type: 'email', placeholder: 'E-mail', className: 'flex-1 bg-transparent border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition' }),
        createElement('input', { type: 'password', placeholder: 'Password', className: 'flex-1 bg-transparent border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition' }),
        createElement('button', { className: 'bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition whitespace-nowrap' }, 'Get Started')
      )
    )
  );
}