'use strict';
/* 3D-сцена в шапке: открытая книга с перелистываемыми страницами, ляссе и парящие томики с полки. Three.js r128 (глобальный THREE). */
(() => {
const noop = { init() { return false; }, setCovers() { }, setActive() { }, setAccent() { } };
if (!window.THREE) { window.Hero3D = noop; return; }
const T3 = window.THREE;
const RM = matchMedia('(prefers-reduced-motion: reduce)');

const W = 1.55, H = 2.15, STACK = 0.11;            // размеры разворота
const SEG = 28;                                      // сегменты листа для изгиба
const WORDS = 'Закладка помнит каждую страницу и тихо ждёт вас на полке. Перелистните лист, и история продолжится с того самого места, где вы остановились вечером. Книги, манга и старые комиксы живут рядом, а голос прочтёт главу вслух, пока вы смотрите в окно поезда. Ветер шевелит страницы, лента ложится поперёк строк, и кажется, что дом у реки снова зовёт домой.'.split(' ');
const TITLES = ['Глава первая', 'Письмо', 'Старая лодка', 'Половодье', 'Глава вторая'];

let renderer, scene, camera, root, wrap, canvas, raf = 0, running = false, active = true, visible = true;
let pages = [], floaters = [], coverMat = null, ribbonMat = null, shadow;
let rotY = -0.42, rotX = 0, tY = -0.42, tX = 0, drag = null, hoverX = 0, hoverY = 0;
const clock = { t0: performance.now() };

function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function pageCanvas(seed, spineLeft, num) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 712;
  const g = c.getContext('2d'); const r = rng(seed);
  g.fillStyle = '#FBFAF5'; g.fillRect(0, 0, 512, 712);
  const sx = spineLeft ? 0 : 512;
  const grd = g.createLinearGradient(sx, 0, spineLeft ? 90 : 422, 0);
  grd.addColorStop(0, 'rgba(40,36,30,.16)'); grd.addColorStop(1, 'rgba(40,36,30,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 712);
  let y = 86; const x0 = 64, maxW = 384;
  if (r() < 0.45) {
    g.fillStyle = '#16161a'; g.font = '600 30px Onest, system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText(TITLES[seed % TITLES.length], 256, 120); g.fillStyle = '#2F45FF'; g.fillRect(238, 138, 36, 4); y = 196; g.textAlign = 'left';
  }
  g.fillStyle = '#2b2b30'; g.font = '21px "Liberation Serif", "Times New Roman", serif';
  let wi = Math.floor(r() * WORDS.length), line = '', indent = 26;
  while (y < 640) {
    const w = WORDS[wi++ % WORDS.length];
    const test = line ? line + ' ' + w : w;
    if (g.measureText(test).width > maxW - indent) { g.fillText(line, x0 + indent, y); y += 31; line = w; indent = r() < 0.12 ? 26 : 0; }
    else line = test;
  }
  g.fillStyle = '#8a8a90'; g.font = '15px Onest, sans-serif'; g.textAlign = 'center'; g.fillText(String(num), 256, 684);
  return c;
}
function tex(canvas, mirror) {
  const t = new T3.CanvasTexture(canvas);
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  if (mirror) { t.wrapS = T3.RepeatWrapping; t.repeat.x = -1; t.offset.x = 1; }
  return t;
}
function edgeTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 16; const g = c.getContext('2d');
  for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#e2ddcf' : '#f6f3ea'; g.fillRect(0, i, 64, 1); }
  const t = new T3.CanvasTexture(c); return t;
}
function coverCanvas(title, bg, ink) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 360; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 256, 360);
  g.fillStyle = ink; g.font = '600 26px Onest, sans-serif';
  const words = title.split(' '); let line = '', y = 70;
  for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > 200) { g.fillText(line, 28, y); y += 32; line = w; } else line = t; }
  g.fillText(line, 28, y); g.fillRect(28, y + 20, 30, 4);
  return c;
}
function shadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grd.addColorStop(0, 'rgba(0,0,0,.35)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  return new T3.CanvasTexture(c);
}

