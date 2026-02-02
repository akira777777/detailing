## 2025-05-14 - [A11y patterns for icon-only buttons]
**Learning:** Several interactive elements (calendar navigation, history filters) used icon-only buttons with material symbols but lacked descriptive ARIA labels, making them inaccessible to screen readers.
**Action:** Always check for `material-symbols-outlined` within buttons and ensure they have an `aria-label`. Enhanced the base `Button` component to handle loading states and focus rings centrally.

## 2025-05-15 - [Performance-optimized accessibility for high-frequency interactions]
**Learning:** For components that bypass React's render loop for performance (like sliders using MotionValues), accessibility attributes like `aria-valuenow` still need to stay in sync. Updating state on every move defeats the optimization.
**Action:** Use `useMotionValueEvent` to update ARIA attributes directly on the DOM element using `setAttribute` during high-frequency interactions (like dragging), and sync back to React state only when the interaction is lower-frequency (keyboard) or completes.
