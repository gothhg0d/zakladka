'use strict';
(() => {

/* ——————————————————— утилиты ——————————————————— */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'style') n.style.cssText = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : String(c));
  return n;
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });
const plural = (n, f) => { const a = Math.abs(n) % 100, b = a % 10; return f[a > 10 && a < 20 ? 2 : b > 1 && b < 5 ? 1 : b === 1 ? 0 : 2]; };
const IMG_RE = /\.(jpe?g|png|gif|webp|avif|bmp|jfif)$/i;
const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', jfif: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', bmp: 'image/bmp', svg: 'image/svg+xml' };
const extOf = n => (String(n).match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();
const nameOf = n => String(n).replace(/^.*[\\/]/, '').replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();

const store = {
  get(k, d) { try { const v = localStorage.getItem('zk:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('zk:' + k, JSON.stringify(v)); } catch { /* приватный режим */ } },
};

const ICON = {
  soundOn: '<svg class="i" viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>',
  soundOff: '<svg class="i" viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="m16 10 4 4M20 10l-4 4"/></svg>',
  moon: '<svg class="i" viewBox="0 0 24 24"><path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1z"/></svg>',
  sun: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.8"/><path d="M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.6 5.6l1.3 1.3M17.1 17.1l1.3 1.3M5.6 18.4l1.3-1.3M17.1 6.9l1.3-1.3"/></svg>',
  trash: '<svg class="i" viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
  plus: '<svg class="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  arrow: '<svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  x: '<svg class="i" viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  play: '<svg class="i" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pause: '<svg class="i" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14" stroke-width="3"/></svg>',
  prev: '<svg class="i" viewBox="0 0 24 24"><path d="M18 6 10 12l8 6zM6 6v12"/></svg>',
  next: '<svg class="i" viewBox="0 0 24 24"><path d="m6 6 8 6-8 6zM18 6v12"/></svg>',
  close: '<svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  down: '<svg class="i" viewBox="0 0 24 24" style="width:17px;height:17px"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/></svg>',
};

// версия сборки из ссылки на app.js — ей же помечаем hero3d.js, чтобы кэш не отдавал старое
const VER = (document.currentScript?.src.match(/[?&]v=(\d+)/) || [])[1] || '';
const LIB = {
  zip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
};
const loaded = new Map();
function once(src) { if (!loaded.has(src)) loaded.set(src, loadScript(src).catch(e => { loaded.delete(src); throw e; })); return loaded.get(src); }
// JSZip нужен только для EPUB/CBZ/архивов — грузим при первой встрече с ними
const needZip = () => (window.JSZip ? Promise.resolve() : once(LIB.zip));
const fontLinks = new Set();
function needFont(name) {
  if (name !== 'literata' || fontLinks.has(name)) return;
  fontLinks.add(name);
  document.head.append(el('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&display=swap' }));
}
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('не удалось загрузить библиотеку'));
    document.head.append(s);
  });
}

/* ——————————————————— звук ——————————————————— */
const Sound = (() => {
  let ctx = null, master = null, noise = null, on = store.get('sound', true);
  function ready() {
    if (!on) return false;
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0.85; master.connect(ctx.destination);
        const len = Math.floor(ctx.sampleRate * 0.7);
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0); let last = 0;
        for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.035 * w) / 1.035; d[i] = last * 3 + w * 0.22; }
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    } catch { return false; }
  }
  // шорох бумаги: отфильтрованный шум с движущейся полосой
  function rustle(t, dur, from, to, vol) {
    const src = ctx.createBufferSource(); src.buffer = noise; src.playbackRate.value = 0.85 + Math.random() * 0.3;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(from, t); bp.frequency.exponentialRampToValueAtTime(to, t + dur * 0.75);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 350;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.05, dur * 0.25)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(hp).connect(g).connect(master);
    src.start(t, Math.random() * 0.25); src.stop(t + dur + 0.05);
  }
  function tone(t, f, dur, vol, type = 'sine', glide) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.03);
  }
  const play = fn => () => { if (ready()) fn(ctx.currentTime); };
  let lastPage = 0;
  return {
    get on() { return on; },
    set(v) { on = v; store.set('sound', v); if (v) this.tap(); },
    tap: play(t => tone(t, 1480, 0.06, 0.02, 'sine', 1100)),
    page: play(t => { const n = performance.now(); if (n - lastPage < 90) return; lastPage = n; rustle(t, 0.34, 650, 3600, 0.075); rustle(t + 0.05, 0.16, 2400, 5200, 0.02); }),
    open: play(t => { rustle(t, 0.55, 380, 2800, 0.06); tone(t + 0.06, 392, 0.7, 0.022, 'triangle'); tone(t + 0.16, 587.33, 0.85, 0.018, 'triangle'); }),
    close: play(t => { rustle(t, 0.32, 2600, 520, 0.045); tone(t, 587.33, 0.4, 0.018, 'triangle'); tone(t + 0.09, 392, 0.55, 0.018, 'triangle'); }),
    add: play(t => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(t + i * 0.065, f, 0.42, 0.018))),
    mark: play(t => { tone(t, 740, 0.22, 0.026, 'sine', 1110); rustle(t, 0.14, 2600, 4800, 0.025); }),
    unmark: play(t => tone(t, 1110, 0.18, 0.02, 'sine', 700)),
    panel: play(t => rustle(t, 0.2, 1400, 3200, 0.03)),
    toggle: play(t => { tone(t, 880, 0.07, 0.02); tone(t + 0.05, 1320, 0.08, 0.016); }),
    error: play(t => { tone(t, 233, 0.14, 0.035, 'triangle'); tone(t + 0.15, 196, 0.2, 0.035, 'triangle'); }),
    // наведение: едва слышный «тик», не чаще раза в 60 мс
    hover: (() => { let last = 0; return play(t => { const n = performance.now(); if (n - last < 60) return; last = n; tone(t, 2600 + Math.random() * 300, 0.035, 0.006, 'sine'); }); })(),
    key: (() => { let last = 0; return play(t => { const n = performance.now(); if (n - last < 40) return; last = n; rustle(t, 0.04, 3000, 5200, 0.012); }); })(),
    step: v => { if (ready()) tone(ctx.currentTime, 520 + v * 700, 0.08, 0.02, 'sine'); },
    whoosh: play(t => rustle(t, 0.5, 300, 4200, 0.05)),
    swish: play(t => rustle(t, 0.28, 3800, 900, 0.035)),
    thud: play(t => { tone(t, 110, 0.25, 0.06, 'sine', 60); rustle(t, 0.18, 500, 1500, 0.04); }),
    crumple: play(t => { for (let i = 0; i < 4; i++) rustle(t + i * 0.045, 0.09, 900 + i * 500, 2200 + i * 600, 0.03); }),
    chime: play(t => [659.25, 987.77, 1318.5].forEach((f, i) => tone(t + i * 0.09, f, 0.6, 0.016, 'sine'))),
    grab: play(t => tone(t, 330, 0.12, 0.018, 'triangle', 440)),
    release: play(t => tone(t, 440, 0.16, 0.014, 'triangle', 300)),
  };
})();

/* ——————————————————— тосты ——————————————————— */
function toast(msg, kind = '', ms = 3600) {
  const t = el('div', { class: 'toast' + (kind ? ' ' + kind : '') }, el('span', { class: 'bar' }), el('span', {}, msg));
  $('#toasts').append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 340); }, ms);
}

/* ——————————————————— хранилище (IndexedDB) ——————————————————— */
const DB = (() => {
  const mem = { books: new Map(), files: new Map() };
  let dbp = null, persistent = false;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise(res => {
      try {
        const r = indexedDB.open('zakladka', 1);
        r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('books', { keyPath: 'id' }); d.createObjectStore('files'); };
        r.onsuccess = () => { persistent = true; res(r.result); };
        r.onerror = r.onblocked = () => res(null);
      } catch { res(null); }
    });
    return dbp;
  }
  async function run(name, mode, fn) {
    const d = await open(); if (!d) throw new Error('no-idb');
    return new Promise((res, rej) => {
      const tx = d.transaction(name, mode); const req = fn(tx.objectStore(name)); let out;
      if (req) req.onsuccess = () => { out = req.result; };
      tx.oncomplete = () => res(out); tx.onerror = tx.onabort = () => rej(tx.error);
    });
  }
  return {
    get persistent() { return persistent; },
    async books() { try { return (await run('books', 'readonly', s => s.getAll())) || []; } catch { return [...mem.books.values()]; } },
    // в память уходим только если IndexedDB нет совсем; ошибку квоты показываем человеку
    async putBook(b) { try { await run('books', 'readwrite', s => s.put(b)); } catch (e) { if (e.message !== 'no-idb') console.warn(e); mem.books.set(b.id, b); } },
    async putFile(id, blob) {
      try { await run('files', 'readwrite', s => s.put(blob, id)); }
      catch (e) { if (e.message === 'no-idb') { mem.files.set(id, blob); return; } throw new Error('в хранилище браузера не хватило места для этого файла'); }
    },
    async file(id) { try { const f = await run('files', 'readonly', s => s.get(id)); if (f) return f; } catch { /* нет IDB */ } return mem.files.get(id) || null; },
    async del(id) {
      mem.books.delete(id); mem.files.delete(id);
      try { await run('books', 'readwrite', s => s.delete(id)); await run('files', 'readwrite', s => s.delete(id)); } catch { /* нет IDB */ }
    },
  };
})();

/* ——————————————————— пути и zip ——————————————————— */
const dirname = p => p.includes('/') ? p.slice(0, p.lastIndexOf('/') + 1) : '';
function resolvePath(base, rel) {
  let r = rel; try { r = decodeURIComponent(rel); } catch { /* как есть */ }
  if (r.startsWith('/')) { base = ''; r = r.slice(1); }
  const out = [];
  for (const s of (base + r).split('/')) { if (s === '..') out.pop(); else if (s && s !== '.') out.push(s); }
  return out.join('/');
}
function zfile(zip, path) {
  if (!path) return null;
  let f = zip.file(path); if (f) return f;
  const low = path.toLowerCase();
  const k = Object.keys(zip.files).find(n => n.toLowerCase() === low);
  return k ? zip.file(k) : null;
}
async function ztext(zip, path) { const f = zfile(zip, path); if (!f) throw new Error('нет файла ' + path); return decodeBytes(await f.async('uint8array')); }
async function zblob(zip, path) {
  const f = zfile(zip, path); if (!f) return null;
  const b = await f.async('blob');
  return new Blob([b], { type: MIME[extOf(path)] || 'application/octet-stream' });
}
const xml = s => new DOMParser().parseFromString(s, 'application/xml');
const tag = (root, name) => root && (root.getElementsByTagName(name)[0] || root.getElementsByTagNameNS('*', name.replace(/^.*:/, ''))[0]);
const txt = n => (n?.textContent || '').replace(/\s+/g, ' ').trim();
const hrefOf = n => { if (!n) return ''; for (const a of Array.from(n.attributes)) if (/(^|:)href$/i.test(a.name)) return a.value; return ''; };

function decodeBytes(u8) {
  if (u8[0] === 0xFF && u8[1] === 0xFE) return new TextDecoder('utf-16le').decode(u8);
  if (u8[0] === 0xFE && u8[1] === 0xFF) return new TextDecoder('utf-16be').decode(u8);
  const head = new TextDecoder('latin1').decode(u8.subarray(0, 400));
  const m = head.match(/encoding\s*=\s*["']([\w.:-]+)["']/i) || head.match(/charset\s*=\s*["']?([\w.:-]+)/i);
  if (m && !/utf-?8/i.test(m[1])) { try { return new TextDecoder(m[1]).decode(u8); } catch { /* неизвестная кодировка */ } }
  try { return new TextDecoder('utf-8', { fatal: true }).decode(u8); } catch { return new TextDecoder('windows-1251').decode(u8); }
}

/* ——————————————————— очистка html ——————————————————— */
const BAD = 'script,style,link,meta,iframe,object,embed,form,input,button,textarea,select,noscript,base,frame,frameset,audio,video,source,track,head,title';
// из чужой разметки оставляем только свои классы, иначе стили книги смешаются со стилями сайта
const OWN_CLASSES = new Set(['poem', 'stanza', 'v', 'ta', 'el', 'epigraph', 'note', 'chap', 'lead', 'ch-title']);
function sanitize(root) {
  root.querySelectorAll(BAD).forEach(n => n.remove());
  for (const n of root.querySelectorAll('[class]')) {
    const keep = Array.from(n.classList).filter(c => OWN_CLASSES.has(c));
    if (keep.length) n.setAttribute('class', keep.join(' ')); else n.removeAttribute('class');
  }
  for (const n of root.querySelectorAll('*')) {
    for (const a of Array.from(n.attributes)) {
      const name = a.name.toLowerCase();
      if (name.startsWith('on') || name === 'style' || name === 'contenteditable' || name === 'tabindex' || name === 'width' || name === 'height' || name === 'align'
        || (/(^|:)(href|src)$/.test(name) && /^\s*(javascript|vbscript):/i.test(a.value))) n.removeAttribute(a.name);
    }
  }
  return root;
}
function htmlChapter(html) { const d = el('div', { class: 'chap' }); d.innerHTML = html; return sanitize(d); }

