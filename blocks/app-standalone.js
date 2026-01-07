import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
/**
 * HeavyModal Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
# UI Components - Complete Summary

Everything you need to build beautiful apps with custom Tailwind components.

---

## 📦 What You Have

### ✅ Core Component Files
1. **`/components/CommonComponents.tsx`** - Most used components
   - Buttons, Cards, Modals, Dropdowns, Inputs, Tabs
   - Production-ready, fully typed

2. **`/components/UIComponentsLibrary.tsx`** - Extended components
   - Badges, Avatars, Spinners, Alerts, Toast
   - Progress, Skeleton, Navigation, Accordion, Stepper

3. **`/components/ComponentShowcase.tsx`** - Live demo
   - Interactive showcase of all components
   - See them in action

4. **`/components/CompleteExample.tsx`** - Real-world example
   - Complete dashboard application
   - Shows components working together

### 📚 Documentation
1. **`/CUSTOM_COMPONENT_LIBRARY.md`** - Full guide (partial)
2. **`/COMPONENT_QUICK_REFERENCE.md`** - Quick lookup
3. **`/UI_COMPONENTS_SUMMARY.md`** - This file

---

## 🚀 Quick Start (3 Steps)

### Step 1: Import Components
```tsx
// Common components

// Extended components
```

### Step 2: Add Toast Container (Once)
```tsx
// In your App.tsx root component

export default function App() {
  return createElement('div', null, 'createElement('ToastContainer', null)
      {/* Your app content */}');
}
```

### Step 3: Use Components
```tsx
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  
  return createElement('Card', null, 'createElement('h2', null, 'Hello World')
      createElement('Button', null, 'setShowModal(true)}>
        Open Modal')
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        createElement('p', null, 'Modal content here')
      </Modal>');
}
```

---

## 🎯 All Components at a Glance

### From CommonComponents.tsx

#### Buttons
```tsx
createElement('Button', {variant: 'primary'}, 'Click Me')
createElement('Button', {variant: 'secondary', size: 'lg'}, 'Large')
createElement('Button', {variant: 'danger'}, 'Deleting...')
```

#### Cards
```tsx
createElement('Card', {variant: 'bordered'}, 'Content')
createElement('Card', {variant: 'elevated', padding: 'lg'}, 'Content')
```

#### Modals
```tsx
createElement('Modal', {title: 'My Modal', onClose: close}, 'Content')

createElement('ConfirmModal', {message: 'Delete this item?', onClose: close, onConfirm: handleDelete})
```

#### Dropdowns
```tsx
<Dropdown trigger={createElement('button', null, 'Menu')}>
  createElement('DropdownItem', null, 'Edit')
  createElement('DropdownItem', {variant: 'danger'}, 'Delete')
</Dropdown>
```

#### Inputs
```tsx
createElement('Input', {label: 'Email', onChange: setEmail})

createElement('Textarea', {label: 'Description', onChange: setText})

createElement('Checkbox', {label: 'I agree', onChange: setAgree})
createElement('Radio', {label: 'Option 1', name: 'choice', value: '1', onChange: setChoice})
```

#### Selects
```tsx
createElement('Select', {onChange: setCountry, ons: [
    { value: 'us', label: 'United States'})
```

#### Tabs
```tsx
createElement('Tabs', null)
```

---

### From UIComponentsLibrary.tsx

#### Badges
```tsx
createElement('Badge', {variant: 'primary'}, 'New')
createElement('Badge', {variant: 'success'}, 'Active')
createElement('Badge', {size: 'sm'}, 'Small')
```

#### Avatars
```tsx
createElement('Avatar', {src: 'https://...', fallback: 'JD'})
createElement('Avatar', {fallback: 'AB', status: 'online', size: 'lg'})
```

#### Loading
```tsx
createElement('Spinner', null)
createElement('Spinner', {size: 'lg', color: 'text-green-500'})
createElement('LoadingDots', null)
createElement('LoadingBar', null)
```

#### Alerts & Toasts
```tsx
createElement('Alert', {variant: 'success', title: 'Success!'}, 'Changes saved')

// Anywhere in your app:
toast.success('Saved!');
toast.error('Failed!');
toast.warning('Warning!');
toast.info('FYI');
```

#### Progress
```tsx
createElement('ProgressCircle', {size: 'lg'})
createElement('LoadingBar', null)
```

#### Skeleton
```tsx
createElement('Skeleton', {variant: 'text', width: '60%'})
createElement('Skeleton', {variant: 'circular'})
createElement('SkeletonCard', null)
```

#### Empty State
```tsx
createElement('EmptyState', {title: 'No items', description: 'Add your first item'})
```

#### Navigation
```tsx
<Breadcrumbs
  items={[
    { label: 'Home', onClick: () => {} },
    { label: 'Current' }
  ]}
/>

createElement('Pagination', {onPageChange: setPage})
```

#### Other
```tsx
createElement('Divider', null)
createElement('Divider', {label: 'OR'})

createElement('Accordion', null)

createElement('Stepper', null)
```

---

## 🎨 Design System

### Color Variants
All components use consistent variants:
- **default** - Gray
- **primary** - Blue
- **success** - Green
- **warning** - Yellow
- **danger/error** - Red
- **info** - Cyan

### Sizes
Standard sizes across components:
- **xs** - Extra small
- **sm** - Small  
- **md** - Medium (default)
- **lg** - Large
- **xl** - Extra large

### Customization
```tsx
// Add custom classes
createElement('Button', {className: 'shadow-lg my-4'}, 'Custom')

// Override Tailwind styles
createElement('Card', {className: 'bg-purple-50 border-purple-200'}, 'Purple')
```

---

## 💡 Common Patterns

### Form with Validation
```tsx
function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    toast.success('Submitted!');
  };
  
  return createElement('div', {className: 'space-y-4'}, 'createElement('Input', {label: 'Email', onChange: setEmail})
      createElement('Button', {onClick: handleSubmit}, 'Submit')');
}
```

### CRUD Operations
```tsx
function ItemManager() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        createElement('Plus', null)
        Add Item
      </Button>
      
      createElement('Modal', null, 'setShowModal(false)}>
        {/* Create form */}')
      
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        message="Delete this item?"
      />
    </>
  );
}
```

### Loading States
```tsx
function DataLoader() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  if (loading) {
    return createElement('div', {className: 'space-y-4'}, 'createElement('SkeletonCard', null)
        createElement('SkeletonCard', null)');
  }
  
  if (data.length === 0) {
    return (
      createElement('EmptyState', {title: 'No data', description: 'Nothing to show yet'})
    );
  }
  
  return createElement('DataList', null);
}
```

### User Profile
```tsx
<div className="flex items-center gap-3">
  createElement('Avatar', {status: 'online', size: 'lg'})
  <div>
    <div className="flex items-center gap-2">
      createElement('span', null, '{user.name}')
      createElement('Badge', {variant: 'primary'}, 'Pro')
    </div>
    createElement('p', {className: 'text-sm text-gray-600'}, '{user.email}')
  </div>
</div>
```

---

## 🎭 Live Examples

### See It In Action
```tsx
// Import and use the showcase

export default function App() {
  return createElement('ComponentShowcase', null);
}
```

### Real-World Dashboard
```tsx
// Complete working example

export default function App() {
  return createElement('CompleteExample', null);
}
```

---

## ♿ Accessibility

All components include:
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support

```tsx
// Always provide aria-label for icon buttons
<button aria-label="Close">
  createElement('X', null)
</button>
```

---

## 🎯 Best Practices

### ✅ DO
- Use semantic HTML elements
- Provide labels for inputs
- Handle loading and error states
- Show user feedback (toasts)
- Use consistent spacing (Tailwind classes)
- Test keyboard navigation

### ❌ DON'T
- Nest buttons inside buttons
- Forget error handling
- Skip accessibility attributes
- Mix too many component variants
- Override default typography (unless asked)

---

## 📱 Responsive Design

All components are mobile-friendly:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  createElement('Card', null, 'Mobile: 1 col')
  createElement('Card', null, 'Tablet: 2 cols')
  createElement('Card', null, 'Desktop: 3 cols')
</div>
```

---

## 🔧 Extending Components

### Create Composite Components
```tsx
function ProductCard({ product }: { product: Product }) {
  return createElement('Card', null, 'createElement('img', {className: 'w-full h-48 object-cover rounded-t-lg'})
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          createElement('h3', null, '{product.name}')
          createElement('Badge', {variant: 'success'}, '{product.price}')
        </div>
        createElement('p', {className: 'text-gray-600 text-sm mb-4'}, '{product.description}')
        createElement('Button', null, 'Add to Cart')
      </div>');
}
```

### Add Custom Variants
```tsx
function CustomButton({ variant, ...props }: any) {
  // Extend with your own variants
  if (variant === 'purple') {
    return (
      createElement('Button', {className: 'bg-purple-500 hover:bg-purple-600 text-white'})
    );
  }
  return createElement('Button', null);
}
```

---

## 🚀 Performance Tips

### Lazy Load Modals
```tsx
import { lazy, Suspense } from 'react';

const HeavyModal = lazy(() => import('./HeavyModal'));

createElement('Suspense', null)}>
  {showModal && createElement('HeavyModal', null)}
</Suspense>
```

### Memoize Expensive Components
```tsx
import { memo } from 'react';

const ExpensiveList = memo(({ items }: { items: any[] }) => {
  return createElement('div', null, '{/* Render items */}');
});
```

---

## 📊 Component Checklist

When building a new feature, use these components:

- [ ] **Layout**: Card, Divider
- [ ] **Navigation**: Breadcrumbs, Tabs, Pagination
- [ ] **Forms**: Input, Textarea, Checkbox, Radio, Select
- [ ] **Actions**: Button, Dropdown
- [ ] **Feedback**: Toast, Alert, Modal
- [ ] **Status**: Badge, Avatar, ProgressCircle
- [ ] **Loading**: Spinner, Skeleton, LoadingBar
- [ ] **Empty**: EmptyState

---

## 🎓 Learning Path

### Beginner
1. Start with Button and Card
2. Add Input and Form components
3. Use Toast for notifications

### Intermediate
4. Implement Modals and Dropdowns
5. Add Tabs for organization
6. Use Skeleton for loading states

### Advanced
7. Build composite components
8. Create custom variants
9. Optimize performance

---

## 📝 Quick Reference

| Need | Use | Example |
|------|-----|---------|
| Button | `<Button>` | `createElement('Button', {variant: 'primary'}, 'Click')` |
| Container | `<Card>` | `createElement('Card', {variant: 'elevated'}, 'Content')` |
| Dialog | `<Modal>` | `<Modal isOpen={open} onClose={close}>` |
| Text input | `<Input>` | `createElement('Input', {label: 'Name', onChange: setV})` |
| Dropdown | `<Dropdown>` | `createElement('Dropdown', null, 'Items')` |
| Status | `<Badge>` | `createElement('Badge', {variant: 'success'}, 'Active')` |
| User image | `<Avatar>` | `createElement('Avatar', {fallback: 'JD', status: 'online'})` |
| Loading | `<Spinner>` | `createElement('Spinner', {size: 'lg'})` |
| Notification | `toast.success()` | `toast.success('Saved!')` |
| Empty view | `<EmptyState>` | `createElement('EmptyState', {title: 'No items'})` |

---

## 🎉 You're Ready!

You now have:
- ✅ 25+ production-ready components
- ✅ Complete examples and patterns
- ✅ Full TypeScript support
- ✅ Accessible and responsive
- ✅ Customizable with Tailwind

Start building amazing apps! 🚀

---

## 📚 Files to Reference

- **Quick Start**: This file
- **All Components**: `/components/CommonComponents.tsx` + `/components/UIComponentsLibrary.tsx`
- **Live Demo**: `/components/ComponentShowcase.tsx`
- **Real Example**: `/components/CompleteExample.tsx`
- **Quick Lookup**: `/COMPONENT_QUICK_REFERENCE.md`
