import React from 'react';
import type { Theme } from '../types';

interface ThemeSelectorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

/**
 * 산 카페 / 폭포 테마 선택 버튼 그룹.
 */
const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, onChange }) => (
  <div className="theme-selector">
    <p className="theme-label">테마 선택</p>
    <div className="theme-buttons" role="group" aria-label="테마 선택">
      <button
        type="button"
        className={`theme-btn ${theme === 'mountain' ? 'active' : ''}`}
        onClick={() => onChange('mountain')}
        aria-pressed={theme === 'mountain'}
      >
        🏔️ 산 카페
      </button>
      <button
        type="button"
        className={`theme-btn ${theme === 'waterfall' ? 'active' : ''}`}
        onClick={() => onChange('waterfall')}
        aria-pressed={theme === 'waterfall'}
      >
        💧 폭포
      </button>
    </div>
  </div>
);

export default ThemeSelector;
