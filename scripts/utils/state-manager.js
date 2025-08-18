/**
 * State Manager - Simple state management for the portfolio application
 */
class StateManager {
  constructor() {
    this.state = {
      currentSection: null,
      isNavOpen: false,
      currentSlide: 0,
      isFormSubmitting: false,
      lastError: null,
      userPreferences: {
        prefersReducedMotion: false,
        prefersDarkMode: false
      }
    };
    
    this.listeners = [];
    this.initializeUserPreferences();
  }

  /**
   * Initialize user preferences from browser settings
   */
  initializeUserPreferences() {
    this.state.userPreferences.prefersReducedMotion = 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.state.userPreferences.prefersDarkMode = 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state with new values
   * @param {Object} newState - New state values to merge
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Function to call when state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of state changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Get specific state value
   * @param {string} key - State key to retrieve
   * @returns {*} State value
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set specific state value
   * @param {string} key - State key to set
   * @param {*} value - Value to set
   */
  set(key, value) {
    this.setState({ [key]: value });
  }

  /**
   * Toggle boolean state value
   * @param {string} key - State key to toggle
   */
  toggle(key) {
    if (typeof this.state[key] === 'boolean') {
      this.setState({ [key]: !this.state[key] });
    }
  }

  /**
   * Reset state to initial values
   */
  reset() {
    this.state = {
      currentSection: null,
      isNavOpen: false,
      currentSlide: 0,
      isFormSubmitting: false,
      lastError: null,
      userPreferences: {
        prefersReducedMotion: this.state.userPreferences.prefersReducedMotion,
        prefersDarkMode: this.state.userPreferences.prefersDarkMode
      }
    };
    this.notifyListeners();
  }

  /**
   * Get user preferences
   * @returns {Object} User preferences
   */
  getUserPreferences() {
    return { ...this.state.userPreferences };
  }

  /**
   * Update user preferences
   * @param {Object} preferences - New preferences to set
   */
  updateUserPreferences(preferences) {
    this.state.userPreferences = { ...this.state.userPreferences, ...preferences };
    this.notifyListeners();
  }
}

// Create and export singleton instance
const stateManager = new StateManager();

export default stateManager;
