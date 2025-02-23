// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import "../styles/header.css";

interface HeaderProps {
  onMenuClick: () => void; // ✅ 햄버거 버튼 클릭 이벤트 전달
}

const notifications = [
  "📢 새로운 공지가 있습니다!",
  "🚀 업데이트: 새로운 기능이 추가되었습니다.",
  "⚠️ 서비스 점검 예정: 2025-02-15",
  "🎉 이벤트: 신규 가입자 특별 혜택!"
];

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [currentNotification, setCurrentNotification] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      {/* ✅ 왼쪽: 뒤로가기 버튼 */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      {/* ✅ 가운데: 공지사항 애니메이션 */}
      <div className="notification-container">
        <div className="notification-text">
          {notifications[currentNotification]}
        </div>
      </div>

      {/* ✅ 오른쪽: 햄버거 버튼 */}
      <button className="menu-button" onClick={onMenuClick}>
        <FaBars />
      </button>
    </header>
  );
};

export default Header;
