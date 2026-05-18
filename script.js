/* ═══════════════════════════════════════════
   MEDINA ALMEYRA NOURAINI — 1ST BIRTHDAY
   Ultra-Premium Cinematic Experience
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── Cache DOM ─── */
    var splash     = document.getElementById('splash');
    var enterBtn   = document.getElementById('enterBtn');
    var app        = document.getElementById('app');
    var musicBtn   = document.getElementById('musicBtn');
    var bgMusic    = document.getElementById('bgMusic');
    var galleryTrack   = document.getElementById('galleryTrack');
    var galleryCaption = document.getElementById('galleryCaption');
    var gDotsCont      = document.getElementById('gDots');
    var gPrev      = document.getElementById('gPrev');
    var gNext      = document.getElementById('gNext');
    var viewer     = document.getElementById('imageViewer');
    var viewerImg  = document.getElementById('viewerImg');
    var viewerClose = document.getElementById('viewerClose');
    var confettiEl = document.getElementById('confetti');

    /* ─── State ─── */
    var musicPlaying = false;
    var gIndex = 0;
    var gTouchX0 = 0;
    var gAutoTimer = null;
    var confettiFired = false;

    /* ═══════════════════════════════
       SPLASH SPARKLES
       ═══════════════════════════════ */
    function createSparkles(parent, count) {
        for (var i = 0; i < count; i++) {
            var s = document.createElement('div');
            s.className = 'sp';
            var size = Math.random() * 4 + 2;
            s.style.cssText =
                'left:' + (Math.random() * 100) + '%;' +
                'top:' + (Math.random() * 100) + '%;' +
                'width:' + size + 'px;height:' + size + 'px;' +
                '--dur:' + (Math.random() * 3 + 4) + 's;' +
                '--del:' + (Math.random() * 5) + 's;';
            parent.appendChild(s);
        }
    }
    createSparkles(document.getElementById('splashCanvas'), 30);

    /* ═══════════════════════════════
       ENTER INVITATION
       ═══════════════════════════════ */
    function enter() {
        splash.classList.add('gone');
        app.classList.add('show');
        musicBtn.classList.add('show');
        document.body.style.overflow = '';
        playMusic();
        fireConfetti();
    }
    enterBtn.addEventListener('click', enter);
    document.body.style.overflow = 'hidden';

    /* ═══════════════════════════════
       MUSIC
       ═══════════════════════════════ */
    function playMusic() {
        if (!bgMusic) return;
        bgMusic.volume = 0.25;
        var p = bgMusic.play();
        if (p && p.then) {
            p.then(function () {
                musicPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(function () { /* blocked */ });
        }
    }

    musicBtn.addEventListener('click', function () {
        if (!bgMusic) return;
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.volume = 0.25;
            bgMusic.play().then(function () {
                musicPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(function () {});
        }
    });

    /* ═══════════════════════════════
       HERO PARTICLES
       ═══════════════════════════════ */
    (function () {
        var c = document.getElementById('heroParticles');
        for (var i = 0; i < 20; i++) {
            var p = document.createElement('div');
            p.className = 'sp';
            var sz = Math.random() * 4 + 2;
            p.style.cssText =
                'left:' + (Math.random() * 100) + '%;' +
                'top:' + (40 + Math.random() * 60) + '%;' +
                'width:' + sz + 'px;height:' + sz + 'px;' +
                '--dur:' + (Math.random() * 4 + 5) + 's;' +
                '--del:' + (Math.random() * 6) + 's;';
            c.appendChild(p);
        }
    })();

    /* ═══════════════════════════════
       COUNTDOWN
       ═══════════════════════════════ */
    var TARGET = new Date('2026-06-06T10:00:00').getTime();
    var cdD = document.getElementById('cDays');
    var cdH = document.getElementById('cHrs');
    var cdM = document.getElementById('cMin');
    var cdS = document.getElementById('cSec');

    function tick() {
        var d = TARGET - Date.now();
        if (d <= 0) {
            cdD.textContent = '🎉'; cdH.textContent = '🌹';
            cdM.textContent = '✨'; cdS.textContent = '🎂';
            return;
        }
        cdD.textContent = pad(Math.floor(d / 864e5));
        cdH.textContent = pad(Math.floor((d % 864e5) / 36e5));
        cdM.textContent = pad(Math.floor((d % 36e5) / 6e4));
        cdS.textContent = pad(Math.floor((d % 6e4) / 1e3));
    }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    tick();
    setInterval(tick, 1000);

    /* ═══════════════════════════════
       GALLERY
       ═══════════════════════════════ */
    var slides = galleryTrack ? galleryTrack.querySelectorAll('.gallery__slide') : [];
    var total  = slides.length;

    /* Build dots */
    for (var di = 0; di < total; di++) {
        var dot = document.createElement('div');
        dot.className = 'gallery__dot' + (di === 0 ? ' on' : '');
        dot.setAttribute('data-i', di);
        dot.addEventListener('click', function () {
            goSlide(parseInt(this.getAttribute('data-i')));
        });
        gDotsCont.appendChild(dot);
    }

    function goSlide(idx) {
        if (idx < 0) idx = 0;
        if (idx >= total) idx = total - 1;
        gIndex = idx;
        var slide = slides[idx];
        if (!slide) return;
        var vp = galleryTrack.parentElement;
        var offset = slide.offsetLeft - (vp.offsetWidth / 2) + (slide.offsetWidth / 2);
        galleryTrack.style.transform = 'translateX(' + (-offset) + 'px)';
        galleryCaption.textContent = slide.getAttribute('data-caption') || '';
        var dots = gDotsCont.querySelectorAll('.gallery__dot');
        for (var d = 0; d < dots.length; d++) {
            dots[d].classList.toggle('on', d === idx);
        }
    }

    function nextSlide() { goSlide(gIndex + 1); }
    function prevSlide() { goSlide(gIndex - 1); }

    gNext.addEventListener('click', function () { stopAuto(); nextSlide(); });
    gPrev.addEventListener('click', function () { stopAuto(); prevSlide(); });

    /* Touch */
    galleryTrack.addEventListener('touchstart', function (e) {
        gTouchX0 = e.changedTouches[0].clientX;
    }, { passive: true });
    galleryTrack.addEventListener('touchend', function (e) {
        var diff = gTouchX0 - e.changedTouches[0].clientX;
        stopAuto();
        if (diff > 45) nextSlide();
        else if (diff < -45) prevSlide();
    }, { passive: true });

    /* Auto-play */
    function startAuto() { gAutoTimer = setInterval(function () { goSlide((gIndex + 1) % total); }, 4500); }
    function stopAuto()  { clearInterval(gAutoTimer); }

    /* Observe gallery visibility */
    var gallerySection = document.getElementById('gallery');
    if (gallerySection && 'IntersectionObserver' in window) {
        var gObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) startAuto(); else stopAuto();
            });
        }, { threshold: 0.25 });
        gObs.observe(gallerySection);
    }

    /* Fullscreen viewer */
    slides.forEach(function (sl) {
        sl.addEventListener('click', function () {
            var img = sl.querySelector('img');
            if (!img) return;
            viewerImg.src = img.src;
            viewer.classList.add('open');
        });
    });
    viewerClose.addEventListener('click', function () {
        viewer.classList.remove('open');
    });
    viewer.addEventListener('click', function (e) {
        if (e.target === viewer) viewer.classList.remove('open');
    });

    /* Resize */
    var rTimer;
    window.addEventListener('resize', function () {
        clearTimeout(rTimer);
        rTimer = setTimeout(function () { goSlide(gIndex); }, 180);
    });

    /* ═══════════════════════════════
       SCROLL REVEAL
       ═══════════════════════════════ */
    (function () {
        var els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            for (var i = 0; i < els.length; i++) els[i].classList.add('visible');
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var d = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, d);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
        for (var j = 0; j < els.length; j++) obs.observe(els[j]);
    })();

    /* ═══════════════════════════════
       CONFETTI
       ═══════════════════════════════ */
    function fireConfetti() {
        if (confettiFired) return;
        confettiFired = true;
        var colors = ['#C4A469','#D4B97E','#E8D5C4','#F5EBE0','#FFFFFF','#FFD700','#F0C987','#DAA520','#FAE8D0'];
        for (var i = 0; i < 70; i++) {
            var p = document.createElement('div');
            p.className = 'confetti__piece';
            var w = Math.random() * 7 + 4;
            var h = Math.random() * 7 + 4;
            p.style.cssText =
                'left:' + (Math.random() * 100) + '%;' +
                'top:-12px;' +
                'width:' + w + 'px;height:' + h + 'px;' +
                'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
                'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';' +
                '--fall-del:' + (Math.random() * 2.2) + 's;' +
                '--fall-dur:' + (Math.random() * 3 + 3.5) + 's;' +
                '--rot:' + (Math.random() * 720 + 360) + 'deg;';
            confettiEl.appendChild(p);
        }
        setTimeout(function () {
            confettiEl.innerHTML = '';
            confettiFired = false;
        }, 7000);
    }

    /* Fire confetti again when closing section appears */
    var closingSec = document.getElementById('closing');
    if (closingSec && 'IntersectionObserver' in window) {
        var cObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    fireConfetti();
                    cObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.25 });
        cObs.observe(closingSec);
    }

    /* ═══════════════════════════════
       WISHES FLOATING SPARKLES
       ═══════════════════════════════ */
    (function () {
        var glow = document.getElementById('wishesGlow');
        if (!glow) return;
        for (var i = 0; i < 10; i++) {
            var s = document.createElement('div');
            s.className = 'sp';
            var sz = Math.random() * 3 + 1.5;
            s.style.cssText =
                'left:' + (Math.random() * 100) + '%;' +
                'top:' + (Math.random() * 100) + '%;' +
                'width:' + sz + 'px;height:' + sz + 'px;' +
                '--dur:' + (Math.random() * 4 + 5) + 's;' +
                '--del:' + (Math.random() * 6) + 's;';
            glow.appendChild(s);
        }
    })();

    /* ═══════════════════════════════
       SMOOTH ANCHOR SCROLL
       ═══════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

})();
