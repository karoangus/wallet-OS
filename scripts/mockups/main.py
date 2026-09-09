# -*- coding: utf-8 -*-
"""WalletOS mockups — build all screen SVGs."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from theme_data import build_model
from screens_a import scr_onboarding, scr_home, scr_transactions, scr_add
from screens_b import scr_budgets, scr_goals, scr_reports, scr_more, scr_settings, scr_categories

_HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(_HERE, "out")
os.makedirs(OUT, exist_ok=True)

SCREENS = [
    ("01-onboarding", scr_onboarding),
    ("02-home", scr_home),
    ("03-transactions", scr_transactions),
    ("04-add-transaction", scr_add),
    ("05-budgets", scr_budgets),
    ("06-goals", scr_goals),
    ("07-reports", scr_reports),
    ("08-more", scr_more),
    ("09-settings", scr_settings),
    ("10-categories", scr_categories),
]

def main(only=None):
    m = build_model()
    for name, fn in SCREENS:
        if only and name != only:
            continue
        try:
            svg = fn() if name == "01-onboarding" else fn(m)
        except TypeError:
            svg = fn(m)
        open(os.path.join(OUT, f"{name}.svg"), "w", encoding="utf-8").write(svg)
        print("wrote", name)

if __name__ == "__main__":
    # usage: main.py [screen-name] [out-dir]
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if only and ("/" in only or only.startswith("-")):
        only = None
    main(only)
