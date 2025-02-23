import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import { auth } from "../../api/axiosInstance";
import "../../styles/auth/ad_consent.css"; // ✅ 기존 스타일 유지

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL + "/members/";

const AdConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Signup에서 전달된 `state` 가져오기
  const memberId = location.state?.memberId; // ✅ 전달된 memberId 가져오기

  // ✅ 광고 동의 선택 상태
  const [consents, setConsents] = useState([
    { id: 1, title: "광고성 문자 안내 1", agreed: false },
    // { id: 2, title: "광고성 문자 안내 2", agreed: false },
    // { id: 3, title: "광고성 문자 안내 3", agreed: false },
  ]);

  const handleConsentChange = (id: number, agreed: boolean) => {
    setConsents(consents.map((item) => (item.id === id ? { ...item, agreed } : item)));
  };

  const handleSubmit = async () => {
    try {
      if (!memberId) {
        alert("회원 정보를 찾을 수 없습니다. 다시 시도해주세요.");
        return;
      }

      // ✅ 광고 동의 여부 확인
      const is_ad_agreed = consents.some((c) => c.agreed);

      // ✅ 광고 동의 업데이트 요청
      await auth.patch(`${API_URL}${memberId}/`, { is_ad_agreed });

      // ✅ 가입 완료 페이지로 이동
      navigate("/complete");
    } catch (error) {
      console.error("⚠️ 광고 동의 업데이트 실패:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="ad-consent-container">
      <h1 className="ad-consent-title">정보 동의</h1>

      {consents.map((item) => (
        <div key={item.id} className="consent-box">
          <p>{item.title}</p>
          <div className="button-group">
            <button
              className={`consent-button ${item.agreed ? "active" : ""}`}
              onClick={() => handleConsentChange(item.id, true)}
            >
              동의
            </button>
            <button
              className={`consent-button ${!item.agreed ? "active" : ""}`}
              onClick={() => handleConsentChange(item.id, false)}
            >
              비동의
            </button>
          </div>
        </div>
      ))}

      <button className="next-button" onClick={handleSubmit}>
        회원가입 완료
      </button>
    </div>
  );
};

export default AdConsentPage;
