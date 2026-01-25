import React from 'https://esm.sh/react@18';
import { createElement, Fragment } from 'https://esm.sh/react@18';
import { createRoot } from 'https://esm.sh/react-dom@18/client';

// Import the components we created (assuming they are in the same file or imported)
import { BreadHero, SubscriptionSection, BlogIndexWithSearch, Footer } from './components.js';

function App() {
  return createElement(Fragment, null,
    // 1. Hero
    createElement(BreadHero),
    
    // 2. Blog Grid
    createElement(BlogIndexWithSearch),
    
    // 3. Subscription Section
    createElement(SubscriptionSection),
    
    // 4. Simple Footer (Inline example)
    createElement('footer', { className: 'bg-black text-gray-500 py-8 text-center text-sm font-sans border-t border-gray-900' },
      '© 2024 Bread & Butter. All rights reserved.'
    )
  );
}

// Mount to DOM
const root = createRoot(document.getElementById('root'));
root.render(createElement(App));