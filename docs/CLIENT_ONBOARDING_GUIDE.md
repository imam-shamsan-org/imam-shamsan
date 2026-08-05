# Client Onboarding Guide — Imam Shamsan Website

This guide covers the accounts that power your website and explains how to manage your content day-to-day. **All accounts are already set up** — the accounts section below is kept for reference so you know what each service does and how to log in. Your main starting point is [Managing Your Website Content](#managing-your-website-content).

---

## Table of Contents

- [Accounts Overview](#accounts-overview)
- [Managing Your Website Content](#managing-your-website-content)
  - [Arabic & English](#arabic--english)
  - [Adding & Editing Writings (Articles)](#adding--editing-writings-articles)
  - [Adding & Editing Sermon Summaries](#adding--editing-sermon-summaries)
  - [Managing Gallery Photos](#managing-gallery-photos)
  - [Managing Recitations](#managing-recitations)
  - [Managing Humanitarian Aid](#managing-humanitarian-aid)
  - [Managing the Shop (المتجر)](#managing-the-shop-المتجر)
  - [Updating Site Settings (Live Stream, Profile Image, Logo)](#updating-site-settings-live-stream-profile-image-logo)
  - [Uploading Images to Cloudinary](#uploading-images-to-cloudinary)
- [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Accounts Overview

Your website runs on 5 services. All are already configured — this section is a reference so you know what each one does and how to access it.

| Account    | Purpose                       | Status                        |
| ---------- | ----------------------------- | ----------------------------- |
| Notion     | Managing your website content | Done — log in with your Gmail |
| Cloudinary | Hosting your photos           | Done — log in with your Gmail |
| GitHub     | Storing your website code     | Done — you own the repository |
| Vercel     | Hosting your live website     | Done — connected to GitHub    |
| Namecheap  | Your custom domain name       | Optional — not yet purchased  |

---

### 1. Notion — Content Management

> **Already done.** Your workspace is set up and all databases are configured. Log in at [https://www.notion.so](https://www.notion.so) using your Gmail account.

Notion is where you write and update your website content (writings, sermon summaries, gallery captions, recitation entries, and site settings).

_For reference — how this was set up:_

1. Account created at [https://www.notion.so/signup](https://www.notion.so/signup) using Gmail
2. Free plan (it has everything you need)
3. Workspace shared with the developer (`usmansagemode@gmail.com`) with Full access so databases could be configured

---

### 2. Cloudinary — Image Hosting

> **Already done.** Your Cloudinary account is set up and connected. Log in at [https://console.cloudinary.com](https://console.cloudinary.com) using your Gmail account.

Cloudinary stores and delivers all the photos on your website (gallery images, article cover images, profile photo, logo).

_For reference — how this was set up:_

1. Account created at [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free) using Gmail
2. Free plan (25 GB storage, more than enough to start)
3. Developer (`usmansagemode@gmail.com`) added as Admin so the account could be configured

---

### 3. GitHub — Code Repository

> **Already done.** Your GitHub account owns the repository. You won't need to interact with it day-to-day.

GitHub stores your website's code. The repository lives under a GitHub Organization so both you and the developer can manage it.

_For reference — how this was set up:_

1. Account created at [https://github.com/join](https://github.com/join) using Gmail
2. Developer created a GitHub Organization and the repository
3. You were added as an owner, which allows you to connect it to Vercel

---

### 4. Vercel — Website Hosting

> **Already done.** Vercel is connected to your GitHub repository and the website is live. Whenever code changes are pushed, the site automatically redeploys — no action needed from you.

Vercel is the service that makes your website available on the internet.

_For reference — how this was set up:_

1. Vercel account created at [https://vercel.com/signup](https://vercel.com/signup) using GitHub ("Continue with GitHub")
2. Repository connected to Vercel from the GitHub Organization
3. Environment variables configured in Vercel so the site can read from Notion and Cloudinary

---

### 5. Namecheap — Domain Name (Optional)

> **Not yet purchased.** This is optional and can be done when you are ready. The website is currently live on a Vercel subdomain. A custom domain (e.g., `www.imamshamsan.com`) costs approximately $10/year and makes the site easier to share publicly.

**When you are ready to purchase:**

1. Go to [https://www.namecheap.com](https://www.namecheap.com) and create an account
2. Search for your desired domain and complete the purchase (~$10/year for `.com`)
3. **Important:** Turn on **AutoRenew** so the domain does not expire
4. Share delegate access with your developer:
   - Go to **Profile** > **Delegate Access** > **Add New User**
   - Enter `usmansagemode@gmail.com` and grant **Full Access**
5. The developer will then point the domain to Vercel and SSL will be provisioned automatically

> If you don't see "Delegate Access," go to your domain list, click **"Manage"** next to the domain, then look under the **"Sharing & Transfer"** tab.

---

## Managing Your Website Content

You will manage content through **two tools**:

- **Notion** — for all text content, metadata, and links
- **Cloudinary** — for uploading photos and images

Your website has **9 Notion databases**:

| Database              | What It Controls                                                        |
| --------------------- | ----------------------------------------------------------------------- |
| Articles              | Writings/articles on the Writings page                                  |
| Services              | Services listed on the Services page                                    |
| Sermon Summaries      | Written khutbah summaries on the Sermons page                           |
| Gallery               | Individual photos on the Gallery page                                   |
| Recitations           | Qur'anic recitation videos on the Media page                            |
| About Page            | Your biography, education, and background                               |
| Site Settings         | Live stream URL, profile image, logo                                    |
| Humanitarian Projects | Initiative cards on the Humanitarian Aid page                           |
| Shop Products         | Products listed on the Shop page (perfumes, and other items when ready) |

---

### Important Guidelines

**Handle Notion with care.** Your Notion workspace is your website's database — what you see in Notion is what appears on the site. If you accidentally delete a page or a row, that content disappears from the live website immediately. If you delete an entire database, the corresponding page on the site will stop working. Stick to the structure that is already in place: add new rows, edit existing ones, and change Status fields. Do not rename databases, delete columns, or restructure pages unless you have discussed it with your developer first.

**Never rename a dropdown option.** Fields like `Status`, `Category`, and `Language` use fixed dropdown options behind the scenes (e.g., `Published`, `Draft`, `Active`, `Perfumes`). The website looks for these exact words. If you edit the text of an existing option in Notion (even just fixing a typo or changing capitalization), everything using that option will silently disappear from the site — with no error shown anywhere. Always pick from the existing options; never rename one. If you think an option is wrong or needs to change, ask your developer first.

**Keep Cloudinary organised.** Cloudinary has a generous free tier, but it is not unlimited — and a cluttered media library quickly becomes impossible to manage. Before uploading, think about where a file belongs. A good rule of thumb is: one folder per page, one sub-folder per post or entry using the same slug you use in Notion, and all related files inside that sub-folder. For example, an article with the slug `ramadan-2025` would have its assets in `writings/ramadan-2025/`. This makes it easy to find files, update them, and remove old ones when they are no longer needed. Being proactive about this from the start will save you a lot of time later.

**Don't delete, rename, or move an image that's already in use.** Once you paste a Cloudinary URL into Notion, it is a fixed link — Notion does not stay in sync with Cloudinary. If you later delete, rename, or move that file in Cloudinary, the image will break wherever it was used on the site. If a photo needs to be replaced, upload the new version as a new file and update the URL in Notion rather than reusing or renaming the old one.

---

### Arabic & English

Notion fully supports Arabic on the free plan. You can write in Arabic, English, or both in the same page — just type naturally. The website will automatically detect the language direction for each paragraph:

- Arabic paragraphs will display right-to-left
- English paragraphs will display left-to-right
- You do not need to do anything special — just write normally

---

### Adding & Editing Writings (Articles)

The Writings section shows your articles, reflections, and Islamic knowledge pieces. You write the full content directly inside each Notion page.

**To add a new article:**

1. Open Notion and go to the **"Articles"** database
2. Click **"+ New"** at the bottom of the table to create a new entry
3. Fill in the properties at the top of the page:
   - **Title** — Name of the article
   - **Slug** — URL-friendly identifier (e.g., `patience-in-islam`). Use lowercase, hyphens instead of spaces, no special characters.
   - **Description** — A short summary shown on article cards (1-2 sentences)
   - **Cover Image** — Paste a Cloudinary URL for the article's cover image (see "Uploading Images to Cloudinary" below)
   - **Language** — Select `English`, `Arabic`, or `Bilingual`
   - **Category** — Select a topic: Islamic Knowledge, Quran/Hadith Commentary, Ramadan/Eid, Personal Reflections, or Islamic History
   - **Tags** — Select relevant tags (e.g., Faith, Family, Youth)
   - **Featured** — Check this to show the article on the homepage
   - **Status** — Set to `Published` when ready to go live (keep as `Draft` while writing)
4. **Write the article content in the page body below the properties.** Formatting options:
   - **Bold** text: Select text and press `Cmd+B`
   - _Italic_ text: Select text and press `Cmd+I`
   - Headings: Type `/heading` and select Heading 2 or Heading 3
   - Bullet lists: Type `-` followed by a space
   - Numbered lists: Type `1.` followed by a space
   - Quotes (for Hadith or Quran verses): Type `/quote` and select Quote
   - Divider line: Type `/divider`
5. The website will automatically show the new article once `Status` is set to `Published`

**To add an image inside an article (optional):**

1. First, upload the image to Cloudinary (see "Uploading Images to Cloudinary" below)
2. Copy the image URL from Cloudinary
3. In your Notion page, click where you want the image to appear
4. Type `/image` and press Enter
5. Select **"Embed link"** (do NOT select "Upload" — uploaded images will break after 1 hour)
6. Paste the Cloudinary URL and press Enter

**To edit an existing article:**

1. Click on any row in the Articles database
2. Make your changes directly
3. Changes save automatically in Notion
4. The website will reflect the changes on the next update

**To hide an article from the website:**

- Change the **"Status"** to `Draft` — it stays in your database but won't appear on the site

---

### Adding & Editing Sermon Summaries

The Sermon Summaries section is for written summaries of Friday khutbahs. Each entry can optionally link to a YouTube video recording.

**To add a new sermon summary:**

1. Open Notion and go to the **"Sermon Summaries"** database
2. Click **"+ New"** to create a new entry
3. Fill in the properties at the top:
   - **Title** — Name of the sermon (e.g., "The Importance of Patience")
   - **Slug** — URL-friendly identifier (e.g., `importance-of-patience`)
   - **Description** — Short summary for the listing card (1-2 sentences)
   - **YouTube Link** — Paste the full YouTube URL if there's a video recording (optional)
   - **Date** — Select the date the sermon was delivered
   - **Status** — Set to `Published` when ready to go live
4. **Write the sermon content in the page body** (Arabic, English, or both)
5. The website will automatically show the new sermon once `Status` is `Published`

**To hide a sermon from the website:**

- Change the **"Status"** to `Draft`

---

### Managing Gallery Photos

The Gallery section displays individual photos organized by category. Each entry in the Gallery database represents one photo.

**To add a new photo:**

1. First, upload the image to Cloudinary (see "Uploading Images to Cloudinary" below)
2. Copy the image URL from Cloudinary
3. Open Notion and go to the **"Gallery"** database
4. Click **"+ New"** to create a new entry
5. Fill in the properties:
   - **Caption** — A short description of the photo
   - **Image URL** — Paste the Cloudinary URL of the photo
   - **Category** — Select one: Events, Conferences, Community, Scholars, Programs, or Flyers
   - **Order** — A number that controls display order (lower numbers appear first)
   - **Featured** — Check this to highlight the photo
   - **Status** — Set to `Active` to show on the website
6. The photo will appear in the gallery, filterable by category

**To hide a photo from the gallery:**

- Change the **"Status"** to `Inactive`

---

### Editing the About Page

The About page shows your biography, education, specializations, and background. It works just like an article — you write the content directly in the Notion page body.

**To edit the About page:**

1. Open Notion and go to the **"About Page"** database
2. Click on the existing entry (there should be one row)
3. Edit the page body — use headings, paragraphs, bullet lists, quotes, etc.
4. You can write in Arabic, English, or both
5. To add images, use `/image` > **"Embed link"** > paste a Cloudinary URL

**Properties at the top:**

- **Title** — The page heading (e.g., "About Imam Shamsan")
- **Name EN** — Your English name as shown in the hero section at the top of the homepage (e.g., "Shamsan Al-Jabi"). Leave blank to keep the current default name.
- **Subtitle AR** — Arabic subtitle shown under the heading (e.g., "الدكتور. شمسان الجابي"). This also appears as your Arabic name in the homepage hero. Leave blank to keep the current default.
- **Status** — Set to `Published` to show on the website

> **Changing the name on the homepage:** The bold name shown at the top of the homepage (in the hero section, next to your photo) comes from these same two fields — **Name EN** for the English name and **Subtitle AR** for the Arabic name. Just edit them here and the homepage updates automatically. If you leave either one blank, the website falls back to the existing default name so the hero never looks empty.

> **A note on layout:** The About page uses a structured layout — it reads your headings and automatically arranges content into sections, card grids (for things like Specializations), and prose blocks. This works best when you organise your content with clear **Heading 2** sections. Short bullet-point sections (2–3 items) will be displayed as cards; longer prose will flow naturally below. If you add a very large amount of unstructured text or significantly change the heading structure, the layout may not look as intended. For any major structural changes to the About page, check with your developer first so the presentation can be adjusted in the code if needed.

---

### Managing Recitations

The Media page displays Qur'anic recitation videos. Each entry is one YouTube video. You can also pin up to 4 recitations to the homepage.

**To add a new recitation:**

1. Open Notion and go to the **"Recitations"** database
2. Click **"+ New"** to create a new entry
3. Fill in the properties:
   - **Title** — Name of the recitation (e.g., "Surah Al-Mulk")
   - **YouTube Link** — Paste the full YouTube video URL
   - **Order** — A number that controls display order (lower numbers appear first)
   - **Featured** — Check this box to show the recitation in the **"Featured Recitations"** section on the homepage (maximum 4 will appear)
4. The recitation will appear on the Media page

**To feature a recitation on the homepage:**

- Check the **"Featured"** checkbox on up to 4 recitation rows. They will appear as thumbnail cards on the homepage between the Writings section and the Media section.

**To remove a recitation:**

- Simply delete the row from the database

---

### Managing Humanitarian Aid

The Humanitarian Aid page displays a grid of initiative cards — each card represents one project (e.g., "Medical Aid for Displaced Families"). Visitors can click a card to learn more and reach out through the Zelle contribution flow.

**To add a new initiative:**

1. Open Notion and go to the **"Humanitarian Projects"** database
2. Click **"+ New"** to create a new entry
3. Fill in the properties:
   - **Title** — Name of the initiative in English (e.g., "Medical Aid for Displaced Families")
   - **Title AR** — Name in Arabic (optional)
   - **Description** — A short explanation of what this initiative covers (2-3 sentences)
   - **Category** — Select one: `Medical`, `Food`, `Water`, `Education`, `Family`, `Religious`, or `Qurbani`
   - **Icon** — A short keyword describing the icon to use (e.g., `heart`, `stethoscope`, `book`). Ask your developer for the full list.
   - **Sort Order** — A number that controls display order on the page (lower numbers appear first)
   - **Status** — Set to `Active` to show on the website (`Completed` or `Paused` hides it)

**To hide an initiative:** Change Status to `Paused` or `Completed`.

---

### Managing the Shop (المتجر)

The Shop page lets visitors browse and enquire about products. Everything is managed from a single Notion database called **"Shop Products"** — one database holds all categories (Perfumes, Hats, Thoubs, Honey, Coffee, and Leather Socks). Products are separated by their **Category** field.

**At launch, only Perfumes are content-ready.** The other five categories (Hats, Thoubs, Honey, Coffee, Leather Socks) will automatically show a "Coming Soon" message on the site until you add entries with the matching Category. You do not need to do anything special — just add products when you are ready.

---

#### Adding a new Perfume product

1. First, take a clear product photo and upload it to Cloudinary in the **`shop/`** folder (see "Uploading Images to Cloudinary" below). Copy the image URL.
2. Open Notion and go to the **"Shop Products"** database
3. Click **"+ New"** to create a new entry
4. Fill in the properties (see the field guide below)
5. Set **Status** to `Published` — the product will appear on the Shop page immediately

---

#### Field-by-field guide

| Field              | What to enter                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**           | The product name in English (e.g., "Shamsan Fresh Bloom")                                                                                                                                      |
| **Category**       | Select the product type — choose `Perfumes` for a perfume                                                                                                                                      |
| **Arabic Name**    | The product name written in Arabic                                                                                                                                                             |
| **Tagline EN**     | A short one-line description in English (e.g., "A fresh, uplifting scent for everyday wear")                                                                                                   |
| **Tagline AR**     | The same short line written in Arabic                                                                                                                                                          |
| **Ingredients EN** | _(Perfumes only)_ The scent notes, separated by commas (e.g., "Jasmine, Lemon, White Musk"). Leave blank for other categories.                                                                 |
| **Ingredients AR** | _(Perfumes only)_ The same scent notes written in Arabic, separated by commas. Leave blank for other categories.                                                                               |
| **Mood EN**        | _(Perfumes only)_ A short tag describing the occasion or character of the scent (e.g., "Fresh, daily use"). Leave blank for other categories.                                                  |
| **Mood AR**        | _(Perfumes only)_ The mood written in Arabic (e.g., "خفيف – مناسب للمسجد والعمل"). Leave blank for other categories.                                                                           |
| **Color Accent**   | Choose a colour that best matches the product's feel — this controls the accent colour shown on the product card on the website. Options: yellow, brown, orange, teal, pink, red, green, blue. |
| **Photo**          | Paste the Cloudinary URL of the product photo (uploaded to the `shop/` folder)                                                                                                                 |
| **Status**         | Set to `Published` to show on the website. Keep as `Draft` while you are still preparing the entry.                                                                                            |
| **Sort Order**     | A number that controls the order products appear on the page (1 appears first, 2 second, and so on)                                                                                            |

> **Tip for Ingredients and Mood:** These fields are for perfumes only. If you are adding a Hat, Thoub, or other product in the future, simply leave **Ingredients EN/AR** and **Mood EN/AR** blank — the website will not show those sections for non-perfume products.

---

#### Adding products from other categories (Hats, Thoubs, Honey, Coffee, Leather Socks)

When you are ready to list products in any of the other categories, the process is exactly the same as above. Simply select the correct **Category** (e.g., `Honey`) and fill in the fields that apply. Once at least one entry with that Category is set to `Published`, the "Coming Soon" message for that category will automatically disappear and your products will appear instead.

---

#### Hiding or removing a product

- To temporarily hide a product: change its **Status** to `Draft`
- To permanently remove it: delete the row from the database

---

### How Visitors Pay via Zelle

When a visitor clicks a service card or a "Contribute" / "Sponsor" button on the Humanitarian Aid page, a payment panel opens showing:

- Your **Zelle email** and **phone number** (with a copy button for each)
- Step-by-step instructions: Send Zelle → Fill in the form → You confirm
- A contact form where they enter their name, email, and a message
- A **required Upload Zelle Receipt** field — they must attach the Zelle screenshot or PDF (max 3 MB, PDF or PNG format) before they can submit. The form will not send without it.
- For service bookings (e.g., Ruqyah), they must also scroll through and accept the **Service Agreement & Liability Waiver** before submitting

For Shop orders specifically (both buying a signature perfume and "Create Your Own"), customers also see an optional **Note** field where they can add any extra details or requests (up to 500 characters). If they fill it in, it will show up in the order email you receive, right after their phone number — no action needed from you, it's just there so you have any extra context they wanted to share.

You will receive their message as an email from the website with the receipt attached (if they uploaded one).

> **If your Zelle email or phone number ever changes**, ask your developer to update `src/lib/constants.ts` — it is the single place that controls what is shown in both the Services and Humanitarian Aid flows.

**What this is — and isn't.** This is not an online store or a payment processor. The website never touches anyone's money — it only displays your Zelle details and a form. A visitor sends payment on their own, directly to your personal Zelle account, completely outside the website. The form then emails you their name, contact details, order/contribution info, and their receipt — that's it. Nothing is charged, confirmed, or fulfilled automatically. It's built for a friendly, trust-based environment: people who already know you place an order or contribution and pay you directly, then you personally review the email and follow up with them (by email or phone) to confirm and arrange delivery or fulfillment. Treat every submission as a heads-up that someone paid you, not as a completed, guaranteed sale.

The site's **Terms & Conditions** (`/terms`) and **Privacy Policy** (`/privacy`) pages spell this out for visitors, so there's no confusion about how ordering, payment, and your role in confirming things actually works. You don't need to maintain these — they're static pages your developer wrote to match how the Shop and Humanitarian Aid flows really work. If either flow ever changes (e.g., you add real online payments), ask your developer to update those pages too.

---

### Updating Site Settings (Live Stream, Profile Image, Logo, Social Links)

The Site Settings database contains key-value pairs that control parts of the website. You update these by editing the **"Value"** field of the relevant row.

| Setting             | What It Controls                                                                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `live_stream_url`   | YouTube link shown on the homepage and Media page                                                                                                                                |
| `live_stream_title` | Title displayed above the live stream (e.g., "Friday Khutbah - Week of Feb 14")                                                                                                  |
| `hero_title_eng`    | Homepage title in English (e.g., "Dr. Imam Shamsan Al-Jabi"). Leave blank to use the default.                                                                                    |
| `hero_title_ar`     | Homepage title in Arabic, shown under the English title. Leave blank to use the default.                                                                                         |
| `profile_img`       | Your profile photo shown on the About page                                                                                                                                       |
| `logo`              | The logo displayed in the website header                                                                                                                                         |
| `og_image`          | The preview image shown when your website is shared on social media (Facebook, WhatsApp, Twitter/X) or in Google search results                                                |
| `cv_url`            | Cloudinary URL of your CV (PDF or image). When set, a "Curriculum Vitae" section appears at the bottom of the About page with View and Download buttons. Leave blank to hide it. |
| `youtube_url`       | Your YouTube channel link (shown in footer, contact, and media pages)                                                                                                            |
| `facebook_url`      | Your Facebook page link (shown in footer and contact page)                                                                                                                       |
| `instagram_url`     | Your Instagram profile link (shown in footer and contact page)                                                                                                                   |
| `shop_category_bg_perfumes`      | Banner image shown on the Shop page's **Perfumes** tab                                                                                                                  |
| `shop_category_bg_hats`          | Banner image shown on the Shop page's **Hats** tab                                                                                                                      |
| `shop_category_bg_thoubs`        | Banner image shown on the Shop page's **Thoubs** tab                                                                                                                    |
| `shop_category_bg_honey`         | Banner image shown on the Shop page's **Honey** tab                                                                                                                     |
| `shop_category_bg_coffee`        | Banner image shown on the Shop page's **Coffee** tab                                                                                                                    |
| `shop_category_bg_leather_socks` | Banner image shown on the Shop page's **Leather Socks** tab                                                                                                             |

**To update the weekly live stream:**

1. Open Notion > **Site Settings** database
2. Find the `live_stream_url` row
3. Replace the **"Value"** with the new YouTube link
4. Update `live_stream_title` with the new title
5. _(Optional)_ Update the **"Duration"** field with the number of hours you expect the stream to run (e.g., `4` for a regular session, `8` for an all-day event). The website uses this to show the stream as LIVE for that many hours after you paste the link. If left blank, it defaults to 4 hours.

> **Note on homepage order:** When the live stream is active, the website automatically moves it to the top of the homepage (right after the hero section), followed by Featured Recitations, Services, and Writings. When there is no active stream, the order returns to: Services, Writings, Featured Recitations, Media.

**To update the homepage title:**

1. Open Notion > **Site Settings** database
2. Find the `hero_title_eng` and `hero_title_ar` rows
3. Replace the **"Value"** with the new text for each row you want to change
4. Leave a row's **"Value"** blank to fall back to the site's default text

**To update your profile photo or logo:**

1. Upload the new image to Cloudinary
2. Copy the Cloudinary URL
3. Open Notion > **Site Settings** database
4. Find the `profile_img` or `logo` row
5. Replace the **"Value"** with the new Cloudinary URL

**To update the image that shows up when your website is shared on social media:**

This is the image people see when your site link is shared on Facebook, WhatsApp, or Twitter/X, or when it shows up in Google search results.

1. Upload the image to Cloudinary
2. Copy the Cloudinary URL
3. Open Notion > **Site Settings** database
4. Find the `og_image` row
5. Replace the **"Value"** with the new Cloudinary URL

> **Important:** Just like the profile photo and logo, this must be a **Cloudinary URL**, not a raw Notion file link — Notion's own file links expire after 1 hour and the preview image would break. If you leave `og_image` blank, the site simply shows no preview image — it won't show a broken one.

**To add a background image to a shop category:**

Each tab on the Shop page (Perfumes, Hats, Thoubs, Honey, Coffee, Leather Socks) can show a wide banner image just below the tabs. This is entirely optional — if you don't set one, the page simply looks as it does today, with no banner.

1. Upload the banner image to Cloudinary (see "Uploading Images to Cloudinary" below)
2. Copy the Cloudinary URL
3. Open Notion > **Site Settings** database
4. Find the row for the category you want (see the table above for which key matches which tab, e.g. `shop_category_bg_perfumes` for the Perfumes tab)
5. Replace the **"Value"** with the new Cloudinary URL
6. The banner appears on the Shop page as soon as you save — only when that tab is the one currently selected

> **Important:** Just like the profile photo and logo, this must be a **Cloudinary URL**, not a raw Notion file link — Notion's own file links expire after 1 hour and the banner would break.

**To update your social media links:**

1. Open Notion > **Site Settings** database
2. Find the row for the platform you want to update (`youtube_url`, `facebook_url`, or `instagram_url`)
3. Replace the **"Value"** with the new link

> **Note:** Your website automatically provides a sitemap (`/sitemap.xml`) and a search-engine instructions file (`/robots.txt`) that help Google and other search engines find and index your pages correctly. These are generated automatically by the code — there's nothing for you to set up or maintain in Notion.

---

### Uploading Images to Cloudinary

**To upload photos:**

1. Log in to Cloudinary at [https://console.cloudinary.com](https://console.cloudinary.com)
2. Click **"Media Library"** in the left sidebar
3. Click the **"Upload"** button (top-right)
4. Drag and drop your photos, or click to browse your computer
5. Click **"Upload"** to confirm

**To get an image URL (for pasting into Notion):**

1. In the Media Library, click on any image
2. Click the **link/chain icon** or look for **"Copy URL"**
3. Paste this URL into the relevant Notion property or page body

**Which folder to upload to:**

Your Cloudinary account is organized into folders that match the sections of your website. Always upload to the correct folder:

| Folder          | What goes here                                         |
| --------------- | ------------------------------------------------------ |
| `gallery/`      | Public gallery photos (events, community, conferences) |
| `writings/`     | Cover images for articles                              |
| `sermons/`      | Cover images for sermon summaries                      |
| `humanitarian/` | Images and PDFs related to humanitarian initiatives    |
| `shop/`         | Product photos for the Shop page                       |
| `profile/`      | Your personal portraits and photos of yourself         |
| `site/`         | Logo and other website brand assets (rarely changes)   |

To upload into a specific folder: in the Media Library, click into that folder first, then click **"Upload"**.

**Tips for photos:**

- Use clear, well-lit photos
- Landscape orientation (horizontal) works best for galleries and cover images
- Photos are automatically optimized — no need to resize before uploading
- Give photos descriptive names before uploading (e.g., `eid-prayer-hall.jpg` instead of `IMG_4523.jpg`)
- Lowercase only, hyphens instead of spaces (e.g., `friday-khutbah-jan-2025.jpg`)

**Important:** When adding images inside a Notion page body (writings or sermons), always use **"Embed link"** and paste a **Cloudinary URL**. Never use Notion's "Upload" option — uploaded images break after 1 hour.

---

## Quick Reference Cheat Sheet

### "I want to add a new article/writing"

1. Open Notion > Articles database
2. Click "+ New"
3. Fill in Title, Slug, Description, Language, Category
4. Paste a Cloudinary URL in "Cover Image" (optional)
5. Write the content in the page body (Arabic, English, or both)
6. Set Status to "Published"

### "I want to add a new sermon summary"

1. Open Notion > Sermon Summaries database
2. Click "+ New"
3. Fill in Title, Slug, Description, Date
4. Paste a YouTube link in "YouTube Link" (optional)
5. Write the sermon content in the page body
6. Set Status to "Published"

### "I want to add a photo to the gallery"

1. Upload the photo to Cloudinary
2. Copy the image URL
3. Open Notion > Gallery database
4. Click "+ New"
5. Fill in Caption, paste the URL in "Image URL", select a Category
6. Set Status to "Active"

### "I want to add a Qur'anic recitation video"

1. Open Notion > Recitations database
2. Click "+ New"
3. Fill in Title, paste the YouTube link, set the Order number
4. Check **"Featured"** if you want it shown on the homepage (max 4 featured at once)

### "I want to add a new humanitarian initiative"

1. Open Notion > Humanitarian Projects database
2. Click "+ New"
3. Fill in Title, Title AR, Description, Category, Icon, Sort Order
4. Set Status to "Active"

### "I want to add a new perfume product"

1. Upload the product photo to Cloudinary > `shop/` folder, copy the URL
2. Open Notion > Shop Products database
3. Click "+ New"
4. Set Category to `Perfumes`
5. Fill in Name, Arabic Name, Tagline EN, Tagline AR, Ingredients EN/AR, Mood EN/AR, Color Accent
6. Paste the Cloudinary URL in "Photo"
7. Set Sort Order (1 = appears first)
8. Set Status to "Published"

### "I want to update the About page"

1. Open Notion > About Page database
2. Click the existing entry
3. Edit the page body (headings, paragraphs, lists, etc.)
4. Changes go live automatically

### "I want to change the name on the homepage"

1. Open Notion > About Page database
2. Click the existing entry
3. Edit **Name EN** (English name) and/or **Subtitle AR** (Arabic name)
4. Leave either blank to keep the current default name
5. Changes go live automatically

### "I want to add a background image to a shop category"

1. Upload the banner image to Cloudinary, copy the URL
2. Open Notion > Site Settings database
3. Find the row matching the category (e.g., `shop_category_bg_perfumes` for Perfumes — see the full list of 6 keys in "Updating Site Settings")
4. Paste the Cloudinary URL into "Value"
5. The banner appears on the Shop page when that category's tab is selected

### "I want to change the image that shows up when the website is shared on social media / Google"

1. Upload the image to Cloudinary, copy the URL
2. Open Notion > Site Settings database
3. Find the `og_image` row
4. Paste the Cloudinary URL into "Value"

### "I want to add a photo inside an article or sermon"

1. Upload the image to Cloudinary first
2. Copy the image URL
3. In your Notion page, click where the image should go
4. Type `/image` > select **"Embed link"** > paste the URL
5. **Never use "Upload"** — uploaded images break after 1 hour

### "I want to update the live stream"

1. Open Notion > Site Settings database
2. Update `live_stream_url` with the new YouTube link
3. Update `live_stream_title` with the new title
4. _(Optional)_ Set the **Duration** field to the number of hours the event will run (default is 4)

### "I want to hide something from the website"

- **Articles/Sermons:** Change Status to `Draft`
- **Gallery photos:** Change Status to `Inactive`
- **Recitations:** Delete the row

### Need help?

Contact your developer at: `usmansagemode@gmail.com`

This website was designed and built by **Usman Khalid Mian**.

- Portfolio: [portfolio.usmankm.com](https://portfolio.usmankm.com/)
