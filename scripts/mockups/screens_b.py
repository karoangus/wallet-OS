# -*- coding: utf-8 -*-
"""WalletOS mockups — part 3b: budgets, goals, reports, more, settings, categories."""
from theme_data import *
from svgkit import *
from screens_a import doc, home_body

# -------------------------------------------------------------- 5. budgets
def scr_budgets(m):
    s = page_head("بودجه‌بندی", "مدیریت هزینه‌های ماهانه",
                  add_btn(20, 22, Y["primary"]))
    y = 81
    tot = sum(b["amount"] for b in m["budgets"])
    spent = sum(b["spent"] for b in m["budgets"])
    s += card(20, y, 350, 91)
    s += txt(370 - 16, y + 16 + 13, "مجموع بودجه ماه", 12.5, Y["textMuted"], 700, "end")
    s += txt(20 + 16, y + 16 + 13, pct(spent / tot * 100), 12.5, Y["textMuted"], 700, "start")
    s += progress(20 + 16, y + 16 + 17 + 8, 350 - 32, spent / tot * 100, Y["primary"], 10)
    s += txt(370 - 16, y + 16 + 17 + 8 + 10 + 8 + 13,
             f"{ct(spent)} از {ct(tot)} تومان", 12, Y["textFaint"], 400, "end")
    y += 91 + 14
    for b in sorted(m["budgets"], key=lambda b: -b["pct"]):
        s += card(20, y, 350, 86)
        s += fetile(b["cat"]["icon"], b["cat"]["color"], 370 - 16 - 36, y + 16, 36)
        txr = 370 - 16 - 36 - 10
        s += txt(txr, y + 16 + 15, b["cat"]["name"], 13.5, Y["text"], 700, "end")
        s += txt(txr, y + 16 + 15 + 16, f'{ct(b["spent"])} / {ct(b["amount"])}', 11,
                 Y["textFaint"], 400, "end")
        if b["pct"] >= 90:
            s += icon("Ki", 20 + 16, y + 16 + 10, 16, Y["expense"])
        col = Y["expense"] if b["pct"] >= 100 else (Y["gold"] if b["pct"] >= 75 else Y["primary"])
        s += progress(20 + 16, y + 16 + 36 + 10, 350 - 32, b["pct"], col)
        y += 86 + 10
    s += bottom_nav("budgets")
    return doc(s)

# ---------------------------------------------------------------- 6. goals
def scr_goals(m):
    s = page_head("اهداف مالی", "پس‌انداز برای چیزی که می‌خوای",
                  add_btn(20, 22, Y["gold"]))
    y = 81
    for g in m["goals"]:
        s += card(20, y, 350, 180)
        s += fetile(g["icon"], Y["gold"], 370 - 16 - 44, y + 18, 44)
        txr = 370 - 16 - 44 - 11
        s += txt(txr, y + 18 + 17, g["name"], 15, Y["text"], 800, "end")
        if g["pct"] >= 100:
            status = "تکمیل شد"
        elif g["eta"]:
            status = f"تخمین رسیدن: {en(g['eta'])} ماه دیگر"
        else:
            status = "هنوز واریزی نداشته"
        s += txt(txr, y + 18 + 17 + 19, status, 11.5, Y["textFaint"], 400, "end")
        s += txt(20 + 18, y + 18 + 19, pct(g["pct"]), 15, Y["gold"], 900, "start")
        s += progress(20 + 18, y + 18 + 44 + 14, 350 - 36, g["pct"], Y["gold"], 9)
        ry = y + 18 + 44 + 14 + 9 + 8
        s += txt(370 - 18, ry + 12, f'{ct(g["current"])} از {ct(g["target"])} ت', 11.5,
                 Y["textFaint"], 400, "end")
        s += txt(20 + 18, ry + 12, f'باقی‌مانده: {ct(g["left"])} ت', 11.5,
                 Y["textFaint"], 400, "start")
        by = ry + 12 + 12
        s += rect(20 + 18, by, 350 - 36, 42, f'{Y["gold"]}18', rx=12,
                 stroke=f'{Y["gold"]}55', sw=1.5)
        s += txt(195, by + 21, "واریز به این هدف", 12.5, Y["gold"], 800, "middle",
                 baseline="central")
        y += 180 + 12
    s += bottom_nav(None)
    return doc(s)

