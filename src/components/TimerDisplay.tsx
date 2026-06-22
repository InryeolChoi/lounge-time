import React from 'react';

interface TimerDisplayProps {
  elapsed: number;
  progress: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * 진행 바와 경과 시간/퍼센트를 표시한다.
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsed, progress }) => (
  <div className="timer-section">
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
    <div className="timer-display">
      <span className="time">{formatTime(elapsed)}</span>
      <span className="percentage">{progress}%</span>
    </div>
  </div>
);

export default TimerDisplay;
