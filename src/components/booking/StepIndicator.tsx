import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps?: number[];
  onStepClick?: (stepNumber: number) => void;
}

const StepIndicator = ({ currentStep, completedSteps = [], onStepClick }: StepIndicatorProps) => {
  const { t } = useLanguage();

  const steps = [
    { number: 1, label: t('booking.step1') },
    { number: 2, label: t('booking.step2') },
    { number: 3, label: t('booking.step3Date') },
    { number: 4, label: t('booking.step4') },
  ];

  const maxCompleted = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;

  const canNavigate = (stepNumber: number) => {
    return stepNumber <= maxCompleted + 1;
  };

  const handleClick = (stepNumber: number) => {
    if (stepNumber !== currentStep && canNavigate(stepNumber) && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center max-w-2xl mx-auto px-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isComplete = completedSteps.includes(step.number) && !isActive;
          const isAccessible = canNavigate(step.number);
          const isClickable = isAccessible && !isActive;

          return (
            <div
              key={step.number}
              className={cn(
                'flex items-center',
                index < steps.length - 1 ? 'flex-1' : ''
              )}
            >
              {/* Step Button */}
              <button
                type="button"
                onClick={() => handleClick(step.number)}
                disabled={!isAccessible}
                className={cn(
                  'flex flex-col items-center group outline-none',
                  isClickable ? 'cursor-pointer' : '',
                  !isAccessible ? 'cursor-not-allowed' : '',
                  isActive ? 'cursor-default' : ''
                )}
                aria-label={`${step.label} - ${isComplete ? 'completado' : isActive ? 'paso actual' : 'pendiente'}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200',
                    isComplete
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                      ? 'border-2 border-primary text-primary bg-background'
                      : isAccessible
                      ? 'border-2 border-primary/40 text-primary/60 bg-background'
                      : 'border-2 border-muted text-muted-foreground bg-background',
                    isClickable ? 'group-hover:scale-110 group-hover:shadow-md' : ''
                  )}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'text-xs mt-2 font-medium text-center hidden sm:block transition-colors duration-200',
                    isActive
                      ? 'text-foreground font-semibold'
                      : isComplete || isAccessible
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all duration-300',
                    completedSteps.includes(step.number) ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
