import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Wallet, PlusCircle, ArrowDownLeft, ArrowUpRight, Search, SlidersHorizontal, X, Check,
  Trash2, Pencil, Home, Receipt, PiggyBank, Target, BarChart3, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, Download, Upload, RotateCcw, Tag as TagIcon, Calendar,
  TrendingUp, TrendingDown, Sparkles, UtensilsCrossed, ShoppingBag, Car, Gamepad2,
  GraduationCap, Wifi, HeartPulse, Video, MoreHorizontal, Landmark, Banknote,
  ChevronDown, Plus, Minus, ArrowRight, Flame, CircleDollarSign, Layers, Trophy,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area,
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const C = {
  bg: "#080B14",
  bgGrad: "radial-gradient(1200px 600px at 50% -10%, #14203F 0%, #080B14 55%, #060810 100%)",
  surface: "#10152791",
  surfaceSolid: "#111629",
  surfaceRaised: "#161C34",
  border: "rgba(148,163,207,0.12)",
  borderStrong: "rgba(148,163,207,0.22)",
  primary: "#3E7BFA",
  primaryLight: "#6FA1FF",
  primaryDim: "#1B3B7A",
  primaryGlow: "rgba(62,123,250,0.5)",
  income: "#33D6A6",
  incomeDim: "rgba(51,214,166,0.14)",
  expense: "#FB7185",
  expenseDim: "rgba(251,113,133,0.14)",
  gold: "#F5B947",
  text: "#EDF1FB",
  textMuted: "#8D96B8",
  textFaint: "#5B6488",
  cash: "#F5B947",
  bank: "#6FA1FF",
};

const FONT_HEAD = "'Vazirmatn', sans-serif";
const FONT_NUM = "'Vazirmatn', 'JetBrains Mono', monospace";

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { margin: 0; }
      .wos-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
      .wos-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,207,0.25); border-radius: 4px; }
      @keyframes wosPulse { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
      @keyframes wosSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes wosSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes wosFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes wosPop { 0% { transform: scale(.92); opacity:0; } 100% { transform: scale(1); opacity:1; } }
      .wos-anim-up { animation: wosSlideUp .35s cubic-bezier(.2,.8,.2,1) both; }
      .wos-anim-pop { animation: wosPop .28s cubic-bezier(.2,.8,.2,1) both; }
      .wos-anim-fade { animation: wosFadeIn .25s ease both; }
      .wos-press { transition: transform .12s ease, filter .12s ease; }
      .wos-press:active { transform: scale(.96); filter: brightness(.92); }
      input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: .6; }
      @media (prefers-reduced-motion: reduce) {
        .wos-anim-up, .wos-anim-pop, .wos-anim-fade { animation: none !important; }
      }
    `}</style>
  );
}

/* ============================================================
   INDEXEDDB LAYER
   ============================================================ */
const DB_NAME = "walletos-db";
const STORES = ["meta", "transactions", "categories", "tags", "budgets", "goals"];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      STORES.forEach((s) => {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbGetAll(db, store) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const r = tx.objectStore(store).getAll();
    r.onsuccess = () => resolve(r.result || []);
    r.onerror = () => reject(r.error);
  });
}
function idbPut(db, store, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
}
function idbDelete(db, store, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
}
function idbClearAll(db) {
  return Promise.all(
    STORES.map(
      (s) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(s, "readwrite");
          tx.objectStore(s).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        })
    )
  );
}

/* ============================================================
   UTILITIES
   ============================================================ */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
function toToman(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString("fa-IR");
}
function toEnGroup(n) {
  const v = Math.round(Number(n) || 0);
  if (!isFinite(v)) return "";
  return v.toLocaleString("en-US");
}
function parseAmountInput(str) {
  const digits = String(str).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const JALALI_MONTHS = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}
function jalaliStr(iso, opts = {}) {
  const d = new Date(iso);
  const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  if (opts.short) return `${jd} ${JALALI_MONTHS[jm - 1].slice(0, 3)}`;
  if (opts.monthYear) return `${JALALI_MONTHS[jm - 1]} ${jy}`;
  if (opts.dayMonth) return `${jd} ${JALALI_MONTHS[jm - 1]}`;
  return `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`;
}
function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function isToday(iso) {
  const d = new Date(iso), n = new Date();
  return d.toDateString() === n.toDateString();
}
function isThisWeek(iso) {
  const d = new Date(iso), n = new Date();
  const start = new Date(n); start.setDate(n.getDate() - n.getDay()); start.setHours(0,0,0,0);
  return d >= start && d <= n;
}
function isThisMonth(iso) {
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
}
function isThisYear(iso) {
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear();
}

/* ============================================================
   SEED DATA
   ============================================================ */
const ICONS = {
  UtensilsCrossed, ShoppingBag, Car, Gamepad2, GraduationCap, Receipt, Wifi,
  HeartPulse, Video, Wallet, MoreHorizontal, PiggyBank, Target, TrendingUp,
  Landmark, Banknote, Sparkles, Flame, Trophy, CircleDollarSign, Layers, TagIcon,
};
const ICON_NAMES = Object.keys(ICONS);

const DEFAULT_CATEGORIES = [
  { id: "food", name: "خوراک", icon: "UtensilsCrossed", color: "#FB923C" },
  { id: "shopping", name: "خرید", icon: "ShoppingBag", color: "#F472B6" },
  { id: "transport", name: "رفت‌وآمد", icon: "Car", color: "#60A5FA" },
  { id: "gaming", name: "گیم", icon: "Gamepad2", color: "#A78BFA" },
  { id: "education", name: "آموزش", icon: "GraduationCap", color: "#34D399" },
  { id: "bills", name: "قبض‌ها", icon: "Receipt", color: "#FBBF24" },
  { id: "internet", name: "اینترنت", icon: "Wifi", color: "#22D3EE" },
  { id: "health", name: "سلامت", icon: "HeartPulse", color: "#F87171" },
  { id: "content", name: "تولید محتوا", icon: "Video", color: "#818CF8" },
  { id: "salary", name: "درآمد", icon: "Wallet", color: "#33D6A6" },
  { id: "other", name: "متفرقه", icon: "MoreHorizontal", color: "#94A3B8" },
];
const DEFAULT_TAGS = ["خانواده", "کار", "دوستان", "شخصی"].map((name) => ({ id: uid(), name }));

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function GlassCard({ children, style, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`wos-anim-up ${className}`}
      style={{
        background: C.surface,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${C.border}`,
        borderRadius: 22,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function IconTile({ icon, color, size = 40 }) {
  const Ic = ICONS[icon] || MoreHorizontal;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.34,
        background: `${color}22`, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}
    >
      <Ic size={size * 0.5} color={color} strokeWidth={2.2} />
    </div>
  );
}

function ProgressBar({ pct, color, height = 8, bg }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ width: "100%", height, borderRadius: 99, background: bg || "rgba(148,163,207,0.14)", overflow: "hidden" }}>
      <div
        style={{
          width: `${clamped}%`, height: "100%", borderRadius: 99,
          background: color, transition: "width .6s cubic-bezier(.2,.8,.2,1)",
          boxShadow: `0 0 10px ${color}88`,
        }}
      />
    </div>
  );
}

