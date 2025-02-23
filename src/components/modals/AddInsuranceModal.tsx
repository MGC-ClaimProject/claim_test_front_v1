import React, { useState } from "react";
import { auth } from "../../api/axiosInstance.tsx";
import { INSURANCE_TYPE_CHOICES, INSURANCE_COMPANIES } from "../../constants/choices.ts";
import "../../styles/modals/addInsuranceModal.css";

interface AddInsuranceModalProps {
  memberId?: number;
  onClose: () => void;
  onInsuranceAdded: () => void; // ✅ 보험 추가 후 리스트 갱신
}

const AddInsuranceModal: React.FC<AddInsuranceModalProps> = ({ memberId, onClose, onInsuranceAdded }) => {
  const [formData, setFormData] = useState({
    company: "",
    type: "",
    policy_name: "",
    premium: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.type || !formData.policy_name || !formData.premium ) {
      alert("모든 필수 필드를 입력해주세요.");
      return;
    }

    try {
      await auth.post(`/insurances/${memberId}/`, {
        ...formData,
        premium: parseFloat(formData.premium),
         // ✅ 해당 멤버의 보험으로 저장
      });

      onInsuranceAdded(); // ✅ 추가 후 리스트 갱신
      onClose(); // ✅ 모달 닫기
    } catch (error) {
      console.error("❌ 보험 추가 실패:", error);
      alert("보험 추가에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>📝 보험 추가</h2>
        <form onSubmit={handleSubmit}>
          {/* ✅ 보험 종류 선택 */}
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">보험 종류 선택</option>
            {INSURANCE_TYPE_CHOICES &&
              Object.entries(INSURANCE_TYPE_CHOICES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
          </select>

          {/* ✅ 보험사 선택 */}
          <select name="company" value={formData.company} onChange={handleChange} required>
            <option value="">보험사 선택</option>
            {INSURANCE_COMPANIES &&
              Object.entries(INSURANCE_COMPANIES).map(([category, companies]) => (
                <optgroup key={category} label={category}>
                  {Object.entries(companies).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </optgroup>
              ))}
          </select>

          <input type="text" name="policy_name" placeholder="보험 이름" value={formData.policy_name} onChange={handleChange} required />
          <input type="number" name="premium" placeholder="월 보험료" value={formData.premium} onChange={handleChange} required />

          <div className="modal-buttons">
            <button type="submit" className="add-btn">추가하기</button>
            <button type="button" className="close-btn" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInsuranceModal;
