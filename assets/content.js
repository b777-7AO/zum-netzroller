// Renders CMS-managed content from /content/*.json into the pages.
// Progressive enhancement: the static HTML stays as a fallback; these
// functions only override it once the JSON has loaded successfully.
(function () {
  "use strict";

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  async function load(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  const dotted = (obj, key) =>
    key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  // ── Generic text + image binding ────────────────────────────────
  async function bindTextsAndImages() {
    const [texts, images] = await Promise.all([
      load("content/texts.json"),
      load("content/images.json"),
    ]);

    if (texts) {
      document.querySelectorAll("[data-cms]").forEach((el) => {
        const v = dotted(texts, el.getAttribute("data-cms"));
        if (v != null && v !== "") el.textContent = v;
      });
      document.querySelectorAll("[data-cms-html]").forEach((el) => {
        const v = dotted(texts, el.getAttribute("data-cms-html"));
        if (v != null && v !== "") el.innerHTML = v;
      });
    }

    if (images) {
      document.querySelectorAll("[data-cms-img]").forEach((el) => {
        const v = images[el.getAttribute("data-cms-img")];
        if (v) el.setAttribute("src", v);
      });
      document.querySelectorAll("[data-cms-bg]").forEach((el) => {
        const v = images[el.getAttribute("data-cms-bg")];
        if (v) el.style.setProperty("--ph", `url('${new URL(v, location.href).href}')`);
      });
    }
  }

  // ── Menu (speisekarte.html + homepage preview) ──────────────────
  function menuItemHtml(it) {
    const tag = it.tag ? `<span class="mi-tag">${esc(it.tag)}</span>` : "";
    const price = it.price ? `<span class="mi-price">${esc(it.price)}</span>` : "";
    const desc = it.desc ? `<p class="mi-desc">${esc(it.desc)}</p>` : "";
    return `<div class="menu-item">
        <span class="mi-name">${esc(it.name)} ${tag}</span>
        ${price}
        ${desc}
      </div>`;
  }

  async function renderMenu() {
    const full = document.getElementById("menu-full");
    const preview = document.getElementById("menu-preview");
    if (!full && !preview) return;
    const data = await load("content/menu.json");
    if (!data || !Array.isArray(data.sections) || !data.sections.length) return;

    const slug = (s) => String(s || "").toLowerCase()
      .replace(/[äöü]/g, (c) => ({ "ä": "a", "ö": "o", "ü": "u" }[c]))
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (full) {
      full.innerHTML = data.sections.map((sec) => {
        const items = (sec.items || []).map(menuItemHtml).join("");
        return `<div class="menu-section reveal" id="${slug(sec.anchor || sec.title)}">
            <div class="menu-head"><h2>${esc(sec.title)}</h2></div>
            <div class="menu-list">${items}</div>
            ${sec.note ? `<p class="menu-note">${esc(sec.note)}</p>` : ""}
          </div>`;
      }).join("");
      // re-observe freshly added reveal elements
      if (window.__observeReveal) full.querySelectorAll(".reveal").forEach(window.__observeReveal);
    }

    if (preview) {
      // a curated taste: first two items of the first few sections
      const picks = [];
      data.sections.forEach((sec) => {
        (sec.items || []).slice(0, 2).forEach((it) => picks.push(it));
      });
      preview.innerHTML = picks.slice(0, 6).map(menuItemHtml).join("");
    }
  }

  // ── Reviews (homepage) ──────────────────────────────────────────
  async function renderReviews() {
    const mount = document.getElementById("review-grid");
    if (!mount) return;
    const data = await load("content/reviews.json");
    if (!data || !Array.isArray(data.items) || !data.items.length) return;
    mount.innerHTML = data.items.map((r) => {
      const stars = "★".repeat(Math.round(r.stars || 5)) + "☆".repeat(5 - Math.round(r.stars || 5));
      const initials = (r.name || "?").trim().charAt(0).toUpperCase();
      return `<div class="review reveal">
          <div class="stars">${stars}</div>
          <p>„${esc(r.text)}“</p>
          <div class="who">
            <span class="av">${esc(initials)}</span>
            <span><span class="nm">${esc(r.name)}</span><br><span class="src">${esc(r.source || "Google")}</span></span>
          </div>
        </div>`;
    }).join("");
    if (window.__observeReveal) mount.querySelectorAll(".reveal").forEach(window.__observeReveal);
  }

  bindTextsAndImages();
  renderMenu();
  renderReviews();
})();
