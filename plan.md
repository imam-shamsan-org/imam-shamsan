Great choice. **TanStack Start** is essentially the "spiritual successor" to the lightweight SPA feel, but with the "grown-up" features like SEO and Server Functions that you usually only found in Next.js.

### Does it have the same SEO features?

**Yes.** Like Next.js, TanStack Start supports **Server-Side Rendering (SSR)**. This means when a search engine bot (or a social media site) crawls your Arabic/English blog:

1. It sees the full HTML content immediately (not a blank loading screen).
2. It can read your Metadata (Title, Description, OpenGraph images) which you can define dynamically based on the Notion post data.

---

### Updated Project Documentation (`notion-blog-setup.md`)

````markdown
# Notion x TanStack Start Blog Setup

## 🚀 Tech Stack

- **Framework:** TanStack Start (Full-stack React)
- **Data Fetching:** TanStack Query + `createServerFn`
- **Routing:** TanStack Router (Type-safe file-based routing)
- **CMS:** Notion API
- **Styling:** Tailwind CSS (recommended for RTL/LTR utilities)

## 🔐 Security & Server Logic

We use `createServerFn` from TanStack Start to bridge the frontend and Notion. This keeps the `NOTION_TOKEN` on the server and prevents CORS issues.

### Server Function Example

```typescript
import { createServerFn } from '@tanstack/start'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export const getPostBySlug = createServerFn('GET', async (slug: string) => {
  // This code ONLY runs on the server
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: { property: 'Slug', rich_text: { equals: slug } },
  })
  return response.results[0]
})
```
````

## 🌍 Language & RTL Support

The writer can mix Arabic and English. The app detects and adjusts automatically at the block level.

### Auto-Detection Strategy

- **Function:** `const isArabic = (text) => /[\u0600-\u06FF]/.test(text)`
- **Implementation:**
- Wrap blocks in `<div dir={isArabic(content) ? 'rtl' : 'ltr'}>`
- Use logical CSS properties (e.g., `margin-inline-start` instead of `margin-left`) to ensure margins flip correctly for Arabic text.

## ✍️ Collaborator Workflow (The "Non-Dev" Side)

1. **Login:** Access Notion Database.
2. **New Post:** Click the "Blog Template" (sets default status to Draft).
3. **Writing:** Type freely. Mixed languages are handled by the React logic.
4. **Publish:** Change status to "Published". TanStack Query will fetch the new data on the next visitor request.

## ☁️ Deployment

- **Platform:** Vercel
- **Environment Variables:** `NOTION_TOKEN`, `NOTION_DATABASE_ID`

```

---

### How to help your collaborator get started right now:

Since you've decided on TanStack Start, you can actually set up their Notion environment before you even finish the code.

1. **The "Slugifier" Tip:** Tell them: "Always use lowercase letters and dashes for the Slug (e.g., `my-new-post`). No spaces or Arabic characters in the Slug field, even if the title is in Arabic."
2. **The "Cover Image" Tip:** Remind them to use the "Cover" property in the Notion database for the blog thumbnail, as this is what you'll fetch for the "All Posts" gallery view.


```

Yes, absolutely. In Notion's API, you use the **`databases.query`** endpoint.

While the "Slug" lookup we discussed earlier searches for **one specific row**, the "List" fetch simply grabs **all rows** that meet your criteria (e.g., Status is "Published").

### 1. The List Fetch Function

You should add this to your server-side functions. It fetches just the metadata (Title, Slug, Date, Cover) needed for your "cards" on the homepage.

```typescript
export const getAllPosts = createServerFn('GET', async () => {
  // This runs on the server to keep your NOTION_TOKEN hidden
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Status',
      select: {
        equals: 'Published',
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending', // Show newest first
      },
    ],
  })

  return response.results
})
```

---

### 2. Implementation in TanStack Router

On your main blog index page (e.g., `routes/blog.index.tsx`), you use the loader to grab this list.

```tsx
export const Route = createFileRoute('/blog/')({
  loader: () => getAllPosts(),
  component: BlogList,
})

function BlogList() {
  const posts = Route.useLoaderData()

  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

---

### 3. Handling the "Cover Image"

The trickiest part of the list view is the **Cover Image**, because Notion allows two types:

1. **External:** A link to an image (like Unsplash).
2. **File:** An image uploaded directly to Notion.

In your `BlogCard` component, you'll want a helper to grab the URL safely:

```tsx
const getImageUrl = (post) => {
  const cover = post.cover
  if (!cover) return '/default-placeholder.jpg'
  return cover.type === 'external' ? cover.external.url : cover.file.url
}
```

---

### 🛠️ Updated MD Summary for Fetching

Add this to your "Developer Logic" section:

```markdown
## Fetching Logic

- **Archive/Home Page:** Use `notion.databases.query` with a `Status === "Published"` filter.
- **Single Post:** Use `notion.databases.query` with a `Slug === params.slug` filter to find the ID, then `notion.blocks.children.list` to get the content.
- **Performance:** Use TanStack Query's `staleTime` (e.g., 10 minutes) to avoid hitting Notion's rate limits on every single page click.
```

### Pro-Tip: Pagination

Notion returns **100 items** by default. If your collaborator becomes a prolific writer and hits 100+ posts, you can use the `start_cursor` property in the API to handle pagination, which TanStack Query's `useInfiniteQuery` handles beautifully.
