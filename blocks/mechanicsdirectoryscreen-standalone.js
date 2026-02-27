/**
 * Mechanics Directory Screen
 * Browse and search all available mechanics
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Award, ChevronLeft, SlidersHorizontal } from 'lucide-react';

export default function MechanicsDirectoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { mechanics, setMechanics, setSelectedMechanic } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMechanics, setFilteredMechanics] = useState<MechanicWithProfile[]>([]);

  useEffect(() => {
    loadMechanics();
  }, []);

  useEffect(() => {
    // Filter mechanics based on search query
    if (!searchQuery.trim()) {
      setFilteredMechanics(mechanics);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = mechanics.filter(
        (mechanic) =>
          mechanic.full_name?.toLowerCase().includes(query) ||
          mechanic.mechanic_profiles?.specialties?.toLowerCase().includes(query) ||
          mechanic.mechanic_profiles?.location?.toLowerCase().includes(query)
      );
      setFilteredMechanics(filtered);
    }
  }, [searchQuery, mechanics]);

  const loadMechanics = async () => {
    setIsLoading(true);
    try {
      const data = await mechanicsService.getMechanics();
      setMechanics(data);
      setFilteredMechanics(data);
    } catch (error) {
      console.error('Error loading mechanics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMechanicClick = (mechanic: MechanicWithProfile) => {
    setSelectedMechanic(mechanic);
    navigate(`/mechanic-profile/${mechanic.id}`);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl flex-1">Find Mechanics</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background"
            />
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Results Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredMechanics.length} mechanic{filteredMechanics.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMechanics.length === 0 && (
          <Alert>
            <AlertDescription>
              {searchQuery
                ? 'No mechanics found matching your search.'
                : 'No mechanics available at the moment.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Mechanics List */}
        {!isLoading && filteredMechanics.length > 0 && (
          <div className="space-y-3 pb-20">
            {filteredMechanics.map((mechanic) => {
              const profile = mechanic.mechanic_profiles;
              return (
                <Card
                  key={mechanic.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMechanicClick(mechanic)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={mechanic.profile_photo || profile?.featured_photo} />
                        <AvatarFallback>{getInitials(mechanic.full_name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold truncate">{mechanic.full_name}</h3>
                          {profile?.is_available && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              Available
                            </Badge>
                          )}
                        </div>

                        {profile?.specialties && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {profile.specialties}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {profile?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{profile.location}</span>
                            </div>
                          )}

                          {profile?.rating && profile.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{profile.rating.toFixed(1)}</span>
                              {profile.review_count && profile.review_count > 0 && (
                                <span>({profile.review_count})</span>
                              )}
                            </div>
                          )}

                          {profile?.years_experience && profile.years_experience > 0 && (
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>{profile.years_experience} yrs</span>
                            </div>
                          )}
                        </div>

                        {profile?.hourly_rate && profile.hourly_rate > 0 && (
                          <p className="text-sm font-medium text-primary mt-2">
                            ${profile.hourly_rate}/hr
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
