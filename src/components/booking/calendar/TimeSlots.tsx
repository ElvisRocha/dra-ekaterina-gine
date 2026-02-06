import { useState } from 'react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatTimeDisplay } from '@/utils/availability';
import { cn } from '@/lib/utils';

interface TimeSlotsProps {
  selectedDate: Date | null;
  availableSlots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

const TimeSlots = ({
  selectedDate,
  availableSlots,
  selectedTime,
  onSelectTime,
}: TimeSlotsProps) => {
  const { language, t } = useLanguage();
  const [use24h, setUse24h] = useState(false);
  const locale = language === 'es' ? es : enUS;

  if (!selectedDate) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6">
        <p className="text-sm text-muted-foreground">
          {t('calendar.selectDay')}
        </p>
      </div>
    );
  }

  const dayLabel = format(selectedDate, 'EEE dd', { locale });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground capitalize">
          {dayLabel}
        </span>
        {/* Time Format Toggle */}
        <div className="flex items-center rounded-full bg-secondary p-0.5 text-xs">
          <button
            onClick={() => setUse24h(false)}
            className={cn(
              'px-2 py-1 rounded-full transition-all',
              !use24h
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            12h
          </button>
          <button
            onClick={() => setUse24h(true)}
            className={cn(
              'px-2 py-1 rounded-full transition-all',
              use24h
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            24h
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {availableSlots.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-secondary/30'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  isSelected ? 'bg-primary-foreground' : 'bg-green-500'
                )}
              />
              <span className="font-medium">
                {formatTimeDisplay(time, use24h)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlots;
