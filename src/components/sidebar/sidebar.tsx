"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Menu from "./menu";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { BarChartOutlined, MenuSharp } from "@mui/icons-material";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("labass_token");
    router.push("/login");
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
        <button onClick={toggleSidebar}>
          <MenuSharp className="text-2xl text-gray-700" />
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed top-0 left-0 w-64 bg-white h-full shadow-md z-50 transform transition-transform duration-300 lg:static lg:h-screen lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
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
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 border border-blue-500 text-blue-500 rounded transition duration-200 hover:bg-blue-500 hover:text-white flex items-center justify-center"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
