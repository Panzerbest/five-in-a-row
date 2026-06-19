# Five in a Row (五子棋)

A free, browser-based Gomoku game with a built-in AI opponent. No account, no signup, no tracking.

> 🎮 **Play now** → https://five-in-a-row.example.com

---

## What is this?

[Five in a Row](https://en.wikipedia.org/wiki/Gomoku) (also known as **Gomoku**, **Gobang**, or **Wuziqi** 五子棋) is one of the oldest board games still played — two players take turns placing stones on a 15 × 15 grid, and the first to line up five stones in a row wins.

This project is a tiny single-page web game you can play in any browser, with a competent AI opponent that loads in under **2 KB** of JavaScript.

## Features

- **Play against the computer** — random side to start, automatic win detection.
- **No backend** — the entire game (board state, AI, win check) runs in one HTML page.
- **No dependencies** — jQuery 1.11.3 is bundled locally; no CDN calls.
- **No tracking** — no analytics, no cookies set by the site itself (only Google AdSense, if you enable it).
- **Responsive** — the board scales to fit any screen from a 360 px phone to a 4 K display.
- **Static-served** — deploys as static HTML/CSS/JS with a small Worker for clean URLs.
- **Privacy and Terms pages** included.
- **SEO ready** — Open Graph, Twitter Cards, canonical URLs, sitemap, robots.txt.

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Vanilla HTML5 |
| Styling | Vanilla CSS3 (no Tailwind / no SCSS) |
| Game logic | jQuery 1.11.3 + [Zebra_Gomoku](https://github.com/stefangabos/Zebra_Gomoku) plugin (LGPL v3) |
| Edge runtime | Cloudflare Workers (clean-URL rewriting) |
| Hosting | Cloudflare Pages / Workers static assets |

**Bundle size:**

- `worker.js` — 23 lines, ~1 KB
- `zebragomoku.min.js` — 1.7 KB
- `site.css` — 15 KB
- `jquery.min.js` — 94 KB (vendored, also fine to swap to nothing if you remove the wrapper code)

## Project layout

```
five-in-a-row/
├── worker.js              Cloudflare Worker (clean-URL rewriting for /about, /privacy, /terms)
├── wrangler.toml          Wrangler deployment config
├── README.md              ← you are here
└── public/                Static assets — uploaded to Cloudflare as-is
    ├── index.html         Main game page
    ├── about.html         About page
    ├── privacy.html       Privacy policy
    ├── terms.html         Terms of service
    ├── site.css           Site styles (Chinese-paper-inspired theme)
    ├── zebragomoku.css    Board + stone styles
    ├── zebragomoku.min.js Game AI (1.7 KB)
    ├── jquery.min.js      Vendored jQuery 1.11.3
    ├── screenshot.png     Social-card preview image
    └── robots.txt         SEO
```

## How the Worker works

`worker.js` is a tiny Cloudflare Worker that runs on every request. It performs one job: **rewrite clean URLs to `.html` files**, so visitors can use `/about` instead of `/about.html`, and the bundled static files are still served naturally.

```js
// /about → /about.html (everything else falls through to Assets)
if (url.pathname !== '/' && !url.pathname.includes('.') && !url.pathname.endsWith('/')) {
  rewritten.pathname = url.pathname + '.html';
  return env.ASSETS.fetch(new Request(rewritten, request));
}
```

That's it. No KV, no D1, no Durable Objects — the Worker is purely a router.

## Deployment

### Option A — Cloudflare Pages / Workers via GitHub

1. **Push the repo to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
   ```

2. **Connect to Cloudflare**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create**.
   - Choose **Workers** (not Pages — the Worker must run for `/about`, `/privacy`, `/terms` to work).
   - **Connect to GitHub** → select your repo.
   - In **Build settings**:
     ```
     Build command:        (empty)
     Deploy command:       npx wrangler@latest deploy
     Build output dir:     (empty)
     Root directory:       /
     ```
   - Save and deploy. Every push to `main` will auto-deploy.

3. **Add a custom domain** in Workers → Settings → Triggers / Custom Domains.

### Option B — Deploy from your terminal (fastest)

No GitHub integration needed:

```bash
npm install -g wrangler      # one-time
wrangler login                # one-time, browser auth

cd five-in-a-row
npx wrangler deploy           # deploys worker.js + public/
```

That's the entire publish flow. Any time you change a file, just re-run `npx wrangler deploy`.

## Local development

Anyone can open `public/index.html` directly in a browser — no build step:

```bash
# Just open it
open public/index.html       # macOS
xdg-open public/index.html   # Linux
start public/index.html      # Windows
```

Or serve it with anything:

```bash
cd public
python3 -m http.server 8000   # → http://localhost:8000
```

> You may want to bind to ports 8000 and trust any local URL — the Worker won't be running locally, so `/about`, `/privacy`, and `/terms` will 404 unless you also run `wrangler dev`. For static-only local dev it's fine to edit the `_self`/`.html` links temporarily.

For full local simulation including the Worker:

```bash
npx wrangler dev
```

This spins up a local Cloudflare runtime at http://localhost:8787 with the Worker and Assets both running.

## License & credits

- **Game logic** — [Zebra_Gomoku](https://github.com/stefangabos/Zebra_Gomoku) by Stefan Gabos, distributed under [LGPL v3](https://www.gnu.org/licenses/lgpl-3.0.txt).
- **jQuery** — [jQuery Foundation](https://jquery.org/), MIT license.
- **Site design, copy, and original code** — MIT, do what you like.

The "Five in a Row" name and the visual theme (vermilion seals, parchment paper, the 五子 stamp) are part of this project's identity — please don't clone the design character-for-character into a competing product. Forking the code to operate your own Gomoku site is welcome.

## Contact

Found a bug or want to suggest a feature? Open an issue on GitHub, or email **hello@five-in-a-row.example.com**.
