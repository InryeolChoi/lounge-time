import React from 'react';

interface IceCreamProps {
  progress: number;
  isRunning: boolean;
  isComplete: boolean;
  onToggle: () => void;
}

/**
 * 중앙 아이스크림 토글 버튼.
 * 클릭/탭/키보드(Space·Enter)로 휴식을 시작·일시정지하며, 진행에 따라 녹아 줄어든다.
 */
const IceCream: React.FC<IceCreamProps> = ({
  progress,
  isRunning,
  isComplete,
  onToggle,
}) => {
  const label = isComplete
    ? '휴식 완료'
    : isRunning
      ? '휴식 일시정지'
      : '휴식 시작';

  return (
    <div className="icecream-section">
      <div className="icecream-stage">
        <button
          type="button"
          className={`icecream-container ${isRunning ? 'running' : ''} ${
            isComplete ? 'complete' : ''
          }`}
          onClick={onToggle}
          aria-pressed={isRunning}
          aria-label={`${label} (진행도 ${progress}%)`}
          disabled={isComplete}
        >
          <div className="icecream" style={{ height: `${100 - progress}%` }}>
            <span className="icecream-emoji" aria-hidden="true">
              🍦
            </span>
          </div>
        </button>
      </div>
      <p className="icecream-text" aria-live="polite">
        {isComplete
          ? '휴식 완료! 잠시 후 다시 시작돼요 ☕'
          : isRunning
            ? '편하게 쉬는 중… 다시 누르면 일시정지'
            : '아이스크림을 눌러 휴식을 시작하세요'}
      </p>
    </div>
  );
};

export default IceCream;
