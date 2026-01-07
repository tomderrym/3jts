import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
/**
 * COLORS Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
# Utility Libraries Reference

Complete guide to utility libraries following Figma Make standards.

---

## 📦 Core Libraries (Included by Default)

### lucide-react (Icons)
**Version**: `^0.462.0`  
**Already included**: ✅ Yes

```typescript
import { Home, User, Settings, Menu, X, Check, Alert, Camera, Mic } from 'lucide-react';

createElement('Home', {className: 'text-blue-400'})
createElement('User', null)
createElement('Camera', {className: 'text-white/70'})
```

**⚠️ Important**: Always verify icon exists in lucide-react before using!

---

## 🎨 Recommended Add-ons

### 1. Forms: react-hook-form@7.55.0
**Install**:
```json
"dependencies": {
  "react-hook-form": "7.55.0"
}
```

**Usage**:
```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  return createElement('form', {onSubmit: handleSubmit(onSubmit)}, 'createElement('input', null)
      {errors.email && createElement('span', null, '{errors.email.message}')}
      
      createElement('input', {type: 'password'})
      
      createElement('button', {type: 'submit'}, 'Submit')');
}
```

---

### 2. Toasts: sonner@2.0.3
**Install**:
```json
"dependencies": {
  "sonner": "2.0.3"
}
```

**Setup**:
```typescript
// App.tsx
import { Toaster, toast } from 'sonner';

export default function App() {
  return (
    <>
      createElement('Toaster', {position: 'top-center', theme: 'dark'})
      {/* Your app */}
    </>
  );
}
```

**Usage**:
```typescript
toast.success('Success message');
toast.error('Error occurred');
toast('Info message', { duration: 2000 });
toast.loading('Loading...');

// Promise handling
toast.promise(
  fetch('/api/data'),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load'
  }
);
```

---

### 3. Animations: motion/react
**Install**:
```json
"dependencies": {
  "motion": "^11.15.0"
}
```

**Usage**:
```typescript
import { motion } from 'motion/react';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide in
<motion.div
  initial={{ x: -100 }}
  animate={{ x: 0 }}
  transition={{ type: 'spring', stiffness: 100 }}
>
  Content
</motion.div>

// Scale
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.button>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
    Item 1
  </motion.div>
  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
    Item 2
  </motion.div>
</motion.div>
```

---

### 4. Charts: recharts
**Install**:
```json
"dependencies": {
  "recharts": "^2.10.0"
}
```

**Line Chart**:
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', sales: 4000, expenses: 2400 },
  { month: 'Feb', sales: 3000, expenses: 1398 },
  { month: 'Mar', sales: 5000, expenses: 9800 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    createElement('CartesianGrid', {strokeDasharray: '3 3', stroke: '#ffffff20'})
    createElement('XAxis', {dataKey: 'month', stroke: '#94a3b8'})
    createElement('YAxis', {stroke: '#94a3b8'})
    createElement('Tooltip', {ontentStyle: { 
        backgroundColor: '#1e293b', 
        border: '1px solid #334155'})
    createElement('Line', {type: 'monotone', dataKey: 'sales', stroke: '#3b82f6'})
    createElement('Line', {type: 'monotone', dataKey: 'expenses', stroke: '#ef4444'})
  </LineChart>
</ResponsiveContainer>
```

**Bar Chart**:
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    createElement('CartesianGrid', {strokeDasharray: '3 3', stroke: '#ffffff20'})
    createElement('XAxis', {dataKey: 'name', stroke: '#94a3b8'})
    createElement('YAxis', {stroke: '#94a3b8'})
    createElement('Tooltip', null)
    createElement('Bar', {dataKey: 'value', fill: '#3b82f6'})
  </BarChart>
</ResponsiveContainer>
```

**Pie Chart**:
```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
      label
    >
      {data.map((entry, index) => (
        createElement('Cell', null)
      ))}
    </Pie>
    createElement('Legend', null)
  </PieChart>
