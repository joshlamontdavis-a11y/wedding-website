# Joshua & Charlotte: Wedding Website

A simple, mobile-friendly wedding website. It's plain HTML, CSS, and JavaScript, with no
framework and no build step, so it can be hosted for free.

**You only ever need to edit one file: `config.js`.** Every page reads its words, links,
times, and photos from there.

---

## What's in the folder

| File / folder | What it is |
|---|---|
| `config.js` | **All your content.** Names, date, links, schedule, photo lists. |
| `index.html` | Home page: photo slideshow, names, date, countdown |
| `rsvp.html` | RSVP page on the main site, with the "RSVP Now" button |
| `rsvp-form.html` | Your RSVP form (connected to your Google Sheet), opened in a new tab |
| `schedule.html` | Timeline of the day, with directions and add-to-calendar |
| `attire.html` | What to Wear: the dress code, with funny yes/no pictures |
| `registry.html` | Amazon registry and Venmo |
| `gallery.html` | Photo grid with a full-screen viewer |
| `styles.css` | The look. Colors and fonts are at the very top. |
| `main.js` | The code that builds each page from `config.js`. No need to edit. |
| `favicon.svg` | The little icon in the browser tab (a placeholder "J&C" monogram) |
| `images/announcement/` | Your announcement photos go here |
| `images/gallery/` | Your gallery photos go here |
| `images/attire/` | The cartoon outfit pictures on the What to Wear page |
| `images/og-image.jpg` | The picture shown when the link is texted (placeholder for now) |
| `images/apple-touch-icon.png` | Icon used if a guest saves the site to their phone's home screen |

---

## Editing `config.js`

Open `config.js` in any text editor (Notepad works, VS Code is nicer). A few rules:

- Keep text inside quotes: `"like this"`.
- Each line in a list ends with a comma.
- To leave something unfinished, use empty quotes: `""`. The site then shows a tidy
  "coming soon" message instead of a broken link.
- Save, then refresh the browser to see the change.

If you make a typo (like a missing comma), the site shows a message saying the settings
couldn't load. Press **F12** and look at the **Console** tab; it names the line with the problem.

### Every setting, explained

**The couple**

| Setting | What goes there | Current value |
|---|---|---|
| `partner1`, `partner2` | Your full names. The home page uses first names. | Joshua Davis, Charlotte McQuinn |
| `coupleShortName` | Short version for the header, footer, and page titles | Joshua & Charlotte |

**The date**

| Setting | What goes there | Current value |
|---|---|---|
| `weddingDate` | The date as `YYYY-MM-DD` | 2027-04-23 |
| `timeZone` | Time zone for calendar invites | America/Denver (Utah) |
| `utcOffset` | Utah's offset from UTC **in April** (daylight time). Only change if the wedding moves to winter (`-07:00`). | -06:00 |

The countdown counts down to the start of the first event (the sealing at 11:30 AM).

**Sharing**

| Setting | What goes there | Current value |
|---|---|---|
| `siteUrl` | The site's address once it's live, e.g. `https://joshandcharlotte.netlify.app/` | *empty* |
| `siteDescription` | One sentence that appears under the link in texts | filled in |

**Home page**

| Setting | What goes there |
|---|---|
| `welcomeHeading` | Small line above your names ("We're getting married") |
| `welcomeMessage` | Short paragraph under the countdown |
| `announcementPhotos` | List of slideshow photos (see "Adding photos" below). Empty = elegant placeholder. |
| `slideshowSeconds` | How long each photo shows (default 6) |

**RSVP**

| Setting | What goes there | Current value |
|---|---|---|
| `rsvpFormUrl` | Where the big **RSVP Now** button goes (opens in a new tab): a full web link, or a page in this folder. | `rsvp-form.html` |
| `rsvpEmbedUrl` | Optional. The form's *embed* link, to show the form right on the page too. | *empty* |
| `rsvpDeadline` | Optional, e.g. `"Please RSVP by February 1st"`. Hidden when empty. | *empty* |
| `rsvpMessage` | Short line above the button | filled in |

**Your RSVP form (`rsvp-form.html`).** This is a standalone page with its own look, on
purpose, so it feels separate from the main site. Guests type their name, pick their
invitation, and answer for each event. Answers go to your Google Sheet through the Apps Script
web app. Its settings live in the `RSVP_CONFIG` block near the bottom of that file:

- `scriptUrl`: your Apps Script web app link (ends in `/exec`). If blank, the page shows a
  preview with sample guests.
- `couple`, `dateLine`: the text at the top.
- `deadline`: shown as "Kindly reply by ...". Hidden when blank.
- `helpText`: shown when a guest gets stuck. It's public, so only put contact info there you're
  happy for guests to see.

