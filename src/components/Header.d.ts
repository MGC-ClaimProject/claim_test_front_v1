import React from "react";
import "../styles/header.css";
interface HeaderProps {
    onMenuClick: () => void;
}
declare const Header: React.FC<HeaderProps>;
export default Header;
