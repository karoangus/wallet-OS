#!/usr/bin/env node
/* ==========================================================================
 * WalletOS — real screenshot pipeline (Playwright + Chromium)
 * --------------------------------------------------------------------------
 * Captures the 10 gallery screens from a live browser into docs/screenshots/.
 * Demo data is seeded straight into IndexedDB with dates relative to "today",
 * so month filters, charts and insights always look alive.
 *
 *   1. npm run dev                        # terminal 1 — serve the app
 *   2. npm i -D playwright                # one-time (kept out of deps on purpose:
 *      npx playwright install chromium    #  the app itself is zero-dependency)
 *   3. npm run screenshots                # terminal 2 — capture
 *
 * Env: BASE_URL (default http://localhost:4173), OUT (default docs/screenshots)
 * ========================================================================== */

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:4173";
const OUT = resolve(ROOT, process.env.OUT || "docs/screenshots");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("\n  ✗ Playwright is not installed.\n");
  console.error("    npm i -D playwright && npx playwright install chromium\n");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------ demo seeding
 * Same dataset as scripts/mockups (theme_data.py), but date-relative:
 * offsets are days before "today", so the current month is always populated.
 * ------------------------------------------------------------------------ */
const CATS = [
  ["food", "خوراک", "UtensilsCrossed", "#FB923C"],
  ["shopping", "خرید", "ShoppingBag", "#F472B6"],
  ["transport", "رفت‌وآمد", "Car", "#60A5FA"],
  ["gaming", "گیم", "Gamepad2", "#A78BFA"],
  ["education", "آموزش", "GraduationCap", "#34D399"],
  ["bills", "قبض‌ها", "Receipt", "#FBBF24"],
  ["internet", "اینترنت", "Wifi", "#22D3EE"],
  ["health", "سلامت", "HeartPulse", "#F87171"],
  ["content", "تولید محتوا", "Video", "#818CF8"],
  ["salary", "درآمد", "Wallet", "#33D6A6"],
  ["other", "متفرقه", "MoreHorizontal", "#94A3B8"],
];

// [daysAgo, type, amount, wallet, categoryId, description, tagIdx[]]
const TXS = [
  [157, "income", 18000000, "bank", "salary", "حقوق فروردین", [1]],
  [156, "expense", 4200000, "bank", "shopping", "خرید بهاره", []],
  [150, "expense", 380000, "cash", "food", "رستوران", [2]],
  [142, "expense", 450000, "bank", "internet", "شارژ اینترنت", []],
  [127, "income", 18000000, "bank", "salary", "حقوق اردیبهشت", [1]],
  [123, "expense", 1200000, "cash", "health", "باشگاه یک ماهه", [3]],
  [116, "expense", 890000, "bank", "transport", "اسنپ و بنزین", []],
  [110, "expense", 450000, "bank", "internet", "شارژ اینترنت", []],
  [96, "income", 18500000, "bank", "salary", "حقوق خرداد", [1]],
  [90, "expense", 2300000, "bank", "shopping", "کفش و لباس", []],
  [83, "expense", 450000, "bank", "internet", "شارژ اینترنت", []],
  [76, "expense", 640000, "cash", "food", "کافه و ناهار", [2]],
  [66, "income", 18500000, "bank", "salary", "حقوق تیر", [1]],
  [63, "expense", 1500000, "bank", "gaming", "اشتراک و بازی", [3]],
  [51, "expense", 450000, "bank", "internet", "شارژ اینترنت", []],
  [44, "expense", 980000, "cash", "transport", "سفر بین‌شهری", [0]],
  [35, "income", 19000000, "bank", "salary", "حقوق مرداد", [1]],
  [26, "income", 3500000, "bank", "salary", "فریلنسری طراحی", [1]],
  [30, "expense", 3100000, "bank", "education", "دوره آنلاین", [3]],
  [21, "expense", 450000, "bank", "internet", "شارژ اینترنت", []],
  [12, "expense", 720000, "cash", "health", "داروخانه", [0]],
  [4, "income", 19000000, "bank", "salary", "حقوق این ماه", [1]],
  [3, "expense", 1250000, "bank", "food", "خرید هفتگی سوپرمارکت", [0]],
  [3, "expense", 320000, "cash", "transport", "اسنپ رفت و برگشت", []],
  [2, "expense", 450000, "bank", "internet", "شارژ اینترنت ماهانه", []],
  [2, "expense", 890000, "cash", "food", "ناهار با دوستان", [2]],
  [1, "expense", 410000, "bank", "bills", "قبض برق", []],
  [1, "expense", 1750000, "bank", "shopping", "هدفون جدید", [3]],
  [0, "expense", 260000, "cash", "transport", "مترو و تاکسی", []],
  [0, "expense", 540000, "cash", "food", "شام بیرون", [2]],
];

const BUDGETS = [
  ["b1", "food", 4000000],
  ["b2", "shopping", 3000000],
  ["b3", "transport", 1500000],
  ["b4", "internet", 600000],
];

// [id, name, target, icon, createdDaysAgo, [[daysAgo, amount]...]]
const GOALS = [
  ["g1", "گوشی جدید", 45000000, "Target", 152,
    [[122, 8000000], [91, 8000000], [61, 6500000], [30, 5000000]]],
  ["g2", "لپ‌تاپ جدید", 85000000, "Trophy", 100,
    [[70, 15000000], [25, 14000000]]],
  ["g3", "صندوق اضطراری", 30000000, "PiggyBank", 201,
    [[173, 6000000], [142, 6000000], [112, 6000000], [81, 6000000]]],
];

