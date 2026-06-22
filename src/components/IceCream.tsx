import React from 'react';

interface IceCreamProps {
  progress: number;
  isResting: boolean;
  isComplete: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
}

/**
 * 중앙 아이스크림. 누르고 있는 동안 휴식이 진행되며 점점 녹아 줄어든다.
 * 마우스/터치/키보드(Space·Enter) 입력을 모두 지원한다.
 */
const IceCream: React.FC<IceCreamProps> = ({
  progress,
  isResting,
  isComplete,
  onPressStart,
  onPressEnd,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      onPressStart();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onPressEnd();
    }
  };

  return (
    <div className="icecream-section">
      <div
        className={`icecream-container ${isResting ? 'pressed' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="아이스크림을 누르고 있으면 휴식이 진행됩니다"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        onMouseDown={onPressStart}
        onMouseUp={onPressEnd}
        onMouseLeave={onPressEnd}
        onTouchStart={onPressStart}
        onTouchEnd={onPressEnd}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className="icecream" style={{ height: `${100 - progress}%` }}>
          🍦
        </div>
      </div>
      <p className="icecream-text">
        {isComplete
          ? '휴식 완료! 잠시 후 다시 시작돼요 ☕'
          : isResting
            ? '쉬는 중... 그대로 누르고 계세요'
            : '아이스크림을 누르고 있으세요'}
      </p>
    </div>
  );
};

export default IceCream;
