/**
 * Service Booking Screen
 * Multi-step form for booking a service with a mechanic
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Wrench,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5;

export default function ServiceBookingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mechanicIdParam = searchParams.get('mechanicId');
  const { user } = useAuth();
  const { selectedMechanic, addBooking, isDebugMode } = useAppStore();

  const [step, setStep] = useState<Step>(1);
  const [mechanic, setMechanic] = useState<MechanicWithProfile | null>(selectedMechanic);
  const [services, setServices] = useState<MechanicService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [serviceLocation, setServiceLocation] = useState<'customer_site' | 'mechanic_workshop' | 'custom'>('customer_site');
  const [customAddress, setCustomAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (mechanicIdParam && !mechanic) {
      loadMechanicData(mechanicIdParam);
    } else if (mechanic?.mechanic_profiles?.id) {
      loadServices(mechanic.mechanic_profiles.id);
    }
  }, [mechanicIdParam, mechanic]);

  useEffect(() => {
    // Calculate total amount
    if (selectedServiceId) {
      const service = services.find((s) => s.id === selectedServiceId);
      if (service) {
        setTotalAmount(Number(service.service_price));
      }
    } else if (mechanic?.mechanic_profiles?.hourly_rate) {
      // Default to 1 hour if custom service
      setTotalAmount(Number(mechanic.mechanic_profiles.hourly_rate));
    }
  }, [selectedServiceId, services, mechanic]);

  // Auto-fill in debug mode
  useEffect(() => {
    if (isDebugMode) {
      // Auto-fill booking form with test data
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      setCustomServiceName('Oil Change & Filter Replacement');
      setServiceLocation('customer_site');
      setCustomAddress('123 Test Street, Test City, 12345');
      setBookingDate(dateStr);
      setBookingTime('10:00');
      setVehicleInfo('2020 Toyota Camry - VIN: 1234567890ABCDEFG');
      setSpecialInstructions('Please bring synthetic oil. Garage code is 1234.');
      
      console.log('🐛 DEBUG: Auto-filled service booking form');
    }
  }, [isDebugMode]);

  const loadMechanicData = async (mechanicId: string) => {
    setIsLoading(true);
    try {
      const mechanicData = await mechanicsService.getMechanicProfile(mechanicId);
      if (mechanicData) {
        setMechanic(mechanicData);
        if (mechanicData.mechanic_profiles?.id) {
          loadServices(mechanicData.mechanic_profiles.id);
        }
      }
    } catch (err) {
      setError('Failed to load mechanic information');
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async (mechanicProfileId: string) => {
    try {
      const servicesData = await mechanicsService.getMechanicServices(mechanicProfileId);
      setServices(servicesData);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  const handleNext = () => {
    setError('');

    // Validation for each step
    if (step === 1 && !selectedServiceId && !customServiceName) {
      setError('Please select a service or enter a custom service name');
      return;
    }
    if (step === 2 && serviceLocation === 'custom' && !customAddress) {
      setError('Please enter the service address');
      return;
    }
    if (step === 3 && (!bookingDate || !bookingTime)) {
      setError('Please select both date and time');
      return;
    }

    if (step < 5) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !mechanic?.mechanic_profiles?.id) {
      setError('Missing required information');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const locationValue =
        serviceLocation === 'custom' ? customAddress : serviceLocation;

      const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);

      const bookingData: InsertServiceBooking = {
        customer_id: user.id,
        mechanic_id: mechanic.mechanic_profiles.id,
        service_id: selectedServiceId || undefined,
        booking_date: bookingDateTime.toISOString(),
        service_location: locationValue,
        total_amount: totalAmount,
        special_instructions: `${vehicleInfo ? `Vehicle: ${vehicleInfo}\n` : ''}${specialInstructions}`.trim() || undefined,
        status: 'pending',
      };

      const { success, booking, error: bookingError } = await bookingsService.createServiceBooking(bookingData);

      if (!success || !booking) {
        setError(bookingError || 'Failed to create booking');
        setIsLoading(false);
        return;
      }

      // Add to store
      addBooking(booking);

      // Navigate to bookings screen with success message
      navigate('/bookings', { state: { message: 'Booking created successfully!' } });
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const getStepProgress = () => (step / 5) * 100;

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl flex-1">Book Service</h1>
          </div>

          <Progress value={getStepProgress()} className="h-2" />
          <p className="text-sm mt-2 text-primary-foreground/80">
            Step {step} of 5
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Mechanic Info */}
        {mechanic && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mechanic.profile_photo || mechanic.mechanic_profiles?.featured_photo} />
                  <AvatarFallback>
                    {mechanic.full_name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{mechanic.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mechanic.mechanic_profiles?.specialties}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Select Service */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Select Service
              </CardTitle>
              <CardDescription>Choose a service or describe what you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.length > 0 && (
                <RadioGroup value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={service.id} id={service.id} />
                      <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{service.service_name}</p>
                            {service.service_description && (
                              <p className="text-sm text-muted-foreground">
                                {service.service_description}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-primary">${service.service_price}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <div className="space-y-2">
                <Label htmlFor="customService">Or describe your custom service</Label>
                <Input
                  id="customService"
                  placeholder="e.g., Brake pad replacement"
                  value={customServiceName}
                  onChange={(e) => {
                    setCustomServiceName(e.target.value);
                    if (e.target.value) setSelectedServiceId('');
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Location */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Location
              </CardTitle>
              <CardDescription>Where should the service take place?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={serviceLocation} onValueChange={(value: any) => setServiceLocation(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer_site" id="customer_site" />
                  <Label htmlFor="customer_site">My Location (Mobile Service)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mechanic_workshop" id="mechanic_workshop" />
                  <Label htmlFor="mechanic_workshop">Mechanic's Workshop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom Address</Label>
                </div>
              </RadioGroup>

              {serviceLocation === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customAddress">Enter Address</Label>
                  <Input
                    id="customAddress"
                    placeholder="123 Main St, City, State, ZIP"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date & Time
              </CardTitle>
              <CardDescription>When would you like the service?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingDate">Date</Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingTime">Time</Label>
                <Input
                  id="bookingTime"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Additional Details */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Help the mechanic prepare for your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleInfo">Vehicle Information (Optional)</Label>
                <Input
                  id="vehicleInfo"
                  placeholder="e.g., 2020 Toyota Camry"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any additional information..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review & Confirm */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review & Confirm
              </CardTitle>
              <CardDescription>Please review your booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">
                    {selectedService?.service_name || customServiceName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">
                    {serviceLocation === 'customer_site'
                      ? 'My Location'
                      : serviceLocation === 'mechanic_workshop'
                      ? "Mechanic's Workshop"
                      : customAddress}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {new Date(`${bookingDate}T${bookingTime}`).toLocaleString()}
                  </span>
                </div>

                {vehicleInfo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{vehicleInfo}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="max-w-screen-xl mx-auto flex gap-3">
            {step === 5 ? (
              <Button
                onClick={handleSubmit}
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full h-12">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
