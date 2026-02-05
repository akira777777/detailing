## 2025-05-14 - [A11y patterns for icon-only buttons]
**Learning:** Several interactive elements (calendar navigation, history filters) used icon-only buttons with material symbols but lacked descriptive ARIA labels, making them inaccessible to screen readers.
**Action:** Always check for `material-symbols-outlined` within buttons and ensure they have an `aria-label`. Enhanced the base `Button` component to handle loading states and focus rings centrally.

## 2025-05-15 - [Performance-optimized accessibility for high-frequency interactions]
**Learning:** For components that bypass React's render loop for performance (like sliders using MotionValues), accessibility attributes like `aria-valuenow` still need to stay in sync. Updating state on every move defeats the optimization.
**Action:** Use `useMotionValueEvent` to update ARIA attributes directly on the DOM element using `setAttribute` during high-frequency interactions (like dragging), and sync back to React state only when the interaction is lower-frequency (keyboard) or completes.

## 2025-05-16 - [Visual progress feedback for auto-dismissing notifications]
**Learning:** Purely time-based notifications without visual feedback can be frustrating for users who don't know how long they have to read or act. A shrinking progress bar provides an intuitive, non-obtrusive way to communicate remaining time.
**Action:** Implemented a `framer-motion` based progress bar in `ToastItem`. Using `scaleX` and `origin-left` is more performant than animating `width` as it avoids layout reflows. Added `relative overflow-hidden` to the toast container to ensure the bar is contained and correctly positioned at the bottom.
