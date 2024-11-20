// lib/mockData.ts

import type { Business } from '@/types/business';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 1,
    name: "Downtown Golf Simulators",
    location: "123 Main St, Downtown",
    description: "Premium golf simulation in the heart of downtown",
    weeklySchedule: {
      monday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      tuesday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      wednesday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      thursday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      friday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      saturday: { 
        isOpen: true, 
        open: "10:00", 
        close: "22:00",
        peakHoursEnabled: false 
      },
      sunday: { 
        isOpen: true, 
        open: "10:00", 
        close: "20:00",
        peakHoursEnabled: false 
      }
    },
    pricing: {
      weekday: 45,
      weekend: 55,
      peakHours: {
        start: "17:00",
        end: "21:00",
        enabled: true,
        additionalCost: 10
      },
      solo: {
        discount: 10
      },
      membership: {
        monthly: 199,
        yearly: 1999,
        perSessionDiscount: 15
      }
    },
    durationConfig: {
      minDuration: 30,
      maxDuration: 180,  // 3 hours
      interval: 30
    },
    uiSettings: {
      colors: {
        primary: "#070807",   // Default green
        secondary: "#1F2937", // Default gray
        accent: "#3B82F6"     // Default blue
      },
      branding: {
        businessName: "Downtown Golf Simulators",
        displayName: "Downtown Golf",
        description: "Premium golf simulation in the heart of downtown"
      },
      booking: {
        showPriceIndicator: true,
        timeSlotColumns: 3
      }
    }
  },
  {
    id: 2,
    name: "Suburban Golf Center",
    location: "456 Oak Road, Suburbs",
    description: "State-of-the-art golf simulators in a convenient location",
    weeklySchedule: {
      monday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      tuesday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      wednesday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      thursday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      friday: { 
        isOpen: true, 
        open: "09:00", 
        close: "21:00",
        peakHoursEnabled: true 
      },
      saturday: { 
        isOpen: true, 
        open: "10:00", 
        close: "22:00",
        peakHoursEnabled: false 
      },
      sunday: { 
        isOpen: true, 
        open: "10:00", 
        close: "20:00",
        peakHoursEnabled: false 
      }
    },
    pricing: {
      weekday: 40,
      weekend: 50,
      peakHours: {
        start: "18:00",
        end: "22:00",
        enabled: true,
        additionalCost: 15
      },
      solo: {
        discount: 15
      },
      membership: {
        monthly: 179,
        yearly: 1799,
        perSessionDiscount: 20
      }
    },
    durationConfig: {
      minDuration: 60,  // 1 hour minimum
      maxDuration: 240, // 4 hours maximum
      interval: 60      // 1 hour intervals
    },
    uiSettings: {
      colors: {
        primary: "#10B981",   // Default green
        secondary: "#1F2937", // Default gray
        accent: "#3B82F6"     // Default blue
      },
      branding: {
        businessName: "Downtown Golf Simulators",
        displayName: "Downtown Golf",
        description: "Premium golf simulation in the heart of downtown"
      },
      booking: {
        showPriceIndicator: true,
        timeSlotColumns: 3
      }
    }
  }
];

export const getBusinessById = (id: number): Business | undefined => {
  return MOCK_BUSINESSES.find(business => business.id === id);
};