/* ——————————————————— обложки ——————————————————— */
// load надёжнее decode(): в фоновой вкладке decode() может не завершиться вовсе
function loadImg(src, img = new Image(), ms = 4000) {
  return new Promise((res, rej) => {
    const t = setTimeout(() => res(img), ms);
    img.onload = () => { clearTimeout(t); res(img); };
    img.onerror = () => { clearTimeout(t); rej(new Error('картинка не читается')); };
    img.src = src;
  });
}
async function thumb(src, w = 360) {
  let url;
  try {
    let img = src, iw, ih;
    if (src instanceof HTMLCanvasElement) { iw = src.width; ih = src.height; }
    else { url = URL.createObjectURL(src); img = await loadImg(url); iw = img.naturalWidth; ih = img.naturalHeight; }
    if (!iw || !ih) return null;
    const s = Math.min(1, w / iw);
    const c = document.createElement('canvas'); c.width = Math.round(iw * s); c.height = Math.round(ih * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(r, 'image/jpeg', 0.86));
  } catch { return null; } finally { if (url) URL.revokeObjectURL(url); }
}
const PALETTE = [['#5A3A22', '#F3E5D0'], ['#2B211A', '#E9D9C2'], ['#D9C6A6', '#2A1C10'], ['#7A4B2A', '#F7E9D6'], ['#3D2E22', '#EADBC6'], ['#B88B5A', '#24170C'], ['#4A2F2A', '#F1E0D6'], ['#A3977F', '#1E1810'], ['#1A1410', '#E7D6BF'], ['#6E5A3A', '#F5EBD9']];
function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const coverURLs = new Map();
function coverNode(b) {
  // обложка, которую нельзя скачать (нет CORS), показывается прямо по ссылке
  if (!b.cover && b.coverUrl) return el('img', { src: b.coverUrl, alt: '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
  if (b.cover) {
    let u = coverURLs.get(b.id);
    if (!u) { u = URL.createObjectURL(b.cover); coverURLs.set(b.id, u); }
    return el('img', { src: u, alt: '', loading: 'lazy', decoding: 'async' });
  }
  const [bg, ink] = PALETTE[hash(b.title + b.author) % PALETTE.length];
  return el('div', { class: 'gen', style: `--gc-bg:${bg};--gc-ink:${ink}` },
    el('div', {}, el('div', { class: 'gt' }, b.title), el('div', { class: 'gr' })),
    el('div', { class: 'ga' }, b.author || ({ cbz: 'Манга', pdf: 'PDF' }[b.fmt] || 'Без автора')));
}

/* ——————————————————— форматы: EPUB ——————————————————— */
async function epubOpen(blob) {
  await needZip();
  const zip = await JSZip.loadAsync(blob);
  const cont = xml(await ztext(zip, 'META-INF/container.xml'));
  const opfPath = tag(cont, 'rootfile')?.getAttribute('full-path');
  if (!opfPath) throw new Error('в EPUB нет описания книги');
  const opf = xml(await ztext(zip, opfPath));
  const base = dirname(opfPath);
  const manifest = new Map();
  for (const it of Array.from(opf.getElementsByTagNameNS('*', 'item'))) {
    manifest.set(it.getAttribute('id'), { id: it.getAttribute('id'), href: resolvePath(base, it.getAttribute('href') || ''), type: it.getAttribute('media-type') || '', props: it.getAttribute('properties') || '' });
  }
  const spineEl = opf.getElementsByTagNameNS('*', 'spine')[0];
  const spine = Array.from(opf.getElementsByTagNameNS('*', 'itemref')).map(r => manifest.get(r.getAttribute('idref'))).filter(it => it && /x?html|xml/i.test(it.type || 'html'));
  const title = txt(opf.getElementsByTagNameNS('*', 'title')[0]);
  const lang = txt(opf.getElementsByTagNameNS('*', 'language')[0]).slice(0, 5);
  const author = Array.from(opf.getElementsByTagNameNS('*', 'creator')).map(n => txt(n).replace(/^(автор|author)\s+/i, '')).filter(Boolean).slice(0, 2).join(', ');
  let cover = [...manifest.values()].find(i => /cover-image/.test(i.props));
  if (!cover) {
    const meta = Array.from(opf.getElementsByTagNameNS('*', 'meta')).find(m => m.getAttribute('name') === 'cover');
    if (meta) cover = manifest.get(meta.getAttribute('content'));
  }
  if (!cover || !/image/.test(cover.type)) cover = [...manifest.values()].find(i => /image/.test(i.type) && /cover/i.test(i.id + i.href));
  // оглавление: EPUB3 nav или NCX
  const toc = [];
  const nav = [...manifest.values()].find(i => /\bnav\b/.test(i.props));
  try {
    if (nav) {
      const d = new DOMParser().parseFromString(await ztext(zip, nav.href), 'application/xhtml+xml');
      const navs = Array.from(d.getElementsByTagNameNS('*', 'nav'));
      const tocNav = navs.find(n => /toc/.test(n.getAttribute('epub:type') || n.getAttributeNS('http://www.idpf.org/2007/ops', 'type') || '')) || navs[0];
      const walk = (ol, lvl) => {
        for (const li of Array.from(ol.children)) {
          const a = Array.from(li.children).find(c => c.localName === 'a' || c.localName === 'span');
          if (a && a.getAttribute('href')) toc.push({ title: txt(a), href: resolvePath(dirname(nav.href), a.getAttribute('href').split('#')[0]) + (a.getAttribute('href').includes('#') ? '#' + a.getAttribute('href').split('#')[1] : ''), lvl });
          const sub = Array.from(li.children).find(c => c.localName === 'ol');
          if (sub) walk(sub, lvl + 1);
        }
      };
      const ol = tocNav && Array.from(tocNav.getElementsByTagNameNS('*', 'ol'))[0];
      if (ol) walk(ol, 0);
    }
    if (!toc.length) {
      const ncxItem = manifest.get(spineEl?.getAttribute('toc')) || [...manifest.values()].find(i => /ncx/.test(i.type));
      if (ncxItem) {
        const ncx = xml(await ztext(zip, ncxItem.href));
        const walk = (parent, lvl) => {
          for (const np of Array.from(parent.children).filter(c => c.localName === 'navPoint')) {
            const src = tag(np, 'content')?.getAttribute('src') || '';
            const [p, frag] = src.split('#');
            toc.push({ title: txt(tag(np, 'text')), href: resolvePath(dirname(ncxItem.href), p) + (frag ? '#' + frag : ''), lvl });
            walk(np, lvl + 1);
          }
        };
        const map = ncx.getElementsByTagNameNS('*', 'navMap')[0];
        if (map) walk(map, 0);
      }
    }
  } catch (e) { console.warn('toc', e); }
  return { zip, spine, title, author, cover, toc, lang };
}

async function epubModel(blob) {
  const E = await epubOpen(blob);
  if (!E.spine.length) throw new Error('в EPUB нет глав');
  const urls = [];
  const raws = await Promise.all(E.spine.map(it => ztext(E.zip, it.href).catch(() => '')));
  const idx = new Map(E.spine.map((it, i) => [it.href.toLowerCase(), i]));
  const chIndex = path => idx.get(String(path).split('#')[0].toLowerCase());
  const toc = E.toc.map(t => ({ title: t.title || '—', ch: chIndex(t.href), anchor: t.href.split('#')[1] || '', lvl: Math.min(t.lvl, 2) })).filter(t => t.ch != null);
  const titles = E.spine.map(() => '');
  for (const t of toc) if (!titles[t.ch]) titles[t.ch] = t.title;
  for (let i = 1; i < titles.length; i++) if (!titles[i]) titles[i] = titles[i - 1];
  const chapters = E.spine.map((it, i) => ({
    title: titles[i] || E.title,
    weight: Math.max(400, raws[i].replace(/<[^>]+>/g, '').length),
    load: async () => {
      let doc = new DOMParser().parseFromString(raws[i], 'application/xhtml+xml');
      if (doc.getElementsByTagName('parsererror').length) doc = new DOMParser().parseFromString(raws[i], 'text/html');
      const body = doc.body || doc.getElementsByTagName('body')[0] || doc.documentElement;
      const box = el('div', { class: 'chap' });
      for (const n of Array.from(body.childNodes)) box.append(document.importNode(n, true));
      const base = dirname(it.href);
      const fileURL = async src => {
        if (!src || /^(data|blob|https?):/i.test(src)) return src;
        const b = await zblob(E.zip, resolvePath(base, src.split('#')[0]));
        if (!b) return '';
        const u = URL.createObjectURL(b); urls.push(u); return u;
      };
      for (const img of box.querySelectorAll('img')) { const u = await fileURL(img.getAttribute('src')); if (u) img.setAttribute('src', u); else img.remove(); }
      for (const im of box.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'image')) {
        const u = await fileURL(hrefOf(im)); if (u) { im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', u); im.setAttribute('href', u); }
      }
      for (const a of box.querySelectorAll('a[href]')) {
        const h = a.getAttribute('href');
        if (/^(https?|mailto):/i.test(h)) { a.target = '_blank'; a.rel = 'noopener'; continue; }
        const [p, frag] = h.split('#');
        const path = p ? resolvePath(base, p) : it.href;
        const ch = chIndex(path);
        a.setAttribute('href', '#'); a.dataset.ch = ch ?? ''; a.dataset.frag = frag || '';
        const et = a.getAttribute('epub:type') || a.getAttributeNS('http://www.idpf.org/2007/ops', 'type') || '';
        if (/noteref/.test(et) || (a.textContent.trim().length <= 4 && (a.closest('sup') || /^\[?\*?\d*\]?$/.test(a.textContent.trim())))) a.classList.add('note');
      }
      return sanitize(box);
    },
  }));
  return { chapters, toc, cleanup() { urls.forEach(u => URL.revokeObjectURL(u)); } };
}

/* ——————————————————— форматы: FB2 ——————————————————— */
function fb2Parse(text) {
  let doc = xml(text);
  if (doc.getElementsByTagName('parsererror').length) {
    doc = xml(text.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);)/gi, '&amp;'));
    if (doc.getElementsByTagName('parsererror').length) throw new Error('файл FB2 повреждён');
  }
  const ti = tag(doc, 'title-info');
  const au = ti && tag(ti, 'author');
  const author = au ? [tag(au, 'first-name'), tag(au, 'middle-name'), tag(au, 'last-name')].map(txt).filter(Boolean).join(' ') || txt(tag(au, 'nickname')) : '';
  const binaries = new Map();
  for (const b of Array.from(doc.getElementsByTagName('binary'))) binaries.set(b.getAttribute('id'), { type: b.getAttribute('content-type') || 'image/jpeg', data: b.textContent });
  const cp = ti && tag(ti, 'coverpage');
  const coverId = cp ? hrefOf(tag(cp, 'image')).replace(/^#/, '') : '';
  return { doc, title: txt(ti && tag(ti, 'book-title')), author, binaries, coverId };
}
function b64blob(b) {
  const bin = atob(b.data.replace(/\s+/g, '')); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: b.type });
}
function fb2Model(text) {
  const P = fb2Parse(text); const urls = [];
  const img = id => { const b = P.binaries.get(id); if (!b) return ''; if (!b.url) { b.url = URL.createObjectURL(b64blob(b)); urls.push(b.url); } return b.url; };
  const bodies = Array.from(P.doc.getElementsByTagName('body'));
  const main = bodies.find(b => !b.getAttribute('name')) || bodies[0];
  if (!main) throw new Error('в FB2 нет текста');
  const toc = []; let chNo = 0, sid = 0;
  const kids = n => Array.from(n.childNodes);
  // заголовок FB2 состоит из нескольких <p>: «Глава 1» + «Письмо» → «Глава 1. Письмо»
  const titleOf = t => { if (!t) return ''; const ps = Array.from(t.children).map(txt).filter(Boolean); return ps.length ? ps.map((s, i) => i < ps.length - 1 && !/[.!?:…]$/.test(s) ? s + '.' : s).join(' ') : txt(t); };
  function conv(n, depth) {
    if (n.nodeType === 3) return esc(n.nodeValue);
    if (n.nodeType !== 1) return '';
    const inner = (d = depth) => kids(n).map(c => conv(c, d)).join('');
    switch (n.localName) {
      case 'section': {
        let id = n.getAttribute('id') || '';
        const t = Array.from(n.children).find(c => c.localName === 'title');
        if (t && depth >= 1 && depth <= 3) { id = id || 's' + (++sid); toc.push({ title: titleOf(t), ch: chNo, anchor: id, lvl: Math.min(depth, 2) }); }
        return `<section${id ? ` id="${esc(id)}"` : ''}>${inner(depth + 1)}</section>`;
      }
      case 'title': { const h = clamp(depth + 1, 2, 4); return `<h${h}>${Array.from(n.children).map(p => kids(p).map(c => conv(c, depth)).join('')).join('<br>') || inner()}</h${h}>`; }
      case 'p': return `<p>${inner()}</p>`;
      case 'emphasis': return `<em>${inner()}</em>`;
      case 'strong': return `<strong>${inner()}</strong>`;
      case 'strikethrough': return `<s>${inner()}</s>`;
      case 'sub': case 'sup': case 'code': return `<${n.localName}>${inner()}</${n.localName}>`;
      case 'empty-line': return '<div class="el"></div>';
      case 'subtitle': return `<h4>${inner()}</h4>`;
      case 'epigraph': return `<blockquote class="epigraph">${inner()}</blockquote>`;
      case 'cite': return `<blockquote>${inner()}</blockquote>`;
      case 'text-author': return `<p class="ta">${inner()}</p>`;
      case 'poem': return `<div class="poem">${inner()}</div>`;
      case 'stanza': return `<div class="stanza">${inner()}</div>`;
      case 'v': return `<p class="v">${inner()}</p>`;
      case 'date': return `<p class="ta">${inner()}</p>`;
      case 'image': { const u = img(hrefOf(n).replace(/^#/, '')); return u ? `<img src="${u}" alt="">` : ''; }
      case 'a': { const h = hrefOf(n); return h.startsWith('#') ? `<a class="note" href="#" data-note="${esc(h.slice(1))}">${inner()}</a>` : `<a href="${esc(h)}" target="_blank" rel="noopener">${inner()}</a>`; }
      case 'table': return `<table>${inner()}</table>`;
      case 'tr': return `<tr>${inner()}</tr>`;
      case 'td': case 'th': return `<${n.localName}>${inner()}</${n.localName}>`;
      case 'binary': case 'description': return '';
      default: return inner();
    }
  }
  const chapters = [];
  let pre = '';
  const secs = Array.from(main.children).filter(c => c.localName === 'section');
  for (const c of Array.from(main.children)) if (c.localName !== 'section') pre += conv(c, 0).replace(/^<h2>/, '<h1>').replace(/<\/h2>$/, '</h1>');
  // если в теле один раздел с подразделами — главами считаем подразделы
  let parts = secs;
  if (secs.length === 1 && Array.from(secs[0].children).filter(c => c.localName === 'section').length > 1) {
    const head = Array.from(secs[0].children).filter(c => c.localName !== 'section').map(c => conv(c, 1)).join('');
    pre += head; parts = Array.from(secs[0].children).filter(c => c.localName === 'section');
  }
  if (!parts.length) chapters.push({ title: P.title, html: pre });
  parts.forEach((s, i) => {
    chNo = i;
    const t = titleOf(Array.from(s.children).find(c => c.localName === 'title')) || (P.title + (parts.length > 1 ? ` · ${i + 1}` : ''));
    toc.push({ title: t, ch: i, anchor: '', lvl: 0 });
    chapters.push({ title: t, html: (i === 0 ? pre : '') + conv(s, 0) });
  });
  // примечания
  const notes = new Map();
  for (const nb of bodies.filter(b => b !== main)) {
    for (const s of Array.from(nb.getElementsByTagName('section'))) {
      const id = s.getAttribute('id'); if (!id) continue;
      notes.set(id, Array.from(s.children).filter(c => c.localName !== 'title').map(c => conv(c, 3)).join('') || esc(txt(s)));
    }
  }
  if (notes.size) {
    toc.push({ title: 'Примечания', ch: chapters.length, anchor: '', lvl: 0 });
    chapters.push({ title: 'Примечания', html: '<h2>Примечания</h2>' + [...notes].map(([id, h]) => `<div id="${esc(id)}">${h}</div>`).join('') });
  }
  // нумерация toc для глав без вложенности
  toc.sort((a, b) => a.ch - b.ch);
  return {
    chapters: chapters.map(c => ({ title: c.title, weight: Math.max(400, c.html.length), load: async () => htmlChapter(c.html) })),
    toc, notes, cleanup() { urls.forEach(u => URL.revokeObjectURL(u)); },
  };
}

/* ——————————————————— форматы: TXT, MD, HTML, JSON ——————————————————— */
function txtModel(text) {
  text = text.replace(/\r\n?/g, '\n').replace(/ /g, ' ');
  const lines = text.split('\n');
  // \b в JS не знает кириллицу, поэтому границу слова задаём явно
  const headRe = /^\s*((глава|часть|книга|том|пролог|эпилог|предисловие|послесловие|вступление|chapter|part|book|prologue|epilogue)(?![\p{L}\d])[^\n]{0,90}|[IVXLC]{1,7}\.?|\d{1,3}\.)\s*$/iu;
  const blanks = lines.filter(l => !l.trim()).length;
  const byBlank = blanks > lines.length / 12;
  const chunks = []; let cur = { title: '', lines: [] };
  lines.forEach((l, i) => {
    if (headRe.test(l) && (i === 0 || !lines[i - 1].trim() || !byBlank)) { if (cur.lines.some(x => x.trim()) || cur.title) chunks.push(cur); cur = { title: l.trim(), lines: [] }; }
    else cur.lines.push(l);
  });
  chunks.push(cur);
  const para = ls => {
    const out = []; let buf = [];
    const flush = () => { if (buf.length) { out.push(buf.join(' ')); buf = []; } };
    for (const l of ls) { if (!l.trim()) flush(); else if (byBlank) buf.push(l.trim()); else { flush(); out.push(l.trim()); } }
    flush(); return out;
  };
  let chapters = chunks.filter(c => c.title || c.lines.some(x => x.trim())).map((c, i) => {
    const ps = para(c.lines);
    return { title: c.title || (i === 0 ? 'Начало' : `Часть ${i + 1}`), html: (c.title ? `<h2>${esc(c.title)}</h2>` : '') + ps.map(p => /^(\*\s*){3}$/.test(p) ? '<hr>' : `<p>${esc(p)}</p>`).join('') };
  });
  // нет заголовков — режем на части по ~30 тысяч знаков
  if (chapters.length === 1 && chapters[0].html.length > 60000) {
    const ps = chapters[0].html.split('</p>'); chapters = []; let acc = '', n = 1;
    for (const p of ps) { acc += p + '</p>'; if (acc.length > 30000) { chapters.push({ title: `Часть ${n++}`, html: acc }); acc = ''; } }
    if (acc.replace(/<\/p>/g, '').trim()) chapters.push({ title: `Часть ${n}`, html: acc });
  }
  return plainModel(chapters);
}
function plainModel(chapters, extraToc) {
  return {
    chapters: chapters.map(c => ({ title: c.title, weight: Math.max(400, c.html.length), load: async () => htmlChapter(c.html) })),
    toc: extraToc || chapters.map((c, i) => ({ title: c.title, ch: i, anchor: '', lvl: 0 })),
    cleanup() { },
  };
}
function mdToHtml(md) {
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>').replace(/_(.+?)_/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[(.+?)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const out = []; let list = null, para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; } };
  for (const l of md.replace(/\r/g, '').split('\n')) {
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)/))) { flush(); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); }
    else if (/^\s*([-*_]\s*){3,}$/.test(l)) { flush(); out.push('<hr>'); }
    else if ((m = l.match(/^>\s?(.*)/))) { flush(); out.push(`<blockquote><p>${inline(m[1])}</p></blockquote>`); }
    else if ((m = l.match(/^\s*[-*+]\s+(.*)/))) { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } (list = list || []).push(`<li>${inline(m[1])}</li>`); }
    else if (!l.trim()) flush();
    else para.push(l.trim());
  }
  flush(); return out.join('\n');
}
function splitByHeadings(html, fallbackTitle) {
  const box = el('div'); box.innerHTML = html;
  // Викитека заворачивает весь текст в один div — разворачиваем, чтобы найти заголовки
  while (box.children.length === 1 && box.firstElementChild.tagName === 'DIV' && !box.firstElementChild.className) box.innerHTML = box.firstElementChild.innerHTML;
  const chapters = []; let cur = { title: fallbackTitle, nodes: [] };
  for (const n of Array.from(box.childNodes)) {
    if (n.nodeType === 1 && /^H[12]$/.test(n.tagName) && cur.nodes.some(x => x.textContent.trim())) { chapters.push(cur); cur = { title: '', nodes: [] }; }
    if (n.nodeType === 1 && /^H[12]$/.test(n.tagName) && !cur.title) cur.title = n.textContent.trim();
    cur.nodes.push(n);
  }
  chapters.push(cur);
  return chapters.map(c => ({ title: c.title || fallbackTitle, html: c.nodes.map(n => n.nodeType === 1 ? n.outerHTML : n.nodeType === 3 ? esc(n.textContent) : '').join('') }));
}
function htmlDocModel(text, title) {
  const d = new DOMParser().parseFromString(text, 'text/html');
  sanitize(d.body);
  return plainModel(splitByHeadings(d.body.innerHTML, title));
}

async function buildModel(b, blob) {
  switch (b.fmt) {
    case 'epub': return epubModel(blob);
    case 'fb2': return fb2Model(decodeBytes(new Uint8Array(await blob.arrayBuffer())));
    case 'txt': return txtModel(decodeBytes(new Uint8Array(await blob.arrayBuffer())));
    case 'md': return plainModel(splitByHeadings(mdToHtml(await blob.text()), b.title));
    case 'html': return htmlDocModel(decodeBytes(new Uint8Array(await blob.arrayBuffer())), b.title);
    case 'json': { const j = JSON.parse(await blob.text()); const m = plainModel(j.chapters); m.notes = new Map(j.notes || []); return m; }
    default: throw new Error('неизвестный формат');
  }
}

/* ——————————————————— постраничные форматы: CBZ, PDF ——————————————————— */
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFW = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
let pdfReady = null;
function loadPdf() {
  if (!pdfReady) pdfReady = loadScript(PDFJS).then(() => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFW; }).catch(e => { pdfReady = null; throw e; });
  return pdfReady;
}
async function pdfProvider(blob) {
  await loadPdf();
  const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()), isEvalSupported: false }).promise;
  const cache = new Map(); const sizes = [];
  const size = async k => { if (!sizes[k]) { const p = await doc.getPage(k + 1); const v = p.getViewport({ scale: 1 }); sizes[k] = { w: v.width, h: v.height, p }; } return sizes[k]; };
  const first = await size(0);
  return {
    count: doc.numPages, aspect: first.h / first.w, doc,
    async element(k, bw, bh, fit) {
      const { w, h, p } = await size(k);
      const s = (fit === 'width' || !isFinite(bh)) ? bw / w : Math.min(bw / w, bh / h);
      const key = k + ':' + Math.round(s * 100);
      if (cache.has(key)) { const c = cache.get(key); cache.delete(key); cache.set(key, c); return c.cloneNode ? copyCanvas(c) : c; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const v = p.getViewport({ scale: s * dpr });
      const c = document.createElement('canvas'); c.width = Math.floor(v.width); c.height = Math.floor(v.height);
      c.style.width = Math.floor(v.width / dpr) + 'px'; c.style.height = Math.floor(v.height / dpr) + 'px';
      await p.render({ canvasContext: c.getContext('2d'), viewport: v }).promise;
      cache.set(key, c); if (cache.size > 8) cache.delete(cache.keys().next().value);
      return copyCanvas(c);
    },
    destroy() { cache.clear(); doc.destroy(); },
  };
}
function copyCanvas(c) {
  const n = document.createElement('canvas'); n.width = c.width; n.height = c.height; n.style.cssText = c.style.cssText;
  n.getContext('2d').drawImage(c, 0, 0); return n;
}
async function cbzProvider(blob) {
  await needZip();
  const zip = await JSZip.loadAsync(blob);
  const names = Object.keys(zip.files).filter(n => !zip.files[n].dir && IMG_RE.test(n) && !/(^|\/)(__MACOSX|\.)/.test(n)).sort(collator.compare);
  if (!names.length) throw new Error('в архиве нет страниц');
  let rtl = false, title = '', author = '';
  const ci = Object.keys(zip.files).find(n => /(^|\/)comicinfo\.xml$/i.test(n));
  if (ci) {
    try {
      const d = xml(await ztext(zip, ci));
      rtl = /YesAndRightToLeft/i.test(txt(tag(d, 'Manga')));
      title = txt(tag(d, 'Series')) ? [txt(tag(d, 'Series')), txt(tag(d, 'Number')) && '№ ' + txt(tag(d, 'Number'))].filter(Boolean).join(' ') : txt(tag(d, 'Title'));
      if (txt(tag(d, 'Title')) && title !== txt(tag(d, 'Title'))) title = txt(tag(d, 'Title')) || title;
      author = txt(tag(d, 'Writer'));
    } catch { /* без метаданных */ }
  }
  const urls = []; // храним обещания, чтобы одна страница не получила два адреса
  const src = k => (urls[k] ??= zblob(zip, names[k]).then(b => URL.createObjectURL(b)));
  return {
    count: names.length, rtl, title, author, aspect: await (async () => { try { const i = await loadImg(await src(0), new Image(), 4000); return i.naturalWidth ? i.naturalHeight / i.naturalWidth : 1.45; } catch { return 1.45; } })(), names,
    src,
    async element(k) {
      const img = new Image(); img.alt = `Страница ${k + 1}`; img.decoding = 'async'; img.draggable = false;
      await loadImg(await src(k), img, 20000).catch(() => { });
      return img;
    },
    async blob(k) { return zblob(zip, names[k]); },
    destroy() { urls.forEach(p => p && p.then(u => URL.revokeObjectURL(u), () => { })); },
  };
}

// страницы, которые лежат в интернете (Internet Archive): храним только адреса
async function remoteProvider(blob) {
  const j = JSON.parse(await blob.text());
  const p0 = j.pages[0] || {};
  return {
    count: j.pages.length, rtl: false, aspect: p0.w && p0.h ? p0.h / p0.w : 1.45,
    ratio: k => { const p = j.pages[k]; return p && p.w && p.h ? p.h / p.w : null; },
    async element(k) {
      const img = new Image(); img.alt = `Страница ${k + 1}`; img.decoding = 'async'; img.draggable = false; img.referrerPolicy = 'no-referrer';
      const p = j.pages[k]; if (p.w && p.h) { img.width = p.w; img.height = p.h; } // размер известен заранее — место под страницу не меняется
      await loadImg(p.u, img, 30000).catch(() => { });
      return img;
    },
    destroy() { },
  };
}

/* ——————————————————— импорт ——————————————————— */
const UNSUPPORTED = { mobi: 'MOBI', azw: 'AZW', azw3: 'AZW3', kfx: 'KFX', djvu: 'DjVu', djv: 'DjVu', cbr: 'CBR', rar: 'RAR', cb7: 'CB7', '7z': '7z', doc: 'DOC', docx: 'DOCX', rtf: 'RTF', odt: 'ODT', lit: 'LIT' };
const KIND = { epub: 'text', fb2: 'text', txt: 'text', md: 'text', html: 'text', json: 'text', pdf: 'pages', cbz: 'pages', iapages: 'pages' };

async function sniff(file) {
  const ext = extOf(file.name);
  if (UNSUPPORTED[ext]) throw new Error(`формат ${UNSUPPORTED[ext]} пока не читается. Сохраните книгу в EPUB, FB2 или CBZ`);
  const h = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  if (h[0] === 0x25 && h[1] === 0x50 && h[2] === 0x44 && h[3] === 0x46) return { fmt: 'pdf', blob: file };
  if (h[0] === 0x50 && h[1] === 0x4B) {
    await needZip();
    const zip = await JSZip.loadAsync(file);
    const names = Object.keys(zip.files);
    if (names.some(n => /\.opf$/i.test(n)) || zip.file('mimetype')) return { fmt: 'epub', blob: file };
    const fb = names.find(n => /\.fb2$/i.test(n));
    if (fb) return { fmt: 'fb2', blob: await zip.file(fb).async('blob') };
    if (names.some(n => IMG_RE.test(n))) return { fmt: 'cbz', blob: file };
    throw new Error('в архиве не нашлось ни книги, ни картинок');
  }
  if (h[0] === 0x52 && h[1] === 0x61 && h[2] === 0x72) throw new Error('архивы RAR (CBR) пока не читаются. Перепакуйте их в ZIP или CBZ');
  const map = { fb2: 'fb2', txt: 'txt', text: 'txt', md: 'md', markdown: 'md', html: 'html', htm: 'html', xhtml: 'html', json: 'json' };
  if (map[ext]) return { fmt: map[ext], blob: file };
  const head = decodeBytes(new Uint8Array(await file.slice(0, 600).arrayBuffer()));
  if (/<FictionBook/i.test(head)) return { fmt: 'fb2', blob: file };
  if (/<html|<!doctype html/i.test(head)) return { fmt: 'html', blob: file };
  if (!/[\x00-\x08\x0E-\x1F]/.test(head.slice(0, 400))) return { fmt: 'txt', blob: file };
  throw new Error('не удалось понять, что это за файл');
}