Its colors are at the top of the file under `:root` (the `--rsvp-...` values).

To use a Google Form instead, set `rsvpFormUrl` to the form's link:
1. Open your form and click **Send**.
2. For `rsvpFormUrl`: click the link icon 🔗, check "Shorten URL" if you like, and copy it.
3. For `rsvpEmbedUrl`: click the `< >` icon. You'll see code like
   `<iframe src="https://docs.google.com/forms/d/e/.../viewform?embedded=true" ...>`.
   Copy **only** the address between the quotes after `src=`.

**Schedule** (`events`)

Each event is a block between `{ }`. Events show in the order listed.

| Field | What goes there |
|---|---|
| `title` | Event name |
| `startTime`, `endTime` | Like `"10:45 AM"`. If `startTime` is empty, `timeFallback` is shown instead. |
| `timeFallback` | Text shown when there's no time yet |
| `venue`, `address` | Used for the Get Directions link and calendar invites |
| `highlight` | An important note in a colored box (the sealing's "arrive 30 minutes early") |
| `note` | Extra guest instructions. Hidden when empty. **On the Sealing, this is the `sealingNote`.** |

The **Reception** times are set to the placeholder 6:00 PM to 9:00 PM. To show "Following the
ring ceremony" instead, set both `startTime` and `endTime` to `""`.

"Get Directions" opens Google Maps. "Add to Calendar" offers Google Calendar or a downloadable
`.ics` file (works with iPhone, Mac, and Outlook calendars). These are built automatically from
the times and addresses.

**What to Wear**

| Setting | What goes there |
|---|---|
| `attireIntro` | The friendly line at the top of the page |
| `attireSections` | One block per group ("For the Ladies", "For the Gentlemen"). Each has a `heading`, a `rule` (shown in a highlighted box), and `examples`. |

Each example has a picture (`src`), a description for screen readers (`alt`), a `verdict`
(`"yes"` shows a green **Approved** badge, `"no"` shows a red **Absolutely not** badge), and a
funny `caption`. The pictures are cartoon drawings in `images/attire/`. To use real photos
instead, put them in that folder and change the `src`. The RSVP page also links here
("Wondering what to wear?").

**Registry**

| Setting | What goes there | Current value |
|---|---|---|
| `amazonRegistryUrl` | Full link to your Amazon registry | *empty* → "Coming soon" |
| `venmoUsername` | Your Venmo username **without** the @ | Joshua-Davis-1258 |
| `registryThankYou` | The warm thank-you message at the top | filled in |

The Venmo button links to `https://venmo.com/u/<your username>`. Empty = "Coming soon".

**Gallery**

| Setting | What goes there |
|---|---|
| `galleryPhotos` | List of gallery photos. Empty = "More photos coming soon." |
| `galleryIntro` | Line under the page title |

---

## Adding photos

### 1. Resize and compress them first (important!)

Phone photos are often 4 to 12 MB each. Guests will open this site on cell data, so shrink
every photo first. Aim for **about 2000 pixels on the long edge** and **under ~500 KB**.

Easy free options:
- **[Squoosh](https://squoosh.app)** (in your browser): drag in a photo, under "Resize" set the
  width (landscape) or height (portrait) to 2000, choose **MozJPEG** at quality ~75, and download.
- **[TinyJPG](https://tinyjpg.com)** compresses photos in batches (resize first).
- **Windows:** the free **PowerToys Image Resizer** adds "Resize pictures" to the right-click menu.
- **Mac:** open in Preview → Tools → Adjust Size → 2000 px, then File → Export as JPEG at ~75% quality.

Use simple file names with no spaces, like `01.jpg`, `02.jpg`, `beach-sunset.jpg`.
File names are case-sensitive once online: `Photo.JPG` and `photo.jpg` are different files.

### 2. Put them in the right folder

- Slideshow photos → `images/announcement/`
- Gallery photos → `images/gallery/`

### 3. List them in `config.js`

```js
announcementPhotos: [
  { src: "images/announcement/01.jpg", alt: "Joshua and Charlotte laughing on a mountain trail" },
  { src: "images/announcement/02.jpg", alt: "Charlotte showing her engagement ring" },
],
```

```js
galleryPhotos: [
  { src: "images/gallery/01.jpg", alt: "Our first date at the lake" },
  { src: "images/gallery/02.jpg", alt: "Joshua proposing at sunset", caption: "She said yes!" },
],
```

- `alt` describes the photo for guests using screen readers. One short sentence is perfect.
- `caption` (gallery only) is optional text shown under the photo in the full-screen viewer.
- Landscape photos work best in the slideshow. The gallery grid crops to a tidy portrait
  shape, and the full photo shows when tapped.
- If you list a file that doesn't exist, the site quietly skips it (no broken-image icons).

---

## The link preview (what people see when you text the link)

When a link is texted, iMessage and other apps read a few tags at the top of each `.html` file.
**They don't run JavaScript**, so this is the one thing that doesn't come from `config.js`.

The current preview is `images/og-image.jpg`, a placeholder card with your names and date.
To use your first announcement photo instead:

1. Make a copy of your favorite announcement photo, crop it to roughly **1200 × 630**
   (a wide rectangle), and save it as `images/og-image.jpg`, replacing the placeholder.
2. That's it. The preview tags already point at the live address
   (`https://joshlamontdavis-a11y.github.io/wedding-website/images/og-image.jpg`), and
   `siteUrl` is set in `config.js`. Keep the file name `og-image.jpg` exactly.

**If the site's address ever changes** (for example, a custom domain), update `siteUrl` in
`config.js`, and in each of the five `.html` files replace
`https://joshlamontdavis-a11y.github.io/wedding-website/` with the new address
(it appears in the `og:url`, `og:image`, and `twitter:image` lines).
In VS Code: Edit → Replace in Files.

Messaging apps cache previews, so a change may take a while to show up for links you've
already sent.

---

## Changing the colors and fonts

Open `styles.css`. Everything is in the `:root { ... }` block at the top:

- `--color-accent` is the one accent color (currently a soft rose pink, `#a35763`). Change it
  and `--color-accent-dark` (a slightly darker version for hover) to retheme the site.
  Pick a color dark enough for white text to be readable on it.
- `--font-display` (headings) and `--font-body` (everything else). The fonts are loaded from
  Google Fonts in the `<head>` of each HTML file.

---

## Previewing on your computer

**Quickest:** double-click `index.html`. It opens in your browser and everything works,
including photos (as long as they're in the `images` folders).

**More realistic (optional):** if you have Python installed, open a terminal in this folder and run:

```bash
python -m http.server 8080
```

Then visit <http://localhost:8080>. Press Ctrl+C in the terminal to stop.
Or, in VS Code, install the **Live Server** extension and click "Go Live" in the bottom bar.

**To see the phone layout** in Chrome or Edge: press F12, then click the phone/tablet icon
(top-left of the panel) and pick an iPhone.

---

## Putting it online for free

Pick **one** option. Netlify is the easiest; GitHub Pages is great if you already use GitHub.

### Option A: Netlify Drop (easiest, about 2 minutes)

1. Go to <https://app.netlify.com/drop> and create a free account.
2. Drag this **whole folder** onto the page.
3. Netlify gives you an address like `https://random-name-123.netlify.app`. Your site is live.
4. Give it a nicer name: **Site configuration → Change site name** (e.g. `joshandcharlotte`
   → `https://joshandcharlotte.netlify.app`).
5. **To update the site later:** go to your site's **Deploys** tab and drag the folder onto it again.

### Option B: GitHub Pages

1. Create a free account at <https://github.com>.
2. Click **+** (top right) → **New repository**. Name it (e.g. `wedding`), set it to **Public**,
   and click **Create repository**.
3. On the next page, click **uploading an existing file**. Drag in everything in this folder
   (all files *and* the `images` folder), then click **Commit changes**.
4. Go to **Settings → Pages**. Under "Build and deployment", set Source to
   **Deploy from a branch**, Branch to **main** and **/ (root)**, then click **Save**.
5. Wait a minute or two and refresh. The page shows your address, like
   `https://yourusername.github.io/wedding/`.
6. **To update the site later:** open the file on GitHub, click the pencil icon to edit
   (great for `config.js`), or use **Add file → Upload files** to add photos. Changes go
   live in about a minute.

> Note: GitHub can't store empty folders, so the `images` folders include a hidden
> `.gitkeep` file. Leave it there.

### Custom domain (optional, about $12/year)

Both Netlify and GitHub Pages let you use your own domain (like `joshandcharlotte.com`).
Buy one from a registrar like Namecheap, Porkbun, or Cloudflare, then follow
Netlify's **Domain management** or GitHub's **Settings → Pages → Custom domain** instructions.

---

## Before you send the link: quick checklist

- [ ] Open every page on your phone
- [ ] Tap **RSVP Now** and confirm the right form opens
- [ ] Tap **Get Directions** for each event
- [ ] Try **Add to Calendar** and check the times landed correctly
- [ ] Tap the Venmo and Amazon buttons
- [ ] Text the link to yourself and check the preview image
