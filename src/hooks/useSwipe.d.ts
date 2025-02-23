import { RefObject } from "react";
export declare const useSwipe: (contentRef: RefObject<HTMLDivElement>, onToggleMyPage: (isOpen: boolean) => void) => {
    bind: (...args: any[]) => import("@use-gesture/react/dist/declarations/src/types").ReactDOMAttributes;
    offset: number;
    setOffset: import("react").Dispatch<import("react").SetStateAction<number>>;
};
