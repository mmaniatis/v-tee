// types/business.ts

export interface DurationConfig {
  minDuration: number;  // in minutes
  maxDuration: number;  // in minutes
  interval: number;     // in minutes
}

export interface BusinessHours {
    open: string;
    close: string;
  }
  
  export interface PeakHours {
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
  
  export interface Business {
    id: number;
    name: string;
    location: string;
    description: string;
    hours: {
      weekday: BusinessHours;
      weekend: BusinessHours;
    };
    pricing: BusinessPricing;
    durationConfig: DurationConfig;
  }