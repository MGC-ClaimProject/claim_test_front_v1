import React from "react";
import ProfileCard from "../components/cards/ProfileCard.tsx";
import InsuranceButton from "../components/buttons/InsuranceButton.tsx";
import ClaimsListButton from "../components/buttons/ClaimsListButton.tsx";
import FamilyButton from "../components/buttons/FamilyButton.tsx";
import "../styles/pages/profilePage.css";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-container">
      <ProfileCard /> {/* ✅ member를 props로 전달할 필요 없음 */}

      <div className="profile-links">
        <InsuranceButton />
        <ClaimsListButton />
        <FamilyButton />
      </div>
    </div>
  );
};

export default ProfilePage;
