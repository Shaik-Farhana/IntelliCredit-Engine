import { useState, useRef, useCallback, useEffect } from "react";

/* ─── colour tokens ─────────────────────────────────────────────────── */
const DARK_VARS = `
  --bg:        #080d1a;
  --bg2:       #0d1424;
  --bg3:       #121b2f;
  --bg4:       #1a2540;
  --gold:      #c9a84c;
  --gold-lt:   #e8c96a;
  --gold-dim:  rgba(201,168,76,.13);
  --gold-br:   rgba(201,168,76,.28);
  --cyan:      #4dd9e8;
  --green:     #22c55e;
  --red:       #ef4444;
  --amber:     #f59e0b;
  --txt1:      #e4e4e7;
  --txt2:      #8fa3c4;
  --txt3:      #4a6080;
  --bdr:       rgba(255,255,255,.06);
  --shadow:    0 2px 16px rgba(0,0,0,.45);
  --card-bg:   #0d1424;
  --input-bg:  #121b2f;
  --input-bdr: rgba(255,255,255,.09);
  --hdr-bg:    rgba(8,13,26,.95);
  --loader-bg: rgba(8,13,26,.97);
  --swot-bg:   #0d1424;
`;
const LIGHT_VARS = `
  --bg:        #f9f6f0;
  --bg2:       #fff8ee;
  --bg3:       #fdf4e3;
  --bg4:       #f3ece0;
  --gold:      #9a6f23;
  --gold-lt:   #b8892f;
  --gold-dim:  rgba(154,111,35,.10);
  --gold-br:   rgba(154,111,35,.30);
  --cyan:      #0ea5e9;
  --green:     #16a34a;
  --red:       #dc2626;
  --amber:     #d97706;
  --txt1:      #1a1a2e;
  --txt2:      #3a4a6a;
  --txt3:      #7a8fa8;
  --bdr:       rgba(0,0,0,.08);
  --shadow:    0 2px 20px rgba(0,0,0,.10);
  --card-bg:   #fffdf8;
  --input-bg:  #f9f6f0;
  --input-bdr: rgba(0,0,0,.12);
  --hdr-bg:    rgba(249,246,240,.96);
  --loader-bg: rgba(249,246,240,.98);
  --swot-bg:   #fffdf8;
`;

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root { ${DARK_VARS} }
.light { ${LIGHT_VARS} }

html { scroll-behavior: smooth; }
body, #root {
  min-height: 100vh;
  background: var(--bg);
  color: var(--txt1);
  font-family: 'IBM Plex Mono', monospace;
  transition: background .3s, color .3s;
}

/* custom scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

/* animations */
@keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
@keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.25} }
@keyframes spin   { to { transform:rotate(360deg) } }
.fade-in  { animation: fadeUp .35s ease-out both; }
.blink    { animation: blink 1.6s ease-in-out infinite; }

/* ── header ── */
.ic-header {
  position: sticky; top: 0; z-index: 100;
  background: var(--hdr-bg);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--gold-br);
  padding: 0 2rem;
  height: 58px;
  display: flex; align-items: center; justify-content: space-between;
}
.ic-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.45rem; font-weight: 600;
  color: var(--gold); letter-spacing: .06em;
}
.ic-logo span { font-style: italic; font-weight: 300; }

/* badges */
.chip {
  display: inline-flex; align-items: center; gap: .3rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: .58rem; font-weight: 500;
  padding: 2px 8px; border-radius: 20px;
  letter-spacing: .09em; text-transform: uppercase;
}
.chip-gold   { background:var(--gold-dim); color:var(--gold);  border:1px solid var(--gold-br); }
.chip-cyan   { background:rgba(77,217,232,.10); color:var(--cyan); border:1px solid rgba(77,217,232,.25); }
.chip-green  { background:rgba(34,197,94,.10);  color:var(--green);border:1px solid rgba(34,197,94,.25); }
.chip-red    { background:rgba(239,68,68,.10);   color:var(--red);  border:1px solid rgba(239,68,68,.25); }
.chip-amber  { background:rgba(245,158,11,.10);  color:var(--amber);border:1px solid rgba(245,158,11,.25); }
.chip-blue   { background:rgba(99,179,237,.10);  color:#63b3ed;     border:1px solid rgba(99,179,237,.25); }

/* theme toggle */
.theme-btn {
  display: flex; align-items: center; gap: .4rem;
  background: var(--gold-dim);
  border: 1px solid var(--gold-br);
  color: var(--gold); border-radius: 20px;
  padding: 5px 12px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: .62rem; font-weight: 500;
  transition: all .2s;
}
.theme-btn:hover { background: var(--gold-br); }

/* ── layout ── */
.ic-main { max-width: 1180px; margin: 0 auto; padding: 2rem 2rem 5rem; }

/* ── step wizard ── */
.wizard-strip {
  display: flex; align-items: flex-start; justify-content: center;
  gap: 0; margin: 2rem 0 3rem; position: relative;
}
.w-node { display: flex; flex-direction: column; align-items: center; position: relative; padding-bottom: 26px; }
.w-circle {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 600; position: relative; z-index: 1;
  transition: all .3s ease; flex-shrink: 0;
}
.w-circle.done   { background:var(--gold); color:var(--bg); border: 2px solid var(--gold); }
.w-circle.active { background:transparent; color:var(--gold); border: 2px solid var(--gold); box-shadow: 0 0 0 5px var(--gold-dim); }
.w-circle.idle   { background:transparent; color:var(--txt3); border: 2px solid var(--txt3); }
.w-label {
  position: absolute; top: calc(100% + 6px);
  font-size: .58rem; text-transform: uppercase; letter-spacing: .1em;
  white-space: nowrap; left: 50%; transform: translateX(-50%);
}
.w-circle.done .w-label, .w-circle.active .w-label { color: var(--gold); }
.w-circle.idle .w-label { color: var(--txt3); }
.w-line { height: 1px; width: 72px; flex-shrink: 0; margin-top: 19px; }
.w-line.done { background: var(--gold); }
.w-line.idle { background: var(--txt3); opacity: .35; }

/* ── section titles ── */
.sec-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.9rem; font-weight: 500;
  color: var(--gold); letter-spacing: .02em;
  line-height: 1.1;
}
.sec-sub {
  font-size: .7rem; color: var(--txt3);
  letter-spacing: .06em; margin: .35rem 0 2rem;
  font-style: italic;
}

/* ── sub-tabs ── */
.sub-tabs { display: flex; border-bottom: 1px solid var(--bdr); margin-bottom: 1.75rem; }
.s-tab {
  padding: .55rem 1.2rem;
  font-size: .66rem; text-transform: uppercase; letter-spacing: .1em;
  color: var(--txt3); cursor: pointer;
  border: none; border-bottom: 2px solid transparent;
  background: none; font-family: 'IBM Plex Mono', monospace;
  transition: all .2s;
}
.s-tab:hover { color: var(--txt2); }
.s-tab.on { color: var(--gold); border-bottom-color: var(--gold); }

/* ── cards ── */
.card {
  background: var(--card-bg);
  border: 1px solid var(--bdr);
  border-radius: 10px;
  padding: 1.6rem;
  box-shadow: var(--shadow);
  transition: background .3s, border-color .3s;
}
.card-gold {
  background: var(--card-bg);
  border: 1px solid var(--gold-br);
  border-radius: 10px;
  padding: 1.6rem;
  box-shadow: var(--shadow);
}

