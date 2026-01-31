## 2024-05-22 - [React Context and Component Memoization]
**Learning:** In highly interactive applications with global state (like a Toast system), missing `useMemo` on context values and `React.memo` on high-frequency components causes widespread redundant re-renders. Every component using `useToast()` was re-rendering whenever any toast was added or removed because the context value was a new object literal.
**Action:** Always memoize context value objects with `useMemo` and wrap generic UI components in `React.memo` to ensure reference stability and skip unnecessary render cycles.
