# -*- coding: utf-8 -*-
"""WalletOS mockup generator — part 1: theme, jalali, fa-IR formatting, demo data."""
import datetime

# ---------------------------------------------------------------- theme (y)
Y = {
    "bg": "#080B14",
    "surface": "#10152791",
    "surfaceSolid": "#111629",
    "surfaceRaised": "#161C34",
    "border": "rgba(148,163,207,0.12)",
    "borderStrong": "rgba(148,163,207,0.22)",
    "primary": "#3E7BFA",
    "primaryLight": "#6FA1FF",
    "primaryDim": "#1B3B7A",
    "primaryGlow": "rgba(62,123,250,0.5)",
    "income": "#33D6A6",
    "incomeDim": "rgba(51,214,166,0.14)",
    "expense": "#FB7185",
    "expenseDim": "rgba(251,113,133,0.14)",
    "gold": "#F5B947",
    "text": "#EDF1FB",
    "textMuted": "#8D96B8",
    "textFaint": "#5B6488",
    "cash": "#F5B947",
    "bank": "#6FA1FF",
}

FA_DIGITS = str.maketrans("0123456789,", "۰۱۲۳۴۵۶۷۸۹٬")

def ct(n):
    """Money: fa-IR like the app (Persian digits + ٬ separator)."""
    return f"{int(round(n or 0)):,}".translate(FA_DIGITS)

def en(n):
    """en-US grouping (amount inputs, counts)."""
    return f"{int(round(n or 0)):,}"

def pct(p):
    """Percents: Latin digits + Arabic ٪ (exactly like the app)."""
    return f"{int(round(p))}٪"

# ------------------------------------------------------------- jalali (Zv/Wi)
KI = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

