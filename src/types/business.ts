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

export function formatBusiness(business: any, pricing: any): FormattedBusiness {
  // First, let's log the incoming data to debug
  console.log('Raw business data:', JSON.stringify(business, null, 2));
  console.log('Raw pricing data:', JSON.stringify(pricing, null, 2));

  return {
    id: business.id,
    weeklySchedule: {
      monday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('monday'),
        open: business.schedules[0].weeklySchedule.weekdayOpen,
        close: business.schedules[0].weeklySchedule.weekdayClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekdayPeakHoursEnabled,
      },
      tuesday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('tuesday'),
        open: business.schedules[0].weeklySchedule.weekdayOpen,
        close: business.schedules[0].weeklySchedule.weekdayClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekdayPeakHoursEnabled,
      },
      wednesday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('wednesday'),
        open: business.schedules[0].weeklySchedule.weekdayOpen,
        close: business.schedules[0].weeklySchedule.weekdayClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekdayPeakHoursEnabled,
      },
      thursday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('thursday'),
        open: business.schedules[0].weeklySchedule.weekdayOpen,
        close: business.schedules[0].weeklySchedule.weekdayClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekdayPeakHoursEnabled,
      },
      friday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('friday'),
        open: business.schedules[0].weeklySchedule.weekdayOpen,
        close: business.schedules[0].weeklySchedule.weekdayClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekdayPeakHoursEnabled,
      },
      saturday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('saturday'),
        open: business.schedules[0].weeklySchedule.weekendOpen,
        close: business.schedules[0].weeklySchedule.weekendClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekendPeakHoursEnabled,
      },
      sunday: {
        isOpen: !business.schedules[0].weeklySchedule.daysClosed.includes('sunday'),
        open: business.schedules[0].weeklySchedule.weekendOpen,
        close: business.schedules[0].weeklySchedule.weekendClose,
        peakHoursEnabled: business.schedules[0].weeklySchedule.weekendPeakHoursEnabled,
      },
    },
    durationConfig: {
      minDuration: business.durationConfig.minDuration,
      maxDuration: business.durationConfig.maxDuration,
      interval: business.durationConfig.interval,
    },
    uiSettings: {
      branding: {
        businessName: business.name,
        displayName: business.name,
        description: business.description,
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#2563EB',
        accent: '#10B981',
      },
    },
    pricing: {
      weekday: pricing.weekdayPrice,
      weekend: pricing.weekendPrice,
      peakHours: {
        enabled: pricing.peakHourPricingEnabled,
        start: '09:00',
        end: '17:00',
        additionalCost: pricing.peakHourPriceAdditionalCost,
      },
      solo: {
        enabled: true,
        discount: pricing.soloPricingDiscount,
      },
      membership: {
        monthly: business.membership.monthlyCost,
        yearly: business.membership.yearlyCost,
        perSessionDiscount: pricing.membershipDiscount,
      },
    },
  };
}