async function describe(fmt, blob, fname) {
  const m = { title: nameOf(fname), author: '', cover: null, prefs: {} };
  if (fmt === 'epub') {
    const E = await epubOpen(blob);
    m.title = E.title || m.title; m.author = E.author; m.lang = E.lang;
    if (E.cover) m.cover = await thumb(await zblob(E.zip, E.cover.href));
  } else if (fmt === 'fb2') {
    const P = fb2Parse(decodeBytes(new Uint8Array(await blob.arrayBuffer())));
    m.title = P.title || m.title; m.author = P.author;
    const b = P.binaries.get(P.coverId); if (b) m.cover = await thumb(b64blob(b));
  } else if (fmt === 'cbz') {
    const p = await cbzProvider(blob);
    m.title = p.title || m.title; m.author = p.author; m.prefs.dir = p.rtl ? 'rtl' : 'ltr'; m.pages = p.count;
    m.cover = await thumb(await p.blob(0)); p.destroy();
  } else if (fmt === 'pdf') {
    const p = await pdfProvider(blob);
    try { const md = await p.doc.getMetadata(); if (md?.info?.Title && md.info.Title.trim().length > 1) m.title = md.info.Title.trim(); if (md?.info?.Author) m.author = md.info.Author.trim(); } catch { /* без метаданных */ }
    m.pages = p.count;
    m.cover = await thumb(await p.element(0, 360, Infinity, 'width'));
    p.destroy();
  } else if (fmt === 'html') {
    const t = decodeBytes(new Uint8Array(await blob.slice(0, 20000).arrayBuffer())).match(/<title[^>]*>([^<]+)/i);
    if (t) m.title = t[1].trim();
  } else if (fmt === 'md') {
    const t = (await blob.slice(0, 4000).text()).match(/^#\s+(.+)$/m); if (t) m.title = t[1].trim();
  } else if (fmt === 'iapages') {
    const j = JSON.parse(await blob.text());
    m.title = j.title || m.title; m.author = j.author || ''; m.pages = j.pages.length;
    try { const r = await fetch(j.pages[0].u.replace('&scale=2', '&scale=8')); if (r.ok) m.cover = await thumb(await r.blob()); } catch { /* обложка без CORS */ }
    if (!m.cover && j.id) m.coverUrl = `https://archive.org/services/img/${encodeURIComponent(j.id)}`;
  } else if (fmt === 'json') {
    let j; try { j = JSON.parse(await blob.text()); } catch { throw new Error('это не книга'); }
    if (!Array.isArray(j.chapters) || !j.chapters.length) throw new Error('это JSON, но не книга');
    m.title = j.title || m.title; m.author = j.author || '';
  }
  return m;
}

async function addBook(fmt, blob, fname, extra = {}) {
  const m = await describe(fmt, blob, fname);
  const b = { id: uid(), title: m.title || 'Без названия', author: m.author || '', lang: m.lang || '', coverUrl: m.coverUrl || '', fmt, kind: KIND[fmt], size: blob.size, added: Date.now(), opened: 0, pos: null, pct: 0, cover: m.cover, marks: [], prefs: m.prefs, pages: m.pages || 0, ...extra };
  await DB.putFile(b.id, blob);
  await DB.putBook(b);
  Shelf.books.push(b);
  return b;
}

async function imagesToCbz(files, title) {
  await needZip();
  const zip = new JSZip(); const pad = String(files.length).length;
  files.forEach((f, i) => zip.file(String(i + 1).padStart(pad, '0') + '.' + (extOf(f.name) || 'jpg'), f));
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  return addBook('cbz', blob, title + '.cbz');
}

const relPath = f => f.relPath || f.webkitRelativePath || f.name;
async function importFiles(list) {
  const files = Array.from(list).filter(f => f && f.size > 0 && !/(^|\/)\./.test(relPath(f)));
  if (!files.length) return;
  const isImg = f => IMG_RE.test(f.name) || /^image\//.test(f.type);
  const imgs = files.filter(isImg), rest = files.filter(f => !isImg(f));
  const added = [];
  const busy = files.length > 1 || files[0].size > 4e6 ? toastBusy(`Раскладываю на полку: ${files.length} ${plural(files.length, ['файл', 'файла', 'файлов'])}`) : null;
  for (const f of rest) {
    try { const s = await sniff(f); added.push(await addBook(s.fmt, s.blob, f.name)); }
    catch (e) { console.error(e); Sound.error(); toast(`«${f.name}»: ${e.message || 'файл не открылся'}`, 'err', 6000); }
  }
  if (imgs.length) {
    const groups = new Map();
    for (const f of imgs) { const p = relPath(f).split('/'); const key = p.length > 1 ? p.slice(0, -1).join('/') : ''; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(f); }
    for (const [key, g] of groups) {
      g.sort((a, b) => collator.compare(relPath(a), relPath(b)));
      const title = key ? key.split('/').filter(Boolean).slice(-2).join(' · ') : (g.length === 1 ? nameOf(g[0].name) : 'Сканы ' + new Date().toLocaleDateString('ru'));
      try { added.push(await imagesToCbz(g, title)); } catch (e) { console.error(e); toast('Не получилось собрать картинки в книгу', 'err'); }
    }
  }
  busy?.done();
  if (added.length) {
    Sound.add();
    toast(added.length === 1 ? `«${added[0].title}» теперь на полке` : `На полке ${added.length} ${plural(added.length, ['новая книга', 'новые книги', 'новых книг'])}`);
    if (View.cur !== 'shelf') View.go('shelf');
    Shelf.render(true, new Set(added.map(b => b.id)));
  }
}
function toastBusy(msg) {
  const t = el('div', { class: 'toast' }, el('span', { class: 'bar' }), el('span', {}, msg));
  $('#toasts').append(t);
  return { done() { t.classList.add('out'); setTimeout(() => t.remove(), 340); } };
}

/* ——————————————————— полка ——————————————————— */
const Shelf = {
  books: [], filter: store.get('filter', 'all'), q: '', confirmId: null,
  async load() { this.books = await DB.books(); },
  list() {
    const q = this.q.trim().toLowerCase();
    return this.books
      .filter(b => this.filter === 'all' || (this.filter === 'text' ? b.kind === 'text' || b.sub === 'scan' : this.filter === 'comic' ? b.fmt === 'cbz' || b.sub === 'comic' : b.fmt === 'pdf'))
      .filter(b => !q || (b.title + ' ' + b.author).toLowerCase().includes(q))
      .sort((a, b) => (b.opened || b.added) - (a.opened || a.added));
  },
  render(animate = false, fresh = new Set()) {
    const grid = $('#grid');
    grid.classList.toggle('noanim', !animate && !fresh.size);
    const n = this.books.length;
    const reading = this.books.filter(b => b.pct > 0.003 && b.pct < 0.995).length;
    const marks = this.books.reduce((a, b) => a + (b.marks?.length || 0), 0);
    renderStats([[n, plural(n, ['книга на полке', 'книги на полке', 'книг на полке'])], [reading, 'читаете сейчас'], [marks, plural(marks, ['закладка', 'закладки', 'закладок'])]]);
    $('#shelf-count').textContent = n ? String(n) : '';
    this.renderContinue();
    const items = this.list();
    const nodes = items.map((b, i) => this.card(b, animate || fresh.has(b.id) ? Math.min(i, 14) : 0));
    if (!items.length && (this.q || this.filter !== 'all')) nodes.push(el('p', { class: 'empty-note' }, this.q ? `На полке нет ничего похожего на «${this.q}».` : 'В этом разделе полки пока пусто.'));
    nodes.push(this.addCard(items.length));
    grid.replaceChildren(...nodes);
    Hero.covers(this.books);
  },
  renderContinue() {
    const box = $('#continue');
    const b = this.books.filter(x => x.opened && x.pct < 0.995).sort((a, c) => c.opened - a.opened)[0];
    if (!b || this.q || this.filter !== 'all') { box.replaceChildren(); return; }
    const pct = Math.round(b.pct * 100);
    const mc = el('div', { class: 'mini-cover' }, coverNode(b));
    const node = el('button', { class: 'continue', 'aria-label': `Продолжить «${b.title}»`, onclick: () => openBook(b.id, mc) },
      mc,
      el('div', { style: 'min-width:0' },
        el('div', { class: 'eyebrow' }, 'Продолжить чтение'),
        el('h2', {}, b.title),
        b.author ? el('div', { class: 'who' }, b.author) : null,
        el('div', { class: 'pbar' }, el('i', { style: `width:${Math.max(2, pct)}%` })),
        el('div', { class: 'meta' }, `${pct} % · ${b.posLabel || 'с начала'}`)),
      el('span', { class: 'btn primary go' }, 'Читать', el('span', { html: ICON.arrow })));
    node.addEventListener('pointermove', e => { const r = node.getBoundingClientRect(); node.style.setProperty('--mx', (e.clientX - r.left) + 'px'); node.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    box.replaceChildren(node);
  },
  card(b, i) {
    const pct = Math.round((b.pct || 0) * 100);
    const [cb] = PALETTE[hash(b.title + b.author) % PALETTE.length];
    const front = el('div', { class: 'front' }, coverNode(b));
    const b3 = el('div', { class: 'b3d', style: `--cb:${cb}` },
      el('div', { class: 'floor' }), el('div', { class: 'back' }), el('div', { class: 'spine' }), el('div', { class: 'pages' }), front,
      b.pct > 0.003 ? el('span', { class: 'ribbon', style: `--len:${Math.round(10 + b.pct * 70)}%` }) : null);
    const open = el('button', { class: 'book-open', 'aria-label': `Открыть «${b.title}»`, onclick: () => openBook(b.id, front) }, b3);
    tilt(open, b3);
    const art = el('article', { class: 'book', style: `--i:${i}`, dataset: { id: b.id } },
      open,
      el('div', { class: 'book-meta' },
        el('div', { class: 'book-title', title: b.title }, b.title),
        el('div', { class: 'book-author' }, b.author || ' '),
        el('div', { class: 'book-foot' },
          el('span', { class: 'fmt' }, (b.fmt === 'iapages' ? (b.sub === 'comic' ? 'МАНГА' : 'СКАН') : { cbz: 'МАНГА', json: 'КНИГА', md: 'MD' }[b.fmt] || b.fmt.toUpperCase())),
          b.example ? el('span', { class: 'tag-ex' }, 'пример') : el('span', {}, pct >= 100 ? 'прочитано' : pct > 0 ? `${pct} %` : 'новая'),
          el('button', { class: 'key-sm', style: 'margin-left:auto', title: 'Скачать файл', 'aria-label': `Скачать «${b.title}»`, html: ICON.down, onclick: () => { Sound.tap(); exportBook(b).catch(e => { console.error(e); toast('Не удалось сохранить файл', 'err'); }); } }),
          el('button', { class: 'book-more', style: 'margin-left:0', 'aria-label': `Убрать «${b.title}» с полки`, html: ICON.trash, onclick: () => { Sound.tap(); art.classList.add('confirm'); art.querySelector('.mini').focus(); } })),
        el('div', { class: 'confirm-row' }, 'Убрать с полки?',
          el('button', { class: 'mini danger', onclick: () => this.remove(b.id, art) }, 'Да'),
          el('button', { class: 'mini', onclick: () => { Sound.tap(); art.classList.remove('confirm'); } }, 'Нет'))));
    return art;
  },
  addCard(count) {
    return el('div', { class: 'book add-card', style: `--i:${Math.min(count, 14)}` },
      el('label', { for: 'file-in', role: 'button', tabindex: '0', 'aria-label': 'Добавить книги с компьютера' },
        el('div', { class: 'add-face' }, el('div', { class: 'plus' }, el('span', { html: ICON.plus }), el('span', {}, 'Добавить книгу'), el('small', { style: 'color:var(--ink-3);font-weight:400' }, 'или перетащите файлы')))),
      el('div', { class: 'book-meta' }, el('div', { class: 'book-author' }, 'EPUB, FB2, PDF, CBZ и другие')));
  },
  async remove(id, node) {
    Sound.crumple();
    node.classList.add('leaving');
    await new Promise(r => setTimeout(r, RM.matches ? 0 : 420));
    await DB.del(id);
    this.books = this.books.filter(b => b.id !== id);
    const u = coverURLs.get(id); if (u) { URL.revokeObjectURL(u); coverURLs.delete(id); }
    this.render(false);
    toast('Книга убрана с полки');
  },
  setFilter(f) {
    this.filter = f; store.set('filter', f);
    $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.f === f)));
    moveInk($('#chip-ink'), $(`#chips .chip[data-f="${f}"]`));
    this.render(true);
  },
};
function moveInk(ink, target) {
  if (!ink || !target) return;
  ink.style.width = target.offsetWidth + 'px';
  ink.style.transform = `translateX(${target.offsetLeft}px)`;
}
// книга на полке поворачивается за курсором, по ней скользит блик
function tilt(host, b3) {
  if (RM.matches) return;
  let raf = 0, ev = null;
  const apply = () => {
    raf = 0; if (!ev) return;
    const r = host.getBoundingClientRect(); const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
    const st = b3.style;
    st.setProperty('--ry', `${(-16 + (x - 0.5) * 34).toFixed(1)}deg`); st.setProperty('--rx', `${((0.5 - y) * 16).toFixed(1)}deg`);
    st.setProperty('--sx', `${(x * 100).toFixed(0)}%`); st.setProperty('--sy', `${(y * 100).toFixed(0)}%`); st.setProperty('--ty', '-8px');
  };
  host.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; ev = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
  host.addEventListener('pointerleave', () => { ev = null; cancelAnimationFrame(raf); raf = 0; ['--ry', '--rx', '--sx', '--sy', '--ty'].forEach(p => b3.style.removeProperty(p)); });
}
// числа в шапке плавно добегают до значения
function renderStats(rows) {
  const dl = $('#stats');
  if (dl.children.length !== rows.length) dl.replaceChildren(...rows.map(() => el('div', {}, el('dd', {}, '0'), el('dt', {}, ''))));
  rows.forEach(([v, label], i) => {
    const box = dl.children[i]; const dd = box.querySelector('dd'); box.querySelector('dt').textContent = label;
    const from = +dd.dataset.v || 0; dd.dataset.v = v;
    if (RM.matches || from === v) { dd.textContent = v; return; }
    const t0 = performance.now(), dur = 900;
    const step = now => { const k = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - k, 3); dd.textContent = Math.round(from + (v - from) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); setTimeout(() => { dd.textContent = v; }, dur + 50);
  });
}

/* ——————————————————— 3D-сцена в шапке ——————————————————— */
const Hero = {
  ok: false,
  init() {
    const cv = $('#hero-canvas'); if (!cv) return;
    window.addEventListener('hero3d:grab', () => Sound.grab());
    window.addEventListener('hero3d:release', () => Sound.release());
    const start = async () => {
      try {
        await once(LIB.three); await once('hero3d.js' + (VER ? '?v=' + VER : ''));
        await Promise.all([document.fonts?.load('21px "Liberation Serif"'), document.fonts?.load('600 30px Onest')]).catch(() => { });
      } catch { $('#hero-3d').hidden = true; return; }
      this.ok = !!window.Hero3D && window.Hero3D.init(cv, getComputedStyle(document.documentElement).getPropertyValue('--ribbon').trim() || '#D39C63');
      if (!this.ok) { $('#hero-3d').hidden = true; return; }
      cv.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)' });
      window.Hero3D.setActive(View.cur === 'shelf' && !R.open);
      this.covers(Shelf.books);
    };
    (window.requestIdleCallback || (f => setTimeout(f, 300)))(() => start(), { timeout: 1500 });
  },
  covers(books) {
    if (!this.ok) return;
    const withCover = books.filter(b => b.cover).sort((a, b) => (b.opened || b.added) - (a.opened || a.added)).slice(0, 3);
    const key = withCover.map(b => b.id).join();
    if (key === this._key || !withCover.length) return; this._key = key;
    window.Hero3D.setCovers(withCover.map(b => { let u = coverURLs.get(b.id); if (!u) { u = URL.createObjectURL(b.cover); coverURLs.set(b.id, u); } return u; }));
  },
  accent() { if (this.ok) window.Hero3D.setAccent(getComputedStyle(document.documentElement).getPropertyValue('--ribbon').trim()); },
  active(v) { if (this.ok) window.Hero3D.setActive(v); },
};

/* ——————————————————— виды и шапка ——————————————————— */
const View = {
  cur: 'shelf',
  async go(v, silent) {
    if (v !== 'shelf' && v !== 'catalog') v = 'shelf';
    const changed = v !== this.cur;
    const from = $(`#view-${this.cur}`);
    this.cur = v;
    $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.go === v)));
    moveInk($('#nav-pill'), $(`.tab[data-go="${v}"]`));
    if (changed && !silent) {
      Sound.swish();
      if (!RM.matches && from && !from.hidden) { from.classList.add('out'); await new Promise(r => setTimeout(r, 190)); from.classList.remove('out'); }
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    $('#view-shelf').hidden = v !== 'shelf';
    $('#view-catalog').hidden = v !== 'catalog';
    Hero.active(v === 'shelf' && !R.open);
    if (v === 'catalog') Catalog.init();
    try { history.replaceState(null, '', '#' + v); } catch { /* песочница */ }
  },
};
const Theme = {
  cur() { return document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); },
  paint() { $('#btn-theme').innerHTML = this.cur() === 'dark' ? ICON.sun : ICON.moon; $('#btn-theme').setAttribute('aria-label', this.cur() === 'dark' ? 'Светлая тема' : 'Тёмная тема'); },
  toggle(btn) {
    const next = this.cur() === 'dark' ? 'light' : 'dark';
    const apply = () => { document.documentElement.dataset.theme = next; store.set('theme', next); this.paint(); Hero.accent(); };
    Sound.whoosh();
    if (!document.startViewTransition || RM.matches) return apply();
    const r = btn.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => { });
  },
};

/* ——————————————————— настройки чтения ——————————————————— */
const Settings = {
  t: Object.assign({ rt: 'auto', font: 'liberation', size: 20, lh: 1.6, margin: 'm', justify: true, layout: 'paged', spread: true, dropcap: true }, store.get('t2', {})),
  p: Object.assign({ rt: 'auto', mode: 'single', fit: 'height' }, store.get('p', {})),
  save() { store.set('t2', this.t); store.set('p', this.p); },
};
const FONTS = { liberation: ['var(--f-read)', 'Liberation Serif'], literata: ['"Literata", Georgia, serif', 'Literata'], onest: ['var(--f-ui)', 'Onest'] };
if (!FONTS[Settings.t.font]) Settings.t.font = 'liberation';

/* ——————————————————— читалка: общее ——————————————————— */
const reader = $('#reader');
const R = { book: null, model: null, prov: null, open: false, tok: 0 };
const loading = () => !$('#r-loading').hidden;

function applyReaderLook() {
  const S = R.book?.kind === 'pages' ? Settings.p : Settings.t;
  reader.dataset.rt = S.rt;
  needFont(Settings.t.font);
  reader.style.setProperty('--r-font', FONTS[Settings.t.font]?.[0] || 'var(--f-read)');
  reader.style.setProperty('--r-size', Settings.t.size + 'px');
  reader.style.setProperty('--r-lh', Settings.t.lh);
  T.flow.classList.toggle('justify', !!Settings.t.justify);
  T.flow.classList.toggle('dropcap', !!Settings.t.dropcap);
}

