# Mentora — Basic Operations Test Plan

## Application Overview

Mentora is a Nuxt 4 + Nuxt UI + Nuxt Content marketing site for a one-on-one online tutoring platform. It has no
login, forms or backend writes; the interactive surface is navigation, in-page anchors, a theme toggle, a hero video
modal, a testimonials carousel, a tabbed FAQ accordion, a blog with previous/next navigation and a "Copy link"
action, a mobile slide-over menu, and a custom 404 page.

**Routes**

| Route | Purpose |
|---|---|
| `/` | Landing: hero, video, "How Mentora works", teachers (`#teachers`), testimonials, FAQ, CTA (`#cta`) |
| `/subjects` | Six subject cards (Languages, Mathematics, Sciences, Music, Coding & Data, Exams & Writing) |
| `/events` | 4 upcoming events ("Coming up next") + 5 past events ("Catch up on past events") |
| `/blog` | "The Mentora Journal": featured latest article + list, sorted by date descending |
| `/blog/<slug>` | Article page with heading anchors, Copy link, and "More articles" prev/next |
| `/about` | Mission, "Why we built Mentora", "What we stand for" |
| `/blobs` | Internal showcase of blob variants (not linked from nav) |
| any unknown path | 404 page: "Page not found: <path>" + "Back to home" |

**Assumptions / starting state**

- Dev server running at `http://localhost:3000` (`pnpm dev`). `playwright.config.ts` has no `baseURL`/`webServer`
  yet; either set `baseURL: 'http://localhost:3000'` or use absolute URLs.
- Fresh browser context (no `localStorage`), so color mode starts at the configured default: **dark**.
- Desktop viewport 1280×720 unless the scenario says otherwise. Mobile = 375×812.
- Seed: `tests/seed.spec.ts`.

---

## Test Scenarios

### 1. Page loading & SEO basics

**Seed:** `tests/seed.spec.ts`

#### 1.1 Every public page loads with correct title and H1

**Steps:**
1. For each row below, navigate to the route.
2. Check the HTTP response status, the document title and the level-1 heading.

| Route | Title | H1 |
|---|---|---|
| `/` | `Mentora — Learn Anything, One-on-One with Expert Teachers` | `Learn anything, one-on-one with a teacher who gets you` |
| `/subjects` | `Find your subject, then find your teacher · Mentora` | `Find your subject, then find your teacher` |
| `/events` | `Free events for curious learners · Mentora` | `Free events for curious learners` |
| `/blog` | `The Mentora Journal` | `The Mentora Journal` |
| `/about` | `Learning works best one-on-one · Mentora` | `Learning works best one-on-one` |
| `/blog/from-mockup-to-market` | `From Mockup to Market: My End-to-End Product Design Process · Mentora` | same as article title |

**Expected Results:**
- Status is 200 for every route.
- Title and H1 match the table.
- Exactly one H1 is visible on each page.
- No `console.error` messages are logged (ignore Nuxt DevTools noise).

#### 1.2 Shared layout is present on every page

**Steps:**
1. Visit `/`, `/subjects`, `/events`, `/blog`, `/about`.
2. Inspect the `banner` and `contentinfo` landmarks.

**Expected Results:**
- Banner contains the "Mentora home" link, a navigation with Home, Subjects, Events, Blog, About, the theme toggle
  button and a "Find a teacher" link to `/teachers`.
- Footer contains links "Mentora on Discord", "Mentora on X", "Mentora on GitHub".
- Every page except blog articles ends with the CTA heading "Your next breakthrough is one lesson away".

---

### 2. Header navigation (desktop)

**Seed:** `tests/seed.spec.ts`

#### 2.1 Primary nav links route to the right pages

**Steps:**
1. Navigate to `/`.
2. Click each nav link in turn: Subjects, Events, Blog, About, Home.

**Expected Results:**
- URL becomes `/subjects`, `/events`, `/blog`, `/about`, `/` respectively.
- The page H1 changes to match (see 1.1).
- Navigation is client-side (no full reload — e.g. a `window` marker set before clicking survives).

#### 2.2 Logo returns to home

**Steps:**
1. Navigate to `/about`.
2. Click the "Mentora home" link.

**Expected Results:**
- URL is `/` and the hero H1 is visible.

#### 2.3 Header "Find a teacher" opens the teachers page from any page

**Steps:**
1. Navigate to `/events`.
2. Click "Find a teacher" in the banner.

**Expected Results:**
- URL is `/teachers`.
- The teacher search field is visible.

---

### 3. Mobile navigation

**Seed:** `tests/seed.spec.ts`

#### 3.1 Mobile menu opens, navigates and closes

**Steps:**
1. Set viewport to 375×812 and navigate to `/`.
2. Verify the desktop nav links are not visible and an "Open menu" button is.
3. Click "Open menu".
4. Click "Events" inside the "Menu" dialog.

**Expected Results:**
- Step 3: a dialog named "Menu" opens containing the 5 nav links, a "Theme" toggle, and "Find a teacher" (links to `/teachers`).
- Step 4: URL becomes `/events` and the dialog closes automatically.
- No horizontal scroll on the page (`scrollWidth <= innerWidth`).

