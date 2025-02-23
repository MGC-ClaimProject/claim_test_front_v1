import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      {/* ✅ '가입 보험 조회' 버튼을 SearchMyInsurance 페이지로 이동 */}
      <button className="action-button" onClick={() => navigate("/main/search-insurance-members")}>
        가입 보험 조회
      </button>

      <button className="action-button" onClick={() => navigate("/main/claim")}>
        보험 청구
      </button>
    </div>
  );
};

export default MainPage;
