import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/pages/claim/claimSymptomsPage.css"; // ✅ 스타일 적용

// ✅ Claim 데이터 타입 정의
interface ClaimData {
  applicant?: { name: string };
  insured?: { name: string; relation: string };
  symptoms?: string;
  incidentType?: string;
  treatmentType?: string;
  hospitalDays?: number;
  incidentDate?: string;
}

const ClaimSymptomsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 초기 상태: 로컬 스토리지 또는 이전 단계 데이터 가져오기
  const storedClaimData = localStorage.getItem("claimData");
  const claimData: ClaimData | null =
    location.state || (storedClaimData ? JSON.parse(storedClaimData) : null);

  if (!claimData) {
    alert("이전 단계 정보를 찾을 수 없습니다. 다시 진행해주세요.");
    navigate("/main/claim");
  }

  const [symptoms, setSymptoms] = useState(claimData?.symptoms || "");
  const [incidentType, setIncidentType] = useState(claimData?.incidentType || ""); // ✅ 상해, 질병, 교통사고 선택
  const [treatmentType, setTreatmentType] = useState(claimData?.treatmentType || ""); // ✅ 입원, 통원 선택
  const [hospitalDays, setHospitalDays] = useState(
    claimData?.hospitalDays !== undefined ? claimData.hospitalDays : 0
  ); // ✅ 기본값 0으로 설정
  const [incidentDate, setIncidentDate] = useState(claimData?.incidentDate || ""); // ✅ 사고 날짜 입력

  // ✅ 치료 유형 변경 시 입원일수를 자동으로 설정
  const handleTreatmentTypeChange = (type: string) => {
    setTreatmentType(type);
    if (type === "통원") {
      setHospitalDays(0); // ✅ 통원일 경우 자동으로 0일 설정
    }
  };

  // ✅ 다음 단계 이동 핸들러 (로컬 스토리지 업데이트 후 서명 페이지 이동)
  const handleNext = () => {
    if (!isFormValid) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // ✅ 기존 데이터에 증상 정보 추가
    const updatedClaimData: ClaimData = {
      ...claimData, // ✅ 기존 신청자, 피보험자, 보험사 정보 유지
      symptoms,
      incidentType,
      treatmentType,
      hospitalDays, // ✅ 통원일 경우 자동으로 0일 저장
      incidentDate, // ✅ 사고 날짜 저장
    };

    // ✅ 로컬 스토리지에 저장 (새로고침 대비)
    localStorage.setItem("claimData", JSON.stringify(updatedClaimData));


    // ✅ 다음 페이지(서명 입력)로 이동
    navigate("/main/claim/signature", { state: updatedClaimData });
  };

  // ✅ 모든 입력 필수 항목이 작성되었는지 확인 (버튼 활성화 조건)
  const isFormValid =
    symptoms.trim() &&
    incidentType &&
    treatmentType &&
    incidentDate.trim() &&
    (treatmentType !== "입원" || hospitalDays > 0);

  return (
    <div className="symptoms-container">
      {/* ✅ 신청자 & 피보험자 정보 */}
      {claimData && (
        <div className="info-wrapper">
          <div className="info-box">
            <span>👤 신청자 :</span>
            <span>{claimData.applicant?.name || "-"}</span>
          </div>
          <div className="info-box">
            <span>🛡️ 피보험자 :</span>
            <span>
              {claimData.insured?.name || "-"} / {claimData.insured?.relation || "-"}
            </span>
          </div>
        </div>
      )}

      {/* ✅ 사고 유형 선택 */}
      <div className="select-box">
        <span>🚨</span>
        <div className="radio-group">
          {["상해", "질병", "교통사고"].map((type) => (
            <label key={type}>
              <input
                type="radio"
                value={type}
                checked={incidentType === type}
                onChange={(e) => setIncidentType(e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* ✅ 치료 유형 선택 & 입원일수 입력 필드 */}
      <div className="select-box">
        <span>🏥</span>
        <div className="radio-group">
          {["통원", "입원"].map((type) => (
            <label key={type}>
              <input
                type="radio"
                value={type}
                checked={treatmentType === type}
                onChange={(e) => handleTreatmentTypeChange(e.target.value)}
              />
              {type}
            </label>
          ))}

          {/* ✅ 입원 일수 입력 필드 */}
          {treatmentType === "입원" && (
            <div className="hospital-days-box">
              <label>일수</label>
              <input
                type="number"
                min="1"
                value={hospitalDays}
                onChange={(e) => setHospitalDays(parseInt(e.target.value, 10) || 1)}
                placeholder="일수"
              />
            </div>
          )}
        </div>
      </div>

      {/* ✅ 증상 입력 & 사고 날짜 한 줄 정렬 */}
      <div className="symptom-date-container">
        <h2 className="title-box">📌 증상</h2>
        <div className="incident-date-box">
          <span>📅</span>
          <input
            type="date"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ 증상 입력 필드 (넓게 배치) */}
      <div className="symptoms-box">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="증상을 입력하세요"
        />
      </div>

      {/* ✅ 다음 버튼 (필수 항목이 모두 입력되면 활성화) */}
      <button
        className={`next-btn ${isFormValid ? "active" : ""}`}
        onClick={handleNext}
        disabled={!isFormValid}
      >
        다음 단계로 이동
      </button>
    </div>
  );
};

export default ClaimSymptomsPage;
