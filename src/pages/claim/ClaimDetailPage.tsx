import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import "../../styles/pages/claim/claimDetailPage.css";
import { CLAIM_STATUS_CHOICES, INSURANCE_COMPANIES, BANK_CHOICES } from "../../constants/choices";

interface Insurer {
  company: string;
}

interface ClaimData {
  member?: { name: string };
  incident_date?: string;
  symptoms?: string;
  incident_type?: string;
  treatment_type?: string;
  hospitalDays?: number;
  claim_status?: string;
  bank?: string;
  account?: string;
  applicant_signature?: string | null;
  insured_signature?: string | null;
  claim_insurers?: Insurer[];
  documents?: { id: number; created_at: string; page_count?: number; document_url: string }[];
}

const ClaimDetailPage: React.FC = () => {
  const { claimData } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [claimDetail, setClaimDetail] = useState<ClaimData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // ✅ 청구 진행 상태

  const claimId = claimData?.claimId ?? "";

  useEffect(() => {
    if (!claimId) {
      alert("이전 단계 정보를 찾을 수 없습니다.");
      navigate("/main/claim");
    }
  }, [claimId, navigate]);

  const fetchClaimDetail = async () => {
    try {
      setLoading(true);
      const response = await auth.get(`/claims/${claimId}/claim/`);
      const data = response.data;

      const formattedData: ClaimData = {
        ...data,
        claim_status: CLAIM_STATUS_CHOICES[data.claim_status] || "정보 없음",
        incident_type: data.incident_type ?? "정보 없음",
        treatment_type: data.treatment_type ?? "정보 없음",
        incident_date: new Date(data.incident_date).toISOString().split("T")[0],
        bank: BANK_CHOICES[data.bank] || "정보 없음",
        claim_insurers: (data.claim_insurers ?? []).map((insurer: Insurer) => ({
          company: INSURANCE_COMPANIES.general?.[insurer.company] || insurer.company,
        })),
      };

      setClaimDetail(formattedData);
    } catch (error) {
      console.error("❌ 청구 상세 정보 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (claimId) fetchClaimDetail();
  }, [claimId]);

  // ✅ 추가 문서 업로드 페이지로 이동 (claimId 전달)
  const handleAddDocuments = () => {
    navigate("/main/claim/add-documents", { state: { claimId } });
  };

  // ✅ 보험사 청구하기 요청 (성공 후 현재 페이지에서 최신 정보로 갱신)
  const handleSubmitClaim = async () => {
    if (!claimId) return;

    setIsSubmitting(true);
    try {
      const response = await auth.post(`/claims/${claimId}/send/`);
      if (response.status === 200) {
        alert("✅ 보험사 청구가 완료되었습니다!");

        // ✅ 최신 데이터 다시 불러오기 (새로운 정보로 로딩)
        fetchClaimDetail();
      } else {
        throw new Error("보험사 청구 실패");
      }
    } catch (error) {
      console.error("❌ 보험사 청구 실패:", error);
      alert("🚨 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>🔄 청구 정보 로딩 중...</p>;
  if (!claimDetail) return <p>❌ 청구 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="claim-detail-container">
      <div className="claim-header">
        <h1>📌 청구 상세 정보</h1>
        <p className="claim-status"><strong>📄</strong> {claimDetail.claim_status}</p>
      </div>

      <div className="claim-info-grid">
        <div className="claim-row">
          <p title="피보험자"><strong>👤</strong> {claimDetail.member?.name ?? "정보 없음"}</p>
          <p title="사고 날짜"><strong>📅</strong> {claimDetail.incident_date}</p>
        </div>
        <div className="claim-row">
          <p title="사고 유형"><strong>🚑</strong> {claimDetail.incident_type}</p>
          <p title="치료 유형"><strong>💊</strong> {claimDetail.treatment_type}</p>
          {claimDetail.treatment_type === "입원" && <p title="입원 일수"><strong>🏥</strong> {claimDetail.hospitalDays}일</p>}
        </div>
        <div className="claim-row">
          <p title="증상"><strong>📋</strong> {claimDetail.symptoms}</p>
        </div>
        <div className="claim-row">
          <p title="은행명"><strong>🏦</strong> {claimDetail.bank}</p>
          <p title="계좌번호"><strong>💳</strong> {claimDetail.account}</p>
        </div>

        <div className="claim-row claim-insurers">
          <strong>📜</strong>
          {(claimDetail.claim_insurers?.length ?? 0) > 0 ? (
            claimDetail.claim_insurers?.map((insurer: Insurer, index: number) => (
              <span key={index}>
                {insurer.company}
                {index !== (claimDetail.claim_insurers?.length ?? 0) - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span>정보 없음</span>
          )}
        </div>

        <div className="claim-row">
          <h3>📎 추가 서류 내역</h3>
          <button className="add-docs-btn" onClick={handleAddDocuments}>➕</button>
        </div>

        {claimDetail.documents?.length ? (
          <ul className="document-list">
            {claimDetail.documents.map((doc) => (
              <li key={doc.id}>
                {doc.created_at.split("T")[0]} - {doc.page_count ?? 1}장 -
                <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                  다운로드
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>📂 추가 문서가 없습니다.</p>
        )}
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmitClaim}
        disabled={isSubmitting || claimDetail.claim_status === "발송완료"} // ✅ 발송 완료된 경우 비활성화
      >
        {isSubmitting ? "보험사 청구 중..." : "보험사에 청구하기"}
      </button>
    </div>
  );
};

export default ClaimDetailPage;
