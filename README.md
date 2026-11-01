# StratBI Pro v3.0 — تصمیم‌یار مدیریت استراتژیک

React + Vite implementation of the **StratBI Pro v3.0** strategic decision dashboard:

- **ماژول ۱ — صنعت (پورتر ۲۰۰۸):** مرز صنعت و ROIC ۲۰ صنعت بورس ایران، ۵ صفحه نیروی رقابتی (۳۶ سوال)، ۴ فاکتور محیطی (۱۲ سوال) و کارنامه/استراتژی صنعت.
- **ماژول ۲ — بنگاه (بارنی ۱۹۹۱):** چک‌لیست مصادیق منابع، سنجش V/R/I/N با کشف غیرمستقیم «ابهام علی» و کارنامه پایداری منابع.
- **ماژول ۳ — ترکیب (مک‌گاهان و پورتر ۱۹۹۷):** جدول ضرایب ۷ بخش اقتصادی، وزن‌های نرمال‌شده (صنعت/بنگاه/شرکت مادر)، ماتریس موقعیت‌یابی و بیانیه استراتژی قابل چاپ.

The UI is Persian/RTL, Vazirmatn, using the **Midnight Executive** palette (midnight navy, teal, muted gold, light blue-gray canvas). Default state is a blank form; the header can load a complete sample or reset back to blank.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # normal production build in dist/
npm run build:single # one self-contained dist/index.html (JS, CSS and fonts inlined)
npm run preview      # serve the production build
```

`base: './'` is set in `vite.config.js`, so `dist/` can be hosted from any static path.

For a single shareable file, run `npm run build:single`. It uses `vite-plugin-singlefile` to produce a fully self-contained `dist/index.html` (no external JS, CSS, or font requests), which can be opened directly or sent by email/Telegram.

## Stack

- React 19 + Vite 6
- Tailwind CSS 3 (build-time, no CDN) + custom range/AI slider styles in `src/styles/index.css`
- Chart.js 4 + `react-chartjs-2` (radar, grouped bar, doughnut, scatter)
- `@fontsource-variable/vazirmatn` for self-hosted Persian type

## Project structure

```
index.html                    # Vite entry (lang="fa" dir="rtl")
src/
  main.jsx                    # React root + font + styles
  App.jsx                     # header, breadcrumb, view switcher, footer
  state/
    StrategyContext.jsx       # all inputs, actions, sample/blank presets, derived results
  data/
    iranIndustries.js         # 20 Iranian industries + ROIC benchmark (39%)
    mcgahan.js                # McGahan–Porter sector coefficients (Table 4)
    porter.js                 # 5 force pages, rival types, 4 environmental factors
    barney.js                 # resource checklists + VRIN AI guidance
  utils/
    calculations.js           # force scores, industry score, VRIN score, combined score
    chartSetup.js             # Chart.js registration + Persian font defaults
  components/
    layout/                   # Header, BreadcrumbBar
    home/HomeView.jsx         # hero scores + 3 module portal cards
    mod1/                     # TabRoic, TabForces, TabEnv, TabResult
    mod2/                     # TabChecklist, TabFactor (V/R/N), TabI, TabFirmResult
    mod3/                     # TabWeights, TabStrategy
    ui/Controls.jsx           # AiConsult popover, Range, AnswerBadge
  styles/index.css            # Tailwind layers + slider/tab/card primitives
legacy/                       # original single-file dashboard, kept for reference
```

## Scoring rules

- **Industry force score:** average of answered questions in each force. Buyer power uses `0.4·L + 0.4·S + 0.2·(L·S/5)`. Rivalry uses `0.65·intensity + 0.35·price − non-price relief`, multiplied by `1.25` (zero-sum), `1.0` (balanced) or `0.80` (positive-sum), clipped to 1–5.
- **Environmental factors:** answered factor average normalized to `[-1, +1]`; each factor has a 5-force weight vector; future force = current + Σ(weight × normalized factor), clipped to 1–5.
- **Industry attractiveness:** effective pressure = `65% mean + 35% strongest force`; score = `(5 − pressure) / 4 × 100`.
- **Firm/VRIN:** `V` averages the two value questions, `I = max(historical, social, causal ambiguity)` where causal ambiguity is inferred from `6 − (codified + poach)/2`; per-resource score uses the multiplicative gate formula. Firm score = `50% best resource + 50% mean of the three resources`.
- **McGahan–Porter combination:** selected sector weights for industry / business unit / corporate parent are normalized after the optional parent toggle. Effective industry score = `60% current + 40% future`; combined = weighted sum (missing components default to 50).

Scores update live as inputs change — there is no manual recalculate step. All data stays in React state for the session; use the print action on module 3 for a PDF, or the sample/blank buttons to switch modes.
