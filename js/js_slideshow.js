document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(n) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        slides[n].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function startSlideshow() {
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 3000);
    }
    
    document.querySelectorAll('.slide img').forEach(img => {
        img.onerror = function() {
            const caption = this.nextElementSibling;
            if (caption && caption.classList.contains('image-caption')) {
                caption.textContent = 'Imagem não encontrada: ' + this.alt;
                caption.style.color = '#ff0000';
                caption.style.backgroundColor = '#ffeeee';
            }
        };
    });
    
    startSlideshow();
    
    // const slideshowContainer = document.querySelector('.slideshow-container');
    // if (slideshowContainer) {
    //     slideshowContainer.addEventListener('mouseenter', () => {
    //         clearInterval(slideInterval);
    //     });
        
    //     slideshowContainer.addEventListener('mouseleave', () => {
    //         slideInterval = setInterval(nextSlide, 3000);
    //     });
    // }
});