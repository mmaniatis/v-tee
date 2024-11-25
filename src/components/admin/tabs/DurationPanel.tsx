// components/admin/tabs/DurationPanel.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import type { FormattedBusiness } from '@/types/business';

interface DurationPanelProps {
  settings: FormattedBusiness;
  updateDuration: (field: 'minDuration' | 'maxDuration' | 'interval', value: number) => void;
}

export function DurationPanel({
  settings,
  updateDuration,
}: DurationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Duration Settings
        </CardTitle>
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
            <p className="text-sm text-gray-500 mt-1">
              Shortest booking duration allowed
            </p>
          </div>
          <div>
            <Label>Maximum Duration (minutes)</Label>
            <Input
              type="number"
              value={settings.durationConfig.maxDuration}
              onChange={(e) => updateDuration('maxDuration', Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Longest booking duration allowed
            </p>
          </div>
          <div>
            <Label>Time Interval (minutes)</Label>
            <Input
              type="number"
              value={settings.durationConfig.interval}
              onChange={(e) => updateDuration('interval', Number(e.target.value))}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Duration steps (e.g., 15, 30, 45 minutes)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}