import { useDrag } from "@use-gesture/react";
import { useState, useEffect, RefObject } from "react";

export const useSwipe = (
  contentRef: RefObject<HTMLDivElement>,
  onToggleMyPage: (isOpen: boolean) => void
) => {
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const SWIPE_THRESHOLD = 40; // ✅ 스와이프 감지 최소 거리 (모바일 최적화)
  const DAMPING_FACTOR = 0.35; // ✅ 손가락 이동 감속 비율 (적절한 반응성 유지)

  // ✅ maxOffset 동적 업데이트 (콘텐츠 크기 변화 감지)
  useEffect(() => {
    if (!contentRef.current) return;

    const updateMaxOffset = () => {
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      const viewportHeight = window.innerHeight;
      const usableHeight = viewportHeight - (14 * viewportHeight) / 100; // ✅ 14vh 고려
      setMaxOffset(contentHeight - usableHeight);
    };

    updateMaxOffset();

    // ✅ ResizeObserver 추가 (콘텐츠 크기 변경 감지)
    const resizeObserver = new ResizeObserver(updateMaxOffset);
    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [contentRef]);

  // ✅ 페이지 변경 시 스크롤 초기화
  useEffect(() => {
    setOffset(0);
    if (contentRef.current) {
      contentRef.current.style.transform = "translateY(0px)";
    }
  }, [contentRef]);

  // ✅ 스와이프 감지 (위아래 + 좌우)
  const bind = useDrag(
    ({ movement: [mx, my], last, axis }) => {
      if (!contentRef.current) return;

      // ✅ 좌우 스와이프 감지 (마이페이지 토글)
      if (axis === "x" && Math.abs(mx) > Math.abs(my)) {
        if (mx < -SWIPE_THRESHOLD) onToggleMyPage(true);
        if (mx > SWIPE_THRESHOLD) onToggleMyPage(false);
      }

      // ✅ 위아래 스와이프 감지 (스크롤 이동)
      if (axis === "y" && Math.abs(my) > Math.abs(mx)) {
        setOffset((prev) => {
          let newOffset = prev + my * DAMPING_FACTOR;
          newOffset = Math.max(-maxOffset, Math.min(0, newOffset));
          return newOffset;
        });

        // ✅ 스와이프 종료 시 애니메이션 적용
        if (last) {
          requestAnimationFrame(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = "transform 0.3s ease-out"; // ✅ 부드러운 스크롤 효과
              contentRef.current.style.transform = `translateY(${offset}px)`;
            }
          });
        }
      }
    },
    { axis: "lock" }
  );

  return { bind, offset, setOffset };
};
