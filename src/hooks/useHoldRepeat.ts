import { useCallback, useEffect, useRef } from "react";

interface UseHoldRepeatOptions {
  delayMs?: number;
  intervalMs?: number;
  onStep: () => void;
  onEnd?: () => void;
}

export function useHoldRepeat({ delayMs = 400, intervalMs = 80, onStep, onEnd }: UseHoldRepeatOptions) {
  const onStepRef = useRef(onStep);
  const onEndRef = useRef(onEnd);
  const delayTimerRef = useRef<number | null>(null);
  const intervalTimerRef = useRef<number | null>(null);

  onStepRef.current = onStep;
  onEndRef.current = onEnd;

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current !== null) {
      window.clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (intervalTimerRef.current !== null) {
      window.clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      clearTimers();
      onStepRef.current();
      delayTimerRef.current = window.setTimeout(() => {
        intervalTimerRef.current = window.setInterval(() => onStepRef.current(), intervalMs);
      }, delayMs);
    },
    [clearTimers, delayMs, intervalMs],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      clearTimers();
      onEndRef.current?.();
    },
    [clearTimers],
  );

  return { handlePointerDown, handlePointerUp };
}
