import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";
import { useAuthStore } from "../../stores/useAuthStore.tsx";

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyPageModal: React.FC<MyPageModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout); // ✅ Zustand에서 logout() 가져오기
  const user = useAuthStore((state) => state.user);

  // ✅ `user_name`을 저장할 상태 변수
  const [userName, setUserName] = useState<string>("고객");

  useEffect(() => {
    // ✅ 상태에 `user` 정보가 있으면 사용, 없으면 로컬 스토리지에서 불러오기
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const name = user?.user_name || storedUser?.user_name || "고객";
    setUserName(name);
  }, [user]); // ✅ `user` 값이 변경될 때마다 업데이트

  const slideIn = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(110%)",
    opacity: isOpen ? 1 : 0.8,
  });

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout(); // ✅ Zustand의 logout() 실행 (clearAuth 포함됨)
    navigate("/login"); // ✅ 로그인 페이지로 이동
  };

  return (
    <>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <animated.div className="mypage-panel" style={slideIn}>
        <button className="close-button" onClick={onClose}>✖</button>
        <div className="mypage-title">{userName} 님</div> {/* ✅ 고객 이름 표시 */}
        <ul className="mypage-menu">
          <li onClick={() => navigate("/main/profile")}>내 정보</li>
          <li onClick={() => navigate("/main/claims")}>청구 내역</li>
          <li onClick={() => navigate("/main/family")}>나의 가족</li>
          <li onClick={handleLogout}>로그아웃</li> {/* ✅ logout() 직접 호출 */}
        </ul>
      </animated.div>
    </>
  );
};

export default MyPageModal;
