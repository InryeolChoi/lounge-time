/** 휴식 기준 시간(초). 3분. */
export const REST_DURATION_SECONDS = 180;

/**
 * 경과 시간(초)을 0~100 정수 진행도로 변환한다.
 */
export function computeProgress(
  elapsedSeconds: number,
  duration: number = REST_DURATION_SECONDS
): number {
  if (duration <= 0) {
    return 0;
  }
  const ratio = (elapsedSeconds / duration) * 100;
  return Math.min(100, Math.max(0, Math.floor(ratio)));
}

/**
 * 초를 "M:SS" 형식 문자열로 포맷한다(음수는 0 으로 보정).
 */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * 남은 시간(초)을 올림하여 계산한다(카운트다운 표시용).
 */
export function computeRemaining(
  elapsedSeconds: number,
  duration: number = REST_DURATION_SECONDS
): number {
  return Math.max(0, Math.ceil(duration - elapsedSeconds));
}