</ResponsiveContainer>
```

---

### 5. Carousels: react-slick
**Install**:
```json
"dependencies": {
  "react-slick": "^0.30.0",
  "slick-carousel": "^1.8.1"
}
```

**Add CSS** (in index.html):
```html
createElement('link', {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css'})
createElement('link', {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css'})
```

**Usage**:
```typescript
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 }
    }
  ]
};

<Slider {...settings}>
  {items.map(item => (
    <div key={item.id} className="px-2">
      createElement('Card', null, '{item.content}')
    </div>
  ))}
</Slider>
```

---

### 6. Masonry Layouts: react-responsive-masonry
**Install**:
```json
"dependencies": {
  "react-responsive-masonry": "^2.1.7"
}
```

**Usage**:
```typescript
import { ResponsiveMasonry, Masonry } from 'react-responsive-masonry';

<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
  <Masonry gutter="16px">
    {items.map(item => (
      createElement('Card', null, '{item.content}')
    ))}
  </Masonry>
</ResponsiveMasonry>
```

---

### 7. Drag & Drop: react-dnd
**Install**:
```json
"dependencies": {
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1"
}
```

**Draggable Item**:
```typescript
import { useDrag } from 'react-dnd';

function DraggableCard({ id, content }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    createElement('div', {style: {{ opacity: isDragging ? 0.5 : 1 }}, '{content}')
  );
}
```

**Drop Zone**:
```typescript
import { useDrop } from 'react-dnd';

function DropZone({ onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    createElement('div', null, 'Drop here')
  );
}
```

---

### 8. Popovers: react-popper
**Install**:
```json
"dependencies": {
  "react-popper": "^2.3.0",
  "@popperjs/core": "^2.11.8"
}
```

**Usage**:
```typescript
import { usePopper } from 'react-popper';
import { useState } from 'react';

function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <>
      createElement('div', null, 'setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}')
      {show && (
        createElement('div', {className: 'bg-slate-800 px-3 py-2 rounded text-white z-50', style: {styles.popper}}, '{content}')
      )}
    </>
  );
}
```

---

### 9. Resizable: re-resizable
**Install**:
```json
"dependencies": {
  "re-resizable": "^6.9.11"
}
```

**Note**: Use `re-resizable`, NOT `react-resizable` (doesn't work in this environment)

**Usage**:
```typescript
import { Resizable } from 're-resizable';

<Resizable
  defaultSize={{ width: 320, height: 200 }}
  minWidth={200}
  minHeight={100}
  maxWidth={600}
  className="bg-white/5 border border-white/10 rounded-lg"
>
  <div className="p-4">
    createElement('p', {className: 'text-white'}, 'Resizable content')
  </div>
</Resizable>
```

---

## 🎯 Library Selection Guide

| Need | Library | Version | Priority |
|------|---------|---------|----------|
| **Icons** | lucide-react | ^0.462.0 | ⭐⭐⭐ Default |
| **Forms** | react-hook-form | 7.55.0 | ⭐⭐⭐ Essential |
| **Toasts** | sonner | 2.0.3 | ⭐⭐⭐ Essential |
| **Animations** | motion/react | ^11.15.0 | ⭐⭐ Recommended |
| **Charts** | recharts | ^2.10.0 | ⭐⭐ Recommended |
| **Carousels** | react-slick | ^0.30.0 | ⭐ Optional |
| **Masonry** | react-responsive-masonry | ^2.1.7 | ⭐ Optional |
| **Drag & Drop** | react-dnd | ^16.0.1 | ⭐ Optional |
| **Popovers** | react-popper | ^2.3.0 | ⭐ Optional |
| **Resizable** | re-resizable | ^6.9.11 | ⭐ Optional |

---

## 🚀 Quick Install Commands

### Essential Pack
```bash
npm install react-hook-form@7.55.0 sonner@2.0.3 motion
```

### Full Pack
```bash
npm install react-hook-form@7.55.0 sonner@2.0.3 motion recharts react-slick slick-carousel react-responsive-masonry react-dnd react-dnd-html5-backend react-popper @popperjs/core re-resizable
```

### By Category
```bash
# Forms
npm install react-hook-form@7.55.0

