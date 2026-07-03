import { useEffect } from "react";
import type { RefObject } from "react";

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  onIntersect: () => void,
  enabled: boolean,
): void {
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { rootMargin: "240px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, onIntersect, ref]);
}
