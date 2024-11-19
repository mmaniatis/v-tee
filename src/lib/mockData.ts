// lib/mockData.ts

import type { Business } from '@/types/business';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 1,
    name: "Downtown Golf Simulators",
    location: "123 Main St, Downtown",
    description: "Premium golf simulation in the heart of downtown",
    weeklySchedule: {
      monday: { isOpen: true, open: "09:00", close: "21:00" },
      tuesday: { isOpen: true, open: "09:00", close: "21:00" },
      wednesday: { isOpen: true, open: "09:00", close: "21:00" },
      thursday: { isOpen: true, open: "09:00", close: "21:00" },
      friday: { isOpen: true, open: "09:00", close: "21:00" },
      saturday: { isOpen: true, open: "10:00", close: "22:00" },
      sunday: { isOpen: true, open: "10:00", close: "20:00" }
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
    }
  },
  {
    id: 2,
    name: "Suburban Golf Center",
    location: "456 Oak Road, Suburbs",
    description: "State-of-the-art golf simulators in a convenient location",
    weeklySchedule: {
      monday: { isOpen: true, open: "07:00", close: "23:00" },
      tuesday: { isOpen: true, open: "07:00", close: "23:00" },
      wednesday: { isOpen: true, open: "07:00", close: "23:00" },
      thursday: { isOpen: true, open: "07:00", close: "23:00" },
      friday: { isOpen: true, open: "07:00", close: "23:00" },
      saturday: { isOpen: true, open: "06:00", close: "00:00" },
      sunday: { isOpen: true, open: "06:00", close: "00:00" }
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
    }
  }
];

export const getBusinessById = (id: number): Business | undefined => {
  return MOCK_BUSINESSES.find(business => business.id === id);
};