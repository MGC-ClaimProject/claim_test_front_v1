import React from "react";
import { useNavigate } from "react-router-dom";

const SignupCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>가입 완료</h1>
      <p>회원가입이 완료되었습니다!</p>
      <button onClick={() => navigate("/main")}>메인 페이지로 이동</button>
    </div>
  );
};

export default SignupCompletePage;
