import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes";



const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  useEffect(() => {


    // ✅ '/'로 접근하면 무조건 '/login'으로 이동
    if (location.pathname === "/") {

      navigate("/login", { replace: true });
      return;
    }

    // ✅ "/main"으로 시작하는 경로로 직접 접근 시, 토큰이 없으면 '/login'으로 이동
    if (location.pathname.startsWith("/main") && !token) {
      console.log("❌ 액세스 토큰 없음! /main 접근 불가. 이동 경로: /login");
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate, token]);

  return <AppRoutes />;
};

export default AppWrapper;
