import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  isBefore,
  startOfDay,
  format,
} from 'date-fns';

export interface MonthAvailability {
  availableDays: string[];
  slotsByDay: Record<string, string[]>;
}

const DEFAULT_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const getMockAvailability = (year: number, month: number): MonthAvailability => {
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const startDate = isBefore(monthStart, today) ? today : monthStart;

  if (isBefore(monthEnd, startDate)) {
    return { availableDays: [], slotsByDay: {} };
  }

  const days = eachDayOfInterval({ start: startDate, end: monthEnd })
    .filter((d) => !isWeekend(d))
    .map((d) => format(d, 'yyyy-MM-dd'));

  const slotsByDay: Record<string, string[]> = {};
  for (const day of days) {
    slotsByDay[day] = DEFAULT_SLOTS;
  }

  return { availableDays: days, slotsByDay };
};

/**
 * Fetches available days and time slots for a given month from GHL via n8n.
 *
 * Expected endpoint: POST VITE_N8N_DISPONIBILIDAD_WEBHOOK_URL
 * Request:  { month: 'YYYY-MM' }
 * Response: { availableDays: string[], slotsByDay: Record<string, string[]> }
 *
 * Falls back to mock data if the env var is not set or the request fails.
 */
export const getMonthAvailability = async (
  year: number,
  month: number
): Promise<MonthAvailability> => {
  const webhookUrl = import.meta.env.VITE_N8N_DISPONIBILIDAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return getMockAvailability(year, month);
  }

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month: monthStr }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return {
      availableDays: data.availableDays ?? [],
      slotsByDay: data.slotsByDay ?? {},
    };
  } catch (error) {
    console.error('Error fetching availability from n8n:', error);
    return getMockAvailability(year, month);
  }
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