#### 3.2 Mobile menu can be dismissed without navigating

**Steps:**
1. At 375×812 on `/`, open the menu.
2. Click "Close". Reopen it and press `Escape`.

**Expected Results:**
- The dialog closes each time; URL remains `/`.
- Focus returns to the "Open menu" button.

---

### 4. Color mode

**Seed:** `tests/seed.spec.ts`

#### 4.1 Toggle switches theme and persists across reloads

**Steps:**
1. Fresh context, navigate to `/`.
2. Verify `<html>` has class `dark` and the toggle is labelled "Switch to light mode".
3. Click the toggle.
4. Reload the page.
5. Navigate to `/blog`.

**Expected Results:**
- After step 3: `<html>` has class `light`, toggle label is "Switch to dark mode".
- After steps 4 and 5: theme is still `light`.
- Clicking again returns to `dark`.

---

### 5. Landing page interactions

**Seed:** `tests/seed.spec.ts`

#### 5.1 Hero CTAs

**Steps:**
1. Navigate to `/`.
2. Click hero "Find a teacher". Then scroll to top and click hero "Become a teacher".
3. Click the avatars link "… 12,000+ passionate, vetted teachers".

**Expected Results:**
- "Find a teacher" scrolls to `#teachers`.
- The avatars link opens the `/teachers` page.
- "Become a teacher" scrolls to `#cta` ("Your next breakthrough is one lesson away" visible).

#### 5.2 Hero video opens and closes

**Steps:**
1. Navigate to `/`.
2. Click "Play video".
3. Close it with the "Close video" button.
4. Reopen it and press `Escape`.
5. Reopen it and click the backdrop outside the player.

**Expected Results:**
- Step 2: a dialog named "Mentora video" appears with a "Close video" button.
- Steps 3–5: the dialog is removed each time and the page is scrollable again.
- Rapid double-click on "Play video" opens only one dialog.

#### 5.3 Teachers section lists teacher cards

**Steps:**
1. Navigate to `/#teachers`.

**Expected Results:**
- 6 teacher cards: Sofía Herrera, David Okafor, Mei Tanaka, Liam O'Connor, Priya Nair, Marcus Bennett.
- Each has a "Book a class with <name>" button.

#### 5.4 "Book a class" opens a booking email

**Steps:**
1. Navigate to `/`.
2. Inspect each teacher's "Book a class" button.

**Expected Results:**
- Each button links to `mailto:hello@mentora.com?subject=Book a class with <teacher name>` (URL-encoded).
- There is no in-app booking flow yet; email is the interim channel, like "Become a teacher".

#### 5.5 Testimonials carousel navigation and wrap-around

**Steps:**
1. Navigate to `/`, locate region "Testimonials".
2. Note the active slide label ("1 of 7").
3. Click "Next testimonial".
4. Click "Previous testimonial" twice.

**Expected Results:**
- After step 3: active slide is "2 of 7".
- After step 4: active slide is "7 of 7" (wraps from first to last).
- Clicking "Next" from "7 of 7" wraps to "1 of 7".

#### 5.6 FAQ tabs and accordion

**Steps:**
1. Navigate to `/`, scroll to "Frequently asked questions".
2. Verify "For Students" tab is selected and shows 4 questions.
3. Click "How do I find the right teacher?".
4. Click it again.
5. Click "For Teachers" tab, then "Payments & Safety".
6. Focus "For Students" and press `ArrowRight`.

**Expected Results:**
- Step 3: `aria-expanded="true"` and the answer region is visible. Step 4: collapses again.
- Step 5: "For Teachers" shows "How do I start teaching on Mentora?", "How and when do I get paid?", "Do I have to
  commit to set hours?"; "Payments & Safety" shows "Is it safe to learn online with a stranger?" and "What payment
  methods do you accept?". Only one tab has `aria-selected="true"`.
- Step 6: focus and selection move to "For Teachers".

#### 5.7 Bottom CTA "Become a teacher" is a mailto link

**Steps:**
1. Navigate to `/`, scroll to "Your next breakthrough is one lesson away".

**Expected Results:**
- "Become a teacher" has `href="mailto:hello@mentora.com?subject=I want to teach on Mentora"`.
- "Find a teacher" points to the `/teachers` page.

---

### 6. Subjects page

**Seed:** `tests/seed.spec.ts`

#### 6.1 All subject cards render with topics

**Steps:**
1. Navigate to `/subjects`.

**Expected Results:**
- 6 articles with H2s: Languages, Mathematics, Sciences, Music, Coding & Data, Exams & Writing.
- Each has a list "<Subject> topics" with 4 items (e.g. Music → Guitar, Piano, Music theory, Songwriting).
- Each has a "Find a <subject> teacher" link to `/#teachers`.

#### 6.2 Subject CTA leads to the teachers section

**Steps:**
1. Navigate to `/subjects`.
2. Click "Find a music teacher".

