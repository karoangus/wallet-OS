# -*- coding: utf-8 -*-
"""WalletOS mockups — hero banner 1600x800 (vector composite + typography)."""
import os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from theme_data import *
from svgkit import *
from screens_a import home_body
from screens_b import scr_reports, scr_goals

HW, HH = 1600, 800

def inner(doc_svg):
    s = re.sub(r'^<svg[^>]*>', '', doc_svg.strip())
    s = re.sub(r'</svg>$', '', s.strip())
    return s

def phone(content_inner, x, y, sc, clip_id):
    w, h = 390 * sc, 844 * sc
    s = rect(x - 30, y - 10, w + 60, h + 60, "#000000", rx=70, opacity=0.55).replace(
        "/>", ' filter="url(#blur40)"/>')
    # frame
    fx, fy = x - 14 * sc, y - 14 * sc
    fw, fh = 390 * sc + 28 * sc, 844 * sc + 28 * sc
    s += rect(fx, fy, fw, fh, "#0B0F1C", rx=64 * sc, stroke="rgba(237,241,251,0.16)", sw=2)
    s += (f'<clipPath id="{clip_id}"><rect x="{x}" y="{y}" width="{w}" height="{h}" '
          f'rx="{50 * sc}"/></clipPath>')
    s += f'<g clip-path="url(#{clip_id})"><g transform="translate({x},{y}) scale({sc})">'
    s += content_inner
    s += "</g></g>"
    return s

def build(m):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{HW}" height="{HH}" '
         f'viewBox="0 0 {HW} {HH}" style="direction:rtl">')
    s += ("""<defs>
<radialGradient id="hbg" gradientUnits="userSpaceOnUse" cx="1150" cy="-150" r="1050">
<stop offset="0" stop-color="#16233F"/><stop offset="0.5" stop-color="#0A0E1A"/>
<stop offset="1" stop-color="#060810"/>
</radialGradient>
<linearGradient id="hlogo" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#3E7BFA"/><stop offset="1" stop-color="#1c4fd6"/>
</linearGradient>
<filter id="blur40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="blur8" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>""")
    s += rect(0, 0, HW, HH, "url(#hbg)")
    s += circle(1250, 420, 220, Y["primary"], opacity=0.14).replace("/>", ' filter="url(#blur40)"/>')
    s += circle(250, 680, 180, Y["income"], opacity=0.07).replace("/>", ' filter="url(#blur40)"/>')
    # phones (right half)
    s += phone(inner(scr_reports(m)), 872, 150, 0.62, "clipP0")
    s += phone(inner(scr_goals(m)), 1270, 150, 0.62, "clipP1")
    s += phone(home_body(m), 1052, 66, 0.74, "clipP2")
    # text block (left, right-aligned at x=760)
    R = 760
    s += rect(R - 92, 128, 92, 92, "url(#hlogo)", rx=26)
    s += rect(R - 92, 134, 92, 92, Y["primary"], rx=26, opacity=0.4).replace(
        "/>", ' filter="url(#blur8)"/>')
    s += rect(R - 92, 128, 92, 92, "url(#hlogo)", rx=26)
    s += icon_center("Xi", R - 46, 128 + 46, 44, "#fff")
    s += txt(R - 112, 128 + 62, "WalletOS", 58, Y["text"], 900, "end")
    s += txt(R, 300, "کیف پول دیجیتال آفلاین", 30, Y["primaryLight"], 800, "end")
    s += txt(R, 348, "مدیریت هزینه، درآمد، بودجه و اهداف مالی", 19, Y["textMuted"], 400, "end")
    s += txt(R, 380, "بدون حساب کاربری، بدون سرور، بدون ردیابی", 19, Y["textMuted"], 400, "end")
    # pills
    pills = [("۱۰۰٪ آفلاین", Y["income"]), ("PWA", Y["primaryLight"]),
             ("فارسی و راست‌چین", Y["gold"]), ("IndexedDB", Y["textMuted"])]
    px = R
    py = 430
    for label, col in pills:
        w = len(label) * 11.5 + 44
        s += rect(px - w, py, w, 46, f"{col}18", rx=23, stroke=f"{col}55", sw=1.5)
        s += txt(px - w / 2, py + 23, label, 16.5, col, 800, "middle", baseline="central")
        px -= w + 12
    s += txt(R, 540, "v2.0.0 · MIT", 15, Y["textFaint"], 400, "end")
    s += "</svg>"
    return s

if __name__ == "__main__":
    m = build_model()
    here = os.path.dirname(os.path.abspath(__file__))
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "out", "hero.svg")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(build(m))
    print("wrote hero")