function Chip({ active, children, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="wos-press"
      style={{
        padding: "7px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
        border: `1px solid ${active ? (color || C.primary) : C.border}`,
        background: active ? `${color || C.primary}22` : "transparent",
        color: active ? (color || C.primaryLight) : C.textMuted,
        whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Sheet({ open, onClose, title, children, height = "auto" }) {
  if (!open) return null;
  return (
    <div
      className="wos-anim-fade"
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(4,6,12,0.72)", backdropFilter: "blur(2px)" }} />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 480, maxHeight: "92vh", height,
          background: C.surfaceSolid, borderRadius: "26px 26px 0 0",
          border: `1px solid ${C.borderStrong}`, borderBottom: "none",
          animation: "wosSheetUp .32s cubic-bezier(.2,.8,.2,1) both",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: C.border }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 8px" }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: C.text }}>{title}</span>
          <button onClick={onClose} className="wos-press" style={{ background: C.surfaceRaised, border: "none", borderRadius: 12, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={17} color={C.textMuted} />
          </button>
        </div>
        <div className="wos-scroll" style={{ overflowY: "auto", padding: "4px 20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: C.surfaceRaised, border: `1px solid ${C.border}`,
  borderRadius: 14, padding: "13px 14px", color: C.text, fontSize: 15,
  fontFamily: FONT_HEAD, outline: "none",
};

function BigButton({ children, onClick, color = C.primary, disabled, variant = "solid" }) {
  const solid = variant === "solid";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="wos-press"
      style={{
        width: "100%", padding: "15px", borderRadius: 16, fontSize: 15.5, fontWeight: 800,
        border: solid ? "none" : `1.5px solid ${color}`,
        background: solid ? (disabled ? "#2a3350" : color) : "transparent",
        color: solid ? "#0A0E1A" : color,
        boxShadow: solid && !disabled ? `0 8px 24px -8px ${color}99` : "none",
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: FONT_HEAD,
      }}
    >
      {children}
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="wos-anim-pop"
      style={{
        position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)",
        background: C.surfaceRaised, border: `1px solid ${C.borderStrong}`,
        borderRadius: 14, padding: "11px 20px", color: C.text, fontSize: 13.5,
        fontWeight: 600, zIndex: 100, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      }}
    >
      <Check size={15} color={C.income} /> {toast}
    </div>
  );
}

function EmptyState({ icon: Icon, text, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: C.textFaint }}>
      <Icon size={34} style={{ opacity: 0.5, marginBottom: 10 }} />
      <div style={{ fontSize: 14.5, fontWeight: 700, color: C.textMuted }}>{text}</div>
      {sub && <div style={{ fontSize: 12.5, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ============================================================
   AMOUNT INPUT (comma formatted)
   ============================================================ */
function AmountInput({ value, onChange, placeholder = "۰", autoFocus }) {
  const [raw, setRaw] = useState(value ? toEnGroup(value) : "");
  useEffect(() => { setRaw(value ? toEnGroup(value) : ""); }, [value]);
  return (
    <div style={{ position: "relative" }}>
      <input
        autoFocus={autoFocus}
        inputMode="numeric"
        value={raw}
        onChange={(e) => {
          const n = parseAmountInput(e.target.value);
          setRaw(n ? toEnGroup(n) : "");
          onChange(n);
        }}
        placeholder={placeholder}
        style={{
          ...inputStyle, fontFamily: FONT_NUM, fontSize: 22, fontWeight: 800,
          padding: "16px 62px 16px 14px", textAlign: "right", letterSpacing: 0.5,
        }}
      />
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textFaint, fontSize: 13, fontWeight: 700 }}>
        تومان
      </span>
    </div>
  );
}

/* ============================================================
   TRANSACTION FORM
   ============================================================ */
function TransactionForm({ initial, categories, tags, onSubmit, onDelete, onAddTag }) {
  const [type, setType] = useState(initial?.type || "expense");
  const [amount, setAmount] = useState(initial?.amount || 0);
  const [wallet, setWallet] = useState(initial?.wallet || "cash");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id);
  const [selTags, setSelTags] = useState(initial?.tags || []);
  const [desc, setDesc] = useState(initial?.description || "");
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [newTag, setNewTag] = useState("");

  const cats = categories;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, background: C.surfaceRaised, padding: 5, borderRadius: 14 }}>
        {[{ k: "expense", label: "هزینه", color: C.expense, Icon: ArrowDownLeft }, { k: "income", label: "درآمد", color: C.income, Icon: ArrowUpRight }].map((t) => (
          <button
            key={t.k}
            onClick={() => setType(t.k)}
            className="wos-press"
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: type === t.k ? t.color : "transparent",
              color: type === t.k ? "#0A0E1A" : C.textMuted, fontWeight: 800, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <t.Icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <Field label="مبلغ">
        <AmountInput value={amount} onChange={setAmount} autoFocus />
      </Field>

      <Field label="کیف پول">
        <div style={{ display: "flex", gap: 8 }}>
          {[{ k: "cash", label: "نقدی", Icon: Banknote, color: C.cash }, { k: "bank", label: "بانک", Icon: Landmark, color: C.bank }].map((w) => (
            <button
              key={w.k}
              onClick={() => setWallet(w.k)}
              className="wos-press"
              style={{
                flex: 1, padding: "12px 0", borderRadius: 14, cursor: "pointer",
                border: `1.5px solid ${wallet === w.k ? w.color : C.border}`,
                background: wallet === w.k ? `${w.color}18` : "transparent",
                color: wallet === w.k ? w.color : C.textMuted, fontWeight: 700, fontSize: 13.5,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <w.Icon size={15} /> {w.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="دسته‌بندی">
        <div className="wos-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {cats.map((c) => (
            <button key={c.id} onClick={() => setCategoryId(c.id)} className="wos-press" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0, width: 62 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: categoryId === c.id ? c.color : `${c.color}1c`, border: categoryId === c.id ? `2px solid ${c.color}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.createElement(ICONS[c.icon] || MoreHorizontal, { size: 20, color: categoryId === c.id ? "#0A0E1A" : c.color, strokeWidth: 2.3 })}
              </div>
              <span style={{ fontSize: 10.5, color: categoryId === c.id ? C.text : C.textFaint, fontWeight: 600, textAlign: "center" }}>{c.name}</span>
            </button>
          ))}
        </div>
      </Field>

      <Field label="برچسب‌ها (اختیاری)">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {tags.map((t) => (
            <Chip key={t.id} active={selTags.includes(t.id)} color={C.primary} onClick={() => setSelTags((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))}>
              {t.name}
            </Chip>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="برچسب جدید…" style={{ ...inputStyle, padding: "9px 12px", fontSize: 13 }} />
          <button
            className="wos-press"
            onClick={() => { if (newTag.trim()) { const t = onAddTag(newTag.trim()); setSelTags((s) => [...s, t.id]); setNewTag(""); } }}
            style={{ background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0 14px", color: C.primaryLight, fontWeight: 700, cursor: "pointer" }}
          >
            افزودن
          </button>
        </div>
      </Field>

      <Field label="تاریخ">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
      </Field>

      <Field label="توضیحات (اختیاری)">
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="مثلاً: ناهار با دوستان" style={inputStyle} />
      </Field>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        {initial && (
          <button onClick={() => onDelete(initial.id)} className="wos-press" style={{ width: 52, borderRadius: 16, border: `1.5px solid ${C.expense}44`, background: "transparent", cursor: "pointer" }}>
            <Trash2 size={18} color={C.expense} style={{ margin: "auto" }} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <BigButton
            color={type === "income" ? C.income : C.primary}
            disabled={!amount}
            onClick={() =>
              onSubmit({
                id: initial?.id || uid(), type, amount, wallet, categoryId,
                tags: selTags, description: desc, date: new Date(date).toISOString(),
                createdAt: initial?.createdAt || Date.now(),
              })
            }
          >
            {initial ? "ذخیره تغییرات" : "ثبت تراکنش"}
          </BigButton>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BUDGET / GOAL / CATEGORY FORMS
   ============================================================ */
function BudgetForm({ initial, categories, budgets, onSubmit, onDelete }) {
  const usedIds = budgets.map((b) => b.categoryId).filter((id) => id !== initial?.categoryId);
  const available = categories.filter((c) => c.id !== "salary" && !usedIds.includes(c.id));
  const [categoryId, setCategoryId] = useState(initial?.categoryId || available[0]?.id);
  const [amount, setAmount] = useState(initial?.amount || 0);
  return (
    <div>
      <Field label="دسته‌بندی">
        <div className="wos-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {available.map((c) => (
            <button key={c.id} onClick={() => setCategoryId(c.id)} className="wos-press" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0, width: 62 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: categoryId === c.id ? c.color : `${c.color}1c`, border: categoryId === c.id ? `2px solid ${c.color}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.createElement(ICONS[c.icon] || MoreHorizontal, { size: 20, color: categoryId === c.id ? "#0A0E1A" : c.color })}
              </div>
              <span style={{ fontSize: 10.5, color: categoryId === c.id ? C.text : C.textFaint, fontWeight: 600 }}>{c.name}</span>
            </button>
          ))}
          {available.length === 0 && <span style={{ color: C.textFaint, fontSize: 13 }}>همه‌ی دسته‌بندی‌ها بودجه دارند</span>}
        </div>
      </Field>
      <Field label="سقف بودجه ماهانه">
        <AmountInput value={amount} onChange={setAmount} />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        {initial && (
          <button onClick={() => onDelete(initial.id)} className="wos-press" style={{ width: 52, borderRadius: 16, border: `1.5px solid ${C.expense}44`, background: "transparent", cursor: "pointer" }}>
            <Trash2 size={18} color={C.expense} style={{ margin: "auto" }} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <BigButton disabled={!amount || !categoryId} onClick={() => onSubmit({ id: initial?.id || uid(), categoryId, amount })}>
            {initial ? "ذخیره تغییرات" : "تعیین بودجه"}
          </BigButton>
        </div>
      </div>
    </div>
  );
}

function GoalForm({ initial, onSubmit, onDelete }) {
  const [name, setName] = useState(initial?.name || "");
  const [target, setTarget] = useState(initial?.target || 0);
  const [icon, setIcon] = useState(initial?.icon || "Target");
  const pickIcons = ["Target", "Trophy", "Gamepad2", "Car", "GraduationCap", "Sparkles", "Flame", "PiggyBank"];
  return (
    <div>
      <Field label="نام هدف">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: خرید PC گیمینگ" style={inputStyle} />
      </Field>
      <Field label="آیکون">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pickIcons.map((ic) => (
            <button key={ic} onClick={() => setIcon(ic)} className="wos-press" style={{ width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${icon === ic ? C.primary : C.border}`, background: icon === ic ? `${C.primary}22` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {React.createElement(ICONS[ic], { size: 19, color: icon === ic ? C.primaryLight : C.textMuted })}
            </button>
          ))}
        </div>
      </Field>
      <Field label="مبلغ هدف">
        <AmountInput value={target} onChange={setTarget} />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        {initial && (
          <button onClick={() => onDelete(initial.id)} className="wos-press" style={{ width: 52, borderRadius: 16, border: `1.5px solid ${C.expense}44`, background: "transparent", cursor: "pointer" }}>
            <Trash2 size={18} color={C.expense} style={{ margin: "auto" }} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <BigButton color={C.gold} disabled={!name.trim() || !target} onClick={() => onSubmit({ id: initial?.id || uid(), name: name.trim(), target, icon, contributions: initial?.contributions || [], createdAt: initial?.createdAt || Date.now() })}>
            {initial ? "ذخیره تغییرات" : "ساخت هدف"}
          </BigButton>
        </div>
      </div>
    </div>
  );
}

function ContributionForm({ goal, onSubmit }) {
  const [amount, setAmount] = useState(0);
  return (
    <div>
      <Field label={`واریز به «${goal.name}»`}>
        <AmountInput value={amount} onChange={setAmount} autoFocus />
      </Field>
      <BigButton color={C.gold} disabled={!amount} onClick={() => onSubmit(amount)}>افزودن به هدف</BigButton>
    </div>
  );
}

function CategoryForm({ initial, onSubmit, onDelete }) {
  const [name, setName] = useState(initial?.name || "");
  const [icon, setIcon] = useState(initial?.icon || "MoreHorizontal");
  const palette = ["#FB923C", "#F472B6", "#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#22D3EE", "#F87171", "#818CF8", "#94A3B8", "#33D6A6", "#F5B947"];
  const [color, setColor] = useState(initial?.color || palette[0]);
  return (
    <div>
      <Field label="نام دسته‌بندی">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: کتاب" style={inputStyle} />
      </Field>
      <Field label="آیکون">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ICON_NAMES.map((ic) => (
            <button key={ic} onClick={() => setIcon(ic)} className="wos-press" style={{ width: 40, height: 40, borderRadius: 11, border: `1.5px solid ${icon === ic ? color : C.border}`, background: icon === ic ? `${color}22` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {React.createElement(ICONS[ic], { size: 17, color: icon === ic ? color : C.textMuted })}
            </button>
          ))}
        </div>
      </Field>
      <Field label="رنگ">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {palette.map((cl) => (
            <button key={cl} onClick={() => setColor(cl)} className="wos-press" style={{ width: 30, height: 30, borderRadius: "50%", background: cl, border: color === cl ? `2.5px solid ${C.text}` : "2.5px solid transparent", cursor: "pointer" }} />
          ))}
        </div>
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        {initial && !["salary"].includes(initial.id) && (
          <button onClick={() => onDelete(initial.id)} className="wos-press" style={{ width: 52, borderRadius: 16, border: `1.5px solid ${C.expense}44`, background: "transparent", cursor: "pointer" }}>
            <Trash2 size={18} color={C.expense} style={{ margin: "auto" }} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <BigButton disabled={!name.trim()} onClick={() => onSubmit({ id: initial?.id || uid(), name: name.trim(), icon, color })}>
            {initial ? "ذخیره تغییرات" : "ساخت دسته‌بندی"}
          </BigButton>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FIRST RUN
   ============================================================ */
function FirstRunScreen({ onDone }) {
  const [cash, setCash] = useState(0);
  const [bank, setBank] = useState(0);
  return (
    <div style={{ minHeight: "100vh", background: C.bgGrad, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, fontFamily: FONT_HEAD }}>
      <div className="wos-anim-up" style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: 74, height: 74, borderRadius: 22, background: `linear-gradient(140deg, ${C.primary}, #1c4fd6)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${C.primaryGlow}` }}>
            <Wallet size={34} color="#fff" />
          </div>
        </div>
        <h1 style={{ textAlign: "center", fontSize: 24, fontWeight: 900, color: C.text, margin: "0 0 6px" }}>به WalletOS خوش اومدی</h1>
        <p style={{ textAlign: "center", fontSize: 14, color: C.textMuted, margin: "0 0 30px", lineHeight: 1.8 }}>
          برای شروع، موجودی فعلی‌ات رو وارد کن. از این به بعد هر تراکنش خودکار حسابش می‌رسه.
        </p>
        <GlassCard style={{ padding: 20, marginBottom: 14 }}>
          <Field label="💵 موجودی نقدی">
            <AmountInput value={cash} onChange={setCash} autoFocus />
          </Field>
          <Field label="💳 موجودی بانکی">
            <AmountInput value={bank} onChange={setBank} />
          </Field>
        </GlassCard>
        <div style={{ textAlign: "center", color: C.textFaint, fontSize: 13, marginBottom: 18 }}>
          مجموع اولیه: <span style={{ color: C.primaryLight, fontFamily: FONT_NUM, fontWeight: 800 }}>{toToman(cash + bank)} تومان</span>
        </div>
        <BigButton onClick={() => onDone(cash, bank)}>شروع کن</BigButton>
      </div>
    </div>
  );
}

/* ============================================================
   TRANSACTION TIMELINE ITEM
   ============================================================ */
function TransactionItem({ tx, category, onClick, runningBalance, isLast }) {
  const isIncome = tx.type === "income";
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isIncome ? C.income : C.expense, boxShadow: `0 0 8px ${isIncome ? C.income : C.expense}` }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: "linear-gradient(180deg, rgba(148,163,207,0.25), transparent)", marginTop: 4 }} />}
      </div>
      <button onClick={onClick} className="wos-press" style={{ flex: 1, background: "none", border: "none", padding: 0, marginBottom: 20, cursor: "pointer", textAlign: "right" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <IconTile icon={category?.icon} color={category?.color || C.textFaint} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {tx.description || category?.name || "تراکنش"}
            </div>
            <div style={{ fontSize: 12, color: C.textFaint, marginTop: 2 }}>
              {category?.name} · {tx.wallet === "cash" ? "نقدی" : "بانک"} · {jalaliStr(tx.date, { short: true })}
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: FONT_NUM, fontWeight: 800, fontSize: 15, color: isIncome ? C.income : C.expense }}>
              {isIncome ? "+" : "−"}{toToman(tx.amount)}
            </div>
            {runningBalance !== undefined && (
              <div style={{ fontSize: 10.5, color: C.textFaint, fontFamily: FONT_NUM, marginTop: 2 }}>مانده: {toToman(runningBalance)}</div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

/* ============================================================
   CHARTS
   ============================================================ */
function ChartCard({ title, icon: Icon, children, right }) {
  return (
    <GlassCard style={{ padding: "18px 16px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, paddingInline: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Icon && <Icon size={15} color={C.primaryLight} />}
          <span style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>{title}</span>
        </div>
        {right}
      </div>
      {children}
    </GlassCard>
  );
}

function BalanceTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={170}>
      <AreaChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.primary} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,207,0.08)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: C.textFaint, fontSize: 10.5, fontFamily: FONT_HEAD }} axisLine={false} tickLine={false} />
        <YAxis hide domain={["dataMin - 100000", "dataMax + 100000"]} />
        <Tooltip
          contentStyle={{ background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: 12, fontFamily: FONT_HEAD, fontSize: 12 }}
          labelStyle={{ color: C.textMuted }}
          formatter={(v) => [toToman(v) + " تومان", "مانده"]}
        />
        <Area type="monotone" dataKey="balance" stroke={C.primary} strokeWidth={2.5} fill="url(#balGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CategoryPieChart({ data }) {
  if (!data.length) return <EmptyState icon={Layers} text="هنوز هزینه‌ای ثبت نشده" />;
  return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3} strokeWidth={0}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip contentStyle={{ background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: 12, fontFamily: FONT_HEAD, fontSize: 12 }} formatter={(v) => toToman(v) + " ت"} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function IncomeExpenseBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,207,0.08)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: C.textFaint, fontSize: 10.5, fontFamily: FONT_HEAD }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: 12, fontFamily: FONT_HEAD, fontSize: 12 }} formatter={(v) => toToman(v) + " ت"} />
        <Bar dataKey="income" fill={C.income} radius={[6, 6, 0, 0]} maxBarSize={16} />
        <Bar dataKey="expense" fill={C.expense} radius={[6, 6, 0, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ============================================================
   BOTTOM NAV + FAB
   ============================================================ */
const NAV_ITEMS = [
  { k: "dashboard", label: "خانه", Icon: Home },
  { k: "transactions", label: "تراکنش‌ها", Icon: Receipt },
  { k: "fab", label: "", Icon: null },
  { k: "budgets", label: "بودجه", Icon: PiggyBank },
  { k: "more", label: "بیشتر", Icon: SlidersHorizontal },
];

function BottomNav({ tab, setTab, onFab, moreOpen, setMoreOpen }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto", width: "100%", maxWidth: 480, margin: "0 auto", background: "rgba(12,15,28,0.85)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 6px calc(10px + env(safe-area-inset-bottom))" }}>
        {NAV_ITEMS.map((it) => {
          if (it.k === "fab") {
            return (
              <button key="fab" onClick={onFab} className="wos-press" style={{ width: 54, height: 54, borderRadius: 18, marginTop: -26, border: "none", background: `linear-gradient(140deg, ${C.primaryLight}, ${C.primary})`, boxShadow: `0 8px 22px -4px ${C.primaryGlow}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Plus size={26} color="#fff" strokeWidth={2.6} />
              </button>
            );
          }
          const active = it.k === "more" ? moreOpen : tab === it.k && !moreOpen;
          return (
            <button key={it.k} onClick={() => { if (it.k === "more") { setMoreOpen(true); } else { setMoreOpen(false); setTab(it.k); } }} className="wos-press" style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", width: 58, padding: "4px 0" }}>
              <it.Icon size={21} color={active ? C.primaryLight : C.textFaint} strokeWidth={active ? 2.4 : 2} />
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? C.primaryLight : C.textFaint }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MoreSheet({ open, onClose, setTab, setMoreOpen }) {
  const items = [
    { k: "goals", label: "اهداف مالی", Icon: Target, color: C.gold },
    { k: "reports", label: "گزارش‌ها", Icon: BarChart3, color: C.primaryLight },
    { k: "categories", label: "دسته‌بندی‌ها", Icon: Layers, color: "#A78BFA" },
    { k: "settings", label: "تنظیمات", Icon: SettingsIcon, color: C.textMuted },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="بیشتر">
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 10 }}>
        {items.map((it) => (
          <button key={it.k} onClick={() => { setTab(it.k); setMoreOpen(false); }} className="wos-press" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 12px", borderRadius: 16, background: C.surfaceRaised, border: "none", cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, borderRadius: 13, background: `${it.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <it.Icon size={19} color={it.color} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: C.text }}>{it.label}</span>
            <ArrowRight size={16} color={C.textFaint} style={{ marginRight: "auto" }} />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function PageHeader({ title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "22px 20px 14px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 21, fontWeight: 900, color: C.text }}>{title}</h2>
        {sub && <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 3 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function DashboardPage({ balances, txs, categories, monthIncome, monthExpense, budgets, goals, trendData, onOpenTx, onQuickAdd, catMap }) {
  const total = balances.cash + balances.bank;
  const recent = txs.slice(0, 5);
  const topBudget = budgets
    .map((b) => {
      const spent = txs.filter((t) => t.type === "expense" && t.categoryId === b.categoryId && isThisMonth(t.date)).reduce((s, t) => s + t.amount, 0);
      return { ...b, spent, pct: (spent / b.amount) * 100, cat: catMap[b.categoryId] };
    })
    .sort((a, b) => b.pct - a.pct)[0];
  const topGoal = goals
    .map((g) => ({ ...g, current: g.contributions.reduce((s, c) => s + c.amount, 0) }))
    .sort((a, b) => b.current / b.target - a.current / a.target)[0];

  return (
    <div>
      <div style={{ padding: "22px 20px 6px" }}>
        <div style={{ fontSize: 13, color: C.textFaint, fontWeight: 600, marginBottom: 6 }}>موجودی کل</div>
        <GlassCard style={{ padding: "26px 22px", position: "relative", overflow: "hidden", borderColor: `${C.primary}33` }}>
          <div style={{ position: "absolute", top: -60, left: -40, width: 180, height: 180, borderRadius: "50%", background: C.primary, opacity: 0.16, filter: "blur(40px)", animation: "wosPulse 5s ease-in-out infinite" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 34, fontWeight: 900, fontFamily: FONT_NUM, color: C.text, display: "flex", alignItems: "baseline", gap: 8 }}>
              {toToman(total)}
              <span style={{ fontSize: 14, fontWeight: 700, color: C.textFaint }}>تومان</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <div style={{ flex: 1, background: "rgba(245,185,71,0.1)", borderRadius: 14, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
                <Banknote size={16} color={C.cash} />
                <div>
                  <div style={{ fontSize: 10.5, color: C.textFaint, fontWeight: 600 }}>نقدی</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, fontFamily: FONT_NUM, color: C.text }}>{toToman(balances.cash)}</div>
                </div>
              </div>
              <div style={{ flex: 1, background: "rgba(111,161,255,0.1)", borderRadius: 14, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
                <Landmark size={16} color={C.bank} />
                <div>
                  <div style={{ fontSize: 10.5, color: C.textFaint, fontWeight: 600 }}>بانک</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, fontFamily: FONT_NUM, color: C.text }}>{toToman(balances.bank)}</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "16px 20px 4px" }}>
        <button onClick={() => onQuickAdd("income")} className="wos-press" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "13px 0", borderRadius: 16, border: `1.5px solid ${C.income}44`, background: C.incomeDim, color: C.income, fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}>
          <ArrowUpRight size={16} /> افزودن درآمد
        </button>
        <button onClick={() => onQuickAdd("expense")} className="wos-press" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "13px 0", borderRadius: 16, border: `1.5px solid ${C.expense}44`, background: C.expenseDim, color: C.expense, fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}>
          <ArrowDownLeft size={16} /> ثبت هزینه
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "14px 20px 4px" }}>
        <GlassCard style={{ flex: 1, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <TrendingUp size={13} color={C.income} />
            <span style={{ fontSize: 11.5, color: C.textFaint, fontWeight: 700 }}>درآمد این ماه</span>
          </div>
          <div style={{ fontFamily: FONT_NUM, fontWeight: 800, fontSize: 16, color: C.income }}>{toToman(monthIncome)}</div>
        </GlassCard>
        <GlassCard style={{ flex: 1, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <TrendingDown size={13} color={C.expense} />
            <span style={{ fontSize: 11.5, color: C.textFaint, fontWeight: 700 }}>هزینه این ماه</span>
          </div>
          <div style={{ fontFamily: FONT_NUM, fontWeight: 800, fontSize: 16, color: C.expense }}>{toToman(monthExpense)}</div>
        </GlassCard>
      </div>

      {trendData.length > 1 && (
        <div style={{ padding: "16px 20px 4px" }}>
          <ChartCard title="روند موجودی" icon={TrendingUp}><BalanceTrendChart data={trendData} /></ChartCard>
        </div>
      )}

      {topBudget && (
        <div style={{ padding: "16px 20px 4px" }}>
          <GlassCard style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconTile icon={topBudget.cat?.icon} color={topBudget.cat?.color} size={30} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>بودجه {topBudget.cat?.name}</span>
              </div>
              <span style={{ fontSize: 12, fontFamily: FONT_NUM, color: topBudget.pct >= 100 ? C.expense : C.textMuted, fontWeight: 700 }}>{Math.round(topBudget.pct)}٪</span>
            </div>
            <ProgressBar pct={topBudget.pct} color={topBudget.pct >= 90 ? C.expense : C.primary} />
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 8, fontFamily: FONT_NUM }}>{toToman(topBudget.spent)} از {toToman(topBudget.amount)} تومان</div>
          </GlassCard>
        </div>
      )}

      {topGoal && (
        <div style={{ padding: "16px 20px 4px" }}>
          <GlassCard style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconTile icon={topGoal.icon} color={C.gold} size={30} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>هدف: {topGoal.name}</span>
              </div>
              <span style={{ fontSize: 12, fontFamily: FONT_NUM, color: C.gold, fontWeight: 700 }}>{Math.min(100, Math.round((topGoal.current / topGoal.target) * 100))}٪</span>
            </div>
            <ProgressBar pct={(topGoal.current / topGoal.target) * 100} color={C.gold} />
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 8, fontFamily: FONT_NUM }}>{toToman(topGoal.current)} از {toToman(topGoal.target)} تومان</div>
          </GlassCard>
        </div>
      )}

      <div style={{ padding: "18px 20px 100px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 12 }}>تراکنش‌های اخیر</div>
        {recent.length === 0 ? (
          <EmptyState icon={Receipt} text="هنوز تراکنشی ثبت نشده" sub="با دکمه‌ی + یکی اضافه کن" />
        ) : (
          recent.map((tx, i) => <TransactionItem key={tx.id} tx={tx} category={catMap[tx.categoryId]} onClick={() => onOpenTx(tx)} isLast={i === recent.length - 1} />)
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TRANSACTIONS PAGE (search + filters + timeline w/ running balance)
   ============================================================ */
function TransactionsPage({ allTxsWithBalance, categories, catMap, onOpenTx }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("all");
  const [type, setType] = useState("all");
  const [wallet, setWallet] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return allTxsWithBalance.filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (wallet !== "all" && tx.wallet !== wallet) return false;
      if (categoryId !== "all" && tx.categoryId !== categoryId) return false;
      if (range === "today" && !isToday(tx.date)) return false;
      if (range === "week" && !isThisWeek(tx.date)) return false;
      if (range === "month" && !isThisMonth(tx.date)) return false;
      if (range === "year" && !isThisYear(tx.date)) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const cat = catMap[tx.categoryId];
        const hay = [tx.description, cat?.name, String(tx.amount), tx.wallet === "cash" ? "نقدی" : "بانک", jalaliStr(tx.date)].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allTxsWithBalance, query, range, type, wallet, categoryId, catMap]);

  const activeFilterCount = [range !== "all", type !== "all", wallet !== "all", categoryId !== "all"].filter(Boolean).length;

  return (
    <div>
      <PageHeader title="تراکنش‌ها" sub={`${filtered.length} مورد`} />
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color={C.textFaint} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو در مبلغ، دسته، توضیحات…" style={{ ...inputStyle, paddingRight: 38 }} />
        </div>
        <div className="wos-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 10, paddingBottom: 2 }}>
          <Chip active={showFilters || activeFilterCount > 0} onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal size={12} style={{ display: "inline", marginLeft: 4, verticalAlign: -2 }} />
            فیلترها {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Chip>
          {["today", "week", "month", "year"].map((r) => (
            <Chip key={r} active={range === r} onClick={() => setRange(range === r ? "all" : r)}>
              {{ today: "امروز", week: "این هفته", month: "این ماه", year: "امسال" }[r]}
            </Chip>
          ))}
        </div>
        {showFilters && (
          <div className="wos-anim-fade" style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ k: "all", l: "همه" }, { k: "income", l: "درآمد" }, { k: "expense", l: "هزینه" }].map((t) => (
                <Chip key={t.k} active={type === t.k} onClick={() => setType(t.k)} color={t.k === "income" ? C.income : t.k === "expense" ? C.expense : undefined}>{t.l}</Chip>
              ))}
              {[{ k: "all", l: "هر کیف پول" }, { k: "cash", l: "نقدی" }, { k: "bank", l: "بانک" }].map((t) => (
                <Chip key={t.k} active={wallet === t.k} onClick={() => setWallet(t.k)}>{t.l}</Chip>
              ))}
            </div>
            <div className="wos-scroll" style={{ display: "flex", gap: 6, overflowX: "auto" }}>
              <Chip active={categoryId === "all"} onClick={() => setCategoryId("all")}>همه دسته‌ها</Chip>
              {categories.map((c) => <Chip key={c.id} active={categoryId === c.id} onClick={() => setCategoryId(c.id)} color={c.color}>{c.name}</Chip>)}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "6px 20px 100px" }}>
        {filtered.length === 0 ? (
          <EmptyState icon={Search} text="چیزی پیدا نشد" sub="فیلترها یا عبارت جستجو رو تغییر بده" />
        ) : (
          filtered.map((tx, i) => (
            <TransactionItem key={tx.id} tx={tx} category={catMap[tx.categoryId]} onClick={() => onOpenTx(tx)} runningBalance={tx.runningBalance} isLast={i === filtered.length - 1} />
          ))
        )}
      </div>
    </div>
  );
}

/* ============================================================
   BUDGETS PAGE
   ============================================================ */
function BudgetsPage({ budgets, txs, catMap, onOpen, onAdd }) {
  const rows = budgets.map((b) => {
    const spent = txs.filter((t) => t.type === "expense" && t.categoryId === b.categoryId && isThisMonth(t.date)).reduce((s, t) => s + t.amount, 0);
    return { ...b, spent, pct: (spent / b.amount) * 100, cat: catMap[b.categoryId] };
  });
  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  return (
    <div>
      <PageHeader title="بودجه‌بندی" sub="مدیریت هزینه‌های ماهانه" right={
        <button onClick={onAdd} className="wos-press" style={{ background: C.primary, border: "none", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Plus size={19} color="#0A0E1A" /></button>
      } />
      {budgets.length > 0 && (
        <div style={{ padding: "0 20px 14px" }}>
          <GlassCard style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, color: C.textMuted, fontWeight: 700 }}>مجموع بودجه ماه</span>
              <span style={{ fontSize: 12.5, fontFamily: FONT_NUM, color: C.textMuted, fontWeight: 700 }}>{Math.round((totalSpent / totalBudget) * 100) || 0}٪</span>
            </div>
            <ProgressBar pct={(totalSpent / totalBudget) * 100} color={C.primary} height={10} />
            <div style={{ fontSize: 12, fontFamily: FONT_NUM, color: C.textFaint, marginTop: 8 }}>{toToman(totalSpent)} از {toToman(totalBudget)} تومان</div>
          </GlassCard>
        </div>
      )}
      <div style={{ padding: "0 20px 100px", display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.length === 0 ? (
          <EmptyState icon={PiggyBank} text="هنوز بودجه‌ای تعریف نشده" sub="با دکمه‌ی بالا یکی بساز" />
        ) : (
          rows.sort((a, b) => b.pct - a.pct).map((b) => (
            <GlassCard key={b.id} style={{ padding: 16 }} onClick={() => onOpen(b)} className="wos-press">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconTile icon={b.cat?.icon} color={b.cat?.color} size={36} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{b.cat?.name}</div>
                    <div style={{ fontSize: 11, fontFamily: FONT_NUM, color: C.textFaint }}>{toToman(b.spent)} / {toToman(b.amount)}</div>
                  </div>
                </div>
                {b.pct >= 90 && <Flame size={16} color={C.expense} />}
              </div>
              <ProgressBar pct={b.pct} color={b.pct >= 100 ? C.expense : b.pct >= 75 ? C.gold : C.primary} />
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

/* ============================================================
   GOALS PAGE
   ============================================================ */
function GoalsPage({ goals, onOpen, onAdd, onContribute }) {
  return (
    <div>
      <PageHeader title="اهداف مالی" sub="پس‌انداز برای چیزی که می‌خوای" right={
        <button onClick={onAdd} className="wos-press" style={{ background: C.gold, border: "none", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Plus size={19} color="#0A0E1A" /></button>
      } />
      <div style={{ padding: "0 20px 100px", display: "flex", flexDirection: "column", gap: 12 }}>
        {goals.length === 0 ? (
          <EmptyState icon={Target} text="هنوز هدفی نساختی" sub="مثلاً پس‌انداز برای یک PC گیمینگ" />
        ) : (
          goals.map((g) => {
            const current = g.contributions.reduce((s, c) => s + c.amount, 0);
            const pct = Math.min(100, (current / g.target) * 100);
            const remaining = Math.max(0, g.target - current);
            const monthsSince = Math.max(1, Math.round((Date.now() - g.createdAt) / (1000 * 60 * 60 * 24 * 30)));
            const avgMonthly = current / monthsSince;
            const etaMonths = avgMonthly > 0 ? Math.ceil(remaining / avgMonthly) : null;
            return (
              <GlassCard key={g.id} style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div onClick={() => onOpen(g)} className="wos-press" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}>
                    <IconTile icon={g.icon} color={C.gold} size={44} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{g.name}</div>
                      <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 2 }}>
                        {pct >= 100 ? "🎉 تکمیل شد" : etaMonths ? `تخمین رسیدن: ${etaMonths} ماه دیگر` : "هنوز واریزی نداشته"}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 900, fontFamily: FONT_NUM, color: C.gold }}>{Math.round(pct)}٪</span>
                </div>
                <div style={{ marginTop: 14 }}><ProgressBar pct={pct} color={C.gold} height={9} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 11.5, fontFamily: FONT_NUM, color: C.textFaint }}>{toToman(current)} از {toToman(g.target)} ت</span>
                  <span style={{ fontSize: 11.5, fontFamily: FONT_NUM, color: C.textFaint }}>باقی‌مانده: {toToman(remaining)} ت</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => onContribute(g)} className="wos-press" style={{ width: "100%", padding: "10px 0", borderRadius: 12, border: `1.5px solid ${C.gold}55`, background: `${C.gold}18`, color: C.gold, fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Plus size={14} /> واریز به این هدف
                  </button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ============================================================
   REPORTS PAGE (charts + smart insights)
   ============================================================ */
function ReportsPage({ txs, categories, catMap }) {
  const now = new Date();
  const monthTxs = txs.filter((t) => isThisMonth(t.date));
  const monthExpense = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const monthIncome = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const pieData = useMemo(() => {
    const byCat = {};
    monthTxs.filter((t) => t.type === "expense").forEach((t) => { byCat[t.categoryId] = (byCat[t.categoryId] || 0) + t.amount; });
    return Object.entries(byCat).map(([id, value]) => ({ name: catMap[id]?.name || "نامشخص", value, color: catMap[id]?.color || "#888" })).sort((a, b) => b.value - a.value);
  }, [monthTxs, catMap]);

  const last6 = useMemo(() => {
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const inMonth = txs.filter((t) => monthKey(t.date) === key);
      arr.push({
        label: jalaliStr(d.toISOString(), { short: true }).split(" ")[1] || "",
        income: inMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: inMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }
    return arr;
  }, [txs]);

  const topExpenses = [...monthTxs.filter((t) => t.type === "expense")].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const topCategory = pieData[0];
  const daysElapsed = now.getDate();
  const avgDaily = monthExpense / daysElapsed;
  const avgMonthlyIncome = last6.reduce((s, m) => s + m.income, 0) / last6.filter((m) => m.income > 0).length || 0;
  const savings = monthIncome - monthExpense;
  const lastMonth = last6[last6.length - 2];
  const thisMonthNet = monthIncome - monthExpense;
  const lastMonthNet = lastMonth ? lastMonth.income - lastMonth.expense : 0;
  const trendUp = thisMonthNet >= lastMonthNet;

  const insights = [
    topCategory && { icon: Flame, color: C.expense, text: `پرهزینه‌ترین دسته این ماه: «${topCategory.name}» با ${toToman(topCategory.value)} تومان` },
    topExpenses[0] && { icon: TrendingDown, color: C.expense, text: `بزرگ‌ترین هزینه: ${toToman(topExpenses[0].amount)} تومان (${catMap[topExpenses[0].categoryId]?.name})` },
    { icon: CircleDollarSign, color: C.income, text: `میانگین هزینه روزانه: ${toToman(Math.round(avgDaily))} تومان` },
    avgMonthlyIncome > 0 && { icon: TrendingUp, color: C.income, text: `میانگین درآمد ماهانه (۶ ماه اخیر): ${toToman(Math.round(avgMonthlyIncome))} تومان` },
    { icon: PiggyBank, color: savings >= 0 ? C.income : C.expense, text: `پس‌انداز این ماه: ${savings >= 0 ? "+" : ""}${toToman(savings)} تومان` },
    { icon: trendUp ? TrendingUp : TrendingDown, color: trendUp ? C.income : C.expense, text: `روند مالی نسبت به ماه قبل: ${trendUp ? "صعودی 📈" : "نزولی 📉"}` },
  ].filter(Boolean);

  return (
    <div>
      <PageHeader title="گزارش‌ها" sub="تحلیل عملکرد مالی" />
      <div style={{ padding: "0 20px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        <ChartCard title="درآمد و هزینه (۶ ماه اخیر)" icon={BarChart3}><IncomeExpenseBarChart data={last6} /></ChartCard>
        <ChartCard title="تفکیک هزینه‌های این ماه" icon={Layers}><CategoryPieChart data={pieData} />
          {pieData.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6, paddingBottom: 10 }}>
              {pieData.slice(0, 6).map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textMuted }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} /> {d.name}
                </div>
              ))}
            </div>
          )}
        </ChartCard>
        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={15} color={C.gold} />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>بینش‌های هوشمند</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: `${ins.color}1e`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ins.icon size={14} color={ins.color} />
                </div>
                <span style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, fontFamily: FONT_NUM }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        {topExpenses.length > 0 && (
          <GlassCard style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 10 }}>بزرگ‌ترین هزینه‌های این ماه</div>
            {topExpenses.map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_NUM, width: 16 }}>{i + 1}</span>
                <IconTile icon={catMap[t.categoryId]?.icon} color={catMap[t.categoryId]?.color} size={30} />
                <span style={{ flex: 1, fontSize: 12.5, color: C.textMuted }}>{t.description || catMap[t.categoryId]?.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: FONT_NUM, color: C.expense }}>{toToman(t.amount)}</span>
              </div>
            ))}
          </GlassCard>
        )}
      </div>
      <div style={{ height: 90 }} />
    </div>
  );
}

/* ============================================================
   CATEGORIES PAGE
   ============================================================ */
function CategoriesPage({ categories, onOpen, onAdd }) {
  return (
    <div>
      <PageHeader title="دسته‌بندی‌ها" sub={`${categories.length} دسته‌بندی`} right={
        <button onClick={onAdd} className="wos-press" style={{ background: C.primary, border: "none", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Plus size={19} color="#0A0E1A" /></button>
      } />
      <div style={{ padding: "0 20px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {categories.map((c) => (
          <GlassCard key={c.id} onClick={() => onOpen(c)} className="wos-press" style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <IconTile icon={c.icon} color={c.color} size={38} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.name}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS PAGE
   ============================================================ */
function SettingsPage({ onBackup, onRestore, onReset, tagCount, categoryCount, txCount }) {
  const fileRef = useRef(null);
  const Row = ({ icon: Icon, label, sub, onClick, danger }) => (
    <button onClick={onClick} className="wos-press" style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "15px 14px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", textAlign: "right" }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: danger ? C.expenseDim : "rgba(111,161,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={17} color={danger ? C.expense : C.primaryLight} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: danger ? C.expense : C.text }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 1 }}>{sub}</div>}
      </div>
      <ChevronLeft size={16} color={C.textFaint} />
    </button>
  );
  return (
    <div>
      <PageHeader title="تنظیمات" />
      <div style={{ padding: "0 20px 6px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textFaint, marginBottom: 8, paddingRight: 4 }}>داده‌ها</div>
        <GlassCard style={{ overflow: "hidden", marginBottom: 18 }}>
          <Row icon={Download} label="پشتیبان‌گیری (Backup)" sub="خروجی JSON از تمام اطلاعات" onClick={onBackup} />
          <Row icon={Upload} label="بازیابی (Restore)" sub="بازگردانی از فایل پشتیبان" onClick={() => fileRef.current?.click()} />
          <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { if (e.target.files[0]) onRestore(e.target.files[0]); e.target.value = ""; }} />
        </GlassCard>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textFaint, marginBottom: 8, paddingRight: 4 }}>آمار</div>
        <GlassCard style={{ padding: 16, marginBottom: 18, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <div><div style={{ fontFamily: FONT_NUM, fontWeight: 800, fontSize: 18, color: C.text }}>{txCount}</div><div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>تراکنش</div></div>
          <div><div style={{ fontFamily: FONT_NUM, fontWeight: 800, fontSize: 18, color: C.text }}>{categoryCount}</div><div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>دسته‌بندی</div></div>
          <div><div style={{ fontFamily: FONT_NUM, fontWeight: 800, fontSize: 18, color: C.text }}>{tagCount}</div><div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>برچسب</div></div>
        </GlassCard>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textFaint, marginBottom: 8, paddingRight: 4 }}>خطرناک</div>
        <GlassCard style={{ overflow: "hidden", marginBottom: 18, borderColor: `${C.expense}33` }}>
          <Row icon={RotateCcw} label="ریست کامل اطلاعات" sub="حذف همه‌چیز و شروع دوباره" onClick={onReset} danger />
        </GlassCard>
        <div style={{ textAlign: "center", color: C.textFaint, fontSize: 11.5, marginBottom: 100 }}>
          WalletOS · تمام داده‌ها فقط روی همین دستگاه ذخیره می‌شود
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONFIRM DIALOG
   ============================================================ */
function ConfirmDialog({ open, title, sub, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div className="wos-anim-fade" style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: "rgba(4,6,12,0.78)" }} />
      <div className="wos-anim-pop" style={{ position: "relative", width: "100%", maxWidth: 320, background: C.surfaceSolid, border: `1px solid ${C.borderStrong}`, borderRadius: 20, padding: 22 }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text, marginBottom: 6 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 18, lineHeight: 1.7 }}>{sub}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} className="wos-press" style={{ flex: 1, padding: "11px 0", borderRadius: 13, border: `1px solid ${C.border}`, background: "none", color: C.textMuted, fontWeight: 700, cursor: "pointer" }}>انصراف</button>
          <button onClick={onConfirm} className="wos-press" style={{ flex: 1, padding: "11px 0", borderRadius: 13, border: "none", background: danger ? C.expense : C.primary, color: "#0A0E1A", fontWeight: 800, cursor: "pointer" }}>تایید</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const dbRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState(null); // {cash, bank}
  const [txs, setTxs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [tab, setTab] = useState("dashboard");
  const [moreOpen, setMoreOpen] = useState(false);
  const [txSheet, setTxSheet] = useState(null); // {mode:'add'|'edit', type, tx}
  const [budgetSheet, setBudgetSheet] = useState(null);
  const [goalSheet, setGoalSheet] = useState(null);
  const [contribSheet, setContribSheet] = useState(null);
  const [categorySheet, setCategorySheet] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  useEffect(() => {
    (async () => {
      const db = await openDB();
      dbRef.current = db;
      const [meta, t, c, g, b, gl] = await Promise.all(
        ["meta", "transactions", "categories", "tags", "budgets", "goals"].map((s) => idbGetAll(db, s))
      );
      const balMeta = meta.find((m) => m.id === "balances");
      if (balMeta) setBalances({ cash: balMeta.cash, bank: balMeta.bank });
      setTxs(t.sort((a, b2) => new Date(b2.date) - new Date(a.date) || b2.createdAt - a.createdAt));
      setCategories(c.length ? c : DEFAULT_CATEGORIES);
      setTags(g.length ? g : DEFAULT_TAGS);
      setBudgets(b);
      setGoals(gl);
      if (!c.length) await Promise.all(DEFAULT_CATEGORIES.map((cat) => idbPut(db, "categories", cat)));
      if (!g.length) await Promise.all(DEFAULT_TAGS.map((tg) => idbPut(db, "tags", tg)));
      setLoading(false);
    })();
  }, []);

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  /* ---------- FIRST RUN ---------- */
  const handleFirstRun = async (cash, bank) => {
    const db = dbRef.current;
    const value = { id: "balances", cash, bank };
    await idbPut(db, "meta", value);
    setBalances({ cash, bank });
  };

  /* ---------- TRANSACTIONS ---------- */
  const applyBalanceDelta = (wallet, delta) => {
    setBalances((prev) => {
      const next = { ...prev, [wallet]: prev[wallet] + delta };
      idbPut(dbRef.current, "meta", { id: "balances", ...next });
      return next;
    });
  };

  const saveTransaction = async (tx) => {
    const db = dbRef.current;
    const existing = txs.find((t) => t.id === tx.id);
    if (existing) {
      const oldDelta = existing.type === "income" ? -existing.amount : existing.amount;
      applyBalanceDelta(existing.wallet, oldDelta); // revert old
      const newDelta = tx.type === "income" ? tx.amount : -tx.amount;
      applyBalanceDelta(tx.wallet, newDelta); // apply new
      setTxs((prev) => prev.map((t) => (t.id === tx.id ? tx : t)).sort((a, b) => new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt));
    } else {
      const delta = tx.type === "income" ? tx.amount : -tx.amount;
      applyBalanceDelta(tx.wallet, delta);
      setTxs((prev) => [tx, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt));
    }
    await idbPut(db, "transactions", tx);
    setTxSheet(null);
    showToast(existing ? "تراکنش ویرایش شد" : "تراکنش ثبت شد ✅");
  };

  const deleteTransaction = async (id) => {
    const tx = txs.find((t) => t.id === id);
    if (!tx) return;
    const delta = tx.type === "income" ? -tx.amount : tx.amount;
    applyBalanceDelta(tx.wallet, delta);
    setTxs((prev) => prev.filter((t) => t.id !== id));
    await idbDelete(dbRef.current, "transactions", id);
    setTxSheet(null);
    showToast("تراکنش حذف شد");
  };

  const addTag = (name) => {
    const t = { id: uid(), name };
    setTags((prev) => [...prev, t]);
    idbPut(dbRef.current, "tags", t);
    return t;
  };

  /* ---------- BUDGETS ---------- */
  const saveBudget = async (b) => {
    setBudgets((prev) => (prev.find((x) => x.id === b.id) ? prev.map((x) => (x.id === b.id ? b : x)) : [...prev, b]));
    await idbPut(dbRef.current, "budgets", b);
    setBudgetSheet(null);
    showToast("بودجه ذخیره شد ✅");
  };
  const deleteBudget = async (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    await idbDelete(dbRef.current, "budgets", id);
    setBudgetSheet(null);
    showToast("بودجه حذف شد");
  };

  /* ---------- GOALS ---------- */
  const saveGoal = async (g) => {
    setGoals((prev) => (prev.find((x) => x.id === g.id) ? prev.map((x) => (x.id === g.id ? g : x)) : [...prev, g]));
    await idbPut(dbRef.current, "goals", g);
    setGoalSheet(null);
    showToast("هدف ذخیره شد ✅");
  };
  const deleteGoal = async (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await idbDelete(dbRef.current, "goals", id);
    setGoalSheet(null);
    showToast("هدف حذف شد");
  };
  const contributeGoal = async (goal, amount) => {
    const updated = { ...goal, contributions: [...goal.contributions, { id: uid(), amount, date: new Date().toISOString() }] };
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
    await idbPut(dbRef.current, "goals", updated);
    setContribSheet(null);
    showToast("به هدفت واریز شد 🎯");
  };

  /* ---------- CATEGORIES ---------- */
  const saveCategory = async (c) => {
    setCategories((prev) => (prev.find((x) => x.id === c.id) ? prev.map((x) => (x.id === c.id ? c : x)) : [...prev, c]));
    await idbPut(dbRef.current, "categories", c);
    setCategorySheet(null);
    showToast("دسته‌بندی ذخیره شد ✅");
  };
  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await idbDelete(dbRef.current, "categories", id);
    setCategorySheet(null);
    showToast("دسته‌بندی حذف شد");
  };

  /* ---------- BACKUP / RESTORE / RESET ---------- */
  const backup = () => {
    const data = { balances, transactions: txs, categories, tags, budgets, goals, exportedAt: new Date().toISOString(), app: "WalletOS", version: 1 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `walletos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("فایل پشتیبان دانلود شد");
  };

  const restore = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.transactions || !data.balances) throw new Error("invalid");
        const db = dbRef.current;
        await idbClearAll(db);
        await idbPut(db, "meta", { id: "balances", ...data.balances });
        await Promise.all((data.transactions || []).map((t) => idbPut(db, "transactions", t)));
        await Promise.all((data.categories?.length ? data.categories : DEFAULT_CATEGORIES).map((c) => idbPut(db, "categories", c)));
        await Promise.all((data.tags?.length ? data.tags : DEFAULT_TAGS).map((t) => idbPut(db, "tags", t)));
        await Promise.all((data.budgets || []).map((b) => idbPut(db, "budgets", b)));
        await Promise.all((data.goals || []).map((g) => idbPut(db, "goals", g)));
        setBalances(data.balances);
        setTxs(data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt));
        setCategories(data.categories?.length ? data.categories : DEFAULT_CATEGORIES);
        setTags(data.tags?.length ? data.tags : DEFAULT_TAGS);
        setBudgets(data.budgets || []);
        setGoals(data.goals || []);
        showToast("بازیابی با موفقیت انجام شد ✅");
      } catch (err) {
        showToast("فایل پشتیبان معتبر نیست ❌");
      }
    };
    reader.readAsText(file);
  };

  const resetAll = () => {
    setConfirm({
      title: "ریست کامل اطلاعات",
      sub: "همه‌ی تراکنش‌ها، بودجه‌ها، اهداف و موجودی حذف می‌شود. این کار قابل بازگشت نیست.",
      danger: true,
      onConfirm: async () => {
        await idbClearAll(dbRef.current);
        setBalances(null);
        setTxs([]);
        setCategories(DEFAULT_CATEGORIES);
        setTags(DEFAULT_TAGS);
        setBudgets([]);
        setGoals([]);
        await Promise.all(DEFAULT_CATEGORIES.map((cat) => idbPut(dbRef.current, "categories", cat)));
        await Promise.all(DEFAULT_TAGS.map((tg) => idbPut(dbRef.current, "tags", tg)));
        setConfirm(null);
        setTab("dashboard");
      },
    });
  };

  /* ---------- DERIVED ---------- */
  const monthIncome = useMemo(() => txs.filter((t) => t.type === "income" && isThisMonth(t.date)).reduce((s, t) => s + t.amount, 0), [txs]);
  const monthExpense = useMemo(() => txs.filter((t) => t.type === "expense" && isThisMonth(t.date)).reduce((s, t) => s + t.amount, 0), [txs]);

  const txsWithBalance = useMemo(() => {
    if (!balances) return [];
    const currentTotal = balances.cash + balances.bank;
    const signedSum = txs.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);
    const initialTotal = currentTotal - signedSum;
    const asc = [...txs].sort((a, b) => new Date(a.date) - new Date(b.date) || a.createdAt - b.createdAt);
    let running = initialTotal;
    const withBal = {};
    asc.forEach((t) => {
      running += t.type === "income" ? t.amount : -t.amount;
      withBal[t.id] = running;
    });
    return txs.map((t) => ({ ...t, runningBalance: withBal[t.id] }));
  }, [txs, balances]);

  const trendData = useMemo(() => {
    if (!balances) return [];
    const currentTotal = balances.cash + balances.bank;
    const signedSum = txs.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);
    const initialTotal = currentTotal - signedSum;
    const asc = [...txs].sort((a, b) => new Date(a.date) - new Date(b.date));
    const now = new Date();
    const points = [];
    let running = initialTotal;
    let idx = 0;
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(23, 59, 59, 999);
      while (idx < asc.length && new Date(asc[idx].date) <= d) {
        running += asc[idx].type === "income" ? asc[idx].amount : -asc[idx].amount;
        idx++;
      }
      points.push({ label: jalaliStr(d.toISOString(), { short: true }), balance: running });
    }
    return points;
  }, [txs, balances]);

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyle />
        <div style={{ animation: "wosPulse 1.4s ease-in-out infinite" }}>
          <Wallet size={40} color={C.primary} />
        </div>
      </div>
    );
  }

  if (!balances) {
    return (
      <>
        <GlobalStyle />
        <FirstRunScreen onDone={handleFirstRun} />
      </>
    );
  }

  const openAddTx = (type) => setTxSheet({ mode: "add", type: type || "expense" });
  const openEditTx = (tx) => setTxSheet({ mode: "edit", tx });

  return (
    <div dir="rtl" lang="fa" style={{ minHeight: "100vh", background: C.bgGrad, fontFamily: FONT_HEAD, color: C.text }}>
      <GlobalStyle />
      <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", minHeight: "100vh" }}>
        {tab === "dashboard" && (
          <DashboardPage balances={balances} txs={txsWithBalance} categories={categories} catMap={catMap} monthIncome={monthIncome} monthExpense={monthExpense} budgets={budgets} goals={goals} trendData={trendData} onOpenTx={openEditTx} onQuickAdd={openAddTx} />
        )}
        {tab === "transactions" && (
          <TransactionsPage allTxsWithBalance={txsWithBalance} categories={categories} catMap={catMap} onOpenTx={openEditTx} />
        )}
        {tab === "budgets" && (
          <BudgetsPage budgets={budgets} txs={txs} catMap={catMap} onOpen={(b) => setBudgetSheet({ mode: "edit", budget: b })} onAdd={() => setBudgetSheet({ mode: "add" })} />
        )}
        {tab === "goals" && (
          <GoalsPage goals={goals} onOpen={(g) => setGoalSheet({ mode: "edit", goal: g })} onAdd={() => setGoalSheet({ mode: "add" })} onContribute={(g) => setContribSheet(g)} />
        )}
        {tab === "reports" && <ReportsPage txs={txs} categories={categories} catMap={catMap} />}
        {tab === "categories" && (
          <CategoriesPage categories={categories} onOpen={(c) => setCategorySheet({ mode: "edit", category: c })} onAdd={() => setCategorySheet({ mode: "add" })} />
        )}
        {tab === "settings" && (
          <SettingsPage onBackup={backup} onRestore={restore} onReset={resetAll} tagCount={tags.length} categoryCount={categories.length} txCount={txs.length} />
        )}

        <BottomNav tab={tab} setTab={setTab} onFab={() => openAddTx("expense")} moreOpen={moreOpen} setMoreOpen={setMoreOpen} />
        <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} setTab={setTab} setMoreOpen={setMoreOpen} />

        <Sheet open={!!txSheet} onClose={() => setTxSheet(null)} title={txSheet?.mode === "edit" ? "ویرایش تراکنش" : "تراکنش جدید"}>
          {txSheet && (
            <TransactionForm
              initial={txSheet.mode === "edit" ? txSheet.tx : { type: txSheet.type }}
              categories={categories}
              tags={tags}
              onAddTag={addTag}
              onSubmit={saveTransaction}
              onDelete={(id) => setConfirm({ title: "حذف تراکنش؟", sub: "موجودی مربوطه به‌روزرسانی می‌شود.", danger: true, onConfirm: () => { deleteTransaction(id); setConfirm(null); } })}
            />
          )}
        </Sheet>

        <Sheet open={!!budgetSheet} onClose={() => setBudgetSheet(null)} title={budgetSheet?.mode === "edit" ? "ویرایش بودجه" : "بودجه جدید"}>
          {budgetSheet && (
            <BudgetForm
              initial={budgetSheet.mode === "edit" ? budgetSheet.budget : null}
              categories={categories}
              budgets={budgets}
              onSubmit={saveBudget}
              onDelete={(id) => setConfirm({ title: "حذف بودجه؟", danger: true, onConfirm: () => { deleteBudget(id); setConfirm(null); } })}
            />
          )}
        </Sheet>

        <Sheet open={!!goalSheet} onClose={() => setGoalSheet(null)} title={goalSheet?.mode === "edit" ? "ویرایش هدف" : "هدف جدید"}>
          {goalSheet && (
            <GoalForm
              initial={goalSheet.mode === "edit" ? goalSheet.goal : null}
              onSubmit={saveGoal}
              onDelete={(id) => setConfirm({ title: "حذف هدف؟", danger: true, onConfirm: () => { deleteGoal(id); setConfirm(null); } })}
            />
          )}
        </Sheet>

        <Sheet open={!!contribSheet} onClose={() => setContribSheet(null)} title="واریز به هدف">
          {contribSheet && <ContributionForm goal={contribSheet} onSubmit={(amount) => contributeGoal(contribSheet, amount)} />}
        </Sheet>

        <Sheet open={!!categorySheet} onClose={() => setCategorySheet(null)} title={categorySheet?.mode === "edit" ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}>
          {categorySheet && (
            <CategoryForm
              initial={categorySheet.mode === "edit" ? categorySheet.category : null}
              onSubmit={saveCategory}
              onDelete={(id) => setConfirm({ title: "حذف دسته‌بندی؟", sub: "تراکنش‌های مرتبط حذف نمی‌شوند اما بدون دسته می‌مانند.", danger: true, onConfirm: () => { deleteCategory(id); setConfirm(null); } })}
            />
          )}
        </Sheet>

        <ConfirmDialog open={!!confirm} title={confirm?.title} sub={confirm?.sub} danger={confirm?.danger} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} />
        <Toast toast={toast} />
      </div>
    </div>
  );
}
