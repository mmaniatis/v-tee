// types/business.ts

export interface BusinessHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface WeeklySchedule {
  monday: BusinessHours;
  tuesday: BusinessHours;
  wednesday: BusinessHours;
  thursday: BusinessHours;
  friday: BusinessHours;
  saturday: BusinessHours;
  sunday: BusinessHours;
}

// types/business.ts
export interface PeakHours {
  enabled: boolean;    // Add this line
  start: string;
  end: string;
  additionalCost: number;
}

export interface BusinessPricing {
  weekday: number;
  weekend: number;
  peakHours: PeakHours;
  solo: {
    discount: number;
  };
  membership: {
    monthly: number;
    yearly: number;
    perSessionDiscount: number;
  };
}

export interface DurationConfig {
  minDuration: number;  // in minutes
  maxDuration: number;  // in minutes
  interval: number;     // in minutes
}

export interface Business {
  id: number;
  name: string;
  location: string;
  description: string;
  weeklySchedule: WeeklySchedule;
  pricing: BusinessPricing;
  durationConfig: DurationConfig;
}