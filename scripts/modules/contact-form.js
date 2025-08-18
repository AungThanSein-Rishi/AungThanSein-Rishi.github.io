// ...existing code...

class ContactForm {
  constructor() {
    this.form = null;
    this.submitBtn = null;
  }

  init() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;

    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
      emailjs.init("oN-_WfEr7g7dni12C");
    } else {
      console.error('EmailJS library not loaded');
      return;
    }

    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();

    // Validate required fields
    if (!name || !email || !msg) {
      alert('Please fill in all fields before sending.');
      return;
    }

    // Show loading state
    const originalText = this.submitBtn.textContent;
    this.submitBtn.textContent = 'Sending...';
    this.submitBtn.disabled = true;

    try {
      // Updated template parameters to match your EmailJS template
      const templateParams = {
        title: 'Someone message from Portfolio Page',
        name: name,
        email: email,
        message: msg,
        time: new Date().toLocaleString()
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send('service_08xhxmt', 'template_qzur1hx', templateParams);

      console.log('Email sent successfully:', response);

      // Success - show confirmation and reset form
      alert('✅ Message sent successfully! I\'ll get back to you soon.');
      this.form.reset();

    } catch (error) {
      console.error('EmailJS error details:', error);

      // More specific error handling
      let errorMessage = '❌ Failed to send message. ';
      if (error.status === 422) {
        errorMessage += 'Please check if all fields are filled correctly.';
      } else if (error.status === 400) {
        errorMessage += 'Invalid template or service configuration.';
      } else if (error.status === 401) {
        errorMessage += 'Authentication failed. Please check API keys.';
      } else {
        errorMessage += 'Please try again or contact me directly at aungthansein993@gmail.com';
      }

      alert(errorMessage);
    } finally {
      // Reset button state
      this.submitBtn.textContent = originalText;
      this.submitBtn.disabled = false;
    }
  }
}

export default ContactForm;