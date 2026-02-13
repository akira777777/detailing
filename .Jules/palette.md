## 2025-05-14 - [A11y patterns for icon-only buttons]
**Learning:** Several interactive elements (calendar navigation, history filters) used icon-only buttons with material symbols but lacked descriptive ARIA labels, making them inaccessible to screen readers.
**Action:** Always check for `material-symbols-outlined` within buttons and ensure they have an `aria-label`. Enhanced the base `Button` component to handle loading states and focus rings centrally.

## 2025-05-15 - [Performance-optimized accessibility for high-frequency interactions]
**Learning:** For components that bypass React's render loop for performance (like sliders using MotionValues), accessibility attributes like `aria-valuenow` still need to stay in sync. Updating state on every move defeats the optimization.
**Action:** Use `useMotionValueEvent` to update ARIA attributes directly on the DOM element using `setAttribute` during high-frequency interactions (like dragging), and sync back to React state only when the interaction is lower-frequency (keyboard) or completes.

## 2025-05-16 - [Visual progress feedback for auto-dismissing notifications]
**Learning:** Purely time-based notifications without visual feedback can be frustrating for users who don't know how long they have to read or act. A shrinking progress bar provides an intuitive, non-obtrusive way to communicate remaining time.
**Action:** Implemented a `framer-motion` based progress bar in `ToastItem`. Using `scaleX` and `origin-left` is more performant than animating `width` as it avoids layout reflows. Added `relative overflow-hidden` to the toast container to ensure the bar is contained and correctly positioned at the bottom.

## 2025-05-17 - [Calendar UX: Contextual indicators and cross-month selection]
**Learning:** A static booking calendar prevents users from planning ahead. Functional month navigation combined with visual promotional indicators (like weekend special dots) provides a more empowering and transparent scheduling experience. Storing selection as a full date object ensures consistency when navigating between months.
**Action:** Implemented state-driven month navigation in `Booking.jsx`. Added visual weekend indicators (dots) and updated ARIA labels to mention promotions. Used `aria-live="polite"` on the month header to announce navigation changes to screen reader users.

## 2026-02-12 - [Fluid navigation indicators with Shared Layout Animations]
**Learning:** Standard static highlights for active navigation links feel "step-like" and lack premium polish. Using Framer Motion's `layoutId` allows the active indicator (underline or background) to physically slide between elements, creating a much more cohesive and delightful user experience.
**Action:** Implemented `layoutId="active-nav-link"` in `Layout.jsx` and `layoutId="active-lang"` in `LanguageSwitcher.jsx`. Combined with accessibility improvements like `aria-hidden` for decorative icons to ensure the "delight" doesn't come at the cost of screen reader clarity.
