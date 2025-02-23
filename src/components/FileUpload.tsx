import React, { useState } from "react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const filesArray = Array.from(event.target.files);
    onFilesSelected(filesArray);

    const previews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        <input type="file" accept="image/*, application/pdf" multiple onChange={handleFileChange} />
        📁 파일 선택
      </label>

      {previewUrls.length > 0 && (
        <div className="preview-container">
          {previewUrls.map((url, index) => (
            <img key={index} src={url} alt={`preview-${index}`} className="preview-image" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
