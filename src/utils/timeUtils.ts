// utils/timeUtils.ts
import type { FormattedBusiness } from '@/types/business';
import type { Reservation } from '@prisma/client';

export const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
] as const;

export type DayOfWeek = typeof DAYS[number];

export interface TimeSlot {
  value: string;  // e.g., "09:00"
  display: string; // e.g., "9:00 AM"
}

export interface BusinessHours {
  open: string;
  close: string;
}

export function getHoursForDate(date: Date, business: FormattedBusiness): BusinessHours {
  const dayOfWeek = DAYS[date.getDay()].toLowerCase() as DayOfWeek;
  const daySchedule = business.weeklySchedule[dayOfWeek];
  
  return {
    open: daySchedule.open,
    close: daySchedule.close
  };
}

export function generateTimeSlots(openTime: string, closeTime: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let currentTime = new Date(`2000-01-01T${openTime}`);
  const endTime = new Date(`2000-01-01T${closeTime}`);

  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    slots.push({
      value: timeString,
      display: formatTime(timeString),
    });
    currentTime.setMinutes(currentTime.getMinutes() + 30); // Assuming 30-minute intervals
  }

  return slots;
}

export function isTimeSlotAvailable(
  timeSlot: string,
  reservations: Reservation[],
  duration: number = 30
): boolean {
  // Convert timeSlot to minutes since midnight for easier comparison
  const slotStart = timeToMinutes(timeSlot);
  const slotEnd = slotStart + duration;

  return !reservations.some(reservation => {
    const reservationStart = timeToMinutes(reservation.startTime);
    const reservationEnd = reservationStart + reservation.duration;

    // Check if there's any overlap
    return (
      (slotStart >= reservationStart && slotStart < reservationEnd) || // New slot starts during existing reservation
      (slotEnd > reservationStart && slotEnd <= reservationEnd) || // New slot ends during existing reservation
      (slotStart <= reservationStart && slotEnd >= reservationEnd) // New slot completely encompasses existing reservation
    );
  });
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Helper function to check if a time is between two other times
export function isTimeBetween(time: string, start: string, end: string): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
}

// Format a duration in minutes to a human-readable string
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
  }
}

// Get the next available time slot after a specific time
export function getNextAvailableSlot(
  time: string,
  reservations: Reservation[],
  interval: number = 30
): string | null {
  let currentTime = new Date(`2000-01-01T${time}`);
  const endOfDay = new Date(`2000-01-01T23:59`);
  
  while (currentTime < endOfDay) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    if (isTimeSlotAvailable(timeString, reservations)) {
      return timeString;
    }
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }
  
  return null;
}