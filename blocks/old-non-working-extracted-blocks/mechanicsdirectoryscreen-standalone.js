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

  return createElement('div', {className: 'min-h-screen bg-background'}, '{/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              createElement('ChevronLeft', {className: 'h-6 w-6'})
            </Button>
            createElement('h1', {className: 'text-2xl flex-1'}, 'Find Mechanics')
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              createElement('SlidersHorizontal', {className: 'h-5 w-5'})
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            createElement('Search', {className: 'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground'})
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
          createElement('p', {className: 'text-sm text-muted-foreground mb-4'}, '{filteredMechanics.length} mechanic{filteredMechanics.length !== 1 ? 's' : ''} found')
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    createElement('Skeleton', {className: 'h-16 w-16 rounded-full'})
                    <div className="flex-1 space-y-2">
                      createElement('Skeleton', {className: 'h-5 w-32'})
                      createElement('Skeleton', {className: 'h-4 w-48'})
                      createElement('Skeleton', {className: 'h-4 w-40'})
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}')}

        {/* Empty State */}
        {!isLoading && filteredMechanics.length === 0 && (
          <Alert>
            createElement('AlertDescription', null, '{searchQuery
                ? 'No mechanics found matching your search.'
                : 'No mechanics available at the moment.'}')
          </Alert>
        )}

        {/* Mechanics List */}
        {!isLoading && filteredMechanics.length > 0 && (
          <div className="space-y-3 pb-20">
            {filteredMechanics.map((mechanic) => {
              const profile = mechanic.mechanic_profiles;
              return createElement('Card', {className: 'cursor-pointer hover:shadow-md transition-shadow'}, 'handleMechanicClick(mechanic)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        createElement('AvatarImage', null)
                        createElement('AvatarFallback', null, '{getInitials(mechanic.full_name)}')
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          createElement('h3', {className: 'font-semibold truncate'}, '{mechanic.full_name}')
                          {profile?.is_available && (
                            createElement('Badge', {className: 'text-xs shrink-0', variant: 'secondary'}, 'Available')
                          )}
                        </div>

                        {profile?.specialties && (
                          createElement('p', {className: 'text-sm text-muted-foreground mb-2 line-clamp-1'}, '{profile.specialties}')
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {profile?.location && (
                            <div className="flex items-center gap-1">
                              createElement('MapPin', {className: 'h-3 w-3'})
                              createElement('span', {className: 'truncate'}, '{profile.location}')
                            </div>
                          )}

                          {profile?.rating && profile.rating > 0 && (
                            <div className="flex items-center gap-1">
                              createElement('Star', {className: 'h-3 w-3 fill-yellow-400 text-yellow-400'})
                              createElement('span', null, '{profile.rating.toFixed(1)}')
                              {profile.review_count && profile.review_count > 0 && (
                                createElement('span', null, '({profile.review_count})')
                              )}
                            </div>
                          )}

                          {profile?.years_experience && profile.years_experience > 0 && (
                            <div className="flex items-center gap-1">
                              createElement('Award', {className: 'h-3 w-3'})
                              createElement('span', null, '{profile.years_experience} yrs')
                            </div>
                          )}
                        </div>

                        {profile?.hourly_rate && profile.hourly_rate > 0 && (
                          createElement('p', {className: 'text-sm font-medium text-primary mt-2'}, '${profile.hourly_rate}/hr')
                        )}
                      </div>
                    </div>
                  </CardContent>');
            })}
          </div>
        )}
      </div>
    </div>
  );
};
