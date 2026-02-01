## 2024-05-22 - [React Context and Component Memoization]
**Learning:** In highly interactive applications with global state (like a Toast system), missing `useMemo` on context values and `React.memo` on high-frequency components causes widespread redundant re-renders. Every component using `useToast()` was re-rendering whenever any toast was added or removed because the context value was a new object literal.
**Action:** Always memoize context value objects with `useMemo` and wrap generic UI components in `React.memo` to ensure reference stability and skip unnecessary render cycles.

## 2025-05-15 - [Bypassing React for High-Frequency Interactions]
**Learning:** For components with high-frequency interactions (like drag-to-reveal sliders), React's state-based rendering is a bottleneck due to reconciliation overhead on every mouse move.
**Action:** Use `framer-motion`'s `MotionValue` or direct DOM manipulation to update styles (e.g., `clip-path`, `transform`) outside of the React render loop. Cache layout dimensions (`getBoundingClientRect`) on interaction start to avoid layout thrashing during moves.
