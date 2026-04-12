# Developer Setup Guide — Imam Shamsan Website

This guide covers how to set up the project locally, configure the 7 Notion databases and Cloudinary, and deploy to Vercel.

---

## Table of Contents

1. [Local Development Setup](#1-local-development-setup)
2. [Notion Workspace Setup](#2-notion-workspace-setup)
3. [Notion Database Schemas](#3-notion-database-schemas)
4. [Cloudinary Setup](#4-cloudinary-setup)
5. [Environment Variables](#5-environment-variables)
6. [Route & Page Structure](#6-route--page-structure)
7. [Block-Level Content (Mixed Arabic/English)](#7-block-level-content-mixed-arabicenglish)
8. [Data Flow](#8-data-flow)
9. [Deployment (Vercel)](#9-deployment-vercel)
10. [External Accounts & Social Links](#10-external-accounts--social-links)

---

## 1. Local Development Setup

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)

### Install & Run

```bash
git clone <repo-url>
cd imam-shamsan
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                   # starts dev server on port 3005
```

### Available Scripts

| Script            | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start dev server (port 3005)     |
| `npm run build`   | Production build                 |
| `npm run preview` | Preview production build locally |
| `npm run test`    | Run tests (Vitest)               |
| `npm run lint`    | Run ESLint                       |
| `npm run check`   | Format + lint fix                |

### Tech Stack

- **Framework:** TanStack Start (React SSR) + TanStack Router (file-based, type-safe routing)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base Nova theme)
- **CMS:** Notion API (direct fetch, SDK types only) + Cloudinary (URL transformations)
- **Email:** Resend API (contact form)
- **Lightbox:** yet-another-react-lightbox (gallery)
- **Icons:** Lucide React
- **Deployment:** Vercel

> **Note on Notion SDK:** The project imports types from `@notionhq/client` for TypeScript, but makes direct `fetch()` calls to the Notion API rather than using the SDK client. This avoids bundling the full SDK.

---

## 2. Notion Workspace Setup

### Create the Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"New integration"**
3. Name it `Imam Shamsan Website`
4. Select the client's workspace
5. Set capabilities:
   - **Content**: Read content
   - **Comments**: No access
   - **User information**: No access
6. Copy the **Internal Integration Token** — this becomes `NOTION_API_KEY`

### Share Databases with the Integration

Each of the 7 databases must be explicitly shared with the integration:

- Open the database page in Notion
- Click **"..."** (top right) > **"Connections"** > search for your integration name > **"Confirm"**

### Get Database IDs

From each database's URL: `https://notion.so/{workspace}/{DATABASE_ID}?v=...`

Copy the DATABASE_ID portion for your `.env` file.

---

## 3. Notion Database Schemas

Create each database as a **full-page database** in Notion. Property names must match **exactly** — the code queries by these names.

---

### Database 1: Articles

> The primary CMS for blog posts/writings. Body content lives in the **Notion page body** (block content), not in properties. Displayed on the `/writings` page.

| Property Name    | Type             | Purpose                                                                                                           |
| ---------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Title            | Title            | Article name (Notion's default title column)                                                                      |
| Slug             | Rich text        | URL-friendly identifier (e.g., `patience-in-islam`)                                                               |
| Description      | Rich text        | Excerpt/summary shown in article cards                                                                            |
| Cover Image      | URL              | Cloudinary URL for the cover image                                                                                |
| Language         | Select           | Options: `English`, `Arabic`, `Bilingual`                                                                         |
| Category         | Select           | Options: `Islamic Knowledge`, `Quran/Hadith Commentary`, `Ramadan/Eid`, `Personal Reflections`, `Islamic History` |
| Tags             | Multi-select     | Flexible tagging (e.g., Faith, Family, Youth)                                                                     |
| Status           | Select           | Options: `Draft`, `Published`                                                                                     |
| Featured         | Checkbox         | Show on homepage                                                                                                  |
| Created time     | Created time     | Auto-generated by Notion                                                                                          |
| Last edited time | Last edited time | Auto-generated by Notion                                                                                          |

**Body content:** The imam writes directly in the page body — paragraphs, headings, lists, quotes, callouts, images (Cloudinary URLs via Embed link).

**How the code uses it:**

- Filters by `Status = Published`
- Sorts by `Created time` descending
- For article detail pages (`/writings/$slug`), fetches all child blocks for the full body
- `Language` determines RTL rendering (`Arabic` → `dir="rtl"` + Scheherazade New font)
- `Featured` articles are shown on the homepage via `getFeaturedArticles`
- Client-side filtering by `Language` and `Category` on the `/writings` page

**Env variable:** `NOTION_ARTICLES_DATABASE_ID`

---

### Database 2: Services

> Booking cards with pricing. No page body content needed — everything is in properties. Displayed on the `/services` page and previewed on the homepage.

| Property Name | Type      | Purpose                                              |
| ------------- | --------- | ---------------------------------------------------- |
| Name EN       | Title     | English service name (Notion's default title column) |
| Name AR       | Rich text | Arabic service name                                  |
| Description   | Rich text | Brief description of the service                     |
| Price Display | Rich text | e.g., `$300` or `$300-$500` or `Contact for details` |
| Price Note    | Rich text | Additional pricing info (e.g., "based on distance")  |
| Icon          | Rich text | Icon identifier (for future use)                     |
| Order         | Number    | Display order (lower numbers first)                  |
| Status        | Select    | Options: `Active`, `Inactive`                        |

**How the code uses it:**

- Filters by `Status = Active`
- Sorts by `Order` ascending
- Each card links to `/contact?service={slug}` (pre-fills the contact form)
- Services are also loaded on the `/contact` page for the dropdown

**Env variable:** `NOTION_SERVICES_DATABASE_ID`

---

### Database 3: Sermon Summaries

> Written summaries of Friday khutbahs. Body content lives in the **Notion page body**. Displayed on the `/sermons` page.

| Property Name | Type         | Purpose                                      |
| ------------- | ------------ | -------------------------------------------- |
| Title         | Title        | Sermon title (Notion's default title column) |
| Slug          | Rich text    | URL-friendly identifier                      |
| Description   | Rich text    | Short summary for listing cards              |
| YouTube Link  | URL          | Link to the video recording                  |
| Date          | Date         | Date the sermon was delivered                |
| Status        | Select       | Options: `Draft`, `Published`                |
| Created time  | Created time | Auto-generated by Notion                     |

**Body content:** The imam writes the full sermon summary in the page body (mixed Arabic/English).

**How the code uses it:**

- Filters by `Status = Published`
- Sorts by `Date` descending
- For detail pages (`/sermons/$slug`), embeds the YouTube video + renders the written summary from page blocks

**Env variable:** `NOTION_SERMONS_DATABASE_ID`

---

### Database 4: Gallery

> Individual photos for the gallery page. No page body content — one entry per image. Displayed on the `/gallery` page.

| Property Name | Type     | Purpose                                                                         |
| ------------- | -------- | ------------------------------------------------------------------------------- |
| Caption       | Title    | Photo caption (Notion's default title column)                                   |
| Image URL     | URL      | Direct Cloudinary URL for the photo                                             |
| Category      | Select   | Options: `Events`, `Conferences`, `Community`, `Scholars`, `Programs`, `Flyers` |
| Order         | Number   | Display order within a category                                                 |
| Featured      | Checkbox | Highlight on homepage or top of gallery                                         |
| Status        | Select   | Options: `Active`, `Inactive`                                                   |

**How the code uses it:**

- Filters by `Status = Active`
- Sorts by `Order` ascending
- Client-side filtering by `Category`
- Clicking opens a full-screen lightbox (yet-another-react-lightbox)

**Env variable:** `NOTION_GALLERY_DATABASE_ID`

---

### Database 5: Recitations

> Qur'anic recitation videos displayed on the `/media` page. Each entry is one YouTube video. To remove a recitation, simply delete the row.

| Property Name | Type   | Purpose                                 |
| ------------- | ------ | --------------------------------------- |
| Title         | Title  | Recitation name (e.g., "Surah Al-Mulk") |
| YouTube Link  | URL    | YouTube video link                      |
| Order         | Number | Display order (lower numbers first)     |

**How the code uses it:**

- Fetches all entries (no status filter)
- Sorts by `Order` ascending
- Embeds each video on the Media page in a 3-column grid

**Env variable:** `NOTION_RECITATIONS_DATABASE_ID`

---

### Database 6: About Page

> Single-entry database for the About page. The imam writes the full about page content in the **Notion page body** using headings, paragraphs, lists, etc. Displayed on the `/about` page.

| Property Name | Type      | Purpose                                   |
| ------------- | --------- | ----------------------------------------- |
| Title         | Title     | Page heading (e.g., "About Imam Shamsan") |
| Subtitle AR   | Rich text | Arabic subtitle shown under the heading   |
| Status        | Select    | Options: `Draft`, `Published`             |

**Body content:** The imam writes the entire about page content — biography, education, specializations, etc. — using Notion's built-in formatting (headings, paragraphs, bullet lists, quotes, images via Cloudinary Embed link).

**How the code uses it:**

- Filters by `Status = Published`, fetches only 1 entry (`page_size: 1`)
- Fetches all child blocks for the page body
- Renders using the existing `ArticleContent` block renderer
- Falls back to hardcoded content if the database is not configured or empty
- Profile image comes from Site Settings (`profile_img`), not this database

**Env variable:** `NOTION_ABOUT_DATABASE_ID`

---

### Database 7: Site Settings

> Key-value configuration. Lets the imam update things like the live stream URL without code changes.

| Property Name    | Type             | Purpose                  |
| ---------------- | ---------------- | ------------------------ |
| Key              | Title            | Setting name             |
| Value            | Rich text        | Setting value            |
| Last edited time | Last edited time | Auto-generated by Notion |

**Initial entries to create:**

| Key               | Example Value                                              |
| ----------------- | ---------------------------------------------------------- |
| live_stream_url   | `https://www.youtube.com/watch?v=xxxxx`                    |
| live_stream_title | `Friday Khutbah - Week of Feb 14`                          |
| profile_img       | `https://res.cloudinary.com/.../profile.jpg`               |
| logo              | `https://res.cloudinary.com/.../logo.jpg`                  |
| youtube_url       | `https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg` |
| facebook_url      | `https://www.facebook.com/shamsan.aljabi.2025`             |
| instagram_url     | `https://www.instagram.com/dr.sham_san/`                   |

**How the code uses it:**

- Settings are loaded in the root layout (`__root.tsx`) and passed to Header (logo) and Footer (social links)
- The homepage (`index.tsx`) passes settings to `HeroSection` and `MediaHighlight`
- The about page uses `profile_img`
- The media page uses `live_stream_url`, `live_stream_title`, and `youtube_url`
- The contact page uses `youtube_url`, `facebook_url`, and `instagram_url`
- The footer uses `youtube_url`, `facebook_url`, and `instagram_url`

**Env variable:** `NOTION_SETTINGS_DATABASE_ID`

---

## 4. Cloudinary Setup

### What Cloudinary Does

Cloudinary hosts all images permanently. The `CloudinaryImage` component transforms Cloudinary URLs on-the-fly for optimization (resizing, format conversion, quality) using URL transformations — no Cloudinary API key or SDK is needed at runtime.

### Account Setup

1. Create a free Cloudinary account (or use the client's)
2. Note the **Cloud Name** from the Dashboard — this is the only value needed
3. No API Key or API Secret required (we only do URL transformations, not API calls)

### How the Imam Uploads Images

1. Log in to Cloudinary
2. Click **Upload** and drop the image(s)
3. Copy the URL (right-click the image > Copy URL)
4. Paste the URL in Notion:
   - **For article inline images:** In the page body, type `/image` > choose **"Embed link"** > paste the Cloudinary URL
   - **For cover images / gallery:** Paste the URL directly into the `Cover Image` or `Image URL` property

**Important:** The imam must always use **"Embed link"** (not "Upload") when adding images in Notion page bodies. Notion-hosted images expire after 1 hour. Cloudinary URLs are permanent.

### Folder Structure (Optional)

No folder structure is required. The code works with any valid Cloudinary URL regardless of where the file is stored. The imam can organize folders however they prefer for their own convenience.

---

## 5. Environment Variables

Add these to `.env.local` locally or in Vercel project settings:

```env
# Site
SITE_URL=https://imamshamsan.com

# Notion
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ARTICLES_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SERVICES_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SERMONS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_GALLERY_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_RECITATIONS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ABOUT_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SETTINGS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary (cloud name only — no API key needed)
CLOUDINARY_CLOUD_NAME=xxxxxxxxx

# Email
CONTACT_EMAIL=MCCGPImamShamsan@gmail.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Vercel Environment Variables

1. Go to Vercel project > **Settings** > **Environment Variables**
2. Add each variable above for **Production**, **Preview**, and **Development**
3. Redeploy after adding variables

---

## 6. Route & Page Structure

The site uses TanStack Router's file-based routing. All routes are in `src/routes/`.

| Route             | Page           | Data Source                           | Key Features                                                          |
| ----------------- | -------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `/`               | Homepage       | Services, Latest Articles, Settings   | Hero, services preview, latest writings, media highlight, contact CTA |
| `/about`          | About          | About Page + Settings (profile image) | Notion page body rendered with block parser, hardcoded fallback       |
| `/writings`       | Writings list  | Articles                              | Language + category client-side filtering                             |
| `/writings/$slug` | Article detail | Article + page blocks                 | Full body rendered from Notion blocks, RTL support                    |
| `/sermons`        | Sermons list   | Sermon Summaries                      | Grid of sermon cards                                                  |
| `/sermons/$slug`  | Sermon detail  | Sermon + page blocks                  | YouTube embed + written summary                                       |
| `/services`       | Services       | Services                              | Service cards with pricing                                            |
| `/gallery`        | Gallery        | Gallery                               | Category filter, lightbox on click                                    |
| `/media`          | Media          | Recitations, Settings                 | Live stream embed, recitation grid, YouTube channel link              |
| `/contact`        | Contact        | Services                              | Contact form (Resend email), service pre-selection via `?service=`    |

### Key Components

| Component                     | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `layout/Header.tsx`           | Navigation + logo (from settings) + theme toggle    |
| `layout/Footer.tsx`           | Footer with links and social icons                  |
| `layout/Container.tsx`        | Max-width wrapper                                   |
| `layout/ThemeToggle.tsx`      | Dark/light mode toggle (uses ThemeProvider context) |
| `home/HeroSection.tsx`        | Homepage hero with live stream indicator            |
| `home/ServicesPreview.tsx`    | Homepage services preview                           |
| `home/LatestWritings.tsx`     | Homepage latest articles                            |
| `home/MediaHighlight.tsx`     | Homepage media/live stream section                  |
| `articles/ArticleCard.tsx`    | Article listing card                                |
| `articles/ArticleGrid.tsx`    | Grid layout for articles                            |
| `articles/ArticleContent.tsx` | Renders Notion blocks as HTML                       |
| `articles/LanguageFilter.tsx` | Language + category filter controls                 |
| `sermons/SermonCard.tsx`      | Sermon listing card                                 |
| `sermons/SermonContent.tsx`   | Renders sermon page blocks                          |
| `services/ServiceCard.tsx`    | Service card with pricing                           |
| `services/ServiceGrid.tsx`    | Grid layout for services                            |
| `gallery/GalleryGrid.tsx`     | Masonry-style gallery grid                          |
| `gallery/GalleryLightbox.tsx` | Full-screen image lightbox                          |
| `contact/ContactForm.tsx`     | Contact form with service dropdown                  |
| `shared/CloudinaryImage.tsx`  | Image component with Cloudinary URL transforms      |
| `shared/ArabicText.tsx`       | Wrapper for Arabic text (RTL + font)                |
| `shared/TagList.tsx`          | Tag badge list                                      |

### Key Library Files

| File                | Purpose                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `lib/notion.ts`     | All Notion API queries + server functions (with in-memory TTL cache)                           |
| `lib/parsers.ts`    | Notion block → `ContentBlock` parser                                                           |
| `lib/cloudinary.ts` | Cloudinary URL transformation helpers (presets, srcSet, blur placeholders)                     |
| `lib/email.ts`      | Resend API integration for contact form (zod-validated)                                        |
| `lib/seo.ts`        | SEO meta tags, Open Graph, JSON-LD schemas                                                     |
| `lib/youtube.ts`    | YouTube URL utilities (embed, thumbnail, stream status). Channel URL comes from Site Settings. |
| `lib/theme.tsx`     | Theme context provider (dark/light mode)                                                       |
| `lib/content.ts`    | Content layout utilities (section splitting, card extraction)                                  |
| `lib/constants.ts`  | Shared constants (categories, languages)                                                       |
| `lib/utils.ts`      | Utility functions (cn, formatDate, slugify)                                                    |

---

## 7. Block-Level Content (Mixed Arabic/English)

All sermon summaries and articles may contain **mixed Arabic and English** text within the same page.

### How It Works

When the imam writes in a Notion page body, Notion stores it as an ordered array of **blocks**:

```
Block 1: heading_2   →  "خطبة الجمعة - The Friday Sermon"
Block 2: paragraph   →  "بسم الله الرحمن الرحيم"
Block 3: paragraph   →  "Today we reflect on the importance of..."
Block 4: image       →  { type: "external", url: "https://res.cloudinary.com/..." }
Block 5: quote       →  "Indeed, with hardship comes ease. (94:6)"
```

### How the Code Renders It

- The code fetches all child blocks recursively via the Notion API (`src/lib/notion.ts`)
- Each block is parsed into a `ContentBlock` type (`src/lib/parsers.ts`)
- The `ArticleContent` component (`src/components/articles/ArticleContent.tsx`) renders each block as the appropriate HTML element
- **Articles with `Language: Arabic`** get `dir="rtl"` + Scheherazade New font on the entire article
- **Bilingual articles** use `dir="auto"` so the browser detects direction per-paragraph

### Fonts

- **English text:** Montserrat (weights: 400, 500, 600, 700)
- **Arabic text:** Scheherazade New (weights: 400, 500, 600, 700)

Both are loaded from Google Fonts in `src/styles.css`.

### Notion-Hosted Images Expire

If the imam drags an image directly into Notion (upload), Notion stores it with a **signed URL that expires after 1 hour**:

- Site loads at 2:00 PM → image works
- Visitor at 4:00 PM → **broken image**

**The solution:** Always use **"Embed link"** and paste a **Cloudinary URL**. The code handles both types but only Cloudinary URLs are permanent.

---

## 8. Data Flow

```
Imam uploads images to Cloudinary → copies URL
        |
        v
Imam writes in Notion (text + Cloudinary image embeds)
        |
        v
Website queries Notion API (Status = Published / Active)
        |
        v
For articles/sermons: fetches page blocks (paragraphs, headings, images, lists)
For services/gallery/recitations/settings: reads properties directly
        |
        v
Images rendered via Cloudinary URL transformations (auto format, quality, resize)
        |
        v
Arabic content rendered with Scheherazade New font + RTL direction
```

The imam manages content through two interfaces:

- **Notion** — all text content, metadata, publish controls, inline image embeds
- **Cloudinary** — uploading photos, then pasting URLs into Notion

---

## 9. Deployment (Vercel)

### GitHub Repository Setup

The repository should be hosted under a **GitHub Organization** so both the developer and the client have access. This allows the client to connect the repo to their own Vercel account for automatic deployments.

**Steps:**

1. Create a GitHub Organization (free tier)
2. Transfer or create the repo under the org
3. Add both developer and client as org members
4. The client connects the org repo to their Vercel account

> **Why an org?** Vercel requires admin-level access to install its GitHub webhook for automatic deployments. A collaborator on a personal repo cannot do this. A GitHub Organization gives both parties the access needed.

### Vercel Project Settings

1. **Framework Preset:** Other (TanStack Start uses Nitro/Vinxi under the hood)
2. **Build Command:** `npm run build`
3. **Output Directory:** `.output` (auto-detected)
4. **Node.js Version:** 18.x or 20.x
5. **Environment Variables:** Add all variables from Section 5 for Production, Preview, and Development

### Custom Domain

1. In Vercel: **Settings** > **Domains** > Add `imamshamsan.com` (or the chosen domain)
2. In Namecheap: Update DNS to point to Vercel's nameservers (Vercel provides these)
3. Vercel will auto-provision an SSL certificate

### Resend Domain Verification

For the contact form email to work in production:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Add the production domain (e.g., `imamshamsan.com`)
3. Add the DNS records Resend provides to Namecheap
4. Once verified, update the `from` address in `src/lib/email.ts` from `onboarding@resend.dev` to your verified domain

---

## 10. External Accounts & Social Links

Social media links are managed via the **Site Settings** Notion database (`youtube_url`, `facebook_url`, `instagram_url`). The imam can update them at any time without code changes. Hardcoded fallback defaults are used if the settings are not configured.

| Platform  | Settings Key    | Default URL                                                | Used In                                    |
| --------- | --------------- | ---------------------------------------------------------- | ------------------------------------------ |
| YouTube   | `youtube_url`   | `https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg` | Media page, Homepage, Contact page, Footer |
| Facebook  | `facebook_url`  | `https://www.facebook.com/shamsan.aljabi.2025`             | Contact page, Footer                       |
| Instagram | `instagram_url` | `https://www.instagram.com/dr.sham_san/`                   | Contact page, Footer                       |

**Contact email:** `MCCGPImamShamsan@gmail.com` (configured via `CONTACT_EMAIL` env var)

### SEO & Structured Data

The site includes:

- **Open Graph + Twitter Card** meta tags on every page (`src/lib/seo.ts`)
- **JSON-LD schemas:** Person schema (homepage, about), Article schema (article detail), BreadcrumbList schema (all pages)
- **Canonical URLs** on every page
- **Dark mode** support with `localStorage` persistence and flash-prevention script in `<head>`
