// app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, date, startTime, duration, price } = body;

    const reservation = await prisma.reservation.create({
      data: {
        businessId: Number(businessId),
        date,
        startTime,
        duration,
        price
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}