/* ── form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.fg-full { grid-column: 1/-1; }
.f-lbl {
  display: block; margin-bottom: .35rem;
  font-size: .62rem; text-transform: uppercase;
  letter-spacing: .1em; color: var(--txt2);
}
.f-inp {
  width: 100%; background: var(--input-bg);
  border: 1px solid var(--input-bdr);
  border-radius: 6px; padding: .6rem .85rem;
  color: var(--txt1); font-family: 'IBM Plex Mono', monospace;
  font-size: .78rem; transition: border-color .2s, background .3s;
  -webkit-appearance: none; -moz-appearance: none; appearance: none;
}
.f-inp:focus { outline: none; border-color: var(--gold-br); background: var(--bg4); }
.f-inp::placeholder { color: var(--txt3); }
select.f-inp {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238fa3c4'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right .75rem center; padding-right: 2rem;
}
select.f-inp option { background: var(--bg3); color: var(--txt1); }
textarea.f-inp { resize: vertical; min-height: 80px; }

/* summary preview */
.summary-box {
  background: var(--bg3);
  border: 1px solid var(--gold-br);
  border-radius: 8px; padding: 1.25rem; margin-top: 1.5rem;
}
.summary-box-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: .8rem; font-style: italic;
  color: var(--gold); margin-bottom: .9rem; letter-spacing: .05em;
}
.sum-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .85rem; }
.sum-lbl { font-size: .59rem; color: var(--txt3); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .15rem; }
.sum-val { font-size: .83rem; color: var(--txt1); font-weight: 500; }
.sum-val.gold { color: var(--gold); }

/* ── buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .65rem 1.5rem; border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: .73rem; font-weight: 500; letter-spacing: .05em;
  cursor: pointer; transition: all .2s; border: none;
}
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn-primary { background: var(--gold); color: var(--bg); }
.btn-primary:hover:not(:disabled) { background: var(--gold-lt); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(201,168,76,.3); }
.btn-ghost { background: transparent; color: var(--txt2); border: 1px solid var(--bdr); }
.btn-ghost:hover:not(:disabled) { color: var(--txt1); border-color: rgba(255,255,255,.18); }
.btn-outline { background: transparent; color: var(--gold); border: 1px solid var(--gold-br); }
.btn-outline:hover:not(:disabled) { background: var(--gold-dim); }
.btn-sm-g { background:transparent; color:var(--green); border:1px solid rgba(34,197,94,.28); font-size:.63rem; padding:.28rem .7rem; border-radius:5px; }
.btn-sm-g:hover:not(:disabled) { background:rgba(34,197,94,.08); }
.btn-sm-r { background:transparent; color:var(--red); border:1px solid rgba(239,68,68,.28); font-size:.63rem; padding:.28rem .7rem; border-radius:5px; }
.btn-sm-r:hover:not(:disabled) { background:rgba(239,68,68,.08); }
.btn-sm-e { background:transparent; color:var(--txt2); border:1px solid var(--bdr); font-size:.63rem; padding:.28rem .7rem; border-radius:5px; }

/* nav row */
.nav-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 2.25rem; padding-top: 1.25rem;
  border-top: 1px solid var(--bdr);
}

/* ── upload ── */
.up-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.up-card {
  background: var(--bg3);
  border: 1px dashed var(--bdr);
  border-radius: 10px; padding: 1.6rem 1.2rem;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  cursor: pointer; transition: all .25s; gap: .65rem; min-height: 155px;
}
.up-card:hover { border-color: var(--gold-br); background: var(--bg4); }
.up-card.done  { border-style: solid; border-color: rgba(34,197,94,.32); background: rgba(34,197,94,.04); }
.up-card.uploading { border-style: solid; border-color: var(--gold-br); background: var(--gold-dim); }
.up-card.sample-card { border-color: var(--gold-br); background: var(--gold-dim); grid-column: 1/-1; }
.up-icon { font-size: 1.8rem; line-height: 1; }
.up-label { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 500; color: var(--txt1); }
.up-hint { font-size: .62rem; color: var(--txt3); }

/* progress bars */
.prog-bar { width: 100%; height: 4px; background: rgba(255,255,255,.07); border-radius: 2px; overflow: hidden; }
.prog-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); border-radius: 2px; transition: width .35s ease; }
.gold-prog { width: 100%; height: 7px; background: rgba(255,255,255,.06); border-radius: 3px; overflow: hidden; }
.gold-fill  { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); border-radius: 3px; transition: width .7s ease; }
.mini-prog  { display: flex; align-items: center; gap: .45rem; }
.mini-bar   { width: 56px; height: 4px; background: rgba(255,255,255,.08); border-radius: 2px; overflow: hidden; }
.mini-fill  { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); border-radius: 2px; }

/* ── classification table ── */
.dt { width: 100%; border-collapse: collapse; }
.dt th { font-size: .59rem; text-transform: uppercase; letter-spacing: .1em; color: var(--txt3); padding: .55rem .9rem; text-align: left; border-bottom: 1px solid var(--bdr); }
.dt td { padding: .7rem .9rem; font-size: .73rem; border-bottom: 1px solid var(--bdr); vertical-align: middle; }
.dt tr:last-child td { border-bottom: none; }
.dt tr:hover td { background: rgba(255,255,255,.015); }
.act-row { display: flex; gap: .35rem; flex-wrap: wrap; }

/* ── schema ── */
.sch-row { display:flex; align-items:center; gap:.7rem; padding:.6rem .9rem; border-bottom:1px solid var(--bdr); transition:background .15s; }
.sch-row:last-child { border-bottom:none; }
.sch-row:hover { background:rgba(255,255,255,.018); }
.sch-key { font-size:.73rem; color:var(--cyan); min-width:155px; flex-shrink:0; }
.sch-type { font-size:.62rem; color:var(--gold); background:var(--gold-dim); border:1px solid var(--gold-br); padding:1px 6px; border-radius:4px; }
.sch-lbl { font-size:.73rem; color:var(--txt2); flex:1; }

/* ── extracted data ── */
.ext-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.45rem; }
.ext-kv { background:var(--bg3); border:1px solid var(--bdr); border-radius:5px; padding:.55rem .7rem; }
.ext-k { font-size:.58rem; color:var(--txt3); text-transform:uppercase; letter-spacing:.07em; margin-bottom:.15rem; }
.ext-v { font-size:.78rem; color:var(--txt1); font-weight:500; }
.doc-card { background:var(--card-bg); border:1px solid var(--bdr); border-radius:8px; padding:1.2rem; margin-bottom:.9rem; }
.doc-hd { display:flex; align-items:center; gap:.7rem; margin-bottom:.85rem; }

/* ── loading overlay ── */
.loader-overlay {
  position:fixed; inset:0; background:var(--loader-bg);
  z-index:200; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:1.75rem;
}
.loader-title { font-family:'Cormorant Garamond',serif; font-size:1.55rem; color:var(--gold); text-align:center; }
.loader-stage { font-size:.68rem; color:var(--txt2); margin-top:.35rem; font-style:italic; }
.loader-prog-wrap { width:380px; max-width:92vw; }
.loader-pct-row { display:flex; justify-content:space-between; font-size:.67rem; color:var(--txt2); margin-bottom:.45rem; }
.check-grid { display:grid; grid-template-columns:1fr 1fr; gap:.65rem; width:380px; max-width:92vw; }
.check-item { display:flex; align-items:center; gap:.5rem; font-size:.7rem; color:var(--txt2); padding:.45rem .75rem; background:var(--bg2); border:1px solid var(--bdr); border-radius:6px; }
.check-item.done   { color:var(--green); border-color:rgba(34,197,94,.22); }
.check-item.active { color:var(--gold);  border-color:var(--gold-br); }

/* ── metric cards ── */
.metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:.85rem; margin-bottom:1.75rem; }
.met-card { background:var(--card-bg); border:1px solid var(--bdr); border-radius:10px; padding:1.2rem; text-align:center; box-shadow:var(--shadow); }
.met-lbl { font-size:.58rem; text-transform:uppercase; letter-spacing:.1em; color:var(--txt3); margin-bottom:.45rem; }
.met-val { font-family:'Cormorant Garamond',serif; font-size:1.65rem; font-weight:600; line-height:1; margin-bottom:.2rem; }
.met-val.gold  { color:var(--gold); }
.met-val.green { color:var(--green); }
.met-val.amber { color:var(--amber); }
.met-val.red   { color:var(--red); }
.met-sub { font-size:.6rem; color:var(--txt3); font-style:italic; }

