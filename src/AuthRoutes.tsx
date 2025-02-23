import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import Signup from "./pages/auth/Signup.tsx";
import AdConsentPage from "./pages/auth/AdConsentPage";
import SignupCompletePage from "./pages/auth/SignupCompletePage.tsx";

const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/ad-consent" element={<AdConsentPage />} />
      <Route path="/complete" element={<SignupCompletePage />} />
    </Routes>
  );
};

export default AuthRoutes;
