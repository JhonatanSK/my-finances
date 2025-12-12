# UI/UX Refactor Specification for Financial Reports App

## 1. Header Refactor
- Disable Expo Router native header and create custom header component.
- Ensure consistent appearance across screens.
- Remove path-like default titles.
- Custom header includes back button, title, optional subtitle, and action icons.

## 2. Bottom Navigation
- Remove default explore tab.
- Add icons to existing tabs.
- Optionally add Snapshots tab.
- Enhance styling with rounded edges and shadows.

## 3. Projection Accordion
- Collapse long monthly projection lists.
- Show preview of first 3 months when collapsed.
- Smooth expand/collapse animation.

## 4. General UI Enhancements
- Improve card padding and spacing.
- Add separators between form sections.
- Add tooltips for inputs.
- Maintain existing color palette.

## Implementation Notes
- Update _layout.tsx to remove tabs.
- Create reusable components for headers, cards, and accordions.
