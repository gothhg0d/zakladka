'use strict';
/* Нейросетевая озвучка Piper прямо в браузере: модель голоса (~63 МБ) скачивается один раз и хранится в кэше,
   речь синтезируется в фоновом потоке, чтобы страница не подтормаживала. Голоса Piper — MIT/CC, rhasspy. */
(() => {
const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/';
const PH = 'https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.4/dist/piper-o91UDS6e.js';
const PW = 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize';
const HF = 'https://huggingface.co/diffusionstudio/piper-voices/resolve/main/';
const VOICES = {
  'ru_RU-irina-medium': { name: 'Ирина', lang: 'ru', male: false, path: 'ru/ru_RU/irina/medium/ru_RU-irina-medium.onnx' },
  'ru_RU-dmitri-medium': { name: 'Дмитрий', lang: 'ru', male: true, path: 'ru/ru_RU/dmitri/medium/ru_RU-dmitri-medium.onnx' },
  'ru_RU-denis-medium': { name: 'Денис', lang: 'ru', male: true, path: 'ru/ru_RU/denis/medium/ru_RU-denis-medium.onnx' },
  'ru_RU-ruslan-medium': { name: 'Руслан', lang: 'ru', male: true, path: 'ru/ru_RU/ruslan/medium/ru_RU-ruslan-medium.onnx' },
  'en_US-hfc_female-medium': { name: 'Hazel', lang: 'en', male: false, path: 'en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx' },
  'en_US-hfc_male-medium': { name: 'Henry', lang: 'en', male: true, path: 'en/en_US/hfc_male/medium/en_US-hfc_male-medium.onnx' },
};

// код фонового потока: onnxruntime + фонемизатор espeak из Piper
const WORKER = `
let rt = null, createPh = null, phWasm = null, phData = null;
const sessions = new Map(), cfgs = new Map();
let chain = Promise.resolve();
const ORT = ${JSON.stringify(ORT)}, PH = ${JSON.stringify(PH)}, PW = ${JSON.stringify(PW)};
async function boot() {
  if (rt) return;
  importScripts(ORT + 'ort.min.js');
  rt = self.ort; rt.env.wasm.numThreads = 1; rt.env.wasm.wasmPaths = ORT;
  createPh = (await import(PH)).createPiperPhonemize;
  const blobUrl = async (u, type) => URL.createObjectURL(new Blob([await (await fetch(u)).arrayBuffer()], { type }));
  [phWasm, phData] = await Promise.all([blobUrl(PW + '.wasm', 'application/wasm'), blobUrl(PW + '.data', 'application/octet-stream')]);
}
async function cached(url, onP) {
  let cache = null;
  try { cache = await caches.open('zk-voices'); const hit = await cache.match(url); if (hit) { onP && onP(1, 1); return await hit.arrayBuffer(); } } catch (e) { cache = null; }
  const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
  const total = +r.headers.get('content-length') || 0;
  let buf;
  if (r.body && total && onP) {
    const rd = r.body.getReader(); const parts = []; let got = 0, last = 0;
    for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; const now = Date.now(); if (now - last > 120) { last = now; onP(got, total); } }
    buf = await new Blob(parts).arrayBuffer(); onP(total, total);
  } else buf = await r.arrayBuffer();
  if (cache) { try { await cache.put(url, new Response(buf)); } catch (e) {} }
  return buf;
}
function phonemize(text, voice) {
  return new Promise(async (res, rej) => {
    try {
      const m = await createPh({
        print: d => { try { res(JSON.parse(d).phoneme_ids); } catch (e) { rej(e); } },
        printErr: msg => rej(new Error(msg)),
        locateFile: u => u.endsWith('.wasm') ? phWasm : u.endsWith('.data') ? phData : u,
      });
      m.callMain(['-l', voice, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data']);
    } catch (e) { rej(e); }
  });
}
async function load(m) {
  await boot();
  if (sessions.has(m.voice)) return;
  const cfg = JSON.parse(new TextDecoder().decode(await cached(m.cfg)));
  const model = await cached(m.model, (got, total) => postMessage({ type: 'progress', voice: m.voice, got, total }));
  sessions.set(m.voice, await rt.InferenceSession.create(model, { executionProviders: ['wasm'] }));
  cfgs.set(m.voice, cfg);
}
async function synth(m) {
  const s = sessions.get(m.voice), cfg = cfgs.get(m.voice);
  if (!s) throw new Error('голос не загружен');
  const ids = await phonemize(m.text, cfg.espeak.voice);
  const inf = cfg.inference || {};
  const feeds = {
    input: new rt.Tensor('int64', BigInt64Array.from(ids, BigInt), [1, ids.length]),
    input_lengths: new rt.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new rt.Tensor('float32', Float32Array.from([(inf.noise_scale ?? 0.667) * m.noise, (inf.length_scale ?? 1) * m.length, (inf.noise_w ?? 0.8) * m.noiseW]), [3]),
  };
  if (cfg.speaker_id_map && Object.keys(cfg.speaker_id_map).length) feeds.sid = new rt.Tensor('int64', BigInt64Array.from([0n]), [1]);
  const out = await s.run(feeds);
  const pcm = new Float32Array(out.output.data);
  return { pcm, sr: cfg.audio.sample_rate };
}
self.onmessage = e => {
  const m = e.data;
  // синтез строго по очереди: одна сессия onnxruntime не любит параллельные запуски
  chain = chain.then(async () => {
    try {
      if (m.type === 'load') { await load(m); postMessage({ type: 'loaded', voice: m.voice }); }
      else if (m.type === 'synth') { const a = await synth(m); postMessage({ type: 'audio', id: m.id, pcm: a.pcm, sr: a.sr }, [a.pcm.buffer]); }
    } catch (err) { postMessage({ type: 'error', id: m.id, voice: m.voice, message: String(err && err.message || err) }); }
  });
};
`;

const NeuralTTS = {
  VOICES, w: null, waits: new Map(), seq: 0, loaded: new Map(), prog: new Map(), broken: false,
  supported: typeof Worker === 'function' && typeof WebAssembly === 'object',
  worker() {
    if (this.w) return this.w;
    this.w = new Worker(URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' })));
    this.w.onmessage = e => this.onmsg(e.data);
    this.w.onerror = e => { this.broken = true; for (const [, w] of this.waits) w.rej(new Error(e.message || 'фоновый поток озвучки остановился')); this.waits.clear(); };
    return this.w;
  },
  onmsg(m) {
    if (m.type === 'progress') { this.prog.get(m.voice)?.(m.got, m.total); return; }
    const key = m.type === 'loaded' || (m.type === 'error' && m.id == null) ? 'L' + m.voice : m.id;
    const w = this.waits.get(key); if (!w) return;
    this.waits.delete(key);
    if (m.type === 'error') w.rej(new Error(m.message)); else w.res(m);
  },
  load(voice, onP) {
    if (onP) this.prog.set(voice, onP);
    if (this.loaded.has(voice)) return this.loaded.get(voice);
    const v = VOICES[voice]; if (!v) return Promise.reject(new Error('нет такого голоса'));
    const p = new Promise((res, rej) => { this.waits.set('L' + voice, { res, rej }); this.worker().postMessage({ type: 'load', voice, model: HF + v.path, cfg: HF + v.path + '.json' }); });
    this.loaded.set(voice, p); p.catch(() => this.loaded.delete(voice));
    return p;
  },
  synth(voice, text, opt = {}) {
    const id = ++this.seq;
    return new Promise((res, rej) => { this.waits.set(id, { res, rej }); this.worker().postMessage({ type: 'synth', id, voice, text, length: opt.length ?? 1, noise: opt.noise ?? 1, noiseW: opt.noiseW ?? 1 }); });
  },
  async stored() {
    try { const c = await caches.open('zk-voices'); const keys = (await c.keys()).map(k => k.url); return Object.keys(VOICES).filter(v => keys.includes(HF + VOICES[v].path)); } catch { return []; }
  },
};
window.NeuralTTS = NeuralTTS;
})();
