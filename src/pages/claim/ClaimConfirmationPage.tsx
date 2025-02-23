import React, { useState, useEffect } from "react";
import { useAuthStore, ClaimData } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/claim/claimConfirmationPage.css";
import { auth } from "../../api/axiosInstance";
import { AxiosError } from "axios";

const ClaimConfirmationPage: React.FC = () => {
  const { claimData, setClaimData } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [existingClaim, setExistingClaim] = useState<ClaimData | null>(null);

  // ✅ `claimData`가 없을 경우 기본값 설정 (undefined 방지)
  const safeClaimData: ClaimData = claimData ?? {
    insured: { id: 0, name: "", phone: "", birth: "", gender: "", relation: "" },
    applicant: { id: 0, name: "", phone: "", birth: "", gender: "", relation: "" },
    symptoms: "",
    incidentType: "",
    treatmentType: "",
    hospitalDays: 0,
    incidentDate: "",
    applicantSignature: "",
    insuredSignature: "",
    bank: null,
    account: null,
    isSameAsPayoutAccount: false,
    claimStatus: "",
    createdAt: "",
    updatedAt: "",
    claimInsurers: [],
    documents: [],
  };

  useEffect(() => {
    if (!claimData || !claimData.insured && !claimData.claimId) {
      alert("이전 단계 정보를 찾을 수 없습니다.");
      navigate("/main/claim");
    }
  }, [claimData, navigate]);

  // ✅ 보험사 중복 제거 (이름만 저장)
  const getUniqueInsuranceCompanies = () => {
    if (!safeClaimData.selectedInsurances) return [];

    const uniqueCompanies = Array.from(
      new Set(safeClaimData.selectedInsurances.map((insurance) => insurance.company))
    );

    return uniqueCompanies.map((company) => ({ company })); // ✅ [{ company: "현대해상" }] 형태로 변환
  };

  // ✅ 은행 코드 -> 한글 변환 함수
  const getKoreanBankName = (bankKey: string | null | undefined): string => {
    const BANK_CHOICES: Record<string, string> = {
      kb: "국민은행",
      shinhan: "신한은행",
      woori: "우리은행",
      hana: "하나은행",
      nh: "농협은행",
      ibk: "기업은행",
    };

    return bankKey && BANK_CHOICES[bankKey] ? BANK_CHOICES[bankKey] : "-";
  };

  const handleSubmit = async (bypassDuplicateCheck: boolean = false) => {
    if (!safeClaimData.insured || !safeClaimData.insured.id) {
      alert("❌ 피보험자 정보가 없습니다. 다시 진행해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await auth.post(`/claims/${safeClaimData.insured.id}/`, {
        member_id: safeClaimData.insured.id,
        applicant: safeClaimData.applicant?.id || null,
        insured: safeClaimData.insured?.id || null,
        symptoms: safeClaimData.symptoms,
        incident_type: safeClaimData.incidentType,
        treatment_type: safeClaimData.treatmentType,
        hospital_days: safeClaimData.hospitalDays,
        incident_date: safeClaimData.incidentDate,
        applicant_signature: safeClaimData.applicantSignature,
        insured_signature: safeClaimData.insuredSignature,
        bank: safeClaimData.isSameAsPayoutAccount ? null : safeClaimData.bank,
        account: safeClaimData.isSameAsPayoutAccount ? null : safeClaimData.account,
        is_same_as_payout_account: safeClaimData.isSameAsPayoutAccount,
        claim_insurers: getUniqueInsuranceCompanies(), // ✅ 보험사 중복 제거 후 저장
        bypass_duplicate_check: bypassDuplicateCheck,
      });

       if (response.status === 201) {

        const newClaimId = response.data.id;

        // ✅ 기존 claimData 삭제 후 새로운 claimId만 저장
        setClaimData({ claimId: newClaimId });

        // ✅ 로컬 스토리지에서 claimData 삭제
        localStorage.removeItem("claimData");

        // ✅ navigate 실행 (이제 상태에서 claimId를 받아옴)
        navigate(`/main/claim/add-documents/`);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("❌ 서버 응답 에러:", error.response?.data);
        if (error.response?.status === 409) {
          setExistingClaim(error.response.data.existing_claim);
          setShowModal(true);
        } else {
          alert(`보험 청구 생성 중 오류가 발생했습니다. (${error.response?.status})`);
        }
      } else {
        console.error("❌ 알 수 없는 오류:", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleCancelClaim = () => {
    setShowModal(false);
    navigate("/main");
  };

  return (
    <div className="confirmation-container">
      <h2>📜 보험 청구 정보 확인</h2>

      {claimData && (
        <>
          {/* ✅ 첫 번째 줄: 신청자 & 피보험자 가로 정렬 */}
          <div className="info-box">
            <p><strong>👤 신청자:</strong> {claimData.applicant?.name || "-"}</p>
            <p><strong>🛡️ 피보험자:</strong> {claimData.insured?.name || "-"}</p>
          </div>

          {/* ✅ 두 번째 줄: 사고 유형, 치료 유형, 입원 일수, 사고 날짜 가로 정렬 */}
          <div className="incident-info-box">
            <p><strong>🚑</strong> {claimData.incidentType || "-"}</p>
            <p><strong>💊</strong> {claimData.treatmentType || "-"}</p>
            {claimData.treatmentType === "입원" && <p><strong>🏥</strong> {claimData.hospitalDays || "0"}일</p>}
            <p><strong>📅</strong> {claimData.incidentDate || "-"}</p>
          </div>

          {/* ✅ 세 번째 줄: 증상 한 줄 정렬 */}
          <div className="symptoms-box">
            <p><strong>📋 증상:</strong> {claimData.symptoms || "증상 정보 없음"}</p>
          </div>

          {/* ✅ 서명 미리보기 */}
          <div className="signature-box">
            {claimData.applicantSignature && (
              <div className="signature-preview">
                <p><strong>🖊️ 신청자 서명</strong></p>
                <img src={claimData.applicantSignature} alt="신청자 서명" />
              </div>
            )}
            {claimData.insuredSignature && (
              <div className="signature-preview">
                <p><strong>🖊️ 피보험자 서명</strong></p>
                <img src={claimData.insuredSignature} alt="피보험자 서명" />
              </div>
            )}
          </div>

          {/* ✅ 계좌번호 정보 추가 */}
          <div className="account-box">
            <div className="account-info">
              <p><strong>🏦 은행:</strong> {claimData.bank ? getKoreanBankName(claimData.bank) : "-"}</p>
              <p><strong>💳 계좌번호:</strong> {claimData.account || "-"}</p>
            </div>
          </div>

          <button className="submit-btn" onClick={() => handleSubmit()} disabled={isLoading}>
            {isLoading ? "저장 중..." : "저장 후 다음으로"}
          </button>
        </>
      )}

      {/* ✅ 중복 청구 모달 */}
      {showModal && existingClaim && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ 중복된 청구 내역이 존재합니다.</h3>
            <p><strong>사고 유형:</strong> {existingClaim.incidentType}</p>
            <p><strong>사고 발생일:</strong> {existingClaim.incidentDate}</p>
            <p><strong>증상:</strong> {existingClaim.symptoms}</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancelClaim}>취소</button>
              <button
                className="continue-btn"
                onClick={() => {
                  setShowModal(false);
                  handleSubmit(true);
                }}
              >
                계속 진행
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimConfirmationPage;
