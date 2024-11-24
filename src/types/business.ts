// types/business.ts
import { WeeklyScheduleWithRelations, BusinessWithRelations, PricingWithRelations } from './prisma';

export interface UISettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  branding: {
    businessName: string;
    displayName: string;
    description: string;
  };
}

// Map WeeklySchedule from database to our app needs
export interface FormattedWeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  open: string;
  close: string;
  peakHoursEnabled: boolean;
}

export interface FormattedPricing {
  weekday: number;
  weekend: number;
  peakHours: {
    enabled: boolean;
    start: string;
    end: string;
    additionalCost: number;
  };
  solo: {
    discount: number;
  };
  membership: {
    monthly: number;
    yearly: number;
    perSessionDiscount: number;
  };
}

export interface FormattedBusiness {
  id: number;
  name: string;
  location: string;
  description: string;
  weeklySchedule: FormattedWeeklySchedule;
  pricing: FormattedPricing;
  durationConfig: {
    minDuration: number;
    maxDuration: number;
    interval: number;
  };
  uiSettings: UISettings;
}

// Utility functions to convert between Prisma and app formats
export const formatWeeklySchedule = (schedule: WeeklyScheduleWithRelations): FormattedWeeklySchedule => {
  const daysClosed = new Set(schedule.daysClosed);
  
  const createDaySchedule = (day: string): DaySchedule => ({
    isOpen: !daysClosed.has(day.toLowerCase()),
    open: schedule.weekdayOpen,
    close: schedule.weekdayClose,
    peakHoursEnabled: schedule.weekdayPeakHoursEnabled
  });

  return {
    monday: createDaySchedule('monday'),
    tuesday: createDaySchedule('tuesday'),
    wednesday: createDaySchedule('wednesday'),
    thursday: createDaySchedule('thursday'),
    friday: createDaySchedule('friday'),
    saturday: createDaySchedule('saturday'),
    sunday: createDaySchedule('sunday')
  };
};

export const formatBusiness = (
  business: BusinessWithRelations, 
  pricing: PricingWithRelations
): FormattedBusiness => {
  return {
    id: business.id,
    name: business.name,
    location: business.location,
    description: business.description,
    weeklySchedule: formatWeeklySchedule(business.schedules[0].weeklySchedule),
    pricing: {
      weekday: pricing.weekdayPrice,
      weekend: pricing.weekendPrice,
      peakHours: {
        enabled: pricing.peakHourPricingEnabled,
        start: business.schedules[0].weeklySchedule.peakHoursStart,
        end: business.schedules[0].weeklySchedule.peakHoursEnd,
        additionalCost: pricing.peakHourPriceAdditionalCost
      },
      solo: {
        discount: pricing.soloPricingDiscount
      },
      membership: {
        monthly: business.membership.monthlyCost,
        yearly: business.membership.yearlyCost,
        perSessionDiscount: pricing.membershipDiscount
      }
    },
    durationConfig: {
      minDuration: business.durationConfig[0].minDuration,
      maxDuration: business.durationConfig[0].maxDuration,
      interval: business.durationConfig[0].interval
    },
    uiSettings: {
      colors: {
        primary: "#10B981",
        secondary: "#1F2937",
        accent: "#3B82F6"
      },
      branding: {
        businessName: business.name,
        displayName: business.name,
        description: business.description
      }
    }
  };
};