/**
 * Carousel Module - Handles carousel functionality for projects and achievements
 */
import stateManager from '../utils/state-manager.js';
import errorHandler from '../utils/error-handler.js';

class Carousel {
  constructor(type = 'projects') {
    this.type = type;
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.autoplayInterval = null;
    this.isInitialized = false;
    this.elements = {};
  }

  /**
   * Initialize carousel
   */
  init() {
    try {
      console.log(`Initializing ${this.type} carousel...`);
      
      // Wait for DOM to be fully ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.performInit());
      } else {
        this.performInit();
      }
      
    } catch (error) {
      console.error(`Error initializing ${this.type} carousel:`, error);
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Perform carousel initialization
   */
  performInit() {
    try {
      this.elements = this.getElements();
      this.totalSlides = this.getTotalSlides();
      
      console.log(`${this.type} carousel: Found ${this.totalSlides} slides`);
      
      this.bindEvents();
      this.setupAutoplay();
      this.updateCarousel();
      this.isInitialized = true;
      
      console.log(`${this.type} carousel initialized successfully`);
      
      // Test button functionality
      if (this.type === 'projects') {
        this.testButtonFunctionality();
      }
      
    } catch (error) {
      console.error(`Error in performInit for ${this.type} carousel:`, error);
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Test button functionality
   */
  testButtonFunctionality() {
    const { prevBtn, nextBtn } = this.elements;
    
    console.log('Testing button functionality:', {
      prevBtn: !!prevBtn,
      nextBtn: !!nextBtn,
      prevBtnClickable: prevBtn && !prevBtn.disabled,
      nextBtnClickable: nextBtn && !nextBtn.disabled
    });
  }

  /**
   * Get carousel elements
   */
  getElements() {
    if (this.type === 'projects') {
      return this.getProjectsElements();
    } else if (this.type === 'achievements') {
      return this.getAchievementsElements();
    }
    
    throw new Error(`Unknown carousel type: ${this.type}`);
  }

  /**
   * Get projects carousel elements
   */
  getProjectsElements() {
    const carousel = document.getElementById('projectsCarousel');
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');
    const navDots = document.getElementById('projectsNavDots');

    console.log('Carousel elements found:', {
      carousel: !!carousel,
      prevBtn: !!prevBtn,
      nextBtn: !!nextBtn,
      navDots: !!navDots
    });

    if (!carousel || !prevBtn || !nextBtn || !navDots) {
      throw new Error('Required projects carousel elements not found');
    }

    return {
      carousel,
      prevBtn,
      nextBtn,
      navDots,
      slides: carousel.querySelectorAll('.project-slide')
    };
  }

  /**
   * Get achievements carousel elements
   */
  getAchievementsElements() {
    const carousel = document.getElementById('achievementsCarousel');
    const prevBtn = document.getElementById('achievementsLeftBtn');
    const nextBtn = document.getElementById('achievementsRightBtn');
    const navDots = document.getElementById('achievementsNavDots');

    if (!carousel || !prevBtn || !nextBtn || !navDots) {
      throw new Error('Required achievements carousel elements not found');
    }

    return {
      carousel,
      prevBtn,
      nextBtn,
      navDots,
      slides: carousel.querySelectorAll('.achievement-slide')
    };
  }

  /**
   * Get total number of slides
   */
  getTotalSlides() {
    if (this.type === 'projects') {
      return this.elements.slides.length;
    } else if (this.type === 'achievements') {
      return this.elements.slides.length;
    }
    return 0;
  }

  /**
   * Bind carousel events
   */
  bindEvents() {
    if (this.type === 'projects') {
      this.bindProjectsEvents();
    } else if (this.type === 'achievements') {
      this.bindAchievementsEvents();
    }
  }

  /**
   * Bind projects carousel events
   */
  bindProjectsEvents() {
    const { prevBtn, nextBtn, navDots, carousel } = this.elements;

    console.log('Binding events for projects carousel...', {
      prevBtn: !!prevBtn,
      nextBtn: !!nextBtn,
      navDots: !!navDots,
      carousel: !!carousel
    });

    // Navigation buttons with robust event binding
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Previous button clicked');
      this.prevSlide();
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Next button clicked');
      this.nextSlide();
    });

    // Add mousedown events as backup
    prevBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      console.log('Previous button mousedown');
    });
    
    nextBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      console.log('Next button mousedown');
    });

    // Navigation dots
    const dots = navDots.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Navigation dot ${index} clicked`);
        this.goToSlide(index);
      });
    });

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => {
      console.log('Carousel hover - pausing autoplay');
      this.stopAutoplay();
    });
    carousel.addEventListener('mouseleave', () => {
      console.log('Carousel leave - resuming autoplay');
      this.startAutoplay();
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Handle visibility change to pause autoplay when tab is not active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    });
    
    console.log('Events bound successfully for projects carousel');
  }

  /**
   * Bind achievements carousel events
   */
  bindAchievementsEvents() {
    const { prevBtn, nextBtn, navDots, carousel } = this.elements;

    console.log('Binding events for achievements carousel...', {
      prevBtn: !!prevBtn,
      nextBtn: !!nextBtn,
      navDots: !!navDots,
      carousel: !!carousel
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Previous button clicked - achievements');
        this.prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Next button clicked - achievements');
        this.nextSlide();
      });
    }

    // Bind navigation dots
    if (navDots) {
      const dots = navDots.querySelectorAll('.nav-dot');
      dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`Achievement dot ${index} clicked`);
          this.goToSlide(index);
        });
      });
    }

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    console.log('Achievement carousel events bound successfully');
  }

  /**
   * Update carousel display
   */
  updateCarousel() {
    try {
      if (this.type === 'projects') {
        this.updateProjectsCarousel();
      } else if (this.type === 'achievements') {
        this.updateAchievementsCarousel();
      }

      // Update state
      stateManager.set('currentSlide', this.currentSlide);
      
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Update projects carousel
   */
  updateProjectsCarousel() {
    const { carousel, prevBtn, nextBtn, navDots } = this.elements;
    
    // Both mobile and desktop use 25% translation now
    const translateX = -this.currentSlide * 25;
    
    console.log(`${this.type} carousel: Updating transform to ${translateX}% (slide ${this.currentSlide})`);
    carousel.style.transform = `translateX(${translateX}%)`;
    
    // Update navigation buttons - always enable for continuous carousel
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // Update nav dots
    const dots = navDots.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
      dot.setAttribute('aria-selected', index === this.currentSlide ? 'true' : 'false');
    });
    
    console.log(`${this.type} carousel: Updated navigation. Active dot: ${this.currentSlide}`);
  }

  /**
   * Update achievements carousel
   */
  updateAchievementsCarousel() {
    const { carousel, prevBtn, nextBtn, navDots } = this.elements;
    
    // Calculate translation based on screen size
    const isMobile = window.innerWidth <= 768;
    let translateX;
    
    if (isMobile) {
      // Mobile: show 1 slide at a time, 10% per slide (100% ÷ 10 slides)
      translateX = -this.currentSlide * 10;
    } else {
      // Desktop: show 2 slides at a time, 20% per slide (100% ÷ 5 groups)
      translateX = -this.currentSlide * 20;
    }
    
    console.log(`${this.type} carousel: Updating transform to ${translateX}% (slide ${this.currentSlide}, mobile: ${isMobile})`);
    carousel.style.transform = `translateX(${translateX}%)`;
    
    // Update navigation buttons - always enable for continuous carousel
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    
    // Update nav dots
    const dots = navDots.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
      dot.setAttribute('aria-selected', index === this.currentSlide ? 'true' : 'false');
    });
    
    console.log(`${this.type} carousel: Updated navigation. Active dot: ${this.currentSlide}`);
  }

  /**
   * Go to next slide
   */
  nextSlide() {
    try {
      console.log(`${this.type} carousel: nextSlide called. Current slide: ${this.currentSlide}, Total slides: ${this.totalSlides}`);
      
      if (this.currentSlide < this.totalSlides - 1) {
        this.currentSlide++;
      } else {
        // Loop back to first slide for continuous carousel
        this.currentSlide = 0;
      }
      
      console.log(`${this.type} carousel: Moving to slide ${this.currentSlide}`);
      this.updateCarousel();
      this.resetAutoplay();
      
    } catch (error) {
      console.error(`Error in nextSlide:`, error);
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Go to previous slide
   */
  prevSlide() {
    try {
      console.log(`${this.type} carousel: prevSlide called. Current slide: ${this.currentSlide}, Total slides: ${this.totalSlides}`);
      
      if (this.currentSlide > 0) {
        this.currentSlide--;
      } else {
        // Loop to last slide for continuous carousel
        this.currentSlide = this.totalSlides - 1;
      }
      
      console.log(`${this.type} carousel: Moving to slide ${this.currentSlide}`);
      this.updateCarousel();
      this.resetAutoplay();
      
    } catch (error) {
      console.error(`Error in prevSlide:`, error);
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Go to specific slide
   */
  goToSlide(slideIndex) {
    try {
      if (slideIndex >= 0 && slideIndex < this.totalSlides) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.resetAutoplay();
      }
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Setup autoplay
   */
  setupAutoplay() {
    const preferences = stateManager.getUserPreferences();
    
    if (!preferences.prefersReducedMotion) {
      this.startAutoplay();
    }
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    try {
      const preferences = stateManager.getUserPreferences();
      
      if (preferences.prefersReducedMotion) {
        console.log(`${this.type} carousel: Autoplay disabled due to reduced motion preference`);
        return;
      }
      
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
      
      // Only autoplay for projects carousel
      if (this.type === 'projects') {
        this.autoplayInterval = setInterval(() => {
          console.log(`${this.type} carousel: Auto-advancing to next slide`);
          this.nextSlide();
        }, 2000); // 2 second interval as requested
        
        console.log(`${this.type} carousel: Autoplay started with 2s interval`);
      }
      
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Stop autoplay
   */
  stopAutoplay() {
    try {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Reset autoplay
   */
  resetAutoplay() {
    try {
      const preferences = stateManager.getUserPreferences();
      
      if (!preferences.prefersReducedMotion) {
        this.startAutoplay();
      }
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    try {
      // Throttle resize handler
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.updateCarousel();
      }, 150);
      
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }

  /**
   * Get current carousel state
   */
  getState() {
    return {
      type: this.type,
      currentSlide: this.currentSlide,
      totalSlides: this.totalSlides,
      isAutoplayActive: !!this.autoplayInterval,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Destroy carousel (cleanup)
   */
  destroy() {
    try {
      this.stopAutoplay();
      
      // Remove event listeners
      if (this.type === 'projects') {
        const { prevBtn, nextBtn, navDots, carousel } = this.elements;
        
        if (prevBtn) prevBtn.removeEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.removeEventListener('click', () => this.nextSlide());
        if (carousel) {
          carousel.removeEventListener('mouseenter', () => this.stopAutoplay());
          carousel.removeEventListener('mouseleave', () => this.startAutoplay());
        }
        
        const dots = navDots?.querySelectorAll('.nav-dot');
        dots?.forEach((dot, index) => {
          dot.removeEventListener('click', () => this.goToSlide(index));
        });
      } else if (this.type === 'achievements') {
        const { leftBtn, rightBtn } = this.elements;
        
        if (leftBtn) leftBtn.removeEventListener('click', () => this.prevSlide());
        if (rightBtn) rightBtn.removeEventListener('click', () => this.nextSlide());
      }
      
      // Remove window resize listener
      window.removeEventListener('resize', () => this.handleResize());
      
      this.isInitialized = false;
      console.log(`${this.type} carousel destroyed`);
      
    } catch (error) {
      errorHandler.handle(error, `Carousel-${this.type}`);
    }
  }
}

export default Carousel;
