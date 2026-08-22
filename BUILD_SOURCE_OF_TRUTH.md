# The Dwarica Group Website Build Source Of Truth

## Enforcement Rule

Every interaction, animation, section, feature, and content change must trace back to a specific instruction in this document. Do not add effects, sections, copy, layouts, or functionality not explicitly described here, even if it seems like an improvement. Confirm with the founder first.

## Brand Positioning

- The Dwarica Group is a serious multi-strategy private investment firm and family office.
- The site must feel institutional, restrained, powerful, and credible.
- It should sit closer to Blackstone, KKR, Apollo, Carlyle, Cascade Investment, Walton Enterprises, Bezos Expeditions, and Thiel Capital than to a startup or consumer marketplace.
- Preserve the existing navy, blue, gray, silver, and gold institutional palette.
- Preserve the existing typography direction: Cormorant-style serif, Outfit-style sans, and DM Mono-style technical labels.
- Public-facing language must never expose backend mechanics, sourcing logistics, financing structure, margin mechanics, or operational strategy.
- Eliminate broker positioning from client-facing pages. Market listings should read as available inventory, not requests to source.

## Phase 1 Scope

Phase 1 is the only current build scope until explicitly approved otherwise.

- Upgrade the existing landing page motion and interaction layer.
- Preserve existing copy, section order, structure, colors, and typography.
- Do not rebuild from scratch.
- Do not create the Market section yet.
- Do not build accounts, Supabase, favorites persistence, or dashboard yet.
- Stop after Phase 1 and summarize changes file by file.

## Phase 1 Required Interactions

- Add scroll-linked word or line reveals on the hero headline and manifesto-style sections.
- Use headline-tier reveals only for major text, not ordinary body copy.
- Add selective fast decrypt/scramble reveals on section eyebrow labels or major headings.
- Add subtle parallax on existing background glow or mesh layers.
- Add staggered reveal behavior to grids and repeated cards.
- Convert the Seven Strategies section into a numbered accordion where one strategy is expanded at a time.
- Make inactive strategies subtly recede when another strategy is expanded.
- Replace the static How We Build AUM list with a circular/orbital flywheel diagram on desktop.
- Use a clean vertical fallback for the flywheel on mobile.
- Add a sticky floating Request Allocation CTA that appears after the hero section.
- Add subtle magnetic hover behavior to primary CTA buttons.
- Add a live multi-city clock for New York, London, and Dubai.
- Add count-up animation on hero stats.

## Performance Rules

- Use IntersectionObserver where possible.
- Use requestAnimationFrame for scroll or pointer effects that need frame coordination.
- Keep all motion lightweight, smooth, and hardware-friendly.
- Do not block scrolling, typing, clicking, or normal page responsiveness.
- Avoid heavy scroll listeners, layout thrashing, high GPU strain, or janky effects.
- Every animation must degrade gracefully.
- Test the page in-browser and verify there are no JavaScript console errors before calling work complete.

## Market Section Scope For Later Phases

The Market section begins only after Phase 1 is approved.

- Main nav has one Market tab.
- No Market dropdown.
- Market links to one gateway page.
- Gateway has exactly three doors: Timepieces & Fine Jewelry, Automobiles, and Consign.
- Do not create a fourth Jewelry door.
- Jewelry belongs inside Timepieces & Fine Jewelry.

## Market Mobile Rule

All Market gateway tiles and listing grids must reflow cleanly to a single column on mobile. Hover and lift interactions must adapt naturally to tap, focus, and touch behavior on mobile instead of relying only on desktop hover.

## Timepieces & Fine Jewelry Positioning

- Present finished luxury watches and finished fine jewelry pieces.
- Include watches, Cuban links, tennis bracelets, diamond rings, chains, and comparable premium pieces.
- Do not position The Dwarica Group as a custom jeweler.
- Custom jewelry requests may exist as a secondary inquiry path, not the core identity.
- Use real diamond grading language such as SI1, SI2, VS1, VS2, VVS1, and VVS2.
- Never include moissanite.
- Listings must show real photo, name/reference, price, and availability/ship-by language.
- Avoid default "contact for pricing" positioning.
- Avoid any language implying the firm will go find the item.

## Automobiles Positioning

- Automobiles are presented by model with multiple trim, mileage, and configuration options.
- Each configuration should have real pricing or a real price range.
- Inquiry language should feel like confirming the exact unit and delivery logistics, not starting a search.
- Logged-in depth can later include VIN-level detail, ownership count, and condition history.

## Consign Positioning

- Consign is an intake door, not a gallery.
- The page should be calm, quiet, and private.
- Include item type, photo upload, condition description, and desired asking price.
- Motion should be minimal.

## Account And Favorite Rules For Later Phases

- No forced signup wall.
- No general cold "Create Account" funnel as the main experience.
- Account creation is framed as private access being unlocked by a real action.
- Account creation can be triggered by listing inquiry, consign request, favorite/save action, capital inquiry, custom jewelry consultation, or Allocation Desk interaction.
- If an anonymous visitor clicks favorite, the account is created silently in that same action. They should never hit a "please log in to favorite" wall.
- Favorites must feel valuable, not like ordinary bookmarks.
- Favorites support off-market priority access, portfolio valuation tracking, one-click Allocation Desk communication, advisor continuity, and early release windows.

## Dashboard Rules For Later Phases

- Build one universal dashboard shell.
- Do not create different dashboard layouts for different user types.
- The three persistent zones are Activity, Firm Pulse, and Discover.
- Activity reflects the individual user's real history.
- Firm Pulse is shared institutional content visible to every account holder.
- Discover adapts based on behavior and favorites.

## Build Sequence

1. Complete and verify Phase 1 landing page motion and interaction upgrades.
2. Stop and summarize changes file by file.
3. Wait for explicit approval.
4. Build Market gateway and three doors as static/front-end pages.
5. Wire account logic, favorites, and Supabase only after Market pages are approved.
6. Build the full dashboard after account logic is approved.
