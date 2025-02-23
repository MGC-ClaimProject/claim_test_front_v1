import React from "react";
import { Member } from "../../stores/useAuthStore.tsx";
import "../../styles/cards/profileCard.css";
declare const ProfileCard: React.FC<{
    member?: Member;
    setFormData?: (data: Member) => void;
    onSave?: () => void;
    hideRelation?: boolean;
}>;
export default ProfileCard;