**Expected Results:**
- URL is `/#teachers` and "Meet a few of our teachers" is visible.
- Minor copy issue to log: the Exams card reads "Find a **exams** & writing teacher" (should be "an").

---

### 7. Events page

**Seed:** `tests/seed.spec.ts`

#### 7.1 Upcoming and past events render

**Steps:**
1. Navigate to `/events`.

**Expected Results:**
- "Coming up next" lists 4 events in date order (Nov 12, Nov 26, Dec 3, Jan 21), each with a `<time>`, type
  (e.g. "Webinar"), title, description and location.
- "Catch up on past events" lists 5 events, newest first (October 8, 2026 → August 20, 2026).
- "Suggest a topic" has `href="mailto:hello@mentora.com?subject=Event topic suggestion"`.

---

### 8. Blog

**Seed:** `tests/seed.spec.ts`

#### 8.1 Blog index lists articles newest first

**Steps:**
1. Navigate to `/blog`.

**Expected Results:**
- Featured link labelled "Latest article" → "From Mockup to Market…" (Apr 23, 2025).
- Then, in order: "The Psychology of Color in UI Design" (Mar 15), "How I Built My Design System from Scratch"
  (Mar 5), "The Case for Slow Design in a Fast-Paced Digital World" (Jan 28).
- Each card shows date and "N min read".

#### 8.2 Open an article from the index

**Steps:**
1. Navigate to `/blog`.
2. Click "The Psychology of Color in UI Design".

**Expected Results:**
- URL is `/blog/psychology-of-color-in-ui-design`; H1 equals the article title; cover image has matching alt text.
- "The Mentora Journal" back-link navigates to `/blog`.

#### 8.3 Heading anchors

**Steps:**
1. Open `/blog/from-mockup-to-market`.
2. Click the "User Interviews" heading link.

**Expected Results:**
- URL hash becomes `#user-interviews` and the heading scrolls into view.

#### 8.4 Copy link shows a toast and copies the URL

**Steps:**
1. Grant `clipboard-read`/`clipboard-write` (Chromium only; skip on Firefox/WebKit).
2. Open `/blog/psychology-of-color-in-ui-design`, click "Copy link".

**Expected Results:**
- Toast "Article link copied to clipboard" appears in "Notifications".
- Clipboard text equals the article's absolute URL.

#### 8.5 Previous/next follows the same order as the index

**Steps:**
1. Open each article and read the "More articles" navigation.

**Expected Results (date order, matching `/blog`):**

| Article | Previous (newer) | Next (older) |
|---|---|---|
| From Mockup to Market | — | The Psychology of Color |
| The Psychology of Color | From Mockup to Market | How I Built My Design System |
| How I Built My Design System | The Psychology of Color | The Case for Slow Design |
| The Case for Slow Design | How I Built My Design System | — |


#### 8.6 Unknown article returns 404

**Steps:**
1. Navigate to `/blog/nope`.

**Expected Results:**
- Status 404, title "Page not found", H1 "Page not found: /blog/nope".

---

### 9. About page

**Seed:** `tests/seed.spec.ts`

#### 9.1 Content and CTAs

**Steps:**
1. Navigate to `/about`.
2. Click "Browse subjects".

**Expected Results:**
- H2s "Why we built Mentora" and "What we stand for" are visible; 4 values listed (Every teacher is vetted, Built
  around your life, No subscriptions, Safe and secure).
- Anchors `#who-learns-on-mentora` and `#who-teaches-on-mentora` scroll to their headings.
- Step 2 navigates to `/subjects`.

---

### 10. Error handling

**Seed:** `tests/seed.spec.ts`

#### 10.1 404 page and recovery

**Steps:**
1. Navigate to `/does-not-exist`.
2. Click "Back to home".

**Expected Results:**
- Status 404; header and footer still render; H1 "Page not found: /does-not-exist".
- Step 2 lands on `/` with the home title.

#### 10.2 Bottom-CTA "Find a teacher" works from inner pages

**Steps:**
1. Navigate to `/events` (repeat for `/subjects`, `/about`, `/blog`). Article pages have no bottom CTA.
2. In the bottom CTA ("Your next breakthrough is one lesson away"), click "Find a teacher".

**Expected Results:**
- User lands on `/teachers` with the teacher search visible.

---

## Known issues found during exploration

| # | Issue | Scenario | Status |
|---|---|---|---|
| 1 | "Book a class" buttons had no action | 5.4 | Fixed: opens a booking email |
| 2 | Blog prev/next ordered by file name, not by date | 8.5 | Fixed: surround query sorted by date |
| 3 | Bottom-CTA "Find a teacher" was a dead anchor on every page except `/` | 10.2 | Fixed: links to `/teachers` |
| 4 | Copy: "Find a exams & writing teacher" | 6.2 | Open |

## Out of scope

- `/blobs` internal showcase page (only a load smoke check is worthwhile).
- Visual regression of animated blobs and parallax.
- External destinations (Discord/X/GitHub, `mailto:`): assert `href` only, don't follow.
