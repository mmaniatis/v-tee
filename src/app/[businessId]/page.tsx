'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBusinessById } from "@/lib/mockData";
import type { Business } from "@/types/business";

const MOCK_BOOKINGS = {
  "2024-01-18": [
    { start: "09:00", duration: 1.5 },
    { start: "14:00", duration: 2 }
  ]
};

const DURATION_OPTIONS = [
  { value: "0.5", label: "30 minutes" },
  { value: "1", label: "1 hour" },
  { value: "1.5", label: "1.5 hours" },
  { value: "2", label: "2 hours" },
  { value: "2.5", label: "2.5 hours" },
  { value: "3", label: "3 hours" }
];

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
  
  if (endHour === 0) endHour = 24;
  
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

const isTimeSlotAvailable = (date: Date, startTime: string, duration: number, bookings: any) => {
  const dateStr = date.toISOString().split('T')[0];
  const dateBookings = bookings[dateStr] || [];
  const [startHour] = startTime.split(':').map(Number);
  const endHour = startHour + duration;

  return !dateBookings.some((booking: any) => {
    const [bookingStart] = booking.start.split(':').map(Number);
    const bookingEnd = bookingStart + booking.duration;
    return !(endHour <= bookingStart || startHour >= bookingEnd);
  });
};

const getAvailableDurations = (startTime: string, closeTime: string) => {
  const [startHour] = startTime.split(':').map(Number);
  const [closeHour] = closeTime.split(':').map(Number);
  const adjustedCloseHour = closeHour === 0 ? 24 : closeHour;
  const hoursUntilClose = adjustedCloseHour - startHour;

  return DURATION_OPTIONS.filter(option => 
    parseFloat(option.value) <= hoursUntilClose
  );
};

export default function BookingPage({ params }: { params: Promise<{ businessId: string }> }) {
  const resolvedParams = React.use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  
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

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getHoursForDate = (date: Date) => {
    return isWeekend(date) ? business.hours.weekend : business.hours.weekday;
  };

  const calculatePrice = (time: string, duration: string) => {
    const basePrice = isWeekend(selectedDate) 
      ? business.pricing.weekend 
      : business.pricing.weekday;
    
    const isPeakHour = time >= business.pricing.peakHours.start && 
                      time <= business.pricing.peakHours.end;
    
    const hourlyRate = isPeakHour ? 
      basePrice + business.pricing.peakHours.additionalCost : 
      basePrice;

    return hourlyRate * parseFloat(duration);
  };

  const timeSlots = generateTimeSlots(
    getHoursForDate(selectedDate).open,
    getHoursForDate(selectedDate).close
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedDuration(null);
    setTotalPrice(null);
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    if (selectedTime) {
      setTotalPrice(calculatePrice(selectedTime, duration));
    }
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
                    setSelectedDuration(null);
                    setTotalPrice(null);
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Start Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const isAvailable = isTimeSlotAvailable(
                      selectedDate, 
                      slot.value,
                      selectedDuration ? parseFloat(selectedDuration) : 0.5,
                      MOCK_BOOKINGS
                    );
                    return (
                      <Button
                        key={slot.value}
                        variant={selectedTime === slot.value ? "default" : "outline"}
                        onClick={() => isAvailable && handleTimeSelect(slot.value)}
                        className={`w-full ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isAvailable}
                      >
                        {slot.display}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedDuration || ""}
                    onValueChange={handleDurationSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDurations(
                        selectedTime,
                        getHoursForDate(selectedDate).close
                      ).map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {selectedTime && selectedDuration && totalPrice !== null && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Selected Booking</h3>
                  <p className="text-gray-500">
                    {selectedDate.toLocaleDateString()} at {formatTime(selectedTime)}
                  </p>
                  <p className="text-gray-500">
                    Duration: {DURATION_OPTIONS.find(opt => opt.value === selectedDuration)?.label}
                  </p>
                  <p className="text-gray-500">
                    Price: ${totalPrice.toFixed(2)}
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