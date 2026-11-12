/* ==========================================================
   Felles gull og avatar for øveprøvene
   ----------------------------------------------------------
   Alle spillene laster denne fila. Gull, avatar og klær lagres
   i localStorage på enheten (samme nøkkel for alle spillene,
   siden de ligger på samme nettadresse).

   I et spill:   window.Gull && Gull.tjen(1)          – 1 gull for et riktig svar
                 window.Gull && Gull.bonus(5, "Runde ferdig!")
   Skjul gullmerket i hjørnet:  <script src="felles/gull.js" data-merke="av">
   ========================================================== */
(function () {
  "use strict";
  const KEY = "prover-avatar-v1";
  const DAGSTAK = 150;      // maks gull per spill per dag
  const STARTGAVE = 25;     // gull når avataren lages
  const script = document.currentScript;
  const ROT = script && script.src ? script.src.replace(/felles\/gull\.js.*$/, "") : "./";
  const MERKE = !(script && script.dataset.merke === "av");
  const FIL = (location.pathname.split("/").pop() || "").replace(/\.html?$/, "") || "forside";

  /* ---------------- tilstand ---------------- */
  function tom() {
    return { v: 1, laget: null, navn: "", kjonn: "gutt", trinn: null,
      ut: { hud: 1, har: "kort", harfarge: 1, oyne: 0 },
      gull: 0, totalt: 0, eid: [], paa: {}, spill: {}, dag: { d: "", n: {}, comeback: 0, runder: 0 }, importert: {},
      feil: {}, sitter: 0, merker: {}, oppdrag: null, oppdragDager: 0, prover: [], visAlle: false };
  }
  function les() {
    try { const x = JSON.parse(localStorage.getItem(KEY)); if (x && x.v === 1) return Object.assign(tom(), x); } catch (e) {}
    return tom();
  }
  let S = les();
  function lagre() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} varsle(); }
  const lyttere = [];
  function varsle() { oppdaterMerke(); lyttere.forEach(f => { try { f(S); } catch (e) {} }); }

  function idag() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dagen() {
    if (!S.dag || S.dag.d !== idag()) S.dag = { d: idag(), n: {}, comeback: 0, runder: 0 };
    S.dag.comeback = S.dag.comeback || 0; S.dag.runder = S.dag.runder || 0;
    return S.dag;
  }
  function dagN() { return dagen().n; }
  function leggTil(spill, n) { S.spill[spill] = (S.spill[spill] || 0) + n; }
  /* legger gull på S uten å lese på nytt – kalleren har lest og lagrer selv */
  function leggGull(n, spill) { const d = dagN(); S.gull += n; S.totalt += n; d[spill] = (d[spill] || 0) + n; leggTil(spill, n); }
  const tilfeldig = a => a[Math.floor(Math.random() * a.length)];

  /* Eventyrprøven hadde sitt eget trollgull før dette. Det flyttes inn én gang. */
  (function importer() {
    if (S.importert.eventyr) return;
    let n = 0;
    try { const e = JSON.parse(localStorage.getItem("eventyrproven-v1")); n = Math.max(0, Math.floor((e && +e.gull) || 0)); } catch (e) {}
    S.importert.eventyr = 1;
    if (n > 0) { S.gull += n; S.totalt += n; leggTil("eventyrproven", n); }
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  })();

  /* ---------------- spilliste, trinn og prøver ---------------- */
  const spillListe = () => window.SPILL || [];
  const filKey = fil => String(fil || "").replace(/\.html?$/, "");
  function passer(sp, s) { s = s || S; return s.visAlle || !s.trinn || !sp.trinn || sp.trinn.includes(+s.trinn); }
  function dagerTil(dato) { return Math.round((new Date(dato + "T00:00:00") - new Date(idag() + "T00:00:00")) / 864e5); }
  function prover(s) {
    s = s || S; const ut = [];
    spillListe().forEach(sp => (sp.prover || []).forEach(p => ut.push({ spill: filKey(sp.fil), fil: sp.fil, tittel: sp.tittel, ikon: sp.ikon,
      fag: sp.fag, trinn: sp.trinn, dato: p.dato, navn: p.navn || sp.tittel })));
    (s.prover || []).forEach((p, i) => {
      const sp = spillListe().find(x => filKey(x.fil) === p.spill) || {};
      ut.push({ spill: p.spill, fil: sp.fil || p.spill + ".html", tittel: sp.tittel || p.spill, ikon: sp.ikon || "📝", fag: sp.fag,
        trinn: sp.trinn, dato: p.dato, navn: p.navn || sp.tittel || "Prøve", egen: i });
    });
    return ut.map(p => Object.assign(p, { dager: dagerTil(p.dato) }))
      .filter(p => p.dager >= 0 && passer(p, Object.assign({}, s, { visAlle: false })))
      .sort((a, b) => a.dager - b.dager);
  }
  function provebonus(spill) { return prover().find(p => p.spill === spill && p.dager <= 3) || null; }
  /* Oppdragene lages på nytt når trinn/prøver endres – men bare hvis ingen er fullført i dag (ellers kunne man tjent oppdragsgull flere ganger). */
  function nyeOppdrag() { if (!(S.oppdrag && S.oppdrag.d === idag() && S.oppdrag.liste.some(o => o.ferdig))) S.oppdrag = null; }
  function leggTilProve(p) { S = les(); S.prover.push({ spill: filKey(p.spill), dato: p.dato, navn: String(p.navn || "").slice(0, 60) }); nyeOppdrag(); lagre(); sikreOppdrag(); varsle(); }
  function fjernProve(i) { S = les(); S.prover.splice(i, 1); nyeOppdrag(); lagre(); sikreOppdrag(); varsle(); }
  function lastSpillListe() {
    if (window.SPILL) { sikreOppdrag(); return; }
    try {
      const sc = document.createElement("script"); sc.src = ROT + "felles/spill.js";
      sc.onload = () => { sikreOppdrag(); varsle(); };
      (document.head || document.documentElement).appendChild(sc);
    } catch (e) {}
  }

  /* ---------------- tjene gull ---------------- */
  let takVarslet = false, proveVarslet = false, riktigeNa = 0;
  const JUBEL = {
    runde: ["Runde ferdig! Så bra jobba!", "Yes! Den runden satt!", "Du blir bedre for hver runde!", "Heia deg!", "Sterkt jobba!", "Sånn skal det gjøres!"],
    tung: ["Godt kjempet! Neste runde går bedre.", "Bra at du øver – det er sånn man lærer!", "Øving gjør mester. Prøv en runde til?"],
    ti: ["Ti riktige! Du er i flytsonen!", "Wow, du er på rulle!", "Stå på – dette går strålende!", "Hjernen din vokser nå!", "Du er skikkelig god på dette!"],
  };
  function medNavn(t) { return S.navn && Math.random() < .4 ? S.navn + "! " + t : t; }
  function tjen(n, o) {
    o = o || {};
    n = Math.floor(+n || 0);
    if (n <= 0) return 0;
    S = les();
    const spill = o.spill || FIL, d = dagN(), igjen = Math.max(0, DAGSTAK - (d[spill] || 0));
    if (!igjen) {
      if (!takVarslet) { takVarslet = true; melding("Du har tjent dagens gull i dette spillet. Prøv et annet spill, eller kom tilbake i morgen!"); }
      return 0;
    }
    const pb = !o.intern && provebonus(spill);
    if (pb) {
      n *= 2;
      if (!proveVarslet) { proveVarslet = true; melding(`Prøve ${pb.dager === 0 ? "i dag" : pb.dager === 1 ? "i morgen" : "om " + pb.dager + " dager"} – dobbelt gull i dette spillet!`, true); }
    }
    n = Math.min(n, igjen);
    leggGull(n, spill);
    lagre();
    if (!o.stille) pop(n);
    if (!o.intern) {
      riktigeNa++;
      if (riktigeNa % 10 === 0) jubel(medNavn(tilfeldig(JUBEL.ti)));
      etterHendelse();
    }
    return n;
  }
  function bonus(n, tekst) {
    S = les(); dagen().runder++; lagre();
    const f = tjen(n, { stille: true, intern: true });
    if (f) { melding((tekst ? tekst + " " : "") + "+" + f + " gull", true); dunk(); }
    jubel(medNavn(tilfeldig(f >= 2 ? JUBEL.runde : JUBEL.tung)));
    etterHendelse();
    return f;
  }

  /* ---------------- Feilsamleren og comeback-gull ----------------
     boks 0: nylig feil – klar igjen etter 30 min. Riktig da → boks 1 (+3 gull), klar igjen i morgen.
     boks 1: riktig når den er klar → «sitter» og fjernes (+3 gull). Feil når som helst → tilbake til boks 0. */
  const VENT = 30 * 60e3, MAKS_FEIL = 200, COMEBACK = 3;
  function nesteMidnatt() { const d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime(); }
  function iKveld() { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); }
  function rens(t, max) { return String(t == null ? "" : t).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, max || 240); }
  function feil(nokkel, opg, o) {
    o = o || {};
    if (!opg || opg.q == null || opg.a == null || nokkel == null) return;
    S = les();
    const spill = o.spill || FIL, k = spill + ":" + nokkel, na = Date.now();
    const e = S.feil[k] || { spill, forst: na, n: 0 };
    Object.assign(e, { q: rens(opg.q), a: rens(opg.a, 120),
      alt: Array.isArray(opg.alt) ? opg.alt.map(x => rens(x, 120)).filter(x => x && x !== rens(opg.a, 120)).slice(0, 5) : null,
      godta: Array.isArray(opg.godta) ? opg.godta.map(x => rens(x, 120)).filter(Boolean) : null,
      forkl: rens(opg.forkl, 300), emne: rens(opg.emne, 60), boks: 0, sist: na, neste: na + VENT });
    if (e.alt && !e.alt.length) e.alt = null;
    e.n++;
    S.feil[k] = e;
    const alle = Object.keys(S.feil);
    if (alle.length > MAKS_FEIL) alle.sort((a, b) => S.feil[a].sist - S.feil[b].sist).slice(0, alle.length - MAKS_FEIL).forEach(x => delete S.feil[x]);
    lagre();
  }
  function riktig(nokkel, o) { o = o || {}; return nokkel == null ? 0 : repeter((o.spill || FIL) + ":" + nokkel, true); }
  function repeter(k, ok) {
    S = les(); const e = S.feil[k]; if (!e) return 0;
    const na = Date.now();
    if (!ok) { e.boks = 0; e.n++; e.sist = na; e.neste = na + VENT; lagre(); return 0; }
    if (na < e.neste) return 0;
    let tekst;
    if (!e.boks) { e.boks = 1; e.sist = na; e.neste = nesteMidnatt(); tekst = "Comeback! Den husket du nå. Klarer du den i morgen også, sitter den."; }
    else { delete S.feil[k]; S.sitter = (S.sitter || 0) + 1; tekst = "Den sitter! Du har lært noe du ikke kunne før. 💪"; }
    dagen().comeback++;
    leggGull(COMEBACK, "comeback");
    lagre();
    pop(COMEBACK); jubel(tekst);
    etterHendelse();
    return COMEBACK;
  }
  function feilListe(s) {
    s = s || S; const na = Date.now();
    return Object.entries(s.feil || {}).map(([k, e]) => Object.assign({ k, klar: e.neste <= na, idag: e.neste <= iKveld() }, e))
      .sort((a, b) => a.neste - b.neste);
  }

  /* ---------------- mestringsmerker ---------------- */
  function merke(id) {
    const m = MERKE_ID[id]; if (!m) return false;
    S = les(); if (S.merker[id]) return false;
    S.merker[id] = idag(); lagre();
    const it = ITEM[m.ting];
    melding(`Nytt merke: ${m.ikon} ${m.navn}!`, true);
    jubel(`Nytt merke: ${m.ikon} ${m.navn}! Du låste opp ${it ? it.navn.toLowerCase() : "en ny ting"} – se på avatarsiden.`, { lang: true });
    return true;
  }
  const GLOBALE = {
    allsidig: s => Object.keys(s.spill).filter(k => !["startgave", "oppdrag", "comeback"].includes(k)).length >= 5,
    comeback: s => (s.sitter || 0) >= 10,
    oppdrag: s => (s.oppdragDager || 0) >= 5,
    gullgraver: s => s.totalt >= 1000,
  };
  function sjekkMerker() { S = les(); Object.keys(GLOBALE).forEach(id => { if (!S.merker[id] && GLOBALE[id](S)) merke(id); }); }

  /* ---------------- dagens oppdrag ---------------- */
  function frø(t) { let x = 7; for (let i = 0; i < t.length; i++) x = (x * 31 + t.charCodeAt(i)) % 2147483647; return () => (x = (x * 48271) % 2147483647) / 2147483647; }
  function sikreOppdrag() {
    const liste = spillListe(); if (!liste.length) return;
    S = les();
    if (S.oppdrag && S.oppdrag.d === idag()) return;
    const r = frø(idag() + ":" + (S.trinn || ""));
    const mine = liste.filter(sp => sp.gull !== false && passer(sp, Object.assign({}, S, { visAlle: false })));
    if (!mine.length) return;
    const navn = sp => sp.ikon + " " + sp.tittel;
    const opp = [];
    const pr = prover().find(p => p.dager <= 7 && mine.some(sp => filKey(sp.fil) === p.spill));
    let forste = pr && mine.find(sp => filKey(sp.fil) === pr.spill);
    if (forste) {
      const naar = pr.dager === 0 ? "i dag" : pr.dager === 1 ? "i morgen" : "om " + pr.dager + " dager";
      opp.push({ id: "prove", type: "gull", spill: [filKey(forste.fil)], n: 20, fil: forste.fil, tekst: `Prøve ${naar}! Tjen 20 gull i ${navn(forste)}` });
    } else {
      const sortert = mine.slice().sort((a, b) => (S.spill[filKey(a.fil)] || 0) - (S.spill[filKey(b.fil)] || 0));
      forste = sortert[Math.floor(r() * Math.min(3, sortert.length))];
      opp.push({ id: "spill", type: "gull", spill: [filKey(forste.fil)], n: 20, fil: forste.fil, tekst: `Tjen 20 gull i ${navn(forste)}` });
    }
    const klare = feilListe(S).filter(e => e.idag).length;
    if (klare >= 2) opp.push({ id: "feil", type: "comeback", n: Math.min(3, klare), fil: "feilsamler.html", tekst: `Få ${Math.min(3, klare)} feil til å sitte i Feilsamleren` });
    else opp.push({ id: "runder", type: "runder", n: 2, tekst: "Fullfør 2 runder i hvilket som helst spill" });
    const fag = [...new Set(mine.map(sp => sp.fag))].filter(f => f !== forste.fag);
    if (fag.length) {
      const f = fag[Math.floor(r() * fag.length)], fs = mine.filter(sp => sp.fag === f);
      opp.push({ id: "fag", type: "gull", spill: fs.map(sp => filKey(sp.fil)), n: 15, fil: fs.length === 1 ? fs[0].fil : null, fag: f, tekst: `Tjen 15 gull i ${f}` });
    } else opp.push({ id: "runder3", type: "runder", n: 3, tekst: "Fullfør 3 runder" });
    S.oppdrag = { d: idag(), liste: opp.map(o => Object.assign(o, { ferdig: false })), alle: false };
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }
  function framdrift(o, s) {
    s = s || S;
    const d = s.dag && s.dag.d === idag() ? s.dag : { n: {}, comeback: 0, runder: 0 };
    if (o.type === "gull") return o.spill.reduce((a, k) => a + (d.n[k] || 0), 0);
    if (o.type === "comeback") return d.comeback || 0;
    if (o.type === "runder") return d.runder || 0;
    return 0;
  }
  function sjekkOppdrag() {
    S = les(); const op = S.oppdrag; if (!op || op.d !== idag()) return;
    const nye = op.liste.filter(o => !o.ferdig && framdrift(o, S) >= o.n);
    if (!nye.length) return;
    nye.forEach(o => { o.ferdig = true; leggGull(5, "oppdrag"); });
    let alle = false;
    if (!op.alle && op.liste.every(o => o.ferdig)) { op.alle = alle = true; leggGull(10, "oppdrag"); S.oppdragDager = (S.oppdragDager || 0) + 1; }
    lagre();
    if (alle) { melding("Alle dagens oppdrag er klare! +" + (5 * nye.length + 10) + " gull", true); jubel("Alle dagens oppdrag er klare! Du er en ekte oppdragsjeger! 🎯", { lang: true }); }
    else { melding("Oppdrag klart: " + nye[0].tekst + " +" + 5 * nye.length + " gull", true); jubel("Oppdrag klart! 🎯 Sjekk forsiden for resten."); }
    dunk();
  }
  let iHendelse = false;
  function etterHendelse() {
    if (iHendelse) return; iHendelse = true;
    try { sjekkOppdrag(); sjekkMerker(); } finally { iHendelse = false; }
  }

  /* ---------------- butikk ---------------- */
  const PAKREVD = ["overdel", "underdel", "sko"];
  function eier(id, s) {
    const it = ITEM[id]; s = s || S; if (!it) return false;
    if (it.merke) return !!(s.merker || {})[it.merke];
    return it.pris === 0 || s.eid.includes(id);
  }
  function kjop(id) {
    S = les(); const it = ITEM[id];
    if (!it || it.merke || eier(id)) return false;
    if (S.gull < it.pris) return false;
    S.gull -= it.pris; S.eid.push(id); S.paa[it.slot] = id; lagre();
    return true;
  }
  function taPaa(id) { S = les(); const it = ITEM[id]; if (!it || !eier(id)) return false; S.paa[it.slot] = id; lagre(); return true; }
  function taAv(slot) { S = les(); if (PAKREVD.includes(slot)) return false; delete S.paa[slot]; lagre(); return true; }
  function standardPaa(kjonn) {
    return { overdel: kjonn === "jente" ? "ts-rosa" : "ts-bla", underdel: "bukse-jeans", sko: "sko-hvit" };
  }
  function lagBruker(d) {
    S = les();
    const ny = !S.laget;
    S.navn = String(d.navn || "").trim().slice(0, 20);
    S.kjonn = d.kjonn === "jente" ? "jente" : "gutt";
    if (d.trinn !== undefined) S.trinn = d.trinn ? +d.trinn : null;
    if (d.ut) S.ut = Object.assign({}, S.ut, d.ut);
    if (ny) {
      S.laget = idag();
      S.paa = Object.assign(standardPaa(S.kjonn), S.paa);
      S.gull += STARTGAVE; S.totalt += STARTGAVE; leggTil("startgave", STARTGAVE);
    }
    nyeOppdrag();
    lagre();
    sikreOppdrag();
    return ny;
  }
  function endre(f) { S = les(); f(S); lagre(); }
  function settTrinn(t) { S = les(); S.trinn = t ? +t : null; nyeOppdrag(); lagre(); sikreOppdrag(); varsle(); }

  /* ---------------- flytte til ny enhet ---------------- */
  function sum(t) { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return h.toString(36).slice(-5); }
  function eksport() {
    const s = les();
    const j = JSON.stringify({ n: s.navn, k: s.kjonn, u: s.ut, g: s.gull, t: s.totalt, e: s.eid, p: s.paa, s: s.spill, l: s.laget,
      tr: s.trinn, m: s.merker, f: s.feil, si: s.sitter, od: s.oppdragDager, pr: s.prover });
    const b = btoa(unescape(encodeURIComponent(j)));
    return b + "-" + sum(b);
  }
  function importKode(kode) {
    kode = String(kode || "").replace(/\s+/g, "");
    const i = kode.lastIndexOf("-");
    if (i < 1) return false;
    const b = kode.slice(0, i);
    if (sum(b) !== kode.slice(i + 1)) return false;
    let j; try { j = JSON.parse(decodeURIComponent(escape(atob(b)))); } catch (e) { return false; }
    const n = tom();
    Object.assign(n, { navn: j.n || "", kjonn: j.k === "jente" ? "jente" : "gutt", ut: Object.assign(n.ut, j.u || {}),
      gull: Math.max(0, +j.g || 0), totalt: Math.max(0, +j.t || 0), eid: Array.isArray(j.e) ? j.e.filter(x => ITEM[x]) : [],
      paa: j.p || {}, spill: j.s || {}, laget: j.l || idag(), importert: { eventyr: 1 },
      trinn: j.tr || null, merker: j.m || {}, feil: j.f || {}, sitter: +j.si || 0, oppdragDager: +j.od || 0, prover: Array.isArray(j.pr) ? j.pr : [] });
    S = n; lagre();
    return true;
  }
  function slett() { try { localStorage.removeItem(KEY); } catch (e) {} S = tom(); S.importert.eventyr = 1; lagre(); }

  /* ==========================================================
     AVATAR – tegnes som SVG (viewBox 0 0 240 260)
     ========================================================== */
  const HUD = ["#fbe2cc", "#f3c9a4", "#e2ab80", "#c68b5e", "#9b6442", "#6a432a"];
  const HARFARGE = [["Svart", "#2a211d"], ["Mørkebrun", "#4b2e1c"], ["Brun", "#7b4a28"], ["Lysbrun", "#a8743f"],
                    ["Blond", "#e3bd6c"], ["Rødt", "#b9562c"], ["Grått", "#bdb8b2"]];
  const OYNE = [["Brune", "#6b4423"], ["Blå", "#3b78c9"], ["Grønne", "#3d8a52"], ["Grå", "#7b8794"]];

  function mix(hex, f) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
    const n = parseInt(hex.slice(1), 16), t = f < 0 ? 0 : 255, a = Math.abs(f);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (t - v) * a));
    return "#" + ((1 << 24) | (c[0] << 16) | (c[1] << 8) | c[2]).toString(16).slice(1);
  }
  function stjerneD(cx, cy, r, ri) {
    ri = ri || r * 0.45; let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? ri : r;
      d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
  }
  function hjerteD(cx, cy, s) {
    return `M${cx} ${cy + s * .9}C${cx - s * 1.5} ${cy} ${cx - s * .7} ${cy - s} ${cx} ${cy - s * .3}C${cx + s * .7} ${cy - s} ${cx + s * 1.5} ${cy} ${cx} ${cy + s * .9}Z`;
  }
  const speil = s => `<g transform="matrix(-1 0 0 1 240 0)">${s}</g>`;
  const par = s => s + speil(s);

  /* faste punkter på kroppen */
  const TORSO = "M95 124Q120 115 145 124L150 182Q120 189 90 182Z";
  const A1 = [97, 130], A2 = [143, 130], HENDER = [[80, 178], [160, 178]], JUBELHENDER = [[74, 88], [166, 88]];
  let B1 = HENDER[0], B2 = HENDER[1];   /* settes om i tegn() når avataren jubler */
  function langs(A, B, t) { return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]; }
  function erme(f, t, w) {
    w = w || 17;
    const [x1, y1] = langs(A1, B1, t), [x2, y2] = langs(A2, B2, t);
    return `<line x1="97" y1="130" x2="${x1}" y2="${y1}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>` +
           `<line x1="143" y1="130" x2="${x2}" y2="${y2}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  const torso = (f, ekstra) => `<path d="${TORSO}" fill="${f}"${ekstra || ""}/>`;
  const krage = f => `<path d="M110 121Q120 131 130 121" fill="none" stroke="${mix(f, -.25)}" stroke-width="3" stroke-linecap="round"/>`;
  const klipp = (c, s) => `<g clip-path="url(#${c.id}t)">${s}</g>`;

  function motiv(m, f, c) {
    const lys = mix(f, .85), mork = mix(f, -.45);
    switch (m) {
      case "stjerne": return `<path d="${stjerneD(120, 152, 13)}" fill="#ffd23f"/>`;
      case "lyn": return `<path d="M125 136L109 157H120L113 173L132 149H121L128 136Z" fill="#ffd23f"/>`;
      case "hjerte": return `<path d="${hjerteD(120, 152, 11)}" fill="#ff4f7b"/>`;
      case "smil": return `<circle cx="120" cy="152" r="12" fill="#ffd23f"/><circle cx="116" cy="149" r="1.8" fill="#333"/><circle cx="124" cy="149" r="1.8" fill="#333"/><path d="M114 155Q120 161 126 155" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      case "fjell": return `<path d="M104 164L114 146L120 154L126 144L138 164Z" fill="${lys}"/><path d="M114 146L117 151L111 151Z M126 144L130 151L122 151Z" fill="#fff"/>`;
      case "striper": return klipp(c, `<rect x="80" y="136" width="80" height="7" fill="${mork}"/><rect x="80" y="152" width="80" height="7" fill="${mork}"/><rect x="80" y="168" width="80" height="7" fill="${mork}"/>`);
      case "comeback": return `<path d="M129 146A10 10 0 1 0 131 155" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M124 140L132 146L123 150Z" fill="#fff"/>`;
      default: return "";
    }
  }

  /* ---------- overdeler ---------- */
  const OVERDEL = {
    ts: (it, c) => erme(it.f, .36) + torso(it.f) + motiv(it.m, it.f, c) + krage(it.f),
    genser: (it, c) => erme(it.f, .9) + torso(it.f) + (it.f2 ? klipp(c, [136, 152, 168].map(y => `<rect x="80" y="${y}" width="80" height="7" fill="${it.f2}"/>`).join("")) : "") +
      motiv(it.m, it.f, c) + krage(it.f),
    hette: it => erme(it.f, .9) + torso(it.f) +
      `<path d="M97 127C95 108 145 108 143 127C134 119 106 119 97 127Z" fill="${mix(it.f, -.18)}"/>` +
      `<rect x="104" y="160" width="32" height="15" rx="6" fill="${mix(it.f, -.12)}"/>` +
      `<path d="M114 127L113 143M126 127L127 143" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    jakke: it => erme(it.f, .9) + torso(it.f) +
      `<path d="M97 127C95 108 145 108 143 127C134 119 106 119 97 127Z" fill="${mix(it.f, -.15)}"/>` +
      `<path d="M120 126V186" stroke="${mix(it.f, -.35)}" stroke-width="2.5"/>` +
      [140, 156, 172].map(y => `<circle cx="126" cy="${y}" r="2.2" fill="${mix(it.f, -.4)}"/>`).join(""),
    kjole: (it, c) => erme(it.f, .3, 19) + torso(it.f) +
      `<path d="M93 168L78 214Q120 222 162 214L147 168Z" fill="${it.f}"/>` +
      (it.m === "prikker" ? [[96, 196], [112, 206], [130, 192], [146, 206], [104, 180], [138, 178], [120, 214], [88, 210], [154, 212]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff" opacity=".9"/>`).join("") : "") +
      (it.m === "glitter" ? [[98, 196], [116, 204], [134, 194], [148, 208], [108, 186], [126, 212]].map(([x, y]) => `<path d="${stjerneD(x, y, 3.6)}" fill="#fff"/>`).join("") : "") +
      `<path d="M92 170Q120 177 148 170" stroke="${mix(it.f, -.3)}" stroke-width="4" fill="none"/>` + krage(it.f),
    fotball: (it, c) => erme(it.f2, .36) + torso(it.f) +
      klipp(c, [100, 116, 132].map(x => `<rect x="${x}" y="110" width="8" height="80" fill="${it.f2}"/>`).join("")) +
      `<text x="120" y="174" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="24" fill="#fff" stroke="${mix(it.f, -.4)}" stroke-width="1.5">${it.nr}</text>` + krage(it.f),
    helt: it => erme(it.f, .9) + torso(it.f) +
      `<circle cx="120" cy="148" r="14" fill="#ffd23f" stroke="${mix(it.f, -.3)}" stroke-width="2"/>` +
      (it.m === "stjerne" ? `<path d="${stjerneD(120, 148, 10)}" fill="${it.f}"/>` : `<path d="M124 136L112 151H120L115 162L129 146H121L126 136Z" fill="${it.f}"/>`) +
      `<path d="M90 172Q120 180 150 172L150 180Q120 188 90 180Z" fill="#ffd23f"/>`,
    rustning: it => {
      const m = mix(it.f, -.35), l = mix(it.f, .25);
      return erme(it.f, .9) + torso(it.f, ` stroke="${m}" stroke-width="2"`) +
        `<path d="M93 146Q120 154 147 146M92 164Q120 172 148 164M120 122V184" stroke="${m}" stroke-width="2" fill="none"/>` +
        `<ellipse cx="97" cy="130" rx="13" ry="10" fill="${l}" stroke="${m}" stroke-width="2"/><ellipse cx="143" cy="130" rx="13" ry="10" fill="${l}" stroke="${m}" stroke-width="2"/>` +
        [[106, 138], [134, 138], [106, 156], [134, 156], [106, 174], [134, 174]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${m}"/>`).join("") +
        (it.m === "skjold" ? `<path d="M112 132H128V146Q128 154 120 158Q112 154 112 146Z" fill="#c62828" stroke="${m}" stroke-width="1.5"/><path d="${stjerneD(120, 144, 5)}" fill="#ffd23f"/>` : "");
    },
    astronaut: it => {
      const f = "#eef1f5", m = "#aeb7c2";
      return erme(f, .9) + torso(f, ` stroke="${m}" stroke-width="2"`) +
        `<rect x="107" y="138" width="26" height="20" rx="3" fill="#2f4a7a"/>` +
        `<circle cx="114" cy="148" r="3" fill="#ff5252"/><circle cx="122" cy="148" r="3" fill="#69f0ae"/><circle cx="129" cy="145" r="2" fill="#ffd23f"/><rect x="126" y="150" width="5" height="3" fill="#90caf9"/>` +
        `<path d="M90 172Q120 180 150 172" stroke="${m}" stroke-width="5" fill="none"/>` +
        `<line x1="88" y1="150" x2="85" y2="158" stroke="#ff7043" stroke-width="9" stroke-linecap="round"/>`;
    },
    smoking: it => {
      const f = "#23262d";
      return erme(f, .9) + torso(f) +
        `<path d="M108 121L120 164L132 121Z" fill="#fafafa"/>` +
        `<path d="M108 121L116 150L104 136ZM132 121L124 150L136 136Z" fill="#15171c"/>` +
        `<path d="M120 128L110 123V133ZM120 128L130 123V133Z" fill="${it.f || "#d32f2f"}"/><circle cx="120" cy="128" r="2.5" fill="${mix(it.f || "#d32f2f", -.3)}"/>` +
        `<circle cx="120" cy="146" r="1.6" fill="#333"/><circle cx="120" cy="155" r="1.6" fill="#333"/>`;
    },
    konge: it => erme(it.f, .9) +
      `<path d="M95 124Q120 115 145 124L158 224Q120 232 82 224Z" fill="${it.f}"/>` +
      `<path d="M82 218Q120 226 158 218L159 228Q120 236 81 228Z" fill="#fff"/><rect x="113" y="122" width="14" height="104" fill="#fff"/>` +
      [[116, 140], [124, 156], [116, 172], [124, 188], [116, 204], [92, 224], [104, 226], [136, 226], [148, 224]].map(([x, y]) => `<path d="M${x} ${y - 2}L${x + 1.5} ${y + 2}H${x - 1.5}Z" fill="#222"/>`).join("") +
      `<path d="M102 128Q120 152 138 128" stroke="#f2c230" stroke-width="3" fill="none"/><circle cx="120" cy="146" r="6" fill="#f2c230" stroke="#b8860b" stroke-width="1.5"/>`,
  };

  /* ---------- underdeler ---------- */
  const ben = (f, lengde) => `<rect x="98" y="178" width="20" height="${lengde}" rx="5" fill="${f}"/><rect x="122" y="178" width="20" height="${lengde}" rx="5" fill="${f}"/>`;
  const hofte = f => `<rect x="97" y="172" width="46" height="16" rx="5" fill="${f}"/>`;
  const UNDERDEL = {
    bukse: it => hofte(it.f) + ben(it.f, 48) + (it.m === "jeans" ? `<path d="M120 176V190M101 186H110M130 186H139" stroke="${mix(it.f, .3)}" stroke-width="1.5" stroke-dasharray="2 2"/>` : ""),
    shorts: it => hofte(it.f) + ben(it.f, 22),
    jogge: it => hofte(it.f) + ben(it.f, 48) + `<path d="M100 180V222M140 180V222" stroke="#fff" stroke-width="2.5"/>` +
      `<rect x="98" y="218" width="20" height="8" rx="3" fill="${mix(it.f, -.25)}"/><rect x="122" y="218" width="20" height="8" rx="3" fill="${mix(it.f, -.25)}"/>`,
    skjort: it => `<path d="M97 172H143L153 206Q120 213 87 206Z" fill="${it.f}"/><path d="M97 174H143" stroke="${mix(it.f, -.25)}" stroke-width="4"/>` +
      (it.m === "glitter" ? [[100, 196], [114, 188], [128, 200], [142, 190], [120, 180], [136, 206], [104, 206]].map(([x, y]) => `<path d="${stjerneD(x, y, 3.2)}" fill="#fff"/>`).join("") : ""),
  };

  /* ---------- sko ---------- */
  const fot = (cx, f, saale) => `<ellipse cx="${cx}" cy="230" rx="13" ry="7" fill="${f}"/>` +
    (saale ? `<path d="M${cx - 12} 233Q${cx} 240 ${cx + 12} 233" stroke="${saale}" stroke-width="3" fill="none" stroke-linecap="round"/>` : "");
  const SKO = {
    jogge: it => fot(106, it.f, "#fff") + fot(134, it.f, "#fff") + `<path d="M102 226L108 228M130 228L136 226" stroke="#fff" stroke-width="1.6"/>`,
    stovel: it => { const top = it.h || 208; return [98, 122].map(x => `<rect x="${x}" y="${top}" width="20" height="${230 - top}" rx="4" fill="${it.f}"/>`).join("") + fot(106, it.f, mix(it.f, -.35)) + fot(134, it.f, mix(it.f, -.35)); },
    rulle: it => fot(106, it.f, "#fff") + fot(134, it.f, "#fff") +
      [95, 117, 123, 145].map(x => `<circle cx="${x}" cy="242" r="4" fill="#ff4081" stroke="#333" stroke-width="1"/>`).join(""),
    gull: it => fot(106, "#f2c230", "#b8860b") + fot(134, "#f2c230", "#b8860b") + `<path d="${stjerneD(100, 226, 3)}${stjerneD(140, 226, 3)}" fill="#fff"/>`,
  };

  /* ---------- hår ---------- */
  const FRAM_KORT = "M81 82C78 50 96 36 120 36C146 36 162 52 159 82C155 70 152 64 146 60C134 66 112 66 100 58C92 64 86 72 81 82Z";
  const FRAM_MIDT = "M81 86C78 50 98 36 120 36C142 36 162 50 159 86C154 66 140 52 120 50C100 52 86 66 81 86Z";
  function krollFram(r) {
    let s = `<path d="M82 80C80 46 100 36 120 36C140 36 160 46 158 80C152 66 140 60 120 60C100 60 88 66 82 80Z"/>`;
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; s += `<circle cx="${(120 + 38 * Math.cos(a)).toFixed(1)}" cy="${(74 + 38 * Math.sin(a)).toFixed(1)}" r="${r}"/>`; }
    return s;
  }
  const HAR = {
    kort:  { navn: "Kort", fram: `<path d="${FRAM_KORT}"/>` },
    pigg:  { navn: "Piggete", fram: `<path d="M82 80C80 58 86 46 94 42L92 30L104 38L108 24L118 36L126 22L132 36L144 28L144 42C156 48 160 62 158 80C154 68 148 62 140 60C128 64 110 64 98 60C90 64 85 72 82 80Z"/>` },
    snau:  { navn: "Snauklipt", fram: `<path d="M82 76C82 46 100 38 120 38C140 38 158 46 158 76C150 62 136 58 120 58C104 58 90 62 82 76Z" opacity=".9"/>` },
    kroll: { navn: "Krøller", bak: `<circle cx="80" cy="92" r="11"/><circle cx="160" cy="92" r="11"/><circle cx="79" cy="106" r="9"/><circle cx="161" cy="106" r="9"/>`, fram: krollFram(11) },
    afro:  { navn: "Afro", bak: `<circle cx="120" cy="72" r="56"/>`, fram: krollFram(10) },
    bob:   { navn: "Pagé", bak: `<path d="M78 80C78 40 162 40 162 80L164 116C152 122 142 118 139 110H101C98 118 88 122 76 116Z"/>`, fram: `<path d="M80 84C78 50 98 36 120 36C142 36 162 50 160 84C158 72 156 66 154 62H86C84 66 82 72 80 84Z"/>` },
    lang:  { navn: "Langt", bak: `<path d="M79 76C78 38 162 38 161 76L166 150C152 160 88 160 74 150Z"/>`, fram: `<path d="M81 86C78 50 98 36 120 36C146 36 163 52 159 86C156 70 150 60 140 56C126 62 104 60 94 54C88 62 84 72 81 86Z"/>` },
    heste: { navn: "Hestehale", bak: `<path d="M148 50C178 56 182 96 172 136C169 146 160 144 162 134C168 104 164 78 146 64Z"/>`, fram: `<path d="${FRAM_KORT}"/><circle cx="152" cy="54" r="4.5" fill="#ff5fa2"/>` },
    flette:{ navn: "Fletter", fram: `<path d="${FRAM_MIDT}"/>` +
      [100, 114, 128, 142].map(y => `<ellipse cx="${84 + (y - 100) / 14}" cy="${y}" rx="7" ry="8"/><ellipse cx="${156 - (y - 100) / 14}" cy="${y}" rx="7" ry="8"/>`).join("") +
      `<circle cx="87" cy="151" r="3.5" fill="#ff5fa2"/><circle cx="153" cy="151" r="3.5" fill="#ff5fa2"/>` },
    knute: { navn: "Knute", bak: `<circle cx="120" cy="32" r="15"/>`, fram: `<path d="${FRAM_MIDT}"/>` },
  };

  /* ---------- hodeplagg ---------- */
  const HODE = {
    caps: it => `<path d="M80 64C80 28 160 28 160 64Z" fill="${it.f}"/><path d="M76 64Q120 52 164 64L166 71Q120 61 74 71Z" fill="${mix(it.f, -.22)}"/><circle cx="120" cy="34" r="3" fill="${mix(it.f, -.22)}"/>` +
      (it.m ? `<path d="${stjerneD(120, 50, 7)}" fill="#fff"/>` : ""),
    lue: it => `<path d="M79 68C77 24 163 24 161 68Z" fill="${it.f}"/><path d="M77 60Q120 51 163 60L164 73Q120 64 76 73Z" fill="${mix(it.f, -.18)}"/><circle cx="120" cy="27" r="10" fill="${it.f2 || "#fff"}"/>`,
    cowboy: () => `<path d="M58 54Q120 40 182 54Q188 63 170 63Q120 52 70 63Q52 63 58 54Z" fill="#8b5a2b"/><path d="M92 52C90 22 104 16 120 24C136 16 150 22 148 52Z" fill="#9c6a35"/><path d="M92 45Q120 41 148 45L148 52Q120 48 92 52Z" fill="#4e3018"/>`,
    krone: () => `<path d="M88 52L92 18L106 34L120 12L134 34L148 18L152 52Z" fill="#f2c230" stroke="#b8860b" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="92" cy="18" r="3.5" fill="#f2c230"/><circle cx="120" cy="12" r="3.5" fill="#f2c230"/><circle cx="148" cy="18" r="3.5" fill="#f2c230"/>` +
      `<circle cx="120" cy="40" r="5" fill="#e53935"/><circle cx="102" cy="43" r="3.5" fill="#1e88e5"/><circle cx="138" cy="43" r="3.5" fill="#43a047"/>`,
    trollmann: () => `<ellipse cx="120" cy="54" rx="50" ry="9" fill="#4527a0"/><path d="M86 54Q104 30 117 3Q122 -1 125 4Q140 34 154 54Z" fill="#5e35b1"/>` +
      `<path d="${stjerneD(108, 38, 6)}${stjerneD(132, 24, 4.5)}${stjerneD(128, 46, 3.5)}" fill="#ffd23f"/>`,
    hjelm: () => `<ellipse cx="120" cy="128" rx="32" ry="8" fill="#cfd6de"/><circle cx="120" cy="80" r="52" fill="#bfe6ff" fill-opacity=".22" stroke="#e9eef3" stroke-width="6"/>` +
      `<path d="M86 58Q98 40 118 35" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`,
    viking: () => `<path d="M84 50C66 44 58 28 64 10C70 28 78 34 92 40Z" fill="#f3e7c9" stroke="#bfae86" stroke-width="1.5"/><path d="M156 50C174 44 182 28 176 10C170 28 162 34 148 40Z" fill="#f3e7c9" stroke="#bfae86" stroke-width="1.5"/>` +
      `<path d="M81 66C81 28 159 28 159 66Z" fill="#9aa4ad"/><path d="M80 58Q120 50 160 58L161 68Q120 60 79 68Z" fill="#c9a227"/><rect x="116" y="32" width="8" height="30" fill="#c9a227"/>`,
    katt: it => `<path d="M84 56Q120 28 156 56" stroke="${it.f}" stroke-width="5" fill="none"/>` +
      par(`<path d="M84 54L90 20L111 40Z" fill="${it.f}"/><path d="M90 47L92 29L104 40Z" fill="#ff9ec4"/>`),
    sloyfe: it => `<path d="M148 46L130 34L133 60ZM148 46L166 34L163 60Z" fill="${it.f}"/><circle cx="148" cy="47" r="5.5" fill="${mix(it.f, -.2)}"/>`,
    telefon: it => `<path d="M80 82C78 28 162 28 160 82" stroke="#333" stroke-width="7" fill="none"/>` +
      `<rect x="72" y="70" width="16" height="28" rx="7" fill="${it.f}"/><rect x="152" y="70" width="16" height="28" rx="7" fill="${it.f}"/>`,
    blomst: () => {
      let s = `<path d="M82 62Q120 34 158 62" stroke="#4caf50" stroke-width="4" fill="none"/>`;
      const farger = ["#ff80ab", "#fff", "#ce93d8", "#ffd54f"];
      for (let i = 0; i <= 6; i++) {
        const a = Math.PI + i * Math.PI / 6, x = 120 + 39 * Math.cos(a), y = 60 + 20 * Math.sin(a);
        for (let k = 0; k < 5; k++) { const b = k * Math.PI * 2 / 5; s += `<circle cx="${(x + 4.5 * Math.cos(b)).toFixed(1)}" cy="${(y + 4.5 * Math.sin(b)).toFixed(1)}" r="3.6" fill="${farger[i % 4]}"/>`; }
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#ffb300"/>`;
      }
      return s;
    },
    pannebaand: it => `<path d="M81 62Q120 48 159 62L160 71Q120 57 80 71Z" fill="${it.f}"/><path d="M81 66Q120 52 159 66" stroke="#fff" stroke-width="1.6" fill="none"/>`,
    narr: () => `<path d="M88 58Q70 30 50 34Q74 42 104 50Z" fill="#d32f2f"/><path d="M152 58Q170 30 190 34Q166 42 136 50Z" fill="#fbc02d"/>` +
      `<path d="M81 64C81 34 100 30 120 30V64Z" fill="#d32f2f"/><path d="M120 30C140 30 159 34 159 64H120Z" fill="#fbc02d"/><path d="M79 60Q120 51 161 60L162 70Q120 61 78 70Z" fill="#7b1fa2"/>` +
      `<circle cx="50" cy="34" r="5.5" fill="#f2c230" stroke="#b8860b"/><circle cx="190" cy="34" r="5.5" fill="#f2c230" stroke="#b8860b"/>`,
    floss: () => `<rect x="93" y="6" width="54" height="48" rx="4" fill="#212121"/><rect x="93" y="40" width="54" height="8" fill="#c62828"/><ellipse cx="120" cy="54" rx="46" ry="7" fill="#212121"/><path d="M98 11V37" stroke="#555" stroke-width="2"/>`,
    napoleon: () => `<path d="M62 60Q120 4 178 60Q120 46 62 60Z" fill="#1c1c1c" stroke="#c9a227" stroke-width="2.5" stroke-linejoin="round"/><circle cx="120" cy="40" r="9" fill="#1f3f99"/><circle cx="120" cy="40" r="6" fill="#fff"/><circle cx="120" cy="40" r="3" fill="#d32f2f"/>`,
    regnbuecaps: (it, c) => `<defs><linearGradient id="${c.id}rc" x1="0" x2="1"><stop offset="0" stop-color="#e53935"/><stop offset=".2" stop-color="#fb8c00"/><stop offset=".4" stop-color="#fdd835"/><stop offset=".6" stop-color="#43a047"/><stop offset=".8" stop-color="#1e88e5"/><stop offset="1" stop-color="#8e24aa"/></linearGradient></defs>` +
      `<path d="M80 64C80 28 160 28 160 64Z" fill="url(#${c.id}rc)"/><path d="M76 64Q120 52 164 64L166 71Q120 61 74 71Z" fill="#37474f"/><circle cx="120" cy="34" r="3" fill="#fff"/>`,
    party: () => `<path d="M106 46L124 2L140 44Z" fill="#29b6f6"/><path d="M110 37L130 31M114 27L133 23M118 17L128 13" stroke="#ffeb3b" stroke-width="4"/><circle cx="124" cy="3" r="6" fill="#ff4081"/>`,
  };

  /* ---------- ansikt ---------- */
  const ANSIKT = {
    briller: it => `<circle cx="106" cy="84" r="11" fill="#fff" fill-opacity=".15" stroke="${it.f || "#2b2b2b"}" stroke-width="3"/><circle cx="134" cy="84" r="11" fill="#fff" fill-opacity=".15" stroke="${it.f || "#2b2b2b"}" stroke-width="3"/>` +
      `<path d="M117 83Q120 80 123 83M95 82L84 80M145 82L156 80" stroke="${it.f || "#2b2b2b"}" stroke-width="2.5" fill="none"/>`,
    sol: () => `<path d="M92 77H118V85Q118 95 105 95Q92 95 92 85ZM122 77H148V85Q148 95 135 95Q122 95 122 85Z" fill="#1b1f24"/>` +
      `<path d="M118 80Q120 78 122 80M92 79L84 78M148 79L156 78" stroke="#1b1f24" stroke-width="2.5" fill="none"/><path d="M97 81L102 81M127 81L132 81" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`,
    stjerne: () => `<path d="${stjerneD(106, 85, 15, 8)}${stjerneD(134, 85, 15, 8)}" fill="#ff5fa2" fill-opacity=".55" stroke="#d81b7a" stroke-width="2.2" stroke-linejoin="round"/>`,
    maske: it => `<path fill-rule="evenodd" d="M86 77Q120 66 154 77Q160 89 149 95Q134 99 120 91Q106 99 91 95Q80 89 86 77ZM99 84A7 6 0 1 0 113 84A7 6 0 1 0 99 84ZM127 84A7 6 0 1 0 141 84A7 6 0 1 0 127 84Z" fill="${it.f}"/>` +
      `<path d="M86 80L76 76M86 84L76 88" stroke="${it.f}" stroke-width="3" stroke-linecap="round"/>`,
    bart: () => `<path d="M103 97Q111 89 120 94Q129 89 137 97Q130 101 120 97Q110 101 103 97Z" fill="#3e2a1e"/>`,
  };

  /* ---------- i hånda (høyre hånd ved 160,178) ---------- */
  const HAND = {
    ballong: it => `<path d="M160 178C172 150 166 120 178 94" stroke="#888" stroke-width="1.5" fill="none"/><ellipse cx="180" cy="72" rx="16" ry="20" fill="${it.f}"/><path d="M177 92L183 92L180 96Z" fill="${it.f}"/><ellipse cx="174" cy="64" rx="4" ry="6" fill="#fff" opacity=".45"/>`,
    is: () => `<path d="M153 166H167L160 188Z" fill="#d9a066"/><path d="M155 170L164 180M165 170L157 180" stroke="#b07a3f" stroke-width="1"/><circle cx="160" cy="161" r="8" fill="#ff8fb1"/><circle cx="160" cy="151" r="7" fill="#9be7c4"/><circle cx="162" cy="146" r="2" fill="#e53935"/>`,
    flagg: () => `<line x1="163" y1="186" x2="163" y2="94" stroke="#8d6e63" stroke-width="3"/><rect x="164" y="94" width="40" height="29" fill="#ba0c2f"/><rect x="175" y="94" width="8" height="29" fill="#fff"/><rect x="164" y="104.5" width="40" height="8" fill="#fff"/><rect x="177" y="94" width="4" height="29" fill="#00205b"/><rect x="164" y="106.5" width="40" height="4" fill="#00205b"/>`,
    fotball: () => `<circle cx="170" cy="194" r="13" fill="#fff" stroke="#333" stroke-width="1.5"/><path d="M170 188L176 192L174 199H166L164 192Z" fill="#222"/><path d="M170 188V181M176 192L182 189M174 199L178 205M166 199L162 205M164 192L158 189" stroke="#333" stroke-width="1.2"/>`,
    mikrofon: () => `<path d="M158 188L165 160" stroke="#333" stroke-width="6" stroke-linecap="round"/><circle cx="166" cy="154" r="8" fill="#9aa4ad"/><path d="M160 151H172M160 156H172M166 147V161" stroke="#6b737b" stroke-width="1"/>`,
    stav: () => `<line x1="157" y1="188" x2="180" y2="138" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/><line x1="176" y1="146" x2="180" y2="138" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="${stjerneD(182, 132, 10)}" fill="#ffd23f"/><circle cx="194" cy="120" r="2" fill="#ffd23f"/><circle cx="170" cy="122" r="1.5" fill="#fff"/><circle cx="196" cy="140" r="1.5" fill="#ffd23f"/>`,
    gitar: () => `<line x1="168" y1="172" x2="196" y2="110" stroke="#6b3b17" stroke-width="6" stroke-linecap="round"/><rect x="191" y="100" width="10" height="14" rx="2" fill="#4e2a10" transform="rotate(24 196 107)"/>` +
      `<circle cx="174" cy="198" r="16" fill="#c8742c" stroke="#7a4416" stroke-width="2"/><circle cx="168" cy="180" r="12" fill="#c8742c" stroke="#7a4416" stroke-width="2"/><circle cx="171" cy="190" r="5" fill="#3a2310"/>` +
      `<path d="M166 206L192 112M170 207L195 113" stroke="#eee" stroke-width=".7"/>`,
    sverd: () => `<path d="M162 170L185 104L190 100L189 106L168 172Z" fill="#dfe5ea" stroke="#9aa4ad" stroke-width="1"/><line x1="152" y1="166" x2="176" y2="174" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/>` +
      `<line x1="164" y1="171" x2="159" y2="185" stroke="#5d4037" stroke-width="5" stroke-linecap="round"/><circle cx="158" cy="188" r="3.5" fill="#c9a227"/>`,
    lys: it => `<line x1="165" y1="168" x2="190" y2="98" stroke="${it.f}" stroke-width="16" stroke-linecap="round" opacity=".3"/><line x1="165" y1="168" x2="190" y2="98" stroke="${it.f}" stroke-width="8" stroke-linecap="round"/>` +
      `<line x1="165" y1="168" x2="190" y2="98" stroke="#fff" stroke-width="3" stroke-linecap="round"/><line x1="157" y1="190" x2="166" y2="166" stroke="#555" stroke-width="7" stroke-linecap="round"/>`,
    sax: () => `<path d="M170 112L166 121" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M166 121L162 176Q160 198 176 198Q190 198 190 182L188 167" stroke="#e8b923" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="188" cy="164" rx="8" ry="4.5" fill="#c9971c" stroke="#8a6410" stroke-width="1"/>` + [134, 146, 158, 170].map(y => `<circle cx="${(166 - (y - 120) * .07).toFixed(1)}" cy="${y}" r="2.2" fill="#fff3c4" stroke="#8a6410" stroke-width=".8"/>`).join(""),
    pizza: () => `<path d="M150 150L188 150L169 196Z" fill="#f6c453" stroke="#d58b3a" stroke-width="1.5" stroke-linejoin="round"/><path d="M149 147Q169 139 189 147L188 155Q169 147 150 155Z" fill="#d58b3a"/>` +
      `<circle cx="162" cy="161" r="4" fill="#d32f2f"/><circle cx="176" cy="162" r="4" fill="#d32f2f"/><circle cx="169" cy="177" r="3.5" fill="#d32f2f"/><path d="M158 171L161 168M178 156L181 158" stroke="#4caf50" stroke-width="2"/>`,
    hammer: () => `<line x1="158" y1="190" x2="178" y2="128" stroke="#a1662f" stroke-width="6" stroke-linecap="round"/><g transform="rotate(18 179 124)"><rect x="164" y="116" width="30" height="13" rx="2" fill="#78909c" stroke="#455a64" stroke-width="1.5"/><path d="M164 116L158 112V133L164 129Z" fill="#607d8b"/></g>`,
    kjeks: () => `<circle cx="174" cy="164" r="17" fill="#d9a066" stroke="#a8743f" stroke-width="2"/>` + [[168, 156], [180, 160], [172, 170], [183, 172], [164, 166], [176, 151]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#4e2a10"/>`).join(""),
    vifte: () => {
      let s = `<path d="M162 176L132 136A50 50 0 0 1 192 136Z" fill="#d32f2f" stroke="#8e1515" stroke-width="1.5"/>`;
      for (let i = 0; i <= 8; i++) {
        const a = (-126.9 + i * 73.8 / 8) * Math.PI / 180;
        s += `<line x1="162" y1="176" x2="${(162 + 50 * Math.cos(a)).toFixed(1)}" y2="${(176 + 50 * Math.sin(a)).toFixed(1)}" stroke="#ffcdd2" stroke-width="1"/>`;
        s += `<circle cx="${(162 + 45 * Math.cos(a)).toFixed(1)}" cy="${(176 + 45 * Math.sin(a)).toFixed(1)}" r="2.2" fill="#fff"/>`;
      }
      return s;
    },
    pokal: () => `<path d="M154 140H186Q186 164 170 168Q154 164 154 140Z" fill="#f2c230" stroke="#b8860b" stroke-width="1.5"/><path d="M154 146Q144 146 146 156Q148 162 156 160M186 146Q196 146 194 156Q192 162 184 160" stroke="#f2c230" stroke-width="3" fill="none"/>` +
      `<rect x="166" y="167" width="8" height="8" fill="#d4a017"/><rect x="158" y="175" width="24" height="7" rx="2" fill="#b8860b"/><path d="${stjerneD(170, 152, 6)}" fill="#fff8d0"/>`,
  };

  /* ---------- på ryggen ---------- */
  const RYGG = {
    sekk: it => ({ bak: `<rect x="82" y="128" width="76" height="62" rx="14" fill="${it.f}"/>`,
      fram: `<path d="M102 126L105 176M138 126L135 176" stroke="${mix(it.f, -.25)}" stroke-width="6" stroke-linecap="round"/>` }),
    kappe: it => ({ bak: `<path d="M96 122Q62 172 48 224Q70 214 86 222Q102 212 120 218Q138 212 154 222Q170 214 192 224Q178 172 144 122Z" fill="${mix(it.f, -.3)}"/>` +
        `<path d="M96 122Q62 172 48 224Q60 219 70 220Q76 170 100 130ZM144 122Q178 172 192 224Q180 219 170 220Q164 170 140 130Z" fill="${it.f}"/>` +
        (it.m === "stjerner" ? `<path d="${[[62, 196, 4], [74, 212, 3], [178, 196, 4], [166, 212, 3], [56, 216, 2.5], [184, 216, 2.5], [84, 168, 2.5], [156, 168, 2.5]].map(([x, y, r]) => stjerneD(x, y, r)).join("")}" fill="#ffd54f"/>` : ""),
      fram: `<circle cx="104" cy="126" r="4.5" fill="#f2c230"/><circle cx="136" cy="126" r="4.5" fill="#f2c230"/><path d="M104 126Q120 134 136 126" stroke="#f2c230" stroke-width="2" fill="none"/>` }),
    engel: () => ({ bak: par(`<path d="M100 140C70 96 30 104 34 134C36 150 50 156 60 156C50 164 56 176 72 172C66 182 80 188 100 168Z" fill="#fbfbff" stroke="#cfd6e0" stroke-width="2"/><path d="M90 146C74 128 58 126 46 134M88 156C76 150 66 152 60 156M92 164C84 166 78 170 72 172" stroke="#cfd6e0" stroke-width="1.5" fill="none"/>`) }),
    sommerfugl: () => ({ bak: par(`<path d="M102 140C80 94 36 96 42 130C46 150 80 154 102 150Z" fill="#ff8a65" stroke="#6d4c41" stroke-width="2"/><path d="M102 154C84 160 58 178 72 196C86 206 100 178 102 162Z" fill="#ba68c8" stroke="#6d4c41" stroke-width="2"/><circle cx="64" cy="126" r="7" fill="#fff59d"/><circle cx="80" cy="180" r="5" fill="#fff59d"/>`) }),
    drage: () => ({ bak: par(`<path d="M100 136L58 98L62 116L40 110L48 130L28 132L46 148L34 162L100 160Z" fill="#2e8b57" stroke="#1b5e20" stroke-width="2" stroke-linejoin="round"/><path d="M100 140L62 116M100 146L48 130M100 152L46 148" stroke="#1b5e20" stroke-width="1.5"/>`) }),
    jetpack: () => ({ bak: par(`<rect x="76" y="116" width="18" height="56" rx="8" fill="#c0c6cc" stroke="#7b848c" stroke-width="2"/><rect x="79" y="170" width="12" height="8" fill="#555"/><path d="M79 178Q85 208 85 214Q91 200 91 178Z" fill="#ff7043"/><path d="M82 178Q85 196 85 200Q88 192 88 178Z" fill="#ffeb3b"/>`),
      fram: `<path d="M102 126L105 176M138 126L135 176" stroke="#555" stroke-width="5" stroke-linecap="round"/>` }),
  };

  /* ---------- kjæledyr (venstre side) ---------- */
  const VENN = {
    katt: it => `<path d="M58 226C78 220 76 196 66 190" stroke="${it.f}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="224" rx="19" ry="13" fill="${it.f}"/>` +
      `<path d="M23 197L24 180L34 190ZM45 197L44 180L34 190Z" fill="${it.f}"/><circle cx="34" cy="202" r="13" fill="${it.f}"/><path d="M26 194L26 185L31 190ZM42 194L42 185L37 190Z" fill="#ff9ec4"/>` +
      `<circle cx="29" cy="201" r="2.2" fill="#222"/><circle cx="39" cy="201" r="2.2" fill="#222"/><path d="M32 206H36L34 208Z" fill="#ff6f91"/><path d="M27 208L18 206M27 210L18 212M41 208L50 206M41 210L50 212" stroke="#555" stroke-width=".8"/>` +
      `<ellipse cx="36" cy="236" rx="5" ry="3" fill="${mix(it.f, .3)}"/><ellipse cx="52" cy="236" rx="5" ry="3" fill="${mix(it.f, .3)}"/>`,
    hund: it => `<path d="M60 216Q72 206 68 196" stroke="${it.f}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="46" cy="222" rx="20" ry="14" fill="${it.f}"/><circle cx="34" cy="200" r="14" fill="${it.f}"/>` +
      `<ellipse cx="21" cy="200" rx="5" ry="11" fill="${mix(it.f, -.3)}"/><ellipse cx="47" cy="200" rx="5" ry="11" fill="${mix(it.f, -.3)}"/><ellipse cx="34" cy="208" rx="8" ry="6" fill="${mix(it.f, .35)}"/>` +
      `<circle cx="29" cy="198" r="2.2" fill="#222"/><circle cx="39" cy="198" r="2.2" fill="#222"/><ellipse cx="34" cy="205" rx="3" ry="2.2" fill="#222"/><path d="M33 211Q34 216 36 211Z" fill="#ff6f91"/>` +
      `<ellipse cx="36" cy="236" rx="5" ry="3" fill="${mix(it.f, .2)}"/><ellipse cx="54" cy="236" rx="5" ry="3" fill="${mix(it.f, .2)}"/>`,
    kanin: () => `<ellipse cx="44" cy="224" rx="17" ry="13" fill="#f5f5f5"/><circle cx="60" cy="222" r="5" fill="#fff"/><ellipse cx="29" cy="178" rx="4.5" ry="14" fill="#f5f5f5"/><ellipse cx="40" cy="178" rx="4.5" ry="14" fill="#f5f5f5"/>` +
      `<ellipse cx="29" cy="178" rx="2" ry="10" fill="#ffb6c8"/><ellipse cx="40" cy="178" rx="2" ry="10" fill="#ffb6c8"/><circle cx="35" cy="202" r="12" fill="#f5f5f5"/>` +
      `<circle cx="30" cy="200" r="2" fill="#222"/><circle cx="40" cy="200" r="2" fill="#222"/><path d="M33 205H37L35 207Z" fill="#ff6f91"/>`,
    pingvin: () => `<ellipse cx="40" cy="214" rx="16" ry="23" fill="#263238"/><ellipse cx="40" cy="219" rx="10" ry="16" fill="#fff"/><circle cx="35" cy="202" r="2" fill="#fff"/><circle cx="45" cy="202" r="2" fill="#fff"/>` +
      `<circle cx="35" cy="202" r="1" fill="#000"/><circle cx="45" cy="202" r="1" fill="#000"/><path d="M37 207H43L40 212Z" fill="#ffa726"/><ellipse cx="33" cy="238" rx="6" ry="3" fill="#ffa726"/><ellipse cx="47" cy="238" rx="6" ry="3" fill="#ffa726"/>`,
    ugle: () => `<ellipse cx="40" cy="214" rx="17" ry="22" fill="#8d6e63"/><path d="M25 196L28 186L34 194ZM55 196L52 186L46 194Z" fill="#6d4c41"/><ellipse cx="40" cy="222" rx="10" ry="12" fill="#d7ccc8"/>` +
      `<circle cx="33" cy="204" r="7" fill="#fff" stroke="#ffb300" stroke-width="2"/><circle cx="47" cy="204" r="7" fill="#fff" stroke="#ffb300" stroke-width="2"/><circle cx="33" cy="204" r="3" fill="#222"/><circle cx="47" cy="204" r="3" fill="#222"/><path d="M38 210H42L40 215Z" fill="#ffa726"/>`,
    robot: () => `<rect x="24" y="210" width="34" height="24" rx="4" fill="#90a4ae"/><rect x="26" y="186" width="30" height="22" rx="5" fill="#b0bec5"/><line x1="41" y1="186" x2="41" y2="176" stroke="#607d8b" stroke-width="2"/><circle cx="41" cy="175" r="3" fill="#ff5252"/>` +
      `<circle cx="34" cy="197" r="4" fill="#00e5ff"/><circle cx="48" cy="197" r="4" fill="#00e5ff"/><rect x="34" y="203" width="14" height="2" fill="#607d8b"/><rect x="30" y="216" width="22" height="8" rx="2" fill="#607d8b"/><circle cx="30" cy="238" r="4" fill="#455a64"/><circle cx="52" cy="238" r="4" fill="#455a64"/>`,
    drage: () => `<path d="M58 224Q80 222 74 204L80 208L76 198" stroke="#43a047" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 208L62 188L64 204Z" fill="#2e7d32"/><ellipse cx="44" cy="222" rx="19" ry="14" fill="#43a047"/><ellipse cx="44" cy="226" rx="11" ry="8" fill="#fff176"/>` +
      `<circle cx="32" cy="200" r="13" fill="#43a047"/><path d="M24 190L20 180L28 188ZM38 189L40 178L42 190Z" fill="#fff59d"/><circle cx="28" cy="198" r="2.5" fill="#fff"/><circle cx="28" cy="198" r="1.3" fill="#222"/><circle cx="37" cy="198" r="2.5" fill="#fff"/><circle cx="37" cy="198" r="1.3" fill="#222"/>` +
      `<ellipse cx="25" cy="206" rx="6" ry="4" fill="#66bb6a"/><circle cx="23" cy="205" r="1" fill="#1b5e20"/><path d="M18 206Q10 204 8 198Q12 206 6 208Z" fill="#ff7043"/>`,
    frosk: () => `<ellipse cx="42" cy="226" rx="21" ry="12" fill="#5cb85c"/><ellipse cx="42" cy="230" rx="13" ry="7" fill="#c5e1a5"/><ellipse cx="40" cy="208" rx="17" ry="12" fill="#5cb85c"/>` +
      `<circle cx="31" cy="198" r="7" fill="#5cb85c"/><circle cx="49" cy="198" r="7" fill="#5cb85c"/><circle cx="31" cy="198" r="4" fill="#fff"/><circle cx="49" cy="198" r="4" fill="#fff"/><circle cx="32" cy="198" r="2" fill="#222"/><circle cx="50" cy="198" r="2" fill="#222"/>` +
      `<path d="M30 212Q40 219 50 212" stroke="#2e7d32" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="236" rx="8" ry="3.5" fill="#4caf50"/><ellipse cx="60" cy="236" rx="8" ry="3.5" fill="#4caf50"/>` +
      `<circle cx="33" cy="210" r="2" fill="#ff8a80" opacity=".6"/><circle cx="47" cy="210" r="2" fill="#ff8a80" opacity=".6"/>`,
    troll: () => `<path d="M58 226Q74 222 72 206" stroke="#7d8a55" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="72" cy="203" r="5" fill="#5d4037"/><ellipse cx="42" cy="224" rx="17" ry="14" fill="#7d8a55"/><ellipse cx="42" cy="227" rx="10" ry="8" fill="#a1887f"/>` +
      `<ellipse cx="22" cy="198" rx="5" ry="8" fill="#7d8a55" transform="rotate(-25 22 198)"/><ellipse cx="50" cy="198" rx="5" ry="8" fill="#7d8a55" transform="rotate(25 50 198)"/><circle cx="36" cy="200" r="14" fill="#8d9b62"/>` +
      `<path d="M28 189Q30 176 36 186Q40 174 44 189Z" fill="#5d4037"/><circle cx="31" cy="198" r="2.4" fill="#222"/><circle cx="41" cy="198" r="2.4" fill="#222"/><ellipse cx="36" cy="206" rx="6" ry="5" fill="#a5b07a"/>` +
      `<path d="M30 211Q36 215 42 211" stroke="#3e2723" stroke-width="1.6" fill="none"/><path d="M33 212L34 215L35 212Z" fill="#fff"/>`,
    rev: () => `<path d="M58 226C82 224 84 200 70 192C76 206 68 216 56 218Z" fill="#ef6c00"/><path d="M70 192C76 196 78 202 76 207L72 200Z" fill="#fff"/><ellipse cx="44" cy="224" rx="18" ry="12" fill="#ef6c00"/><ellipse cx="42" cy="228" rx="9" ry="7" fill="#fff3e0"/>` +
      `<path d="M22 196L24 178L34 190ZM46 196L44 178L34 190Z" fill="#ef6c00"/><path d="M25 192L26 183L31 189ZM43 192L42 183L37 189Z" fill="#4e342e"/><path d="M20 196Q34 186 48 196Q46 210 34 214Q22 210 20 196Z" fill="#ef6c00"/>` +
      `<path d="M26 204Q34 200 42 204Q40 213 34 214Q28 213 26 204Z" fill="#fff"/><circle cx="29" cy="199" r="2" fill="#222"/><circle cx="39" cy="199" r="2" fill="#222"/><circle cx="34" cy="210" r="2.3" fill="#222"/>`,
    gullfisk: () => `<ellipse cx="40" cy="238" rx="16" ry="4" fill="#90a4ae"/><circle cx="40" cy="214" r="22" fill="#b3e5fc" fill-opacity=".55" stroke="#81d4fa" stroke-width="2"/><path d="M19 208H61" stroke="#4fc3f7" stroke-width="1.5"/>` +
      `<ellipse cx="38" cy="220" rx="9" ry="6" fill="#ff9800"/><path d="M46 220L55 214V226Z" fill="#ffb74d"/><circle cx="34" cy="219" r="1.5" fill="#222"/><circle cx="30" cy="203" r="2" fill="none" stroke="#fff"/><circle cx="34" cy="197" r="1.4" fill="none" stroke="#fff"/>` +
      `<path d="M26 234Q28 228 24 222M54 234Q52 230 56 224" stroke="#43a047" stroke-width="2.5" fill="none"/>`,
    enhjorning: () => `<path d="M62 214Q76 214 72 232" stroke="#f48fb1" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M62 216Q74 222 70 236" stroke="#90caf9" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<rect x="32" y="222" width="6" height="16" rx="2" fill="#fafafa"/><rect x="52" y="222" width="6" height="16" rx="2" fill="#fafafa"/><ellipse cx="46" cy="218" rx="20" ry="12" fill="#fafafa" stroke="#e0e0e0"/>` +
      `<path d="M28 214L24 196L36 192L40 212Z" fill="#fafafa"/><ellipse cx="25" cy="194" rx="11" ry="8" fill="#fafafa" stroke="#e0e0e0"/><path d="M22 186L20 170L27 185Z" fill="#f2c230"/>` +
      `<circle cx="34" cy="188" r="4" fill="#ff80ab"/><circle cx="38" cy="196" r="4" fill="#ffd54f"/><circle cx="40" cy="204" r="4" fill="#81d4fa"/><circle cx="23" cy="193" r="1.8" fill="#222"/>`,
  };

  /* ---------- bakgrunner ---------- */
  const STJERNER = (function () { let x = 7; const r = () => (x = (x * 9301 + 49297) % 233280) / 233280; return Array.from({ length: 40 }, () => [r() * 240, r() * 200, r() * 1.4 + .5]); })();
  const prikker = (farge, n) => STJERNER.slice(0, n).map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${farge}"/>`).join("");
  const sky = (x, y, s) => `<g fill="#fff" opacity=".95"><ellipse cx="${x}" cy="${y}" rx="${18 * s}" ry="${9 * s}"/><ellipse cx="${x + 12 * s}" cy="${y - 6 * s}" rx="${12 * s}" ry="${9 * s}"/><ellipse cx="${x - 12 * s}" cy="${y + 1 * s}" rx="${10 * s}" ry="${7 * s}"/></g>`;
  const grad = (c, n, a, b) => `<defs><linearGradient id="${c.id}${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  const BG = {
    std: () => `<rect width="240" height="260" fill="#e8eef7"/><circle cx="120" cy="140" r="104" fill="#dbe5f3"/>`,
    himmel: c => grad(c, "g", "#7fcbff", "#e3f5ff") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` + sky(50, 50, 1.1) + sky(190, 86, .8) + `<path d="M0 222Q60 204 120 220T240 214V260H0Z" fill="#7cc35a"/>`,
    skog: c => grad(c, "g", "#bfe8ff", "#eaf7e4") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` +
      [[20, 200, 44], [62, 190, 56], [184, 192, 54], [224, 202, 44], [150, 206, 38], [100, 210, 34]].map(([x, y, h]) => `<rect x="${x - 3}" y="${y}" width="6" height="22" fill="#6d4c41"/><path d="M${x} ${y - h}L${x + h * .42} ${y + 4}H${x - h * .42}Z" fill="#2e7d32"/><path d="M${x} ${y - h}L${x + h * .3} ${y - h * .35}H${x - h * .3}Z" fill="#388e3c"/>`).join("") +
      `<rect y="222" width="240" height="38" fill="#689f38"/>`,
    strand: c => grad(c, "g", "#6ec6ff", "#d9f1ff") + `<rect width="240" height="260" fill="url(#${c.id}g)"/><circle cx="198" cy="44" r="20" fill="#ffd54f"/>` + sky(56, 52, .9) +
      `<rect y="150" width="240" height="56" fill="#2f9fd8"/><path d="M0 168Q15 162 30 168T60 168T90 168T120 168T150 168T180 168T210 168T240 168" stroke="#bfe9ff" stroke-width="2" fill="none"/><path d="M0 198Q60 188 120 196T240 192V260H0Z" fill="#f3d9a0"/>` +
      `<circle cx="206" cy="232" r="9" fill="#ff7043"/><path d="M200 232H212M206 224V240" stroke="#fff" stroke-width="2"/>`,
    fotball: () => `<rect width="240" height="260" fill="#43a047"/>` + [0, 52, 104, 156, 208].map(y => `<rect y="${y}" width="240" height="26" fill="#4caf50"/>`).join("") +
      `<path d="M0 150H240" stroke="#fff" stroke-width="3" opacity=".8"/><circle cx="120" cy="150" r="40" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>` +
      `<rect x="70" y="20" width="100" height="44" fill="none" stroke="#fff" stroke-width="4"/><path d="M80 20V64M95 20V64M110 20V64M125 20V64M140 20V64M155 20V64M70 34H170M70 49H170" stroke="#fff" stroke-width="1" opacity=".6"/>`,
    hav: c => grad(c, "g", "#29b6f6", "#0b4f7c") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` +
      [[30, 180, 6], [40, 150, 4], [200, 120, 5], [212, 90, 3], [60, 60, 4], [180, 40, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#e1f5fe" stroke-width="1.5" opacity=".8"/>`).join("") +
      `<path d="M12 260C4 236 22 222 12 196M24 260C30 240 16 226 26 206M218 260C226 236 208 222 218 200M230 260C222 240 236 228 228 210" stroke="#43a047" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M176 74Q190 62 204 74Q190 86 176 74ZM204 74L212 66V82Z" fill="#ffb300"/><circle cx="184" cy="72" r="1.5" fill="#222"/><path d="M0 240Q120 226 240 240V260H0Z" fill="#e6cf9a"/>`,
    by: c => grad(c, "g", "#141a33", "#3a3f6b") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` + prikker("#fff", 18) + `<circle cx="196" cy="40" r="15" fill="#fff3c4"/><circle cx="202" cy="35" r="13" fill="#232a4a"/>` +
      [[0, 150, 34], [30, 120, 30], [60, 160, 28], [150, 130, 32], [182, 104, 28], [210, 150, 30]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${260 - y}" fill="#1b2038"/>` +
        [0, 1, 2, 3, 4].map(r => [0, 1].map(k => (x * 7 + r * 3 + k) % 3 ? `<rect x="${x + 6 + k * 12}" y="${y + 10 + r * 18}" width="6" height="8" fill="#ffd54f" opacity=".85"/>` : "").join("")).join("")).join(""),
    scene: () => `<rect width="240" height="260" fill="#1d0f22"/><path d="M60 0L20 230H100Z M180 0L140 230H220Z" fill="#fff59d" opacity=".16"/><path d="M120 0L80 230H160Z" fill="#fff" opacity=".1"/>` +
      `<path d="M0 0H44Q30 120 46 260H0Z" fill="#b71c1c"/><path d="M240 0H196Q210 120 194 260H240Z" fill="#b71c1c"/><path d="M0 0H240V18Q120 30 0 18Z" fill="#8e1515"/><rect y="236" width="240" height="24" fill="#5d4037"/>`,
    slott: c => grad(c, "g", "#ffd1e8", "#fff4e0") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` + sky(40, 40, .8) +
      `<g fill="#b0a8c8"><rect x="40" y="110" width="160" height="110"/><rect x="28" y="70" width="34" height="150"/><rect x="178" y="70" width="34" height="150"/><rect x="100" y="60" width="40" height="70"/></g>` +
      `<g fill="#7e57c2"><path d="M24 70L45 34L66 70Z"/><path d="M174 70L195 34L216 70Z"/><path d="M96 60L120 20L144 60Z"/></g>` +
      `<path d="M45 34V20L58 25L45 30M195 34V20L208 25L195 30M120 20V6L133 11L120 16" stroke="#555" stroke-width="1.5" fill="#ff4081"/>` +
      `<g fill="#6a5f86"><rect x="40" y="104" width="10" height="8"/><rect x="60" y="104" width="10" height="8"/><rect x="170" y="104" width="10" height="8"/><rect x="190" y="104" width="10" height="8"/><path d="M106 220V176Q120 160 134 176V220Z"/><rect x="38" y="90" width="12" height="16" rx="6"/><rect x="190" y="90" width="12" height="16" rx="6"/></g>` +
      `<rect y="220" width="240" height="40" fill="#81c784"/>`,
    rom: c => grad(c, "g", "#0b0d2a", "#24145a") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` + prikker("#fff", 40) +
      `<circle cx="196" cy="58" r="22" fill="#ff8a65"/><ellipse cx="196" cy="58" rx="36" ry="8" fill="none" stroke="#ffe0b2" stroke-width="3" transform="rotate(-18 196 58)"/>` +
      `<circle cx="34" cy="44" r="10" fill="#4fc3f7"/><path d="M28 40Q34 44 32 50" stroke="#66bb6a" stroke-width="4" fill="none"/><path d="M0 244Q120 228 240 244V260H0Z" fill="#9e9e9e"/><circle cx="60" cy="248" r="5" fill="#757575"/><circle cx="190" cy="250" r="4" fill="#757575"/>`,
    regnbue: c => grad(c, "g", "#a3dcff", "#ffffff") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` +
      ["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#8e24aa"].map((f, i) => `<path d="M${-10 + i * 9} 230A${130 - i * 9} ${130 - i * 9} 0 0 1 ${250 - i * 9} 230" stroke="${f}" stroke-width="9" fill="none"/>`).join("") +
      sky(14, 222, 1.2) + sky(226, 222, 1.2) + `<rect y="232" width="240" height="28" fill="#9ccc65"/>`,
    solnedgang: c => grad(c, "g", "#ff7043", "#ffd54f") + `<rect width="240" height="260" fill="url(#${c.id}g)"/><circle cx="120" cy="176" r="50" fill="#fff3c4" opacity=".85"/>` +
      `<path d="M168 230V118H176V104L180 92L184 104V118H192V230Z" fill="#6d2c18"/><rect x="172" y="124" width="4" height="8" fill="#ffd54f"/><rect x="184" y="124" width="4" height="8" fill="#ffd54f"/>` +
      `<path d="M44 230Q50 184 44 142" stroke="#4e2a10" stroke-width="6" fill="none"/><path d="M44 142Q24 130 8 144Q26 136 44 146ZM44 142Q64 128 82 140Q62 136 44 146ZM44 142Q36 120 22 116Q38 126 44 146ZM44 142Q54 120 70 118Q54 128 44 146Z" fill="#2e5a1c"/>` +
      `<path d="M0 230H240V260H0Z" fill="#7a3a1e"/><path d="M96 230V206Q108 194 120 206V230ZM126 230V212Q134 204 142 212V230Z" fill="#8d4a26"/>`,
    portal: c => `<rect width="240" height="260" fill="#1a0f3a"/>` + prikker("#fff", 22) +
      [104, 86, 68, 50, 32].map((r, i) => `<circle cx="120" cy="128" r="${r}" fill="none" stroke="${["#7c4dff", "#b388ff", "#40c4ff", "#e040fb", "#fff"][i]}" stroke-width="${6 - i}" stroke-dasharray="${18 - i * 2} ${8 + i}" opacity="${.5 + i * .1}"/>`).join("") +
      [[36, 46, 12], [206, 70, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff8e1" stroke="#c9a227" stroke-width="2.5"/><path d="M${x} ${y}V${y - r * .65}M${x} ${y}L${x + r * .5} ${y + r * .3}" stroke="#333" stroke-width="1.8" stroke-linecap="round"/>`).join("") +
      `<ellipse cx="120" cy="244" rx="90" ry="10" fill="#7c4dff" opacity=".35"/>`,
    skatt: c => grad(c, "g", "#3b2a1a", "#1f150c") + `<rect width="240" height="260" fill="url(#${c.id}g)"/>` + prikker("#ffd54f", 14) +
      `<path d="M0 260V226Q30 200 60 222Q90 196 120 220Q150 198 180 220Q210 200 240 224V260Z" fill="#f2c230"/>` +
      [[20, 232], [46, 220], [70, 236], [150, 232], [176, 222], [204, 236], [226, 228], [100, 240]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4" fill="#ffe082" stroke="#b8860b" stroke-width="1"/>`).join("") +
      `<rect x="178" y="170" width="50" height="34" rx="4" fill="#8d6e63" stroke="#4e342e" stroke-width="2"/><path d="M178 170Q203 150 228 170Z" fill="#a1887f" stroke="#4e342e" stroke-width="2"/><rect x="199" y="174" width="8" height="10" fill="#f2c230"/>` +
      `<path d="${stjerneD(30, 70, 6)}${stjerneD(210, 90, 5)}${stjerneD(60, 130, 4)}" fill="#fff8d0"/><path d="M20 190L28 178L36 190L28 200Z" fill="#e91e63"/><path d="M36 210L42 200L48 210L42 218Z" fill="#00bcd4"/>`,
  };

  /* ==========================================================
     KATALOG: [id, navn, plass, pris, type, egenskaper]
     ========================================================== */
  const PLASSER = [
    ["overdel", "Overdeler"], ["underdel", "Bukser og skjørt"], ["sko", "Sko"], ["hode", "Hodeplagg"], ["ansikt", "Briller og masker"],
    ["hand", "I hånda"], ["rygg", "På ryggen"], ["venn", "Kjæledyr"], ["bakgrunn", "Bakgrunner"], ["harfarge", "Hårfarger"],
  ];
  const K = [
    ["ts-hvit", "Hvit t-skjorte", "overdel", 0, "ts", { f: "#f4f4f2" }],
    ["ts-bla", "Blå t-skjorte", "overdel", 0, "ts", { f: "#3b82d6" }],
    ["ts-rod", "Rød t-skjorte", "overdel", 0, "ts", { f: "#e04848" }],
    ["ts-rosa", "Rosa t-skjorte", "overdel", 0, "ts", { f: "#f48fb1" }],
    ["ts-gronn", "Grønn t-skjorte", "overdel", 15, "ts", { f: "#43a047" }],
    ["ts-gul", "Gul t-skjorte", "overdel", 15, "ts", { f: "#fbc02d" }],
    ["ts-lilla", "Lilla t-skjorte", "overdel", 15, "ts", { f: "#8e5bd6" }],
    ["ts-svart", "Svart t-skjorte", "overdel", 15, "ts", { f: "#2b2f36" }],
    ["ts-stjerne", "Stjerne-t-skjorte", "overdel", 30, "ts", { f: "#1f3a6b", m: "stjerne" }],
    ["ts-lyn", "Lyn-t-skjorte", "overdel", 30, "ts", { f: "#2b2f36", m: "lyn" }],
    ["ts-hjerte", "Hjerte-t-skjorte", "overdel", 30, "ts", { f: "#ffffff", m: "hjerte" }],
    ["ts-smil", "Smilefjes-t-skjorte", "overdel", 30, "ts", { f: "#26a69a", m: "smil" }],
    ["ts-fjell", "Fjell-t-skjorte", "overdel", 35, "ts", { f: "#5c6bc0", m: "fjell" }],
    ["genser-rod", "Rød genser", "overdel", 45, "genser", { f: "#c62828" }],
    ["genser-stripet", "Stripete genser", "overdel", 55, "genser", { f: "#f5f5f5", f2: "#1e5aa8" }],
    ["genser-rosa", "Rosa stripegenser", "overdel", 55, "genser", { f: "#fce4ec", f2: "#ec407a" }],
    ["hette-gra", "Grå hettegenser", "overdel", 70, "hette", { f: "#8d969e" }],
    ["hette-gronn", "Grønn hettegenser", "overdel", 70, "hette", { f: "#2e7d32" }],
    ["hette-lilla", "Lilla hettegenser", "overdel", 70, "hette", { f: "#7e57c2" }],
    ["kjole-bla", "Blå kjole", "overdel", 80, "kjole", { f: "#42a5f5" }],
    ["kjole-gul", "Gul kjole", "overdel", 80, "kjole", { f: "#ffca28" }],
    ["regnjakke", "Gul regnjakke", "overdel", 90, "jakke", { f: "#f4c430" }],
    ["kjole-prikk", "Prikkete kjole", "overdel", 110, "kjole", { f: "#e53935", m: "prikker" }],
    ["fotball-rod", "Fotballdrakt rød", "overdel", 120, "fotball", { f: "#d32f2f", f2: "#ffffff", nr: 10 }],
    ["fotball-gul", "Fotballdrakt gul", "overdel", 120, "fotball", { f: "#fbc02d", f2: "#1565c0", nr: 7 }],
    ["kjole-glitter", "Glitterkjole", "overdel", 180, "kjole", { f: "#ab47bc", m: "glitter" }],
    ["smoking", "Smoking", "overdel", 250, "smoking", { f: "#d32f2f" }],
    ["helt-rod", "Superhelt (lyn)", "overdel", 300, "helt", { f: "#d32f2f" }],
    ["helt-bla", "Superhelt (stjerne)", "overdel", 300, "helt", { f: "#1565c0", m: "stjerne" }],
    ["rustning", "Ridderrustning", "overdel", 500, "rustning", { f: "#b8c0c8", m: "skjold" }],
    ["astronaut", "Astronautdrakt", "overdel", 600, "astronaut", {}],
    ["konge", "Kongekappe", "overdel", 900, "konge", { f: "#6a1b9a" }],
    ["gullrustning", "Gullrustning", "overdel", 1500, "rustning", { f: "#e8b923" }],

    ["bukse-jeans", "Olabukse", "underdel", 0, "bukse", { f: "#3d5a99", m: "jeans" }],
    ["shorts-svart", "Svarte shorts", "underdel", 0, "shorts", { f: "#2b2f36" }],
    ["skjort-bla", "Blått skjørt", "underdel", 0, "skjort", { f: "#3b82d6" }],
    ["bukse-svart", "Svart bukse", "underdel", 15, "bukse", { f: "#2b2f36" }],
    ["bukse-brun", "Brun bukse", "underdel", 15, "bukse", { f: "#8d6e63" }],
    ["shorts-rod", "Røde shorts", "underdel", 15, "shorts", { f: "#e04848" }],
    ["shorts-gronn", "Grønne shorts", "underdel", 15, "shorts", { f: "#558b2f" }],
    ["skjort-rosa", "Rosa skjørt", "underdel", 15, "skjort", { f: "#f48fb1" }],
    ["skjort-rutet", "Rødt skjørt", "underdel", 20, "skjort", { f: "#c62828" }],
    ["jogge-gra", "Grå joggebukse", "underdel", 40, "jogge", { f: "#78838c" }],
    ["jogge-bla", "Blå joggebukse", "underdel", 40, "jogge", { f: "#1e5aa8" }],
    ["skjort-glitter", "Glitterskjørt", "underdel", 120, "skjort", { f: "#8e24aa", m: "glitter" }],
    ["bukse-gull", "Gullbukse", "underdel", 400, "bukse", { f: "#d4a017" }],

    ["sko-hvit", "Hvite joggesko", "sko", 0, "jogge", { f: "#e9ecef" }],
    ["sko-rod", "Røde joggesko", "sko", 20, "jogge", { f: "#e53935" }],
    ["sko-svart", "Svarte joggesko", "sko", 20, "jogge", { f: "#2b2f36" }],
    ["sko-rosa", "Rosa joggesko", "sko", 20, "jogge", { f: "#f06292" }],
    ["sko-bla", "Blå joggesko", "sko", 20, "jogge", { f: "#1e88e5" }],
    ["gummistovler", "Gule gummistøvler", "sko", 50, "stovel", { f: "#fbc02d", h: 206 }],
    ["stovler", "Brune støvler", "sko", 80, "stovel", { f: "#6d4c41", h: 212 }],
    ["rulleskoyter", "Rulleskøyter", "sko", 200, "rulle", { f: "#7e57c2" }],
    ["gullsko", "Gullsko", "sko", 700, "gull", {}],

    ["pannebaand", "Pannebånd", "hode", 25, "pannebaand", { f: "#e53935" }],
    ["caps-rod", "Rød caps", "hode", 30, "caps", { f: "#e53935" }],
    ["caps-bla", "Blå caps", "hode", 30, "caps", { f: "#1e5aa8", m: 1 }],
    ["sloyfe", "Hårsløyfe", "hode", 35, "sloyfe", { f: "#ec407a" }],
    ["sloyfe-bla", "Blå hårsløyfe", "hode", 35, "sloyfe", { f: "#42a5f5" }],
    ["lue-gronn", "Grønn lue", "hode", 40, "lue", { f: "#2e7d32" }],
    ["lue-rosa", "Rosa lue", "hode", 40, "lue", { f: "#f06292" }],
    ["partyhatt", "Bursdagshatt", "hode", 60, "party", {}],
    ["kattore", "Katteører", "hode", 120, "katt", { f: "#424242" }],
    ["blomsterkrans", "Blomsterkrans", "hode", 140, "blomst", {}],
    ["hodetelefoner", "Hodetelefoner", "hode", 150, "telefon", { f: "#e53935" }],
    ["cowboyhatt", "Cowboyhatt", "hode", 220, "cowboy", {}],
    ["vikinghjelm", "Vikinghjelm", "hode", 380, "viking", {}],
    ["trollmannshatt", "Trollmannshatt", "hode", 450, "trollmann", {}],
    ["romhjelm", "Romhjelm", "hode", 650, "hjelm", {}],
    ["krone", "Gullkrone", "hode", 1200, "krone", {}],

    ["briller", "Briller", "ansikt", 40, "briller", {}],
    ["briller-rod", "Røde briller", "ansikt", 45, "briller", { f: "#d32f2f" }],
    ["bart", "Tullebart", "ansikt", 60, "bart", {}],
    ["solbriller", "Solbriller", "ansikt", 80, "sol", {}],
    ["stjernebriller", "Stjernebriller", "ansikt", 140, "stjerne", {}],
    ["heltemaske", "Heltemaske", "ansikt", 160, "maske", { f: "#212121" }],

    ["ballong", "Ballong", "hand", 30, "ballong", { f: "#ff4081" }],
    ["is", "Iskrem", "hand", 40, "is", {}],
    ["flagg", "Norsk flagg", "hand", 50, "flagg", {}],
    ["fotball", "Fotball", "hand", 60, "fotball", {}],
    ["mikrofon", "Mikrofon", "hand", 120, "mikrofon", {}],
    ["tryllestav", "Tryllestav", "hand", 280, "stav", {}],
    ["gitar", "Gitar", "hand", 320, "gitar", {}],
    ["sverd", "Sverd", "hand", 350, "sverd", {}],
    ["lyssverd", "Lyssverd", "hand", 600, "lys", { f: "#00e5ff" }],
    ["pokal", "Gullpokal", "hand", 1000, "pokal", {}],

    ["ryggsekk", "Ryggsekk", "rygg", 90, "sekk", { f: "#ef6c00" }],
    ["kappe-rod", "Rød kappe", "rygg", 250, "kappe", { f: "#c62828" }],
    ["kappe-lilla", "Lilla kappe", "rygg", 250, "kappe", { f: "#6a1b9a" }],
    ["sommerfugl", "Sommerfuglvinger", "rygg", 550, "sommerfugl", {}],
    ["engelvinger", "Engelvinger", "rygg", 700, "engel", {}],
    ["dragevinger", "Dragevinger", "rygg", 900, "drage", {}],
    ["jetpack", "Jetpack", "rygg", 1100, "jetpack", {}],

    ["kanin", "Kanin", "venn", 300, "kanin", {}],
    ["katt", "Katt", "venn", 350, "katt", { f: "#ff9800" }],
    ["katt-svart", "Svart katt", "venn", 350, "katt", { f: "#37474f" }],
    ["hund", "Hund", "venn", 350, "hund", { f: "#c49a6c" }],
    ["pingvin", "Pingvin", "venn", 450, "pingvin", {}],
    ["ugle", "Ugle", "venn", 450, "ugle", {}],
    ["robot", "Robot", "venn", 800, "robot", {}],
    ["drage", "Liten drage", "venn", 1400, "drage", {}],
    ["enhjorning", "Enhjørning", "venn", 2500, "enhjorning", {}],

    ["bg-himmel", "Blå himmel", "bakgrunn", 60, "himmel", {}],
    ["bg-skog", "Skogen", "bakgrunn", 100, "skog", {}],
    ["bg-strand", "Stranda", "bakgrunn", 150, "strand", {}],
    ["bg-fotball", "Fotballbanen", "bakgrunn", 150, "fotball", {}],
    ["bg-hav", "Under vann", "bakgrunn", 250, "hav", {}],
    ["bg-by", "Byen om natta", "bakgrunn", 300, "by", {}],
    ["bg-scene", "Konsertscenen", "bakgrunn", 400, "scene", {}],
    ["bg-slott", "Slottet", "bakgrunn", 600, "slott", {}],
    ["bg-rom", "Verdensrommet", "bakgrunn", 800, "rom", {}],
    ["bg-regnbue", "Regnbuen", "bakgrunn", 900, "regnbue", {}],
    ["bg-skatt", "Skattkammeret", "bakgrunn", 2000, "skatt", {}],

    ["har-rosa", "Rosa hår", "harfarge", 120, "farge", { f: "#ff7eb6" }],
    ["har-bla", "Blått hår", "harfarge", 120, "farge", { f: "#3f7fe0" }],
    ["har-gronn", "Grønt hår", "harfarge", 120, "farge", { f: "#2fae6a" }],
    ["har-lilla", "Lilla hår", "harfarge", 120, "farge", { f: "#8e5bd6" }],
    ["har-solv", "Sølvhår", "harfarge", 200, "farge", { f: "#cfd6dd" }],
    ["har-gull", "Gullhår", "harfarge", 1000, "farge", { f: "#f2c230" }],
    ["har-regnbue", "Regnbuehår", "harfarge", 1500, "farge", { f: "regnbue" }],

    /* Eksklusive ting: kan ikke kjøpes, låses opp med mestringsmerker (se MERKER under) */
    ["saksofon", "Gullsaksofon", "hand", 0, "sax", { merke: "bla-mester" }],
    ["pizza", "Pizzastykke", "hand", 0, "pizza", { merke: "brok-mester" }],
    ["frosk", "Gangefrosken", "venn", 0, "frosk", { merke: "gange-lille" }],
    ["hammer", "Snekkerhammer", "hand", 0, "hammer", { merke: "regne-mester" }],
    ["kjeks", "Kjempekjeks", "hand", 0, "kjeks", { merke: "dele-mester" }],
    ["narrelue", "Dobbel narrelue", "hode", 0, "narr", { merke: "dobbel-mester" }],
    ["troll", "Snilt troll", "venn", 0, "troll", { merke: "eventyr-mester" }],
    ["vifte", "Spansk vifte", "hand", 0, "vifte", { merke: "spansk-gloser" }],
    ["bg-solnedgang", "Spansk solnedgang", "bakgrunn", 0, "solnedgang", { merke: "spansk-verb" }],
    ["flosshatt", "Flosshatt", "hode", 0, "floss", { merke: "engelsk-gloser" }],
    ["napoleonshatt", "Napoleonshatt", "hode", 0, "napoleon", { merke: "revolusjon" }],
    ["bg-tidsportal", "Tidsportalen", "bakgrunn", 0, "portal", { merke: "tidsreisen" }],
    ["stjernekappe", "Stjernekappe", "rygg", 0, "kappe", { f: "#1a237e", m: "stjerner", merke: "fortellingsreisen" }],
    ["regnbuecaps", "Regnbuecaps", "hode", 0, "regnbuecaps", { merke: "allsidig" }],
    ["comebackgenser", "Comeback-genser", "overdel", 0, "genser", { f: "#00897b", m: "comeback", merke: "comeback" }],
    ["rev", "Oppdragsreven", "venn", 0, "rev", { merke: "oppdrag" }],
    ["gullfisk", "Gullfisken", "venn", 0, "gullfisk", { merke: "gullgraver" }],
  ];
  /* MERKER: [id, navn, ikon, spill (filnavn uten .html, null = på tvers), krav (vises for barnet), ting] */
  const MERKER = [
    ["bla-mester", "Blåtonemester", "🎷", ["blaa-tonar", "blaa-tonar-nynorsk"], "Minst 90 % riktig på en quiz med minst 20 spørsmål fra alle temaene", "saksofon"],
    ["brok-mester", "Brøkmester", "🍕", ["brokmester"], "Nå nivå 4 eller høyere i alle de 12 brøktemaene", "pizza"],
    ["gange-lille", "Gangemester", "🐸", ["gangestien"], "Mestre alle stykkene i den lille gangetabellen, så hele gangekartet blir fylt", "frosk"],
    ["regne-mester", "Verkstedmester", "🧮", ["regneverkstedet"], "Få tre stjerner i Oppstilling på 3-sifret med mente og lån, både i pluss og minus", "hammer"],
    ["dele-mester", "Delemester", "🍪", ["delefabrikken"], "Få tre stjerner i hoderegning på Blanding, med både små og store tall", "kjeks"],
    ["dobbel-mester", "Dobbeltmester", "✌️", ["dobbel-konsonant"], "Få stjerne på minst 8 av 10 ord, eller minst 90 % på prøveprøven", "narrelue"],
    ["eventyr-mester", "Eventyrmester", "🏰", ["eventyrproven"], "Fullfør alle fire stasjonene i alle tre eventyrene", "troll"],
    ["spansk-gloser", "Glosemester på spansk", "💃", ["spansk-gloser"], "Minst 90 % på prøveprøven, eller få alle glosene i én gloseprøve til å sitte", "vifte"],
    ["spansk-verb", "Verbmester", "🗣️", ["spansk-ar-verb"], "Minst 90 % på prøveprøven, eller få alle 15 verbene og alle 6 endingene til å sitte", "bg-solnedgang"],
    ["engelsk-gloser", "Glosemester på engelsk", "🌍", ["engelsk-gloser"], "Minst 90 % på prøveprøven, eller få alle glosene i én gloseprøve til å sitte", "flosshatt"],
    ["revolusjon", "Revolusjonsekspert", "⚖️", ["revolusjon"], "Minst 90 % på prøveprøven, enten i «Alt sammen» eller i hver av de tre delene", "napoleonshatt"],
    ["tidsreisen", "Tidsreisende", "🦉", ["tidsreisen"], "Fullfør alle kapitlene i Tidsreisen", "bg-tidsportal"],
    ["fortellingsreisen", "Fortellingsvokter", "📖", ["fortellingsreisen"], "Fullfør alle fem fortellingene og epilogen, eller samle alle symbolkortene", "stjernekappe"],
    ["allsidig", "Allsidig", "🌈", null, "Tjen gull i fem ulike spill", "regnbuecaps"],
    ["comeback", "Comeback-helt", "🔁", null, "Få 10 feil til å sitte i Feilsamleren", "comebackgenser"],
    ["oppdrag", "Oppdragsjeger", "🎯", null, "Fullfør alle dagens oppdrag på fem forskjellige dager", "rev"],
    ["gullgraver", "Gullgraver", "💰", null, "Tjen 1000 gull til sammen", "gullfisk"],
  ].map(([id, navn, ikon, spill, krav, ting]) => ({ id, navn, ikon, spill, krav, ting }));
  const MERKE_ID = {}; MERKER.forEach(m => { MERKE_ID[m.id] = m; });
  const KATALOG = K.map(([id, navn, slot, pris, t, e]) => Object.assign({ id, navn, slot, pris, t }, e));
  const ITEM = {}; KATALOG.forEach(it => { ITEM[it.id] = it; });
  const NIVAER = [[0, "Gratis", "#78909c"], [1, "Vanlig", "#607d8b"], [50, "Fin", "#2e7d32"], [200, "Sjelden", "#1565c0"], [600, "Episk", "#7b1fa2"], [1200, "Legendarisk", "#e65100"]];
  function nivaaTing(it) { return it && it.merke ? { navn: "Merke", farge: "#ad1457" } : nivaa(it ? it.pris : 0); }
  function nivaa(pris) { let n = NIVAER[0]; NIVAER.forEach(x => { if (pris >= x[0]) n = x; }); return { navn: n[1], farge: n[2] }; }

  /* ---------- tegn hele avataren ---------- */
  let uid = 0;
  function tegn(st, o) {
    o = Object.assign({ bakgrunn: true, venn: true, vb: "0 0 240 260", prov: null, klasse: "" }, o || {});
    [B1, B2] = o.jubel ? JUBELHENDER : HENDER;
    try { return tegnKropp(st, o); } finally { [B1, B2] = HENDER; }
  }
  function tegnKropp(st, o) {
    st = st || S;
    const p = Object.assign(standardPaa(st.kjonn), st.paa || {});
    if (o.prov) { const it = ITEM[o.prov]; if (it) p[it.slot] = it.id; }
    if (o.uten) delete p[o.uten];
    const ut = Object.assign({ hud: 1, har: "kort", harfarge: 1, oyne: 0 }, st.ut || {});
    const c = { id: "gv" + (++uid) + "x" };
    const hud = HUD[ut.hud] || HUD[1], hudM = mix(hud, -.14);
    let harF = (HARFARGE[ut.harfarge] || HARFARGE[1])[1];
    const hf = ITEM[p.harfarge];
    let defs = `<clipPath id="${c.id}t"><path d="${TORSO}"/></clipPath>`;
    if (hf && hf.f === "regnbue") {
      defs += `<linearGradient id="${c.id}rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5252"/><stop offset=".25" stop-color="#ffd740"/><stop offset=".5" stop-color="#69f0ae"/><stop offset=".75" stop-color="#40c4ff"/><stop offset="1" stop-color="#e040fb"/></linearGradient>`;
      harF = `url(#${c.id}rb)`;
    } else if (hf) harF = hf.f;
    const harKant = harF.startsWith("url") ? "rgba(0,0,0,.18)" : mix(harF, -.25);
    const g = (slot, tabell) => { const it = ITEM[p[slot]]; return it && tabell[it.t] ? tabell[it.t](it, c) : ""; };
    const har = HAR[ut.har] || HAR.kort;
    const harG = s => s ? `<g fill="${harF}" stroke="${harKant}" stroke-width="1.2">${s}</g>` : "";
    const rygg = ITEM[p.rygg] && RYGG[ITEM[p.rygg].t] ? RYGG[ITEM[p.rygg].t](ITEM[p.rygg], c) : {};
    const iris = (OYNE[ut.oyne] || OYNE[0])[1];
    const oye = x => `<ellipse cx="${x}" cy="84" rx="6.5" ry="7.5" fill="#fff"/><circle cx="${x}" cy="85" r="4.6" fill="${iris}"/><circle cx="${x}" cy="85" r="2.3" fill="#1a1a1a"/><circle cx="${x + 1.6}" cy="82.6" r="1.4" fill="#fff"/>`;
    const L = [];
    if (o.bakgrunn) { const b = ITEM[p.bakgrunn]; L.push((b ? BG[b.t] : BG.std)(c)); }
    L.push(`<ellipse cx="120" cy="241" rx="52" ry="6" fill="#000" opacity=".13"/>`);
    L.push(rygg.bak || "");
    L.push(harG(har.bak));
    L.push(`<rect x="100" y="176" width="16" height="52" rx="5" fill="${hud}"/><rect x="124" y="176" width="16" height="52" rx="5" fill="${hud}"/>`);
    L.push(g("underdel", UNDERDEL));
    L.push(g("sko", SKO));
    L.push(`<rect x="113" y="106" width="14" height="22" fill="${hudM}"/>` + erme(hud, 1, 14) + `<circle cx="${B1[0]}" cy="${B1[1]}" r="8" fill="${hud}"/><circle cx="${B2[0]}" cy="${B2[1]}" r="8" fill="${hud}"/>`);
    L.push(g("overdel", OVERDEL));
    L.push(rygg.fram || "");
    L.push(`<circle cx="83" cy="86" r="7" fill="${hud}"/><circle cx="157" cy="86" r="7" fill="${hud}"/><ellipse cx="120" cy="78" rx="38" ry="39" fill="${hud}"/>`);
    L.push(oye(106) + oye(134));
    if (st.kjonn === "jente") L.push(`<path d="M100 79L95.5 76M101.5 77L98.5 73M140 79L144.5 76M138.5 77L141.5 73" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>`);
    L.push(`<path d="M98 73Q106 69 113 73M127 73Q134 69 142 73" stroke="${harKant}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`);
    L.push(`<path d="M118 92Q120 95 122 92" stroke="${mix(hud, -.3)}" stroke-width="2" fill="none" stroke-linecap="round"/>`);
    L.push(o.jubel ? `<path d="M108 98Q120 116 132 98Z" fill="#8a3b30"/><path d="M113 104Q120 110 127 104" fill="#ff8a8a"/>`
      : `<path d="M110 100Q120 109 130 100" stroke="#7a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    L.push(`<circle cx="96" cy="97" r="6" fill="#ff7a7a" opacity=".28"/><circle cx="144" cy="97" r="6" fill="#ff7a7a" opacity=".28"/>`);
    L.push(harG(har.fram));
    L.push(g("ansikt", ANSIKT));
    L.push(g("hode", HODE));
    const h = g("hand", HAND);
    if (h) L.push(`<g transform="translate(${B2[0] - 160} ${B2[1] - 178})">${h}<circle cx="160" cy="178" r="8" fill="${hud}"/></g>`);
    if (o.venn) L.push(g("venn", VENN));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb}" class="${o.klasse}" role="img" aria-label="Avatar"><defs>${defs}</defs>${L.join("")}</svg>`;
  }
  const UTSNITT = {
    overdel: "40 96 160 150", underdel: "60 150 120 100", sko: "80 196 80 54", hode: "40 -8 160 140", ansikt: "70 50 100 76",
    hand: "100 40 120 200", rygg: "0 80 240 180", venn: "0 160 100 90", bakgrunn: "0 0 240 260", harfarge: "40 10 160 160",
  };
  function tegnTing(id, st) {
    const it = ITEM[id]; if (!it) return "";
    return tegn(st || S, { prov: id, vb: UTSNITT[it.slot], bakgrunn: it.slot === "bakgrunn", venn: it.slot === "venn" });
  }

  /* ==========================================================
     GULLMERKET i hjørnet, «+1»-sprett og meldinger
     ========================================================== */
  const CSS = `
.gm-mynt{display:inline-block;width:1.05em;height:1.05em;border-radius:50%;vertical-align:-.15em;flex:none;
  background:radial-gradient(circle at 35% 35%,#fff1b8,#f2c230 55%,#a87a12);box-shadow:0 0 0 1.5px #8a6410 inset}
.gm-merke{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:9000;
  display:flex;align-items:center;gap:7px;height:42px;padding:0 14px 0 4px;border-radius:999px;background:#1f1a12;color:#ffd75e;
  border:2px solid #e6b44a;box-shadow:0 3px 12px rgba(0,0,0,.28);text-decoration:none;
  font:800 17px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-tap-highlight-color:transparent}
.gm-merke:hover{transform:translateY(-1px)}
.gm-merke:focus-visible{outline:3px solid #ffd75e;outline-offset:2px}
.gm-ava{width:32px;height:32px;border-radius:50%;overflow:hidden;background:#3a3326;flex:none;display:grid;place-items:center;font-size:18px}
.gm-ava svg{width:100%;height:100%;display:block}
.gm-lag{font-size:13px;font-weight:700;color:#f6e7bf}
.gm-dunk{animation:gm-dunk .45s ease-out}
@keyframes gm-dunk{0%{transform:scale(1)}35%{transform:scale(1.14)}100%{transform:scale(1)}}
.gm-pop{position:fixed;z-index:9001;pointer-events:none;font:900 20px/1 system-ui,-apple-system,"Segoe UI",sans-serif;color:#f2b705;
  text-shadow:0 1px 0 #7a5a00,0 0 6px rgba(0,0,0,.25);animation:gm-opp 1.1s ease-out forwards}
@keyframes gm-opp{0%{opacity:0;transform:translateY(6px) scale(.8)}15%{opacity:1;transform:translateY(0) scale(1.1)}100%{opacity:0;transform:translateY(-46px) scale(1)}}
.gm-melding{position:fixed;z-index:9002;left:50%;top:max(14px,env(safe-area-inset-top,0px));transform:translate(-50%,-140%);max-width:min(92vw,440px);
  padding:12px 18px;border-radius:14px;background:#1f1a12;color:#fff5d6;border:2px solid #e6b44a;box-shadow:0 6px 24px rgba(0,0,0,.3);
  font:700 16px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;transition:transform .35s ease}
.gm-melding.gm-vis{transform:translate(-50%,0)}
.gm-melding.stor{font-size:18px;color:#ffd75e}
.gm-jubel{position:fixed;z-index:9003;left:max(8px,env(safe-area-inset-left,0px));bottom:calc(max(12px,env(safe-area-inset-bottom,0px)) + 46px);
  display:flex;align-items:flex-end;gap:2px;cursor:pointer;transform:translateY(170%);opacity:0;pointer-events:none;
  transition:transform .5s cubic-bezier(.2,1.35,.4,1),opacity .3s}
.gm-jubel.uten-merke{bottom:max(10px,env(safe-area-inset-bottom,0px))}
.gm-jubel.gm-vis{transform:translateY(0);opacity:1;pointer-events:auto}
.gm-jubel-ava{width:96px;height:124px;flex:none;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))}
.gm-jubel-ava svg{width:100%;height:100%;display:block;overflow:visible}
.gm-jubel.gm-vis .gm-jubel-ava{animation:gm-hopp .55s .4s 2 ease-in-out}
@keyframes gm-hopp{0%,100%{transform:translateY(0)}45%{transform:translateY(-16px)}}
.gm-boble{position:relative;margin:0 0 74px 8px;max-width:min(64vw,250px);background:#fffdf5;color:#1f1a12;border:2.5px solid #e6b44a;border-radius:16px;
  padding:9px 13px;font:700 15px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.22)}
.gm-boble::before{content:"";position:absolute;left:-12px;bottom:14px;border:9px solid transparent;border-right-color:#e6b44a;border-left:0}
.gm-boble::after{content:"";position:absolute;left:-8px;bottom:16px;border:7px solid transparent;border-right-color:#fffdf5;border-left:0}
@media (prefers-reduced-motion:reduce){.gm-pop,.gm-dunk,.gm-jubel.gm-vis .gm-jubel-ava{animation:none}.gm-melding,.gm-jubel{transition:none}}
@media print{.gm-merke,.gm-pop,.gm-melding,.gm-jubel{display:none!important}}`;
  try { const st = document.createElement("style"); st.textContent = CSS; (document.head || document.documentElement).appendChild(st); } catch (e) {}

  let merkeEl = null;
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function lagMerke() {
    if (!MERKE || merkeEl || !document.body) return;
    merkeEl = document.createElement("a");
    merkeEl.className = "gm-merke";
    merkeEl.href = ROT + "avatar.html";
    document.body.appendChild(merkeEl);
    const luft = document.createElement("div"); luft.style.height = "64px"; luft.setAttribute("aria-hidden", "true");
    document.body.appendChild(luft);
    oppdaterMerke();
  }
  function oppdaterMerke() {
    if (!merkeEl) return;
    const hode = S.laget ? tegn(S, { bakgrunn: false, venn: false, vb: "72 30 96 96" }) : "✨";
    merkeEl.innerHTML = `<span class="gm-ava">${hode}</span><span class="gm-mynt" aria-hidden="true"></span><span>${S.gull}</span>${S.laget ? "" : '<span class="gm-lag">Lag avatar</span>'}`;
    merkeEl.setAttribute("aria-label", `Du har ${S.gull} gull. ${S.laget ? "Gå til avataren din" : "Lag avataren din"}`);
  }
  function dunk() { const m = merkeEl || document.querySelector("[data-gull-pung]"); if (!m) return; m.classList.remove("gm-dunk"); void m.offsetWidth; m.classList.add("gm-dunk"); }
  function pop(n) {
    dunk();
    const anker = merkeEl || document.querySelector("[data-gull-pung]");
    const e = document.createElement("div");
    e.className = "gm-pop"; e.textContent = "+" + n;
    if (anker) { const r = anker.getBoundingClientRect(); e.style.left = (r.left + r.width / 2 + 6) + "px"; e.style.top = (r.top - 18) + "px"; }
    else { e.style.right = "24px"; e.style.top = "60px"; }
    document.body.appendChild(e); setTimeout(() => e.remove(), 1200);
  }
  let meldT = null, meldEl = null;
  function melding(tekst, stor) {
    if (!document.body) return;
    if (!meldEl) { meldEl = document.createElement("div"); meldEl.className = "gm-melding"; meldEl.setAttribute("role", "status"); document.body.appendChild(meldEl); }
    meldEl.innerHTML = (stor ? '<span class="gm-mynt" aria-hidden="true"></span> ' : "") + esc(tekst);
    meldEl.classList.toggle("stor", !!stor);
    requestAnimationFrame(() => meldEl.classList.add("gm-vis"));
    clearTimeout(meldT); meldT = setTimeout(() => meldEl.classList.remove("gm-vis"), 3200);
  }

  /* ---------- avataren jubler ---------- */
  let jubelEl = null, jubelT = null;
  function jubel(tekst, o) {
    o = o || {};
    if (!document.body || !S.laget) return;
    if (!jubelEl) {
      jubelEl = document.createElement("div");
      jubelEl.className = "gm-jubel" + (merkeEl ? "" : " uten-merke");
      jubelEl.setAttribute("role", "status"); jubelEl.setAttribute("aria-live", "polite");
      jubelEl.addEventListener("click", () => jubelEl.classList.remove("gm-vis"));
      document.body.appendChild(jubelEl);
    }
    jubelEl.innerHTML = `<div class="gm-jubel-ava">${tegn(S, { bakgrunn: false, venn: false, jubel: true, vb: "40 20 160 230" })}</div><div class="gm-boble">${esc(tekst)}</div>`;
    jubelEl.classList.remove("gm-vis"); void jubelEl.offsetWidth; jubelEl.classList.add("gm-vis");
    clearTimeout(jubelT); jubelT = setTimeout(() => jubelEl.classList.remove("gm-vis"), o.lang ? 5500 : 3600);
  }

  function start() { lagMerke(); lastSpillListe(); }
  if (document.readyState !== "loading") start(); else document.addEventListener("DOMContentLoaded", start);
  window.addEventListener("storage", e => { if (e.key === KEY) { S = les(); varsle(); } });
  window.addEventListener("pageshow", () => { S = les(); varsle(); });

  window.Gull = {
    tjen, bonus, saldo: () => (S = les()).gull, tilstand: () => (S = les()),
    kjop, taPaa, taAv, eier, lagBruker, endre, eksport, importKode, slett, onEndring: f => lyttere.push(f),
    tegn, tegnTing, mix, esc, nivaa, melding,
    KATALOG, ITEM, PLASSER, PAKREVD, HAR, HUD, HARFARGE, OYNE, DAGSTAK, STARTGAVE, ROT, idag,
    feil, riktig, repeter, feilListe, merke, MERKER, MERKE_ID, nivaaTing, jubel,
    prover, provebonus, leggTilProve, fjernProve, settTrinn, passer, filKey, dagerTil,
    oppdrag: () => { sikreOppdrag(); S = les(); return S.oppdrag && S.oppdrag.d === idag() ? S.oppdrag : null; }, framdrift,
  };
})();
