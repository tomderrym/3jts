/**
 * Icon Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Car,
  CreditCard,
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  Star,
  Settings,
  Moon,
  Globe,
  Lock
} from 'lucide-react';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, userProfile, userType, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'mechanic':
        return 'Mechanic';
      case 'dealer':
        return 'Dealer';
      case 'electrician':
        return 'Auto Electrician';
      default:
        return 'Customer';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', badge: null },
        { icon: Car, label: 'My Vehicles', badge: '2 cars' },
        { icon: MapPin, label: 'Saved Addresses', badge: null },
        { icon: CreditCard, label: 'Payment Methods', badge: null },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', badge: null, toggle: true },
        { icon: Moon, label: 'Dark Mode', badge: null, toggle: true },
        { icon: Globe, label: 'Language', badge: 'English' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', badge: null },
        { icon: Shield, label: 'Privacy Policy', badge: null },
        { icon: Lock, label: 'Terms of Service', badge: null },
      ],
    },
  ];

  return createElement('div', {className: 'min-h-screen bg-background'}, '{/* Header */}
      <header className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-4 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            createElement('h1', {className: 'text-2xl'}, 'Profile')
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              createElement('Settings', {className: 'h-5 w-5'})
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20 border-4 border-primary/20">
                  createElement('AvatarImage', null)
                  createElement('AvatarFallback', null, '{getInitials(userProfile?.full_name || user?.email)}')
                </Avatar>
                <div className="flex-1">
                  createElement('h2', {className: 'text-xl font-bold mb-1'}, '{userProfile?.full_name || 'User'}')
                  createElement('p', {className: 'text-sm text-muted-foreground mb-2'}, '{user?.email}')
                  <Badge variant="secondary" className="gap-1">
                    createElement('Award', {className: 'h-3 w-3'})
                    {getUserTypeLabel()}
                  </Badge>
                </div>
              </div>

              createElement('Separator', {className: 'my-4'})

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  createElement('p', {className: 'text-2xl font-bold text-primary'}, '12')
                  createElement('p', {className: 'text-xs text-muted-foreground'}, 'Services')
                </div>
                <div>
                  createElement('p', {className: 'text-2xl font-bold text-primary'}, '4.8')
                  <div className="flex items-center justify-center gap-1">
                    createElement('Star', {className: 'h-3 w-3 fill-yellow-400 text-yellow-400'})
                    createElement('p', {className: 'text-xs text-muted-foreground'}, 'Rating')
                  </div>
                </div>
                <div>
                  createElement('p', {className: 'text-2xl font-bold text-primary'}, '850')
                  createElement('p', {className: 'text-xs text-muted-foreground'}, 'Points')
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 -mt-2">
        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-6">
            createElement('h3', {className: 'text-sm font-semibold text-muted-foreground mb-3 px-1'}, '{section.title}')
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => {
                  export default function Icon = item.icon;
                  return (
                    <React.Fragment key={itemIndex}>
                      {item.toggle ? (
                        // Use div instead of button for toggle items to avoid nested buttons
                        <div className="w-full flex items-center gap-4 px-4 py-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            createElement('Icon', {className: 'h-5 w-5 text-primary'})
                          </div>
                          <div className="flex-1 text-left">
                            createElement('p', {className: 'font-medium'}, '{item.label}')
                          </div>
                          createElement('Switch', null)') : (
                        // Regular button for non-toggle items
                        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-accent transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            createElement('Icon', {className: 'h-5 w-5 text-primary'})
                          </div>
                          <div className="flex-1 text-left">
                            createElement('p', {className: 'font-medium'}, '{item.label}')
                          </div>
                          {item.badge ? (
                            createElement('Badge', {className: 'text-xs', variant: 'secondary'}, '{item.badge}')
                          ) : (
                            createElement('ChevronRight', {className: 'h-5 w-5 text-muted-foreground'})
                          )}
                        </button>
                      )}
                      {itemIndex < section.items.length - 1 && (
                        createElement('Separator', {className: 'mx-4'})
                      )}
                    </React.Fragment>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        ))}

        {/* Logout Button */}
        <Card className="mb-20">
          <CardContent className="p-0">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-destructive hover:bg-destructive/10 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                createElement('LogOut', {className: 'h-5 w-5'})
              </div>
              createElement('p', {className: 'font-medium'}, 'Log Out')
            </button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground pb-6">
          createElement('p', null, 'FiloZof AutoCare v1.0.0')
          createElement('p', {className: 'text-xs mt-1'}, '© 2025 All rights reserved')
        </div>
      </div>
    </div>
  );
}