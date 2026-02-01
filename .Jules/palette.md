## 2025-05-14 - [A11y patterns for icon-only buttons]
**Learning:** Several interactive elements (calendar navigation, history filters) used icon-only buttons with material symbols but lacked descriptive ARIA labels, making them inaccessible to screen readers.
**Action:** Always check for `material-symbols-outlined` within buttons and ensure they have an `aria-label`. Enhanced the base `Button` component to handle loading states and focus rings centrally.