/* ── risk section ── */
.analysis-cols { display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; }
.risk-row { display:flex; align-items:center; gap:.7rem; margin-bottom:.65rem; }
.risk-lbl { font-size:.68rem; color:var(--txt2); width:115px; flex-shrink:0; }
.risk-track { flex:1; height:8px; background:rgba(255,255,255,.06); border-radius:4px; overflow:hidden; }
.risk-fill  { height:100%; border-radius:4px; transition:width 1.1s ease; }
.risk-fill.low  { background:linear-gradient(90deg,#22c55e,#4ade80); }
.risk-fill.med  { background:linear-gradient(90deg,#f59e0b,#fbbf24); }
.risk-fill.high { background:linear-gradient(90deg,#ef4444,#f87171); }
.risk-num { font-size:.68rem; width:28px; text-align:right; flex-shrink:0; }
.risk-num.low { color:var(--green); } .risk-num.med { color:var(--amber); } .risk-num.high { color:var(--red); }

.alert-box { background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.22); border-left:3px solid var(--red); border-radius:7px; padding:.85rem 1rem; margin-top:1rem; }
.alert-hd { font-size:.62rem; color:var(--red); font-weight:600; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.28rem; }
.alert-txt { font-size:.69rem; color:rgba(239,68,68,.82); line-height:1.55; font-family:'Cormorant Garamond',serif; font-size:.78rem; }

.sig-row { display:flex; align-items:flex-start; gap:.7rem; padding:.6rem 0; border-bottom:1px solid var(--bdr); }
.sig-row:last-child { border-bottom:none; }
.sig-lbl { font-size:.68rem; color:var(--txt2); width:108px; flex-shrink:0; }
.sig-val { font-size:.73rem; font-weight:500; width:65px; flex-shrink:0; }
.sig-note { font-size:.66rem; color:var(--txt3); flex:1; line-height:1.45; font-family:'Cormorant Garamond',serif; font-size:.78rem; }

/* ── SWOT ── */
.swot-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--bdr); border-radius:10px; overflow:hidden; }
.swot-q { background:var(--swot-bg); padding:1.25rem; }
.swot-title { font-size:.62rem; text-transform:uppercase; letter-spacing:.12em; font-weight:600; margin-bottom:.8rem; display:flex; align-items:center; gap:.4rem; }
.swot-item { font-family:'Cormorant Garamond',serif; font-size:.88rem; color:var(--txt2); margin-bottom:.45rem; padding-left:.8rem; border-left:2px solid; line-height:1.45; }

/* ── news ── */
.news-item { display:flex; align-items:flex-start; gap:.7rem; padding:.8rem 0; border-bottom:1px solid var(--bdr); }
.news-item:last-child { border-bottom:none; }
.news-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.news-txt { font-family:'Cormorant Garamond',serif; font-size:.9rem; color:var(--txt2); flex:1; line-height:1.5; }
.news-sent { font-size:.58rem; text-transform:uppercase; letter-spacing:.08em; flex-shrink:0; margin-top:3px; }
.tri-box { margin-top:1.4rem; background:var(--bg3); border:1px solid rgba(77,217,232,.22); border-left:3px solid var(--cyan); border-radius:7px; padding:1rem 1.1rem; }
.tri-title { font-size:.59rem; text-transform:uppercase; letter-spacing:.1em; color:var(--cyan); margin-bottom:.45rem; }
.tri-txt { font-family:'Cormorant Garamond',serif; font-size:.88rem; color:var(--txt2); line-height:1.6; }

/* ── recommendation ── */
.dec-box { border-radius:9px; padding:1.4rem; border-left:4px solid; margin-bottom:1.4rem; background:var(--card-bg); box-shadow:var(--shadow); }
.dec-box.amber { border-color:var(--amber); }
.dec-box.green { border-color:var(--green); }
.dec-box.red   { border-color:var(--red); }
.dec-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.1rem; }
.dec-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; }
.dec-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:.9rem; }
.dec-stat { background:var(--bg3); border-radius:7px; padding:.8rem; text-align:center; }
.dec-stat-lbl { font-size:.58rem; text-transform:uppercase; letter-spacing:.08em; color:var(--txt3); margin-bottom:.3rem; }
.dec-stat-val { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:var(--gold); }
.reason-box { background:var(--bg3); border-left:3px solid var(--gold); border-radius:5px; padding:.95rem 1.15rem; margin:1.2rem 0; }
.reason-title { font-size:.58rem; text-transform:uppercase; letter-spacing:.1em; color:var(--gold); margin-bottom:.45rem; }
.reason-txt { font-family:'Cormorant Garamond',serif; font-size:.9rem; color:var(--txt2); line-height:1.65; }
.conds-list { list-style:none; counter-reset:conds; }
.conds-list li { counter-increment:conds; display:flex; align-items:flex-start; gap:.7rem; padding:.55rem 0; border-bottom:1px solid var(--bdr); font-family:'Cormorant Garamond',serif; font-size:.88rem; color:var(--txt2); line-height:1.5; }
.conds-list li:last-child { border-bottom:none; }
.conds-list li::before { content:counter(conds,decimal-leading-zero); font-size:.63rem; color:var(--gold); flex-shrink:0; font-weight:600; padding-top:2px; font-family:'IBM Plex Mono',monospace; }

