import React from "react";
interface FilePreviewProps {
    documents: {
        id: number;
        url: string;
    }[];
}
declare const FilePreview: React.FC<FilePreviewProps>;
export default FilePreview;
