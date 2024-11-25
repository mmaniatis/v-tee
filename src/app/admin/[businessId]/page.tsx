// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DollarSign, Users, Eye } from "lucide-react";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { FormattedBusiness } from '@/types/business';
import type { Reservation } from '@prisma/client';
import HoursPanel from '@/components/admin/tabs/HoursPanel'
import {
  ReservationsPanel,
  PricingPanel,
  DurationPanel,
  UIPanel
} from '@/components/admin/tabs';
import { TabsContent } from '@radix-ui/react-tabs';

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

  // Load business data
  useEffect(() => {
    async function loadBusiness() {
      try {
        const response = await fetch(`/api/business/${resolvedParams.businessId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business data');
        }
        const data = await response.json();
        setSettings(data);
        setError(null);
      } catch (error) {
        console.error('Error loading business:', error);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [resolvedParams.businessId]);

  // Load reservations when date changes
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

  // Update handlers
  const updateDaySchedule = (
    day: string,
    field: 'isOpen' | 'open' | 'close' | 'peakHoursEnabled',
    value: boolean | string
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: {
            ...prev.weeklySchedule[day],
            [field]: value
          }
        }
      };
    });
  };

  const updateBaseRate = (type: 'weekday' | 'weekend', value: number) => {
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
    field: 'enabled' | 'start' | 'end' | 'additionalCost',
    value: boolean | string | number
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          peakHours: {
            ...prev.pricing.peakHours,
            [field]: value
          }
        }
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

  const updateBranding = (field: string, value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        uiSettings: {
          ...prev.uiSettings,
          branding: {
            ...prev.uiSettings.branding,
            [field]: value
          }
        }
      };
    });
  };

  const updateColors = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        uiSettings: {
          ...prev.uiSettings,
          colors: {
            ...prev.uiSettings.colors,
            [colorType]: value
          }
        }
      };
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/business/${settings.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const updatedData = await response.json();
      setSettings(updatedData);
      setError(null);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
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
          <TabsList className="flex -mb-px space-x-8">
            <TabsTrigger
              value="hours"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              Hours & Availability
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="duration"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              Duration Settings
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              <Users className="w-4 h-4 mr-2" />
              Reservations
            </TabsTrigger>
            <TabsTrigger 
              value="ui"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              UI Customization
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="reservations">
              <ReservationsPanel
                selectedDate={selectedDate}
                reservations={reservations}
                setSelectedDate={setSelectedDate}
              />
            </TabsContent>

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
                updateBaseRate={updateBaseRate}
                updatePeakHours={updatePeakHours}
              />
            </TabsContent>

            <TabsContent value="duration">
              <DurationPanel
                settings={settings}
                updateDuration={updateDuration}
              />
            </TabsContent>

            <TabsContent value="ui">
              <UIPanel
                settings={settings}
                updateBranding={updateBranding}
                updateColors={updateColors}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}