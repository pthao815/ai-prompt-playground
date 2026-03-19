# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Type-check with vue-tsc, then Vite production build
npm run preview    # Serve the production build locally
```

There is no test runner or linter configured. `npm run build` is the only validation step — it runs `vue-tsc -b` (strict TypeScript) before bundling, so it catches type errors across all `.vue` and `.ts` files.

## Architecture

### Stack
- **Vue 3** with `<script setup>` Composition API throughout — no Options API
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`; theme tokens live in `src/style.css` under `@theme {}`
- **Pinia** (Composition Store pattern with `defineStore(..., () => {...})`)
- **Vue Router v5** with `createWebHistory`

### App shell
`main.ts` mounts with Pinia before Router. `App.vue` is a thin shell: it renders `<NavBar>` (always present) and a `<RouterView>` with a page-transition `<Transition>`. All page content is lazy-loaded via dynamic `import()` in the router.

### Routing & auth guards
`src/router/index.ts` defines two route meta flags:
- `requiresAuth: true` — redirects unauthenticated users to `/login?redirect=<original path>`
- `guestOnly: true` — redirects authenticated users away to `/dashboard`

The guard calls `useAuthStore()` directly inside `beforeEach`. The Pinia instance must be created before the router is used, which is guaranteed by the `createPinia()` → `createRouter()` order in `main.ts`.

### Auth store (`src/stores/auth.ts`)
Entirely frontend-simulated — no backend. Two `localStorage` keys:
- `promptlab_user` — the currently logged-in `User` object (null when logged out)
- `promptlab_users` — a keyed record acting as the fake user database (`email → { password, user }`)

Passwords are stored in plain text in `localStorage`. This is intentional for a demo/prototype — replace with real API calls when connecting a backend. The `simulateDelay()` function mimics async network latency.

### Page vs Component split
- `src/pages/` — route-level components (one per route, lazy-loaded)
- `src/components/` — sub-components used within pages (HeroSection, FeaturesSection, etc.)
- `src/composables/` — reusable Vue composables (`onClickOutside.ts`)

### Styling conventions
- Dark theme only: background `#0d0d1a`, card surface `#13131f`, border `#2a2a3e`
- Purple accent: `#aa3bff` (light mode) / `#c084fc` (registered in `@theme` as `--color-brand`)
- Arbitrary Tailwind values (`bg-[#13131f]`, `border-[#2a2a3e]`) are used liberally — this is intentional given the fixed dark palette
- Glow effects use `shadow-[0_0_Xpx_rgba(170,59,255,Y)]` pattern
- FAQ accordion uses the `grid-rows-[0fr/1fr]` CSS trick for smooth expand/collapse without JS height measurement

### TypeScript config
`tsconfig.app.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. The build will fail on unused variables — remove or prefix with `_` if intentionally unused.
