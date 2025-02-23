import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GlobalLayout from "./layouts/GlobalLayout";
import MainPage from "./pages/MainPage";
import SearchInsuranceMembers from "./pages/insurance/SearchInsuranceMembers";
import InsuranceListPage from "./pages/insurance/InsuranceListPage";
import InsuranceDetailPage from "./pages/insurance/InsuranceDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ClaimCreatePage from "./pages/claim/ClaimCreatePage";
import ClaimSelectInsurancePage from "./pages/claim/ClaimSelectInsurancePage";
import ClaimSymptomsPage from "./pages/claim/ClaimSymptomsPage";
import ClaimSignaturePage from "./pages/claim/ClaimSignaturePage";
import ClaimBankSelectionPage from "./pages/claim/ClaimBankSelectionPage";
import ClaimConfirmationPage from "./pages/claim/ClaimConfirmationPage";
import ClaimAddDocumentsPage from "./pages/claim/ClaimAddDocumentsPage";
import ClaimsListPage from "./pages/claim/ClaimsListPage";
import ClaimDetailPage from "./pages/claim/ClaimDetailPage";
import FamilyListPage from "./pages/family/FamilyListPage";
import FamilyDetailPage from "./pages/family/FamilyDetailPage";
import AuthRoutes from "./AuthRoutes";

const AppRoutes: React.FC = () => {
  const token = localStorage.getItem("access_token"); // ✅ 로컬스토리지에서 직접 액세스 토큰 확인

  return (
    <Routes>
      {/* ✅ 첫 진입 시 무조건 로그인 페이지로 이동 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ✅ 로그인 및 회원가입 경로는 비로그인 사용자 접근 가능 */}
      <Route path="/*" element={<AuthRoutes />} />

      {/* ✅ 로그인된 사용자만 접근 가능한 보호된 경로 */}
      {token ? (
        <Route path="/main/*" element={<GlobalLayout />}>
          <Route index element={<MainPage />} />
          <Route path="search-insurance-members" element={<SearchInsuranceMembers />} />
          <Route path="insurances/detail" element={<InsuranceDetailPage />} />
          <Route path="insurances" element={<InsuranceListPage />} />
          <Route path="claim" element={<ClaimCreatePage />} />
          <Route path="select-insurance" element={<ClaimSelectInsurancePage />} />
          <Route path="claim/symptoms" element={<ClaimSymptomsPage />} />
          <Route path="claim/signature" element={<ClaimSignaturePage />} />
          <Route path="claim/account" element={<ClaimBankSelectionPage />} />
          <Route path="claim/confirmation" element={<ClaimConfirmationPage />} />
          <Route path="claim/add-documents" element={<ClaimAddDocumentsPage />} />
          <Route path="claims/" element={<ClaimsListPage />} />
          <Route path=":memberId/claims" element={<ClaimsListPage />} />
          <Route path="claims/detail" element={<ClaimDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="family" element={<FamilyListPage />} />
          <Route path="family/detail" element={<FamilyDetailPage />} />
        </Route>
      ) : (
        // ✅ 로그인되지 않은 사용자는 모든 경로에서 /login으로 리디렉트
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
