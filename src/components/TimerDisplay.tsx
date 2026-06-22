import React from 'react';
import { formatClock } from '../utils/time';

interface TimerDisplayProps {
  remaining: number;
  progress: number;
}

/**
 * 진행 바와 남은 시간(카운트다운)/퍼센트를 표시한다.
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({ remaining, progress }) => (
  <div className="timer-section">
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="휴식 진행도"
    >
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
    <div className="timer-display">
      <span className="time">{formatClock(remaining)}</span>
      <span className="percentage">{progress}%</span>
    </div>
    <p className="timer-caption">남은 휴식 시간</p>
  </div>
);

export default TimerDisplay;
