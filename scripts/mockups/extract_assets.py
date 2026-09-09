# -*- coding: utf-8 -*-
"""Extract the app's exact Lucide icon paths from index.html into .cache/icons/.

The bundle inlines every icon as React elements; this converts each definition
to a standalone SVG so the gallery generator reuses pixel-identical artwork.
Usage: python3 extract_assets.py  (run from anywhere inside the repo)
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def repo_root():
    d = HERE
    while True:
        if os.path.exists(os.path.join(d, "index.html")) and os.path.exists(os.path.join(d, "sw.js")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            raise SystemExit("repo root (index.html + sw.js) not found")
        d = parent


def el_to_svg(m):
    tag, attrs = m.group(1), m.group(2)
    pairs = re.findall(r'([a-zA-Z0-9_]+):(?:"([^"]*)"|([0-9.]+))', attrs)
    out = [f'{k}="{v}"' for k, v, _ in pairs if k != "key"]
    if "fill" in attrs and not any(o.startswith("fill=") for o in out):
        out.append('fill="currentColor"')
    return f"<{tag} {' '.join(out)}/>"


def main():
    root = repo_root()
    src = open(os.path.join(root, "index.html"), encoding="utf-8").read()
    outdir = os.path.join(HERE, ".cache", "icons")
    os.makedirs(outdir, exist_ok=True)
    # every icon def matches  VAR=t=>(0,S.jsx[s])(j,   (Xi uses a
    # destructured-props variant instead of `t`)
    pat = re.compile(r"[^A-Za-z0-9_$]([A-Za-z_$][A-Za-z0-9_$]{1,2})"
                     r"=(?:t|\(\{[^}]*\}\))=>\(0,S\.jsx[s]?\)\(j,")
    count = 0
    for d in pat.finditer(src):
        var = d.group(1)
        if var in ("o", "S", "j"):
            continue
        ci = src.find("children:", d.end())
        if ci < 0 or ci > d.end() + 400:
            continue
        p = ci + len("children:")
        if src[p] == "[":
            depth, i, instr = 1, p + 1, None
            while depth > 0:
                ch = src[i]
                if instr:
                    if ch == "\\":
                        i += 1
                    elif ch == instr:
                        instr = None
                else:
                    if ch in "\"'":
                        instr = ch
                    elif ch == "[":
                        depth += 1
                    elif ch == "]":
                        depth -= 1
                i += 1
            body = src[p + 1:i - 1]
        else:  # single element: (0,S.jsx)("tag",{...})
            m = re.match(r'\(0,S\.jsx\)\("[a-z]+",\{(.*?)\}\)', src[p:p + 2000])
            if not m:
                continue
            body = m.group(0)
        inner = re.sub(r'\(0,S\.jsx\)\("([a-z]+)",\{(.*?)\}\)', el_to_svg, body)
        inner = inner.replace(">,<", "><")
        if "(0,S.jsx)" in inner or not inner.startswith("<"):
            continue  # not an icon (false positive)
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" '
               'fill="none" stroke="currentColor" stroke-width="2" '
               'stroke-linecap="round" stroke-linejoin="round">' + inner + "</svg>")
        open(os.path.join(outdir, f"{var}.svg"), "w", encoding="utf-8").write(svg)
        count += 1
    # aliases used by the app
    base = open(os.path.join(outdir, "I0.svg"), encoding="utf-8").read()
    open(os.path.join(outdir, "qv.svg"), "w", encoding="utf-8").write(base)
    print(f"extracted {count} icons (+1 alias) -> {outdir}")


if __name__ == "__main__":
    sys.exit(main())
