
/**
 * Scroll Animations
 * Handles fade-in animations for elements with .animate-on-scroll class
 * Respects prefers-reduced-motion
 */

import { prefersReducedMotion } from '@theme/utilities';

class ScrollAnimations {
  #observer = null;
  #elements = [];

  constructor() {
    if (prefersReducedMotion()) {
      // If user prefers reduced motion, show all elements immediately
      this.#showAllElements();
      return;
    }

    this.#init();
  }

  #init() {
    // Find all elements that need animation
    this.#elements = Array.from(document.querySelectorAll('.animate-on-scroll'));

    if (this.#elements.length === 0) return;

    // Set up IntersectionObserver
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Start animation when element is 50px from viewport
      threshold: 0.1,
    };

    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animated class to trigger CSS transition
          entry.target.classList.add('animated');
          // Unobserve once animated
          this.#observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements
    this.#elements.forEach((element) => {
      this.#observer.observe(element);
    });
  }

  #showAllElements() {
    this.#elements = Array.from(document.querySelectorAll('.animate-on-scroll'));
    this.#elements.forEach((element) => {
      element.classList.add('animated');
    });
  }

  destroy() {
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = null;
    }
    this.#elements = [];
  }
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
  });
} else {
  new ScrollAnimations();
}