# -------------------------------------------------------------- 7. reports
def scr_reports(m):
    n = [t for t in m["txs"] if t["date"].month == TODAY.month]
    exp = [t for t in n if t["type"] == "expense"]
    top5 = sorted(exp, key=lambda t: -t["amount"])[:5]
    topcat = m["donut"][0]
    daily = m["monthExpense"] / TODAY.day
    pos = [b for b in m["buckets"] if b["income"] > 0]
    avginc = sum(b["income"] for b in pos) / len(pos)
    save = m["monthIncome"] - m["monthExpense"]
    prev = m["buckets"][-2]
    up = save >= (prev["income"] - prev["expense"])
    insights = [
        ("Ki", Y["expense"],
         [f'پرهزینه‌ترین دسته این ماه: «{topcat["name"]}»',
          f'با {ct(topcat["value"])} تومان']),
        ("wi", Y["expense"],
         [f'بزرگ‌ترین هزینه: {ct(top5[0]["amount"])} تومان',
          f'({CATMAP[top5[0]["categoryId"]]["name"]})']),
        ("Vf", Y["income"], [f"میانگین هزینه روزانه: {ct(round(daily))} تومان"]),
        ("La", Y["income"], ["میانگین درآمد ماهانه (۶ ماه اخیر):",
                             f"{ct(round(avginc))} تومان"]),
        ("eu", Y["income"] if save >= 0 else Y["expense"],
         [f'پس‌انداز این ماه: {"+" if save >= 0 else ""}{ct(save)} تومان']),
        ("La" if up else "wi", Y["income"] if up else Y["expense"],
         [f'روند مالی نسبت به ماه قبل: {"صعودی" if up else "نزولی"}'],
         ("La" if up else "wi")),
    ]
    s = page_head("گزارش‌ها", "تحلیل عملکرد مالی")
    y = 81
    # bars
    s += card(20, y, 350, 241)
    s += icon("wf", 370 - 16 - 15, y + 18, 15, Y["primaryLight"])
    s += txt(370 - 16 - 15 - 8, y + 18 + 13, "درآمد و هزینه (۶ ماه اخیر)", 13.5,
             Y["text"], 800, "end")
    s += bars_chart(m["buckets"], 20 + 16, y + 18 + 17 + 6, 350 - 32, 190)
    y += 241 + 14
    # donut
    leg_rows = 2 if len(m["donut"]) > 3 else 1
    leg_h = leg_rows * 22
    dh = 18 + 17 + 6 + 210 + 6 + leg_h + 10
    s += card(20, y, 350, dh)
    s += icon("nu", 370 - 16 - 15, y + 18, 15, Y["primaryLight"])
    s += txt(370 - 16 - 15 - 8, y + 18 + 13, "تفکیک هزینه‌های این ماه", 13.5,
             Y["text"], 800, "end")
    s += donut_chart(m["donut"], 195, y + 18 + 17 + 6 + 105)
    ly = y + 18 + 17 + 6 + 210 + 6
    # legend (wrap, max 6)
    items = m["donut"][:6]
    rows = [items[:3], items[3:]]
    for r, row in enumerate(rows):
        if not row:
            continue
        cxr = 370 - 16
        for d in row:
            w = len(d["name"]) * 6.2 + 13 + 8
            x = cxr - w
            s += circle(x + 4, ly + r * 22 + 8, 4, d["color"])
            s += txt(x + 13, ly + r * 22 + 12, d["name"], 11, Y["textMuted"], 400, "start")
            cxr = x - 8
    y += dh + 14
    # insights
    ih = 16 + 15 + 12
    for ins in insights:
        ih += (13 * 1.7 * len(ins[2])) + 12
    ih += 16 - 12
    s += card(20, y, 350, ih)
    s += icon("Zf", 370 - 16 - 15, y + 16, 15, Y["gold"])
    s += txt(370 - 16 - 15 - 8, y + 16 + 13, "بینش‌های هوشمند", 13.5,
             Y["text"], 800, "end")
    iy = y + 16 + 15 + 12
    for ins in insights:
        ic, col, lines_txt = ins[0], ins[1], ins[2]
        trail = ins[3] if len(ins) > 3 else None
        s += rect(370 - 16 - 30, iy, 30, 30, f"{col}1e", rx=10)
        s += icon_center(ic, 370 - 16 - 15, iy + 15, 14, col)
        for j, ln in enumerate(lines_txt):
            s += txt(370 - 16 - 30 - 10, iy + 8 + j * 22, ln, 13, Y["textMuted"],
                     400, "end")
        if trail:
            last = lines_txt[-1]
            tw = len(last) * 6.8
            s += icon(trail, 370 - 16 - 30 - 10 - tw - 18, iy + 8 + (len(lines_txt) - 1) * 22 - 12,
                      14, col)
        iy += 13 * 1.7 * len(lines_txt) + 12
    y += ih + 14
    # top expenses
    rh = 16 + 14 + 10 + len(top5) * 46 + 16
    s += card(20, y, 350, rh)
    s += txt(370 - 16, y + 16 + 13, "بزرگ‌ترین هزینه‌های این ماه", 13.5,
             Y["text"], 800, "end")
    ry = y + 16 + 14 + 10
    for i, t in enumerate(top5):
        if i > 0:
            s += line(20 + 16, ry, 370 - 16, ry, Y["border"])
        ry += 8
        s += txt(370 - 16, ry + 12, str(i + 1), 12, Y["textFaint"], 400, "end")
        c = CATMAP[t["categoryId"]]
        s += fetile(c["icon"], c["color"], 370 - 16 - 16 - 10 - 30, ry, 30)
        s += txt(370 - 16 - 16 - 10 - 30 - 10, ry + 19,
                 t["description"] or c["name"], 12.5, Y["textMuted"], 400, "end")
        s += txt(20 + 16, ry + 19, ct(t["amount"]), 13, Y["expense"], 800, "start")
        ry += 30 + 8
    s += bottom_nav(None)
    return doc(s)


