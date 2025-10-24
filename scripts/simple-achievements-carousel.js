
(function () {
    const carousels = [];

    function initAllCarousels() {
        console.log('Initializing all carousels...');

        // Find all carousel containers (divs ending with "Carousel")
        const carouselElements = document.querySelectorAll('[id$="Carouselimg"]');

        carouselElements.forEach((carouselEl) => {
            const id = carouselEl.id;
            const section = carouselEl.closest('.section, section'); // find parent section

            // Look for navigation buttons *within the same section*
            const prevBtn = section?.querySelector('.carousel-nav.prev');
            const nextBtn = section?.querySelector('.carousel-nav.next');

            if (!prevBtn || !nextBtn) {
                console.warn(`Skipping ${id}: missing navigation buttons in section`);
                return;
            }

            const state = {
                id,
                currentPosition: 0,
                autoplayInterval: null,
                itemWidth: 280,
                visibleItems: 4,
                totalItems: carouselEl.children.length,
                elements: { carouselEl, prevBtn, nextBtn },
            };

            setupCarousel(state);
            carousels.push(state);
        });

        console.log(`Initialized ${carousels.length} carousels successfully`);
    }

    function setupCarousel(state) {
        const { id } = state;
        console.log(`Setting up ${id}...`);

        updateCarouselProperties(state);
        bindNavigation(state);
        bindImageClicks(state);
        startAutoplay(state);
        updateCarousel(state);

        window.addEventListener('resize', () => {
            updateCarouselProperties(state);
            updateCarousel(state);
        });
    }

    function bindNavigation(state) {
        const { elements } = state;

        elements.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPrev(state);
        });

        elements.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToNext(state);
        });
    }

    function bindImageClicks(state) {
        const { carouselEl } = state.elements;
        const items = carouselEl.querySelectorAll('.achievement-item, .cert-item, .carousel-item');

        items.forEach((item) => {
            if (item.dataset.modalBound) return;
            item.dataset.modalBound = 'true';
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img && typeof window.openImageModal === 'function') {
                    window.openImageModal(img.src, img.alt || 'Image');
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

    function updateCarouselProperties(state) {
        const screenWidth = window.innerWidth;
        let itemWidth, visibleItems;

        if (screenWidth <= 360) {
            itemWidth = 156;
            visibleItems = 2;
        } else if (screenWidth <= 480) {
            itemWidth = 176;
            visibleItems = 2;
        } else if (screenWidth <= 768) {
            itemWidth = 216;
            visibleItems = 3;
        } else {
            itemWidth = 296;
            visibleItems = 4;
        }

        state.itemWidth = itemWidth;
        state.visibleItems = visibleItems;
    }

    function goToNext(state) {
        const maxPosition = state.totalItems - state.visibleItems;
        state.currentPosition = state.currentPosition < maxPosition ? state.currentPosition + 1 : 0;
        updateCarousel(state);
        resetAutoplay(state);
    }

    function goToPrev(state) {
        const maxPosition = state.totalItems - state.visibleItems;
        state.currentPosition = state.currentPosition > 0 ? state.currentPosition - 1 : maxPosition;
        updateCarousel(state);
        resetAutoplay(state);
    }

    function updateCarousel(state) {
        const translateX = -state.currentPosition * state.itemWidth;
        state.elements.carouselEl.style.transform = `translateX(${translateX}px)`;
    }

    function startAutoplay(state) {
        if (state.autoplayInterval) clearInterval(state.autoplayInterval);
        state.autoplayInterval = setInterval(() => goToNext(state), 3000);
    }

    function resetAutoplay(state) {
        startAutoplay(state);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllCarousels);
    } else {
        initAllCarousels();
    }

    // Optional global access for debugging
    window.multiCarousel = {
        all: carousels,
        next: (id) => carousels.find(c => c.id === id) && goToNext(carousels.find(c => c.id === id)),
        prev: (id) => carousels.find(c => c.id === id) && goToPrev(carousels.find(c => c.id === id)),
    };
})();
