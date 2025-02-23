import React from "react";
interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
}
declare const FileUpload: React.FC<FileUploadProps>;
export default FileUpload;
