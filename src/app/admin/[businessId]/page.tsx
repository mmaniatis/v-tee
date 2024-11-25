'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, DollarSign, Users, Eye } from "lucide-react";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import type { FormattedBusiness } from '@/types/business';
import type { Reservation } from '@prisma/client';
import { fetchBusiness, updateBusinessSettings } from '@/utils/api';
import HoursPanel from '@/components/admin/tabs/HoursPanel';
import PricingPanel from '@/components/admin/tabs/PricingPanel';
import DurationPanel from '@/components/admin/tabs/DurationPanel';
import UIPanel from '@/components/admin/tabs/UIPanel';
import ReservationsPanel from '@/components/admin/tabs/ReservationsPanel';


// Time slots for selects
const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: `${i.toString().padStart(2, '0')}:00`,
  label: `${i === 0 ? '12' : i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`
}));

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
] as const;

export default function AdminPage({ 
  params 
}: { 
  params: Promise<{ businessId: string }> 
}) {
  const resolvedParams = React.use(params);
  const [settings, setSettings] = useState<FormattedBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState('hours');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const businessData = await fetchBusiness(Number(resolvedParams.businessId));
        setSettings(businessData);
        setError(null);
      } catch (error) {
        console.error('Error loading business:', error);
        setError(error instanceof Error ? error.message : 'Failed to load business');
      } finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [resolvedParams.businessId]);

  useEffect(() => {
    async function loadReservations() {
      if (!settings) return;
      try {
        const date = selectedDate.toISOString().split('T')[0];
        const response = await fetch(
          `/api/business/${settings.id}/reservations?date=${date}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    }
    loadReservations();
  }, [settings, selectedDate]);

  if (loading) return <LoadingSpinner />;
  if (!settings) return <div>Business not found</div>;

  const updateDaySchedule = (
    day: string,
    field: 'isOpen' | 'openTime' | 'closeTime',
    value: boolean | string
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        daySchedules: prev.daySchedules.map(schedule => {
          if (schedule.dayOfWeek.toLowerCase() === day.toLowerCase()) {
            return {
              ...schedule,
              [field]: value
            };
          }
          return schedule;
        })
      };
    });
  };

  const updateBaseRate = (
    type: 'weekdayPrice' | 'weekendPrice' | 'membershipDiscount' | 'soloPricingDiscount',
    value: number
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          [type]: value
        }
      };
    });
  };

  const updatePeakHours = (
    field: 'peakHourPricingEnabled' | 'peakHourStart' | 'peakHourEnd' | 'peakHourPriceAdditionalCost',
    value: boolean | string | number
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          [field]: value
        }
      };
    });
  };

  const updateDayPeakHours = (day: string, enabled: boolean) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        daySchedules: prev.daySchedules.map(schedule => {
          if (schedule.dayOfWeek.toLowerCase() === day.toLowerCase()) {
            return {
              ...schedule,
              peakHoursEnabled: enabled
            };
          }
          return schedule;
        })
      };
    });
  };

  const updateDuration = (
    field: 'minDuration' | 'maxDuration' | 'interval',
    value: number
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        durationConfig: {
          ...prev.durationConfig,
          [field]: value
        }
      };
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updatedBusiness = await updateBusinessSettings(settings.id, settings);
      setSettings(updatedBusiness);

    } catch (error) {
      console.error('Failed to save settings:', error);

    } finally {
      setSaving(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Business Settings</h1>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex space-x-8 border-b">
              <TabsTrigger value="hours">
                <Clock className="w-4 h-4 mr-2" />
                Hours & Availability
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="duration">
                <Clock className="w-4 h-4 mr-2" />
                Duration Settings
              </TabsTrigger>
              <TabsTrigger value="reservations">
                <Users className="w-4 h-4 mr-2" />
                Reservations
              </TabsTrigger>
              <TabsTrigger value="ui">
                <Eye className="w-4 h-4 mr-2" />
                UI Customization
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="hours">
                <HoursPanel
                  settings={settings}
                  HOURS={HOURS}
                  DAYS_OF_WEEK={DAYS_OF_WEEK}
                  updateDaySchedule={updateDaySchedule}
                />
              </TabsContent>

              <TabsContent value="pricing">
                <PricingPanel
                  settings={settings}
                  HOURS={HOURS}
                  DAYS_OF_WEEK={DAYS_OF_WEEK}
                  updateBaseRate={updateBaseRate}
                  updatePeakHours={updatePeakHours}
                  updateDayPeakHours={updateDayPeakHours}
                />
              </TabsContent>

              <TabsContent value="duration">
                <DurationPanel
                  settings={settings}
                  updateDuration={updateDuration}
                />
              </TabsContent>

              <TabsContent value="reservations">
                <ReservationsPanel
                  selectedDate={selectedDate}
                  reservations={reservations}
                  setSelectedDate={setSelectedDate}
                />
              </TabsContent>

              <TabsContent value="ui">
                <UIPanel
                  settings={settings}
                  updateBranding={(field, value) => {
                    setSettings(prev => prev ? {
                      ...prev,
                      uiSettings: {
                        ...prev.uiSettings,
                        branding: {
                          ...prev.uiSettings.branding,
                          [field]: value
                        }
                      }
                    } : null);
                  }}
                  updateColors={(colorType, value) => {
                    setSettings(prev => prev ? {
                      ...prev,
                      uiSettings: {
                        ...prev.uiSettings,
                        colors: {
                          ...prev.uiSettings.colors,
                          [colorType]: value
                        }
                      }
                    } : null);
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}