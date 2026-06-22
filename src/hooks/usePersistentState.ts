import { useCallback, useEffect, useState } from 'react';

/**
 * localStorage 에 동기화되는 상태 훅.
 *
 * - 초기값은 저장된 값이 있으면 그것을, 없으면 `initialValue` 를 사용한다.
 * - 값이 바뀌면 자동으로 저장한다(직렬화 실패는 조용히 무시).
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch {
      /* 파싱 실패 시 기본값 사용 */
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 저장 실패는 무시 */
    }
  }, [key, value]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue(next);
    },
    []
  );

  return [value, update];
}
