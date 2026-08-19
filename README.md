# 💙 WalletOS — کیف پول دیجیتال

اپ مدیریت مالی شخصی، کاملاً آفلاین، PWA قابل نصب روی گوشی و دسکتاپ.

---

## ساختار پروژه

```
walletos-github/
├── .github/
│   └── workflows/
│       └── deploy.yml      ← GitHub Actions (خودکار build + deploy)
├── public/
│   ├── manifest.json       ← تنظیمات PWA
│   ├── sw.js               ← Service Worker (آفلاین)
│   └── icons/              ← آیکون‌های اپ
├── src/
│   ├── App.jsx             ← کل اپلیکیشن
│   └── main.jsx            ← نقطه ورود React
├── index.html              ← ورودی Vite
├── vite.config.js          ← تنظیمات build
└── package.json
```

---

## 🚀 راه‌اندازی (۵ مرحله)

### مرحله ۱ — ساخت ریپو گیت‌هاب

1. برو به [github.com/new](https://github.com/new)
2. اسم ریپو رو بذار: `walletos`
3. Public باشه (برای GitHub Pages رایگان)
4. **هیچ فایلی** (README، gitignore) موقع ساخت اضافه نکن
5. دکمه **Create repository** رو بزن

---

### مرحله ۲ — آپلود فایل‌ها

**روش ساده (بدون Git):**
1. توی ریپوی جدیدت، روی **Add file → Upload files** بزن
2. همه محتوای این پوشه رو انتخاب کن (نه خود پوشه، محتواش رو)
3. مطمئن شو این فایل‌ها هستن:
   - `.github/workflows/deploy.yml`
   - `public/manifest.json`
   - `public/sw.js`
   - `public/icons/` (همه پنگ‌ها)
   - `src/App.jsx`
   - `src/main.jsx`
   - `index.html`
   - `vite.config.js`
   - `package.json`
   - `.gitignore`
4. پایین صفحه **Commit changes** بزن

---

### مرحله ۳ — فعال‌کردن GitHub Pages

1. توی ریپو برو به **Settings** (بالای صفحه)
2. سمت چپ، **Pages** رو بزن
3. زیر **Build and deployment**:
   - Source: **GitHub Actions** رو انتخاب کن
4. ذخیره کن

---

### مرحله ۴ — صبر برای build خودکار

بعد از آپلود فایل‌ها، گیت‌هاب خودکار:
1. کد رو build می‌کنه (حدود ۱-۲ دقیقه)
2. روی GitHub Pages دیپلوی می‌کنه

وضعیت رو از **Actions** (تب بالای ریپو) می‌تونی ببینی.
وقتی تیک سبز شد، آدرس اپت آماده‌ست! 🎉

---

### مرحله ۵ — آدرس اپ

آدرس اپت میشه:
```
https://[نام-کاربری].github.io/walletos/
```

---

## 📱 نصب PWA روی گوشی

**اندروید (Chrome):**
- اپ رو باز کن → پایین صفحه نوار "نصب" ظاهر میشه → بزن

**آیفون (Safari):**
- اپ رو باز کن → دکمه Share (مربع با فلش) → **Add to Home Screen**

**کامپیوتر (Chrome/Edge):**
- آیکون نصب کنار نوار آدرس → Install

---

## 🔌 آفلاین بودن

بعد از نصب PWA یا یه بار باز کردن در مرورگر:
- **کاملاً آفلاین کار می‌کنه** — هیچ فایلی از اینترنت نمیگیره
- همه کتابخونه‌ها (React، نمودارها، آیکون‌ها) داخل build باندل شدن
- دیتات (تراکنش‌ها، بودجه، اهداف) توی IndexedDB مرورگرت ذخیره میشه

---

## 🛠 توسعه لوکال (اختیاری)

اگه می‌خوای لوکال تست کنی:
```bash
npm install
npm run dev
```