// лист: плоскость от корешка (x=0) до края (x=W), изгибается при перелистывании
function makeSheet(i) {
  const geo = new T3.PlaneGeometry(W, H, SEG, 1);
  geo.rotateX(-Math.PI / 2); geo.translate(W / 2, 0, 0);
  const base = geo.attributes.position.array.slice();
  const front = new T3.MeshLambertMaterial({ map: tex(pageCanvas(11 + i * 7, true, 2 * i + 3)), side: T3.FrontSide });
  const back = new T3.MeshLambertMaterial({ map: tex(pageCanvas(37 + i * 5, false, 2 * i + 2), true), side: T3.BackSide });
  const g = new T3.Group();
  const m1 = new T3.Mesh(geo, front), m2 = new T3.Mesh(geo, back);
  g.add(m1, m2);
  g.userData = { geo, base, p: 0, lift: STACK + 0.004 + i * 0.002 };
  return g;
}
function bendSheet(sheet, p) {
  const { geo, base, lift } = sheet.userData;
  const a = p * Math.PI;
  const curl = Math.sin(a) * 0.9;
  const pos = geo.attributes.position.array;
  // по ширине листа угол меняется — получается мягкий изгиб
  const xs = [], ys = [];
  let x = 0, y = 0, prevR = 0;
  for (let s = 0; s <= SEG; s++) {
    const r = (s / SEG) * W;
    const phi = Math.min(Math.PI, Math.max(0, a - curl * (r / W) * (p < 0.5 ? 1 : -0.35) * 0.55));
    const d = r - prevR; x += d * Math.cos(phi); y += d * Math.sin(phi); prevR = r;
    xs.push(x); ys.push(y);
  }
  for (let v = 0; v < pos.length / 3; v++) {
    const col = v % (SEG + 1);
    pos[v * 3] = xs[col]; pos[v * 3 + 1] = ys[col] + lift; pos[v * 3 + 2] = base[v * 3 + 2];
  }
  geo.attributes.position.needsUpdate = true;
  geo.computeVertexNormals();
}

function build(accent) {
  scene = new T3.Scene();
  camera = new T3.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 5.2, 5.4); camera.lookAt(0, -0.15, 0);
  scene.add(new T3.AmbientLight(0xffffff, 0.78));
  const key = new T3.DirectionalLight(0xffffff, 0.55); key.position.set(-3, 6, 4); scene.add(key);
  const rim = new T3.DirectionalLight(0xbfc6ff, 0.25); rim.position.set(4, 2, -3); scene.add(rim);

  root = new T3.Group(); scene.add(root);
  const edge = edgeTexture();
  const edgeMat = new T3.MeshLambertMaterial({ map: edge });
  coverMat = new T3.MeshLambertMaterial({ color: new T3.Color(accent) });
  const leftTop = new T3.MeshLambertMaterial({ map: tex(pageCanvas(5, false, 1)) });
  const rightTop = new T3.MeshLambertMaterial({ map: tex(pageCanvas(9, true, 2)) });
  const stack = (top, x) => {
    const m = new T3.Mesh(new T3.BoxGeometry(W, STACK, H), [edgeMat, edgeMat, top, coverMat, edgeMat, edgeMat]);
    m.position.set(x, STACK / 2, 0); return m;
  };
  root.add(stack(leftTop, -W / 2), stack(rightTop, W / 2));
  const coverGeo = new T3.BoxGeometry(W + 0.08, 0.035, H + 0.12);
  const cl = new T3.Mesh(coverGeo, coverMat); cl.position.set(-W / 2 - 0.02, -0.017, 0);
  const cr = new T3.Mesh(coverGeo, coverMat); cr.position.set(W / 2 + 0.02, -0.017, 0);
  root.add(cl, cr);
  // ляссе — лента поперёк правой страницы
  ribbonMat = new T3.MeshLambertMaterial({ color: new T3.Color(accent) });
  const rib = new T3.Mesh(new T3.BoxGeometry(0.075, 0.006, H * 0.92), ribbonMat);
  rib.position.set(0.42, STACK + 0.012, 0.12); rib.rotation.y = -0.08; root.add(rib);
  const tail = new T3.Mesh(new T3.BoxGeometry(0.075, 0.006, 0.5), ribbonMat);
  tail.position.set(0.47, STACK - 0.12, H / 2 + 0.2); tail.rotation.x = 0.9; root.add(tail);
  // перелистываемые листы
  pages = [0, 1, 2].map(i => { const s = makeSheet(i); bendSheet(s, 0); root.add(s); return s; });
  // тень
  shadow = new T3.Mesh(new T3.PlaneGeometry(W * 3.2, H * 1.9), new T3.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.06; root.add(shadow);
  // парящие томики
  const specs = [[-2.05, 0.75, -1.55, '#1F2A24', '#D8E3D5', 'Дом у реки'], [2.2, 0.95, -1.25, '#5E2A2A', '#F2E4DE', 'Белые ночи'], [2.0, 0.55, 1.3, '#C4B597', '#29231A', 'Шинель']];
  floaters = specs.map(([x, y, z, bg, ink, t], i) => {
    const front = new T3.MeshLambertMaterial({ map: new T3.CanvasTexture(coverCanvas(t, bg, ink)) });
    const side = new T3.MeshLambertMaterial({ color: new T3.Color(bg) });
    const m = new T3.Mesh(new T3.BoxGeometry(0.78, 1.1, 0.14), [edgeMat, side, edgeMat, edgeMat, front, side]);
    m.position.set(x, y, z); m.userData = { x, y, z, ph: i * 2.1, front };
    m.rotation.set(-0.3, i % 2 ? -0.6 : 0.5, i % 2 ? 0.18 : -0.12);
    root.add(m); return m;
  });
}

