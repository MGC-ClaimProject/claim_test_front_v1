import { useEffect, useState } from "react";
import { auth } from "../api/axiosInstance.tsx";
import { Insurance } from "../stores/useAuthStore";

// ✅ useFetchInsurances 훅 생성
const useFetchInsurances = (memberId?: string) => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsurances = async () => {
    if (!memberId) return; // 멤버 ID가 없으면 요청하지 않음

    setLoading(true); // ✅ 로딩 시작
    try {
      const response = await auth.get(`/insurances/${memberId}/`);
      setInsurances(response.data);
    } catch (error) {
      console.error("❌ 보험 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ `memberId`가 변경될 때마다 실행
  useEffect(() => {
    if (memberId) {
      fetchInsurances();
    }
  }, [memberId]);

  // ✅ 보험료 총합 계산 (insurances가 있을 때만 reduce 실행)
  const totalPremium = insurances.length > 0
    ? insurances.reduce((sum, insurance) => sum + Number(insurance.premium || 0), 0)
    : 0;

  return { insurances, loading, totalPremium, fetchInsurances };
};

export default useFetchInsurances;
