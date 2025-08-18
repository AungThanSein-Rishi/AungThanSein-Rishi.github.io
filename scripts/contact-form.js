// Simple EmailJS contact form handler
// Place this file at src/scripts/contact-form.js and include it in index.html

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Success message element
  let successMsg = document.createElement('div');
  successMsg.className = 'form-message success';
  successMsg.style.display = 'none';
  form.parentNode.insertBefore(successMsg, form.nextSibling);

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init('oN-_WfEr7g7dni12C');
  } else {
    console.error('EmailJS not loaded');
    return;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate required fields
    if (!name || !email || !message) {
      showSuccessMsg('❌ Please fill in all fields before sending.', false);
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const templateParams = {
        title: 'Someone message from Portfolio Page',
        name: name,
        email: email,
        message: message,
        time: new Date().toLocaleString()
      };

      await emailjs.send('service_08xhxmt', 'template_qzur1hx', templateParams);
      showSuccessMsg('✅ Message sent successfully! I\'ll get back to you soon.', true);
      form.reset();
    } catch (error) {
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
      showSuccessMsg(errorMessage, false);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function showSuccessMsg(msg, isSuccess) {
    successMsg.textContent = msg;
    successMsg.className = 'form-message ' + (isSuccess ? 'success' : 'error');
    successMsg.style.display = 'block';
    setTimeout(function() {
      successMsg.style.display = 'none';
    }, 6000);
  }
});
