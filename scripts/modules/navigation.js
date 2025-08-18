/**
 * Navigation Module - Handles navigation functionality
 */
import stateManager from '../utils/state-manager.js';
import errorHandler from '../utils/error-handler.js';

class Navigation {
  constructor() {
    this.navLinks = null;
    this.navAnchors = [];
    this.sections = [];
    this.isInitialized = false;
  }

  /**
   * Initialize navigation
   */
  init() {
    try {
      this.elements = this.getElements();
      this.bindEvents();
      this.setupScrollEffect();
      this.setupIntersectionObserver();
      this.updateFooterYear();
      this.isInitialized = true;
      
      console.log('Navigation initialized successfully');
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Get navigation elements
   */
  getElements() {
    const navLinks = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const burgerMenu = document.getElementById('burgerMenu');

    if (!navLinks) {
      throw new Error('Required navigation elements not found');
    }

    return {
      navLinks,
      navAnchors: Array.from(navAnchors),
      sections: Array.from(sections),
      burgerMenu
    };
  }

  /**
   * Bind navigation events
   */
  bindEvents() {
    const { navLinks, burgerMenu } = this.elements;

    // Smooth scrolling for anchor links
    this.elements.navAnchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });

    // Burger menu toggle
    if (burgerMenu) {
      burgerMenu.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on nav links
    this.elements.navAnchors.forEach(anchor => {
      anchor.addEventListener('click', () => this.closeMobileMenu());
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !burgerMenu?.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize for responsive design
    window.addEventListener('resize', () => this.handleResize());

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Handle window resize for responsive design
   */
  handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    try {
      const { navLinks, burgerMenu } = this.elements;
      
      if (!navLinks || !burgerMenu) return;

      const isActive = navLinks.classList.contains('active');
      
      if (isActive) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    try {
      const { navLinks, burgerMenu } = this.elements;
      
      if (!navLinks || !burgerMenu) return;

      navLinks.classList.add('active');
      burgerMenu.classList.add('active');
      burgerMenu.setAttribute('aria-expanded', 'true');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      
      // Update state
      stateManager.set('isMobileMenuOpen', true);
      
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    try {
      const { navLinks, burgerMenu } = this.elements;
      
      if (!navLinks || !burgerMenu) return;

      navLinks.classList.remove('active');
      burgerMenu.classList.remove('active');
      burgerMenu.setAttribute('aria-expanded', 'false');
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Update state
      stateManager.set('isMobileMenuOpen', false);
      
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Setup scroll effect for glassmorphism navbar
   */
  setupScrollEffect() {
    try {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      let lastScrollY = window.scrollY;
      let ticking = false;

      const updateNavbar = () => {
        const scrollY = window.scrollY;
        
        // Add scrolled class when scrolling down
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateNavbar);
          ticking = true;
        }
      };

      // Listen for scroll events
      window.addEventListener('scroll', requestTick, { passive: true });

      // Initial check
      updateNavbar();

    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Setup intersection observer for active section highlighting
   */
  setupIntersectionObserver() {
    try {
      if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported, falling back to scroll event');
        this.setupScrollFallback();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: 0.1,
          rootMargin: '-120px 0px -50% 0px'
        }
      );

      this.elements.sections.forEach(section => {
        observer.observe(section);
      });

    } catch (error) {
      errorHandler.handle(error, 'Navigation');
      this.setupScrollFallback();
    }
  }

  /**
   * Handle intersection observer entries
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        this.updateActiveSection(sectionId);
      }
    });
  }

  /**
   * Fallback for browsers without IntersectionObserver
   */
  setupScrollFallback() {
    document.addEventListener('scroll', () => {
      this.highlightActiveSection();
    }, { passive: true });
    
    // Initial highlight
    this.highlightActiveSection();
  }

  /**
   * Highlight active section based on scroll position
   */
  highlightActiveSection() {
    try {
      let current = '';
      const scrollY = window.pageYOffset;
      
      this.elements.sections.forEach(section => {
        const top = section.offsetTop - 120; // Account for sticky nav
        const height = section.offsetHeight;
        
        if (scrollY >= top && scrollY < top + height) {
          current = '#' + section.getAttribute('id');
        }
      });
      
      this.updateActiveSection(current.replace('#', ''));
      
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Update active section highlighting
   */
  updateActiveSection(sectionId) {
    try {
      if (!sectionId) return;
      
      // Update state
      stateManager.set('currentSection', sectionId);
      
      // Update navigation links
      this.elements.navAnchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        const isActive = href === `#${sectionId}`;
        
        if (isActive) {
          anchor.classList.add('active');
        } else {
          anchor.classList.remove('active');
        }
      });
      
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Handle smooth scrolling for anchor links
   */
  handleSmoothScroll(event) {
    try {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const offsetTop = target.offsetTop - 120; // Account for sticky nav
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, null, targetId);
      }
      
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Update footer year
   */
  updateFooterYear() {
    try {
      const yearEl = document.getElementById('year');
      if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
      }
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Handle hash navigation on page load
   */
  handleHashNavigation() {
    try {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          // Prevent scroll flash by temporarily hiding body
          document.documentElement.style.visibility = 'hidden';
          
          // Scroll to target
          window.scrollTo({
            top: target.offsetTop - 120,
            behavior: 'instant'
          });
          
          // Restore visibility
          setTimeout(() => {
            document.documentElement.style.visibility = 'visible';
          }, 100);
        }
      }
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }

  /**
   * Get current navigation state
   */
  getState() {
    return {
      currentSection: stateManager.get('currentSection'),
      isInitialized: this.isInitialized
    };
  }

  /**
   * Destroy navigation (cleanup)
   */
  destroy() {
    try {
      // Remove event listeners
      window.removeEventListener('resize', this.handleResize);
      
      this.isInitialized = false;
      console.log('Navigation destroyed');
      
    } catch (error) {
      errorHandler.handle(error, 'Navigation');
    }
  }
}

export default Navigation;
