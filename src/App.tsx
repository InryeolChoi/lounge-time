import React, { useState, useEffect } from 'react';
import './styles/App.css';

/**
 * 메시지 타입
 */
interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

/**
 * 테마 타입
 */
type Theme = 'mountain' | 'waterfall';

/**
 * Lounge Time 메인 앱 컴포넌트
 */
const App: React.FC = () => {
  // 상태 관리
  const [theme, setTheme] = useState<Theme>('mountain');
  const [progress, setProgress] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'User_A92', text: '아, 휴식이 정말 필요해...', timestamp: '14:23' },
    { id: '2', user: 'User_B45', text: '여기 너무 편하네요 😌', timestamp: '14:25' },
    { id: '3', user: 'User_C78', text: '이 카페 분위기 정말 좋다', timestamp: '14:27' },
    { id: '4', user: 'User_D31', text: '3분이 순식간이네', timestamp: '14:28' },
  ]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [restCount, setRestCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // 로컬스토리지에서 초기 데이터 로드
  useEffect(() => {
    const savedRestCount = localStorage.getItem('loungeTimeRestCount');
    if (savedRestCount) {
      setRestCount(parseInt(savedRestCount, 10));
    }
  }, []);

  // 타이머 (3분 = 180초)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (elapsedTime < 180) {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          const next = prev + 1;
          // 진행도 계산 (%)
          const newProgress = Math.floor((next / 180) * 100);
          setProgress(newProgress);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [elapsedTime]);

  // 아이스크림 눌렀을 때
  const handleIceCreamMouseDown = () => {
    setIsPressed(true);
  };

  // 아이스크림 떼었을 때
  const handleIceCreamMouseUp = () => {
    setIsPressed(false);
    if (progress < 100) {
      setElapsedTime((prev) => prev + 5); // 5초 진행
    }
  };

  // 터치 이벤트
  const handleIceCreamTouchStart = () => {
    setIsPressed(true);
  };

  const handleIceCreamTouchEnd = () => {
    setIsPressed(false);
    if (progress < 100) {
      setElapsedTime((prev) => prev + 5);
    }
  };

  // 휴식 완료
  useEffect(() => {
    if (progress >= 100) {
      const newCount = restCount + 1;
      setRestCount(newCount);
      localStorage.setItem('loungeTimeRestCount', newCount.toString());
      // 3초 후 리셋
      setTimeout(() => {
        setProgress(0);
        setElapsedTime(0);
      }, 3000);
    }
  }, [progress, restCount]);

  // 메시지 전송
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: `You_${Math.floor(Math.random() * 1000)}`,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  // 테마별 배경색
  const getThemeClass = (): string => {
    return `theme-${theme} progress-${Math.floor(progress / 10)}`;
  };

  // 분, 초 포맷
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`app ${getThemeClass()}`}>
      {/* 헤더 */}
      <header className="app-header">
        <h1 className="app-title">🛋️ Lounge Time</h1>
        <div className="header-info">
          <span className="rest-count">휴식 완료: {restCount}회</span>
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <div className="main-container">
        {/* 왼쪽 섹션 */}
        <div className="left-section">
          {/* 테마 선택 */}
          <div className="theme-selector">
            <p className="theme-label">테마 선택</p>
            <div className="theme-buttons">
              <button
                className={`theme-btn ${theme === 'mountain' ? 'active' : ''}`}
                onClick={() => setTheme('mountain')}
                aria-label="산 카페 테마"
              >
                🏔️ 산 카페
              </button>
              <button
                className={`theme-btn ${theme === 'waterfall' ? 'active' : ''}`}
                onClick={() => setTheme('waterfall')}
                aria-label="폭포 테마"
              >
                💧 폭포
              </button>
            </div>
          </div>

          {/* 아이스크림 영역 */}
          <div className="icecream-section">
            <div
              className={`icecream-container ${isPressed ? 'pressed' : ''}`}
              onMouseDown={handleIceCreamMouseDown}
              onMouseUp={handleIceCreamMouseUp}
              onMouseLeave={handleIceCreamMouseUp}
              onTouchStart={handleIceCreamTouchStart}
              onTouchEnd={handleIceCreamTouchEnd}
            >
              <div className="icecream" style={{ height: `${100 - progress}%` }}>
                🍦
              </div>
            </div>
            <p className="icecream-text">
              {progress < 100 ? '클릭하고 누르고 있으세요' : '휴식 완료!'}
            </p>
          </div>

          {/* 타이머 및 진행도 */}
          <div className="timer-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="timer-display">
              <span className="time">{formatTime(elapsedTime)}</span>
              <span className="percentage">{progress}%</span>
            </div>
          </div>

          {/* 사운드 버튼 */}
          <div className="sound-section">
            <button
              className={`sound-btn ${soundEnabled ? 'enabled' : 'disabled'}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label="음소거 토글"
            >
              {soundEnabled ? '🔊' : '🔇'} {soundEnabled ? '음소거' : '음소거 해제'}
            </button>
            <p className="sound-description">
              {theme === 'mountain'
                ? '🎵 산 카페 분위기: 에어컨 소리 + 대화음'
                : '🎵 폭포 분위기: 폭포 소리 + 자연음'}
            </p>
          </div>
        </div>

        {/* 오른쪽 섹션 - 채팅 패널 */}
        <div className="right-section">
          <div className="chat-panel">
            <h3 className="chat-title">라운지 채팅</h3>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <span className="message-user">{msg.user}</span>
                  <span className="message-time">{msg.timestamp}</span>
                  <p className="message-text">{msg.text}</p>
                </div>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="익명으로 말해보세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                maxLength={100}
              />
              <button type="submit" className="chat-submit" aria-label="메시지 전송">
                전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
