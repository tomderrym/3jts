/**
 * Heart Component

 */
# Custom Components + Remote Blocks Integration Guide

## 🎯 Overview

This guide explains how to combine your **custom Tailwind-based components** with **remote blocks** from `github.com/tomderrym/3jts`.

## 🏗️ Architecture

```
Your App
├── Custom Components (/components/)
│   ├── CommonComponents.tsx (Buttons, Cards, Modals, etc.)
│   └── UIComponentsLibrary.tsx (Badges, Avatars, Toasts, etc.)
│
└── Remote Blocks (from blocks_index)
    ├── Hero sections
    ├── Navigation components
    ├── Feature sections
    └── Other reusable blocks
```

## 🔗 Integration Strategies

### Strategy 1: Remote Blocks as Base, Custom Components for Enhancement

Use remote blocks for structure, enhance with your custom components:

```tsx




function EnhancedHero({ blockId, title, subtitle }) {
  return (
    <div>
      {/* Remote block provides base structure */}
      <RemoteBlockRenderer 
        block={heroBlock}
        props={{ title, subtitle }}
      />
      
      {/* Enhance with custom components */}
      <div className="mt-4 flex gap-2">
        <Button variant="primary">Get Started</Button>
        <Badge variant="new">New Feature</Badge>
      </div>
    </div>
  );
}
```

### Strategy 2: Custom Components Wrap Remote Blocks

Wrap remote blocks in your custom components for consistent styling:

```tsx



function BlockCard({ block, ...props }) {
  return (
    <Card variant="elevated" className="p-6">
      <RemoteBlockRenderer block={block} props={props} />
    </Card>
  );
}
```

### Strategy 3: Hybrid Approach

Mix remote blocks and custom components in the same layout:

```tsx


import { toast } from 'sonner';

function LandingPage() {
  return (
    <div>
      {/* Remote Hero Block */}
      <RemoteBlockRenderer block={heroBlock} />
      
      {/* Custom Feature Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card key={feature.id} variant="outlined">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Button onClick={() => toast.success('Clicked!')}>
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Remote CTA Block */}
      <RemoteBlockRenderer block={ctaBlock} />
    </div>
  );
}
```

## 🎨 Styling Remote Blocks with Your System

### Option 1: CSS Variables (Recommended)

Define CSS variables in `/styles/globals.css` that remote blocks can use:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --border-radius: 0.5rem;
  --spacing-unit: 1rem;
}

/* Remote blocks can use these */
.remote-block {
  color: var(--primary-color);
  border-radius: var(--border-radius);
}
```

### Option 2: Tailwind Classes via Props

Pass Tailwind classes to remote blocks via props:

```tsx
<RemoteBlockRenderer 
  block={block}
  props={{
    className: "bg-blue-500 text-white rounded-lg p-4",
    buttonClass: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700"
  }}
/>
```

### Option 3: Wrapper Components

Create wrapper components that apply your styling:

```tsx
function StyledRemoteBlock({ block, variant = 'default', ...props }) {
  const variantClasses = {
    default: "bg-white dark:bg-gray-800 rounded-lg shadow",
    elevated: "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
    outlined: "border border-gray-200 dark:border-gray-700 rounded-lg"
  };
  
  return (
    <div className={variantClasses[variant]}>
      <RemoteBlockRenderer block={block} props={props} />
    </div>
  );
}
```

## 🔧 Component Extractor Integration

When extracting components, ensure they follow your styling approach:

### Extracted Block Template

```tsx
// blocks/hero-01-standalone.js
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

export default function Hero01({ 
  title = 'Welcome',
  subtitle = 'Build amazing apps',
  className = '',
  ...props 
}) {
  return createElement('div', {
    className: `bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg ${className}`,
    ...props
  }, [
    createElement('h1', { key: 'title', className: 'text-4xl font-bold mb-4' }, title),
    createElement('p', { key: 'subtitle', className: 'text-xl mb-6' }, subtitle),
    // Use Tailwind classes, not custom component classes
    createElement('button', {
      key: 'cta',
      className: 'px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors',
      onClick: () => alert('CTA clicked!')
    }, 'Get Started')
  ]);
}
```

## 📦 Using Your Utility Libraries in Blocks

Remote blocks can use your utility libraries if they're available globally:

### Icons (lucide-react)

```tsx
// In your app setup
import * as LucideIcons from 'lucide-react';
(window as any).LucideIcons = LucideIcons;

