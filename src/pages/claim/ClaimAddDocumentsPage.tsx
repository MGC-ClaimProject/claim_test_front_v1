import React, { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore"; // ✅ Zustand에서 claimId 가져오기
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import FileUpload from "../../components/FileUpload";
import "../../styles/pages/claim/claimAddDocumentsPage.css";

const ClaimAddDocumentsPage: React.FC = () => {
  const { claimData } = useAuthStore(); // ✅ Zustand에서 상태 가져오기
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ claimId가 없을 경우 메인 페이지로 리디렉션
  if (!claimData?.claimId) {
    alert("이전 단계 정보를 찾을 수 없습니다.");
    navigate("/main/claim");
    return null;
  }

  const claimId = claimData.claimId ?? ""; // ✅ claimId가 undefined이면 빈 문자열로 설정 (TypeScript 오류 방지)

  const handleUpload = async () => {
    if (!claimId) {
      alert("청구 ID가 없습니다. 다시 시도해주세요.");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("📁 업로드할 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("claim", claimId.toString()); // ✅ claimId를 문자열로 변환하여 추가

    selectedFiles.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await auth.post(`/claims/${claimId}/documents/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("✅ 문서가 성공적으로 업로드되었습니다!");
        navigate(`/main/claims/detail`);
      } else {
        throw new Error("문서 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 문서 업로드 실패:", error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
      setSelectedFiles([]); // ✅ 업로드 후 선택된 파일 초기화
    }
  };

  return (
    <div className="document-upload-container">
      <h2>📎 추가 서류 업로드</h2>

      {/* ✅ 파일 업로드 */}
      <FileUpload onFilesSelected={setSelectedFiles} />

      {/* ✅ 업로드 버튼 */}
      <button className="upload-btn" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "업로드 중..." : "문서 제출"}
      </button>
    </div>
  );
};

export default ClaimAddDocumentsPage;
