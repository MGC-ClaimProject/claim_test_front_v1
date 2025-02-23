import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../stores/useSignupStore.tsx";
import { Member, useAuthStore } from "../../stores/useAuthStore.tsx";
import ProfileCard from "../../components/cards/ProfileCard.tsx";
import { auth } from "../../api/axiosInstance.tsx";
import "../../styles/auth/signup.css";

import { format } from "date-fns"; // ✅ 날짜 포맷 변환을 위해 import

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useSignupStore();
  const { user } = useAuthStore();

  // ✅ 현재 날짜 가져오기
  const today = format(new Date(), "yyyy-MM-dd");

  // ✅ 필수 동의 체크박스 상태
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    sensitiveInfo: false,
    profilingInfo: false,
  });

  useEffect(() => {
    const fetchFirstMember = async () => {
      try {
        const response = await auth.get("/members/");
        const members = response.data;

        if (members.length === 0) {
          console.warn("⚠️ 멤버 데이터가 없습니다.");
          return;
        }

        // ✅ 가장 작은 ID를 가진 멤버 찾기
        const firstMember = members.reduce((prev: Member, curr: Member) =>
          prev.id < curr.id ? prev : curr
        );

        // ✅ 가져온 생년월일이 오늘 날짜라면 빈 문자열로 변환
        const birthValue = firstMember.birth === today ? "" : firstMember.birth;

        // ✅ 성별이 "Male", "Female"이 아니면 빈칸 처리
        const validGenders = ["Male", "Female"];
        const genderValue = validGenders.includes(firstMember.gender) ? firstMember.gender : "";

        // ✅ 최신 멤버 정보를 상태에 반영
        setFormData({
          name: firstMember.name,
          phone: firstMember.phone,
          birth: birthValue,
          gender: genderValue,
          relation: "Self",
          memberId: firstMember.id,
        });
      } catch (error) {
        console.error("❌ 첫 번째 멤버 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchFirstMember();
  }, []);

  const handleAgreeAndContinue = () => {
    // ✅ 최신 상태를 가져옴
    const latestFormData = { ...formData };


    // ✅ 필수 입력값 검증
    if (!latestFormData.name || !latestFormData.phone || !latestFormData.birth || !latestFormData.gender) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // ✅ 최신 업데이트된 formData로 회원가입 데이터 구성
    const updatedSignupData = {
      ...latestFormData,
      user: user?.id || null,
      relation: "Self",
    };


    // ✅ 최신 데이터를 Zustand에도 반영
    setFormData(updatedSignupData);

    // ✅ 최신 memberId를 `state`로 넘겨서 광고 동의 페이지로 이동
    navigate("/signup/ad-consent", { state: { memberId: updatedSignupData.memberId } });
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원 가입</h1>

      {/* ✅ ProfileCard 사용하여 입력 폼 구현 */}
      <ProfileCard
        member={{
          id: formData.memberId || 1,
          name: formData.name,
          phone: formData.phone,
          birth: formData.birth,
          gender: formData.gender,
          relation: "Self",
        }}
        setFormData={(updatedData: Partial<Member>) =>
          setFormData({ ...formData, ...updatedData })
        }
        hideRelation={true}
      />

      {/* ✅ 필수 동의 체크박스 섹션 */}
      <div className="agreement-box">
        <h3 className="agreement-title">서비스 이용을 위해 동의가 필요해요</h3>

        <label className="agreement-item">
          <input
            type="checkbox"
            checked={agreements.personalInfo}
            onChange={() => setAgreements({ ...agreements, personalInfo: !agreements.personalInfo })}
          />
          <span>[필수] 개인정보 수집·이용 동의</span>
        </label>

        <label className="agreement-item">
          <input
            type="checkbox"
            checked={agreements.sensitiveInfo}
            onChange={() => setAgreements({ ...agreements, sensitiveInfo: !agreements.sensitiveInfo })}
          />
          <span>[필수] 민감정보 수집·이용 동의</span>
        </label>

        <label className="agreement-item">
          <input
            type="checkbox"
            checked={agreements.profilingInfo}
            onChange={() => setAgreements({ ...agreements, profilingInfo: !agreements.profilingInfo })}
          />
          <span>[필수] 고유식별 정보 처리 동의</span>
        </label>
      </div>

      {/* ✅ 회원가입 버튼 */}
      <button className="agree-button" onClick={handleAgreeAndContinue}>
        모두 동의하고 계속하기
      </button>
    </div>
  );
};

export default Signup;
