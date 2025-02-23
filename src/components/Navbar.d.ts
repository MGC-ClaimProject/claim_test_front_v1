import React from "react";
import "../styles/navbar.css";
interface NavBarProps {
    onUserClick?: () => void;
}
declare const NavBar: React.FC<NavBarProps>;
export default NavBar;
