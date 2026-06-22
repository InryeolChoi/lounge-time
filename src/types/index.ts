/**
 * 라운지 채팅 메시지
 */
export interface Message {
  id: string;
  user: string;
  text: string;
  /** 표시용 시간 문자열 (예: "14:23") */
  timestamp: string;
}

/**
 * 배경 테마
 */
export type Theme = 'mountain' | 'waterfall';
