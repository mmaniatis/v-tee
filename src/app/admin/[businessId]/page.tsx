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
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Eye } from "lucide-react";
import { getBusiness, updateBusiness } from '@/lib/db';
import type { FormattedBusiness } from '@/types/business';
import { Toast } from '@/components/ui/toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: `${i.toString().padStart(2, '0')}:00`,
  label: `${i === 0 ? '12' : i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`
}));

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
] as const;

export default function AdminPage({ params }: { params: Promise<{ businessId: string }> }) {
  const resolvedParams = React.use(params);
  const [settings, setSettings] = useState<FormattedBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      const businessData = await getBusiness(Number(resolvedParams.businessId));
      if (businessData) {
        setSettings(businessData);
      }
      setLoading(false);
    }
    loadBusiness();
  }, [resolvedParams.businessId]);

  if (loading) return <LoadingSpinner />;
  if (!settings) return <div>Business not found</div>;

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

  const ColorPicker = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (color: string) => void; 
  }) => {
    // Local state to handle dragging
    const [localColor, setLocalColor] = useState(value);
  
    // Update local color and parent state
    const handleColorChange = (newColor: string) => {
      setLocalColor(newColor);
      onChange(newColor);
    };
  
    // Update local state when prop changes
    useEffect(() => {
      setLocalColor(value);
    }, [value]);
  
    return (
      <div>
        <Label>{label}</Label>
        <div className="mt-2">
          <HexColorPicker 
            color={localColor} 
            onChange={handleColorChange}
          />
          <HexColorInput
            color={localColor}
            onChange={handleColorChange}
            prefixed
            className="mt-2 w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>
    );
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

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const success = await updateBusiness(settings.id, settings);
      if (success) {
        Toast({
          title: "Settings saved",
          description: "Your changes have been saved successfully."
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      Toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
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
            className="bg-green-600 hover:bg-green-700"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
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
            <TabsTrigger value="ui"
              className="py-4 px-8 text-lg font-medium border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-green-600 data-[state=active]:text-green-600"

            >UI Customization</TabsTrigger>
          </TabsList>
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
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

                        {settings.weeklySchedule[day].isOpen && settings.pricing.peakHours.enabled && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`peak-${day}`} className="text-sm text-gray-500">
                              Peak Hours Pricing
                            </Label>
                            <Switch
                              id={`peak-${day}`}
                              checked={settings.weeklySchedule[day].peakHoursEnabled}
                              onCheckedChange={(checked) =>
                                updateDaySchedule(day, 'peakHoursEnabled', checked)
                              }
                            />
                          </div>
                        )}
                      </div>
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

          <TabsContent value="ui">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label>Business Name (Legal Name)</Label>
                      <Input
                        value={settings.uiSettings.branding.businessName}
                        onChange={(e) => updateBranding('businessName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Display Name (Shown on Booking Page)</Label>
                      <Input
                        value={settings.uiSettings.branding.displayName}
                        onChange={(e) => updateBranding('displayName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Business Description</Label>
                      <Input
                        value={settings.uiSettings.branding.description}
                        onChange={(e) => updateBranding('description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                </CardHeader>
                <CardContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>Color Scheme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-8">
                        <ColorPicker
                          label="Primary Color"
                          value={settings.uiSettings.colors.primary}
                          onChange={(color) => updateColors('primary', color)}
                        />
                        <ColorPicker
                          label="Secondary Color"
                          value={settings.uiSettings.colors.secondary}
                          onChange={(color) => updateColors('secondary', color)}
                        />
                        <ColorPicker
                          label="Accent Color"
                          value={settings.uiSettings.colors.accent}
                          onChange={(color) => updateColors('accent', color)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-6 space-y-6">
                    <div>
                      <h3
                        className="text-2xl font-bold"
                        style={{ color: settings.uiSettings.colors.primary }}
                      >
                        {settings.uiSettings.branding.displayName}
                      </h3>
                      <p className="text-gray-600">
                        {settings.uiSettings.branding.description}
                      </p>
                    </div>

                    <div>
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{ color: settings.uiSettings.colors.secondary }}
                      >
                        Available Times
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          style={{
                            backgroundColor: settings.uiSettings.colors.primary,
                            color: 'white'
                          }}
                        >
                          9:00 AM
                        </Button>
                        <Button
                          variant="outline"
                          style={{
                            borderColor: settings.uiSettings.colors.primary,
                            color: settings.uiSettings.colors.primary
                          }}
                        >
                          10:00 AM
                        </Button>
                        <Button
                          variant="outline"
                          style={{
                            borderColor: settings.uiSettings.colors.primary,
                            color: settings.uiSettings.colors.primary
                          }}
                        >
                          11:00 AM
                        </Button>
                      </div>
                    </div>

                    <div
                      className="rounded-lg p-4"
                      style={{ backgroundColor: `${settings.uiSettings.colors.secondary}10` }}
                    >
                      <h4
                        className="text-lg font-semibold mb-2"
                        style={{ color: settings.uiSettings.colors.secondary }}
                      >
                        Selected Booking
                      </h4>
                      <p className="text-gray-600 mb-4">Thursday, Nov 21 at 9:00 AM</p>
                      <Button
                        style={{
                          backgroundColor: settings.uiSettings.colors.accent,
                          color: 'white'
                        }}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-sm text-gray-600">Color Palette</h4>
                    <div className="flex gap-4">
                      <div className="space-y-1">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: settings.uiSettings.colors.primary }}
                        />
                        <p className="text-xs text-center text-gray-600">Primary</p>
                      </div>
                      <div className="space-y-1">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: settings.uiSettings.colors.secondary }}
                        />
                        <p className="text-xs text-center text-gray-600">Secondary</p>
                      </div>
                      <div className="space-y-1">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: settings.uiSettings.colors.accent }}
                        />
                        <p className="text-xs text-center text-gray-600">Accent</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
}