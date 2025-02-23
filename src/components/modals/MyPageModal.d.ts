import React from "react";
interface MyPageModalProps {
    isOpen: boolean;
    onClose: () => void;
}
declare const MyPageModal: React.FC<MyPageModalProps>;
export default MyPageModal;
