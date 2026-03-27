// ============================================================
// Configuration
// ============================================================

const CONFIG = {
  headerOffset: 80,
  scrollThreshold: 100,
  scrollToTopThreshold: 300,
  formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID", // Replace with your Formspree form ID from https://formspree.io
  rateLimit: {
    maxSubmissions: 3,
    timeWindow: 300000, // 5 minutes in ms
  },
};

// ============================================================
// DOM References
// ============================================================

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const contactForm = document.getElementById("kontaktskjema");

let scrollToTopBtn;

// ============================================================
// Utility Functions
// ============================================================

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Enhanced form validation
function validateForm({ navn, epost, emne, melding }) {
  if (!navn || navn.trim().length < 2) {
    return {
      isValid: false,
      message: "Navn må være minst 2 tegn langt.",
      field: "navn",
    };
  }

  if (!epost || !isValidEmail(epost)) {
    return {
      isValid: false,
      message: "Vennligst skriv inn en gyldig e-postadresse.",
      field: "epost",
    };
  }

  if (!emne || emne.trim().length < 3) {
    return {
      isValid: false,
      message: "Emne må være minst 3 tegn langt.",
      field: "emne",
    };
  }

  if (!melding || melding.trim().length < 10) {
    return {
      isValid: false,
      message: "Melding må være minst 10 tegn lang.",
      field: "melding",
    };
  }

  return { isValid: true };
}

// Show form message
function showMessage(message, type) {
  // Remove any existing message
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageEl = document.createElement("div");
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = message;
  contactForm.appendChild(messageEl);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.remove();
    }
  }, 5000);
}

// Security: Rate limiting for form submissions
const formSubmissionTracker = {
  submissions: [],
  maxSubmissions: CONFIG.rateLimit.maxSubmissions,
  timeWindow: CONFIG.rateLimit.timeWindow,

  canSubmit() {
    const now = Date.now();
    // Remove old submissions outside time window
    this.submissions = this.submissions.filter((time) => now - time < this.timeWindow);

    if (this.submissions.length >= this.maxSubmissions) {
      return false;
    }

    this.submissions.push(now);
    return true;
  },

  getTimeUntilNextSubmission() {
    if (this.submissions.length === 0) {
      return 0;
    }
    const oldestSubmission = Math.min(...this.submissions);
    const timeLeft = this.timeWindow - (Date.now() - oldestSubmission);
    return Math.max(0, Math.ceil(timeLeft / 1000 / 60)); // minutes
  },
};

// ============================================================
// Feature Functions
// ============================================================

// --- Mobile Navigation ---

function toggleMobileMenu(open) {
  const isOpen = open !== undefined ? open : !hamburger.classList.contains("active");
  hamburger.classList.toggle("active", isOpen);
  navMenu.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
}

hamburger.addEventListener("click", () => toggleMobileMenu());

hamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleMobileMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    toggleMobileMenu(false);
    this.blur();
  });
});

// --- Dropdown Menu ---

const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
const dropdownMenu = document.querySelector(".nav-dropdown-menu");

if (dropdown && dropdownToggle && dropdownMenu) {
  // Toggle dropdown on click
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  // Close dropdown when clicking on dropdown links
  const dropdownLinks = document.querySelectorAll(".nav-dropdown-link");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function () {
      dropdown.classList.remove("active");
      this.blur();
    });
  });

  // Handle hover for desktop
  dropdown.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      dropdown.classList.add("active");
    }
  });

  dropdown.addEventListener("mouseleave", () => {
    if (window.innerWidth > 768) {
      dropdown.classList.remove("active");
    }
  });
}

// --- Smooth Scrolling ---

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - CONFIG.headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    this.blur();
  });
});

// --- Scroll To Top ---

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initScrollToTopButton() {
  scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "↑";
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.setAttribute("aria-label", "Gå til toppen");
  scrollToTopBtn.addEventListener("click", scrollToTop);
  document.body.appendChild(scrollToTopBtn);
}

// --- Fade-in Animations ---

function initFadeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll(".service-card, .portfolio-item, .team-member");
  fadeElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
}

// --- Contact Form ---

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check rate limiting first
    if (!formSubmissionTracker.canSubmit()) {
      const timeLeft = formSubmissionTracker.getTimeUntilNextSubmission();
      showMessage(`For mange forsøk. Vent ${timeLeft} minutter før du prøver igjen.`, "error");
      return;
    }

    // Get form data
    const formData = new FormData(this);
    const navn = formData.get("navn");
    const epost = formData.get("epost");
    const emne = formData.get("emne");
    const melding = formData.get("melding");

    // Validate fields
    const validationResult = validateForm({ navn, epost, emne, melding });

    if (!validationResult.isValid) {
      showMessage(validationResult.message, "error");
      // Focus on the first invalid field
      if (validationResult.field) {
        const field = document.getElementById(validationResult.field);
        if (field) {
          field.focus();
          field.classList.add("error");
          setTimeout(() => field.classList.remove("error"), 3000);
        }
      }
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sender...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(CONFIG.formspreeEndpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        showMessage("Takk for din henvendelse! Vi kommer tilbake til deg så snart som mulig.", "success");
        contactForm.reset();
      } else {
        const data = await response.json();
        const msg = data.errors ? data.errors.map((e) => e.message).join(", ") : "Det oppstod en feil.";
        showMessage(`${msg} Send gjerne e-post direkte til post@synkope.io`, "error");
      }
    } catch {
      showMessage("Kunne ikke sende meldingen. Send gjerne e-post direkte til post@synkope.io", "error");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ============================================================
// Scroll Handler Functions
// ============================================================

function updateNavbar() {
  if (window.scrollY > CONFIG.scrollThreshold) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function updateActiveNavLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.clientHeight;
    if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function updateScrollToTopButton() {
  if (!scrollToTopBtn) {
    return;
  }
  if (window.scrollY > CONFIG.scrollToTopThreshold) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
}

function updateParallax() {
  const heroImage = document.querySelector(".hero-placeholder");
  if (heroImage) {
    heroImage.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
}

function handleScroll() {
  updateNavbar();
  updateActiveNavLink();
  updateScrollToTopButton();
  updateParallax();
}

// ============================================================
// Initialisation
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initScrollToTopButton();
  initFadeAnimations();
});

// ============================================================
// Single RAF-throttled Scroll Listener
// ============================================================

let scrollRAF = false;
window.addEventListener("scroll", () => {
  if (!scrollRAF) {
    scrollRAF = true;
    requestAnimationFrame(() => {
      handleScroll();
      scrollRAF = false;
    });
  }
});
