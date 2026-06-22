import { useEffect, useRef } from 'react';
import type { Theme } from '../types';

interface AmbientNodes {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
}

/** 테마별 저역 통과 필터 주파수(Hz). 폭포가 더 밝고 시원하다. */
const THEME_FREQUENCY: Record<Theme, number> = {
  mountain: 550,
  waterfall: 1400,
};

const TARGET_GAIN = 0.12;

/**
 * 오디오 파일 없이 Web Audio API 로 앰비언스(브라운 노이즈)를 생성하는 훅.
 *
 * - `enabled` 가 true 가 되는 순간(사용자 제스처) AudioContext 를 만든다.
 * - 테마에 따라 저역 통과 필터 주파수를 바꿔 분위기를 전환한다.
 * - `enabled` 가 false 면 페이드 아웃 후 정리한다.
 */
export function useAmbientSound(enabled: boolean, theme: Theme): void {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AmbientNodes | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const AudioCtor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) {
      return;
    }

    const ctx = new AudioCtor();
    ctxRef.current = ctx;
    void ctx.resume();

    // 브라운 노이즈 버퍼 생성
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = THEME_FREQUENCY[theme];

    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    gain.gain.linearRampToValueAtTime(TARGET_GAIN, ctx.currentTime + 0.6);
    nodesRef.current = { source, filter, gain };

    return () => {
      const nodes = nodesRef.current;
      if (nodes) {
        try {
          nodes.gain.gain.cancelScheduledValues(ctx.currentTime);
          nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          nodes.source.stop(ctx.currentTime + 0.35);
        } catch {
          /* 이미 정지된 경우 무시 */
        }
      }
      nodesRef.current = null;
      ctxRef.current = null;
      window.setTimeout(() => {
        void ctx.close().catch(() => undefined);
      }, 400);
    };
  }, [enabled]);

  // 테마 변경 시 필터 주파수만 부드럽게 전환
  useEffect(() => {
    const nodes = nodesRef.current;
    const ctx = ctxRef.current;
    if (!nodes || !ctx) {
      return;
    }
    nodes.filter.frequency.setTargetAtTime(
      THEME_FREQUENCY[theme],
      ctx.currentTime,
      0.2
    );
  }, [theme]);
}
