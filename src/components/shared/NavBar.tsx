// components/shared/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center text-green-600 font-bold text-xl">
            <Home className="w-6 h-6 mr-2" />
            Golf Sim Manager
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;