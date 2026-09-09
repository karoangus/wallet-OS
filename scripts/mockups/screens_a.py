# -*- coding: utf-8 -*-
"""WalletOS mockups — part 3a: onboarding, home, transactions, add-transaction sheet."""
from theme_data import *
from svgkit import *

def doc(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
            f'viewBox="0 0 {W} {H}" style="direction:rtl">'
            f"{bg_def()}{body}</svg>")

# ------------------------------------------------------------- 1. onboarding
def scr_onboarding():
    s = ""
    # total ≈ 545 → start ~150
    y = 150
    # logo
    s += rect(195 - 37 + 0, y + 6, 74, 74, Y["primary"], rx=22, opacity=0.45).replace(
        "/>", ' filter="url(#blur8)"/>')
    s += (f'<defs><linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1">'
          f'<stop offset="0" stop-color="{Y["primary"]}"/>'
          f'<stop offset="1" stop-color="#1c4fd6"/></linearGradient></defs>')
    s += rect(195 - 37, y, 74, 74, "url(#logoG)", rx=22)
    s += icon_center("Xi", 195, y + 37, 34, "#fff")
    y += 74 + 22
    s += txt(195, y + 28, "به WalletOS خوش اومدی", 24, Y["text"], 900, "middle")
    y += 30 + 6
    s += txt(195, y + 17, "برای شروع، موجودی فعلی‌ات رو وارد کن.", 14, Y["textMuted"], 400, "middle")
    s += txt(195, y + 17 + 25, "از این به بعد هر تراکنش خودکار حسابش می‌رسه.", 14, Y["textMuted"], 400, "middle")
    y += 50 + 30
    # card
    cx, cw = 24, 342
    ch = 20 + 21 + 62 + 16 + 21 + 62 + 20
    s += card(cx, y, cw, ch)
    iy = y + 20
    s += icon("Vi", cx + cw - 14 - 14, iy + 1, 14, Y["cash"])
    s += txt(cx + cw - 14 - 19, iy + 13, "موجودی نقدی", 13, Y["textMuted"], 600, "end")
    iy += 21
    a, _ = amount_input(cx + 14, iy, cw - 28, en(3200000))
    s += a
    iy += 62 + 16
    s += icon("Zi", cx + cw - 14 - 14, iy + 1, 14, Y["bank"])
    s += txt(cx + cw - 14 - 19, iy + 13, "موجودی بانکی", 13, Y["textMuted"], 600, "end")
    iy += 21
    a, _ = amount_input(cx + 14, iy, cw - 28, en(95000000))
    s += a
    y += ch + 14
    # total line: single text + tspan (bidi-safe, centered)
    tot = (f'<text x="195" y="{y + 15}" font-family="Vazirmatn" font-size="13" '
           f'fill="{Y["textFaint"]}" text-anchor="middle">مجموع اولیه: '
           f'<tspan font-weight="800" fill="{Y["primaryLight"]}">'
           f'{ct(98200000)} تومان</tspan></text>')
    s += tot
    y += 20 + 18
    s += wbutton(cx, y, cw, "شروع کن")
    return doc(s)

