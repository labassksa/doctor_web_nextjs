import React from "react";
import NavLink from "./navlink";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
        icon={AssignmentIcon}
        label="My Consultations"
        active={isActive("/myConsultations")}
      />
      <NavLink
        href="/income"
        icon={AttachMoneyIcon}
        label="Income"
        active={isActive("/income")}
      />
    </nav>
  );
};

export default Menu;