/* ── CAM ── */
.cam-hd { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.4rem; gap:.75rem; flex-wrap:wrap; }
.cam-entity { font-family:'Cormorant Garamond',serif; font-size:1.35rem; font-weight:600; color:var(--gold); }
.cam-meta { font-size:.63rem; color:var(--txt3); margin-top:.2rem; font-style:italic; }
.fivec { display:grid; grid-template-columns:repeat(5,1fr); gap:.7rem; margin-bottom:1.4rem; }
.fivec-item { background:var(--bg3); border:1px solid var(--gold-br); border-radius:7px; padding:.8rem; text-align:center; }
.fivec-icon { font-size:1.1rem; margin-bottom:.35rem; }
.fivec-lbl { font-size:.6rem; text-transform:uppercase; letter-spacing:.1em; color:var(--gold); }
.cam-txt {
  background:var(--bg);
  border:1px solid var(--bdr);
  border-radius:7px; padding:1.2rem;
  max-height:300px; overflow-y:auto;
  white-space:pre-wrap;
  font-family:'Cormorant Garamond',serif;
  font-size:.85rem; color:var(--txt2); line-height:1.75;
}
.cam-disc { margin-top:.9rem; font-size:.61rem; color:var(--txt3); text-align:center; line-height:1.5; font-style:italic; }
`;

/* ─── constants ──────────────────────────────────────────────────────── */
const SECTORS   = ["NBFC","Manufacturing","Infrastructure","Real Estate","Technology","Healthcare","Retail","Agriculture","Energy","Logistics"];
const LOAN_TYPES = ["Term Loan","Working Capital","NCD Subscription","Structured Finance","Co-lending"];

const DOCS = [
  { id:"alm",          label:"ALM Statement",          icon:"⚖️",  type:"ALM Statement" },
  { id:"shareholding", label:"Shareholding Pattern",   icon:"🏛️", type:"Shareholding Pattern" },
  { id:"borrowing",    label:"Borrowing Profile",      icon:"📋",  type:"Borrowing Profile" },
  { id:"annual",       label:"Annual Reports",         icon:"📊",  type:"Annual Reports" },
  { id:"portfolio",    label:"Portfolio / Performance",icon:"📈",  type:"Portfolio / Performance" },
];

const SCHEMA_FIELDS = [
  { key:"total_assets",            type:"currency",   label:"Total Assets (₹ Cr)" },
  { key:"total_liabilities",       type:"currency",   label:"Total Liabilities (₹ Cr)" },
  { key:"liquidity_coverage_ratio",type:"percentage", label:"Liquidity Coverage Ratio" },
  { key:"promoter_holding",        type:"percentage", label:"Promoter Holding %" },
  { key:"total_debt",              type:"currency",   label:"Total Debt (₹ Cr)" },
  { key:"debt_ebitda",             type:"ratio",      label:"Debt / EBITDA Ratio" },
  { key:"gross_npa",               type:"percentage", label:"Gross NPA %" },
  { key:"revenue_ttm",             type:"currency",   label:"Revenue TTM (₹ Cr)" },
  { key:"ebitda_margin",           type:"percentage", label:"EBITDA Margin %" },
  { key:"dscr",                    type:"ratio",      label:"Debt Service Coverage Ratio" },
];

const MOCK_EXT: Record<string, { label:string; icon:string; fieldCount:number; data:[string,string][] }> = {
  alm: {
    label:"ALM Statement", icon:"⚖️", fieldCount:12,
    data:[["Total Assets","₹4,280 Cr"],["Total Liabilities","₹3,840 Cr"],["LCR","134.2%"],["NSFR","118.6%"],["Duration Gap","0.42 yrs"],["Short-term Borrowings","₹820 Cr"],["Long-term Borrowings","₹1,020 Cr"],["HTM Securities","₹640 Cr"],["AFS Portfolio","₹280 Cr"],["Cash & Equivalents","₹184 Cr"],["Interest Rate Risk","Moderate"],["Structural Liquidity","Adequate"]]
  },
  shareholding: {
    label:"Shareholding Pattern", icon:"🏛️", fieldCount:9,
    data:[["Promoter Holding","58.4%"],["Promoter Pledge","8.3%"],["Public / FPO","21.2%"],["FII / FPI","12.1%"],["DII","6.3%"],["ESOP Pool","2.0%"],["Retail Shareholders","4,280"],["Beneficial Owners","3 entities"],["Last Updated","Q3 FY26"]]
  },
  borrowing: {
    label:"Borrowing Profile", icon:"📋", fieldCount:10,
    data:[["Total Debt","₹1,840 Cr"],["Avg Cost of Funds","9.8% p.a."],["Debt/EBITDA","3.2x"],["Secured Debt","72%"],["Unsecured Debt","28%"],["Bank Lines","₹640 Cr"],["NCD Outstanding","₹420 Cr"],["CP Outstanding","₹180 Cr"],["Avg Residual Tenure","2.8 yrs"],["Credit Rating","AA- / Stable"]]
  },
  annual: {
    label:"Annual Reports", icon:"📊", fieldCount:14,
    data:[["Revenue FY25","₹3,210 Cr"],["EBITDA Margin","18.4%"],["PAT","₹284 Cr"],["ROCE","14.2%"],["ROE","11.8%"],["Net Worth","₹2,140 Cr"],["D/E Ratio","0.86x"],["Interest Coverage","2.4x"],["Operating Cash Flow","₹312 Cr"],["Capex FY25","₹48 Cr"],["Dividend Payout","22%"],["EPS","₹18.4"],["Book Value/Share","₹142"],["P&L Trend","3Y CAGR 16%"]]
  },
  portfolio: {
    label:"Portfolio / Performance", icon:"📈", fieldCount:11,
    data:[["Gross NPA","2.8%"],["Net NPA","1.2%"],["PCR","57.4%"],["AUM","₹6,840 Cr"],["Collection Efficiency","97.2%"],["GNPA YoY Change","-0.4%"],["Write-offs FY25","₹86 Cr"],["SMA-2 Accounts","1.4%"],["Restructured Portfolio","0.8%"],["Top-10 Borrower Conc.","34.2%"],["Disbursement Growth","24% YoY"]]
  },
};

const RISK_SCORES = { "Financial Risk":34, "Promoter Risk":62, "Sector Risk":48, "Legal Risk":41, "ESG Risk":28 };

const NEWS = [
  { dot:"#ef4444", sent:"NEGATIVE", sentColor:"#ef4444", txt:"ED inquiry into promoter group's overseas entities flagged in regulatory filing; SFIO examining related party transactions worth ₹280 Cr." },
  { dot:"#ef4444", sent:"NEGATIVE", sentColor:"#ef4444", txt:"Gross NPA ratio ticked up 40bps QoQ in Q2 FY26 amid stress in real estate and retail segments; PAT declined 8% sequentially." },
  { dot:"#22c55e", sent:"POSITIVE", sentColor:"#22c55e", txt:"Company secures ₹400 Cr co-lending arrangement with SBI; expected to improve NIMs by 35–40bps and accelerate disbursement growth." },
  { dot:"#22c55e", sent:"POSITIVE", sentColor:"#22c55e", txt:"RBI grants NBFC-UL classification upgrade; regulatory compliance rated 'Strong' — opens access to lower-cost refinance windows." },
  { dot:"#4dd9e8", sent:"NEUTRAL",  sentColor:"#4dd9e8", txt:"Sector-level NBFC credit growth moderating to 14% from 22% peak; company tracking at sector median with stable spread compression." },
];

const SIGNALS = [
  { label:"Debt/EBITDA",    value:"3.2x",  note:"Marginally elevated; comfortable below 4.0x for sector peers",             color:"#f59e0b" },
  { label:"Gross NPA",      value:"2.8%",  note:"Below industry median of 3.6%; improving trend over 8 consecutive quarters", color:"#22c55e" },
  { label:"EBITDA Margin",  value:"18.4%", note:"Healthy; peer median at 16.8%; supported by operating leverage gains",       color:"#22c55e" },
  { label:"Promoter Pledge",value:"8.3%",  note:"Amber flag — elevated vs ideal of 0%; reduction roadmap mandated",           color:"#f59e0b" },
  { label:"DSCR",           value:"1.18x", note:"Below internal 1.25x threshold; close monitoring and covenant required",     color:"#ef4444" },
  { label:"ICR",            value:"2.4x",  note:"Adequate coverage; minimum 1.75x internal benchmark comfortably met",        color:"#22c55e" },
];

const FIVE_CS = [
  { icon:"🎭", label:"Character" },
  { icon:"⚡", label:"Capacity" },
  { icon:"🏦", label:"Capital" },
  { icon:"🔒", label:"Collateral" },
  { icon:"📜", label:"Conditions" },
];

const STEP_LABELS = ["Entity Onboarding","Data Ingestion","Classification","AI Analysis & CAM"];

/* ─── helpers ────────────────────────────────────────────────────────── */
function riskClass(n: number) { return n < 40 ? "low" : n < 55 ? "med" : "high"; }
function scoreColor(n: number) { return n >= 75 ? "green" : n >= 55 ? "amber" : "red"; }
function decColor(d: string) {
  const l = (d || "").toLowerCase();
  if (l.includes("conditional")) return "amber";
  if (l.includes("approved"))    return "green";
  return "red";
}

function buildFallback(name: string, sector: string, amt: number) {
  return {
    swot: {
      strengths:["Established 12-year track record with consistent dividend history","Diversified sectoral exposure limiting single-point concentration risk","Strong promoter credentials with clean SEBI regulatory record","Adequate CAR of 18.4% above RBI mandated minimum of 15%"],
      weaknesses:["Elevated promoter pledge at 8.3% — above acceptable threshold of 5%","Cost of funds at 9.8% above peer median by approximately 60bps","DSCR at 1.18x marginally below the internal benchmark of 1.25x","Moderate geographic concentration in western India (58% of AUM)"],
      opportunities:["RBI co-lending priority push creating low-cost funding access for NBFCs","MSME credit gap of ₹25L Cr offering significant expansion headroom","Digital lending stack enabling scalable and cost-efficient customer acquisition","Proposed SARFAESI amendment expected to reduce recovery cycle by 40%"],
      threats:["10Y G-Sec at 7.4% compressing NBFC spreads by approximately 35–40bps","RBI scale-based regulation imposing incremental compliance and capital costs","Aggressive bank digital arms actively targeting prime NBFC borrowers","Potential downstream credit stress from overleveraged retail segment"],
    },
    recommendation:{
      decision:"Conditional Approval",
      suggestedAmount:`₹${Math.round(amt * 0.857)} Cr`,
      suggestedRate:"10.25% p.a.",
      reasoning:`${name} presents an acceptable credit profile within the ${sector} sector with manageable overall risk parameters. Financial metrics broadly support the quantum, though elevated promoter pledge and below-benchmark DSCR necessitate structured conditions. The composite score of 68 maps to an internal 'BB+' equivalent band, and secondary intelligence signals the ongoing ED inquiry as a material watchlist item.`,
      conditions:["Quarterly audited financials to be submitted within 45 days of quarter end","Promoter pledge to be reduced to below 5% within 12 months of disbursement","Minimum DSCR of 1.25x to be maintained throughout the entire loan tenure","Prior written approval required for any acquisition or capex exceeding ₹50 Cr","Personal guarantee from all promoter directors holding equity stake greater than 10%"],
      compositeScore:68,
    },
    camReport:`CREDIT APPRAISAL MEMORANDUM

