import type { Business, DaySchedule, Pricing, DurationConfig, Membership } from '@prisma/client';
import type { FormattedBusiness, UISettings } from '@/types/business';

export function formatBusiness(
  business: Business & {
    daySchedules: DaySchedule[];
    pricing: Pricing | null;
    durationConfig: DurationConfig | null;
    membership: Membership | null;
  }
): FormattedBusiness {
  return {
    id: business.id,
    name: business.name,
    location: business.location,
    description: business.description,
    daySchedules: business.daySchedules,
    pricing: {
      ...business.pricing!,
      membership: business.membership ? {
        monthlyCost: business.membership.monthlyCost,
        yearlyCost: business.membership.yearlyCost
      } : undefined
    },
    durationConfig: business.durationConfig!,
    uiSettings: business.uiSettings as UISettings
  };
}