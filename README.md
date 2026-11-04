# React + shadcn/ui + Tailwind CSS + Hono

A fullstack application setup with **React 19**, **Tailwind CSS v4**, **shadcn/ui** (Nova / Radix UI), and **Hono** with end-to-end type-safe RPC client.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 8](https://vite.dev/)
- **Styling & Components**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Nova style with Radix UI primitives)
- **Backend**: [Hono](https://hono.dev/) web framework (serving `/api/*` endpoints)
- **Type Safety**: End-to-end type-safe RPC via `hc<AppType>`
- **Architecture**: SOLID Principles & Atomic Design (`App.tsx` presentational component + `useView.ts` custom hook)

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── EmptyState/             # Atomic empty state component
│   │   ├── ErrorAlert/             # Atomic error alert component
│   │   ├── FeatureCard/            # Feature card with React.memo
│   │   ├── LoadingSkeleton/        # Animated loading skeleton
│   │   ├── theme-provider.tsx      # Dark/light theme context provider
│   │   ├── TodoItem/               # Atomic task item component
│   │   └── ui/                     # shadcn/ui components (button, card, input, badge)
│   ├── lib/
│   │   └── utils.ts                # Class merging utility (cn)
│   ├── server/
│   │   ├── index.ts                # Hono API routes (/api/health, /api/todos, etc.)
│   │   ├── serve.ts                # Production Node server adapter (@hono/node-server)
│   │   └── types.ts                # Backend domain interfaces
│   ├── services/
│   │   └── appService.ts           # Hono RPC client and abstracted API methods
│   ├── App.tsx                     # Presentational UI component (JSX only)
│   ├── constants.ts                # App-wide constants
│   ├── index.css                   # Tailwind v4 directives & theme variables
│   ├── main.tsx                    # Client entry point
│   ├── style.module.css            # Component CSS module & animations
│   ├── types.ts                    # Frontend types & hook contracts
│   └── useView.ts                  # Logic & state custom hook (export default useView)
├── components.json                 # shadcn/ui CLI configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite + Tailwind + Hono dev server plugin
```

## 🛠️ Available Scripts

```bash
# Start development server (serves React SPA + Hono API simultaneously)
pnpm dev

# Type check TypeScript code
pnpm typecheck

# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format

# Build for production
pnpm build

# Serve production build via Node server (@hono/node-server)
pnpm serve
```

## 🧩 Adding shadcn/ui Components

To add more shadcn components to your project:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Example:

```bash
pnpm dlx shadcn@latest add dialog dropdown-menu tooltip
```