// книга открывается как настоящая: обложка распахивается на петле, разворот вырастает до экрана
function openingFrom(node) {
  if (!node || RM.matches) return;
  const r = node.getBoundingClientRect(); if (!r.width) return;
  const W = innerWidth, H = innerHeight;
  const bg = getComputedStyle(reader).backgroundColor;
  const cover = el('div', { class: 'o-cover' });
  const img = node.querySelector('img'); const gen = node.querySelector('.gen');
  cover.append(img ? img.cloneNode() : gen ? gen.cloneNode(true) : '');
  const box = el('div', { class: 'opening', style: `left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;--o-bg:${bg}` }, el('div', { class: 'o-page' }), cover);
  document.body.append(box);
  const sx = r.width / W, sy = r.height / H;
  const lift = `translate(${r.left - r.width * 0.05}px, ${r.top - r.height * 0.06}px) scale(${sx * 1.1}, ${sy * 1.1})`;
  box.animate([
    { transform: `translate(${r.left}px, ${r.top}px) scale(${sx}, ${sy})`, opacity: 1 },
    { transform: lift, opacity: 1, offset: 0.42 },
    { transform: 'none', opacity: 1, offset: 0.86 },
    { transform: 'none', opacity: 0 },
  ], { duration: 1150, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.then(() => box.remove(), () => box.remove());
  cover.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-178deg)', offset: 0.5 }, { transform: 'rotateY(-178deg)' }], { duration: 1150, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
  setTimeout(() => box.remove(), 1700); // если вкладка в фоне и кадры не идут
}

async function openBook(id, fromNode) {
  const b = Shelf.books.find(x => x.id === id); if (!b || R.open) return;
  R.open = true; R.book = b;
  Sound.open(); Hero.active(false);
  reader.dataset.kind = b.kind;
  T.flow.lang = b.lang || (/[a-z]/i.test(b.title) && !/[а-яё]/i.test(b.title) ? 'en' : 'ru');
  applyReaderLook();
  $('#r-title').textContent = [b.author, b.title].filter(Boolean).join(' · ');
  $('#r-chap').textContent = '';
  $('#r-folio').textContent = '';
  $('#r-loading').hidden = false;
  T.flow.replaceChildren(); PG.vp.replaceChildren();
  reader.hidden = false; reader.classList.remove('leaving'); reader.classList.add('entering');
  openingFrom(fromNode);
  document.documentElement.style.overflow = 'hidden';
  setCalm(false); bumpCalm();
  const tok = ++R.tok; // книгу могут закрыть, пока она грузится
  try {
    const blob = await DB.file(id);
    if (tok !== R.tok) return;
    if (!blob) throw new Error('файл книги не найден в памяти браузера');
    if (b.kind === 'text') {
      T.vp.hidden = false; PG.vp.hidden = true;
      const model = await buildModel(b, blob);
      if (tok !== R.tok) { model.cleanup?.(); return; }
      R.model = model;
      await T.open(model, b.pos);
    } else {
      T.vp.hidden = true; PG.vp.hidden = false;
      const prov = b.fmt === 'pdf' ? await pdfProvider(blob) : b.fmt === 'iapages' ? await remoteProvider(blob) : await cbzProvider(blob);
      if (tok !== R.tok) { prov.destroy(); return; }
      R.prov = prov;
      await PG.open(prov, b.pos, b.prefs || {});
    }
    if (tok !== R.tok) return;
  } catch (e) {
    if (tok !== R.tok) return;
    console.error(e); Sound.error();
    toast(`Не удалось открыть книгу: ${e.message || 'ошибка'}`, 'err', 6000);
    closeReader(true); return;
  }
  $('#r-loading').hidden = true;
  b.opened = Date.now(); DB.putBook(b);
  setTimeout(() => reader.classList.remove('entering'), 1000);
}

async function closeReader(quiet) {
  if (!R.open) return;
  R.tok++; T.token++; PG.tok++;
  closePanels(true);
  if (!quiet) Sound.close();
  savePos.flush?.();
  if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
  reader.classList.add('leaving');
  await new Promise(r => setTimeout(r, RM.matches ? 0 : 300));
  reader.hidden = true; reader.classList.remove('leaving', 'entering');
  document.documentElement.style.overflow = '';
  R.model?.cleanup?.(); R.prov?.destroy?.(); PG.teardown();
  T.model = null; T.cache = new Map();
  T.flow.replaceChildren(); PG.vp.replaceChildren();
  R.model = R.prov = null; R.open = false;
  if (R.book) await DB.putBook(R.book);
  R.book = null;
  Hero.active(View.cur === 'shelf');
  Shelf.render(false);
}

const savePos = (() => {
  let t = null;
  const run = () => { t = null; if (R.book) DB.putBook(R.book); };
  const f = () => { clearTimeout(t); t = setTimeout(run, 500); };
  f.flush = () => { if (t) { clearTimeout(t); run(); } };
  return f;
})();

function report(pct, folio, chapTitle, label) {
  const b = R.book; if (!b) return;
  b.pct = clamp(pct, 0, 1); b.posLabel = label;
  $('#r-folio').textContent = folio;
  const ct = $('#r-chap');
  if (ct.textContent !== (chapTitle || '')) { ct.textContent = chapTitle || ''; ct.classList.remove('flash'); void ct.offsetWidth; ct.classList.add('flash'); }
  $('#r-prog').style.setProperty('--p', b.pct);
  const s = $('#r-scrub'); if (document.activeElement !== s) s.value = Math.round(b.pct * 1000);
  $('#r-scrub-a').textContent = Math.round(b.pct * 100) + ' %';
  $('#r-scrub-b').textContent = label || '';
  updateMarkState();
  savePos();
}

// sheet — элемент со старой страницей; edge — где корешок: 'left' или 'right'; host — куда класть тень
function turnSheet(sheet, edge, host, dur = 760) {
  const sign = edge === 'left' ? -1 : 1;
  sheet.classList.add('turning'); sheet.style.transformOrigin = `${edge} center`;
  const shade = el('div', { class: 'turn-shade', style: `background:linear-gradient(${edge === 'left' ? 'to left' : 'to right'}, rgb(0 0 0 / .32), rgb(0 0 0 / .06) 45%, rgb(255 255 255 / .1) 70%, transparent)` });
  const cast = el('div', { class: 'turn-cast', style: `background:linear-gradient(${edge === 'left' ? 'to right' : 'to left'}, rgb(0 0 0 / .28), transparent 55%)` });
  sheet.append(shade); host.append(cast);
  const ease = 'cubic-bezier(.45,.05,.2,1)';
  const a = sheet.animate([
    { transform: 'rotateY(0deg)', boxShadow: '0 0 0 rgb(0 0 0 / 0)' },
    { transform: `rotateY(${sign * 38}deg) translateZ(18px) scaleY(1.012)`, boxShadow: `${-sign * 18}px 0 40px rgb(0 0 0 / .28)`, offset: 0.38 },
    { transform: `rotateY(${sign * 84}deg) translateZ(6px)`, boxShadow: `${-sign * 8}px 0 22px rgb(0 0 0 / .2)`, opacity: 1, offset: 0.9 },
    { transform: `rotateY(${sign * 92}deg) translateZ(4px)`, boxShadow: `${-sign * 6}px 0 20px rgb(0 0 0 / .18)`, opacity: 0 },
  ], { duration: dur, easing: ease, fill: 'forwards' });
  shade.animate([{ opacity: 0 }, { opacity: 0.55, offset: 0.4 }, { opacity: 1 }], { duration: dur, easing: ease, fill: 'forwards' });
  cast.animate([{ opacity: 0.9 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }], { duration: dur, easing: ease, fill: 'forwards' });
  const done = () => { sheet.remove(); cast.remove(); };
  a.finished.then(done, done); setTimeout(done, dur + 1500);
}
function sheen(dir) {
  if (RM.matches) return;
  const s = $('#sheen'); s.classList.remove('go-f', 'go-b'); void s.offsetWidth; s.classList.add(dir === 'f' ? 'go-f' : 'go-b');
}

/* ——— спокойный режим: панели прячутся, пока читаете ——— */
let calmT = null;
function setCalm(v) { reader.classList.toggle('calm', v); }
function bumpCalm() { clearTimeout(calmT); calmT = setTimeout(() => { if (!$('.panel.on')) setCalm(true); }, 2600); }

/* ——————————————————— читалка: текст ——————————————————— */
const T = {
  vp: $('#t-vp'), flow: $('#t-flow'), model: null, ch: 0, page: 0, pages: 1, W: 0, P: 0, frac: 0, cum: [], total: 1, end: null, token: 0,
  get scroll() { return Settings.t.layout === 'scroll'; },
  async open(model, pos) {
    this.model = model;
    const w = model.chapters.map(c => c.weight); this.cum = []; let acc = 0;
    for (const x of w) { this.cum.push(acc); acc += x; } this.total = acc || 1;
    this.cache = new Map();
    await this.show(pos?.ch || 0, { frac: pos?.frac || 0 }, false);
  },
  async node(i) {
    if (this.cache.has(i)) return this.cache.get(i);
    const n = await this.model.chapters[i].load();
    const head = n.querySelector('h1, h2, h3');
    if (head && Array.from(n.querySelectorAll('*')).indexOf(head) < 6) head.classList.add('ch-title');
    const lead = Array.from(n.querySelectorAll('p')).find(p => p.textContent.trim().length > 60 && !p.closest('blockquote, .poem, table'));
    if (lead) lead.classList.add('lead');
    this.cache.set(i, n); if (this.cache.size > 4) this.cache.delete(this.cache.keys().next().value);
    return n;
  },
  async show(ch, at = {}, anim = false) {
    const n = this.model.chapters.length;
    ch = clamp(ch, 0, n - 1);
    const tok = ++this.token;
    const node = await this.node(ch);
    if (tok !== this.token) return;
    this.ch = ch;
    const tail = [];
    if (this.scroll && ch < n - 1) tail.push(el('div', { class: 'chap-end' }, el('button', { onclick: () => { Sound.page(); this.show(ch + 1, { frac: 0 }, true); } }, `Дальше: ${this.model.chapters[ch + 1].title} →`)));
    if (ch === n - 1) tail.push(el('div', { class: 'book-end' }, el('b', {}, 'Конец'), R.book?.title || ''));
    this.end = el('span', { class: 't-end' });
    this.flow.replaceChildren(node, ...tail, this.end);
    if (anim && !RM.matches) { this.flow.classList.remove('swap'); void this.flow.offsetWidth; this.flow.classList.add('swap'); }
    this.layout();
    this.place(at);
    // картинки меняют вёрстку — пересчитываем, когда догрузятся
    const imgs = Array.from(node.querySelectorAll('img')).filter(i => !i.complete);
    if (imgs.length) {
      Promise.race([Promise.all(imgs.map(i => new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))), new Promise(r => setTimeout(r, 2500))]).then(() => { if (tok === this.token) this.relayout(); });
    }
  },
  place(at) {
    if (at.anchor) {
      const t = this.flow.querySelector('#' + CSS.escape(at.anchor));
      if (t) {
        if (this.scroll) { this.vp.scrollTop = t.offsetTop - 20; this.onScroll(); return; }
        const p = Math.floor((t.getBoundingClientRect().left - this.flow.getBoundingClientRect().left + 2) / this.W);
        return this.go(p, false);
      }
    }
    if (this.scroll) {
      const max = this.vp.scrollHeight - this.vp.clientHeight;
      this.vp.scrollTop = at.end ? max : (at.frac || 0) * max;
      this.onScroll(); return;
    }
    const p = at.end ? this.pages - 1 : Math.round((at.frac || 0) * (this.pages - 1));
    this.go(p, false);
  },
  layout() {
    const r = this.vp.getBoundingClientRect();
    const W = Math.round(r.width), H = Math.round(r.height);
    const fs = Settings.t.size;
    const base = { s: 20, m: 40, l: 72 }[Settings.t.margin] || 40;
    const P0 = W < 600 ? Math.round(base * 0.5) + 6 : base;
    const measure = Math.round(fs * 33);
    this.vp.classList.toggle('scroll', this.scroll);
    if (this.scroll) {
      Object.assign(this.flow.style, { width: Math.min(W - 2 * P0, measure) + 'px', height: '', left: '', columnWidth: '', columnGap: '', columnCount: '', transform: '' });
      this.flow.style.setProperty('--colh', H + 'px');
      return;
    }
    const cols = Settings.t.spread && W >= 1100 ? 2 : 1;
    const P = cols === 2 ? Math.max(P0, Math.floor((W - 2 * measure) / 4)) : Math.max(P0, Math.floor((W - measure) / 2));
    const top = 12, bottom = 12;
    const cw = W - 2 * P, colW = cols === 2 ? (cw - 2 * P) / 2 : cw;
    this.W = W; this.P = P;
    Object.assign(this.flow.style, { left: P + 'px', top: top + 'px', width: cw + 'px', height: (H - top - bottom) + 'px', columnWidth: colW + 'px', columnGap: 2 * P + 'px', columnCount: cols, columnFill: 'auto' });
    this.flow.style.setProperty('--colh', (H - top - bottom) + 'px');
    const fl = this.flow.getBoundingClientRect(), e = this.end.getBoundingClientRect();
    this.pages = Math.max(1, Math.floor((e.left - fl.left + 1) / W) + 1);
  },
  relayout() {
    if (!this.model) return;
    const f = this.frac;
    this.layout();
    this.place({ frac: f });
  },
  go(p, anim) {
    const prev = this.page;
    this.page = clamp(p, 0, this.pages - 1);
    if (anim && this.page !== prev && !RM.matches) this.turn(prev, this.page > prev);
    this.flow.classList.remove('anim');
    this.flow.style.transform = `translate3d(${-this.page * this.W}px,0,0)`;
    this.frac = this.pages > 1 ? this.page / (this.pages - 1) : 0;
    this.report();
  },
  turn(from, fwd) { this.playSheet(this.makeSheet(from, fwd), fwd); },
  // копия страницы, которую видно сейчас; при смене главы её делаем до подмены текста
  makeSheet(from, fwd) {
    const two = this.flow.style.columnCount === '2';
    const half = this.W / 2;
    const sheet = el('div', { class: 'leafturn' });
    // в развороте переворачивается одна половина: вперёд — правая, назад — левая
    if (two) Object.assign(sheet.style, fwd ? { left: half + 'px', width: half + 'px' } : { left: '0px', width: half + 'px' });
    const clone = this.flow.cloneNode(true);
    clone.removeAttribute('id'); clone.classList.remove('anim', 'swap');
    clone.style.transform = `translate3d(${-from * this.W - (two && fwd ? half : 0)}px,0,0)`;
    sheet.append(clone);
    return sheet;
  },
  playSheet(sheet, fwd) {
    if (!sheet || RM.matches) return;
    $$('.leafturn, .turn-cast', this.vp).forEach(n => n.remove()); // быстрое листание: прошлый лист уже не нужен
    this.vp.append(sheet);
    turnSheet(sheet, fwd ? 'left' : 'right', this.vp);
  },
  onScroll() {
    const max = this.vp.scrollHeight - this.vp.clientHeight;
    this.frac = max > 0 ? clamp(this.vp.scrollTop / max, 0, 1) : 0;
    this.report();
  },
  report() {
    if (!R.book || !this.model) return;
    const c = this.model.chapters, n = c.length;
    const pct = (this.cum[this.ch] + this.frac * c[this.ch].weight) / this.total;
    const folio = this.scroll ? `${Math.round(this.frac * 100)} %` : `${this.page + 1} / ${this.pages}`;
    R.book.pos = { ch: this.ch, frac: this.frac };
    report(pct, folio, n > 1 ? c[this.ch].title : '', n > 1 ? `глава ${this.ch + 1} из ${n}` : '');
  },
  next() {
    if (this.scroll) { this.vp.scrollBy({ top: this.vp.clientHeight * 0.88, behavior: RM.matches ? 'auto' : 'smooth' }); return; }
    if (this.page < this.pages - 1) { Sound.page(); this.go(this.page + 1, true); }
    else if (this.ch < this.model.chapters.length - 1) { Sound.page(); const sh = RM.matches ? null : this.makeSheet(this.page, true); this.show(this.ch + 1, { frac: 0 }, !sh).then(() => this.playSheet(sh, true)); }
    else toast('Это последняя страница');
  },
  prev() {
    if (this.scroll) { this.vp.scrollBy({ top: -this.vp.clientHeight * 0.88, behavior: RM.matches ? 'auto' : 'smooth' }); return; }
    if (this.page > 0) { Sound.page(); this.go(this.page - 1, true); }
    else if (this.ch > 0) { Sound.page(); const sh = RM.matches ? null : this.makeSheet(this.page, false); this.show(this.ch - 1, { end: true }, !sh).then(() => this.playSheet(sh, false)); }
  },
  seek(pct) {
    const target = pct * this.total; let ch = 0;
    for (let i = 0; i < this.cum.length; i++) if (this.cum[i] <= target) ch = i;
    const frac = clamp((target - this.cum[ch]) / this.model.chapters[ch].weight, 0, 1);
    if (ch === this.ch) this.place({ frac }); else this.show(ch, { frac }, true);
  },
  excerpt() {
    try {
      const r = this.vp.getBoundingClientRect();
      const x = this.scroll ? this.flow.getBoundingClientRect().left + 4 : r.left + this.P + 4;
      const y = r.top + (this.scroll ? 30 : 24);
      const range = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null;
      let node = range?.startContainer, s = '';
      if (node && this.flow.contains(node)) {
        const w = document.createTreeWalker(this.flow, NodeFilter.SHOW_TEXT); w.currentNode = node;
        const skip = n => n.parentElement?.closest('h1, h2, h3, h4, h5, h6, .epigraph, .chap-end, .book-end');
        s = skip(node) ? '' : node.textContent.slice(range.startOffset);
        while (s.length < 90 && (node = w.nextNode())) if (!skip(node)) s += ' ' + node.textContent;
      }
      s = s.replace(/\s+/g, ' ').trim();
      return s ? s.slice(0, 80) + (s.length > 80 ? '…' : '') : '';
    } catch { return ''; }
  },
};
T.vp.addEventListener('scroll', () => { if (T.scroll && T.model) { T.onScroll(); } }, { passive: true });

/* ——————————————————— читалка: страницы ——————————————————— */
const PG = {
  vp: $('#p-vp'), prov: null, i: 0, n: 0, leaf: null, tok: 0, io: null, slots: [],
  get mode() { return Settings.p.mode; },
  get dir() { return R.book?.prefs?.dir || 'ltr'; },
  async open(prov, pos) {
    this.prov = prov; this.n = prov.count; this.i = clamp(pos?.page || 0, 0, this.n - 1);
    await this.build();
  },
  teardown() { this.io?.disconnect(); this.io = null; this.slots = []; this.leaf = null; this.prov = null; },
  async build() {
    this.tok++;
    this.io?.disconnect(); this.io = null; this.leaf = null; this.slots = [];
    this.vp.replaceChildren();
    this.vp.className = 'p-vp' + (this.mode === 'scroll' ? ' scroll' : '') + (Settings.p.fit === 'width' ? ' fitw' : '');
    if (this.mode === 'scroll') this.buildScroll(); else await this.render(this.i, 0);
  },
  group(i) {
    if (this.mode !== 'spread' || this.n < 3 || i === 0) return [i];
    const s = i % 2 === 1 ? i : i - 1;
    return s + 1 < this.n ? [s, s + 1] : [s];
  },
  async render(i, dirSign) {
    const idx = this.group(clamp(i, 0, this.n - 1));
    this.i = idx[0];
    const tok = ++this.tok;
    const r = this.vp.getBoundingClientRect();
    const bw = (idx.length === 2 ? r.width / 2 : r.width) - 16, bh = r.height - 16;
    this.report();
    let els;
    const wait = setTimeout(() => { if (tok === this.tok) this.vp.classList.add('waiting'); }, 220);
    try { els = await Promise.all(idx.map(k => this.prov.element(k, bw, bh, Settings.p.fit))); }
    catch (e) { clearTimeout(wait); this.vp.classList.remove('waiting'); if (tok === this.tok) { console.error(e); toast('Страница не отрисовалась', 'err'); } return; }
    clearTimeout(wait);
    if (tok !== this.tok || !this.prov) return;
    this.vp.classList.remove('waiting');
    const leaf = el('div', { class: 'leaf' + (idx.length === 2 ? ' two' : '') + (this.dir === 'rtl' ? ' rtl' : '') }, ...els);
    const old = this.leaf; this.leaf = leaf;
    $$('.leaf.turning', this.vp).forEach(n => n.remove());
    if (old) this.vp.insertBefore(leaf, old); else this.vp.append(leaf);
    this.vp.scrollTop = 0;
    if (dirSign && old && !RM.matches) {
      // вперёд при чтении слева направо корешок слева; у манги справа налево — наоборот
      const s = dirSign * (this.dir === 'rtl' ? -1 : 1);
      const edge = s > 0 ? 'left' : 'right';
      // в развороте переворачивается одна страница — со стороны листания; поверх неё кладём точную копию картинки
      const kids = Array.from(old.children).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left);
      const node = kids.length === 2 ? (s > 0 ? kids[1] : kids[0]) : kids[0];
      const vr = this.vp.getBoundingClientRect(), r = node.getBoundingClientRect();
      const sheet = el('div', { class: 'leafturn', style: `left:${r.left - vr.left}px;top:${r.top - vr.top + this.vp.scrollTop}px;width:${r.width}px;height:${r.height}px;bottom:auto;background:#fff` });
      // переносим саму картинку: она уже отрисована, копия могла бы мигнуть пустым листом
      node.style.cssText = 'width:100%;height:100%;max-width:none;max-height:none;display:block;object-fit:contain;box-shadow:none';
      sheet.append(node); this.vp.append(sheet);
      old.remove();
      turnSheet(sheet, edge, this.vp);
    } else old?.remove();
    // заранее готовим следующие страницы
    const nx = idx[idx.length - 1] + 1;
    for (let k = nx; k < Math.min(this.n, nx + 3); k++) this.prov.element(k, bw, bh, Settings.p.fit).catch(() => { });
  },
  buildScroll() {
    const col = el('div', { class: 'p-col' });
    const ratio = this.prov.aspect || 1.45;
    for (let k = 0; k < this.n; k++) {
      const slot = el('div', { class: 'pg-slot', style: `aspect-ratio: 1 / ${this.prov.ratio?.(k) || ratio}`, dataset: { k } }, el('span', { class: 'ph' }, String(k + 1)));
      this.slots.push(slot); col.append(slot);
    }
    this.vp.append(col);
    this.io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) this.fill(e.target); }, { root: this.vp, rootMargin: '1400px 0px' });
    this.slots.forEach(s => this.io.observe(s));
    requestAnimationFrame(() => { this.vp.scrollTop = this.slots[this.i]?.offsetTop || 0; this.report(); });
  },
  async fill(slot) {
    if (slot.dataset.done) return; slot.dataset.done = '1';
    const k = +slot.dataset.k;
    try {
      const node = await this.prov.element(k, slot.clientWidth, Infinity, 'width');
      if (!this.slots.includes(slot)) return;
      node.style.width = '100%'; node.style.height = 'auto';
      const before = slot.offsetTop < this.vp.scrollTop ? slot.offsetHeight : 0;
      slot.replaceChildren(node);
      if (node.naturalWidth) slot.style.aspectRatio = `${node.naturalWidth} / ${node.naturalHeight}`; else slot.style.aspectRatio = '';
      // браузер сам удерживает прокрутку (scroll anchoring); вручную — только там, где он этого не умеет
      if (before && !CSS.supports('overflow-anchor', 'auto')) this.vp.scrollTop += slot.offsetHeight - before;
    } catch { slot.dataset.done = ''; }
  },
  onScroll() {
    if (this.mode !== 'scroll' || !this.slots.length) return;
    const y = this.vp.scrollTop + this.vp.clientHeight * 0.3;
    let lo = 0, hi = this.slots.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (this.slots[m].offsetTop <= y) lo = m; else hi = m - 1; }
    if (lo !== this.i) { this.i = lo; }
    this.report();
  },
  report() {
    if (!R.book) return;
    const g = this.mode === 'scroll' ? [this.i] : this.group(this.i);
    R.book.pos = { page: this.i };
    const label = g.length === 2 ? `${g[0] + 1}–${g[1] + 1}` : `${g[0] + 1}`;
    report(this.n > 1 ? g[g.length - 1] / (this.n - 1) : 1, `${label} / ${this.n}`, '', `стр. ${label} из ${this.n}`);
  },
  next() {
    if (this.mode === 'scroll') { this.vp.scrollBy({ top: this.vp.clientHeight * 0.85, behavior: RM.matches ? 'auto' : 'smooth' }); return; }
    const g = this.group(this.i); const nx = g[g.length - 1] + 1;
    if (nx >= this.n) return toast('Это последняя страница');
    Sound.page(); this.render(nx, 1);
  },
  prev() {
    if (this.mode === 'scroll') { this.vp.scrollBy({ top: -this.vp.clientHeight * 0.85, behavior: RM.matches ? 'auto' : 'smooth' }); return; }
    if (this.i <= 0) return;
    Sound.page(); this.render(this.group(this.i - 1)[0], -1);
  },
  seek(pct) {
    const k = Math.round(pct * (this.n - 1));
    if (this.mode === 'scroll') { this.vp.scrollTop = this.slots[k]?.offsetTop || 0; this.onScroll(); }
    else this.render(k, k > this.i ? 1 : -1);
  },
};
PG.vp.addEventListener('scroll', () => PG.onScroll(), { passive: true });

