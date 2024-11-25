'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Home, LogIn, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
// import { getBusinessById } from "@/lib/mockData";

const Navbar = () => {
  const params = useParams();
  const pathname = usePathname();
  const businessId = params?.businessId;
  
  const business = null;
  const showLogin = businessId && pathname === `/${businessId}`;
  const homeLink = business ? `/${businessId}` : '/';
  const homeText = business ? business.name : 'Golf Sim Manager';
  
  // Show exit demo button only for demo business
  const isDemoBusiness = businessId === '1';
  const showExitDemo = isDemoBusiness;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={homeLink} className="flex items-center font-bold text-xl" style={{color: business != null ? business.uiSettings.colors.secondary : '#43A047'}}>
            <Home className="w-6 h-6 mr-2" />
            {homeText}
          </Link>

          <div className="flex items-center gap-4">
            {showExitDemo && (
              <Button 
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
                asChild
              >
                <Link href="/">
                  <ExternalLink className="w-4 h-4" />
                  Exit Demo
                </Link>
              </Button>
            )}
            {showLogin && (
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                asChild
              >
                <Link href={`/${businessId}/login`}>
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;