# ⚡ Finio — Finance Dashboard

A production-grade, modern fintech finance dashboard built with React, TypeScript, Tailwind CSS, and Recharts.

<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/fbf8b1bf-5bc3-42db-bf63-1bef5b57728a" />

---

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards** — Total Balance, Income, Expenses, Savings with trend indicators
- **Money Flow Chart** — Interactive area chart with period selection (1M / 3M / 6M / 1Y)
- **Expense Breakdown** — Animated donut chart with hover interactions
- **Savings Goals** — Progress bars for each savings target
- **Recent Transactions** — Live transaction feed with status badges
- **Quick Transfer** — Send money to saved contacts

### 💸 Transactions
- Full transaction table with search, filter, sort, and pagination
- Filter by: type (income/expense/transfer), category, date range
- Sort by: date, amount, name (asc/desc)
- Add, edit, delete transactions (Admin role only)
- **CSV Export** — One-click export of filtered transactions

### 📈 Insights
- **Monthly Comparison** — Bar chart of income vs expenses (6M)
- **Top Spending Categories** — Ranked list with progress bars
- **Financial Health Score** — Calculated score with visual ring gauge
- **Income vs Expense Summary** — Ratio analysis with spend rate

### 🔐 Role-Based UI
- **Admin** — Full CRUD, can add/edit/delete transactions
- **Viewer** — Read-only mode, all write actions are disabled

### 🎨 Design & UX
- Dark / Light / System theme toggle (persisted to localStorage)
- Smooth animations via Framer Motion (page loads, cards, counters)
- Skeleton loaders while data initializes
- Empty state UI with clear CTAs
- Fully responsive (mobile, tablet, desktop)
- Custom glassmorphism card styles
- DM Sans + Syne fonts for a premium fintech feel

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| UI Components | Radix UI primitives |
| State Management | Zustand (with localStorage persistence) |
| Charts | Recharts |
| Forms | React Hook Form |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v6 |
| Date Handling | date-fns |

---

## 📁 Project Structure

```
finance-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                     # Reusable primitives
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Skeletons.tsx
│   │   │   └── Toast.tsx
│   │   ├── dashboard/              # Dashboard widgets
│   │   │   ├── CreditCard.tsx
│   │   │   ├── ExpenseDonutChart.tsx
│   │   │   ├── MoneyFlowChart.tsx
│   │   │   ├── QuickTransfer.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   ├── SavingsList.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── transactions/           # Transaction management
│   │   │   ├── TransactionFilters.tsx
│   │   │   ├── TransactionModal.tsx
│   │   │   └── TransactionTable.tsx
│   │   ├── insights/               # Analytics components
│   │   │   └── InsightCharts.tsx
│   │   └── layout/                 # App shell
│   │       ├── AppLayout.tsx
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── data/
│   │   └── mockData.ts             # 20 sample transactions + cards + goals
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── InsightsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── TransactionsPage.tsx
│   ├── store/
│   │   └── useFinanceStore.ts      # Zustand global store
│   ├── types/
│   │   └── index.ts                # All TypeScript types
│   ├── utils/
│   │   ├── cn.ts                   # clsx + tailwind-merge
│   │   ├── csvExport.ts            # CSV download utility
│   │   └── formatters.ts           # Currency, date, number formatters
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Key Implementation Details

### State Management
The entire app state lives in a single Zustand store (`useFinanceStore`), with `persist` middleware writing `transactions`, `role`, and `activeCardId` to `localStorage`. Selectors like `getSummary()` and `getFilteredTransactions()` are pure functions computed on demand.

### Role System
Switch between **Admin** and **Viewer** via the header dropdown or Settings page. The role is stored in Zustand + localStorage. In Viewer mode, the Add/Edit/Delete buttons are disabled and a "Read Only" badge is shown.

### CSV Export
`exportTransactionsToCSV()` creates a properly escaped CSV Blob, triggers a download via a temporary `<a>` element, then cleans up. Works for both the full dataset and filtered subsets.

### Theme
`useTheme` hook reads/writes `finio-theme` from localStorage and toggles the `dark` class on `<html>`. The `main.tsx` pre-applies the theme before React mounts to prevent FOUC (flash of unstyled content).

### Charts
- `MoneyFlowChart` — `AreaChart` with toggle-able series (income/expense/savings) and period selector
- `ExpenseDonutChart` — `PieChart` with active slice animation on hover
- `MonthlyComparisonChart` — `BarChart` with grouped bars and reference averages

---

## 👨‍💻 Developer

**Nikhil Deshmukh** — Software Engineer

Built with ⚡ passion for fintech innovation.

---
