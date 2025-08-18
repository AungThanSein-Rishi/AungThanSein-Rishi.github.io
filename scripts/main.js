/**
 * Main Application - Portfolio Application Entry Point
 */
// import errorHandler from './utils/error-handler.js';
import Navigation from './modules/navigation.js';
import Carousel from './modules/carousel.js';
import ImageModal from './modules/image-modal.js';
import ContactForm from './modules/contact-form.js';
import stateManager from './utils/state-manager.js';

class PortfolioApp {
  constructor() {
    this.modules = {
      navigation: null,
      projectsCarousel: null,
      achievementsCarousel: null,
      contactForm: null,
      imageModal: null
    };
    
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Prevent multiple initializations
      if (this.initializationPromise) {
        return this.initializationPromise;
      }
      
      this.initializationPromise = this.performInitialization();
      await this.initializationPromise;
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Perform application initialization
   */
  async performInitialization() {
    try {
      console.log('Initializing Portfolio Application...');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }
      
      // Initialize modules
      await this.initializeModules();
      
      // Setup intersection observer for reveal animations
      this.setupRevealAnimations();
      
      // Handle hash navigation
      this.handleHashNavigation();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Setup 3D mouse movement effect
      this.setup3DMouseEffect();
      
      this.isInitialized = true;
      console.log('Portfolio Application initialized successfully');
      
      // Add global test function for debugging
      window.testCarousel = () => {
        const carousel = this.modules.projectsCarousel;
        if (carousel) {
          console.log('Testing carousel manually...');
          console.log('Carousel state:', carousel.getState());
          carousel.nextSlide();
        }
      };
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('portfolioAppReady'));
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
      throw error;
    }
  }

  /**
   * Initialize all application modules
   */
  async initializeModules() {
    try {
      // Initialize navigation
      this.modules.navigation = new Navigation();
      this.modules.navigation.init();
      
      // Initialize image modal
      this.modules.imageModal = new ImageModal();
      this.modules.imageModal.init();
      
      // Initialize projects carousel
      this.modules.projectsCarousel = new Carousel('projects');
      this.modules.projectsCarousel.init();
      
      // Initialize achievements carousel
      this.modules.achievementsCarousel = new Carousel('achievements');
      this.modules.achievementsCarousel.init();
      
      // Initialize contact form
      this.modules.contactForm = new ContactForm();
      this.modules.contactForm.init();
      
      console.log('All modules initialized successfully');
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
      throw error;
    }
  }

  /**
   * Setup reveal animations
   */
  setupRevealAnimations() {
    try {
      const revealEls = document.querySelectorAll('.reveal-once');
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (revealEls.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        
        revealEls.forEach(el => observer.observe(el));
        console.log('Reveal animations initialized');
      } else {
        // Fallback for browsers without IntersectionObserver or reduced motion preference
        revealEls.forEach(el => el.classList.add('reveal'));
        console.log('Reveal animations fallback applied');
      }
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
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
            top: target.offsetTop - 120, // Account for sticky nav
            behavior: 'instant'
          });
          
          // Restore visibility
          setTimeout(() => {
            document.documentElement.style.visibility = 'visible';
          }, 100);
        }
      }
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    try {
      if ('performance' in window && 'getEntriesByType' in performance) {
        // Monitor Core Web Vitals
        if (typeof gtag !== 'undefined') {
          this.monitorCoreWebVitals();
        }
        
        // Monitor resource loading
        this.monitorResourceLoading();
      }
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    try {
      // Import web-vitals if available
      if (typeof getCLS !== 'undefined' && typeof getFID !== 'undefined' && 
          typeof getFCP !== 'undefined' && typeof getLCP !== 'undefined' && 
          typeof getTTFB !== 'undefined') {
        
        const sendToAnalytics = (metric) => {
          gtag('event', metric.name, {
            value: Math.round(metric.value),
            event_category: 'Web Vitals'
          });
        };
        
        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
        
        console.log('Core Web Vitals monitoring initialized');
      }
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Monitor resource loading performance
   */
  monitorResourceLoading() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource' && entry.duration > 3000) {
            console.warn('Slow resource loading detected:', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      console.log('Resource loading monitoring initialized');
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Setup 3D mouse movement effect for about box
   */
  setup3DMouseEffect() {
    try {
      const aboutBox = document.querySelector('.neon-border-box');
      if (!aboutBox) return;

      aboutBox.addEventListener('mousemove', (e) => {
        const rect = aboutBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        aboutBox.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      aboutBox.addEventListener('mouseleave', () => {
        aboutBox.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });

    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Get application state
   */
  getState() {
    const moduleStates = {};
    
    Object.entries(this.modules).forEach(([name, module]) => {
      if (module && typeof module.getState === 'function') {
        moduleStates[name] = module.getState();
      }
    });
    
    return {
      isInitialized: this.isInitialized,
      moduleStates
    };
  }

  /**
   * Get specific module
   */
  getModule(name) {
    return this.modules[name] || null;
  }

  /**
   * Destroy application (cleanup)
   */
  destroy() {
    try {
      console.log('Destroying Portfolio Application...');
      
      // Destroy all modules
      Object.entries(this.modules).forEach(([name, module]) => {
        if (module && typeof module.destroy === 'function') {
          try {
            module.destroy();
            console.log(`${name} module destroyed`);
          } catch (error) {
            errorHandler.handle(error, `PortfolioApp-${name}`);
          }
        }
      });
      
      this.isInitialized = false;
      this.initializationPromise = null;
      
      console.log('Portfolio Application destroyed');
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }

  /**
   * Reload application
   */
  async reload() {
    try {
      console.log('Reloading Portfolio Application...');
      
      this.destroy();
      await this.init();
      
      console.log('Portfolio Application reloaded successfully');
      
    } catch (error) {
      errorHandler.handle(error, 'PortfolioApp');
    }
  }
}

// Create and export singleton instance
const portfolioApp = new PortfolioApp();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    portfolioApp.init();
  });
} else {
  portfolioApp.init();
}

// Export for use in other modules
export default portfolioApp;

// Global access for debugging
window.portfolioApp = portfolioApp;
