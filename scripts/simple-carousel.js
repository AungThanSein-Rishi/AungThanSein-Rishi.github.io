/**
 * Simple Carousel Implementation - Direct DOM manipulation
 */
(function() {
    let currentSlide = 0;
    let totalSlides = 7;
    let autoplayInterval = null;
    
    function initCarousel() {
        console.log('Initializing simple carousel...');
        
        // Get elements
        const carousel = document.getElementById('projectsCarousel');
        const prevBtn = document.getElementById('projectsPrev');
        const nextBtn = document.getElementById('projectsNext');
        const navDots = document.getElementById('projectsNavDots');
        
        if (!carousel || !prevBtn || !nextBtn || !navDots) {
            console.error('Carousel elements not found');
            return;
        }
        
        console.log('All carousel elements found');
        
        // Bind events
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous button clicked - simple carousel');
            goToPrevSlide();
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked - simple carousel');
            goToNextSlide();
        });
        
        // Bind dot events
        const dots = navDots.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`Dot ${index} clicked - simple carousel`);
                goToSlide(index);
            });
        });
        
        // Start autoplay
        startAutoplay();
        
        // Initial update
        updateCarousel();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            updateCarousel();
        });
        
        console.log('Simple carousel initialized successfully');
    }
    
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }
    
    function goToPrevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
        resetAutoplay();
    }
    
    function updateCarousel() {
        const carousel = document.getElementById('projectsCarousel');
        const navDots = document.getElementById('projectsNavDots');
        
        if (!carousel || !navDots) return;
        
        // Update carousel position - both mobile and desktop use 25% per slide
        const translateX = -currentSlide * 25;
        
        carousel.style.transform = `translateX(${translateX}%)`;
        
        console.log(`Simple carousel: Moving to slide ${currentSlide} (${translateX}%)`);
        
        // Update dots
        const dots = navDots.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        autoplayInterval = setInterval(() => {
            console.log('Simple carousel: Auto-advancing');
            goToNextSlide();
        }, 2000);
    }
    
    function resetAutoplay() {
        startAutoplay();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
    
    // Global access for debugging
    window.simpleCarousel = {
        next: goToNextSlide,
        prev: goToPrevSlide,
        goTo: goToSlide,
        getCurrentSlide: () => currentSlide
    };
})();
