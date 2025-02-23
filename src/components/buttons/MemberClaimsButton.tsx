import React from "react";
import { useNavigate } from "react-router-dom";

interface ClaimButtonProps {
  memberId: number;
  memberName: string;
}

const MemberClaimsButton: React.FC<ClaimButtonProps> = ({
  memberId,
  memberName,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/main/claims`, { state: { memberId, memberName } }); // ✅ 상태로 memberId, memberName 전달
  };

  return (
    <button className="claim-button" onClick={handleClick}>
      📄 {memberName}님의 청구내역 보기
    </button>
  );
};

export default MemberClaimsButton;
