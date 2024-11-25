import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormattedBusiness } from '@/types/business';

interface PricingPanelProps {
  settings: FormattedBusiness;
  HOURS: Array<{ value: string; label: string }>;
  DAYS_OF_WEEK: readonly string[];
  updateBaseRate: (type: 'weekdayPrice' | 'weekendPrice' | 'membershipDiscount' | 'soloPricingDiscount', value: number) => void;
  updatePeakHours: (field: 'peakHourPricingEnabled' | 'peakHourStart' | 'peakHourEnd' | 'peakHourPriceAdditionalCost', value: boolean | string | number) => void;
  updateDayPeakHours: (day: string, enabled: boolean) => void;
}

export default function PricingPanel({
  settings,
  HOURS,
  DAYS_OF_WEEK,
  updateBaseRate,
  updatePeakHours,
  updateDayPeakHours
}: PricingPanelProps) {
  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <div className="space-y-6">
      {/* Base Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Base Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekdayPrice">Weekday Rate (per hour)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="weekdayPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-6"
                  value={formatPrice(settings.pricing.weekdayPrice)}
                  onChange={(e) => updateBaseRate('weekdayPrice', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekendPrice">Weekend Rate (per hour)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="weekendPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-6"
                  value={formatPrice(settings.pricing.weekendPrice)}
                  onChange={(e) => updateBaseRate('weekendPrice', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Hours Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.pricing.peakHourPricingEnabled}
              onCheckedChange={(checked) => 
                updatePeakHours('peakHourPricingEnabled', checked)
              }
            />
            <Label>Enable Peak Hours Pricing</Label>
          </div>

          {settings.pricing.peakHourPricingEnabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Peak Hours Start</Label>
                  <Select
                    value={settings.pricing.peakHourStart}
                    onValueChange={(value) => updatePeakHours('peakHourStart', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
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

                <div className="space-y-2">
                  <Label>Peak Hours End</Label>
                  <Select
                    value={settings.pricing.peakHourEnd}
                    onValueChange={(value) => updatePeakHours('peakHourEnd', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="peakHourRate">Additional Peak Hour Cost</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="peakHourRate"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-6"
                    value={formatPrice(settings.pricing.peakHourPriceAdditionalCost)}
                    onChange={(e) => updatePeakHours('peakHourPriceAdditionalCost', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Enable Peak Hours by Day</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const schedule = settings.daySchedules.find(
                      (s) => s.dayOfWeek.toLowerCase() === day.toLowerCase()
                    );
                    
                    if (!schedule) return null;

                    return (
                      <div key={day} className="flex items-center space-x-2">
                        <Switch
                          checked={schedule.peakHoursEnabled}
                          onCheckedChange={(checked) => updateDayPeakHours(day, checked)}
                          disabled={!schedule.isOpen}
                        />
                        <span className="font-medium capitalize">
                          {day}
                          {!schedule.isOpen && (
                            <span className="text-sm text-gray-500 ml-2">(Closed)</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Discounts */}
      <Card>
        <CardHeader>
          <CardTitle>Discounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membershipDiscount">Membership Discount (%)</Label>
              <Input
                id="membershipDiscount"
                type="number"
                min="0"
                max="100"
                step="1"
                value={settings.pricing.membershipDiscount * 100}
                onChange={(e) => updateBaseRate('membershipDiscount', parseFloat(e.target.value) / 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soloPricingDiscount">Solo Pricing Discount (%)</Label>
              <Input
                id="soloPricingDiscount"
                type="number"
                min="0"
                max="100"
                step="1"
                value={settings.pricing.soloPricingDiscount * 100}
                onChange={(e) => updateBaseRate('soloPricingDiscount', parseFloat(e.target.value) / 100)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}