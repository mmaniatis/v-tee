import { getBusinessReservations, getReservationsForDay } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const businessId = await Promise.resolve(params.businessId);
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let reservations;
    if (date) {
      reservations = await getReservationsForDay(Number(businessId), date);
    } else {
      reservations = await getBusinessReservations(
        Number(businessId),
        startDate || undefined,
        endDate || undefined
      );
    }
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}