# ------------------------------------------------------------------ 2. home
def home_body(m, with_nav=True):
    """Dashboard content (also reused dimmed behind sheets)."""
    s = ""
    y = 22
    s += txt(370, y + 14, "موجودی کل", 13, Y["textFaint"], 600, "end")
    y += 17 + 6
    # balance card
    card_h = 26 + 42 + 18 + 51 + 26
    s += (f'<clipPath id="clipB"><rect x="20" y="{y}" width="350" height="{card_h}" rx="22"/></clipPath>')
    s += card(20, y, 350, card_h, border=f"{Y['primary']}33")
    s += (f'<g clip-path="url(#clipB)">'
          f'<circle cx="70" cy="{y + 30}" r="90" fill="{Y["primary"]}" opacity="0.16" '
          f'filter="url(#blur40)"/></g>')
    amt = (f'<text x="348" y="{y + 26 + 34}" font-family="Vazirmatn" font-size="34" '
           f'font-weight="900" fill="{Y["text"]}" text-anchor="end">{ct(m["total"])}'
           f'<tspan font-size="14" font-weight="700" fill="{Y["textFaint"]}"> تومان</tspan></text>')
    s += amt
    wy = y + 26 + 42 + 18
    # cash chip (right)
    for i, (key, label, ic, col, bgc) in enumerate([
            ("cash", "نقدی", "Vi", Y["cash"], "rgba(245,185,71,0.1)"),
            ("bank", "بانک", "Zi", Y["bank"], "rgba(111,161,255,0.1)")]):
        chx = 348 - i * (148 + 10) - 148
        s += rect(chx, wy, 148, 51, bgc, rx=14)
        s += icon(ic, chx + 148 - 12 - 16, wy + (51 - 16) / 2, 16, col)
        txr = chx + 148 - 12 - 16 - 9
        s += txt(txr, wy + 12 + 11, label, 10.5, Y["textFaint"], 600, "end")
        s += txt(txr, wy + 12 + 11 + 17, ct(BALANCES[key]), 13.5, Y["text"], 800, "end")
    y += card_h + 16
    # quick actions
    bw = 170
    for i, (label, ic, col, bgc) in enumerate([
            ("افزودن درآمد", "Xf", Y["income"], Y["incomeDim"]),
            ("ثبت هزینه", "jf", Y["expense"], Y["expenseDim"])]):
        bx = 370 - i * (bw + 10) - bw
        s += rect(bx, y, bw, 47, bgc, rx=16, stroke=f"{col}44", sw=1.5)
        s += hcenter_icon_text(bx + bw / 2, y + 47 / 2, ic, 16, col, label, 13.5, col, 800)
    y += 47 + 4 + 14
    # month stats
    for i, (label, ic, col, val) in enumerate([
            ("درآمد این ماه", "La", Y["income"], m["monthIncome"]),
            ("هزینه این ماه", "wi", Y["expense"], m["monthExpense"])]):
        bx = 370 - i * (bw + 10) - bw
        s += card(bx, y, bw, 69)
        s += icon(ic, bx + bw - 14 - 13, y + 14, 13, col)
        s += txt(bx + bw - 14 - 13 - 6, y + 14 + 12, label, 11.5, Y["textFaint"], 700, "end")
        s += txt(bx + bw - 14, y + 14 + 13 + 6 + 18, ct(val), 16, col, 800, "end")
    y += 69 + 4 + 16
    # trend
    th = 18 + 17 + 6 + 170 + 10
    s += card(20, y, 350, th)
    s += icon("La", 370 - 16 - 15, y + 18, 15, Y["primaryLight"])
    s += txt(370 - 16 - 15 - 8, y + 18 + 13, "روند موجودی", 13.5, Y["text"], 800, "end")
    s += area_chart(m["trend"], 20 + 16, y + 18 + 17 + 6, 350 - 32, 170)
    y += th + 4 + 16
    # budget preview (top by pct)
    top = max(m["budgets"], key=lambda b: b["pct"])
    ph = 16 + 30 + 10 + 8 + 8 + 14 + 16
    s += card(20, y, 350, ph)
    s += fetile(top["cat"]["icon"], top["cat"]["color"], 370 - 16 - 30, y + 16, 30)
    s += txt(370 - 16 - 30 - 8, y + 16 + 21, f'بودجه {top["cat"]["name"]}', 13, Y["text"], 700, "end")
    s += txt(20 + 16, y + 16 + 20, pct(top["pct"]), 12,
            Y["expense"] if top["pct"] >= 100 else Y["textMuted"], 700, "start")
    s += progress(20 + 16, y + 16 + 30 + 10, 350 - 32, top["pct"],
                  Y["expense"] if top["pct"] >= 90 else Y["primary"])
    s += txt(370 - 16, y + 16 + 30 + 10 + 8 + 8 + 12,
             f'{ct(top["spent"])} از {ct(top["amount"])} تومان', 11, Y["textFaint"], 400, "end")
    y += ph + 4 + 16
    # goal preview (top by progress)
    g = max(m["goals"], key=lambda g: g["current"] / g["target"])
    s += card(20, y, 350, ph)
    s += fetile(g["icon"], Y["gold"], 370 - 16 - 30, y + 16, 30)
    s += txt(370 - 16 - 30 - 8, y + 16 + 21, f'هدف: {g["name"]}', 13, Y["text"], 700, "end")
    s += txt(20 + 16, y + 16 + 20, pct(g["pct"]), 12, Y["gold"], 700, "start")
    s += progress(20 + 16, y + 16 + 30 + 10, 350 - 32, g["pct"], Y["gold"])
    s += txt(370 - 16, y + 16 + 30 + 10 + 8 + 8 + 12,
             f'{ct(g["current"])} از {ct(g["target"])} تومان', 11, Y["textFaint"], 400, "end")
    y += ph + 18
    s += txt(370, y + 15, "تراکنش‌های اخیر", 14, Y["text"], 800, "end")
    y += 15 + 12
    for i, t in enumerate(m["newest"][:5]):
        last = i == 4
        s += txrow(t, CATMAP[t["categoryId"]], 20, y, None, last)
        y += 62 + 20
    if with_nav:
        s += bottom_nav("dashboard")
    return s

