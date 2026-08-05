# Developer Setup Guide — Imam Shamsan Website

This guide covers how to set up the project locally, configure the 9 Notion databases and Cloudinary, and deploy to Vercel.

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
git clone https://github.com/imam-shamsan-org/imam-shamsan.git
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

Each of the 9 databases must be explicitly shared with the integration:

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
- Each card opens a `ZellePaymentSheet` dialog (`src/components/shared/ZellePaymentSheet.tsx`) showing Zelle payment info on the left and a booking confirmation form on the right. Receipt upload is **required** (PDF or PNG, max 3 MB) — submission is blocked without it. Service-mode forms also require the visitor to scroll and accept the Ruqyah Service Agreement & Liability Waiver before submitting.
- Services are also loaded on the `/contact` page for the dropdown

**Zelle credentials** are defined in `src/lib/constants.ts` (`ZELLE_EMAIL`, `ZELLE_PHONE`). Update them there if the payment details ever change — they are used in both the Services and Humanitarian Aid flows.

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

| Property Name | Type     | Purpose                                                        |
| ------------- | -------- | -------------------------------------------------------------- |
| Title         | Title    | Recitation name (e.g., "Surah Al-Mulk")                        |
| YouTube Link  | URL      | YouTube video link                                             |
| Order         | Number   | Display order (lower numbers first)                            |
| Featured      | Checkbox | Pin to the homepage Featured Recitations section (max 4 shown) |

**How the code uses it:**

- Fetches all entries (no status filter)
- Sorts by `Order` ascending
- Embeds each video on the Media page in a 3-column grid
- `getFeaturedRecitations` filters on `Featured = true` and caps at 4 for the homepage section

**Env variable:** `NOTION_RECITATIONS_DATABASE_ID`

---

### Database 6: About Page

> Single-entry database for the About page. The imam writes the full about page content in the **Notion page body** using headings, paragraphs, lists, etc. Displayed on the `/about` page.

| Property Name | Type      | Purpose                                                                                                                                                    |
| ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title         | Title     | Page heading (e.g., "About Imam Shamsan")                                                                                                                 |
| Name EN       | Rich text | English name used on the About page. Falls back to a hardcoded default if left empty.                                       |
| Subtitle AR   | Rich text | Arabic subtitle shown under the heading on the About page. Falls back to a hardcoded default if left empty. |
| Status        | Select    | Options: `Draft`, `Published`                                                                                                                             |

**Body content:** The imam writes the entire about page content — biography, education, specializations, etc. — using Notion's built-in formatting (headings, paragraphs, bullet lists, quotes, images via Cloudinary Embed link).

**How the code uses it:**

- Filters by `Status = Published`, fetches only 1 entry (`page_size: 1`)
- Fetches all child blocks for the page body
- Renders using the existing `ArticleContent` block renderer
- Falls back to hardcoded content if the database is not configured or empty
- Profile image comes from Site Settings (`profile_img`), not this database
- The homepage hero title no longer reads from this database — it's driven entirely by Site Settings (`hero_title_eng`, `hero_title_ar`)

**Env variable:** `NOTION_ABOUT_DATABASE_ID`

---

### Database 7: Site Settings

> Key-value configuration. Lets the imam update things like the live stream URL without code changes.

| Property Name    | Type             | Purpose                                                |
| ---------------- | ---------------- | ------------------------------------------------------ |
| Key              | Title            | Setting name                                           |
| Value            | Rich text        | Setting value                                          |
| Duration         | Number           | Optional duration in hours (used by `live_stream_url`) |
| Last edited time | Last edited time | Auto-generated by Notion                               |

**Initial entries to create:**

