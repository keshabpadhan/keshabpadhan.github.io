/* =============================================================
   Keshab Padhan — Portfolio
   script.js  (Vanilla JS, no jQuery)

   Features:
     1.  AOS init (scroll reveal)
     2.  Typed.js hero typing effect
     3.  Sticky navbar w/ glassmorphism on scroll
     4.  Active nav link highlight on scroll (scroll spy)
     5.  Hamburger mobile menu toggle
     6.  Smooth scroll for nav links & buttons
     7.  Scroll progress bar
     8.  Back-to-top button
     9.  Contact form validation + success message (+ mailto fallback)
     10. Copy email to clipboard
   ============================================================= */

(function () {
    "use strict";

    /* ------------------------------------------------------------
       Helpers
    ------------------------------------------------------------ */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        initAOS();
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
    }

    /* ------------------------------------------------------------
       1. AOS — Animate On Scroll
    ------------------------------------------------------------ */
    function initAOS() {
        if (typeof AOS === "undefined") return;
        AOS.init({
            duration: 700,
            easing: "ease-out-cubic",
            once: true,
            offset: 60,
            disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768,
        });
    }

    /* ------------------------------------------------------------
       2. Typed.js — hero typing effect
    ------------------------------------------------------------ */
    function initTyped() {
        const el = $("#typed");
        if (!el || typeof Typed === "undefined") return;

        // eslint-disable-next-line no-new
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

    /* ------------------------------------------------------------
       3. Sticky navbar glassmorphism on scroll
    ------------------------------------------------------------ */
    function initNavbarScroll() {
        const navbar = $("#navbar");
        if (!navbar) return;

        const onScroll = () => {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ------------------------------------------------------------
       4. Scroll spy — active nav link highlight
    ------------------------------------------------------------ */
    function initScrollSpy() {
        const links = $$(".nav__link");
        if (!links.length) return;

        // Map: section id -> nav link
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

        // IntersectionObserver picks the section currently near the top
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(linkById.get(entry.target));
                    }
                });
            },
            {
                // Trigger when a section crosses the upper third of the viewport
                rootMargin: "-45% 0px -50% 0px",
                threshold: 0,
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    /* ------------------------------------------------------------
       5. Hamburger mobile menu
    ------------------------------------------------------------ */
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

        // Close after clicking a link
        $$(".nav__link", menu).forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
        });

        // Close when clicking outside the menu
        document.addEventListener("click", (e) => {
            if (
                menu.classList.contains("open") &&
                !menu.contains(e.target) &&
                !toggle.contains(e.target)
            ) {
                closeMenu();
            }
        });

        // Reset when resizing up to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    /* ------------------------------------------------------------
       6. Smooth scroll for in-page anchors
       (native CSS handles most; JS keeps it robust + offsets nav)
    ------------------------------------------------------------ */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            const href = anchor.getAttribute("href");
            if (href === "#" || href.length < 2) return;

            anchor.addEventListener("click", (e) => {
                const target = document.getElementById(href.slice(1));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                // Update the hash without an extra jump
                history.pushState(null, "", href);
            });
        });
    }

    /* ------------------------------------------------------------
       7. Scroll progress bar
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       8. Back-to-top button
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       9. Contact form validation
    ------------------------------------------------------------ */
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
                v.trim().length === 0
                    ? "Please enter your name."
                    : v.trim().length < 2
                    ? "Name is too short."
                    : "",
            email: (v) =>
                v.trim().length === 0
                    ? "Please enter your email."
                    : !emailRe.test(v.trim())
                    ? "Please enter a valid email address."
                    : "",
            subject: (v) =>
                v.trim().length === 0 ? "Please add a subject." : "",
            message: (v) =>
                v.trim().length === 0
                    ? "Please write a message."
                    : v.trim().length < 10
                    ? "Message should be at least 10 characters."
                    : "",
        };

        // Live validation once a field has been touched
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

            /* --- Submission ---
               No backend is connected yet, so we open the user's mail client
               with the message prefilled (mailto fallback).

               TO USE FORMSPREE INSTEAD:
                 1. Set the form's action to your Formspree endpoint in index.html.
                 2. Replace this block with a fetch() POST to form.action, e.g.:
                    const res = await fetch(form.action, {
                        method: "POST",
                        body: new FormData(form),
                        headers: { Accept: "application/json" },
                    });
            */
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

            // Clear the status message after a while
            window.setTimeout(() => {
                if (status) {
                    status.textContent = "";
                    status.className = "form__status";
                }
            }, 8000);
        });
    }

    /* ------------------------------------------------------------
       10. Copy email to clipboard
    ------------------------------------------------------------ */
    function initCopyEmail() {
        const cards = $$("[data-copy]");
        if (!cards.length) return;

        cards.forEach((card) => {
            const copyIcon = $(".contact-card__copy", card);
            const value = card.getAttribute("data-copy");

            const doCopy = (e) => {
                // Only intercept when the copy icon itself is clicked,
                // so the mailto link still works normally.
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

    /* ------------------------------------------------------------
       Toast helper
    ------------------------------------------------------------ */
    let toastTimer = null;
    function showToast(html) {
        const toast = $("#toast");
        if (!toast) return;
        toast.innerHTML = html;
        toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
    }

    /* ------------------------------------------------------------
       Dashboard Stats (GitHub & LeetCode)
    ------------------------------------------------------------ */
    async function initDashboardStats() {
        const githubUsername = "keshabpadhan";
        const leetcodeUsername = "keshabpadhan";

        // Elements
        const githubTotalEl = document.getElementById("github-total-contributions");
        const leetcodeSolvedEl = document.getElementById("leetcode-solved-count");
        const leetcodeStreakEl = document.getElementById("leetcode-streak-count");
        const leetcodeDatesEl = document.getElementById("leetcode-streak-dates");
        const leetcodeProgressEl = document.getElementById("leetcode-streak-progress");

        // Calendar Elements
        const calendarMonthsEl = document.getElementById("github-calendar-months");
        const calendarDaysEl = document.getElementById("github-calendar-days");
        const scrollContainer = document.getElementById("github-calendar-scroll");
        const sliderThumb = document.getElementById("github-slider-thumb");
        const sliderTrack = document.getElementById("github-slider-track");
        const prevBtn = document.getElementById("github-prev-btn");
        const nextBtn = document.getElementById("github-next-btn");

        // 1. Fetch GitHub Contributions
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
            
            // Set total text
            if (githubTotalEl) {
                githubTotalEl.textContent = `${total} contribution${total === 1 ? "" : "s"} in the last year`;
            }
            
            // Align calendar grid columns to start on Sunday of the week that contains oneYearAgo
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
            
            // We loop until currentDate exceeds today
            while (currentDate <= today) {
                const dateString = getYYYYMMDD(currentDate);
                const contrib = contributionMap.get(dateString) || { count: 0, level: 0 };
                
                daysHtml += `<div class="github-day-cell level-${contrib.level}" title="${contrib.count} contribution${contrib.count === 1 ? "" : "s"} on ${dateString}"></div>`;
                
                // Track months
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
            
            // Insert day cells
            calendarDaysEl.innerHTML = daysHtml;
            
            // Set exact column count for the grid template columns
            const totalCols = currentWeekIndex + (dayOfWeek > 0 ? 1 : 0);
            calendarMonthsEl.style.gridTemplateColumns = `repeat(${totalCols}, 11px)`;
            calendarDaysEl.style.gridTemplateColumns = `repeat(${totalCols}, 11px)`;
            calendarDaysEl.style.gridAutoColumns = "11px";
            
            // Insert month labels
            let monthsHtml = "";
            monthCols.forEach(m => {
                monthsHtml += `<span style="grid-column: ${m.col}">${m.name}</span>`;
            });
            calendarMonthsEl.innerHTML = monthsHtml;
            
            // Initialize slider
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
                fallback.push({
                    date: getYYYYMMDD(cur),
                    count: 0,
                    level: 0
                });
                cur.setDate(cur.getDate() + 1);
            }
            
            // Add a single contribution in December to match the screenshot layout
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
            
            // Automatically scroll to the end on load
            setTimeout(() => {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth;
                updateSlider();
            }, 150);
        }

        // 2. Fetch LeetCode Solved Count
        let solved = 7; // Static default fallback
        try {
            const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/solved`);
            if (response.ok) {
                const data = await response.json();
                solved = data.solvedProblem || solved;
                if (leetcodeSolvedEl) {
                    leetcodeSolvedEl.textContent = solved;
                }
            } else {
                throw new Error("Failed to fetch LeetCode solved count");
            }
        } catch (err) {
            console.warn("LeetCode Solved API error, using default:", err);
            if (leetcodeSolvedEl) {
                leetcodeSolvedEl.textContent = solved;
            }
        }

        // 3. Fetch LeetCode Streak / Active days
        let streak = 3; // Static default fallback
        let activeDays = 5; // Static default fallback
        try {
            const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/calendar`);
            if (response.ok) {
                const data = await response.json();
                streak = data.streak !== undefined ? data.streak : streak;
                activeDays = data.totalActiveDays !== undefined ? data.totalActiveDays : activeDays;

                if (leetcodeStreakEl) leetcodeStreakEl.textContent = streak;
                if (leetcodeDatesEl) leetcodeDatesEl.textContent = `${activeDays} days active`;

                animateLeetCodeProgress(streak);
            } else {
                throw new Error("Failed to fetch LeetCode calendar");
            }
        } catch (err) {
            console.warn("LeetCode Calendar API error, using defaults:", err);
            if (leetcodeStreakEl) leetcodeStreakEl.textContent = streak;
            if (leetcodeDatesEl) leetcodeDatesEl.textContent = `${activeDays} days active`;
            animateLeetCodeProgress(streak);
        }

        function animateLeetCodeProgress(streakVal) {
            if (!leetcodeProgressEl) return;
            const maxStreak = 7; // Streak of 7 fills the circle
            const dashArray = 251.2;
            const percent = Math.min(streakVal / maxStreak, 1);
            const offset = dashArray * (1 - percent);
            
            // Trigger animation after layout
            setTimeout(() => {
                leetcodeProgressEl.style.strokeDashoffset = offset;
            }, 100);
        }
    }
})();
