/**
 * Mechanic Profile Screen
 * Displays detailed information about a specific mechanic
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  MapPin,
  Star,
  Award,
  Clock,
  DollarSign,
  MessageSquare,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function MechanicProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { mechanicId } = useParams<{ mechanicId: string }>();
  const { selectedMechanic, setSelectedMechanic } = useAppStore();
  const [mechanic, setMechanic] = useState<MechanicWithProfile | null>(selectedMechanic);
  const [services, setServices] = useState<MechanicService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMechanicData();
  }, [mechanicId]);

  const loadMechanicData = async () => {
    if (!mechanicId) return;

    setIsLoading(true);
    try {
      // Load mechanic profile if not already in state
      if (!mechanic || mechanic.id !== mechanicId) {
        const mechanicData = await mechanicsService.getMechanicProfile(mechanicId);
        if (mechanicData) {
          setMechanic(mechanicData);
          setSelectedMechanic(mechanicData);
        }
      }

      // Load mechanic's services
      const profile = mechanic?.mechanic_profiles;
      const profileId = profile?.id || mechanicId;
      const servicesData = await mechanicsService.getMechanicServices(profileId);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading mechanic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookService = () => {
    navigate(`/service-booking?mechanicId=${mechanicId}`);
  };

  const handleStartChat = () => {
    navigate(`/chat/${mechanicId}`);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'M';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return createElement('div', {className: 'min-h-screen bg-background'}, '<header className="bg-primary text-primary-foreground px-4 pt-8 pb-6">
          createElement('Skeleton', {className: 'h-6 w-32 bg-primary-foreground/20'})
        </header>
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
          createElement('Skeleton', {className: 'h-32 w-full'})
          createElement('Skeleton', {className: 'h-48 w-full'})
          createElement('Skeleton', {className: 'h-64 w-full'})
        </div>');
  }

  if (!mechanic) {
    return createElement('div', {className: 'min-h-screen bg-background flex items-center justify-center p-4'}, '<Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            createElement('p', {className: 'text-muted-foreground mb-4'}, 'Mechanic not found')
            createElement('Button', null, 'navigate(-1)}>Go Back')
          </CardContent>
        </Card>');
  }

  const profile = mechanic.mechanic_profiles;

  return createElement('div', {className: 'min-h-screen bg-background pb-24'}, '{/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20 mb-4"
          >
            createElement('ChevronLeft', {className: 'h-6 w-6'})
          </Button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 -mt-8">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20 mb-4">
                createElement('AvatarImage', null)
                createElement('AvatarFallback', null, '{getInitials(mechanic.full_name)}')
              </Avatar>

              createElement('h1', {className: 'text-2xl font-bold mb-2'}, '{mechanic.full_name}')

              {profile?.specialties && (
                createElement('p', {className: 'text-muted-foreground mb-3'}, '{profile.specialties}')
              )}

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {profile?.is_available && (
                  <Badge variant="secondary" className="gap-1">
                    createElement('CheckCircle2', {className: 'h-3 w-3'})
                    Available
                  </Badge>
                )}
                {profile?.rating && profile.rating > 0 && (
                  <Badge variant="outline" className="gap-1">
                    createElement('Star', {className: 'h-3 w-3 fill-yellow-400 text-yellow-400'})
                    {profile.rating.toFixed(1)} ({profile.review_count || 0})
                  </Badge>
                )}
              </div>
            </div>

            createElement('Separator', {className: 'my-4'})

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {profile?.years_experience && profile.years_experience > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    createElement('Award', {className: 'h-4 w-4'})
                    createElement('span', {className: 'text-xl font-bold'}, '{profile.years_experience}')
                  </div>
                  createElement('p', {className: 'text-xs text-muted-foreground'}, 'Years Exp')')}

              {profile?.hourly_rate && profile.hourly_rate > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    createElement('DollarSign', {className: 'h-4 w-4'})
                    createElement('span', {className: 'text-xl font-bold'}, '{profile.hourly_rate}')
                  </div>
                  createElement('p', {className: 'text-xs text-muted-foreground'}, 'Per Hour')
                </div>
              )}

              {profile?.location && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    createElement('MapPin', {className: 'h-4 w-4'})
                  </div>
                  createElement('p', {className: 'text-xs text-muted-foreground line-clamp-2'}, '{profile.location}')
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certifications & Qualifications */}
        {(profile?.certifications?.length > 0 || profile?.qualifications?.length > 0) && (
          <Card className="mb-6">
            <CardHeader>
              createElement('CardTitle', {className: 'text-lg'}, 'Credentials')
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.certifications?.length > 0 && (
                <div>
                  createElement('h4', {className: 'text-sm font-medium mb-2'}, 'Certifications')
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, index) => (
                      createElement('Badge', {variant: 'secondary'}, '{cert}')
                    ))}
                  </div>
                </div>
              )}

              {profile.qualifications?.length > 0 && (
                <div>
                  createElement('h4', {className: 'text-sm font-medium mb-2'}, 'Qualifications')
                  <div className="flex flex-wrap gap-2">
                    {profile.qualifications.map((qual, index) => (
                      createElement('Badge', {variant: 'outline'}, '{qual}')
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Services Offered */}
        <Card className="mb-6">
          <CardHeader>
            createElement('CardTitle', {className: 'text-lg'}, 'Services Offered')
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              createElement('p', {className: 'text-sm text-muted-foreground'}, 'No services listed')
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      createElement('h4', {className: 'font-medium mb-1'}, '{service.service_name}')
                      {service.service_description && (
                        createElement('p', {className: 'text-sm text-muted-foreground mb-2'}, '{service.service_description}')
                      )}
                      {service.estimated_duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          createElement('Clock', {className: 'h-3 w-3'})
                          createElement('span', null, '{service.estimated_duration} min')
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      createElement('p', {className: 'font-semibold text-primary'}, '${service.service_price}')
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-3">
          <div className="max-w-screen-xl mx-auto grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleStartChat} className="gap-2">
              createElement('MessageSquare', {className: 'h-4 w-4'})
              Chat
            </Button>
            <Button onClick={handleBookService} className="gap-2">
              createElement('Calendar', {className: 'h-4 w-4'})
              Book Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
