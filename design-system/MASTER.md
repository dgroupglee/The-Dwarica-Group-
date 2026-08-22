# The Dwarica Group — UI/UX Pro Max Design System

This project-specific system translates the UI/UX Pro Max production guidance into the Dwarica Group's institutional visual language.

## Direction

- Institutional private-capital gravity with restrained cinematic motion.
- Navy, obsidian, blue-gray, silver, and gold only; no neon or AI-purple gradients.
- Cormorant-style serif for conviction and display type, Outfit-style sans for interface copy, DM Mono-style labels for technical metadata.
- Motion should clarify hierarchy and state, not compete with the content.

## Interaction rules

- Every interactive element has a visible keyboard focus state and an accessible name.
- Use native buttons, links, labels, inputs, and select controls before custom behavior.
- Preserve semantic state in text or attributes; never communicate state through color alone.
- Long headings, identifiers, chips, and badges must wrap without clipping.
- Reduced-motion users receive the same content and state with transitions removed.
- Keep hover states subtle and touch-safe; no pointer-dependent interaction is required for completion.

## Component rules

- Primary actions use the gold institutional accent with dark navy text.
- Secondary actions use transparent dark surfaces with a quiet silver border.
- Search and sort controls share the same navy field, thin border, and gold focus treatment.
- Confirmations use concise DM Mono labels or Cormorant editorial copy and always include the next concrete step or timeframe.
- Icons are inline SVG with an accessible label; text glyphs are not used as interface icons.

## Responsive checkpoints

The layout must remain usable at 375px, 768px, 1024px, and 1440px. Grid content stacks before it becomes cramped, controls wrap, and no essential label is truncated.
