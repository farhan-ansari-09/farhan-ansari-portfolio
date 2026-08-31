/* global anime */

import { useEffect } from "react";
import "./portfolio.css";
import profileImage from "./assets/My image.jpg";
import nestoImage from "./assets/homepage.png";
import unionsysImage from "./assets/unionsys.png";
import { SiRedis, SiCelery, SiJsonwebtokens } from "react-icons/si";

import {
  // SiOpenai,
  SiClaude,
  SiGooglegemini,
  SiPerplexity,
  SiGithubcopilot,
  SiCursor,
  SiVercel,
  SiRailway,
  SiRender,
  SiHostinger,
  SiCloudinary,
} from "react-icons/si";

const AppState = {
  currentLang: "en",
  currentTheme: "dark",
  currentSection: "home",
  isMenuOpen: false,
  isLoaded: false,
};

function initializeApp() {
  loadPreferences();
  initLanguage();
  initTheme();
  initNavigation();
  initScrollEffects();
  initFormHandlers();
  initMobileMenu();
  
  updateThemeUI();
  AppState.isLoaded = true;
}

function loadPreferences() {
  const savedLang = localStorage.getItem("portfolio-lang");
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedLang) AppState.currentLang = savedLang;
  if (savedTheme) AppState.currentTheme = savedTheme;
}

function initLanguage() {
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", toggleLanguage);
  }
  setLanguage(AppState.currentLang);
}

function toggleLanguage() {
  const newLang = AppState.currentLang === "en" ? "ar" : "en";
  setLanguage(newLang);
  localStorage.setItem("portfolio-lang", newLang);
}

function setLanguage(lang) {
  AppState.currentLang = lang;
  const html = document.documentElement;
  const body = document.body;

  if (lang === "ar") {
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
    body.setAttribute("data-lang", "ar");
    body.setAttribute("data-dir", "rtl");
  } else {
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    body.setAttribute("data-lang", "en");
    body.setAttribute("data-dir", "ltr");
  }
  updateLanguageUI();
}

function updateLanguageUI() {
  const textElements = document.querySelectorAll(
    "[data-text-en], [data-text-ar]",
  );
  textElements.forEach((element) => {
    const enText = element.getAttribute("data-text-en");
    const arText = element.getAttribute("data-text-ar");
    if (AppState.currentLang === "ar" && arText) {
      element.textContent = arText;
    } else if (AppState.currentLang === "en" && enText) {
      element.textContent = enText;
    }
  });

  const placeholderElements = document.querySelectorAll(
    "[data-placeholder-en], [data-placeholder-ar]",
  );
  placeholderElements.forEach((element) => {
    const enPlaceholder = element.getAttribute("data-placeholder-en");
    const arPlaceholder = element.getAttribute("data-placeholder-ar");
    if (AppState.currentLang === "ar" && arPlaceholder) {
      element.setAttribute("placeholder", arPlaceholder);
    } else if (AppState.currentLang === "en" && enPlaceholder) {
      element.setAttribute("placeholder", enPlaceholder);
    }
  });

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    const langText = langToggle.querySelector(".lang-text");
    if (langText) {
      langText.textContent = AppState.currentLang === "en" ? "AR" : "EN";
    }
  }
}

function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
  setTheme(AppState.currentTheme);
}

function toggleTheme() {
  const newTheme = AppState.currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  localStorage.setItem("portfolio-theme", newTheme);
}

function setTheme(theme) {
  AppState.currentTheme = theme;
  document.body.setAttribute("data-theme", theme);
  updateThemeUI();
}

function updateThemeUI() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className =
        AppState.currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight =
          document.querySelector(".main-header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        updateActiveNavLink(link);
        if (AppState.isMenuOpen) {
          toggleMobileMenu();
        }
      }
    });
  });

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("scroll", updateHeaderOnScroll);
}

function handleScroll() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      AppState.currentSection = sectionId;
      updateActiveNavLink(null, sectionId);
    }
  });
}

function updateActiveNavLink(clickedLink, sectionId = null) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (clickedLink && link === clickedLink) {
      link.classList.add("active");
    } else if (sectionId) {
      const linkSection = link.getAttribute("data-section");
      if (linkSection === sectionId) {
        link.classList.add("active");
      }
    }
  });
}

function updateHeaderOnScroll() {
  const header = document.querySelector(".main-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((element) => observer.observe(element));

  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => observer.observe(section));
}

