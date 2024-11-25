// utils/api.ts
export async function fetchBusiness(businessId: number) {
  console.log("HERE")
  const response = await fetch(`/api/business/${businessId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch business' }));
    throw new Error(error.error || 'Failed to fetch business');
  }
  
  return response.json();
}

export async function fetchReservationsForDay(businessId: number, date: string) {
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
    const error = await response.json().catch(() => ({ error: 'Failed to fetch reservations' }));
    throw new Error(error.error || 'Failed to fetch reservations');
  }

  return response.json();
}

export async function createNewReservation(
  businessId: number,
  date: string,
  startTime: string,
  duration: number,
  price: number
) {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessId,
      date,
      startTime,
      duration,
      price,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create reservation' }));
    throw new Error(error.error || 'Failed to create reservation');
  }

  return response.json();
}

export async function updateBusinessSettings(
  id: number,
  data: Partial<FormattedBusiness>
) {
  const response = await fetch(`/api/business/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update business settings' }));
    throw new Error(error.error || 'Failed to update business settings');
  }

  return response.json();
}