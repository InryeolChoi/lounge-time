import React, { useEffect, useRef, useState } from 'react';
import type { Message } from '../types';

interface ChatPanelProps {
  messages: Message[];
  onSend: (text: string) => void;
}

const MAX_LENGTH = 100;

/**
 * 익명 라운지 채팅 패널.
 * 새 메시지가 추가되면 자동으로 맨 아래로 스크롤하고, 내가 보낸 메시지는 강조한다.
 */
const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSend }) => {
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (text) {
      onSend(text);
      setDraft('');
    }
  };

  return (
    <div className="chat-panel">
      <h3 className="chat-title">라운지 채팅</h3>
      <div className="chat-messages" ref={listRef} aria-live="polite">
        {messages.length === 0 ? (
          <p className="chat-empty">아직 메시지가 없어요. 먼저 인사를 건네보세요 👋</p>
        ) : (
          messages.map((msg) => {
            const mine = msg.user.startsWith('You_');
            return (
              <div
                key={msg.id}
                className={`chat-message ${mine ? 'mine' : ''}`}
              >
                <span className="message-user">{msg.user}</span>
                <span className="message-time">{msg.timestamp}</span>
                <p className="message-text">{msg.text}</p>
              </div>
            );
          })
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="익명으로 말해보세요..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_LENGTH}
          aria-label="메시지 입력"
        />
        <button
          type="submit"
          className="chat-submit"
          aria-label="메시지 전송"
          disabled={draft.trim().length === 0}
        >
          전송
        </button>
      </form>
      <p className="chat-counter">
        {draft.length}/{MAX_LENGTH}
      </p>
    </div>
  );
};

export default ChatPanel;
