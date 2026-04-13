# Imam Shamsan - Project Instructions

## Tech Stack

- **Framework**: TanStack Start (React 19 SSR) + TanStack Router (file-based routing)
- **Styling**: Tailwind CSS v4, shadcn/ui (Base Nova variant), OKLch color space
- **Backend**: Notion API (direct fetch, no SDK runtime), Cloudinary (images), Resend (email)
- **Validation**: Zod v4
- **Deploy**: Vercel via Nitro

## Commands

- `npm run dev` — dev server on port 3005
- `npm run build` — production build
- `npm run check` — prettier + eslint fix
- `npm run test` — vitest

## Architecture

### Data Flow

All data comes from Notion databases via server functions (`createServerFn` from `@tanstack/react-start`). Route loaders call these server functions, components consume via `Route.useLoaderData()`.

### Key Files

- `src/lib/notion.ts` — All Notion queries, server functions, in-memory TTL cache (1min)
- `src/lib/parsers.ts` — Generic Notion block → `ContentBlock[]` renderer
- `src/lib/cloudinary.ts` — Image URL transforms (Notion URLs expire after 1hr, always use Cloudinary)
- `src/lib/seo.ts` — Person schema, article schema, meta helpers
- `src/lib/email.ts` — Resend API for contact form
- `src/lib/theme.tsx` — Dark mode provider (localStorage + class-based)
- `src/styles.css` — Full theme (Islamic green/gold), Arabic font classes, custom utilities

### Notion Databases

Articles, Services, Sermons, Gallery, Settings, Recitations, About — each has env var `NOTION_*_DATABASE_ID`. All queries filter by `Status: Published/Active`.

### Route Structure

```
src/routes/
  __root.tsx        — Layout (Header/Footer), loads SiteSettings
  index.tsx         — Home page
  about.tsx         — About (from Notion About database)
  writings/         — Articles list + $slug detail
  sermons/          — Sermons list + $slug detail
  services.tsx      — Services grid
  gallery.tsx       — Photo gallery (yet-another-react-lightbox)
  media.tsx         — Recitations (YouTube embeds)
  contact.tsx       — Contact form (Resend)
```

### Types

All in `src/types/` — `article.ts`, `sermon.ts`, `service.ts`, `gallery.ts`, `recitation.ts`, `settings.ts`, `about.ts`. `ContentBlock` and `RichTextItem` live in `article.ts` but are shared.

## Conventions

### Bilingual Content

- Arabic text: wrap with `dir="rtl"` + `className="font-arabic"` + `lang="ar"`
- Arabic headings use `.font-arabic-h1` through `.font-arabic-h4`
- English: Montserrat font (default). Arabic: Scheherazade New.

### Components

- Layout: `Header`, `Footer`, `Container` in `src/components/layout/`
- Feature components organized by domain: `src/components/articles/`, `services/`, `sermons/`, etc.
- Shared components in `src/components/shared/` (e.g., `ContentRenderer`, `PageHeader`)
- UI primitives in `src/components/ui/` (shadcn)

### Styling

- Tailwind v4 with `@theme inline` block in styles.css
- Dark mode: `.dark` class on `<html>`, toggled via `ThemeProvider`
- Color tokens: `primary` (Islamic green), `secondary` (gold), standard shadcn semantic tokens
- Import alias: `@/` → `src/`

### Adding a New Notion Database

1. Add env var `NOTION_<NAME>_DATABASE_ID`
2. Add type in `src/types/`
3. Add `pageToX()` mapper + `fetchX()` query + `createServerFn` export in `notion.ts`
4. Create route that calls the server function in its loader

## Workflow Rules

### Pushing to GitHub

- **Never push to GitHub unless the user explicitly confirms a task is done.** Complete the work, commit it, then wait for confirmation before pushing. This avoids multiple small pushes per task.
- When the user confirms and asks to push, push all pending local commits in one go.

### Documentation

- **Always update `docs/DEVELOPER_SETUP_GUIDE.md` and `docs/CLIENT_ONBOARDING_GUIDE.md` before pushing.** Any feature that touches Notion database schemas, site settings, new components, new routes, or user-facing behaviour must be reflected in both docs.
- Developer guide: schema changes, new server functions, new components, architectural decisions.
- Client guide: anything the imam needs to know to manage content in Notion (new fields, new checkboxes, new behaviours).

### Closing GitHub Issues

- When work for an issue is done and committed, close it via CLI:
  ```bash
  gh auth switch --user Usmansagemode
  gh issue close <number> --repo imam-shamsan-org/imam-shamsan --comment "<brief explanation>"
  ```