# Notifications
npm install sonner@2.0.3

# Visual Effects
npm install motion recharts

# Advanced UI
npm install react-slick slick-carousel react-responsive-masonry react-dnd react-dnd-html5-backend react-popper @popperjs/core re-resizable
```

---

## 📝 Usage Patterns

### Pattern 1: Form with Toast Notifications
```typescript
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

function ContactForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    toast.loading('Sending...');
    try {
      await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send');
    }
  };

  return createElement('form', {onSubmit: handleSubmit(onSubmit)}, '...');
}
```

### Pattern 2: Animated Card Grid
```typescript
import { motion } from 'motion/react';

function CardGrid({ items }) {
  return createElement('div', {className: 'grid grid-cols-1 md:grid-cols-3 gap-4'}, '{items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          createElement('Card', null, '{item.content}')
        </motion.div>
      ))}');
}
```

### Pattern 3: Interactive Dashboard
```typescript
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { motion } from 'motion/react';

function Dashboard() {
  const handleAction = () => {
    toast.success('Action completed!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          createElement('Line', {dataKey: 'value', stroke: '#3b82f6'})
        </LineChart>
      </ResponsiveContainer>
      
      createElement('Button', {onClick: handleAction}, 'Perform Action')
    </motion.div>
  );
}
```

---

## ⚠️ Important Notes

### Version Specificity
Always use exact versions for:
- ✅ `react-hook-form@7.55.0` (not ^7.55.0)
- ✅ `sonner@2.0.3` (not ^2.0.3)

### Common Pitfalls
- ❌ Don't use `react-resizable` (use `re-resizable` instead)
- ❌ Don't use old `framer-motion` (use `motion/react` instead)
- ❌ Don't forget CSS for react-slick
- ❌ Don't override typography with Tailwind unless requested

### Bundle Size Considerations
- Core libs (lucide, forms, toasts): ~50KB
- Charts (recharts): ~100KB
- Animations (motion): ~25KB
- Full pack: ~200KB (still reasonable)

---

## 🎨 Styling Integration

All libraries work seamlessly with Tailwind:

```typescript
// motion/react + Tailwind
<motion.div className="bg-blue-500 rounded-lg p-4">
  Animated content
</motion.div>

// recharts + Tailwind container
<div className="bg-white/5 rounded-2xl p-6">
  <ResponsiveContainer width="100%" height={300}>
    createElement('LineChart', null, '...')
  </ResponsiveContainer>
</div>

// sonner + Tailwind classes (auto-inherits dark theme)
toast.success('Success!');  // Styled to match your dark theme
```

---

## 📚 Full Package.json Example

```json
{
  "name": "app-runner-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.462.0",
    "@capacitor/core": "^5.7.0",
    "@capacitor/android": "^5.7.0",
    "react-hook-form": "7.55.0",
    "sonner": "2.0.3",
    "motion": "^11.15.0",
    "recharts": "^2.10.0",
    "react-slick": "^0.30.0",
    "slick-carousel": "^1.8.1",
    "react-responsive-masonry": "^2.1.7",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-popper": "^2.3.0",
    "@popperjs/core": "^2.11.8",
    "re-resizable": "^6.9.11"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.0",
    "@capacitor/cli": "^5.7.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18"
  }
}
```

---

## 🎉 Summary

You now have access to:
- ✅ **10+ utility libraries** ready to use
- ✅ **Complete examples** for each
- ✅ **Best practices** and patterns
- ✅ **Figma Make standards** compliance
- ✅ **Mobile-optimized** by default

**Start building feature-rich apps!** 🚀

