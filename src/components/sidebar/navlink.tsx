"use client";
import Link from "next/link";
import React from "react";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  active,
}) => {
  return (
    <Link
      href={href}
      className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200"
      passHref
    >
      <Icon
        className={`h-6 w-6 mr-2 ${
          active ? "text-green-700" : "text-gray-400"
        }`}
      />
      <span
        className={`${active ? "text-green-700 font-bold" : "text-gray-400"}`}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavLink;
