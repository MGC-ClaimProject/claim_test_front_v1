import React from "react";
import { FaHome, FaClipboardList, FaFileAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bottom-nav">
      <button onClick={() => navigate("/main")}>
        <FaHome className="nav-icon" />
      </button>
      <button onClick={() => navigate("/main/insurances")}>
        <FaClipboardList className="nav-icon" />
      </button>
      <button onClick={() => navigate("/main/claims")}>
        <FaFileAlt className="nav-icon" />
      </button>
      <button onClick={() => navigate("/main/profile")}>
        <FaUser className="nav-icon" />
      </button>
    </header>
  );
};

export default NavBar;
