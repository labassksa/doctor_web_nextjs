"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onMoreClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, onMoreClick }) => {
  const router = useRouter();

  return (
    <div className="fixed top-0 w-full bg-white p-4 flex items-center justify-between z-10 text-black">
      {showBackButton && (
        <button onClick={() => router.back()} className="mr-2">
          <ChevronLeftIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </button>
      )}
      <h1 className="text-lg text-gray-500 font-normal flex-grow text-center">
        {title}
      </h1>
      {onMoreClick && (
        <button onClick={onMoreClick} className="ml-2 lg:hidden"> {/* Only show on mobile */}
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Header;
