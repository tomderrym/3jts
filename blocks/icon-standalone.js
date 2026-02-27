/**
 * Icon Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-4 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Profile</h1>
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20 border-4 border-primary/20">
                  <AvatarImage src={userProfile?.profile_photo} />
                  <AvatarFallback>{getInitials(userProfile?.full_name || user?.email)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{userProfile?.full_name || 'User'}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
                  <Badge variant="secondary" className="gap-1">
                    <Award className="h-3 w-3" />
                    {getUserTypeLabel()}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Services</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">4.8</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">850</p>
                  <p className="text-xs text-muted-foreground">Points</p>
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
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {section.title}
            </h3>
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
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium">{item.label}</p>
                          </div>
                          <Switch />
                        </div>
                      ) : (
                        // Regular button for non-toggle items
                        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-accent transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium">{item.label}</p>
                          </div>
                          {item.badge ? (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      )}
                      {itemIndex < section.items.length - 1 && (
                        <Separator className="mx-4" />
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
                <LogOut className="h-5 w-5" />
              </div>
              <p className="font-medium">Log Out</p>
            </button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground pb-6">
          <p>FiloZof AutoCare v1.0.0</p>
          <p className="text-xs mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}