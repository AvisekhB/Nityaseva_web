/* =========================================================
   NITYASEVA — main.js
   EDIT THIS BLOCK to change your contact details and prices.
   ========================================================= */
const CONFIG = {
  phone:     "+91 00000 00000",          // shown on the page
  whatsapp:  "",                          // digits only with country code, e.g. "919876543210". Leave "" to use email instead.
  email:     "hello@example.com",
  address:   "Your address, City, State, India",
  hours:     "Monday to Saturday, 9 am to 7 pm",
  prices: {                               // e.g. "₹999 / month". Leave "" to keep "Ask for a quote".
    essential: "",
    complete:  "",
    family:    ""
  }
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
  document.querySelectorAll("[data-price]").forEach(el => {
    const p = CONFIG.prices[el.dataset.price];
    if (p) el.textContent = p;
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

/* ---------- Plan buttons pre-select the plan in the form ---------- */
document.querySelectorAll("[data-plan]").forEach(a => {
  a.addEventListener("click", () => {
    const sel = document.getElementById("plan");
    if (sel) sel.value = a.dataset.plan;
  });
});

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
      "Care is for: " + f.who.value,
      "Plan: " + f.plan.value
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