const SEED_JS = `
(async () => {
  const TXS = ${JSON.stringify(TXS)};
  const CATS = ${JSON.stringify(CATS)};
  const BUDGETS = ${JSON.stringify(BUDGETS)};
  const GOALS = ${JSON.stringify(GOALS)};
  const day = 86400000, now = Date.now();
  const at = (ago) => new Date(now - ago * day).toISOString();
  const db = await new Promise((res, rej) => {
    const q = indexedDB.open("walletos-db", 1);
    q.onupgradeneeded = (e) => {
      const d = e.target.result;
      for (const s of ["meta", "transactions", "categories", "tags", "budgets", "goals"])
        if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: "id" });
    };
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
  const put = (store, rows) => new Promise((res, rej) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    for (const r of rows) os.put(r);
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
  const tags = ["خانواده", "کار", "دوستان", "شخصی"].map((name, i) => ({ id: "t" + (i + 1), name }));
  await put("meta", [{ id: "balances", cash: 3200000, bank: 95000000 }]);
  await put("categories", CATS.map(([id, name, icon, color]) => ({ id, name, icon, color })));
  await put("tags", tags);
  await put("transactions", TXS.map(([ago, type, amount, wallet, categoryId, description, tg], i) => ({
    id: "x" + i, type, amount, wallet, categoryId, description,
    tags: tg.map((t) => "t" + (t + 1)), date: at(ago), createdAt: now - ago * day + i,
  })));
  await put("budgets", BUDGETS.map(([id, categoryId, amount]) => ({ id, categoryId, amount })));
  await put("goals", GOALS.map(([id, name, target, icon, cAgo, contribs]) => ({
    id, name, target, icon, createdAt: now - cAgo * day,
    contributions: contribs.map(([ago, amount], i) => ({ id: id + "c" + i, amount, date: at(ago) })),
  }));
  db.close();
})();
`;

const PHONE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "fa-IR",
  timeZoneId: "Asia/Tehran",
  colorScheme: "dark",
};

async function settle(page, extra = 900) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  } catch { /* fonts/CDN may hang offline — proceed anyway */ }
  await page.evaluate(() => document.fonts?.ready.catch(() => {}));
  await page.waitForTimeout(extra);
}

async function shot(page, name, expect) {
  if (expect) await page.getByText(expect, { exact: false }).first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("  ✓", name);
}

async function main() {
  const browser = await chromium.launch();
  try {
    // -- 01: onboarding (fresh profile, no seed) ---------------------------
    {
      const ctx = await browser.newContext(PHONE);
      const page = await ctx.newPage();
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await settle(page);
      // fill the two balance inputs for a lively shot
      const inputs = page.locator('input[inputmode="numeric"]');
      if (await inputs.count() >= 2) {
        await inputs.nth(0).fill("3,200,000");
        await inputs.nth(1).fill("95,000,000");
        await page.waitForTimeout(400);
      }
      await shot(page, "01-onboarding", "خوش اومدی");
      await ctx.close();
    }

    // -- 02..10: seeded app -------------------------------------------------
    const ctx = await browser.newContext(PHONE);
    await ctx.addInitScript({ content: SEED_JS });
    const page = await ctx.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await settle(page, 1400);

    await shot(page, "02-home", "موجودی کل");

    await page.getByText("تراکنش‌ها", { exact: true }).click();
    await shot(page, "03-transactions", "جستجو در مبلغ");

    await page.getByText("خانه", { exact: true }).click();
    await page.getByText("ثبت هزینه", { exact: true }).click();
    // fill the sheet for a lively shot (amount + category), don't submit
    const amt = page.locator('input[inputmode="numeric"]').last();
    try { await amt.fill("850,000"); } catch { /* layout shift guard */ }
    await shot(page, "04-add-transaction", "تراکنش جدید");
    await page.keyboard.press("Escape");

    await page.getByText("بودجه", { exact: true }).click();
    await shot(page, "05-budgets", "بودجه‌بندی");

    await page.getByText("بیشتر", { exact: true }).click();
    await page.getByText("اهداف مالی", { exact: true }).click();
    await shot(page, "06-goals", "پس‌انداز برای چیزی که می‌خوای");

    await page.getByText("بیشتر", { exact: true }).click();
    await page.getByText("گزارش‌ها", { exact: true }).click();
    await shot(page, "07-reports", "تحلیل عملکرد مالی");

    await page.getByText("بیشتر", { exact: true }).click();
    await shot(page, "08-more", "دسته‌بندی‌ها");
    await page.keyboard.press("Escape");

    await page.getByText("بیشتر", { exact: true }).click();
    await page.getByText("تنظیمات", { exact: true }).click();
    await shot(page, "09-settings", "پشتیبان‌گیری");

    await page.getByText("بیشتر", { exact: true }).click();
    await page.getByText("دسته‌بندی‌ها", { exact: true }).click();
    await shot(page, "10-categories", "دسته‌بندی‌ها");

    await ctx.close();
    console.log(`\n  Done → ${OUT}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("\n  ✗ Screenshot run failed:", err.message || err);
  console.error(`  Is the dev server up?  (npm run dev  →  ${BASE_URL})\n`);
  process.exit(1);
});
