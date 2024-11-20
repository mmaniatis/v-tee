// types/business.ts

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


export interface BusinessHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface PeakHours {
  enabled: boolean;
  start: string;
  end: string;
  additionalCost: number;
}

export interface DaySchedule {
  isOpen: boolean;
  open: string;
  close: string;
  peakHoursEnabled: boolean;  // Add this new field
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
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
  uiSettings: UISettings;
}