Entity: ${name}  |  Sector: ${sector}  |  Date: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}

CHARACTER ASSESSMENT
${name} demonstrates credible institutional character with over 12 years of continuous operations in the Indian ${sector} sector. Promoter credentials are satisfactory with no direct adverse SEBI findings on the principal entity. The ongoing ED inquiry into promoter group overseas entities is a key watchlist item. Management depth is adequate, with seasoned leadership maintaining established banking relationships and a track record of regulatory compliance.

CAPACITY ANALYSIS
Repayment capacity is assessed on trailing 12-month cash flows. EBITDA of ₹590.64 Cr (18.4% margin on ₹3,210 Cr revenue) provides the primary debt service pool. DSCR at 1.18x is marginally below the internal benchmark of 1.25x, indicating limited but manageable headroom. Collection efficiency at 97.2% and operating cash flow of ₹312 Cr provide near-term liquidity comfort. The 3-year revenue CAGR of 16% supports medium-term repayment assumptions.

CAPITAL STRUCTURE
Net worth of ₹2,140 Cr translates to a D/E ratio of 0.86x at the entity level — conservative for the sector. Total debt of ₹1,840 Cr (3.2x EBITDA) is within sectoral norms. ROCE of 14.2% exceeds the estimated WACC, confirming positive economic value addition. CAR at 18.4% provides adequate regulatory buffer above the RBI-mandated minimum.

COLLATERAL & SECURITY
Primary security comprises hypothecation of specific loan receivables and current assets. Collateral coverage of 1.35x provides adequate downside protection in a stress scenario. Pledge of promoter shareholding (post reduction to 5%) to be registered as additional security. Personal guarantees from all promoter directors with stake >10% are stipulated as a condition precedent to disbursement.

CONDITIONS & COVENANTS
Facility is proposed with quarterly reporting covenants, promoter pledge reduction within 12 months, DSCR maintenance at ≥1.25x, a material adverse change clause, and restriction on unsecured related-party lending exceeding ₹50 Cr without prior approval.

