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
                    // Scroll so the full pricing card is visible
                    const sectionTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                    const sectionBottom = target.getBoundingClientRect().bottom + window.scrollY;
                    const sectionHeight = sectionBottom - sectionTop;
                    if (sectionHeight <= window.innerHeight) {
                        // Card fits on screen — center it vertically
                        targetPos = sectionTop - (window.innerHeight - sectionHeight) / 2;
                    } else {
                        // Card taller than viewport — align to top
                        targetPos = sectionTop;
                    }
                } else {
                    targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                }
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

});
