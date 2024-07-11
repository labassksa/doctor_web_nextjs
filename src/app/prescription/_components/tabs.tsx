"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TabComponent: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { name: 'Chat', href: '/chat' },
    { name: 'Prescription', href: '/prescription' },
    { name: 'SOAP', href: '/soap' },
    { name: 'Sick-Leave', href: '/sick-leave' },
  ];

  return (
    <div className="flex justify-center p-4 text-black border-b">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href} passHref>
            <div
              className={`cursor-pointer px-4 py-2 rounded text-black ${
                pathname === tab.href ? 'bg-green-100' : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabComponent;