// In remote blocks
const Heart = (window as any).LucideIcons?.Heart;
```

### Toast Notifications (sonner)

```tsx
// Make toast available globally
import { toast } from 'sonner';
(window as any).toast = toast;

// Remote blocks can use it
(window as any).toast?.success('Action completed!');
```

## 🎯 Best Practices

### 1. Keep Remote Blocks Simple

Remote blocks should use:
- ✅ Tailwind utility classes
- ✅ Standard HTML elements
- ✅ Basic React patterns
- ❌ NOT your custom component library (they won't be available)

### 2. Enhance with Custom Components Locally

```tsx
// ❌ Don't do this in remote blocks


// ✅ Do this instead
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click Me
</button>

// ✅ Then enhance locally

<Button variant="primary">Enhanced Button</Button>
```

### 3. Use Props for Customization

```tsx
// Remote block accepts styling props
<RemoteBlockRenderer 
  block={block}
  props={{
    title: "Custom Title",
    className: "custom-classes",
    buttonText: "Custom Button",
    // Pass your design tokens
    primaryColor: "bg-blue-500",
    borderRadius: "rounded-lg"
  }}
/>
```

## 🔄 Workflow: Creating Blocks from Your Components

1. **Build with Custom Components Locally**
   ```tsx
   
   
   function MyFeature() {
     return (
       <Card variant="elevated">
         <Button>Click Me</Button>
       </Card>
     );
   }
   ```

2. **Convert to Standalone Block**
   - Replace custom components with Tailwind classes
   - Remove local imports
   - Make it work with `createElement`

3. **Extract via Component Extractor**
   - Component Extractor will convert it
   - Save to GitHub
   - Add to `blocks_index`

4. **Use as Remote Block**
   ```tsx
   <RemoteBlockRenderer block={extractedBlock} />
   ```

## 📚 Example: Complete Integration

```tsx





function App() {
  const { blocks, loading } = useBlocks();
  
  return (
    <>
      <ToastContainer />
      
      {/* Remote Hero Block */}
      {blocks.hero && (
        <RemoteBlockRenderer 
          block={blocks.hero}
          props={{ title: "Welcome", subtitle: "Get started" }}
        />
      )}
      
      {/* Custom Feature Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card key={feature.id} variant="elevated">
                <Badge variant="new">New</Badge>
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {feature.description}
                </p>
                <Button 
                  variant="primary"
                  onClick={() => toast.success('Feature clicked!')}
                  className="mt-4"
                >
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Remote CTA Block */}
      {blocks.cta && (
        <RemoteBlockRenderer block={blocks.cta} />
      )}
    </>
  );
}
```

## 🎨 Design Token Integration

Share design tokens between custom components and remote blocks:

```tsx
// tokens.ts
export const tokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  }
};

// Use in custom components
<Button style={{ backgroundColor: tokens.colors.primary }}>

// Pass to remote blocks
<RemoteBlockRenderer 
  block={block}
  props={{ tokens }}
/>
```

## ✅ Checklist for Block Integration

- [ ] Remote block uses Tailwind classes (not custom components)
- [ ] Custom components wrap/enhance remote blocks locally
- [ ] Design tokens are shared via props
- [ ] Toast/notifications are available globally if needed
- [ ] Icons use lucide-react (verify existence first)
- [ ] Responsive classes are included (sm:, md:, lg:)
- [ ] Dark mode classes are included (dark:)
- [ ] Accessibility attributes are present

## 🚀 Quick Reference

**Custom Components**: Use for complex, app-specific UI
**Remote Blocks**: Use for reusable, simple components

**Mix them**: Remote blocks for structure, custom components for enhancement!

---

This approach gives you the best of both worlds:
- ✅ Reusable blocks from GitHub
- ✅ Custom components for your specific needs
- ✅ Consistent styling with Tailwind
- ✅ Full control and flexibility

