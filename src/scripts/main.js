/**
 * Constance IT — Client-side JavaScript
 * Mobile nav, sticky header, scroll animations, FAQ accordion, dropdowns
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ──────────────────────────────────────
  // Sticky Header
  // ──────────────────────────────────────
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const threshold = 20;

    const onScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ──────────────────────────────────────
  // Mobile Navigation
  // ──────────────────────────────────────
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.nav-mobile-overlay');
    if (!toggle || !mobileNav) return;

    const openIcon = toggle.querySelector('.icon-menu');
    const closeIcon = toggle.querySelector('.icon-close');

    function openMenu() {
      mobileNav.classList.add('open');
      if (overlay) overlay.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      if (openIcon) openIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      if (openIcon) openIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
      document.body.style.overflow = '';

      // Reset accordion panels when menu closes
      const panels = mobileNav.querySelectorAll('.nav-mobile-accordion-panel');
      const toggles = mobileNav.querySelectorAll('.nav-mobile-accordion-toggle');
      panels.forEach(panel => { panel.hidden = true; });
      toggles.forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const icon = t.querySelector('.nav-mobile-accordion-icon');
        if (icon) icon.textContent = '+';
      });
    }

    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Mobile nav accordion toggles
    const accordionToggles = document.querySelectorAll('.nav-mobile-accordion-toggle');
    accordionToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const panel = toggle.nextElementSibling;
        const icon = toggle.querySelector('.nav-mobile-accordion-icon');
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          toggle.setAttribute('aria-expanded', 'false');
          panel.hidden = true;
          if (icon) icon.textContent = '+';
        } else {
          toggle.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
          if (icon) icon.textContent = '\u2212';
        }
      });
    });
  }

  // ──────────────────────────────────────
  // Desktop Dropdown Menus
  // ──────────────────────────────────────
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      let closeTimeout;

      // Open on mouseenter
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
        // Close other open dropdowns
        dropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.add('open');
      });

      // Close on mouseleave with small delay
      dropdown.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
          dropdown.classList.remove('open');
        }, 150);
      });

      // Toggle on click (for keyboard / touch)
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('open');
        dropdowns.forEach((d) => d.classList.remove('open'));
        if (!isOpen) dropdown.classList.add('open');
      });

      // Close on Escape
      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdown.classList.remove('open');
          trigger.focus();
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        dropdowns.forEach((d) => d.classList.remove('open'));
      }
    });
  }

  // ──────────────────────────────────────
  // Scroll Animations (IntersectionObserver)
  // ──────────────────────────────────────
  function initScrollAnimations() {
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll('.animate-on-scroll, .stagger-children');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ──────────────────────────────────────
  // Hero Load Animation
  // ──────────────────────────────────────
  function initHeroAnimation() {
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero-animate');
    if (!hero) return;

    requestAnimationFrame(() => {
      hero.classList.add('loaded');
    });
  }

  // ──────────────────────────────────────
  // FAQ Accordion
  // ──────────────────────────────────────
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // ──────────────────────────────────────
  // Number Count-Up Animation
  // ──────────────────────────────────────
  function initCountUp() {
    if (prefersReducedMotion) return;

    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    const suffix = el.getAttribute('data-count-suffix') || '';
    const prefix = el.getAttribute('data-count-prefix') || '';
    const duration = 800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ──────────────────────────────────────
  // Initialize All
  // ──────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initDropdowns();
    initScrollAnimations();
    initHeroAnimation();
    initFAQ();
    initCountUp();
  });
})();
