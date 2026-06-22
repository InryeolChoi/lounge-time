import React from 'react';
import '../styles/Scene.css';

/**
 * 1인칭 몰입 씬(장식 전용).
 *
 * - 산 카페 테마: 앉아서 카페를 바라보는 시점(창밖 산 풍경, 펜던트 조명, 원목 테이블).
 * - 폭포 테마: 실내 아트리움에서 작은 폭포형 조경물을 바라보는 시점(물줄기·수반·식물).
 *
 * 두 씬을 모두 렌더하고, 부모 `.app.theme-*` 클래스로 opacity 크로스페이드한다.
 * 모든 요소는 장식이므로 `aria-hidden`.
 */
const Scene: React.FC = () => (
  <div className="scene-stage" aria-hidden="true">
    {/* ── 산 카페: 앉아서 카페를 바라보는 시점 ── */}
    <div className="scene scene-cafe">
      <div className="cafe-wall" />
      <div className="cafe-window">
        <div className="window-sky" />
        <div className="window-mountains" />
        <div className="window-haze" />
        <div className="window-grid" />
      </div>
      <div className="cafe-lights">
        <span className="pendant pendant-1" />
        <span className="pendant pendant-2" />
        <span className="pendant pendant-3" />
      </div>
      <div className="cafe-shelf" />
      <span className="cafe-plant">🪴</span>
      <div className="cafe-table" />
      <span className="cafe-cup">☕️</span>
    </div>

    {/* ── 폭포: 실내 폭포형 조경물을 바라보는 시점 ── */}
    <div className="scene scene-falls">
      <div className="atrium-wall" />
      <div className="atrium-beam atrium-beam-1" />
      <div className="atrium-beam atrium-beam-2" />
      <div className="falls-rockwall" />
      <div className="falls-water">
        <span className="stream stream-1" />
        <span className="stream stream-2" />
        <span className="stream stream-3" />
        <span className="stream stream-4" />
      </div>
      <div className="falls-mist" />
      <div className="falls-pool">
        <span className="ripple ripple-1" />
        <span className="ripple ripple-2" />
        <span className="ripple ripple-3" />
      </div>
      <span className="atrium-plant atrium-plant-left">🌿</span>
      <span className="atrium-plant atrium-plant-right">🪴</span>
      <div className="stone-ledge" />
    </div>
  </div>
);

export default Scene;
