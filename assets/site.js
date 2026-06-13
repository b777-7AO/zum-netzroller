// Shared nav + footer injection and interactions for Restaurant Zum Netzroller
(function () {
  // Central address that every website inquiry / reservation is delivered to.
  // TODO: replace with the restaurant's real inbox before launch.
  const INQUIRY_EMAIL = "info@restaurant-zum-netzroller.de";
  const PHONE = "06245 5555";
  const PHONE_TEL = "+4962455555";

  const NAV = [
    { href: "index.html", label: "Start" },
    { href: "speisekarte.html", label: "Speisekarte" },
    { href: "galerie.html", label: "Galerie" },
    { href: "kontakt.html", label: "Kontakt & Anfahrt" },
  ];

  const current = location.pathname.split("/").pop() || "index.html";

  function brandMark() {
    return `<span class="brand-mark"><img src="assets/img/logo.jpeg" alt="Logo Restaurant Zum Netzroller"></span>`;
  }

  function header() {
    const links = NAV.map(
      (n) => `<a href="${n.href}"${n.href === current ? ' class="active"' : ""}>${n.label}</a>`
    ).join("");
    return `
    <div class="topbar">
      <div class="container">
        <span class="tb-hide">Josef-Seib-Straße 7 · 68647 Biblis</span>
        <div class="tb-right">
          <span>Di–So geöffnet</span>
          <a href="tel:${PHONE_TEL}">Tel. ${PHONE}</a>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html">
          ${brandMark()}
          <span>Zum Netzroller<small>Ristorante · Biblis</small></span>
        </a>
        <button class="nav-toggle" aria-label="Menü" aria-expanded="false"><span></span></button>
        <nav class="nav-links">
          ${links}
          <a class="nav-cta" href="reservieren.html">Tisch reservieren</a>
        </nav>
      </div>
    </header>`;
  }

  function footer() {
    const cols = [
      {
        h: "Restaurant",
        items: [
          ["index.html", "Start"],
          ["speisekarte.html", "Speisekarte"],
          ["galerie.html", "Galerie"],
          ["reservieren.html", "Reservieren"],
        ],
      },
      {
        h: "Besuch",
        items: [
          ["kontakt.html", "Kontakt & Anfahrt"],
          ["kontakt.html#oeffnungszeiten", "Öffnungszeiten"],
          ["https://www.instagram.com/restaurant_zum_netzroller", "Instagram"],
        ],
      },
      {
        h: "Rechtliches",
        items: [
          ["impressum.html", "Impressum"],
          ["datenschutz.html", "Datenschutz"],
        ],
      },
    ];
    const colHtml = cols
      .map(
        (c) =>
          `<div><h4>${c.h}</h4><ul>${c.items
            .map((i) => `<li><a href="${i[0]}"${i[0].startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${i[1]}</a></li>`)
            .join("")}</ul></div>`
      )
      .join("");
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">${brandMark()} Zum Netzroller</div>
            <p style="font-size:.92rem;line-height:1.7;">Josef-Seib-Straße 7<br>68647 Biblis</p>
            <p style="font-size:.92rem;"><a href="tel:${PHONE_TEL}">${PHONE}</a><br><a href="mailto:${INQUIRY_EMAIL}">${INQUIRY_EMAIL}</a></p>
          </div>
          ${colHtml}
        </div>
        <div class="footer-bottom">
          <span>© 2026 Restaurant Zum Netzroller · Biblis · Alle Rechte vorbehalten.</span>
          <span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span>
        </div>
      </div>
    </footer>`;
  }

  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = header();
  if (footerMount) footerMount.innerHTML = footer();

  // Mobile toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Scroll-progress bar + back-to-top button
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Nach oben");
  toTop.innerHTML = "↑";
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(toTop);

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
    toTop.classList.toggle("show", h.scrollTop > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight today's row in any opening-hours list (data-day = 0..6, Mon=0)
  const todayIdx = (new Date().getDay() + 6) % 7;
  document.querySelectorAll(".hours li[data-day]").forEach((li) => {
    if (parseInt(li.getAttribute("data-day"), 10) === todayIdx) li.classList.add("today");
  });

  // Animated count-up for hero stats / any .num
  function animateCount(el) {
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+)([.,]\d+)?(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1] + (m[2] ? m[2].replace(",", ".") : ""));
    const decimals = m[2] ? m[2].length - 1 : 0;
    const suffix = m[3] || "";
    const dur = 1100;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(decimals).replace(".", ",");
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll(".hero-stats .num");
  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  // Inquiry / reservation forms -> deliver to INQUIRY_EMAIL via the visitor's mail client
  document.querySelectorAll("form[data-inquiry]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const subject = (form.getAttribute("data-inquiry") || "Anfrage") + " – Zum Netzroller";
      const lines = [];
      data.forEach((val, key) => { if (String(val).trim()) lines.push(key + ": " + val); });
      lines.push("", "— gesendet über die Website restaurant-zum-netzroller");
      const href =
        "mailto:" + INQUIRY_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      const done = form.querySelector(".form-done");
      if (done) done.style.display = "block";
      window.location.href = href;
    });
  });

  document.querySelectorAll("[data-inquiry-link]").forEach((a) => {
    const subj = a.getAttribute("data-inquiry-link") || "Anfrage";
    a.setAttribute("href", "mailto:" + INQUIRY_EMAIL + "?subject=" + encodeURIComponent(subj + " – Zum Netzroller"));
  });

  // Scroll reveal — exposed so content.js can re-observe elements it injects
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12 }
  );
  window.__observeReveal = (el) => io.observe(el);
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
