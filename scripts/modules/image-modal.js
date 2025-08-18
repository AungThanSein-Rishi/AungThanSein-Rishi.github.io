/**
 * Image Modal Module - Handles image modal functionality
 */
import stateManager from '../utils/state-manager.js';
import errorHandler from '../utils/error-handler.js';

class ImageModal {
  constructor() {
    this.modal = null;
    this.modalImg = null;
    this.modalCaption = null;
    this.isInitialized = false;
  }

  /**
   * Initialize image modal
   */
  init() {
    try {
      this.modal = document.getElementById('imageModal');
      
      if (!this.modal) {
        console.warn('Image modal not found on this page');
        return;
      }
      
      this.modalImg = document.getElementById('modalImage');
      this.modalCaption = document.getElementById('modalCaption');
      
      this.bindEvents();
      this.isInitialized = true;
      
      console.log('Image modal initialized successfully');
    } catch (error) {
      errorHandler.handle(error, 'ImageModal');
    }
  }

  /**
   * Bind modal events
   */
  bindEvents() {
    // Close modal when clicking outside the image
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });
    
    // Close button click
    const closeBtn = this.modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
  }

  /**
   * Open image modal
   * @param {string} imageSrc - Source URL of the image
   * @param {string} caption - Caption text for the image
   */
  openModal(imageSrc, caption) {
    try {
      // Lazy init safeguard (in case main initialization sequence failed / race condition)
      if (!this.isInitialized) {
        this.init();
      }
      if (!this.modal || !this.modalImg || !this.modalCaption) {
        console.error('ImageModal: modal elements not found after init attempt');
        return;
      }
      
      // Set image source and caption
      this.modalImg.src = imageSrc;
      this.modalImg.alt = caption || 'Image';
      this.modalCaption.innerHTML = caption || '';
      
      // Show modal
  this.modal.style.display = 'block';
  this.modal.setAttribute('aria-hidden', 'false');
      
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus modal for accessibility
      this.modal.focus();
      
      // Track modal open
      if (typeof gtag !== 'undefined') {
        gtag('event', 'modal_open', {
          event_category: 'Image',
          event_label: 'Portfolio Image Modal'
        });
      }
      
      console.log('Image modal opened:', { imageSrc, caption });
      
    } catch (error) {
      errorHandler.handle(error, 'ImageModal');
    }
  }

  /**
   * Close image modal
   */
  closeModal() {
    try {
      if (!this.modal) return;
      
      // Hide modal
  this.modal.style.display = 'none';
  this.modal.setAttribute('aria-hidden', 'true');
      
      // Clear image source and caption
      if (this.modalImg) {
        this.modalImg.src = '';
        this.modalImg.alt = '';
      }
      
      if (this.modalCaption) {
        this.modalCaption.innerHTML = '';
      }
      
      // Restore body scrolling
      document.body.style.overflow = 'auto';
      
      // Track modal close
      if (typeof gtag !== 'undefined') {
        gtag('event', 'modal_close', {
          event_category: 'Image',
          event_label: 'Portfolio Image Modal'
        });
      }
      
      console.log('Image modal closed');
      
    } catch (error) {
      errorHandler.handle(error, 'ImageModal');
    }
  }

  /**
   * Check if modal is open
   * @returns {boolean} True if modal is open
   */
  isOpen() {
    return this.modal && this.modal.style.display === 'block';
  }

  /**
   * Get current modal state
   * @returns {Object} Current modal state
   */
  getState() {
    return {
      isOpen: this.isOpen(),
      isInitialized: this.isInitialized,
      currentImage: this.modalImg ? this.modalImg.src : null,
      currentCaption: this.modalCaption ? this.modalCaption.innerHTML : null
    };
  }

  /**
   * Destroy image modal (cleanup)
   */
  destroy() {
    try {
      if (this.modal) {
        // Remove event listeners
        this.modal.removeEventListener('click', (event) => {
          if (event.target === this.modal) {
            this.closeModal();
          }
        });
        
        const closeBtn = this.modal.querySelector('.close');
        if (closeBtn) {
          closeBtn.removeEventListener('click', () => this.closeModal());
        }
      }
      
      // Remove document event listeners
      document.removeEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.closeModal();
        }
      });
      
      this.isInitialized = false;
      console.log('Image modal destroyed');
      
    } catch (error) {
      errorHandler.handle(error, 'ImageModal');
    }
  }
}

// Create and export singleton instance
const imageModal = new ImageModal();

// Auto init on module load (defensive)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => imageModal.init(), { once: true });
} else {
  imageModal.init();
}

// Global functions for backward compatibility
window.openImageModal = (imageSrc, caption) => {
  imageModal.openModal(imageSrc, caption);
};

window.closeImageModal = () => {
  imageModal.closeModal();
};

export default imageModal;
