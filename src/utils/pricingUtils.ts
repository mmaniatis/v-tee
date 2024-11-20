// utils/pricingUtils.ts
import type { Business, WeeklySchedule } from '@/types/business';

export const isPeakTime = (time: string, date: Date, business: Business) => {
  if (!business?.pricing.peakHours.enabled) return false;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[date.getDay()] as keyof WeeklySchedule;

  if (!business.weeklySchedule[dayName].peakHoursEnabled) return false;

  return time >= business.pricing.peakHours.start &&
    time <= business.pricing.peakHours.end;
};

export const calculatePrice = (time: string, duration: string, date: Date, business: Business) => {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const basePrice = isWeekend ? business.pricing.weekend : business.pricing.weekday;

  const isPeak = isPeakTime(time, date, business);
  const hourlyRate = isPeak ? basePrice + business.pricing.peakHours.additionalCost : basePrice;

  return hourlyRate * parseFloat(duration);
};
