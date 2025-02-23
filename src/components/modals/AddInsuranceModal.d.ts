import React from "react";
import "../../styles/modals/addInsuranceModal.css";
interface AddInsuranceModalProps {
    memberId?: number;
    onClose: () => void;
    onInsuranceAdded: () => void;
}
declare const AddInsuranceModal: React.FC<AddInsuranceModalProps>;
export default AddInsuranceModal;
