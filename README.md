# 🇨🇭 Swiss 3a Pillar Simulator — Finpension vs IBKR

> **Compare any major ETF on Interactive Brokers to its equivalent pension fund on Finpension 3a.**
> Apple-to-apple. Multi-language. Zero dependencies.

![Status](https://img.shields.io/badge/status-production-brightgreen) ![Languages](https://img.shields.io/badge/languages-FR%20|%20DE%20|%20IT%20|%20EN-blue) ![Built with](https://img.shields.io/badge/built_with-Astro-ff5d01) ![Formatted with](https://img.shields.io/badge/formatted_with-Prettier-f7b93e)

---

## 📋 Table of Contents

1. [What Is This?](#what-is-this)
2. [Key Features](#key-features)
3. [Supported ETFs & Funds](#supported-etfs--funds)
4. [Tax Model](#tax-model)
5. [Technical Architecture](#technical-architecture)
6. [Data Sources](#data-sources)
7. [Methodology](#methodology)
8. [Known Limitations](#known-limitations)
9. [Development History](#development-history)

---

## What Is This?

An interactive simulator built with **Astro** that answers the question every Swiss investor asks:

**"Should I invest in a 3rd pillar (Finpension/VIAC) or directly on IBKR?"**

The simulator compares the **exact same index** invested through two vehicles:
- **Finpension 3a**: institutional pension fund (0.00% TER, full WHT reclaim, tax-deductible contributions, but withdrawal tax at the end)
- **IBKR direct**: ETF (specific TER + WHT drag depending on domicile, dividend tax, wealth tax, but no lock-up)

It models all Swiss-specific tax rules including progressive withdrawal tax, canton-specific staggering limits, marginal rate by salary bracket, and the reinvestment of tax savings.

---

## Key Features

### 🔹 Core Comparison
- **9 ETFs** individually modeled: VOO, CSPX, IWDA, VT, VWCE, ISAC, VWO, EWJ, CHSPI
- Each ETF has its own TER, WHT drag, domicile (US/IE/CH), and distribution type
- Each ETF is mapped to an **exact Finpension fund allocation** with percentages adding to 100% (including mandatory 1% cash)
- Historical **backtest 2016–2025** using real MSCI/S&P factsheet returns in CHF

### 🔹 Side-by-Side Comparison
- Toggle switch to compare **2 ETFs simultaneously** on the same chart
- 4 curves: ETF1 3a, ETF1 IBKR, ETF2 3a, ETF2 IBKR
- Useful for VOO vs CSPX, VT vs VWCE, etc.

### 🔹 Tax Deduction Modes
Three modes for handling the 3a tax deduction savings:
| Mode | Description |
|------|-------------|
| **Reinvest (IBKR)** | Tax savings (~33% × 7'258 CHF/yr) reinvested in the same ETF on IBKR, subject to dividend + wealth tax + stamp duty |
| **Keep as cash** | Tax savings accumulated as cash, subject to wealth tax only |
| **Don't include** | Tax savings ignored — pure fund-vs-ETF comparison without deduction advantage |

### 🔹 Withdrawal Tax Optimization
- Progressive withdrawal tax brackets per commune
- **Canton-specific staggering limits**: Vaud max 2, Neuchâtel max 1, others ~5
- Algorithm finds the **minimum number of accounts** capturing ≥95% of the maximum tax savings
- Side-by-side comparison: 1 account vs optimal N accounts

### 🔹 Commune-Level Tax Rates
Real marginal income tax rates for:
- **Lausanne** (VD): cantonal 155% + communal 78.5% (2025–2029)
- **Nyon** (VD): cantonal 155% + communal 61% (2024–2026)
- Genève, Zürich, Bern, Neuchâtel, Schwyz, Zug, Valais

Each commune has **9 salary brackets × 3 civil statuses = 27 real marginal rates** with linear interpolation between brackets.

### 🔹 Manual Tax Rate Override
- Input field to enter your exact marginal rate (from VaudTax, etc.)
- When set to 0 = automatic calculation based on commune + salary + status
- Visual indicator "✋ MANUEL" when override is active

### 🔹 Projection Future (🔮)
- Collapsible section
- **Horizon slider**: 5 to 35 years
- **Hypothetical return slider**: 2% to 14%
- Projects forward from end-2025 historical values
- Shows net 3a (after withdrawal tax) vs net IBKR

### 🔹 Monte Carlo Simulation (🎲)
- **1,000 random scenarios** using historical mean and standard deviation of the selected index
- Box-Muller normal distribution for return generation
- Displays **P10 (pessimistic)**, **P50 (median)**, **P90 (optimistic)** percentiles
- Distribution chart: all 1,000 outcomes sorted from worst to best
- Duration = projection horizon

### 🔹 Retroactive 3a Contributions (📅)
- New law from 2026: catch up missed 3a years (max 5 years × CHF 7'258)
- Slider: 1 to 5 years
- Calculates: total amount, additional tax deduction, net capital after withdrawal tax

### 🔹 2nd Pillar Voluntary Buy-In (🏛️)
- Amount slider: 5k to 100k CHF
- Horizon slider: 5 to 35 years
- Compares three outcomes:
  - Tax deduction (immediate)
  - Capital in LPP after N years (~1%/yr, locked until retirement)
  - Same amount invested in ETF (hypothetical return)
- Warning: 3-year lock after buy-in

### 🔹 Opportunity Cost of Lock-Up (🔒)
- **Age slider**: 20 to 55 years
- Calculates years of lock-up until 5 years before retirement (age 60)
- Compares: free capital (IBKR) vs locked capital (3a + deduction)
- Shows whether the tax advantage compensates for illiquidity

### 🔹 Interactive SVG Charts with Tooltips
- Pure SVG charts (zero external JS dependencies)
- **Hover tooltips**: vertical highlight line + popup with exact CHF values for each curve
- Y-axis starts at 0
- Invisible rectangular hover zones per data point

### 🔹 Net Values Below Chart
- Below the historical chart: a summary bar showing:
  - 3a net (after withdrawal tax)
  - IBKR net (after stamp duty)
  - Delta (Δ) between the two
  - Withdrawal tax amount
- Solves the "chart shows 3a above but IBKR wins" confusion (withdrawal tax not visible on curves)

### 🔹 Strategy Cards
- Two cards: Finpension Pension (3a) vs ETF on IBKR
- Full breakdown: balance, withdrawal tax, tax savings, deductions
- Fund allocation table with percentages
- Cost breakdown: TER, WHT drag/reclaim, stamp duty, FX fees

### 🔹 Multi-Language (FR / DE / IT / EN)
- Top-right language toggle
- **~110 translation keys** across 4 Swiss national languages + English
- ETF descriptions translated per language
- All labels, tooltips, disclaimers, feature descriptions
- Instant switch preserving all state

### 🔹 FX Conversion Fees
- IBKR charges ~2 USD per FX conversion (~0.03% on 7k CHF)
- Applied automatically to all non-CHF ETFs (VOO, CSPX, IWDA, etc.)
- Not applied to Swiss-domiciled ETFs (CHSPI)
- Finpension charges 0% FX margin
- Noted in the IBKR strategy card

---

## Supported ETFs & Funds

### ETF → Finpension Mapping

| ETF | Index | Domicile | TER | IBKR Cost/yr | Finpension Allocation |
|-----|-------|----------|-----|-------------|----------------------|
| **VOO** | S&P 500 | 🇺🇸 US | 0.03% | -0.03% (WHT recovered) | 99% Swisscanto USA NT + 1% Cash |
| **CSPX** | S&P 500 | 🇮🇪 Ireland | 0.07% | -0.28% (TER + WHT drag) | 99% Swisscanto USA NT + 1% Cash |
| **IWDA** | MSCI World | 🇮🇪 Ireland | 0.20% | -0.20% | 96% World ex CH + 3% CH Total + 1% Cash |
| **VT** | FTSE All-World | 🇺🇸 US | 0.07% | +0.03% (partial WHT reclaim) | 76% World ex CH + 3% CH + 10% EM + 10% Small Cap + 1% Cash |
| **VWCE** | FTSE All-World | 🇮🇪 Ireland | 0.22% | -0.22% | Same as VT |
| **ISAC** | MSCI ACWI | 🇮🇪 Ireland | 0.20% | -0.20% | 86% World ex CH + 3% CH + 10% EM + 1% Cash |
| **VWO** | FTSE EM | 🇺🇸 US | 0.08% | +0.02% | 99% Swisscanto EM NT + 1% Cash |
| **EWJ** | MSCI Japan | 🇺🇸 US | 0.50% | -0.35% (high TER) | 99% Swisscanto Japan NT + 1% Cash |
| **CHSPI** | SPI (Swiss) | 🇨🇭 Switzerland | 0.10% | -0.10% | 99% Swisscanto CH Total NMT + 1% Cash |

### Key Insight: VOO vs CSPX

Same S&P 500 index, very different costs for Swiss investors:

| | VOO (US) | CSPX (Ireland) |
|---|----------|----------------|
| TER | 0.03% | 0.07% |
| WHT at fund level | 0% (US fund) | 15% lost (Ireland treaty) |
| WHT for you | 15% withheld, recoverable via DA-1 | Nothing to recover |
| Net annual drag | **~0.03%** | **~0.28%** |
| Admin complexity | Higher (DA-1 + R-US 164 forms) | Simple |

---

## Tax Model

### Income Tax (Marginal Rate)

The simulator uses **per-commune marginal rate brackets** instead of a single fixed rate per canton. Example for Lausanne (single):

| Gross Salary | Marginal Rate |
|-------------|--------------|
| 50k CHF | 18.0% |
| 80k CHF | 28.0% |
| 100k CHF | 32.0% |
| 115k CHF | 34.0% |
| 150k CHF | 38.0% |
| 200k CHF | 41.0% |
| 250k CHF | 43.0% |

Nyon is ~3% lower at every bracket (61% vs 78.5% commune coefficient).

### Withdrawal Tax (Prestations en Capital)

For Vaud (since January 2022): **1/5 of ordinary income tax rate** applied to the withdrawal amount.

Formula: `Withdrawal tax = Amount × ordinary_rate(Amount) / 5 × (1 + cantonal_coeff) × (1 + communal_coeff) + federal_tax`

The brackets in the simulator are pre-computed effective rates including all three levels (federal + cantonal + communal).

Confirmed against Finpension's calculator: single, Lausanne, CHF 250k → **6.95%** effective withdrawal tax.

### Staggering Limits

| Canton | Max Staggered Withdrawals |
|--------|--------------------------|
| Vaud (Lausanne, Nyon) | **2** |
| Neuchâtel | **1** |
| All others (GE, ZH, BE, SZ, ZG, VS) | **5** |

### Wealth Tax

Applied annually on IBKR portfolio and cash side pocket:

| Commune | Approx. Rate |
|---------|-------------|
| Lausanne | 0.55%/yr |
| Nyon | 0.48%/yr |
| Genève | 0.60%/yr |
| Zürich | 0.35%/yr |
| Zug | 0.18%/yr |

Not applicable inside 3a.

### Dividend Tax

Dividends are taxed as income at the marginal rate. Applies to IBKR holdings (both distributing and accumulating ETFs — Swiss tax authorities use ICTax for deemed distributions). Not applicable inside 3a.

### Stamp Duty

- 0.15% on foreign securities purchases (IBKR)
- Applied to annual contributions on IBKR and side pocket reinvestments
- 0% inside Finpension 3a (pension fund exemption)

---

## Technical Architecture

### Astro + Vanilla JS

Built with [Astro](https://astro.build/) as a static site generator with [Prettier](https://prettier.io/) for code formatting. All interactivity is client-side vanilla JS — no UI framework (React, Vue, etc.) needed.

```
src/
  pages/
    index.astro                — Page: composes all components
  components/
    Layout.astro               — Base layout: <html>, <head>, fonts, CSS, script entry
    EtfSelection.astro         — ETF dropdowns + compare toggle
    Parameters.astro           — Sliders, pills, custom rate, tax info
    HistoricalChart.astro      — Stats grid, SVG chart, withdrawal optimization, strategy cards
    CollapsibleSection.astro   — Reusable expandable panel (typed props + slot)
    YearTable.astro            — Toggle button + table container
    Disclaimer.astro           — Disclaimer block
  styles/
    global.css                 — Dark theme, responsive grid, custom components
  data/
    translations.js            — i18n: FR, DE, IT, EN (~110 keys per language)
    communes.js                — 9 Swiss communes: marginal rates, withdrawal tax, wealth tax
    etfs.js                    — 9 ETFs: returns 2016–2025, TER, dividends, Finpension allocations
  scripts/
    state.js                   — Global state (Z) + translation helper (t)
    format.js                  — Number/percentage formatting (fm, pp)
    tax.js                     — Withdrawal tax (wT) + marginal rate calculation (getMg)
    chart.js                   — SVG chart generator with tooltips (svgC)
    ui.js                      — Slider/pill UI builders (mkS, mkP)
    simulation.js              — Year-by-year simulation engine (runSim)
    render.js                  — DOM rendering (~160 lines)
    main.js                    — Entry point: wires modules, builds UI (buildAll)
```

**External resources**: Google Fonts (DM Sans + DM Mono) — CSS only, non-blocking.

### Build & Dev

```bash
npm install          # Install dependencies
npm run dev          # Local dev server with hot reload
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run format       # Format all files with Prettier
npm run format:check # Check formatting (CI)
```

Deployed automatically to GitHub Pages via GitHub Actions on push to `main`.

### SVG Charts

Hand-built SVG generation with:
- Responsive `viewBox` (scales to container width)
- Grid lines + Y-axis labels (auto-scaled from 0 to max)
- Multiple line datasets with configurable colors, widths, dot sizes
- Invisible `<rect>` hover zones per X-point
- Vertical highlight `<line>` on hover
- Tooltip `<div>` positioned over SVG with absolute positioning

### State Management

A single global `Z` object:
```javascript
var Z = {
  monthly: 605,        // monthly contribution
  salary: 115000,      // gross annual salary
  status: "single",    // single / married / family
  canton: "Lausanne",  // commune key
  startBal: 0,         // starting balance
  idx: "voo",          // selected ETF
  idx2: "cspx",        // comparison ETF
  dedMode: "reinvest", // reinvest / cash / ignore
  lang: "fr",          // fr / de / it / en
  customRate: 0,       // manual marginal rate override (0 = auto)
  cmpMode: false,      // side-by-side comparison enabled
  showProj: false,     // projection section open
  projYr: 20,          // projection horizon
  projRet: 8,          // hypothetical return %
  showRetro: false,    // retroactive 3a section open
  retroYrs: 3,         // years to catch up
  show2P: false,       // 2nd pillar section open
  p2Amt: 20000,        // 2P buy-in amount
  p2Yr: 20,            // 2P investment horizon
  age: 30,             // investor age
  showMC: false,       // Monte Carlo section open
  showOpp: false,      // opportunity cost section open
  showTable: false,    // annual returns table open
};
```

Every input change calls `render()` which recomputes everything and updates all DOM elements.

### i18n System

Translation dictionary `T` with 4 language keys, ~110 entries each:
```javascript
var T = {
  fr: { sub: "FINPENSION 3A · SIMULATEUR MULTI-ETF", ... },
  de: { sub: "FINPENSION 3A · MULTI-ETF SIMULATOR", ... },
  it: { sub: "FINPENSION 3A · SIMULATORE MULTI-ETF", ... },
  en: { sub: "FINPENSION 3A · MULTI-ETF SIMULATOR", ... }
};
function t(k) { return T[Z.lang][k] || T.fr[k] || k; }
```

Language switch calls `buildAll()` which reconstructs all controls (sliders, pills, dropdowns) with translated labels while preserving state.

---

## Data Sources

### Index Returns (CHF, Net Total Return)

| Index | Source | Years |
|-------|--------|-------|
| S&P 500 | S&P 500 USD Total Return × USD/CHF year-end rates | 2016–2025 |
| MSCI World | MSCI World CHF Net Return factsheet (Jan 2026) | 2016–2025 |
| MSCI ACWI | MSCI ACWI CHF Net Return factsheet (Jan 2026) | 2016–2025 |
| MSCI EM | MSCI EM CHF Net Return factsheet (Jan 2026) | 2016–2025 |
| MSCI Japan | MSCI Japan USD Net Return × USD/CHF | 2016–2025 |
| SPI | SPI Total Return (estimated from SMI + dividends) | 2016–2025 |

### Tax Data

| Data | Source |
|------|--------|
| Lausanne commune coefficient | lausanne.ch — 78.5% (2025–2029) |
| Nyon commune coefficient | nyon.ch — 61% (2024–2026) |
| Vaud cantonal coefficient | 155% |
| Withdrawal tax formula | LI-VD Art. 49 (1/5 of ordinary rate since 2022) |
| Vaud stagger limit | Confirmed 2 max via multiple sources |
| Federal withdrawal tax | 1/5 of ordinary IFD rate |
| Finpension fund list | finpension.ch/en/invest-pillar-3a/index-tools/ |
| 3a max contributions | 2016–2018: 6'768, 2019–2020: 6'826, 2021–2022: 6'883, 2023–2024: 7'056, 2025–2026: 7'258 |

### Finpension Fund Data

| Fund | ISIN | TER |
|------|------|-----|
| Swisscanto IPF I Index Equity Fund USA NT USD | CH0117044732 | 0.00% |
| Swisscanto IPF I Index Equity Fund World ex CH NT CHF | CH0117044948 | 0.00% |
| Swisscanto Index Equity Fund Switzerland Total NMT CHF | CH1529076437 | 0.00% |
| Swisscanto Index Equity Fund Emerging Markets NT CHF | CH0117044971 | 0.00% |
| Swisscanto IPF I Index Equity Fund Small Cap World ex CH NT CHF | CH0267153598 | 0.00% |
| Swisscanto IPF I Index Equity Fund Japan NT | CH0489405321 | 0.00% |

All funds are institutional pension fund classes with 0.00% TER. The 0.39% Finpension flat fee covers everything (management, custody, transactions, FX conversion).

---

## Methodology

### Finpension 3a Simulation (per year)

```
1. Contribution = min(monthly × 12, max_3a[year])
2. Tax deduction = contribution × marginal_rate
3. 3a balance = (balance + contribution) × (1 + index_return + fpAdj)
   where fpAdj = WHT_reclaim_benefit - 0.39% fee
4. Side pocket (if reinvest mode):
   side = (side + deduction × 0.9985) × (1 + ibkr_return)
   side -= dividend_tax + wealth_tax
5. Final net = 3a_balance - withdrawal_tax(optimal_accounts) + side_pocket
```

### IBKR Simulation (per year)

```
1. Contribution = min(monthly × 12, max_3a[year])
2. Purchase = contribution × 0.9985 (stamp duty) × fxFee (0.9997 for non-CHF)
3. Balance = (balance + purchase) × (1 + index_return + ibAdj)
   where ibAdj = -TER - WHT_drag (or + WHT_reclaim for US ETFs)
4. Dividend tax = avg_balance × div_yield × marginal_rate
5. Wealth tax = balance × wealth_rate
6. Final net = balance × 0.9985 (stamp duty on sale)
```

### Monte Carlo

```
1. Compute mean (μ) and std dev (σ) from 2016–2025 returns
2. For each of 1,000 simulations:
   a. For each year in horizon:
      - Draw random return: r = μ + σ × BoxMuller()
      - Apply same 3a simulation logic
   b. Compute final net (after withdrawal tax)
3. Sort 1,000 outcomes
4. Report P10, P50, P90
```

### Withdrawal Tax Optimization

```
1. For n = 1 to max_stagger (canton-specific):
   a. per_account = 3a_balance / n
   b. tax_per_withdrawal = lookup_brackets(per_account, canton, status)
   c. total_tax = tax_per_withdrawal × n
2. Find optimal: minimum n where savings ≥ 95% of maximum savings
```

---

## Known Limitations

1. **Marginal rates are approximations** — based on interpolation between salary brackets, not the actual VaudTax/GeTax calculation with all deductions. Use the manual override field for precision.

2. **Withdrawal tax brackets are pre-computed** — they approximate the real formula (1/5 ordinary rate × coefficients) but may differ by a few hundred CHF from the official calculator.

3. **No commune-specific wealth tax** — uses a single rate per commune, while real wealth tax has its own progressive brackets.

4. **No inflation adjustment** — all values are nominal CHF.

5. **Backtest ≠ future** — historical returns 2016–2025 were exceptionally good for US equities. Monte Carlo helps visualize uncertainty.

6. **Side pocket simplification** — the tax savings reinvestment model assumes annual lump-sum purchase, not monthly DCA.

7. **No 2nd pillar cumulation** — the simulator does not model the cumulation of 3a + 2nd pillar withdrawals in the same tax year.

8. **Japan CHF returns** — computed from USD returns × FX rate, not from a direct CHF factsheet.

9. **Retroactive 3a (2026)** — the new law details are still being finalized; the simulator uses the currently announced framework (max 5 years, CHF 7'258/year).

---

## Development History

This simulator was built iteratively over a single conversation session:

| Version | Key Changes |
|---------|-------------|
| v1 | React/Recharts — S&P 500 only, single comparison |
| v2 | Added Bitcoin 5% allocation option |
| v3 | Multi-account withdrawal optimization |
| v4 | Canton-specific staggering limits (VD: 2, NE: 1) |
| v5 | Converted to vanilla HTML/CSS/JS (zero dependencies) |
| v6 | Multi-index dropdown (S&P 500, MSCI World, ACWI, EM, SPI) |
| v7 | Separated ETFs (VOO ≠ CSPX), proper cost modeling per domicile |
| v8 | Added Finpension fund allocations with percentages + 1% cash |
| v9 | 4-language support (FR/DE/IT/EN), salary-based marginal rates |
| v10 | Commune-level taxes (Lausanne, Nyon), manual rate override |
| v11 | Projection, side-by-side comparison, retroactive 3a, 2P buy-in |
| v12 | Monte Carlo, opportunity cost, FX fees, SVG tooltips |
| v13 | Net values below chart, toggle switch UI, spacing fixes |

### Key Research Findings

- **Accumulating ETFs (CSPX) do NOT avoid Swiss dividend tax** — ICTax determines deemed distributions
- **Pension funds get 0% TER + full WHT reclaim** — better than any ETF wrapper
- **Swap ETFs (Invesco S&P 500)** are the only potential way to avoid dividend tax on IBKR, but with counterparty risk
- **Without the tax deduction**, 3a and IBKR produce nearly identical results for VOO (±CHF 8 over 10 years)
- **The tax deduction reinvested** is the primary driver of 3a outperformance (+45k CHF over 10 years at default params)
- **Vaud limits staggered withdrawals to 2** — significantly less optimization than the 5 accounts many forums recommend

---

## License

This is a personal financial simulation tool. Not financial advice. Use at your own risk. All tax calculations are approximations — consult a qualified Swiss tax advisor for your specific situation.

Data sources: MSCI Inc. (factsheets), Finpension AG (fund list), Swiss Federal Tax Administration, Canton de Vaud ACI, Communes of Lausanne and Nyon.

---

*Built with Claude (Anthropic). Astro + vanilla JS, formatted with Prettier, deployed on GitHub Pages.*
