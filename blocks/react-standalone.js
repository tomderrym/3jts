// Fixed Hero Block - Uses React from the app context (not imported)
// This version works with the RemoteBlockRenderer wrapper

/**
 * Hero Section Block
 * Props: { title?: string, subtitle?: string, ctaText?: string }
 * 
 * NOTE: This block should NOT import React. The RemoteBlockRenderer
 * will ensure it uses the app's React instance via React.createElement.
 */
export default function Hero01({ 
  title = 'Welcome to Our Platform',
  subtitle = 'Build amazing applications with AI-powered blocks',
  ctaText = 'Get Started'
}) {
  // Use React.createElement directly (will use app's React via wrapper)
  // In a real block, you'd use JSX, but for standalone blocks we use createElement
  const React = (globalThis as any).React || (window as any).React;
  
  if (!React || !React.createElement) {
    throw new Error('React is not available. Make sure the block is wrapped by RemoteBlockRenderer.');
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
      onMouseOver: (e: any) => e.currentTarget.style.transform = 'scale(1.05)',
      onMouseOut: (e: any) => e.currentTarget.style.transform = 'scale(1)'
    }, ctaText)
  ]);
}

