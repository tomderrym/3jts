/**
 * Icon Component
 * Props: { tab?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import { Home, QrCode, Package, CreditCard, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

export function BottomNav({ activeTab, onTabChange, cartCount }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'vending', label: 'Vending', icon: QrCode },
    { id: 'subscription', label: 'Subscribe', icon: Package },
    { id: 'membership', label: 'Membership', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            export default function Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
                  isActive ? 'text-[#FF1744]' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {tab.id === 'home' && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF1744] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