/* ——— навигация в читалке ——— */
const fwd = () => (R.book?.kind === 'pages' ? PG.next() : T.next());
const back = () => (R.book?.kind === 'pages' ? PG.prev() : T.prev());
// «правая сторона» листает вперёд, у манги справа налево — наоборот
const rightSide = () => (R.book?.kind === 'pages' && PG.dir === 'rtl' ? back() : fwd());
const leftSide = () => (R.book?.kind === 'pages' && PG.dir === 'rtl' ? fwd() : back());

$('#r-stage').addEventListener('click', e => {
  if (!R.open || $('#r-loading').hidden === false) return;
  const a = e.target.closest('a');
  if (a) { onLink(e, a); return; }
  if (e.target.closest('button, input, .note-pop')) return;
  if (String(getSelection())) return;
  if (!$('#note-pop').hidden) { hideNote(); return; }
  const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width;
  const paged = R.book.kind === 'pages' ? PG.mode !== 'scroll' : !T.scroll;
  if (paged && x < 0.3) leftSide();
  else if (paged && x > 0.7) rightSide();
  else { setCalm(!reader.classList.contains('calm')); if (!reader.classList.contains('calm')) bumpCalm(); }
});
reader.addEventListener('mousemove', e => {
  const r = reader.getBoundingClientRect();
  if (e.clientY - r.top < 90 || r.bottom - e.clientY < 110) { setCalm(false); bumpCalm(); }
});
let swipe = null;
$('#r-stage').addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') swipe = { x: e.clientX, y: e.clientY, t: Date.now() }; });
$('#r-stage').addEventListener('pointerup', e => {
  if (!swipe) return; const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y; const dt = Date.now() - swipe.t; swipe = null;
  const paged = R.book?.kind === 'pages' ? PG.mode !== 'scroll' : !T.scroll;
  if (paged && dt < 700 && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { if (dx < 0) rightSide(); else leftSide(); }
});
let wheelLock = 0;
$('#r-stage').addEventListener('wheel', e => {
  if (!R.open || loading()) return;
  const paged = R.book.kind === 'pages' ? PG.mode !== 'scroll' && Settings.p.fit !== 'width' : !T.scroll;
  if (!paged || e.ctrlKey) return;
  e.preventDefault();
  const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  if (Math.abs(d) < 12 || Date.now() < wheelLock) return;
  wheelLock = Date.now() + 480;
  d > 0 ? fwd() : back();
}, { passive: false });

document.addEventListener('keydown', e => {
  if (!R.open) return;
  if (e.target.matches?.('input[type="search"], input[type="text"], textarea')) return;
  if (e.key === 'Escape') { e.preventDefault(); if (!$('#note-pop').hidden) hideNote(); else if ($('.panel.on')) closePanels(); else closeReader(); return; }
  if ($('.panel.on') || loading() || e.ctrlKey || e.metaKey || e.altKey) return;
  const textScroll = R.book.kind === 'text' && T.scroll, pageScroll = R.book.kind === 'pages' && PG.mode === 'scroll';
  switch (e.key) {
    case 'ArrowRight': if (!textScroll && !pageScroll) { e.preventDefault(); rightSide(); } break;
    case 'ArrowLeft': if (!textScroll && !pageScroll) { e.preventDefault(); leftSide(); } break;
    case 'PageDown': case ' ': if (!textScroll && !pageScroll) { e.preventDefault(); e.shiftKey ? back() : fwd(); } break;
    case 'PageUp': if (!textScroll && !pageScroll) { e.preventDefault(); back(); } break;
    case 'ArrowDown': if (!textScroll && !pageScroll && !(R.book.kind === 'pages' && Settings.p.fit === 'width')) { e.preventDefault(); fwd(); } break;
    case 'ArrowUp': if (!textScroll && !pageScroll && !(R.book.kind === 'pages' && Settings.p.fit === 'width')) { e.preventDefault(); back(); } break;
    case 'Home': if (R.book.kind === 'pages') PG.seek(0); else T.show(0, { frac: 0 }, true); break;
    case 'End': if (R.book.kind === 'pages') PG.seek(1); else T.show(T.model.chapters.length - 1, { end: true }, true); break;
    default:
      if (/^[tTеЕ]$/.test(e.key)) openPanel('toc');
      else if (/^[bBиИ]$/.test(e.key)) toggleMark();
      else if (/^[fFаА]$/.test(e.key)) toggleFull();
  }
  bumpCalm();
});

function onLink(e, a) {
  e.preventDefault();
  if (a.target === '_blank') { const w = window.open(a.href, '_blank'); if (w) w.opener = null; else toast('Ссылку не удалось открыть: ' + a.href); return; }
  const m = R.model; if (!m) return;
  if (a.dataset.note && m.notes?.has(a.dataset.note)) return showNote(m.notes.get(a.dataset.note));
  if (a.dataset.ch !== undefined && a.dataset.ch !== '') {
    const ch = +a.dataset.ch, frag = a.dataset.frag;
    if (a.classList.contains('note') && frag) {
      T.node(ch).then(n => {
        const t = n.querySelector('#' + CSS.escape(frag));
        let h = t ? (t.textContent.trim().length > 8 ? t : t.closest('p, li, aside, div') || t) : null;
        if (h) showNote(h.innerHTML); else { Sound.page(); T.show(ch, { anchor: frag }, true); }
      });
      return;
    }
    Sound.page(); T.show(ch, { anchor: frag, frac: 0 }, true);
  }
}
function showNote(html) {
  const p = $('#note-pop'); p.innerHTML = html; sanitize(p); p.hidden = false; Sound.panel();
}
function hideNote() { $('#note-pop').hidden = true; }

/* ——— закладки ——— */
function curMarkKey() {
  const p = R.book?.pos; if (!p) return null;
  return R.book.kind === 'pages' ? { page: p.page } : { ch: p.ch, frac: p.frac };
}
function findMark() {
  const b = R.book; const k = curMarkKey(); if (!b || !k) return -1;
  if (b.kind === 'pages') return b.marks.findIndex(m => m.page === k.page);
  const tol = T.scroll ? 0.04 : (T.pages > 1 ? 0.5 / (T.pages - 1) : 0.5);
  return b.marks.findIndex(m => m.ch === k.ch && Math.abs(m.frac - k.frac) <= tol + 1e-6);
}
function updateMarkState() {
  const on = findMark() >= 0;
  $('#r-mark').setAttribute('aria-pressed', String(on));
  $('#ribbon-mark').classList.toggle('on', on);
}
function toggleMark() {
  const b = R.book; if (!b) return;
  const i = findMark();
  if (i >= 0) { b.marks.splice(i, 1); Sound.unmark(); }
  else {
    const k = curMarkKey(); if (!k) return;
    const quote = b.kind === 'text' ? T.excerpt() : '';
    b.marks.push({ ...k, quote, pct: b.pct, at: Date.now(), where: b.kind === 'pages' ? `Страница ${k.page + 1}` : (R.model.chapters[k.ch]?.title || '') });
    Sound.mark();
  }
  updateMarkState(); DB.putBook(b);
  if ($('#panel-toc').classList.contains('on')) renderToc('bm');
}

/* ——— панели ——— */
function openPanel(which) {
  const p = $(which === 'toc' ? '#panel-toc' : '#panel-set');
  if (p.classList.contains('on')) return closePanels();
  closePanels(true);
  if (which === 'toc') {
    const b = R.book;
    $('#p-cover').replaceChildren(el('div', { class: 'mini-cover' }, coverNode(b)), el('div', { style: 'min-width:0' }, el('b', {}, b.title), el('span', {}, [b.author, b.marks.length ? `${b.marks.length} ${plural(b.marks.length, ['закладка', 'закладки', 'закладок'])}` : ''].filter(Boolean).join(' · '))));
    renderToc(R.book.kind === 'pages' ? 'bm' : 'toc');
  } else renderSettings();
  const s = $('#scrim'); s.hidden = false; p.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { s.classList.add('on'); p.classList.add('on'); }));
  setCalm(false); clearTimeout(calmT);
  Sound.panel();
  setTimeout(() => p.querySelector('[aria-selected="true"], .cur button, button')?.focus({ preventScroll: true }), 60);
}
function closePanels(instant) {
  const open = $$('.panel.on'); const s = $('#scrim');
  if (!open.length && s.hidden) return;
  if (!instant) Sound.panel();
  open.forEach(p => p.classList.remove('on')); s.classList.remove('on');
  setTimeout(() => { $$('.panel').forEach(p => { if (!p.classList.contains('on')) p.hidden = true; }); if (!$('.panel.on')) s.hidden = true; }, instant ? 0 : 430);
  bumpCalm();
}
$('#scrim').addEventListener('click', () => closePanels());
$$('.panel [data-close]').forEach(b => b.addEventListener('click', () => closePanels()));
$$('#panel-toc .p-tabs button').forEach(b => b.addEventListener('click', () => { Sound.tap(); renderToc(b.dataset.pt); }));

function renderToc(tab) {
  $$('#panel-toc .p-tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pt === tab)));
  const body = $('#toc-body'); const b = R.book;
  if (tab === 'toc') {
    if (b.kind === 'pages') {
      const n = PG.n, step = n > 60 ? 10 : n > 20 ? 5 : 1;
      const items = []; for (let k = 0; k < n; k += step) items.push(k);
      body.replaceChildren(el('ul', { class: 'toc' }, items.map(k => el('li', { class: PG.i >= k && PG.i < k + step ? 'cur' : '' },
        el('button', { onclick: () => { closePanels(); PG.seek(n > 1 ? k / (n - 1) : 0); } }, `Страница ${k + 1}`, el('span', { class: 'x' }, `${Math.round(k / Math.max(1, n - 1) * 100)} %`))))));
      return;
    }
    const toc = R.model.toc.length ? R.model.toc : R.model.chapters.map((c, i) => ({ title: c.title, ch: i, lvl: 0 }));
    let curIdx = -1; toc.forEach((t, i) => { if (t.ch <= T.ch) curIdx = i; });
    // если у главы несколько пунктов, отмечаем первый подходящий
    const firstOfCh = toc.findIndex(t => t.ch === T.ch); if (firstOfCh >= 0 && toc[curIdx]?.ch === T.ch) curIdx = firstOfCh;
    const list = el('ul', { class: 'toc' }, toc.map((t, i) => el('li', { class: `lvl${t.lvl || 0}` + (i === curIdx ? ' cur' : '') },
      el('button', { onclick: () => { closePanels(); Sound.page(); T.show(t.ch, { anchor: t.anchor, frac: 0 }, true); } }, t.title || '—',
        el('span', { class: 'x' }, `${Math.round(T.cum[t.ch] / T.total * 100)} %`)))));
    body.replaceChildren(list);
    requestAnimationFrame(() => body.querySelector('.cur')?.scrollIntoView({ block: 'center' }));
  } else {
    const marks = [...b.marks].sort((x, y) => (x.pct || 0) - (y.pct || 0));
    if (!marks.length) { body.replaceChildren(el('p', { class: 'bm-empty' }, 'Закладок пока нет. Нажмите на ленточку вверху или клавишу B, чтобы заложить страницу.')); return; }
    body.replaceChildren(...marks.map(m => el('div', { class: 'bm-row' },
      el('button', { onclick: () => { closePanels(); Sound.page(); if (b.kind === 'pages') PG.seek(PG.n > 1 ? m.page / (PG.n - 1) : 0); else if (m.ch === T.ch) T.place({ frac: m.frac }); else T.show(m.ch, { frac: m.frac }, true); } },
        el('span', { class: 'q' }, m.quote ? `«${m.quote}»` : m.where), el('span', { class: 'w' }, `${m.where ? m.where + ' · ' : ''}${Math.round((m.pct || 0) * 100)} %`)),
      el('button', { class: 'bm-del', 'aria-label': 'Удалить закладку', html: ICON.x, onclick: () => { b.marks.splice(b.marks.indexOf(m), 1); DB.putBook(b); Sound.unmark(); updateMarkState(); renderToc('bm'); } }))));
  }
}

function seg(label, opts, val, on) {
  return el('div', { class: 'set-group' }, el('div', { class: 'set-label' }, label),
    el('div', { class: 'seg' }, opts.map(([v, t]) => el('button', { 'aria-pressed': String(v === val), onclick: e => { Sound.tap(); $$('button', e.currentTarget.parentNode).forEach(b => b.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); on(v); } }, t))));
}
function toggleRow(label, val, on) {
  const sw = el('button', { class: 'switch', role: 'switch', 'aria-checked': String(val), 'aria-label': label, onclick: () => { const v = sw.getAttribute('aria-checked') !== 'true'; sw.setAttribute('aria-checked', String(v)); Sound.toggle(); on(v); } });
  return el('div', { class: 'toggle-row' }, el('span', {}, label), sw);
}
function stepper(label, val, min, max, step, fmt, on) {
  const out = el('b', {}, fmt(val)); const bar = el('i', { style: `--v:${((val - min) / (max - min)).toFixed(3)}` });
  const set = d => { val = +clamp(+(val + d).toFixed(2), min, max); out.textContent = fmt(val); bar.style.setProperty('--v', ((val - min) / (max - min)).toFixed(3)); Sound.step((val - min) / (max - min)); on(val); };
  return el('div', { class: 'set-group' }, el('div', { class: 'set-label' }, label, out),
    el('div', { class: 'stepper' }, el('button', { 'aria-label': 'Меньше', onclick: () => set(-step) }, '−'), el('div', { class: 'val' }, bar), el('button', { 'aria-label': 'Больше', onclick: () => set(step) }, '+')));
}
function renderSettings() {
  const body = $('#set-body'); const pages = R.book.kind === 'pages';
  if (!pages) needFont('literata');
  const S = pages ? Settings.p : Settings.t;
  const sw = [['auto', 'Как у сайта', 'var(--leaf)', 'var(--ink)'], ['paper', 'Бумага', '#F7F0E4', '#2A1E15'], ['sepia', 'Сепия', '#E6D3B3', '#3A2817'], ['night', 'Ночь', '#110D0A', '#DCCDB8']];
  const theme = el('div', { class: 'set-group' }, el('div', { class: 'set-label' }, 'Тон бумаги'),
    el('div', { class: 'swatches' }, sw.map(([v, t, bg, fg]) => el('button', { class: 'swatch', title: t, 'aria-label': t, 'aria-pressed': String(S.rt === v), style: `background:${bg};color:${fg}`, onclick: e => { S.rt = v; Settings.save(); Sound.tap(); $$('.swatch', body).forEach(b => b.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); applyReaderLook(); } }, 'Аа'))));
  const relayoutText = () => { Settings.save(); applyReaderLook(); requestAnimationFrame(() => T.relayout()); };
  if (!pages) {
    body.replaceChildren(theme,
      el('div', { class: 'set-group' }, el('div', { class: 'set-label' }, 'Гарнитура'),
        el('div', { class: 'fonts' }, Object.entries(FONTS).map(([k, [f, name]]) => el('button', { class: 'fontb', 'aria-pressed': String(Settings.t.font === k), onclick: e => { Settings.t.font = k; Sound.tap(); $$('.fontb', body).forEach(b => b.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); relayoutText(); } },
          el('span', { class: 'aa', style: `font-family:${f}` }, 'Аа'), el('small', {}, name))))),
      stepper('Кегль', Settings.t.size, 14, 30, 1, v => v + ' пт', v => { Settings.t.size = v; relayoutText(); }),
      stepper('Интерлиньяж', Settings.t.lh, 1.3, 2.1, 0.1, v => v.toFixed(1).replace('.', ','), v => { Settings.t.lh = v; relayoutText(); }),
      seg('Поля', [['s', 'Узкие'], ['m', 'Средние'], ['l', 'Широкие']], Settings.t.margin, v => { Settings.t.margin = v; relayoutText(); }),
      seg('Вёрстка', [['paged', 'Страницы'], ['scroll', 'Лента']], Settings.t.layout, v => { Settings.t.layout = v; Settings.save(); const f = T.frac; T.show(T.ch, { frac: f }, true); }),
      el('div', { class: 'set-group' },
        toggleRow('Выключка по ширине', Settings.t.justify, v => { Settings.t.justify = v; relayoutText(); }),
        toggleRow('Буквица в начале главы', Settings.t.dropcap, v => { Settings.t.dropcap = v; relayoutText(); }),
        toggleRow('Разворот на широком экране', Settings.t.spread, v => { Settings.t.spread = v; relayoutText(); })));
  } else {
    body.replaceChildren(theme,
      seg('Показ', [['single', 'Страница'], ['spread', 'Разворот'], ['scroll', 'Лента']], Settings.p.mode, v => { Settings.p.mode = v; Settings.save(); PG.build(); }),
      seg('Направление', [['ltr', 'Слева направо'], ['rtl', 'Справа налево']], PG.dir, v => { R.book.prefs = { ...(R.book.prefs || {}), dir: v }; DB.putBook(R.book); PG.build(); }),
      seg('Масштаб', [['height', 'По высоте'], ['width', 'По ширине']], Settings.p.fit, v => { Settings.p.fit = v; Settings.save(); PG.build(); }),
      el('p', { class: 'bm-empty' }, 'Для манги включите «Справа налево»: листать нужно будет щелчком по левому краю, а разворот сложится как в оригинале.'));
  }
}

function toggleFull() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
  else reader.requestFullscreen?.().catch(() => toast('Полноэкранный режим здесь недоступен'));
  Sound.tap();
}

$('#r-back').addEventListener('click', () => closeReader());
$('#r-toc').addEventListener('click', () => openPanel('toc'));
$('#r-set').addEventListener('click', () => openPanel('set'));
$('#r-mark').addEventListener('click', toggleMark);
$('#r-full').addEventListener('click', toggleFull);
$('#r-scrub').addEventListener('input', e => { $('#r-scrub-a').textContent = Math.round(e.target.value / 10) + ' %'; bumpCalm(); });
$('#r-scrub').addEventListener('change', e => { const v = e.target.value / 1000; Sound.page(); if (R.book.kind === 'pages') PG.seek(v); else T.seek(v); });
window.addEventListener('resize', debounce(() => { if (!R.open) { moveInk($('#nav-pill'), $('.tab[aria-selected="true"]')); moveInk($('#chip-ink'), $('#chips .chip[aria-pressed="true"]')); return; } if (loading()) return; if (R.book.kind === 'text') T.relayout(); else if (PG.mode !== 'scroll') PG.render(PG.i, 0); }, 160));
document.fonts?.ready.then(() => { moveInk($('#nav-pill'), $('.tab[aria-selected="true"]')); moveInk($('#chip-ink'), $('#chips .chip[aria-pressed="true"]')); if (R.open && R.book.kind === 'text') T.relayout(); });

