import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import type { FormattedBusiness } from '@/types/business';

interface UIPanelProps {
  settings: FormattedBusiness;
  updateBranding: (field: string, value: string) => void;
  updateColors: (colorType: 'primary' | 'secondary' | 'accent', value: string) => void;
}

export default function UIPanel({
  settings,
  updateBranding,
  updateColors
}: UIPanelProps) {
  const [activeColorPicker, setActiveColorPicker] = React.useState<'primary' | 'secondary' | 'accent' | null>(null);

  return (
    <div className="space-y-6">
      {/* Branding Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={settings.uiSettings.branding.businessName}
              onChange={(e) => updateBranding('businessName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={settings.uiSettings.branding.displayName}
              onChange={(e) => updateBranding('displayName', e.target.value)}
            />
            <p className="text-sm text-gray-500">
              This is the name shown to customers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Input
              id="description"
              value={settings.uiSettings.branding.description}
              onChange={(e) => updateBranding('description', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Color */}
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="space-y-2">
                <div
                  className="w-full h-10 rounded-md cursor-pointer border"
                  style={{ backgroundColor: settings.uiSettings.colors.primary }}
                  onClick={() => setActiveColorPicker(activeColorPicker === 'primary' ? null : 'primary')}
                />
                <Input
                  value={settings.uiSettings.colors.primary}
                  onChange={(e) => updateColors('primary', e.target.value)}
                />
                {activeColorPicker === 'primary' && (
                  <div className="absolute z-10 mt-2">
                    <HexColorPicker
                      color={settings.uiSettings.colors.primary}
                      onChange={(color) => updateColors('primary', color)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="space-y-2">
                <div
                  className="w-full h-10 rounded-md cursor-pointer border"
                  style={{ backgroundColor: settings.uiSettings.colors.secondary }}
                  onClick={() => setActiveColorPicker(activeColorPicker === 'secondary' ? null : 'secondary')}
                />
                <Input
                  value={settings.uiSettings.colors.secondary}
                  onChange={(e) => updateColors('secondary', e.target.value)}
                />
                {activeColorPicker === 'secondary' && (
                  <div className="absolute z-10 mt-2">
                    <HexColorPicker
                      color={settings.uiSettings.colors.secondary}
                      onChange={(color) => updateColors('secondary', color)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="space-y-2">
                <div
                  className="w-full h-10 rounded-md cursor-pointer border"
                  style={{ backgroundColor: settings.uiSettings.colors.accent }}
                  onClick={() => setActiveColorPicker(activeColorPicker === 'accent' ? null : 'accent')}
                />
                <Input
                  value={settings.uiSettings.colors.accent}
                  onChange={(e) => updateColors('accent', e.target.value)}
                />
                {activeColorPicker === 'accent' && (
                  <div className="absolute z-10 mt-2">
                    <HexColorPicker
                      color={settings.uiSettings.colors.accent}
                      onChange={(color) => updateColors('accent', color)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-8 p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: settings.uiSettings.colors.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: settings.uiSettings.colors.secondary }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: settings.uiSettings.colors.accent }}
                >
                  Accent Button
                </button>
              </div>
              <div 
                className="p-4 rounded-md"
                style={{ backgroundColor: settings.uiSettings.colors.primary + '10' }}
              >
                <p style={{ color: settings.uiSettings.colors.primary }}>
                  Sample text in primary color
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}