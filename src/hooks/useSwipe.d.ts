import { RefObject } from "react";
export declare const useSwipe: (contentRef: RefObject<HTMLDivElement>) => {
    bind: (...args: any[]) => import("@use-gesture/react/dist/declarations/src/types").ReactDOMAttributes;
    offset: number;
    setOffset: import("react").Dispatch<import("react").SetStateAction<number>>;
};