def scr_home(m):
    return doc(home_body(m))

# ------------------------------------------------------------ 3. transactions
def scr_transactions(m):
    s = page_head("تراکنش‌ها", f'{en(len(m["txs"]))} مورد')
    y = 81
    # search
    s += rect(20, y, 350, 50, Y["surfaceRaised"], rx=14, stroke=Y["border"])
    s += icon("Qf", 370 - 14 - 16, y + (50 - 16) / 2, 16, Y["textFaint"])
    s += txt(370 - 38, y + 25, "جستجو در مبلغ، دسته، توضیحات…", 15, Y["textFaint"], 400, "end",
             baseline="central")
    y += 50 + 10
    # chips: filters + date ranges
    chips = [("فیلترها", "Lf"), ("امروز", None), ("این هفته", None), ("این ماه", None), ("امسال", None)]
    cxr = 370
    for label, ic in chips:
        w = len(label) * 7.2 + 30 + (16 if ic else 0)
        x = cxr - w
        s += rect(x, y, w, 30, "rgba(0,0,0,0)", rx=99, stroke=Y["border"])
        if ic:
            # children:[icon, "فیلترها "] → icon right
            s += icon("Lf", x + w - 14 - 12, y + 9, 12, Y["textMuted"])
            s += txt(x + w - 14 - 12 - 4, y + 15, label + " ", 13, Y["textMuted"], 600, "end",
                     baseline="central")
        else:
            s += txt(x + w / 2, y + 15, label, 13, Y["textMuted"], 600, "middle", baseline="central")
        cxr = x - 8
    y += 30 + 2 + 6
    for i, t in enumerate(m["newest"][:9]):
        last = i == 8
        s += txrow(t, CATMAP[t["categoryId"]], 20, y, t["running"], last)
        y += 62 + 20
    s += bottom_nav("transactions")
    return doc(s)

