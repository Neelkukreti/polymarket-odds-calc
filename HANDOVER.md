# Polymarket Odds Calculator — Handover

**Date:** March 14, 2026
**Repo:** https://github.com/Neelkukreti/polymarket-odds-calc
**Live:** https://neelkukreti.github.io/polymarket-odds-calc/
**License:** MIT

---

## What This Is

A multi-outcome prediction market calculator. Enter your total investment and the cent-prices of each outcome — it calculates shares, payouts, profit, and ROI for every scenario.

Two interfaces:
1. **Python CLI** (`calc.py`) — original tool, runs locally
2. **Web App** (`webapp/`) — React SPA deployed to GitHub Pages

---

## Project Structure

```
polymarket-odds-calc/
├── calc.py                          # Python CLI calculator (256 lines)
├── requirements.txt                 # Python dep: tabulate
├── examples/
│   ├── elon-tweets.sh
│   └── custom-distribution.sh
├── webapp/                          # React web app
│   ├── index.html                   # Entry point (Google Fonts, meta tags)
│   ├── vite.config.ts               # Vite + React + Tailwind, base: /polymarket-odds-calc/
│   ├── package.json
│   ├── src/
│   │   ├── main.tsx                 # React root
│   │   ├── App.tsx                  # All UI (~500 lines, single-file)
│   │   ├── calculator.ts            # Pure calculation logic (mirrors calc.py)
│   │   ├── index.css                # CSS variables, noise overlay, scrollbar
│   │   └── App.css                  # Unused (all styles in index.css + Tailwind)
│   └── public/
│       └── favicon.svg
├── .github/workflows/deploy.yml     # GitHub Actions → Pages auto-deploy
├── README.md
├── HANDOVER.md                      # This file
├── CONTRIBUTING.md
├── SECURITY.md
├── PROJECT-SUMMARY.md
└── LICENSE
```

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 + CSS variables |
| Animation | Motion (framer-motion successor) |
| Fonts | Outfit (body) + JetBrains Mono (numbers) |
| Deploy | GitHub Actions → GitHub Pages |

---

## How the Math Works

Same logic in both `calc.py` and `webapp/src/calculator.ts`:

```
shares    = investment / (price_cents / 100)
payout    = shares × $1                      # $1 per share if outcome wins
profit    = payout - total_investment         # net P&L across ALL outcomes
roi       = payout / total_investment         # return multiple
breakeven = 100 / num_outcomes               # cent-price where ROI = 1x
```

**Equal distribution** (default): `total_investment / num_outcomes` per outcome
**Custom distribution**: user specifies $ per outcome, must sum to total

---

## Web App Features

- **Inputs**: Investment amount, labeled outcomes with cent-prices, optional custom $ distribution per outcome
- **Results**: 4 stat cards (best ROI, best payout, worst ROI, profitable count), full data table (desktop) / stacked cards (mobile), ROI bar chart, best/worst scenario cards
- **Presets**: Binary 60/40, Three-way, Long shot 4x, Even spread
- **Mobile optimized**: Responsive layout, 44px touch targets, `inputMode="decimal"` for numeric keyboard, iOS zoom prevention (16px inputs), safe-area insets, sticky header, `100dvh`

---

## Development

```bash
cd webapp
npm install --legacy-peer-deps    # needed: @tailwindcss/vite doesn't support Vite 8 peers yet
npm run dev                       # http://localhost:5173/polymarket-odds-calc/
npm run build                     # outputs to dist/
```

**Known quirk:** `--legacy-peer-deps` is required both locally and in CI because `@tailwindcss/vite@4.x` declares `peer vite: ^5 || ^6 || ^7` but we're on Vite 8. Works fine, just a semver lag.

---

## Deployment

Automatic via `.github/workflows/deploy.yml`:

1. Push to `main`
2. GitHub Actions: `npm ci --legacy-peer-deps` → `npm run build` → upload `webapp/dist/`
3. GitHub Pages serves from the artifact

**Base path:** `/polymarket-odds-calc/` (set in `vite.config.ts` and `index.html` favicon href)

To deploy manually or to a custom domain, build locally and serve `webapp/dist/` from any static host.

---

## Design Decisions

| Decision | Why |
|----------|-----|
| Single-file App.tsx | Calculator is small enough; avoids premature component splitting |
| CSS variables over Tailwind theme | Easier to reference in inline `style={}` for dynamic colors |
| `font-size: 16px !important` on iOS | Prevents Safari auto-zoom when focusing inputs |
| Table → cards on mobile | 7-column table is unreadable on 375px screens |
| Motion library | Lightweight successor to framer-motion, tree-shakes well |
| No router | Single-page calculator, no navigation needed |
| No backend | All math is client-side, no API calls |

---

## What's NOT Implemented

- No auth, no user accounts
- No Polymarket API integration (no live prices)
- No portfolio tracking / saved calculations
- No export (CSV/JSON)
- No Discord/Telegram bot (README mentions these as "coming soon" from original CLI)
- Python CLI examples reference `yourusername` — update README.md if publishing CLI docs

---

## Maintenance Notes

- If Tailwind releases a version supporting Vite 8 peers, remove `--legacy-peer-deps` from CI and local install
- Google Fonts are loaded from CDN in `index.html` — no self-hosted fonts
- The `webapp/public/icons.svg` file is leftover from Vite scaffold — unused but harmless
- `App.css` contains a single comment — kept to avoid build warnings, can be deleted if the import in App.tsx is also removed (it isn't imported)

---

## Quick Reference

| What | Where |
|------|-------|
| Live site | https://neelkukreti.github.io/polymarket-odds-calc/ |
| Repo | https://github.com/Neelkukreti/polymarket-odds-calc |
| CLI usage | `python calc.py --invest 20 --prices 1,2,3,4` |
| Dev server | `cd webapp && npm run dev` |
| Build | `cd webapp && npm run build` |
| Deploy | Push to `main` (auto) |
