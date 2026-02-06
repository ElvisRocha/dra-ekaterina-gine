import { startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isBefore, startOfDay, format, addDays } from 'date-fns';

/**
 * Get available days for a given month
 * TODO: Replace with n8n webhook call
 * 
 * Expected endpoint: POST https://tu-n8n-url/webhook/get-available-days
 * Request body: { month: 'YYYY-MM', serviceId: string }
 * Response: { availableDays: ['2026-02-09', '2026-02-10', ...] }
 */
export const getAvailableDays = (year: number, month: number): string[] => {
  // TODO: Replace with actual API call
  // const response = await fetch('https://tu-n8n-url/webhook/get-available-days', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ 
  //     month: `${year}-${String(month + 1).padStart(2, '0')}`,
  //     serviceId: selectedService.id
  //   })
  // });
  // const { availableDays } = await response.json();
  // return availableDays;

  // Mock: all weekdays (Mon-Fri) from today onwards
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  
  const startDate = isBefore(monthStart, today) ? today : monthStart;
  
  if (isBefore(monthEnd, startDate)) {
    return [];
  }

  const days = eachDayOfInterval({ start: startDate, end: monthEnd });
  
  return days
    .filter(day => !isWeekend(day))
    .map(day => format(day, 'yyyy-MM-dd'));
};

/**
 * Get available time slots for a specific date
 * TODO: Replace with n8n webhook call
 * 
 * Expected endpoint: POST https://tu-n8n-url/webhook/get-availability
 * Request body: { date: 'YYYY-MM-DD', serviceId: string, duration: number }
 * Response: { availableSlots: ['14:00', '14:30', '15:00', ...] }
 */
export const getAvailableSlots = (date: string): string[] => {
  // TODO: Replace with actual API call
  // const response = await fetch('https://tu-n8n-url/webhook/get-availability', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ 
  //     date: selectedDate,
  //     serviceId: selectedService.id,
  //     duration: selectedService.duration
  //   })
  // });
  // const { availableSlots } = await response.json();
  // return availableSlots;

  // Mock data for development
  // Returns times in 'HH:mm' format (24h)
  return [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
};

/**
 * Format time from 24h to 12h format
 */
export const formatTime12h = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

/**
 * Format time based on user preference
 */
export const formatTimeDisplay = (time: string, use24h: boolean): string => {
  if (use24h) return time;
  return formatTime12h(time);
};
