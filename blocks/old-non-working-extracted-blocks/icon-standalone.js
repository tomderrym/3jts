/**
 * Icon Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, { useState } from 'https://esm.sh/react@18';
import { Search, Filter, Wrench, Droplet, Zap, Wind, Shield, Gauge, Calendar, MapPin, Star, Clock, ChevronRight, Settings } from 'lucide-react';
export function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const serviceCategories = [{
    id: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    color: 'text-blue-500 bg-blue-500/10'
  }, {
    id: 'oil',
    name: 'Oil Change',
    icon: Droplet,
    color: 'text-orange-500 bg-orange-500/10'
  }, {
    id: 'battery',
    name: 'Battery',
    icon: Zap,
    color: 'text-yellow-500 bg-yellow-500/10'
  }, {
    id: 'ac',
    name: 'AC Service',
    icon: Wind,
    color: 'text-cyan-500 bg-cyan-500/10'
  }, {
    id: 'brake',
    name: 'Brakes',
    icon: Shield,
    color: 'text-red-500 bg-red-500/10'
  }, {
    id: 'diagnostic',
    name: 'Diagnostic',
    icon: Gauge,
    color: 'text-purple-500 bg-purple-500/10'
  }];
  const upcomingBookings = [{
    id: 1,
    service: 'Oil Change & Inspection',
    mechanic: 'AutoCare Pro',
    date: 'Tomorrow, Nov 3',
    time: '10:00 AM',
    location: '123 Main St',
    status: 'scheduled',
    price: '$89.99'
  }, {
    id: 2,
    service: 'Brake Pad Replacement',
    mechanic: 'Elite Motors',
    date: 'Nov 10, 2025',
    time: '2:00 PM',
    location: '456 Oak Ave',
    status: 'confirmed',
    price: '$249.99'
  }];
  const pastBookings = [{
    id: 3,
    service: 'Battery Replacement',
    mechanic: 'QuickFix Garage',
    date: 'Oct 25, 2025',
    time: '11:00 AM',
    location: '789 Pine Rd',
    status: 'completed',
    price: '$159.99',
    rating: 5
  }, {
    id: 4,
    service: 'AC Service & Recharge',
    mechanic: 'AutoCare Pro',
    date: 'Oct 15, 2025',
    time: '3:00 PM',
    location: '123 Main St',
    status: 'completed',
    price: '$199.99',
    rating: 4
  }];
  return createElement("div", {
    className: "min-h-screen bg-background"
  }, createElement("header", {
    className: "bg-card border-b px-4 py-4 sticky top-0 z-10"
  }, createElement("div", {
    className: "max-w-screen-xl mx-auto"
  }, createElement("h1", {
    className: "text-2xl mb-4"
  }, "Services & Bookings"), createElement("div", {
    className: "relative"
  }, createElement(Search, {
    className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
  }), createElement(Input, {
    placeholder: "Search services or mechanics...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "pl-10 pr-10"
  }), createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "absolute right-1 top-1/2 -translate-y-1/2"
  }, createElement(Filter, {
    className: "h-4 w-4"
  }))))), createElement("div", {
    className: "max-w-screen-xl mx-auto px-4 py-6"
  }, createElement("section", {
    className: "mb-6"
  }, createElement("h2", {
    className: "font-semibold mb-3"
  }, "Browse Services"), createElement("div", {
    className: "grid grid-cols-3 gap-3"
  }, serviceCategories.map(category => {
    export default function Icon = category.icon;
    return createElement(Card, {
      key: category.id,
      className: "cursor-pointer hover:shadow-md transition-shadow"
    }, createElement(CardContent, {
      className: "p-4"
    }, createElement("div", {
      className: "flex flex-col items-center text-center gap-2"
    }, createElement("div", {
      className: `h-12 w-12 rounded-full ${category.color} flex items-center justify-center`
    }, createElement(Icon, {
      className: "h-6 w-6"
    })), createElement("p", {
      className: "text-xs font-medium leading-tight"
    }, category.name))));
  }))), createElement(Tabs, {
    defaultValue: "upcoming",
    className: "mb-6"
  }, createElement(TabsList, {
    className: "grid w-full grid-cols-2 mb-4"
  }, createElement(TabsTrigger, {
    value: "upcoming"
  }, "Upcoming"), createElement(TabsTrigger, {
    value: "past"
  }, "Past Bookings")), createElement(TabsContent, {
    value: "upcoming",
    className: "space-y-4"
  }, upcomingBookings.length > 0 ? upcomingBookings.map(booking => createElement(Card, {
    key: booking.id,
    className: "border-2 border-primary/20"
  }, createElement(CardContent, {
    className: "p-4"
  }, createElement("div", {
    className: "flex items-start justify-between mb-3"
  }, createElement("div", null, createElement("h3", {
    className: "font-semibold mb-1"
  }, booking.service), createElement(Badge, {
    variant: booking.status === 'scheduled' ? 'default' : 'secondary'
  }, booking.status)), createElement("p", {
    className: "font-bold text-lg text-primary"
  }, booking.price)), createElement("div", {
    className: "space-y-2 text-sm text-muted-foreground mb-4"
  }, createElement("div", {
    className: "flex items-center gap-2"
  }, createElement(Wrench, {
    className: "h-4 w-4"
  }), createElement("span", {
    className: "font-medium text-foreground"
  }, booking.mechanic)), createElement("div", {
    className: "flex items-center gap-2"
  }, createElement(Calendar, {
    className: "h-4 w-4"
  }), createElement("span", null, booking.date)), createElement("div", {
    className: "flex items-center gap-2"
  }, createElement(Clock, {
    className: "h-4 w-4"
  }), createElement("span", null, booking.time)), createElement("div", {
    className: "flex items-center gap-2"
  }, createElement(MapPin, {
    className: "h-4 w-4"
  }), createElement("span", null, booking.location))), createElement("div", {
    className: "flex gap-2"
  }, createElement(Button, {
    variant: "outline",
    className: "flex-1"
  }, "Reschedule"), createElement(Button, {
    variant: "destructive",
    className: "flex-1"
  }, "Cancel"), createElement(Button, {
    size: "icon",
    variant: "ghost"
  }, createElement(ChevronRight, {
    className: "h-5 w-5"
  })))))) : createElement(Card, null, createElement(CardContent, {
    className: "p-12 text-center"
  }, createElement("div", {
    className: "h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"
  }, createElement(Calendar, {
    className: "h-8 w-8 text-muted-foreground"
  })), createElement("h3", {
    className: "font-semibold mb-2"
  }, "No upcoming bookings"), createElement("p", {
    className: "text-sm text-muted-foreground mb-4"
  }, "Book a service to get started"), createElement(Button, null, "Browse Services")))), createElement(TabsContent, {
    value: "past",
    className: "space-y-4"
  }, pastBookings.map(booking => createElement(Card, {
    key: booking.id
  }, createElement(CardContent, {
    className: "p-4"
  }, createElement("div", {
    className: "flex items-start justify-between mb-3"
  }, createElement("div", null, createElement("h3", {
    className: "font-semibold mb-1"
  }, booking.service), createElement("div", {
    className: "flex items-center gap-1"
  }, [...Array(5)].map((_, i) => createElement(Star, {
    key: i,
    className: `h-3.5 w-3.5 ${i < (booking.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`
  })))), createElement("p", {
    className: "font-bold text-muted-foreground"
  }, booking.price)), createElement("div", {
    className: "space-y-1.5 text-sm text-muted-foreground mb-4"
  }, createElement("div", {
    className: "flex items-center gap-2"
  }, createElement(Wrench, {
    className: "h-4 w-4"
  }), createElement("span", {
    className: "font-medium text-foreground"
  }, booking.mechanic)), createElement("div", {
    className: "flex items-center gap-2"
  }, createElement(Calendar, {
    className: "h-4 w-4"
  }), createElement("span", null, booking.date))), createElement("div", {
    className: "flex gap-2"
  }, createElement(Button, {
    variant: "outline",
    className: "flex-1"
  }, "Book Again"), createElement(Button, {
    variant: "outline",
    className: "flex-1"
  }, "View Receipt"))))))), createElement(Card, {
    className: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 mb-20"
  }, createElement(CardContent, {
    className: "p-6 text-center"
  }, createElement(Settings, {
    className: "h-12 w-12 mx-auto mb-3 opacity-90"
  }), createElement("h3", {
    className: "font-bold mb-2"
  }, "Need a service?"), createElement("p", {
    className: "text-sm text-primary-foreground/80 mb-4"
  }, "Book with top-rated mechanics near you"), createElement(Button, {
    variant: "secondary",
    size: "lg",
    className: "w-full max-w-xs"
  }, "Book New Service")))));
}