# Vinci – School Management Platform

Modern school management platform built with Next.js 15 (App Router) and Payload CMS 3 on PostgreSQL.

## Stack
- Next.js 15 App Router
- Payload CMS 3 (PostgreSQL adapter)
- TypeScript + ESLint
- Tailwind CSS

## Local Development
1. Install dependencies:
   - Node 20+
   - Docker (for Postgres)

2. Start the database:
```
docker compose up -d
```

3. Create `.env` in project root:
```
DATABASE_URI=postgresql://vinci_user:vinci_password@localhost:5433/vinci_dev
PAYLOAD_SECRET=your-32+char-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

4. Install and run:
```
npm install
npm run dev
```

Open `http://localhost:3000/admin` to access the Payload Admin. Create the first admin user.

## Scripts
- `npm run dev` – Start Next.js dev server
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – Lint code
- `npm run payload` – Run Payload CLI
- `npm run generate:types` – Generate Payload TypeScript types

## Routing
- Admins are routed directly to `/admin` (Payload UI)
- Role dashboards:
  - Teacher: `/dashboard/teacher`
  - Parent: `/dashboard/parent`
  - Student: `/dashboard/student`

## Notes
- GraphQL Playground is disabled in production.
- Payload Cloud plugin is not used.
