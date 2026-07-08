(function () {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        initParticles();
        initHeroAnimations();
        initTyped();
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
        initCounterAnimation();
    }

    function initParticles() {
        const canvas = document.getElementById("particleCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        const count = Math.min(80, Math.floor(w * h / 12000));
        const goldRgb = "255, 209, 0";

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                alpha: Math.random() * 0.4 + 0.1,
            });
        }

        function draw() {
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
                ctx.fillStyle = `rgba(${goldRgb}, ${p.alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${goldRgb}, ${0.06 * (1 - dist / 120)})`;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();
    }

    function initHeroAnimations() {
        if (typeof gsap === "undefined") return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("#heroGreeting", { y: 40, opacity: 0, duration: 0.6 })
            .from("#heroName", { y: 50, opacity: 0, duration: 0.7 }, "-=0.3")
            .from("#heroTyped", { y: 40, opacity: 0, duration: 0.6 }, "-=0.3")
            .from("#heroBio", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
            .from("#heroCta .btn", { y: 30, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.3")
            .from("#heroSocials .social-icon", { y: 20, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.2")
            .from("#heroVisual", { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");

        gsap.to(".shape", {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            rotation: "random(-15, 15)",
            duration: "random(6, 10)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.3,
        });
    }

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
            startDelay: 400,
            loop: true,
            smartBackspace: true,
        });
    }

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
                    "✓ Thanks! Your mail app should open — otherwise email me directly.";
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

    function initCopyEmail() {
        const cards = $$("[data-copy]");
        if (!cards.length) return;

        cards.forEach((card) => {
            const copyIcon = $(".contact-card__copy", card);
            const value = card.getAttribute("data-copy");

            const doCopy = (e) => {
                if (!copyIcon || !copyIcon.contains(e.target)) return;
                e.preventDefault();
                copyToClipboard(value);
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

    function initTiltCards() {
        const cards = $$("[data-tilt]");
        if (!cards.length) return;

        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
                card.style.transition = "transform 0.5s ease";
                setTimeout(() => { card.style.transition = ""; }, 500);
            });
        });
    }

    function initScrollReveal() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const revealItems = $$(".reveal");
        revealItems.forEach((el) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 50,
                opacity: 0,
                duration: 0.7,
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
                duration: 0.5,
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
                y: 50,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: "back.out(1.4)",
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
                x: -40,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.15,
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
                scale: 0.95,
                duration: 0.5,
                delay: i * 0.1,
                ease: "back.out(1.4)",
            });
        });

        gsap.utils.toArray(".about__info-item").forEach((item, i) => {
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
    }

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
})();
