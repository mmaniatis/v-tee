// pages/booking/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { formatTime, generateTimeSlots, isTimeSlotAvailable, getDaySchedule, DAYS } from '@/utils/timeUtils';
import { isPeakTime, calculatePrice } from '@/utils/pricingUtils';
import { generateDurationOptions } from '@/utils/durationUtils';
import type { FormattedBusiness, DaySchedule } from '@/types/business';
import type { Reservation } from '@prisma/client';
import { fetchBusiness, fetchReservationsForDay, createNewReservation } from '@/utils/api';

interface BookingState {
  date: Date;
  time: string | null;
  duration: string | null;
  price: number | null;
}

interface TimeSlot {
  value: string;
  display: string;
  isAvailable: boolean;
  isPeak: boolean;
}

function generateInitialBookingState(): BookingState {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    date: today,
    time: null,
    duration: null,
    price: null
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
}

function getTimeSlotStyle(
  slot: TimeSlot,
  selectedTime: string | null,
  colors: { primary: string; secondary: string }
): React.CSSProperties {
  if (!slot.isAvailable) {
    return {
      opacity: 0.5,
      cursor: 'not-allowed',
      backgroundColor: '#f3f4f6'
    };
  }

  if (selectedTime === slot.value) {
    return {
      backgroundColor: colors.primary,
      color: 'white'
    };
  }

  return {
    borderColor: colors.primary,
    color: colors.primary
  };
}

export default function BookingPage({ params }: { params: Promise<{ businessId: string }> }) {
  const resolvedParams = React.use(params);
  const [business, setBusiness] = useState<FormattedBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>(generateInitialBookingState());
  const [dayReservations, setDayReservations] = useState<Reservation[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const businessData = await fetchBusiness(Number(resolvedParams.businessId));
        setBusiness(businessData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load business');
      } finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [resolvedParams.businessId]);

  // Updated useEffect for loading reservations
  useEffect(() => {
    if (!business) return;

    async function loadReservations() {
      try {
        const dateStr = bookingState.date.toISOString().split('T')[0];
        console.log("operation=loadReservations business=" + business)
        const reservations = await fetchReservationsForDay(business.id, dateStr);
        console.log("operation=loadReservations reservations=" + reservations)

        setDayReservations(reservations);
      } catch (err) {
        console.error('Failed to load reservations:', err);
      }
    }

    loadReservations();
  }, [business, bookingState.date]);

  useEffect(() => {
    if (!business) return;

    const daySchedule = getDaySchedule(business.daySchedules, bookingState.date);
    if (!daySchedule || !daySchedule.isOpen) {
      setTimeSlots([]);
      return;
    }

    const slots = generateTimeSlots(
      daySchedule.openTime,
      daySchedule.closeTime,
      business.durationConfig.interval
    ).map(slot => ({
      ...slot,
      isAvailable: isTimeSlotAvailable(slot.value, bookingState.date, dayReservations),
      isPeak: isPeakTime(slot.value, bookingState.date, business)
    }));

    setTimeSlots(slots);
  }, [business, bookingState.date, dayReservations]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setBookingState(prev => ({
      ...prev,
      date,
      time: null,
      duration: null,
      price: null
    }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingState(prev => ({
      ...prev,
      time,
      duration: null,
      price: null
    }));
  };

  const handleDurationSelect = (duration: string) => {
    if (!business || !bookingState.time) return;

    const price = calculatePrice(
      bookingState.time,
      parseInt(duration),
      bookingState.date,
      business
    );

    setBookingState(prev => ({
      ...prev,
      duration,
      price
    }));
  };

  const handleBooking = async () => {
    if (!business || !bookingState.time || !bookingState.duration || !bookingState.price) {
      return;
    }

    setBooking(true);
    try {
      const reservation = await createNewReservation(
        business.id,
        bookingState.date.toISOString().split('T')[0],
        bookingState.time,
        parseFloat(bookingState.duration),
        bookingState.price
      );

      // Reset booking state and refresh reservations
      setBookingState(generateInitialBookingState());
      const updatedReservations = await fetchReservationsForDay(
        business.id,
        bookingState.date.toISOString().split('T')[0]
      );
      setDayReservations(updatedReservations);

      console.log("booking success!")
    } catch (error) {
      console.error(error)
    } finally {
      setBooking(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  if (!business) return null;

  // Continuing from the previous code...

  const daySchedule = getDaySchedule(business.daySchedules, bookingState.date);
  const durationOptions = generateDurationOptions(business.durationConfig);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
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

          {/* Duration Selection */}
          {bookingState.time && (
            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle>Select Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={bookingState.duration || ""}
                    onValueChange={handleDurationSelect}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{ borderColor: business.uiSettings.colors.primary }}
                    >
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
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
            </div>
          )}
          {/* Booking Summary */}
          {bookingState.time && bookingState.duration && bookingState.price !== null && (
            <div className="pt-4 py-4">
              <Card className="">
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: business.uiSettings.colors.secondary }}
                      >
                        Selected Booking
                      </h3>
                      <p className="text-gray-500">
                        {bookingState.date.toLocaleDateString()} at {formatTime(bookingState.time)}
                      </p>
                      <p className="text-gray-500">
                        Duration: {durationOptions.find(opt => opt.value === bookingState.duration)?.label}
                      </p>
                      <p className="text-gray-500">
                        Price: {formatPrice(bookingState.price)}
                        {isPeakTime(bookingState.time, bookingState.date, business) ? ' (Peak Hour Pricing)' : ''}
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
            </div>
          )}
          {!daySchedule?.isOpen ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">
                  Sorry, we're closed on {DAYS[bookingState.date.getDay()]}s.
                  Please select another date.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Calendar Selection */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: business.uiSettings.colors.secondary }}>
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={bookingState.date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    disabled={(date) => {
                      const schedule = getDaySchedule(business.daySchedules, date);
                      return !schedule?.isOpen || date < new Date();
                    }}
                    styles={{
                      selected: {
                        backgroundColor: business.uiSettings.colors.primary
                      }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Time and Duration Selection */}
              <div className="space-y-6">
                {/* Time Slots */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle style={{ color: business.uiSettings.colors.secondary }}>
                      Available Times
                    </CardTitle>
                    {business.pricing.peakHourPricingEnabled && daySchedule.peakHoursEnabled && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Peak Hours: {formatTime(business.pricing.peakHourStart)} - {formatTime(business.pricing.peakHourEnd)}
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots
                        .filter(slot => slot.isAvailable)
                        .map((slot) => (
                          <Button
                            key={slot.value}
                            onClick={() => handleTimeSelect(slot.value)}
                            className="w-full h-16 relative transition-colors hover:opacity-80"
                            style={{
                              backgroundColor: bookingState.time === slot.value
                                ? business.uiSettings.colors.primary
                                : business.uiSettings.colors.secondary,
                              color: bookingState.time === slot.value
                                ? business.uiSettings.colors.secondary
                                : business.uiSettings.colors.primary,
                              border: `1px solid ${business.uiSettings.colors.primary}`
                            }}
                          >
                            {slot.display}
                            {business.pricing.peakHourPricingEnabled &&
                              daySchedule.peakHoursEnabled &&
                              slot.isPeak && (
                                <span className="absolute top-1 right-1 text-xs text-green-600">
                                  $$
                                </span>
                              )}

                            {business.pricing.peakHourPricingEnabled &&
                              daySchedule.peakHoursEnabled &&
                              !slot.isPeak && (
                                <span className="absolute top-1 right-1 text-xs text-green-600">
                                  $
                                </span>
                              )}
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}