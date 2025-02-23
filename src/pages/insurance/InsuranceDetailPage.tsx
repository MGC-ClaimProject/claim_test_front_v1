import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import { auth } from "../../api/axiosInstance";
import "../../styles/pages/insuranceDetail.css";

interface Insurance {
  id: number;
  policy_name: string;
  company: string;
  premium: number;
  start_date: string;
}

const InsuranceDetailPage: React.FC = () => {
  const location = useLocation();
  const { insuranceId: paramInsuranceId } = useParams<{ insuranceId?: string }>(); // ✅ useParams에서 insuranceId 가져오기
  const insuranceId = location.state?.insuranceId || paramInsuranceId; // ✅ state에서 insuranceId 가져오고 없으면 param 사용

  const [insurance, setInsurance] = useState<Insurance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!insuranceId) {
      console.error("❌ insuranceId가 없습니다.");
      return;
    }

    const fetchInsuranceDetail = async () => {
      try {
        const response = await auth.get(`/insurances/${insuranceId}/insurance/`);
        setInsurance(response.data);
      } catch (error) {
        console.error("❌ 보험 상세 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceDetail();
  }, [insuranceId]);

  if (!insuranceId) {
    return <p>❌ 유효한 insuranceId가 없습니다.</p>;
  }

  if (loading) {
    return <p>🔄 로딩 중...</p>;
  }

  if (!insurance) {
    return <p>❌ 보험 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="insurance-detail-container">
      <h1>📌 보험 상세 정보</h1>
      <div className="insurance-info">
        <p><strong>보험명:</strong> {insurance.policy_name}</p>
        <p><strong>보험사:</strong> {insurance.company}</p>
        <p><strong>월 보험료:</strong> {insurance.premium.toLocaleString()} 원</p>
        <p><strong>가입일:</strong> {insurance.start_date}</p>
      </div>
    </div>
  );
};

export default InsuranceDetailPage;
