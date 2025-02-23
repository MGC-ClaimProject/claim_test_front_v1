import React, { useEffect } from "react";
import Tiff from "tiff.js";

interface FilePreviewProps {
  documents: { id: number; url: string }[];
}

const FilePreview: React.FC<FilePreviewProps> = ({ documents }) => {
  useEffect(() => {
    const renderAllTIFFs = async () => {
      await Promise.all(
        documents.map(async ({ id, url }) => {
          if (/\.tiff$|\.tif$/i.test(url)) {
            setTimeout(() => renderTIFF(url, `tiff-preview-${id}`), 500);
          }
        })
      );
    };
    renderAllTIFFs();
  }, [documents]);

  const renderTIFF = async (url: string, canvasId: string) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const tiff = new Tiff({ buffer });

      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const image = tiff.toCanvas();
        canvas.width = image.width;
        canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
      }
    } catch (error) {
      console.error("❌ TIFF 미리보기 실패:", error);
    }
  };

  return (
    <div className="existing-docs-container">
      <h3>📂 기존 서류</h3>
      <div className="preview-container">
        {documents.map(({ id, url }) => {
          const isTIFF = /\.tiff$|\.tif$/i.test(url);
          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
          const isPDF = /\.pdf$/i.test(url);

          return (
            <div key={id} className="document-item">
              {isImage ? (
                <img src={url} alt={`document-${id}`} className="preview-image" />
              ) : isPDF ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  📄 PDF 다운로드
                </a>
              ) : isTIFF ? (
                <canvas id={`tiff-preview-${id}`} style={{ border: "1px solid #ccc" }} />
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  📄 문서 다운로드
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilePreview;
