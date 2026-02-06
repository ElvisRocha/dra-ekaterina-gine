import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths
} from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MonthCalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  availableDays: string[];
  onSelectDate: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

const MonthCalendar = ({
  currentMonth,
  selectedDate,
  availableDays,
  onSelectDate,
  onMonthChange,
}: MonthCalendarProps) => {
  const { language, t } = useLanguage();
  const locale = language === 'es' ? es : enUS;
  const today = startOfDay(new Date());

  const dayNames = language === 'es' 
    ? ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const isAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableDays.includes(dateStr);
  };

  const isPast = (date: Date) => {
    return isBefore(date, today);
  };

  const canGoPrev = !isBefore(startOfMonth(currentMonth), startOfMonth(today));

  const handlePrevMonth = () => {
    if (canGoPrev) {
      onMonthChange(subMonths(currentMonth, 1));
    }
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale });

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium text-foreground capitalize">
          {monthLabel}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const dayIsPast = isPast(day);
          const dayIsAvailable = isAvailable(day);
          const isClickable = isCurrentMonth && !dayIsPast && dayIsAvailable;

          return (
            <button
              key={day.toISOString()}
              onClick={() => isClickable && onSelectDate(day)}
              disabled={!isClickable}
              className={cn(
                'aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative',
                !isCurrentMonth && 'text-muted-foreground/30',
                isCurrentMonth && dayIsPast && 'text-muted-foreground/40 cursor-not-allowed',
                isCurrentMonth && !dayIsPast && !dayIsAvailable && 'text-muted-foreground/40 cursor-not-allowed',
                isCurrentMonth && !dayIsPast && dayIsAvailable && !isSelected && 'text-foreground hover:bg-secondary cursor-pointer',
                isSelected && 'bg-primary text-primary-foreground font-semibold',
                isToday && !isSelected && 'ring-1 ring-primary/50'
              )}
            >
              {format(day, 'd')}
              {/* Availability indicator */}
              {isCurrentMonth && !dayIsPast && dayIsAvailable && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
