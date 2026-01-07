
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

/**
 * Hero Section Block
 * Props: { title?: string, subtitle?: string, ctaText?: string }
 */
export default function Hero01({ 
  title = 'Welcome to Our Platform',
  subtitle = 'Build amazing applications with AI-powered blocks',
  ctaText = 'Get Started'
}) {
  return createElement('div', {
    style: {
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '8px',
      fontFamily: 'system-ui, sans-serif'
    }
  }, [
    createElement('h1', {
      key: 'title',
      style: { fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }
    }, title),
    createElement('p', {
      key: 'subtitle',
      style: { fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9, margin: '0 0 2rem 0' }
    }, subtitle),
    createElement('button', {
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
