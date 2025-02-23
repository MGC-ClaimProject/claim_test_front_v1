import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/buttons/profileButtons.css";

interface InsuranceButtonProps {
  memberId?: number; // ✅ 특정 멤버의 보험 리스트로 이동
  memberName?: string; // ✅ 특정 멤버의 이름을 전달
}

const InsuranceButton: React.FC<InsuranceButtonProps> = ({ memberId, memberName="나" }) => {
  const navigate = useNavigate();

   // ✅ 로컬스토리지에서 user 정보 가져오기
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userMemberId = storedUser?.member_id;

  const handleClick = () => {
    if (memberId) {
      navigate(`/main/insurances`, { state: { memberId,memberName } }); // ✅ 멤버 ID와 이름 전달
    } else {
      navigate(`/main/insurances`, { state: { userMemberId,memberName: "나" } }); // ✅ 내 보험 리스트
    }
  };

  return (
    <button className="profile-btn insurance-btn" onClick={handleClick}>
      📋 {memberName}의 보험 리스트 보러가기
    </button>
  );
};

export default InsuranceButton;
