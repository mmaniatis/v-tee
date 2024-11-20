'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBusinessById } from "@/lib/mockData";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { formatTime, generateTimeSlots, isTimeSlotAvailable, getHoursForDate, DAYS } from '@/utils/timeUtils';
import { isPeakTime, calculatePrice } from '@/utils/pricingUtils';
import { getButtonStyles, darken } from '@/utils/uiUtils';
import type { Business } from '@/types/business';
import { generateDurationOptions } from '@/utils/durationUtils';

const MOCK_BOOKINGS = {
  "2024-01-18": [
    { start: "09:00", duration: 1.5 },
    { start: "14:00", duration: 2 }
  ]
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

  if (!business) return <LoadingSpinner />;

  const timeSlots = generateTimeSlots(
    getHoursForDate(selectedDate, business).open,
    getHoursForDate(selectedDate, business).close
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedDuration(null);
    setTotalPrice(null);
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    if (selectedTime) {
      setTotalPrice(calculatePrice(selectedTime, duration, selectedDate, business));
    }
  };

  return (
    <ErrorBoundary>
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
                <CardTitle style={{ color: business.uiSettings.colors.secondary }}>
                  Select Date
                </CardTitle>
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
                  <CardTitle style={{ color: business.uiSettings.colors.secondary }}>
                    Available Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const isPeak = isPeakTime(slot.value, selectedDate, business);
                      const showPricing = business.weeklySchedule[
                        DAYS[selectedDate.getDay()] as keyof WeeklySchedule
                      ].peakHoursEnabled;

                      return (
                        <Button
                          key={slot.value}
                          onClick={() => handleTimeSelect(slot.value)}
                          className="w-full h-16 relative transition-colors"
                          style={getButtonStyles(
                            selectedTime === slot.value,
                            business.uiSettings.colors.primary
                          )}
                        >
                          {slot.display}
                          {showPricing && (
                            <span className={`absolute top-1 right-1 text-xs ${
                              isPeak ? 'text-green-600' : 'text-green-500'
                            }`}>
                              {isPeak ? '$$' : '$'}
                            </span>
                          )}
                        </Button>
                      )}
                    )}
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
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: business.uiSettings.colors.secondary }}
                    >
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
                      color: 'white', '&:hover': {
                        backgroundColor: darken(business.uiSettings.colors.accent, 0.1)
                      }
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
    </ErrorBoundary>
  );
}