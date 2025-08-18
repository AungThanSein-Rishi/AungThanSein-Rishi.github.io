/**
 * Simple Achievements Carousel Implementation - Horizontal Sliding Window
 */
(function() {
    let currentPosition = 0;
    let autoplayInterval = null;
    let itemWidth = 280; // Base width + gap
    let visibleItems = 4; // Number of items visible at once
    let totalItems = 10;
    
    function initCarousel() {
        console.log('Initializing achievements horizontal carousel...');
        
        // Get elements
        const carousel = document.getElementById('achievementsCarousel');
        const prevBtn = document.getElementById('achievementsLeftBtn');
        const nextBtn = document.getElementById('achievementsRightBtn');
        
        if (!carousel || !prevBtn || !nextBtn) {
            console.error('Achievements carousel elements not found');
            return;
        }
        
        console.log('All achievements carousel elements found');
        
        // Calculate carousel properties
        updateCarouselProperties();
        
        // Bind events
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous button clicked - achievements carousel');
            goToPrev();
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked - achievements carousel');
            goToNext();
        });
        
        // Start autoplay
        startAutoplay();
        
        // Initial update
        updateCarousel();

    // Bind image click -> modal (progressive enhancement if global openImageModal available)
    bindImageClicks();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            updateCarouselProperties();
            updateCarousel();
        });
        
        console.log('Achievements horizontal carousel initialized successfully');
    }

    function bindImageClicks() {
        const items = document.querySelectorAll('#achievementsCarousel .achievement-item');
        if (!items.length) return;
        items.forEach(item => {
            if (item.dataset.modalBound) return; // prevent double bind
            item.dataset.modalBound = 'true';
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    if (typeof window.openImageModal === 'function') {
                        console.log('Opening image modal for achievements item', img.src);
                        window.openImageModal(img.src, img.alt || 'Achievement');
                    } else {
                        console.warn('openImageModal not found on window');
                    }
                } else {
                    console.warn('No img found inside achievement-item');
                }
            });
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }
    
    function updateCarouselProperties() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 360) {
            itemWidth = 156; // 140px + 16px gap
            visibleItems = 2;
        } else if (screenWidth <= 480) {
            itemWidth = 176; // 160px + 16px gap  
            visibleItems = 2;
        } else if (screenWidth <= 768) {
            itemWidth = 216; // 200px + 16px gap
            visibleItems = 3;
        } else {
            itemWidth = 296; // 280px + 16px gap
            visibleItems = 4;
        }
        
        console.log(`Updated carousel properties: itemWidth=${itemWidth}, visibleItems=${visibleItems}`);
    }
    
    function goToNext() {
        const maxPosition = totalItems - visibleItems;
        
        if (currentPosition < maxPosition) {
            currentPosition++;
        } else {
            // Loop back to beginning
            currentPosition = 0;
        }
        
        updateCarousel();
        resetAutoplay();
    }
    
    function goToPrev() {
        const maxPosition = totalItems - visibleItems;
        
        if (currentPosition > 0) {
            currentPosition--;
        } else {
            // Loop to end
            currentPosition = maxPosition;
        }
        
        updateCarousel();
        resetAutoplay();
    }
    
    function updateCarousel() {
        const carousel = document.getElementById('achievementsCarousel');
        
        if (!carousel) return;
        
        // Calculate translation
        const translateX = -currentPosition * itemWidth;
        
        carousel.style.transform = `translateX(${translateX}px)`;
        
        console.log(`Achievements carousel: Moving to position ${currentPosition} (${translateX}px)`);
    }
    
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        autoplayInterval = setInterval(() => {
            console.log('Achievements carousel: Auto-advancing');
            goToNext();
        }, 3000); // 3 seconds for achievements
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
    window.simpleAchievementsCarousel = {
        next: goToNext,
        prev: goToPrev,
        getCurrentPosition: () => currentPosition,
        updateProperties: updateCarouselProperties
    };
})();
