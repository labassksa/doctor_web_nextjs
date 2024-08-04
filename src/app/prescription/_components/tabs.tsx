// components/TabComponent.tsx
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
    <div className="flex justify-center p-4 mb-14 bg-white shadow-md">
      <div className="flex flex-wrap justify-center space-x-4 md:space-x-8 max-w-full overflow-x-auto">
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href} passHref>
            <div
              className={`cursor-pointer px-3 md:px-4 py-2 rounded text-sm md:text-base ${
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
