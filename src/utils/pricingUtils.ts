import type { FormattedBusiness } from '@/types/business';
import { getDaySchedule } from './timeUtils';

export function isPeakTime(time: string, date: Date, business: FormattedBusiness): boolean {
  if (!business.pricing.peakHourPricingEnabled) return false;

  const daySchedule = getDaySchedule(business.daySchedules, date);
  if (!daySchedule?.peakHoursEnabled) return false;

  const timeValue = new Date(`2000-01-01T${time}`).getTime();
  const peakStart = new Date(`2000-01-01T${business.pricing.peakHourStart}`).getTime();
  const peakEnd = new Date(`2000-01-01T${business.pricing.peakHourEnd}`).getTime();

  return timeValue >= peakStart && timeValue < peakEnd;
}

export function calculatePrice(
  startTime: string,
  durationMinutes: number,
  date: Date,
  business: FormattedBusiness
): number {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const baseRate = isWeekend ? business.pricing.weekendPrice : business.pricing.weekdayPrice;
  const hours = durationMinutes / 60;
  
  let price = baseRate * hours;

  if (isPeakTime(startTime, date, business)) {
    price += business.pricing.peakHourPriceAdditionalCost * hours;
  }

  return Math.round(price * 100) / 100;
}