/* ——————————————————— каталог ——————————————————— */
const WS = 'https://ru.wikisource.org/w/api.php';
const SE = 'https://standardebooks.org';
// четвёртое поле — номер обложки в Open Library, найден заранее: поиск там отвечает медленно
const RU_FEATURED = [
  ['Пиковая дама (Пушкин)', 'Пиковая дама', 'Александр Пушкин'],
  ['Капитанская дочка (Пушкин)', 'Капитанская дочка', 'Александр Пушкин', 893480],
  ['Шинель (Гоголь)', 'Шинель', 'Николай Гоголь', 7496125],
  ['Нос (Гоголь)', 'Нос', 'Николай Гоголь', 1826768],
  ['Герой нашего времени (Лермонтов)', 'Герой нашего времени', 'Михаил Лермонтов', 104294],
  ['Муму (Тургенев)', 'Муму', 'Иван Тургенев'],
  ['Белые ночи (Достоевский)', 'Белые ночи', 'Фёдор Достоевский', 3293338],
  ['Дама с собачкой (Чехов)', 'Дама с собачкой', 'Антон Чехов', 12996387],
  ['Человек в футляре (Чехов)', 'Человек в футляре', 'Антон Чехов', 12769850],
  ['Палата № 6 (Чехов)', 'Палата № 6', 'Антон Чехов', 12767423],
  ['Смерть Ивана Ильича (Толстой)', 'Смерть Ивана Ильича', 'Лев Толстой', 419697],
  ['После бала (Толстой)', 'После бала', 'Лев Толстой'],
  ['Левша (Лесков)', 'Левша', 'Николай Лесков', 9150574],
  ['Бедная Лиза (Карамзин)', 'Бедная Лиза', 'Николай Карамзин'],
  ['Гранатовый браслет (Куприн)', 'Гранатовый браслет', 'Александр Куприн', 14361482],
  ['Старуха Изергиль (Горький)', 'Старуха Изергиль', 'Максим Горький'],
];
/* ——— загрузка и сохранение файлов ——— */
// выполняет задачи не больше n одновременно, результат — в исходном порядке
async function pool(tasks, n) {
  const out = new Array(tasks.length); let next = 0;
  const worker = async () => { while (next < tasks.length) { const i = next++; out[i] = await tasks[i](); } };
  await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, worker));
  return out;
}
// читает ответ по кусочкам, чтобы показывать проценты
async function readBlob(r, onP = () => { }) {
  const total = +r.headers.get('content-length') || 0;
  if (!r.body || !total) { const b = await r.blob(); onP(1); return b; }
  const reader = r.body.getReader(); const parts = []; let got = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); got += value.length; onP(Math.min(1, got / total)); }
  return new Blob(parts, { type: r.headers.get('content-type') || '' });
}
const fileName = (title, ext) => (String(title).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'kniga') + '.' + ext;
function saveBlob(blob, name) {
  const a = el('a', { href: URL.createObjectURL(blob), download: name, style: 'display:none' });
  document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
  Sound.add(); toast(`Сохраняю «${name}»`);
}
// собирает EPUB 3 из глав (книги из Викитеки и примеры на полке)
async function buildEpub(data) {
  await needZip();
  const zip = new JSZip(); const ser = new XMLSerializer();
  const id = 'urn:uuid:' + (crypto.randomUUID ? crypto.randomUUID() : uid());
  const xhtml = (title, body) => `<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ru" xml:lang="ru"><head><meta charset="utf-8"/><title>${esc(title)}</title><link rel="stylesheet" href="style.css"/></head><body>${body}</body></html>`;
  const toX = html => { const d = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html'); const box = d.body.firstElementChild; box.querySelectorAll('img').forEach(i => { if (!/^https?:/.test(i.getAttribute('src') || '')) i.remove(); }); return Array.from(box.childNodes).map(n => ser.serializeToString(n)).join(''); };
  const chapters = [...data.chapters];
  if (data.notes?.length) chapters.push({ title: 'Примечания', html: '<h2>Примечания</h2>' + data.notes.map(([k, h]) => `<div id="${esc(k)}">${h}</div>`).join('') });
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  zip.file('OEBPS/style.css', 'body{font-family:serif;line-height:1.5;margin:0 4%}p{margin:0;text-indent:1.5em}h1,h2,h3{text-align:center;font-weight:600}.poem{margin:1em 0 1em 1.5em}.poem p,.v{text-indent:0}.ta{text-align:right}blockquote{font-style:italic}');
  chapters.forEach((c, i) => zip.file(`OEBPS/c${i + 1}.xhtml`, xhtml(c.title, toX(c.html))));
  zip.file('OEBPS/nav.xhtml', xhtml('Содержание', `<nav epub:type="toc" id="toc"><h1>Содержание</h1><ol>${chapters.map((c, i) => `<li><a href="c${i + 1}.xhtml">${esc(c.title)}</a></li>`).join('')}</ol></nav>`));
  zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bid">${id}</dc:identifier><dc:title>${esc(data.title)}</dc:title><dc:creator>${esc(data.author || '')}</dc:creator><dc:language>ru</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="style.css" media-type="text/css"/>${chapters.map((c, i) => `<item id="c${i + 1}" href="c${i + 1}.xhtml" media-type="application/xhtml+xml"/>`).join('')}</manifest><spine>${chapters.map((c, i) => `<itemref idref="c${i + 1}"/>`).join('')}</spine></package>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip', compression: 'DEFLATE' });
}
// книга с полки — в файл: свой формат отдаём как есть, книги из Викитеки — в EPUB
async function exportBook(b) {
  if (b.fmt === 'iapages') { const j = JSON.parse(await (await DB.file(b.id)).text()); window.open(`https://archive.org/details/${encodeURIComponent(j.id)}`, '_blank', 'noopener'); return; }
  const blob = await DB.file(b.id); if (!blob) { toast('Файл книги не найден', 'err'); return; }
  if (b.fmt === 'json') { saveBlob(await buildEpub(JSON.parse(await blob.text())), fileName(b.title, 'epub')); return; }
  saveBlob(blob, fileName(b.title, b.fmt));
}

/* ——— обложки для каталога ——— */
function addCoverImg(box, url) {
  const img = new Image(); img.alt = ''; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
  img.onload = () => { if (img.naturalWidth > 12) img.classList.add('ok'); else img.remove(); };
  img.onerror = () => img.remove();
  img.src = url; box.prepend(img);
}
// у Викитеки обложек нет — ищем издание в Open Library; не больше трёх запросов одновременно
const coverCache = new Map(store.get('olc', []));
const coverQueue = []; let coverBusy = 0;
function pumpCovers() {
  while (coverBusy < 6 && coverQueue.length) {
    const [it, box] = coverQueue.shift(); coverBusy++;
    findCover(it).then(u => { if (u && box.isConnected) addCoverImg(box, u); }).finally(() => { coverBusy--; pumpCovers(); });
  }
}
const coverObserver = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; coverObserver.unobserve(e.target);
  coverQueue.push([e.target._it, e.target]); pumpCovers();
}), { rootMargin: '300px' });
async function findCover(it) {
  const k = it.title + '|' + it.author;
  if (coverCache.has(k)) return coverCache.get(k);
  let url = '';
  try {
    const last = (it.author || '').split(' ').pop();
    // сначала название + фамилия, потом самое переиздаваемое издание с таким названием
    const tries = [`title=${encodeURIComponent(it.title)}${last ? '&author=' + encodeURIComponent(last) : ''}`, `q=${encodeURIComponent(`title:"${it.title}"`)}&sort=editions`];
    let c = null;
    for (const q of tries) {
      const j = await (await fetch(`https://openlibrary.org/search.json?${q}&fields=cover_i&limit=8`)).json();
      c = j.docs?.find(d => d.cover_i)?.cover_i; if (c) break;
    }
    if (c) url = `https://covers.openlibrary.org/b/id/${c}-M.jpg`;
  } catch { /* без обложки */ }
  coverCache.set(k, url); store.set('olc', [...coverCache].slice(-400));
  return url;
}

