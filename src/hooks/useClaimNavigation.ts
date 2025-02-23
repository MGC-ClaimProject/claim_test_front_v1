import { useNavigate } from "react-router-dom";
import { useAuthStore, ClaimData } from "../stores/useAuthStore"; // ✅ Zustand 상태 가져오기

const useClaimNavigation = () => {
  const navigate = useNavigate();
  const { setClaimData } = useAuthStore(); // ✅ 상태 업데이트 함수 가져오기

  // ✅ 공통 데이터 저장 및 페이지 이동 함수
  const handleNext = (updatedData: Partial<ClaimData>, nextPath: string) => {
    // ✅ 현재 Zustand 상태 가져오기 (이전 상태가 `null`일 수도 있음)
    const existingData = useAuthStore.getState().claimData || {};

    // ✅ `existingData`가 `null`일 경우 빈 객체 `{}`로 처리하여 오류 방지
    const newClaimData: ClaimData = {
      ...existingData,
      ...updatedData, // ✅ 새로운 데이터 덮어쓰기
    };


    // ✅ Zustand 상태 업데이트
    setClaimData(newClaimData);

    // ✅ 다음 페이지로 이동
    navigate(nextPath);
  };

  return { handleNext };
};

export default useClaimNavigation;
