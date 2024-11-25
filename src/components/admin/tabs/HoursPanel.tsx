// components/admin/tabs/HoursPanel.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import type { FormattedBusiness } from '@/types/business';

interface HoursPanelProps {
  settings: FormattedBusiness;
  HOURS: Array<{ value: string; label: string; }>;
  DAYS_OF_WEEK: readonly string[];
  updateDaySchedule: (day: string, field: 'isOpen' | 'open' | 'close' | 'peakHoursEnabled', value: boolean | string) => void;
}

const HoursPanel = ({ settings, updateSchedule }) => {
  const handleScheduleUpdate = (dayOfWeek: string, field: keyof DaySchedule, value: any) => {
    updateSchedule(dayOfWeek, {
      ...settings.hours[dayOfWeek],
      [field]: value
    });
  };

  return (
    <div>
      {Object.entries(settings.hours).map(([dayOfWeek, schedule]) => (
        <div key={dayOfWeek}>
          <Switch
            checked={schedule.isOpen}
            onCheckedChange={(checked) => handleScheduleUpdate(dayOfWeek, 'isOpen', checked)}
          />
          {/* Time selectors and other controls */}
        </div>
      ))}
    </div>
  );
};

export default HoursPanel