import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Target } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 mb-2" />,
      title: "Booking Management",
      description: "Streamline your simulator scheduling with our intuitive booking system"
    },
    {
      icon: <Clock className="w-6 h-6 mb-2" />,
      title: "Automated Operations",
      description: "Reduce no-shows with automatic reminders and easy rescheduling"
    },
    {
      icon: <MapPin className="w-6 h-6 mb-2" />,
      title: "Business Analytics",
      description: "Track utilization, revenue, and customer patterns with detailed reports"
    },
    {
      icon: <Target className="w-6 h-6 mb-2" />,
      title: "Customer Management",
      description: "Build customer loyalty with profiles, history, and preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Golf Simulator
            <span className="text-green-600"> Business Management</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one booking system designed specifically for golf simulator businesses. Maximize revenue, reduce admin time, and delight your customers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/1">Try Demo Booking Page</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/admin/1">View Demo Admin Panel</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Golf Simulator Businesses</h2>
          <p className="text-xl text-gray-600">Everything you need to manage and grow your simulator facility</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to streamline your business?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading golf simulator facilities who trust us to manage their operations
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/1">Try Demo Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;