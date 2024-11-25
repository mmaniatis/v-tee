import type { DaySchedule } from '@/types/business';

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

  return slots;
}

export function getDaySchedule(daySchedules: DaySchedule[], date: Date): DaySchedule | undefined {
  const dayOfWeek = DAYS[date.getDay()];
  return daySchedules.find(schedule => schedule.dayOfWeek === dayOfWeek);
}

export function isTimeSlotAvailable(
  time: string,
  date: Date,
  reservations: Array<{ startTime: string; duration: number }>,
  durationMinutes: number
): boolean {
  const timeValue = new Date(`2000-01-01T${time}`).getTime();
  const endTimeValue = timeValue + durationMinutes * 60000;

  return !reservations.some(reservation => {
    const reservationStart = new Date(`2000-01-01T${reservation.startTime}`).getTime();
    const reservationEnd = reservationStart + reservation.duration * 60000;
    return (
      (timeValue >= reservationStart && timeValue < reservationEnd) ||
      (endTimeValue > reservationStart && endTimeValue <= reservationEnd) ||
      (timeValue <= reservationStart && endTimeValue >= reservationEnd)
    );
  });
}