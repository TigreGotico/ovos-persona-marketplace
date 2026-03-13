# Audit - OVOS Personas Marketplace
Date: 2026-03-13

## Known Issues
- `index.html:150` — External fonts (Syncopate, Outfit, Geist Mono) are loaded via Google Fonts. This requires an active internet connection, which might conflict with "fully offline" OVOS setups.
- `app.js:25` — Parsing is synchronous and blocks the main thread during initial load if `personas.jsonl` grows significantly.
- `app.js:120` — Persona descriptions are stripped during copying. This is intentional for configuration but may be confusing if not documented.

## Technical Debt
- Search logic is a simple array filter. For 50+ personas, it's fine, but for 500+ it will need debouncing or a fuzzy search library like `Fuse.js`.
- Skin CSS is partially in-lined in `index.html`. Moving it to a separate `skins.css` would improve maintainability.
- No automated validation for `personas.jsonl` schema.
