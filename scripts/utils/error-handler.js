/**
 * Error Handler - Centralized error handling for the portfolio application
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Handle and log errors
   * @param {Error|string} error - Error object or message
   * @param {string} context - Context where the error occurred
   * @param {Object} additionalData - Additional error data
   */
  handle(error, context = 'Unknown', additionalData = {}) {
    const errorInfo = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
      context,
      additionalData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log error to console
    console.error(`Error in ${context}:`, error);
    
    // Add to error log
    this.addToLog(errorInfo);
    
    // Send to analytics if available
    this.logToAnalytics(errorInfo);
    
    // Show user-friendly message
    this.showUserMessage(errorInfo);
    
    return errorInfo;
  }

  /**
   * Add error to internal log
   * @param {Object} errorInfo - Error information object
   */
  addToLog(errorInfo) {
    this.errorLog.push(errorInfo);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  /**
   * Log error to analytics service
   * @param {Object} errorInfo - Error information object
   */
  logToAnalytics(errorInfo) {
    try {
      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: errorInfo.message,
          fatal: false,
          custom_map: {
            context: errorInfo.context,
            stack: errorInfo.stack
          }
        });
      }
      
      // Custom analytics endpoint
      this.sendToCustomAnalytics(errorInfo);
    } catch (analyticsError) {
      console.warn('Failed to log error to analytics:', analyticsError);
    }
  }

  /**
   * Send error to custom analytics endpoint
   * @param {Object} errorInfo - Error information object
   */
  async sendToCustomAnalytics(errorInfo) {
    try {
      // Only send in production
      if (window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1') {
        
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorInfo)
        });
      }
    } catch (fetchError) {
      console.warn('Failed to send error to custom analytics:', fetchError);
    }
  }

  /**
   * Show user-friendly error message
   * @param {Object} errorInfo - Error information object
   */
  showUserMessage(errorInfo) {
    const message = this.getUserFriendlyMessage(errorInfo);
    
    // Show toast notification
    this.showToast(message, 'error');
  }

  /**
   * Get user-friendly error message
   * @param {Object} errorInfo - Error information object
   * @returns {string} User-friendly error message
   */
  getUserFriendlyMessage(errorInfo) {
    const { context, message } = errorInfo;
    
    // Common error patterns
    if (message.includes('NetworkError') || message.includes('fetch')) {
      return 'Network error occurred. Please check your internet connection and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    
    if (message.includes('permission')) {
      return 'Permission denied. Please check your settings and try again.';
    }
    
    if (message.includes('quota')) {
      return 'Storage quota exceeded. Please clear some space and try again.';
    }
    
    // Context-specific messages
    switch (context) {
      case 'ContactForm':
        return 'Failed to send message. Please try again or contact me directly.';
      
      case 'Carousel':
        return 'Carousel navigation error. Please refresh the page.';
      
      case 'Navigation':
        return 'Navigation error occurred. Please refresh the page.';
      
      case 'ImageModal':
        return 'Image display error. Please try again.';
      
      default:
        return 'An unexpected error occurred. Please refresh the page and try again.';
    }
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, warning, info)
   */
  showToast(message, type = 'info') {
    try {
      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-content">
          <span class="toast-message">${message}</span>
          <button class="toast-close" aria-label="Close notification">&times;</button>
        </div>
      `;
      
      // Add to page
      document.body.appendChild(toast);
      
      // Show toast
      setTimeout(() => toast.classList.add('show'), 100);
      
      // Auto-hide after 5 seconds
      setTimeout(() => this.hideToast(toast), 5000);
      
      // Close button functionality
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hideToast(toast));
      
    } catch (error) {
      // Fallback to alert if toast creation fails
      console.warn('Toast creation failed, using alert:', error);
      alert(message);
    }
  }

  /**
   * Hide toast notification
   * @param {HTMLElement} toast - Toast element to hide
   */
  hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * Get error log
   * @returns {Array} Array of error information objects
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Check if error is recoverable
   * @param {Error|string} error - Error to check
   * @returns {boolean} True if error is recoverable
   */
  isRecoverable(error) {
    const message = error instanceof Error ? error.message : error;
    
    // Non-recoverable errors
    const nonRecoverable = [
      'Script error',
      'SecurityError',
      'NotSupportedError'
    ];
    
    return !nonRecoverable.some(pattern => message.includes(pattern));
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   * @returns {Promise} Promise that resolves with function result
   */
  async retry(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

// Create and export singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;
