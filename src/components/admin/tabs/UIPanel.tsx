// components/admin/tabs/UIPanel.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import type { FormattedBusiness } from '@/types/business';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const [localColor, setLocalColor] = useState(value);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

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

interface UIPanelProps {
  settings: FormattedBusiness;
  updateBranding: (field: string, value: string) => void;
  updateColors: (colorType: 'primary' | 'secondary' | 'accent', value: string) => void;
}

export function UIPanel({
  settings,
  updateBranding,
  updateColors,
}: UIPanelProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label>Business Name (Legal Name)</Label>
              <Input
                value={settings.uiSettings.branding.businessName}
                onChange={(e) => updateBranding('businessName', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your official business name
              </p>
            </div>
            <div>
              <Label>Display Name (Shown on Booking Page)</Label>
              <Input
                value={settings.uiSettings.branding.displayName}
                onChange={(e) => updateBranding('displayName', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Name shown to customers on the booking page
              </p>
            </div>
            <div>
              <Label>Business Description</Label>
              <Input
                value={settings.uiSettings.branding.description}
                onChange={(e) => updateBranding('description', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Brief description of your business
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          {/* Color Preview */}
          <div className="mt-8">
            <h4 className="font-medium mb-4">Preview</h4>
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
  );
}