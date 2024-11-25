// components/admin/tabs/ReservationsPanel.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Users } from "lucide-react";
import { formatTime } from '@/utils/timeUtils';
import type { Reservation } from '@prisma/client';
import { TabsContent } from "@/components/ui/tabs";

interface ReservationsPanelProps {
  selectedDate: Date;
  reservations: Reservation[];
  setSelectedDate: (date: Date | undefined) => void;
}

export function ReservationsPanel({
  selectedDate,
  reservations,
  setSelectedDate,
}: ReservationsPanelProps) {
  return (
    <TabsContent value="reservations">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Reservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Reservations for {selectedDate.toLocaleDateString()}
              </h3>
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {formatTime(reservation.startTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {reservation.duration} minutes
                            </p>
                            <p className="text-sm text-gray-500">
                              Price: ${reservation.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reservations for this date
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}