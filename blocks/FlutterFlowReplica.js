import React from 'https://esm.sh/react@18';
import { createElement, useState, useEffect, useRef, useMemo } from 'https://esm.sh/react@18';
import { Star, ChevronDown, ChevronRight, Plus, Minus, CreditCard, RotateCw, X } from 'https://esm.sh/lucide-react';

/**
 * UTILITIES
 */
const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * 1. FORM COMPONENTS
 */

// FlutterFlowSignature
export function SignaturePad() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return createElement('div', { className: 'flex flex-col gap-2' },
    createElement('div', { className: 'border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden touch-none' },
      createElement('canvas', {
        ref: canvasRef,
        width: 400,
        height: 150,
        className: 'w-full h-full cursor-crosshair',
        onMouseDown: startDrawing,
        onMouseMove: draw,
        onMouseUp: () => setIsDrawing(false),
        onMouseLeave: () => setIsDrawing(false)
      })
    ),
    createElement('button', { 
      onClick: clear,
      className: 'self-end text-xs text-red-500 font-medium hover:underline'
    }, 'Clear Signature')
  );
}

// FlutterFlowCheckboxGroup
export function CheckboxGroup({ options = [], onChange }) {
  const [selected, setSelected] = useState([]);

  const toggle = (opt) => {
    const newVal = selected.includes(opt) 
      ? selected.filter(s => s !== opt)
      : [...selected, opt];
    setSelected(newVal);
    if(onChange) onChange(newVal);
  };

  return createElement('div', { className: 'flex flex-col gap-2' },
    options.map(opt => 
      createElement('label', { key: opt, className: 'flex items-center gap-3 cursor-pointer group' },
        createElement('div', { 
          className: cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
            selected.includes(opt) ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300 group-hover:border-blue-400"
          )
        }, selected.includes(opt) && createElement('span', { className: 'text-white text-xs font-bold' }, '✓')),
        createElement('span', { className: 'text-sm text-gray-700 font-medium' }, opt),
        createElement('input', { 
          type: 'checkbox', 
          className: 'hidden', 
          checked: selected.includes(opt), 
          onChange: () => toggle(opt) 
        })
      )
    )
  );
}

// FlutterFlowChoiceChips
export function ChoiceChips({ options = [], onChange }) {
  const [selected, setSelected] = useState(options[0]);

  return createElement('div', { className: 'flex flex-wrap gap-2' },
    options.map(opt => 
      createElement('button', {
        key: opt,
        onClick: () => { setSelected(opt); if(onChange) onChange(opt); },
        className: cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
          selected === opt 
            ? "bg-blue-600 text-white shadow-md" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )
      }, opt)
    )
  );
}

// FlutterFlowCountController
export function CountController({ min = 0, max = 10, step = 1 }) {
  const [val, setVal] = useState(min);

  return createElement('div', { className: 'flex items-center gap-4 bg-gray-100 rounded-lg p-1 w-max' },
    createElement('button', { 
      onClick: () => setVal(Math.max(min, val - step)),
      className: "w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 text-gray-600"
    }, createElement(Minus, { size: 16 })),
    
    createElement('span', { className: 'font-mono font-bold text-gray-800 w-8 text-center' }, val),
    
    createElement('button', { 
      onClick: () => setVal(Math.min(max, val + step)),
      className: "w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 text-blue-600"
    }, createElement(Plus, { size: 16 }))
  );
}

// FlutterFlowRatingBar
export function RatingBar({ max = 5 }) {
  const [rating, setRating] = useState(3);
  const [hover, setHover] = useState(0);

  return createElement('div', { className: 'flex gap-1' },
    [...Array(max)].map((_, i) => {
      const starVal = i + 1;
      return createElement('button', {
        key: i,
        onMouseEnter: () => setHover(starVal),
        onMouseLeave: () => setHover(0),
        onClick: () => setRating(starVal),
        className: cn("transition-transform hover:scale-110", (hover || rating) >= starVal ? "text-yellow-400" : "text-gray-200")
      }, createElement(Star, { fill: "currentColor", size: 28 }));
    })
  );
}

