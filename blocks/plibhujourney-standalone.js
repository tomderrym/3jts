// Standalone PLIBHUJourney Block - Works with dynamic import()
// React via CDN, no JSX, no bundler required

import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

/**
 * PLIBHUJourney Block
 * Props:
 *  - title?: string
 *  - description?: string
 */
export default function PLIBHUJourney({
  title = 'PLIBHU Journey',
  description = 'This is the PLIBHU Journey component rendered as a standalone React block.'
}) {
  return createElement(
    'div',
    {
      style: {
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        maxWidth: '800px',
        margin: '0 auto'
      }
    },
    [
      createElement(
        'h2',
        {
          key: 'title',
          style: {
            fontSize: '2rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            color: '#111827'
          }
        },
        title
      ),

      createElement(
        'p',
        {
          key: 'description',
          style: {
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#374151',
            margin: 0
          }
        },
        description
      )
    ]
  );
}
