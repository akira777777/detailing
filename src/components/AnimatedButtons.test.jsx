import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnimatedButton } from './AnimatedButtons';

// Mock the sound manager hook
vi.mock('../utils/soundManager', () => ({
  useSound: () => ({
    playTone: vi.fn(),
  }),
}));

describe('AnimatedButton', () => {
  it('calls onClick handler only once when clicked on the ripple span', () => {
    const handleClick = vi.fn();
    const { container } = render(<AnimatedButton onClick={handleClick}>Click me</AnimatedButton>);

    // Find the ripple span which covers the button
    const rippleSpan = container.querySelector('.absolute.inset-0');
    expect(rippleSpan).toBeTruthy();

    // Simulate a click on the ripple span
    fireEvent.click(rippleSpan);

    // Check call count
    // This should detect the double invocation if the bug exists
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
