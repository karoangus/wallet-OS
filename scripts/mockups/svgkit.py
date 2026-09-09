# -*- coding: utf-8 -*-
"""WalletOS mockup generator — part 2: SVG component kit (faithful to bundle styles)."""
import re, struct, os
from theme_data import Y, Wi, ct

W, H = 390, 844
_HERE = os.path.dirname(os.path.abspath(__file__))
ICON_DIR = os.environ.get("WOS_ICONS", os.path.join(_HERE, ".cache", "icons"))
FONT_DIR = os.environ.get("WOS_FONTS", os.path.join(_HERE, "..", "..", "node_modules", "vazirmatn", "fonts", "ttf"))

# ------------------------------------------------------------ font metrics
def ttf_metrics(path):
    with open(path, "rb") as f:
        data = f.read()
    num = struct.unpack(">H", data[4:6])[0]
    tables = {}
    for i in range(num):
        off = 12 + i * 16
        tag = data[off:off + 4].decode("latin1")
        tables[tag] = struct.unpack(">I", data[off + 8:off + 12])[0]
    upm = struct.unpack(">H", data[tables["head"] + 18:tables["head"] + 20])[0]
    asc = struct.unpack(">h", data[tables["hhea"] + 4:tables["hhea"] + 6])[0]
    desc = struct.unpack(">h", data[tables["hhea"] + 6:tables["hhea"] + 8])[0]
    return upm, asc, desc

_UPM, _ASC, _DESC = ttf_metrics(os.path.join(FONT_DIR, "Vazirmatn-Regular.ttf"))
ASCENT = _ASC / _UPM      # baseline offset from top (fraction of size)
DESCENT = -_DESC / _UPM

# ------------------------------------------------------------------ icons
_ICONS = {}
def icon_inner(var):
    if var not in _ICONS:
        s = open(os.path.join(ICON_DIR, f"{var}.svg"), encoding="utf-8").read()
        inner = re.sub(r"<svg[^>]*>|</svg>", "", s).strip()
        _ICONS[var] = inner
    return _ICONS[var]

def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# ---------------------------------------------------------------- primitives
def txt(x, y, s, size, fill, weight=400, anchor="end", family="Vazirmatn",
        baseline=None, ls=None, opacity=None):
    bl = f' dominant-baseline="{baseline}"' if baseline else ""
    lsp = f' letter-spacing="{ls}"' if ls else ""
    op = f' opacity="{opacity}"' if opacity else ""
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{bl}{lsp}{op}>'
            f'{esc(s)}</text>')

def rect(x, y, w, h, fill, rx=0, stroke=None, sw=1, opacity=None):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{sw}"'
    if opacity is not None:
        s += f' opacity="{opacity}"'
    return s + "/>"

def circle(cx, cy, r, fill, stroke=None, sw=1, opacity=None):
    s = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{sw}"'
    if opacity is not None:
        s += f' opacity="{opacity}"'
    return s + "/>"

def line(x1, y1, x2, y2, stroke, sw=1, opacity=None):
    s = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"'
    if opacity is not None:
        s += f' opacity="{opacity}"'
    return s + "/>"

def icon(var, x, y, size, color, sw=2):
    """Lucide icon (exact bundle paths). x,y = top-left."""
    k = size / 24
    eff = sw / k
    return (f'<g transform="translate({x},{y}) scale({k})" fill="none" '
            f'stroke="{color}" color="{color}" stroke-width="{eff}" '
            f'stroke-linecap="round" stroke-linejoin="round">'
            f'{icon_inner(var)}</g>')

def icon_center(var, cx, cy, size, color, sw=2):
    return icon(var, cx - size / 2, cy - size / 2, size, color, sw)

# ---------------------------------------------------------------- distinctive
def bg_def():
    return ("""<defs>
<radialGradient id="bgGrad" gradientUnits="userSpaceOnUse" cx="195" cy="-120" r="780">
<stop offset="0" stop-color="#14203F"/><stop offset="0.55" stop-color="#080B14"/>
<stop offset="1" stop-color="#060810"/>
</radialGradient>
<filter id="blur40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="blur8" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect width="390" height="844" fill="url(#bgGrad)"/>""")

def card(x, y, w, h, extra="", border=None):
    return rect(x, y, w, h, Y["surface"], rx=22, stroke=border or Y["border"]) + extra

def fetile(ic, color, x, y, size=40):
    r = size * 0.34
    return (rect(x, y, size, size, f"{color}22", rx=r) +
            icon_center(ic, x + size / 2, y + size / 2, size * 0.5, color, 2.2))

