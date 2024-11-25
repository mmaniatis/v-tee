'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { formatTime, generateTimeSlots, isTimeSlotAvailable, getHoursForDate, DAYS } from '@/utils/timeUtils';
import { isPeakTime, calculatePrice } from '@/utils/pricingUtils';
import { getButtonStyles } from '@/utils/uiUtils';
import { generateDurationOptions } from '@/utils/durationUtils';
import { fetchBusiness, createReservation, fetchReservations } from '@/utils/api';
import type { FormattedBusiness } from '@/types/business';
import type { Reservation } from '@prisma/client';

export default function BookingPage({ params }: { params: Promise<{ businessId: string }> }) {
  const resolvedParams = React.use(params);
  const [business, setBusiness] = useState<FormattedBusiness | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  // Load business data
  useEffect(() => {
    async function loadBusiness() {
      try {
        const businessData = await fetchBusiness(resolvedParams.businessId);
        setBusiness(businessData);
        setError(null);
      } catch (error) {
        console.error('Error loading business:', error);
        setError('Failed to load business data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [resolvedParams.businessId]);

  // Load reservations when date changes
  useEffect(() => {
    async function loadReservations() {
      if (!business) return;
      
      try {
        const date = selectedDate.toISOString().split('T')[0];
        const reservationData = await fetchReservations(business.id.toString(), date);
        setReservations(reservationData);
      } catch (error) {
        console.error('Error loading reservations:', error);
        setError('Failed to load availability');
      }
    }

    loadReservations();
  }, [business, selectedDate]);

  if (loading) return <LoadingSpinner />;
  if (!business) return <div className="p-4">Business not found</div>;

  const availableTimeSlots = generateTimeSlots(
    getHoursForDate(selectedDate, business).open,
    getHoursForDate(selectedDate, business).close
  ).filter(slot => 
    isTimeSlotAvailable(
      slot.value,
      reservations,
      selectedDuration ? parseInt(selectedDuration) : 30
    )
  );

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedDuration(null);
    setTotalPrice(null);
    setBookingSuccess(false);
    setError(null);
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    setBookingSuccess(false);
    setError(null);
    if (selectedTime) {
      setTotalPrice(calculatePrice(selectedTime, duration, selectedDate, business));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedDuration(null);
    setTotalPrice(null);
    setBookingSuccess(false);
    setError(null);
  };

  const handleBooking = async () => {
    if (!selectedTime || !selectedDuration || totalPrice === null) return;

    setBooking(true);
    setError(null);
    try {
      const reservation = await createReservation({
        businessId: business.id.toString(),
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedTime,
        duration: parseFloat(selectedDuration),
        price: totalPrice
      });

      if (reservation) {
        setBookingSuccess(true);
        // Reload reservations to update availability
        const date = selectedDate.toISOString().split('T')[0];
        const reservationData = await fetchReservations(business.id.toString(), date);
        setReservations(reservationData);
        // Reset form
        setSelectedTime(null);
        setSelectedDuration(null);
        setTotalPrice(null);
      }
    } catch (error) {
      setError('Unable to complete your booking. Please try again.');
      setBookingSuccess(false);
    } finally {
      setBooking(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Card */}
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

          {bookingSuccess && (
            <div className="mb-8 p-4 bg-green-100 text-green-700 rounded-md">
              Booking confirmed for {selectedDate.toLocaleDateString()}
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Booking Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Card */}
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
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  disabled={[
                    { before: new Date() }, // Disable past dates
                    (date) => {
                      const day = DAYS[date.getDay()].toLowerCase();
                      return !business.weeklySchedule[day as keyof typeof business.weeklySchedule].isOpen;
                    }
                  ]}
                />
              </CardContent>
            </Card>

            {/* Time Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: business.uiSettings.colors.secondary }}>
                    Available Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((slot) => {
                        const isPeak = isPeakTime(slot.value, selectedDate, business);
                        const showPricing = business.weeklySchedule[
                          DAYS[selectedDate.getDay()].toLowerCase() as keyof typeof business.weeklySchedule
                        ].peakHoursEnabled;

                        return (
                          <Button
                            key={slot.value}
                            onClick={() => handleTimeSelect(slot.value)}
                            className={`w-full h-16 relative transition-colors ${
                              selectedTime === slot.value ? 'ring-2 ring-offset-2' : ''
                            }`}
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
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No available time slots for this date. Please try another date.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Duration Selection */}
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

          {/* Booking Summary */}
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
                      color: 'white'
                    }}
                    onClick={handleBooking}
                    disabled={booking}
                  >
                    {booking ? "Confirming..." : "Confirm Booking"}
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