function initFormHandlers() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  console.log("Form submitted:", data);

  const message =
    AppState.currentLang === "ar"
      ? "تم إرسال الرسالة بنجاح!"
      : "Message sent successfully!";

  alert(message);
  e.target.reset();
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  document.addEventListener("click", (e) => {
    const navMenu = document.getElementById("navMenu");
    const menuToggle = document.getElementById("menuToggle");

    if (
      AppState.isMenuOpen &&
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      toggleMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  AppState.isMenuOpen = !AppState.isMenuOpen;
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");

  if (navMenu) {
    navMenu.classList.toggle("active", AppState.isMenuOpen);
  }

  if (menuToggle) {
    menuToggle.classList.toggle("active", AppState.isMenuOpen);
  }
}

function generateParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  const codeSymbols = [
    "{",
    "}",
    "[",
    "]",
    "(",
    ")",
    "<",
    ">",
    "/",
    "*",
    "=",
    "+",
    "-",
    ";",
    ":",
    "&",
    "|",
    "%",
    "$",
    "#",
    "@",
  ];
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.textContent =
      codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = 10 + Math.random() * 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

//--------------animations.js-----------------
function inView(element, callback, options = {}) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold: options.amount || 0.1,
      rootMargin: options.rootMargin || "0px",
    },
  );
  observer.observe(element);
  return () => observer.unobserve(element);
}

function animateElement(element, props, options = {}) {
  if (typeof anime === "undefined") return;
  const animeProps = {};
  if (props.opacity) animeProps.opacity = props.opacity;
  if (props.x !== undefined) animeProps.translateX = props.x;
  if (props.y !== undefined) animeProps.translateY = props.y;
  if (props.scale) animeProps.scale = props.scale;
  return anime({
    targets: element,
    ...animeProps,
    duration: (options.duration || 0.8) * 1000,
    delay: (options.delay || 0) * 1000,
    easing: options.easing || "easeOutExpo",
  });
}

function initLoaderAnimation() {
  const loader = document.getElementById("loader");
  const loaderPercent = document.getElementById("loaderPercent");
  if (!loader || !loaderPercent) return;

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        if (typeof anime !== "undefined") {
          anime({
            targets: loader,
            opacity: [1, 0],
            duration: 500,
            easing: "easeInOutQuad",
            complete: () => {
              loader.classList.add("hidden");
              initPageAnimations();
            },
          });
        } else {
          loader.classList.add("hidden");
          initPageAnimations();
        }
      }, 300);
    }
    if (loaderPercent) {
      loaderPercent.textContent = Math.floor(progress) + "%";
    }
  }, 100);
}

function initPageAnimations() {
  setTimeout(() => {
    initHeroAnimations();
    initSkillAnimations();
    initTimelineAnimations();
    initProjectAnimations();
    initScrollAnimations();
    initContactAnimations();
    animateStats();
    initParallax();
    initSmoothScroll();
  }, 300);
}

function initHeroAnimations() {
  if (typeof anime === "undefined") return;

  const heroName = document.getElementById("heroName");
  if (heroName) {
    const nameValue = heroName.querySelector(".name-value");
    if (nameValue) {
      const originalText = nameValue.textContent;
      nameValue.textContent = "";
      anime({
        targets: { value: 0 },
        value: originalText.length,
        duration: 1500,
        delay: 500,
        easing: "easeInOutQuad",
        update: function (anim) {
          const length = Math.floor(anim.animatables[0].target.value);
          nameValue.textContent = originalText.substring(0, length);
        },
        complete: () => {
          const cursor = document.createElement("span");
          cursor.className = "name-cursor";
          cursor.textContent = "|";
          cursor.style.animation = "blink 1s infinite";
          nameValue.appendChild(cursor);
          setTimeout(() => cursor.remove(), 2000);
        },
      });
    }
  }

  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    anime({
      targets: heroTitle,
      opacity: [0, 1],
      translateX: [-30, 0],
      delay: 800,
      duration: 1000,
      easing: "easeOutExpo",
    });
  }

  const heroDescription = document.querySelector(".hero-description");
  if (heroDescription) {
    anime({
      targets: heroDescription,
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 1200,
      duration: 1000,
      easing: "easeOutExpo",
    });
  }

  const heroButtons = document.querySelectorAll(".hero-buttons .btn");
  if (heroButtons.length > 0) {
    anime({
      targets: heroButtons,
      opacity: [0, 1],
      scale: [0.8, 1],
      delay: anime.stagger(100, { start: 1500 }),
      duration: 800,
      easing: "easeOutBack",
    });
  }

  const socialIcons = document.querySelectorAll(".hero-social .social-icon");
  if (socialIcons.length > 0) {
    anime({
      targets: socialIcons,
      opacity: [0, 1],
      scale: [0, 1],
      rotate: [180, 0],
      delay: anime.stagger(100, { start: 2000 }),
      duration: 800,
      easing: "easeOutBack",
    });
  }

  const profileImage = document.getElementById("profileImage");
  if (profileImage) {
    anime({
      targets: profileImage,
      opacity: [0, 1],
      scale: [0.8, 1],
      rotate: [180, 0],
      delay: 1000,
      duration: 1500,
      easing: "easeOutElastic(1, .8)",
    });

    profileImage.addEventListener("mouseenter", () => {
      anime({
        targets: profileImage,
        scale: [1, 1.1],
        rotate: [0, 5],
        duration: 500,
        easing: "easeOutElastic(1, .8)",
      });
    });

    profileImage.addEventListener("mouseleave", () => {
      anime({
        targets: profileImage,
        scale: [1.1, 1],
        rotate: [5, 0],
        duration: 500,
        easing: "easeOutElastic(1, .8)",
      });
    });
  }

  const badges = document.querySelectorAll(".floating-badge");
  if (badges.length > 0) {
    badges.forEach((badge, index) => {
      anime({
        targets: badge,
        opacity: [0, 1],
        scale: [0, 1],
        delay: 1500 + index * 200,
        duration: 800,
        easing: "easeOutBack",
      });
    });
  }
}

