import type { Message } from '../types';

/**
 * 백엔드 API 통신 계층.
 *
 * Spring Boot 백엔드(`/api`)를 우선 사용하고, 백엔드가 없거나 실패하면
 * 브라우저 localStorage 로 폴백하여 정적 호스팅 환경에서도 단독 동작한다.
 */

const API_BASE: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

const LS_MESSAGES = 'loungeTimeMessages';
const LS_REST_COUNT = 'loungeTimeRestCount';

const SEED_MESSAGES: Message[] = [
  { id: 's1', user: 'User_A92', text: '아, 휴식이 정말 필요해...', timestamp: '14:23' },
  { id: 's2', user: 'User_B45', text: '여기 너무 편하네요 😌', timestamp: '14:25' },
  { id: 's3', user: 'User_C78', text: '이 카페 분위기 정말 좋다', timestamp: '14:27' },
  { id: 's4', user: 'User_D31', text: '3분이 순식간이네', timestamp: '14:28' },
];

function nowLabel(): string {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function readLocalMessages(): Message[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES);
    if (raw) {
      return JSON.parse(raw) as Message[];
    }
  } catch {
    /* 무시하고 시드로 폴백 */
  }
  return [...SEED_MESSAGES];
}

function writeLocalMessages(messages: Message[]): void {
  try {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
  } catch {
    /* 저장 실패는 조용히 무시 */
  }
}

/**
 * 채팅 메시지 목록을 가져온다.
 */
export async function fetchMessages(): Promise<Message[]> {
  try {
    const res = await fetch(`${API_BASE}/messages`);
    if (!res.ok) {
      throw new Error(`status ${res.status}`);
    }
    return (await res.json()) as Message[];
  } catch {
    return readLocalMessages();
  }
}

/**
 * 새 메시지를 전송한다. 백엔드 실패 시 localStorage 에 누적한다.
 */
export async function postMessage(input: {
  user: string;
  text: string;
}): Promise<Message> {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(`status ${res.status}`);
    }
    return (await res.json()) as Message;
  } catch {
    const optimistic: Message = {
      id: Date.now().toString(),
      user: input.user,
      text: input.text,
      timestamp: nowLabel(),
    };
    writeLocalMessages([...readLocalMessages(), optimistic]);
    return optimistic;
  }
}

/**
 * 누적 휴식 완료 수를 가져온다.
 */
export async function fetchRestCount(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) {
      throw new Error(`status ${res.status}`);
    }
    const data = (await res.json()) as { restCount: number };
    return data.restCount;
  } catch {
    const saved = localStorage.getItem(LS_REST_COUNT);
    return saved ? parseInt(saved, 10) : 0;
  }
}

/**
 * 휴식 완료 1회를 기록하고 갱신된 누적 수를 반환한다.
 */
export async function recordRest(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/stats/rest`, { method: 'POST' });
    if (!res.ok) {
      throw new Error(`status ${res.status}`);
    }
    const data = (await res.json()) as { restCount: number };
    localStorage.setItem(LS_REST_COUNT, data.restCount.toString());
    return data.restCount;
  } catch {
    const saved = localStorage.getItem(LS_REST_COUNT);
    const next = (saved ? parseInt(saved, 10) : 0) + 1;
    localStorage.setItem(LS_REST_COUNT, next.toString());
    return next;
  }
}