def progress(x, y, w, pctv, color, h=8):
    p = max(0, min(100, pctv))
    fw = w * p / 100
    s = rect(x, y, w, h, "rgba(148,163,207,0.14)", rx=99)
    if fw > 0.5:
        s += rect(x, y, fw, h, color, rx=99, opacity=0.40).replace(
            "/>", ' filter="url(#blur3)"/>')
        s += rect(x, y, fw, h, color, rx=99)
    return s

def chip(cx_right, y, label, active=False, color=None, center=None):
    """Ke chip. Returns (svg, width). Positioned by right edge or center."""
    c = color or Y["primary"]
    # width estimate: 13px font ≈ 7px/char + padding 28
    w = len(label) * 7.2 + 30
    if center is not None:
        x = center - w / 2
    else:
        x = cx_right - w
    h = 30
    if active:
        s = rect(x, y, w, h, f"{c}22", rx=99, stroke=c)
        t = txt(x + w / 2, y + h / 2, label, 13, c, 600, "middle", baseline="central")
    else:
        s = rect(x, y, w, h, "rgba(0,0,0,0)", rx=99, stroke=Y["border"])
        t = txt(x + w / 2, y + h / 2, label, 13, Y["textMuted"], 600, "middle", baseline="central")
    return s + t, w

def wbutton(x, y, w, label, color=None, h=52):
    c = color or Y["primary"]
    sh = rect(x, y + 6, w, h, c, rx=16, opacity=0.35).replace("/>", ' filter="url(#blur8)"/>')
    return (sh + rect(x, y, w, h, c, rx=16) +
            txt(x + w / 2, y + h / 2, label, 15.5, "#0A0E1A", 800, "middle", baseline="central"))

def field_label(x_right, y, label):
    return txt(x_right, y, label, 13, Y["textMuted"], 600, "end")

def jinput(x, y, w, h=50, placeholder=None, value=None, value_size=15, pr=14):
    s = rect(x, y, w, h, Y["surfaceRaised"], rx=14, stroke=Y["border"])
    if value:
        s += txt(x + w - pr, y + h / 2, value, value_size, Y["text"], 400, "end", baseline="central")
    elif placeholder:
        s += txt(x + w - pr, y + h / 2, placeholder, value_size, Y["textFaint"], 400, "end", baseline="central")
    return s

def amount_input(x, y, w, value_en=None):
    """ka: big numeric input + تومان suffix at left."""
    h = 62
    s = rect(x, y, w, h, Y["surfaceRaised"], rx=14, stroke=Y["border"])
    if value_en:
        s += txt(x + w - 14, y + h / 2, value_en, 22, Y["text"], 800, "end", baseline="central", ls=0.5)
    else:
        s += txt(x + w - 14, y + h / 2, "۰", 22, Y["textFaint"], 800, "end", baseline="central")
    s += txt(x + 14, y + h / 2, "تومان", 13, Y["textFaint"], 700, "start", baseline="central")
    return s, h

def section_head(x_right, y, title, ic=None, width=350):
    s = ""
    if ic:
        s += icon(ic, x_right - 15, y, 15, Y["primaryLight"])
        s += txt(x_right - 23, y + 12, title, 13.5, Y["text"], 800, "end")
    else:
        s += txt(x_right, y + 12, title, 13.5, Y["text"], 800, "end")
    return s

def page_head(title, sub=None, right_btn=None):
    """$a: padding 22/20/14."""
    s = txt(370, 22 + 21, title, 21, Y["text"], 900, "end")
    if sub:
        s += txt(370, 22 + 21 + 3 + 13, sub, 12.5, Y["textFaint"], 400, "end")
    if right_btn:
        s += right_btn
    return s

def add_btn(x, y, color):
    return (rect(x, y, 38, 38, color, rx=12) +
            icon_center("wa", x + 19, y + 19, 19, "#0A0E1A"))

# ---------------------------------------------------------------- bottom nav
NAV_H = 70
NAV_ITEMS = [("dashboard", "خانه", "$0"), ("transactions", "تراکنش‌ها", "Qi"),
             ("fab", "", None), ("budgets", "بودجه", "eu"), ("more", "بیشتر", "Lf")]

