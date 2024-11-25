import { PrismaClient } from '@prisma/client';
import { type FormattedBusiness } from '@/types/business';
import type { Reservation } from '@prisma/client';
import { formatBusiness } from '@/utils/businessFormatter';

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getBusiness(businessId: number): Promise<FormattedBusiness | null> {
  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        membership: true,
        daySchedules: true,
        durationConfig: true,
        pricing: true
      }
    });
    

    if (!business) {
      return null;
    }


    // Ensure we're returning a properly formatted business object
    return {
      id: business.id,
      name: business.name,
      location: business.location,
      description: business.description,
      daySchedules: business.daySchedules,
      pricing: business.pricing ? {
        ...business.pricing,
        membership: business.membership ? {
          monthlyCost: business.membership.monthlyCost,
          yearlyCost: business.membership.yearlyCost
        } : undefined
      } : {
        // Default pricing if none exists
        id: 0,
        businessId: business.id,
        weekdayPrice: 0,
        weekendPrice: 0,
        membershipDiscount: 0,
        soloPricingDiscount: 0,
        peakHourPricingEnabled: false,
        peakHourStart: '09:00',
        peakHourEnd: '17:00',
        peakHourPriceAdditionalCost: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      durationConfig: business.durationConfig ?? {
        // Default duration config if none exists
        id: 0,
        businessId: business.id,
        minDuration: 30,
        maxDuration: 180,
        interval: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      uiSettings: business.uiSettings as any ?? {
        colors: {
          primary: '#4F46E5',
          secondary: '#1F2937',
          accent: '#10B981'
        },
        branding: {
          businessName: business.name,
          displayName: business.name,
          description: business.description
        }
      }
    };
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}


export async function getBusinessReservations(
  businessId: number,
  startDate?: string,
  endDate?: string
): Promise<Reservation[]> {
  try {
    const where: any = { id: businessId };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return reservations;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

export async function getReservationsForDay(
  businessId: number,
  date: string
): Promise<Reservation[]> {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        businessId,
        date
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return reservations;
  } catch (error) {
    console.error('Error fetching reservations for day:', error);
    return [];
  }
}

export async function updateBusiness(id: number, data: Partial<FormattedBusiness>) {
  const { daySchedules, pricing, durationConfig, uiSettings, ...businessData } = data;

  try {
    await prisma.$transaction(async (tx) => {
      // Update business basic info and UI settings
      if (businessData || uiSettings) {
        await tx.business.update({
          where: { id },
          data: {
            ...businessData,
            ...(uiSettings && { uiSettings })
          }
        });
      }

      // Update day schedules
      if (daySchedules) {
        for (const schedule of daySchedules) {
          await tx.daySchedule.upsert({
            where: {
              businessId_dayOfWeek: {
                businessId: id,
                dayOfWeek: schedule.dayOfWeek
              }
            },
            create: {
              businessId: id,
              dayOfWeek: schedule.dayOfWeek,
              isOpen: schedule.isOpen,
              openTime: schedule.openTime,
              closeTime: schedule.closeTime,
              peakHoursEnabled: schedule.peakHoursEnabled
            },
            update: {
              isOpen: schedule.isOpen,
              openTime: schedule.openTime,
              closeTime: schedule.closeTime,
              peakHoursEnabled: schedule.peakHoursEnabled
            }
          });
        }
      }

      // Update pricing
      if (pricing) {
        await tx.pricing.update({
          where: { businessId: id },
          data: {
            weekdayPrice: pricing.weekdayPrice,
            weekendPrice: pricing.weekendPrice,
            peakHourPricingEnabled: pricing.peakHourPricingEnabled,
            peakHourStart: pricing.peakHourStart,
            peakHourEnd: pricing.peakHourEnd,
            peakHourPriceAdditionalCost: pricing.peakHourPriceAdditionalCost,
            soloPricingDiscount: pricing.soloPricingDiscount,
            membershipDiscount: pricing.membershipDiscount
          }
        });

        if (pricing.membership) {
          await tx.membership.update({
            where: { businessId: id },
            data: {
              monthlyCost: pricing.membership.monthlyCost,
              yearlyCost: pricing.membership.yearlyCost
            }
          });
        }
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
): Promise<Reservation | null> {
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

export async function deleteReservation(id: number): Promise<boolean> {
  try {
    await prisma.reservation.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return false;
  }
}

export async function updateReservation(
  id: number,
  data: Partial<Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Reservation | null> {
  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data
    });
    return reservation;
  } catch (error) {
    console.error('Error updating reservation:', error);
    return null;
  }
}