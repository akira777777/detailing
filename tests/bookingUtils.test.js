import { describe, it, expect, vi } from 'vitest';
import { getPackageName } from '../src/utils/bookingUtils';

describe('getPackageName', () => {
  const t = vi.fn((key, defaultValue) => defaultValue || key);

  it('should return Basic Detailing when no modules are selected', () => {
    const modules = {};
    expect(getPackageName(modules)).toBe('Basic Detailing');
    expect(getPackageName(modules, t)).toBe('Basic Detailing');
    expect(t).toHaveBeenCalledWith('calculator.step_3.modules.basic.title', 'Basic Detailing');
  });

  it('should return Basic Detailing when modules are present but all false', () => {
    const modules = { coating: false, interior: false };
    expect(getPackageName(modules)).toBe('Basic Detailing');
  });

  it('should return Ceramic Coating Package when coating is selected', () => {
    const modules = { coating: true };
    expect(getPackageName(modules)).toBe('Ceramic Coating Package');
    expect(getPackageName(modules, t)).toBe('calculator.step_3.modules.coating.title');
    expect(t).toHaveBeenCalledWith('calculator.step_3.modules.coating.title');
  });

  it('should return Paint Correction Package when correction is selected', () => {
    const modules = { correction: true };
    expect(getPackageName(modules)).toBe('Paint Correction Package');
    expect(getPackageName(modules, t)).toBe('calculator.step_3.modules.correction.title');
    expect(t).toHaveBeenCalledWith('calculator.step_3.modules.correction.title');
  });

  it('should return Interior Detail Package when interior is selected', () => {
    const modules = { interior: true };
    expect(getPackageName(modules)).toBe('Interior Detail Package');
    expect(getPackageName(modules, t)).toBe('calculator.step_3.modules.interior.title');
    expect(t).toHaveBeenCalledWith('calculator.step_3.modules.interior.title');
  });

  it('should return Interior Detail Package for any other single module', () => {
    const modules = { unknown: true };
    expect(getPackageName(modules)).toBe('Interior Detail Package');
    expect(getPackageName(modules, t)).toBe('calculator.step_3.modules.interior.title');
  });

  it('should return Custom Concours Package when multiple modules are selected', () => {
    const modules = { coating: true, interior: true };
    expect(getPackageName(modules)).toBe('Custom Concours Package');
    expect(getPackageName(modules, t)).toBe('Custom Concours Package');
    expect(t).toHaveBeenCalledWith('calculator.step_3.modules.custom.title', 'Custom Concours Package');
  });
});
