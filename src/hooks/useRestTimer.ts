import { useEffect, useRef, useState } from 'react';

/** 휴식 기준 시간(초). 3분. */
export const REST_DURATION_SECONDS = 180;

/** 휴식 완료 후 초기화까지의 대기 시간(ms). */
const RESET_DELAY_MS = 3000;

export interface RestTimer {
  /** 경과 시간(초) */
  elapsed: number;
  /** 진행도(0~100, 정수) */
  progress: number;
  /** 휴식(아이스크림 누름) 진행 중 여부 */
  isResting: boolean;
  /** 휴식 완료 여부(초기화 대기 구간) */
  isComplete: boolean;
  /** 휴식 시작(누름) */
  start: () => void;
  /** 휴식 일시정지(뗌) */
  pause: () => void;
}

/**
 * "누르고 있는 동안에만 실시간으로 흐르는" 3분 휴식 타이머.
 *
 * - `start()`(누름)와 `pause()`(뗌)로 진행/정지를 제어한다.
 * - progress 가 100 에 도달하면 `onComplete` 를 **정확히 1회** 호출한다.
 * - 완료 후 RESET_DELAY_MS 뒤 자동으로 0 으로 초기화된다.
 */
export function useRestTimer(onComplete: () => void): RestTimer {
  const [elapsed, setElapsed] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // 최신 onComplete 를 참조해 effect 재실행을 방지한다.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const progress = Math.min(
    100,
    Math.floor((elapsed / REST_DURATION_SECONDS) * 100)
  );

  // 누르고 있는 동안에만 1초씩 진행
  useEffect(() => {
    if (!isResting || elapsed >= REST_DURATION_SECONDS) {
      return;
    }
    const id = setInterval(() => {
      setElapsed((prev) => Math.min(REST_DURATION_SECONDS, prev + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isResting, elapsed]);

  // 완료 처리: 100% 도달 시 1회만
  useEffect(() => {
    if (elapsed < REST_DURATION_SECONDS || isComplete) {
      return;
    }
    setIsComplete(true);
    setIsResting(false);
    onCompleteRef.current();
    const timeout = setTimeout(() => {
      setElapsed(0);
      setIsComplete(false);
    }, RESET_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [elapsed, isComplete]);

  return {
    elapsed,
    progress,
    isResting,
    isComplete,
    start: () => {
      if (!isComplete) {
        setIsResting(true);
      }
    },
    pause: () => setIsResting(false),
  };
}
