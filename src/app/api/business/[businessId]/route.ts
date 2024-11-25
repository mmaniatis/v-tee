// app/api/business/[businessId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { formatBusiness } from '@/types/business';

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const id = Number(params.businessId);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }

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

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const pricing = await prisma.pricing.findFirst({
      where: { businessId: id }
    });

    if (!pricing) {
      return NextResponse.json({ error: 'Pricing not found' }, { status: 404 });
    }

    // Log the data before formatting
    console.log('Business data:', JSON.stringify(business, null, 2));
    console.log('Pricing data:', JSON.stringify(pricing, null, 2));

    const formattedBusiness = formatBusiness(business, pricing);
    return NextResponse.json(formattedBusiness);
  } catch (error) {
    console.error('Error in business API route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}