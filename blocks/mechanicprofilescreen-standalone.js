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
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6">
          <Skeleton className="h-6 w-32 bg-primary-foreground/20" />
        </header>
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Mechanic not found</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = mechanic.mechanic_profiles;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20 mb-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 -mt-8">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20 mb-4">
                <AvatarImage src={mechanic.profile_photo || profile?.featured_photo} />
                <AvatarFallback>{getInitials(mechanic.full_name)}</AvatarFallback>
              </Avatar>

              <h1 className="text-2xl font-bold mb-2">{mechanic.full_name}</h1>

              {profile?.specialties && (
                <p className="text-muted-foreground mb-3">{profile.specialties}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {profile?.is_available && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Available
                  </Badge>
                )}
                {profile?.rating && profile.rating > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {profile.rating.toFixed(1)} ({profile.review_count || 0})
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {profile?.years_experience && profile.years_experience > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-xl font-bold">{profile.years_experience}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Years Exp</p>
                </div>
              )}

              {profile?.hourly_rate && profile.hourly_rate > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xl font-bold">{profile.hourly_rate}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Per Hour</p>
                </div>
              )}

              {profile?.location && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{profile.location}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certifications & Qualifications */}
        {(profile?.certifications?.length > 0 || profile?.qualifications?.length > 0) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.certifications?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.qualifications?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.qualifications.map((qual, index) => (
                      <Badge key={index} variant="outline">
                        {qual}
                      </Badge>
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
            <CardTitle className="text-lg">Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services listed</p>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{service.service_name}</h4>
                      {service.service_description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {service.service_description}
                        </p>
                      )}
                      {service.estimated_duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{service.estimated_duration} min</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${service.service_price}</p>
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
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
            <Button onClick={handleBookService} className="gap-2">
              <Calendar className="h-4 w-4" />
              Book Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
