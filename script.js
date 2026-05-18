/* ============================================
   MEDINA ALMEYRA NOURAINI — 1ST BIRTHDAY
   Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // --- DOM REFERENCES ---
    const splash = document.getElementById('splash');
    const openBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicOnIcon = musicToggle.querySelector('.music-on');
    const musicOffIcon = musicToggle.querySelector('.music-off');

    // --- STATE ---
    let isMusicPlaying = false;
    let galleryIndex = 0;
    let galleryTouchStartX = 0;
    let galleryTouchEndX = 0;
    let confettiTriggered = false;

    // =====================
    // SPLASH SCREEN
    // =====================
    function initSplashSparkles() {
        const container = document.getElementById('splashSparkles');
        if (!container) return;
        const count = 25;
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.width = (Math.random() * 4 + 2) + 'px';
            sparkle.style.height = sparkle.style.width;
            sparkle.style.animationDelay = (Math.random() * 5) + 's';
            sparkle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            container.appendChild(sparkle);
        }
    }

    function openInvitation() {
        splash.classList.add('hidden');
        mainContent.classList.add('visible');
        musicToggle.classList.add('visible');
        document.body.style.overflow = 'auto';
        startMusic();
        triggerConfetti();
    }

    openBtn.addEventListener('click', openInvitation);

    // Prevent scroll while splash is visible
    document.body.style.overflow = 'hidden';
    initSplashSparkles();

    // =====================
    // MUSIC CONTROL
    // =====================
    function startMusic() {
        if (bgMusic && bgMusic.paused) {
            bgMusic.volume = 0.3;
            const playPromise = bgMusic.play();
            if (playPromise) {
                playPromise.then(function () {
                    isMusicPlaying = true;
                    updateMusicIcon();
                }).catch(function () {
                    // Autoplay blocked, user can toggle manually
                });
            }
        }
    }

    function toggleMusic() {
        if (!bgMusic) return;
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
        } else {
            bgMusic.volume = 0.3;
            bgMusic.play().then(function () {
                isMusicPlaying = true;
            }).catch(function () {
                isMusicPlaying = false;
            });
        }
        updateMusicIcon();
    }

    function updateMusicIcon() {
        if (isMusicPlaying) {
            musicOnIcon.style.display = 'block';
            musicOffIcon.style.display = 'none';
        } else {
            musicOnIcon.style.display = 'none';
            musicOffIcon.style.display = 'block';
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // =====================
    // HERO PARTICLES
    // =====================
    function initHeroParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        const count = 18;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = (50 + Math.random() * 50) + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = (Math.random() * 6) + 's';
            particle.style.animationDuration = (Math.random() * 4 + 5) + 's';
            container.appendChild(particle);
        }
    }

    initHeroParticles();

    // =====================
    // COUNTDOWN TIMER
    // =====================
    function updateCountdown() {
        const targetDate = new Date('2026-06-06T10:00:00').getTime();
        const now = Date.now();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById('cdDays').textContent = '🎉';
            document.getElementById('cdHours').textContent = '🌹';
            document.getElementById('cdMinutes').textContent = '✨';
            document.getElementById('cdSeconds').textContent = '🎂';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // =====================
    // GALLERY SLIDER
    // =====================
    const galleryTrack = document.getElementById('galleryTrack');
    const gallerySlides = galleryTrack ? galleryTrack.querySelectorAll('.gallery-slide') : [];
    const galleryDotsContainer = document.getElementById('galleryDots');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const totalSlides = gallerySlides.length;

    function initGalleryDots() {
        if (!galleryDotsContainer) return;
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', function () {
                goToSlide(parseInt(this.getAttribute('data-index')));
            });
            galleryDotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        galleryIndex = index;

        const slide = gallerySlides[index];
        if (!slide) return;
        const offset = slide.offsetLeft - (galleryTrack.parentElement.offsetWidth / 2) + (slide.offsetWidth / 2);
        galleryTrack.style.transform = 'translateX(' + (-offset) + 'px)';

        // Update dots
        const dots = galleryDotsContainer ? galleryDotsContainer.querySelectorAll('.gallery-dot') : [];
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        goToSlide(galleryIndex + 1);
    }

    function prevSlide() {
        goToSlide(galleryIndex - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch support
    if (galleryTrack) {
        galleryTrack.addEventListener('touchstart', function (e) {
            galleryTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        galleryTrack.addEventListener('touchend', function (e) {
            galleryTouchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const diff = galleryTouchStartX - galleryTouchEndX;
        const threshold = 50;
        if (diff > threshold) {
            nextSlide();
        } else if (diff < -threshold) {
            prevSlide();
        }
    }

    initGalleryDots();

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            goToSlide(galleryIndex);
        }, 150);
    });

    // =====================
    // SCROLL REVEAL
    // =====================
    function initScrollReveal() {
        const elements = document.querySelectorAll('.scroll-reveal');
        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('revealed'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger children slightly
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(function (el, i) {
            el.dataset.delay = (i % 4) * 100;
            observer.observe(el);
        });
    }

    initScrollReveal();

    // =====================
    // CONFETTI
    // =====================
    function triggerConfetti() {
        if (confettiTriggered) return;
        confettiTriggered = true;

        const container = document.getElementById('confettiContainer');
        if (!container) return;

        const colors = [
            '#C9A96E', '#D4B87A', '#E8D5A8', '#F5E6D3',
            '#FFFFFF', '#FFD700', '#F0C987', '#DAA520'
        ];
        const count = 60;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = '-10px';
            piece.style.width = (Math.random() * 8 + 4) + 'px';
            piece.style.height = (Math.random() * 8 + 4) + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDelay = (Math.random() * 2) + 's';
            piece.style.animationDuration = (Math.random() * 3 + 3) + 's';
            container.appendChild(piece);
        }

        // Clean up confetti after animation
        setTimeout(function () {
            container.innerHTML = '';
            confettiTriggered = false;
        }, 6000);
    }

    // Also trigger confetti when closing section is visible
    const closingSection = document.getElementById('closing');
    if (closingSection && 'IntersectionObserver' in window) {
        const closingObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    triggerConfetti();
                    closingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        closingObserver.observe(closingSection);
    }

    // =====================
    // LAZY LOADING IMAGES
    // =====================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });
        lazyImages.forEach(function (img) { imageObserver.observe(img); });
    }

    // =====================
    // SMOOTH SCROLL FOR ANCHORS (if any)
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =====================
    // AUTO-GALLERY (optional subtle)
    // =====================
    let autoGalleryInterval;
    function startAutoGallery() {
        autoGalleryInterval = setInterval(function () {
            if (galleryIndex < totalSlides - 1) {
                goToSlide(galleryIndex + 1);
            } else {
                goToSlide(0);
            }
        }, 5000);
    }

    function stopAutoGallery() {
        clearInterval(autoGalleryInterval);
    }

    // Start auto gallery when gallery is visible
    const gallerySection = document.getElementById('gallery');
    if (gallerySection && 'IntersectionObserver' in window) {
        const galleryObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    startAutoGallery();
                } else {
                    stopAutoGallery();
                }
            });
        }, { threshold: 0.3 });
        galleryObserver.observe(gallerySection);
    }

    // Stop auto gallery on user interaction
    if (prevBtn) prevBtn.addEventListener('click', stopAutoGallery);
    if (nextBtn) nextBtn.addEventListener('click', stopAutoGallery);
    if (galleryTrack) {
        galleryTrack.addEventListener('touchstart', stopAutoGallery, { passive: true });
    }

})();
