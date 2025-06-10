document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const themeSwitch = document.querySelector('.theme-switch');
    const themeIcon = themeSwitch.querySelector('i');
    const gallery = document.querySelector('.gallery');

    let currentIndex = 0;
    let filteredItems = [];
    let isDarkTheme = false;

    // Helper function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to shuffle gallery items
    function shuffleGallery() {
        const itemsArray = Array.from(galleryItems);
        const shuffledItems = shuffleArray([...itemsArray]);
        
        // Remove all items from gallery
        galleryItems.forEach(item => item.remove());
        
        // Add items back in shuffled order
        shuffledItems.forEach(item => gallery.appendChild(item));
    }

    // Shuffle gallery on page load
    shuffleGallery();

    // Set initial theme icon
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');

    // Theme switching with smooth transition
    themeSwitch.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme');
        
        // Update icon with animation
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.style.transform = 'rotate(0deg)';
            themeIcon.classList.toggle('fa-moon');
            themeIcon.classList.toggle('fa-sun');
        }, 300);
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // If "All" is selected, shuffle the gallery
            if (filter === 'all') {
                shuffleGallery();
            }

            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        });
    });

    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function updateLightboxImage() {
        const visibleItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
        filteredItems = visibleItems;
        const currentItem = filteredItems[currentIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.getAttribute('data-title');
        
        lightboxImg.src = img.src;
        lightboxTitle.textContent = title;
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % filteredItems.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        updateLightboxImage();
    }

    // Close lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Navigation with keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox.click();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });

    // Navigation buttons
    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);

    // Close lightbox when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox.click();
        }
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
    });
}); 