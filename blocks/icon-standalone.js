/**
 * Icon Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Target, Heart } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Sparkles,
    title: 'Calm',
    description: 'Find peace in the present moment through guided breathing exercises',
  },
  {
    icon: Target,
    title: 'Focus',
    description: 'Enhance your concentration and mental clarity with mindful breathing',
  },
  {
    icon: Heart,
    title: 'Balance',
    description: 'Create harmony between mind and body through daily practice',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-muted to-background">
      <div className="w-full max-w-md space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {(() => {
                export default function Icon = steps[currentStep].icon;
                return (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  </div>
                );
              })()}
            </motion.div>

            <div className="space-y-3">
              <h2 className="text-3xl">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground px-4">
                {steps[currentStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </Button>

            {currentStep < steps.length - 1 && (
              <button
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleSkip}
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
