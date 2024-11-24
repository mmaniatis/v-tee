// lib/db.ts
import { PrismaClient } from '@prisma/client';
import { formatBusiness, type FormattedBusiness } from '@/types/business';

const prisma = new PrismaClient();

export async function getBusiness(id: number): Promise<FormattedBusiness | null> {
  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        membership: true,
        schedules: {
          include: {
            weeklySchedule: true
          }
        },
        durationConfig: true
      }
    });

    if (!business) return null;

    const pricing = await prisma.pricing.findFirst({
      where: { businessId: id }
    });

    if (!pricing) return null;

    return formatBusiness(business, pricing);
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export async function updateBusiness(id: number, data: Partial<FormattedBusiness>) {
  const { weeklySchedule, pricing, durationConfig, ...businessData } = data;

  // Start a transaction to update all related records
  try {
    await prisma.$transaction(async (tx) => {
      // Update business basic info
      if (businessData) {
        await tx.business.update({
          where: { id },
          data: businessData
        });
      }

      // Update weekly schedule
      if (weeklySchedule) {
        const schedule = await tx.schedule.findFirst({
          where: { businessId: id },
          include: { weeklySchedule: true }
        });

        if (schedule) {
          const daysClosed = Object.entries(weeklySchedule)
            .filter(([_, day]) => !day.isOpen)
            .map(([day]) => day.toLowerCase());

          await tx.weeklySchedule.update({
            where: { id: schedule.weeklyScheduleId },
            data: {
              weekdayOpen: weeklySchedule.monday.open,
              weekdayClose: weeklySchedule.monday.close,
              weekendOpen: weeklySchedule.saturday.open,
              weekendClose: weeklySchedule.saturday.close,
              daysClosed,
              weekdayPeakHoursEnabled: weeklySchedule.monday.peakHoursEnabled,
              weekendPeakHoursEnabled: weeklySchedule.saturday.peakHoursEnabled,
            }
          });
        }
      }

      // Update pricing
      if (pricing) {
        await tx.pricing.update({
          where: { businessId: id },
          data: {
            weekdayPrice: pricing.weekday,
            weekendPrice: pricing.weekend,
            peakHourPricingEnabled: pricing.peakHours.enabled,
            peakHourPriceAdditionalCost: pricing.peakHours.additionalCost,
            soloPricingDiscount: pricing.solo.discount,
            membershipDiscount: pricing.membership.perSessionDiscount
          }
        });

        // Update membership costs
        await tx.membership.update({
          where: { businessId: id },
          data: {
            monthlyCost: pricing.membership.monthly,
            yearlyCost: pricing.membership.yearly
          }
        });
      }

      // Update duration config
      if (durationConfig) {
        await tx.durationConfig.update({
          where: { businessId: id },
          data: durationConfig
        });
      }
    });

    return true;
  } catch (error) {
    console.error('Error updating business:', error);
    return false;
  }
}

export async function createReservation(
  businessId: number,
  date: string,
  startTime: string,
  duration: number,
  price: number
) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        businessId,
        date,
        startTime,
        duration,
        price
      }
    });
    return reservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    return null;
  }
}