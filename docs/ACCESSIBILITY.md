# Accessibility and WCAG 2.1 AA Integration

StadiumIQ is engineered to fulfill WCAG 2.1 AA requirements, ensuring that fans, staff, and volunteers of all abilities can navigate the stadium safely.

## 1. Step-Free Avoidance Routing
The AI Decision Engine factors mobility profiles directly into pathfinding logic. When the accessibility profile is enabled (e.g. `Wheelchair` or `Stroller` selections):
- The route avoids escalators, stairs, and steep slopes.
- Lift and elevator locations are prioritized.
- Step-free access ramps are dynamically mapped.

---

## 2. ARIA Live Regions
All dynamic components that update automatically without page refreshes utilize standard ARIA announcements to notify screen readers.
- **Incident Alerts Panel**: Uses `aria-live="assertive"` to announce new emergencies immediately.
- **Queue Times & Crowd Densities**: Uses `aria-live="polite"` to announce flow state updates during natural pauses.

---

## 3. Keyboard Navigation and Contrast
- **Visual hierarchy**: Elements utilize a premium high-contrast theme meeting minimum contrast ratios of 4.5:1.
- **Focus Indicators**: Interactive widgets have visible focus states (`outline`) for keyboard navigability.
- **Accessible inputs**: Form components (e.g., in `AccessibilityAssistant`) have matching `<label>` elements with corresponding `htmlFor` identifiers.

---

## 4. Automated Auditing
Continuous accessibility testing is enforced via `jest-axe` within Jest. The `accessibility.test.tsx` file audits components dynamically to assert zero violations on builds.
