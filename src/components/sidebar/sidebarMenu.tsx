import React from "react";
import NavLink from "./navlink";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

interface MenuProps {
  currentPath: string;
}

const Menu: React.FC<MenuProps> = ({ currentPath }) => {
  const isActive = (href: string) => currentPath === href;

  return (
    <nav className="mt-10 flex flex-col w-full">
      <NavLink href="/" icon={HomeIcon} label="Feed" active={isActive("/")} />
      <NavLink
        href="/myConsultations"
        icon={ClipboardDocumentListIcon}
        label="My Consultations"
        active={isActive("/myConsultations")}
      />
      <NavLink
        href="/income"
        icon={CurrencyDollarIcon}
        label="Income"
        active={isActive("/income")}
      />
    </nav>
  );
};

export default Menu;
