"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Menu from './menu';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full  bg-white shadow-md flex flex-col justify-between">
      <div className="p-4">
        <div className="flex flex-col items-center mt-10">
          <Image
            src="/path-to-doctor-image.jpg"
            alt="Dr. Mohammed"
            width={96}
            height={96}
            className="rounded-full"
          />
          <h2 className="mt-4 text-lg font-semibold">Dr: Mohammed</h2>
          <Link href="/profile">
            <button className="mt-2 px-4 py-2 text-sm text-white bg-green-500 rounded">
              My Profile
            </button>
          </Link>
        </div>
        <Menu currentPath={pathname} />
      </div>
      <div className="p-4">
        <button className="w-full py-2.5 px-4 border border-blue-500 text-blue-500 rounded transition duration-200 hover:bg-blue-500 hover:text-white flex items-center justify-center">
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
