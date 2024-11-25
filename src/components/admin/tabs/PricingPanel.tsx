// components/admin/tabs/PricingPanel.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DollarSign } from "lucide-react";
import type { FormattedBusiness } from '@/types/business';

interface PricingPanelProps {
  settings: FormattedBusiness;
  HOURS: Array<{ value: string; label: string; }>;
  updateBaseRate: (type: 'weekday' | 'weekend', value: number) => void;
  updatePeakHours: (field: 'enabled' | 'start' | 'end' | 'additionalCost', value: boolean | string | number) => void;
}

export function PricingPanel({
  settings,
  HOURS,
  updateBaseRate,
  updatePeakHours,
}: PricingPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Pricing Configuration
        </CardTitle>
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
  );
}