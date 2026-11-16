/* =====================================================================
   main.js: builds every page from the settings in config.js.
   You shouldn't need to edit this file. Change config.js instead.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.WEDDING;
  var page = document.body.getAttribute("data-page");
  var main = document.getElementById("main");

  // If config.js is missing or has a typo, show a helpful message.
  if (!C) {
    main.innerHTML =
      '<div class="config-error"><strong>The site settings could not be loaded.</strong>' +
      "<p>Check config.js for a typo, like a missing comma or quote. " +
      "Opening the browser console (F12) shows the exact line.</p></div>";
    return;
  }

  /* ---------------- Small helpers ---------------- */

  // Escape text before putting it into HTML.
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // True when a text setting has been filled in.
  function isSet(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  // True when a setting is a real web link (http or https).
  function isLink(value) {
    return isSet(value) && /^https?:\/\//i.test(value.trim());
  }

  // Turn a photo entry (a "path" or { src, alt }) into { src, alt, caption }.
  function normalizePhoto(p) {
    if (typeof p === "string") p = { src: p };
    if (!p || !isSet(p.src)) return null;
    return {
      src: p.src.trim(),
      alt: isSet(p.alt) ? p.alt : "Photo of " + C.coupleShortName,
      caption: isSet(p.caption) ? p.caption : "",
    };
  }

  function photoList(list) {
    return (Array.isArray(list) ? list : []).map(normalizePhoto).filter(Boolean);
  }

  // "Joshua & Charlotte" with a styled ampersand.
  function coupleNameHtml(name) {
    return esc(name).replace("&amp;", '<span class="amp">&amp;</span>');
  }

  // Date helpers. The wedding date is a calendar day, so we format it in UTC
  // to avoid it shifting a day for guests in other time zones.
  function weddingDay() {
    return new Date(C.weddingDate + "T12:00:00Z");
  }
  function longDate() {
    return weddingDay().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    });
  }
  function shortDate() {
    return weddingDay().toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    });
  }

  // "4:00 PM" -> { h: 16, m: 0 }. Returns null if empty or not understood.
  function parseTime(text) {
    if (!isSet(text)) return null;
    var match = text.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?\s*[Mm]?\.?$/);
    if (!match) return null;
    var h = parseInt(match[1], 10) % 12;
    if (match[3].toLowerCase() === "p") h += 12;
    return { h: h, m: parseInt(match[2] || "0", 10) };
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // The exact moment (as a Date) of a time on the wedding day, in Utah time.
  function momentOf(time) {
    return new Date(C.weddingDate + "T" + pad(time.h) + ":" + pad(time.m) + ":00" + (C.utcOffset || "-06:00"));
  }

  // Date -> "20270423T164500Z" (the format calendars use).
  function calStamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  var ICONS = {
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    envelope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="9" width="18" height="12"/><path d="M2 9h20M12 9v12M12 9c-1.5-3-5-4-5-1.5S12 9 12 9zm0 0c1.5-3 5-4 5-1.5S12 9 12 9z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
    calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    prev: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    // A delicate botanical flourish used on the photo placeholder.
    ornament: '<svg viewBox="0 0 140 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M2 12h52M86 12h52"/><path d="M70 4c-4 4-4 12 0 16 4-4 4-12 0-16z"/><path d="M62 12c-4-5-10-6-14-3 4 4 10 5 14 3zM78 12c4-5 10-6 14-3-4 4-10 5-14 3z"/></svg>',
  };

  function comingSoon(title, text, icon) {
    return (
      '<div class="coming-soon reveal">' +
      (icon ? '<div class="coming-soon-icon">' + ICONS[icon] + "</div>" : "") +
      "<h3>" + esc(title) + "</h3>" +
      (text ? "<p>" + esc(text) + "</p>" : "") +
      "</div>"
    );
  }

  /* ---------------- Shared header and footer ---------------- */

  var NAV = [
    { href: "index.html", label: "Home", id: "home" },
    { href: "schedule.html", label: "Schedule", id: "schedule" },
    { href: "rsvp.html", label: "RSVP", id: "rsvp" },
    { href: "registry.html", label: "Registry", id: "registry" },
    { href: "gallery.html", label: "Gallery", id: "gallery" },
  ];

  function renderHeader() {
    var header = document.getElementById("site-header");
    var links = NAV.map(function (item) {
      var current = item.id === page ? ' aria-current="page"' : "";
      return '<li><a href="' + item.href + '"' + current + ">" + item.label + "</a></li>";
    }).join("");

    header.className = "site-header";
    header.innerHTML =
      '<div class="header-inner">' +
      '<a class="brand" href="index.html">' + coupleNameHtml(C.coupleShortName) + "</a>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
      '<span class="nav-toggle-bars"></span><span class="visually-hidden">Menu</span></button>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + links + "</ul></nav>" +
      "</div>";

    var toggle = header.querySelector(".nav-toggle");
    function setOpen(open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });
    // Close the menu with Esc or by tapping elsewhere.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) setOpen(false);
    });
  }

  function renderFooter() {
    var footer = document.getElementById("site-footer");
    footer.className = "site-footer";
    footer.innerHTML =
      '<p class="footer-names">' + coupleNameHtml(C.coupleShortName) + "</p>" +
      '<p class="footer-date">' + esc(longDate()) + "</p>";
  }

  /* ---------------- Page titles and link previews ---------------- */

  function setMeta() {
    var titles = { home: "", rsvp: "RSVP", schedule: "Schedule", registry: "Registry", gallery: "Gallery" };
    var base = C.coupleShortName + " · " + shortDate();
    document.title = titles[page] ? titles[page] + " · " + C.coupleShortName : base;

    function setTag(selector, value) {
      var tag = document.querySelector(selector);
      if (tag && isSet(value)) tag.setAttribute("content", value);
    }
    setTag('meta[name="description"]', C.siteDescription);
    setTag('meta[property="og:title"]', document.title);
    setTag('meta[property="og:description"]', C.siteDescription);

    // Point the preview image at the first announcement photo (needs siteUrl).
    var first = photoList(C.announcementPhotos)[0];
    if (first && isLink(C.siteUrl)) {
      var abs = C.siteUrl.replace(/\/?$/, "/") + first.src.replace(/^\//, "");
      setTag('meta[property="og:image"]', abs);
      setTag('meta[name="twitter:image"]', abs);
    }
  }

  /* ---------------- Home page ---------------- */

  function renderHome() {
    var photos = photoList(C.announcementPhotos);
    var names =
      esc(C.partner1.split(" ")[0]) + ' <span class="amp">&amp;</span> ' + esc(C.partner2.split(" ")[0]);
    var buttonsPhoto =
      '<div class="btn-row"><a class="btn btn-light" href="rsvp.html">RSVP</a>' +
      '<a class="btn btn-ghost-light" href="schedule.html">View the Schedule</a></div>';
    var buttonsPlain =
      '<div class="btn-row"><a class="btn" href="rsvp.html">RSVP</a>' +
      '<a class="btn btn-outline" href="schedule.html">View the Schedule</a></div>';

    function heroContent(withPhotos) {
      return (
        '<div class="hero-content">' +
        (withPhotos ? "" : '<div class="hero-ornament">' + ICONS.ornament + "</div>") +
        '<span class="eyebrow">' + esc(C.welcomeHeading) + "</span>" +
        '<h1 class="hero-names">' + names + "</h1>" +
        '<p class="hero-date">' + esc(longDate()) + "</p>" +
        (withPhotos ? "" : '<div class="hero-ornament bottom">' + ICONS.ornament + "</div>") +
        (withPhotos ? buttonsPhoto : buttonsPlain) +
        "</div>"
      );
    }

    main.innerHTML =
      '<section class="hero" id="hero" aria-label="Welcome"></section>' +
      '<section class="section text-center"><div class="container narrow reveal">' +
      '<span class="eyebrow">Counting down</span>' +
      '<h2 style="font-size:2.4rem">Until we say “I do”</h2>' +
      '<div class="countdown" id="countdown" aria-live="off"></div>' +
      "</div></section>" +
      '<section class="section text-center" style="padding-top:0"><div class="container narrow reveal">' +
      '<div class="divider"><span>◆</span></div>' +
      '<p class="lead">' + esc(C.welcomeMessage) + "</p>" +
      "</div></section>";

    var hero = document.getElementById("hero");

    function showPlaceholder() {
      hero.className = "hero hero--placeholder";
      hero.innerHTML = heroContent(false);
    }

    if (!photos.length) {
      showPlaceholder();
    } else {
      buildSlideshow(hero, photos, heroContent(true), showPlaceholder);
    }

    startCountdown(document.getElementById("countdown"));
  }

  function buildSlideshow(hero, photos, contentHtml, onAllFailed) {
    hero.className = "hero";
    hero.innerHTML = '<div class="hero-slides"></div>' + contentHtml;
    var holder = hero.querySelector(".hero-slides");
    var slides = [];
    var current = 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    photos.forEach(function (photo, i) {
      var img = new Image();
      img.className = "hero-slide";
      img.alt = photo.alt;
      img.decoding = "async";
      if (i > 0) img.loading = "lazy";
      // If a listed file is missing, quietly drop it instead of showing a broken image.
      img.onerror = function () {
        img.remove();
        slides = slides.filter(function (s) { return s !== img; });
        if (!slides.length) { stop(); onAllFailed(); return; }
        if (current >= slides.length) current = 0;
        show(current);
        buildDots();
      };
      img.src = photo.src;
      holder.appendChild(img);
      slides.push(img);
    });

    var dotsWrap = document.createElement("div");
    dotsWrap.className = "hero-dots";
    hero.appendChild(dotsWrap);

    function buildDots() {
      dotsWrap.innerHTML = "";
      if (slides.length < 2) return;
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-dot";
        dot.setAttribute("aria-label", "Show photo " + (i + 1));
        dot.addEventListener("click", function () { show(i); restart(); });
        dotsWrap.appendChild(dot);
      });
      updateDots();
    }

    function updateDots() {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.setAttribute("aria-current", i === current ? "true" : "false");
      });
    }

    function show(i) {
      current = i;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
      updateDots();
    }

    function stop() { if (timer) clearInterval(timer); timer = null; }
    function restart() {
      stop();
      if (slides.length > 1 && !reduceMotion) {
        timer = setInterval(function () { show((current + 1) % slides.length); }, (C.slideshowSeconds || 6) * 1000);
      }
    }

    show(0);
    buildDots();
    restart();
  }

  function startCountdown(box) {
    var first = (C.events || []).map(function (e) { return parseTime(e.startTime); }).filter(Boolean)[0];
    var target = momentOf(first || { h: 0, m: 0 });
    var units = [["days", "Days"], ["hours", "Hours"], ["minutes", "Minutes"], ["seconds", "Seconds"]];

    box.innerHTML = units.map(function (u) {
      return '<div class="countdown-unit"><span class="countdown-number" data-unit="' + u[0] + '">0</span>' +
        '<span class="countdown-label">' + u[1] + "</span></div>";
    }).join("");

    function tick() {
      var diff = target - new Date();
      if (diff <= 0) {
        // On or after the big day.
        var dayAfter = new Date(target.getTime() + 24 * 3600 * 1000);
        box.outerHTML = '<p class="countdown-done">' +
          (new Date() < dayAfter ? "Today’s the day!" : "Happily married!") + "</p>";
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      var values = {
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      };
      Object.keys(values).forEach(function (k) {
        var el = box.querySelector('[data-unit="' + k + '"]');
        if (el) el.textContent = k === "days" ? values[k] : pad(values[k]);
      });
    }

    var timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------------- RSVP page ---------------- */

  function renderRsvp() {
    var hasForm = isLink(C.rsvpFormUrl);
    var hasEmbed = isLink(C.rsvpEmbedUrl);
    var body;

    if (hasForm || hasEmbed) {
      body =
        '<div class="card text-center reveal">' +
        (isSet(C.rsvpDeadline) ? '<p class="deadline">' + esc(C.rsvpDeadline) + "</p>" : "") +
        "<p>" + esc(C.rsvpMessage) + "</p>" +
        (hasForm
          ? '<a class="btn" href="' + esc(C.rsvpFormUrl.trim()) + '" target="_blank" rel="noopener">RSVP Now' +
            '<span class="visually-hidden"> (opens in a new tab)</span></a>'
          : "") +
        "</div>" +
        (hasEmbed
          ? '<div class="rsvp-embed reveal"><iframe src="' + esc(C.rsvpEmbedUrl.trim()) +
            '" title="RSVP form" loading="lazy">Loading…</iframe></div>'
          : "");
    } else {
      body =
        (isSet(C.rsvpDeadline) ? '<p class="text-center"><span class="deadline">' + esc(C.rsvpDeadline) + "</span></p>" : "") +
        comingSoon("RSVP form coming soon", "Check back here soon to let us know if you can make it.", "envelope");
    }

    main.innerHTML =
      pageHero("Kindly reply", "RSVP", "") +
      '<section class="section" style="padding-top:1.5rem"><div class="container narrow">' + body + "</div></section>";
  }

  /* ---------------- Schedule page ---------------- */

  function renderSchedule() {
    var events = Array.isArray(C.events) ? C.events : [];
    var items = events.map(function (ev, i) {
      var start = parseTime(ev.startTime);
      var end = parseTime(ev.endTime);
      var timeText = start
        ? ev.startTime.trim() + (end ? " – " + ev.endTime.trim() : "")
        : (isSet(ev.timeFallback) ? ev.timeFallback : "Time to be announced");
      var place = [ev.venue, ev.address].filter(isSet).join(", ");
      var mapsUrl = isSet(ev.mapsUrl)
        ? ev.mapsUrl
        : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);

      return (
        '<li class="timeline-item reveal">' +
        '<span class="event-time">' + esc(timeText) + "</span>" +
        '<h2 class="event-title">' + esc(ev.title) + "</h2>" +
        (isSet(ev.venue) ? '<p class="event-venue">' + esc(ev.venue) + "</p>" : "") +
        (isSet(ev.address) ? '<address class="event-address">' + esc(ev.address) + "</address>" : "") +
        (isSet(ev.highlight) ? '<p class="event-highlight">' + ICONS.clock + "<span>" + esc(ev.highlight) + "</span></p>" : "") +
        (isSet(ev.note) ? '<p class="event-note">' + esc(ev.note) + "</p>" : "") +
        '<div class="event-actions">' +
        (place
          ? '<a class="btn btn-outline btn-small" href="' + esc(mapsUrl) + '" target="_blank" rel="noopener">' +
            ICONS.pin + "Get Directions</a>"
          : "") +
        '<details class="cal-menu"><summary class="btn btn-outline btn-small">' + ICONS.calendar + "Add to Calendar</summary>" +
        '<div class="cal-menu-list">' +
        '<a href="' + esc(googleCalUrl(ev)) + '" target="_blank" rel="noopener">Google Calendar</a>' +
        '<button type="button" data-ics="' + i + '">Apple / Outlook (.ics)</button>' +
        "</div></details>" +
        "</div></li>"
      );
    }).join("");

    main.innerHTML =
      pageHero("The wedding day", "Schedule", longDate()) +
      '<section class="section" style="padding-top:2rem"><div class="container">' +
      (events.length ? '<ol class="timeline">' + items + "</ol>" : comingSoon("Schedule coming soon", "", "calendar")) +
      "</div></section>";

    // .ics download buttons
    main.querySelectorAll("[data-ics]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ev = events[Number(btn.getAttribute("data-ics"))];
        downloadIcs(ev);
        btn.closest("details").removeAttribute("open");
      });
    });

    // Only one calendar menu open at a time; close when tapping elsewhere.
    var menus = main.querySelectorAll(".cal-menu");
    menus.forEach(function (menu) {
      menu.addEventListener("toggle", function () {
        if (menu.open) menus.forEach(function (m) { if (m !== menu) m.removeAttribute("open"); });
      });
    });
    document.addEventListener("click", function (e) {
      menus.forEach(function (m) { if (!m.contains(e.target)) m.removeAttribute("open"); });
    });
  }

  // Start/end of an event for calendars. If no time is set, it's an all-day event.
  function eventTimes(ev) {
    var start = parseTime(ev.startTime);
    var end = parseTime(ev.endTime);
    if (!start) return null;
    var startDate = momentOf(start);
    var endDate = end ? momentOf(end) : new Date(startDate.getTime() + 60 * 60 * 1000);
    return { start: startDate, end: endDate };
  }

  function dayStamp(offsetDays) {
    var d = new Date(C.weddingDate + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + offsetDays);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  }

  function calTitle(ev) {
    return ev.title + " · " + C.coupleShortName;
  }

  function calDetails(ev) {
    return [ev.highlight, ev.note].filter(isSet).join("\n");
  }

  function googleCalUrl(ev) {
    var t = eventTimes(ev);
    var dates = t ? calStamp(t.start) + "/" + calStamp(t.end) : dayStamp(0) + "/" + dayStamp(1);
    return (
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(calTitle(ev)) +
      "&dates=" + dates +
      "&ctz=" + encodeURIComponent(C.timeZone || "America/Denver") +
      "&location=" + encodeURIComponent([ev.venue, ev.address].filter(isSet).join(", ")) +
      "&details=" + encodeURIComponent(calDetails(ev))
    );
  }

  function icsEscape(text) {
    return String(text || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }

  function downloadIcs(ev) {
    var t = eventTimes(ev);
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Website//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + C.weddingDate + "-" + ev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "@wedding",
      "DTSTAMP:" + calStamp(new Date()),
      t ? "DTSTART:" + calStamp(t.start) : "DTSTART;VALUE=DATE:" + dayStamp(0),
      t ? "DTEND:" + calStamp(t.end) : "DTEND;VALUE=DATE:" + dayStamp(1),
      "SUMMARY:" + icsEscape(calTitle(ev)),
      "LOCATION:" + icsEscape([ev.venue, ev.address].filter(isSet).join(", ")),
      "DESCRIPTION:" + icsEscape(calDetails(ev)),
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = ev.title.replace(/[^\w]+/g, "-") + ".ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /* ---------------- Registry page ---------------- */

  function renderRegistry() {
    var amazon = isLink(C.amazonRegistryUrl)
      ? '<a class="btn" href="' + esc(C.amazonRegistryUrl.trim()) + '" target="_blank" rel="noopener">View Amazon Registry' +
        '<span class="visually-hidden"> (opens in a new tab)</span></a>'
      : '<p class="soon-tag">Coming soon</p>';

    var handle = isSet(C.venmoUsername) ? C.venmoUsername.trim().replace(/^@/, "") : "";
    var venmo = handle
      ? '<p class="venmo-handle">@' + esc(handle) + "</p>" +
        '<a class="btn" href="https://venmo.com/u/' + encodeURIComponent(handle) + '" target="_blank" rel="noopener">Send via Venmo' +
        '<span class="visually-hidden"> (opens in a new tab)</span></a>'
      : '<p class="soon-tag">Coming soon</p>';

    main.innerHTML =
      pageHero("With gratitude", "Registry", "") +
      '<section class="section" style="padding-top:1rem"><div class="container narrow">' +
      '<p class="lead text-center reveal">' + esc(C.registryThankYou) + "</p>" +
      '<div class="registry-grid">' +
      '<div class="card registry-card reveal"><div class="registry-icon">' + ICONS.gift + "</div>" +
      "<h2>Amazon</h2><p>Our registry of things for our first home together.</p>" + amazon + "</div>" +
      '<div class="card registry-card reveal"><div class="registry-icon">' + ICONS.heart + "</div>" +
      "<h2>Venmo</h2><p>Prefer to send a gift directly? You can reach us on Venmo.</p>" + venmo + "</div>" +
      "</div></div></section>";
  }

  /* ---------------- Gallery page ---------------- */

  function renderGallery() {
    var photos = photoList(C.galleryPhotos);
    var soon = comingSoon("More photos coming soon", "We'll be adding our favorite moments here.", "camera");

    main.innerHTML =
      pageHero("Our story", "Gallery", isSet(C.galleryIntro) ? C.galleryIntro : "") +
      '<section class="section" style="padding-top:1.5rem"><div class="container" id="gallery-wrap">' +
      (photos.length ? '<div class="gallery-grid" id="gallery-grid"></div>' : '<div class="narrow" style="margin:0 auto">' + soon + "</div>") +
      "</div></section>";

    if (!photos.length) return;

    var grid = document.getElementById("gallery-grid");
    var lightbox = createLightbox();

    photos.forEach(function (photo) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      btn.setAttribute("aria-label", "Open photo: " + photo.alt);

      var img = document.createElement("img");
      img.loading = "lazy"; // only download photos as guests scroll to them
      img.decoding = "async";
      img.alt = photo.alt;
      img.onload = function () { img.classList.add("is-loaded"); };
      // Missing file? Remove the tile rather than show a broken image.
      img.onerror = function () {
        btn.remove();
        if (!grid.children.length) document.getElementById("gallery-wrap").innerHTML =
          '<div class="narrow" style="margin:0 auto">' + soon.replace(" reveal", "") + "</div>";
      };
      img.src = photo.src;

      btn.appendChild(img);
      btn.addEventListener("click", function () {
        // Build the list from tiles still on the page (skips any missing files).
        var tiles = Array.prototype.slice.call(grid.children);
        var list = tiles.map(function (t) { return t._photo; });
        lightbox.open(list, tiles.indexOf(btn), btn);
      });
      btn._photo = photo;
      grid.appendChild(btn);
    });
  }

  function createLightbox() {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<span class="lightbox-count" aria-live="polite"></span>' +
      '<figure class="lightbox-figure"><img class="lightbox-img" alt=""><figcaption class="lightbox-caption"></figcaption></figure>' +
      '<button class="lightbox-btn lightbox-close" type="button" aria-label="Close">' + ICONS.close + "</button>" +
      '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous photo">' + ICONS.prev + "</button>" +
      '<button class="lightbox-btn lightbox-next" type="button" aria-label="Next photo">' + ICONS.next + "</button>";
    document.body.appendChild(box);

    var img = box.querySelector(".lightbox-img");
    var caption = box.querySelector(".lightbox-caption");
    var count = box.querySelector(".lightbox-count");
    var buttons = box.querySelectorAll("button");
    var list = [];
    var index = 0;
    var returnFocus = null;

    function show(i) {
      index = (i + list.length) % list.length;
      var p = list[index];
      img.src = p.src;
      img.alt = p.alt;
      caption.textContent = p.caption;
      caption.hidden = !p.caption;
      count.textContent = list.length > 1 ? index + 1 + " / " + list.length : "";
      // Preload the neighbors so swiping feels instant.
      [index + 1, index - 1].forEach(function (n) {
        var pre = new Image();
        pre.src = list[(n + list.length) % list.length].src;
      });
    }

    function open(photos, start, opener) {
      list = photos;
      returnFocus = opener;
      box.setAttribute("data-single", list.length < 2 ? "true" : "false");
      show(start);
      box.classList.add("is-open");
      document.body.classList.add("no-scroll");
      setTimeout(function () { box.querySelector(".lightbox-close").focus(); }, 50);
    }

    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      if (returnFocus) returnFocus.focus();
    }

    box.querySelector(".lightbox-close").addEventListener("click", close);
    box.querySelector(".lightbox-prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lightbox-next").addEventListener("click", function () { show(index + 1); });

    // Tap outside the photo (on the dark background) to close.
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox-figure")) close();
    });

    // Keyboard: arrows to move, Esc to close, Tab stays inside the viewer.
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "Tab") {
        var visible = Array.prototype.filter.call(buttons, function (b) { return b.offsetParent !== null; });
        var first = visible[0];
        var last = visible[visible.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe left/right on phones.
    var startX = null;
    var startY = null;
    box.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null || list.length < 2) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? index + 1 : index - 1);
      startX = null;
    });

    return { open: open };
  }

  /* ---------------- Shared page heading ---------------- */

  function pageHero(eyebrow, title, subtitle) {
    return (
      '<header class="page-hero reveal">' +
      '<span class="eyebrow">' + esc(eyebrow) + "</span>" +
      '<h1 class="page-title">' + esc(title) + "</h1>" +
      '<div class="divider"><span>◆</span></div>' +
      (isSet(subtitle) ? '<p class="lead">' + esc(subtitle) + "</p>" : "") +
      "</header>"
    );
  }

  /* ---------------- Gentle fade-in on scroll ---------------- */

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Start ---------------- */

  renderHeader();
  renderFooter();
  setMeta();

  var renderers = {
    home: renderHome,
    rsvp: renderRsvp,
    schedule: renderSchedule,
    registry: renderRegistry,
    gallery: renderGallery,
  };
  if (renderers[page]) renderers[page]();

  setupReveal();
})();
