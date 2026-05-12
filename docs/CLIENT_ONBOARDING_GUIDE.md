# Client Onboarding Guide — Imam Shamsan Website

Welcome! This guide walks you through the accounts needed for your website and shows you how to manage your content once the site is live.

---

## Table of Contents

- [Accounts to Create](#accounts-to-create)
- [Managing Your Website Content](#managing-your-website-content)
  - [Arabic & English](#arabic--english)
  - [Adding & Editing Writings (Articles)](#adding--editing-writings-articles)
  - [Adding & Editing Sermon Summaries](#adding--editing-sermon-summaries)
  - [Managing Gallery Photos](#managing-gallery-photos)
  - [Managing Recitations](#managing-recitations)
  - [Managing Humanitarian Aid](#managing-humanitarian-aid)
  - [Updating Site Settings (Live Stream, Profile Image, Logo)](#updating-site-settings-live-stream-profile-image-logo)
  - [Uploading Images to Cloudinary](#uploading-images-to-cloudinary)
- [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Accounts to Create

You will need to create **5 accounts**. Each one serves a specific purpose for your website.

| Account    | Purpose                       | Cost      |
| ---------- | ----------------------------- | --------- |
| Notion     | Managing your website content | Free      |
| Cloudinary | Hosting your photos           | Free tier |
| GitHub     | Storing your website code     | Free      |
| Vercel     | Hosting your live website     | Free tier |
| Namecheap  | Your custom domain name       | ~$10/year |

---

### 1. Notion — Content Management

Notion is where you will write and update your website content (writings, sermon summaries, gallery captions, recitation entries, and site settings).

**Create your account:**

1. Go to [https://www.notion.so/signup](https://www.notion.so/signup)
2. Sign up with your email address
3. Choose the **Free** plan (it has everything you need)
4. Create a workspace — name it something like "Imam Shamsan Website"

**After creating your account:**

- Share your workspace with the developer by clicking **"Settings & Members"** in the left sidebar
- Click **"Members"** > **"Invite"** and add: `usmansagemode@gmail.com`
- Give **"Full access"** permission so the developer can set up your databases

---

### 2. Cloudinary — Image Hosting

Cloudinary stores and delivers all the photos on your website (gallery images, article cover images, profile photo, logo).

**Create your account:**

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up with your email
3. Choose the **Free** plan (25 GB storage, more than enough to start)
4. Pick a **Cloud Name** — use something recognizable (e.g., `imam-shamsan`)

**After creating your account:**

- Go to **Settings** (gear icon, bottom-left) > **Account** > **Users**
- Click **"Invite User"**
- Enter: `usmansagemode@gmail.com`
- Set role to **Admin**
- Click **"Send Invite"**

---

### 3. GitHub — Code Repository

GitHub stores your website's code. You won't need to interact with it day-to-day, but you own the account.

**Create your account:**

1. Go to [https://github.com/join](https://github.com/join)
2. Sign up with your email address
3. Choose the **Free** plan
4. Verify your email address

**Connecting to your website code:**

The developer will create a **GitHub Organization** (a shared space for the code) and invite you as a member. This lets both you and the developer manage the repository, and allows you to connect it to Vercel for hosting.

---

### 4. Vercel — Website Hosting

Vercel is the service that makes your website available on the internet. It automatically updates your site when changes are made to the code.

**Create your account:**

1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Click **"Continue with GitHub"** (use the GitHub account you just created)
3. Authorize Vercel to access your GitHub
4. Choose the **Hobby** (Free) plan

**After the GitHub Organization is set up:**

- The developer will walk you through connecting the repository to your Vercel account
- Once connected, the website will automatically redeploy whenever code changes are pushed

---

### 5. Namecheap — Domain Name

Namecheap is where you purchase your website address (e.g., `www.imamshamsan.com`).

**Purchase your domain:**

1. Go to [https://www.namecheap.com](https://www.namecheap.com)
2. Create an account
3. Search for your desired domain name
4. Add it to your cart and complete the purchase (~$10/year for `.com`)
5. **Important:** Keep **AutoRenew** turned on so your domain doesn't expire

**Share delegate access with the developer:**

1. Log in to Namecheap
2. Go to **Profile** (top-right) > **Dashboard**
3. Click on **"Profile"** in the left sidebar > **"Delegate Access"**
4. Click **"Add New User"**
5. Enter the username or email: `usmansagemode@gmail.com`
6. Grant **Full Access** to your domain
7. Click **"Save Changes"**

> If you don't see "Delegate Access," go to your domain list, click **"Manage"** next to your domain, then look under the **"Sharing & Transfer"** tab.

---

## Managing Your Website Content

Once the website is built, you will manage content through **two tools**:

- **Notion** — for all text content, metadata, and links
- **Cloudinary** — for uploading photos and images

Your website has **9 Notion databases**:

| Database              | What It Controls                                    |
| --------------------- | --------------------------------------------------- |
| Articles              | Writings/articles on the Writings page              |
| Services              | Services listed on the Services page                |
| Sermon Summaries      | Written khutbah summaries on the Sermons page       |
| Gallery               | Individual photos on the Gallery page               |
| Recitations           | Qur'anic recitation videos on the Media page        |
| About Page            | Your biography, education, and background           |
| Site Settings         | Live stream URL, profile image, logo                |
| Humanitarian Projects | Initiative categories on the Humanitarian Aid page  |
| Humanitarian Cases    | Individual sponsorable cases within each initiative |

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
- **Subtitle AR** — Arabic subtitle shown under the heading (e.g., "الدكتور. شمسان الجابي")
- **Status** — Set to `Published` to show on the website

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

The Humanitarian Aid page has two levels: **Projects** (the initiative categories, e.g., "Medical Aid") and **Cases** (individual families or people within a project).

#### Adding a new Humanitarian Project

1. Open Notion and go to the **"Humanitarian Projects"** database
2. Click **"+ New"** to create a new entry
3. Fill in the properties:
   - **Title** — Name of the initiative in English (e.g., "Medical Aid for Displaced Families")
   - **Title AR** — Name in Arabic (optional)
   - **Description** — A short explanation of what this initiative covers (2-3 sentences)
   - **Category** — Select one: `Medical`, `Food`, `Water`, `Education`, `Family`, or `Religious`
   - **Icon** — A short keyword describing the icon to use (e.g., `heart`, `stethoscope`, `book`). Ask your developer for the full list.
   - **Has Cases** — Check this box if individual sponsorable cases will be listed under this project. Leave unchecked for general donation initiatives.
   - **Sort Order** — A number that controls display order on the page (lower numbers appear first)
   - **Status** — Set to `Active` to show on the website (`Completed` or `Paused` hides it)

**To hide a project:** Change Status to `Paused` or `Completed`.

---

#### Adding a new Humanitarian Case

Cases appear under a specific project when "Has Cases" is checked. Each case represents one family or individual.

1. First, upload the patient/family photo to Cloudinary in the `humanitarian/` folder
2. Open Notion and go to the **"Humanitarian Cases"** database
3. Click **"+ New"** to create a new entry
4. Fill in the properties:
   - **Title** — Name of the case (e.g., "Um Khalid — Single Mother of 5")
   - **Slug** — URL-friendly identifier (e.g., `um-khalid`). Lowercase, hyphens only.
   - **Case Number** — A unique number for this case (e.g., `1`, `2`, `3`)
   - **Project** — Link to the parent project (click the field and select from the list)
   - **Urgency** — Select `Urgent`, `High`, or `Ongoing`
   - **Target Amount** — Total amount needed (numbers only, e.g., `5000`). Leave blank if not applicable.
   - **Monthly Amount** — Monthly support needed (e.g., `400`). Leave blank if not applicable.
   - **Family Size** — Number of family members (e.g., `6`). Leave blank if not applicable.
   - **Patient Photo** — Paste a Cloudinary URL from the `humanitarian/` folder
   - **Needs** — List specific needs as bullet points in this field (e.g., "Rent assistance", "Medical prescriptions")
   - **Status** — Set to `Published` to show on the website (`Funded` or `Draft` hides it)
5. **Write the case story in the page body** — explain the family's situation in detail. This is what visitors will read before deciding to contribute. You can write in Arabic, English, or both.

**To mark a case as fully funded:** Change Status to `Funded` — it will be removed from the live site.

---

### How Visitors Pay via Zelle

When a visitor clicks a service card or a "Contribute" / "Sponsor" button on the Humanitarian Aid page, a payment panel opens showing:

- Your **Zelle email** and **phone number** (with a copy button for each)
- Step-by-step instructions: Send Zelle → Fill in the form → You confirm
- A contact form where they enter their name, email, and a message
- A **required Upload Zelle Receipt** field — they must attach the Zelle screenshot or PDF (max 3 MB, PDF or PNG format) before they can submit. The form will not send without it.
- For service bookings (e.g., Ruqyah), they must also scroll through and accept the **Service Agreement & Liability Waiver** before submitting

You will receive their message as an email from the website with the receipt attached (if they uploaded one).

> **If your Zelle email or phone number ever changes**, ask your developer to update `src/lib/constants.ts` — it is the single place that controls what is shown in both the Services and Humanitarian Aid flows.

---

### Updating Site Settings (Live Stream, Profile Image, Logo, Social Links)

The Site Settings database contains key-value pairs that control parts of the website. You update these by editing the **"Value"** field of the relevant row.

| Setting             | What It Controls                                                                |
| ------------------- | ------------------------------------------------------------------------------- |
| `live_stream_url`   | YouTube link shown on the homepage and Media page                               |
| `live_stream_title` | Title displayed above the live stream (e.g., "Friday Khutbah - Week of Feb 14") |
| `profile_img`       | Your profile photo shown on the About page                                      |
| `logo`              | The logo displayed in the website header                                        |
| `youtube_url`       | Your YouTube channel link (shown in footer, contact, and media pages)           |
| `facebook_url`      | Your Facebook page link (shown in footer and contact page)                      |
| `instagram_url`     | Your Instagram profile link (shown in footer and contact page)                  |

**To update the weekly live stream:**

1. Open Notion > **Site Settings** database
2. Find the `live_stream_url` row
3. Replace the **"Value"** with the new YouTube link
4. Update `live_stream_title` with the new title
5. _(Optional)_ Update the **"Duration"** field with the number of hours you expect the stream to run (e.g., `4` for a regular session, `8` for an all-day event). The website uses this to show the stream as LIVE for that many hours after you paste the link. If left blank, it defaults to 4 hours.

> **Note on homepage order:** When the live stream is active, the website automatically moves it to the top of the homepage (right after the hero section), followed by Featured Recitations, Services, and Writings. When there is no active stream, the order returns to: Services, Writings, Featured Recitations, Media.

**To update your profile photo or logo:**

1. Upload the new image to Cloudinary
2. Copy the Cloudinary URL
3. Open Notion > **Site Settings** database
4. Find the `profile_img` or `logo` row
5. Replace the **"Value"** with the new Cloudinary URL

**To update your social media links:**

1. Open Notion > **Site Settings** database
2. Find the row for the platform you want to update (`youtube_url`, `facebook_url`, or `instagram_url`)
3. Replace the **"Value"** with the new link

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
| `humanitarian/` | Patient and family photos for humanitarian cases       |
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

### "I want to add a new humanitarian initiative (project)"

1. Open Notion > Humanitarian Projects database
2. Click "+ New"
3. Fill in Title, Description, Category, Sort Order
4. Set "Has Cases" if individual cases will be listed
5. Set Status to "Active"

### "I want to add a new humanitarian case"

1. Upload the family/patient photo to Cloudinary > `humanitarian/` folder, copy the URL
2. Open Notion > Humanitarian Cases database
3. Click "+ New"
4. Fill in Title, Slug, Case Number, link to the Project, set Urgency and amounts
5. Paste the Cloudinary URL in "Patient Photo"
6. Write the case story in the page body
7. Set Status to "Published"

### "I want to mark a case as fully funded"

- Open Notion > Humanitarian Cases database
- Find the case and change Status to `Funded`

### "I want to update the About page"

1. Open Notion > About Page database
2. Click the existing entry
3. Edit the page body (headings, paragraphs, lists, etc.)
4. Changes go live automatically

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