def bottom_nav(active=None):
    y0 = H - NAV_H
    s = rect(0, y0, W, NAV_H, "rgba(12,15,28,0.85)")
    s += line(0, y0, W, y0, Y["border"])
    slot = W / 5
    for idx, (k, label, ic) in enumerate(NAV_ITEMS):
        cx = W - slot / 2 - idx * slot  # RTL: first item at right
        if k == "fab":
            fx, fy = 195 - 27, y0 + 10 - 26
            s += rect(fx, fy + 4, 54, 54, Y["primary"], rx=18, opacity=0.45).replace(
                "/>", ' filter="url(#blur8)"/>')
            pl, pr = Y["primaryLight"], Y["primary"]
            s += ('<defs><linearGradient id="fabg" x1="0" y1="0" x2="1" y2="1">'
                  f'<stop offset="0" stop-color="{pl}"/>'
                  f'<stop offset="1" stop-color="{pr}"/></linearGradient></defs>')
            s += rect(fx, fy, 54, 54, "url(#fabg)", rx=18)
            s += icon_center("wa", 195, fy + 27, 26, "#fff", 2.6)
            continue
        on = (k == active)
        col = Y["primaryLight"] if on else Y["textFaint"]
        s += icon_center(ic, cx, y0 + 10 + 4 + 10.5, 21, col, 2.4 if on else 2)
        s += txt(cx, y0 + 10 + 4 + 21 + 3 + 11, label, 10, col, 800 if on else 600, "middle")
    return s

# ---------------------------------------------------------------- tx row (by)
def txrow(t, cat, x, y, running=None, is_last=False):
    # RTL row: [timeline rail][tile][texts] ... [amount] (right -> left)
    u = t["type"] == "income"
    col = Y["income"] if u else Y["expense"]
    right = x + 350
    dot = circle(right - 10, y + 4, 4, col)
    glow = circle(right - 10, y + 4, 4, col, opacity=0.6).replace("/>", ' filter="url(#blur3)"/>')
    s = glow + dot
    if not is_last:
        gid = f"tl{y}".replace(".", "")
        s += (f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1">'
              f'<stop offset="0" stop-color="rgba(148,163,207,0.25)"/>'
              f'<stop offset="1" stop-color="rgba(148,163,207,0)"/></linearGradient></defs>')
        s += rect(right - 11, y + 12, 2, 62 + 20 - 12, f"url(#{gid})")
    tile_x = right - 20 - 12 - 42
    s += fetile(cat["icon"] if cat else "au", cat["color"] if cat else Y["textFaint"], tile_x, y, 42)
    txr = tile_x - 11
    title = t["description"] or (cat["name"] if cat else "تراکنش")
    s += txt(txr, y + 16, title, 14.5, Y["text"], 700, "end")
    sub = f'{cat["name"] if cat else ""} · {"نقدی" if t["wallet"] == "cash" else "بانک"} · {Wi(t["date"], short=True)}'
    s += txt(txr, y + 16 + 2 + 14, sub, 12, Y["textFaint"], 400, "end")
    sign = "+" if u else "−"
    s += txt(x, y + 17, f"{sign}{ct(t['amount'])}", 15, col, 800, "start")
    if running is not None:
        s += txt(x, y + 17 + 2 + 13, f"مانده: {ct(running)}", 10.5, Y["textFaint"], 400, "start")
    return s

# ---------------------------------------------------------------- sheet (Ka)
def sheet(title, body_inner, body_h, height=None):
    s = rect(0, 0, W, H, "rgba(4,6,12,0.72)")
    panel_h = 14 + 54 + 4 + body_h + 24
    if height:
        panel_h = height
    py = H - panel_h
    s += rect(0, py, W, panel_h, Y["surfaceSolid"], rx=0,
             stroke=Y["borderStrong"])
    # mask bottom corners (radius only top): cover stroke bottom via bg rect
    s += rect(-2, py + panel_h - 2, W + 4, 4, Y["surfaceSolid"])
    s += rect(195 - 20, py + 10, 40, 4, Y["border"], rx=4)
    s += txt(370, py + 14 + 14 + 20, title, 17, Y["text"], 800, "end")
    s += rect(20, py + 14 + 14, 32, 32, Y["surfaceRaised"], rx=12)
    s += icon_center("F0", 36, py + 14 + 14 + 16, 17, Y["textMuted"])
    s += f'<g transform="translate(20,{py + 14 + 54 + 4})">{body_inner}</g>'
    return s

