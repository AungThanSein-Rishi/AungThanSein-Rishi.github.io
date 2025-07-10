document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });

    // Hide nav on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      });
    });

    // Hide nav when clicking outside (mobile)
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && 
          !navToggle.contains(event.target) && 
          !navLinks.contains(event.target) && 
          navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
      }
    });
  }
});

// Image Modal Functions
function openImageModal(imageSrc, caption) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  
  modal.style.display = 'block';
  modalImg.src = imageSrc;
  modalCaption.innerHTML = caption;
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  
  // Restore body scrolling
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeImageModal();
      }
    });
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeImageModal();
  }
});

// Smooth scrolling for anchor links and hash navigation
document.addEventListener('DOMContentLoaded', function() {
  // Handle hash in URL on page load (for back button navigation from project pages)
  // Use instant scroll for hash navigation from external pages
  if (window.location.hash) {
    setTimeout(function() {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({
          behavior: 'instant',  // Changed from 'smooth' to 'instant'
          block: 'start'
        });
      }
    }, 50);  // Reduced timeout for faster response
  }
  
  // Handle smooth scrolling for navigation links (only for internal page navigation)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',  // Keep smooth for internal navigation
          block: 'start'
        });
        
        // Update URL hash
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });
});