# ----------------------------------------------------------------- 8. more
def scr_more(m):
    s = home_body(m, with_nav=True)
    items = [("goals", "اهداف مالی", "Li", Y["gold"]),
             ("reports", "گزارش‌ها", "wf", Y["primaryLight"]),
             ("categories", "دسته‌بندی‌ها", "nu", "#A78BFA"),
             ("settings", "تنظیمات", "qv", Y["textMuted"])]
    body = ""
    y = 0
    for k, label, ic, col in items:
        body += rect(0, y, 350, 66, Y["surfaceRaised"], rx=16)
        body += rect(350 - 12 - 38, y + 14, 38, 38, f"{col}22", rx=13)
        body += icon_center(ic, 350 - 12 - 19, y + 14 + 19, 19, col, 2.2)
        body += txt(350 - 12 - 38 - 14, y + 33, label, 14.5, Y["text"], 700,
                     "end", baseline="central")
        body += icon("ry", 12, y + (66 - 16) / 2, 16, Y["textFaint"])
        y += 66 + 8
    y = y - 8 + 10
    s += sheet("بیشتر", body, y)
    return doc(s)


# ------------------------------------------------------------- 9. settings
def settings_row(ic, color, label, sub, danger=False, divider=True):
    s = ""
    if divider:
        s += line(0, 0, 350, 0, Y["border"])
    s += rect(350 - 14 - 36, 15, 36, 36, Y["expenseDim"] if danger else "rgba(111,161,255,0.12)",
              rx=11)
    s += icon_center(ic, 350 - 14 - 18, 15 + 18, 17,
                     Y["expense"] if danger else Y["primaryLight"])
    lc = Y["expense"] if danger else Y["text"]
    s += txt(350 - 14 - 36 - 13, 15 + 17, label, 14, lc, 700, "end")
    if sub:
        s += txt(350 - 14 - 36 - 13, 15 + 17 + 17, sub, 11.5, Y["textFaint"], 400, "end")
    s += icon("P0", 14, 15 + 10, 16, Y["textFaint"])
    return s

def scr_settings(m):
    s = page_head("تنظیمات")
    y = 62
    s += txt(370 - 4, y + 13, "داده‌ها", 12, Y["textFaint"], 700, "end")
    y += 13 + 8
    # data card: 2 rows
    s += card(20, y, 350, 132)
    s += f'<g transform="translate(20,{y})">'
    s += settings_row("ty", None, "پشتیبان‌گیری (Backup)",
                      "خروجی JSON از تمام اطلاعات", divider=False)
    s += f'<g transform="translate(0,66)">'
    s += settings_row("ly", None, "بازیابی (Restore)",
                      "بازگردانی از فایل پشتیبان")
    s += "</g></g>"
    y += 132 + 18
    s += txt(370 - 4, y + 13, "آمار", 12, Y["textFaint"], 700, "end")
    y += 13 + 8
    s += card(20, y, 350, 70)
    stats = [(en(len(m["txs"])), "تراکنش"), (en(len(CATS)), "دسته‌بندی"),
             (en(len(TAGS)), "برچسب")]
    for i, (v, l) in enumerate(stats):
        cx = 370 - 350 / 6 - i * (350 / 3)
        s += txt(cx, y + 16 + 19, v, 18, Y["text"], 800, "middle")
        s += txt(cx, y + 16 + 19 + 2 + 13, l, 11, Y["textFaint"], 400, "middle")
    y += 70 + 18
    s += txt(370 - 4, y + 13, "خطرناک", 12, Y["textFaint"], 700, "end")
    y += 13 + 8
    s += card(20, y, 350, 66, border=f'{Y["expense"]}33')
    s += f'<g transform="translate(20,{y})">'
    s += settings_row("ey", None, "ریست کامل اطلاعات",
                      "حذف همه‌چیز و شروع دوباره", danger=True, divider=False)
    s += "</g>"
    y += 66 + 18
    s += txt(195, y + 13, "WalletOS · تمام داده‌ها فقط روی همین دستگاه ذخیره می‌شود",
             11.5, Y["textFaint"], 400, "middle")
    s += bottom_nav(None)
    return doc(s)


# ----------------------------------------------------------- 10. categories
def scr_categories(m):
    s = page_head("دسته‌بندی‌ها", f"{en(len(CATS))} دسته‌بندی",
                  add_btn(20, 22, Y["primary"]))
    y = 81
    for i, c in enumerate(CATS):
        col, row = i % 2, i // 2
        bx = 370 - col * 180 - 170
        by = y + row * 76
        s += card(bx, by, 170, 66)
        s += fetile(c["icon"], c["color"], bx + 170 - 14 - 38, by + 14, 38)
        s += txt(bx + 170 - 14 - 38 - 10, by + 33, c["name"], 13, Y["text"], 700,
                 "end", baseline="central")
    s += bottom_nav(None)
    return doc(s)
