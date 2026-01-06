# Fix: React Version Mismatch Error

## The Problem

Your block loads successfully, but you're getting:
```
Error: A React Element from an older version of React was rendered
```

This happens because your block imports React from `esm.sh/react@18`, which creates React elements that are incompatible with your app's React instance.

## The Solution

Update your block file to **NOT import React**. Instead, it should use the React that's already available in your app.

### Update Your Block File

Replace the content of `hero-01-standalone.js` in your GitHub repo with this:

```javascript
/**
 * Hero Section Block
 * Props: { title?: string, subtitle?: string, ctaText?: string }
 * 
 * NOTE: This block does NOT import React. The RemoteBlockRenderer
 * ensures it uses the app's React instance.
 */
export default function Hero01({ 
  title = 'Welcome to Our Platform',
  subtitle = 'Build amazing applications with AI-powered blocks',
  ctaText = 'Get Started'
}) {
  // Get React from the app's context (injected by RemoteBlockRenderer)
  // In production blocks, you'd use JSX, but for standalone we use createElement
  const React = (typeof window !== 'undefined' && (window as any).React) || 
                (typeof globalThis !== 'undefined' && (globalThis as any).React);
  
  if (!React || !React.createElement) {
    // Fallback: try to get it from the module system
    // This is a workaround - ideally blocks shouldn't need React at all
    throw new Error('React is not available in block context');
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

### Better Solution: Use JSX (Recommended for Production)

For production blocks, you should:

1. **Build blocks with Vite/Rollup** that bundles React (or marks it as external)
2. **Use JSX** in your block source
3. **Configure the build** to use the same React version as your app

Example block source (with JSX):
```jsx
export default function Hero01({ 
  title = 'Welcome to Our Platform',
  subtitle = 'Build amazing applications',
  ctaText = 'Get Started'
}) {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', ... }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button onClick={() => alert('Clicked!')}>{ctaText}</button>
    </div>
  );
}
```

Then build it with Vite configured to use React as an external dependency (so it uses the app's React).

## Quick Fix for Now

1. **Update your block file** in GitHub with the version above (no React import)
2. **Commit and push**
3. **Refresh your Blocks view** in the app
4. The error should be gone!

The RemoteBlockRenderer wrapper I added will help, but the block itself needs to not import its own React.