const SRC_LABEL = { ru: 'Викитека', world: 'Standard Ebooks', comics: 'Internet Archive', ia: 'Internet Archive', shiki: 'Shikimori', ol: 'Open Library', lib: 'Библиотека Zakladka' };
const SHIKI = 'https://shikimori.io';
const SHIKI_KIND = { manga: 'Манга', manhwa: 'Манхва', manhua: 'Маньхуа', one_shot: 'Ваншот', light_novel: 'Ранобэ', novel: 'Новелла', doujin: 'Додзинси' };
// официальные площадки, где мангу читают легально (их ссылки берём из AniList)
const READ_SITES = /manga ?plus|viz|shonen jump|k ?manga|comikey|azuki|inkr|mangamo|bookwalker|kodansha|yen press|webtoon|tapas|tappytoon|lezhin|pocket comics|manta|comic walker|piccoma|line manga|kakao|naver|seven seas|j-novel|bilibili|crunchyroll|amazon|kindle|cmoa|ebookjapan|renta|mangatoon|tencent|kuaikan|izneo|glénat|planet manga|xl media|азбука|альт граф|истари|комикс ?стор|libri|readmanga/i;
const keyOf = it => ({ ru: 'ws:' + it.page, world: 'se:' + it.path, comics: 'ia:' + it.id, ia: 'ia:' + it.id, shiki: 'sh:' + it.id, lib: 'lib:' + it.id }[it.src]);
const KIND_LABEL = { book: 'Книга', manga: 'Манга', comic: 'Комикс', scan: 'Скан', manhwa: 'Манхва', manhua: 'Маньхуа' };
const HINTS = ['Блич', 'Магическая битва', 'Чехов', 'Black Clover', 'Наруто', 'Frankenstein', 'Боруто', 'Пиковая дама', 'Ван-Пис', 'Dracula', 'Атака титанов', 'Толстой'];
// IA: комиксы ace-comics и старая японская манга (Хокусай и др.) — всё в общественном достоянии
const IA_MANGA = '(title:"hokusai manga" OR subject:manga) AND mediatype:texts AND format:"Single Page Processed JP2 ZIP" AND date:[1600-01-01 TO 1929-12-31] AND -collection:inlibrary AND -collection:printdisabled';
const IA_SCANS = 'mediatype:texts AND format:"Single Page Processed JP2 ZIP" AND year:[1700 TO 1925] AND -collection:inlibrary AND -collection:printdisabled AND -subject:manga';
const IA_CLASSICS = 'creator:(Пушкин OR Гоголь OR Чехов OR Толстой OR Достоевский OR Тургенев OR Лермонтов OR Лесков OR Гончаров OR Pushkin OR Gogol OR Chekhov OR Tolstoy OR Dostoyevsky OR Turgenev OR Lermontov OR Dickens OR Austen OR Twain)';
/* ——— наша библиотека (library/index.json): книги и манга, которые хранятся на самом сайте ——— */
const Library = {
  items: null, loading: null,
  load() {
    if (this.items) return Promise.resolve(this.items);
    this.loading ||= fetch('library/index.json' + (VER ? '?v=' + VER : '')).then(r => (r.ok ? r.json() : { items: [] })).then(j => {
      this.items = (Array.isArray(j) ? j : j.items || []).map(it => ({ ...it, _hay: norm([it.title, it.author, it.series, it.genre, it.desc].filter(Boolean).join(' ')) }));
      return this.items;
    }).catch(() => (this.items = []));
    return this.loading;
  },
  // подборка для пустого поиска: по очереди манга, русская и английская классика, чтобы сразу было видно всё
  featured(list) {
    const groups = [list.filter(i => i.kind !== 'book' && (!i.volume || i.volume === 1)), list.filter(i => i.kind === 'book' && i.lang === 'ru'), list.filter(i => i.kind === 'book' && i.lang !== 'ru')];
    const out = []; for (let i = 0; out.length < list.length && i < 400; i++) for (const g of groups) if (g[i]) out.push(g[i]);
    return out;
  },
};
const norm = t => String(t || '').toLowerCase().replace(/ё/g, 'е').replace(/[«»"'’.,:;!?()—–-]+/g, ' ').replace(/\s+/g, ' ').trim();
const Catalog = {
  inited: false, results: [], req: 0, type: store.get('ftype', 'all'), lang: store.get('flang', 'all'), q: '', cursors: new Map(),
  init() {
    if (this.inited) return; this.inited = true;
    if (this.type === 'comic') this.type = 'manga';
    [['#f-type', 'type', 'ftype'], ['#f-lang', 'lang', 'flang']].forEach(([sel, key, sk]) => {
      const box = $(sel);
      $$('.chip', box).forEach(c => {
        c.setAttribute('aria-pressed', String(c.dataset.v === this[key]));
        c.addEventListener('click', () => { if (this[key] === c.dataset.v) return; this[key] = c.dataset.v; store.set(sk, this[key]); Sound.swish(); $$('.chip', box).forEach(x => x.setAttribute('aria-pressed', String(x === c))); moveInk($('.chip-ink', box), c); this.run(this.q); });
      });
      requestAnimationFrame(() => moveInk($('.chip-ink', box), $(`.chip[data-v="${this[key]}"]`, box)));
    });
    this.hints();
    this.run('');
  },
  status(t) { $('#cat-status').textContent = t || ''; },
  // подсказка в пустом поиске печатается и стирается сама
  hints() {
    const box = $('#cat-form'), out = $('#omni-hint'), input = $('#cat-q');
    input.addEventListener('input', () => box.classList.toggle('typing', !!input.value));
    if (RM.matches) { out.textContent = 'Название, автор или манга'; return; }
    let i = 0, n = 0, dir = 1, hold = 0;
    setInterval(() => {
      if (View.cur !== 'catalog' || input.value || document.activeElement === input) return;
      if (hold) { hold--; return; }
      const w = 'Например: ' + HINTS[i % HINTS.length];
      n += dir; out.textContent = w.slice(0, n);
      if (n >= w.length) { dir = -1; hold = 22; } else if (n <= 10 && dir < 0) { dir = 1; i++; hold = 4; }
    }, 70);
  },
  // источники: у каждого своя выдача, всё сливается в один список
  sources() {
    return [
      { id: 'lib', name: 'Наша библиотека', type: 'any', langs: ['ru', 'en', 'ja'], run: (q, page) => this.fromLib(q, page) },
      { id: 'ws', name: 'Викитека', type: 'book', langs: ['ru'], run: (q, page) => this.fromWs(q, page) },
      { id: 'ol', name: 'Open Library', type: 'book', langs: ['ru', 'en'], run: (q, page) => this.fromOl(q, page) },
      { id: 'se', name: 'Standard Ebooks', type: 'book', langs: ['en'], run: (q, page) => this.fromSe(q, page) },
      { id: 'sh', name: 'Манга · Shikimori', type: 'manga', langs: ['ru', 'en'], run: (q, page) => this.fromShiki(q, page) },
      { id: 'iam', name: 'Старая манга', type: 'manga', langs: ['en', 'ja'], run: (q, page) => this.fromIA(q, page, 'comics') },
      { id: 'ias', name: 'Сканы изданий', type: 'scan', langs: ['ru', 'en'], run: (q, page) => this.fromIA(q, page, 'ia') },
    ].filter(s => (this.type === 'all' || s.type === this.type || s.type === 'any') && (this.lang === 'all' || s.langs.includes(this.lang)));
  },
  async fromLib(q, page) {
    const all = await Library.load();
    const t = this.type, l = this.lang, words = norm(q).split(' ').filter(Boolean);
    let list = all.filter(i => (t === 'all' || (t === 'book' ? i.kind === 'book' : t === 'manga' ? i.kind !== 'book' : false)) && (l === 'all' || i.lang === l));
    if (words.length) {
      list = list.filter(i => words.every(w => i._hay.includes(w)));
      const first = norm(q);
      const score = i => (norm(i.title).startsWith(first) ? 0 : norm(i.title).includes(first) ? 1 : norm(i.author).includes(first) ? 2 : 3);
      list.sort((a, b) => score(a) - score(b) || (a.series === b.series ? (a.volume || 0) - (b.volume || 0) : 0));
    } else list = Library.featured(list);
    const per = 24, slice = list.slice(page * per, page * per + per);
    const mb = n => n ? (n / 1048576).toFixed(1).replace('.', ',') + ' МБ' : '';
    const items = slice.map(i => ({
      src: 'lib', kind: i.kind === 'book' ? 'book' : i.kind === 'comic' ? 'comic' : 'manga', lang: i.lang === 'ja' ? 'ja' : i.lang,
      id: i.id, title: i.title, author: i.author || '', file: i.file, fmt: i.fmt, cover: i.cover, license: i.license, credit: i.credit, source: i.source, desc: i.desc, rtl: i.rtl,
      extra: [i.series && i.volume ? `${i.kind === 'book' ? 'том' : '№'} ${i.volume}` : '', i.genre, i.year, i.pages ? i.pages + ' стр.' : '', mb(i.size)].filter(Boolean).join(' · '),
    }));
    const more = (page + 1) * per < list.length;
    return { items, total: list.length, next: more ? () => this.fromLib(q, page + 1) : null };
  },
  async fetchLib(it, key, onP = () => { }) {
    const r = await fetch(it.file);
    if (!r.ok) throw new Error('Файл библиотеки не найден, попробуйте позже');
    const blob = await readBlob(r, onP);
    // название и автор — из нашего каталога (в файлах они бывают на другом языке или с пометками)
    return addBook(it.fmt, blob, it.file.split('/').pop(), { srcKey: key, title: it.title, ...(it.author ? { author: it.author } : {}) });
  },
  // Shikimori: огромная база манги, манхвы и маньхуа с русскими названиями; читать — по официальным ссылкам
  async fromShiki(q, page) {
    const url = `${SHIKI}/api/mangas?limit=24&page=${page + 1}&order=${q ? 'popularity' : 'popularity'}&censored=true&kind=manga,manhwa,manhua,one_shot${q ? '&search=' + encodeURIComponent(q) : ''}`;
    const list = await this.api(url, this.ctrl?.signal);
    const items = (list || []).map(m => ({
      src: 'shiki', kind: SHIKI_KIND[m.kind] && ['manhwa', 'manhua'].includes(m.kind) ? m.kind : 'manga', lang: 'ru',
      id: m.id, title: m.russian || m.name, author: m.russian && m.name !== m.russian ? m.name : '',
      extra: [SHIKI_KIND[m.kind], m.aired_on?.slice(0, 4), m.chapters ? m.chapters + ' гл.' : ''].filter(Boolean).join(' · '),
      cover: m.image?.original && !/missing/.test(m.image.original) ? SHIKI + m.image.original : '', score: m.score, url: SHIKI + m.url,
    }));
    return { items, total: items.length >= 24 ? (page + 1) * 24 + '+' : page * 24 + items.length, next: items.length >= 24 ? () => this.fromShiki(q, page + 1) : null };
  },
  // Open Library: миллионы изданий; берём только те, что выложены в архив целиком (их можно читать сканом)
  async fromOl(q, page) {
    if (!q) return { items: [], total: 0, next: null };
    const lang = this.lang === 'ru' ? '&language=rus' : this.lang === 'en' ? '&language=eng' : '';
    const j = await this.api(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&ebook_access=public&fields=key,title,author_name,first_publish_year,ia,cover_i,language&limit=24&page=${page + 1}${lang}`, this.ctrl?.signal);
    const cyr = /[а-яё]/i.test(q);
    const items = (j.docs || []).map(d => {
      const ia = (d.ia || []).find(x => !/librivox|gutenberg|synapseml|_mp3|audio/i.test(x));
      if (!ia) return null;
      const langs = d.language || [];
      return { src: 'ia', kind: 'book', id: ia, title: d.title, author: (d.author_name || []).slice(0, 2).join(', '), lang: langs.includes('rus') && (cyr || !langs.includes('eng')) ? 'ru' : 'en', extra: d.first_publish_year ? String(d.first_publish_year) : '', cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : `https://archive.org/services/img/${encodeURIComponent(ia)}` };
    }).filter(Boolean);
    const total = j.numFound || 0;
    return { items, total, next: (page + 1) * 24 < total ? () => this.fromOl(q, page + 1) : null };
  },
  pills(list) {
    $('#src-pills').replaceChildren(...list.map((s, i) => el('span', { class: 'src-pill loading', style: `--i:${i}`, dataset: { id: s.id } }, el('i'), s.name, el('b', {}, ''))));
  },
  pill(id, state, n) {
    const p = $(`#src-pills .src-pill[data-id="${id}"]`); if (!p) return;
    p.className = 'src-pill ' + state; p.querySelector('b').textContent = state === 'done' ? String(n) : state === 'err' ? 'нет связи' : '';
  },
  async run(q) {
    q = (q || '').trim(); this.q = q;
    const req = this.loading(++this.req);
    const list = this.sources();
    this.pills(list); this.cursors = new Map(); let total = 0, first = true;
    this.status(q ? `Ищу «${q}»…` : 'Подборка из всех источников');
    if (!list.length) { $('#cat-list').replaceChildren(); this.status('Для такого сочетания фильтров источников нет. Попробуйте другой язык.'); return; }
    await Promise.all(list.map(async (s, order) => {
      try {
        const r = await s.run(q, 0);
        if (req !== this.req) return;
        this.cursors.set(s.id, r.next);
        if (r.items.length) { this.show(r.items, !first, order); first = false; }
        total += r.items.length; this.pill(s.id, 'done', r.total ?? r.items.length);
      } catch (e) { if (req !== this.req || e.name === 'AbortError') return; console.warn(s.id, e); this.pill(s.id, 'err'); }
    }));
    if (req !== this.req) return;
    if (!total) { $('#cat-list').replaceChildren(); this.status(q ? `По запросу «${q}» ничего не нашлось. Проверьте написание или снимите фильтры.` : 'Источники сейчас не отвечают. Полка и свои файлы при этом работают.'); }
    else {
      const lib = Library.items || [];
      const books = lib.filter(i => i.kind === 'book').length, manga = lib.length - books;
      this.status(q ? `Нашлось по запросу «${q}»` : lib.length ? `В нашей библиотеке ${books} ${plural(books, ['книга', 'книги', 'книг'])} и ${manga} ${plural(manga, ['выпуск', 'выпуска', 'выпусков'])} манги и комиксов, плюс миллионы изданий в открытых источниках.` : 'Подборка из всех источников. Начните вводить название или автора.');
    }
    this.updateMore(req);
  },
  updateMore(req) {
    const has = [...this.cursors.values()].some(Boolean);
    this.setMore(has ? async () => {
      const jobs = [...this.cursors].filter(([, n]) => n);
      await Promise.all(jobs.map(async ([id, next]) => {
        try { const r = await next(); if (req !== this.req) return; this.cursors.set(id, r.next); if (r.items.length) this.show(r.items, true); }
        catch (e) { this.cursors.set(id, null); }
      }));
      if (req === this.req) this.updateMore(req);
    } : null);
  },
  search(q) { Sound.tap(); return this.run(q); },
  async fromWs(q, page) {
    if (!q) return { items: RU_FEATURED.map(([p, title, author, c]) => ({ src: 'ru', kind: 'book', lang: 'ru', page: p, title, author, cover: c ? `https://covers.openlibrary.org/b/id/${c}-M.jpg` : '' })), next: null, total: RU_FEATURED.length };
    const j = await this.api(`${WS}?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=0&srlimit=30&sroffset=${page}&srprop=&format=json&origin=*`, this.ctrl?.signal);
    const items = this.wsItems(j.query?.search || []).map(it => ({ ...it, kind: 'book', lang: 'ru' }));
    const off = j.continue?.sroffset;
    return { items, total: j.query?.searchinfo?.totalhits, next: off ? () => this.fromWs(q, off) : null };
  },
  async fromSe(q, page) {
    if (q && /[а-яё]/i.test(q)) return { items: [], next: null, total: 0 }; // каталог Standard Ebooks только английский
    const html = await this.cached(`${SE}/ebooks?${q ? 'query=' + encodeURIComponent(q) + '&' : 'sort=popularity&'}per-page=12&page=${page + 1}`, this.ctrl?.signal, 'text');
    const d = new DOMParser().parseFromString(html, 'text/html');
    const items = $$('li[typeof="schema:Book"]', d).map(li => {
      const src = li.querySelector('img')?.getAttribute('src');
      return { src: 'world', kind: 'book', lang: 'en', path: li.getAttribute('about'), title: txt(li.querySelector('p:not(.author) [property="schema:name"]')), author: $$('.author [property="schema:name"]', li).map(txt).join(', '), cover: src ? new URL(src, SE).href : '' };
    }).filter(it => it.path && it.title);
    const more = items.length >= 12;
    return { items, total: more ? items.length + '+' : items.length, next: more ? () => this.fromSe(q, page + 1) : null };
  },
  async fromIA(q, page, kind) {
    const cyr = /[а-яё]/i.test(q);
    const langQ = this.lang === 'ru' || (kind === 'ia' && (!q || cyr) && this.lang !== 'en') ? ' AND language:(rus OR russian)' : this.lang === 'en' ? ' AND language:(eng OR english)' : '';
    const base = kind === 'comics' ? IA_MANGA : IA_SCANS + langQ;
    const terms = q.replace(/[():"]/g, ' ').trim();
    const query = terms ? `${base} AND (title:(${terms}) OR creator:(${terms}) OR subject:(${terms}))` : kind === 'comics' ? base : `${base} AND ${IA_CLASSICS}`;
    const j = await this.api(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=year&fl[]=language&sort[]=${encodeURIComponent('downloads desc')}&rows=12&page=${page + 1}&output=json`, this.ctrl?.signal);
    const docs = j.response?.docs || []; const total = j.response?.numFound || 0;
    const items = docs.map(d => {
      const title = String(d.title || d.identifier).replace(/\s+/g, ' ').trim();
      const lang = /rus/i.test([].concat(d.language || []).join()) ? 'ru' : /jpn|japan/i.test([].concat(d.language || []).join()) ? 'ja' : 'en';
      return {
        src: kind, id: d.identifier, title, lang,
        kind: kind === 'ia' ? 'scan' : 'manga',
        author: [].concat(d.creator || []).slice(0, 2).join(', '), extra: d.year ? String(d.year) : '',
        cover: `https://archive.org/services/img/${encodeURIComponent(d.identifier)}`,
      };
    });
    return { items, total, next: (page + 1) * 12 < total ? () => this.fromIA(q, page + 1, kind) : null };
  },
  cache: new Map(), ctrl: null,
  // одинаковые запросы не повторяем: ответы живут в памяти, пока открыта вкладка
  cached(url, signal, as) {
    const k = as + ' ' + url;
    if (this.cache.has(k)) return this.cache.get(k);
    const p = fetch(url, signal ? { signal } : undefined).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return as === 'json' ? r.json() : r.text(); });
    this.cache.set(k, p); p.catch(() => this.cache.delete(k));
    if (this.cache.size > 160) this.cache.delete(this.cache.keys().next().value);
    return p;
  },
  api(url, signal) { return this.cached(url, signal, 'json'); },
  loading(req) { this.ctrl?.abort(); this.ctrl = new AbortController(); $('#cat-list').replaceChildren(...Array.from({ length: 6 }, (_, i) => el('li', { class: 'skeleton', style: `opacity:${1 - i * 0.12}` }))); this.setMore(null); return req; },
  setMore(fn) {
    const row = $('#more-row');
    row.replaceChildren(fn ? el('button', { class: 'btn', onclick: async e => { const b = e.currentTarget; if (b.disabled) return; b.disabled = true; b.textContent = 'Загружаю…'; await fn(); } }, 'Показать ещё') : '');
    if (fn) { this.moreIO ||= new IntersectionObserver(es => { if (es[0].isIntersecting) row.querySelector('button:not([disabled])')?.click(); }, { rootMargin: '600px 0px' }); this.moreIO.observe(row); }
  },
  wsItems(list) {
    return list.filter(r => !/\/|\(ДО\)|ДО\)$/.test(r.title)).map(r => {
      const m = r.title.match(/^(.*?)\s*\(([^)]+)\)$/);
      return { src: 'ru', page: r.title, title: m ? m[1] : r.title, author: m ? m[2] : '' };
    });
  },
  // страницы скана из BookReader: список картинок с размерами
  async iaPages(meta) {
    const jp2 = meta.files.find(f => /_jp2\.zip$/i.test(f.name));
    if (!jp2) return null;
    const stem = jp2.name.replace(/_jp2\.zip$/i, '');
    const j = await this.api(`https://${meta.server}/BookReader/BookReaderJSIA.php?id=${encodeURIComponent(meta.metadata.identifier)}&itemPath=${encodeURIComponent(meta.dir)}&server=${encodeURIComponent(meta.server)}&format=jsonp&subPrefix=${encodeURIComponent(stem)}`);
    const pages = (j.data?.brOptions?.data || []).flat().filter(p => p && p.uri).map(p => ({ u: p.uri + '&scale=2&rotate=0', w: p.width, h: p.height }));
    return pages.length ? pages : null;
  },
  // страницы комикса из CBZ: архив отдаёт каждую картинку отдельно, с CORS
  async cbzPages(id, meta) {
    const cbz = meta.files.find(f => /\.cbz$/i.test(f.name));
    if (!cbz) return null;
    const base = `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(cbz.name)}/`;
    const r = await fetch(base); if (!r.ok) return null;
    const html = await r.text();
    const names = [...new Set([...html.matchAll(/href="([^"]+\.cbz\/[^"]+\.(?:jpe?g|png|gif|webp))"/gi)].map(m => m[1]))];
    names.sort(collator.compare);
    return names.length ? names.map(h => ({ u: h.startsWith('//') ? 'https:' + h : h })) : null;
  },
  async fetchIA(it, key, onP = () => { }) {
    onP(0.1);
    const meta = await this.api(`https://archive.org/metadata/${encodeURIComponent(it.id)}`);
    onP(0.4);
    if (!meta?.files) throw new Error('Архив не отдал описание этого издания');
    const prevStatus = $('#cat-status').textContent;
    this.status(`Собираю страницы «${it.title}»…`);
    let pages = it.src === 'comics' ? await this.cbzPages(it.id, meta).catch(() => null) : null;
    if (!pages) pages = await this.iaPages(meta).catch(() => null);
    onP(0.9);
    this.status(prevStatus);
    if (!pages) throw new Error('У этого издания нет страниц для чтения в браузере');
    const data = { title: it.title, author: it.author, id: it.id, sub: it.src === 'comics' ? 'comic' : 'scan', pages };
    return addBook('iapages', new Blob([JSON.stringify(data)], { type: 'application/json' }), it.id + '.json', { srcKey: key, sub: data.sub });
  },
  offline(e) {
    console.warn(e); $('#cat-list').replaceChildren(); this.setMore(null);
    this.status('Источник не отвечает. Каталогу нужен прямой доступ в интернет, а в некоторых встроенных просмотрщиках он закрыт. Полка и чтение своих файлов при этом работают.');
  },
  // order — место источника в выдаче: книги выше сканов, даже если сканы ответили раньше
  show(items, append, order) {
    if (!append) this.results = [];
    const start = this.results.length; this.results.push(...items);
    const have = new Set(Shelf.books.map(b => b.srcKey).filter(Boolean));
    const nodes = items.map((it, i) => {
      const key = keyOf(it), on = have.has(key);
      const [bg, ink] = PALETTE[hash(it.title + it.author) % PALETTE.length];
      const cov = el('span', { class: 'cat-cover' }, el('div', { class: 'gen', style: `--gc-bg:${bg};--gc-ink:${ink}` }, el('div', { class: 'gt' }, it.title)));
      if (it.cover) addCoverImg(cov, it.cover); else if (it.src === 'ru') coverObserver.observe(Object.assign(cov, { _it: it }));
      const li = el('li', { class: 'cat-item' + (on ? ' done' : ''), style: `--i:${Math.min(i, 20)}`, dataset: { o: String(order ?? 99) } });
      const card = el('button', { class: 'cat-btn', 'aria-label': `Подробнее: «${it.title}»`, onclick: () => this.details(it, li) },
        cov,
        el('span', { style: 'min-width:0' },
          el('span', { class: 'tb' }, el('span', { dataset: { k: it.kind || 'book' } }, KIND_LABEL[it.kind] || 'Книга'), it.lang ? el('span', { class: 'lang' }, it.lang.toUpperCase()) : null),
          el('span', { class: 't' }, it.title), el('span', { class: 'a' }, it.author || ' '), el('span', { class: 'src' }, [SRC_LABEL[it.src], it.extra].filter(Boolean).join(' · '))),
        el('span', { class: 'act-ph', 'aria-hidden': 'true' }));
      const ext = it.src === 'shiki';
      const act = el('button', { class: 'act', html: ext ? ICON.arrow : on ? ICON.check : ICON.plus, 'aria-label': ext ? `Где читать «${it.title}»` : on ? `Открыть «${it.title}»` : `Положить на полку «${it.title}»`, onclick: () => (ext ? this.details(it, li) : this.add(it, li)) });
      li.append(card, act);
      return li;
    });
    const list = $('#cat-list');
    if (!append) list.replaceChildren(...nodes);
    else if (order == null) list.append(...nodes);
    else { const after = Array.from(list.children).find(c => +(c.dataset.o ?? 99) > order); if (after) after.before(...nodes); else list.append(...nodes); }
    if (!append && items.length) Sound.panel();
    return start;
  },
  busy: new Map(),
  // одна загрузка на книгу, даже если нажали и в списке, и в окне книги
  async add(it, li, { open = false } = {}) {
    const key = keyOf(it);
    const exist = Shelf.books.find(b => b.srcKey === key);
    if (exist) { this.closeSheet(true); return openBook(exist.id, li?.querySelector('.cat-cover') || null); }
    const act = li?.querySelector('.act');
    if (this.busy.has(key)) return;
    act?.setAttribute('aria-busy', 'true'); Sound.tap();
    const progress = f => {
      const pct = Math.max(4, Math.round(f * 100));
      act?.style.setProperty('--p', pct);
      if (this.sheetKey === key) { const g = $('#sheet-go'); if (g) g.textContent = `Загружаю ${pct} %`; }
    };
    const job = (async () => {
      if (it.src === 'lib') return this.fetchLib(it, key, progress);
      if (it.src === 'ru') return this.fetchRu(it, key, progress);
      if (it.src === 'world') return this.fetchWorld(it, key, progress);
      return this.fetchIA(it, key, progress);
    })();
    this.busy.set(key, job);
    try {
      const b = await job;
      if (!b.cover && !b.coverUrl) {
        const img = li?.querySelector('.cat-cover img.ok') || (it.cover ? { src: it.cover } : null);
        if (img) { try { b.cover = await thumb(await (await fetch(img.src)).blob()); } catch { b.coverUrl = img.src; } await DB.putBook(b); }
      }
      li?.classList.add('done'); if (act) { act.innerHTML = ICON.check; act.setAttribute('aria-label', `Открыть «${it.title}»`); }
      Sound.add(); toast(`«${b.title}» теперь на полке`);
      Shelf.render(false);
      if (this.sheetKey === key) this.details(it, li, true);
      if (open) { this.closeSheet(true); openBook(b.id, li?.querySelector('.cat-cover') || null); }
      return b;
    } catch (e) {
      console.error(e); Sound.error();
      toast(e.message || 'Не удалось загрузить книгу', 'err', 6000);
      if (this.sheetKey === key) { const g = $('#sheet-go'); if (g) g.textContent = 'Читать'; }
    } finally {
      this.busy.delete(key); act?.removeAttribute('aria-busy'); act?.style.removeProperty('--p');
    }
  },
  /* ——— окно книги: обложка, описание, «читать», «на полку» и файлы для скачивания ——— */
  sheetKey: null,
  details(it, li, refresh) {
    const key = keyOf(it); this.sheetKey = key;
    const exist = Shelf.books.find(b => b.srcKey === key);
    const sheet = $('#sheet'), card = $('#sheet-card');
    const [bg, ink] = PALETTE[hash(it.title + it.author) % PALETTE.length];
    const front = el('div', { class: 'front' }, el('div', { class: 'gen', style: `--gc-bg:${bg};--gc-ink:${ink}` }, el('div', {}, el('div', { class: 'gt' }, it.title), el('div', { class: 'gr' })), el('div', { class: 'ga' }, it.author || '')));
    const src = li?.querySelector('.cat-cover img.ok')?.src || it.cover;
    if (src) { const img = el('img', { src, alt: '', style: 'position:absolute;inset:0;z-index:1', referrerpolicy: 'no-referrer' }); img.onerror = () => img.remove(); front.append(img); }
    const b3 = el('div', { class: 'b3d', style: `--cb:${bg}` }, el('div', { class: 'floor' }), el('div', { class: 'back' }), el('div', { class: 'spine' }), el('div', { class: 'pages' }), front);
    const coverBox = el('div', { class: 'sheet-cover' }, b3); tilt(coverBox, b3);
    const meta = el('div', { class: 'sheet-meta' }, el('span', {}, KIND_LABEL[it.kind] || 'Книга'), el('span', {}, SRC_LABEL[it.src]), it.extra ? el('span', {}, it.extra) : null, it.src === 'shiki' ? el('span', {}, 'Читается на официальных площадках') : it.src === 'lib' ? el('span', {}, 'Хранится на нашем сайте') : el('span', {}, it.src === 'world' ? 'English' : 'Общественное достояние'));
    const desc = el('p', { class: 'sheet-desc', hidden: true });
    const busy = this.busy.has(key);
    const ext = it.src === 'shiki';
    const go = ext
      ? el('a', { class: 'btn primary big', id: 'sheet-go', href: it.url, target: '_blank', rel: 'noopener' }, 'Открыть на Shikimori')
      : el('button', { class: 'btn primary big', id: 'sheet-go', onclick: () => this.add(it, li, { open: true }) }, exist ? 'Читать' : busy ? 'Загружаю…' : 'Читать');
    const shelfBtn = ext ? null : exist
      ? el('button', { class: 'btn big', onclick: () => { this.closeSheet(true); openBook(exist.id, null); } }, 'Уже на полке')
      : el('button', { class: 'btn big', onclick: () => this.add(it, li) }, 'На полку');
    const dl = el('div', { class: 'sheet-dl' }, el('h3', {}, ext ? 'Где читать легально' : 'Скачать'), el('div', { class: 'skeleton', style: 'height:54px;border-radius:14px' }));
    card.replaceChildren(
      el('button', { class: 'icon-btn sheet-x', 'aria-label': 'Закрыть', html: ICON.close, onclick: () => this.closeSheet() }),
      coverBox,
      el('div', { class: 'sheet-info' },
        el('span', { class: 'kicker' }, el('i'), exist ? 'На вашей полке' : 'Каталог'),
        el('h2', { id: 'sheet-title' }, it.title),
        it.author ? el('div', { class: 'who' }, it.author) : null,
        meta, desc,
        el('div', { class: 'sheet-actions' }, go, shelfBtn),
        dl));
    if (!refresh) {
      sheet.hidden = false; sheet.classList.remove('closing');
      document.documentElement.style.overflow = 'hidden';
      Sound.panel();
      requestAnimationFrame(() => card.querySelector('.sheet-x').focus({ preventScroll: true }));
    }
    this.fillDetails(it, key, desc, dl, meta).catch(e => { console.warn(e); dl.lastChild?.remove(); dl.append(el('p', { class: 'bm-empty', style: 'padding:0' }, 'Список файлов сейчас недоступен.')); });
  },
  closeSheet(instant) {
    const sheet = $('#sheet'); if (sheet.hidden) return;
    this.sheetKey = null;
    const done = () => { sheet.hidden = true; sheet.classList.remove('closing'); $('#sheet-card').replaceChildren(); if (!R.open) document.documentElement.style.overflow = ''; };
    if (instant || RM.matches) return done();
    Sound.panel(); sheet.classList.add('closing'); setTimeout(done, 230);
  },
  async fillDetails(it, key, desc, dl, meta) {
    const rows = [];
    const link = (fmt, note, href, size) => el('a', { class: 'dl-row', href, target: '_blank', rel: 'noopener', download: '' }, el('span', { class: 'key-sm', html: ICON.down }), el('b', {}, fmt), el('span', { style: 'color:var(--ink-2)' }, note), size ? el('small', {}, size) : null);
    const make = (fmt, note, fn) => el('button', { class: 'dl-row', onclick: async e => { const b = e.currentTarget; const s = b.querySelector('small'); s.textContent = 'собираю…'; try { await fn(p => { s.textContent = Math.round(p * 100) + ' %'; }); s.textContent = 'готово'; } catch (err) { console.error(err); s.textContent = 'ошибка'; Sound.error(); } } }, el('span', { class: 'key-sm', html: ICON.down }), el('b', {}, fmt), el('span', { style: 'color:var(--ink-2)' }, note), el('small', {}, ''));
    const mb = n => n ? (n / 1048576 >= 1 ? (n / 1048576).toFixed(1).replace('.', ',') + ' МБ' : Math.max(1, Math.round(n / 1024)) + ' КБ') : '';
    if (it.src === 'lib') {
      if (it.desc) { desc.textContent = it.desc; desc.hidden = false; }
      if (it.license) meta.append(el('span', {}, it.license));
      rows.push(el('a', { class: 'dl-row', href: it.file, download: fileName(it.title, it.fmt) }, el('span', { class: 'key-sm', html: ICON.down }), el('b', {}, it.fmt.toUpperCase()), el('span', { style: 'color:var(--ink-2)' }, 'с нашего сайта'), el('small', {}, '')));
      if (it.credit) rows.push(el('p', { class: 'bm-empty', style: 'padding:0;font-size:13px' }, it.credit));
      if (it.source) rows.push(el('a', { class: 'dl-row', href: it.source, target: '_blank', rel: 'noopener' }, el('span', { class: 'key-sm', html: ICON.arrow }), el('b', {}, 'Источник'), el('span', { style: 'color:var(--ink-2)' }, new URL(it.source).hostname.replace(/^www\./, ''))));
    } else if (it.src === 'shiki') {
      const [m, al] = await Promise.all([
        this.api(`${SHIKI}/api/mangas/${it.id}`).catch(() => null),
        fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query: 'query($id:Int){Media(idMal:$id,type:MANGA){siteUrl externalLinks{site url language type}}}', variables: { id: +it.id } }) }).then(r => r.json()).catch(() => null),
      ]);
      if (m) {
        const d = (m.description || '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
        if (d) { desc.textContent = d; desc.hidden = false; }
        meta.append(...[m.status === 'ongoing' ? 'Выходит' : m.status === 'released' ? 'Завершена' : '', m.volumes ? m.volumes + ' т.' : '', m.score && +m.score ? '★ ' + m.score : '', ...(m.genres || []).slice(0, 3).map(g => g.russian)].filter(Boolean).map(t => el('span', {}, t)));
      }
      const links = (al?.data?.Media?.externalLinks || []).filter(l => READ_SITES.test(l.site) || l.type === 'STREAMING' || /official/i.test(l.site));
      const langCode = { English: 'EN', Japanese: 'JP', Russian: 'RU', Spanish: 'ES', French: 'FR', Chinese: 'CN', Korean: 'KR', Portuguese: 'PT', German: 'DE', Thai: 'TH', Indonesian: 'ID', Vietnamese: 'VI' };
      const seen = new Set();
      for (const l of links) {
        const k = l.site + l.language; if (seen.has(k)) continue; seen.add(k);
        rows.push(el('a', { class: 'dl-row', href: l.url, target: '_blank', rel: 'noopener' }, el('span', { class: 'key-sm', html: ICON.arrow }), el('b', {}, l.site), el('span', { style: 'color:var(--ink-2)' }, /official/i.test(l.site) ? 'сайт издателя' : 'официально'), el('small', {}, langCode[l.language] || l.language || '')));
      }
      if (!rows.length) rows.push(el('p', { class: 'bm-empty', style: 'padding:0' }, 'В открытых базах нет официальной онлайн-версии. Ищите печатное или цифровое издание у издательства.'));
      rows.push(el('a', { class: 'dl-row', href: it.url, target: '_blank', rel: 'noopener' }, el('span', { class: 'key-sm', html: ICON.arrow }), el('b', {}, 'Shikimori'), el('span', { style: 'color:var(--ink-2)' }, 'описание, главы, отзывы')));
      if (al?.data?.Media?.siteUrl) rows.push(el('a', { class: 'dl-row', href: al.data.Media.siteUrl, target: '_blank', rel: 'noopener' }, el('span', { class: 'key-sm', html: ICON.arrow }), el('b', {}, 'AniList'), el('span', { style: 'color:var(--ink-2)' }, 'карточка тайтла')));
    } else if (it.src === 'world') {
      const slug = it.path.replace(/^\/ebooks\//, '').split('/').join('_');
      const base = `${SE}${it.path}/downloads/${slug}`;
      rows.push(link('EPUB', 'для любых читалок', `${base}.epub?source=feed`), link('AZW3', 'для Kindle', `${base}.azw3?source=feed`), link('KEPUB', 'для Kobo', `${base}.kepub.epub?source=feed`));
      try {
        const r = await fetch(`${SE}${it.path}`); const d = new DOMParser().parseFromString(await r.text(), 'text/html');
        const t = d.querySelector('meta[name="description"]')?.getAttribute('content') || txt(d.querySelector('#description p, .description p'));
        if (t) { desc.textContent = t; desc.hidden = false; }
      } catch { /* без описания */ }
    } else if (it.src === 'ru') {
      rows.push(make('EPUB', 'соберу из глав Викитеки', async p => { const data = await this.fetchRuData(it, p); saveBlob(await buildEpub(data), fileName(it.title, 'epub')); }));
      rows.push(el('a', { class: 'dl-row', href: `https://ru.wikisource.org/wiki/${encodeURIComponent(it.page.replace(/ /g, '_'))}`, target: '_blank', rel: 'noopener' }, el('span', { class: 'key-sm', html: ICON.arrow }), el('b', {}, 'Викитека'), el('span', { style: 'color:var(--ink-2)' }, 'открыть оригинал')));
    } else {
      const m = await this.api(`https://archive.org/metadata/${encodeURIComponent(it.id)}`);
      const md = m.metadata || {};
      const d = [].concat(md.description || [])[0];
      if (d) { desc.textContent = String(d).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 600); desc.hidden = !desc.textContent; }
      if (md.language) meta.append(el('span', {}, [].concat(md.language)[0]));
      const want = [[/\.epub$/i, 'EPUB', 'текст книги'], [/\.pdf$/i, 'PDF', 'скан страниц'], [/\.cbz$/i, 'CBZ', 'архив комикса'], [/_djvu\.txt$/i, 'TXT', 'распознанный текст']];
      for (const [re, fmt, note] of want) {
        const f = (m.files || []).filter(x => re.test(x.name)).sort((a, b) => (+a.size || 0) - (+b.size || 0))[0];
        if (f) rows.push(link(fmt, note, `https://archive.org/download/${encodeURIComponent(it.id)}/${encodeURIComponent(f.name)}`, mb(+f.size)));
      }
      rows.push(el('a', { class: 'dl-row', href: `https://archive.org/details/${encodeURIComponent(it.id)}`, target: '_blank', rel: 'noopener' }, el('span', { class: 'key-sm', html: ICON.arrow }), el('b', {}, 'Архив'), el('span', { style: 'color:var(--ink-2)' }, 'страница издания')));
    }
    if (this.sheetKey !== key) return;
    dl.replaceChildren(el('h3', {}, 'Скачать'), ...rows);
  },
  async parseWs(page) {
    const j = await this.api(`${WS}?action=parse&page=${encodeURIComponent(page)}&prop=text|properties&redirects=1&format=json&formatversion=2&origin=*`);
    if (j.error) throw new Error('страница не найдена в Викитеке');
    const props = j.parse.properties || {};
    const d = el('div'); d.innerHTML = j.parse.text;
    const prefix = j.parse.title + '/';
    // подстраницы в порядке появления в тексте; красные ссылки (несуществующие) пропускаем
    const subs = [...new Set($$('a[title]', d).filter(a => !a.classList.contains('new')).map(a => a.getAttribute('title')).filter(t => t.startsWith(prefix)))];
    const disambig = 'disambiguation' in props || !!d.querySelector('.mw-disambig, #disambig, .disambig');
    return { title: j.parse.title, html: j.parse.text, subs, disambig };
  },
  // У многих произведений в Викитеке сначала идёт список изданий. Берём издание в современной орфографии.
  async resolveWs(page) {
    let p = await this.parseWs(page);
    for (let hop = 0; hop < 2; hop++) {
      const textLen = el('div', { html: this.cleanWs(p.html) }).textContent.trim().length;
      const looksLikeEditions = p.subs.length && (p.disambig || (textLen < 2500 && p.subs.some(t => /\(СО\)|\(ДО\)|\d{4}|Вариант|редакци|издани/i.test(t.slice(p.title.length)))));
      if (!looksLikeEditions) break;
      const pick = p.subs.find(t => /\(СО\)/.test(t)) || p.subs.find(t => !/\(ДО\)|\/ДО\b/.test(t)) || p.subs[0];
      p = await this.parseWs(pick);
    }
    return p;
  },
  cleanWs(html) {
    const d = el('div'); d.innerHTML = html;
    d.querySelectorAll('.mw-editsection, .noprint, .ws-noexport, .ws-header, .header_notes, #headertemplate, .headertemplate, .mw-empty-elt, .navbox, .metadata, .reference-text sup, style, link, table.plainlinks, #pagelist, .pagenum, .ws-pagenum, .mw-references-wrap h2, .catlinks').forEach(n => n.remove());
    d.querySelectorAll('table').forEach(t => { if (/Источник|Дата создания|Опубл/i.test(t.textContent) && t.querySelectorAll('a').length > 2) t.remove(); });
    d.querySelectorAll('a').forEach(a => {
      const h = a.getAttribute('href') || '';
      if (h.startsWith('#cite_note') || a.closest('sup.reference')) { a.dataset.note = h.slice(1); a.classList.add('note'); a.setAttribute('href', '#'); return; }
      if (h.startsWith('#')) return;
      a.replaceWith(...a.childNodes);
    });
    d.querySelectorAll('img').forEach(i => { const s = i.getAttribute('src') || ''; if (s.startsWith('//')) i.setAttribute('src', 'https:' + s); i.removeAttribute('srcset'); });
    d.querySelectorAll('[class*="poem"]').forEach(p => p.classList.add('poem'));
    d.querySelectorAll('div, span').forEach(n => { if (!n.textContent.trim() && !n.querySelector('img')) n.remove(); });
    sanitize(d);
    return d.innerHTML;
  },
  notesFrom(html, notes) {
    const d = el('div'); d.innerHTML = html;
    d.querySelectorAll('ol.references li[id]').forEach(li => { li.querySelectorAll('.mw-cite-backlink').forEach(n => n.remove()); notes.set(li.id, li.innerHTML); });
  },
  // главы Викитеки грузим по пять одновременно; готовый текст запоминаем, чтобы «на полку» и «скачать» не качали дважды
  ruData: new Map(),
  async fetchRuData(it, onP = () => { }) {
    if (this.ruData.has(it.page)) { onP(1); return this.ruData.get(it.page); }
    onP(0.04);
    const main = await this.resolveWs(it.page);
    const prefix = main.title + '/';
    const subs = main.subs.filter(t => !/\/(ДО)$/i.test(t));
    const chapters = []; const notes = new Map();
    if (subs.length >= 2) {
      const intro = this.cleanWs(main.html);
      const box = el('div'); box.innerHTML = intro;
      // страница-оглавление попадает в книгу, только если в ней есть настоящий текст (предисловие)
      if ($$('p', box).some(p => p.textContent.trim().length > 200)) chapters.push({ title: it.title, html: intro });
      const list = subs.slice(0, 150); let done = 0;
      const pages = await pool(list.map(t => async () => { const p = await this.parseWs(t); onP(0.08 + 0.9 * (++done / list.length)); return p; }), 5);
      pages.forEach((p, i) => { this.notesFrom(p.html, notes); chapters.push({ title: list[i].slice(prefix.length).replace(/_/g, ' '), html: this.cleanWs(p.html) }); });
    } else {
      this.notesFrom(main.html, notes);
      chapters.push(...splitByHeadings(this.cleanWs(main.html), it.title));
    }
    if (!chapters.some(c => c.html.replace(/<[^>]+>/g, '').trim().length > 200)) throw new Error('В Викитеке у этой страницы нет полного текста');
    const data = { title: it.title, author: it.author, chapters, notes: [...notes] };
    this.ruData.set(it.page, data); if (this.ruData.size > 6) this.ruData.delete(this.ruData.keys().next().value);
    onP(1);
    return data;
  },
  async fetchRu(it, key, onP) {
    const data = await this.fetchRuData(it, onP);
    return addBook('json', new Blob([JSON.stringify(data)], { type: 'application/json' }), it.title + '.json', { srcKey: key, author: it.author });
  },
  async fetchWorld(it, key, onP = () => { }) {
    const slug = it.path.replace(/^\/ebooks\//, '').split('/').join('_');
    const r = await fetch(`${SE}${it.path}/downloads/${slug}.epub?source=feed`);
    if (!r.ok) throw new Error('Standard Ebooks не отдал файл книги, попробуйте позже');
    return addBook('epub', await readBlob(r, onP), slug + '.epub', { srcKey: key });
  },
};
$('#cat-form').addEventListener('submit', e => { e.preventDefault(); Catalog.search($('#cat-q').value); });
$('#cat-q').addEventListener('input', debounce(e => { const v = e.target.value.trim(); if ((v.length >= 2 || !v) && v !== Catalog.q) Catalog.run(v); }, 450));
$('#sheet').addEventListener('click', e => { if (e.target.closest('[data-sheet-close]')) Catalog.closeSheet(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) { e.preventDefault(); Catalog.closeSheet(); } });

