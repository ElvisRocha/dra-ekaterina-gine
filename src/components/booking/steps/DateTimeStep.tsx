import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { type Service } from '@/data/services';
import { getAvailableDays, getAvailableSlots } from '@/utils/availability';
import ServiceSummary from '../calendar/ServiceSummary';
import MonthCalendar from '../calendar/MonthCalendar';
import TimeSlots from '../calendar/TimeSlots';

interface DateTimeStepProps {
  service: Service;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateTimeStep = ({
  service,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onNext,
  onBack,
}: DateTimeStepProps) => {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Fetch available days when month changes
  useEffect(() => {
    const days = getAvailableDays(currentMonth.getFullYear(), currentMonth.getMonth());
    setAvailableDays(days);
  }, [currentMonth]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const slots = getAvailableSlots(dateStr);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const isValid = selectedDate && selectedTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl text-foreground mb-2">
          {language === 'es' ? 'Selecciona fecha y hora' : 'Select date and time'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {language === 'es' 
            ? 'Elige el día y horario que mejor te convenga' 
            : 'Choose the day and time that works best for you'}
        </p>
      </div>

      {/* Cal.com-style 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-6">
        {/* Left: Service Summary */}
        <div className="hidden lg:block p-4 bg-secondary/30 rounded-xl border border-border">
          <ServiceSummary service={service} />
        </div>

        {/* Mobile: Service Summary */}
        <div className="lg:hidden p-4 bg-secondary/30 rounded-xl border border-border">
          <ServiceSummary service={service} />
        </div>

        {/* Center: Calendar */}
        <div className="bg-card rounded-xl border border-border p-4">
          <MonthCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            availableDays={availableDays}
            onSelectDate={onSelectDate}
            onMonthChange={setCurrentMonth}
          />
        </div>

        {/* Right: Time Slots */}
        <div className="bg-card rounded-xl border border-border p-4 min-h-[300px]">
          <TimeSlots
            selectedDate={selectedDate}
            availableSlots={availableSlots}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onBack}
          className="flex-1 h-12 rounded-full btn-outline-gradient"
          size="lg"
        >
          <span>{t('booking.back')}</span>
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 rounded-full btn-gradient"
          size="lg"
        >
          <span>{t('booking.next')}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default DateTimeStep;
