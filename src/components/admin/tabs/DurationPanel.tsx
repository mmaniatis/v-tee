import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormattedBusiness } from '@/types/business';

interface DurationPanelProps {
  settings: FormattedBusiness;
  updateDuration: (field: 'minDuration' | 'maxDuration' | 'interval', value: number) => void;
}

export default function DurationPanel({
  settings,
  updateDuration
}: DurationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Duration Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minDuration">Minimum Duration (minutes)</Label>
            <Input
              id="minDuration"
              type="number"
              min="0"
              step="15"
              value={settings.durationConfig.minDuration}
              onChange={(e) => updateDuration('minDuration', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDuration">Maximum Duration (minutes)</Label>
            <Input
              id="maxDuration"
              type="number"
              min="0"
              step="15"
              value={settings.durationConfig.maxDuration}
              onChange={(e) => updateDuration('maxDuration', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval">Time Slot Interval (minutes)</Label>
          <Input
            id="interval"
            type="number"
            min="5"
            step="5"
            value={settings.durationConfig.interval}
            onChange={(e) => updateDuration('interval', parseInt(e.target.value))}
          />
          <p className="text-sm text-gray-500 mt-1">
            This determines the spacing between available time slots
          </p>
        </div>
      </CardContent>
    </Card>
  );
}