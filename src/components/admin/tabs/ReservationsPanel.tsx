import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { formatTime } from '@/utils/timeUtils';
import type { Reservation } from '@prisma/client';

interface ReservationsPanelProps {
  selectedDate: Date;
  reservations: Reservation[];
  setSelectedDate: (date: Date) => void;
}

export default function ReservationsPanel({
  selectedDate,
  reservations,
  setSelectedDate
}: ReservationsPanelProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Reservations for {selectedDate.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No reservations for this date
            </p>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {formatTime(reservation.startTime)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Duration: {reservation.duration} minutes
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {formatPrice(reservation.price)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}