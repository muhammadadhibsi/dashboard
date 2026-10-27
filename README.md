# VocaGame Admin Dashboard

A high-fidelity real-time administrative dashboard for VocaGame, featuring comprehensive analytics across revenue, transaction processing, and customer retention. Built with React 19, TypeScript strict mode, Vite, Tailwind CSS v4, TanStack Query v5, Zustand, and Recharts.

---

## Live Demo & Repository

- **Live Demo:** https://vocagame.adhinugroho.tech/
- **Repository:** https://github.com/vourdev/vocagame-dashboard.git
- **Figma Parity:** Designed to pixel-precision against official Figma references for Dashboard, Transactions, and Customers views.

---

## Tech Stack & Architecture Choices

| Technology | Role | Implementation Choice & Rationale |
|---|---|---|
| **React 19 + TypeScript (strict)** | Core UI & Type Safety | Configured with `strict: true`, `noUncheckedIndexedAccess: true`, and `verbatimModuleSyntax: true`. Full type definitions covering all API entities, ensuring zero runtime type regressions. |
| **Vite 8** | Build & Dev Tooling | Fast HMR and optimized production bundling with route-level code-splitting (`React.lazy`), isolating heavy visualization dependencies (Recharts, D3) into dedicated chunks. |
| **Tailwind CSS v4** | Styling & Design System | Complete v4 implementation using `@import "tailwindcss"` and modern `@theme` design tokens in `src/index.css`. Semantic colors, WCAG AA contrast compliance, dark-first elevation tokens. |
| **TanStack Query v5** | Server State & Caching | Structured query factory pattern via `queryOptions()`. Features automatic request cancellation using `signal`, background polling (30s activity feed), and seamless pagination (`placeholderData: keepPreviousData`). |
| **Zustand v5** | Client State Management | Minimal, atomic stores: `useFilterStore` (search, date range, method, status, pagination reset) and `useUIStore` (sidebar, command palette, transaction drawer, activity read states). Persists read state to `localStorage`. |
| **Radix UI (Unified)** | Accessible Primitives | Uses unified `radix-ui` package for headless, accessible components: dialogs, popovers, dropdown menus, and select triggers with full keyboard navigation and focus trapping. |
| **Recharts & D3-Geo** | Data Visualization | Interactive, accessible charts with custom dark tooltips, legends, reduced-motion adaptations, and screen-reader data table fallbacks. |
| **Lucide React** | Icons | Consistent iconography with accessible labels and touch-target sizing (`pointer-coarse:size-11`). |

---

## Directory Structure

```
src/
├── api/             # TanStack Query options, API client, and typed endpoints
├── components/
│   ├── common/      # Reusable UI (Header, Sidebar, MetricCard, Avatar, Skeletons)
│   ├── customers/   # Acquisition chart, Geo map widget, Top spenders table
│   ├── dashboard/   # Revenue chart, Product performance, Payment donut, Activity feed
│   ├── layouts/     # Dashboard shell with responsive navigation
│   ├── transactions/# Transaction table, filter bar, date picker, drawer
│   └── ui/          # Radix-powered primitive components (Dialog, Select, Table, etc.)
├── hooks/           # Custom React hooks (useCopy, useReducedMotion)
├── pages/           # Lazy-loaded route views (Dashboard, Transactions, Customers, 404)
├── store/           # Zustand stores (useUIStore, useFilterStore)
├── types/           # Domain and API TypeScript definitions
└── utils/           # Formatters, revenue aggregators, pagination helpers, theme constants
```

---

## Key Features & User Interactions

1. **Real-Time Dashboard (`/`)**:
   - 4 KPI metric cards with 7-bar trend mini-charts and percentage delta badges.
   - Smooth Revenue Analytics curve with 30-day / 90-day interval toggle and previous period comparison.
   - Interactive Product Performance list with 3-dot sorting menu (by Revenue, by Share %, alphabetically).
   - Interactive Payment Distribution donut chart with method filter and breakdown legend.
   - Recent Transactions table with clickable transaction IDs opening full detail drawers.
   - Live Activity Feed with 30s background polling, read/unread states, and history clear/restore.

2. **Transactions Management (`/transactions`)**:
   - Instant search across Transaction ID, Customer Name, and Customer Email (debounced).
   - Multi-parameter filtering: Status dropdown, Payment Method dropdown, and date range picker.
   - CSV Export feature exporting currently filtered dataset directly to `.csv` with escaped fields.
   - Responsive presentation: 7-column data table on desktop (zero horizontal clipping), stacked card layout on mobile.
   - Slide-over Transaction Detail drawer with one-click copy for Transaction IDs and Emails.

3. **Customer Insights (`/customers`)**:
   - Customer Segment cards (New Segments, Retaining, Churned).
   - User Acquisition & Retention spline chart comparing new vs. returning users.
   - Geographical Distribution widget showcasing region share with collapsible views.
   - Top Spenders table with client/server pagination and customer profile inspection modal.

4. **Global Shell & Accessibility**:
   - Command Palette (`⌘K` / `Ctrl+K`) for rapid navigation and search across transactions and customers.
   - Personal Account profile menu (Administrator role, status, preferences).
   - Skip to main content link for keyboard users.
   - WCAG AA contrast ratio compliance verified on all text and badge tokens.
   - Content-accurate skeletons mirroring exact geometries during network loading states.

---

## Getting Started

### Prerequisites

- Node.js `20.19+` or `22.12+`
- npm `10+`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vourdev/vocagame-dashboard.git
   cd vocagame-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts & Quality Checks

| Command | Purpose |
|---|---|
| `npm run dev` | Starts Vite local development server with hot module replacement |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and generates production bundle in `dist/` |
| `npm run typecheck` | Validates TypeScript types across the entire codebase |
| `npm run lint` | Runs ESLint 10 checks against TypeScript, React Hooks, and Query rules |
| `npm run preview` | Serves the production build locally at `http://localhost:4173` |

---

## Production Deployment

The project is preconfigured for deployment on Vercel:

```bash
npx vercel
```

A `vercel.json` configuration is included to properly route all SPA paths to `index.html`.
