---
name: Kanpuriya Travel Narrative
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3f4948'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#707978'
  outline-variant: '#bfc8c7'
  surface-tint: '#2a6865'
  primary: '#003331'
  on-primary: '#ffffff'
  primary-container: '#004b49'
  on-primary-container: '#7ebab7'
  inverse-primary: '#95d1ce'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#2c2d2a'
  on-tertiary: '#ffffff'
  tertiary-container: '#424340'
  on-tertiary-container: '#b0afac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1eeea'
  primary-fixed-dim: '#95d1ce'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#084f4d'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e4e2de'
  tertiary-fixed-dim: '#c8c6c3'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474744'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system embodies a "High-End Desi" aesthetic—a deliberate juxtaposition of aspirational luxury and grounded, witty relatability. The target audience seeks the status of premium travel without the pretension, appreciating a brand that "speaks their language" (Hinglish) while looking like a million bucks.

The style is **Modern Luxury with a Editorial Twist**. It utilizes heavy whitespace and sophisticated typography characteristic of high-fashion magazines, but breaks the "fourth wall" with conversational, humorous UI copy. The emotional response should be one of immediate trust in the service quality, followed by a smirk at the relatable local wit. It is "Maharaja service at a Mohalla price."

## Colors

The palette is rooted in deep, intellectual tones contrasted by metallic warmth.

*   **Primary (Deep Teal):** Used for primary surfaces, headers, and heavy brand moments. It provides the "Trust" and "Premium" foundation.
*   **Secondary (Antique Gold):** Reserved for accents, active states, and call-to-action highlights. It represents the "Luxury" promise.
*   **Tertiary (Bone White):** The primary background color. It is warmer than pure white, feeling more like expensive stationery or ivory.
*   **Neutral (Charcoal):** Used for body text and structural borders to maintain high legibility and a grounded feel.

Color application should follow a 60-30-10 rule to ensure the Teal remains dominant while Gold acts as the "jewelry" of the interface.

## Typography

This design system uses a sophisticated typographic pairing to balance authority with approachability.

*   **Libre Caslon Text (Headlines):** A classic, editorial serif that communicates heritage and luxury. Large headlines should use tight tracking and high contrast against the Teal background.
*   **Plus Jakarta Sans (Body & UI):** A modern, soft geometric sans-serif that ensures the witty Hinglish copy feels friendly and readable. The roundness of the glyphs offsets the sharpness of the serif headings.

**Hierarchy Note:** Use serif for storytelling and destination titles. Use sans-serif for functional instructions, pricing, and the humorous "side-notes."

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container to maintain an "executive summary" feel on large screens, while margins expand fluidly.

*   **The 8px Rhythm:** All spacing (padding, margins, gap) must be multiples of 8px.
*   **Editorial Breaks:** Use wide 48px or 64px vertical stacks between sections to allow the photography and copy to "breathe," mimicking a luxury travel brochure.
*   **Mobile Reflow:** On mobile, the 12-column grid collapses to 4 columns. All `headline-xl` elements must scale down to `headline-lg-mobile` to prevent awkward word breaks in Hinglish phrases.

## Elevation & Depth

To maintain a "premium" feel, this design system avoids heavy shadows and instead uses **Tonal Layering and Fine Strokes.**

*   **Surface Hierarchy:** The base is Tertiary (Bone White). Elevated cards use a pure White background with a 1px solid border in a very faint Teal tint (5% opacity).
*   **Subtle Depth:** Where depth is required (e.g., a "Book Now" floating bar), use a single, highly diffused "Ambient Shadow" in the Primary Teal color at 8% opacity. This feels more organic and "branded" than a neutral grey shadow.
*   **Photography:** Images are the primary source of depth. Use subtle inner vignettes on hero images to make white serif text pop.

## Shapes

The shape language is **Structured & Softened**. 

We avoid sharp, aggressive corners to keep the brand approachable, but we also avoid hyper-rounded "pill" shapes which can look too "app-like" and casual for a luxury brand. A consistent `0.25rem` (4px) or `0.5rem` (8px) radius provides a tailored, high-end feel.

*   **Buttons:** Soft corners (8px).
*   **Images:** Small 4px radius to take the edge off, maintaining a "photograph" feel.
*   **Input Fields:** Minimalist 4px radius with a bottom-weighted focus state.

## Components

Components must balance "Five-Star UI" with "Local Flavor" copy.

*   **Buttons:** The Primary Button is solid Deep Teal with Gold text. The Secondary Button is a Gold outline with Deep Teal text. Labels should be short but punchy (e.g., "Chalo Bag Pack Karo" instead of "Book Now").
*   **Cards:** Travel destination cards feature full-bleed high-quality photography. The price is displayed in a Gold label, and the sub-copy should include a "Kanpuriya Fact" (e.g., "Paris vibes, but cheaper than a flight to Lucknow").
*   **Lists:** Used for itineraries. Icons should be thin-stroke Gold lines. Each list item should feel like a premium "step."
*   **Input Fields:** Use "floating labels" in the Serif font to make the form-filling experience feel like checking into a boutique hotel.
*   **Tooltips / Micro-copy:** This is where the brand personality shines. When a user hovers over a price, a tooltip might say, *"Don't worry, itne mein toh sirf ek sherwani aati hai."*
*   **Chips/Badges:** Use for "Best Seller" or "Cheap & Best" tags. These should use the Gold color with Deep Teal text in all-caps `label-md`.