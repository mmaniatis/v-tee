// app/api/business/[businessId]/reservations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        businessId: parseInt(params.businessId),
        date: date,
      },
      select: {
        startTime: true,
        duration: true,
        date: true,
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}