# ------------------------------------------------------------------- charts
def area_chart(data, x, y, w, h=170, stroke=None, fill=None):
    st = stroke or Y["primary"]
    fl = fill or Y["primaryDim"]
    mL, mR, mT, mB = 8, 8, 14, 28
    pw, ph = w - mL - mR, h - mT - mB
    vals = [d["balance"] for d in data]
    lo, rng = min(vals), (max(vals) - min(vals)) or 1
    n = len(data)
    def px(i): return x + mL + i / (n - 1) * pw
    def py(v): return y + mT + ph - (v - lo) / rng * ph
    pts = [(px(i), py(d["balance"])) for i, d in enumerate(data)]
    gid = f"ag{x}{y}".replace(".", "")
    s = (f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1">'
         f'<stop offset="0" stop-color="{st}" stop-opacity="0.5"/>'
         f'<stop offset="1" stop-color="{st}" stop-opacity="0"/></linearGradient></defs>')
    for f in (0, 0.5, 1):
        yy = y + mT + ph * f
        s += line(x + mL, yy, x + mL + pw, yy, "rgba(148,163,207,0.08)")
    dline = "M" + " L".join(f"{a:.1f},{b:.1f}" for a, b in pts)
    area = f"{dline} L{pts[-1][0]:.1f},{y + mT + ph:.1f} L{x + mL:.1f},{y + mT + ph:.1f} Z"
    s += f'<path d="{area}" fill="url(#{gid})"/>'
    s += (f'<path d="{dline}" fill="none" stroke="{st}" stroke-width="2.5" '
          f'stroke-linecap="round" stroke-linejoin="round"/>')
    step = max(1, n // 6)
    idxs = [i for i in range(n) if i % step == 0 or i == n - 1]
    if len(idxs) >= 2 and idxs[-1] - idxs[-2] < step:
        idxs.pop(-2)
    for i in idxs:
        s += txt(px(i), y + h - 6, data[i]["label"], 10, "#5B6488", 400, "middle")
    return s

def bars_chart(buckets, x, y, w, h=190):
    mL, mR, mT, mB = 8, 8, 14, 28
    pw, ph = w - mL - mR, h - mT - mB
    mx = max([b["income"] for b in buckets] + [b["expense"] for b in buckets] + [1])
    n = len(buckets)
    p = pw / n
    E = min(14, p / 2 - 3)
    s = ""
    for f in (0, 0.5, 1):
        yy = y + mT + ph * f
        s += line(x + mL, yy, x + mL + pw, yy, "rgba(148,163,207,0.08)")
    for i, b in enumerate(buckets):
        cx = x + mL + (i + 0.5) * p
        for j, (k, col) in enumerate([("income", Y["income"]), ("expense", Y["expense"])]):
            v = b[k]
            bh = v / mx * ph
            bx = cx + (j - 0.5) * (E + 2) - E / 2
            if bh > 0.5:
                s += rect(bx, y + mT + ph - bh, E, bh, col, rx=4)
        s += txt(cx, y + h - 6, b["label"], 10, "#5B6488", 400, "middle")
    return s

def donut_chart(data, cx, cy, r_in=55, r_out=82):
    import math
    tot = sum(d["value"] for d in data) or 1
    ang = -math.pi / 2
    s = ""
    for d in data:
        frac = d["value"] / tot
        a0, a1 = ang, ang + frac * 2 * math.pi
        ang = a1
        large = 1 if (a1 - a0) > math.pi else 0
        x0, y0 = cx + r_out * math.cos(a0), cy + r_out * math.sin(a0)
        x1, y1 = cx + r_out * math.cos(a1), cy + r_out * math.sin(a1)
        x2, y2 = cx + r_in * math.cos(a1), cy + r_in * math.sin(a1)
        x3, y3 = cx + r_in * math.cos(a0), cy + r_in * math.sin(a0)
        dpath = (f"M{x0:.2f},{y0:.2f} A{r_out},{r_out} 0 {large} 1 {x1:.2f},{y1:.2f} "
                 f"L{x2:.2f},{y2:.2f} A{r_in},{r_in} 0 {large} 0 {x3:.2f},{y3:.2f} Z")
        s += f'<path d="{dpath}" fill="{d["color"]}" stroke="#080B14" stroke-width="2"/>'
    return s

# ------------------------------------------------------- centered icon + text
def est_w(s, size, factor=0.52):
    return len(str(s)) * size * factor

def hcenter_icon_text(cx, cy_mid, ic, icsize, iccolor, text, size, color, weight, gap=6):
    """RTL flex row, centered: [icon][text]."""
    tw = est_w(text, size)
    total = icsize + gap + tw
    ix = cx + total / 2 - icsize
    s = icon(ic, ix, cy_mid - icsize / 2, icsize, iccolor)
    s += txt(ix - gap, cy_mid, text, size, color, weight, "end", baseline="central")
    return s
