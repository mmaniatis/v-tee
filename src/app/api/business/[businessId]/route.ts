import { NextRequest, NextResponse } from 'next/server';
import { getBusiness, updateBusiness } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const businessId = await Promise.resolve(params.businessId);
  console.log("businessId=" + businessId)
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
  }

  try {
    const business = await getBusiness(Number(businessId));
    if (!business) {
      return NextResponse.json({ 
        error: 'Business not found',
        message: `No business found with ID ${businessId}`
      }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to fetch business details'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  if (!params.businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await updateBusiness(Number(params.businessId), body);
    
    if (!updated) {
      return NextResponse.json({ 
        error: 'Update failed',
        message: 'Failed to update business settings'
      }, { status: 400 });
    }

    const business = await getBusiness(Number(params.businessId));
    if (!business) {
      return NextResponse.json({ 
        error: 'Business not found',
        message: 'Business was updated but could not be retrieved'
      }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to update business settings'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({});
}
