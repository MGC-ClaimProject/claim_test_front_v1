import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore"; // ✅ Zustand 사용
import useClaimNavigation from "../../hooks/useClaimNavigation"; // ✅ 공통 훅 사용
import { BANK_CHOICES } from "../../constants/choices";
import "../../styles/pages/claim/claimBankSelectionPage.css";

const ClaimBankSelectionPage: React.FC = () => {
  const { claimData } = useAuthStore(); // ✅ Zustand에서 전역 상태 가져오기
  const { handleNext } = useClaimNavigation(); // ✅ 공통 함수 사용

  // ✅ Hook은 항상 동일한 순서로 호출되어야 함
  const [selectedBank, setSelectedBank] = useState<string>(claimData?.bank || "");
  const [accountNumber, setAccountNumber] = useState<string>(claimData?.account || "");
  const [isSameAccount, setIsSameAccount] = useState<boolean>(claimData?.isSameAsPayoutAccount || false);

  // ✅ `claimData`가 없을 경우 메인 페이지로 이동 (useEffect 사용)
  useEffect(() => {
    if (!claimData) {
      alert("이전 단계 정보를 찾을 수 없습니다. 다시 진행해주세요.");
      handleNext({}, "/main/claim"); // ✅ 메인 페이지로 이동
    }
  }, [claimData, handleNext]);

  const isFormValid = isSameAccount || (selectedBank && accountNumber.trim()); // ✅ 체크박스 또는 입력값 확인

  // ✅ 숫자만 입력 가능하도록 처리
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // ✅ 숫자가 아닌 값 제거
    setAccountNumber(numericValue);
  };

  // ✅ 저장 후 확인 페이지로 이동
  const handleSubmit = () => {
    if (!isFormValid) {
      alert("은행을 선택하거나 출금 계좌와 동일 여부를 체크해주세요.");
      return;
    }

    // ✅ 기존 데이터에 계좌 정보 추가
    const updatedClaimData = {
      ...claimData,
      bank: isSameAccount ? "출금계좌와 동일" : selectedBank,
      account: isSameAccount ? "출금계좌와 동일" : accountNumber,
      isSameAsPayoutAccount: isSameAccount,
    };


    // ✅ 공통 `handleNext` 사용하여 상태 저장 및 페이지 이동
    handleNext(updatedClaimData, "/main/claim/confirmation");
  };

  return (
    <div className="bank-selection-container">
      <h2>🏦 지급받을 계좌 입력</h2>

      {/* ✅ 출금 계좌 동일 체크박스 */}
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="sameAccount"
          checked={isSameAccount}
          onChange={() => {
            setIsSameAccount((prev) => !prev);
            if (!isSameAccount) {
              setSelectedBank(""); // ✅ 체크하면 은행 선택 초기화
              setAccountNumber(""); // ✅ 체크하면 계좌번호 초기화
            }
          }}
        />
        <label htmlFor="sameAccount">출금 계좌번호와 동일</label>
      </div>

      {/* ✅ 계좌 정보 입력 필드 */}
      <div className={`account-box ${isSameAccount ? "disabled" : ""}`}>
        {/* ✅ 은행 선택 */}
        <div className="input-group">
          <label>은행 선택</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            disabled={isSameAccount} // ✅ 체크 시 비활성화
          >
            <option value="">은행명</option>
            {Object.entries(BANK_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ 계좌번호 입력 (숫자만 허용) */}
        <div className="input-group">
          <label>계좌번호</label>
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange} // ✅ 숫자만 입력 가능하도록 변경
            placeholder="계좌번호를 입력하세요"
            disabled={isSameAccount} // ✅ 체크 시 비활성화
          />
        </div>
      </div>

      {/* ✅ 저장 버튼 */}
      <button className={`submit-btn ${isFormValid ? "active" : "disabled"}`} onClick={handleSubmit} disabled={!isFormValid}>
        저장하기
      </button>
    </div>
  );
};

export default ClaimBankSelectionPage;
