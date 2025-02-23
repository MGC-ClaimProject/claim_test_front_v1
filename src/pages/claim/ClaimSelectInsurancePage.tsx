import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useClaimNavigation from "../../hooks/useClaimNavigation"; // ✅ 공통 훅 사용
import useFetchInsurances from "../../hooks/useFetchInsurances"; // ✅ 공통 훅 사용
import "../../styles/pages/claim/claimSelectInsurancePage.css";

interface InsuranceGroup {
  company: string;
  count: number;
  insurances: number[]; // ✅ 해당 보험사에 속한 보험 ID 리스트
}

const ClaimSelectInsurancePage: React.FC = () => {
  const location = useLocation();
  const { handleNext } = useClaimNavigation(); // ✅ 공통 훅 사용

  // ✅ `location.state`에서 데이터 불러오기 + `localStorage` 보완
  const storedClaimData = localStorage.getItem("claimData");
  const initialClaimData = location.state || (storedClaimData ? JSON.parse(storedClaimData) : null);

  const { applicant, insured } = initialClaimData || {}; // ✅ 신청자 & 피보험자 정보 가져오기

  // ✅ 보험 데이터 가져오기
  const { insurances, loading } = useFetchInsurances(insured?.id);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [companyGroups, setCompanyGroups] = useState<InsuranceGroup[]>([]);

  // ✅ claimData가 없으면 메인 페이지로 이동
  useEffect(() => {
    if (!initialClaimData || !insured) {
      alert("이전 단계 정보를 찾을 수 없습니다.");
      handleNext({}, "/main/claim"); // ✅ 메인 페이지로 이동
    }
  }, [initialClaimData, insured, handleNext]);

  // ✅ 보험사별로 그룹화
  useEffect(() => {
    if (insurances.length > 0) {
      const grouped = insurances.reduce((acc: Record<string, InsuranceGroup>, insurance) => {
        if (!acc[insurance.company]) {
          acc[insurance.company] = {
            company: insurance.company,
            count: 0,
            insurances: [],
          };
        }
        acc[insurance.company].count += 1;
        acc[insurance.company].insurances.push(insurance.id);
        return acc;
      }, {});

      setCompanyGroups(Object.values(grouped));
    }
  }, [insurances]);

  // ✅ 보험 선택 핸들러 (회사 단위로 선택)
  const handleCompanyClick = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
    );
  };

  // ✅ 다음 페이지로 이동
  const handleNextPage = () => {
    if (selectedCompanies.length === 0) {
      alert("보험사를 선택해주세요.");
      return;
    }

    // ✅ 선택된 보험사에 속한 모든 보험 ID 가져오기
    const selectedInsurances = companyGroups
      .filter((group) => selectedCompanies.includes(group.company))
      .flatMap((group) => group.insurances);

    const selectedInsuranceData = insurances.filter((insurance) =>
      selectedInsurances.includes(insurance.id)
    );

    // ✅ 상태 저장 및 다음 페이지 이동
    handleNext(
      {
        ...initialClaimData, // ✅ 기존 신청자 & 피보험자 데이터 유지
        selectedInsurances: selectedInsuranceData.map((insurance) => ({
          id: insurance.id,
          company: insurance.company,
          policy_name: insurance.policy_name,
        })),
      },
      "/main/claim/symptoms"
    );
  };

  return (
    <div className="insurance-container">
      <div className="title-box">📌 보험사 선택</div>

      {/* ✅ 신청자 & 피보험자 정보 한 줄 정렬 */}
      <div className="info-container">
        <div className="info-row">
          <span>👤 신청자 :</span>
          <span>{applicant?.name || "-"}</span>
        </div>
        <div className="info-row">
          <span>🛡️ 피보험자 :</span>
          <span>{insured?.name || "-"} / {insured?.relation || "-"}</span>
        </div>
      </div>

      {/* ✅ 보험 선택 리스트 (회사별 그룹화) */}
      <div className="insurance-selection-box">
        <h2>📜 가입한 보험사 선택</h2>
        {loading ? (
          <p>⏳ 데이터를 불러오는 중...</p>
        ) : companyGroups.length === 0 ? (
          <p>🔍 해당 피보험자의 보험이 없습니다.</p>
        ) : (
          <ul className="insurance-list">
            {companyGroups.map((group) => (
              <li
                key={group.company}
                className={selectedCompanies.includes(group.company) ? "selected" : ""}
                onClick={() => handleCompanyClick(group.company)}
              >
                <span>{group.company}</span>
                <span>{group.count}건</span> {/* ✅ 가입된 보험 개수 표시 */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ 다음 버튼 */}
      <button
        className={`select-btn ${selectedCompanies.length > 0 ? "active" : ""}`}
        onClick={handleNextPage}
        disabled={selectedCompanies.length === 0}
      >
        다음 단계로 이동
      </button>
    </div>
  );
};

export default ClaimSelectInsurancePage;
