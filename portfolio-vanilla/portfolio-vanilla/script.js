document.addEventListener("DOMContentLoaded", () => {
  displayStats();
  displaySkills();
  displayProjects();
  displayServices();
  displayTestimonials();
  displaySocials();
  document.getElementById("year").innerText = new Date().getFullYear();

  document.getElementById("nav-toggle").addEventListener("click", () => {
    toggleNav();
  });

  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitContactForm();
  });
});

const displayStats = () => {
  document.getElementById("stat-projects").innerText = profile.projectsCount;
  document.getElementById("stat-years").innerText = profile.yearsCount;
};

const displaySkills = () => {
  const bentoGrid = document.getElementById("bento-grid");
  bentoGrid.innerHTML = "";

  skills.forEach((skill) => {
    const card = document.createElement("div");
    card.classList.add("bento-card");
    card.innerHTML = `
      <h3>${skill.title}</h3>
      <p>${skill.detail}</p>
    `;
    bentoGrid.appendChild(card);
  });
};

const displayProjects = () => {
  const projectsGrid = document.getElementById("projects-grid");
  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("a");
    card.classList.add("card", "project-card");
    card.href = project.link;

    const tagsHtml = project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tag-row">${tagsHtml}</div>
    `;
    projectsGrid.appendChild(card);
  });
};

const displayServices = () => {
  const servicesGrid = document.getElementById("services-grid");
  servicesGrid.innerHTML = "";

  services.forEach((service) => {
    const card = document.createElement("div");
    card.classList.add("card", "service-card");
    card.innerHTML = `
      <h3>${service.title}</h3>
      <p>${service.detail}</p>
    `;
    servicesGrid.appendChild(card);
  });
};

const displayTestimonials = () => {
  const testimonialsGrid = document.getElementById("testimonials-grid");
  testimonialsGrid.innerHTML = "";

  testimonials.forEach((testimonial) => {
    const card = document.createElement("div");
    card.classList.add("card", "testimonial-card");
    card.innerHTML = `
      <p class="quote">&ldquo;${testimonial.quote}&rdquo;</p>
      <p class="author">${testimonial.author}</p>
    `;
    testimonialsGrid.appendChild(card);
  });
};

const displaySocials = () => {
  const contactList = document.getElementById("contact-list");
  const footerSocials = document.getElementById("footer-socials");
  contactList.innerHTML = "";
  footerSocials.innerHTML = "";

  profile.socials.forEach((social) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${social.href}">${social.label}</a>`;
    contactList.appendChild(li);

    const link = document.createElement("a");
    link.href = social.href;
    link.innerText = social.label;
    footerSocials.appendChild(link);
  });
};

const toggleNav = () => {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
};

const submitContactForm = () => {
  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const message = document.getElementById("cf-message").value;
  const status = document.getElementById("contact-status");

  // PLACEHOLDER: this form has no backend. Point it at your own
  // endpoint, or swap this block for a mailto: link.
  console.log({ name, email, message });

  status.innerText = "Thanks! Your message has been noted (connect a backend to actually send it).";
  document.getElementById("contact-form").reset();
};
