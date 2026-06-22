import { useCallback, useEffect, useRef, useState } from 'react';
import {
  REST_DURATION_SECONDS,
  computeProgress,
  computeRemaining,
} from '../utils/time';

export { REST_DURATION_SECONDS };

/** 휴식 완료 후 자동 초기화까지의 대기 시간(ms). */
const RESET_DELAY_MS = 3500;

/** 갱신 주기(ms). 부드러운 진행 표시를 위해 1초보다 잘게 갱신한다. */
const TICK_MS = 200;

export interface RestTimer {
  /** 경과 시간(초, 소수 포함) */
  elapsed: number;
  /** 진행도(0~100, 정수) */
  progress: number;
  /** 남은 시간(초, 올림) */
  remaining: number;
  /** 휴식 진행 중 여부 */
  isRunning: boolean;
  /** 휴식 완료 여부(초기화 대기 구간) */
  isComplete: boolean;
  /** 시작/재개 */
  start: () => void;
  /** 일시정지 */
  pause: () => void;
  /** 시작↔일시정지 토글 */
  toggle: () => void;
  /** 처음으로 초기화 */
  reset: () => void;
}

/**
 * 클릭/탭/키보드로 시작·일시정지하는 3분 휴식 타이머.
 *
 * - 물리적으로 누르고 있을 필요 없이 **토글**로 동작한다.
 * - `performance.now()` 기반으로 경과 시간을 누적해 **드리프트가 없다**.
 * - progress 가 100 에 도달하면 `onComplete` 를 **정확히 1회** 호출하고,
 *   RESET_DELAY_MS 뒤 자동으로 초기화된다.
 */
export function useRestTimer(onComplete: () => void): RestTimer {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const accumulatedRef = useRef(0); // 일시정지 시점까지 누적된 초
  const startedAtRef = useRef(0); // 마지막 start 시각(performance.now)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    accumulatedRef.current = 0;
    completedRef.current = false;
    setElapsed(0);
    setIsRunning(false);
    setIsComplete(false);
  }, [clearTimer]);

  const pause = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    accumulatedRef.current = Math.min(
      REST_DURATION_SECONDS,
      accumulatedRef.current + (performance.now() - startedAtRef.current) / 1000
    );
    clearTimer();
    setElapsed(accumulatedRef.current);
    setIsRunning(false);
  }, [clearTimer]);

  const tick = useCallback(() => {
    const seconds = Math.min(
      REST_DURATION_SECONDS,
      accumulatedRef.current + (performance.now() - startedAtRef.current) / 1000
    );
    setElapsed(seconds);

    if (seconds >= REST_DURATION_SECONDS && !completedRef.current) {
      completedRef.current = true;
      accumulatedRef.current = REST_DURATION_SECONDS;
      clearTimer();
      setIsRunning(false);
      setIsComplete(true);
      onCompleteRef.current();
      window.setTimeout(reset, RESET_DELAY_MS);
    }
  }, [clearTimer, reset]);

  const start = useCallback(() => {
    if (completedRef.current || intervalRef.current !== null) {
      return;
    }
    startedAtRef.current = performance.now();
    intervalRef.current = setInterval(tick, TICK_MS);
    setIsRunning(true);
  }, [tick]);

  const toggle = useCallback(() => {
    if (isComplete) {
      return;
    }
    if (intervalRef.current !== null) {
      pause();
    } else {
      start();
    }
  }, [isComplete, pause, start]);

  // 언마운트 시 정리
  useEffect(() => clearTimer, [clearTimer]);

  return {
    elapsed,
    progress: computeProgress(elapsed),
    remaining: computeRemaining(elapsed),
    isRunning,
    isComplete,
    start,
    pause,
    toggle,
    reset,
  };
}
