document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVIGATION & HEADER ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const header = document.querySelector(".header");

    // Mobile menu toggle
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close mobile menu on link click
    navLinks.forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // Sticky header
    window.addEventListener("scroll", () => {
        header.classList.toggle("sticky", window.scrollY > 0);
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute("id");
            const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            }
        });
    });

    // --- 2. HERO SECTION TYPEWRITER ---
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = "Full Stack Developer";
        let index = 0;
        let isDeleting = false;

        function type() {
            const currentText = text.substring(0, index);
            typewriterElement.innerHTML = currentText + '<span class="typing-cursor">|</span>';

            if (!isDeleting && index < text.length) {
                index++;
                setTimeout(type, 150);
            } else if (isDeleting && index > 0) {
                index--;
                setTimeout(type, 100);
            } else {
                isDeleting = !isDeleting;
                setTimeout(type, 1200);
            }
        }
        type();
    }

    // --- 3. FLOATING CURSOR ---
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .hamburger, .project-card, .chip').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
            el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    // --- 4. SCROLL PROGRESS & SCROLL-TO-TOP ---
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercentage}%`;
        }

        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    // --- 5. AOS (ANIMATE ON SCROLL) INITIALIZATION ---
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
    });

    // --- 6. SKILLS PROGRESS BARS ANIMATION ---
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        const progressBars = document.querySelectorAll('.progress');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { 
                if (entry.isIntersecting) {
                    document.querySelectorAll('.skill').forEach(skill => {
                        skill.querySelector('.progress').style.width = skill.dataset.progress + '%';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
    }

    // --- 7. PARTICLE.JS FOR HERO SECTION ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
                this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                let color = 'rgba(0, 255, 255, 0.5)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            initParticles();
        });
    }

    // --- 8. EMAILJS CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');

    if (contactForm) {
        // Initialize EmailJS with your Public Key
        emailjs.init('YOUR_PUBLIC_KEY'); // <-- IMPORTANT: REPLACE WITH YOUR EmailJS PUBLIC KEY

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const serviceID = 'YOUR_SERVICE_ID'; // <-- REPLACE
            const templateID = 'YOUR_TEMPLATE_ID'; // <-- REPLACE

            // Send the form data
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    formMessage.textContent = 'Message sent successfully!';
                    formMessage.style.color = 'var(--primary-color)';
                    contactForm.reset();
                }, (err) => {
                    formMessage.textContent = 'Failed to send message. Please try again.';
                    formMessage.style.color = 'red';
                    console.error('EmailJS Error:', JSON.stringify(err));
                });
        });
    }

    // --- 9. PROJECT MODAL ---
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');

    projectCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                // Get data from card's data attributes
                const title = card.querySelector('.project-title').innerText;
                const description = card.dataset.description;
                const tags = card.dataset.tags.split(',');
                const imgSrc = card.dataset.imgSrc;

                // Populate modal
                modalTitle.innerText = title;
                modalDescription.innerText = description;
                modalImg.src = imgSrc;
                
                // Clear previous tags and add new ones
                modalTags.innerHTML = '';
                tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.innerText = tag;
                    modalTags.appendChild(tagElement);
                });

                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }
    });

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    // Event listeners to close modal
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Close if clicked on backdrop
            closeModal();
        }
    });
});