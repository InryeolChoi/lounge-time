import React from 'react';

interface HeaderProps {
  restCount: number;
}

/**
 * 앱 상단 헤더. 타이틀과 누적 휴식 횟수를 표시한다.
 */
const Header: React.FC<HeaderProps> = ({ restCount }) => (
  <header className="app-header">
    <h1 className="app-title">🛋️ Lounge Time</h1>
    <div className="header-info">
      <span className="rest-count">휴식 완료: {restCount}회</span>
    </div>
  </header>
);

export default Header;
