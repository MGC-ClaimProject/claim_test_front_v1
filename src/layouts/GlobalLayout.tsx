// src/layouts/GlobalLayout.tsx
import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MyPageModal from "../components/modals/MyPageModal.tsx";
import NavBar from "../components/Navbar";
import Header from "../components/Header";
import { useSwipe } from "../hooks/useSwipe"; // ✅ 스와이프 훅 불러오기
import "../styles/pages/main.css";

const GlobalLayout: React.FC = () => {
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // ✅ 현재 경로 감지

  const { bind, offset, setOffset } = useSwipe(contentRef, setIsMyPageOpen);

  // ✅ 페이지가 변경될 때 스크롤을 최상단으로 초기화
  useEffect(() => {
    setOffset(0);
    if (contentRef.current) {
      contentRef.current.style.transform = "translateY(0px)";
    }
  }, [location.pathname]); // 🔹 URL이 변경될 때 실행

  return (
    <div className="global-layout" {...bind()}>
      {/* ✅ 헤더 */}
      <Header onMenuClick={() => setIsMyPageOpen((prev) => !prev)} />

      {/* ✅ 페이지 콘텐츠 */}
      <div
        className="content"
        ref={contentRef}
        style={{
          transform: `translateY(${offset}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Outlet />
      </div>

      {/* ✅ 네비게이션 바 */}
      <NavBar onUserClick={() => setIsMyPageOpen((prev) => !prev)} />

      {/* ✅ 마이페이지 모달 */}
      <MyPageModal isOpen={isMyPageOpen} onClose={() => setIsMyPageOpen(false)} />
    </div>
  );
};

export default GlobalLayout;
