import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../../api/axiosInstance.tsx";
import { Member } from "../../stores/useAuthStore.tsx";
import "../../styles/cards/profileCard.css";
import { RELATION_CHOICES, GENDER_CHOICES } from "../../constants/choices.ts";

const ProfileCard: React.FC<{
  member?: Member;
  setFormData?: (data: Member) => void;
  onSave?: () => void;
  hideRelation?: boolean;
}> = ({ setFormData, onSave, hideRelation = false }) => {
  const location = useLocation();
  const memberId =
    location.state?.memberId ||
    JSON.parse(localStorage.getItem("user") || "null")?.member_id;

  const [tempData, setTempData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  useEffect(() => {
    if (!memberId) {
      console.error("❌ memberId를 찾을 수 없습니다.");
      return;
    }

    const fetchMemberDetail = async () => {
      try {
        const response = await auth.get(`/members/${memberId}/`);
        setTempData(response.data);
      } catch (error) {
        console.error(`❌ 멤버 정보(${memberId}) 가져오기 실패:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId]);

  if (loading) return <p>🔄 멤버 정보를 불러오는 중...</p>;
  if (!tempData) return <p>❌ 멤버 정보를 불러올 수 없습니다.</p>;

  // 전화번호 포맷 적용 함수
  function formatPhoneNumber(value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }

  // 입력 변경 감지
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev!,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  };

  // 수정된 데이터 저장
  const handleSave = async () => {
    if (!tempData) return;
    try {
      const requestData = {
        ...tempData,
        phone: tempData.phone.replace(/-/g, ""),
      };
      const response = await auth.patch(`/members/${tempData.id}/`, requestData);
      const updatedMember = response.data;

      if (setFormData) setFormData(updatedMember);
      setTempData(updatedMember);
      alert("✅ 정보가 성공적으로 저장되었습니다.");
      onSave?.();
      setIsEditing(false);
    } catch (error) {
      console.error("❌ 정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="profile-title">{tempData.name || "고객"}님의 정보</h2>
        {isEditing && (
          <button className="cancel-btn" onClick={handleCancel}>
            ❌
          </button>
        )}
      </div>

      <div className="profile-info">
        <label>📝 이름</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={tempData.name}
            onChange={handleInputChange}
          />
        ) : (
          <span>{tempData.name}</span>
        )}
      </div>

      <div className="profile-info">
        <label>📞 연락처</label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={tempData.phone}
            onChange={handleInputChange}
          />
        ) : (
          <span>{formatPhoneNumber(tempData.phone)}</span>
        )}
      </div>

      <div className="profile-info">
        <label>🎂 생년월일</label>
        {isEditing ? (
          <input
            type="date"
            name="birth"
            value={tempData.birth}
            onChange={handleInputChange}
          />
        ) : (
          <span>{tempData.birth}</span>
        )}
      </div>

      <div className="profile-info">
        <label>🚻 성별</label>
        {isEditing ? (
          <select
            name="gender"
            value={tempData.gender}
            onChange={handleInputChange}
          >
            {Object.entries(GENDER_CHOICES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <span>{GENDER_CHOICES[tempData.gender] || "-"}</span>
        )}
      </div>

      {!hideRelation && tempData.relation && tempData.relation !== "Self" && (
        <div className="profile-info">
          <label>🔗 관계</label>
          {isEditing ? (
            <select
              name="relation"
              value={tempData.relation || "기타"}
              onChange={handleInputChange}
            >
              {Object.entries(RELATION_CHOICES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ) : (
            <span>{RELATION_CHOICES[tempData.relation] || "기타"}</span>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="button-group">
          <button className="profile-save-btn" onClick={handleSave}>
            ✅ 저장하기
          </button>
        </div>
      ) : (
        <button
          className="profile-edit-btn"
          onClick={() => setIsEditing(true)}
        >
          ✏️ 수정하기
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
