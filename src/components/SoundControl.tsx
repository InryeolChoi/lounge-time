import React from 'react';
import type { Theme } from '../types';

interface SoundControlProps {
  enabled: boolean;
  theme: Theme;
  onToggle: () => void;
}

/**
 * 앰비언스 사운드 토글 버튼과 현재 테마 설명.
 */
const SoundControl: React.FC<SoundControlProps> = ({
  enabled,
  theme,
  onToggle,
}) => (
  <div className="sound-section">
    <button
      type="button"
      className={`sound-btn ${enabled ? 'enabled' : 'disabled'}`}
      onClick={onToggle}
      aria-pressed={enabled}
    >
      {enabled ? '🔊 소리 끄기' : '🔇 소리 켜기'}
    </button>
    <p className="sound-description">
      {theme === 'mountain'
        ? '🎵 산 카페 분위기: 잔잔한 에어컨 소리'
        : '🎵 폭포 분위기: 시원한 물소리'}
    </p>
  </div>
);

export default SoundControl;
