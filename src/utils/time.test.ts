import { describe, it, expect } from 'vitest';
import {
  REST_DURATION_SECONDS,
  computeProgress,
  computeRemaining,
  formatClock,
} from './time';

describe('computeProgress', () => {
  it('returns 0 at the start', () => {
    expect(computeProgress(0)).toBe(0);
  });

  it('returns 50 at the half-way point', () => {
    expect(computeProgress(REST_DURATION_SECONDS / 2)).toBe(50);
  });

  it('returns 100 at the end', () => {
    expect(computeProgress(REST_DURATION_SECONDS)).toBe(100);
  });

  it('clamps above the duration to 100', () => {
    expect(computeProgress(REST_DURATION_SECONDS + 50)).toBe(100);
  });

  it('clamps negative input to 0', () => {
    expect(computeProgress(-10)).toBe(0);
  });

  it('floors fractional progress', () => {
    expect(computeProgress(1)).toBe(0); // 1/180 ~ 0.55%
  });
});

describe('computeRemaining', () => {
  it('returns the full duration at the start', () => {
    expect(computeRemaining(0)).toBe(REST_DURATION_SECONDS);
  });

  it('returns 0 at completion', () => {
    expect(computeRemaining(REST_DURATION_SECONDS)).toBe(0);
  });

  it('never goes negative', () => {
    expect(computeRemaining(REST_DURATION_SECONDS + 30)).toBe(0);
  });

  it('rounds up partial seconds', () => {
    expect(computeRemaining(REST_DURATION_SECONDS - 0.2)).toBe(1);
  });
});

describe('formatClock', () => {
  it('formats zero', () => {
    expect(formatClock(0)).toBe('0:00');
  });

  it('zero-pads seconds', () => {
    expect(formatClock(5)).toBe('0:05');
  });

  it('formats minutes and seconds', () => {
    expect(formatClock(65)).toBe('1:05');
  });

  it('formats three minutes', () => {
    expect(formatClock(180)).toBe('3:00');
  });

  it('clamps negative values to 0:00', () => {
    expect(formatClock(-5)).toBe('0:00');
  });
});
