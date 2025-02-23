import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/buttons/profileButtons.css";

const ClaimsListButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button className="profile-btn claims-btn" onClick={() => navigate("/main/claims")}>
      📝 청구 내역 보러가기
    </button>
  );
};

export default ClaimsListButton;
