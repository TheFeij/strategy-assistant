# داشبورد راهبردی صنعت و بنگاه — Strategy Assistant

A React + Vite rewrite of the single-file strategic dashboard (Porter's five forces, Barney's VRIN resources, and the McGahan–Porter combination). The UI is Persian/RTL with a modern analytics theme: Vazirmatn typeface, slate/indigo/cyan palette, and Power BI–style SVG visualisations.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

The build uses a relative base (`./`), so `dist/` can be dropped on any static host or sub-path.

## Project structure

```
index.html                 # Vite entry, sets lang="fa" dir="rtl"
src/
  main.jsx                 # React root
  App.jsx                  # layout + page switching
  pages/                   # one file per dashboard screen
    HomePage.jsx
    IndustryPage.jsx       # module 1 (4 tabs)
    FirmPage.jsx           # module 2 (4 tabs)
    ComboPage.jsx          # module 3 (3 tabs)
  components/
    layout/                # TopBar, Sidebar, Footer
    ui/                    # Button, Kpi, Note, Field, GaugeChart, BarChart
    industry/              # module 1 tab content
    firm/                  # module 2 tab content
    combo/                 # module 3 tab content
  state/
    StrategyContext.jsx    # all inputs + actions (React context)
    NavigationContext.jsx  # active sub-tab per module (drives the sidebar sub-nav)
    initialState.js        # shape of the dashboard state
  data/                    # static content: forces, resources, presets, copy
    forces.js
    resources.js
    vrin.js
    constants.js
    modules.js             # module tabs (second level of the sidebar tree)
    sections.js            # sidebar subsection anchors for every tab
  utils/
    calculations.js        # industry / firm / combo scoring + advice
    aiPrompt.js            # builds the external analysis prompt
    export.js              # JSON export (same schema as the legacy file)
    clipboard.js
  hooks/
    useHashRoute.js        # #home, #m1, #m2, #m3 deep links
  styles/
    index.css              # imports the four sheets below
    base.css               # tokens, typography, forms, cards, notes, tables
    layout.css             # header, shell, sidebar, footer, media queries
    modules.css            # home cards, force/resource blocks
    charts.css             # chart layout (gauge column + bar chart column)
legacy/
  strategic_dashboard_v2_porter_barney_mcgahan_3.html   # original single file, kept for reference
```

## Where to change things

- **Wording / labels / reference figures:** `src/data/constants.js`, `src/data/forces.js`, `src/data/resources.js`.
- **Scoring rules, thresholds, advice text:** `src/utils/calculations.js`.
- **Theme colours, radii, shadows, fonts:** the `:root` block in `src/styles/base.css`. Charts read the `--chart-1` … `--chart-8` tokens, which start from Power BI's default categorical palette.
- **New input field:** add it to `src/state/initialState.js`, a setter in `src/state/StrategyContext.jsx`, then render it in the relevant tab.
- **New tab/step:** add `{ id, label }` to `src/data/modules.js` for the module, anchor its content in `src/data/sections.js`, and handle the id in the matching page.
- **New section anchor:** give the block an `id="sec-…"` and add a `{ id, label }` entry for that module/tab in `src/data/sections.js`. The sidebar tree and scroll tracking pick it up automatically.
- **New page/module:** add a page component in `src/pages/`, register its id in `src/data/constants.js` (`PAGES`) and render it in `src/App.jsx`. Use `useModuleTab(moduleId)` for its steps so the sidebar stays in sync.
- **Styling:** shared primitives live in `base.css`; screen-specific pieces in `layout.css` / `modules.css`; chart-specific layout in `charts.css`.
- **Font:** Vazirmatn Variable is self-hosted through `@fontsource-variable/vazirmatn` (imported in `src/main.jsx`), so no external font request is needed.

## Charts

- `GaugeChart` — Power BI style 270° arc gauge used for the industry, firm and combined scores.
- `BarChart` — horizontal bars with gridlines, axis ticks, per-bar value labels, hover tooltips and an optional dashed target line. Bars grow right-to-left to match the RTL reading direction.

Charts are plain SVG/React components, so they stay crisp, themeable and dependency-free. `BarChart` accepts `data`, `max`, `ticks`, `unit`, `target` and `formatValue`; reuse it for any new visual.

## Behaviour notes

- Scores are derived on render from context state, so there is no manual "recalculate" step; results stay in sync with edits.
- Navigation lives entirely in the right-panel tree (`module → step → subsection`). Both module and step levels are collapsible; the active step auto-expands. There is no top tab bar.
- The active subsection is highlighted while scrolling and clicking a leaf smooth-scrolls to its block; leaves from another step/module switch there first. The last section is highlighted at the bottom of the page.
- Module 3 previously called an undefined `calcCombo()` in the legacy file. The combination score is now implemented: a normalised weighted mean of the industry and firm scores, plus the 2×2 decision matrix (threshold 50) and the effective weight shares shown above the gauge and in the strategy notes.
- Data is kept for the session while moving between modules. Use **خروجی JSON** for a persistent copy.
- The AI section never calls a service; it only generates a prompt from the recorded data.
