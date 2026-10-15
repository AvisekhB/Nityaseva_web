/* =========================================================
   NITYASEVA — main.js
   EDIT THIS BLOCK to change your contact details.
   ========================================================= */
const CONFIG = {
  phone:     "+91 92392 58921",           // shown on the page
  whatsapp:  "919239258921",              // digits only with country code, e.g. "919876543210". Leave "" to use email instead.
  email:     "hello@nityaseva.in",        // replace with your real inbox
  instagram: "https://instagram.com/nityaseva.you",
  address:   "Asansol & Burnpur, West Bengal",
  hours:     "Monday to Saturday, 9 am to 7 pm",

  // Paste your deployed Google Apps Script Web App URL here (see
  // google-sheet-apps-script/README-DEPLOY.md). Leave "" to disable
  // Google Sheet logging — the form will still open WhatsApp/email.
  sheetWebAppUrl: "https://script.google.com/macros/s/AKfycbwRhb5bweJy2iDp0djWmubA-H3Mtgt_sJUJHfASYCVAeBBBWVLzrwEfiSvqu8sqKWnQBQ/exec"
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
  document.querySelectorAll("[data-instagram]").forEach(el => el.setAttribute("href", CONFIG.instagram));
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => {
    if (CONFIG.whatsapp) el.setAttribute("href", "https://wa.me/" + CONFIG.whatsapp);
  });
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
   Every submission is logged to a Google Sheet via Apps Script (set
   CONFIG.sheetWebAppUrl above — see google-sheet-apps-script/README-DEPLOY.md).
   The form also opens WhatsApp (if you set a number) or the visitor's email
   app, so you get an instant human-readable copy as well as the sheet row. */
(function form() {
  const f = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!f) return;

  const submitBtn = f.querySelector('button[type="submit"]');

  function isValidEmail(value) {
    return value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function logToSheet(data) {
    if (!CONFIG.sheetWebAppUrl) return;
    const body = new URLSearchParams(data);
    // Apps Script web apps don't return CORS headers to a cross-origin
    // fetch, so the response is opaque. "no-cors" still delivers the
    // request and appends the row; we just can't read a response back.
    await fetch(CONFIG.sheetWebAppUrl, { method: "POST", mode: "no-cors", body });
  }

  f.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form-status";
    const seniorName   = f.senior_name.value.trim();
    const age          = f.age.value.trim();
    const contactName  = f.contact_name.value.trim();
    const contactPhone = f.contact_phone.value.trim();
    const email        = f.email.value.trim();

    f.senior_name.classList.toggle("invalid", !seniorName);
    f.contact_name.classList.toggle("invalid", !contactName);
    f.contact_phone.classList.toggle("invalid", !contactPhone);
    f.email.classList.toggle("invalid", !isValidEmail(email));
    if (!seniorName || !contactName || !contactPhone) {
      status.textContent = "Please add the senior's name, the contact person's name and phone number so we can call you back.";
      status.classList.add("error");
      return;
    }
    if (!isValidEmail(email)) {
      status.textContent = "That email address doesn't look right. You can leave it blank if you prefer.";
      status.classList.add("error");
      return;
    }

    const who             = f.who.value;
    const contactRelation = f.contact_relation.value.trim() || "-";
    const city            = f.city.value.trim() || "-";
    const concern         = f.concern.value;
    const note            = f.message.value.trim();

    if (submitBtn) submitBtn.disabled = true;
    status.textContent = "Sending...";

    try {
      await logToSheet({
        timestamp: new Date().toISOString(),
        senior_name: seniorName,
        age: age,
        relationship: who,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_relation: contactRelation,
        email: email,
        city: city,
        concern: concern,
        message: note,
        source: "website-contact-form"
      });
    } catch (err) {
      // Sheet logging failed (offline, URL not set, etc.) — still let the
      // visitor send the WhatsApp/email handoff below so no lead is lost.
      console.warn("Nityaseva: could not log to Google Sheet", err);
    }

    const lines = [
      "Hello Nityaseva, I would like a call back.",
      "",
      "Name of senior: " + seniorName,
      "Age: " + (age || "-"),
      "My relationship to the senior: " + who,
      "Contact person: " + contactName,
      "Contact person's phone: " + contactPhone,
      "Relationship with contact person: " + contactRelation,
      "Email: " + (email || "-"),
      "City: " + city,
      "Biggest worry: " + concern
    ];
    if (note) lines.push("Note: " + note);
    const text = lines.join("\n");

    if (CONFIG.whatsapp) {
      window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    } else {
      window.location.href = "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent("Call back request for " + seniorName) +
        "&body=" + encodeURIComponent(text);
    }
    status.textContent = "Thank you. We've received your details and a message is ready to send in the app that just opened.";
    status.classList.add("success");
    f.reset();
    if (submitBtn) submitBtn.disabled = false;
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