# ------------------------------------------------------- 4. add transaction
def scr_add(m):
    s = home_body(m, with_nav=True)
    body = ""
    y = 0
    # segmented
    body += rect(0, y, 350, 51, Y["surfaceRaised"], rx=14)
    for i, (k, label, ic, col) in enumerate([("expense", "هزینه", "jf", Y["expense"]),
                                             ("income", "درآمد", "Xf", Y["income"])]):
        bx = 350 - 5 - i * (170 + 8) - 170 if False else (5 + (1 - i) * (170 + 8))
        # RTL: expense first → right side
        bx = 350 - 5 - 170 if i == 0 else 5
        if i == 0:  # active expense
            body += rect(bx, y + 5, 170, 41, col, rx=10)
            body += hcenter_icon_text(bx + 85, y + 5 + 41 / 2, ic, 15, "#0A0E1A",
                                      label, 14, "#0A0E1A", 800)
        else:
            body += hcenter_icon_text(bx + 85, y + 5 + 41 / 2, ic, 15, Y["textMuted"],
                                      label, 14, Y["textMuted"], 800)
    y += 51 + 18
    # amount
    body += field_label(350, y + 13, "مبلغ")
    y += 21
    a, _ = amount_input(0, y, 350, en(850000))
    body += a
    y += 62 + 16
    # wallet
    body += field_label(350, y + 13, "کیف پول")
    y += 21
    for i, (k, label, ic, col) in enumerate([("cash", "نقدی", "Vi", Y["cash"]),
                                             ("bank", "بانک", "Zi", Y["bank"])]):
        bx = 350 - i * (171 + 8) - 171
        sel = k == "bank"
        body += rect(bx, y, 171, 42, f"{col}18" if sel else "rgba(0,0,0,0)", rx=14,
                     stroke=col if sel else Y["border"], sw=1.5)
        body += hcenter_icon_text(bx + 171 / 2, y + 21, ic, 15, col if sel else Y["textMuted"],
                                  label, 13.5, col if sel else Y["textMuted"], 700)
    y += 42 + 16
    # categories (horizontal, food selected)
    body += field_label(350, y + 13, "دسته‌بندی")
    y += 21
    vis = CATS[:5]
    for i, c in enumerate(vis):
        ix = 350 - i * 70 - 62
        sel = c["id"] == "food"
        body += rect(ix + 8, y, 46, 46, c["color"] if sel else f'{c["color"]}1c', rx=14,
                     stroke=c["color"] if sel else "rgba(0,0,0,0)", sw=2)
        body += icon_center(c["icon"], ix + 8 + 23, y + 23, 20,
                            "#0A0E1A" if sel else c["color"], 2.3)
        body += txt(ix + 31, y + 46 + 5 + 11, c["name"], 10.5,
                    Y["text"] if sel else Y["textFaint"], 600, "middle")
    y += 46 + 5 + 14 + 4 + 16
    # tags
    body += field_label(350, y + 13, "برچسب‌ها (اختیاری)")
    y += 21
    cxr = 350
    for t in TAGS:
        sel = t["id"] == "t3"
        ch, w = chip(cxr, y, t["name"], active=sel, color=Y["primary"])
        body += ch
        cxr -= w + 7
    y += 30 + 10
    body += rect(52, y, 350 - 52, 35, Y["surfaceRaised"], rx=14, stroke=Y["border"])
    body += txt(350 - 12, y + 17.5, "برچسب جدید…", 13, Y["textFaint"], 400, "end", baseline="central")
    body += rect(0, y, 46, 35, Y["surfaceRaised"], rx=12, stroke=Y["border"])
    body += txt(23, y + 17.5, "افزودن", 13, Y["primaryLight"], 700, "middle", baseline="central")
    y += 35 + 16
    # date
    body += field_label(350, y + 13, "تاریخ")
    y += 21
    body += jinput(0, y, 350, 46, value="۹ سپتامبر ۲۰۲۶")
    y += 46 + 16
    # desc
    body += field_label(350, y + 13, "توضیحات (اختیاری)")
    y += 21
    body += jinput(0, y, 350, 46, placeholder="مثلاً: ناهار با دوستان")
    y += 46 + 6
    # submit
    body += wbutton(0, y, 350, "ثبت تراکنش", Y["primary"], h=51)
    y += 51
    s += sheet("تراکنش جدید", body, y)
    return doc(s)
