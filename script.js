// ========================================
// BRAIN ROT MAFIA — Scripts
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // Scroll Reveal (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Navbar scroll state
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    navToggle.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('nav-open');
        });
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Mobile carousel auto-scroll (pauses on touch, resumes after)
    const carousel = document.querySelector('.carousel-wrapper');
    if (carousel) {
        let autoScrollSpeed = 0.5;
        let autoScrollId = null;
        let userInteracting = false;
        let resumeTimeout = null;

        function startAutoScroll() {
            if (autoScrollId) return;
            autoScrollId = requestAnimationFrame(function tick() {
                if (!userInteracting) {
                    carousel.scrollLeft += autoScrollSpeed;
                    // Loop back when reaching the end
                    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                        carousel.scrollLeft = 0;
                    }
                }
                autoScrollId = requestAnimationFrame(tick);
            });
        }

        // Pause on touch
        carousel.addEventListener('touchstart', () => {
            userInteracting = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => { userInteracting = false; }, 3000);
        }, { passive: true });

        // Pause on mouse interaction (for desktop testing)
        carousel.addEventListener('mousedown', () => { userInteracting = true; });
        carousel.addEventListener('mouseup', () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => { userInteracting = false; }, 3000);
        });

        startAutoScroll();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                // For the pricing section, scroll so the full card + CTA is visible
                let targetPos;
                if (href === '#pricing') {
                    // Align top of viewport to LIFETIME ACCESS badge,
                    // ensuring Get Instant Access button is fully visible at bottom
                    const badge = target.querySelector('.pricing-badge');
                    const ctaBtn = target.querySelector('.btn-full');
                    if (badge && ctaBtn) {
                        const badgeTop = badge.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                        const ctaBottom = ctaBtn.getBoundingClientRect().bottom + window.scrollY + 20;
                        const neededHeight = ctaBottom - badgeTop;
                        if (neededHeight <= window.innerHeight) {
                            // Both fit — align badge to top of viewport
                            targetPos = badgeTop;
                        } else {
                            // Too tall — scroll so CTA bottom is at viewport bottom
                            targetPos = ctaBottom - window.innerHeight;
                        }
                    } else {
                        targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                    }
                } else {
                    targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                }
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

});
