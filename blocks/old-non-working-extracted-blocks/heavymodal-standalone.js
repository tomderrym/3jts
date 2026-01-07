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
  return (
    <div>
      <ToastContainer />
      {/* Your app content */}
    </div>
  );
}
```

### Step 3: Use Components
```tsx
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <Card>
      <h2>Hello World</h2>
      <Button onClick={() => setShowModal(true)}>
        Open Modal
      </Button>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <p>Modal content here</p>
      </Modal>
    </Card>
  );
}
```

---

## 🎯 All Components at a Glance

### From CommonComponents.tsx

#### Buttons
```tsx
<Button variant="primary">Click Me</Button>
<Button variant="secondary" size="lg">Large</Button>
<Button variant="danger" loading>Deleting...</Button>
```

#### Cards
```tsx
<Card variant="bordered" hoverable>Content</Card>
<Card variant="elevated" padding="lg">Content</Card>
```

#### Modals
```tsx
<Modal isOpen={open} onClose={close} title="My Modal">
  Content
</Modal>

<ConfirmModal
  isOpen={open}
  onClose={close}
  onConfirm={handleDelete}
  message="Delete this item?"
/>
```

#### Dropdowns
```tsx
<Dropdown trigger={<button>Menu</button>}>
  <DropdownItem icon={Edit}>Edit</DropdownItem>
  <DropdownItem icon={Trash2} variant="danger">Delete</DropdownItem>
</Dropdown>
```

#### Inputs
```tsx
<Input 
  label="Email" 
  value={email} 
  onChange={setEmail}
  icon={Mail}
  error={error}
/>

<Textarea 
  label="Description"
  value={text}
  onChange={setText}
  maxLength={500}
/>

<Checkbox label="I agree" checked={agree} onChange={setAgree} />
<Radio label="Option 1" name="choice" value="1" checked={choice === '1'} onChange={setChoice} />
```

#### Selects
```tsx
<Select
  value={country}
  onChange={setCountry}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
/>
```

#### Tabs
```tsx
<Tabs
  tabs={[
    { id: '1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: '2', label: 'Tab 2', content: <div>Content 2</div>, icon: Settings }
  ]}
/>
```

---

### From UIComponentsLibrary.tsx

#### Badges
```tsx
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge size="sm">Small</Badge>
```

#### Avatars
```tsx
<Avatar src="https://..." fallback="JD" />
<Avatar fallback="AB" status="online" size="lg" />
```

#### Loading
```tsx
<Spinner />
<Spinner size="lg" color="text-green-500" />
<LoadingDots />
<LoadingBar progress={50} />
```

#### Alerts & Toasts
```tsx
<Alert variant="success" title="Success!">
  Changes saved
</Alert>

// Anywhere in your app:
toast.success('Saved!');
toast.error('Failed!');
toast.warning('Warning!');
toast.info('FYI');
```

#### Progress
```tsx
<ProgressCircle progress={75} size="lg" />
<LoadingBar progress={60} />
```

#### Skeleton
```tsx
<Skeleton variant="text" width="60%" />
<Skeleton variant="circular" width={60} height={60} />
<SkeletonCard />
```

#### Empty State
```tsx
<EmptyState
  icon={Package}
  title="No items"
  description="Add your first item"
  action={<Button>Add Item</Button>}
/>
```

#### Navigation
```tsx
<Breadcrumbs
  items={[
    { label: 'Home', onClick: () => {} },
    { label: 'Current' }
  ]}
/>

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

#### Other
```tsx
<Divider />
<Divider label="OR" />

<Accordion
  items={[
    { title: 'Q1', content: 'Answer 1' },
    { title: 'Q2', content: 'Answer 2' }
  ]}
/>

<Stepper
  steps={['Step 1', 'Step 2', 'Step 3']}
  currentStep={1}
/>
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
<Button className="shadow-lg my-4">Custom</Button>

// Override Tailwind styles
<Card className="bg-purple-50 border-purple-200">Purple</Card>
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
  
  return (
    <div className="space-y-4">
      <Input
        label="Email"
        value={email}
        onChange={setEmail}
        error={error}
        icon={Mail}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
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
        <Plus size={16} />
        Add Item
      </Button>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {/* Create form */}
      </Modal>
      
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
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No data"
        description="Nothing to show yet"
      />
    );
  }
  
  return <DataList data={data} />;
}
```

### User Profile
```tsx
<div className="flex items-center gap-3">
  <Avatar 
    src={user.avatar}
    fallback={user.initials}
    status="online"
    size="lg"
  />
  <div>
    <div className="flex items-center gap-2">
      <span>{user.name}</span>
      <Badge variant="primary">Pro</Badge>
    </div>
    <p className="text-sm text-gray-600">{user.email}</p>
  </div>
</div>
```

---

## 🎭 Live Examples

### See It In Action
```tsx
// Import and use the showcase

export default function App() {
  return <ComponentShowcase />;
}
```

### Real-World Dashboard
```tsx
// Complete working example

export default function App() {
  return <CompleteExample />;
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
  <X size={20} />
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
  <Card>Mobile: 1 col</Card>
  <Card>Tablet: 2 cols</Card>
  <Card>Desktop: 3 cols</Card>
</div>
```

---

## 🔧 Extending Components

### Create Composite Components
```tsx
function ProductCard({ product }: { product: Product }) {
  return (
    <Card hoverable>
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3>{product.name}</h3>
          <Badge variant="success">{product.price}</Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <Button fullWidth>Add to Cart</Button>
      </div>
    </Card>
  );
}
```

### Add Custom Variants
```tsx
function CustomButton({ variant, ...props }: any) {
  // Extend with your own variants
  if (variant === 'purple') {
    return (
      <Button {...props} className="bg-purple-500 hover:bg-purple-600 text-white" />
    );
  }
  return <Button variant={variant} {...props} />;
}
```

---

## 🚀 Performance Tips

### Lazy Load Modals
```tsx
import { lazy, Suspense } from 'react';

const HeavyModal = lazy(() => import('./HeavyModal'));

<Suspense fallback={<Spinner />}>
  {showModal && <HeavyModal />}
</Suspense>
```

### Memoize Expensive Components
```tsx
import { memo } from 'react';

const ExpensiveList = memo(({ items }: { items: any[] }) => {
  return <div>{/* Render items */}</div>;
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
| Button | `<Button>` | `<Button variant="primary">Click</Button>` |
| Container | `<Card>` | `<Card variant="elevated">Content</Card>` |
| Dialog | `<Modal>` | `<Modal isOpen={open} onClose={close}>` |
| Text input | `<Input>` | `<Input label="Name" value={v} onChange={setV} />` |
| Dropdown | `<Dropdown>` | `<Dropdown trigger={btn}>Items</Dropdown>` |
| Status | `<Badge>` | `<Badge variant="success">Active</Badge>` |
| User image | `<Avatar>` | `<Avatar fallback="JD" status="online" />` |
| Loading | `<Spinner>` | `<Spinner size="lg" />` |
| Notification | `toast.success()` | `toast.success('Saved!')` |
| Empty view | `<EmptyState>` | `<EmptyState icon={Box} title="No items" />` |

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
