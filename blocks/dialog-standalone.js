import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
/**
 * Dialog Component
 * Props: { props?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export default function Dialog = DialogPrimitive.Root;
export default function DialogTrigger = DialogPrimitive.Trigger;
export default function DialogClose = DialogPrimitive.Close;

export default function DialogPortal = (props: DialogPrimitive.DialogPortalProps) => (
  createElement('DialogPrimitive', null)
);

export default function DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  createElement('DialogPrimitive', null)
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export default function DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  createElement('DialogPrimitive', null)
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export default function DialogHeader = (props: React.ComponentPropsWithoutRef<'div'>) => (
  createElement('div', {className: 'space-y-1 text-center sm:text-left'})
);
DialogHeader.displayName = 'DialogHeader';

export default function DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  createElement('DialogPrimitive', null)
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export default function DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  createElement('DialogPrimitive', null)
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
};
