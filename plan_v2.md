To make this documentation "AI-ready" (highly scannable for LLMs or developers), I've condensed it into a technical specification format. This is perfect for a `.md` file in your repository.

---

# Notion x TanStack Start: Technical Spec

## 🛠 Tech Stack

- **Framework:** TanStack Start (Full-stack SSR)
- **State & Logic:** TanStack Query + TanStack Router
- **CMS:** Notion API (v1)
- **Deployment:** Vercel (Edge Functions)

---

## 🔐 Database Schema (Notion)

| Property | Type        | Description                     |
| -------- | ----------- | ------------------------------- |
| `Name`   | Title       | Blog Post Title                 |
| `Status` | Select      | `Draft`, `Published`            |
| `Slug`   | Text        | URL path (lowercase, no spaces) |
| `Date`   | Date        | Publish date for sorting        |
| `Cover`  | Files/Media | Thumbnail image                 |

---

## 📡 Server-Side Functions (`createServerFn`)

Execute these on the server to protect `NOTION_TOKEN` and bypass CORS.

```typescript
import { createServerFn } from '@tanstack/start'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// 1. Fetch Archive (List view)
export const getAllPosts = createServerFn('GET', async () => {
  return await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: { property: 'Status', select: { equals: 'Published' } },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })
})

// 2. Fetch Single Post (Detail view)
export const getPostBySlug = createServerFn('GET', async (slug: string) => {
  const page = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: { property: 'Slug', rich_text: { equals: slug } },
  })
  if (!page.results[0]) throw new Error('Not Found')

  const content = await notion.blocks.children.list({
    block_id: page.results[0].id,
  })
  return { meta: page.results[0], content: content.results }
})
```

---

## 🌍 Language Logic (Bi-Directional)

Handle mixed English/Arabic content at the block level without user input.

- **Detection:** `const isArabic = (text) => /[\u0600-\u06FF]/.test(text)`
- **Layout:**
- Apply `dir="rtl"` + `text-right` if `isArabic` is true.
- Use **Logical CSS Properties** (e.g., `padding-inline-start`) so layout flips automatically.

- **Font Pairing:** IBM Plex Sans Arabic (covers both scripts natively).

---

## 🛣 Routing (TanStack Router)

`routes/posts.$slug.tsx` handles SEO and pre-fetching.

```tsx
export const Route = createFileRoute('/posts/$slug')({
  loader: ({ params }) => getPostBySlug(params.slug),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.meta.properties.Name.title[0].plain_text }],
  }),
})
```

---

## ✍️ Collaborator Guidelines

- **Writing:** Use the Notion "Blog Template." Type anywhere; layout is auto-detected.
- **Slugs:** lowercase-and-dashes only.
- **Images:** Use the "Cover" property for cards; drag-and-drop for post body.
- **Publishing:** Set status to `Published`. Updates reflect on refresh (no redeploy needed).

Tips:

1. **The "Slugifier" Tip:** Tell them: "Always use lowercase letters and dashes for the Slug (e.g., `my-new-post`). No spaces or Arabic characters in the Slug field, even if the title is in Arabic."
2. **The "Cover Image" Tip:** Remind them to use the "Cover" property in the Notion database for the blog thumbnail, as this is what you'll fetch for the "All Posts" gallery view.

---

## ☁️ Deployment

- **Platform:** Vercel
- **Environment Variables:** `NOTION_TOKEN`, `NOTION_DATABASE_ID`