RECOMMENDATION
Based on the Five Cs analysis, the credit committee is recommended to consider a Conditional Approval for ₹${Math.round(amt * 0.857)} Cr (vs. requested ₹${amt} Cr) at 10.25% p.a., subject to full compliance with all conditions precedent and the ongoing covenant package.`,
  };
}

/* ─── component ─────────────────────────────────────────────────────── */
export default function IntelliCredit() {
  const [dark, setDark] = useState(true);
  const [step, setStep]         = useState(0);
  const [tab0, setTab0]         = useState(0);
  const [tab2, setTab2]         = useState(0);
  const [tab3, setTab3]         = useState(0);

  /* form */
  const [company,  setCompany]  = useState("Arcturus Capital Finance Ltd");
  const [cin,      setCin]      = useState("L65191MH2012PLC234567");
  const [pan,      setPan]      = useState("AABCA1234B");
  const [sector,   setSector]   = useState("NBFC");
  const [turnover, setTurnover] = useState("3210");
  const [netWorth, setNetWorth] = useState("2140");
  const [years,    setYears]    = useState("12");
  const [loanType, setLoanType] = useState("Term Loan");
  const [loanAmt,  setLoanAmt]  = useState("175");
  const [tenure,   setTenure]   = useState("5");
  const [rate,     setRate]     = useState("10.50");
  const [purpose,  setPurpose]  = useState("Expansion of lending book in Tier-2 and Tier-3 cities; on-lending to MSMEs and housing segment. Funds to augment capital adequacy ratio and meet regulatory capital buffer requirements.");

  /* uploads */
  const initUps = () => Object.fromEntries(DOCS.map(d => [d.id, { status:"idle" as const, prog:0 }]));
  const [ups,   setUps]   = useState(initUps);
  const [clsf,  setClsf]  = useState<Record<string,"Pending"|"Approved"|"Denied">>(Object.fromEntries(DOCS.map(d => [d.id,"Pending"])));

  /* AI results */
  const [loading,   setLoading]   = useState(false);
  const [loadPct,   setLoadPct]   = useState(0);
  const [loadStage, setLoadStage] = useState("");
  const [clDone,    setClDone]    = useState<string[]>([]);
  const [clActive,  setClActive]  = useState("");
  const [swot,      setSwot]      = useState<any>(null);
  const [reco,      setReco]      = useState<any>(null);
  const [cam,       setCam]       = useState("");

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const uploadCount = Object.values(ups).filter(u => u.status === "done").length;
  const approved    = Object.entries(clsf).filter(([,v]) => v === "Approved").map(([k]) => k);

  /* simulate upload */
  const simulateUpload = useCallback((id: string, delay = 0) => {
    setTimeout(() => {
      setUps(p => ({ ...p, [id]: { status:"uploading", prog:0 } }));
      let prog = 0;
      const iv = setInterval(() => {
        prog += Math.random() * 22 + 8;
        if (prog >= 100) { clearInterval(iv); setTimeout(() => setUps(p => ({ ...p, [id]: { status:"done", prog:100 } })), 200); }
        else setUps(p => ({ ...p, [id]: { status:"uploading", prog } }));
      }, 110);
    }, delay);
  }, []);

  const loadSamples = useCallback(() => { DOCS.forEach((d, i) => simulateUpload(d.id, i * 750)); }, [simulateUpload]);
  const approveAll  = useCallback(() => {
    setClsf(p => { const n = { ...p }; DOCS.forEach(d => { if (ups[d.id]?.status === "done") n[d.id] = "Approved"; }); return n; });
  }, [ups]);

  /* run AI */
  const runAI = useCallback(async () => {
    setLoading(true); setLoadPct(0); setClDone([]); setClActive("swot");
    const stages = [
      { pct:12,  stage:"Initialising AI Engine…",     active:"swot" },
      { pct:28,  stage:"Generating SWOT Analysis…",   active:"swot" },
      { pct:52,  stage:"Running Secondary Research…", active:"research", done:"swot" },
      { pct:72,  stage:"Computing Risk Scores…",       active:"risk",     done:"research" },
      { pct:88,  stage:"Synthesising CAM Report…",    active:"cam",      done:"risk" },
    ];
    for (const s of stages) {
      await new Promise(r => setTimeout(r, 500));
      setLoadPct(s.pct); setLoadStage(s.stage); setClActive(s.active);
      if (s.done) setClDone(p => [...p, s.done!]);
    }

    const extData: Record<string, any> = {};
    (approved.length > 0 ? approved : DOCS.map(d => d.id))
      .forEach(id => { extData[id] = MOCK_EXT[id]?.data; });

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      const resp = await fetch(`${import.meta.env.BASE_URL}api/ai/analyze`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ companyName:company, sector, loanAmount:Number(loanAmt), loanType, extractedData:extData }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await resp.json();
      setSwot(data.swot);
      setReco(data.recommendation);
      setCam(data.camReport);
    } catch {
      const fb = buildFallback(company, sector, Number(loanAmt));
      setSwot(fb.swot); setReco(fb.recommendation); setCam(fb.camReport);
    }

    setLoadPct(100); setClDone(["swot","research","risk","cam"]); setClActive(""); setLoadStage("Analysis Complete");
    await new Promise(r => setTimeout(r, 550));
    setLoading(false); setStep(3);
  }, [approved, company, sector, loanAmt, loanType]);

  /* download */
  const downloadCam = useCallback(() => {
    const txt = [
      "INTELLICREDIT — AI CREDIT APPRAISAL MEMORANDUM",
      "=".repeat(58),
      `Entity: ${company}`, `Sector: ${sector}`, `Loan Type: ${loanType}`,
      `Loan Amount: ₹${loanAmt} Cr`, `Tenure: ${tenure} years`,
      `Date: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}`, "",
      "DECISION","-".repeat(40),
      `Decision: ${reco?.decision}`, `Score: ${reco?.compositeScore}/100`,
      `Limit: ${reco?.suggestedAmount}`, `Rate: ${reco?.suggestedRate}`, "",
      "REASONING","-".repeat(40), reco?.reasoning || "", "",
      "CONDITIONS","-".repeat(40),
      ...(reco?.conditions || []).map((c: string, i: number) => `${i+1}. ${c}`), "",
      "CAM REPORT","=".repeat(58), cam, "",
      "RISK SCORES","-".repeat(40),
      ...Object.entries(RISK_SCORES).map(([k,v]) => `${k}: ${v}/100`), "",
      "DISCLAIMER: Generated by IntelliCredit AI for evaluation purposes only.",
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type:"text/plain" }));
    a.download = `CAM_${company.replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  }, [company, sector, loanType, loanAmt, tenure, reco, cam]);

  /* reset */
  const reset = useCallback(() => {
    setStep(0); setTab0(0); setTab2(0); setTab3(0);
    setUps(initUps()); setClsf(Object.fromEntries(DOCS.map(d => [d.id,"Pending"])));
    setSwot(null); setReco(null); setCam("");
    setLoading(false); setLoadPct(0); setClDone([]); setClActive("");
  }, []);

  const sc = reco ? scoreColor(reco.compositeScore) : "amber";
  const dc = reco ? decColor(reco.decision)         : "amber";

  /* sync dark class on root */
  useEffect(() => {
    document.getElementById("root")?.classList.toggle("light", !dark);
  }, [dark]);

  return (
    <>
      <style>{STYLES}</style>

      {/* ── header ── */}
      <header className="ic-header">
        <div style={{ display:"flex", alignItems:"center", gap:".7rem" }}>
          <div className="ic-logo">Intelli<span>Credit</span></div>
          <span className="chip chip-gold">PROTOTYPE v1.0</span>
          <span className="chip chip-cyan">HACKATHON BUILD</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
          <span style={{ fontSize:".63rem", color:"var(--txt3)", fontStyle:"italic" }}>AI-Powered Corporate Credit Engine</span>
          {step === 3 && <><span className="blink" style={{ width:6, height:6, background:"var(--green)", borderRadius:"50%", display:"inline-block" }} /><span style={{ fontSize:".6rem", color:"var(--green)" }}>LIVE</span></>}
          <button className="theme-btn" onClick={() => setDark(d => !d)}>
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <div className="ic-main">

        {/* ── wizard strip ── */}
        <div className="wizard-strip">
          {STEP_LABELS.map((lbl, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start" }}>
              <div className="w-node">
                <div className={`w-circle ${i < step ? "done" : i === step ? "active" : "idle"}`}>
                  {i < step ? "✓" : i + 1}
                  <span className="w-label">{lbl}</span>
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`w-line ${i < step ? "done" : "idle"}`} />}
            </div>
          ))}
        </div>

        {/* ══════════════════════ STEP 0 ══════════════════════ */}
        {step === 0 && (
          <div className="fade-in">
            <div className="sec-title">Entity Onboarding</div>
            <div className="sec-sub">Provide company profile and loan parameters to begin the assessment</div>
            <div className="sub-tabs">
              {["Company Details","Loan Parameters"].map((t,i) => (
                <button key={t} className={`s-tab ${tab0===i?"on":""}`} onClick={() => setTab0(i)}>{t}</button>
              ))}
            </div>

            {tab0 === 0 && (
              <div className="fade-in card">
                <div className="form-grid">
                  <div className="fg-full"><label className="f-lbl">Company Name</label><input className="f-inp" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Legal entity name as per ROC" /></div>
                  <div><label className="f-lbl">CIN</label><input className="f-inp" value={cin} onChange={e=>setCin(e.target.value)} placeholder="L12345MH2012PLC123456" /></div>
                  <div><label className="f-lbl">PAN</label><input className="f-inp" value={pan} onChange={e=>setPan(e.target.value)} placeholder="AAAAA0000A" /></div>
                  <div><label className="f-lbl">Sector</label>
                    <select className="f-inp" value={sector} onChange={e=>setSector(e.target.value)}>{SECTORS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><label className="f-lbl">Annual Turnover (₹ Cr)</label><input className="f-inp" type="number" value={turnover} onChange={e=>setTurnover(e.target.value)} /></div>
                  <div><label className="f-lbl">Net Worth (₹ Cr)</label><input className="f-inp" type="number" value={netWorth} onChange={e=>setNetWorth(e.target.value)} /></div>
                  <div><label className="f-lbl">Years in Operation</label><input className="f-inp" type="number" value={years} onChange={e=>setYears(e.target.value)} /></div>
                </div>
                <div className="nav-row"><div /><button className="btn btn-primary" onClick={()=>setTab0(1)}>Next → Loan Parameters</button></div>
              </div>
            )}

            {tab0 === 1 && (
              <div className="fade-in card">
                <div className="form-grid">
                  <div><label className="f-lbl">Loan Type</label>
                    <select className="f-inp" value={loanType} onChange={e=>setLoanType(e.target.value)}>{LOAN_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label className="f-lbl">Loan Amount (₹ Cr)</label><input className="f-inp" type="number" value={loanAmt} onChange={e=>setLoanAmt(e.target.value)} /></div>
                  <div><label className="f-lbl">Tenure (years)</label><input className="f-inp" type="number" value={tenure} onChange={e=>setTenure(e.target.value)} /></div>
                  <div><label className="f-lbl">Expected Rate (% p.a.)</label><input className="f-inp" type="number" step=".25" value={rate} onChange={e=>setRate(e.target.value)} /></div>
                  <div className="fg-full"><label className="f-lbl">Purpose of Loan</label><textarea className="f-inp" value={purpose} onChange={e=>setPurpose(e.target.value)} /></div>
                </div>
                <div className="summary-box">
                  <div className="summary-box-title">Assessment Preview</div>
                  <div className="sum-grid">
                    <div><div className="sum-lbl">Entity</div><div className="sum-val gold">{company||"—"}</div></div>
                    <div><div className="sum-lbl">Sector</div><div className="sum-val">{sector}</div></div>
                    <div><div className="sum-lbl">CIN</div><div className="sum-val">{cin||"—"}</div></div>
                    <div><div className="sum-lbl">Loan Amount</div><div className="sum-val gold">₹{loanAmt||"0"} Cr</div></div>
                    <div><div className="sum-lbl">Loan Type</div><div className="sum-val">{loanType}</div></div>
                    <div><div className="sum-lbl">Tenure</div><div className="sum-val">{tenure||"0"} yr @ {rate||"0"}%</div></div>
                  </div>
                </div>
                <div className="nav-row">
                  <button className="btn btn-ghost" onClick={()=>setTab0(0)}>← Back</button>
                  <button className="btn btn-primary" onClick={()=>setStep(1)}>Proceed to Data Ingestion →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ STEP 1 ══════════════════════ */}
        {step === 1 && (
          <div className="fade-in">
            <div className="sec-title">Intelligent Data Ingestion</div>
            <div className="sec-sub">Upload financial documents for AI-powered extraction and classification</div>

            <div className="up-grid">
              {DOCS.map(doc => {
                const u = ups[doc.id];
                return (
                  <div key={doc.id} className={`up-card ${u.status==="done"?"done":u.status==="uploading"?"uploading":""}`}
                    onClick={() => u.status==="idle" && fileRefs.current[doc.id]?.click()}>
                    <input type="file" ref={el=>{fileRefs.current[doc.id]=el}} style={{display:"none"}} onChange={()=>simulateUpload(doc.id)} />
                    <div className="up-icon">{doc.icon}</div>
                    <div className="up-label">{doc.label}</div>
                    {u.status==="idle"      && <div className="up-hint">Click or drag & drop PDF / XLSX</div>}
                    {u.status==="uploading" && <><div className="prog-bar" style={{width:"82%"}}><div className="prog-fill" style={{width:`${u.prog}%`}} /></div><div style={{fontSize:".61rem",color:"var(--gold)"}}>Uploading… {Math.round(u.prog)}%</div></>}
                    {u.status==="done"      && <span className="chip chip-green">✓ Uploaded</span>}
                  </div>
                );
              })}
              <div className="up-card sample-card" onClick={loadSamples}>
                <div className="up-icon">🗂️</div>
                <div className="up-label" style={{color:"var(--gold)"}}>Use Sample Documents</div>
                <div className="up-hint" style={{color:"rgba(154,111,35,.65)"}}>Load all 5 documents with mock financial data for demo</div>
              </div>
            </div>

            <div style={{margin:"1.4rem 0 .5rem",display:"flex",alignItems:"center",gap:".75rem"}}>
              <span style={{fontSize:".68rem",color:"var(--txt2)"}}>{uploadCount} / {DOCS.length} documents uploaded</span>
              <div style={{flex:1}}><div className="gold-prog"><div className="gold-fill" style={{width:`${(uploadCount/DOCS.length)*100}%`}} /></div></div>
            </div>

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={()=>setStep(0)}>← Back</button>
              <button className="btn btn-primary" disabled={uploadCount===0} onClick={()=>setStep(2)}>Run Auto-Classification →</button>
            </div>
          </div>
        )}

        {/* ══════════════════════ STEP 2 ══════════════════════ */}
        {step === 2 && !loading && (
          <div className="fade-in">
            <div className="sec-title">Classification & Schema Mapping</div>
            <div className="sec-sub">AI-detected document types with confidence scoring and extraction schema</div>

            <div className="sub-tabs">
              {["Auto-Classification Review","Extraction Schema","Extracted Data"].map((t,i)=>(
                <button key={t} className={`s-tab ${tab2===i?"on":""}`} onClick={()=>setTab2(i)}>{t}</button>
              ))}
            </div>

            {tab2===0 && (
              <div className="fade-in card">
                <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"1rem"}}>
                  <button className="btn btn-outline" onClick={approveAll}>Approve All</button>
                </div>
                <table className="dt">
                  <thead><tr><th>File Name</th><th>Detected Type</th><th>Confidence</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {DOCS.filter(d=>ups[d.id]?.status==="done").map((doc,i)=>{
                      const conf=[94,98,91,96,88][i]||92;
                      const s=clsf[doc.id];
                      return (
                        <tr key={doc.id}>
                          <td style={{color:"var(--txt2)"}}>{doc.icon} {doc.label.toLowerCase().replace(/\s+/g,"_")}_FY25.pdf</td>
                          <td><span className="chip chip-blue">{doc.type}</span></td>
                          <td><div className="mini-prog"><div className="mini-bar"><div className="mini-fill" style={{width:`${conf}%`}} /></div><span style={{fontSize:".68rem",color:"var(--gold)"}}>{conf}%</span></div></td>
                          <td><span className={`chip ${s==="Approved"?"chip-green":s==="Denied"?"chip-red":"chip-amber"}`}>{s}</span></td>
                          <td><div className="act-row">
                            <button className="btn btn-sm-g" onClick={()=>setClsf(p=>({...p,[doc.id]:"Approved"}))}>Approve</button>
                            <button className="btn btn-sm-r" onClick={()=>setClsf(p=>({...p,[doc.id]:"Denied"}))}>Deny</button>
                            <button className="btn btn-sm-e">Edit</button>
                          </div></td>
                        </tr>
                      );
                    })}
                    {uploadCount===0 && <tr><td colSpan={5} style={{textAlign:"center",color:"var(--txt3)",padding:"2.5rem"}}>No documents uploaded yet</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {tab2===1 && (
              <div className="fade-in card" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:".9rem 1.1rem",borderBottom:"1px solid var(--bdr)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:".7rem",color:"var(--txt2)"}}>{SCHEMA_FIELDS.length} active extraction fields</span>
                  <button className="btn btn-outline" style={{fontSize:".63rem",padding:".28rem .85rem"}}>+ Add Field</button>
                </div>
                {SCHEMA_FIELDS.map(f=>(
                  <div key={f.key} className="sch-row">
                    <span className="sch-key">{f.key}</span>
                    <span className="sch-type">[{f.type}]</span>
                    <span className="sch-lbl">{f.label}</span>
                    <span className="chip chip-green" style={{marginLeft:"auto"}}>Active</span>
                  </div>
                ))}
              </div>
            )}

            {tab2===2 && (
              <div className="fade-in">
                {uploadCount===0 && <div style={{textAlign:"center",color:"var(--txt3)",padding:"3rem",fontStyle:"italic"}}>Upload documents to view extracted data</div>}
                {DOCS.filter(d=>ups[d.id]?.status==="done").map(doc=>{
                  const m=MOCK_EXT[doc.id];
                  return (
                    <div key={doc.id} className="doc-card">
                      <div className="doc-hd">
                        <span style={{fontSize:"1.2rem"}}>{m.icon}</span>
                        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"var(--txt1)",flex:1}}>{m.label}</span>
                        <span className="chip chip-cyan">{m.fieldCount} fields</span>
                        <span className="chip chip-green">High Precision</span>
                      </div>
                      <div className="ext-grid">
                        {m.data.map(([k,v])=>(
                          <div key={k} className="ext-kv"><div className="ext-k">{k}</div><div className="ext-v">{v}</div></div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={runAI}>Run AI Analysis →</button>
            </div>
          </div>
        )}

        {/* ══ Loading overlay ══ */}
        {loading && (
          <div className="loader-overlay">
            <div style={{textAlign:"center"}}>
              <div className="ic-logo" style={{fontSize:"1.1rem",marginBottom:".4rem"}}>Intelli<span style={{fontStyle:"italic",fontWeight:300}}>Credit</span></div>
              <div className="loader-title">Running AI Credit Analysis</div>
              <div className="loader-stage">{loadStage}</div>
            </div>
            <div className="loader-prog-wrap">
              <div className="loader-pct-row"><span>Analysis progress</span><span style={{color:"var(--gold)"}}>{loadPct}%</span></div>
              <div className="gold-prog"><div className="gold-fill" style={{width:`${loadPct}%`}} /></div>
            </div>
            <div className="check-grid">
              {[{id:"swot",label:"SWOT Generation"},{id:"research",label:"Secondary Research"},{id:"risk",label:"Risk Scoring"},{id:"cam",label:"CAM Synthesis"}].map(c=>(
                <div key={c.id} className={`check-item ${clDone.includes(c.id)?"done":c.id===clActive?"active":""}`}>
                  <span>{clDone.includes(c.id)?"✓":c.id===clActive?"⟳":"○"}</span>{c.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════ STEP 3 ══════════════════════ */}
        {step === 3 && (
          <div className="fade-in">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".9rem"}}>
              <div>
                <div className="sec-title">AI Analysis & CAM Report</div>
                <div className="sec-sub">Credit Appraisal Memorandum — {company}</div>
              </div>
            </div>

            {/* metric cards */}
            <div className="metrics">
              <div className="met-card">
                <div className="met-lbl">Composite Score</div>
                <div className={`met-val ${sc}`}>{reco?.compositeScore||"—"}<span style={{fontSize:"1rem"}}>/100</span></div>
                <div className="met-sub">Internal Rating: BB+</div>
              </div>
              <div className="met-card">
                <div className="met-lbl">Recommended Limit</div>
                <div className="met-val gold">{reco?.suggestedAmount||"₹150 Cr"}</div>
                <div className="met-sub">vs. ₹{loanAmt} Cr requested</div>
              </div>
              <div className="met-card">
                <div className="met-lbl">Interest Rate</div>
                <div className="met-val amber">{reco?.suggestedRate||"10.25% p.a."}</div>
                <div className="met-sub">Benchmark + 285bps spread</div>
              </div>
              <div className="met-card">
                <div className="met-lbl">Decision</div>
                <div className={`met-val ${dc}`} style={{fontSize:"1rem",paddingTop:".15rem",lineHeight:"1.2"}}>{reco?.decision||"Conditional"}</div>
                <div className="met-sub">Subject to conditions</div>
              </div>
            </div>

            {/* analysis sub-tabs */}
            <div className="sub-tabs">
              {["Risk Analysis","SWOT","Secondary Research","Recommendation","CAM Report"].map((t,i)=>(
                <button key={t} className={`s-tab ${tab3===i?"on":""}`} onClick={()=>setTab3(i)}>{t}</button>
              ))}
            </div>

            {/* ── Risk Analysis ── */}
            {tab3===0 && (
              <div className="fade-in analysis-cols">
                <div className="card">
                  <div style={{fontSize:".62rem",textTransform:"uppercase",letterSpacing:".1em",color:"var(--txt3)",marginBottom:"1.15rem"}}>Risk Score Matrix</div>
                  {Object.entries(RISK_SCORES).map(([k,v])=>{
                    const rc=riskClass(v);
                    return (
                      <div key={k} className="risk-row">
                        <span className="risk-lbl">{k}</span>
                        <div className="risk-track"><div className={`risk-fill ${rc}`} style={{width:`${v}%`}} /></div>
                        <span className={`risk-num ${rc}`}>{v}</span>
                      </div>
                    );
                  })}
                  <div className="alert-box">
                    <div className="alert-hd">⚠ Watchlist — Elevated Promoter Risk</div>
                    <div className="alert-txt">ED inquiry into promoter group overseas entities is currently sub-judice. SFIO examining ₹280 Cr in related-party transactions. Credit committee must note enhanced monitoring requirement. Promoter risk elevated to 62, above amber threshold of 55.</div>
                  </div>
                </div>
                <div className="card">
                  <div style={{fontSize:".62rem",textTransform:"uppercase",letterSpacing:".1em",color:"var(--txt3)",marginBottom:".85rem"}}>Financial Signal Review</div>
                  {SIGNALS.map(s=>(
                    <div key={s.label} className="sig-row">
                      <span className="sig-lbl">{s.label}</span>
                      <span className="sig-val" style={{color:s.color}}>{s.value}</span>
                      <span className="sig-note">{s.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SWOT ── */}
            {tab3===1 && swot && (
              <div className="fade-in swot-grid">
                <div className="swot-q">
                  <div className="swot-title" style={{color:"var(--green)"}}>▲ Strengths</div>
                  {swot.strengths?.map((s:string,i:number)=><div key={i} className="swot-item" style={{borderLeftColor:"var(--green)"}}>{s}</div>)}
                </div>
                <div className="swot-q">
                  <div className="swot-title" style={{color:"var(--red)"}}>▼ Weaknesses</div>
                  {swot.weaknesses?.map((s:string,i:number)=><div key={i} className="swot-item" style={{borderLeftColor:"var(--red)"}}>{s}</div>)}
                </div>
                <div className="swot-q">
                  <div className="swot-title" style={{color:"var(--cyan)"}}>◇ Opportunities</div>
                  {swot.opportunities?.map((s:string,i:number)=><div key={i} className="swot-item" style={{borderLeftColor:"var(--cyan)"}}>{s}</div>)}
                </div>
                <div className="swot-q">
                  <div className="swot-title" style={{color:"var(--amber)"}}>⚑ Threats</div>
                  {swot.threats?.map((s:string,i:number)=><div key={i} className="swot-item" style={{borderLeftColor:"var(--amber)"}}>{s}</div>)}
                </div>
              </div>
            )}

            {/* ── Secondary Research ── */}
            {tab3===2 && (
              <div className="fade-in card">
                <div style={{fontSize:".62rem",textTransform:"uppercase",letterSpacing:".1em",color:"var(--txt3)",marginBottom:".9rem"}}>News & Intelligence Signals</div>
                {NEWS.map((n,i)=>(
                  <div key={i} className="news-item">
                    <div className="news-dot" style={{background:n.dot}} />
                    <div className="news-txt">{n.txt}</div>
                    <div className="news-sent" style={{color:n.sentColor}}>{n.sent}</div>
                  </div>
                ))}
                <div className="tri-box">
                  <div className="tri-title">◈ Secondary Research Triangulation — Rate Impact</div>
                  <div className="tri-txt">Secondary research signals have been weighted against primary financial data. The ED inquiry (HIGH severity) and NPA uptick (MEDIUM) together contributed a +25bps risk premium adjustment, moving the base rate from 10.00% to 10.25% p.a. The co-lending arrangement (POSITIVE) partially offset the adjustment by improving assessment of institutional relationships and regulatory standing. Net secondary research impact: <strong>+25bps</strong> on recommended pricing.</div>
                </div>
              </div>
            )}

            {/* ── Recommendation ── */}
            {tab3===3 && reco && (
              <div className="fade-in">
                <div className={`dec-box ${dc}`}>
                  <div className="dec-hd">
                    <div>
                      <div style={{fontSize:".59rem",textTransform:"uppercase",letterSpacing:".1em",color:"var(--txt3)",marginBottom:".3rem"}}>Credit Committee Decision</div>
                      <div className="dec-title" style={{color:dc==="amber"?"var(--amber)":dc==="green"?"var(--green)":"var(--red)"}}>{reco.decision}</div>
                    </div>
                    <span className={`chip chip-${dc}`}>{dc.toUpperCase()}</span>
                  </div>
                  <div className="dec-stats">
                    <div className="dec-stat"><div className="dec-stat-lbl">Composite Score</div><div className="dec-stat-val">{reco.compositeScore}/100</div></div>
                    <div className="dec-stat"><div className="dec-stat-lbl">Sanctioned Limit</div><div className="dec-stat-val">{reco.suggestedAmount}</div></div>
                    <div className="dec-stat"><div className="dec-stat-lbl">Pricing</div><div className="dec-stat-val">{reco.suggestedRate}</div></div>
                  </div>
                </div>
                <div className="reason-box">
                  <div className="reason-title">Reasoning Engine Output</div>
                  <div className="reason-txt">{reco.reasoning}</div>
                </div>
                <div className="card">
                  <div style={{fontSize:".62rem",textTransform:"uppercase",letterSpacing:".1em",color:"var(--txt3)",marginBottom:".85rem"}}>Sanction Conditions</div>
                  <ol className="conds-list">{reco.conditions?.map((c:string,i:number)=><li key={i}>{c}</li>)}</ol>
                </div>
              </div>
            )}

            {/* ── CAM Report ── */}
            {tab3===4 && (
              <div className="fade-in card-gold">
                <div className="cam-hd">
                  <div><div className="cam-entity">{company}</div><div className="cam-meta">Credit Appraisal Memorandum · {new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:".7rem"}}>
                    <span className="chip chip-red">CONFIDENTIAL</span>
                    <button className="btn btn-outline" onClick={downloadCam}>↓ Download CAM</button>
                  </div>
                </div>
                <div className="fivec">
                  {FIVE_CS.map(c=>(
                    <div key={c.label} className="fivec-item"><div className="fivec-icon">{c.icon}</div><div className="fivec-lbl">{c.label}</div></div>
                  ))}
                </div>
                <div className="cam-txt">{cam||"Generating CAM report…"}</div>
                <div className="cam-disc">This Credit Appraisal Memorandum is generated by IntelliCredit AI for evaluation purposes only. It does not constitute a formal sanction or binding commitment. All decisions are subject to credit committee approval, regulatory compliance, and due diligence verification. For internal use only.</div>
              </div>
            )}

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Back to Classification</button>
              <button className="btn btn-primary" onClick={reset}>+ New Assessment</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
