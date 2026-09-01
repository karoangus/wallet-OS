# WalletOS — کیف پول دیجیتال

<div dir="rtl">

یک کیف پول دیجیتال کاملاً آفلاین و محلی برای مدیریت **هزینه، درآمد، بودجه و اهداف مالی** —
بدون حساب کاربری، بدون سرور، بدون ردیابی. همهٔ داده‌ها فقط روی دستگاه خودتان می‌مانند.

</div>

A dependency-free, no-build static PWA (React bundle + IndexedDB + service worker) for
tracking cash/bank balances, transactions, budgets and savings goals — in Persian, RTL, and
fully functional offline.

---

## Quick start

```bash
npm run dev          # http://localhost:4173   (zero dependencies, Node 18+)
PORT=8080 npm run dev
```

No install step is required — `npm run dev` only starts `scripts/serve.mjs`, a ~120-line
static server. Any static host works too:

```bash
python3 -m http.server 8080     # also fine
```

> Use `https://` (or `localhost`) in production: service workers are not registered over
> plain HTTP, so the offline features silently degrade to "online only".

## Features

| Area | What's there |
| --- | --- |
| balances | Cash + bank wallets, kept in sync with every transaction |
| transactions | Income / expense, categories, tags, notes, running balance, Jalali dates |
| budgets | Per-category monthly budgets with progress |
| goals | Savings goals with contributions |
| reports | 14-day balance trend and category breakdowns |
| data | JSON backup export / restore, full reset |

## Project layout

```
index.html        App shell + bundled React app (the "program")
sw.js             Service worker: offline caching & update strategy
offline.html      Offline fallback page
manifest.json     PWA manifest
scripts/serve.mjs Zero-dependency static dev server
.github/          Pages deploy workflow
```

## Data, privacy and backups

All state lives in IndexedDB database **`walletos-db`** on the device (stores: `meta`,
`transactions`, `categories`, `tags`, `budgets`, `goals`). Nothing is ever sent anywhere —
there is no backend.

* **Backup** — Settings → backup produces `walletos-backup-YYYY-MM-DD.json`. Do this
  periodically; clearing browser data deletes everything irrecoverably.
* **Persistent storage** — on boot the app asks the browser for persistent storage so
  IndexedDB isn't evicted under storage pressure (`window.WOS.persistent` reports the answer).
* **Recovery** — if the app ever fails to render, a recovery card appears with *reload* and
  *wipe data* options. From the console you can also run:

  ```js
  await window.WOS.reset()   // clears caches, IndexedDB and the service worker, then reloads
  ```

## Service worker strategy

| Request | Strategy | Why |
| --- | --- | --- |
| Navigations | network-first, 2.5 s timeout → cached shell → `offline.html` | New deployments reach returning users instead of being cached forever |
| Same-origin assets | stale-while-revalidate | Instant loads that quietly self-heal |
| Google Fonts | cache-first in a size-capped cache | Avoids re-downloading fonts on every visit |
| Cross-origin | passthrough | We never break a request we don't own |

**Releasing a new version:** bump `VERSION` in `sw.js`. Old caches are deleted on activate, and
users with the app open get an in-app *“نسخهٔ جدید WalletOS آماده است”* prompt instead of a
stale session. Precache failures are tolerated per-file, so one missing asset can no longer
abort the whole install.

## Deployment

* **GitHub Pages** — run the *Deploy to GitHub Pages* workflow manually from the Actions tab
  (Settings → Pages → Source: *GitHub Actions* on first use).
* **Any static host** (Netlify, Cloudflare Pages, Vercel) — upload the repository root as-is;
  no build command, no output directory.

Everything is relative-path based (`./index.html`, `./sw.js`), so a project sub-path such as
`https://user.github.io/wallet-OS-Angus/` works without configuration.

## Notes & roadmap

The app itself is a prebuilt React bundle inside `index.html`; this repository wraps it with
the operational layer it was missing — offline reliability, update delivery, crash recovery,
accessibility fixes, docs and a dev server. Sensible next steps:

1. Extract the bundle into real `src/` modules with a bundler, so features can be reviewed and tested.
2. Add unit tests for the money/date helpers (Jalali conversion, running balances, budget math).
3. Add an automated Pages deployment on `main` once Pages is enabled.
4. Add a CSV export alongside the JSON backup.

## License

[MIT](LICENSE)
