import React, { useCallback, useEffect, useState } from 'react';
import './styles/App.css';
import type { Message, Theme } from './types';
import {
  fetchMessages,
  fetchRestCount,
  postMessage,
  recordRest,
} from './services/chatApi';
import { useRestTimer } from './hooks/useRestTimer';
import { useAmbientSound } from './hooks/useAmbientSound';
import { usePersistentState } from './hooks/usePersistentState';
import Header from './components/Header';
import ThemeSelector from './components/ThemeSelector';
import IceCream from './components/IceCream';
import TimerDisplay from './components/TimerDisplay';
import SoundControl from './components/SoundControl';
import ChatPanel from './components/ChatPanel';
import Scene from './components/Scene';

/**
 * Lounge Time 메인 앱. 각 영역을 조립하고 상태/통신을 조율한다.
 */
const App: React.FC = () => {
  const [theme, setTheme] = usePersistentState<Theme>('loungeTimeTheme', 'mountain');
  const [soundEnabled, setSoundEnabled] = usePersistentState<boolean>(
    'loungeTimeSound',
    false
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [restCount, setRestCount] = useState(0);

  // 초기 데이터 로드 (백엔드 우선, 실패 시 localStorage 폴백)
  useEffect(() => {
    let active = true;
    void (async () => {
      const [loadedMessages, loadedCount] = await Promise.all([
        fetchMessages(),
        fetchRestCount(),
      ]);
      if (active) {
        setMessages(loadedMessages);
        setRestCount(loadedCount);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // 휴식 완료 1회 처리 (중복 증가 없이)
  const handleRestComplete = useCallback(() => {
    void recordRest().then(setRestCount);
  }, []);

  const timer = useRestTimer(handleRestComplete);

  useAmbientSound(soundEnabled, theme);

  const handleSend = useCallback(async (text: string) => {
    const user = `You_${Math.floor(Math.random() * 1000)}`;
    const saved = await postMessage({ user, text });
    setMessages((prev) => [...prev, saved]);
  }, []);

  const themeClass = `theme-${theme} progress-${Math.floor(timer.progress / 10)}`;

  return (
    <div className={`app ${themeClass} ${timer.isRunning ? 'running' : ''}`}>
      <Scene />

      <Header restCount={restCount} />

      <div className="main-container">
        <div className="left-section">
          <ThemeSelector theme={theme} onChange={setTheme} />

          <IceCream
            progress={timer.progress}
            isRunning={timer.isRunning}
            isComplete={timer.isComplete}
            onToggle={timer.toggle}
          />

          <TimerDisplay remaining={timer.remaining} progress={timer.progress} />

          <SoundControl
            enabled={soundEnabled}
            theme={theme}
            onToggle={() => setSoundEnabled((prev) => !prev)}
          />
        </div>

        <div className="right-section">
          <ChatPanel messages={messages} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default App;
