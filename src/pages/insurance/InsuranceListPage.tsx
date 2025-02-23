import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import AddInsuranceModal from "../../components/modals/AddInsuranceModal.tsx";
import "../../styles/pages/insuranceList.css";

interface Insurance {
  id: number;
  company: string;
  policy_name: string;
  premium: number;
}

const InsuranceListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 상태에서 memberId와 memberName 가져오기
  const memberId = location.state?.memberId || null;
  const memberName = location.state?.memberName || "나";

  // ✅ 로컬 스토리지에서 로그인한 유저의 memberId 가져오기 (memberId가 없을 경우 대비)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userMemberId = storedUser?.member_id;

  // ✅ 실제 사용할 memberId 설정 (memberId가 없으면 userMemberId 사용)
  const effectiveMemberId = memberId || userMemberId;

  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPremium, setTotalPremium] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ "새로 조회하기" 버튼 로딩 상태

  // ✅ 보험 데이터 가져오기
  const fetchInsurances = async () => {
    if (!effectiveMemberId) {
      console.error("❌ memberId가 존재하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await auth.get(`/insurances/${effectiveMemberId}/`);
      setInsurances(response.data);

      // ✅ 총 보험료 계산
      const total = response.data.reduce((sum: number, insurance: Insurance) => sum + Number(insurance.premium), 0);
      setTotalPremium(total);
    } catch (error) {
      console.error("❌ 보험 리스트 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지 마운트 시 보험 데이터 불러오기
  useEffect(() => {
    fetchInsurances();
  }, [effectiveMemberId]);

  // ✅ 보험 데이터 새로 조회 (백엔드 요청)
  const handleRefreshInsurances = async () => {
    if (!effectiveMemberId) return;
    setIsUpdating(true);
    try {
      await auth.post(`/insurances/update/${effectiveMemberId}/`);
      fetchInsurances(); // ✅ 데이터 새로 불러오기
    } catch (error) {
      console.error("❌ 보험 데이터 갱신 실패:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ 상세페이지 이동 함수 (insuranceId를 상태로 전달)
const handleRowClick = (insuranceId: number) => {
  navigate(`/main/insurances/detail`, { state: { insuranceId } });
};

return (
  <div className="insurance-container">
    <div className="title-container">
      <h1 className="page-title">📌 {memberName}의 가입 보험</h1>
      <button className="add-insurance-btn" onClick={() => setIsModalOpen(true)}>+</button>
    </div>

    <div className="contract-status-box">
      <h2>📜 계약 현황</h2>
      <p>총 보유 계약 수: {insurances.length}건</p>
    </div>

    <div className="monthly-premium-box">
      <h2>💰 월 보험료</h2>
      <p>{totalPremium.toLocaleString()} 원</p>
    </div>

    <div className="contract-list-box">
      <h2>📋 보유 계약 리스트</h2>
      {loading ? (
        <p>⏳ 데이터를 불러오는 중...</p>
      ) : insurances.length === 0 ? (
        <div className="no-insurances">
          <p>🔍 가입된 보험이 없습니다.</p>
          <button
            className="refresh-button"
            onClick={handleRefreshInsurances}
            disabled={isUpdating}
          >
            {isUpdating ? "⏳ 조회 중..." : "🔄 새로 조회하기"}
          </button>
        </div>
      ) : (
        <ul>
          {insurances.map((insurance) => (
            <li
              key={insurance.id}
              className="insurance-item"
              onClick={() => handleRowClick(insurance.id)} // ✅ 클릭 시 insuranceId 전달
            >
              <strong>{insurance.policy_name || "보험 이름 없음"}</strong> - {insurance.company}
            </li>
          ))}
        </ul>
      )}
    </div>

    {isModalOpen && (
      <AddInsuranceModal
        memberId={effectiveMemberId}
        onClose={() => setIsModalOpen(false)}
        onInsuranceAdded={fetchInsurances}  // ✅ 보험 추가 후 목록을 다시 불러오기
      />
    )}
  </div>
);

};

export default InsuranceListPage;
