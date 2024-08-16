"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabComponent: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Chat", href: "/chat" },
    { name: "Prescription", href: "/prescription" },
    { name: "SOAP", href: "/soap" },
    { name: "Sick-Leave", href: "/sick-leave" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 z-50 overflow-x-auto">
      <div className="flex justify-start space-x-4 sm:space-x-6 md:space-x-8 max-w-full overflow-x-auto whitespace-nowrap">
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
  );
};

export default TabComponent;