def jalali(y, m, d):
    a = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    n = 0 if y <= 1600 else 979
    y -= 621 if y <= 1600 else 1600
    u = y + 1 if m > 2 else y
    i = 365 * y + (u + 3) // 4 - (u + 99) // 100 + (u + 399) // 400 - 80 + d + a[m - 1]
    n += 33 * (i // 12053)
    i %= 12053
    n += 4 * (i // 1461)
    i %= 1461
    n += (i - 1) // 365
    if i > 365:
        i = (i - 1) % 365
    c = 1 + i // 31 if i < 186 else 7 + (i - 186) // 30
    f = 1 + (i % 31 if i < 186 else (i - 186) % 30)
    return (n, c, f)

def Wi(dt, short=False, monthYear=False, dayMonth=False):
    jy, jm, jd = jalali(dt.year, dt.month, dt.day)
    if short:
        return f"{jd} {KI[jm - 1][:3]}"
    if monthYear:
        return f"{KI[jm - 1]} {jy}"
    if dayMonth:
        return f"{jd} {KI[jm - 1]}"
    return f"{jd} {KI[jm - 1]} {jy}"

# ------------------------------------------------------------------ demo data
CATS = [
    {"id": "food", "name": "خوراک", "icon": "ny", "color": "#FB923C"},
    {"id": "shopping", "name": "خرید", "icon": "uy", "color": "#F472B6"},
    {"id": "transport", "name": "رفت‌وآمد", "icon": "iy", "color": "#60A5FA"},
    {"id": "gaming", "name": "گیم", "icon": "cy", "color": "#A78BFA"},
    {"id": "education", "name": "آموزش", "icon": "oy", "color": "#34D399"},
    {"id": "bills", "name": "قبض‌ها", "icon": "Qi", "color": "#FBBF24"},
    {"id": "internet", "name": "اینترنت", "icon": "fy", "color": "#22D3EE"},
    {"id": "health", "name": "سلامت", "icon": "sy", "color": "#F87171"},
    {"id": "content", "name": "تولید محتوا", "icon": "dy", "color": "#818CF8"},
    {"id": "salary", "name": "درآمد", "icon": "Xi", "color": "#33D6A6"},
    {"id": "other", "name": "متفرقه", "icon": "au", "color": "#94A3B8"},
]
CATMAP = {c["id"]: c for c in CATS}
TAGS = [
    {"id": "t1", "name": "خانواده"},
    {"id": "t2", "name": "کار"},
    {"id": "t3", "name": "دوستان"},
    {"id": "t4", "name": "شخصی"},
]

# "today" for the mockups (matches real screenshots taken on this date)
TODAY = datetime.date(2026, 9, 9)

# (date, type, amount, wallet, category, description, tags)
TXS_RAW = [
    # previous months (for 6-month chart + averages)
    ("2026-04-05", "income", 18000000, "bank", "salary", "حقوق فروردین", ["t2"]),
    ("2026-04-06", "expense", 4200000, "bank", "shopping", "خرید بهاره", []),
    ("2026-04-12", "expense", 380000, "cash", "food", "رستوران", ["t3"]),
    ("2026-04-20", "expense", 450000, "bank", "internet", "شارژ اینترنت", []),
    ("2026-05-05", "income", 18000000, "bank", "salary", "حقوق اردیبهشت", ["t2"]),
    ("2026-05-09", "expense", 1200000, "cash", "health", "باشگاه یک ماهه", ["t4"]),
    ("2026-05-16", "expense", 890000, "bank", "transport", "اسنپ و بنزین", []),
    ("2026-05-22", "expense", 450000, "bank", "internet", "شارژ اینترنت", []),
    ("2026-06-05", "income", 18500000, "bank", "salary", "حقوق خرداد", ["t2"]),
    ("2026-06-11", "expense", 2300000, "bank", "shopping", "کفش و لباس", []),
    ("2026-06-18", "expense", 450000, "bank", "internet", "شارژ اینترنت", []),
    ("2026-06-25", "expense", 640000, "cash", "food", "کافه و ناهار", ["t3"]),
    ("2026-07-05", "income", 18500000, "bank", "salary", "حقوق تیر", ["t2"]),
    ("2026-07-08", "expense", 1500000, "bank", "gaming", "اشتراک و بازی", ["t4"]),
    ("2026-07-20", "expense", 450000, "bank", "internet", "شارژ اینترنت", []),
    ("2026-07-27", "expense", 980000, "cash", "transport", "سفر بین‌شهری", ["t1"]),
    ("2026-08-05", "income", 19000000, "bank", "salary", "حقوق مرداد", ["t2"]),
    ("2026-08-14", "income", 3500000, "bank", "salary", "فریلنسری طراحی", ["t2"]),
    ("2026-08-10", "expense", 3100000, "bank", "education", "دوره آنلاین", ["t4"]),
    ("2026-08-19", "expense", 450000, "bank", "internet", "شارژ اینترنت", []),
    ("2026-08-28", "expense", 720000, "cash", "health", "داروخانه", ["t1"]),
    # current month (September 2026 = شهریور ۱۴۰۵)
    ("2026-09-05", "income", 19000000, "bank", "salary", "حقوق شهریور", ["t2"]),
    ("2026-09-06", "expense", 1250000, "bank", "food", "خرید هفتگی سوپرمارکت", ["t1"]),
    ("2026-09-06", "expense", 320000, "cash", "transport", "اسنپ رفت و برگشت", []),
    ("2026-09-07", "expense", 450000, "bank", "internet", "شارژ اینترنت ماهانه", []),
    ("2026-09-07", "expense", 890000, "cash", "food", "ناهار با دوستان", ["t3"]),
    ("2026-09-08", "expense", 410000, "bank", "bills", "قبض برق", []),
    ("2026-09-08", "expense", 1750000, "bank", "shopping", "هدفون جدید", ["t4"]),
    ("2026-09-09", "expense", 260000, "cash", "transport", "مترو و تاکسی", []),
    ("2026-09-09", "expense", 540000, "cash", "food", "شام بیرون", ["t3"]),
]

BALANCES = {"cash": 3200000, "bank": 95000000}

BUDGETS = [
    {"id": "b1", "categoryId": "food", "amount": 4000000},
    {"id": "b2", "categoryId": "shopping", "amount": 3000000},
    {"id": "b3", "categoryId": "transport", "amount": 1500000},
    {"id": "b4", "categoryId": "internet", "amount": 600000},
]

GOALS = [
    {"id": "g1", "name": "گوشی جدید", "target": 45000000, "icon": "Li",
     "created": datetime.date(2026, 4, 10),
     "contribs": [("2026-05-10", 8000000), ("2026-06-10", 8000000),
                  ("2026-07-10", 6500000), ("2026-08-10", 5000000)]},
    {"id": "g2", "name": "لپ‌تاپ جدید", "target": 85000000, "icon": "yy",
     "created": datetime.date(2026, 6, 1),
     "contribs": [("2026-07-01", 15000000), ("2026-08-15", 14000000)]},
    {"id": "g3", "name": "صندوق اضطراری", "target": 30000000, "icon": "eu",
     "created": datetime.date(2026, 2, 20),
     "contribs": [("2026-03-20", 6000000), ("2026-04-20", 6000000),
                  ("2026-05-20", 6000000), ("2026-06-20", 6000000)]},
]

def build_model():
    txs = []
    for i, (d, ty, amt, wal, cat, desc, tags) in enumerate(TXS_RAW):
        dt = datetime.date.fromisoformat(d)
        txs.append({"id": f"x{i}", "date": dt, "type": ty, "amount": amt,
                    "wallet": wal, "categoryId": cat, "description": desc, "tags": tags})
    txs_newest = sorted(txs, key=lambda t: (t["date"], txs.index(t)), reverse=True)
    txs_oldest = sorted(txs, key=lambda t: (t["date"], txs.index(t)))
    total = BALANCES["cash"] + BALANCES["bank"]
    net = sum(t["amount"] if t["type"] == "income" else -t["amount"] for t in txs)
    start = total - net
    # running balances (chronological accumulation from starting balance)
    bal = start
    rb = {}
    for t in txs_oldest:
        bal += t["amount"] if t["type"] == "income" else -t["amount"]
        rb[t["id"]] = bal
    for t in txs:
        t["running"] = rb[t["id"]]
    assert bal == total, (bal, total)
    m = TODAY.month
    cur = [t for t in txs if t["date"].month == m and t["date"].year == TODAY.year]
    monthIncome = sum(t["amount"] for t in cur if t["type"] == "income")
    monthExpense = sum(t["amount"] for t in cur if t["type"] == "expense")
    # per-category this month (expenses)
    percat = {}
    for t in cur:
        if t["type"] == "expense":
            percat[t["categoryId"]] = percat.get(t["categoryId"], 0) + t["amount"]
    donut = sorted(({"name": CATMAP[k]["name"], "value": v, "color": CATMAP[k]["color"]}
                    for k, v in percat.items()), key=lambda d: -d["value"])
    # 6-month buckets
    buckets = []
    for back in range(5, -1, -1):
        yy, mm = TODAY.year, TODAY.month - back
        while mm <= 0:
            mm += 12
            yy -= 1
        inc = sum(t["amount"] for t in txs if t["type"] == "income"
                  and t["date"].year == yy and t["date"].month == mm)
        exp = sum(t["amount"] for t in txs if t["type"] == "expense"
                  and t["date"].year == yy and t["date"].month == mm)
        label = Wi(datetime.date(yy, mm, 1), short=True).split(" ")[1]
        buckets.append({"label": label, "income": inc, "expense": exp})
    # 14-day trend
    trend = []
    b2 = start
    idx = 0
    ordered = txs_oldest
    for back in range(13, -1, -1):
        day = TODAY - datetime.timedelta(days=back)
        while idx < len(ordered) and ordered[idx]["date"] <= day:
            t = ordered[idx]
            b2 += t["amount"] if t["type"] == "income" else -t["amount"]
            idx += 1
        trend.append({"label": Wi(day, short=True), "balance": b2})
    # budgets
    budgets = []
    for b in BUDGETS:
        spent = percat.get(b["categoryId"], 0)
        budgets.append({**b, "spent": spent, "pct": spent / b["amount"] * 100,
                        "cat": CATMAP[b["categoryId"]]})
    # goals
    goals = []
    for g in GOALS:
        current = sum(a for _, a in g["contribs"])
        months = max(1, round((TODAY - g["created"]).days / 30))
        rate = current / months
        left = max(0, g["target"] - current)
        eta = __import__("math").ceil(left / rate) if rate > 0 else None
        goals.append({**g, "current": current, "pct": min(100, current / g["target"] * 100),
                      "left": left, "eta": eta})
    return {"txs": txs, "newest": txs_newest, "total": total, "start": start,
            "monthIncome": monthIncome, "monthExpense": monthExpense,
            "donut": donut, "buckets": buckets, "trend": trend,
            "budgets": budgets, "goals": goals, "percat": percat}
