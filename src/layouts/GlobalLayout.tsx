import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MyPageModal from "../components/modals/MyPageModal.tsx";
import NavBar from "../components/Navbar"; // NavBar 임포트
import Header from "../components/Header";
import { useSwipe } from "../hooks/useSwipe";
import "../styles/global.css";

const GlobalLayout: React.FC = () => {
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { bind, offset, setOffset } = useSwipe(contentRef);

  // 페이지가 변경될 때 스크롤을 최상단으로 초기화
  useEffect(() => {
    setOffset(0);
    if (contentRef.current) {
      contentRef.current.style.transform = "translateY(0px)";
    }
  }, [location.pathname]);

  return (
    <div className="global-layout" {...bind()}>
      {/* 헤더 */}
      <Header onMenuClick={() => setIsMyPageOpen((prev) => !prev)} />

      {/* 페이지 콘텐츠 */}
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

      {/* 네비게이션 바 */}
      <NavBar />

      {/* 마이페이지 모달 */}
      <MyPageModal isOpen={isMyPageOpen} onClose={() => setIsMyPageOpen(false)} />
    </div>
  );
};

export default GlobalLayout;
