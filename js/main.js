/* =========================
   RESPONSIVE JAVELINSCRIPT
   Mobile-optimized with touch support
========================= */

// Wait for DOM to be fully ready
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Initialize all components
  setupThemeToggle();
  setupMobileNavigation();
  setupSwiperSlider();
  setupVideoModal();
  setupAnimations();
  setupEarningFeed();
  setupHeroWordRotation();
  setupScrollEffects();
  setupTouchOptimizations();
  setupResizeHandlers();
}

/* =========================
   THEME TOGGLE (ENHANCED)
========================= */
/* =========================
   THEME TOGGLE - SLIDE SWITCH
========================= */
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  if (!themeToggleBtn) return;

  // System preference
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");

  // Set initial theme
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  // Toggle on click
  themeToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    
    // Add click animation
    themeToggleBtn.classList.add("clicked");
    setTimeout(() => {
      themeToggleBtn.classList.remove("clicked");
    }, 300);
  });

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  // Add keyboard support
  themeToggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      themeToggleBtn.click();
    }
  });

  function applyTheme(theme) {
    // Start animation
    themeToggleBtn.classList.add("changing");
    
    // Apply theme after short delay for animation
    setTimeout(() => {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      
      // Update ARIA label
      themeToggleBtn.setAttribute('aria-label', theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      
      // End animation
      setTimeout(() => {
        themeToggleBtn.classList.remove("changing");
      }, 100);
    }, 50);
  }

  // Add animation class for transition
  const style = document.createElement('style');
  style.textContent = `
    .theme-toggle-slider.changing .toggle-thumb {
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
    }
    
    .theme-toggle-slider.clicked .toggle-thumb {
      animation: pulse 0.3s ease;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(0.85); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}
/* =========================
   MOBILE NAVIGATION (TOUCH OPTIMIZED)
========================= */
function setupMobileNavigation() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".nav");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav a");

  if (!hamburger || !nav) return;

  // Toggle menu
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", nav.classList.contains("open"));
    document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
  });

  // Close menu button
  if (navClose) {
    navClose.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  }

  // Close menu when clicking links (mobile)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        nav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && 
        !nav.contains(e.target) && 
        !hamburger.contains(e.target)) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

/* =========================
   SCREENSHOT SLIDER (RESPONSIVE SWIPER)
========================= */
function setupSwiperSlider() {
  if (typeof Swiper === "undefined") {
    console.warn("Swiper not loaded, skipping slider initialization");
    return;
  }

  const swiperEl = document.querySelector(".screenshot-swiper");
  if (!swiperEl) return;

  // Check if mobile controls exist
  const mobilePrev = document.querySelector(".swiper-mobile-prev");
  const mobileNext = document.querySelector(".swiper-mobile-next");

  const swiper = new Swiper(".screenshot-swiper", {
    loop: true,
    spaceBetween: 20,
    grabCursor: true,
    centeredSlides: true,
    speed: 600,

    // Responsive slides per view
    slidesPerView: "auto",
    centeredSlidesBounds: true,

    // Pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    // Navigation
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // Breakpoints for different screen sizes
    breakpoints: {
      0: {
        spaceBetween: 16,
        centeredSlides: true,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
      },
      480: {
        spaceBetween: 20,
        centeredSlides: true,
      },
      768: {
        spaceBetween: 24,
        centeredSlides: false,
      },
      1024: {
        spaceBetween: 28,
        centeredSlides: false,
      }
    },

    // Accessibility
    a11y: {
      prevSlideMessage: 'Previous screenshot',
      nextSlideMessage: 'Next screenshot',
      firstSlideMessage: 'This is the first screenshot',
      lastSlideMessage: 'This is the last screenshot',
      paginationBulletMessage: 'Go to screenshot {{index}}',
    }
  });

  // Mobile custom controls
  if (mobilePrev && mobileNext) {
    mobilePrev.addEventListener("click", () => swiper.slidePrev());
    mobileNext.addEventListener("click", () => swiper.slideNext());
  }

  // Update slide size on resize
  window.addEventListener("resize", () => {
    swiper.update();
  });
}

/* =========================
   VIDEO MODAL (MOBILE FRIENDLY)
========================= */
function setupVideoModal() {
  const videoModal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const videoCloseBtn = document.getElementById("video-close");
  const openVideoBtn = document.getElementById("open-video");
  const videoLoader = document.getElementById("video-loader");

  if (!openVideoBtn || !videoModal || !modalVideo) return;

  // Open modal
  openVideoBtn.addEventListener("click", openVideoModal);

  // Close modal
  if (videoCloseBtn) {
    videoCloseBtn.addEventListener("click", closeVideoModal);
  }

  // Close on background click
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // Close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.style.display === "flex") {
      closeVideoModal();
    }
  });

  // Handle video events
  modalVideo.addEventListener("canplay", () => {
    if (videoLoader) videoLoader.style.display = "none";
  });

  modalVideo.addEventListener("waiting", () => {
    if (videoLoader) videoLoader.style.display = "flex";
  });

  // Pause video when modal closes
  modalVideo.addEventListener("pause", () => {
    if (videoModal.style.display === "none") {
      modalVideo.currentTime = 0;
    }
  });

  function openVideoModal() {
    videoModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    
    if (videoLoader) videoLoader.style.display = "flex";
    
    // Reset and play
    modalVideo.currentTime = 0;
    modalVideo.load();
    
    const playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play failed, show controls
        modalVideo.controls = true;
        if (videoLoader) videoLoader.style.display = "none";
      });
    }
    
    // Focus close button for accessibility
    setTimeout(() => {
      if (videoCloseBtn) videoCloseBtn.focus();
    }, 100);
  }

  function closeVideoModal() {
    videoModal.style.display = "none";
    document.body.style.overflow = "";
    modalVideo.pause();
    modalVideo.currentTime = 0;
    
    // Return focus to open button
    setTimeout(() => {
      openVideoBtn.focus();
    }, 100);
  }

  // Handle orientation change on mobile
  window.addEventListener("orientationchange", () => {
    if (videoModal.style.display === "flex") {
      // Recalculate modal position
      setTimeout(() => {
        videoModal.style.display = "flex";
      }, 300);
    }
  });
}

/* =========================
   ANIMATIONS (PERFORMANCE OPTIMIZED)
========================= */
function setupAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP not loaded, skipping animations");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Optimize for mobile performance
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    gsap.defaults({ duration: 0 });
    return;
  }

  // Initial load animations
  window.addEventListener("load", () => {
    // Only run heavy animations on non-mobile or if user prefers
    if (!isMobile || !prefersReducedMotion) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".header-inner", {
        opacity: 0,
        y: -30,
        duration: 0.8
      })
      .from(".hero-content", {
        opacity: 0,
        y: 50,
        duration: 1
      }, "-=0.3")
      .from(".hero-media img", {
        opacity: 0,
        scale: 0.8,
        duration: 1
      }, "-=0.5")
      .from(".hero-actions .btn", {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.6
      }, "-=0.3");
    }
  });

  // Scroll animations (only on desktop)
  if (!isMobile) {
    // Section animations
    gsap.utils.toArray(".animate-section").forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(section,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
        }
      });
    });

    // Card animations
    gsap.utils.toArray(".animate-card").forEach(card => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(card,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }
      });
    });
  }

  // Hero text animation
  gsap.from(".animate-hero", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.5
  });
}

/* =========================
   EARNING FEED (MOBILE OPTIMIZED)
========================= */
function setupEarningFeed() {
  const earningFeed = document.getElementById("earning-feed");
  const feedText = document.getElementById("feed-text");
  const feedClose = document.getElementById("feed-close");

  if (!earningFeed || !feedText) return;

  const feedMessages = [
    "Aman earned 120 coins",
    "Rohit redeemed ₹50",
    "Sneha completed daily reward",
    "You're next 👀",
    "Akash earned bonus coins 🎉",
    "Priya claimed daily spin",
    "Vikram won 200 coins",
    "Neha reached level 5"
  ];

  let feedIndex = 0;
  let feedInterval;

  // Initialize feed
  feedText.textContent = feedMessages[0];

  // Start rotation
  function startFeedRotation() {
    feedInterval = setInterval(() => {
      feedIndex = (feedIndex + 1) % feedMessages.length;
      feedText.textContent = feedMessages[feedIndex];
    }, 3500);
  }

  // Stop rotation
  function stopFeedRotation() {
    if (feedInterval) {
      clearInterval(feedInterval);
    }
  }

  // Close button functionality
  if (feedClose) {
    feedClose.addEventListener("click", () => {
      earningFeed.style.opacity = "0";
      earningFeed.style.transform = "translateY(20px)";
      stopFeedRotation();
      
      setTimeout(() => {
        earningFeed.style.display = "none";
      }, 300);
      
      // Save preference
      localStorage.setItem("feedClosed", "true");
    });
  }

  // Check if user previously closed the feed
  if (localStorage.getItem("feedClosed") === "true") {
    earningFeed.style.display = "none";
    stopFeedRotation();
  } else {
    earningFeed.style.display = "flex";
    startFeedRotation();
  }

  // Hide feed on mobile after 15 seconds
  if (window.innerWidth < 768) {
    setTimeout(() => {
      earningFeed.style.opacity = "0";
      earningFeed.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        earningFeed.style.display = "none";
        stopFeedRotation();
      }, 300);
    }, 15000);
  }
}

/* =========================
   HERO WORD ROTATION
========================= */
function setupHeroWordRotation() {
  const heroWordEl = document.getElementById("hero-word");
  if (!heroWordEl) return;

  const heroWords = ["Earn Coins", "Earn Rewards", "Earn Cash"];
  let heroIndex = 0;
  let rotationInterval;

  function rotateHeroWord() {
    heroWordEl.style.opacity = "0";
    
    setTimeout(() => {
      heroIndex = (heroIndex + 1) % heroWords.length;
      heroWordEl.textContent = heroWords[heroIndex];
      heroWordEl.style.opacity = "1";
    }, 400);
  }

  // Start rotation
  rotationInterval = setInterval(rotateHeroWord, 2200);

  // Pause rotation when tab is not visible (save battery)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(rotationInterval);
    } else {
      rotationInterval = setInterval(rotateHeroWord, 2200);
    }
  });
}

/* =========================
   SCROLL EFFECTS
========================= */
function setupScrollEffects() {
  const header = document.querySelector(".header");
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 10;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    
    // Add shadow when scrolled
    if (currentScroll > scrollThreshold) {
      header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
    } else {
      header.style.boxShadow = "none";
    }

    // Hide/show header on mobile (optional)
    if (window.innerWidth < 768) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up
        header.style.transform = "translateY(0)";
      }
    }

    lastScroll = currentScroll;
  });
}

/* =========================
   TOUCH OPTIMIZATIONS
========================= */
function setupTouchOptimizations() {
  // Add touch-specific classes
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.documentElement.classList.add('touch-device');
  } else {
    document.documentElement.classList.add('no-touch-device');
  }

  // Prevent zoom on double-tap for buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      btn.click();
    });
  });

  // Improve touch scrolling
  document.addEventListener('touchmove', (e) => {
    // Prevent scrolling behind modal
    const videoModal = document.getElementById("video-modal");
    if (videoModal && videoModal.style.display === "flex") {
      e.preventDefault();
    }
  }, { passive: false });
}

/* =========================
   RESIZE HANDLERS
========================= */
function setupResizeHandlers() {
  let resizeTimeout;
  
  window.addEventListener('resize', () => {
    // Clear the timeout
    clearTimeout(resizeTimeout);
    
    // Set a new timeout
    resizeTimeout = setTimeout(() => {
      // Handle responsive behaviors
      handleResize();
    }, 150); // Debounce resize events
  });

  function handleResize() {
    const nav = document.querySelector(".nav");
    const hamburger = document.getElementById("hamburger");
    
    // Auto-close mobile menu when resizing to desktop
    if (window.innerWidth >= 768 && nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      document.body.style.overflow = "";
      if (hamburger) {
        hamburger.setAttribute("aria-expanded", "false");
      }
    }
    
    // Update Swiper if it exists
    if (typeof Swiper !== "undefined") {
      const swiper = document.querySelector(".screenshot-swiper")?.swiper;
      if (swiper) {
        swiper.update();
      }
    }
  }
}

/* =========================
   LAZY LOADING & PERFORMANCE
========================= */
function setupLazyLoading() {
  // Use native lazy loading where supported
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img').forEach(img => {
      // Skip critical images
      if (!img.classList.contains('hero-image') && !img.closest('.header')) {
        img.loading = 'lazy';
      }
    });
  }

  // Lazy load video poster
  const videos = document.querySelectorAll('video[poster]');
  videos.forEach(video => {
    const poster = video.getAttribute('poster');
    if (poster) {
      const img = new Image();
      img.src = poster;
      img.onload = () => {
        video.poster = poster;
      };
    }
  });
}

/* =========================
   ERROR HANDLING
========================= */
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  // You could add error reporting here
});

// Initialize lazy loading
setupLazyLoading();