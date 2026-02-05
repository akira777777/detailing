## 2024-05-22 - [React Context and Component Memoization]
**Learning:** In highly interactive applications with global state (like a Toast system), missing `useMemo` on context values and `React.memo` on high-frequency components causes widespread redundant re-renders. Every component using `useToast()` was re-rendering whenever any toast was added or removed because the context value was a new object literal.
**Action:** Always memoize context value objects with `useMemo` and wrap generic UI components in `React.memo` to ensure reference stability and skip unnecessary render cycles.

## 2025-05-15 - [Bypassing React for High-Frequency Interactions]
**Learning:** For components with high-frequency interactions (like drag-to-reveal sliders), React's state-based rendering is a bottleneck due to reconciliation overhead on every mouse move.
**Action:** Use `framer-motion`'s `MotionValue` or direct DOM manipulation to update styles (e.g., `clip-path`, `transform`) outside of the React render loop. Cache layout dimensions (`getBoundingClientRect`) on interaction start to avoid layout thrashing during moves.

## 2026-02-02 - [Expensive Intl Objects in Render Loops]
**Learning:** `Intl.DateTimeFormat` (and other Intl constructors) are significantly expensive to instantiate. Doing so inside React component bodies, especially within `.map()` loops (like a calendar), can lead to noticeable UI stutter during re-renders.
**Action:** Always move `Intl` formatters to module-level constants or a centralized utility file to ensure they are instantiated only once. For date parts used in loops, pre-calculate values using `useMemo` at the component root to further reduce redundant object allocations.

## 2026-02-03 - [Pre-calculating Calendar Grid Data]
**Learning:** React render loops for calendars often contain redundant `new Date()` allocations and expensive `Intl.format()` calls (e.g., for `aria-label` or cell labels). These run ~30 times per render and re-trigger on every micro-interaction (like selecting a time slot) even if the month hasn't changed.
**Action:** Move calendar day generation, including all localized strings and padding offsets, into a `useMemo` hook keyed to the month/year. This ensures the render loop only performs lightweight JSX generation using pre-calculated data.

## 2025-05-20 - [Bypassing React for Counter Animations]
**Learning:** Using `useState` within a `requestAnimationFrame` loop for counter animations triggers a full React render cycle (including reconciliation) on every frame. For simple text updates, this is extremely inefficient.
**Action:** Use `framer-motion`'s `useMotionValue`, `useTransform`, and `animate` function to update the DOM directly. Passing a `MotionValue` (or a derived one) as a child to a `motion.span` allows Framer Motion to sync the value to `textContent` without triggering component re-renders.
