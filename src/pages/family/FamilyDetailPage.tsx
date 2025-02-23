import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ useLocation 추가
import { auth } from "../../api/axiosInstance";
import ProfileCard from "../../components/cards/ProfileCard.tsx";
import InsuranceButton from "../../components/buttons/InsuranceButton.tsx";
import MemberClaimsButton from "../../components/buttons/MemberClaimsButton.tsx";
import "../../styles/pages/familyDetail.css";

interface MemberDetail {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

const FamilyDetailPage: React.FC = () => {
  const location = useLocation();
  const { memberId } = location.state || {}; // ✅ 상태로 전달된 `memberId` 가져오기
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) {
      console.error("❌ memberId가 전달되지 않았습니다.");
      return;
    }

    const fetchMemberDetail = async () => {
      try {
        const response = await auth.get(`/members/${memberId}/`);
        setMember(response.data);
      } catch (error) {
        console.error("❌ 멤버 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId]);

  if (!memberId) {
    return <p>❌ 선택된 가족이 없습니다.</p>;
  }

  if (loading) {
    return <p>🔄 로딩 중...</p>;
  }

  if (!member) {
    return <p>❌ 멤버 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="family-detail-container">
      <ProfileCard member={member} /> {/* ✅ 선택된 멤버 정보 전달 */}

      {/* ✅ 버튼 컨테이너 (세로 정렬) */}
      <div className="family-button-container">
        <InsuranceButton memberId={member.id} memberName={member.name} />
        <MemberClaimsButton memberId={member.id} memberName={member.name} />
      </div>
    </div>
  );
};

export default FamilyDetailPage;
