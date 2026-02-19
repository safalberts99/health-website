// ============================================================
// The Growth Path — script.js
// Theme toggle, mobile menu, reveal animations,
// subject filter bar, contact form
// ============================================================

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Theme toggle (all pages)
  // ----------------------------------------------------------
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Restore saved preference (default: dark)
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ----------------------------------------------------------
  // 2. Mobile hamburger menu (all pages)
  // ----------------------------------------------------------
  function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });
  }

  // ----------------------------------------------------------
  // 3. Scroll reveal animations (all pages)
  // ----------------------------------------------------------
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ----------------------------------------------------------
  // 4. Subjects filter bar (subjects.html)
  // ----------------------------------------------------------
  function initFilterBar() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card-grid .card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        cards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ----------------------------------------------------------
  // 5. Contact form (contact.html)
  // ----------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const response = document.getElementById('formResponse');
      const name = document.getElementById('name').value;

      if (response) {
        response.className = 'form-response success';
        response.textContent = `Thanks ${name}! Your message has been received.`;
      }

      form.reset();

      // Hide after 5 seconds
      if (response) {
        setTimeout(() => { response.style.display = 'none'; }, 5000);
      }
    });
  }

  // ----------------------------------------------------------
  // 6. Smooth scroll for anchor links
  // ----------------------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ----------------------------------------------------------
  // Boot
  // ----------------------------------------------------------
  function init() {
    initThemeToggle();
    initMobileMenu();
    initRevealAnimations();
    initFilterBar();
    initContactForm();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();