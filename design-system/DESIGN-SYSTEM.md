# Synkope Design System

The Synkope visual system — tokens, components and usage rules — lives in this repo alongside the site it powers.

## Files

| File | Role |
|---|---|
| `css/tokens.css` | Single source of truth for color, type, spacing, radius, shadow, motion |
| `css/components.css` | Reusable component styles (`.s-btn`, `.s-card`, `.s-team`, `.s-form`, `.s-list`) |
| `css/style.css` | Existing page-level styles; continues to work via token aliases in `tokens.css` |
| `design-system.html` | Living documentation — see the system rendered in browser |

Load order in any page:

```html
<link rel="stylesheet" href="css/tokens.css" />
<link rel="stylesheet" href="css/components.css" />
<link rel="stylesheet" href="css/style.css" />
```

## Tokens at a glance

**Brand colors**

- `--s-primary` `#EB8822` — orange; actions, headings, identity
- `--s-secondary` `#1D5F81` — blue; body text, anchors
- Cream neutrals `--s-cream-1..4` — warm page backgrounds and section washes

**Typography**

- Headings — Inter 600
- Body — Open Sans 400 / 600

**Shape**

- Radius — `6 / 8 / 12 / 15` px
- Shadow — `soft / hover / nav / btn` (two-layer, warm)
- Spacing — 4 / 8 / 16 / 24 / 40 / 64 / 80 / 120

Open `design-system.html` in a browser for the full specimen.

## Conventions

- New code should use `--s-*` tokens and `.s-*` classes.
- Existing class names (`.btn`, `.service-card`, `.team-member`) still work; they now resolve through token aliases.
- Introduce a new token before hard-coding any color, radius, shadow or spacing value.

## Extending

Adding a new component:

1. Check `design-system.html` — is it really new, or a variant of `.s-card`?
2. Add the component class to `components.css`, composed from tokens.
3. Add a demo section to `design-system.html`.
4. Update this README if it introduces a new primitive.

## Versioning

The system is versioned with the site. Breaking token changes should be called out in the PR description.
