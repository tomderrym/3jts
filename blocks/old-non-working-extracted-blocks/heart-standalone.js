# Component Extractor Styling Guide

## 🎯 Overview

This guide ensures extracted components follow your **custom Tailwind-based styling approach** and can be easily integrated with your component library.

## ✅ Styling Rules for Extracted Blocks

### 1. Use Tailwind Utility Classes Only

**✅ DO:**
```tsx
createElement('button', {
  className: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
}, 'Click Me')
```

**❌ DON'T:**
```tsx
// Don't import custom components


// Don't use custom component classes
className: 'button-primary'
```

### 2. Responsive by Default

Always include responsive classes:

```tsx
createElement('div', {
  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-8'
})
```

### 3. Dark Mode Support

Include dark mode variants:

```tsx
createElement('div', {
  className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700'
})
```

### 4. Typography System

**✅ DO:**
```tsx
// Use semantic HTML with default typography
createElement('h1', { className: 'mb-4' }, title)
createElement('p', { className: 'text-gray-600 dark:text-gray-400' }, description)
```

**❌ DON'T:**
```tsx
// Don't override typography unless necessary
className: 'text-2xl font-bold' // Only if design specifically requires it
```

### 5. Utility Libraries Integration

#### Icons (lucide-react)

```tsx
// In extracted block, check if icons are available
const Heart = (globalThis as any).LucideIcons?.Heart;

if (Heart) {
  return createElement(Heart, { size: 20, className: 'text-red-500' });
}
```

#### Toast Notifications (sonner)

```tsx
const toast = (globalThis as any).toast;

if (toast) {
  toast.success('Action completed!');
}
```

## 📋 Component Extraction Checklist

When extracting components, ensure:

- [ ] Uses only Tailwind utility classes
- [ ] No imports of custom component library
- [ ] Responsive classes included (sm:, md:, lg:, xl:)
- [ ] Dark mode classes included (dark:)
- [ ] Uses `createElement` instead of JSX
- [ ] Exports default React component
- [ ] Props are typed and documented
- [ ] Accepts `className` prop for customization
- [ ] Uses semantic HTML elements
- [ ] Includes accessibility attributes (aria-*, role, etc.)

## 🎨 Example: Properly Styled Block

```tsx
// blocks/hero-01-standalone.js
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

/**
 * Hero Section Block
 * Props: { 
 *   title?: string, 
 *   subtitle?: string, 
 *   ctaText?: string,
 *   className?: string
 * }
 */
export default function Hero01({ 
  title = 'Welcome to Our Platform',
  subtitle = 'Build amazing applications with AI-powered blocks',
  ctaText = 'Get Started',
  className = '',
  ...props 
}) {
  return createElement('div', {
    className: `bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 sm:p-12 lg:p-16 rounded-lg ${className}`,
    ...props
  }, [
    createElement('h1', {
      key: 'title',
      className: 'mb-4 sm:mb-6'
    }, title),
    createElement('p', {
      key: 'subtitle',
      className: 'text-lg sm:text-xl mb-6 sm:mb-8 opacity-90'
    }, subtitle),
    createElement('button', {
      key: 'cta',
      className: 'px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600',
      onClick: () => {
        const toast = (globalThis as any).toast;
        if (toast) {
          toast.success('CTA clicked!');
        } else {
          alert('CTA clicked!');
        }
      },
      'aria-label': ctaText
    }, ctaText)
  ]);
}
```

## 🔧 Component Extractor Configuration

The component extractor should:

1. **Detect Custom Components**
   - Scan for imports from `./components/CommonComponents`
   - Scan for imports from `./components/UIComponentsLibrary`
   - Replace with Tailwind equivalents

2. **Convert JSX to createElement**
   - Transform JSX syntax to `createElement` calls
   - Preserve className and props

3. **Add Responsive Classes**
   - Ensure spacing uses responsive variants
   - Add breakpoint classes where appropriate

4. **Add Dark Mode**
   - Include dark: variants for colors
   - Include dark: variants for backgrounds

5. **Remove Local Imports**
   - Remove all local component imports
   - Remove local utility imports (keep only CDN imports)

## 🎯 Integration with Custom Components

### Strategy 1: Wrap Remote Blocks

```tsx



function StyledHero({ block, ...props }) {
  return (
    <Card variant="elevated" className="p-0 overflow-hidden">
      <RemoteBlockRenderer block={block} props={props} />
    </Card>
  );
}
```

### Strategy 2: Enhance with Custom Components

```tsx



function EnhancedFeature({ block, ...props }) {
  return (
    <div>
      <RemoteBlockRenderer block={block} props={props} />
      <div className="mt-4 flex gap-2">
        <Button variant="primary">Learn More</Button>
        <Badge variant="new">New</Badge>
      </div>
    </div>
  );
}
```

## 📚 Best Practices

1. **Keep Blocks Simple**
   - Remote blocks should be self-contained
   - Use Tailwind only, no custom dependencies

2. **Enhance Locally**
   - Add custom components in your app
   - Don't expect them in remote blocks

3. **Share Design Tokens**
   - Pass tokens via props
   - Use CSS variables for global tokens

4. **Test Responsiveness**
   - Test on mobile, tablet, desktop
   - Verify dark mode works

5. **Document Props**
   - Include JSDoc comments
   - Specify default values
   - List all available props

## 🚀 Quick Reference

| Aspect | Rule |
|--------|------|
| Styling | Tailwind utility classes only |
| Components | No custom component imports |
| Icons | Check for global LucideIcons |
| Toasts | Check for global toast |
| Responsive | Always include sm:, md:, lg: |
| Dark Mode | Always include dark: variants |
| Typography | Use semantic HTML, minimal overrides |
| Exports | Default export React component |
| Props | Accept className for customization |

---

Following these guidelines ensures extracted components work seamlessly with your custom component library! 🎨