function initSkillAnimations() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  const skillItems = skillsSection.querySelectorAll(".skill-item");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillItem = entry.target;
          const progressBar = skillItem.querySelector(".skill-progress");
          const percentElement = skillItem.querySelector(".skill-percent");
          const percent = parseInt(skillItem.getAttribute("data-percent") || 0);

          if (progressBar && typeof anime !== "undefined") {
            anime({
              targets: progressBar,
              width: ["0%", percent + "%"],
              duration: 2000,
              easing: "easeOutExpo",
              delay: 300,
            });

            anime({
              targets: { value: 0 },
              value: percent,
              duration: 2000,
              easing: "easeOutExpo",
              delay: 300,
              update: function (anim) {
                if (percentElement) {
                  percentElement.textContent =
                    Math.floor(anim.animatables[0].target.value) + "%";
                }
              },
            });
          }
          observer.unobserve(skillItem);
        }
      });
    },
    { threshold: 0.5 },
  );

  skillItems.forEach((item) => observer.observe(item));
}

function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item, index) => {
    inView(
      item,
      () => {
        if (typeof anime !== "undefined") {
          anime({
            targets: item,
            opacity: [0, 1],
            translateX: [-50, 0],
            delay: index * 150,
            duration: 1000,
            easing: "easeOutExpo",
          });
        } else {
          animateElement(
            item,
            { opacity: [0, 1], x: [-50, 0] },
            { duration: 0.8, delay: index * 0.1 },
          );
        }
      },
      { amount: 0.3 },
    );
  });
}

function initProjectAnimations() {
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card, index) => {
    inView(
      card,
      () => {
        if (typeof anime !== "undefined") {
          anime({
            targets: card,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.9, 1],
            delay: index * 100,
            duration: 1000,
            easing: "easeOutExpo",
          });
        } else {
          animateElement(
            card,
            { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] },
            { duration: 0.8, delay: index * 0.1 },
          );
        }
      },
      { amount: 0.2 },
    );

    card.addEventListener("mouseenter", () => {
      if (typeof anime !== "undefined") {
        anime({
          targets: card,
          scale: [1, 1.02],
          duration: 300,
          easing: "easeOutQuad",
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      if (typeof anime !== "undefined") {
        anime({
          targets: card,
          scale: [1.02, 1],
          duration: 300,
          easing: "easeOutQuad",
        });
      }
    });
  });
}

function initScrollAnimations() {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    inView(
      section,
      () => {
        const sectionHeader = section.querySelector(".section-header");
        if (sectionHeader && typeof anime !== "undefined") {
          anime({
            targets: sectionHeader,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 600,
            easing: "easeOutExpo",
          });
        }
      },
      { amount: 0.2 },
    );
  });

  const cards = document.querySelectorAll(
    ".card, .project-card, .contact-item",
  );
  cards.forEach((card, index) => {
    inView(
      card,
      () => {
        if (typeof anime !== "undefined") {
          anime({
            targets: card,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: index * 30,
            duration: 500,
            easing: "easeOutExpo",
          });
        } else {
          animateElement(
            card,
            { opacity: [0, 1], y: [50, 0] },
            { duration: 0.6, delay: index * 0.05 },
          );
        }
      },
      { amount: 0.2 },
    );
  });
}

function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-count") || 0);
    inView(
      stat,
      () => {
        if (typeof anime !== "undefined") {
          anime({
            targets: { value: 0 },
            value: target,
            duration: 2000,
            easing: "easeOutExpo",
            update: function (anim) {
              stat.textContent = Math.floor(anim.animatables[0].target.value);
            },
          });
        }
      },
      { amount: 0.5 },
    );
  });
}

