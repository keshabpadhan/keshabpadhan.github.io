(function () {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        initTheme();
        initPreloader();
        initCursor();
        initMagnetic();
        initParticles();
        initHeroAnimations();
        initTyped();
        initMarquee();
        initNavbarScroll();
        initScrollSpy();
        initMobileMenu();
        initSmoothScroll();
        initScrollProgress();
        initBackToTop();
        initContactForm();
        initCopyEmail();
        initDashboardStats();
        initTiltCards();
        initScrollReveal();
        initSkillBars();
        initCounterAnimation();
        initTerminal();
    }

    /* ==========================================================
       THEME (light / dark)
       ========================================================== */
    function initTheme() {
        const toggles = $$(".theme-toggle");
        if (!toggles.length) return;

        const root = document.documentElement;

        const applyIcon = () => {
            const isDark = root.getAttribute("data-theme") === "dark";
            toggles.forEach((toggle) => {
                const icon = $("i", toggle);
                if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
                toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
            });
        };
        applyIcon();

        const setTheme = (theme, animate) => {
            if (animate) root.classList.add("theme-flip");
            root.setAttribute("data-theme", theme);
            try {
                localStorage.setItem("kp-theme", theme);
            } catch (e) { /* ignore */ }
            refreshParticleColors();
            applyIcon();
            if (animate) {
                window.setTimeout(() => root.classList.remove("theme-flip"), 420);
            }
        };

        toggles.forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
                setTheme(next, true);
            });
        });

        window.__kpSetTheme = setTheme;
        window.__kpGetTheme = () => root.getAttribute("data-theme") || "light";
    }

    /* ==========================================================
       PRELOADER
       ========================================================== */
    function initPreloader() {
        const preloader = $("#preloader");
        const counterEl = $("#preloaderCounter");
        const bar = $("#preloaderBar");
        const wordEl = $("#preloaderWord");
        if (!preloader) return;

        const words = ["loading", "compiling", "hacking", "polishing", "ready"];
        let progress = 0;
        let finished = false;

        const finish = () => {
            if (finished) return;
            finished = true;
            if (wordEl) wordEl.textContent = "ready";
            preloader.classList.add("hidden");
            setTimeout(() => {
                preloader.style.display = "none";
            }, 700);
        };

        const tick = () => {
            progress += Math.random() * 14 + 6;
            if (progress >= 100) progress = 100;
            const pct = Math.floor(progress);
            if (counterEl) counterEl.textContent = pct;
            if (bar) bar.style.width = pct + "%";
            if (wordEl && pct < 100) {
                wordEl.textContent = words[Math.min(words.length - 2, Math.floor(pct / 26))];
            }
            if (progress < 100) {
                setTimeout(tick, 100);
            } else {
                finish();
            }
        };

        if (window.performance && performance.timing) {
            const onLoad = () => {
                setTimeout(() => {
                    if (!finished) finish();
                }, 300);
            };
            if (document.readyState === "complete") onLoad();
            else window.addEventListener("load", onLoad, { once: true });
        } else {
            setTimeout(finish, 200);
        }

        tick();
        setTimeout(finish, 4000);
    }

    /* ==========================================================
       CUSTOM CURSOR
       ========================================================== */
    function initCursor() {
        const cursor = $("#cursor");
        if (!cursor) return;
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

        let x = -100, y = -100;
        let cx = -100, cy = -100;
        let isDown = false;

        window.addEventListener("mousemove", (e) => {
            x = e.clientX;
            y = e.clientY;
        });

        window.addEventListener("mousedown", () => {
            isDown = true;
            cursor.classList.add("cursor--down");
        });
        window.addEventListener("mouseup", () => {
            isDown = false;
            cursor.classList.remove("cursor--down");
        });

        const loop = () => {
            cx += (x - cx) * 0.25;
            cy += (y - cy) * 0.25;
            cursor.style.left = cx + "px";
            cursor.style.top = cy + "px";
            requestAnimationFrame(loop);
        };
        loop();

        const interactive = "a, button, input, textarea, [data-tilt], .social-icon, .nav__toggle, .tag";
        document.addEventListener("mouseover", (e) => {
            if (e.target.closest(interactive)) cursor.classList.add("cursor--hover");
        });
        document.addEventListener("mouseout", (e) => {
            if (e.target.closest(interactive)) cursor.classList.remove("cursor--hover");
        });

        document.documentElement.style.cursor = "none";
    }

    /* ==========================================================
       MAGNETIC ELEMENTS
       ========================================================== */
    function initMagnetic() {
        const els = $$("[data-magnetic]:not(.social-icon)");
        if (!els.length) return;
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

        els.forEach((el) => {
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transition = "transform 0.15s ease-out";
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
            });
            el.addEventListener("mouseleave", () => {
                el.style.transition = "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
                el.style.transform = "";
            });
        });
    }

    /* ==========================================================
       PARTICLES (constellation)
       ========================================================== */
    let particleCtx = null;
    let particleList = [];
    let particleColors = ["22, 22, 22"];
    let particleW = 0;
    let particleH = 0;

    function getInkRgb() {
        const val = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
        const hex = val.replace("#", "");
        if (hex.length < 6) return "22, 22, 22";
        const n = parseInt(hex.slice(0, 6), 16);
        return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    }

    function refreshParticleColors() {
        const rgb = getInkRgb();
        particleColors = [rgb];
        particleList.forEach((p) => { p.color = rgb; });
    }

    function initParticles() {
        const canvas = document.getElementById("particleCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        particleCtx = ctx;
        let particles = [];
        particleList = particles;
        let w, h;

        function resize() {
            w = particleW = canvas.width = window.innerWidth;
            h = particleH = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        const count = Math.min(50, Math.floor(w * h / 16000));
        const ink = getInkRgb();

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 0.8,
                alpha: Math.random() * 0.35 + 0.08,
                color: ink,
            });
        }

        function draw() {
            if (!particleCtx) return;
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${particles[i].color}, ${0.04 * (1 - dist / 130)})`;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();
    }

    /* ==========================================================
       HERO ENTRANCE
       ========================================================== */
    function initHeroAnimations() {
        if (typeof gsap === "undefined") return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("#heroEyebrow", { y: 30, opacity: 0, duration: 0.5 })
            .from("#heroTitle .hero__word", {
                y: "110%",
                opacity: 0,
                duration: 0.9,
                stagger: 0.14,
                ease: "expo.out",
            }, "-=0.2")
            .from("#heroLead", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
            .from("#heroCta .btn", { y: 24, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
            .from("#heroSocials .social-icon", { y: 16, opacity: 0, duration: 0.4, stagger: 0.07 }, "-=0.2")
            .from("#heroVisual", { scale: 0.7, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=0.7")
            .from(".hero__marquee", { y: 40, opacity: 0, duration: 0.6 }, "-=0.5");
    }

    /* ==========================================================
       TYPED TEXT
       ========================================================== */
    function initTyped() {
        const el = $("#typed");
        if (!el || typeof Typed === "undefined") return;

        new Typed("#typed", {
            strings: [
                "2nd Year BTech CS Student",
                "Aspiring Software Developer",
                "DSA Problem Solver",
                "Web Developer",
                "Open Source Enthusiast",
            ],
            typeSpeed: 55,
            backSpeed: 30,
            backDelay: 1600,
            startDelay: 900,
            loop: true,
            smartBackspace: true,
        });
    }

    /* ==========================================================
       MARQUEE
       ========================================================== */
    function initMarquee() {
        const track = $(".hero__marquee-track");
        if (!track) return;
        track.innerHTML += track.innerHTML;
    }

    /* ==========================================================
       NAVBAR
       ========================================================== */
    function initNavbarScroll() {
        const navbar = $("#navbar");
        if (!navbar) return;

        const onScroll = () => {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    function initScrollSpy() {
        const links = $$(".nav__link");
        if (!links.length) return;

        const linkById = new Map();
        links.forEach((link) => {
            const id = link.getAttribute("href").replace("#", "");
            const section = document.getElementById(id);
            if (section) linkById.set(section, link);
        });

        const sections = Array.from(linkById.keys());
        if (!sections.length) return;

        const setActive = (activeLink) => {
            links.forEach((l) => l.classList.remove("active"));
            if (activeLink) activeLink.classList.add("active");
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(linkById.get(entry.target));
                    }
                });
            },
            {
                rootMargin: "-45% 0px -50% 0px",
                threshold: 0,
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    function initMobileMenu() {
        const toggle = $("#navToggle");
        const menu = $("#navMenu");
        if (!toggle || !menu) return;

        const closeMenu = () => {
            menu.classList.remove("open");
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
            document.body.classList.remove("body-no-scroll");
        };

        const openMenu = () => {
            menu.classList.add("open");
            toggle.classList.add("active");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close menu");
            document.body.classList.add("body-no-scroll");
        };

        toggle.addEventListener("click", () => {
            menu.classList.contains("open") ? closeMenu() : openMenu();
        });

        $$(".nav__link", menu).forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
        });

        document.addEventListener("click", (e) => {
            if (
                menu.classList.contains("open") &&
                !menu.contains(e.target) &&
                !toggle.contains(e.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            const href = anchor.getAttribute("href");
            if (href === "#" || href.length < 2) return;

            anchor.addEventListener("click", (e) => {
                const target = document.getElementById(href.slice(1));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                history.pushState(null, "", href);
            });
        });
    }

    function initScrollProgress() {
        const bar = $("#scrollProgress");
        if (!bar) return;

        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = pct + "%";
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
    }

    function initBackToTop() {
        const btn = $("#backToTop");
        if (!btn) return;

        const onScroll = () => {
            btn.classList.toggle("show", window.scrollY > 500);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ==========================================================
       CONTACT FORM
       ========================================================== */
    function initContactForm() {
        const form = $("#contactForm");
        if (!form) return;

        const status = $("#formStatus");
        const fields = {
            name: $("#name", form),
            email: $("#email", form),
            subject: $("#subject", form),
            message: $("#message", form),
        };

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const setError = (field, msg) => {
            if (!field) return;
            const errEl = $(`[data-error-for="${field.id}"]`, form);
            field.classList.toggle("invalid", Boolean(msg));
            field.setAttribute("aria-invalid", msg ? "true" : "false");
            if (errEl) errEl.textContent = msg || "";
        };

        const validators = {
            name: (v) =>
                v.trim().length === 0 ? "Please enter your name."
                    : v.trim().length < 2 ? "Name is too short." : "",
            email: (v) =>
                v.trim().length === 0 ? "Please enter your email."
                    : !emailRe.test(v.trim()) ? "Please enter a valid email address." : "",
            subject: (v) =>
                v.trim().length === 0 ? "Please add a subject." : "",
            message: (v) =>
                v.trim().length === 0 ? "Please write a message."
                    : v.trim().length < 10 ? "Message should be at least 10 characters." : "",
        };

        Object.entries(fields).forEach(([key, field]) => {
            if (!field) return;
            field.addEventListener("blur", () => setError(field, validators[key](field.value)));
            field.addEventListener("input", () => {
                if (field.classList.contains("invalid")) {
                    setError(field, validators[key](field.value));
                }
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let valid = true;
            let firstInvalid = null;

            Object.entries(fields).forEach(([key, field]) => {
                const msg = validators[key](field.value);
                setError(field, msg);
                if (msg) {
                    valid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            });

            if (!valid) {
                if (status) {
                    status.textContent = "Please fix the errors above.";
                    status.className = "form__status error";
                }
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const name = encodeURIComponent(fields.name.value.trim());
            const email = encodeURIComponent(fields.email.value.trim());
            const subject = encodeURIComponent(fields.subject.value.trim());
            const message = encodeURIComponent(fields.message.value.trim());
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;

            window.location.href =
                `mailto:thekeshabpadhan@gmail.com?subject=${subject}&body=${body}`;

            if (status) {
                status.textContent =
                    "Thanks! Your mail app should open — otherwise email me directly.";
                status.className = "form__status success";
            }
            form.reset();
            showToast('<i class="fa-solid fa-circle-check"></i> Message ready to send!');

            window.setTimeout(() => {
                if (status) {
                    status.textContent = "";
                    status.className = "form__status";
                }
            }, 8000);
        });
    }

    /* ==========================================================
       COPY EMAIL
       ========================================================== */
    function initCopyEmail() {
        const cards = $$("[data-copy]");
        if (!cards.length) return;

        cards.forEach((card) => {
            const copyIcon = $(".contact-card__copy", card);
            const value = card.getAttribute("data-copy");

            const doCopy = (e) => {
                if (copyIcon && copyIcon.contains(e.target)) {
                    e.preventDefault();
                    copyToClipboard(value);
                }
                // Allow default behavior (mailto) for other clicks
            };

            card.addEventListener("click", doCopy);
        });
    }

    function copyToClipboard(text) {
        const done = () =>
            showToast('<i class="fa-solid fa-circle-check"></i> Copied to clipboard!');

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else {
            fallbackCopy(text, done);
        }
    }

    function fallbackCopy(text, done) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
            done();
        } catch (err) {
            showToast('<i class="fa-solid fa-triangle-exclamation"></i> Copy failed');
        }
        document.body.removeChild(ta);
    }

    let toastTimer = null;
    function showToast(html) {
        const toast = $("#toast");
        if (!toast) return;
        toast.innerHTML = html;
        toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
    }

    /* ==========================================================
       3D TILT CARDS
       ========================================================== */
    function initTiltCards() {
        const cards = $$("[data-tilt]");
        if (!cards.length) return;
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
                card.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
                setTimeout(() => { card.style.transition = ""; }, 600);
            });
        });
    }

    /* ==========================================================
       SCROLL REVEALS
       ========================================================== */
    function initScrollReveal() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const revealItems = $$(".reveal");
        revealItems.forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 50,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.05,
                ease: "power3.out",
            });
        });

        const sectionHeads = $$(".section__head");
        sectionHeads.forEach((head) => {
            gsap.from(head, {
                scrollTrigger: {
                    trigger: head,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
            });
        });

        const skillCards = $$(".skills__card");
        skillCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
                y: 60,
                opacity: 0,
                scale: 0.96,
                duration: 0.55,
                delay: i * 0.08,
                ease: "back.out(1.4)",
            });
        });

        const projectCards = $$(".project-card");
        projectCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 70,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.12,
                ease: "power3.out",
            });
        });

        const timelineItems = $$(".timeline__item");
        timelineItems.forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                x: i % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.12,
                ease: "power3.out",
            });
        });

        const codingCards = $$(".coding-card");
        codingCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
                y: 40,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: "back.out(1.4)",
            });
        });

        const achievementCards = $$(".achievement-card");
        achievementCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
                y: 40,
                opacity: 0,
                scale: 0.92,
                duration: 0.5,
                delay: i * 0.1,
                ease: "back.out(1.4)",
            });
        });

        gsap.utils.toArray(".about__fact").forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
                y: 30,
                opacity: 0,
                duration: 0.4,
                delay: i * 0.06,
                ease: "power2.out",
            });
        });

        const contactCards = $$(".contact-card");
        contactCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
                x: -40,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.08,
                ease: "power3.out",
            });
        });

        gsap.from(".contact__form", {
            scrollTrigger: {
                trigger: ".contact__form",
                start: "top 88%",
                toggleActions: "play none none none",
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
        });

        const sectionIndexes = $$(".section__index");
        sectionIndexes.forEach((el) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
                scale: 0.6,
                opacity: 0,
                rotate: -8,
                duration: 0.6,
                ease: "back.out(1.6)",
            });
        });
    }

    /* ==========================================================
       SKILL BARS
       ========================================================== */
    function initSkillBars() {
        const bars = $$(".skill-bar");
        if (!bars.length) return;

        const fillBar = (bar) => {
            const fill = $(".skill-bar__fill", bar);
            if (!fill) return;
            const level = parseInt(bar.getAttribute("data-level"), 10);
            if (isNaN(level)) return;
            fill.style.width = level + "%";
        };

        if (typeof IntersectionObserver !== "undefined") {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            fillBar(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.3 }
            );
            bars.forEach((bar) => observer.observe(bar));
        } else {
            bars.forEach(fillBar);
        }
    }

    /* ==========================================================
       DASHBOARD COUNTERS
       ========================================================== */
    function initCounterAnimation() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        const counters = $$(".counter-num[data-target]");
        counters.forEach((el) => {
            const target = parseInt(el.getAttribute("data-target"), 10);
            if (target <= 0) return;

            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(el, {
                        duration: 1.5,
                        ease: "power2.out",
                        innerHTML: target,
                        snap: { innerHTML: 1 },
                        modifiers: {
                            innerHTML: (val) => Math.round(parseFloat(val)).toString(),
                        },
                    });
                },
                once: true,
            });
        });
    }

    /* ==========================================================
       DASHBOARD STATS (GitHub / LeetCode)
       ========================================================== */
    async function initDashboardStats() {
        const githubUsername = "keshabpadhan";
        const leetcodeUsername = "keshabpadhan";

        const githubTotalEl = document.getElementById("github-total-contributions");
        const leetcodeSolvedEl = document.getElementById("leetcode-solved-count");
        const leetcodeStreakEl = document.getElementById("leetcode-streak-count");
        const leetcodeDatesEl = document.getElementById("leetcode-streak-dates");

        const calendarMonthsEl = document.getElementById("github-calendar-months");
        const calendarDaysEl = document.getElementById("github-calendar-days");
        const scrollContainer = document.getElementById("github-calendar-scroll");
        const sliderThumb = document.getElementById("github-slider-thumb");
        const sliderTrack = document.getElementById("github-slider-track");
        const prevBtn = document.getElementById("github-prev-btn");
        const nextBtn = document.getElementById("github-next-btn");

        try {
            const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}`);
            if (response.ok) {
                const data = await response.json();
                if (data.contributions && data.contributions.length > 0) {
                    renderCalendar(data.contributions);
                } else {
                    throw new Error("Empty contributions");
                }
            } else {
                throw new Error("Failed to fetch contributions");
            }
        } catch (err) {
            console.warn("GitHub Contributions API error, using static fallback:", err);
            renderCalendar(generateFallbackContributions());
        }

        function renderCalendar(contributionsList) {
            if (!calendarMonthsEl || !calendarDaysEl) return;

            calendarMonthsEl.innerHTML = "";
            calendarDaysEl.innerHTML = "";

            const contributionMap = new Map();
            let total = 0;
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            const oneYearAgo = new Date(today);
            oneYearAgo.setDate(today.getDate() - 365);

            contributionsList.forEach(item => {
                contributionMap.set(item.date, item);
                const itemDate = new Date(item.date);
                if (itemDate >= oneYearAgo && itemDate <= today) {
                    total += item.count;
                }
            });

            if (githubTotalEl) {
                githubTotalEl.textContent = `${total} contribution${total === 1 ? "" : "s"} in the last year`;
            }

            const startSunday = new Date(oneYearAgo);
            startSunday.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());
            startSunday.setHours(0, 0, 0, 0);

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthCols = [];
            let lastMonth = -1;

            let currentDate = new Date(startSunday);
            let dayOfWeek = 0;
            let currentWeekIndex = 0;

            let daysHtml = "";

            const getYYYYMMDD = (d) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const dateVal = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${dateVal}`;
            };

            while (currentDate <= today) {
                const dateString = getYYYYMMDD(currentDate);
                const contrib = contributionMap.get(dateString) || { count: 0, level: 0 };

                daysHtml += `<div class="github-day-cell level-${contrib.level}" title="${contrib.count} contribution${contrib.count === 1 ? "" : "s"} on ${dateString}"></div>`;

                const m = currentDate.getMonth();
                if (m !== lastMonth) {
                    if (currentDate.getDate() <= 7 || lastMonth === -1) {
                        monthCols.push({
                            name: monthNames[m],
                            col: currentWeekIndex + 1
                        });
                        lastMonth = m;
                    }
                }

                dayOfWeek++;
                if (dayOfWeek === 7) {
                    dayOfWeek = 0;
                    currentWeekIndex++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            calendarDaysEl.innerHTML = daysHtml;

            const totalCols = currentWeekIndex + (dayOfWeek > 0 ? 1 : 0);
            calendarMonthsEl.style.gridTemplateColumns = `repeat(${totalCols}, 11px)`;
            calendarDaysEl.style.gridTemplateColumns = `repeat(${totalCols}, 11px)`;
            calendarDaysEl.style.gridAutoColumns = "11px";

            let monthsHtml = "";
            monthCols.forEach(m => {
                monthsHtml += `<span style="grid-column: ${m.col}">${m.name}</span>`;
            });
            calendarMonthsEl.innerHTML = monthsHtml;

            initSlider();
        }

        function generateFallbackContributions() {
            const fallback = [];
            const today = new Date();
            const start = new Date(today);
            start.setDate(today.getDate() - 370);

            const getYYYYMMDD = (d) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const dateVal = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${dateVal}`;
            };

            let cur = new Date(start);
            while (cur <= today) {
                fallback.push({ date: getYYYYMMDD(cur), count: 0, level: 0 });
                cur.setDate(cur.getDate() + 1);
            }

            const decYear = today.getFullYear() - (today.getMonth() < 11 ? 1 : 0);
            const decDate = new Date(decYear, 11, 15);
            const decStr = getYYYYMMDD(decDate);
            const targetItem = fallback.find(item => item.date === decStr);
            if (targetItem) {
                targetItem.count = 1;
                targetItem.level = 4;
            }
            return fallback;
        }

        function initSlider() {
            if (!scrollContainer || !sliderThumb || !sliderTrack) return;

            function updateSlider() {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
                const scrollableWidth = scrollWidth - clientWidth;

                if (scrollableWidth <= 0) {
                    sliderThumb.style.width = "100%";
                    sliderThumb.style.left = "0px";
                    return;
                }

                const visibleRatio = clientWidth / scrollWidth;
                const trackWidth = sliderTrack.clientWidth;
                const thumbWidth = Math.max(trackWidth * visibleRatio, 30);
                sliderThumb.style.width = `${thumbWidth}px`;

                const scrollPercent = scrollLeft / scrollableWidth;
                const maxThumbLeft = trackWidth - thumbWidth;
                sliderThumb.style.left = `${scrollPercent * maxThumbLeft}px`;
            }

            scrollContainer.removeEventListener("scroll", updateSlider);
            scrollContainer.addEventListener("scroll", updateSlider);

            window.removeEventListener("resize", updateSlider);
            window.addEventListener("resize", updateSlider);

            if (prevBtn) {
                prevBtn.onclick = () => {
                    scrollContainer.scrollBy({ left: -120, behavior: "smooth" });
                };
            }
            if (nextBtn) {
                nextBtn.onclick = () => {
                    scrollContainer.scrollBy({ left: 120, behavior: "smooth" });
                };
            }

            let isDragging = false;
            let startX = 0;
            let startScrollLeft = 0;

            sliderThumb.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startScrollLeft = scrollContainer.scrollLeft;
                document.body.style.userSelect = "none";
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            };

            function onMouseMove(e) {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                const trackWidth = sliderTrack.clientWidth;
                const thumbWidth = sliderThumb.clientWidth;
                const maxThumbLeft = trackWidth - thumbWidth;

                const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                if (scrollableWidth <= 0) return;

                const ratio = deltaX / maxThumbLeft;
                scrollContainer.scrollLeft = startScrollLeft + ratio * scrollableWidth;
            }

            function onMouseUp() {
                isDragging = false;
                document.body.style.userSelect = "";
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            sliderTrack.onclick = (e) => {
                if (e.target === sliderThumb) return;
                const clickX = e.offsetX;
                const trackWidth = sliderTrack.clientWidth;
                const thumbWidth = sliderThumb.clientWidth;
                const scrollPercent = Math.min(Math.max((clickX - thumbWidth / 2) / (trackWidth - thumbWidth), 0), 1);

                const scrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                scrollContainer.scrollTo({
                    left: scrollPercent * scrollableWidth,
                    behavior: "smooth"
                });
            };

            updateSlider();

            setTimeout(() => {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth;
                updateSlider();
            }, 150);
        }

        let solved = 7;
        try {
            const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/solved`);
            if (response.ok) {
                const data = await response.json();
                solved = data.solvedProblem || solved;
                if (leetcodeSolvedEl) {
                    leetcodeSolvedEl.textContent = solved;
                    leetcodeSolvedEl.setAttribute("data-target", solved);
                }
            } else {
                throw new Error("Failed to fetch LeetCode solved count");
            }
        } catch (err) {
            console.warn("LeetCode Solved API error, using default:", err);
            if (leetcodeSolvedEl) {
                leetcodeSolvedEl.textContent = solved;
                leetcodeSolvedEl.setAttribute("data-target", solved);
            }
        }

        let streak = 3;
        let activeDays = 5;
        try {
            const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/calendar`);
            if (response.ok) {
                const data = await response.json();
                streak = data.streak !== undefined ? data.streak : streak;
                activeDays = data.totalActiveDays !== undefined ? data.totalActiveDays : activeDays;

                if (leetcodeStreakEl) {
                    leetcodeStreakEl.textContent = streak;
                    leetcodeStreakEl.setAttribute("data-target", streak);
                }
                if (leetcodeDatesEl) leetcodeDatesEl.textContent = `${activeDays} days active`;
            } else {
                throw new Error("Failed to fetch LeetCode calendar");
            }
        } catch (err) {
            console.warn("LeetCode Calendar API error, using defaults:", err);
            if (leetcodeStreakEl) {
                leetcodeStreakEl.textContent = streak;
                leetcodeStreakEl.setAttribute("data-target", streak);
            }
            if (leetcodeDatesEl) leetcodeDatesEl.textContent = `${activeDays} days active`;
        }
    }
    /* ==========================================================
       TERMINAL (hero)
       ========================================================== */
    function initTerminal() {
        const terminal = $("#terminal");
        const linesEl = $("#terminalLines");
        const input = $("#terminalInput");
        const clockEl = $("#terminalClock");
        const bodyEl = $("#terminalBody");
        if (!terminal || !linesEl || !input) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const pad = (n) => String(n).padStart(2, "0");
        const updateClock = () => {
            if (!clockEl) return;
            const d = new Date();
            clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };
        updateClock();
        setInterval(updateClock, 1000);

        const scrollBottom = () => {
            if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
        };

        const addLine = (html, className) => {
            const div = document.createElement("div");
            div.className = "t-line" + (className ? " " + className : "");
            div.innerHTML = html;
            linesEl.appendChild(div);
            scrollBottom();
            return div;
        };

        const output = (text) => {
            addLine(`<span class="t-line__text t-out"></span>`).querySelector(".t-line__text").textContent = text;
        };

        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

        const typeText = async (target, text, speed) => {
            if (reduceMotion) {
                target.textContent = text;
                scrollBottom();
                return;
            }
            for (let i = 0; i < text.length; i++) {
                target.textContent = text.slice(0, i + 1);
                scrollBottom();
                await sleep(speed);
            }
        };

        const typeCommand = async (cmd) => {
            const line = addLine("");
            const prompt = document.createElement("span");
            prompt.className = "t-line__prompt";
            prompt.textContent = "keshab@portfolio:$";
            const textEl = document.createElement("span");
            textEl.className = "t-line__text t-cmd";
            line.appendChild(prompt);
            line.appendChild(textEl);
            await typeText(textEl, cmd, reduceMotion ? 0 : 22);
        };

        const typeOutput = (text) => {
            const line = addLine("");
            const textEl = document.createElement("span");
            textEl.className = "t-line__text t-out";
            line.appendChild(textEl);
            return typeText(textEl, text, reduceMotion ? 0 : 10);
        };

        const HELP = [
            "Available commands:",
            "  about     — who I am",
            "  skills    — my tech stack",
            "  projects  — what I'm building",
            "  contact   — how to reach me",
            "  socials   — profile links",
            "  theme     — toggle light / dark",
            "  date      — current time",
            "  clear     — clear the screen",
            "",
            'Type a command and press Enter.'
        ].join("\n");

        const runCommand = async (raw) => {
            const cmd = (raw || "").trim();
            if (cmd) await typeCommand(cmd);

            const parts = cmd.toLowerCase().split(/\s+/);
            const key = parts[0] || "";

            switch (key) {
                case "help":
                    await typeOutput(HELP);
                    break;
                case "about":
                    await typeOutput(
                        "Keshab Padhan — 2nd year BTech Computer Science @ SOA ITER.\n" +
                        "Aspiring software developer, DSA problem solver & web developer.\n" +
                        "Open to internships in 2026."
                    );
                    break;
                case "skills":
                    await typeOutput(
                        "Languages : C · C++ · Java · Python · JavaScript\n" +
                        "Frontend  : HTML · CSS · JavaScript · React (learning)\n" +
                        "Backend   : Node.js · Express.js (learning)\n" +
                        "Database  : SQL · MySQL · MongoDB (learning)\n" +
                        "Tools     : Git · GitHub · VS Code · Linux · Postman\n" +
                        "Core      : DSA · OOP · DBMS · OS · Computer Networks"
                    );
                    break;
                case "projects":
                    await typeOutput(
                        "3 projects in the works (see the Projects section below).\n" +
                        "All experiments live at github.com/keshabpadhan"
                    );
                    break;
                case "contact":
                case "socials":
                    await typeOutput(
                        "email    : thekeshabpadhan@gmail.com\n" +
                        "github   : github.com/keshabpadhan\n" +
                        "linkedin : linkedin.com/in/keshabpadhan\n" +
                        "leetcode : leetcode.com/u/keshabpadhan"
                    );
                    break;
                case "theme":
                    if (typeof window.__kpSetTheme === "function") {
                        const next = window.__kpGetTheme() === "dark" ? "light" : "dark";
                        window.__kpSetTheme(next, true);
                        await typeOutput(`theme switched to ${next}`);
                    }
                    break;
                case "date":
                    await typeOutput(new Date().toString());
                    break;
                case "clear":
                    linesEl.innerHTML = "";
                    break;
                case "whoami":
                    await typeOutput("keshabpadhan");
                    break;
                case "":
                    break;
                default:
                    await typeOutput(`command not found: ${key}. Type "help" to see commands.`);
            }
        };

        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const value = input.value;
            input.value = "";
            runCommand(value);
        });

        terminal.addEventListener("click", () => input.focus());

        const playIntro = async () => {
            await sleep(700);
            await typeCommand("whoami");
            await typeOutput("keshabpadhan — CS undergrad @ SOA ITER, batch of 2029");
            await sleep(120);
            await typeCommand("cat status.txt");
            await typeOutput(
                "> 2nd year BTech Computer Science\n" +
                "> DSA · Web Development · Problem Solving\n" +
                "> status: open to internships — 2026"
            );
            await sleep(180);
            await typeCommand("help");
            await typeOutput(HELP);
            if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                input.focus();
            }
        };

        playIntro();
    }
})();
