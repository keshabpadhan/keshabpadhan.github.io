# Keshab Padhan — Developer Portfolio

A stunning, production-ready personal portfolio website built with **pure HTML5, CSS3, and vanilla JavaScript** — no frameworks.

Dark, modern, glassmorphism-styled, fully responsive, and recruiter-ready.

> **Live sections:** Home · About · Skills · Projects · Education · Coding Profiles · Achievements · Contact

---

## ✨ Features

- 🎨 Dark theme with cyan/purple neon accents & animated gradient background
- 🧊 Glassmorphism cards with glowing hover borders
- ⌨️ Typed.js typing effect in the hero
- 🪄 AOS.js scroll-reveal animations
- 🧭 Sticky navbar with blur-on-scroll + active-link scroll spy
- 📱 Fully responsive (mobile-first) with a hamburger menu
- 📊 Scroll progress bar + back-to-top button
- 📋 Copy-email-to-clipboard
- ✅ Contact form with custom JavaScript validation (+ `mailto:` fallback)
- ♿ Semantic HTML, ARIA labels, keyboard focus styles, `prefers-reduced-motion` support

---

## 📁 File Structure

```
portfolio/
├── index.html      # Markup — all sections
├── style.css       # All styles (design tokens, layout, animations, responsive)
├── script.js       # All behavior (typed, AOS, nav, form, scroll features)
├── README.md
└── assets/
    ├── images/
    │   └── avatar-placeholder.png    (optional — add your photo)
    └── resume/
        └── keshab-padhan-resume.pdf  (add your resume)
```

---

## 🚀 Run Locally

No build step needed — it's plain HTML/CSS/JS.

**Option 1 — Just open it**

Double-click `index.html`, or drag it into your browser.

**Option 2 — Local server (recommended, avoids any CDN/CORS quirks)**

```bash
# Python 3
python -m http.server 5500

# or Node (if you have it)
npx serve .
```

Then open <http://localhost:5500>.

**Option 3 — VS Code**

Install the **Live Server** extension → right-click `index.html` → *Open with Live Server*.

---

## 🛠️ Customize

Everything you need to personalize is clearly marked with `TODO` comments. Search the project for `TODO` to find each spot.

### 1. Add your real projects

Open `index.html` and find:

```html
<!-- REPLACE THIS WITH YOUR REAL PROJECTS -->
```

Each project is a `<article class="project-card ...">`. For every card, update:

- **Title** — `project-card__title`
- **Description** — `project-card__desc`
- **Tech tags** — the `<span class="tag">` items
- **Links** — the GitHub `href` and the Live Demo `href` (remove the demo button if there's no live site)

Duplicate a card to add more; delete cards you don't need.

### 2. Add your resume PDF

Put your resume at:

```
assets/resume/keshab-padhan-resume.pdf
```

The **Download Resume** buttons (Hero + About) already point there. If you use a different filename, update the two `href="assets/resume/..."` links in `index.html`.

### 3. Add a profile photo (optional)

The site uses stylized **KP** initials by default. To use a photo, drop it in `assets/images/` and follow the instructions in `assets/images/README.txt`.

### 4. Update skills / education / achievements

- **Skills:** In the Skills section, remove any `pill--todo` badges for tech you haven't learned yet (React, Node, MongoDB, etc.). Remove the `<span class="todo-tag">TODO</span>` markers once confirmed.
- **Education:** Confirm your years and add your GPA (marked `TODO`). Fill in or remove the school card.
- **Achievements:** Replace the placeholder cards under `<!-- ADD YOUR REAL ACHIEVEMENTS HERE -->`.

---

## 📬 Connect the Contact Form (Formspree)

By default the form uses a **`mailto:` fallback** — clicking *Send* opens the visitor's email app pre-filled. To collect submissions directly instead:

1. Create a free form at **<https://formspree.io>** and copy your endpoint (e.g. `https://formspree.io/f/abcdwxyz`).
2. In `index.html`, find the contact form and set its action:

   ```html
   <form class="contact__form" id="contactForm" action="https://formspree.io/f/abcdwxyz" method="POST">
   ```

3. In `script.js`, inside `initContactForm()`, replace the `mailto:` block (look for the `--- Submission ---` comment) with a `fetch()` POST:

   ```js
   const res = await fetch(form.action, {
       method: "POST",
       body: new FormData(form),
       headers: { Accept: "application/json" },
   });
   if (res.ok) {
       status.textContent = "✓ Message sent — thank you!";
       status.className = "form__status success";
       form.reset();
   } else {
       status.textContent = "Something went wrong. Please email me directly.";
       status.className = "form__status error";
   }
   ```

   (Make the submit handler `async` to use `await`.)

---

## 🌐 Deploy

### GitHub Pages

1. Create a repo (e.g. `portfolio`) and push these files.
2. Repo → **Settings → Pages**.
3. **Source:** *Deploy from a branch* → **Branch:** `main` → **Folder:** `/ (root)` → **Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo>/`.

> Tip: name the repo `<your-username>.github.io` to host it at the root URL.

### Netlify

1. Go to <https://app.netlify.com> → **Add new site → Deploy manually**.
2. Drag-and-drop the whole `portfolio/` folder.
3. Done — Netlify gives you a live URL (rename it in *Site settings*).

Alternatively, connect your GitHub repo for automatic deploys on every push. (**Vercel** works the same way.)

---

## 🔗 CDNs Used

- [Font Awesome 6](https://fontawesome.com/) — icons
- [Google Fonts](https://fonts.google.com/) — Space Grotesk, Inter, JetBrains Mono
- [AOS](https://michalsnik.github.io/aos/) — scroll animations
- [Typed.js](https://github.com/mattboldt/typed.js/) — hero typing effect

All are loaded via CDN — an internet connection is required for icons, fonts, and animations to appear.

---

## 📄 License

© 2025 Keshab Padhan. All rights reserved.
Feel free to use this as inspiration for your own portfolio.

---

**Designed & built with ❤️ by Keshab Padhan**
