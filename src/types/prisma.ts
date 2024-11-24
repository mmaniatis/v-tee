// types/prisma.ts
import { Prisma } from '@prisma/client';

export type BusinessWithRelations = Prisma.BusinessGetPayload<{
  include: {
    membership: true,
    schedules: {
      include: {
        weeklySchedule: true
      }
    },
    durationConfig: true
  }
}>;

export type PricingWithRelations = Prisma.PricingGetPayload<{
  include: {
    business: true
  }
}>;

export type WeeklyScheduleWithRelations = Prisma.WeeklyScheduleGetPayload<{
  include: {
    schedule: true
  }
}>;