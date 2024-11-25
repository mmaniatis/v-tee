import type { DaySchedule } from '@/types/business';
import type { Reservation } from '@prisma/client';

export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${formattedHour}:${minutes} ${period}`;
}

export function generateTimeSlots(openTime: string, closeTime: string, interval: number = 30): Array<{ value: string; display: string }> {
  const slots: Array<{ value: string; display: string }> = [];
  let current = new Date(`2000-01-01T${openTime}`);
  const end = new Date(`2000-01-01T${closeTime}`);

  while (current < end) {
    const timeString = current.toTimeString().slice(0, 5);
    slots.push({
      value: timeString,
      display: formatTime(timeString)
    });
    current = new Date(current.getTime() + interval * 60000);
  }

  console.log("current time slots: " + slots)
  return slots;
}

export function getDaySchedule(daySchedules: DaySchedule[], date: Date): DaySchedule | undefined {
  const dayOfWeek = DAYS[date.getDay()];
  return daySchedules.find(schedule => schedule.dayOfWeek === dayOfWeek);
}
export function isTimeSlotAvailable(
  time: string,
  date: Date,
  reservations: Reservation[]
): boolean {
  const dateStr = date.toISOString().split('T')[0];
  const timeInMinutes = timeToMinutes(time);

  return !reservations.some(reservation => {
    if (reservation.date !== dateStr) return false;
    
    const reservationStartMinutes = timeToMinutes(reservation.startTime);
    const reservationEndMinutes = reservationStartMinutes + Number(reservation.duration);

    return timeInMinutes >= reservationStartMinutes && timeInMinutes < reservationEndMinutes;
  });
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}