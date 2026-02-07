## 2024-05-22 - Static Constant Extraction & Throttled Scroll
**Learning:** React components often recreate identical objects (variants, link arrays) on every render, leading to unnecessary memory pressure. Similarly, raw `window` scroll listeners are often unthrottled and can cause performance degradation in complex UIs.
**Action:** Always move static objects outside component bodies. Use `framer-motion`'s `useScroll` and `useMotionValueEvent` for efficient, throttled scroll handling.

## 2024-05-22 - Mocking Module-Level State
**Learning:** Modules that initialize state (like database clients) at the top level are hard to test with standard `vi.mock` if the mock state needs to change per test.
**Action:** Use `vi.resetModules()` and `vi.resetAllMocks()` in `beforeEach` to ensure a clean state for every test case when mocking module-level initializations.
