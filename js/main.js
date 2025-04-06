// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Initialize image gallery (if present)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                // If using a lightbox, initialize it here
                // For simplicity, we're just adding a class
                this.classList.toggle('active');
            });
        });
    }

    // Contact form validation (if present)
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const response = await fetch("https://formigo-mails.vercel.app/api/form/3b87b891-91d0-4683-ac61-fdf5f25a1514", {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            
            let valid = false;
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const messageInput = contactForm.querySelector('#message');
            
            // Reset error states
            clearErrors();
            if (response.ok) {
                valid = true;
            }
            
            // Simple validation
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Proszę podać imię i nazwisko');
                valid = false;
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Proszę podać adres email');
                valid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Proszę podać poprawny adres email');
                valid = false;
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Proszę wprowadzić wiadomość');
                valid = false;
            }
            
            // If valid, submit the form (or show success message)
            if (valid) {
                // For demo purposes, we're just showing an alert
                // In a real app, you'd send the form data to a server
                const successMessage = document.querySelector('#success-message');
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    alert('Formularz został wysłany. Dziękujemy!');
                    contactForm.reset();
                }
            } else {
                // Show error message if form is invalid
                const errorMessage = document.querySelector('#error-message');
                if (errorMessage) {
                    errorMessage.classList.remove('hidden');
                    setTimeout(() => {
                        errorMessage.classList.add('hidden');
                    }, 5000);
                }
            }
        });
    }

    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        } else {
            const error = document.createElement('div');
            error.className = 'error-message text-red-500 text-sm mt-1';
            error.textContent = message;
            formGroup.appendChild(error);
        }
        
        input.classList.add('border-red-500');
    }
    
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        
        errorMessages.forEach(error => error.classList.add('hidden'));
        inputs.forEach(input => input.classList.remove('border-red-500'));
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Product filter functionality (if present)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    if (filterButtons.length > 0 && productItems.length > 0) {
        // Initialize all items as visible
        productItems.forEach(item => {
            item.classList.remove('opacity-0', 'hidden');
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update button states
                filterButtons.forEach(btn => {
                    if (btn === this) {
                        btn.classList.add('active', 'bg-blue-600', 'text-white');
                        btn.classList.remove('bg-gray-200');
                    } else {
                        btn.classList.remove('active', 'bg-blue-600', 'text-white');
                        btn.classList.add('bg-gray-200');
                    }
                });
                
                // Filter products
                productItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        // Show item
                        item.style.display = 'block';
                        item.classList.remove('opacity-0');
                        setTimeout(() => {
                            item.classList.add('scale-100');
                            item.classList.remove('scale-95');
                        }, 10);
                    } else {
                        // Hide item
                        item.classList.add('opacity-0', 'scale-95');
                        item.classList.remove('scale-100');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Color swatches functionality (if present)
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    if (colorSwatches.length > 0) {
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                const colorName = this.getAttribute('data-color-name');
                const productImage = document.querySelector('.product-image');
                const colorNameDisplay = document.querySelector('.color-name-display');
                
                // Remove active class from all swatches
                colorSwatches.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked swatch
                this.classList.add('active');
                
                // Update color name display if present
                if (colorNameDisplay) {
                    colorNameDisplay.textContent = colorName;
                }
                
                // Update product image if there's a corresponding image
                if (productImage) {
                    const colorImageUrl = this.getAttribute('data-image-url');
                    if (colorImageUrl) {
                        productImage.src = colorImageUrl;
                    }
                }
            });
        });
    }

    // Counter animation for statistics (if present)
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // Update every 16ms
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        counter.textContent = Math.round(current);
                        
                        if (current < target) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}); 