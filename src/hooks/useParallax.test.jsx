import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { useParallax } from './useScrollAnimation';

describe('useParallax', () => {
  let getBoundingClientRectSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      height: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 100,
      toJSON: () => {}
    });
  });

  afterEach(() => {
    getBoundingClientRectSpy.mockRestore();
    vi.useRealTimers();
  });

  it('verifies getBoundingClientRect is throttled via requestAnimationFrame', async () => {
    const TestComponent = () => {
      const { ref, offset } = useParallax(0.5);
      return <div ref={ref} style={{ height: '100px' }}>Offset: {offset}</div>;
    };

    render(<TestComponent />);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
    });

    // Before rAF runs, it should be 0 calls
    expect(getBoundingClientRectSpy.mock.calls.length).toBe(0);

    // Run pending rAF
    act(() => {
      vi.runAllTimers();
    });

    // Should be exactly 1 call because of throttling
    expect(getBoundingClientRectSpy.mock.calls.length).toBe(1);
  });
});
