document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".year").innerText = new Date().getFullYear();

  displayHomeCards();
  displayApps(mobileApps, "mobile-apps-grid");
  displayApps(webApps, "web-apps-grid");
  displayStages();
  displayServices();
  displayTestimonials();
  displayCapabilities();
  displayFaqs();

  initTheme();
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("theme-toggle-mobile").addEventListener("click", toggleTheme);

  document.getElementById("rail-toggle").addEventListener("click", toggleRail);
  document.querySelectorAll(".rail__link, .tabbar a").forEach((link) => {
    link.addEventListener("click", closeRail);
  });

  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitContactForm();
  });
});

const displayHomeCards = () => {
  const grid = document.getElementById("bento-grid");
  grid.innerHTML = "";

  homeCards.forEach((card) => {
    const a = document.createElement("a");
    a.classList.add("bento-card");
    a.href = card.href;
    a.innerHTML = `
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
      <span class="bento-card__arrow">&#8599;</span>
    `;
    grid.appendChild(a);
  });
};

const displayApps = (list, targetId) => {
  const grid = document.getElementById(targetId);
  grid.innerHTML = "";

  list.forEach((app) => {
    const card = document.createElement("div");
    card.classList.add("card", "app-card");
    card.style.setProperty("--app-color", app.accentColor);

    const statsHtml = app.stats
      .map((s) => `<span class="app-card__stat"><strong>${s.value}</strong>${s.label}</span>`)
      .join("");

    card.innerHTML = `
      <span class="app-card__badge">${app.badge}</span>
      <h3>${app.name}</h3>
      <p class="app-card__tagline">${app.tagline}</p>
      <p>${app.description}</p>
      <div class="app-card__stats">${statsHtml}</div>
    `;
    grid.appendChild(card);
  });
};

const displayStages = () => {
  const list = document.getElementById("stages-list");
  list.innerHTML = "";

  stages.forEach((stage) => {
    const li = document.createElement("li");
    li.classList.add("stage");
    const chipsHtml = stage.chips.map((c) => `<span class="stage__chip">${c}</span>`).join("");
    li.innerHTML = `
      <span class="stage__index">${stage.index}</span>
      <h3>${stage.label}.</h3>
      <p>${stage.body}</p>
      <div class="stage__chips">${chipsHtml}</div>
    `;
    list.appendChild(li);
  });
};

const displayServices = () => {
  const grid = document.getElementById("services-grid");
  grid.innerHTML = "";

  services.forEach((service) => {
    const card = document.createElement("div");
    card.classList.add("card", "service-card");
    const bulletsHtml = service.bullets.map((b) => `<li>${b}</li>`).join("");
    card.innerHTML = `
      <span class="service-card__index">${service.index} / 05</span>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <span class="stage__chip">${service.chip}</span>
      <ul class="service-card__bullets">${bulletsHtml}</ul>
    `;
    grid.appendChild(card);
  });
};

const displayTestimonials = () => {
  const grid = document.getElementById("testimonials-grid");
  grid.innerHTML = "";

  testimonials.forEach((client) => {
    const card = document.createElement("div");
    card.classList.add("card", "testimonial-card");
    const tagsHtml = client.work.map((w) => `<span class="tag">${w}</span>`).join("");
    card.innerHTML = `
      <span class="stage__index">${client.index}</span>
      <h3>${client.name}</h3>
      <p class="testimonial-card__role">${client.role}</p>
      <p>${client.daily}</p>
      <div class="tag-row">${tagsHtml}</div>
    `;
    grid.appendChild(card);
  });
};

const displayCapabilities = () => {
  const list = document.getElementById("caps-list");
  list.innerHTML = "";

  capabilities.forEach((cap) => {
    const li = document.createElement("li");
    li.classList.add("cap");
    li.innerHTML = `
      <span class="cap__title">${cap.title}</span>
      <span class="cap__index">${cap.index}</span>
    `;
    list.appendChild(li);
  });
};

const displayFaqs = () => {
  const list = document.getElementById("faq-list");
  list.innerHTML = "";

  faqs.forEach((faq, i) => {
    const li = document.createElement("li");
    li.classList.add("faq-item");
    if (i === 0) li.classList.add("open");
    li.innerHTML = `
      <button type="button" class="faq-item__q">
        <span>${faq.q}</span>
        <span class="faq-item__caret">&#9662;</span>
      </button>
      <p class="faq-item__a">${faq.a}</p>
    `;
    li.querySelector(".faq-item__q").addEventListener("click", () => {
      const wasOpen = li.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach((item) => item.classList.remove("open"));
      if (!wasOpen) li.classList.add("open");
    });
    list.appendChild(li);
  });
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
};

const toggleTheme = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
};

const toggleRail = () => {
  const rail = document.getElementById("rail");
  const toggle = document.getElementById("rail-toggle");
  const isOpen = rail.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
};

const closeRail = () => {
  document.getElementById("rail").classList.remove("open");
  document.getElementById("rail-toggle").setAttribute("aria-expanded", "false");
};

const submitContactForm = () => {
  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const message = document.getElementById("cf-message").value;
  const status = document.getElementById("contact-status");

  // Same fallback as the original template: no backend wired yet, so this
  // opens the visitor's mail client with the message laid out.
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

  status.innerText = "Opening your email client…";
  document.getElementById("contact-form").reset();
};
