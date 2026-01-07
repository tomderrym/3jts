/**
 * Comp Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { ChevronRight, MoreHorizontal } from "lucide-react@0.487.0";


function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return createElement('nav', {label: 'breadcrumb', slot: 'breadcrumb'});
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    createElement('ol', {slot: 'breadcrumb-list'})
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    createElement('li', {slot: 'breadcrumb-item'})
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  export default function Comp = asChild ? Slot : "a";

  return (
    createElement('Comp', {slot: 'breadcrumb-link'})
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    createElement('span', {slot: 'breadcrumb-page', role: 'link', disabled: 'true', current: 'page'})
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return createElement('li', {slot: 'breadcrumb-separator', role: 'presentation', hidden: 'true'}, 'svg]:size-3.5", className)}
      {...props}
    >
      {children ?? createElement('ChevronRight', null)}');
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return createElement('span', {slot: 'breadcrumb-ellipsis', role: 'presentation', hidden: 'true'}, 'createElement('MoreHorizontal', {className: 'size-4'})
      createElement('span', {className: 'sr-only'}, 'More')');
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