| Key               | Example Value                                              | Duration                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| live_stream_url   | `https://www.youtube.com/watch?v=xxxxx`                    | `4` (hours — how long the stream shows as LIVE after the URL was last updated. Defaults to 4 if blank. Use `8` or `24` for all-day events like Friday khutbah.) |
| live_stream_title | `Friday Khutbah - Week of Feb 14`                          | —                                                                                                                                                               |
| hero_title_eng    | `Dr. Imam Shamsan Al-Jabi`                                  | — (Homepage hero title in English. Falls back to a hardcoded default (`PERSON_NAME_FULL` in `src/lib/constants.ts`) if left empty.) |
| hero_title_ar     | `الشيخ الدكتور شمسان الجابي`                                | — (Homepage hero title in Arabic, shown under the English title. Falls back to a hardcoded default (`PERSON_NAME_AR` in `src/lib/constants.ts`) if left empty.) |
| profile_img       | `https://res.cloudinary.com/.../profile.jpg`               | —                                                                                                                                                               |
| logo              | `https://res.cloudinary.com/.../logo.jpg`                  | —                                                                                                                                                               |
| og_image          | `https://res.cloudinary.com/.../og-image.jpg`               | — (Cloudinary URL used sitewide as the social-preview image — `og:image`/`twitter:image` — shown when a page is shared on Facebook, Twitter/X, WhatsApp, etc. Must be a Cloudinary URL, not a raw Notion file URL — Notion URLs expire after 1 hour, same caveat as `profile_img`. Optional — leave blank to omit the social-preview image entirely rather than show a broken one.) |
| cv_url            | `https://res.cloudinary.com/.../cv.pdf`                    | — (Cloudinary URL of the imam's CV — PDF or image. When set, renders a `CvPreview` section at the bottom of the About page with View and Download buttons.)     |
| youtube_url       | `https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg` | —                                                                                                                                                               |
| facebook_url      | `https://www.facebook.com/shamsan.aljabi.2025`             | —                                                                                                                                                               |
| instagram_url     | `https://www.instagram.com/dr.sham_san/`                   | —                                                                                                                                                               |
| shop_category_bg_perfumes       | `https://res.cloudinary.com/.../perfumes-banner.jpg`       | — (Cloudinary URL for the banner image shown on the Shop page's Perfumes tab. Must be a Cloudinary URL, not a raw Notion file URL — Notion URLs expire after 1 hour, same caveat as `profile_img`. Optional — leave blank to show no banner.) |
| shop_category_bg_hats           | `https://res.cloudinary.com/.../hats-banner.jpg`           | — (Same as above, for the Hats tab.)                                                                                                                             |
| shop_category_bg_thoubs         | `https://res.cloudinary.com/.../thoubs-banner.jpg`         | — (Same as above, for the Thoubs tab.)                                                                                                                           |
| shop_category_bg_honey          | `https://res.cloudinary.com/.../honey-banner.jpg`          | — (Same as above, for the Honey tab.)                                                                                                                            |
| shop_category_bg_coffee         | `https://res.cloudinary.com/.../coffee-banner.jpg`         | — (Same as above, for the Coffee tab.)                                                                                                                           |
| shop_category_bg_leather_socks  | `https://res.cloudinary.com/.../leather-socks-banner.jpg`  | — (Same as above, for the Leather Socks tab.)                                                                                                                    |

**How the code uses it:**

- Settings are loaded in the root layout (`__root.tsx`) and passed to Header (logo) and Footer (social links)
- The homepage (`index.tsx`) passes settings to `HeroSection`, `MediaHighlight`, and computes `isLive` to conditionally reorder sections
- `HeroSection` (`src/components/home/HeroSection.tsx`) reads `hero_title_eng` and `hero_title_ar` for the homepage title, falling back to hardcoded constants when unset
- The about page uses `profile_img`
- The media page uses `live_stream_url`, `live_stream_title`, and `youtube_url`
- The contact page uses `youtube_url`, `facebook_url`, and `instagram_url`
- The footer uses `youtube_url`, `facebook_url`, and `instagram_url`
- `live_stream_url.Duration` controls the active window for `getStreamStatus()` — how many hours after a URL update the stream is considered LIVE (default: 4)
- The shop page (`shop.tsx`) fetches Settings and maps each `shop_category_bg_*` key to the currently active category tab (`CATEGORY_BG_KEYS` in `src/routes/shop.tsx`), rendering it via the new `CategoryBanner` component (`src/components/shop/CategoryBanner.tsx`) beneath the tabs, above the category content. All 6 keys are optional and independent — none are seeded by default, so the page looks unchanged until a value is added. `CategoryBanner` silently renders nothing if the URL is missing or fails to load (no broken-image placeholder).
- `og_image` is read via `getSettingsOgImage()` in `src/lib/seo.ts` and used as the `og:image`/`twitter:image` fallback across every page (homepage, about, services, writings, sermons, media, gallery, contact, terms, privacy, and individual article/sermon detail pages). Article detail pages prefer the article's own `Cover Image` when set, falling back to `og_image` otherwise. When `og_image` is unset, the tags are simply omitted rather than pointing at a broken image.

**Env variable:** `NOTION_SETTINGS_DATABASE_ID`

---

### Database 8: Humanitarian Projects

> Initiative cards for the Humanitarian Aid page. Each card represents one initiative. Displayed on `/humanitarian`.

| Property Name        | Type      | Purpose                                                                                          |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| Name                 | Title     | Initiative name in English                                                                       |
| Slug                 | Rich text | URL-friendly identifier (e.g., `medical-aid`). Used for `/humanitarian/$slug` routes.            |
| Name (Arabic)        | Rich text | Initiative name in Arabic                                                                        |
| Description          | Rich text | Short description (2–3 sentences)                                                                |
| Description (Arabic) | Rich text | Arabic description                                                                               |
| Category             | Select    | Options: `Medical`, `Food`, `Water`, `Education`, `Family`, `Religious`, `Qurbani`               |
| Icon                 | Rich text | Lucide icon keyword — see `src/lib/humanitarian-icons.ts` for the full list of 27 supported keys |
| Sort Order           | Number    | Display order on the page                                                                        |
| Status               | Select    | Options: `Active`, `Completed`, `Paused`                                                         |

**How the code uses it:** Filters by `Status = Active`, sorts by `Sort Order`. Rendered as a grid of `ProjectCard` components on `/humanitarian`. Each card opens the Zelle `ContributeDialog` flow.

**Env variable:** `NOTION_HUMANITARIAN_PROJECTS_DATABASE_ID`

---

### Database 9: Shop Products

> All shop products across all categories in a single database. The `Category` field distinguishes product types. At launch, only the Perfumes category has content — other categories show "Coming Soon" until entries are added.

| Property Name  | Type      | Purpose                                                                                 |
| -------------- | --------- | --------------------------------------------------------------------------------------- |
| Name           | Title     | English product name (e.g., "Shamsan Fresh Bloom")                                      |
| Category       | Select    | Options: `Perfumes`, `Hats`, `Thoubs`, `Honey`, `Coffee`, `Leather Socks`               |
| Arabic Name    | Rich text | Arabic product name                                                                     |
| Tagline EN     | Rich text | Short one-liner in English                                                              |
| Tagline AR     | Rich text | Short one-liner in Arabic                                                               |
| Ingredients EN | Rich text | Comma-separated notes (Perfumes only, e.g., `Jasmine, Lemon, White Musk`)               |
| Ingredients AR | Rich text | Arabic comma-separated notes (Perfumes only)                                            |
| Mood EN        | Rich text | Occasion/character tag (Perfumes only, e.g., `Fresh, daily use`)                        |
| Mood AR        | Rich text | Arabic mood tag (Perfumes only)                                                         |
| Color Accent   | Select    | Options: `yellow`, `brown`, `orange`, `teal`, `pink`, `red`, `green`, `blue` — card dot |
| Photo          | URL       | Cloudinary URL of the product image (paste URL — do not upload directly to Notion)      |
| Status         | Select    | Options: `Published`, `Draft`                                                           |
| Sort Order     | Number    | Display order within a category                                                         |

**How the code uses it:** `getPublishedPerfumes` filters `Status = Published` AND `Category = Perfumes`, sorted by `Sort Order`. Available perfume notes for the "Create Your Own" flow are hardcoded in `src/lib/perfume-notes.ts` — they are not stored in Notion.

**Seed data:** Use `data/shop-perfumes.csv` to populate the 10 Signature Collection perfumes.

**Env variable:** `NOTION_SHOP_DATABASE_ID`

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
# Site — currently the live Vercel subdomain; update to the custom domain once Namecheap is purchased
SITE_URL=https://imam-shamsan.vercel.app

# Notion
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ARTICLES_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SERVICES_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SERMONS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_GALLERY_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_RECITATIONS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ABOUT_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SETTINGS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_HUMANITARIAN_PROJECTS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SHOP_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

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

| Route             | Page               | Data Source                                               | Key Features                                                                                                                                                                              |
| ----------------- | ------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | Homepage           | Services, Latest Articles, Settings, Featured Recitations | Hero title comes from Site Settings' `hero_title_eng`/`hero_title_ar` (falls back to hardcoded defaults if empty); section order is conditional: when live stream is active → Live Stream → Featured Recitations → Services → Writings; otherwise → Services → Writings → Featured Recitations → Media |
| `/about`          | About              | About Page + Settings (profile image)                     | Notion page body rendered with block parser, hardcoded fallback                                                                                                                           |
| `/writings`       | Writings list      | Articles                                                  | Language + category client-side filtering                                                                                                                                                 |
| `/writings/$slug` | Article detail     | Article + page blocks                                     | Full body rendered from Notion blocks, RTL support                                                                                                                                        |
| `/sermons`        | Sermons list       | Sermon Summaries                                          | Grid of sermon cards                                                                                                                                                                      |
| `/sermons/$slug`  | Sermon detail      | Sermon + page blocks                                      | YouTube embed + written summary                                                                                                                                                           |
| `/services`       | Services           | Services                                                  | Service cards with pricing                                                                                                                                                                |
| `/gallery`        | Gallery            | Gallery                                                   | Category filter, lightbox on click                                                                                                                                                        |
| `/media`          | Media              | Recitations, Settings                                     | Live stream embed, recitation grid, YouTube channel link                                                                                                                                  |
| `/contact`        | Contact            | Services                                                  | Contact form (Resend email), service pre-selection via `?service=`                                                                                                                        |
| `/humanitarian`   | Humanitarian Aid   | Humanitarian Projects                                     | Grid of initiative cards; each card opens the Zelle `ContributeDialog` flow                                                                                                               |
| `/shop`           | Shop               | Shop Products (perfumes), Settings (category banners)     | Category tab filter; optional `CategoryBanner` image beneath the tabs per active category (from `shop_category_bg_*` Settings keys); Perfumes: signature grid + "Create Your Own" notes selector; other categories show Coming Soon; `PerfumeOrderDialog` for Zelle orders with an optional customer note included in the order email                                |
| `/terms`          | Terms & Conditions | Static (hardcoded)                                        | Explains the Shop/Humanitarian Aid flows are manual and Zelle-based — no online checkout or payment processing happens on the site                                                        |
| `/privacy`        | Privacy Policy     | Static (hardcoded)                                        | Explains form submissions (Contact, Shop, Humanitarian) are emailed via Resend and not stored in a database; no cookies/analytics are used                                                |
| `/sitemap.xml`    | Sitemap            | Static (code-generated)                                   | XML sitemap of the static top-level pages, generated in `src/routes/sitemap[.]xml.ts`; excludes Notion-backed dynamic detail pages (articles, sermons, humanitarian cases) by design         |
| `/robots.txt`     | Robots file        | Static (code-generated)                                   | Search-engine crawl instructions, generated in `src/routes/robots[.]txt.ts`; points crawlers to `/sitemap.xml`                                                                             |

`/terms` and `/privacy` are intentionally static — legal copy that describes how the site behaves, not content the imam edits. If the Shop or Humanitarian Aid flows change (e.g., real online payments are added), update both pages to match.

`/sitemap.xml` and `/robots.txt` are also generated entirely from code, not Notion — there's nothing for the imam to configure. Both list only the static top-level pages (home, about, services, writings, sermons, contact, gallery, media, shop, humanitarian, privacy, terms); Notion-backed dynamic detail routes are intentionally excluded to keep the sitemap basic and scoped to main navigable pages.

### Key Components

| Component                      | Purpose                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `layout/Header.tsx`            | Navigation + logo (from settings) + theme toggle                                                             |
| `layout/Footer.tsx`            | Footer with links and social icons                                                                           |
| `layout/Container.tsx`         | Max-width wrapper                                                                                            |
| `layout/ThemeToggle.tsx`       | Dark/light mode toggle (uses ThemeProvider context)                                                          |
| `home/HeroSection.tsx`         | Homepage hero with live stream indicator                                                                     |
| `home/ServicesPreview.tsx`     | Homepage services preview                                                                                    |
| `home/LatestWritings.tsx`      | Homepage latest articles                                                                                     |
| `home/MediaHighlight.tsx`      | Homepage media/live stream section                                                                           |
| `home/FeaturedRecitations.tsx` | Homepage featured recitations thumbnail grid (up to 4)                                                       |
| `articles/ArticleCard.tsx`     | Article listing card                                                                                         |
| `articles/ArticleGrid.tsx`     | Grid layout for articles                                                                                     |
| `articles/ArticleContent.tsx`  | Renders Notion blocks as HTML                                                                                |
| `articles/LanguageFilter.tsx`  | Language + category filter controls                                                                          |
| `sermons/SermonCard.tsx`       | Sermon listing card                                                                                          |
| `sermons/SermonContent.tsx`    | Renders sermon page blocks                                                                                   |
| `services/ServiceCard.tsx`     | Service card with pricing                                                                                    |
| `services/ServiceGrid.tsx`     | Grid layout for services                                                                                     |
| `gallery/GalleryGrid.tsx`      | Masonry-style gallery grid                                                                                   |
| `gallery/GalleryLightbox.tsx`  | Full-screen image lightbox                                                                                   |
| `contact/ContactForm.tsx`      | Contact form with service dropdown and optional PDF/PNG file upload (max 5MB, forwarded as email attachment) |
| `shop/CategoryBanner.tsx`      | Optional banner image shown on the Shop page beneath the category tabs, driven by the active category's `shop_category_bg_*` Settings key; renders nothing if unset or the image fails to load |
| `shared/CloudinaryImage.tsx`   | Image component with Cloudinary URL transforms (accepts a forwarded `ref`)                                   |
| `shared/ArabicText.tsx`        | Wrapper for Arabic text (RTL + font)                                                                         |
| `shared/TagList.tsx`           | Tag badge list                                                                                               |

### Key Library Files

| File                        | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/notion.ts`             | All Notion API queries + server functions (with in-memory TTL cache)                                                                                                                                                                                                                                                                                                                                                                                                   |
| `lib/parsers.ts`            | Notion block → `ContentBlock` parser                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `lib/cloudinary.ts`         | Cloudinary URL transformation helpers (presets, srcSet, blur placeholders)                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/email.ts`              | Resend API integration — handles contact form submissions and shop order emails (both zod-validated). Contact form supports optional PDF/PNG attachment; shop orders include selected perfume notes and an optional customer note (capped at `SHOP_NOTE_MAX_LENGTH`, see `lib/constants.ts`), included in the order email when the customer fills it in.                                                                                                                                                                                                                                                                   |
| `lib/seo.ts`                | SEO meta tags, Open Graph, JSON-LD schemas                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/youtube.ts`            | YouTube URL utilities (embed, thumbnail, stream status). Channel URL comes from Site Settings.                                                                                                                                                                                                                                                                                                                                                                         |
| `lib/theme.tsx`             | Theme context provider (dark/light mode)                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `lib/content.ts`            | Content layout utilities (section splitting, card extraction)                                                                                                                                                                                                                                                                                                                                                                                                          |
| `lib/constants.ts`          | Shared constants (categories, languages, `ZELLE_EMAIL`, `ZELLE_PHONE`, `SHOP_NOTE_MAX_LENGTH`)                                                                                                                                                                                                                                                                                                                                                                         |
| `lib/perfume-notes.ts`      | Hardcoded `AVAILABLE_NOTES` and `NOTE_CATEGORIES` for the "Create Your Own" perfume flow (21 notes across 7 categories)                                                                                                                                                                                                                                                                                                                                                |
| `lib/humanitarian-icons.ts` | Maps the Notion `Icon` text field to Lucide icons. Registry of 27 supported keywords: `stethoscope`, `droplets`, `utensils`, `graduation-cap`, `home`, `book-open`, `truck`, `heart`, `users`, `hand-heart`, `wheat`, `chef-hat`, `shield-alert`, `baby`, `moon`, `star`, `building`, `shirt`, `syringe`, `heart-pulse`, `tent`, `soup`, `drill`, `scroll`, `rings`, `medical-bag`, `sunrise`. Falls back to a category-based default icon if the key is unrecognised. |
| `lib/utils.ts`              | Utility functions (cn, formatDate, slugify)                                                                                                                                                                                                                                                                                                                                                                                                                            |

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

> **Done.** The repository is live at `https://github.com/imam-shamsan-org/imam-shamsan` under the `imam-shamsan-org` GitHub Organization. Both the developer (`Usmansagemode`) and the client are org members.

The org structure is needed because Vercel requires admin-level GitHub access to install its webhook for automatic deployments — a personal-repo collaborator cannot grant this.

### Vercel Project Setup

> **Done.** The Vercel project is connected to the GitHub org repository and deploys automatically on every push to `main`. All environment variables are configured in Vercel.

_For reference — settings used:_

1. **Framework Preset:** Other (TanStack Start uses Nitro/Vinxi under the hood)
2. **Build Command:** `npm run build`
3. **Output Directory:** `.output` (auto-detected)
4. **Node.js Version:** 18.x or 20.x
5. **Environment Variables:** All variables from Section 5 added for Production, Preview, and Development

### Custom Domain

> **Pending — optional.** No custom domain has been purchased yet. The site is currently live on a Vercel-generated subdomain. When the client purchases a domain on Namecheap:

1. In Vercel: **Settings** > **Domains** > Add the chosen domain (e.g., `imamshamsan.com`)
2. In Namecheap: Update DNS to point to Vercel's nameservers (Vercel provides these after step 1)
3. Vercel auto-provisions an SSL certificate
4. Update `SITE_URL` in Vercel environment variables to the new domain
5. Complete Resend domain verification (see below)

### Resend Domain Verification

> **Pending — blocked on custom domain.** The contact and shop order emails currently send from `onboarding@resend.dev` (Resend's sandbox address). This works for testing but should be updated once a domain is live.

When a domain is ready:

1. Go to [https://resend.com/domains](https://resend.com/domains) and add the production domain
2. Add the DNS records Resend provides to Namecheap
3. Once verified, update the `from` address in `src/lib/email.ts` from `onboarding@resend.dev` to a verified address (e.g., `noreply@imamshamsan.com`)

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

- **Open Graph + Twitter Card** meta tags on every page (`src/lib/seo.ts`). `og:image`/`twitter:image` are sourced sitewide from the Site Settings `og_image` field (via `getSettingsOgImage()`), with graceful omission — the tags are simply left out and the Twitter card degrades to `summary` — when it's unset. This replaces a previous hardcoded `/og-image.jpg` fallback that didn't exist on disk and 404'd on every single page. `sermons/$slug.tsx` and `writings/$slug.tsx` now also fetch Site Settings in their loaders so their detail pages can use `og_image` too (they previously didn't fetch settings at all).
- **JSON-LD schemas:** Person schema (homepage, about), Article schema (article detail), BreadcrumbList schema (all pages)
- **Canonical URLs** on every page
- **Sitemap & robots:** `/sitemap.xml` and `/robots.txt` (`src/routes/sitemap[.]xml.ts`, `src/routes/robots[.]txt.ts`) — code-generated, not Notion-driven. See [Route & Page Structure](#6-route--page-structure) for details.
- **Google Search Console:** verified via `public/google6d2a306e7c072158.html` (a static verification file Google issues per-property). Do not delete this file — removing it will fail Google's re-verification checks. If the site ever moves to a custom domain, Search Console will need a separate verification for that domain (this file only verifies the current Vercel subdomain).
- **Dark mode** support with `localStorage` persistence and flash-prevention script in `<head>`
