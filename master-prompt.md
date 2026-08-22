# THE DWARICA GROUP — MASTER BUILD PROMPT
## Version 3.0 — Full Platform Specification
### 60,000+ Character Authoritative Build Document

---

> **READ THIS ENTIRE DOCUMENT BEFORE WRITING A SINGLE LINE OF CODE.**
> This is not a suggestion list. This is a precise, sequenced specification for a real platform being built for a real operating firm. Every section has been deliberately written. Every decision has a reason. Do not add features not listed here. Do not remove features that are listed. Do not substitute your own aesthetic judgment for the decisions made here. If something is genuinely ambiguous, stop and ask — do not guess and build.
>
> The single most important failure mode to avoid: **building something visually weak because you defaulted to "safe" generic animations** (cards fading up, sections appearing on scroll, buttons changing color on hover). That is not what this document is asking for. This document is asking for a genuinely extraordinary interactive experience that makes someone stop scrolling, look up from their phone, and say "who built this?" while simultaneously feeling like they just landed on the private digital presence of a firm that manages billions. Both of those things at once. That is the target. Do not settle for less.

---

## SECTION 0 — WHO THIS IS FOR AND WHAT WE'RE BUILDING

**The Dwarica Group (DGroup)** is a New York-based multi-strategy private investment firm and family office. Founded by twin brothers William and Dion Dwarica — built from zero, no inherited capital, no institutional backing, no handouts. Every deal sourced, every asset brokered, every position held came from execution, relationships, and aggressive multi-vertical strategy.

The firm operates across seven active strategies simultaneously:

1. **Commercial Real Estate** — distressed acquisitions, NNN lease assets, multi-family conversions, value-add plays
2. **Residential Real Estate Wholesale & Acquisition** — off-market sourcing, assignment fees, buy-and-hold
3. **Private Equity / Business Acquisitions** — SMB buyouts in the $200K–$2M SDE range, seller-financed structures
4. **Capital Markets** — equities, options, prediction markets, thematic macro positioning, active trading desk
5. **Luxury Automotive** — exotic and ultra-luxury vehicle brokerage, zero inventory risk
6. **Watches & Fine Jewelry** — private client sourcing through NY dealer credentials (ST-120 Resale Certificate, DTF-17 Certificate of Authority)
7. **Entertainment & IP (Glee Music Collective)** — sync licensing, music publishing, artist development, independent label infrastructure

**The identity we are building toward:** this site must read as the early-stage version of BOTH an institutional private equity mega-fund (Blackstone, KKR, Apollo, Carlyle — firms with hundreds of billions in AUM, real gravity, real infrastructure) AND a serious single-family office (Walton Enterprises at $225B+, Cascade Investment/Bill Gates at $170B+, Bezos Expeditions at $100B+, Thiel Capital, Hillspire). We are not a startup. We are not a marketplace. We are not a brokerage website. A visitor — whether an accredited investor looking to deploy capital or a luxury client looking to buy a Richard Mille — should land on this site and assume, without being told, that real institutional-grade money and infrastructure sit behind it.

**We are currently two people executing at extraordinary velocity.** The site must make us look like a firm that has been operating for decades. This is not deception — this is positioning. Every great institution looked like this on day one.

---

## SECTION 1 — THE INTERACTION STANDARD (READ THIS BEFORE ANYTHING ELSE)

The six websites below are your visual and interaction references. Before writing any code, visit every single one of them in a real browser. Scroll through them slowly. Move your cursor. Click things. Feel how the page responds to your presence. Understand the choreography, the pacing, the restraint. Then close them and build something at that standard.

### The Six Reference Sites

- **https://www.jobyaviation.com**
- **https://jeskojets.com**
- **https://www.ciridae.com**
- **https://aino.agency**
- **https://steven.com**
- **https://sakazuki.io**

### What to take from each — precisely

**From Jesko Jets:**
The most important reference. Study the hero section carefully. The headline text does not just appear — each word fades from almost invisible (roughly 15% opacity, slightly blurred) to fully sharp and opaque as it scrolls into the viewport. The words do this one at a time with a stagger of approximately 35ms per word, so the headline feels like it's being spoken to you rather than printed. This word-by-word reveal must be on every major heading, manifesto statement, and pull-quote on our site — not body text, only headline-tier copy.

Also from Jesko: there is a pill-shaped CTA button ("Book the Flight") that appears once you scroll past the hero and then stays with you for the ENTIRE rest of the page, fixed in the bottom-right corner of the viewport. It never gets in the way, never covers important content, fades in smoothly the first time it appears, and is always reachable. This is the pattern for our "Request Allocation" floating button.

Also from Jesko: the footer/final section has a slowly auto-rotating 3D monochrome globe with a thin orbital trace line around it, rendered as a WebGL or CSS 3D object. It does not need to be interactive — it just slowly turns, as if the earth itself is confirming that this firm operates globally. We want this exact element in our site.

Also from Jesko: where sections transition, there is a crossfade/overlap pattern rather than a hard cut or a standard scroll. Content from the outgoing section lingers at decreasing opacity while the incoming section content builds in — creating a sense that you are flowing through experiences rather than clicking through pages.

**From Ciridae:**
Two things specifically. First: every major section heading (the `<h2>` level headings, not eyebrow labels, not body text) does a scramble-to-resolve animation when it enters the viewport. The text displays as random alphanumeric characters first, then rapidly resolves letter-by-letter into the real text over approximately 600ms. It happens once per heading, never repeats, and is over quickly enough that it reads as a signature reveal rather than an animation to wait for. This must be on every `<h2>` equivalent on our site.

Second from Ciridae: the numbered accordion pattern. Their features/products section shows items 01, 02, 03, 04 as a panel. Only ONE panel is expanded at a time — it shows its full description, an image or supporting visual, and a detail block. The other three panels sit collapsed, showing only their number and a short title — but importantly, the collapsed panels are NOT invisible or hidden. They are visible, they are present, they are just compact. When you click a different one, the current open panel smoothly collapses (height transition, opacity fade) and the newly selected one opens with a corresponding smooth height and opacity expand. The visual effect is that one idea dominates the screen at a time. This is the exact pattern for our Seven Strategies section.

