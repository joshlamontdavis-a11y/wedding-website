/* =====================================================================
   WEDDING WEBSITE SETTINGS
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to update the site.

   Tips:
   - Keep the quotes around text: "like this".
   - Leave a value as empty quotes ("") and the site shows a tidy
     "coming soon" message instead of a broken link.
   - Every item in a list ends with a comma.
   - After saving, refresh the page in your browser to see changes.
   ===================================================================== */

window.WEDDING = {

  /* ---------- The couple ---------- */
  partner1: "Joshua Davis",
  partner2: "Charlotte McQuinn",
  // Short version used in the header, page titles, and link previews.
  coupleShortName: "Joshua & Charlotte",

  /* ---------- The date ---------- */
  // Format: YYYY-MM-DD
  weddingDate: "2027-04-23",
  // Utah time. Used for the countdown and calendar invites.
  // April in Utah is Mountain Daylight Time (UTC-6).
  timeZone: "America/Denver",
  utcOffset: "-06:00",

  /* ---------- Sharing ---------- */
  // The site's web address once it's live, e.g. "https://joshandcharlotte.com/"
  // (Optional; helps link previews find the preview photo.)
  siteUrl: "",
  // One sentence shown under the link when it's texted or shared.
  siteDescription: "Join us as we celebrate our wedding on Friday, April 23, 2027 in Utah.",

  /* ---------- Home page ---------- */
  welcomeHeading: "We're getting married",
  welcomeMessage:
    "We are so grateful for the family and friends who have shaped our lives, " +
    "and we would love for you to celebrate with us.",

  // Announcement photos for the slideshow at the top of the home page.
  // Put the files in images/announcement/ and list them here, e.g.:
  //   { src: "images/announcement/01.jpg", alt: "Joshua and Charlotte smiling in a field of wildflowers" },
  // The FIRST photo is also used as the preview image when the link is shared.
  announcementPhotos: [
  ],
  // Seconds each slideshow photo stays on screen.
  slideshowSeconds: 6,

  /* ---------- RSVP ---------- */
  // Your Google Form's normal link (Send > link icon). Opens in a new tab.
  rsvpFormUrl: "",
  // Optional: the form's EMBED link (Send > <> icon, copy just the src="..." address).
  // When set, the form also appears right on the RSVP page.
  rsvpEmbedUrl: "",
  // Optional, e.g. "Please RSVP by February 1st". Hidden when empty.
  rsvpDeadline: "",
  rsvpMessage: "We can't wait to celebrate with you. Please let us know if you'll be joining us.",

  /* ---------- Schedule ---------- */
  // Times use this format: "10:45 AM". Events appear in the order listed.
  //   highlight : an important note shown in an accent box (leave "" for none)
  //   note      : extra guest instructions (leave "" to hide)
  //   timeFallback : shown instead of a time when startTime is empty
  events: [
    {
      title: "Sealing",
      startTime: "11:30 AM",
      endTime: "12:30 PM",
      timeFallback: "",
      venue: "Payson Utah Temple",
      address: "1494 S 930 W, Payson, UT 84651",
      highlight: "Please arrive 30 minutes early (by 11:00 AM).",
      // This is the "sealingNote": extra instructions for sealing guests.
      note: "",
    },
    {
      title: "Ring Ceremony",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
      timeFallback: "",
      venue: "Northampton House",
      address: "198 W 300 N, American Fork, UT 84003",
      highlight: "",
      note: "",
    },
    {
      title: "Reception",
      // Placeholder times. Clear both ("") to show "Following the ring ceremony" instead.
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      timeFallback: "Following the ring ceremony",
      venue: "Northampton House",
      address: "198 W 300 N, American Fork, UT 84003",
      highlight: "",
      note: "",
    },
  ],

  /* ---------- Registry ---------- */
  // Full link to your Amazon registry.
  amazonRegistryUrl: "",
  // Your Venmo username, without the @. e.g. "Joshua-Davis-1258"
  venmoUsername: "Joshua-Davis-1258",
  registryThankYou:
    "Your presence on our special day is the greatest gift of all. " +
    "For those who have asked, we've gathered a few ideas below. Thank you for your love and generosity.",

  /* ---------- Gallery ---------- */
  // Put the files in images/gallery/ and list them here, e.g.:
  //   { src: "images/gallery/01.jpg", alt: "Charlotte laughing on the beach at sunset" },
  galleryPhotos: [
  ],
  galleryIntro: "A few of our favorite moments together.",
};
