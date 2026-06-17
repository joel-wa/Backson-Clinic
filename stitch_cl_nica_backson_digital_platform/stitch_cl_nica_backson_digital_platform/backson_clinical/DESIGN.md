---
name: Backson Clinical
colors:
  surface: '#fafaf4'
  surface-dim: '#dadad5'
  surface-bright: '#fafaf4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ee'
  surface-container: '#eeeee9'
  surface-container-high: '#e8e8e3'
  surface-container-highest: '#e3e3de'
  on-surface: '#1a1c19'
  on-surface-variant: '#404941'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f1f1ec'
  outline: '#707970'
  outline-variant: '#c0c9be'
  surface-tint: '#2a6a3f'
  primary: '#003215'
  on-primary: '#ffffff'
  primary-container: '#004b23'
  on-primary-container: '#79bb87'
  inverse-primary: '#93d6a0'
  secondary: '#396a00'
  on-secondary: '#ffffff'
  secondary-container: '#acf766'
  on-secondary-container: '#3d7100'
  tertiary: '#282b2a'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e4140'
  on-tertiary-container: '#aaadab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aef2bb'
  primary-fixed-dim: '#93d6a0'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#0b5229'
  secondary-fixed: '#acf766'
  secondary-fixed-dim: '#91da4d'
  on-secondary-fixed: '#0d2000'
  on-secondary-fixed-variant: '#2a5000'
  tertiary-fixed: '#e1e3e1'
  tertiary-fixed-dim: '#c5c7c5'
  on-tertiary-fixed: '#191c1b'
  on-tertiary-fixed-variant: '#444746'
  background: '#fafaf4'
  on-background: '#1a1c19'
  surface-variant: '#e3e3de'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for Clínica Backson is rooted in the "Corporate / Modern" movement, specifically tailored for the healthcare sector. The brand personality is professional, reliable, and deeply human. It prioritizes clarity and efficiency to instill confidence in patients and practitioners alike. 

The visual narrative uses a "Clinical Minimalism" approach: large amounts of white space to suggest cleanliness, a refined color palette derived from the logo, and high-contrast typography for maximum accessibility. The goal is to create an interface that feels calm and organized, reducing cognitive load for users who may be in stressful health-related situations.

## Colors
The palette is built upon the brand’s signature greens. 

- **Primary:** A deep forest green (#004B23) used for headers, primary actions, and authoritative elements to communicate stability and tradition.
- **Secondary:** A vibrant leaf green (#70B62C) used sparingly for accents, success states, and calls-to-action that require a "friendly" touch.
- **Surface & Neutrals:** The UI leans heavily on a "light" mode default. Surfaces use a very soft tint (#F8FAF8) to separate sections without the harshness of pure white. Text is set in a deep graphite (#1A1C19) rather than pure black to improve long-form readability while maintaining high contrast.
- **Accessibility:** All color combinations for text and interactive elements must pass WCAG AA standards.

## Typography
This design system utilizes a dual-font strategy. **Montserrat** is used for headlines to provide a confident, geometric, and modern presence that aligns with the logo's weight. **Inter** is the workhorse for body text and labels, chosen for its exceptional legibility in digital clinical environments.

Hierarchy is strictly enforced. Large display titles are used for landing sections, while body text maintains a generous line height (1.5x) to ensure patients can easily read medical instructions or appointment details. For mobile devices, headlines scale down to prevent awkward line breaks while maintaining their weight.

## Layout & Spacing
The layout follows a **fluid grid** model based on an 8px square baseline. 

- **Desktop:** 12-column grid with a maximum container width of 1200px. Margins are generous (48px) to emphasize the "clean" medical aesthetic.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins. 

Spacing between elements (Stacking) uses a geometric scale. Information-dense areas (like medical records) use `stack-sm`, while landing pages and general navigation use `stack-lg` to create a premium, unhurried feel.

## Elevation & Depth
To maintain a "Clinical" feel, this design system avoids heavy shadows. Hierarchy is achieved through **Tonal Layers** and **Low-contrast outlines**.

- **Level 0:** The base background (#F8FAF8).
- **Level 1:** Cards and containers in pure white (#FFFFFF). These use a thin 1px border in a soft grey (#E1E4E0) rather than a shadow to define their boundaries.
- **Level 2:** Modals and Popovers. These use an **Ambient Shadow**: a very soft, highly diffused shadow (Blur: 20px, Opacity: 4%) with a slight Primary color tint to make them appear to float naturally above the interface.

## Shapes
The shape language is "Rounded" to soften the clinical precision and appear more approachable to patients. 

A standard 8px (0.5rem) radius is applied to buttons, input fields, and small cards. Larger containers and sections use a 16px (1rem) radius (`rounded-lg`). For interactive elements that act as tags or status indicators (Chips), a full pill-shape is used to distinguish them from actionable buttons.

## Components

### Buttons
Primary buttons use the Primary Green (#004B23) with white text. Secondary buttons use a transparent background with a Primary Green border. All buttons have a height of 48px to be "finger-friendly" for mobile accessibility.

### Input Fields
Inputs are defined by a light grey border that turns Primary Green on focus. Labels always sit above the field in `label-md` weight. Errors are displayed in a high-contrast red, accompanied by an icon for accessibility.

### Cards
Medical service cards or practitioner profiles use a white background with a 1px border. On hover, the border weight does not change; instead, a very subtle Level 2 ambient shadow is applied to indicate interactivity.

### Status Chips
Used for appointment statuses (e.g., "Confirmado", "Pendente"). These use the Secondary Green for positive states and a soft neutral for others, always using a pill-shaped radius.

### Lists
Lists of medical exams or history should include generous vertical padding (16px) and a subtle horizontal divider to prevent visual crowding.