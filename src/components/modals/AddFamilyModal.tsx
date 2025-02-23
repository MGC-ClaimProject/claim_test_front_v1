import React, { useState } from "react";
import { auth } from "../../api/axiosInstance.tsx";
import "../../styles/modals/addFamilyModal.css"; // ✅ 모달 스타일 적용
import { RELATION_CHOICES, GENDER_CHOICES } from "../../constants/choices.ts"; // ✅ 관계 및 성별 선택지 추가

interface AddFamilyModalProps {
  onClose: () => void; // ✅ 모달 닫기 함수
}

const AddFamilyModal: React.FC<AddFamilyModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birth: "",
    gender: "Male",
    relation: Object.keys(RELATION_CHOICES)[0], // ✅ 기본값 설정 (첫 번째 관계 선택)
  });

  // ✅ 전화번호 입력값 자동 포맷팅 (010-xxxx-xxxx)
  const formatPhoneNumber = (value: string) => {
    // 숫자만 남기기
    value = value.replace(/\D/g, "");

    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  };

  // ✅ 입력 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({ ...formData, phone: formatPhoneNumber(value) }); // ✅ 전화번호 포맷 적용
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ 가족 추가 API 요청
  const handleAddFamily = async () => {
    try {
      const requestData = {
        name: formData.name,
        phone: formData.phone.replace(/-/g, ""), // ✅ '-' 제거 후 전송
        birth: formData.birth,
        gender: formData.gender,
        relation: formData.relation,
      };

      const response = await auth.post("/members/", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(`${response.data.member.name}님이 가족 목록에 추가되었습니다!`);

      onClose(); // ✅ 모달 닫기
      window.location.reload(); // ✅ 페이지 새로고침 (가족 리스트 갱신)
    } catch (error) {
      console.error("❌ 가족 추가 실패:", error);
      alert("가족 추가에 실패했습니다.");
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>👨‍👩‍👧 가족 추가</h3>
        <input type="text" name="name" placeholder="이름" onChange={handleChange} required />

        {/* ✅ 전화번호 입력 (자동 포맷 적용) */}
        <input
          type="text"
          name="phone"
          placeholder="전화번호 (010-xxxx-xxxx)"
          value={formData.phone}
          onChange={handleChange}
          maxLength={13} // ✅ 최대 13자 (010-0000-0000)
          required
        />

        <input type="date" name="birth" onChange={handleChange} required />

        {/* ✅ 성별 선택 */}
        <select name="gender" onChange={handleChange} value={formData.gender}>
          {Object.entries(GENDER_CHOICES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* ✅ 관계 선택 */}
        <select name="relation" onChange={handleChange} value={formData.relation}>
          {Object.entries(RELATION_CHOICES)
            .filter(([key]) => key !== "Self") // ✅ 본인(Self)은 선택지에서 제외
            .map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>취소</button>
          <button className="confirm-btn" onClick={handleAddFamily}>추가하기</button>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyModal;
