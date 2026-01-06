# Update Your Block File to Fix React Version Mismatch

## The Problem

Your block imports React from `esm.sh`, which creates React elements incompatible with your app's React. Even though we inject React globally, the ESM import happens first.

## The Solution

Update your block file to **NOT import React**. Instead, it should use the global React that's injected by RemoteBlockRenderer.

## Step-by-Step Fix

### 1. Go to your GitHub repo
https://github.com/tomderrym/3jts/blob/main/blocks/hero-01-standalone.js

### 2. Click "Edit" (pencil icon)

### 3. Replace the entire file content with this:

```javascript
/**
 * Hero Section Block
 * Props: { title?: string, subtitle?: string, ctaText?: string }
 * 
 * NOTE: This block does NOT import React. It uses the global React
 * injected by RemoteBlockRenderer to avoid version mismatches.
 */
export default function Hero01({ 
  title = 'Welcome to Our Platform',
  subtitle = 'Build amazing applications with AI-powered blocks',
  ctaText = 'Get Started'
}) {
  // Get React from global scope (injected by RemoteBlockRenderer)
  const React = (typeof window !== 'undefined' && window.React) || 
                (typeof globalThis !== 'undefined' && globalThis.React);
  
  if (!React || !React.createElement) {
    throw new Error('React is not available. This block must be loaded via RemoteBlockRenderer.');
  }
  
  return React.createElement('div', {
    style: {
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '8px',
      fontFamily: 'system-ui, sans-serif'
    }
  }, [
    React.createElement('h1', {
      key: 'title',
      style: { fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }
    }, title),
    React.createElement('p', {
      key: 'subtitle',
      style: { fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9, margin: '0 0 2rem 0' }
    }, subtitle),
    React.createElement('button', {
      key: 'cta',
      onClick: () => alert('CTA clicked!'),
      style: {
        padding: '0.75rem 2rem',
        fontSize: '1rem',
        fontWeight: '600',
        background: 'white',
        color: '#667eea',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'transform 0.2s'
      },
      onMouseOver: (e) => e.currentTarget.style.transform = 'scale(1.05)',
      onMouseOut: (e) => e.currentTarget.style.transform = 'scale(1)'
    }, ctaText)
  ]);
}
```

### 4. Commit the changes

### 5. Refresh your Blocks view

The React version mismatch error should be gone!

## Key Changes

1. **Removed** `import React from 'https://esm.sh/react@18';`
2. **Removed** `import { createElement } from 'https://esm.sh/react@18';`
3. **Added** code to get React from global scope
4. **Changed** `createElement` to `React.createElement`

## Why This Works

- RemoteBlockRenderer injects your app's React into `window.React` before loading the block
- The block now uses that React instead of importing its own
- All React elements are created with the same React instance = no version mismatch!

