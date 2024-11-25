export interface DaySchedule {
  id: number;
  businessId: number;
  dayOfWeek: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  peakHoursEnabled: boolean;
}

export interface Pricing {
  id: number;
  businessId: number;
  weekdayPrice: number;
  weekendPrice: number;
  membershipDiscount: number;
  soloPricingDiscount: number;
  peakHourPricingEnabled: boolean;
  peakHourStart: string;
  peakHourEnd: string;
  peakHourPriceAdditionalCost: number;
  membership?: {
    monthlyCost: number;
    yearlyCost: number;
  };
}

export interface DurationConfig {
  id: number;
  businessId: number;
  minDuration: number;
  maxDuration: number;
  interval: number;
}

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

export interface FormattedBusiness {
  id: number;
  name: string;
  location: string;
  description: string;
  daySchedules: DaySchedule[];
  pricing: Pricing;
  durationConfig: DurationConfig;
  uiSettings: UISettings;
}