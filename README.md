# Next.js Starter Template

This is a modern [Next.js](https://nextjs.org) starter template featuring:

- **App Router** (Next.js 15+)
- **Authentication** with [Auth.js](https://authjs.dev)
- **Role-based dashboards** (admin, manager, user)
- **Internationalization** with [next-intl](https://next-intl.dev)
- **Tailwind CSS** for styling
- **HeroUI** component library
- **Prisma** ORM (optional, for database integration)
- **Zod** for schema validation

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Authentication**: Credentials-based login, JWT sessions, persistent cookies
- **Role-based Routing**: `/dashboard/admin`, `/dashboard/manager`, `/dashboard` (redirects based on user role)
- **Internationalization**: English and Arabic locales, auto-detects browser language
- **Protected Routes**: Middleware redirects unauthenticated users to login
- **Beautiful UI**: HeroUI components, Tailwind CSS, dark mode support
- **Server Actions**: Modern React server actions for authentication
- **Type Safety**: All API routes and helpers use strict TypeScript types, including custom `Session` types in `src/types/session.d.ts` for compatibility with Auth.js/NextAuth.
- **Role-based API Protection**: API routes (e.g., `/api/users`) are protected by session and role checks, with granular authorization logic for GET, POST, PATCH requests.

## Demo Accounts

Use these emails to test role-based dashboards:

- `admin@example.com` → Admin Dashboard
- `manager@example.com` → Manager Dashboard
- `user@example.com` → User Homepage

Password can be anything for demo accounts.

## Folder Structure

- `src/app/[locale]/dashboard/admin/page.tsx` — Admin dashboard
- `src/app/[locale]/dashboard/manager/page.tsx` — Manager dashboard
- `src/app/[locale]/dashboard/page.tsx` — Dashboard redirect logic
- `src/app/[locale]/auth/login/page.tsx` — Login page
- `src/components/` — UI components
- `src/lib/` — Zod schemas, server actions
- `src/utils/` — Role-based route helpers

## Customization

- Add new roles in `src/lib/zod.ts` and `src/utils/role-utils.ts`
- Connect to your database in `src/auth.ts` (replace mock users)
- Add more locales in `messages/`
- Extend session/user types in `src/types/session.d.ts` for additional fields (e.g., user.id)
- Update API route logic in `src/app/api/users/route.ts` for more granular permissions or custom business rules

## License

MIT
