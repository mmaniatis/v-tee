'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBusinessById } from "@/lib/mockData";
import type { Business } from "@/types/business";

const formatTime = (time: string): string => {
  const [hours] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:00 ${period}`;
};

const generateTimeSlots = (start: string, end: string) => {
  const slots = [];
  const [startHour] = start.split(':').map(Number);
  let [endHour] = end.split(':').map(Number);
  
  if (endHour === 0) {
    endHour = 24;
  }
  
  for (let hour = startHour; hour < endHour; hour++) {
    const displayHour = hour % 24;
    const time = `${displayHour.toString().padStart(2, '0')}:00`;
    slots.push({
      value: time,
      display: formatTime(time)
    });
  }
  return slots;
};

export default function BookingPage({ params }: { params: Promise<{ businessId: string }> }) {
  const resolvedParams = React.use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  useEffect(() => {
    const businessId = Number(resolvedParams.businessId);
    const businessData = getBusinessById(businessId);
    if (businessData) {
      setBusiness(businessData);
    }
  }, [resolvedParams.businessId]);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Business not found</p>
      </div>
    );
  }

  // Rest of the component remains the same
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getHoursForDate = (date: Date) => {
    return isWeekend(date) ? business.hours.weekend : business.hours.weekday;
  };

  const getPrice = (time: string) => {
    const basePrice = isWeekend(selectedDate) 
      ? business.pricing.weekend 
      : business.pricing.weekday;
    
    const isPeakHour = time >= business.pricing.peakHours.start && 
                      time <= business.pricing.peakHours.end;
    
    return isPeakHour ? basePrice + business.pricing.peakHours.additionalCost : basePrice;
  };

  const timeSlots = generateTimeSlots(
    getHoursForDate(selectedDate).open,
    getHoursForDate(selectedDate).close
  );

  const isPeakTime = (time: string) => {
    return time >= business.pricing.peakHours.start && 
           time <= business.pricing.peakHours.end;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{business.name}</CardTitle>
            <p className="text-gray-500">{business.location}</p>
            <p className="text-gray-600 mt-2">{business.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              All times shown in {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Times</CardTitle>
              <p className="text-sm text-gray-500">
                {isWeekend(selectedDate) ? 'Weekend' : 'Weekday'} Rates
                {selectedTime && isPeakTime(selectedTime) && ' (Peak Hours)'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.value}
                    variant={selectedTime === slot.value ? "default" : "outline"}
                    onClick={() => setSelectedTime(slot.value)}
                    className="w-full"
                  >
                    {slot.display} (${getPrice(slot.value)})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedTime && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Selected Booking</h3>
                  <p className="text-gray-500">
                    {selectedDate.toLocaleDateString()} at {formatTime(selectedTime)}
                  </p>
                  <p className="text-gray-500">
                    Price: ${getPrice(selectedTime)}
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}