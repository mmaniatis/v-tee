// app/[businessId]/login/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBusinessById } from "@/lib/mockData";

export default function LoginPage() {
  const params = useParams();
  const business = getBusinessById(Number(params.businessId));

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Business not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to {business.name}!</CardTitle>
          <CardDescription className="text-center">
            Login to book simulator sessions and manage your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Sign in
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Quick and easy booking
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                View your booking history
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Access membership benefits
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Save your preferences
              </li>
            </ul>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <Link href={`/${params.businessId}/forgot-password`} className="text-green-600 hover:text-green-500">
              Forgot your password?
            </Link>
          </div>
          
          <div className="mt-4 text-center text-sm">
            New to {business.name}?{' '}
            <Link href={`/${params.businessId}/signup`} className="text-green-600 hover:text-green-500">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}