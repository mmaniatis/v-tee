// utils/timeUtils.ts
import type { Business, WeeklySchedule } from '@/types/business';

export const DAYS = [
  'sunday',
  'monday', 
  'tuesday', 
  'wednesday', 
  'thursday', 
  'friday', 
  'saturday'
] as const;

export const formatTime = (time: string): string => {
  const [hours] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:00 ${period}`;
};

export const generateTimeSlots = (start: string, end: string) => {
  const slots = [];
  const [startHour] = start.split(':').map(Number);
  let [endHour] = end.split(':').map(Number);

  if (endHour === 0) endHour = 24;

  for (let hour = startHour; hour < endHour; hour++) {
    const displayHour = hour % 24;
    const time = `${displayHour.toString().padStart(2, '0')}:00`;
    slots.push({
      value: time,
      display: formatTime(time)
    });
  }
  return slots;
};

export const isTimeSlotAvailable = (date: Date, startTime: string, duration: number, bookings: any) => {
  const dateStr = date.toISOString().split('T')[0];
  const dateBookings = bookings[dateStr] || [];
  const [startHour] = startTime.split(':').map(Number);
  const endHour = startHour + duration;

  return !dateBookings.some((booking: any) => {
    const [bookingStart] = booking.start.split(':').map(Number);
    const bookingEnd = bookingStart + booking.duration;
    return !(endHour <= bookingStart || startHour >= bookingEnd);
  });
};

export const getHoursForDate = (date: Date, business: Business) => {
  if (!business) return { open: "00:00", close: "00:00" };
  const day = date.getDay();
  const dayMap: Record<number, keyof WeeklySchedule> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  const dayName = dayMap[day];
  return business.weeklySchedule[dayName];
};
