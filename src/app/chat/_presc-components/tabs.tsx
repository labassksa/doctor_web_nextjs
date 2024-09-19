"use client";
import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const TabComponent: React.FC = () => {
  const { consultationId } = useParams(); // Get consultationId from the dynamic route
  const pathname = usePathname(); // Get current pathname for active tab detection

  // Adjust URLs to include the dynamic consultationId, noting that chat has a different structure
  const tabs = [
    { name: "Chat", href: `/chat/${consultationId}` }, // Chat follows /chat/[consultationId]
    { name: "Prescription", href: `/chat/${consultationId}/prescription` }, // The rest follow /[consultationId] structure
    { name: "SOAP", href: `/chat/${consultationId}/soap` },
    { name: "Sick-Leave", href: `/chat/${consultationId}/sickleave` },
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-sm text-xs z-50 h-16">
      <div className="flex justify-center">
        <div className="flex space-x-4 sm:space-x-6 md:space-x-8 p-4 overflow-x-auto max-w-full scrollbar-hide">
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href} passHref>
              <div
                className={`cursor-pointer px-3 py-2 md:px-4 rounded text-sm md:text-base ${
                  pathname === tab.href
                    ? "bg-green-100 text-black font-semibold"
                    : "text-gray-500 hover:text-black"
                } transition-colors duration-300`}
              >
                {tab.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
