import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClaimData } from "../../stores/useAuthStore"; // ✅ ClaimData 임포트
import useClaimNavigation from "../../hooks/useClaimNavigation"; // ✅ 공통 훅 사용
import SignaturePad from "../../components/SignaturePad"; // ✅ 모듈화된 서명 컴포넌트 사용
import "../../styles/pages/claim/claimSignaturePage.css";

const ClaimSignaturePage: React.FC = () => {
  const location = useLocation();
  const { handleNext } = useClaimNavigation(); // ✅ 공통 함수 사용

  // ✅ 기존 데이터 불러오기
  const storedClaimData = localStorage.getItem("claimData");
  const claimData: ClaimData | null =
    location.state || (storedClaimData ? JSON.parse(storedClaimData) : null);

  // ✅ Hook을 최상단에서 선언
  const [applicantSignature, setApplicantSignature] = useState<string | null>(claimData?.applicantSignature || null);
  const [insuredSignature, setInsuredSignature] = useState<string | null>(claimData?.insuredSignature || null);
  const [isButtonActive, setIsButtonActive] = useState(false); // ✅ 버튼 활성화 상태 관리

  // ✅ claimData가 없으면 useEffect에서 navigate 처리
  useEffect(() => {
    if (!claimData) {
      alert("이전 단계 정보를 찾을 수 없습니다. 다시 진행해주세요.");
      handleNext({}, "/main/claim");
    }
  }, [claimData, handleNext]);

  // ✅ 서명이 모두 입력되었는지 체크하여 버튼 활성화
  useEffect(() => {
    setIsButtonActive(!!(applicantSignature && insuredSignature));
  }, [applicantSignature, insuredSignature]);

  // ✅ 다음 단계 이동 (handleNext 활용)
  const onNext = () => {
    if (!claimData) return;

    const updatedClaimData: ClaimData = {
      ...claimData,
      applicantSignature,
      insuredSignature,
    };

    handleNext(updatedClaimData, "/main/claim/account"); // ✅ 다음 단계(계좌 입력)로 이동
  };

  return (
    <div className="signature-container">
      <div className="title-box">✍️ 서명 입력</div>

      {/* ✅ 신청자 정보 + 서명 */}
      {claimData && (
        <div className="info-section">
          <SignaturePad
            title="🖊️ 신청자 서명"
            name={claimData.applicant?.name || "-"}
            onSave={setApplicantSignature}
          />
        </div>
      )}

      {/* ✅ 피보험자 정보 + 서명 */}
      {claimData && (
        <div className="info-section">
          <SignaturePad
            title="🖊️ 피보험자 서명"
            name={claimData.insured?.name || "-"}
            onSave={setInsuredSignature}
          />
        </div>
      )}

      {/* ✅ 다음 버튼 */}
      <button
        className={`next-btn ${isButtonActive ? "active" : ""}`}
        onClick={onNext}
        disabled={!isButtonActive}
      >
        다음 단계로 이동
      </button>
    </div>
  );
};

export default ClaimSignaturePage;