**From Joby Aviation:**
Full-bleed cinematic photography with zero card borders, zero drop shadows breaking the immersion. When they show a feature or use case, there is a large image taking up most of the viewport, with a small teaser thumbnail peeking in from the corner showing what the next image will be. This corner-peeking teaser pattern creates horizontal story energy even on a vertically-scrolling page. The copy per section is extremely sparse — one bold declarative statement, never a paragraph, never an explanation unless you scroll down to seek it. This pacing principle must inform how dense our content sections are: if a section can say it in 8 words, it should.

**From Steven.com:**
The central visual metaphor on steven.com is a circular rotating diagram — labels arranged in an orbit around a central hub, connected by a thin ring. This exists to show that disparate things (Creator Media, Creator Community, Creator Products, Creator Tech) all connect to one central system. We need this exact visual pattern for our AUM Flywheel section, which currently renders as a static vertical list. It must become a real circular/orbital diagram in SVG or canvas — not a CSS hack, a proper geometric circle with our steps arranged equidistantly around it, connected by a thin gold ring line, with the label "Compounding Capital" or "AUM Engine" in the center. On desktop it renders as the circle. On mobile it falls back to a vertical stack.

Also from Steven.com: the overall confidence of having the founder's image as a literal silhouette in a glowing particle sphere. We are not doing this literally, but the principle — the principals are real people, the firm has faces — should inform how we present William and Dion in the about/principals section.

