document.addEventListener('DOMContentLoaded', function () {
    const slideshow = document.querySelector('.slideshow-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slideshow-control.prev');
    const nextBtn = document.querySelector('.slideshow-control.next');
    const indicatorsContainer = document.querySelector('.slideshow-indicators');

    let currentIndex = 0;
    let slideInterval;
    let isPaused = false;

    // Create indicators
    function createIndicators() {
        slides.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
        updateIndicators();
    }

    // Update active slide and indicators
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        updateIndicators();
    }

    // Update indicators
    function updateIndicators() {
        const indicators = document.querySelectorAll(
            '.slideshow-indicators span'
        );
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateSlides();
        resetInterval();
    }

    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Reset autoplay interval
    function resetInterval() {
        clearInterval(slideInterval);
        if (!isPaused) {
            slideInterval = setInterval(nextSlide, 3000);
        }
    }

    // Pause on hover
    function pauseSlideshow() {
        isPaused = true;
        clearInterval(slideInterval);
    }

    // Resume slideshow
    function resumeSlideshow() {
        isPaused = false;
        resetInterval();
    }

    // Initialize
    function init() {
        createIndicators();
        updateSlides();

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        slideshow.addEventListener('mouseenter', pauseSlideshow);
        slideshow.addEventListener('mouseleave', resumeSlideshow);

        // Start autoplay
        resetInterval();
    }

    // Start the slideshow
    init();

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
});
