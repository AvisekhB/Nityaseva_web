/* =========================================================
   NITYASEVA — main.js
   EDIT THIS BLOCK to change your contact details.
   ========================================================= */
const CONFIG = {
  phone:     "+91 00000 00000",          // shown on the page
  whatsapp:  "",                          // digits only with country code, e.g. "919876543210". Leave "" to use email instead.
  email:     "hello@example.com",
  address:   "Asansol, West Bengal",
  hours:     "Monday to Saturday, 9 am to 7 pm"
};

/* ---------- Fill in contact details ---------- */
(function applyConfig() {
  const digits = CONFIG.phone.replace(/[^\d+]/g, "");
  document.querySelectorAll("[data-phone]").forEach(el => {
    el.textContent = CONFIG.phone;
    el.setAttribute("href", "tel:" + digits);
  });
  document.querySelectorAll("[data-email]").forEach(el => {
    el.textContent = CONFIG.email;
    el.setAttribute("href", "mailto:" + CONFIG.email);
  });
  document.querySelectorAll("[data-address]").forEach(el => el.textContent = CONFIG.address);
  document.querySelectorAll("[data-hours]").forEach(el => el.textContent = CONFIG.hours);
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- Mobile menu ---------- */
(function menu() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  const close = () => {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
  };
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();

/* ---------- Contact form ----------
   GitHub Pages is a static host, so the form opens WhatsApp (if you set a number)
   or the visitor's email app with the details filled in.
   To receive submissions silently instead, connect a service such as Formspree. */
(function form() {
  const f = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    status.className = "form-status";
    const name  = f.name.value.trim();
    const phone = f.phone.value.trim();

    f.name.classList.toggle("invalid", !name);
    f.phone.classList.toggle("invalid", !phone);
    if (!name || !phone) {
      status.textContent = "Please add your name and phone number so we can call you back.";
      status.classList.add("error");
      return;
    }

    const lines = [
      "Hello Nityaseva, I would like a call back.",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Relationship to senior: " + f.who.value,
      "City: " + (f.city.value.trim() || "-"),
      "Biggest worry: " + f.concern.value
    ];
    const note = f.message.value.trim();
    if (note) lines.push("Note: " + note);
    const text = lines.join("\n");

    if (CONFIG.whatsapp) {
      window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    } else {
      window.location.href = "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent("Call back request from " + name) +
        "&body=" + encodeURIComponent(text);
    }
    status.textContent = "Thank you. Your message is ready to send in the app that just opened.";
    f.reset();
  });
})();

/* ---------- How it works: stepper ---------- */
(function stepper() {
  const tabs   = Array.from(document.querySelectorAll('.hiw-tabs [role="tab"]'));
  const panels = Array.from(document.querySelectorAll('.hiw-panels [role="tabpanel"]'));
  const bars   = Array.from(document.querySelectorAll('.progress i'));
  const prev   = document.getElementById("hiw-prev");
  const next   = document.getElementById("hiw-next");
  const count  = document.getElementById("hiw-count");
  if (!tabs.length) return;
  let current = 0;

  function show(i, focus) {
    current = Math.max(0, Math.min(tabs.length - 1, i));
    tabs.forEach((t, n) => {
      const on = n === current;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
      bars[n].classList.toggle("on", n <= current);
    });
    count.textContent = "Step " + (current + 1) + " of " + tabs.length;
    prev.disabled = current === 0;
    next.textContent = current === tabs.length - 1 ? "Get started" : "Next step";
    if (focus) tabs[current].focus();
  }

  tabs.forEach((t, n) => {
    t.addEventListener("click", () => show(n));
    t.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show(n + 1, true); }
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  { e.preventDefault(); show(n - 1, true); }
      if (e.key === "Home") { e.preventDefault(); show(0, true); }
      if (e.key === "End")  { e.preventDefault(); show(tabs.length - 1, true); }
    });
  });
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => {
    if (current === tabs.length - 1) { window.location.hash = "#contact"; }
    else show(current + 1);
  });
  show(0);
})();

/* ---------- "Made for you" persona tabs ---------- */
(function personas() {
  const tabs   = Array.from(document.querySelectorAll('.persona-tags [role="tab"]'));
  const panels = Array.from(document.querySelectorAll('.persona-panel'));
  if (!tabs.length) return;

  function show(i, focus) {
    const n = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      t.setAttribute("aria-selected", String(k === n));
      t.tabIndex = k === n ? 0 : -1;
      panels[k].hidden = k !== n;
    });
    if (focus) tabs[n].focus();
  }
  tabs.forEach((t, k) => {
    t.addEventListener("click", () => show(k));
    t.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); show(k + 1, true); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); show(k - 1, true); }
    });
  });
})();
