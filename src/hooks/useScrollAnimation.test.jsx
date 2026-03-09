import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// We need to define the mock globally before importing the hook

const observeMock = vi.fn();
const unobserveMock = vi.fn();
const disconnectMock = vi.fn();

let observerInstances = [];

class MockIntersectionObserver {
  constructor(callback, options) {
    this.observe = observeMock;
    this.unobserve = unobserveMock;
    this.disconnect = disconnectMock;
    this.callback = callback;
    this.options = options;
    observerInstances.push(this);
  }
}

// Use globalThis to satisfy linter
globalThis.IntersectionObserver = MockIntersectionObserver;

describe('useScrollAnimation Performance', () => {
  let useScrollAnimation;
  let TestComponent;

  beforeEach(async () => {
    vi.resetModules();
    observerInstances = [];
    observeMock.mockClear();
    unobserveMock.mockClear();
    disconnectMock.mockClear();

    // Re-import to get a fresh instance of the module (and its internal Maps)
    const mod = await import('./useScrollAnimation');
    useScrollAnimation = mod.useScrollAnimation;

    TestComponent = ({ options }) => {
      const { ref, isInView } = useScrollAnimation(options);
      return <div ref={ref} data-testid="item">{isInView ? 'Visible' : 'Hidden'}</div>;
    };
  });

  it('shares the same observer for components with same options', () => {
    render(
      <>
        <TestComponent />
        <TestComponent />
        <TestComponent />
      </>
    );

    // Should only create 1 observer shared among 3 components
    expect(observerInstances.length).toBe(1);
    expect(observeMock).toHaveBeenCalledTimes(3);
  });

  it('creates distinct observers for different options', () => {
    render(
      <>
        <TestComponent options={{ amount: 0.2 }} />
        <TestComponent options={{ amount: 0.5 }} />
      </>
    );

    expect(observerInstances.length).toBe(2);
    expect(observerInstances[0].options.threshold).toBe(0.2);
    expect(observerInstances[1].options.threshold).toBe(0.5);
  });

  it('reuses observer even if options object identity is different but content is same', () => {
    const options1 = { amount: 0.3 };
    const options2 = { amount: 0.3 }; // Different object, same content

    render(
      <>
        <TestComponent options={options1} />
        <TestComponent options={options2} />
      </>
    );

    expect(observerInstances.length).toBe(1);
    expect(observeMock).toHaveBeenCalledTimes(2);
  });

  it('correctly triggers visibility and unobserves when once: true', () => {
    render(<TestComponent options={{ once: true }} />);

    const observer = observerInstances[0];
    const callback = observer.callback;

    // Simulate intersection
    const entry = {
        isIntersecting: true,
        target: observeMock.mock.calls[0][0] // The element passed to observe
    };

    // Trigger the callback
    act(() => {
        callback([entry], observer);
    });

    expect(unobserveMock).toHaveBeenCalledWith(entry.target);
  });

  it('handles once: false correctly', () => {
    render(<TestComponent options={{ once: false }} />);

    const observer = observerInstances[0];
    const callback = observer.callback;
    const element = observeMock.mock.calls[0][0];

    // Simulate entry
    act(() => {
        callback([{ isIntersecting: true, target: element }], observer);
    });
    // Should NOT have unobserved
    expect(unobserveMock).not.toHaveBeenCalled();

    // Simulate exit
    act(() => {
        callback([{ isIntersecting: false, target: element }], observer);
    });
    // Should NOT have unobserved
    expect(unobserveMock).not.toHaveBeenCalled();
  });

  it('disconnects observer when all components unmount', () => {
    const { unmount } = render(<TestComponent />);
    expect(observerInstances.length).toBe(1);

    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });
});