// PinCodeTextField
export function PinCodeField({ length = 6 }) {
  const [pins, setPins] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (val, i) => {
    if (isNaN(val)) return;
    const newPins = [...pins];
    newPins[i] = val.slice(-1); // Only take last char
    setPins(newPins);

    // Auto-focus next
    if (val && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !pins[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  return createElement('div', { className: 'flex gap-2 justify-between max-w-sm' },
    pins.map((p, i) => 
      createElement('input', {
        key: i,
        ref: el => inputsRef.current[i] = el,
        type: 'text',
        value: p,
        onChange: (e) => handleChange(e.target.value, i),
        onKeyDown: (e) => handleKeyDown(e, i),
        className: cn(
          "w-10 h-12 border-2 rounded-lg text-center text-xl font-bold focus:outline-none transition-all",
          p ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white focus:border-blue-400"
        )
      })
    )
  );
}

// FlutterFlowCreditCardForm (Simplified Visual)
export function CreditCardForm() {
  return createElement('div', { className: 'p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4' },
    createElement('div', { className: 'flex items-center gap-2 mb-2 text-gray-900 font-bold' },
      createElement(CreditCard, { size: 20 }), 'Payment Details'
    ),
    createElement('input', { placeholder: 'Card Number', className: 'w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none' }),
    createElement('div', { className: 'flex gap-4' },
      createElement('input', { placeholder: 'MM/YY', className: 'w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none' }),
      createElement('input', { placeholder: 'CVC', className: 'w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none' })
    ),
    createElement('input', { placeholder: 'Cardholder Name', className: 'w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none' })
  );
}

/**
 * 2. LAYOUT COMPONENTS
 */

// FlutterFlowTabBar (Custom Tab Controller)
export function TabBarBlock() {
  const [active, setActive] = useState(0);
  const tabs = ['Home', 'Profile', 'Settings'];

  return createElement('div', { className: 'w-full' },
    // Tab Header
    createElement('div', { className: 'flex border-b border-gray-200 mb-6' },
      tabs.map((tab, i) => 
        createElement('button', {
          key: tab,
          onClick: () => setActive(i),
          className: cn(
            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            active === i ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )
        }, tab)
      )
    ),
    // Tab Content (Animated Fade)
    createElement('div', { className: 'bg-gray-50 rounded-xl p-8 min-h-[150px] flex items-center justify-center text-gray-400 font-mono' },
      `Content for ${tabs[active]} Tab`
    )
  );
}

// ExpandablePanel
export function ExpandablePanel({ title = "Header" }) {
  const [expanded, setExpanded] = useState(false);

  return createElement('div', { className: 'border border-gray-200 rounded-xl overflow-hidden bg-white' },
    createElement('button', {
      onClick: () => setExpanded(!expanded),
      className: 'w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors'
    },
      createElement('span', { className: 'font-semibold text-gray-800' }, title),
      createElement(ChevronDown, { className: cn("text-gray-400 transition-transform duration-300", expanded && "rotate-180") })
    ),
    createElement('div', {
      className: cn("overflow-hidden transition-all duration-300 ease-in-out bg-gray-50", expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0")
    },
      createElement('div', { className: 'p-4 text-sm text-gray-600 leading-relaxed' },
        "This is the expanded body text. It mimics the FlutterFlow Expandable widget functionality with smooth CSS transitions."
      )
    )
  );
}

// MasonryGridView (CSS Columns implementation)
export function MasonryGrid() {
  const heights = [150, 250, 180, 300, 160, 220]; // Random heights
  
  return createElement('div', { 
    className: 'columns-2 md:columns-3 gap-4 space-y-4' 
  },
    heights.map((h, i) => 
      createElement('div', { 
        key: i, 
        style: { height: h },
        className: 'bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl break-inside-avoid w-full flex items-center justify-center text-blue-300 font-bold text-2xl border border-blue-200'
      }, i + 1)
    )
  );
}

// FlipCard
export function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return createElement('div', { className: 'perspective-1000 w-48 h-64 cursor-pointer', onClick: () => setFlipped(!flipped) },
    createElement('div', {
      className: cn(
        "relative w-full h-full text-center transition-transform duration-700 transform-style-3d",
        flipped && "rotate-y-180"
      ),
      style: { transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' } // Tailwind sometimes needs explicit classes or plugin for this
    },
      // Front
      createElement('div', {
        className: 'absolute w-full h-full backface-hidden bg-blue-600 rounded-2xl shadow-xl flex items-center justify-center text-white flex-col gap-2',
        style: { backfaceVisibility: 'hidden' }
      },
        createElement(RotateCw, { className: 'animate-spin-slow' }),
        createElement('span', { className: 'font-bold' }, 'Click Me')
      ),
      // Back
      createElement('div', {
        className: 'absolute w-full h-full backface-hidden bg-purple-600 rounded-2xl shadow-xl flex items-center justify-center text-white rotate-y-180',
        style: { backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }
      },
        createElement('span', { className: 'font-bold text-xl' }, 'Back Side!')
      )
    )
  );
}

// SwipeableStack (Simplified Card Stack)
export function SwipeableStack() {
  const [cards, setCards] = useState([1, 2, 3]);

  const swipe = () => {
    // Move first to last
    const [first, ...rest] = cards;
    setCards([...rest, first]);
  };

  return createElement('div', { className: 'relative w-64 h-80 mx-auto' },
    cards.map((c, i) => {
      // Calculate stacking effect
      const offset = i * 10; 
      const scale = 1 - (i * 0.05);
      const zIndex = cards.length - i;

      return createElement('div', {
        key: c,
        onClick: i === 0 ? swipe : undefined,
        className: cn(
          "absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center text-4xl font-bold text-gray-800 transition-all duration-500",
          i === 0 ? "cursor-grab active:cursor-grabbing" : "opacity-50"
        ),
        style: {
          zIndex,
          transform: `translateY(${offset}px) scale(${scale})`,
          // Add a slight rotation to the top card for flair if clicked
        }
      }, `Card ${c}`);
    })
  );
}

/**
 * 3. MASTER PREVIEW APP
 */
export default function FlutterFlowGallery() {
  return createElement('div', { className: 'min-h-screen bg-gray-50 p-8 font-sans text-gray-900' },
    createElement('div', { className: 'max-w-5xl mx-auto space-y-12' },
      
      // Header
      createElement('div', { className: 'text-center space-y-4' },
        createElement('h1', { className: 'text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' }, 'FlutterFlow Components'),
        createElement('p', { className: 'text-gray-500' }, 'React Standalone Replicas of Flutter Widgets')
      ),

      // Section: Form Elements
      createElement('section', { className: 'space-y-6' },
        createElement('h2', { className: 'text-xl font-bold border-b pb-2' }, 'Form & Inputs'),
        createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
          createElement(Card, { title: 'Pin Code Field' }, createElement(PinCodeField)),
          createElement(Card, { title: 'Signature Pad' }, createElement(SignaturePad)),
          createElement(Card, { title: 'Choice Chips' }, createElement(ChoiceChips, { options: ['Option 1', 'Option 2', 'Option 3'] })),
          createElement(Card, { title: 'Checkbox Group' }, createElement(CheckboxGroup, { options: ['Notification', 'Email Updates', 'Dark Mode'] })),
          createElement(Card, { title: 'Rating Bar' }, createElement(RatingBar)),
          createElement(Card, { title: 'Count Controller' }, createElement(CountController)),
        )
      ),

      // Section: Complex Inputs
      createElement('section', { className: 'space-y-6' },
        createElement('h2', { className: 'text-xl font-bold border-b pb-2' }, 'Complex Interactions'),
        createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
          createElement(Card, { title: 'Credit Card Form' }, createElement(CreditCardForm)),
          createElement(Card, { title: 'Expandable Panel' }, createElement(ExpandablePanel)),
          createElement(Card, { title: 'Flip Card (Click)' }, createElement('div', { className: 'flex justify-center' }, createElement(FlipCard))),
        )
      ),

      // Section: Layouts
      createElement('section', { className: 'space-y-6' },
        createElement('h2', { className: 'text-xl font-bold border-b pb-2' }, 'Layouts'),
        createElement(Card, { title: 'Custom Tab Bar' }, createElement(TabBarBlock)),
        createElement(Card, { title: 'Masonry Grid View' }, createElement(MasonryGrid)),
        createElement('div', { className: 'h-96' }, /* Spacer for swipe stack height */
           createElement(Card, { title: 'Swipeable Stack (Click Top)' }, createElement(SwipeableStack))
        )
      )
    )
  );
}

// Simple Container Wrapper
function Card({ title, children }) {
  return createElement('div', { className: 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4' },
    createElement('h3', { className: 'text-sm font-bold text-gray-400 uppercase tracking-wider' }, title),
    children
  );
}