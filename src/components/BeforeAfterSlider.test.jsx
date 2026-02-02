/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

test('BeforeAfterSlider has slider role and keyboard support', () => {
  render(
    <BeforeAfterSlider
      beforeImage="before.jpg"
      afterImage="after.jpg"
      alt="Test Car"
    />
  );

  const slider = screen.getByRole('slider');
  expect(slider).toBeDefined();
  expect(slider.getAttribute('aria-valuemin')).toBe('0');
  expect(slider.getAttribute('aria-valuemax')).toBe('100');
  expect(slider.getAttribute('aria-valuenow')).toBe('50');

  // Test ArrowRight
  fireEvent.keyDown(slider, { key: 'ArrowRight' });
  expect(slider.getAttribute('aria-valuenow')).toBe('52');

  // Test ArrowLeft
  fireEvent.keyDown(slider, { key: 'ArrowLeft' });
  expect(slider.getAttribute('aria-valuenow')).toBe('50');

  // Test Home
  fireEvent.keyDown(slider, { key: 'Home' });
  expect(slider.getAttribute('aria-valuenow')).toBe('0');

  // Test End
  fireEvent.keyDown(slider, { key: 'End' });
  expect(slider.getAttribute('aria-valuenow')).toBe('100');
});
