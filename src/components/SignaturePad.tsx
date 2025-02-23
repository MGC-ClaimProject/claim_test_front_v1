import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import "../styles/modals/signaturePad.css";

interface SignaturePadProps {
  title: string;
  name: string;
  onSave: (signature: string | null) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ title, name, onSave }) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (signatureRef.current) {
      drawPlaceholder(); // ✅ 컴포넌트가 마운트되면 플레이스홀더 표시
    }
  }, []);

  // ✅ 캔버스에 플레이스홀더(안내문) 그리기
  const drawPlaceholder = () => {
    const canvas = signatureRef.current?.getCanvas();
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 기존 내용 지우기
        ctx.font = "16px Arial";
        ctx.fillStyle = "#aaa";
        ctx.textAlign = "center";
        ctx.fillText("이곳에 서명해주세요", canvas.width / 2, canvas.height / 2);
      }
    }
  };

  // ✅ 서명 초기화 (다시 서명 가능하도록 활성화)
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsLocked(false);
      setIsSigned(false);
      setIsSaved(false);
      drawPlaceholder(); // ✅ 초기화하면 플레이스홀더 다시 표시
      onSave(null);
    }
  };

  // ✅ 서명 시작 감지 (플레이스홀더 숨기기)
  const handleBegin = () => {
    setIsSigned(true);
    setIsSaved(false);
    const canvas = signatureRef.current?.getCanvas();
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 플레이스홀더 지우기
      }
    }
  };

  // ✅ 서명 저장 (서명 완료 후 패드 비활성화)
  const handleSave = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      onSave(signatureRef.current.toDataURL());
      setIsLocked(true);
      setIsSaved(true);
    } else {
      alert("서명을 입력해주세요.");
    }
  };

  return (
    <div className="signature-section">
      <div className="signature-header">
        <span>{title}</span>
        <span className="signature-name">{name}</span>
      </div>

      {/* ✅ 서명 입력란 */}
      <div className="signature-wrapper">
        <SignatureCanvas
          ref={(el) => (signatureRef.current = el)}
          penColor="black"
          canvasProps={{
            width: 350,
            height: 150,
            className: `signature-canvas ${isLocked ? "disabled" : ""}`,
          }}
          onBegin={handleBegin} // ✅ 서명 시작 감지
        />
        {isLocked && <div className="signature-overlay">서명 완료</div>}
      </div>

      {/* ✅ 초기화 & 저장 버튼 */}
      <div className="button-group">
        <button
          className={`clear-btn ${isSigned ? "active" : "disabled"}`}
          onClick={clearSignature}
          disabled={!isSigned}
        >
          초기화
        </button>
        <button
          className={`submit-btn ${isSaved ? "saved" : isSigned && !isLocked ? "active" : "disabled"}`}
          onClick={handleSave}
          disabled={!isSigned || isLocked}
        >
          {isSaved ? "✔ 저장됨" : "저장"}
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
