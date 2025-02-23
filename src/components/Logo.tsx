import React from "react";
import logoImage from "../assets/claim_logo.png"; // 로고 이미지 추가

const Logo: React.FC = () => {
  return <img src={logoImage} alt="보험청구 서비스 로고" className="logo" />;
};

export default Logo;
