import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/buttons/profileButtons.css";

const FamilyButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button className="profile-btn family-btn" onClick={() => navigate("/main/family")}>
      👨‍👩‍👧 가족 리스트 보러가기
    </button>
  );
};

export default FamilyButton;
