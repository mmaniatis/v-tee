'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getBusinessById } from '@/lib/mockData';
import type { Business } from '@/types/business';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: `${i.toString().padStart(2, '0')}:00`,
  label: `${i === 0 ? '12' : i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`
}));

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
] as const;

export default function AdminPage({ params }: { params: Promise<{ businessId: string }> }) {
  const resolvedParams = React.use(params);
  const [settings, setSettings] = useState<Business | null>(null);

  useEffect(() => {
    const businessData = getBusinessById(Number(resolvedParams.businessId));
    if (businessData) {
      setSettings(businessData);
    }
  }, [resolvedParams.businessId]);

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Weekly Schedule Updates
  const updateDaySchedule = (
    day: typeof DAYS_OF_WEEK[number],
    field: 'isOpen' | 'open' | 'close',
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

  // Pricing Updates
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

  // Duration Updates
  const updateDuration = (field: 'minDuration' | 'maxDuration' | 'interval', value: number) => {
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

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically make an API call to save the settings
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Business Settings</h1>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
          >
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="hours">
          <TabsList className="flex -mb-px space-x-8">
            <TabsTrigger
              value="hours"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              Hours
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="duration"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
            >
              Duration Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center gap-8">
                      <div className="w-32 flex items-center gap-2">
                        <Switch
                          checked={settings.weeklySchedule[day].isOpen}
                          onCheckedChange={(checked) =>
                            updateDaySchedule(day, 'isOpen', checked)
                          }
                        />
                        <Label className="capitalize">{day}</Label>
                      </div>

                      {settings.weeklySchedule[day].isOpen && (
                        <div className="flex items-center gap-4">
                          <Select
                            value={settings.weeklySchedule[day].open}
                            onValueChange={(value) =>
                              updateDaySchedule(day, 'open', value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Open" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span>to</span>

                          <Select
                            value={settings.weeklySchedule[day].close}
                            onValueChange={(value) =>
                              updateDaySchedule(day, 'close', value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Close" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Base Rates</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Weekday Rate (per hour)</Label>
                        <Input
                          type="number"
                          value={settings.pricing.weekday}
                          onChange={(e) => updateBaseRate('weekday', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Weekend Rate (per hour)</Label>
                        <Input
                          type="number"
                          value={settings.pricing.weekend}
                          onChange={(e) => updateBaseRate('weekend', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Peak Hours Pricing</h3>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="peak-hours-toggle" className="text-sm text-gray-500">
                          {settings.pricing.peakHours.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                        <Switch
                          id="peak-hours-toggle"
                          checked={settings.pricing.peakHours.enabled}
                          onCheckedChange={(checked) => updatePeakHours('enabled', checked)}
                        />
                      </div>
                    </div>

                    <div className={settings.pricing.peakHours.enabled ? "" : "opacity-50 pointer-events-none"}>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Select
                            value={settings.pricing.peakHours.start}
                            onValueChange={(value) => updatePeakHours('start', value)}
                            disabled={!settings.pricing.peakHours.enabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Select
                            value={settings.pricing.peakHours.end}
                            onValueChange={(value) => updatePeakHours('end', value)}
                            disabled={!settings.pricing.peakHours.enabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOURS.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Additional Cost</Label>
                          <Input
                            type="number"
                            value={settings.pricing.peakHours.additionalCost}
                            onChange={(e) => updatePeakHours('additionalCost', Number(e.target.value))}
                            disabled={!settings.pricing.peakHours.enabled}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="duration">
            <Card>
              <CardHeader>
                <CardTitle>Duration Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Minimum Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.durationConfig.minDuration}
                      onChange={(e) => updateDuration('minDuration', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Maximum Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.durationConfig.maxDuration}
                      onChange={(e) => updateDuration('maxDuration', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Time Interval (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.durationConfig.interval}
                      onChange={(e) => updateDuration('interval', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}