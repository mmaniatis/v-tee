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

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

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

const generateDurationOptions = (config: DurationConfig) => {
  const options = [];
  for (let mins = config.minDuration; mins <= config.maxDuration; mins += config.interval) {
    const hours = mins / 60;
    options.push({
      value: hours.toString(),
      label: hours === 1 ? "1 hour" :
        hours < 1 ? `${mins} minutes` :
          `${hours} hours`
    });
  }
  return options;
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

  const isPeakTime = (time: string) => {
    if (!business?.pricing.peakHours.enabled) return false;

    // Get day name from selected date
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[selectedDate.getDay()] as keyof WeeklySchedule;

    // First check if peak hours are enabled for this specific day
    if (!business.weeklySchedule[dayName].peakHoursEnabled) return false;

    // Then check if time is within peak hours
    return time >= business.pricing.peakHours.start &&
      time <= business.pricing.peakHours.end;
  };

  const getHoursForDate = (date: Date) => {
    if (!business) return { open: "00:00", close: "00:00" };
    const day = date.getDay();
    // Convert day number to day name
    const dayMap: Record<number, keyof WeeklySchedule> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    const dayName = dayMap[day];
    return business.weeklySchedule[dayName];
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
            <CardTitle style={{ color: business.uiSettings.colors.primary }}>
              {business.uiSettings.branding.displayName}
            </CardTitle>
            <p className="text-gray-500">{business.uiSettings.branding.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              All times shown in {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </CardHeader>
        </Card>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: business.uiSettings.colors.secondary }}>Select Date</CardTitle>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ color: business.uiSettings.colors.secondary }}>Available Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const dayName = days[selectedDate.getDay()] as keyof WeeklySchedule;
                    const showPricing = business.weeklySchedule[dayName].peakHoursEnabled;
                    const isPeak = isPeakTime(slot.value);
                    return (
                      <Button
                        key={slot.value}
                        variant={selectedTime === slot.value ? "default" : "outline"}
                        onClick={() => handleTimeSelect(slot.value)}
                        className="w-full h-16 relative"
                        style={selectedTime === slot.value ? {
                          backgroundColor: business.uiSettings.colors.primary,
                          color: 'white',
                          border: 'none'
                        } : {
                          borderColor: business.uiSettings.colors.primary,
                          color: business.uiSettings.colors.primary,
                          backgroundColor: 'transparent'
                        }}
                      >
                        {slot.display}
                        {showPricing && (
                          <span
                            className={`absolute top-1 right-1 text-xs ${isPeak ? 'text-green-600' : 'text-green-500'
                              }`}
                          >
                            {isPeak ? '$$' : '$'}
                          </span>
                        )}
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
                      {generateDurationOptions(business.durationConfig).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
                  <h3 className="text-lg font-semibold" style={{ color: business.uiSettings.colors.secondary }}>
                    Selected Booking
                  </h3>
                  <p className="text-gray-500">
                    {selectedDate.toLocaleDateString()} at {formatTime(selectedTime)}
                  </p>
                  <p className="text-gray-500">
                    Duration: {generateDurationOptions(business.durationConfig)
                      .find(opt => opt.value === selectedDuration)?.label}
                  </p>
                  <p className="text-gray-500">
                    Price: ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <Button
                  className="transition-colors"
                  style={{
                    backgroundColor: business.uiSettings.colors.accent,
                    color: 'white'
                  }}
                >
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