function initContactAnimations() {
  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (typeof anime !== "undefined") {
        anime({
          targets: item,
          scale: [1, 1.02],
          duration: 200,
          easing: "easeOutQuad",
        });
      }
    });
    item.addEventListener("mouseleave", () => {
      if (typeof anime !== "undefined") {
        anime({
          targets: item,
          scale: [1.02, 1],
          duration: 200,
          easing: "easeOutQuad",
        });
      }
    });
  });
}

function initParallax() {
  const profileImage = document.getElementById("profileImage");
  if (!profileImage) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        const maxOffset = 100;
        const offset = Math.min(scrolled * parallaxSpeed, maxOffset);

        if (profileImage) {
          profileImage.style.transform = `translateY(${offset}px)`;
        }

        const gridBg = document.querySelector(".code-grid-bg");
        if (gridBg) {
          gridBg.style.transform = `translateY(${scrolled * 0.2}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

function initSmoothScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight =
          document.querySelector(".main-header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        if (typeof anime !== "undefined") {
          anime({
            targets: window,
            scrollTop: targetPosition,
            duration: 800,
            easing: "easeInOutQuad",
          });
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  let currentSection = "";
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        if (currentSection !== sectionId) {
          currentSection = sectionId;
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      }
    });
  });
}

window.Animations = {
  initParallax,
  initSmoothScroll,
};
function initializePortfolio() {
  initializeApp();
  generateParticles();
  setTimeout(() => {
    initLoaderAnimation();
  }, 100);
}

export default function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      initializePortfolio();
      window.dispatchEvent(new Event("resize"));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <div className="loader-screen" id="loader">
        <div className="loader-content">
          <div className="loader-code-text">
            <div className="code-line" data-line="1">
              const portfolio = {"{"}
            </div>
            <div className="code-line" data-line="2">
              {" "}
              loading: true,
            </div>
            <div className="code-line" data-line="3">
              {" "}
              status: 'initializing...'
            </div>
            <div className="code-line" data-line="4">
              {"};"}
            </div>
          </div>
          <div className="loader-spinner-wrapper">
            <div className="loader-spinner"></div>
          </div>
          <div className="loader-progress-wrapper">
            <div className="loader-progress-bar"></div>
          </div>
          <div className="loader-percentage" id="loaderPercent">
            0%
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="main-header" id="header">
        <nav className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo">
              <span className="logo-bracket">&lt;</span>
              <span className="logo-text">Dev</span>
              <span className="logo-bracket">/&gt;</span>
            </div>
          </div>

          <div className="nav-menu" id="navMenu">
            <a href="#home" className="nav-link active" data-section="home">
              <i className="fas fa-home"></i>
              <span
                className="nav-text"
                data-text-en="Home"
                data-text-ar="الرئيسية"
              >
                Home
              </span>
            </a>
            <a href="#about" className="nav-link" data-section="about">
              <i className="fas fa-user"></i>
              <span
                className="nav-text"
                data-text-en="About"
                data-text-ar="عني"
              >
                About
              </span>
            </a>
            <a href="#skills" className="nav-link" data-section="skills">
              <i className="fas fa-code"></i>
              <span
                className="nav-text"
                data-text-en="Skills"
                data-text-ar="المهارات"
              >
                Skills
              </span>
            </a>
            <a
              href="#experience"
              className="nav-link"
              data-section="experience"
            >
              <i className="fas fa-briefcase"></i>
              <span
                className="nav-text"
                data-text-en="Experience"
                data-text-ar="الخبرة"
              >
                Experience
              </span>
            </a>
            <a href="#projects" className="nav-link" data-section="projects">
              <i className="fas fa-rocket"></i>
              <span
                className="nav-text"
                data-text-en="Projects"
                data-text-ar="المشاريع"
              >
                Projects
              </span>
            </a>
            <a href="#contact" className="nav-link" data-section="contact">
              <i className="fas fa-envelope"></i>
              <span
                className="nav-text"
                data-text-en="Contact"
                data-text-ar="التواصل"
              >
                Contact
              </span>
            </a>
          </div>

          <div className="nav-controls">
            
            <button
              className="theme-toggle"
              id="themeToggle"
              title="Toggle Theme"
            >
              <i className="fas fa-moon"></i>
            </button>
            <button className="menu-toggle" id="menuToggle" title="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-background">
            <div className="code-grid-bg"></div>
            <div className="floating-particles" id="particles"></div>
          </div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-greeting">
                <span
                  className="greeting-text"
                  data-text-en="Hello, I'm"

                >
                  Hello, I'm
                </span>
                <span className="greeting-cursor">|</span>
              </div>

              <h1 className="hero-name" id="heroName">
                <span className="name-prefix">Farhan</span>
                <span> </span>
                <span className="name-value">Ansari</span>
              </h1>

              <div className="hero-title">
                <span className="title-prefix">#</span>
                <span
                  className="title-text"
                  data-text-en="Python FullStack Developer"
                  data-text-ar="مطور Python Full Stack & مصمم UI/UX"
                >
                  Python FullStack Developer
                </span>
              </div>

              <p
                className="hero-description"
                data-text-en="Designing, building, and delivering reliable software solutions that turn real-world requirements into scalable, high-quality applications."
                data-text-ar="مطور شغوف بإنشاء تجارب رقمية استثنائية باستخدام التقنيات الحديثة."
              >
                Designing, building, and delivering reliable software solutions
                that turn real-world requirements into scalable, high-quality
                applications.
              </p>

              <div className="hero-buttons">
                <a href="#contact" className="btn btn-primary">
                  <span data-text-en="Get In Touch" data-text-ar="تواصل معي">
                    Get In Touch
                  </span>
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="#projects" className="btn btn-secondary">
                  <span
                    data-text-en="View Projects"
                    data-text-ar="عرض المشاريع"
                  >
                    View Projects
                  </span>
                  <i className="fas fa-code"></i>
                </a>
              </div>

              <div className="hero-social">
                <a
                  href="mailto:farhanansar62@gmail.com"
                  className="social-icon"
                  title="Email"
                  target="_blank"
                >
                  <i className="fas fa-envelope"></i>
                </a>

                <a
                  href="tel:+918421906024"
                  className="social-icon"
                  title="Call Me"
                  target="_blank"
                >
                  <i className="fas fa-phone"></i>
                </a>

                <a
                  href="https://www.linkedin.com/in/farhan-ansari-00260b295/"
                  className="social-icon"
                  title="LinkedIn"
                  target="_blank"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>

                <a
                  href="https://www.github.com/farhan-ansari-09/"
                  className="social-icon"
                  title="GitHub"
                  target="_blank"
                >
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <div className="profile-image-frame">
                  <div className="profile-image">
                    <img src={profileImage} alt="Farhan Ansari" loading="eager"
  decoding="async"
  fetchPriority="high"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span
              className="scroll-text"
             
            >
              Scroll Down
            </span>
          </div>
        </section>

        

        {/* About Section */}
<section id="about" className="section about-section">
  <div className="section-container">

    {/* Section Header */}
    <div className="section-header">
      <span className="section-number">01</span>

      <h2 className="section-title">
        <span className="title-bracket">&lt;</span>

        <span
          className="title-text"
          data-text-en="About Me"
          data-text-ar="عني"
        >
          About Me
        </span>

        <span className="title-bracket">/&gt;</span>
      </h2>

      <div className="section-line"></div>
    </div>


    {/* About Content */}
    <div className="about-content">

      {/* Left Content */}
      <div className="about-text-wrapper">

        <div className="about-intro">
          <p className="about-text">
            Software Engineer (BCA, 2026) with hands-on experience in
            developing full-stack applications and a strong foundation
            in programming and computer science fundamentals. Eager to
            learn new technologies and contribute to building reliable,
            high quality software solutions.
          </p>
        </div>


        {/* About Highlights */}
        <div className="about-stats">

          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-code"></i>
            </div>

            <div className="stat-content">
              <div className="stat-label">
                FullStack
                <br/>
                Development
              </div>

              <div className="stat-description">
                End-to-end web
                
                application development
              </div>
            </div>
          </div>


          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>

            <div className="stat-content">
              <div className="stat-label">
                Internship <br/>
                Experience
              </div>

              <div className="stat-description">
                Hands-on industry
                
                experience
              </div>
            </div>
          </div>


          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-rocket"></i>
            </div>

            <div className="stat-content">
              <div className="stat-label">
                Production
               <br/>
                Delivery
              </div>

              <div className="stat-description">
                Building & shipping
                
                real-world solutions
              </div>
            </div>
          </div>

        </div>

      </div>


      {/* Code Block */}
      <div className="about-image-wrapper">
        <div className="about-image-container">

          <div className="code-block">

            {/* Code Window Header */}
            <div className="code-window-header">
              <div className="code-window-dots">
                <span className="window-dot dot-red"></span>
                <span className="window-dot dot-yellow"></span>
                <span className="window-dot dot-green"></span>
              </div>

              <span className="code-window-title">
                developer.js
              </span>
            </div>


            {/* Code */}
            <div className="code-content">

              <div className="code-line">
                <span className="code-keyword">const</span>
                <span>&nbsp;</span>
                <span className="code-variable">developer</span>
                <span className="code-operator">&nbsp;=&nbsp;</span>
                <span className="code-brace">{"{"}</span>
              </div>


              <div className="code-line indent">
                <span className="code-property">name</span>
                <span className="code-operator">:&nbsp;</span>
                <span className="code-string">
                  'Farhan Ansari'
                </span>
                <span className="code-comma">,</span>
              </div>


              <div className="code-line indent">
                <span className="code-property">Programming</span>
                <span className="code-operator">:&nbsp;</span>

                <span className="code-bracket">[</span>

                <span className="code-string">'Python'</span>
                <span className="code-comma">,&nbsp;</span>

                <span className="code-string">'JavaScript'</span>
                <span className="code-comma">,&nbsp;</span>

                <span className="code-string">'Java'</span>
                <span className="code-comma">,&nbsp;</span>

                <span className="code-string">'C'</span>

                <span className="code-bracket">]</span>
                <span className="code-comma">,</span>
              </div>


              <div className="code-line indent">
                <span className="code-property">Focus</span>
                <span className="code-operator">:&nbsp;</span>

                <span className="code-string">
                  'Solution Engineering'
                </span>
              </div>


              <div className="code-line">
                <span className="code-brace">{"}"}</span>
                <span className="code-semicolon">;</span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</section>

        {/* Education */}
        <section id="about" className="section about-section">
          <div className="section-container">
            {/* Section Header */}
            <div className="section-header">
              <span className="section-number">02</span>

              <h2 className="section-title">
                <span className="title-bracket">&lt;</span>

                <span
                  className="title-text"
                  data-text-en="Education"
                  data-text-ar="التعليم"
                >
                  Education
                </span>

                <span className="title-bracket">/&gt;</span>
              </h2>

              <div className="section-line"></div>
            </div>

            {/* Education Timeline */}
            <div className="education-timeline">
              {/* BCA */}
              <div className="education-item">
                <div className="education-marker">
                  <i className="fas fa-graduation-cap"></i>
                </div>

                <div className="education-content">
                  <div className="education-top">
                    <span className="education-year">2026</span>
                    <span className="education-status">Graduated</span>
                  </div>

                  <h3 className="education-degree">BCA (Science)</h3>

                  <div className="education-institution">
                    <i className="fas fa-university"></i>
                    <span>Abeda Inamdar Senior College, Azam Campus</span>
                  </div>

                  <div className="education-details">
                    <span>
                      <i className="fas fa-building-columns"></i>
                      Savitribai Phule Pune University
                    </span>

                    <span>
                      <i className="fas fa-chart-line"></i>
                      CGPA: 9.06
                    </span>
                  </div>
                </div>
              </div>

              {/* HSC */}
              <div className="education-item">
                <div className="education-marker">
                  <i className="fas fa-book"></i>
                </div>

                <div className="education-content">
                  <div className="education-top">
                    <span className="education-year">2023</span>
                  </div>

                  <h3 className="education-degree">
                    Higher Secondary Certificate (HSC)
                  </h3>

                  <div className="education-institution">
                    <i className="fas fa-school"></i>
                    <span>Poona College of Arts, Science and Commerce</span>
                  </div>

                  <div className="education-details">
                    <span>
                      <i className="fas fa-certificate"></i>
                      Maharashtra State Board
                    </span>
                  </div>
                </div>
              </div>

              {/* SSC */}
              <div className="education-item">
                <div className="education-marker">
                  <i className="fas fa-school"></i>
                </div>

                <div className="education-content">
                  <div className="education-top">
                    <span className="education-year">2021</span>
                  </div>

                  <h3 className="education-degree">
                    Secondary School Certificate (SSC)
                  </h3>

                  <div className="education-institution">
                    <i className="fas fa-school"></i>
                    <span>Moledina High School</span>
                  </div>

                  <div className="education-details">
                    <span>
                      <i className="fas fa-certificate"></i>
                      Maharashtra State Board
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section skills-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">
                <span className="title-bracket">&lt;</span>
                <span
                  className="title-text"
                  data-text-en="Skills"
                  data-text-ar="المهارات"
                >
                  Skills
                </span>
                <span className="title-bracket">/&gt;</span>
              </h2>
              <div className="section-line"></div>
            </div>

            <div className="skills-showcase">
              {/* Programming Languages */}
              <div className="skill-category">
                <div className="skill-category-header">
                  <span className="skill-category-label">01</span>
                  <h3>Programming Languages</h3>
                </div>

                <div className="skill-logo-grid">
                  <div className="tech-card">
                    <i className="devicon-javascript-plain colored"></i>
                    <span>Javascript</span>
                  </div>

                  <div className="tech-card">
                    <i className="devicon-python-plain colored"></i>
                    <span>Python</span>
                  </div>

                  <div className="tech-card">
                    <i className="devicon-java-plain colored"></i>
                    <span>Java</span>
                  </div>

                  <div className="tech-card">
                    <i className="devicon-c-original colored"></i>
                    <span>C</span>
                  </div>
                </div>
              </div>

              {/* Frontend */}
              <div className="skill-category">
                <div className="skill-category-header">
                  <span className="skill-category-label">02</span>
                  <h3>Frontend</h3>
                </div>

                <div className="skill-logo-grid">
                  <div className="tech-card">
                    <i className="devicon-html5-plain colored"></i>
                    <span>HTML5</span>
                  </div>

                  <div className="tech-card">
                    <i className="devicon-css3-plain colored"></i>
                    <span>CSS3</span>
                  </div>

                  <div className="tech-card">
                    <i className="devicon-javascript-plain colored"></i>
                    <span>JavaScript</span>
                  </div>

                  <div className="tech-card">
                    <i className="devicon-react-original colored"></i>
                    <span>React.js</span>
                  </div>
                </div>
              </div>

              {/* Backend & Apis */}
              <div className="skill-category">
                <div className="skill-category-header">
                  <span className="skill-category-label">03</span>
                  <h3>Backend</h3>
                </div>

                <div className="skill-logo-grid">
                  <div className="tech-card">
                    <i className="devicon-django-plain colored"></i>
                    Django RestFramework
                  </div>

                  <div className="tech-card">
                    <i className="devicon-flask-plain colored"></i>
                    Flask
                  </div>

                  <div className="tech-card">
                    <i className="devicon-postgresql-plain colored"></i>
                    Postgresql
                  </div>

                  <div className="tech-card no-icon">
                    <span className="text-icon">API</span>
                    <span>RESTful APIs</span>
                  </div>

                  <div className="tech-card">
                    <SiCelery /> Celery
                  </div>

                  <div className="tech-card">
                    <SiRedis /> Redis
                  </div>

                  <div className="tech-card">
                    <SiJsonwebtokens /> JWT Authentication
                  </div>
                </div>
              </div>

              {/* Cloud */}
              <div className="skill-category">
                <div className="skill-category-header">
                  <span className="skill-category-label">04</span>
                  <h3>Cloud & Deployments</h3>
                </div>

                <div className="skill-logo-grid">
                  <div className="tech-card">
                    <SiVercel />
                    <span>Vercel</span>
                  </div>

                  <div className="tech-card">
                    <SiRailway />
                    <span>Railway</span>
                  </div>

                  <div className="tech-card">
                    <SiRender />
                    <span>Render</span>
                  </div>

                  <div className="tech-card">
                    <SiHostinger />
                    <span>Hostinger</span>
                  </div>

                  <div className="tech-card">
                    <SiCloudinary />
                    <span>Cloudinary</span>
                  </div>
                </div>
              </div>

              {/* AI & Development Tools */}
              <div className="skill-category">
                <div className="skill-category-header">
                  <span className="skill-category-label">05</span>
                  <h3>AI & Development Tools</h3>
                </div>

                <div className="skill-logo-grid">
                  <div className="tech-card no-icon">
                    <span className="text-icon">GPT</span>
                    <span>ChatGpt</span>
                  </div>

                  <div className="tech-card">
                    <SiClaude />
                    <span>Claude</span>
                  </div>

                  <div className="tech-card">
                    <SiGooglegemini />
                    <span>Google Gemini</span>
                  </div>

                  <div className="tech-card">
                    <SiPerplexity />
                    <span>Perplexity</span>
                  </div>

                  <div className="tech-card">
                    <SiGithubcopilot />
                    <span>GitHub Copilot</span>
                  </div>

                  <div className="tech-card">
                    <SiCursor />
                    <span>Cursor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        {/* Experience Section */}
<section id="experience" className="section experience-section">
  <div className="section-container">

    {/* Section Header */}
    <div className="section-header">
      <span className="section-number">04</span>

      <h2 className="section-title">
        <span className="title-bracket">&lt;</span>

        <span className="title-text">
          Experience
        </span>

        <span className="title-bracket">/&gt;</span>
      </h2>

      <div className="section-line"></div>
    </div>


    {/* Experience */}
    <div className="experience-list">

      <article className="experience-entry">

        <div className="experience-header">

          <div className="experience-heading">

            <div className="experience-company">
              UnionSys Technologies
              <span className="company-location">
                · Pune, India
              </span>
            </div>

            <h3 className="experience-role">
              Software Engineering Intern
            </h3>

          </div>

          <div className="experience-date">
            OCT 2025 — MAR 2026
          </div>

        </div>


        <p className="experience-description">
          Worked on real-world software applications, contributing to
          frontend and backend development, REST API development,
          database operations, and application maintenance. Developed
          and maintained website features, integrated backend services
          with frontend applications, worked with Django ORM and
          PostgreSQL, and fixed bugs while implementing new features
          to support ongoing application development.
        </p>

      </article>

    </div>

  </div>
</section>

        {/* Projects Section */}
        <section id="projects" className="section projects-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-title">
                <span className="title-bracket">&lt;</span>
                <span
                  className="title-text"
                  data-text-en="Projects"
                  data-text-ar="المشاريع"
                >
                  Projects
                </span>
                <span className="title-bracket">/&gt;</span>
              </h2>
              <div className="section-line"></div>
            </div>

            <div className="projects-grid">
              <div className="project-card">
                <div
                  className="project-image"
                  style={{ backgroundImage: `url(${nestoImage})` }}
                >
                  <div className="project-overlay">
                    <div className="project-links">
                      <a
                        href="https://www.nestorenovation.com"
                        className="project-link"
                        title="View Project"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                      <a
                        href="https://github.com/farhan-ansari-09/nesto-renovation-case-study.git"
                        className="project-link"
                        title="View Code"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">NestoRenovation - Client</h3>
                  <p className="project-description">
                    Interior Bussiness Website with Lead and Bussiness
                    Management System.
                  </p>
                  <div className="project-tags">
                    <span className="tag">React Vite</span>
                    <span className="tag">Django RestFramework</span>
                    <span className="tag">Postgresql</span>
                    <span className="tag">Railway</span>
                    <span className="tag">Vercel</span>
                    <span className="tag">Cloudinary</span>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <div
                  className="project-image"
                  style={{ backgroundImage: `url(${unionsysImage})` }}
                >
                  <div className="project-overlay">
                    <div className="project-links">
                      <a
                        href="https://www.unionsystechnologies.com"
                        className="project-link"
                        title="View Project"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">
                    Unionsys Technologies - Internship
                  </h3>
                  <p className="project-description">
                    Enhanced the company official website.
                  </p>
                  <div className="project-tags">
                    <span className="tag">React Vite</span>
                    <span className="tag">Django RestFramework</span>
                    <span className="tag">Postgresql</span>
                    <span className="tag">Railway</span>
                    <span className="tag">Vercel</span>
                    <span className="tag">Cloudinary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section contact-section">
  <div className="section-container">

    {/* Section Header */}
    <div className="section-header">
      <span className="section-number">06</span>

      <h2 className="section-title">
        <span className="title-bracket">&lt;</span>
        <span className="title-text">Contact</span>
        <span className="title-bracket">/&gt;</span>
      </h2>

      <div className="section-line"></div>
    </div>

    {/* Contact Intro */}
    <div className="contact-intro">
      <p>
        If you're building something where engineering decisions meet business outcomes, I'd like to hear about it.
      </p>
    </div>

    <div className="contact-content">

      {/* ================= CONTACT INFO ================= */}
      <div className="contact-left">

        <div className="contact-info">

          {/* Email */}
          <a
            href="mailto:farhanansar62@gmail.com"
            className="contact-item"
          >
            <div className="contact-icon">
              <i className="fas fa-envelope"></i>
            </div>

            <div className="contact-details">
              <span className="contact-label">Email</span>
              <span className="contact-value">
                farhanansar62@gmail.com
              </span>
            </div>

            <i className="fas fa-arrow-up-right-from-square contact-arrow"></i>
          </a>


          {/* Phone */}
          <a
            href="tel:+918421906024"
            className="contact-item"
          >
            <div className="contact-icon">
              <i className="fas fa-phone"></i>
            </div>

            <div className="contact-details">
              <span className="contact-label">Phone</span>
              <span className="contact-value">
                +91 8421906024
              </span>
            </div>

            <i className="fas fa-arrow-up-right-from-square contact-arrow"></i>
          </a>


          {/* Location */}
          <div className="contact-item">
            <div className="contact-icon">
              <i className="fas fa-location-dot"></i>
            </div>

            <div className="contact-details">
              <span className="contact-label">Location</span>
              <span className="contact-value">
                Pune, Maharashtra India
              </span>
            </div>

            <i className="fas fa-arrow-up-right-from-square contact-arrow"></i>
          </div>

        </div>


        {/* Social Links */}
        <div className="contact-socials">

          <span className="social-heading">
            Let's connect
          </span>

          <div className="social-links">

            <a
              href="https://github.com/farhan-ansari-09"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              title="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/farhan-ansari-00260b295/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              title="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>

            <a
              href="mailto:farhanansar62@gmail.com"
              className="contact-social-link"
              title="Email"
            >
              <i className="fas fa-envelope"></i>
            </a>

          </div>
        </div>

      </div>


      {/* ================= CONTACT FORM ================= */}
      <div className="contact-form-wrapper">

        <form className="contact-form" id="contactForm">

          <div className="form-row">

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Name"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="Email"
                required
              />
            </div>

          </div>


          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Subject"
              required
            />
          </div>


          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              rows="6"
              placeholder="Message"
              required
            ></textarea>
          </div>


          <button
            type="submit"
            className="btn-submit"
          >
            <span>Send Message</span>
            <i className="fas fa-paper-plane"></i>
          </button>

        </form>

      </div>

    </div>

  </div>
</section>

      </main>

    </>
  );
}
