// Mobile menu
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when clicking a link (mobile)
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Reveal animations
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Stats counters
function animateNumber(el, target, duration = 800) {
  let start = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const interval = Math.floor(duration / (target / step));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = String(start);
  }, Math.max(12, interval));
}

const s1 = document.getElementById("stat1");
const s2 = document.getElementById("stat2");
const s3 = document.getElementById("stat3");
if (s1 && s2 && s3) {
  animateNumber(s1, 3);
  animateNumber(s2, 1);
  animateNumber(s3, 4);
}

// Contact form demo submit (no backend)
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("name")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const msg = document.getElementById("message")?.value?.trim();

  if (!name || !email || !msg) {
    alert("Please fill all fields.");
    return false;
  }

  alert("Message sent! (Demo form)\nWe can add a real backend later.");
  e.target.reset();
  return false;
}
window.handleSubmit = handleSubmit;

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Certificate modal preview
const certModal = document.getElementById("certModal");
const certTitle = document.getElementById("certTitle");
const certFrame = document.getElementById("certFrame");
const certDownload = document.getElementById("certDownload");

function openCert(btn){
  const title = btn.getAttribute("data-cert-title") || "Certificate";
  const src = btn.getAttribute("data-cert-src");

  if (!src) return;

  certTitle.textContent = title;

  // Add #toolbar=0 for a cleaner PDF view (works in many browsers)
  certFrame.src = src + "#toolbar=0";

  certDownload.href = src;

  certModal.classList.add("show");
  certModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCert(){
  certModal.classList.remove("show");
  certModal.setAttribute("aria-hidden", "true");
  certFrame.src = ""; // stop loading
  document.body.style.overflow = "";
}

// Close modal on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && certModal.classList.contains("show")) closeCert();
});

// expose to HTML onclick
window.openCert = openCert;
window.closeCert = closeCert;

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a.nav-link");

function setActiveLink() {
  let current = "home";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
  });
}

window.addEventListener("scroll", setActiveLink);
setActiveLink();

// ==============================
// Fetch GitHub Projects
// ==============================

const githubUsername = "Suraj-Singh-Pal"; // your GitHub username
const projectsContainer = document.getElementById("github-projects");

fetch(`https://api.github.com/users/${githubUsername}/repos`)
  .then(response => response.json())
  .then(data => {

    // Optional: sort by latest updated
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    data.forEach(repo => {

      // Skip forks if you want
      if (repo.fork) return;

      const projectCard = document.createElement("div");
      projectCard.classList.add("project-card");

      let liveDemoButton = "";

if (repo.homepage && repo.homepage !== "") {
  liveDemoButton = `
    <a href="${repo.homepage}" target="_blank" class="btn live-btn">
      Live Demo
    </a>
  `;
}

projectCard.innerHTML = `
  <h3>${repo.name}</h3>
  <p>${repo.description ? repo.description : "No description provided."}</p>

  <div class="project-buttons">
    <a href="${repo.html_url}" target="_blank" class="btn">
      View Code
    </a>
    ${liveDemoButton}
  </div>
`;

      projectsContainer.appendChild(projectCard);
    });
  })
  .catch(error => {
    console.error("Error fetching GitHub repos:", error);
  });

// EmailJS Contact Form (no backend)
(function () {
  emailjs.init("YOUR_PUBLIC_KEY"); // <-- replace
})();



const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    const oldText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;
    formNote.textContent = "";

    try {
      const formData = new FormData(form);
      const res = await fetch(window.location.pathname, {
  method: "POST",
  body: formData,
});

      if (res.ok) {
        form.reset();
        formNote.textContent = "✅ Message sent successfully! I will get back to you soon.";
      } else {
        formNote.textContent = "❌ Failed to send. Please try again or email me directly.";
      }
    } catch (err) {
      formNote.textContent = "❌ Network error. Please try again later.";
    } finally {
      btn.textContent = oldText;
      btn.disabled = false;
    }
  });
}