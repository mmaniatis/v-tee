import type { FormattedBusiness } from '@/types/business';

export async function fetchBusiness(businessId: string): Promise<FormattedBusiness> {
  const response = await fetch(`/api/business/${businessId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found');
    }
    throw new Error('Failed to fetch business data');
  }
  
  return response.json();
}

export async function createReservation(data: {
  businessId: string;
  date: string;
  startTime: string;
  duration: number;
  price: number;
}) {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create reservation');
  }

  return response.json();
}

export async function fetchReservations(businessId: string, date: string) {
  const response = await fetch(
    `/api/business/${businessId}/reservations?date=${date}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch reservations');
  }

  return response.json();
}