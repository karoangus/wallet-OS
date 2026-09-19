/* WalletOS v3 — application source (concatenated after React+icons bundle)
 * Globals from bundle: _, Sy, S, j, and lucide icon vars (Xi, jf, Xf, …)
 */
(function () {
  'use strict';

  var React = _;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useCallback = React.useCallback;
  var memo = React.memo;
  var createElement = React.default ? React.default.createElement : React.createElement;

  var jsx = S.jsx;
  var jsxs = S.jsxs;
  // jsx-runtime build doesn't re-export Fragment; use React's or a passthrough.
  var Fragment = (React && React.Fragment)
    || (React && React.default && React.default.Fragment)
    || function Frag(props) { return props.children; };

  /* ─── Icon aliases (stable names over minified vars) ─── */
  var Icon = {
    Wallet: Xi,
    ArrowDownLeft: jf,
    ArrowUpRight: Xf,
    Search: Qf,
    Sliders: Lf,
    X: F0,
    Check: W0,
    Trash: lu,
    Home: $0,
    Receipt: Qi,
    PiggyBank: eu,
    Target: Li,
    BarChart: wf,
    Settings: I0,
    ChevronLeft: P0,
    Download: ty,
    Upload: ly,
    AlertTriangle: ey,
    Tag: ay,
    TrendingUp: La,
    TrendingDown: wi,
    Sparkles: Zf,
    Utensils: ny,
    ShoppingBag: uy,
    Car: iy,
    Gamepad: cy,
    GraduationCap: oy,
    Wifi: fy,
    HeartPulse: sy,
    Video: dy,
    MoreHorizontal: au,
    Landmark: Zi,
    Banknote: Vi,
    Plus: wa,
    Chevron: ry,
    Flame: Ki,
    Dollar: Vf,
    Layers: nu,
    Trophy: yy
  };

  var CAT_ICONS = {
    UtensilsCrossed: Icon.Utensils,
    ShoppingBag: Icon.ShoppingBag,
    Car: Icon.Car,
    Gamepad2: Icon.Gamepad,
    GraduationCap: Icon.GraduationCap,
    Receipt: Icon.Receipt,
    Wifi: Icon.Wifi,
    HeartPulse: Icon.HeartPulse,
    Video: Icon.Video,
    Wallet: Icon.Wallet,
    MoreHorizontal: Icon.MoreHorizontal,
    PiggyBank: Icon.PiggyBank,
    Target: Icon.Target,
    TrendingUp: Icon.TrendingUp,
    Landmark: Icon.Landmark,
    Banknote: Icon.Banknote,
    Sparkles: Icon.Sparkles,
    Flame: Icon.Flame,
    Trophy: Icon.Trophy,
    CircleDollarSign: Icon.Dollar,
    Layers: Icon.Layers,
    TagIcon: Icon.Tag
  };
  var CAT_ICON_KEYS = Object.keys(CAT_ICONS);

  /* ─── Theme ─── */
  var T = {
    bg: '#080B14',
    bgGrad: 'radial-gradient(1200px 600px at 50% -10%, #14203F 0%, #080B14 55%, #060810 100%)',
    surface: 'rgba(16,21,39,0.72)',
    surfaceSolid: '#111629',
    surfaceRaised: '#161C34',
    border: 'rgba(148,163,207,0.12)',
    borderStrong: 'rgba(148,163,207,0.22)',
    primary: '#3E7BFA',
    primaryLight: '#6FA1FF',
    primaryGlow: 'rgba(62,123,250,0.5)',
    income: '#33D6A6',
    incomeDim: 'rgba(51,214,166,0.14)',
    expense: '#FB7185',
    expenseDim: 'rgba(251,113,133,0.14)',
    gold: '#F5B947',
    text: '#EDF1FB',
    textMuted: '#8D96B8',
    textFaint: '#5B6488',
    cash: '#F5B947',
    bank: '#6FA1FF'
  };
  var FONT = "'Vazirmatn', system-ui, sans-serif";
  var FONT_NUM = "'Vazirmatn', 'JetBrains Mono', monospace";

  var INPUT_STYLE = {
    width: '100%',
    background: T.surfaceRaised,
    border: '1px solid ' + T.border,
    borderRadius: 14,
    padding: '13px 14px',
    color: T.text,
    fontSize: 15,
    fontFamily: FONT,
    outline: 'none'
  };

  /* ─── Defaults ─── */
  var DEFAULT_CATEGORIES = [
    { id: 'food', name: 'خوراک', icon: 'UtensilsCrossed', color: '#FB923C' },
    { id: 'shopping', name: 'خرید', icon: 'ShoppingBag', color: '#F472B6' },
    { id: 'transport', name: 'رفت‌وآمد', icon: 'Car', color: '#60A5FA' },
    { id: 'gaming', name: 'گیم', icon: 'Gamepad2', color: '#A78BFA' },
    { id: 'education', name: 'آموزش', icon: 'GraduationCap', color: '#34D399' },
    { id: 'bills', name: 'قبض‌ها', icon: 'Receipt', color: '#FBBF24' },
    { id: 'internet', name: 'اینترنت', icon: 'Wifi', color: '#22D3EE' },
    { id: 'health', name: 'سلامت', icon: 'HeartPulse', color: '#F87171' },
    { id: 'content', name: 'تولید محتوا', icon: 'Video', color: '#818CF8' },
    { id: 'salary', name: 'درآمد', icon: 'Wallet', color: '#33D6A6' },
    { id: 'other', name: 'سایر', icon: 'MoreHorizontal', color: '#94A3B8' }
  ];
  var DEFAULT_TAG_NAMES = ['خانواده', 'کار', 'دوستان', 'شخصی'];
  var CAT_COLORS = ['#FB923C', '#F472B6', '#60A5FA', '#A78BFA', '#34D399', '#FBBF24', '#22D3EE', '#F87171', '#818CF8', '#94A3B8', '#33D6A6', '#F5B947'];
  var GOAL_ICONS = ['Target', 'Trophy', 'Gamepad2', 'Car', 'GraduationCap', 'Sparkles', 'Flame', 'PiggyBank'];

  var TABS = [
    { k: 'dashboard', label: 'خانه', Icon: Icon.Home },
    { k: 'transactions', label: 'تراکنش‌ها', Icon: Icon.Receipt },
    { k: 'fab', label: '', Icon: null },
    { k: 'budgets', label: 'بودجه', Icon: Icon.PiggyBank },
    { k: 'more', label: 'بیشتر', Icon: Icon.Sliders }
  ];

  /* ─── Utils ─── */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }
  function toFa(n) {
    return Math.round(Number(n) || 0).toLocaleString('fa-IR');
  }
  function toEn(n) {
    var v = Math.round(Number(n) || 0);
    return isFinite(v) ? v.toLocaleString('en-US') : '';
  }
  function parseAmount(raw) {
    var digits = String(raw == null ? '' : raw).replace(/[^\d]/g, '');
    if (!digits) return 0;
    var n = parseInt(digits, 10);
    return isFinite(n) ? n : 0;
  }
  function safeNum(n) {
    var v = Number(n);
    return isFinite(v) ? v : 0;
  }
  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  /* Gregorian → Jalali */
  var J_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  function toJalali(gy, gm, gd) {
    var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    var gy2 = gm > 2 ? gy + 1 : gy;
    var days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    var jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    var jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return [jy, jm, jd];
  }
  function formatJalali(iso, opts) {
    opts = opts || {};
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    var j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    var mon = J_MONTHS[j[1] - 1] || '';
    if (opts.short) return j[2] + ' ' + mon.slice(0, 3);
    if (opts.monthYear) return mon + ' ' + j[0];
    if (opts.dayMonth) return j[2] + ' ' + mon;
    return j[2] + ' ' + mon + ' ' + j[0];
  }
  function ymKey(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function isToday(iso) {
    var d = new Date(iso), n = new Date();
    return d.toDateString() === n.toDateString();
  }
  function isThisWeek(iso) {
    var d = new Date(iso), n = new Date();
    var start = new Date(n);
    // Saturday-start week for Iran
    var day = (n.getDay() + 1) % 7; // Sat=0
    start.setDate(n.getDate() - day);
    start.setHours(0, 0, 0, 0);
    var end = new Date(start);
    end.setDate(start.getDate() + 7);
    return d >= start && d < end;
  }
  function isThisMonth(iso) {
    var d = new Date(iso), n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
  }
  function isThisYear(iso) {
    var d = new Date(iso), n = new Date();
    return d.getFullYear() === n.getFullYear();
  }
  function dateInputValue(iso) {
    if (!iso) return new Date().toISOString().slice(0, 10);
    var d = new Date(iso);
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    // Local date, not UTC — avoids off-by-one in RTL/Iran TZ
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function fromDateInput(val) {
    if (!val) return new Date().toISOString();
    var parts = String(val).split('-');
    if (parts.length !== 3) return new Date().toISOString();
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
    return d.toISOString();
  }

  /* ─── IndexedDB ─── */
  var DB_NAME = 'walletos-db';
  var DB_VERSION = 1;
  var STORES = ['meta', 'transactions', 'categories', 'tags', 'budgets', 'goals'];

  function openDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        STORES.forEach(function (s) {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
        });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('IDB open failed')); };
    });
  }
  function idbGetAll(db, store) {
    return new Promise(function (resolve, reject) {
      try {
        var tx = db.transaction(store, 'readonly');
        var req = tx.objectStore(store).getAll();
        req.onsuccess = function () { resolve(req.result || []); };
        req.onerror = function () { reject(req.error); };
      } catch (err) { reject(err); }
    });
  }
  function idbPut(db, store, value) {
    return new Promise(function (resolve, reject) {
      try {
        var tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).put(value);
        tx.oncomplete = function () { resolve(value); };
        tx.onerror = function () { reject(tx.error); };
      } catch (err) { reject(err); }
    });
  }
  function idbDelete(db, store, id) {
    return new Promise(function (resolve, reject) {
      try {
        var tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).delete(id);
        tx.oncomplete = function () { resolve(id); };
        tx.onerror = function () { reject(tx.error); };
      } catch (err) { reject(err); }
    });
  }
  function idbClearAll(db) {
    return Promise.all(STORES.map(function (s) {
      return new Promise(function (resolve, reject) {
        try {
          var tx = db.transaction(s, 'readwrite');
          tx.objectStore(s).clear();
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { reject(tx.error); };
        } catch (err) { reject(err); }
      });
    }));
  }
  function idbPutMany(db, store, items) {
    if (!items || !items.length) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      try {
        var tx = db.transaction(store, 'readwrite');
        var os = tx.objectStore(store);
        items.forEach(function (it) { os.put(it); });
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      } catch (err) { reject(err); }
    });
  }

  /* ─── Global CSS (once) ─── */
  function GlobalStyles() {
    return jsx('style', {
      children:
        '*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}' +
        'body{margin:0;overscroll-behavior-y:contain}' +
        'button,input{font-family:inherit}' +
        '.wos-scroll{-webkit-overflow-scrolling:touch;scrollbar-width:thin}' +
        '.wos-scroll::-webkit-scrollbar{width:4px;height:4px}' +
        '.wos-scroll::-webkit-scrollbar-thumb{background:rgba(148,163,207,.25);border-radius:4px}' +
        '@keyframes wosPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}' +
        '@keyframes wosSlideUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}' +
        '@keyframes wosSheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
        '@keyframes wosFadeIn{from{opacity:0}to{opacity:1}}' +
        '@keyframes wosPop{0%{transform:scale(.94);opacity:0}100%{transform:scale(1);opacity:1}}' +
        '@keyframes wosShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}' +
        '.wos-anim-up{animation:wosSlideUp .28s cubic-bezier(.2,.8,.2,1) both}' +
        '.wos-anim-pop{animation:wosPop .22s cubic-bezier(.2,.8,.2,1) both}' +
        '.wos-anim-fade{animation:wosFadeIn .2s ease both}' +
        '.wos-press{transition:transform .1s ease,filter .1s ease;will-change:transform}' +
        '.wos-press:active{transform:scale(.97);filter:brightness(.93)}' +
        'input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.6}' +
        '@media (prefers-reduced-motion:reduce){' +
        '.wos-anim-up,.wos-anim-pop,.wos-anim-fade{animation:none!important}' +
        '.wos-press{transition:none}' +
        '}'
    });
  }

  /* ─── Primitives ─── */
  function Card(props) {
    return jsx('div', {
      onClick: props.onClick,
      className: 'wos-anim-up ' + (props.className || ''),
      style: Object.assign({
        background: T.surface,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid ' + T.border,
        borderRadius: 22
      }, props.style || {}),
      children: props.children
    });
  }

  function CatIcon(props) {
    var Comp = CAT_ICONS[props.icon] || Icon.MoreHorizontal;
    var size = props.size || 40;
    var color = props.color || T.textFaint;
    return jsx('div', {
      style: {
        width: size, height: size, borderRadius: size * 0.34,
        background: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      },
      children: jsx(Comp, { size: size * 0.5, color: color, strokeWidth: 2.2 })
    });
  }

  function ProgressBar(props) {
    var pct = clamp(safeNum(props.pct), 0, 100);
    return jsx('div', {
      style: {
        width: '100%', height: props.height || 8, borderRadius: 99,
        background: props.bg || 'rgba(148,163,207,0.14)', overflow: 'hidden'
      },
      children: jsx('div', {
        style: {
          width: pct + '%', height: '100%', borderRadius: 99,
          background: props.color || T.primary,
          transition: 'width .45s cubic-bezier(.2,.8,.2,1)',
          boxShadow: '0 0 10px ' + (props.color || T.primary) + '88'
        }
      })
    });
  }

  function Chip(props) {
    var active = props.active;
    var color = props.color || T.primary;
    return jsx('button', {
      type: 'button',
      onClick: props.onClick,
      className: 'wos-press',
      style: {
        padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
        border: '1px solid ' + (active ? color : T.border),
        background: active ? color + '22' : 'transparent',
        color: active ? (props.color ? color : T.primaryLight) : T.textMuted,
        whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer'
      },
      children: props.children
    });
  }

  function Field(props) {
    return jsxs('div', {
      style: { marginBottom: 16 },
      children: [
        jsx('div', { style: { fontSize: 13, fontWeight: 600, color: T.textMuted, marginBottom: 8 }, children: props.label }),
        props.children
      ]
    });
  }

  function Btn(props) {
    var solid = (props.variant || 'solid') === 'solid';
    var color = props.color || T.primary;
    var disabled = !!props.disabled;
    return jsx('button', {
      type: 'button',
      onClick: disabled ? undefined : props.onClick,
      disabled: disabled,
      className: 'wos-press',
      style: {
        width: '100%', padding: '15px', borderRadius: 16, fontSize: 15.5, fontWeight: 800,
        border: solid ? 'none' : '1.5px solid ' + color,
        background: solid ? (disabled ? '#2a3350' : color) : 'transparent',
        color: solid ? '#0A0E1A' : color,
        boxShadow: solid && !disabled ? '0 8px 24px -8px ' + color + '99' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT,
        opacity: disabled ? 0.7 : 1
      },
      children: props.children
    });
  }

  function AmountInput(props) {
    var value = safeNum(props.value);
    var st = useState(value ? toEn(value) : '');
    var local = st[0], setLocal = st[1];
    useEffect(function () {
      setLocal(value ? toEn(value) : '');
    }, [value]);
    return jsxs('div', {
      style: { position: 'relative' },
      children: [
        jsx('input', {
          autoFocus: props.autoFocus,
          inputMode: 'numeric',
          value: local,
          onChange: function (e) {
            var n = parseAmount(e.target.value);
            setLocal(n ? toEn(n) : '');
            props.onChange(n);
          },
          placeholder: props.placeholder || '۰',
          style: Object.assign({}, INPUT_STYLE, {
            fontFamily: FONT_NUM, fontSize: 22, fontWeight: 800,
            padding: '16px 62px 16px 14px', textAlign: 'right', letterSpacing: 0.5
          })
        }),
        jsx('span', {
          style: {
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: T.textFaint, fontSize: 13, fontWeight: 700
          },
          children: 'تومان'
        })
      ]
    });
  }

  function PageHeader(props) {
    return jsxs('div', {
      style: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '22px 20px 14px'
      },
      children: [
        jsxs('div', {
          children: [
            jsx('h2', { style: { margin: 0, fontSize: 21, fontWeight: 900, color: T.text }, children: props.title }),
            props.sub ? jsx('div', { style: { fontSize: 12.5, color: T.textFaint, marginTop: 3 }, children: props.sub }) : null
          ]
        }),
        props.right || null
      ]
    });
  }

  function EmptyState(props) {
    var Ico = props.icon || Icon.Search;
    return jsxs('div', {
      style: { textAlign: 'center', padding: '40px 20px', color: T.textFaint },
      children: [
        jsx(Ico, { size: 34, style: { opacity: 0.5, marginBottom: 10 } }),
        jsx('div', { style: { fontSize: 14.5, fontWeight: 700, color: T.textMuted }, children: props.text }),
        props.sub ? jsx('div', { style: { fontSize: 12.5, marginTop: 4 }, children: props.sub }) : null
      ]
    });
  }

  function Toast(props) {
    if (!props.toast) return null;
    return jsxs('div', {
      className: 'wos-anim-pop',
      role: 'status',
      style: {
        position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
        background: T.surfaceRaised, border: '1px solid ' + T.borderStrong,
        borderRadius: 14, padding: '11px 20px', color: T.text, fontSize: 13.5, fontWeight: 600,
        zIndex: 100, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', maxWidth: '90vw'
      },
      children: [jsx(Icon.Check, { size: 15, color: T.income }), ' ', props.toast]
    });
  }

  function Confirm(props) {
    if (!props.open) return null;
    return jsxs('div', {
      className: 'wos-anim-fade',
      style: {
        position: 'fixed', inset: 0, zIndex: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
      },
      children: [
        jsx('div', {
          onClick: props.onCancel,
          style: { position: 'absolute', inset: 0, background: 'rgba(4,6,12,0.78)' }
        }),
        jsxs('div', {
          className: 'wos-anim-pop',
          role: 'dialog',
          'aria-modal': 'true',
          style: {
            position: 'relative', width: '100%', maxWidth: 320,
            background: T.surfaceSolid, border: '1px solid ' + T.borderStrong,
            borderRadius: 20, padding: 22
          },
          children: [
            jsx('div', { style: { fontSize: 15.5, fontWeight: 800, color: T.text, marginBottom: 6 }, children: props.title }),
            props.sub ? jsx('div', { style: { fontSize: 12.5, color: T.textMuted, marginBottom: 18, lineHeight: 1.7 }, children: props.sub }) : null,
            jsxs('div', {
              style: { display: 'flex', gap: 10 },
              children: [
                jsx('button', {
                  type: 'button', onClick: props.onCancel, className: 'wos-press',
                  style: {
                    flex: 1, padding: '11px 0', borderRadius: 13,
                    border: '1px solid ' + T.border, background: 'none',
                    color: T.textMuted, fontWeight: 700, cursor: 'pointer'
                  },
                  children: 'انصراف'
                }),
                jsx('button', {
                  type: 'button', onClick: props.onConfirm, className: 'wos-press',
                  style: {
                    flex: 1, padding: '11px 0', borderRadius: 13, border: 'none',
                    background: props.danger ? T.expense : T.primary,
                    color: '#0A0E1A', fontWeight: 800, cursor: 'pointer'
                  },
                  children: 'تایید'
                })
              ]
            })
          ]
        })
      ]
    });
  }

  function Sheet(props) {
    // Body scroll lock while open
    useEffect(function () {
      if (!props.open) return;
      var prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return function () { document.body.style.overflow = prev; };
    }, [props.open]);

    if (!props.open) return null;
    return jsxs('div', {
      className: 'wos-anim-fade',
      style: {
        position: 'fixed', inset: 0, zIndex: 80,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
      },
      children: [
        jsx('div', {
          onClick: props.onClose,
          style: { position: 'absolute', inset: 0, background: 'rgba(4,6,12,0.72)' }
        }),
        jsxs('div', {
          className: 'wos-anim-pop',
          role: 'dialog',
          'aria-modal': 'true',
          style: {
            position: 'relative', width: '100%', maxWidth: 480,
            maxHeight: '88vh', display: 'flex', flexDirection: 'column',
            background: T.surfaceSolid, border: '1px solid ' + T.borderStrong,
            borderRadius: '24px 24px 0 0',
            paddingBottom: 'env(safe-area-inset-bottom)',
            animation: 'wosSheetUp .28s cubic-bezier(.2,.8,.2,1) both'
          },
          children: [
            jsx('div', {
              style: {
                width: 40, height: 4, borderRadius: 99, background: T.borderStrong,
                margin: '10px auto 0', flexShrink: 0
              }
            }),
            jsxs('div', {
              style: {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px 10px', flexShrink: 0
              },
              children: [
                jsx('div', { style: { fontSize: 16, fontWeight: 800, color: T.text }, children: props.title }),
                jsx('button', {
                  type: 'button', onClick: props.onClose, className: 'wos-press',
                  'aria-label': 'بستن',
                  style: {
                    width: 36, height: 36, borderRadius: 12, border: 'none',
                    background: T.surfaceRaised, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  },
                  children: jsx(Icon.X, { size: 17, color: T.textMuted })
                })
              ]
            }),
            jsx('div', {
              className: 'wos-scroll',
              style: { overflowY: 'auto', padding: '4px 20px 24px', WebkitOverflowScrolling: 'touch' },
              children: props.children
            })
          ]
        })
      ]
    });
  }

  /* ─── Lightweight charts (no Math.random ids — stable gradient ids) ─── */
  function useSize(ref) {
    var st = useState({ w: 300, h: 200 });
    var size = st[0], setSize = st[1];
    useEffect(function () {
      if (!ref.current) return;
      var el = ref.current;
      var ro = new ResizeObserver(function (entries) {
        var r = entries[0].contentRect;
        setSize(function (prev) {
          if (Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1) return prev;
          return { w: r.width, h: r.height };
        });
      });
      ro.observe(el);
      return function () { ro.disconnect(); };
    }, [ref]);
    return size;
  }

  function ChartTip(props) {
    var t = props.tip;
    if (!t) return null;
    return jsxs('div', {
      style: {
        position: 'fixed', left: t.x + 12, top: t.y - 10, zIndex: 999,
        background: '#161C34', border: '1px solid rgba(148,163,207,.22)',
        borderRadius: 10, padding: '7px 12px', fontSize: 12, color: '#EDF1FB',
        pointerEvents: 'none', fontFamily: FONT, boxShadow: '0 4px 16px rgba(0,0,0,.5)', minWidth: 80
      },
      children: [
        t.label ? jsx('div', { style: { color: '#8D96B8', marginBottom: 3 }, children: t.label }) : null,
        t.lines.map(function (l, i) {
          return jsxs('div', {
            style: { display: 'flex', alignItems: 'center', gap: 6 },
            children: [
              l.color ? jsx('span', { style: { width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block', flexShrink: 0 } }) : null,
              jsx('span', { style: { color: l.color || '#EDF1FB', fontWeight: 700 }, children: l.text })
            ]
          }, i);
        })
      ]
    });
  }

  function AreaChart(props) {
    var data = props.data;
    var dataKey = props.dataKey;
    var stroke = props.stroke;
    var xKey = props.xKey || 'label';
    var height = props.height || 170;
    var ref = useRef(null);
    var size = useSize(ref);
    var tipSt = useState(null);
    var tip = tipSt[0], setTip = tipSt[1];
    var gid = 'ag' + (props.gid || '1');

    if (!data || data.length < 2) {
      return jsx('div', { ref: ref, style: { height: height } });
    }

    var m = { t: 14, r: 8, b: 28, l: 8 };
    var w = size.w - m.l - m.r;
    var h = height - m.t - m.b;
    var vals = data.map(function (d) { return safeNum(d[dataKey]); });
    var minV = Math.min.apply(null, vals);
    var range = Math.max.apply(null, vals) - minV || 1;
    function xAt(i) { return m.l + i / (data.length - 1) * w; }
    function yAt(v) { return m.t + h - (v - minV) / range * h; }
    var pts = data.map(function (d, i) { return [xAt(i), yAt(safeNum(d[dataKey]))]; });
    var line = pts.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ',' + (m.t + h).toFixed(1) +
      ' L' + m.l.toFixed(1) + ',' + (m.t + h).toFixed(1) + ' Z';
    var step = Math.max(1, Math.floor(data.length / 6));
    var labels = data.filter(function (d, i) { return i % step === 0 || i === data.length - 1; });

    return jsxs('div', {
      ref: ref,
      style: { position: 'relative', height: height },
      children: [
        jsxs('svg', {
          width: '100%', height: height, style: { overflow: 'visible' },
          children: [
            jsx('defs', {
              children: jsxs('linearGradient', {
                id: gid, x1: '0', y1: '0', x2: '0', y2: '1',
                children: [
                  jsx('stop', { offset: '0%', stopColor: stroke, stopOpacity: 0.5 }),
                  jsx('stop', { offset: '100%', stopColor: stroke, stopOpacity: 0 })
                ]
              })
            }),
            [0, 0.5, 1].map(function (r, i) {
              return jsx('line', {
                x1: m.l, y1: m.t + h * r, x2: m.l + w, y2: m.t + h * r,
                stroke: 'rgba(148,163,207,0.08)', strokeWidth: 1
              }, i);
            }),
            jsx('path', { d: area, fill: 'url(#' + gid + ')' }),
            jsx('path', { d: line, fill: 'none', stroke: stroke, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
            labels.map(function (d, i) {
              var idx = data.indexOf(d);
              return jsx('text', {
                x: xAt(idx), y: height - 6, textAnchor: 'middle',
                fill: '#5B6488', fontSize: 10, fontFamily: FONT, children: d[xKey]
              }, i);
            }),
            data.map(function (d, i) {
              return jsx('circle', {
                cx: xAt(i), cy: yAt(safeNum(d[dataKey])), r: 14, fill: 'transparent',
                onMouseEnter: function (e) {
                  setTip({
                    x: e.clientX, y: e.clientY, label: d[xKey],
                    lines: [{ color: stroke, text: toFa(d[dataKey]) + ' ت' }]
                  });
                },
                onMouseLeave: function () { setTip(null); },
                onTouchStart: function (e) {
                  var t = e.touches[0];
                  setTip({
                    x: t.clientX, y: t.clientY, label: d[xKey],
                    lines: [{ color: stroke, text: toFa(d[dataKey]) + ' ت' }]
                  });
                },
                onTouchEnd: function () { setTimeout(function () { setTip(null); }, 1200); },
                style: { cursor: 'crosshair' }
              }, i);
            })
          ]
        }),
        jsx(ChartTip, { tip: tip })
      ]
    });
  }

  function BarChart(props) {
    var data = props.data;
    var bars = props.bars;
    var xKey = props.xKey || 'label';
    var height = props.height || 190;
    var ref = useRef(null);
    var size = useSize(ref);
    var tipSt = useState(null);
    var tip = tipSt[0], setTip = tipSt[1];

    if (!data || !data.length) return jsx('div', { ref: ref, style: { height: height } });

    var m = { t: 14, r: 8, b: 28, l: 8 };
    var w = size.w - m.l - m.r;
    var h = height - m.t - m.b;
    var all = [];
    data.forEach(function (d) { bars.forEach(function (b) { all.push(safeNum(d[b.key])); }); });
    var maxV = Math.max.apply(null, all.concat([1]));
    var slot = w / data.length;
    var barW = Math.min(14, slot / bars.length - 3);
    var step = Math.max(1, Math.floor(data.length / 6));

    return jsxs('div', {
      ref: ref, style: { position: 'relative', height: height },
      children: [
        jsxs('svg', {
          width: '100%', height: height,
          children: [
            [0, 0.5, 1].map(function (r, i) {
              return jsx('line', {
                x1: m.l, y1: m.t + h * r, x2: m.l + w, y2: m.t + h * r,
                stroke: 'rgba(148,163,207,0.08)', strokeWidth: 1
              }, i);
            }),
            data.map(function (d, di) {
              var cx = m.l + (di + 0.5) * slot;
              return jsxs('g', {
                children: [
                  bars.map(function (b, bi) {
                    var val = safeNum(d[b.key]);
                    var bh = val / maxV * h;
                    var bx = cx + (bi - (bars.length - 1) / 2) * (barW + 2) - barW / 2;
                    return jsx('rect', {
                      x: bx, y: m.t + h - bh, width: barW, height: Math.max(0, bh), rx: 4, fill: b.color,
                      onMouseEnter: function (e) {
                        setTip({
                          x: e.clientX, y: e.clientY, label: d[xKey],
                          lines: [{ color: b.color, text: toFa(val) + ' ت' }]
                        });
                      },
                      onMouseLeave: function () { setTip(null); },
                      style: { cursor: 'crosshair' }
                    }, bi);
                  }),
                  di % step === 0 ? jsx('text', {
                    x: cx, y: height - 6, textAnchor: 'middle',
                    fill: '#5B6488', fontSize: 10, fontFamily: FONT, children: d[xKey]
                  }) : null
                ]
              }, di);
            })
          ]
        }),
        jsx(ChartTip, { tip: tip })
      ]
    });
  }

  function Donut(props) {
    var data = props.data || [];
    var size = props.size || 160;
    var total = data.reduce(function (s, d) { return s + safeNum(d.value); }, 0);
    if (total <= 0) {
      return jsx('div', {
        style: { width: size, height: size, borderRadius: '50%', border: '12px solid ' + T.surfaceRaised, margin: '0 auto' }
      });
    }
    var r = 56, c = 2 * Math.PI * r, cx = 80, cy = 80;
    var offset = 0;
    return jsxs('svg', {
      width: size, height: size, viewBox: '0 0 160 160', style: { display: 'block', margin: '0 auto' },
      children: [
        jsx('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: T.surfaceRaised, strokeWidth: 18 }),
        data.map(function (d, i) {
          var frac = safeNum(d.value) / total;
          var len = frac * c;
          var el = jsx('circle', {
            cx: cx, cy: cy, r: r, fill: 'none', stroke: d.color || T.primary,
            strokeWidth: 18, strokeDasharray: len + ' ' + (c - len),
            strokeDashoffset: -offset, strokeLinecap: 'butt',
            transform: 'rotate(-90 ' + cx + ' ' + cy + ')'
          }, i);
          offset += len;
          return el;
        }),
        jsxs('text', {
          x: cx, y: cy - 4, textAnchor: 'middle', fill: T.text, fontSize: 14, fontWeight: 800, fontFamily: FONT_NUM,
          children: [toFa(Math.round(total / 1000)), 'k']
        }),
        jsx('text', {
          x: cx, y: cy + 14, textAnchor: 'middle', fill: T.textFaint, fontSize: 10, fontFamily: FONT,
          children: 'تومان'
        })
      ]
    });
  }

  /* ─── Tx row ─── */
  var TxRow = memo(function TxRow(props) {
    var tx = props.tx;
    var cat = props.category;
    var income = tx.type === 'income';
    return jsxs('div', {
      style: { display: 'flex', gap: 12 },
      children: [
        jsxs('div', {
          style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 },
          children: [
            jsx('div', {
              style: {
                width: 8, height: 8, borderRadius: '50%',
                background: income ? T.income : T.expense,
                boxShadow: '0 0 8px ' + (income ? T.income : T.expense)
              }
            }),
            !props.isLast ? jsx('div', {
              style: {
                width: 2, flex: 1,
                background: 'linear-gradient(180deg, rgba(148,163,207,0.25), transparent)',
                marginTop: 4
              }
            }) : null
          ]
        }),
        jsx('button', {
          type: 'button', onClick: props.onClick, className: 'wos-press',
          style: {
            flex: 1, background: 'none', border: 'none', padding: 0,
            marginBottom: 20, cursor: 'pointer', textAlign: 'right'
          },
          children: jsxs('div', {
            style: { display: 'flex', alignItems: 'center', gap: 11 },
            children: [
              jsx(CatIcon, { icon: cat && cat.icon, color: (cat && cat.color) || T.textFaint, size: 42 }),
              jsxs('div', {
                style: { flex: 1, minWidth: 0 },
                children: [
                  jsx('div', {
                    style: {
                      fontSize: 14.5, fontWeight: 700, color: T.text,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    },
                    children: tx.description || (cat && cat.name) || 'تراکنش'
                  }),
                  jsxs('div', {
                    style: { fontSize: 12, color: T.textFaint, marginTop: 2 },
                    children: [
                      (cat && cat.name) || 'بدون دسته', ' · ',
                      tx.wallet === 'cash' ? 'نقدی' : 'بانک', ' · ',
                      formatJalali(tx.date, { short: true })
                    ]
                  })
                ]
              }),
              jsxs('div', {
                style: { textAlign: 'left' },
                children: [
                  jsxs('div', {
                    style: {
                      fontFamily: FONT_NUM, fontWeight: 800, fontSize: 15,
                      color: income ? T.income : T.expense
                    },
                    children: [income ? '+' : '−', toFa(tx.amount)]
                  }),
                  props.runningBalance !== undefined ? jsxs('div', {
                    style: { fontSize: 10.5, color: T.textFaint, fontFamily: FONT_NUM, marginTop: 2 },
                    children: ['مانده: ', toFa(props.runningBalance)]
                  }) : null
                ]
              })
            ]
          })
        })
      ]
    });
  });

  /* ─── Forms ─── */
  function TxForm(props) {
    var initial = props.initial || {};
    var cats = props.categories || [];
    var tags = props.tags || [];
    var typeSt = useState(initial.type || 'expense');
    var type = typeSt[0], setType = typeSt[1];
    var amountSt = useState(safeNum(initial.amount));
    var amount = amountSt[0], setAmount = amountSt[1];
    var walletSt = useState(initial.wallet || 'cash');
    var wallet = walletSt[0], setWallet = walletSt[1];
    var catSt = useState(initial.categoryId || (cats[0] && cats[0].id) || '');
    var catId = catSt[0], setCatId = catSt[1];
    var tagsSt = useState(initial.tags ? initial.tags.slice() : []);
    var selTags = tagsSt[0], setSelTags = tagsSt[1];
    var descSt = useState(initial.description || '');
    var desc = descSt[0], setDesc = descSt[1];
    var dateSt = useState(dateInputValue(initial.date));
    var date = dateSt[0], setDate = dateSt[1];
    var newTagSt = useState('');
    var newTag = newTagSt[0], setNewTag = newTagSt[1];
    var isEdit = !!(initial && initial.id);

    // Prefer sensible default category when switching type
    useEffect(function () {
      if (isEdit) return;
      if (type === 'income') {
        var sal = cats.find(function (c) { return c.id === 'salary'; });
        if (sal) setCatId(sal.id);
      } else if (catId === 'salary' && cats[0]) {
        setCatId(cats[0].id === 'salary' ? (cats[1] && cats[1].id) || cats[0].id : cats[0].id);
      }
    }, [type]); // eslint-disable-line

    function submit() {
      if (!amount || amount <= 0) return;
      if (!catId) return;
      props.onSubmit({
        id: initial.id || uid(),
        type: type,
        amount: amount,
        wallet: wallet,
        categoryId: catId,
        tags: selTags,
        description: desc.trim(),
        date: fromDateInput(date),
        createdAt: initial.createdAt || Date.now()
      });
    }

    return jsxs('div', {
      children: [
        jsx('div', {
          style: { display: 'flex', gap: 8, marginBottom: 18, background: T.surfaceRaised, padding: 5, borderRadius: 14 },
          children: [
            { k: 'expense', label: 'هزینه', color: T.expense, Icon: Icon.ArrowDownLeft },
            { k: 'income', label: 'درآمد', color: T.income, Icon: Icon.ArrowUpRight }
          ].map(function (x) {
            return jsxs('button', {
              type: 'button', onClick: function () { setType(x.k); }, className: 'wos-press',
              style: {
                flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: type === x.k ? x.color : 'transparent',
                color: type === x.k ? '#0A0E1A' : T.textMuted,
                fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              },
              children: [jsx(x.Icon, { size: 15 }), ' ', x.label]
            }, x.k);
          })
        }),
        jsx(Field, { label: 'مبلغ', children: jsx(AmountInput, { value: amount, onChange: setAmount, autoFocus: true }) }),
        jsx(Field, {
          label: 'کیف پول',
          children: jsx('div', {
            style: { display: 'flex', gap: 8 },
            children: [
              { k: 'cash', label: 'نقدی', Icon: Icon.Banknote, color: T.cash },
              { k: 'bank', label: 'بانک', Icon: Icon.Landmark, color: T.bank }
            ].map(function (x) {
              return jsxs('button', {
                type: 'button', onClick: function () { setWallet(x.k); }, className: 'wos-press',
                style: {
                  flex: 1, padding: '12px 0', borderRadius: 14, cursor: 'pointer',
                  border: '1.5px solid ' + (wallet === x.k ? x.color : T.border),
                  background: wallet === x.k ? x.color + '18' : 'transparent',
                  color: wallet === x.k ? x.color : T.textMuted,
                  fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                },
                children: [jsx(x.Icon, { size: 15 }), ' ', x.label]
              }, x.k);
            })
          })
        }),
        jsx(Field, {
          label: 'دسته‌بندی',
          children: jsx('div', {
            className: 'wos-scroll',
            style: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
            children: cats.map(function (c) {
              var on = catId === c.id;
              return jsxs('button', {
                type: 'button', onClick: function () { setCatId(c.id); }, className: 'wos-press',
                style: {
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0, width: 62
                },
                children: [
                  jsx('div', {
                    style: {
                      width: 46, height: 46, borderRadius: 14,
                      background: on ? c.color : c.color + '1c',
                      border: on ? '2px solid ' + c.color : '2px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    },
                    children: createElement(CAT_ICONS[c.icon] || Icon.MoreHorizontal, {
                      size: 20, color: on ? '#0A0E1A' : c.color, strokeWidth: 2.3
                    })
                  }),
                  jsx('span', {
                    style: { fontSize: 10.5, color: on ? T.text : T.textFaint, fontWeight: 600, textAlign: 'center' },
                    children: c.name
                  })
                ]
              }, c.id);
            })
          })
        }),
        jsxs(Field, {
          label: 'برچسب‌ها (اختیاری)',
          children: [
            jsx('div', {
              style: { display: 'flex', gap: 7, flexWrap: 'wrap' },
              children: tags.map(function (tg) {
                return jsx(Chip, {
                  active: selTags.indexOf(tg.id) >= 0,
                  color: T.primary,
                  onClick: function () {
                    setSelTags(function (prev) {
                      return prev.indexOf(tg.id) >= 0 ? prev.filter(function (x) { return x !== tg.id; }) : prev.concat([tg.id]);
                    });
                  },
                  children: tg.name
                }, tg.id);
              })
            }),
            jsxs('div', {
              style: { display: 'flex', gap: 8, marginTop: 10 },
              children: [
                jsx('input', {
                  value: newTag,
                  onChange: function (e) { setNewTag(e.target.value); },
                  onKeyDown: function (e) {
                    if (e.key === 'Enter' && newTag.trim()) {
                      e.preventDefault();
                      var t = props.onAddTag(newTag.trim());
                      if (t) setSelTags(function (p) { return p.concat([t.id]); });
                      setNewTag('');
                    }
                  },
                  placeholder: 'برچسب جدید…',
                  style: Object.assign({}, INPUT_STYLE, { padding: '9px 12px', fontSize: 13 })
                }),
                jsx('button', {
                  type: 'button', className: 'wos-press',
                  onClick: function () {
                    if (!newTag.trim()) return;
                    var t = props.onAddTag(newTag.trim());
                    if (t) setSelTags(function (p) { return p.concat([t.id]); });
                    setNewTag('');
                  },
                  style: {
                    background: T.surfaceRaised, border: '1px solid ' + T.border,
                    borderRadius: 12, padding: '0 14px', color: T.primaryLight, fontWeight: 700, cursor: 'pointer'
                  },
                  children: 'افزودن'
                })
              ]
            })
          ]
        }),
        jsx(Field, {
          label: 'تاریخ',
          children: jsx('input', {
            type: 'date', value: date,
            onChange: function (e) { setDate(e.target.value); },
            style: INPUT_STYLE
          })
        }),
        jsx(Field, {
          label: 'توضیحات (اختیاری)',
          children: jsx('input', {
            value: desc,
            onChange: function (e) { setDesc(e.target.value); },
            placeholder: 'مثلاً: ناهار با دوستان',
            style: INPUT_STYLE
          })
        }),
        jsxs('div', {
          style: { display: 'flex', gap: 10, marginTop: 6 },
          children: [
            isEdit ? jsx('button', {
              type: 'button', onClick: function () { props.onDelete(initial.id); }, className: 'wos-press',
              'aria-label': 'حذف',
              style: {
                width: 52, borderRadius: 16, border: '1.5px solid ' + T.expense + '44',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              },
              children: jsx(Icon.Trash, { size: 18, color: T.expense })
            }) : null,
            jsx('div', {
              style: { flex: 1 },
              children: jsx(Btn, {
                color: type === 'income' ? T.income : T.primary,
                disabled: !amount || amount <= 0,
                onClick: submit,
                children: isEdit ? 'ذخیره تغییرات' : 'ثبت تراکنش'
              })
            })
          ]
        })
      ]
    });
  }

  function BudgetForm(props) {
    var initial = props.initial;
    var used = (props.budgets || []).map(function (b) { return b.categoryId; }).filter(function (id) {
      return !initial || id !== initial.categoryId;
    });
    var available = (props.categories || []).filter(function (c) {
      return c.id !== 'salary' && used.indexOf(c.id) < 0;
    });
    var catSt = useState((initial && initial.categoryId) || (available[0] && available[0].id) || '');
    var catId = catSt[0], setCatId = catSt[1];
    var amountSt = useState(safeNum(initial && initial.amount));
    var amount = amountSt[0], setAmount = amountSt[1];

    return jsxs('div', {
      children: [
        jsx(Field, {
          label: 'دسته‌بندی',
          children: jsxs('div', {
            className: 'wos-scroll',
            style: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
            children: [
              available.map(function (c) {
                var on = catId === c.id;
                return jsxs('button', {
                  type: 'button', onClick: function () { setCatId(c.id); }, className: 'wos-press',
                  style: {
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0, width: 62
                  },
                  children: [
                    jsx('div', {
                      style: {
                        width: 46, height: 46, borderRadius: 14,
                        background: on ? c.color : c.color + '1c',
                        border: on ? '2px solid ' + c.color : '2px solid transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      },
                      children: createElement(CAT_ICONS[c.icon] || Icon.MoreHorizontal, {
                        size: 20, color: on ? '#0A0E1A' : c.color
                      })
                    }),
                    jsx('span', {
                      style: { fontSize: 10.5, color: on ? T.text : T.textFaint, fontWeight: 600 },
                      children: c.name
                    })
                  ]
                }, c.id);
              }),
              available.length === 0 ? jsx('span', {
                style: { color: T.textFaint, fontSize: 13 },
                children: 'همه‌ی دسته‌بندی‌ها بودجه دارند'
              }) : null
            ]
          })
        }),
        jsx(Field, { label: 'سقف بودجه ماهانه', children: jsx(AmountInput, { value: amount, onChange: setAmount }) }),
        jsxs('div', {
          style: { display: 'flex', gap: 10 },
          children: [
            initial ? jsx('button', {
              type: 'button', onClick: function () { props.onDelete(initial.id); }, className: 'wos-press',
              style: {
                width: 52, borderRadius: 16, border: '1.5px solid ' + T.expense + '44',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              },
              children: jsx(Icon.Trash, { size: 18, color: T.expense })
            }) : null,
            jsx('div', {
              style: { flex: 1 },
              children: jsx(Btn, {
                disabled: !amount || !catId,
                onClick: function () {
                  props.onSubmit({ id: (initial && initial.id) || uid(), categoryId: catId, amount: amount });
                },
                children: initial ? 'ذخیره تغییرات' : 'تعیین بودجه'
              })
            })
          ]
        })
      ]
    });
  }

  function GoalForm(props) {
    var initial = props.initial;
    var nameSt = useState((initial && initial.name) || '');
    var name = nameSt[0], setName = nameSt[1];
    var targetSt = useState(safeNum(initial && initial.target));
    var target = targetSt[0], setTarget = targetSt[1];
    var iconSt = useState((initial && initial.icon) || 'Target');
    var icon = iconSt[0], setIcon = iconSt[1];

    return jsxs('div', {
      children: [
        jsx(Field, {
          label: 'نام هدف',
          children: jsx('input', {
            value: name, onChange: function (e) { setName(e.target.value); },
            placeholder: 'مثلاً: خرید PC گیمینگ', style: INPUT_STYLE
          })
        }),
        jsx(Field, {
          label: 'آیکون',
          children: jsx('div', {
            style: { display: 'flex', gap: 8, flexWrap: 'wrap' },
            children: GOAL_ICONS.map(function (k) {
              var on = icon === k;
              return jsx('button', {
                type: 'button', onClick: function () { setIcon(k); }, className: 'wos-press',
                style: {
                  width: 44, height: 44, borderRadius: 12,
                  border: '1.5px solid ' + (on ? T.primary : T.border),
                  background: on ? T.primary + '22' : 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                },
                children: createElement(CAT_ICONS[k] || Icon.Target, {
                  size: 19, color: on ? T.primaryLight : T.textMuted
                })
              }, k);
            })
          })
        }),
        jsx(Field, { label: 'مبلغ هدف', children: jsx(AmountInput, { value: target, onChange: setTarget }) }),
        jsxs('div', {
          style: { display: 'flex', gap: 10 },
          children: [
            initial ? jsx('button', {
              type: 'button', onClick: function () { props.onDelete(initial.id); }, className: 'wos-press',
              style: {
                width: 52, borderRadius: 16, border: '1.5px solid ' + T.expense + '44',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              },
              children: jsx(Icon.Trash, { size: 18, color: T.expense })
            }) : null,
            jsx('div', {
              style: { flex: 1 },
              children: jsx(Btn, {
                color: T.gold,
                disabled: !name.trim() || !target,
                onClick: function () {
                  props.onSubmit({
                    id: (initial && initial.id) || uid(),
                    name: name.trim(),
                    target: target,
                    icon: icon,
                    contributions: (initial && initial.contributions) || [],
                    createdAt: (initial && initial.createdAt) || Date.now()
                  });
                },
                children: initial ? 'ذخیره تغییرات' : 'ساخت هدف'
              })
            })
          ]
        })
      ]
    });
  }

  function ContributeForm(props) {
    var amountSt = useState(0);
    var amount = amountSt[0], setAmount = amountSt[1];
    return jsxs('div', {
      children: [
        jsx(Field, {
          label: 'واریز به «' + props.goal.name + '»',
          children: jsx(AmountInput, { value: amount, onChange: setAmount, autoFocus: true })
        }),
        jsx(Btn, {
          color: T.gold, disabled: !amount,
          onClick: function () { props.onSubmit(amount); },
          children: 'افزودن به هدف'
        })
      ]
    });
  }

  function CategoryForm(props) {
    var initial = props.initial;
    var nameSt = useState((initial && initial.name) || '');
    var name = nameSt[0], setName = nameSt[1];
    var iconSt = useState((initial && initial.icon) || 'MoreHorizontal');
    var icon = iconSt[0], setIcon = iconSt[1];
    var colorSt = useState((initial && initial.color) || CAT_COLORS[0]);
    var color = colorSt[0], setColor = colorSt[1];
    var canDelete = initial && initial.id !== 'salary';

    return jsxs('div', {
      children: [
        jsx(Field, {
          label: 'نام دسته‌بندی',
          children: jsx('input', {
            value: name, onChange: function (e) { setName(e.target.value); },
            placeholder: 'مثلاً: کتاب', style: INPUT_STYLE
          })
        }),
        jsx(Field, {
          label: 'آیکون',
          children: jsx('div', {
            style: { display: 'flex', gap: 8, flexWrap: 'wrap' },
            children: CAT_ICON_KEYS.map(function (k) {
              var on = icon === k;
              return jsx('button', {
                type: 'button', onClick: function () { setIcon(k); }, className: 'wos-press',
                style: {
                  width: 40, height: 40, borderRadius: 11,
                  border: '1.5px solid ' + (on ? color : T.border),
                  background: on ? color + '22' : 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                },
                children: createElement(CAT_ICONS[k], { size: 17, color: on ? color : T.textMuted })
              }, k);
            })
          })
        }),
        jsx(Field, {
          label: 'رنگ',
          children: jsx('div', {
            style: { display: 'flex', gap: 8, flexWrap: 'wrap' },
            children: CAT_COLORS.map(function (c) {
              return jsx('button', {
                type: 'button', onClick: function () { setColor(c); }, className: 'wos-press',
                style: {
                  width: 30, height: 30, borderRadius: '50%', background: c,
                  border: color === c ? '2.5px solid ' + T.text : '2.5px solid transparent',
                  cursor: 'pointer'
                }
              }, c);
            })
          })
        }),
        jsxs('div', {
          style: { display: 'flex', gap: 10 },
          children: [
            canDelete ? jsx('button', {
              type: 'button', onClick: function () { props.onDelete(initial.id); }, className: 'wos-press',
              style: {
                width: 52, borderRadius: 16, border: '1.5px solid ' + T.expense + '44',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              },
              children: jsx(Icon.Trash, { size: 18, color: T.expense })
            }) : null,
            jsx('div', {
              style: { flex: 1 },
              children: jsx(Btn, {
                disabled: !name.trim(),
                onClick: function () {
                  props.onSubmit({
                    id: (initial && initial.id) || uid(),
                    name: name.trim(), icon: icon, color: color
                  });
                },
                children: initial ? 'ذخیره تغییرات' : 'ساخت دسته‌بندی'
              })
            })
          ]
        })
      ]
    });
  }

  /* ─── Screens ─── */
  function Onboarding(props) {
    var cashSt = useState(0);
    var cash = cashSt[0], setCash = cashSt[1];
    var bankSt = useState(0);
    var bank = bankSt[0], setBank = bankSt[1];
    return jsx('div', {
      style: {
        minHeight: '100vh', background: T.bgGrad, display: 'flex',
        flexDirection: 'column', justifyContent: 'center', padding: 24, fontFamily: FONT
      },
      children: jsxs('div', {
        className: 'wos-anim-up',
        style: { maxWidth: 420, margin: '0 auto', width: '100%' },
        children: [
          jsx('div', {
            style: { display: 'flex', justifyContent: 'center', marginBottom: 22 },
            children: jsx('div', {
              style: {
                width: 74, height: 74, borderRadius: 22,
                background: 'linear-gradient(140deg, ' + T.primary + ', #1c4fd6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px ' + T.primaryGlow
              },
              children: jsx(Icon.Wallet, { size: 34, color: '#fff' })
            })
          }),
          jsx('h1', {
            style: { textAlign: 'center', fontSize: 24, fontWeight: 900, color: T.text, margin: '0 0 6px' },
            children: 'به WalletOS خوش اومدی'
          }),
          jsx('p', {
            style: { textAlign: 'center', fontSize: 14, color: T.textMuted, margin: '0 0 30px', lineHeight: 1.8 },
            children: 'برای شروع، موجودی فعلی‌ات رو وارد کن. از این به بعد هر تراکنش خودکار حسابش می‌رسه.'
          }),
          jsxs(Card, {
            style: { padding: 20, marginBottom: 14 },
            children: [
              jsx(Field, { label: '💵 موجودی نقدی', children: jsx(AmountInput, { value: cash, onChange: setCash, autoFocus: true }) }),
              jsx(Field, { label: '💳 موجودی بانکی', children: jsx(AmountInput, { value: bank, onChange: setBank }) })
            ]
          }),
          jsxs('div', {
            style: { textAlign: 'center', color: T.textFaint, fontSize: 13, marginBottom: 18 },
            children: [
              'مجموع اولیه: ',
              jsxs('span', {
                style: { color: T.primaryLight, fontFamily: FONT_NUM, fontWeight: 800 },
                children: [toFa(cash + bank), ' تومان']
              })
            ]
          }),
          jsx(Btn, { onClick: function () { props.onDone(cash, bank); }, children: 'شروع کن' })
        ]
      })
    });
  }

  function Dashboard(props) {
    var b = props.balances;
    var total = safeNum(b.cash) + safeNum(b.bank);
    var recent = (props.txs || []).slice(0, 5);
    var budgets = props.budgets || [];
    var goals = props.goals || [];
    var catMap = props.catMap || {};

    var topBudget = null;
    if (budgets.length) {
      var scored = budgets.map(function (bg) {
        var spent = (props.rawTxs || []).filter(function (t) {
          return t.type === 'expense' && t.categoryId === bg.categoryId && isThisMonth(t.date);
        }).reduce(function (s, t) { return s + safeNum(t.amount); }, 0);
        var amount = safeNum(bg.amount) || 1;
        return { bg: bg, spent: spent, pct: spent / amount * 100, cat: catMap[bg.categoryId] };
      }).sort(function (a, c) { return c.pct - a.pct; });
      topBudget = scored[0];
    }

    var topGoal = null;
    if (goals.length) {
      topGoal = goals.map(function (g) {
        var cur = (g.contributions || []).reduce(function (s, c) { return s + safeNum(c.amount); }, 0);
        return { g: g, current: cur, pct: cur / (safeNum(g.target) || 1) * 100 };
      }).sort(function (a, c) { return c.pct - a.pct; })[0];
    }

    var net = safeNum(props.monthIncome) - safeNum(props.monthExpense);

    return jsxs('div', {
      children: [
        jsxs('div', {
          style: { padding: '22px 20px 6px' },
          children: [
            jsx('div', { style: { fontSize: 13, color: T.textFaint, fontWeight: 600, marginBottom: 6 }, children: 'موجودی کل' }),
            jsxs(Card, {
              style: { padding: '26px 22px', position: 'relative', overflow: 'hidden', borderColor: T.primary + '33' },
              children: [
                jsx('div', {
                  style: {
                    position: 'absolute', top: -60, left: -40, width: 180, height: 180, borderRadius: '50%',
                    background: T.primary, opacity: 0.16, filter: 'blur(40px)',
                    animation: 'wosPulse 5s ease-in-out infinite', pointerEvents: 'none'
                  }
                }),
                jsxs('div', {
                  style: { position: 'relative' },
                  children: [
                    jsxs('div', {
                      style: {
                        fontSize: 34, fontWeight: 900, fontFamily: FONT_NUM, color: T.text,
                        display: 'flex', alignItems: 'baseline', gap: 8
                      },
                      children: [
                        toFa(total),
                        jsx('span', { style: { fontSize: 14, fontWeight: 700, color: T.textFaint }, children: 'تومان' })
                      ]
                    }),
                    jsxs('div', {
                      style: { display: 'flex', gap: 10, marginTop: 18 },
                      children: [
                        jsxs('div', {
                          style: {
                            flex: 1, background: 'rgba(245,185,71,0.1)', borderRadius: 14,
                            padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9
                          },
                          children: [
                            jsx(Icon.Banknote, { size: 16, color: T.cash }),
                            jsxs('div', {
                              children: [
                                jsx('div', { style: { fontSize: 10.5, color: T.textFaint, fontWeight: 600 }, children: 'نقدی' }),
                                jsx('div', { style: { fontSize: 13.5, fontWeight: 800, fontFamily: FONT_NUM, color: T.text }, children: toFa(b.cash) })
                              ]
                            })
                          ]
                        }),
                        jsxs('div', {
                          style: {
                            flex: 1, background: 'rgba(111,161,255,0.1)', borderRadius: 14,
                            padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9
                          },
                          children: [
                            jsx(Icon.Landmark, { size: 16, color: T.bank }),
                            jsxs('div', {
                              children: [
                                jsx('div', { style: { fontSize: 10.5, color: T.textFaint, fontWeight: 600 }, children: 'بانک' }),
                                jsx('div', { style: { fontSize: 13.5, fontWeight: 800, fontFamily: FONT_NUM, color: T.text }, children: toFa(b.bank) })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        jsxs('div', {
          style: { display: 'flex', gap: 10, padding: '16px 20px 4px' },
          children: [
            jsxs('button', {
              type: 'button', onClick: function () { props.onQuickAdd('income'); }, className: 'wos-press',
              style: {
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '13px 0', borderRadius: 16, border: 'none', cursor: 'pointer',
                background: T.incomeDim, color: T.income, fontWeight: 800, fontSize: 13.5
              },
              children: [jsx(Icon.ArrowUpRight, { size: 16 }), ' افزودن درآمد']
            }),
            jsxs('button', {
              type: 'button', onClick: function () { props.onQuickAdd('expense'); }, className: 'wos-press',
              style: {
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '13px 0', borderRadius: 16, border: 'none', cursor: 'pointer',
                background: T.expenseDim, color: T.expense, fontWeight: 800, fontSize: 13.5
              },
              children: [jsx(Icon.ArrowDownLeft, { size: 16 }), ' ثبت هزینه']
            })
          ]
        }),

        jsxs('div', {
          style: { display: 'flex', gap: 10, padding: '12px 20px' },
          children: [
            jsxs(Card, {
              style: { flex: 1, padding: '14px 14px' },
              children: [
                jsx('div', { style: { fontSize: 11, color: T.textFaint, fontWeight: 600 }, children: 'درآمد این ماه' }),
                jsx('div', { style: { fontSize: 16, fontWeight: 800, fontFamily: FONT_NUM, color: T.income, marginTop: 4 }, children: toFa(props.monthIncome) })
              ]
            }),
            jsxs(Card, {
              style: { flex: 1, padding: '14px 14px' },
              children: [
                jsx('div', { style: { fontSize: 11, color: T.textFaint, fontWeight: 600 }, children: 'هزینه این ماه' }),
                jsx('div', { style: { fontSize: 16, fontWeight: 800, fontFamily: FONT_NUM, color: T.expense, marginTop: 4 }, children: toFa(props.monthExpense) })
              ]
            }),
            jsxs(Card, {
              style: { flex: 1, padding: '14px 14px' },
              children: [
                jsx('div', { style: { fontSize: 11, color: T.textFaint, fontWeight: 600 }, children: 'مانده ماه' }),
                jsx('div', {
                  style: {
                    fontSize: 16, fontWeight: 800, fontFamily: FONT_NUM, marginTop: 4,
                    color: net >= 0 ? T.income : T.expense
                  },
                  children: (net >= 0 ? '+' : '−') + toFa(Math.abs(net))
                })
              ]
            })
          ]
        }),

        props.trendData && props.trendData.length >= 2 ? jsxs('div', {
          style: { padding: '6px 20px 4px' },
          children: [
            jsxs(Card, {
              style: { padding: '16px 12px 8px' },
              children: [
                jsxs('div', {
                  style: { display: 'flex', alignItems: 'center', gap: 8, paddingInline: 6, marginBottom: 4 },
                  children: [
                    jsx(Icon.TrendingUp, { size: 15, color: T.primaryLight }),
                    jsx('span', { style: { fontSize: 13.5, fontWeight: 800 }, children: 'روند ۱۴ روزه موجودی' })
                  ]
                }),
                jsx(AreaChart, { data: props.trendData, dataKey: 'balance', stroke: T.primaryLight, height: 150, gid: 'home' })
              ]
            })
          ]
        }) : null,

        topBudget ? jsxs('div', {
          style: { padding: '10px 20px 4px' },
          children: [
            jsxs(Card, {
              style: { padding: 16 },
              children: [
                jsxs('div', {
                  style: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
                  children: [
                    jsxs('div', {
                      style: { display: 'flex', alignItems: 'center', gap: 10 },
                      children: [
                        jsx(CatIcon, { icon: topBudget.cat && topBudget.cat.icon, color: topBudget.cat && topBudget.cat.color, size: 36 }),
                        jsxs('div', {
                          children: [
                            jsx('div', { style: { fontSize: 12, color: T.textFaint, fontWeight: 600 }, children: 'بودجه پرمصرف' }),
                            jsx('div', { style: { fontSize: 13.5, fontWeight: 700 }, children: (topBudget.cat && topBudget.cat.name) || '—' })
                          ]
                        })
                      ]
                    }),
                    jsxs('span', {
                      style: {
                        fontFamily: FONT_NUM, fontWeight: 800, fontSize: 14,
                        color: topBudget.pct >= 100 ? T.expense : topBudget.pct >= 75 ? T.gold : T.primaryLight
                      },
                      children: [Math.round(topBudget.pct), '٪']
                    })
                  ]
                }),
                jsx(ProgressBar, {
                  pct: topBudget.pct,
                  color: topBudget.pct >= 100 ? T.expense : topBudget.pct >= 75 ? T.gold : T.primary
                }),
                jsxs('div', {
                  style: { fontSize: 11.5, fontFamily: FONT_NUM, color: T.textFaint, marginTop: 8 },
                  children: [toFa(topBudget.spent), ' از ', toFa(topBudget.bg.amount), ' تومان']
                })
              ]
            })
          ]
        }) : null,

        topGoal ? jsxs('div', {
          style: { padding: '10px 20px 4px' },
          children: [
            jsxs(Card, {
              style: { padding: 16 },
              children: [
                jsxs('div', {
                  style: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
                  children: [
                    jsxs('div', {
                      style: { display: 'flex', alignItems: 'center', gap: 10 },
                      children: [
                        jsx(CatIcon, { icon: topGoal.g.icon, color: T.gold, size: 36 }),
                        jsxs('div', {
                          children: [
                            jsx('div', { style: { fontSize: 12, color: T.textFaint, fontWeight: 600 }, children: 'نزدیک‌ترین هدف' }),
                            jsx('div', { style: { fontSize: 13.5, fontWeight: 700 }, children: topGoal.g.name })
                          ]
                        })
                      ]
                    }),
                    jsxs('span', { style: { fontFamily: FONT_NUM, fontWeight: 800, fontSize: 14, color: T.gold }, children: [Math.round(topGoal.pct), '٪'] })
                  ]
                }),
                jsx(ProgressBar, { pct: topGoal.pct, color: T.gold })
              ]
            })
          ]
        }) : null,

        jsxs('div', {
          style: { padding: '14px 20px 100px' },
          children: [
            jsx('div', { style: { fontSize: 13.5, fontWeight: 800, marginBottom: 12 }, children: 'تراکنش‌های اخیر' }),
            recent.length === 0
              ? jsx(EmptyState, { icon: Icon.Receipt, text: 'هنوز تراکنشی ثبت نشده', sub: 'با دکمه‌های بالا شروع کن' })
              : recent.map(function (tx, i) {
                return jsx(TxRow, {
                  tx: tx,
                  category: catMap[tx.categoryId],
                  onClick: function () { props.onOpenTx(tx); },
                  runningBalance: tx.runningBalance,
                  isLast: i === recent.length - 1
                }, tx.id);
              })
          ]
        })
      ]
    });
  }

  function TransactionsPage(props) {
    var qSt = useState('');
    var q = qSt[0], setQ = qSt[1];
    var rangeSt = useState('all');
    var range = rangeSt[0], setRange = rangeSt[1];
    var typeSt = useState('all');
    var type = typeSt[0], setType = typeSt[1];
    var walletSt = useState('all');
    var wallet = walletSt[0], setWallet = walletSt[1];
    var catSt = useState('all');
    var cat = catSt[0], setCat = catSt[1];
    var filtersOpenSt = useState(false);
    var filtersOpen = filtersOpenSt[0], setFiltersOpen = filtersOpenSt[1];

    var filtered = useMemo(function () {
      var list = props.allTxsWithBalance || [];
      var query = q.trim().toLowerCase();
      return list.filter(function (s) {
        if (type !== 'all' && s.type !== type) return false;
        if (wallet !== 'all' && s.wallet !== wallet) return false;
        if (cat !== 'all' && s.categoryId !== cat) return false;
        if (range === 'today' && !isToday(s.date)) return false;
        if (range === 'week' && !isThisWeek(s.date)) return false;
        if (range === 'month' && !isThisMonth(s.date)) return false;
        if (range === 'year' && !isThisYear(s.date)) return false;
        if (query) {
          var c = props.catMap[s.categoryId];
          var hay = [s.description, c && c.name, String(s.amount), s.wallet === 'cash' ? 'نقدی' : 'بانک', formatJalali(s.date)].join(' ').toLowerCase();
          if (hay.indexOf(query) < 0) return false;
        }
        return true;
      });
    }, [props.allTxsWithBalance, q, range, type, wallet, cat, props.catMap]);

    var activeFilters = [range !== 'all', type !== 'all', wallet !== 'all', cat !== 'all'].filter(Boolean).length;

    // Virtual-ish: cap initial render for smoothness on huge lists
    var limitSt = useState(60);
    var limit = limitSt[0], setLimit = limitSt[1];
    useEffect(function () { setLimit(60); }, [q, range, type, wallet, cat]);
    var shown = filtered.slice(0, limit);

    return jsxs('div', {
      children: [
        jsx(PageHeader, { title: 'تراکنش‌ها', sub: toFa(filtered.length) + ' مورد' }),
        jsxs('div', {
          style: { padding: '0 20px 12px' },
          children: [
            jsxs('div', {
              style: { position: 'relative' },
              children: [
                jsx(Icon.Search, {
                  size: 16, color: T.textFaint,
                  style: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }
                }),
                jsx('input', {
                  value: q,
                  onChange: function (e) { setQ(e.target.value); },
                  placeholder: 'جستجو در مبلغ، دسته، توضیحات…',
                  style: Object.assign({}, INPUT_STYLE, { paddingRight: 38 })
                })
              ]
            }),
            jsxs('div', {
              className: 'wos-scroll',
              style: { display: 'flex', gap: 8, overflowX: 'auto', marginTop: 10, paddingBottom: 2 },
              children: [
                jsxs(Chip, {
                  active: filtersOpen || activeFilters > 0,
                  onClick: function () { setFiltersOpen(function (v) { return !v; }); },
                  children: [
                    jsx(Icon.Sliders, { size: 12, style: { display: 'inline', marginLeft: 4, verticalAlign: -2 } }),
                    'فیلترها ', activeFilters > 0 ? '(' + activeFilters + ')' : ''
                  ]
                }),
                ['today', 'week', 'month', 'year'].map(function (s) {
                  return jsx(Chip, {
                    active: range === s,
                    onClick: function () { setRange(range === s ? 'all' : s); },
                    children: ({ today: 'امروز', week: 'این هفته', month: 'این ماه', year: 'امسال' })[s]
                  }, s);
                })
              ]
            }),
            filtersOpen ? jsxs('div', {
              className: 'wos-anim-fade',
              style: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 },
              children: [
                jsxs('div', {
                  style: { display: 'flex', gap: 6, flexWrap: 'wrap' },
                  children: [
                    [{ k: 'all', l: 'همه' }, { k: 'income', l: 'درآمد' }, { k: 'expense', l: 'هزینه' }].map(function (s) {
                      return jsx(Chip, {
                        active: type === s.k,
                        onClick: function () { setType(s.k); },
                        color: s.k === 'income' ? T.income : s.k === 'expense' ? T.expense : undefined,
                        children: s.l
                      }, s.k);
                    }),
                    [{ k: 'all', l: 'هر کیف پول' }, { k: 'cash', l: 'نقدی' }, { k: 'bank', l: 'بانک' }].map(function (s) {
                      return jsx(Chip, {
                        active: wallet === s.k,
                        onClick: function () { setWallet(s.k); },
                        children: s.l
                      }, 'w' + s.k);
                    })
                  ]
                }),
                jsxs('div', {
                  className: 'wos-scroll',
                  style: { display: 'flex', gap: 6, overflowX: 'auto' },
                  children: [
                    jsx(Chip, { active: cat === 'all', onClick: function () { setCat('all'); }, children: 'همه دسته‌ها' }),
                    (props.categories || []).map(function (c) {
                      return jsx(Chip, {
                        active: cat === c.id,
                        onClick: function () { setCat(c.id); },
                        color: c.color,
                        children: c.name
                      }, c.id);
                    })
                  ]
                })
              ]
            }) : null
          ]
        }),
        jsx('div', {
          style: { padding: '6px 20px 100px' },
          children: filtered.length === 0
            ? jsx(EmptyState, { icon: Icon.Search, text: 'چیزی پیدا نشد', sub: 'فیلترها یا عبارت جستجو رو تغییر بده' })
            : jsxs(Fragment, {
              children: [
                shown.map(function (s, i) {
                  return jsx(TxRow, {
                    tx: s,
                    category: props.catMap[s.categoryId],
                    onClick: function () { props.onOpenTx(s); },
                    runningBalance: s.runningBalance,
                    isLast: i === shown.length - 1 && shown.length >= filtered.length
                  }, s.id);
                }),
                shown.length < filtered.length ? jsx('button', {
                  type: 'button', className: 'wos-press',
                  onClick: function () { setLimit(function (n) { return n + 60; }); },
                  style: {
                    width: '100%', padding: '12px', borderRadius: 14, border: '1px solid ' + T.border,
                    background: T.surfaceRaised, color: T.primaryLight, fontWeight: 700, cursor: 'pointer', marginTop: 4
                  },
                  children: 'نمایش بیشتر (' + toFa(filtered.length - shown.length) + ' باقی‌مانده)'
                }) : null
              ]
            })
        })
      ]
    });
  }

  function BudgetsPage(props) {
    var rows = (props.budgets || []).map(function (f) {
      var spent = (props.txs || []).filter(function (m) {
        return m.type === 'expense' && m.categoryId === f.categoryId && isThisMonth(m.date);
      }).reduce(function (s, m) { return s + safeNum(m.amount); }, 0);
      var amount = safeNum(f.amount) || 1;
      return Object.assign({}, f, {
        spent: spent,
        pct: spent / amount * 100,
        cat: props.catMap[f.categoryId]
      });
    });
    var totalBudget = (props.budgets || []).reduce(function (s, r) { return s + safeNum(r.amount); }, 0);
    var totalSpent = rows.reduce(function (s, r) { return s + r.spent; }, 0);
    var sorted = rows.slice().sort(function (a, b) { return b.pct - a.pct; });

    return jsxs('div', {
      children: [
        jsx(PageHeader, {
          title: 'بودجه‌بندی',
          sub: 'مدیریت هزینه‌های ماهانه',
          right: jsx('button', {
            type: 'button', onClick: props.onAdd, className: 'wos-press', 'aria-label': 'بودجه جدید',
            style: {
              background: T.primary, border: 'none', borderRadius: 12, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            },
            children: jsx(Icon.Plus, { size: 19, color: '#0A0E1A' })
          })
        }),
        props.budgets && props.budgets.length > 0 ? jsx('div', {
          style: { padding: '0 20px 14px' },
          children: jsxs(Card, {
            style: { padding: 16 },
            children: [
              jsxs('div', {
                style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
                children: [
                  jsx('span', { style: { fontSize: 12.5, color: T.textMuted, fontWeight: 700 }, children: 'مجموع بودجه ماه' }),
                  jsxs('span', {
                    style: { fontSize: 12.5, fontFamily: FONT_NUM, color: T.textMuted, fontWeight: 700 },
                    children: [totalBudget ? Math.round(totalSpent / totalBudget * 100) : 0, '٪']
                  })
                ]
              }),
              jsx(ProgressBar, { pct: totalBudget ? totalSpent / totalBudget * 100 : 0, color: T.primary, height: 10 }),
              jsxs('div', {
                style: { fontSize: 12, fontFamily: FONT_NUM, color: T.textFaint, marginTop: 8 },
                children: [toFa(totalSpent), ' از ', toFa(totalBudget), ' تومان']
              })
            ]
          })
        }) : null,
        jsx('div', {
          style: { padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 10 },
          children: sorted.length === 0
            ? jsx(EmptyState, { icon: Icon.PiggyBank, text: 'هنوز بودجه‌ای تعریف نشده', sub: 'با دکمه‌ی بالا یکی بساز' })
            : sorted.map(function (f) {
              return jsxs(Card, {
                style: { padding: 16 },
                onClick: function () { props.onOpen(f); },
                className: 'wos-press',
                children: [
                  jsxs('div', {
                    style: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, cursor: 'pointer' },
                    children: [
                      jsxs('div', {
                        style: { display: 'flex', alignItems: 'center', gap: 10 },
                        children: [
                          jsx(CatIcon, { icon: f.cat && f.cat.icon, color: f.cat && f.cat.color, size: 36 }),
                          jsxs('div', {
                            children: [
                              jsx('div', { style: { fontSize: 13.5, fontWeight: 700, color: T.text }, children: (f.cat && f.cat.name) || 'نامشخص' }),
                              jsxs('div', {
                                style: { fontSize: 11, fontFamily: FONT_NUM, color: T.textFaint },
                                children: [toFa(f.spent), ' / ', toFa(f.amount)]
                              })
                            ]
                          })
                        ]
                      }),
                      f.pct >= 90 ? jsx(Icon.Flame, { size: 16, color: T.expense }) : null
                    ]
                  }),
                  jsx(ProgressBar, {
                    pct: f.pct,
                    color: f.pct >= 100 ? T.expense : f.pct >= 75 ? T.gold : T.primary
                  })
                ]
              }, f.id);
            })
        })
      ]
    });
  }

  function GoalsPage(props) {
    return jsxs('div', {
      children: [
        jsx(PageHeader, {
          title: 'اهداف مالی',
          sub: 'پس‌انداز برای چیزی که می‌خوای',
          right: jsx('button', {
            type: 'button', onClick: props.onAdd, className: 'wos-press', 'aria-label': 'هدف جدید',
            style: {
              background: T.gold, border: 'none', borderRadius: 12, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            },
            children: jsx(Icon.Plus, { size: 19, color: '#0A0E1A' })
          })
        }),
        jsx('div', {
          style: { padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 },
          children: !(props.goals && props.goals.length)
            ? jsx(EmptyState, { icon: Icon.Target, text: 'هنوز هدفی نساختی', sub: 'مثلاً پس‌انداز برای یک PC گیمینگ' })
            : props.goals.map(function (n) {
              var u = (n.contributions || []).reduce(function (s, c) { return s + safeNum(c.amount); }, 0);
              var target = safeNum(n.target) || 1;
              var i = Math.min(100, u / target * 100);
              var c = Math.max(0, target - u);
              var months = Math.max(1, Math.round((Date.now() - (n.createdAt || Date.now())) / (1000 * 60 * 60 * 24 * 30)));
              var rate = u / months;
              var eta = rate > 0 ? Math.ceil(c / rate) : null;
              return jsxs(Card, {
                style: { padding: 18 },
                children: [
                  jsxs('div', {
                    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
                    children: [
                      jsxs('div', {
                        onClick: function () { props.onOpen(n); },
                        className: 'wos-press',
                        style: { display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' },
                        children: [
                          jsx(CatIcon, { icon: n.icon, color: T.gold, size: 44 }),
                          jsxs('div', {
                            children: [
                              jsx('div', { style: { fontSize: 15, fontWeight: 800, color: T.text }, children: n.name }),
                              jsx('div', {
                                style: { fontSize: 11.5, color: T.textFaint, marginTop: 2 },
                                children: i >= 100 ? '🎉 تکمیل شد' : eta ? 'تخمین رسیدن: ' + eta + ' ماه دیگر' : 'هنوز واریزی نداشته'
                              })
                            ]
                          })
                        ]
                      }),
                      jsxs('span', {
                        style: { fontSize: 15, fontWeight: 900, fontFamily: FONT_NUM, color: T.gold },
                        children: [Math.round(i), '٪']
                      })
                    ]
                  }),
                  jsx('div', { style: { marginTop: 14 }, children: jsx(ProgressBar, { pct: i, color: T.gold, height: 9 }) }),
                  jsxs('div', {
                    style: { display: 'flex', justifyContent: 'space-between', marginTop: 8 },
                    children: [
                      jsxs('span', {
                        style: { fontSize: 11.5, fontFamily: FONT_NUM, color: T.textFaint },
                        children: [toFa(u), ' از ', toFa(n.target), ' ت']
                      }),
                      jsxs('span', {
                        style: { fontSize: 11.5, fontFamily: FONT_NUM, color: T.textFaint },
                        children: ['باقی‌مانده: ', toFa(c), ' ت']
                      })
                    ]
                  }),
                  jsx('div', {
                    style: { marginTop: 12 },
                    children: jsxs('button', {
                      type: 'button', onClick: function () { props.onContribute(n); }, className: 'wos-press',
                      style: {
                        width: '100%', padding: '10px 0', borderRadius: 12,
                        border: '1.5px solid ' + T.gold + '55', background: T.gold + '18',
                        color: T.gold, fontWeight: 800, fontSize: 12.5, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                      },
                      children: [jsx(Icon.Plus, { size: 14 }), ' واریز به این هدف']
                    })
                  })
                ]
              }, n.id);
            })
        })
      ]
    });
  }

  function ReportsPage(props) {
    var txs = props.txs || [];
    var catMap = props.catMap || {};

    var monthSeries = useMemo(function () {
      var now = new Date();
      var out = [];
      for (var i = 5; i >= 0; i--) {
        var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        var income = 0, expense = 0;
        txs.forEach(function (t) {
          if (ymKey(t.date) !== key) return;
          if (t.type === 'income') income += safeNum(t.amount);
          else expense += safeNum(t.amount);
        });
        out.push({
          label: formatJalali(d.toISOString(), { monthYear: true }).split(' ')[0],
          income: income,
          expense: expense
        });
      }
      return out;
    }, [txs]);

    var monthExpense = useMemo(function () {
      return txs.filter(function (t) { return t.type === 'expense' && isThisMonth(t.date); })
        .reduce(function (s, t) { return s + safeNum(t.amount); }, 0);
    }, [txs]);
    var monthIncome = useMemo(function () {
      return txs.filter(function (t) { return t.type === 'income' && isThisMonth(t.date); })
        .reduce(function (s, t) { return s + safeNum(t.amount); }, 0);
    }, [txs]);

    var byCat = useMemo(function () {
      var map = {};
      txs.forEach(function (t) {
        if (t.type !== 'expense' || !isThisMonth(t.date)) return;
        map[t.categoryId] = (map[t.categoryId] || 0) + safeNum(t.amount);
      });
      return Object.keys(map).map(function (id) {
        var c = catMap[id];
        return { id: id, name: (c && c.name) || 'نامشخص', color: (c && c.color) || T.textFaint, value: map[id] };
      }).sort(function (a, b) { return b.value - a.value; });
    }, [txs, catMap]);

    var top5 = useMemo(function () {
      return txs.filter(function (t) { return t.type === 'expense' && isThisMonth(t.date); })
        .slice().sort(function (a, b) { return safeNum(b.amount) - safeNum(a.amount); })
        .slice(0, 5);
    }, [txs]);

    var insights = useMemo(function () {
      var m = byCat[0];
      var day = new Date().getDate() || 1;
      var daily = monthExpense / day;
      var avgInc = monthSeries.filter(function (h) { return h.income > 0; });
      var p = avgInc.length ? avgInc.reduce(function (s, h) { return s + h.income; }, 0) / avgInc.length : 0;
      var save = monthIncome - monthExpense;
      var prev = monthSeries[monthSeries.length - 2];
      var prevNet = prev ? prev.income - prev.expense : 0;
      var better = save >= prevNet;
      var list = [];
      if (m) list.push({ icon: Icon.Flame, color: T.expense, text: 'پرهزینه‌ترین دسته این ماه: «' + m.name + '» با ' + toFa(m.value) + ' تومان' });
      if (top5[0]) list.push({ icon: Icon.TrendingDown, color: T.expense, text: 'بزرگ‌ترین هزینه: ' + toFa(top5[0].amount) + ' تومان (' + ((catMap[top5[0].categoryId] && catMap[top5[0].categoryId].name) || '—') + ')' });
      list.push({ icon: Icon.Dollar, color: T.income, text: 'میانگین هزینه روزانه: ' + toFa(Math.round(daily)) + ' تومان' });
      if (p > 0) list.push({ icon: Icon.TrendingUp, color: T.income, text: 'میانگین درآمد ماهانه (۶ ماه اخیر): ' + toFa(Math.round(p)) + ' تومان' });
      list.push({ icon: Icon.PiggyBank, color: save >= 0 ? T.income : T.expense, text: 'پس‌انداز این ماه: ' + (save >= 0 ? '+' : '−') + toFa(Math.abs(save)) + ' تومان' });
      list.push({ icon: better ? Icon.TrendingUp : Icon.TrendingDown, color: better ? T.income : T.expense, text: 'روند مالی نسبت به ماه قبل: ' + (better ? 'بهتر شده ✅' : 'ضعیف‌تر شده') });
      return list;
    }, [byCat, top5, monthExpense, monthIncome, monthSeries, catMap]);

    return jsxs('div', {
      children: [
        jsx(PageHeader, { title: 'گزارش‌ها', sub: 'تحلیل ۶ ماه اخیر' }),
        jsxs('div', {
          style: { padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 14 },
          children: [
            jsxs(Card, {
              style: { padding: '18px 14px 10px' },
              children: [
                jsxs('div', {
                  style: { display: 'flex', alignItems: 'center', gap: 8, paddingInline: 4, marginBottom: 6 },
                  children: [
                    jsx(Icon.BarChart, { size: 15, color: T.primaryLight }),
                    jsx('span', { style: { fontSize: 13.5, fontWeight: 800 }, children: 'درآمد و هزینه — ۶ ماه' })
                  ]
                }),
                jsx(BarChart, {
                  data: monthSeries,
                  bars: [
                    { key: 'income', color: T.income },
                    { key: 'expense', color: T.expense }
                  ],
                  height: 190
                }),
                jsxs('div', {
                  style: { display: 'flex', gap: 16, justifyContent: 'center', padding: '4px 0 8px', fontSize: 12 },
                  children: [
                    jsxs('span', { style: { color: T.income, fontWeight: 700 }, children: ['● ', 'درآمد'] }),
                    jsxs('span', { style: { color: T.expense, fontWeight: 700 }, children: ['● ', 'هزینه'] })
                  ]
                })
              ]
            }),

            jsxs(Card, {
              style: { padding: 18 },
              children: [
                jsxs('div', {
                  style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
                  children: [
                    jsx(Icon.Layers, { size: 15, color: T.primaryLight }),
                    jsx('span', { style: { fontSize: 13.5, fontWeight: 800 }, children: 'تفکیک هزینه این ماه' })
                  ]
                }),
                byCat.length === 0
                  ? jsx(EmptyState, { icon: Icon.Layers, text: 'هزینه‌ای در این ماه نیست' })
                  : jsxs(Fragment, {
                    children: [
                      jsx(Donut, { data: byCat, size: 150 }),
                      jsx('div', {
                        style: { marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 },
                        children: byCat.slice(0, 6).map(function (c) {
                          var pct = monthExpense ? Math.round(c.value / monthExpense * 100) : 0;
                          return jsxs('div', {
                            style: { display: 'flex', alignItems: 'center', gap: 10 },
                            children: [
                              jsx('span', { style: { width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 } }),
                              jsx('span', { style: { flex: 1, fontSize: 13, fontWeight: 600 }, children: c.name }),
                              jsxs('span', {
                                style: { fontFamily: FONT_NUM, fontSize: 12.5, color: T.textMuted, fontWeight: 700 },
                                children: [toFa(c.value), ' · ', pct, '٪']
                              })
                            ]
                          }, c.id);
                        })
                      })
                    ]
                  })
              ]
            }),

            jsxs(Card, {
              style: { padding: 18 },
              children: [
                jsxs('div', {
                  style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
                  children: [
                    jsx(Icon.Sparkles, { size: 15, color: T.gold }),
                    jsx('span', { style: { fontSize: 13.5, fontWeight: 800 }, children: 'بینش‌های هوشمند' })
                  ]
                }),
                jsx('div', {
                  style: { display: 'flex', flexDirection: 'column', gap: 10 },
                  children: insights.map(function (ins, i) {
                    return jsxs('div', {
                      style: {
                        display: 'flex', gap: 12, padding: '12px 12px',
                        background: T.surfaceRaised, borderRadius: 14, alignItems: 'flex-start'
                      },
                      children: [
                        jsx('div', {
                          style: {
                            width: 32, height: 32, borderRadius: 10, background: ins.color + '22',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          },
                          children: jsx(ins.icon, { size: 15, color: ins.color })
                        }),
                        jsx('div', { style: { fontSize: 12.5, lineHeight: 1.7, color: T.text, fontWeight: 600 }, children: ins.text })
                      ]
                    }, i);
                  })
                })
              ]
            }),

            top5.length ? jsxs(Card, {
              style: { padding: 18 },
              children: [
                jsxs('div', {
                  style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
                  children: [
                    jsx(Icon.Flame, { size: 15, color: T.expense }),
                    jsx('span', { style: { fontSize: 13.5, fontWeight: 800 }, children: '۵ هزینه برتر ماه' })
                  ]
                }),
                top5.map(function (t, i) {
                  var c = catMap[t.categoryId];
                  return jsxs('div', {
                    style: {
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0', borderBottom: i < top5.length - 1 ? '1px solid ' + T.border : 'none'
                    },
                    children: [
                      jsx(CatIcon, { icon: c && c.icon, color: c && c.color, size: 36 }),
                      jsxs('div', {
                        style: { flex: 1, minWidth: 0 },
                        children: [
                          jsx('div', {
                            style: { fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
                            children: t.description || (c && c.name) || 'هزینه'
                          }),
                          jsx('div', { style: { fontSize: 11, color: T.textFaint }, children: formatJalali(t.date, { short: true }) })
                        ]
                      }),
                      jsx('div', {
                        style: { fontFamily: FONT_NUM, fontWeight: 800, color: T.expense, fontSize: 14 },
                        children: toFa(t.amount)
                      })
                    ]
                  }, t.id);
                })
              ]
            }) : null
          ]
        })
      ]
    });
  }

  function CategoriesPage(props) {
    return jsxs('div', {
      children: [
        jsx(PageHeader, {
          title: 'دسته‌بندی‌ها',
          sub: toFa((props.categories || []).length) + ' دسته‌بندی',
          right: jsx('button', {
            type: 'button', onClick: props.onAdd, className: 'wos-press', 'aria-label': 'دسته جدید',
            style: {
              background: T.primary, border: 'none', borderRadius: 12, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            },
            children: jsx(Icon.Plus, { size: 19, color: '#0A0E1A' })
          })
        }),
        jsx('div', {
          style: { padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 8 },
          children: (props.categories || []).map(function (c) {
            return jsxs('button', {
              type: 'button', onClick: function () { props.onOpen(c); }, className: 'wos-press',
              style: {
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 14px',
                borderRadius: 16, background: T.surface, border: '1px solid ' + T.border,
                cursor: 'pointer', textAlign: 'right', width: '100%'
              },
              children: [
                jsx(CatIcon, { icon: c.icon, color: c.color, size: 42 }),
                jsx('span', { style: { flex: 1, fontSize: 14.5, fontWeight: 700, color: T.text }, children: c.name }),
                jsx(Icon.Chevron, { size: 16, color: T.textFaint })
              ]
            }, c.id);
          })
        })
      ]
    });
  }

  function SettingsPage(props) {
    var fileRef = useRef(null);
    function Row(p) {
      return jsxs('button', {
        type: 'button', onClick: p.onClick, className: 'wos-press',
        style: {
          width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '15px 14px',
          background: 'none', border: 'none', borderBottom: '1px solid ' + T.border,
          cursor: 'pointer', textAlign: 'right'
        },
        children: [
          jsx('div', {
            style: {
              width: 36, height: 36, borderRadius: 11,
              background: p.danger ? T.expenseDim : 'rgba(111,161,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            },
            children: jsx(p.icon, { size: 17, color: p.danger ? T.expense : T.primaryLight })
          }),
          jsxs('div', {
            style: { flex: 1 },
            children: [
              jsx('div', { style: { fontSize: 14, fontWeight: 700, color: p.danger ? T.expense : T.text }, children: p.label }),
              p.sub ? jsx('div', { style: { fontSize: 11.5, color: T.textFaint, marginTop: 1 }, children: p.sub }) : null
            ]
          }),
          jsx(Icon.ChevronLeft, { size: 16, color: T.textFaint })
        ]
      });
    }

    return jsxs('div', {
      children: [
        jsx(PageHeader, { title: 'تنظیمات' }),
        jsxs('div', {
          style: { padding: '0 20px 6px' },
          children: [
            jsx('div', { style: { fontSize: 12, fontWeight: 700, color: T.textFaint, marginBottom: 8, paddingRight: 4 }, children: 'داده‌ها' }),
            jsxs(Card, {
              style: { overflow: 'hidden', marginBottom: 18 },
              children: [
                jsx(Row, { icon: Icon.Download, label: 'پشتیبان‌گیری (Backup)', sub: 'خروجی JSON از تمام اطلاعات', onClick: props.onBackup }),
                jsx(Row, { icon: Icon.Upload, label: 'بازیابی (Restore)', sub: 'بازگردانی از فایل پشتیبان', onClick: function () { fileRef.current && fileRef.current.click(); } }),
                jsx(Row, { icon: Icon.Download, label: 'خروجی CSV تراکنش‌ها', sub: 'برای اکسل و گوگل‌شیت', onClick: props.onExportCsv }),
                jsx('input', {
                  ref: fileRef, type: 'file', accept: 'application/json,.json',
                  style: { display: 'none' },
                  onChange: function (e) {
                    if (e.target.files && e.target.files[0]) props.onRestore(e.target.files[0]);
                    e.target.value = '';
                  }
                })
              ]
            }),
            jsx('div', { style: { fontSize: 12, fontWeight: 700, color: T.textFaint, marginBottom: 8, paddingRight: 4 }, children: 'آمار' }),
            jsxs(Card, {
              style: { padding: 16, marginBottom: 18, display: 'flex', justifyContent: 'space-around', textAlign: 'center' },
              children: [
                jsxs('div', {
                  children: [
                    jsx('div', { style: { fontFamily: FONT_NUM, fontWeight: 800, fontSize: 18, color: T.text }, children: toFa(props.txCount) }),
                    jsx('div', { style: { fontSize: 11, color: T.textFaint, marginTop: 2 }, children: 'تراکنش' })
                  ]
                }),
                jsxs('div', {
                  children: [
                    jsx('div', { style: { fontFamily: FONT_NUM, fontWeight: 800, fontSize: 18, color: T.text }, children: toFa(props.categoryCount) }),
                    jsx('div', { style: { fontSize: 11, color: T.textFaint, marginTop: 2 }, children: 'دسته‌بندی' })
                  ]
                }),
                jsxs('div', {
                  children: [
                    jsx('div', { style: { fontFamily: FONT_NUM, fontWeight: 800, fontSize: 18, color: T.text }, children: toFa(props.tagCount) }),
                    jsx('div', { style: { fontSize: 11, color: T.textFaint, marginTop: 2 }, children: 'برچسب' })
                  ]
                })
              ]
            }),
            jsx('div', { style: { fontSize: 12, fontWeight: 700, color: T.textFaint, marginBottom: 8, paddingRight: 4 }, children: 'خطرناک' }),
            jsx(Card, {
              style: { overflow: 'hidden', marginBottom: 18, borderColor: T.expense + '33' },
              children: jsx(Row, {
                icon: Icon.AlertTriangle, label: 'ریست کامل اطلاعات',
                sub: 'حذف همه‌چیز و شروع دوباره', onClick: props.onReset, danger: true
              })
            }),
            jsxs('div', {
              style: { textAlign: 'center', color: T.textFaint, fontSize: 11.5, marginBottom: 100, lineHeight: 1.8 },
              children: [
                'WalletOS v3 · تمام داده‌ها فقط روی همین دستگاه ذخیره می‌شود',
                jsx('br', {}),
                window.WOS && window.WOS.persistent === true ? 'حافظه ماندگار فعال است ✓' :
                  window.WOS && window.WOS.persistent === false ? 'حافظه ماندگار فعال نیست' : ''
              ]
            })
          ]
        })
      ]
    });
  }

  function BottomNav(props) {
    return jsx('div', {
      style: {
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none'
      },
      children: jsx('nav', {
        style: {
          pointerEvents: 'auto', width: '100%', maxWidth: 480, margin: '0 auto',
          background: 'rgba(12,15,28,0.88)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          borderTop: '1px solid ' + T.border,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          padding: '10px 6px calc(10px + env(safe-area-inset-bottom))'
        },
        children: TABS.map(function (u) {
          if (u.k === 'fab') {
            return jsx('button', {
              type: 'button', onClick: props.onFab, className: 'wos-press', 'aria-label': 'تراکنش جدید',
              style: {
                width: 54, height: 54, borderRadius: 18, marginTop: -26, border: 'none',
                background: 'linear-gradient(140deg, ' + T.primaryLight + ', ' + T.primary + ')',
                boxShadow: '0 8px 22px -4px ' + T.primaryGlow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              },
              children: jsx(Icon.Plus, { size: 26, color: '#fff', strokeWidth: 2.6 })
            }, 'fab');
          }
          var active = u.k === 'more' ? props.moreOpen : props.tab === u.k && !props.moreOpen;
          return jsxs('button', {
            type: 'button',
            onClick: function () {
              if (u.k === 'more') props.setMoreOpen(true);
              else { props.setMoreOpen(false); props.setTab(u.k); }
            },
            className: 'wos-press',
            style: {
              background: 'none', border: 'none', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, cursor: 'pointer', width: 58, padding: '4px 0'
            },
            children: [
              jsx(u.Icon, { size: 21, color: active ? T.primaryLight : T.textFaint, strokeWidth: active ? 2.4 : 2 }),
              jsx('span', {
                style: { fontSize: 10, fontWeight: active ? 800 : 600, color: active ? T.primaryLight : T.textFaint },
                children: u.label
              })
            ]
          }, u.k);
        })
      })
    });
  }

  function MoreSheet(props) {
    var items = [
      { k: 'goals', label: 'اهداف مالی', Icon: Icon.Target, color: T.gold },
      { k: 'reports', label: 'گزارش‌ها', Icon: Icon.BarChart, color: T.primaryLight },
      { k: 'categories', label: 'دسته‌بندی‌ها', Icon: Icon.Layers, color: '#A78BFA' },
      { k: 'settings', label: 'تنظیمات', Icon: Icon.Settings, color: T.textMuted }
    ];
    return jsx(Sheet, {
      open: props.open, onClose: props.onClose, title: 'بیشتر',
      children: jsx('div', {
        style: { display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 10 },
        children: items.map(function (u) {
          return jsxs('button', {
            type: 'button',
            onClick: function () { props.setTab(u.k); props.setMoreOpen(false); },
            className: 'wos-press',
            style: {
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px',
              borderRadius: 16, background: T.surfaceRaised, border: 'none', cursor: 'pointer'
            },
            children: [
              jsx('div', {
                style: {
                  width: 38, height: 38, borderRadius: 13, background: u.color + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                },
                children: jsx(u.Icon, { size: 19, color: u.color, strokeWidth: 2.2 })
              }),
              jsx('span', { style: { fontSize: 14.5, fontWeight: 700, color: T.text }, children: u.label }),
              jsx(Icon.Chevron, { size: 16, color: T.textFaint, style: { marginRight: 'auto' } })
            ]
          }, u.k);
        })
      })
    });
  }

  /* ─── Finance helpers ─── */
  function sortTxDesc(a, b) {
    var da = new Date(a.date).getTime();
    var db = new Date(b.date).getTime();
    if (db !== da) return db - da;
    return (b.createdAt || 0) - (a.createdAt || 0);
  }
  function sortTxAsc(a, b) {
    var da = new Date(a.date).getTime();
    var db = new Date(b.date).getTime();
    if (da !== db) return da - db;
    return (a.createdAt || 0) - (b.createdAt || 0);
  }
  function deltaFor(tx) {
    var amt = safeNum(tx.amount);
    return tx.type === 'income' ? amt : -amt;
  }

  /* ─── Root App ─── */
  function App() {
    var dbRef = useRef(null);
    var loadingSt = useState(true);
    var loading = loadingSt[0], setLoading = loadingSt[1];
    var loadErrorSt = useState(null);
    var loadError = loadErrorSt[0], setLoadError = loadErrorSt[1];
    var balancesSt = useState(null);
    var balances = balancesSt[0], setBalances = balancesSt[1];
    var txsSt = useState([]);
    var txs = txsSt[0], setTxs = txsSt[1];
    var catsSt = useState([]);
    var cats = catsSt[0], setCats = catsSt[1];
    var tagsSt = useState([]);
    var tags = tagsSt[0], setTags = tagsSt[1];
    var budgetsSt = useState([]);
    var budgets = budgetsSt[0], setBudgets = budgetsSt[1];
    var goalsSt = useState([]);
    var goals = goalsSt[0], setGoals = goalsSt[1];
    var tabSt = useState('dashboard');
    var tab = tabSt[0], setTab = tabSt[1];
    var moreSt = useState(false);
    var moreOpen = moreSt[0], setMoreOpen = moreSt[1];
    var txModalSt = useState(null);
    var txModal = txModalSt[0], setTxModal = txModalSt[1];
    var budgetModalSt = useState(null);
    var budgetModal = budgetModalSt[0], setBudgetModal = budgetModalSt[1];
    var goalModalSt = useState(null);
    var goalModal = goalModalSt[0], setGoalModal = goalModalSt[1];
    var contribSt = useState(null);
    var contrib = contribSt[0], setContrib = contribSt[1];
    var catModalSt = useState(null);
    var catModal = catModalSt[0], setCatModal = catModalSt[1];
    var confirmSt = useState(null);
    var confirm = confirmSt[0], setConfirm = confirmSt[1];
    var toastSt = useState(null);
    var toast = toastSt[0], setToast = toastSt[1];
    var toastTimer = useRef(null);

    var showToast = useCallback(function (msg) {
      setToast(msg);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(function () { setToast(null); }, 2200);
    }, []);

    useEffect(function () {
      var cancelled = false;
      (async function () {
        try {
          var db = await openDB();
          if (cancelled) return;
          dbRef.current = db;
          var results = await Promise.all(STORES.map(function (s) { return idbGetAll(db, s); }));
          var meta = results[0], H = results[1], N = results[2], P = results[3], lt = results[4], J = results[5];
          var gt = meta.find(function (z) { return z.id === 'balances'; });
          if (gt) {
            setBalances({ cash: safeNum(gt.cash), bank: safeNum(gt.bank) });
          }
          setTxs((H || []).slice().sort(sortTxDesc));
          if (N && N.length) setCats(N);
          else {
            setCats(DEFAULT_CATEGORIES);
            await idbPutMany(db, 'categories', DEFAULT_CATEGORIES);
          }
          if (P && P.length) setTags(P);
          else {
            var seed = DEFAULT_TAG_NAMES.map(function (n) { return { id: uid(), name: n }; });
            setTags(seed);
            await idbPutMany(db, 'tags', seed);
          }
          setBudgets(lt || []);
          setGoals(J || []);
          setLoading(false);
        } catch (err) {
          console.error('[WOS] load failed', err);
          if (!cancelled) {
            setLoadError((err && err.message) || 'خطا در بارگذاری داده');
            setLoading(false);
          }
        }
      })();
      return function () { cancelled = true; };
    }, []);

    var catMap = useMemo(function () {
      var m = {};
      (cats || []).forEach(function (c) { m[c.id] = c; });
      return m;
    }, [cats]);

    var persistBalances = useCallback(function (next) {
      var db = dbRef.current;
      if (!db) return;
      idbPut(db, 'meta', { id: 'balances', cash: safeNum(next.cash), bank: safeNum(next.bank) }).catch(function (e) {
        console.warn('[WOS] balance save failed', e);
      });
    }, []);

    var setOnboarding = useCallback(async function (cash, bank) {
      var next = { cash: safeNum(cash), bank: safeNum(bank) };
      setBalances(next);
      var db = dbRef.current;
      if (db) await idbPut(db, 'meta', { id: 'balances', cash: next.cash, bank: next.bank });
    }, []);

    /** Apply wallet delta atomically against latest state */
    var applyDelta = useCallback(function (wallet, delta) {
      setBalances(function (prev) {
        if (!prev) return prev;
        var next = {
          cash: safeNum(prev.cash),
          bank: safeNum(prev.bank)
        };
        next[wallet] = safeNum(next[wallet]) + safeNum(delta);
        persistBalances(next);
        return next;
      });
    }, [persistBalances]);

    var saveTx = useCallback(async function (T0) {
      var db = dbRef.current;
      var existing = txs.find(function (n) { return n.id === T0.id; });
      if (existing) {
        // reverse old, apply new
        applyDelta(existing.wallet, -deltaFor(existing));
        applyDelta(T0.wallet, deltaFor(T0));
        setTxs(function (list) {
          return list.map(function (j) { return j.id === T0.id ? T0 : j; }).sort(sortTxDesc);
        });
      } else {
        applyDelta(T0.wallet, deltaFor(T0));
        setTxs(function (list) { return [T0].concat(list).sort(sortTxDesc); });
      }
      if (db) await idbPut(db, 'transactions', T0);
      setTxModal(null);
      showToast(existing ? 'تراکنش ویرایش شد' : 'تراکنش ثبت شد ✅');
    }, [txs, applyDelta, showToast]);

    var deleteTx = useCallback(async function (id) {
      var R = txs.find(function (n) { return n.id === id; });
      if (!R) return;
      applyDelta(R.wallet, -deltaFor(R));
      setTxs(function (n) { return n.filter(function (p) { return p.id !== id; }); });
      if (dbRef.current) await idbDelete(dbRef.current, 'transactions', id);
      setTxModal(null);
      showToast('تراکنش حذف شد');
    }, [txs, applyDelta, showToast]);

    var addTag = useCallback(function (name) {
      var existing = tags.find(function (t) { return t.name === name; });
      if (existing) return existing;
      var R = { id: uid(), name: name };
      setTags(function (h) { return h.concat([R]); });
      if (dbRef.current) idbPut(dbRef.current, 'tags', R);
      return R;
    }, [tags]);

    var saveBudget = useCallback(async function (T0) {
      setBudgets(function (R) {
        return R.find(function (h) { return h.id === T0.id; })
          ? R.map(function (h) { return h.id === T0.id ? T0 : h; })
          : R.concat([T0]);
      });
      if (dbRef.current) await idbPut(dbRef.current, 'budgets', T0);
      setBudgetModal(null);
      showToast('بودجه ذخیره شد ✅');
    }, [showToast]);

    var deleteBudget = useCallback(async function (id) {
      setBudgets(function (R) { return R.filter(function (h) { return h.id !== id; }); });
      if (dbRef.current) await idbDelete(dbRef.current, 'budgets', id);
      setBudgetModal(null);
      showToast('بودجه حذف شد');
    }, [showToast]);

    var saveGoal = useCallback(async function (T0) {
      setGoals(function (R) {
        return R.find(function (h) { return h.id === T0.id; })
          ? R.map(function (h) { return h.id === T0.id ? T0 : h; })
          : R.concat([T0]);
      });
      if (dbRef.current) await idbPut(dbRef.current, 'goals', T0);
      setGoalModal(null);
      showToast('هدف ذخیره شد ✅');
    }, [showToast]);

    var deleteGoal = useCallback(async function (id) {
      setGoals(function (R) { return R.filter(function (h) { return h.id !== id; }); });
      if (dbRef.current) await idbDelete(dbRef.current, 'goals', id);
      setGoalModal(null);
      showToast('هدف حذف شد');
    }, [showToast]);

    var contribute = useCallback(async function (goal, amount) {
      var H = Object.assign({}, goal, {
        contributions: (goal.contributions || []).concat([{
          id: uid(), amount: safeNum(amount), date: new Date().toISOString()
        }])
      });
      setGoals(function (N) { return N.map(function (p) { return p.id === goal.id ? H : p; }); });
      if (dbRef.current) await idbPut(dbRef.current, 'goals', H);
      setContrib(null);
      showToast('به هدفت واریز شد 🎯');
    }, [showToast]);

    var saveCat = useCallback(async function (T0) {
      setCats(function (R) {
        return R.find(function (h) { return h.id === T0.id; })
          ? R.map(function (h) { return h.id === T0.id ? T0 : h; })
          : R.concat([T0]);
      });
      if (dbRef.current) await idbPut(dbRef.current, 'categories', T0);
      setCatModal(null);
      showToast('دسته‌بندی ذخیره شد ✅');
    }, [showToast]);

    var deleteCat = useCallback(async function (id) {
      setCats(function (R) { return R.filter(function (h) { return h.id !== id; }); });
      if (dbRef.current) await idbDelete(dbRef.current, 'categories', id);
      setCatModal(null);
      showToast('دسته‌بندی حذف شد');
    }, [showToast]);

    var doBackup = useCallback(function () {
      var payload = {
        balances: balances,
        transactions: txs,
        categories: cats,
        tags: tags,
        budgets: budgets,
        goals: goals,
        exportedAt: new Date().toISOString(),
        app: 'WalletOS',
        version: 3
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'walletos-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      showToast('فایل پشتیبان دانلود شد');
    }, [balances, txs, cats, tags, budgets, goals, showToast]);

    var doExportCsv = useCallback(function () {
      var header = 'date,type,amount,wallet,category,description,tags\n';
      var rows = txs.slice().sort(sortTxAsc).map(function (t) {
        var c = catMap[t.categoryId];
        var tagNames = (t.tags || []).map(function (id) {
          var tg = tags.find(function (x) { return x.id === id; });
          return tg ? tg.name : id;
        }).join('|');
        function esc(s) {
          s = String(s == null ? '' : s);
          if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
          return s;
        }
        return [
          dateInputValue(t.date),
          t.type,
          safeNum(t.amount),
          t.wallet,
          esc(c && c.name),
          esc(t.description),
          esc(tagNames)
        ].join(',');
      }).join('\n');
      var blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'walletos-transactions-' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      showToast('CSV دانلود شد');
    }, [txs, catMap, tags, showToast]);

    var doRestore = useCallback(function (file) {
      var reader = new FileReader();
      reader.onload = async function (H) {
        try {
          var N = JSON.parse(H.target.result);
          if (!N || typeof N !== 'object') throw new Error('invalid');
          if (!N.balances || typeof N.balances !== 'object') throw new Error('invalid balances');
          if (!Array.isArray(N.transactions)) throw new Error('invalid transactions');
          var bal = {
            cash: safeNum(N.balances.cash),
            bank: safeNum(N.balances.bank)
          };
          var db = dbRef.current;
          if (!db) throw new Error('no db');
          await idbClearAll(db);
          await idbPut(db, 'meta', { id: 'balances', cash: bal.cash, bank: bal.bank });
          var catsIn = (N.categories && N.categories.length) ? N.categories : DEFAULT_CATEGORIES;
          var tagsIn = (N.tags && N.tags.length) ? N.tags : DEFAULT_TAG_NAMES.map(function (n) { return { id: uid(), name: n }; });
          await idbPutMany(db, 'transactions', N.transactions);
          await idbPutMany(db, 'categories', catsIn);
          await idbPutMany(db, 'tags', tagsIn);
          await idbPutMany(db, 'budgets', N.budgets || []);
          await idbPutMany(db, 'goals', N.goals || []);
          setBalances(bal);
          setTxs(N.transactions.slice().sort(sortTxDesc));
          setCats(catsIn);
          setTags(tagsIn);
          setBudgets(N.budgets || []);
          setGoals(N.goals || []);
          showToast('بازیابی با موفقیت انجام شد ✅');
        } catch (err) {
          console.warn('[WOS] restore failed', err);
          showToast('فایل پشتیبان معتبر نیست ❌');
        }
      };
      reader.readAsText(file);
    }, [showToast]);

    var doReset = useCallback(function () {
      setConfirm({
        title: 'ریست کامل اطلاعات',
        sub: 'همه‌ی تراکنش‌ها، بودجه‌ها، اهداف و موجودی حذف می‌شود. این کار قابل بازگشت نیست.',
        danger: true,
        onConfirm: async function () {
          var db = dbRef.current;
          if (db) {
            await idbClearAll(db);
            await idbPutMany(db, 'categories', DEFAULT_CATEGORIES);
            var seed = DEFAULT_TAG_NAMES.map(function (n) { return { id: uid(), name: n }; });
            await idbPutMany(db, 'tags', seed);
            setTags(seed);
          }
          setBalances(null);
          setTxs([]);
          setCats(DEFAULT_CATEGORIES);
          setBudgets([]);
          setGoals([]);
          setConfirm(null);
          setTab('dashboard');
          showToast('اطلاعات پاک شد');
        }
      });
    }, [showToast]);

    var monthIncome = useMemo(function () {
      return txs.filter(function (t) { return t.type === 'income' && isThisMonth(t.date); })
        .reduce(function (s, t) { return s + safeNum(t.amount); }, 0);
    }, [txs]);
    var monthExpense = useMemo(function () {
      return txs.filter(function (t) { return t.type === 'expense' && isThisMonth(t.date); })
        .reduce(function (s, t) { return s + safeNum(t.amount); }, 0);
    }, [txs]);

    /** Running balance per tx — derived from opening balance (balances − net of all txs) */
    var txsWithBalance = useMemo(function () {
      if (!balances) return [];
      var total = safeNum(balances.cash) + safeNum(balances.bank);
      var netAll = txs.reduce(function (s, t) { return s + deltaFor(t); }, 0);
      var opening = total - netAll;
      var asc = txs.slice().sort(sortTxAsc);
      var run = opening;
      var map = {};
      asc.forEach(function (t) {
        run += deltaFor(t);
        map[t.id] = run;
      });
      return txs.map(function (t) {
        return Object.assign({}, t, { runningBalance: map[t.id] });
      });
    }, [txs, balances]);

    var trendData = useMemo(function () {
      if (!balances) return [];
      var total = safeNum(balances.cash) + safeNum(balances.bank);
      var netAll = txs.reduce(function (s, t) { return s + deltaFor(t); }, 0);
      var opening = total - netAll;
      var asc = txs.slice().sort(sortTxAsc);
      var now = new Date();
      var out = [];
      var run = opening;
      var gi = 0;
      for (var z = 13; z >= 0; z--) {
        var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - z, 23, 59, 59, 999);
        while (gi < asc.length && new Date(asc[gi].date) <= day) {
          run += deltaFor(asc[gi]);
          gi++;
        }
        out.push({
          label: formatJalali(day.toISOString(), { short: true }),
          balance: run
        });
      }
      return out;
    }, [txs, balances]);

    if (loading) {
      return jsxs('div', {
        style: {
          minHeight: '100vh', background: T.bgGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14
        },
        children: [
          jsx(GlobalStyles, {}),
          jsx('div', {
            style: { animation: 'wosPulse 1.4s ease-in-out infinite' },
            children: jsx(Icon.Wallet, { size: 40, color: T.primary })
          }),
          jsx('div', { style: { color: T.textFaint, fontSize: 13, fontFamily: FONT }, children: 'در حال بارگذاری…' })
        ]
      });
    }

    if (loadError) {
      return jsxs('div', {
        style: {
          minHeight: '100vh', background: T.bgGrad, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: FONT
        },
        children: [
          jsx(GlobalStyles, {}),
          jsxs(Card, {
            style: { padding: 24, maxWidth: 380, width: '100%', textAlign: 'center' },
            children: [
              jsx('div', { style: { fontSize: 17, fontWeight: 800, marginBottom: 8 }, children: 'بارگذاری ناموفق بود' }),
              jsx('div', { style: { fontSize: 13, color: T.textMuted, lineHeight: 1.8, marginBottom: 18 }, children: loadError }),
              jsx(Btn, { onClick: function () { location.reload(); }, children: 'تلاش دوباره' })
            ]
          })
        ]
      });
    }

    if (!balances) {
      return jsxs(Fragment, {
        children: [jsx(GlobalStyles, {}), jsx(Onboarding, { onDone: setOnboarding })]
      });
    }

    function openAdd(type) { setTxModal({ mode: 'add', type: type || 'expense' }); }
    function openEdit(tx) { setTxModal({ mode: 'edit', tx: tx }); }

    return jsxs('div', {
      dir: 'rtl', lang: 'fa',
      style: { minHeight: '100vh', background: T.bgGrad, fontFamily: FONT, color: T.text },
      children: [
        jsx(GlobalStyles, {}),
        jsxs('div', {
          style: { maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh' },
          children: [
            tab === 'dashboard' ? jsx(Dashboard, {
              balances: balances, txs: txsWithBalance, rawTxs: txs, categories: cats, catMap: catMap,
              monthIncome: monthIncome, monthExpense: monthExpense,
              budgets: budgets, goals: goals, trendData: trendData,
              onOpenTx: openEdit, onQuickAdd: openAdd
            }) : null,
            tab === 'transactions' ? jsx(TransactionsPage, {
              allTxsWithBalance: txsWithBalance, categories: cats, catMap: catMap, onOpenTx: openEdit
            }) : null,
            tab === 'budgets' ? jsx(BudgetsPage, {
              budgets: budgets, txs: txs, catMap: catMap,
              onOpen: function (b) { setBudgetModal({ mode: 'edit', budget: b }); },
              onAdd: function () { setBudgetModal({ mode: 'add' }); }
            }) : null,
            tab === 'goals' ? jsx(GoalsPage, {
              goals: goals,
              onOpen: function (g) { setGoalModal({ mode: 'edit', goal: g }); },
              onAdd: function () { setGoalModal({ mode: 'add' }); },
              onContribute: function (g) { setContrib(g); }
            }) : null,
            tab === 'reports' ? jsx(ReportsPage, { txs: txs, categories: cats, catMap: catMap }) : null,
            tab === 'categories' ? jsx(CategoriesPage, {
              categories: cats,
              onOpen: function (c) { setCatModal({ mode: 'edit', category: c }); },
              onAdd: function () { setCatModal({ mode: 'add' }); }
            }) : null,
            tab === 'settings' ? jsx(SettingsPage, {
              onBackup: doBackup, onRestore: doRestore, onReset: doReset, onExportCsv: doExportCsv,
              tagCount: tags.length, categoryCount: cats.length, txCount: txs.length
            }) : null,

            jsx(BottomNav, {
              tab: tab, setTab: setTab,
              onFab: function () { openAdd('expense'); },
              moreOpen: moreOpen, setMoreOpen: setMoreOpen
            }),
            jsx(MoreSheet, {
              open: moreOpen, onClose: function () { setMoreOpen(false); },
              setTab: setTab, setMoreOpen: setMoreOpen
            }),

            jsx(Sheet, {
              open: !!txModal,
              onClose: function () { setTxModal(null); },
              title: txModal && txModal.mode === 'edit' ? 'ویرایش تراکنش' : 'تراکنش جدید',
              children: txModal ? jsx(TxForm, {
                initial: txModal.mode === 'edit' ? txModal.tx : { type: txModal.type },
                categories: cats, tags: tags, onAddTag: addTag, onSubmit: saveTx,
                onDelete: function (id) {
                  setConfirm({
                    title: 'حذف تراکنش؟',
                    sub: 'موجودی مربوطه به‌روزرسانی می‌شود.',
                    danger: true,
                    onConfirm: function () { deleteTx(id); setConfirm(null); }
                  });
                }
              }) : null
            }),

            jsx(Sheet, {
              open: !!budgetModal,
              onClose: function () { setBudgetModal(null); },
              title: budgetModal && budgetModal.mode === 'edit' ? 'ویرایش بودجه' : 'بودجه جدید',
              children: budgetModal ? jsx(BudgetForm, {
                initial: budgetModal.mode === 'edit' ? budgetModal.budget : null,
                categories: cats, budgets: budgets, onSubmit: saveBudget,
                onDelete: function (id) {
                  setConfirm({
                    title: 'حذف بودجه؟', danger: true,
                    onConfirm: function () { deleteBudget(id); setConfirm(null); }
                  });
                }
              }) : null
            }),

            jsx(Sheet, {
              open: !!goalModal,
              onClose: function () { setGoalModal(null); },
              title: goalModal && goalModal.mode === 'edit' ? 'ویرایش هدف' : 'هدف جدید',
              children: goalModal ? jsx(GoalForm, {
                initial: goalModal.mode === 'edit' ? goalModal.goal : null,
                onSubmit: saveGoal,
                onDelete: function (id) {
                  setConfirm({
                    title: 'حذف هدف؟', danger: true,
                    onConfirm: function () { deleteGoal(id); setConfirm(null); }
                  });
                }
              }) : null
            }),

            jsx(Sheet, {
              open: !!contrib,
              onClose: function () { setContrib(null); },
              title: 'واریز به هدف',
              children: contrib ? jsx(ContributeForm, {
                goal: contrib,
                onSubmit: function (amt) { contribute(contrib, amt); }
              }) : null
            }),

            jsx(Sheet, {
              open: !!catModal,
              onClose: function () { setCatModal(null); },
              title: catModal && catModal.mode === 'edit' ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید',
              children: catModal ? jsx(CategoryForm, {
                initial: catModal.mode === 'edit' ? catModal.category : null,
                onSubmit: saveCat,
                onDelete: function (id) {
                  setConfirm({
                    title: 'حذف دسته‌بندی؟',
                    sub: 'تراکنش‌های مرتبط حذف نمی‌شوند اما بدون دسته می‌مانند.',
                    danger: true,
                    onConfirm: function () { deleteCat(id); setConfirm(null); }
                  });
                }
              }) : null
            }),

            jsx(Confirm, {
              open: !!confirm,
              title: confirm && confirm.title,
              sub: confirm && confirm.sub,
              danger: confirm && confirm.danger,
              onConfirm: confirm && confirm.onConfirm,
              onCancel: function () { setConfirm(null); }
            }),
            jsx(Toast, { toast: toast })
          ]
        })
      ]
    });
  }

  /* ─── Mount ─── */
  var rootEl = document.getElementById('root');
  if (rootEl) {
    Sy.createRoot(rootEl).render(jsx(App, {}));
  }

  // Bump public version
  if (window.WOS) window.WOS.version = '3.0.0';
})();
