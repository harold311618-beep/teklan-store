<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Repo-specific guidance

- This project is a Next.js app using the **app router** in `src/app`, React 19, and Tailwind CSS 4.
- Firebase Firestore is used for product data. The Firestore client is configured in `src/lib/firebase.js` with environment variable fallbacks.
- Cart state is managed in `src/context/CartContext.js` and relies on `localStorage` in client components.
- The home page is a client component at `src/app/page.js` and fetches `Productos` from Firestore at runtime.
- Product details are rendered by `src/app/producto/[id]/page.js`, which wraps a client component in `ProductDetailClient`.

## Commands

- `npm run dev` — start local development server
- `npm run build` — build production app
- `npm run start` — start production server
- `npm run lint` — run ESLint checks

## Agent behavior

- Preserve the existing app-router structure and avoid migrating this project to pages router or a different folder layout.
- Keep new client logic inside `"use client"` components only when needed, especially for hooks and browser APIs.
- Do not introduce runtime dependencies that contradict the existing Next.js/Tailwind/Firebase stack.
- Prefer small, incremental changes and validate with `npm run lint` when code quality or formatting is uncertain.

## Helpful files

- `README.md` — general project setup and Next.js information
- `next.config.mjs` — images remotePatterns configuration
- `package.json` — runtime and development dependencies
- `src/app/page.js` — home page implementation with search, filters, and Firestore fetch
- `src/app/producto/[id]/page.js` — product detail route
- `src/context/CartContext.js` — cart hook and persistence logic
- `src/lib/firebase.js` — Firebase app initialization and Firestore export

<!-- END:nextjs-agent-rules -->