/* ——————————————————— перетаскивание файлов ——————————————————— */
let dragDepth = 0;
const hasFiles = e => Array.from(e.dataTransfer?.types || []).includes('Files');
window.addEventListener('dragenter', e => { if (!hasFiles(e)) return; e.preventDefault(); if (!dragDepth) Sound.whoosh(); dragDepth++; $('#drop').classList.add('on'); });
window.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
window.addEventListener('dragleave', e => { if (!hasFiles(e)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('#drop').classList.remove('on'); });
window.addEventListener('drop', async e => {
  if (!hasFiles(e)) return; e.preventDefault(); dragDepth = 0; $('#drop').classList.remove('on'); Sound.thud();
  const files = await filesFromDrop(e.dataTransfer);
  if (R.open) await closeReader(true);
  importFiles(files);
});
async function filesFromDrop(dt) {
  const entries = Array.from(dt.items || []).map(i => i.webkitGetAsEntry?.()).filter(Boolean);
  if (!entries.length) return Array.from(dt.files);
  const out = [];
  async function walk(entry, path) {
    if (entry.isFile) {
      const f = await new Promise((res, rej) => entry.file(res, rej));
      try { Object.defineProperty(f, 'relPath', { value: path + f.name }); } catch { /* только чтение */ }
      out.push(f);
    } else if (entry.isDirectory) {
      const rd = entry.createReader(); let batch;
      do { batch = await new Promise((res, rej) => rd.readEntries(res, rej)); for (const e of batch) await walk(e, path + entry.name + '/'); } while (batch.length);
    }
  }
  for (const e of entries) { try { await walk(e, ''); } catch (err) { console.warn(err); } }
  return out;
}

/* ——————————————————— пример на полке ——————————————————— */
const GUIDE = {
  title: 'Как читать в Закладке', author: 'Закладка',
  chapters: [
    { title: 'Полка', html: `<h2>Полка</h2>
<blockquote class="epigraph"><p>Книга — маленькое окошко, через него весь мир видно.</p><p class="ta">Пословица</p></blockquote>
<p>Закладка — читалка, которая живёт прямо в браузере. На полку можно положить что угодно: роман в EPUB или FB2, учебник в PDF, мангу в архиве CBZ или просто папку со сканами. Файлы никуда не отправляются. Они хранятся в памяти этого браузера, поэтому полка открывается даже без интернета.</p>
<p>Чтобы добавить книгу, перетащите файл на страницу или нажмите «Добавить». Название, автора и обложку Закладка найдёт сама. Если обложки в файле нет, она наберёт её шрифтом, как на старых издательских макетах.</p>
<p>Синяя лента на обложке — ляссе, тканевая закладка, которую вшивают в переплёт. Чем длиннее лента, тем дальше вы продвинулись. Последняя открытая книга всегда ждёт наверху полки, в строке «Продолжить чтение».</p>` },
    { title: 'Чтение', html: `<h2>Чтение</h2>
<p>Листайте щелчком по правому или левому краю страницы, стрелками на клавиатуре или пробелом. На телефоне достаточно провести пальцем. Щелчок посередине прячет и возвращает панели, чтобы ничто не отвлекало от текста.</p>
<p>Кнопка «Аа» открывает вёрстку. Там настраиваются гарнитура, кегль, интерлиньяж и поля, а ещё тон бумаги: обычный, сепия или ночной. Если привычнее прокручивать текст, переключите вёрстку на «Ленту». На широком экране книга раскрывается разворотом, как бумажная.</p>
<p>Чтобы заложить страницу, нажмите на ленточку вверху или клавишу B. Сверху опустится ляссе, а цитата с этой страницы появится в списке закладок рядом с оглавлением. Сноски открываются поверх текста, и место в книге не теряется.</p>
<div class="poem"><div class="stanza"><p class="v">Перевернуть страницу — тихий звук,</p><p class="v">как будто кто-то вышел из-за двери.</p></div></div>
<p>Звуки интерфейса можно выключить значком динамика в шапке сайта.</p>` },
    { title: 'Манга, комиксы и PDF', html: `<h2>Манга, комиксы и PDF</h2>
<p>Архивы CBZ и папки с картинками открываются постранично. Для манги включите в настройках направление «Справа налево»: тогда вперёд листают щелчком по левому краю, а разворот складывается как в оригинальном томе. Если в архиве есть файл ComicInfo.xml с пометкой о манге, Закладка включит это сама.</p>
<p>Вебтуны и длинные главы удобнее читать «Лентой»: страницы идут одна за другой без промежутков. PDF открывается так же, его можно вписать по высоте экрана или по ширине.</p>
<p>В разделе «Каталог» собрана классика, перешедшая в общественное достояние. Нажмите на книгу, и она окажется на полке целиком, со всеми главами и примечаниями.</p>
<p>Хорошего чтения.</p>` },
  ],
};
async function seed() {
  if (store.get('seeded', false) || Shelf.books.length) { store.set('seeded', true); return; }
  store.set('seeded', true);
  try {
    const b = await addBook('json', new Blob([JSON.stringify(GUIDE)], { type: 'application/json' }), 'guide.json', { example: true });
    b.added = Date.now() - 1000; await DB.putBook(b);
  } catch (e) { console.warn(e); }
  try {
    const r = await fetch('samples/dom-u-reki.epub');
    if (r.ok) { const b = await addBook('epub', await r.blob(), 'dom-u-reki.epub', { example: true }); b.added = Date.now() - 2000; await DB.putBook(b); }
  } catch { /* пример недоступен — не страшно */ }
}

/* ——————————————————— запуск ——————————————————— */
function paintSound() { const on = Sound.on; const b = $('#btn-sound'); b.innerHTML = on ? ICON.soundOn : ICON.soundOff; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Выключить звуки' : 'Включить звуки'); }

async function boot() {
  document.documentElement.lang = 'ru';
  const t = store.get('theme', null); if (t) document.documentElement.dataset.theme = t;
  Theme.paint(); paintSound();
  $('#btn-theme').addEventListener('click', e => Theme.toggle(e.currentTarget));
  $('#btn-sound').addEventListener('click', () => { Sound.set(!Sound.on); paintSound(); });
  // кнопки «Добавить» — это <label for="file-in">: выбор файла открывает сам браузер, без программного клика
  document.addEventListener('click', e => { if (e.target.closest('label[for="file-in"]')) Sound.tap(); });
  document.addEventListener('keydown', e => { const l = e.target.closest?.('label[for="file-in"]'); if (l && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); $('#file-in').click(); } });
  $('#file-in').addEventListener('change', e => { const f = Array.from(e.target.files || []); e.target.value = ''; if (f.length) importFiles(f); });
  // тихий звук при наведении на всё, что нажимается
  let lastHover = null;
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target.closest('button, a, label[role="button"], .author-chip, select');
    if (t && t !== lastHover && !t.disabled) Sound.hover();
    lastHover = t;
  });
  document.addEventListener('input', e => { if (e.target.matches('input[type="search"]')) Sound.key(); });
  document.addEventListener('focusin', e => { if (e.target.matches('input[type="search"]')) Sound.tap(); });
  // заголовок появляется по словам
  const ht = $('#hero-title');
  if (ht) { let d = 0; const wrapWords = node => Array.from(node.childNodes).forEach(n => { if (n.nodeType === 3) { const frag = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(w => frag.append(/\S/.test(w) ? el('span', { class: 'w', style: `--d:${d++}` }, w) : w)); n.replaceWith(frag); } else wrapWords(n); }); wrapWords(ht); }
  $$('[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); View.go(a.dataset.go); }));
  $$('#chips .chip').forEach(c => c.addEventListener('click', () => { Sound.tap(); Shelf.setFilter(c.dataset.f); }));
  $('#q').addEventListener('input', debounce(e => { Shelf.q = e.target.value; Shelf.render(false); }, 120));
  const top = $('#top'); window.addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 4), { passive: true });
  $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.f === Shelf.filter)));
  View.go(location.hash === '#catalog' ? 'catalog' : 'shelf', true);
  Hero.init();
  // отклик на нажатие: волна от точки касания
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn'); if (!b || RM.matches) return;
    const r = b.getBoundingClientRect(); const d = Math.max(r.width, r.height) * 2.2;
    const w = el('span', { class: 'ripple', style: `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px` });
    b.append(w); setTimeout(() => w.remove(), 650);
  }, { passive: true });
  // то, что ниже первого экрана, проявляется при прокрутке (один наблюдатель на всё)
  if (!RM.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.section-head, .formats, .site-foot .wrap, .src-note').forEach(n => { if (n.getBoundingClientRect().top > innerHeight) { n.classList.add('reveal'); io.observe(n); } });
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });
  await Shelf.load();
  await seed();
  Shelf.render(true);
  requestAnimationFrame(() => { moveInk($('#nav-pill'), $('.tab[aria-selected="true"]')); moveInk($('#chip-ink'), $('#chips .chip[aria-pressed="true"]')); });
}
window.__zk = { Shelf, DB, T, PG, importFiles, Catalog, buildEpub, epubModel };
boot();
})();
