import React from "react";
import "../styles/modals/signaturePad.css";
interface SignaturePadProps {
    title: string;
    name: string;
    onSave: (signature: string | null) => void;
}
declare const SignaturePad: React.FC<SignaturePadProps>;
export default SignaturePad;