function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
// цикл: три листа перелистываются вперёд, пауза, затем обратно
function pageProgress(i, t) {
  const cycle = 12, s = t % cycle;
  const fwd = s - i * 1.1, bwd = s - 6.4 - (2 - i) * 0.9;
  if (s < 6.4) return ease(Math.min(1, Math.max(0, fwd / 1.7)));
  return 1 - ease(Math.min(1, Math.max(0, bwd / 1.5)));
}

function frame(now) {
  const t = (now - clock.t0) / 1000;
  if (!drag) { tY += ((-0.42 + hoverX * 0.35 + Math.sin(t * 0.25) * 0.08) - tY) * 0.04; tX += ((hoverY * 0.18) - tX) * 0.04; }
  rotY += (tY - rotY) * 0.08; rotX += (tX - rotX) * 0.08;
  root.rotation.y = rotY; root.rotation.x = rotX;
  root.position.y = Math.sin(t * 0.9) * 0.06;
  pages.forEach((p, i) => { const pr = RM.matches ? (i === 0 ? 0.42 : 0) : pageProgress(i, t); if (Math.abs(pr - p.userData.p) > 0.0005) { p.userData.p = pr; bendSheet(p, pr); } });
  floaters.forEach(m => { const u = m.userData; m.position.y = u.y + Math.sin(t * 0.8 + u.ph) * 0.12; m.rotation.y += 0.0025; });
  renderer.render(scene, camera);
}
function loop(now) { if (!running) return; frame(now); raf = requestAnimationFrame(loop); }
function update() {
  const should = active && visible && !document.hidden && !RM.matches;
  if (should && !running) { running = true; raf = requestAnimationFrame(loop); }
  else if (!should && running) { running = false; cancelAnimationFrame(raf); }
}
function resize() {
  const r = wrap.getBoundingClientRect(); if (!r.width) return;
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / r.height;
  camera.position.set(0, 5.2, r.width / r.height < 1.05 ? 6.6 : 5.4);
  camera.lookAt(0, -0.15, 0);
  camera.updateProjectionMatrix();
  frame(performance.now());
}

window.Hero3D = {
  init(cv, accent) {
    canvas = cv; wrap = cv.parentElement;
    try { renderer = new T3.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { return false; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    build(accent);
    new ResizeObserver(resize).observe(wrap);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; update(); }).observe(wrap);
    document.addEventListener('visibilitychange', update);
    RM.addEventListener?.('change', () => { update(); frame(performance.now()); });
    // вращение мышью/пальцем с инерцией
    wrap.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: tY, rx: tX }; wrap.setPointerCapture(e.pointerId); window.dispatchEvent(new CustomEvent('hero3d:grab')); });
    wrap.addEventListener('pointermove', e => {
      const r = wrap.getBoundingClientRect();
      hoverX = ((e.clientX - r.left) / r.width - 0.5) * 2; hoverY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (drag) { tY = drag.ry + (e.clientX - drag.x) / r.width * 3.2; tX = Math.max(-0.5, Math.min(0.6, drag.rx + (e.clientY - drag.y) / r.height * 1.6)); if (RM.matches) { rotY = tY; rotX = tX; frame(performance.now()); } }
    });
    const end = () => { if (drag) { drag = null; window.dispatchEvent(new CustomEvent('hero3d:release')); } };
    wrap.addEventListener('pointerup', end); wrap.addEventListener('pointercancel', end);
    wrap.addEventListener('pointerleave', () => { hoverX = hoverY = 0; });
    resize(); update();
    return true;
  },
  setActive(v) { active = v; update(); },
  setAccent(hex) { if (!coverMat) return; coverMat.color.set(hex); ribbonMat.color.set(hex); if (!running) frame(performance.now()); },
  // обложки с полки на парящих томиках
  setCovers(urls) {
    if (!floaters.length) return;
    urls.slice(0, floaters.length).forEach((u, i) => {
      new T3.TextureLoader().load(u, t => { const m = floaters[i]; m.material[4] = new T3.MeshLambertMaterial({ map: t }); if (!running) frame(performance.now()); });
    });
  },
};
})();
