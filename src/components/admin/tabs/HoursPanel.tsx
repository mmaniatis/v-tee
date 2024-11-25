import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormattedBusiness } from '@/types/business';

interface HourOption {
  value: string;
  label: string;
}

interface HoursPanelProps {
  settings: FormattedBusiness;
  HOURS: HourOption[];
  DAYS_OF_WEEK: readonly string[];
  updateDaySchedule: (day: string, field: 'isOpen' | 'openTime' | 'closeTime', value: boolean | string) => void;
}

export default function HoursPanel({ 
  settings, 
  HOURS, 
  DAYS_OF_WEEK, 
  updateDaySchedule
}: HoursPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {DAYS_OF_WEEK.map((day) => {
            const schedule = settings.daySchedules.find(
              (s) => s.dayOfWeek.toLowerCase() === day.toLowerCase()
            );
            
            if (!schedule) return null;

            return (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-32">
                  <p className="font-medium capitalize">{day}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={schedule.isOpen}
                    onCheckedChange={(checked) => 
                      updateDaySchedule(day, 'isOpen', checked)
                    }
                  />
                  <span className="text-sm text-gray-500">
                    {schedule.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                {schedule.isOpen && (
                  <>
                    <Select
                      value={schedule.openTime}
                      onValueChange={(value) => 
                        updateDaySchedule(day, 'openTime', value)
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

                    <Select
                      value={schedule.closeTime}
                      onValueChange={(value) => 
                        updateDaySchedule(day, 'closeTime', value)
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
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}