**From Sakazuki.io:**
The floating "MINT" button that persists through the entire scroll. Also the numbered card system with expandable detail — same accordion principle as Ciridae reinforces this. Also the social proof wall of member names rendered as running text — we will NOT use this now (we don't have enough account holders to make it meaningful) but the architectural slot for it should exist so we can turn it on later.

**From Aino Agency:**
DO NOT implement the ASCII generative canvas. DO NOT implement anything that reshapes based on cursor in a way that generates typography/art. These read as creative agency, not private equity. What to take from Aino: the radical confidence of sparse navigation (minimal top nav, almost nothing there — let the content do the talking), and the overall principle that negative space is a power move, not a design failure.

### The Performance Constraint — Non-Negotiable

Every single interaction above must run at 60fps on a standard modern MacBook or mid-tier Windows laptop. This means:

- Use `transform` and `opacity` for ALL animations — these are GPU-composited and do not trigger layout. Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, or any layout property directly in animation.
- Use `will-change: transform, opacity` on elements that will animate, but only on those elements, and remove it after animation completes.
- Use `IntersectionObserver` for scroll-triggered reveals — NEVER a raw `window.addEventListener('scroll', ...)` that runs a calculation on every single pixel of scroll movement.
- Use `requestAnimationFrame` for any continuous animations (the rotating globe, any cursor-tracking effects). Never use `setInterval` for visual updates.
- Debounce all resize handlers (minimum 100ms debounce).
- Throttle any cursor-position tracking to a maximum of 60 calls per second using a simple timestamp check inside `requestAnimationFrame`.
- The scramble/decrypt text effect: pre-generate the random character sequences at component initialization time, not during the animation loop. Store them in an array and step through the array in `requestAnimationFrame` — do not call `Math.random()` on every frame.
- All images (gallery, door tiles, listing photos) must be lazy-loaded (`loading="lazy"` at minimum, or IntersectionObserver-based if using dynamic content).
- The 3D globe: use CSS 3D transforms (`rotateY`) on a flat SVG sphere illustration if true WebGL is too heavy. A slowly rotating sphere illusion achieved through CSS perspective is acceptable and much lighter than a Three.js scene. Only use WebGL if you are confident you can keep the frame budget under 2ms on the GPU.
- Test: after building any animation, open Chrome DevTools → Performance tab → record 5 seconds of scroll. If you see any frames taking longer than 16ms (below 60fps), you have a performance problem. Fix it before moving on.

---

## SECTION 2 — THE FIRM SITE (LANDING PAGE)

### Current State

The current site lives at https://dwaricagroup.vercel.app. It uses:
- **Colors:** navy `#0A1628` as primary dark background, `#0E1E38` and `#162448` as secondary darks, white `#FFFFFF` and paper `#F5F7FA` for light sections, gold `#B8892A` and `#D4A840` as accent, blue accent `#2D5BE3`
- **Typography:** Cormorant (serif display), Outfit (sans body), DM Mono (monospace labels)
- **Structure:** a long-scroll single page with sections for hero, brand bar, "Our Lens on Private Markets," "Why Invest," AUM Flywheel, The Firm/Principals, Seven Strategies, Capital Markets Desk, Asset Activity, Vision, Join The Firm, Contact

**DO NOT change the color palette. DO NOT change the typography. DO NOT reorder sections. DO NOT rewrite copy.** This phase is purely adding a motion and interaction layer on top of the existing structure.

### The Motion System — Build Exactly This

#### 1. Word-by-Word Headline Reveal

Apply to: every `<h1>`, every `<h2>`, every element with class `.sh` or `.sec-title` or equivalent, every large italic manifesto/quote statement, every hero title element.

Do NOT apply to: body paragraphs, captions, labels, nav items, button text.

Implementation:
```javascript
function wrapWordsInSpans(element) {
  const words = element.textContent.split(' ');
  element.innerHTML = words.map(word => 
    `<span class="word-reveal" style="opacity:0.08; display:inline-block; transition: opacity 0.5s ease, filter 0.5s ease; filter: blur(4px);">${word}</span>`
  ).join(' ');
}

// Use IntersectionObserver — when heading enters viewport,
// stagger opacity + blur from 0.08/4px to 1/0px with 35ms delay per word
```

The words should feel like they are brightening and sharpening into existence, not appearing from nowhere. Start at 8% opacity and 4px blur, end at 100% opacity and 0px blur. Stagger 35ms between words. Total reveal time for a 6-word headline should be approximately 700ms.

#### 2. Scramble/Decrypt on Section Headings

Apply to: `<h2>` elements only. Not `<h1>`, not eyebrow labels, not body text.

Implementation:
- Pre-generate an array of random character sequences for each target length
- When the element enters viewport (IntersectionObserver), start a `requestAnimationFrame` loop
- On each frame (or every 2-3 frames for performance), replace 2-3 characters with their real counterparts, working left-to-right
- Full resolution in 600ms maximum
- Use a character set of: uppercase letters A-Z and numbers 0-9 for the random state
- Fire once and never again — use a `data-scrambled="true"` flag to prevent re-triggering

#### 3. Parallax on Background Glow Layers

All the radial-gradient glow `<div>` elements that currently sit absolutely positioned and completely static should shift at approximately 15% of the scroll speed of the main content. If the user scrolls 100px, the background glow moves 15px in the same direction. This is a subtle depth effect — the viewer should feel it more than see it consciously.

Implementation: use a single `requestAnimationFrame` loop that reads `window.scrollY` once per frame and updates `transform: translateY(${scrollY * 0.15}px)` on each glow layer. Do NOT update DOM transforms in a raw scroll event listener — batch them all in one rAF callback.

#### 4. Staggered Grid Card Reveal

Apply to: every grid of cards (Why Invest 8-card grid, Seven Strategies grid, Vision pillars, Join The Firm cards, Capital Markets instrument cards).

Implementation: use IntersectionObserver on the GRID CONTAINER (not individual cards). When the container enters viewport, iterate through child cards and apply a CSS class that transitions them from `opacity: 0; transform: translateY(20px)` to `opacity: 1; transform: translateY(0)`, with each card delayed by 70ms more than the previous one.

This is NOT a generic "fade up" effect if executed correctly. At 70ms stagger across 8 cards, the cascade takes 560ms total and creates the visual impression of a wave of content arriving — it reads as intentional and choreographed, not automatic.

#### 5. Seven Strategies — Numbered Accordion (Ciridae Pattern)

This is the most important interactive element on the firm site. The current grid of seven strategy cards must become a numbered accordion panel system following this exact behavior:

**Visual layout on desktop:** a full-width container. On the left side (approximately 40% width), a vertical stack of 7 numbered panels — 01 through 07. Each shows its number in large Cormorant italic (4rem, very low opacity when collapsed) and its title in 13px Outfit medium. On the right side (approximately 60% width), the expanded detail view for whichever panel is currently selected — a large panel showing the strategy's full description, ROI thesis, and any relevant detail.

**Interaction:** clicking a numbered panel on the left updates the right panel's content with a crossfade (outgoing content fades to 0 opacity over 200ms, incoming content fades in over 300ms). The left stack does NOT change height or layout when selections change — only the right panel's content changes. The currently active panel's number highlights in gold (`#D4A840`), while inactive panels stay at roughly 35% opacity.

**On mobile:** the accordion collapses to a standard vertical expand/collapse per item. One item expanded at a time. Smooth height transition using `scrollHeight`-based `max-height` animation.

**Important:** strategy 01 must be open/active by default on page load. Do not show a state where nothing is selected.

#### 6. AUM Flywheel — Circular Orbital Diagram

The current "How We Build AUM" section shows 5 steps in a vertical list with downward arrow icons. This must become a circular orbital diagram.

**Implementation:**
- An SVG or canvas element, approximately 500x500px on desktop
- A thin circular ring line in gold (#D4A840) at roughly 80% of the container radius
- 5 nodes positioned equidistantly around the ring (at 72-degree intervals), each a small circle/dot in gold
- Label text for each node (the 5 step names) positioned just outside the ring, reading away from center
- The center label: "Compounding Capital" in Cormorant italic, approximately 1.2rem
- Thin connector lines from center to each node — or alternatively, the ring itself serves as the connector
- The diagram auto-rotates slowly (one full rotation every 30 seconds) using CSS `transform: rotate()` inside a `requestAnimationFrame` — the entire SVG rotates, so all labels rotate with it (they remain readable because the rotation is so slow that the slight angle is imperceptible)
- On hover over a node, that node's label expands in a small tooltip/callout with a 2-sentence explanation of that step's role in the flywheel
- Mobile fallback: `@media (max-width: 768px)` — hide the circular diagram, show the original vertical stack

#### 7. Sticky Floating "Request Allocation" Button

- Fixed position: bottom-right of viewport, approximately 32px from bottom and right edges
- Pill-shaped button: border-radius 999px, padding approximately 14px 28px
- Color: gold background (#D4A840), navy text (#0A1628), weight 600
- Text: "Request Allocation" with a small rightward arrow icon (→) after the text
- Behavior: initially hidden (`opacity: 0, pointer-events: none`). Appears (`opacity: 1, transition: opacity 0.4s ease`) once the user scrolls past the hero section (approximately 100vh from top). Stays visible for the rest of the page. On click: smooth scroll to the contact/inquiry form section.
- Never overlaps the footer — add a bottom offset that increases when the footer enters the viewport using IntersectionObserver on the footer element.

#### 8. Live Multi-City Clock in Navigation

In the navigation bar, between the logo and the nav links (or in the far right of the nav, before the CTA), display live updating local time for three cities:

```
NY 14:32  ·  LDN 19:32  ·  DXB 22:32
```

Styled in DM Mono, approximately 9px, letter-spacing 0.15em, color `rgba(255,255,255,0.35)`. Update every second using `setInterval` — this is acceptable because it's a text update, not a visual animation, and has zero layout impact.

Use the `Intl.DateTimeFormat` API with the appropriate timezone strings:
- New York: `America/New_York`
- London: `Europe/London`  
- Dubai: `Asia/Dubai`

Format as 24-hour time (HH:MM). Do not show seconds in the nav — save viewport space.

#### 9. Rotating 3D Globe in Footer/Vision Section

At the base of the Vision section or in the footer area, render a slowly rotating sphere that reads as "we operate globally":

**Implementation options in order of preference:**
1. A CSS 3D sphere: an `<div>` element with `border-radius: 50%`, `width` and `height` set to an appropriate size (approximately 300px), a radial gradient background simulating light-from-the-upper-left shading, and a continuous `rotateY` CSS animation. Overlay it with an SVG of a simplified world map (just the continental outlines in slightly lighter or darker color) that also rotates. This is the lightest possible implementation.
2. An actual Three.js sphere if you want genuine 3D — but ONLY if you can keep the frame cost below 2ms. Use a simple `MeshBasicMaterial` or `MeshLambertMaterial` (not `MeshStandardMaterial` which requires PBR lighting calculations), a sphere geometry with no more than 32x32 segments, and a monochrome texture map.

The globe must match the site's color palette — monochrome dark navy with gold trace lines for continent outlines and/or the orbital ring that Jesko Jets uses. Color: navy body (`#0A1628`), gold continent lines (`rgba(212,168,64,0.3)`), thin gold orbital ring around the equator.

Auto-rotation: one full rotation every 45 seconds. No interaction required.

#### 10. Count-Up Animation on Hero Stats

The three stats displayed in the hero section (7 Active Strategies, 10+ Markets, 2 Principals) should count up from 0 to their target values over 600ms once the hero section loads (not on scroll — these are already in view on page load).

For values with a "+" suffix, count to the number and then add the suffix when the count completes, rather than showing "0+" throughout the count.

Use `requestAnimationFrame` with an easing function (ease-out recommended: start fast, slow down as it approaches the final value) rather than a linear count.

#### 11. Cursor-Aware Subtle Tilt on Featured Cards

On the "Why Invest" grid cards and the "Join The Firm" cards, add a subtle 3D tilt effect when the cursor moves across them. The card should tilt a maximum of 5 degrees on X and Y axes based on cursor position relative to the card's center. This is the premium-feeling "card follows your cursor" interaction used on many high-end product sites.

Implementation:
```javascript
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const tiltX = ((e.clientY - centerY) / (rect.height / 2)) * 5; // max 5deg
  const tiltY = ((e.clientX - centerX) / (rect.width / 2)) * -5; // max 5deg, inverted
  card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  card.style.transition = 'transform 0.3s ease';
});
```

Add `transform-style: preserve-3d` to the card. The inner content should feel like it floats slightly forward from the card surface — add a `translateZ(10px)` to inner text elements to enhance the depth.

This effect is ONLY for desktop (pointer: fine media query). On touch devices, skip it entirely.

---

## SECTION 3 — THE MARKET SECTION (NEW BUILD)

### Architecture Overview

```
dwaricagroup.com/market               → Market Gateway (three door selection)
dwaricagroup.com/market/timepieces    → Timepieces & Fine Jewelry
dwaricagroup.com/market/automobiles   → Automobiles
dwaricagroup.com/market/consign       → Consign intake
```

The Market section is reached by clicking a "Market" nav item added to the existing site's top navigation. There is no dropdown menu. Clicking "Market" navigates directly to the gateway page. Nothing more complex than that — the decision was made deliberately and should not be second-guessed.

### Market Gateway Page

A full-screen, single-purpose page. Its only job: make the visitor choose one of three doors in under 5 seconds.

**Layout:** three equal-width tiles filling the viewport. On desktop, they sit side by side (33.33% each). On mobile, they stack vertically (one per viewport height, so each tile is full-screen as you scroll through).

**Each tile:**
- A full-bleed background photograph (placeholder: dark, moody, dramatically lit — a watch macro shot, a car motion blur shot, a jeweler's workbench/hands shot, for the three doors respectively). These photographs should have a dark overlay (`rgba(10, 22, 40, 0.45)`) so text reads clearly over them.
- The tile's name in large Cormorant serif at the vertical and horizontal center: "Timepieces & Fine Jewelry", "Automobiles", "Consign" — approximately 2rem, weight 500, color white
- One short supporting line beneath the name in Outfit 13px, weight 300, color `rgba(255,255,255,0.6)` — one sentence maximum, never a paragraph
- A small rightward arrow icon below the supporting line

**Hover state:** the tile's overlay lightens slightly (from 0.45 to 0.3 opacity, smooth 300ms transition), the background photograph scales to 1.04 (smooth 400ms transition), and the title text brightens very slightly. This is ALL that happens on hover. No borders, no pop effects, no 3D transforms, no glowing outlines. The restraint IS the luxury signal. A Bentley dealership does not have neon arrows.

**On click:** navigate to the corresponding door URL. This should be an `<a href>` not a JavaScript redirect, for SEO and accessibility.

**Page itself:** the navigation from the main firm site persists at the top (so the visitor always has a way back). Below the three tiles, there is NO additional content — the page ends after the tiles. No footer copy, no explanatory text, nothing. Arrive, choose, go.

### Door 1 — Timepieces & Fine Jewelry (dwaricagroup.com/market/timepieces)

#### What This Is

We source and sell luxury watches, fine jewelry chains, bracelets, rings, and finished diamond pieces through our NY dealer credential network. We do NOT design jewelry, we do NOT manufacture anything, we do NOT advertise ourselves as a custom jeweler. However, if a client wants a custom piece, we can facilitate it — this capability is available through an inquiry path but is NOT the headline.

**Diamond clarity language:** when specifying stones, use real GIA grades: SI1, SI2, VS1, VS2, VVS1, VVS2. Never use the word moissanite or suggest we deal in it, under any circumstances.

#### Inventory Philosophy

Every listing must read as something we have available RIGHT NOW. Never "we can source this for you." Never "contact us about availability." If it is listed, it is available. The price shown is a real price with our spread already embedded. A ship-by date is stated for every listing. If a piece requires a brief buyer-specific confirmation (rare, for very high-ticket items), the tone is ALWAYS "confirming delivery logistics" — never "checking if we have it."

#### Page Layout

**Header:** a full-bleed hero image (watch photography, dark and dramatic), overlaid with the page title "Timepieces & Fine Jewelry" in large Cormorant serif, and a one-line description.

**Filter/sort bar:** below the hero, a horizontal bar with filter options:
- Category pills: All | Watches | Chains & Links | Bracelets | Rings | Diamonds
- Sort: Price (Low–High) | Price (High–Low) | Newest | Brand

**The grid:** a responsive grid of listing cards. Desktop: 3 columns. Tablet: 2 columns. Mobile: 1 column. Cards have generous padding, dark background (`#111B2A`), a gold 1px top border accent on hover.

**Each listing card shows (anonymous visitor):**
- A high-quality product photograph (square or slightly portrait aspect ratio)
- Brand name in DM Mono 9px uppercase, gold, with letter-spacing
- Model/piece name in Cormorant serif 1.1rem
- Reference number or brief descriptor in Outfit 12px, muted
- Price in Cormorant serif 1.4rem (never "Contact for Price" as a default — a real number is always shown)
- Availability/ship-by: a small line in DM Mono 9px — "Available Now" or "Ships within [X] days"
- A small heart/bookmark icon in the top-right of the card — the Favorite button

**Each listing card ADDITIONALLY shows (logged-in account holder, revealed with an animated slide-down):**
- Box & papers status (Full Set / Papers Only / Watch Only)
- Number of previous owners
- Condition grade and condition notes
- Service history (if applicable)
- For watches: production year, reference variant, dial color
- For diamonds/jewelry: stone count, total carat weight, clarity grade (SI1/VS1/VVS2 etc.), metal type

**Card hover behavior:**
- The card lifts: `transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4)` — smooth 200ms ease
- The favorite icon becomes slightly more visible (increases opacity from 0.4 to 1)
- The top gold border accent transitions from 0 width to 2px (or transitions from `scaleX(0)` to `scaleX(1)`)

**Card click behavior:**
- The card expands IN PLACE into a larger detail view. Do NOT navigate to a new URL for this step. The expansion should feel like the card is "opening up" — the rest of the grid blurs slightly and dims to about 60% opacity, and the expanded card grows to show its full detail view (which includes the logged-in user's additional specs, or a prompt to "unlock full details" if anonymous).
- Expanding and collapsing use a smooth `max-height` + `opacity` transition.
- Clicking outside the expanded card collapses it back.

**The Custom Inquiry Path:**
At the bottom of the Timepieces page, below the grid, there is a quiet section with a single line: "Looking for something specific? We facilitate bespoke sourcing." — with an "Inquire" button. This button opens a modal/drawer with a simple form: "What are you looking for?" — a text field, contact fields, submit. This is the only place custom jewelry/bespoke sourcing is referenced. It does not appear on the listing cards themselves.

### Door 2 — Automobiles (dwaricagroup.com/market/automobiles)

#### What This Is

We source and sell exotic and ultra-luxury vehicles. We are NOT a dealership. We do NOT maintain a physical lot. We hold zero inventory risk. We match serious buyers with vehicles through our private dealer and collector network.

What distinguishes our automobile listings from watch listings: a single "listing" here represents a MODEL with multiple available configurations (trim level, mileage, color, year), NOT a single fixed unit. A Maybach S680 listing might show three configurations. A Rolls-Royce Ghost listing might show two. The client picks the configuration they want, which triggers an inquiry that allows us to confirm and lock the specific unit.

#### Vehicle Roster

The vehicles we present should include (but are not limited to): Maybach S-Class (S580, S680), Mercedes-Benz GLS-Class (GLS 450, GLS 580, GLS 63 AMG), Rolls-Royce Ghost, Rolls-Royce Cullinan, Bentley Bentayga, Bentley Continental GT, Lamborghini Urus, Ferrari Purosangue, McLaren 720S, Brabus-modified Mercedes vehicles, Porsche Cayenne Turbo GT. Do not invent makes/models beyond this — these are real vehicles within our actual brokerage scope.

#### Page Layout

**Header:** cinematic full-bleed video loop or dramatic still of an exotic vehicle in motion (if using a still, it should have a motion blur treatment applied in editing).

**Vehicle grid:** same 3-2-1 column responsive grid as Timepieces. Each card:
- Full-bleed hero image of the vehicle (landscape orientation, wide)
- Make and model in large Cormorant serif
- Configuration options shown as small selectable pills below the model name (e.g., "2023 · 23K mi · Black on Black", "2022 · 41K mi · White on Red")
- Selected configuration's price — updates with an animated tick/roll animation (numbers increment/decrement to new value) when the visitor switches configurations
- An "Inquire" button (not "Buy Now" — because a final unit confirmation is part of the process, but the framing is NEVER "we'll go look for this" — the framing is "confirm your order details")

**Hover and click:** same as Timepieces — lift on hover, expand in place on click.

**Account-gated additional info (for logged-in users):**
- VIN (when available at the listing stage)
- Number of previous owners
- Accident/damage history
- Service record completeness
- Import status (if applicable)

**The Compare Feature (account-only):**
If a logged-in user has favorited 2 or more vehicle configurations, a "Compare" button appears in the top-right of the page. Clicking it opens a full-width comparison panel with columns for each favorited config:
- Side-by-side photography
- Price
- Year / Mileage / Color
- Any VIN/history data available
- An "Inquire" button per column
The comparison panel can be dismissed to return to the grid.

#### "Inquire" Flow — Language Guide

The "Inquire" button on an automobile configuration should lead to a simple modal with:
- The selected vehicle name and configuration pre-filled
- Fields: Full Name, Email, Phone (optional), "Is there a specific timeline for delivery you need us to meet?" (optional textarea)
- Submit button: "Confirm Interest"
- Confirmation message: "Inquiry received. A principal will confirm your unit within 24 hours."

NEVER say "we'll start looking." NEVER say "we'll see what's available." ALWAYS imply the unit will be confirmed, not discovered.

### Door 3 — Consign (dwaricagroup.com/market/consign)

This is the quietest page on the entire site. It is an intake form, not a store. The person arriving here has something to sell and wants us to move it for them.

**The only elements on this page:**
1. A minimal hero — dark background, the word "Consign" in large Cormorant, and one line: "Have something exceptional to sell? We find the right buyer."
2. A clean, spacious intake form with fields:
   - "What are you selling?" — radio/pill options: Watch | Jewelry | Vehicle | Other
   - "Tell us about it" — text area: make, model, reference/VIN, condition, anything we should know
   - "Your asking price" — text input (optional, with note that we'll advise on market value)
   - "Upload photos" — file upload, accepts JPG/PNG/HEIC, multiple files
   - Name, Email, Phone fields
   - Submit button: "Submit for Review"
3. Confirmation: "Submission received. Expect to hear from us within 24 hours."

**Motion on this page:** ONLY the decrypt headline effect on "Consign" as it loads. The floating "Request Allocation" button from the firm site does NOT appear on this page — it would be incongruous. The Consign page has its own floating context (none needed). Keep this page calm, quiet, intimate. It is a private intake desk.

---

## SECTION 4 — ACCOUNTS, FAVORITES, AND THE DASHBOARD

### The Account Creation Philosophy

There is NO forced signup wall anywhere. Every visitor can browse everything without friction. No "you must create an account to see prices." No "log in to view listings." Zero friction browsing is required to protect SEO traffic and allow cold visitors to evaluate us.

An account is created automatically and invisibly when a visitor takes one of these specific actions:

1. Submits an inquiry on any listing (Timepieces, Automobiles)
2. Submits the Consign form
3. Clicks the Favorite/Save icon on any listing card (if not already logged in)
4. Expresses capital or investor interest via the Allocation Inquiry form on the firm landing page
5. Requests a custom/bespoke piece via the custom inquiry path at the bottom of Timepieces
6. Initiates the One-Click Allocation Desk chat on a specific saved item (see Favorites section)

The account creation should NEVER feel like a registration wall they hit. The messaging after any of these actions should read as "access has been unlocked for you" — e.g., "Inquiry received. We've opened your private access — check your email for login details." The account is a gift that arrives, not a form they navigate through.

No publicly visible "Create Account" or "Sign Up" button exists anywhere on the site. The login link sits in the nav bar, small and understated, visible but never prominent.

### The Favorite Button — Complete Behavior Spec

A small heart icon (or bookmark icon — design at your discretion, but it should feel premium and minimal) appears in the top-right corner of every listing card across the Timepieces and Automobiles doors.

**What clicking it does:**
1. If the visitor is already logged in: saves the listing to their favorites immediately, with a small satisfying visual confirm (the icon fills in, a brief scale pulse 1.0 → 1.2 → 1.0 over 200ms)
2. If the visitor is NOT logged in: saves the listing optimistically (the icon fills in as if it worked), AND silently creates an account in the background (call Supabase auth API to create the user), AND after 1-2 seconds shows a minimal tooltip/toast: "Saved. Check your email to access your private DGroup account." — the account was created, the favorite was saved to it, and the user learns about it after the fact as a pleasant surprise, not before as a requirement.

**What the Favorites system unlocks:**

Every one of these should be explained to the user somewhere accessible — ideally in a small "What you unlock by saving" tooltip or info panel that appears the FIRST TIME a user clicks favorite.

- **Saved Items List** — visible in their dashboard Activity zone
- **Off-Market Priority Access** — the system monitors for similar pieces entering the network before they go public; the user gets an email notification 24–48 hours before public listing
- **Portfolio Valuation Tracking** — saved items are tracked against real estimated market values, giving the user a "grail list portfolio" showing total estimated value and item-by-item value movement over time
- **One-Click Allocation Desk** — saving any item opens a direct, persistent, secure communication channel scoped to that specific asset. Not a general inquiry form — a dedicated thread for that piece/vehicle. This is displayed as a small chat icon on the saved item in their dashboard.
- **Personal Advisor Continuity** — every saved item connects the client to a named principal contact (William or Dion) who already knows the context of that piece, so no conversation ever has to start from scratch
- **Early Release Windows** — logged-in users with active favorites see new inventory 24–48 hours before it's shown to anonymous browsers. When they log in, there may be listings they can see that literally don't exist yet for non-logged-in visitors.
- **Private Notes** — a small text field on each favorited item in the dashboard: "Add a private note" — stores a personal reminder (e.g., "Sarah's birthday — confirm by November")
- **Automobiles Compare View** — unlocked when 2+ car configurations are favorited

### The Dashboard — Exact Architecture

**One universal shell. Three fixed zones. No user-type switching.**

The dashboard is built as ONE template. Every account holder sees the same three zones in the same positions. What changes is the DATA inside those zones — which is always and automatically derived from that specific user's real behavior. No manual logic, no branching, no "if investor show this / if buyer show that" conditional rendering on the template level. The template is universal. The data is personal.

**Zone 1 — Activity (top or left panel depending on layout)**
Contains: this person's favorites (listed), their submitted inquiries (with status: Received / In Progress / Closed), their consignment submissions if any (with status: Reviewing / Listed / Buyer Found / Sold / Payout Sent), their closed-deal history (permanently logged, e.g., "Vacheron Constantin Overseas 4500V — Delivered June 2026"), and any Allocation Desk chat threads they have open.

If a brand-new account has zero activity: Zone 1 shows a single line — "Your activity will appear here as we work together." — clean, minimal, no fake content, no placeholder cards.

**Zone 2 — Firm Pulse (always visible, identical for every user)**
A lightweight feed of firm-level updates — strategy notes, positions opened or closed, notable transactions completed, real estate or PE deals in progress — written in confident, institutional language. Think less "tweet" and more "quarterly letter paragraph." This zone exists so that EVERY account holder — whether they only ever bought one watch or whether they are a $500K capital partner — sees evidence that The Dwarica Group is a real, operating, multi-strategy institution. This builds quiet credibility from within the account, no explicit cross-selling needed.

This content is manually curated by the principals and written to feel like internal intelligence, not marketing copy. "Capital markets desk maintained active prediction market positions through the June rate announcement. Real estate pipeline added two pre-foreclosure targets in Nassau County." — that kind of register.

**Zone 3 — Discover (suggestions, personalized by behavior)**
- If they've favorited Market items: surface new arrivals in similar categories that arrived since they last logged in. "Two new Patek Philippe references added since your last visit."
- If they've expressed investor interest: surface relevant firm-side content — recent strategy updates, allocation availability signals.
- If they are brand new with zero history: show all three Market doors (visual tiles) and the firm's core positioning statement — an invitation, not a pitch.
- If they've favorited car configurations: show the Compare prompt prominently in this zone.

**Account-Gated Features Available from Dashboard:**
- Full listing depth (papers, condition, VIN) appears inline on any favorited item — not requiring a return to the Market page
- Compare panel launches from this zone (as described in Automobiles section)
- Portfolio valuation view — a simple value display: "Your grail list: estimated value $284,500" with item-by-item breakdown
- Direct Allocation Desk chat threads, one per saved item, accessible directly from Activity zone

---

## SECTION 5 — TECHNICAL ARCHITECTURE & BUILD SEQUENCE

### Backend — Supabase (Free Tier)

Use Supabase for all authentication, database, and real-time functionality.

**Why Supabase:**
- Genuinely free tier confirmed: 500MB database storage, 50,000 monthly active users, unlimited API requests
- One real caveat: the free project pauses after 7 consecutive days with zero database requests. Mitigate this with a lightweight keep-alive: set up a free Uptime Robot monitor (or similar) to ping the project's REST endpoint every 6 days. Zero cost. Prevents cold starts.
- Supabase handles email magic-link auth out of the box — this is exactly what we need for the "account created, check your email" flow
- Row-Level Security (RLS) is built in — use it to ensure users can only ever query their own data

**Database schema (minimum viable):**

```sql
-- users (managed by Supabase Auth, we extend with a profile table)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  first_name TEXT,
  account_type TEXT DEFAULT 'client', -- 'client' | 'investor' | 'seller'
  advisor_name TEXT DEFAULT 'William Dwarica'
);

-- listings (market inventory)
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT, -- 'timepieces' | 'jewelry' | 'automobiles'
  brand TEXT,
  model TEXT,
  reference TEXT,
  price INTEGER, -- in cents, to avoid float precision issues
  ship_by TEXT,
  available BOOLEAN DEFAULT TRUE,
  public_visible BOOLEAN DEFAULT TRUE,
  -- detailed fields (account-gated)
  papers_status TEXT,
  condition_grade TEXT,
  condition_notes TEXT,
  ownership_count INTEGER,
  service_history TEXT,
  year INTEGER,
  -- automobile-specific
  configurations JSONB, -- array of {trim, mileage, color, price, vin}
  -- photos
  photos TEXT[] -- array of storage bucket URLs
);

-- favorites
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, listing_id)
);

-- inquiries
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  configuration_id TEXT, -- for automobile config selection
  status TEXT DEFAULT 'received', -- 'received' | 'in_progress' | 'closed'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- consignments
CREATE TABLE consignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  item_type TEXT,
  description TEXT,
  asking_price TEXT,
  photo_urls TEXT[],
  status TEXT DEFAULT 'reviewing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- allocation_desk (per-asset chat threads)
CREATE TABLE allocation_desk_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  sender TEXT, -- 'user' | 'firm'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- firm_pulse (manually curated by principals)
CREATE TABLE firm_pulse (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT,
  published BOOLEAN DEFAULT FALSE
);
```

Enable Row-Level Security on all tables. `profiles`, `favorites`, `inquiries`, `consignments`, and `allocation_desk_messages` should only allow users to read/write their own rows. `listings` should be readable by all (public) for the public fields, and the detailed fields should require an authenticated session. `firm_pulse` should be readable by all authenticated users.

### Build Sequence — Follow In This Order

**Step 1 — Firm Site Motion Layer**
Take the existing site and add all motion/interaction from Section 2. Do not touch the Marketplace. Test in a browser. Check console for errors. Confirm every animation fires. Fix any errors. Only then proceed to Step 2.

**Step 2 — Market Pages (Frontend Only, No Database)**
Build the Gateway page and all three door pages as static front-end only. Listing cards use hardcoded placeholder data (you will write realistic placeholder data matching real luxury goods — real brand names, realistic prices, realistic specs — not "Lorem Ipsum Watch $99"). Inquiry and Consign forms submit to a simple email (use Formspree or similar free service for this step so the forms actually work). Favorite button is present and animates but does not persist. Test everything. Confirm all interactions work. Confirm mobile layouts work.

**Step 3 — Supabase Integration**
Set up the Supabase project. Create the schema above. Wire authentication (magic link email). Wire the Favorite button to actually persist to the database. Wire inquiry form submissions to create records in the `inquiries` table AND trigger account creation if the user isn't already logged in. Wire Consign form to `consignments` table. Wire Firm Pulse reads. Test the full account creation flow end to end.

**Step 4 — Dashboard**
Build the three-zone dashboard wired to real Supabase data. Build the Compare feature. Build the Portfolio Valuation view (for this step, valuations can be estimated based on listing prices — a real market data feed is future scope). Build the Allocation Desk chat threads. Test with at least two different test user accounts to confirm data is properly isolated per user.

### Before Calling Anything "Done"

For every step above, before reporting completion:
1. Open the page in a browser (not just "it compiled")
2. Open the browser console — there must be zero errors and zero warnings related to your code
3. Manually trigger every interactive element you built — click every button, scroll through, hover every card, submit every form
4. Resize the window from desktop to mobile width and confirm nothing breaks
5. If anything breaks or looks wrong, fix it before reporting completion
6. Only THEN report what was completed, file by file, with a summary of what changed

This step is non-negotiable. A previous version of this site had a JavaScript string escaping error that silently crashed the entire animation system — the page looked fine but nothing animated. Every animation appeared to "not work" because of one broken line. You are responsible for catching and fixing errors like this before telling me something is done.

---

## SECTION 6 — LANGUAGE RULES (FOLLOW EXACTLY, NO EXCEPTIONS)

These rules apply to every line of visible text on the entire platform. If you are writing placeholder copy, UI labels, button text, form labels, confirmation messages, error messages, empty states, or anything else the user reads — these rules apply.

1. **Never use the word "broker" or "brokerage" in client-facing copy.** We source, we acquire, we offer, we present — we never broker. The word broker implies middleman. We are the source.

2. **Never imply we are searching for or will go find something.** Always present tense: "available," "in our inventory," "ships within X days." Never future tense: "we'll look into it," "we can find this for you," "this can be sourced."

3. **Never expose backend operations.** No mentions of seller financing, acquisition mechanics, margin structure, sourcing networks, or operational strategy anywhere on the client-facing platform.

4. **Always write as if real institutional money is behind every statement.** "The Dwarica Group" not "we" or "us" in most formal contexts. "Our principals" not "the founders." "The firm" not "the company" or "the business."

5. **Confirm, don't hedge.** "A principal will confirm your unit within 24 hours" not "someone will get back to you." "Your inquiry has been received" not "we got your message."

6. **For automobiles specifically:** the Inquire flow is about confirming an order, not starting a search. Copy should always imply the vehicle exists and is available, and the inquiry step is a formality for logistics. Never "we'll check on availability."

7. **No moissanite. Ever.** If generating any jewelry-related placeholder copy, stick to real luxury stones: diamonds (with real clarity grades: SI1, SI2, VS1, VS2, VVS1, VVS2), sapphires, emeralds, rubies. Real metals: 18k gold, platinum, 14k gold, white gold.

8. **On the firm side:** never mention seller financing, SBA loans, wholesaling mechanics, trading strategies, or any detail about how deals are structured internally. The firm's public face is: we deploy capital across seven strategies, we grow AUM, we produce returns. The mechanics stay internal.

---

## SECTION 7 — PLACEHOLDER CONTENT STANDARDS

When you create placeholder listings for the Market section (needed to demonstrate the real layout and interactions before we populate with live data), use realistic, real data:

**Watch placeholders (minimum 8, ideally 12):**
- Patek Philippe Nautilus 5711/1A-010 · Stainless Steel · $180,000 · Full Set · Ships in 5 days
- Audemars Piguet Royal Oak 15500ST · Blue Dial · $145,000 · Papers Only · Ships in 3 days
- Richard Mille RM 055 · Titanium · $320,000 · Unworn · Full Set · Ships in 7 days
- Vacheron Constantin Overseas 4500V · Stainless Steel · $84,000 · Full Set · Ships in 4 days
- Rolex Daytona 116500LN · White Dial · $72,000 · Full Set · Ships in 2 days
- Patek Philippe Grand Complications 5270G · White Gold · $550,000 · Full Set · Ships in 10 days
- Rolex GMT-Master II 126710BLNR · Batman · $28,500 · Papers Only · Ships in 3 days
- Audemars Piguet Royal Oak Offshore 26470ST · Black Dial · $92,000 · Full Set · Ships in 6 days
- Richard Mille RM 11-03 · Rose Gold · $680,000 · Unworn · Full Set · Ships in 14 days
- Vacheron Constantin Traditionnelle 82172/000G · 18K Gold · $62,000 · Full Set · Ships in 8 days

**Jewelry placeholders (minimum 4):**
- 18K White Gold Cuban Link Chain · 26" · 12mm · VVS1 Diamond Set · $28,500
- Tennis Bracelet · 7" · 5.2 TCW · VS2 Round Brilliant Diamonds · Platinum · $42,000
- Diamond Solitaire Ring · 3.1ct Round Brilliant · VS1-F · 18K Yellow Gold · $68,000
- 10K Yellow Gold Miami Cuban Link · 24" · 20mm · 196g · $18,500

**Automobile placeholders (minimum 5 models, 2+ configs each):**

Mercedes-Maybach S680 (2 configs):
- 2023 · 11,400 mi · Black Exterior / Black Interior · $168,500
- 2022 · 23,800 mi · Designo White / Macchiato Beige · $149,000

Rolls-Royce Ghost (2 configs):
- 2023 · 8,200 mi · Salamanca Blue / Seashell · $298,000
- 2021 · 31,600 mi · Arctic White / Navy · $254,000

Lamborghini Urus (3 configs):
- 2023 · 6,400 mi · Arancio Borealis / Black · $218,000
- 2022 · 14,200 mi · Grigio Lynx / Black · $194,500
- 2021 · 28,900 mi · Bianco Monocerus / Red · $172,000

Bentley Bentayga Speed (2 configs):
- 2023 · 9,100 mi · Onyx Black / Linen · $231,000
- 2022 · 19,600 mi · Viridian / Tobacco · $198,500

McLaren 720S (2 configs):
- 2021 · 12,800 mi · Papaya Spark / Black · $242,000
- 2020 · 21,300 mi · Storm Grey / Alcantara · $218,500

---

## SECTION 8 — THE QUALITY BAR

The standard being built to is an Awwwards Site of the Day quality level of interaction design, combined with the institutional gravity of a Blackstone or KKR public-facing site, and the private exclusivity of a Walton Enterprises or Thiel Capital web presence.

That combination does not yet exist in the luxury goods + private equity crossover space. Carbon Key Collective (a competing site the firm has analyzed) is visually polished but architecturally shallow — they present an eight-category marketplace that lacks the institutional depth, the account system, the multi-strategy firm identity, and the real dealer credentials that we are building. The goal is not to match Carbon Key. The goal is to make Carbon Key look like a template website by comparison.

The site should make a first-time visitor — whether they arrived looking for a Vacheron or looking to co-invest in a business acquisition — feel like they have found something real, something rare, and something worth taking seriously immediately.

That is the bar. Build to it.

---

*End of Master Build Prompt — The Dwarica Group Platform v3.0*
*Total specification: approximately 62,000 characters*
*All decisions final unless explicitly revised by the principal*
