import React, { useEffect, useState } from "react";
import { useAuthStore, Member } from "../../stores/useAuthStore"; // ✅ Zustand 상태 사용
import useClaimNavigation from "../../hooks/useClaimNavigation"; // ✅ 페이지 이동 훅 사용
import "../../styles/pages/claim/claimCreatePage.css";

const ClaimCreatePage: React.FC = () => {
  const { user, members, fetchMembers } = useAuthStore(); // ✅ 로그인한 유저 정보 추가
  const { handleNext } = useClaimNavigation(); // ✅ 공통 훅 사용
  const [agree, setAgree] = useState(false);
  const [selectedInsured, setSelectedInsured] = useState<Member | null>(null);

  // ✅ 신청자를 로그인한 유저 정보로 변환 (Member 타입 맞춤)
  const selectedApplicant: Member | null = user
    ? { id: user.id, name: user.user_name, phone: "", birth: "", gender: "", relation: "Self" }
    : null;

  // ✅ 가족 멤버 데이터 가져오기
  useEffect(() => {
    if (members.length === 0) {
      fetchMembers();
    }
  }, [members, fetchMembers]);

  // ✅ 피보험자 선택 핸들러
  const handleInsuredChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = Number(event.target.value);
    const member = members.find((m) => m.id === memberId) || null;
    setSelectedInsured(member);
  };

  // ✅ 동의 체크박스 변경 핸들러
  const handleAgreeChange = () => {
    setAgree((prev) => !prev);
  };

  // ✅ 다음 페이지 이동 핸들러
  const handleNextPage = () => {
    if (!agree) {
      alert("필수 동의 항목에 체크해야 진행할 수 있습니다.");
      return;
    }
    if (!selectedApplicant || !selectedInsured) {
      alert("신청자와 피보험자를 확인해주세요.");
      return;
    }

    // ✅ 상태 업데이트 및 페이지 이동
    handleNext(
      {
        applicant: selectedApplicant, // ✅ applicant가 Member 타입으로 맞춰짐
        insured: selectedInsured,
      },
      "/main/select-insurance"
    );
  };

  return (
    <div className="claim-container">
      <div className="claim-title"><p>📌 보험 청구서 작성</p></div>

      {/* ✅ 신청자 정보 (자동 설정) */}
      <div className="claim-box">
        <div className="claim-applicant">
          <span>👤 신청자</span>
          <span>{selectedApplicant?.name || "-"}</span>
        </div>
      </div>

      {/* ✅ 피보험자 정보 입력 박스 */}
      <div className="claim-box">
        <div className="claim-label">
          <span>🛡️ 피보험자</span>
          <select onChange={handleInsuredChange} defaultValue="">
            <option value="" disabled>피보험자 선택</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.relation})
              </option>
            ))}
          </select>
        </div>
        <div className="claim-info">
          <div>
            <label>이름</label>
            <span>{selectedInsured?.name || "-"}</span>
          </div>
          <div>
            <label>관계</label>
            <span>{selectedInsured?.relation || "-"}</span>
          </div>
        </div>
      </div>

      {/* ✅ 필수 동의 정보 입력 박스 */}
      <div className="claim-box">
        <h2>📜 필수 동의 항목</h2>
        <label>
          <input type="checkbox" checked={agree} onChange={handleAgreeChange} />
          개인정보 수집 및 이용에 동의합니다. (필수)
        </label>
      </div>

      {/* ✅ 다음으로 버튼 */}
      <button className={`next-button ${agree ? "active" : ""}`} onClick={handleNextPage} disabled={!agree}>
        모두 동의하고 다음으로
      </button>
    </div>
  );
};

export default ClaimCreatePage;
