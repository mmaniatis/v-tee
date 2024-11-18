'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Business } from '@/types/business';
import { getBusinessById } from '@/lib/mockData';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminPage = () => {
  const params = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [settings, setSettings] = useState<Business | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const businessId = Number(params?.businessId);
    const businessData = getBusinessById(businessId);
    if (businessData) {
      setBusiness(businessData);
      setSettings(businessData);
    }
  }, [params?.businessId]);

  if (!business || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="w-96">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Business not found. Please check the ID and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const updateSettings = (path: string[], value: any) => {
    setSettings(prevSettings => {
      if (!prevSettings) return null;

      const newSettings = JSON.parse(JSON.stringify(prevSettings));
      let current = newSettings;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      setHasChanges(true);
      return newSettings;
    });
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log('Saving settings:', settings);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Business Settings - {business.name}</h1>
          {hasChanges && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          )}
        </div>

        <Tabs defaultValue="hours">
          <TabsList className="mb-4">
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
          </TabsList>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Hours of Operation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Weekday Hours</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Open</label>
                        <Input
                          type="time"
                          value={settings.hours.weekday.open}
                          onChange={(e) => updateSettings(['hours', 'weekday', 'open'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Close</label>
                        <Input
                          type="time"
                          value={settings.hours.weekday.close}
                          onChange={(e) => updateSettings(['hours', 'weekday', 'close'], e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Weekend Hours</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Open</label>
                        <Input
                          type="time"
                          value={settings.hours.weekend.open}
                          onChange={(e) => updateSettings(['hours', 'weekend', 'open'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Close</label>
                        <Input
                          type="time"
                          value={settings.hours.weekend.close}
                          onChange={(e) => updateSettings(['hours', 'weekend', 'close'], e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
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
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Weekday Rate</label>
                      <Input
                        type="number"
                        value={settings.pricing.weekday}
                        onChange={(e) => updateSettings(['pricing', 'weekday'], Number(e.target.value))}
                        prefix="$"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Weekend Rate</label>
                      <Input
                        type="number"
                        value={settings.pricing.weekend}
                        onChange={(e) => updateSettings(['pricing', 'weekend'], Number(e.target.value))}
                        prefix="$"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Peak Hours Pricing</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Start Time</label>
                        <Input
                          type="time"
                          value={settings.pricing.peakHours.start}
                          onChange={(e) => updateSettings(['pricing', 'peakHours', 'start'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">End Time</label>
                        <Input
                          type="time"
                          value={settings.pricing.peakHours.end}
                          onChange={(e) => updateSettings(['pricing', 'peakHours', 'end'], e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Additional Cost</label>
                        <Input
                          type="number"
                          value={settings.pricing.peakHours.additionalCost}
                          onChange={(e) => updateSettings(['pricing', 'peakHours', 'additionalCost'], Number(e.target.value))}
                          prefix="$"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Special Rates</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Solo Golfer Discount</label>
                        <Input
                          type="number"
                          value={settings.pricing.solo.discount}
                          onChange={(e) => updateSettings(['pricing', 'solo', 'discount'], Number(e.target.value))}
                          suffix="%"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Duration Settings</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Minimum Duration (mins)</label>
                        <Input
                          type="number"
                          value={settings.durationConfig.minDuration}
                          onChange={(e) => updateSettings(['durationConfig', 'minDuration'], Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Maximum Duration (mins)</label>
                        <Input
                          type="number"
                          value={settings.durationConfig.maxDuration}
                          onChange={(e) => updateSettings(['durationConfig', 'maxDuration'], Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Interval (mins)</label>
                        <Input
                          type="number"
                          value={settings.durationConfig.interval}
                          onChange={(e) => updateSettings(['durationConfig', 'interval'], Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <CardTitle>Membership Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Monthly Rate</label>
                      <Input
                        type="number"
                        value={settings.pricing.membership.monthly}
                        onChange={(e) => updateSettings(['pricing', 'membership', 'monthly'], Number(e.target.value))}
                        prefix="$"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Yearly Rate</label>
                      <Input
                        type="number"
                        value={settings.pricing.membership.yearly}
                        onChange={(e) => updateSettings(['pricing', 'membership', 'yearly'], Number(e.target.value))}
                        prefix="$"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Member Per-Session Discount</label>
                    <Input
                      type="number"
                      value={settings.pricing.membership.perSessionDiscount}
                      onChange={(e) => updateSettings(['pricing', 'membership', 'perSessionDiscount'], Number(e.target.value))}
                      suffix="%"
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
};

export default AdminPage;