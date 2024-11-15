'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Business } from '@/types/business';
import { getBusinessById } from '@/lib/mockData';

const generateTimeSlots = (start: string, end: string) => {
    const slots = [];
    const [startHour] = start.split(':').map(Number);
    let [endHour] = end.split(':').map(Number);
    
    // Adjust for midnight
    if (endHour === 0) {
      endHour = 24;
    }
    
    for (let hour = startHour; hour < endHour; hour++) {
      const displayHour = hour % 24; // Handle hours after midnight
      slots.push(`${displayHour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

const BookingPage = () => {
  const params = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  useEffect(() => {
    const businessId = Number(params?.businessId);
    const businessData = getBusinessById(businessId);
    if (businessData) {
      setBusiness(businessData);
    }
  }, [params?.businessId]);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Business not found</p>
      </div>
    );
  }

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
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
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
                    setSelectedTime(null); // Reset time when date changes
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time Slots Section */}
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
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="w-full"
                  >
                    {time} (${getPrice(time)})
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
                    {selectedDate.toLocaleDateString()} at {selectedTime}
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
};

export default BookingPage;