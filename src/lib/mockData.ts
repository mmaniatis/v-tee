// lib/mockData.ts

import type { Business } from '@/types/business';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 1,
    durationConfig: {
      minDuration: 30,
      maxDuration: 180,  // 3 hours
      interval: 30
    },
    name: "Downtown Golf Simulators",
    location: "123 Main St, Downtown",
    description: "Premium golf simulation in the heart of downtown",
    hours: {
      weekday: { open: "06:00", close: "00:00" },
      weekend: { open: "06:00", close: "00:00" }
    },
    pricing: {
      weekday: 45,
      weekend: 55,
      peakHours: {
        start: "17:00",
        end: "21:00",
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
    }
  },
  {
    id: 2,
    durationConfig: {
      minDuration: 30,
      maxDuration: 180,  // 3 hours
      interval: 30
    },
    name: "Suburban Golf Center",
    location: "456 Oak Road, Suburbs",
    description: "State-of-the-art golf simulators in a convenient location",
    hours: {
      weekday: { open: "07:00", close: "23:00" },
      weekend: { open: "06:00", close: "00:00" }
    },
    pricing: {
      weekday: 40,
      weekend: 50,
      peakHours: {
        start: "18:00",
        end: "22:00",
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
    }
  }
];

export const getBusinessById = (id: number): Business | undefined => {
  return MOCK_BUSINESSES.find(business => business.id === id);
};