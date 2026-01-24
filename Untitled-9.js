import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Twitter, Mail } from 'https://esm.sh/lucide-react';

export default function SignInBar() {
  return createElement('div', { className: 'bg-black text-white py-8 px-4 font-sans' },
    createElement('div', { className: 'max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6' },
      createElement('h2', { className: 'text-2xl md:text-3xl font-serif leading-tight text-center md:text-left' }, 
        'Urna, suspendisse ut ', createElement('br'), ' facilisis duis'
      ),
      createElement('div', { className: 'flex flex-wrap justify-center gap-4' },
        createElement('button', { className: 'flex items-center gap-3 px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition text-sm font-medium' },
          createElement(Twitter, { className: 'w-5 h-5 fill-current' }),
          'Sign in with Twitter'
        ),
        createElement('button', { className: 'flex items-center gap-3 px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition text-sm font-medium' },
          // Simple SVG for Google since it's not in standard Lucide
          createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: 20, height: 20, fill: 'currentColor' },
             createElement('path', { d: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.053-1.147 7.92-3.067 1.947-1.947 2.533-5.04 2.533-7.573 0-.52-.053-1.04-.16-1.52h-10.293z' })
          ),
          'Sign in with Google'
        ),
        createElement('button', { className: 'flex items-center gap-3 px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition text-sm font-medium' },
          createElement(Mail, { className: 'w-5 h-5' }),
          'Sign in with email'
        )
      )
    )
  );
}