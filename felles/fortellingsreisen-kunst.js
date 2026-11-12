/* ==========================================================================
   FORTELLINGSREISEN – tegningene (SVG). Verden er 800 × 450.
   Bygger på tidsreisen-kunst.js (KUNST.person m.m.) og legger til egne figurer,
   ting og bakgrunner. Lastes ETTER tidsreisen-kunst.js.

   Viktig: I islam lager man vanligvis ikke bilder av Gud, profetene eller englene.
   Derfor har kapittel 3 ingen figurer av Muhammad, Ibrahim, Hajar, Ismail eller Jibril –
   de vises bare som lys og fortelling. Gud vises ikke i noen kapitler.
   ========================================================================== */
(function () {
  "use strict";
  const K = window.KUNST; if (!K) return;
  const person = K.person, mix = K.mix;

  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const srand = s => { seed = s; };
  const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="450" fill="url(#${id})"/>`;
  const hy = -168; // hodets midtpunkt i person()

  /* ---------- hodeplagg og pynt som legges oppå person() ---------- */
  const PY = {
    kippa: c => `<path d="M-13 ${hy - 20} Q0 ${hy - 30} 13 ${hy - 20} Q0 ${hy - 17} -13 ${hy - 20} Z" fill="${c || "#1f3d7a"}"/><path d="M-9 ${hy - 22} Q0 ${hy - 27} 9 ${hy - 22}" stroke="#e3b53a" stroke-width="1.4" fill="none"/>`,
    kufi: c => `<path d="M-19 ${hy - 12} Q-20 ${hy - 32} 0 ${hy - 32} Q20 ${hy - 32} 19 ${hy - 12} Z" fill="${c || "#fbfaf5"}"/><path d="M-18 ${hy - 18} H18 M-16 ${hy - 25} H16" stroke="#d8d0c0" stroke-width="1.4"/>`,
    hodeduk: (c, band) => `<path d="M-27 ${hy + 32} Q-31 ${hy - 32} 0 ${hy - 33} Q31 ${hy - 32} 27 ${hy + 32} L19 ${hy + 32} Q23 ${hy - 14} 0 ${hy - 17} Q-23 ${hy - 14} -19 ${hy + 32} Z" fill="${c}"/>`
      + (band ? `<path d="M-23 ${hy - 14} Q0 ${hy - 24} 23 ${hy - 14}" stroke="${band}" stroke-width="4" fill="none"/>` : ""),
    hijab: c => `<path fill-rule="evenodd" fill="${c}" d="M-28 ${hy + 36} Q-33 ${hy - 33} 0 ${hy - 33} Q33 ${hy - 33} 28 ${hy + 36} Q0 ${hy + 46} -28 ${hy + 36} Z M-17 ${hy + 1} a17 20 0 1 0 34 0 a17 20 0 1 0 -34 0 Z"/>`,
    turban: c => `<path d="M-23 ${hy - 6} Q-27 ${hy - 38} 0 ${hy - 40} Q27 ${hy - 38} 23 ${hy - 6} Q12 ${hy - 15} 0 ${hy - 14} Q-12 ${hy - 15} -23 ${hy - 6} Z" fill="${c}"/>
      <path d="M-21 ${hy - 18} Q0 ${hy - 36} 21 ${hy - 22} M-22 ${hy - 10} Q0 ${hy - 28} 22 ${hy - 12}" stroke="${mix(c, -.2)}" stroke-width="2" fill="none"/>`,
    juvelturban: c => PY.turban(c) + `<circle cx="0" cy="${hy - 26}" r="4.5" fill="#c0392b" stroke="#e3b53a" stroke-width="2"/><path d="M0 ${hy - 30} q6 -18 14 -20" stroke="#fff" stroke-width="3" fill="none"/>`,
    mukut: (s) => `<g transform="translate(0 ${hy - 16}) scale(${s || 1})"><path d="M-17 0 L-15 -24 Q0 -60 15 -24 L17 0 Z" fill="#e3b53a" stroke="#a8811c" stroke-width="1.5"/>
      <circle cx="0" cy="-18" r="4" fill="#c0392b"/><circle cx="-9" cy="-8" r="2.4" fill="#2e7d32"/><circle cx="9" cy="-8" r="2.4" fill="#2e7d32"/><path d="M-15 -4 H15" stroke="#a8811c" stroke-width="2"/><circle cx="0" cy="-50" r="3" fill="#fff3b0"/></g>`,
    diadem: () => `<path d="M-19 ${hy - 14} Q0 ${hy - 24} 19 ${hy - 14}" stroke="#e3b53a" stroke-width="3.5" fill="none"/><circle cx="0" cy="${hy - 19}" r="3.4" fill="#c0392b" stroke="#e3b53a" stroke-width="1.5"/>`,
    bindi: () => `<circle cx="0" cy="${hy - 10}" r="2.3" fill="#c0392b"/>`,
    nemes: () => `<path d="M-24 ${hy - 12} Q0 ${hy - 38} 24 ${hy - 12} L34 ${hy + 36} L21 ${hy + 36} L20 ${hy + 2} L-20 ${hy + 2} L-21 ${hy + 36} L-34 ${hy + 36} Z" fill="#e3b53a"/>
      <path d="M-26 ${hy + 4} L-31 ${hy + 34} M26 ${hy + 4} L31 ${hy + 34} M-23 ${hy - 6} L-27 ${hy + 20} M23 ${hy - 6} L27 ${hy + 20} M-16 ${hy - 22} Q0 ${hy - 30} 16 ${hy - 22}" stroke="#1f4fa0" stroke-width="3" fill="none"/>
      <path d="M-4 ${hy - 26} q4 -8 8 0 q-4 4 -8 0" fill="#2e7d32"/><path d="M-4 ${hy + 22} L4 ${hy + 22} L2 ${hy + 40} L-2 ${hy + 40} Z" fill="#3a2a10"/>`,
    egyptkrage: () => `<path d="M-24 -144 Q0 -112 24 -144 Q0 -128 -24 -144 Z" fill="#e3b53a"/><path d="M-20 -140 Q0 -120 20 -140" stroke="#1f6fb5" stroke-width="3" fill="none"/><path d="M-16 -136 Q0 -122 16 -136" stroke="#c0392b" stroke-width="2.5" fill="none"/>`,
    glorie: () => `<circle cx="0" cy="${hy - 2}" r="34" fill="#fff3b0" opacity=".45"/><circle cx="0" cy="${hy - 2}" r="34" fill="none" stroke="#ffd54a" stroke-width="3"/>`,
    vinger: () => `<path d="M-14 -140 Q-90 -190 -96 -110 Q-70 -120 -60 -96 Q-40 -110 -22 -100 Z" fill="#fbfaf5" stroke="#d8d0c0" stroke-width="1.5"/><path d="M14 -140 Q90 -190 96 -110 Q70 -120 60 -96 Q40 -110 22 -100 Z" fill="#fbfaf5" stroke="#d8d0c0" stroke-width="1.5"/>
      <path d="M-30 -136 Q-70 -160 -82 -124 M30 -136 Q70 -160 82 -124" stroke="#e0d8c8" stroke-width="2" fill="none"/>`,
    sjal: c => `<path d="M-24 -142 Q4 -124 22 -96 L12 -92 Q-6 -116 -24 -130 Z" fill="${c}"/>`,
    pipekrage: () => `<ellipse cx="0" cy="-146" rx="27" ry="9" fill="#fff" stroke="#cfcfcf" stroke-width="1.2"/><path d="M-20 -150 v8 M-12 -153 v10 M-4 -154 v10 M4 -154 v10 M12 -153 v10 M20 -150 v8" stroke="#dcdcdc" stroke-width="1.4"/>`,
    stav: () => `<path d="M42 -2 L36 -206" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/>`,
    hyrdestav: () => `<path d="M42 -2 L38 -196 Q38 -218 24 -214 Q14 -210 18 -198" stroke="#7a5230" stroke-width="5" stroke-linecap="round" fill="none"/>`,
    bue: () => `<path d="M44 -40 Q76 -110 44 -180" stroke="#7a4a1a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M44 -40 L44 -180" stroke="#f4f1ea" stroke-width="1.2"/><path d="M24 -88 L62 -122" stroke="#5a3a1a" stroke-width="2.5"/><path d="M62 -122 l-8 0 l4 -6 Z" fill="#999"/>`,
    gave: c => `<rect x="24" y="-100" width="26" height="22" rx="3" fill="${c || "#c9a227"}" stroke="#7a5a10" stroke-width="1.5"/><rect x="22" y="-104" width="30" height="6" rx="2" fill="${mix(c || "#c9a227", -.15)}"/><circle cx="37" cy="-108" r="3" fill="#c0392b"/>`,
    skaal: c => `<path d="M22 -92 Q38 -70 54 -92 Z" fill="${c || "#8a5a2a"}"/><ellipse cx="38" cy="-92" rx="16" ry="4" fill="${mix(c || "#8a5a2a", .3)}"/>`,
    gada: () => `<path d="M-38 -82 L-46 -150" stroke="#a8811c" stroke-width="5" stroke-linecap="round"/><circle cx="-47" cy="-160" r="13" fill="#e3b53a" stroke="#a8811c" stroke-width="2"/><path d="M-47 -173 v-6" stroke="#a8811c" stroke-width="3"/>`,
    harknute: c => `<ellipse cx="0" cy="${hy - 28}" rx="9" ry="8" fill="${c}"/>`,
    sverd: () => `<path d="M-30 -70 L-50 -14" stroke="#c8c8c8" stroke-width="3.5" stroke-linecap="round"/><path d="M-37 -78 L-23 -64" stroke="#8a6a2a" stroke-width="4" stroke-linecap="round"/>`,
    bandasje: () => `<path d="M-22 ${hy - 10} Q0 ${hy - 20} 22 ${hy - 10}" stroke="#fff" stroke-width="7" fill="none"/><path d="M14 ${hy - 14} l6 -2" stroke="#c0392b" stroke-width="2"/>`,
    briller: () => `<g stroke="#2a2a2a" stroke-width="2" fill="none"><rect x="-15" y="${hy - 7}" width="12" height="10" rx="3"/><rect x="3" y="${hy - 7}" width="12" height="10" rx="3"/><path d="M-3 ${hy - 3} L3 ${hy - 3}"/></g>`,
    flette: c => `<path d="M16 ${hy + 4} Q26 ${hy + 30} 18 ${hy + 56}" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="18" cy="${hy + 60}" r="3" fill="#c0392b"/>`,
  };
  /* P: tegner en person med pynt foran og bak, skalert samlet */
  function P(o, foran, bak) {
    const sk = o.skala || 1;
    return `<g transform="scale(${sk})">${bak || ""}${person(Object.assign({}, o, { skala: 1 }))}${foran || ""}</g>`;
  }
  const MOTE = { hud: "#f1c7a3", sko: "#f4f4f4", strompe: "#3a5a8a", bukse: "#3a5a8a" };   // moderne klær
  const OST = "#c99a72", OST2 = "#b98a62", SOR = "#a8754a", SOR2 = "#c98a5a";              // hudfarger

  /* ======================================================================
     FIGURER
     ====================================================================== */
  function lumi(o) {
    o = o || {};
    return `<g><ellipse cx="0" cy="0" rx="18" ry="4" fill="#000" opacity=".14"/>
      <g class="svev"><g transform="translate(0 -34)">
      <circle cx="0" cy="-48" r="44" fill="#ffd54a" opacity="${o.matt ? .06 : .2}"/>
      <path d="M-10 -96 Q0 -112 10 -96" stroke="#8a6320" stroke-width="4" fill="none"/>
      <rect x="-22" y="-96" width="44" height="9" rx="3" fill="#b0832f"/>
      <rect x="-19" y="-87" width="38" height="58" rx="7" fill="${o.matt ? "#e8e0c8" : "#fff3c4"}" stroke="#b0832f" stroke-width="4"/>
      <path d="M0 -33 q-9 -10 0 -21 q9 11 0 21" fill="${o.matt ? "#c8a050" : "#ffb300"}"/><path d="M0 -35 q-4 -5 0 -10 q4 5 0 10" fill="#fff3b0"/>
      <ellipse cx="-7" cy="-66" rx="3" ry="${o.blunk ? .8 : 4}" fill="#3a2a10"/><ellipse cx="7" cy="-66" rx="3" ry="4" fill="#3a2a10"/>
      <path d="M-6 -56 Q0 -51 6 -56" stroke="#3a2a10" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="-12" cy="-58" r="3" fill="#ff8a8a" opacity=".45"/><circle cx="12" cy="-58" r="3" fill="#ff8a8a" opacity=".45"/>
      <rect x="-23" y="-31" width="46" height="9" rx="3" fill="#b0832f"/></g></g></g>`;
  }
  function glupsk(o) {
    o = o || {};
    const g = o.snill ? "#8bc34a" : "#7cb342", gm = mix(g, -.25);
    const seg = [[-46, -10, 12], [-34, -16, 13], [-22, -26, 14], [-10, -38, 15], [0, -52, 16]];
    return `<g><ellipse cx="-12" cy="0" rx="46" ry="5" fill="#000" opacity=".14"/>
      ${seg.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${g}" stroke="${gm}" stroke-width="2"/>`).join("")}
      <circle cx="8" cy="-76" r="23" fill="${mix(g, .1)}" stroke="${gm}" stroke-width="2"/>
      <path d="M0 -98 q-6 -14 -14 -14 M16 -98 q6 -14 14 -14" stroke="${gm}" stroke-width="3" fill="none"/><circle cx="-14" cy="-112" r="4" fill="#e3b53a"/><circle cx="30" cy="-112" r="4" fill="#e3b53a"/>
      <circle cx="0" cy="-80" r="7" fill="#fff" stroke="#3a2a10" stroke-width="2.4"/><circle cx="17" cy="-80" r="7" fill="#fff" stroke="#3a2a10" stroke-width="2.4"/><path d="M7 -80 h3" stroke="#3a2a10" stroke-width="2.4"/>
      <circle cx="${o.lur ? 2 : 1}" cy="-79" r="2.6" fill="#222"/><circle cx="${o.lur ? 19 : 18}" cy="-79" r="2.6" fill="#222"/>
      ${o.lei ? `<path d="M0 -62 Q8 -68 16 -62" stroke="#3a2a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
        : `<path d="M-2 -66 Q8 -56 20 -66" stroke="#3a2a10" stroke-width="2.4" fill="#c0392b" stroke-linecap="round"/><rect x="5" y="-66" width="5" height="4" fill="#fff"/>`}
      ${o.side ? `<g transform="rotate(-14 34 -60)"><rect x="24" y="-74" width="26" height="32" fill="#fbf6e8" stroke="#c9b98f"/><path d="M28 -66 h16 M28 -60 h18 M28 -54 h12" stroke="#9a8a6a" stroke-width="1.4"/><path d="M50 -74 q-6 6 0 10 q-6 6 0 10" fill="${mix(g, .1)}"/></g>` : ""}
    </g>`;
  }

  const FIG = {
    lumi: o => lumi(o),
    glupsk: o => glupsk(o),
    lys: () => `<g><circle cx="0" cy="-160" r="34" fill="#fff3b0"/><circle cx="0" cy="-160" r="22" fill="#fffbe6"/><circle cx="0" cy="-160" r="12" fill="#fff"/></g>`,
    flamme: () => `<g><circle cx="0" cy="-160" r="34" fill="#fde0b0"/><path d="M0 -132 q-22 -18 -6 -46 q2 14 10 14 q-4 -20 8 -34 q16 26 4 50 q-6 14 -16 16" fill="#ff8f00"/><path d="M0 -136 q-8 -10 0 -22 q8 12 0 22" fill="#ffe082"/></g>`,
    // prolog/epilog
    sander: o => P(Object.assign({}, MOTE, { hud: "#f3d2b5", har: "#c89a5a", harType: "rufsete", frakk: "#2e7d5a", vest: "#2e7d5a", uttrykk: "glad", skala: .7 }, o), PY.briller()),
    // kapittel 1 – jødedommen
    jokebed: o => P(Object.assign({ hud: OST, har: "#2a1a10", harType: "langt", kjole: true, kjoleF: "#6a5a8a", uttrykk: "lei", mager: true }, o), PY.hodeduk("#d9c9a8")),
    mirjam: o => P(Object.assign({ hud: OST, har: "#2a1a10", harType: "langt", kjole: true, kjoleF: "#b5533c", uttrykk: "glad", skala: .7 }, o), PY.flette("#2a1a10")),
    prinsesse: o => P(Object.assign({ hud: OST2, har: "#141418", harType: "langt", kjole: true, kjoleF: "#f4f1ea", uttrykk: "glad" }, o), PY.egyptkrage() + PY.diadem()),
    farao: o => P(Object.assign({ hud: OST2, har: "#141418", harType: "kort", kjole: true, kjoleF: "#f4f1ea", uttrykk: "sint", skala: 1.08 }, o), PY.egyptkrage() + PY.nemes()),
    moses: o => P(Object.assign({ hud: OST, har: "#6a5a4a", harType: "langt", skjegg: "langt", kjole: true, kjoleF: "#7a5a3a", uttrykk: "noytral" }, o), PY.hodeduk("#cdb98f", "#7a4a2a") + PY.stav()),
    daniel: o => P(Object.assign({}, MOTE, { hud: "#f0cfb0", har: "#3a2416", harType: "kort", frakk: "#1f3d7a", vest: "#1f3d7a", uttrykk: "glad", skala: .7 }, o), PY.kippa("#1f3d7a")),
    // kapittel 2 – kristendommen
    maria: o => P(Object.assign({ hud: OST, har: "#3a2416", harType: "langt", kjole: true, kjoleF: "#2f5d9a", uttrykk: "glad" }, o), PY.hodeduk("#dfe8f5")),
    josef: o => P(Object.assign({ hud: OST, har: "#3a2a1a", harType: "kort", skjegg: "langt", kjole: true, kjoleF: "#8a6a3a", uttrykk: "noytral" }, o), PY.hodeduk("#d9c9a8", "#6a4a2a") + PY.stav()),
    vert: o => P(Object.assign({ hud: OST2, har: "#2a1a10", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: "#a05a3a", forkle: "#e8dcc4", uttrykk: "lei" }, o), PY.turban("#d8c8a8")),
    gjeter: o => P(Object.assign({ hud: OST2, har: "#3a2a1a", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: "#8a7a5a", uttrykk: "overrasket", mager: true }, o), PY.hodeduk("#b8a888", "#5a4a3a") + PY.hyrdestav()),
    engel: o => P(Object.assign({ hud: "#f6dcc4", har: "#e8c060", harType: "langt", kjole: true, kjoleF: "#fbfaf5", uttrykk: "glad" }, o), "", PY.vinger() + PY.glorie()),
    vismann: o => { const v = (o && o.v) || 0, f = ["#6a2a7a", "#2a6a5a", "#8a1f2b"][v], g = ["#c9a227", "#e8e0cc", "#8a5a2a"][v];
      return P(Object.assign({ hud: [OST2, "#8a5a3a", "#e2b48c"][v], har: ["#f4f1ea", "#141418", "#5a3a1a"][v], harType: "kort", skjegg: ["langt", "stubb", "langt"][v], kjole: true, kjoleF: f, uttrykk: "glad" }, o), PY.juvelturban(["#e3b53a", "#f4f1ea", "#2f5d9a"][v]) + PY.gave(g)); },
    jesus: o => P(Object.assign({ hud: OST, har: "#4a2e1a", harType: "langt", skjegg: "stubb", kjole: true, kjoleF: "#f4f1ea", uttrykk: "glad" }, o), PY.sjal("#a8323e")),
    skadet: o => `<g transform="translate(70 -24) rotate(-90)">${P(Object.assign({ hud: OST2, har: "#3a2a1a", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: "#d8cfbf", uttrykk: (o && o.frisk) ? "glad" : "lukket", mager: true }, o), (o && o.frisk) ? PY.bandasje() : "")}</g>`,
    tempelprest: o => P(Object.assign({ hud: OST2, har: "#d8d0c0", harType: "kort", skjegg: "langt", kjole: true, kjoleF: "#f4f1ea", uttrykk: "lur" }, o), PY.sjal("#1f4fa0") + PY.turban("#f4f1ea")),
    levitt: o => P(Object.assign({ hud: OST, har: "#2a1a10", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: "#3a5a7a", uttrykk: "noytral" }, o), PY.hodeduk("#e8e0cc", "#1f4fa0")),
    samaritan: o => P(Object.assign({ hud: OST2, har: "#2a1a10", harType: "kort", skjegg: "langt", kjole: true, kjoleF: "#3a7a4a", uttrykk: "glad" }, o), PY.turban("#c87a2a")),
    magdalena: o => P(Object.assign({ hud: OST, har: "#5a2a1a", harType: "langt", kjole: true, kjoleF: "#8a2a3a", uttrykk: "overrasket" }, o), PY.hodeduk("#e8d8c8")),
    ingrid: o => P(Object.assign({}, MOTE, { hud: "#f6d5bb", har: "#e8c870", harType: "langt", frakk: "#c0392b", vest: "#c0392b", uttrykk: "glad", skala: .7 }, o), PY.flette("#e8c870")),
    prestinne: o => P(Object.assign({ hud: "#f3d2b5", har: "#8a5a3a", harType: "kort", kjole: true, kjoleF: "#1d1d22", uttrykk: "glad" }, o), PY.pipekrage()),
    // kapittel 3 – islam (ingen bilder av profetene, Gud eller englene)
    yasmin: o => P(Object.assign({ hud: OST2, har: "#141418", harType: "langt", kjole: true, kjoleF: "#d9822b", uttrykk: "glad", skala: .7 }, o), PY.hodeduk("#f4e7c9")),
    vannselger: o => P(Object.assign({ hud: "#a87a52", har: "#ece8e0", harType: "kort", skjegg: "langt", kjole: true, kjoleF: "#e8e0cc", uttrykk: "glad", mager: true }, o), PY.hodeduk("#fbfaf5", "#5a3a1a") + PY.skaal("#8a5a2a")),
    forfolger: o => P(Object.assign({ hud: OST2, har: "#141418", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: "#7a2a2a", uttrykk: "sint" }, o), PY.hodeduk("#e8e0cc", "#1b1b22") + PY.sverd()),
    yusuf: o => P(Object.assign({}, MOTE, { hud: "#c9966a", har: "#141418", harType: "kort", frakk: "#2e7d32", vest: "#2e7d32", uttrykk: "glad", skala: .7 }, o), PY.kufi()),
    // kapittel 4 – hinduismen
    rama: o => P(Object.assign({ hud: "#4f86cc", har: "#141418", harType: "langt", frakk: "#e8b830", vest: "#e8b830", bukse: "#e8b830", strompe: "#4f86cc", sko: "#4f86cc", uttrykk: "glad" }, o), PY.mukut() + PY.bue()),
    sita: o => P(Object.assign({ hud: SOR2, har: "#141418", harType: "langt", kjole: true, kjoleF: "#c0392b", uttrykk: "glad" }, o), PY.sjal("#e3b53a") + PY.diadem() + PY.bindi()),
    lakshmana: o => P(Object.assign({ hud: "#d8a070", har: "#141418", harType: "langt", frakk: "#2e7d32", vest: "#e8b830", bukse: "#2e7d32", strompe: "#d8a070", sko: "#d8a070", uttrykk: "noytral", skala: .95 }, o), PY.mukut(.85) + PY.bue()),
    eremitt: o => P(Object.assign({ hud: SOR, har: "#3a2a1a", harType: "langt", skjegg: "langt", kjole: true, kjoleF: "#d9822b", uttrykk: "lur" }, o), PY.skaal("#8a5a2a")),
    ravana: o => {
      const hode = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="16" ry="18" fill="#7a5a8a"/><path d="M-9 -2 L-3 0 M9 -2 L3 0" stroke="#222" stroke-width="2.5"/><circle cx="-6" cy="3" r="2" fill="#ffd54a"/><circle cx="6" cy="3" r="2" fill="#ffd54a"/><path d="M-5 11 L5 10" stroke="#3a1a2a" stroke-width="2"/><path d="M-12 -14 L-10 -30 L-4 -20 L0 -32 L4 -20 L10 -30 L12 -14 Z" fill="#e3b53a"/></g>`;
      let bak = ""; [-1, 1].forEach(side => { for (let i = 1; i <= 4; i++) bak += hode(side * (18 + i * 19), hy - 6 + i * 2, .82 - i * .04); });
      bak += hode(0, hy - 46, .8);
      return P(Object.assign({ hud: "#7a5a8a", har: "#141418", harType: "kort", frakk: "#4a1f4a", vest: "#c9a227", bukse: "#4a1f4a", strompe: "#4a1f4a", sko: "#2a1a2a", kappe: "#2a102a", uttrykk: "sint", skala: 1.12 }, o), PY.mukut() + PY.sverd(), bak);
    },
    hanuman: o => P(Object.assign({ hud: "#b8742e", har: "#8a5220", harType: "rufsete", frakk: "#c0392b", vest: "#e3b53a", bukse: "#c0392b", strompe: "#b8742e", sko: "#8a5220", uttrykk: "glad" }, o),
      `<ellipse cx="0" cy="${hy + 8}" rx="14" ry="11" fill="#f0c890"/><circle cx="-4" cy="${hy + 6}" r="1.6" fill="#5a3a1a"/><circle cx="4" cy="${hy + 6}" r="1.6" fill="#5a3a1a"/><path d="M-7 ${hy + 13} Q0 ${hy + 19} 7 ${hy + 13}" stroke="#5a3a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + PY.mukut(.8) + PY.gada(),
      `<path d="M-20 -52 Q-62 -44 -58 -96 Q-56 -122 -40 -126" stroke="#b8742e" stroke-width="9" fill="none" stroke-linecap="round"/>`),
    priya: o => P(Object.assign({}, MOTE, { hud: "#b07a50", har: "#141418", harType: "langt", frakk: "#8e3a8a", vest: "#e3b53a", uttrykk: "glad", skala: .7 }, o), PY.flette("#141418") + PY.bindi()),
    // kapittel 5 – buddhismen
    siddhartha: o => {
      o = Object.assign({ fase: "prins" }, o);
      if (o.fase === "prins") return P(Object.assign({ hud: "#d8a070", har: "#141418", harType: "kort", frakk: "#f4f1ea", vest: "#e3b53a", bukse: "#f4f1ea", strompe: "#d8a070", sko: "#a8811c", uttrykk: "glad" }, o), PY.juvelturban("#f4f1ea"));
      const mager = o.fase === "asket";
      return P(Object.assign({ hud: "#d8a070", har: "#141418", harType: "kort", kjole: true, kjoleF: "#e08a1e", uttrykk: mager ? "lei" : "glad", mager }, o),
        PY.sjal("#c66a10") + PY.harknute("#141418"));
    },
    suddhodana: o => P(Object.assign({ hud: "#d8a070", har: "#e8e4da", harType: "kort", skjegg: "langt", frakk: "#8a1f2b", vest: "#e3b53a", bukse: "#8a1f2b", strompe: "#d8a070", sko: "#a8811c", kappe: "#5a1420", uttrykk: "lei" }, o), PY.mukut()),
    channa: o => P(Object.assign({ hud: SOR, har: "#141418", harType: "kort", skjegg: "stubb", frakk: "#2f5d9a", vest: "#e8e0cc", bukse: "#e8e0cc", strompe: SOR, sko: "#5a3a1a", uttrykk: "noytral" }, o), PY.turban("#c0392b")),
    gammel: o => `<g transform="rotate(${(o && o.ikkeBoyd) ? 0 : 6})">${P(Object.assign({ hud: "#c89a72", har: "#f4f1ea", harType: "skallet", skjegg: "langt", kjole: true, kjoleF: "#a89a7a", uttrykk: "lei", mager: true, skala: .92 }, o), `<path d="M-38 -80 L-44 -2" stroke="#6b4a2a" stroke-width="4" stroke-linecap="round"/>`)}</g>`,
    syk: o => P(Object.assign({ hud: "#c8b88a", har: "#3a2a1a", harType: "rufsete", kjole: true, kjoleF: "#8a8a7a", uttrykk: "lei", mager: true }, o), `<path d="M-30 -146 Q-40 -60 -36 -10 L36 -10 Q40 -60 30 -146 Q0 -130 -30 -146 Z" fill="#b8a888" opacity=".9"/>`),
    munk: o => P(Object.assign({ hud: "#d8a070", har: "#d8a070", harType: "skallet", kjole: true, kjoleF: "#e08a1e", uttrykk: "glad" }, o), PY.sjal("#c66a10") + PY.skaal("#3a2a1a")),
    sujata: o => P(Object.assign({ hud: SOR, har: "#141418", harType: "langt", kjole: true, kjoleF: "#2f7a9a", uttrykk: "glad" }, o), PY.hodeduk("#e8b830") + PY.skaal("#c9a227")),
    mara: o => P(Object.assign({ hud: "#5a4a7a", har: "#1b1b22", harType: "rufsete", kjole: true, kjoleF: "#2a1b3a", kappe: "#1b1030", uttrykk: "lur", skala: 1.1 }, o), `<circle cx="-8" cy="${hy - 1}" r="2" fill="#ffd54a"/><circle cx="8" cy="${hy - 1}" r="2" fill="#ffd54a"/>` + PY.mukut(.9)),
    kisa: o => P(Object.assign({ hud: "#c98a5a", har: "#141418", harType: "langt", kjole: true, kjoleF: "#9a9a9a", uttrykk: "lei", mager: true }, o), PY.hodeduk("#e8e4da")),
    landsbykone: o => P(Object.assign({ hud: SOR, har: "#2a1a10", harType: "langt", kjole: true, kjoleF: (o && o.f) || "#7a4a8a", uttrykk: "lei" }, o), PY.hodeduk("#e8dcc4")),
    landsbymann: o => P(Object.assign({ hud: SOR, har: "#2a1a10", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: (o && o.f) || "#5a7a4a", uttrykk: "lei" }, o), PY.turban("#e8e0cc")),
    linh: o => P(Object.assign({}, MOTE, { hud: "#f0d4b0", har: "#141418", harType: "langt", frakk: "#e8b830", vest: "#e8b830", uttrykk: "glad", skala: .7 }, o)),
    ba: o => P(Object.assign({ hud: "#ecc8a4", har: "#c8c8c8", harType: "oppsatt", kjole: true, kjoleF: "#8a8a9a", uttrykk: "glad", mager: true, skala: .92 }, o)),
  };
  FIG.asket = o => FIG.siddhartha(Object.assign({ fase: "asket" }, o));
  FIG.buddhaP = o => FIG.siddhartha(Object.assign({ fase: "munk" }, o));
  Object.assign(K.FIG, FIG);

  /* ======================================================================
     TING (bunnen midt på i 0,0)
     ====================================================================== */
  const TING = {
    bok: o => {
      o = o || {};
      const sym = ["✡", "✝", "☪", "ॐ", "☸"];
      const hull = o.hel ? "" : `<g fill="#3a2a1a" opacity=".85"><circle cx="-56" cy="-122" r="9"/><circle cx="-30" cy="-104" r="6"/><circle cx="38" cy="-128" r="10"/><circle cx="58" cy="-102" r="7"/><circle cx="20" cy="-96" r="5"/></g>`;
      return `<g><path d="M-14 0 L-8 -70 L8 -70 L14 0 Z" fill="#6b3a1f"/><rect x="-30" y="-4" width="60" height="6" rx="2" fill="#4a2a14"/>
        ${o.hel ? `<circle cx="0" cy="-112" r="96" fill="#ffd54a" opacity=".22"/>` : ""}
        <path d="M-84 -74 L0 -82 L84 -74 L80 -148 L0 -156 L-80 -148 Z" fill="#5a2a14"/>
        <path d="M-78 -80 Q-40 -88 -2 -82 L-2 -150 Q-40 -156 -76 -146 Z" fill="#fbf3dc"/><path d="M78 -80 Q40 -88 2 -82 L2 -150 Q40 -156 76 -146 Z" fill="#fbf3dc"/>
        ${sym.map((s, i) => `<text x="${-58 + i * 29}" y="${-108 + (i % 2) * 14}" font-size="18" text-anchor="middle" fill="${o.hel ? "#b48a1e" : "#cfc4a8"}" font-family="Segoe UI Symbol,Noto Sans Symbols,serif">${s}</text>`).join("")}
        ${hull}</g>`;
    },
    siv: o => `<g>${[-24, -12, 0, 12, 24].map((x, i) => `<path d="M${x} 0 Q${x + (i % 2 ? 6 : -6)} -60 ${x + (i - 2) * 4} -${96 + (i % 3) * 14}" stroke="#6a8a3a" stroke-width="4" fill="none"/><ellipse cx="${x + (i - 2) * 4}" cy="-${92 + (i % 3) * 14}" rx="4" ry="12" fill="#7a5230"/>`).join("")}
      ${o && o.plukket ? "" : `<path d="M-30 -2 Q0 -14 30 -2" stroke="#8aa04a" stroke-width="6" fill="none"/>`}</g>`,
    bekgryte: () => `<g><path d="M-20 0 L-10 -14 M20 0 L10 -14" stroke="#4a3a2a" stroke-width="4"/><path d="M-12 -8 q4 -10 8 0 q4 -12 8 0 q4 -8 6 0" fill="#ff8f00"/>
      <path d="M-26 -14 Q-28 -46 0 -46 Q28 -46 26 -14 Z" fill="#2a2a2a"/><ellipse cx="0" cy="-44" rx="24" ry="6" fill="#141414"/><path d="M-6 -52 q-4 -10 2 -16 M6 -54 q4 -8 -2 -14" stroke="#9a9a9a" stroke-width="2" fill="none" opacity=".6"/></g>`,
    kurv: o => {
      o = o || {};
      const baby = o.tom ? "" : `<ellipse cx="0" cy="-20" rx="22" ry="8" fill="#f4ecd8"/><circle cx="-14" cy="-24" r="8" fill="${OST}"/><path d="M-17 -25 q2 2 4 0 M-12 -25 q2 2 4 0" stroke="#3a2a1a" stroke-width="1.2" fill="none"/>`;
      return `<g>${o.vann ? `<ellipse cx="0" cy="-2" rx="44" ry="7" fill="#7ab0d0" opacity=".7"/>` : ""}
        <path d="M-34 -24 Q-32 0 0 0 Q32 0 34 -24 Z" fill="#c9a050" stroke="#8a6a2a" stroke-width="2"/>
        ${[-26, -16, -6, 4, 14, 24].map(x => `<path d="M${x} -22 Q${x + 2} -10 ${x} -2" stroke="#8a6a2a" stroke-width="1.4" fill="none"/>`).join("")}
        ${o.bek ? `<path d="M-34 -24 Q-32 0 0 0 Q32 0 34 -24" stroke="#2a2a2a" stroke-width="4" fill="none"/>` : ""}${baby}</g>`;
    },
    busk: o => {
      o = o || {};
      let s = `<g><path d="M-6 0 L-4 -30 M6 0 L4 -30" stroke="#5a3a1a" stroke-width="5"/>`;
      srand(41); for (let i = 0; i < 14; i++) s += `<circle cx="${(rnd() - .5) * 70}" cy="${-30 - rnd() * 50}" r="${10 + rnd() * 8}" fill="${["#4a6a2a", "#5a7a3a", "#3a5a2a"][i % 3]}"/>`;
      if (o.brenn) s += `<g class="flakk"><path d="M-40 -40 Q-46 -90 -20 -120 Q-22 -96 -8 -92 Q-14 -130 10 -150 Q8 -116 22 -108 Q30 -128 26 -140 Q52 -100 40 -40 Z" fill="#ff8f00" opacity=".9"/>
        <path d="M-24 -44 Q-26 -80 -6 -100 Q-4 -80 6 -78 Q4 -104 18 -116 Q30 -84 24 -44 Z" fill="#ffd54a"/></g><circle cx="0" cy="-80" r="80" fill="#ffb300" opacity=".14"/>`;
      return s + `</g>`;
    },
    havlukk: () => `<g><path d="M252 176 L548 176 L476 272 L324 272 Z" fill="#2a6a9a"/>${[196, 216, 236, 256].map((y, i) => `<path d="M${270 + i * 18} ${y} q${(260 - i * 36) / 4} -6 ${(260 - i * 36) / 2} 0 t${(260 - i * 36) / 2} 0" stroke="#5a9ac0" stroke-width="3" fill="none"/>`).join("")}</g>`,
    sandaler: () => `<g><ellipse cx="-12" cy="-3" rx="8" ry="16" fill="#8a5a2a" transform="rotate(-70 -12 -3)"/><ellipse cx="12" cy="-4" rx="8" ry="16" fill="#8a5a2a" transform="rotate(-60 12 -4)"/><path d="M-20 -6 h14 M4 -8 h14" stroke="#5a3a1a" stroke-width="2"/></g>`,
    sau: o => `<g transform="scale(${(o && o.s) || 1}) ${(o && o.snu) ? "scale(-1 1)" : ""}"><ellipse cx="0" cy="-2" rx="22" ry="3" fill="#000" opacity=".12"/><path d="M-12 0 v-14 M-4 0 v-14 M6 0 v-14 M14 0 v-14" stroke="#3a3a3a" stroke-width="3"/>
      ${[-14, -4, 6, 14, -8, 8].map((x, i) => `<circle cx="${x}" cy="${i < 4 ? -22 : -30}" r="10" fill="#f4f1ea"/>`).join("")}<ellipse cx="24" cy="-26" rx="7" ry="9" fill="#3a3a3a"/><circle cx="26" cy="-28" r="1.4" fill="#fff"/></g>`,
    tavler: o => `<g><circle cx="0" cy="-70" r="${o && o.lys ? 70 : 0}" fill="#fff3b0" opacity=".3"/>
      ${[-26, 26].map((x, j) => `<path d="M${x - 22} 0 L${x - 22} -70 Q${x} -94 ${x + 22} -70 L${x + 22} 0 Z" fill="#b8b0a0" stroke="#7a7266" stroke-width="2"/>
      ${(j ? ["VI", "VII", "VIII", "IX", "X"] : ["I", "II", "III", "IV", "V"]).map((n, i) => `<text x="${x}" y="${-58 + i * 12}" font-size="9" text-anchor="middle" fill="#4a443a" font-family="Georgia" font-weight="700">${n}</text>`).join("")}`).join("")}</g>`,
    matsa: () => `<g><ellipse cx="0" cy="-4" rx="34" ry="8" fill="#e8e0cc" stroke="#bbb"/>${[0, 1, 2].map(i => `<rect x="-24" y="${-14 - i * 6}" width="48" height="6" rx="1" fill="#e2c98a" stroke="#b8975a" stroke-width="1"/>`).join("")}
      <path d="M-18 -26 h36 M-18 -28 h36" stroke="#b8975a" stroke-width=".8" stroke-dasharray="2 3"/></g>`,
    sederfat: () => `<g><ellipse cx="0" cy="-8" rx="60" ry="16" fill="#f4f1ea" stroke="#1f3d7a" stroke-width="3"/><ellipse cx="0" cy="-10" rx="48" ry="11" fill="none" stroke="#c9a227" stroke-width="1.5"/>
      <ellipse cx="-34" cy="-10" rx="8" ry="4" fill="#e8d0a8"/><path d="M-8 -16 q4 -8 10 -2 q-4 6 -10 2" fill="#f4f1ea" stroke="#ccc"/><ellipse cx="22" cy="-18" rx="8" ry="4" fill="#5a8a3a"/>
      <ellipse cx="36" cy="-8" rx="8" ry="4" fill="#8a5a3a"/><ellipse cx="0" cy="-4" rx="8" ry="4" fill="#b8c87a"/><ellipse cx="-20" cy="-2" rx="7" ry="3.5" fill="#d8b8a8"/></g>`,
    krybbe: o => `<g><path d="M-44 0 L-32 -40 M44 0 L32 -40 M-44 0 L-20 -40 M44 0 L20 -40" stroke="#7a5230" stroke-width="5"/>
      <path d="M-46 -40 L46 -40 L38 -14 L-38 -14 Z" fill="#8a5a30"/><path d="M-44 -42 Q-30 -56 -10 -46 Q4 -58 20 -46 Q34 -56 44 -42 Z" fill="#e3c060"/>
      ${o && o.baby ? `<circle cx="0" cy="-50" r="60" fill="#fff3b0" opacity=".25"/><ellipse cx="4" cy="-50" rx="22" ry="9" fill="#f4f1ea"/><circle cx="-14" cy="-54" r="8" fill="${OST}"/><path d="M-17 -55 q2 2 4 0 M-12 -55 q2 2 4 0" stroke="#3a2a1a" stroke-width="1.2" fill="none"/>` : ""}</g>`,
    hoy: () => `<g><path d="M-36 0 Q-40 -30 -20 -36 Q0 -44 20 -36 Q40 -30 36 0 Z" fill="#e3c060"/><path d="M-30 -8 l6 -16 M-14 -6 l4 -20 M2 -8 l-2 -22 M18 -6 l-4 -18 M28 -10 l-6 -14" stroke="#b8952a" stroke-width="2"/></g>`,
    esel: o => `<g transform="${(o && o.snu) ? "scale(-1 1)" : ""}"><ellipse cx="0" cy="-2" rx="34" ry="4" fill="#000" opacity=".12"/><path d="M-24 0 v-34 M-12 0 v-32 M14 0 v-32 M24 0 v-34" stroke="#7a7068" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="0" cy="-44" rx="34" ry="18" fill="#9a9088"/><path d="M26 -54 Q40 -80 48 -76 L58 -58 Q50 -50 34 -46 Z" fill="#9a9088"/><ellipse cx="54" cy="-60" rx="10" ry="8" fill="#b8b0a8"/>
      <path d="M40 -80 l-4 -22 l8 18 M46 -78 l2 -22 l4 20" fill="#7a7068" stroke="#7a7068" stroke-width="4" stroke-linejoin="round"/><circle cx="46" cy="-68" r="2" fill="#222"/><path d="M-34 -50 q-10 10 -6 24" stroke="#7a7068" stroke-width="3" fill="none"/>
      ${o && o.sal ? `<path d="M-14 -62 Q0 -66 14 -62 L16 -40 L-16 -40 Z" fill="#a8323e"/>` : ""}</g>`,
    stjerne: () => `<g class="flakk"><circle cx="0" cy="0" r="40" fill="#fff3b0" opacity=".25"/><path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" fill="#fffbe0"/><path d="M0 26 L0 120" stroke="#fffbe0" stroke-width="2" opacity=".5"/></g>`,
    grav: o => `<g><path d="M-110 0 Q-120 -150 0 -170 Q120 -150 110 0 Z" fill="#9a8e7a"/><path d="M-90 0 Q-96 -120 0 -136 Q96 -120 90 0" fill="none" stroke="#857a66" stroke-width="4"/>
      <path d="M-34 0 Q-36 -80 0 -84 Q36 -80 34 0 Z" fill="#2a2420"/>
      ${o && o.aapen ? `<circle cx="0" cy="-42" r="40" fill="#fff3b0" opacity=".35"/><g transform="translate(78 0)"><circle cx="0" cy="-42" r="42" fill="#b8ac98" stroke="#8a7e6a" stroke-width="3"/><circle cx="0" cy="-42" r="16" fill="none" stroke="#9a8e7a" stroke-width="2"/></g>`
        : `<circle cx="0" cy="-42" r="42" fill="#b8ac98" stroke="#8a7e6a" stroke-width="3"/><circle cx="0" cy="-42" r="16" fill="none" stroke="#9a8e7a" stroke-width="2"/>`}</g>`,
    palmegrein: () => `<g transform="rotate(-20)"><path d="M-40 -4 Q0 -14 40 -30" stroke="#5a7a2a" stroke-width="3" fill="none"/>${[-30, -20, -10, 0, 10, 20, 30].map(x => `<path d="M${x} ${-8 - (x + 40) * .3} l-8 -16 M${x} ${-8 - (x + 40) * .3} l10 10" stroke="#6a9a3a" stroke-width="3"/>`).join("")}</g>`,
    dopefont: () => `<g><path d="M-18 0 L-12 -60 L12 -60 L18 0 Z" fill="#d8d0c0" stroke="#a89a80" stroke-width="2"/><path d="M-34 -60 Q-34 -90 0 -90 Q34 -90 34 -60 Z" fill="#e8e0d0" stroke="#a89a80" stroke-width="2"/><ellipse cx="0" cy="-88" rx="30" ry="6" fill="#9cc8e6"/></g>`,
    alter: () => `<g><rect x="-70" y="-70" width="140" height="70" fill="#f4f1ea" stroke="#c9a227" stroke-width="2"/><rect x="-70" y="-76" width="140" height="8" fill="#a8323e"/>
      <path d="M0 -150 V-80 M-20 -128 H20" stroke="#c9a227" stroke-width="6" stroke-linecap="round"/>
      ${[-50, 50].map(x => `<rect x="${x - 4}" y="-110" width="8" height="34" fill="#fbfaf5"/><path d="M${x} -110 q-4 -8 0 -14 q4 6 0 14" fill="#ffcf5a" class="flakk"/>`).join("")}<path d="M-40 -66 h80" stroke="#c9a227" stroke-width="2"/></g>`,
    kaba: () => `<g><path d="M-80 0 L-80 -120 L-10 -134 L80 -122 L80 0 Z" fill="#141418"/><path d="M-10 -134 L-10 -6" stroke="#2a2a30" stroke-width="2"/>
      <path d="M-80 -96 L-10 -106 L80 -98" stroke="#c9a227" stroke-width="7" fill="none"/><path d="M-80 -96 L-10 -106 L80 -98" stroke="#e3c870" stroke-width="2" fill="none" stroke-dasharray="6 4"/>
      <rect x="30" y="-62" width="22" height="46" fill="#c9a227"/></g>`,
    hule: o => `<g><path d="M-120 0 Q-130 -120 -40 -160 Q40 -180 110 -120 Q140 -60 120 0 Z" fill="${(o && o.f) || "#6a5a4a"}"/>
      <path d="M-46 0 Q-50 -80 0 -96 Q50 -80 46 0 Z" fill="#1a1612"/>
      ${o && o.lys ? `<path d="M-46 0 Q-50 -80 0 -96 Q50 -80 46 0 Z" fill="#fff3b0" class="flakk" opacity=".85"/><circle cx="0" cy="-50" r="90" fill="#fff3b0" opacity=".2"/>` : ""}
      ${o && o.vev ? `<g stroke="#f4f4f4" stroke-width="1.2" fill="none" opacity=".9"><path d="M-44 -6 L44 -70 M44 -6 L-40 -72 M0 -94 L0 0 M-46 -40 L46 -40"/>${[12, 22, 32, 42].map(r => `<circle cx="0" cy="-40" r="${r}"/>`).join("")}</g><circle cx="10" cy="-50" r="4" fill="#2a2a2a"/>` : ""}
      ${o && o.reir ? `<g transform="translate(-58 -28)"><ellipse cx="0" cy="0" rx="18" ry="7" fill="#8a6a3a"/><ellipse cx="-4" cy="-4" rx="5" ry="4" fill="#fbfaf5"/><ellipse cx="5" cy="-4" rx="5" ry="4" fill="#fbfaf5"/>
        <g transform="translate(4 -10)"><ellipse cx="0" cy="0" rx="12" ry="8" fill="#e8e8f0"/><circle cx="10" cy="-6" r="5" fill="#e8e8f0"/><path d="M14 -6 l5 1" stroke="#e08a1e" stroke-width="2"/><circle cx="11" cy="-7" r="1" fill="#222"/></g></g>` : ""}</g>`,
    edderkopp: () => `<g><path d="M0 -4 L0 -60" stroke="#ddd" stroke-width="1"/><g transform="translate(0 -10)"><ellipse cx="0" cy="0" rx="6" ry="7" fill="#2a2a2a"/><circle cx="0" cy="-8" r="4" fill="#2a2a2a"/>
      <path d="M-5 -2 l-10 -6 M-5 2 l-11 0 M-5 5 l-10 6 M5 -2 l10 -6 M5 2 l11 0 M5 5 l10 6" stroke="#2a2a2a" stroke-width="1.6"/><circle cx="-1.5" cy="-9" r="1" fill="#fff"/><circle cx="1.5" cy="-9" r="1" fill="#fff"/></g></g>`,
    due: () => `<g><ellipse cx="0" cy="-12" rx="14" ry="9" fill="#e8e8f0"/><circle cx="12" cy="-20" r="6" fill="#e8e8f0"/><path d="M17 -20 l6 1" stroke="#e08a1e" stroke-width="2"/><circle cx="13" cy="-21" r="1.2" fill="#222"/><path d="M-12 -14 l-10 -4 l2 8 Z" fill="#d0d0dc"/><path d="M-4 -16 Q4 -26 10 -14" fill="#d0d0dc"/><path d="M-2 -4 v4 M4 -4 v4" stroke="#e08a1e" stroke-width="1.6"/></g>`,
    kvist: () => `<g><path d="M-30 0 L30 -8 M-6 -3 L-14 -16 M10 -5 L18 -18" stroke="#7a5230" stroke-width="3" stroke-linecap="round"/><ellipse cx="-14" cy="-18" rx="5" ry="3" fill="#6a9a3a"/><ellipse cx="18" cy="-20" rx="5" ry="3" fill="#6a9a3a"/></g>`,
    egg: () => `<g><ellipse cx="0" cy="-7" rx="6" ry="7" fill="#fbfaf5" stroke="#ddd"/></g>`,
    kamel: o => `<g transform="${(o && o.snu) ? "scale(-1 1)" : ""}"><ellipse cx="0" cy="-2" rx="40" ry="4" fill="#000" opacity=".12"/><path d="M-26 0 v-50 M-14 0 v-50 M16 0 v-50 M28 0 v-50" stroke="#b8925a" stroke-width="6" stroke-linecap="round"/>
      <path d="M-36 -50 Q-34 -66 -16 -70 Q-6 -100 8 -70 Q20 -66 34 -54 Q40 -46 30 -44 L-30 -44 Q-40 -44 -36 -50 Z" fill="#c8a26a"/><path d="M30 -54 Q50 -60 52 -90 L62 -92 Q70 -86 64 -80 L58 -80 Q56 -54 38 -46 Z" fill="#c8a26a"/><circle cx="60" cy="-88" r="1.6" fill="#222"/></g>`,
    skohylle: () => `<g><rect x="-50" y="-50" width="100" height="50" fill="#8a6a4a"/><path d="M-50 -26 h100" stroke="#6a4a2a" stroke-width="3"/>
      ${[-36, -14, 10, 32].map((x, i) => `<ellipse cx="${x}" cy="-32" rx="9" ry="5" fill="${["#2a2a2a", "#c0392b", "#1f3d7a", "#f4f4f4"][i]}"/>`).join("")}${[-30, -4, 24].map((x, i) => `<ellipse cx="${x}" cy="-8" rx="9" ry="5" fill="${["#5a3a1a", "#2e7d32", "#999"][i]}"/>`).join("")}</g>`,
    teppe: () => `<g><path d="M-60 0 L-50 -24 L50 -24 L60 0 Z" fill="#8a1f2b"/><path d="M-52 -4 L-44 -20 L44 -20 L52 -4 Z" fill="none" stroke="#e3b53a" stroke-width="2"/><path d="M-8 -20 Q0 -30 8 -20" stroke="#e3b53a" stroke-width="2" fill="none"/></g>`,
    rehal: () => `<g><path d="M-30 0 L30 -50 M30 0 L-30 -50" stroke="#7a4a2a" stroke-width="6"/><path d="M-34 -52 L0 -36 L34 -52 L34 -60 L0 -46 L-34 -60 Z" fill="#2e6a4a"/><path d="M-30 -58 L0 -45 L30 -58" stroke="#e3b53a" stroke-width="1.5" fill="none"/></g>`,
    diya: o => `<g><circle cx="0" cy="-12" r="${o && o.tent ? 22 : 0}" fill="#ffd54a" opacity=".25"/><path d="M-14 -8 Q0 4 14 -8 Q16 -12 10 -12 L-10 -12 Q-16 -12 -14 -8 Z" fill="#c8622a"/><path d="M-14 -10 Q0 -6 14 -10" stroke="#e3b53a" stroke-width="1.5" fill="none"/>
      ${o && o.tent ? `<path d="M0 -12 q-5 -8 0 -16 q5 8 0 16" fill="#ffb300" class="flakk"/>` : `<path d="M0 -12 v-4" stroke="#3a2a1a" stroke-width="1.5"/>`}</g>`,
    gullhjort: () => `<g><ellipse cx="0" cy="-2" rx="30" ry="4" fill="#000" opacity=".12"/><path d="M-18 0 L-16 -34 M-8 0 L-8 -34 M12 0 L12 -34 M20 0 L18 -34" stroke="#c9a227" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="0" cy="-42" rx="26" ry="13" fill="#e3b53a"/><path d="M20 -48 Q28 -70 34 -72 L42 -64 Q36 -56 28 -46 Z" fill="#e3b53a"/>
      <path d="M32 -72 l-6 -18 l-4 6 M32 -72 l2 -20 l6 4 M38 -72 l8 -16" stroke="#a8811c" stroke-width="2.5" fill="none"/>${[[-10, -46], [2, -40], [-2, -50], [10, -46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff3b0"/>`).join("")}<circle cx="38" cy="-66" r="1.6" fill="#222"/>
      <circle cx="0" cy="-40" r="44" fill="#ffd54a" opacity=".15" class="flakk"/></g>`,
    linje: o => `<g><path d="M-120 -4 Q0 6 120 -4" stroke="${o && o.brutt ? "#9a8a6a" : "#ffd54a"}" stroke-width="5" fill="none" stroke-linecap="round" ${o && o.brutt ? `stroke-dasharray="10 12"` : `class="flakk"`}/></g>`,
    smykke: () => `<g><path d="M-14 -4 Q0 8 14 -4" stroke="#e3b53a" stroke-width="3" fill="none"/>${[-10, -4, 2, 8].map(x => `<circle cx="${x}" cy="${-1 + Math.abs(x) * -.2}" r="2.6" fill="${x % 4 ? "#c0392b" : "#2e7d32"}"/>`).join("")}<circle cx="0" cy="-14" r="18" fill="#ffd54a" opacity=".18"/></g>`,
    hytte: () => `<g><rect x="-60" y="-70" width="120" height="70" fill="#b8925a"/><path d="M-76 -66 L0 -130 L76 -66 Z" fill="#c8a24a"/><path d="M-76 -66 L0 -130 L76 -66" stroke="#9a7a2a" stroke-width="5" fill="none"/><rect x="-16" y="-50" width="32" height="50" fill="#5a3a1a"/></g>`,
    stein: o => `<g><path d="M-24 0 Q-30 -26 -8 -32 Q18 -36 26 -14 Q30 0 20 0 Z" fill="#9a958a" stroke="#6a665e" stroke-width="2"/>${o && o.navn ? `<text x="0" y="-11" font-size="13" text-anchor="middle" fill="#c0392b" font-weight="700" font-family="Nirmala UI,Noto Sans Devanagari,sans-serif">राम</text>` : ""}</g>`,
    bro: o => {
      const n = (o && o.n) || 0; let s = `<g>`;
      for (let i = 0; i < 8; i++) { const x = -210 + i * 60; s += i < n ? `<path d="M${x - 30} 0 Q${x} -14 ${x + 30} 0 L${x + 28} 8 L${x - 28} 8 Z" fill="#9a958a" stroke="#6a665e" stroke-width="2"/><text x="${x}" y="1" font-size="11" text-anchor="middle" fill="#c0392b" font-weight="700" font-family="Nirmala UI,Noto Sans Devanagari,sans-serif">राम</text>` : `<path d="M${x - 26} 4 Q${x} -2 ${x + 26} 4" stroke="#fff" stroke-width="2" fill="none" opacity=".4" stroke-dasharray="4 6"/>`; }
      return s + `</g>`;
    },
    ganesha: () => `<g><rect x="-50" y="-30" width="100" height="30" fill="#c8622a"/><rect x="-56" y="-36" width="112" height="8" fill="#e3b53a"/>
      <circle cx="0" cy="-120" r="70" fill="#ffd54a" opacity=".18"/>
      <ellipse cx="0" cy="-60" rx="34" ry="28" fill="#e89a6a"/><ellipse cx="0" cy="-58" rx="30" ry="24" fill="#f4b24a"/>
      <path d="M-30 -42 Q-48 -40 -46 -30 L-20 -34 Z M30 -42 Q48 -40 46 -30 L20 -34 Z" fill="#e89a6a"/>
      <ellipse cx="-30" cy="-112" rx="24" ry="28" fill="#e89a6a"/><ellipse cx="30" cy="-112" rx="24" ry="28" fill="#e89a6a"/><ellipse cx="-30" cy="-112" rx="16" ry="20" fill="#f2b8a0"/><ellipse cx="30" cy="-112" rx="16" ry="20" fill="#f2b8a0"/>
      <ellipse cx="0" cy="-108" rx="22" ry="24" fill="#e89a6a"/><path d="M-6 -94 Q-8 -70 4 -66 Q14 -64 14 -74 Q8 -72 6 -80 Q6 -90 6 -94 Z" fill="#e89a6a"/>
      <circle cx="-8" cy="-110" r="3" fill="#222"/><circle cx="8" cy="-110" r="3" fill="#222"/><path d="M-12 -98 l-6 6 M12 -98 l6 6" stroke="#fbfaf5" stroke-width="3" stroke-linecap="round"/>
      <path d="M-16 -128 L-14 -150 Q0 -176 14 -150 L16 -128 Z" fill="#e3b53a" stroke="#a8811c" stroke-width="1.5"/><circle cx="0" cy="-140" r="3.5" fill="#c0392b"/>
      <circle cx="-38" cy="-56" r="6" fill="#f4d03f"/><circle cx="38" cy="-56" r="7" fill="#e3c060"/><path d="M-26 -36 Q0 -28 26 -36" stroke="#f08a2a" stroke-width="5" fill="none"/>
      <g transform="translate(40 -36)"><ellipse cx="0" cy="-6" rx="9" ry="6" fill="#8a8a8a"/><circle cx="8" cy="-9" r="4" fill="#8a8a8a"/><circle cx="7" cy="-13" r="2" fill="#b8b8b8"/><path d="M-9 -6 q-8 0 -10 6" stroke="#8a8a8a" stroke-width="1.5" fill="none"/></g>
      ${[-44, -28, -12, 4, 20, 36].map((x, i) => `<circle cx="${x + 4}" cy="-24" r="5" fill="${i % 2 ? "#f08a2a" : "#f4d03f"}"/>`).join("")}</g>`,
    klokke: () => `<g><path d="M0 -150 V-110" stroke="#5a3a1a" stroke-width="3"/><path d="M-16 -86 Q-16 -112 0 -112 Q16 -112 16 -86 L20 -82 L-20 -82 Z" fill="#c9a227" stroke="#8a6a10" stroke-width="1.5"/><circle cx="0" cy="-80" r="4" fill="#8a6a10"/></g>`,
    om: () => `<g><circle cx="0" cy="-40" r="38" fill="#e8622a"/><text x="0" y="-24" font-size="46" text-anchor="middle" fill="#fff3b0" font-family="Nirmala UI,Noto Sans Devanagari,sans-serif">ॐ</text></g>`,
    lotus: o => `<g transform="scale(${(o && o.s) || 1})"><ellipse cx="0" cy="-2" rx="26" ry="5" fill="#3a7a5a"/>${[-18, -9, 0, 9, 18].map((x, i) => `<path d="M0 -6 Q${x * 1.4} -${20 + (2 - Math.abs(i - 2)) * 8} ${x * .3} -${26 + (2 - Math.abs(i - 2)) * 10} Q${x * .1} -14 0 -6 Z" fill="${i === 2 ? "#f8c8d8" : "#f2a7c0"}" stroke="#d87a9a" stroke-width="1"/>`).join("")}</g>`,
    baare: () => `<g><path d="M-80 -30 h160" stroke="#6b4a2a" stroke-width="5"/><path d="M-70 -30 v30 M70 -30 v30" stroke="#6b4a2a" stroke-width="4"/><path d="M-62 -32 Q-50 -60 0 -62 Q50 -60 62 -32 Z" fill="#f4f1ea"/>
      ${[-40, -20, 0, 20, 40].map((x, i) => `<circle cx="${x}" cy="${-54 + Math.abs(x) * .2}" r="5" fill="${i % 2 ? "#f08a2a" : "#f4d03f"}"/>`).join("")}</g>`,
    vogn: () => `<g><circle cx="-30" cy="-26" r="26" fill="none" stroke="#7a4a1a" stroke-width="5"/><path d="M-30 -52 v52 M-56 -26 h52 M-48 -44 l36 36 M-12 -44 l-36 36" stroke="#7a4a1a" stroke-width="2"/>
      <path d="M-60 -60 L40 -60 L40 -40 L-60 -40 Z" fill="#c9a227"/><path d="M-60 -60 L-60 -100 Q-20 -110 0 -60" fill="#8a1f2b"/><path d="M40 -50 L110 -54" stroke="#7a4a1a" stroke-width="4"/>
      <g transform="translate(130 0)"><ellipse cx="0" cy="-2" rx="34" ry="4" fill="#000" opacity=".12"/><path d="M-22 0 v-40 M-12 0 v-40 M14 0 v-40 M24 0 v-40" stroke="#f4f1ea" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="-50" rx="32" ry="16" fill="#fbfaf5"/>
      <path d="M22 -58 Q34 -90 46 -92 L54 -72 Q44 -62 30 -50 Z" fill="#fbfaf5"/><path d="M24 -62 Q30 -88 40 -94" stroke="#c8c0b0" stroke-width="5" fill="none"/><circle cx="46" cy="-82" r="1.8" fill="#222"/><path d="M-32 -54 q-12 6 -10 22" stroke="#c8c0b0" stroke-width="4" fill="none"/></g></g>`,
    hest: () => `<g><ellipse cx="0" cy="-2" rx="34" ry="4" fill="#000" opacity=".12"/><path d="M-22 0 v-40 M-12 0 v-40 M14 0 v-40 M24 0 v-40" stroke="#f4f1ea" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="-50" rx="32" ry="16" fill="#fbfaf5"/>
      <path d="M22 -58 Q34 -90 46 -92 L54 -72 Q44 -62 30 -50 Z" fill="#fbfaf5"/><path d="M24 -62 Q30 -88 40 -94" stroke="#c8c0b0" stroke-width="5" fill="none"/><circle cx="46" cy="-82" r="1.8" fill="#222"/><path d="M-32 -54 q-12 6 -10 22" stroke="#c8c0b0" stroke-width="4" fill="none"/>
      <path d="M-14 -66 Q0 -70 14 -66 L14 -52 L-14 -52 Z" fill="#8a1f2b"/></g>`,
    lutt: o => {
      const st = (o && o.streng) || "slakk";
      const d = st === "stram" ? "M-34 -40 L60 -96" : st === "riktig" ? "M-34 -40 Q14 -64 60 -96" : "M-34 -40 Q20 -40 60 -96";
      return `<g><ellipse cx="-38" cy="-30" rx="26" ry="22" fill="#a8622a"/><circle cx="-38" cy="-30" r="7" fill="#5a3a1a"/><path d="M-20 -46 L64 -100" stroke="#7a4a1a" stroke-width="8" stroke-linecap="round"/>
        <path d="${d}" stroke="${st === "riktig" ? "#e3b53a" : "#ddd"}" stroke-width="1.8" fill="none"/>${st === "riktig" ? `<text x="40" y="-40" font-size="22">🎵</text>` : ""}</g>`;
    },
    bodhitre: () => `<g><path d="M-40 0 Q-30 -100 -50 -160 L50 -160 Q30 -100 40 0 Z" fill="#6b4a2a"/><path d="M-60 0 Q-50 -10 -40 0 M40 0 Q52 -12 64 0 M-30 -150 Q-90 -170 -150 -160 M30 -150 Q90 -176 160 -166" stroke="#6b4a2a" stroke-width="10" fill="none"/>
      <ellipse cx="0" cy="-200" rx="250" ry="80" fill="#2a5a2e"/><ellipse cx="-80" cy="-236" rx="140" ry="60" fill="#2e6232"/><ellipse cx="90" cy="-230" rx="150" ry="62" fill="#2e6232"/>
      ${(() => { srand(77); let s = ""; for (let i = 0; i < 70; i++) { const a = -.25 + rnd() * (Math.PI + .5), r = 30 + rnd() * 150; s += `<path d="M${(Math.cos(a) * r * 1.6).toFixed(1)} ${(-170 - Math.sin(a) * r * .7).toFixed(1)} q-12 -14 0 -28 q12 14 0 28" fill="${["#3a7a3a", "#4a8a3a", "#5a9a42"][i % 3]}"/>`; } return s; })()}</g>`,
    buddha: () => `<g><rect x="-60" y="-24" width="120" height="24" fill="#8a1f2b"/><ellipse cx="0" cy="-26" rx="60" ry="10" fill="#c9a227"/>
      <circle cx="0" cy="-120" r="72" fill="#ffd54a" opacity=".2"/>
      <ellipse cx="0" cy="-42" rx="56" ry="18" fill="#d9a830"/><path d="M-30 -50 Q-34 -100 0 -104 Q34 -100 30 -50 Z" fill="#e3b53a"/><path d="M-26 -94 Q0 -70 26 -94" stroke="#c99a20" stroke-width="3" fill="none"/>
      <ellipse cx="0" cy="-48" rx="12" ry="6" fill="#d9a830"/><circle cx="0" cy="-124" r="22" fill="#e3b53a"/><ellipse cx="-22" cy="-118" rx="4" ry="10" fill="#d9a830"/><ellipse cx="22" cy="-118" rx="4" ry="10" fill="#d9a830"/>
      <path d="M-9 -126 q4 3 8 0 M1 -126 q4 3 8 0" stroke="#8a6a10" stroke-width="1.6" fill="none" transform="translate(-0.5 0)"/><path d="M-5 -114 Q0 -111 5 -114" stroke="#8a6a10" stroke-width="1.6" fill="none"/>
      <circle cx="0" cy="-132" r="1.8" fill="#8a6a10"/><ellipse cx="0" cy="-146" rx="12" ry="8" fill="#c99a20"/><circle cx="0" cy="-154" r="5" fill="#c99a20"/></g>`,
    roykelse: () => `<g><rect x="-16" y="-20" width="32" height="20" rx="3" fill="#8a6a2a"/><path d="M-6 -20 L-8 -50 M0 -20 L0 -54 M6 -20 L8 -50" stroke="#5a3a1a" stroke-width="1.5"/>
      <path d="M-8 -54 q-6 -10 2 -18 q6 -8 -2 -18 M0 -58 q6 -10 -2 -18 q-6 -8 2 -18 M8 -54 q6 -10 -2 -18" stroke="#c8c8c8" stroke-width="2" fill="none" opacity=".7" class="flakk"/></g>`,
    hjul: () => `<g><circle cx="0" cy="-40" r="34" fill="none" stroke="#c9a227" stroke-width="6"/><circle cx="0" cy="-40" r="8" fill="#c9a227"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 -40 L${Math.cos(a * Math.PI / 180) * 34} ${-40 + Math.sin(a * Math.PI / 180) * 34}" stroke="#c9a227" stroke-width="4"/>`).join("")}</g>`,
    lykt: o => `<g><path d="M0 -150 V-120" stroke="#5a3a1a" stroke-width="2"/><ellipse cx="0" cy="-100" rx="18" ry="22" fill="${(o && o.f) || "#c0392b"}"/><rect x="-8" y="-124" width="16" height="5" fill="#e3b53a"/><rect x="-8" y="-80" width="16" height="5" fill="#e3b53a"/><path d="M0 -75 v10" stroke="#e3b53a" stroke-width="2"/><ellipse cx="0" cy="-100" rx="10" ry="16" fill="#fff3b0" opacity=".35"/></g>`,
    sennep: () => `<g><path d="M0 0 V-40 M0 -20 l-12 -12 M0 -28 l12 -10" stroke="#6a8a3a" stroke-width="3"/>${[[-12, -34], [12, -40], [0, -44], [-4, -30], [6, -26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#f4d03f"/>`).join("")}</g>`,
    sko: () => `<g><ellipse cx="-12" cy="-6" rx="12" ry="6" fill="#2a2a2a"/><ellipse cx="12" cy="-6" rx="12" ry="6" fill="#c0392b"/><path d="M-20 -8 h14 M4 -8 h14" stroke="#fff" stroke-width="2"/></g>`,
    pult: () => `<g><rect x="-50" y="-60" width="100" height="10" fill="#c8a26a"/><path d="M-44 -50 v50 M44 -50 v50" stroke="#8a8a8a" stroke-width="5"/></g>`,
    plakat: o => `<g><rect x="-40" y="-110" width="80" height="100" rx="4" fill="#fff" stroke="#d6d6d6"/><rect x="-40" y="-110" width="80" height="24" rx="4" fill="${(o && o.f) || "#2e7d32"}"/>
      <text x="0" y="-56" font-size="30" text-anchor="middle">${(o && o.ikon) || "🙂"}</text><text x="0" y="-22" font-size="10" font-weight="700" text-anchor="middle" fill="#333" font-family="Atkinson Hyperlegible,Arial">${(o && o.t) || ""}</text></g>`,
  };
  Object.assign(K.TING, TING);

  /* ======================================================================
     BAKGRUNNER (800 × 450)
     ====================================================================== */
  const gulv = (y, f, l) => { let s = `<rect y="${y}" width="800" height="${450 - y}" fill="${f}"/>`; for (let x = 0; x < 800; x += 60) s += `<path d="M${x} ${y} L${x - 24} 450" stroke="${l}" stroke-width="2"/>`; return s; };
  const palme = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M-6 0 Q-2 -70 6 -130 L12 -130 Q6 -70 6 0 Z" fill="#8a6a3a"/>${[-60, -30, 0, 30, 60, 160, 200].map(a => `<path d="M9 -130 Q${9 + Math.cos(a * Math.PI / 180) * 30} ${-150 + Math.sin(a * Math.PI / 180) * 10} ${9 + Math.cos(a * Math.PI / 180) * 60} ${-120 + Math.sin(a * Math.PI / 180) * 30}" stroke="#4a8a3a" stroke-width="9" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  const stjerner = (n, s, maks) => { srand(s); let r = ""; for (let i = 0; i < n; i++) r += `<circle cx="${rnd() * 800}" cy="${rnd() * (maks || 220)}" r="${.8 + rnd() * 1.6}" fill="#fff" opacity="${.4 + rnd() * .6}"/>`; return r; };
  const flathus = (x, y, w, h, f) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${f}"/><rect x="${x - 3}" y="${y - h - 6}" width="${w + 6}" height="7" fill="${mix(f, -.12)}"/><rect x="${x + w * .35}" y="${y - h * .55}" width="${w * .3}" height="${h * .55}" fill="${mix(f, -.45)}"/><rect x="${x + w * .1}" y="${y - h * .8}" width="12" height="12" fill="${mix(f, -.45)}"/>`;
  const BG = {
    klasserom() {
      let s = `<rect width="800" height="450" fill="#ece4d4"/>` + gulv(330, "#b98d5e", "#a67c4e");
      s += `<rect x="40" y="60" width="140" height="180" fill="#a8d0ec"/><path d="M110 60 v180 M40 150 h140" stroke="#f4f4f4" stroke-width="6"/><rect x="36" y="56" width="148" height="188" fill="none" stroke="#f4f4f4" stroke-width="8"/><path d="M48 230 q20 -26 46 -10 q26 -18 56 0 q16 -8 26 10 Z" fill="#7ab06a"/>`;
      s += `<rect x="250" y="44" width="300" height="160" fill="#2f4a3a" stroke="#8a6a4a" stroke-width="10"/><text x="400" y="88" font-size="26" font-weight="700" text-anchor="middle" fill="#f4f4ec" font-family="Atkinson Hyperlegible,Arial">KRLE</text>`;
      s += ["✡", "✝", "☪", "ॐ", "☸"].map((c, i) => `<text x="${300 + i * 50}" y="150" font-size="30" text-anchor="middle" fill="#f4f4ec" opacity=".8" font-family="Segoe UI Symbol,Nirmala UI,Noto Sans Symbols,serif">${c}</text>`).join("");
      s += `<path d="M270 180 q40 -6 80 2" stroke="#f4f4ec" stroke-width="2" fill="none" opacity=".6"/><rect x="250" y="204" width="300" height="8" fill="#8a6a4a"/>`;
      s += `<rect x="620" y="110" width="150" height="220" fill="#8a5a3a"/>`; srand(9);
      for (let r = 0; r < 4; r++) { s += `<rect x="620" y="${160 + r * 52}" width="150" height="6" fill="#6b4428"/>`; for (let x = 626; x < 760; x += 13) s += `<rect x="${x}" y="${120 + r * 52 + rnd() * 10}" width="10" height="${30 - rnd() * 8}" fill="${["#c0392b", "#1f3d7a", "#2e7d32", "#c9a227", "#7a4a8a"][Math.floor(rnd() * 5)]}"/>`; }
      return s;
    },
    nilen() {
      let s = sky("niSky", "#7fb6e0", "#f6dcab");
      s += `<circle cx="640" cy="80" r="34" fill="#fff1b8"/>`;
      s += `<path d="M430 220 L480 150 L530 220 Z M520 220 L560 168 L600 220 Z" fill="#d8b878"/><path d="M480 150 L530 220 L500 220 Z M560 168 L600 220 L580 220 Z" fill="#c4a060"/>`;
      s += `<rect y="218" width="800" height="18" fill="#b8a060"/><rect y="234" width="800" height="70" fill="#4a8ab0"/>`;
      for (let y = 244; y < 300; y += 12) s += `<path d="M0 ${y} Q200 ${y - 4} 400 ${y} T800 ${y}" stroke="#6aa8cc" stroke-width="2" fill="none" opacity=".7"/>`;
      s += `<path d="M0 300 Q200 290 400 302 T800 296 L800 450 L0 450 Z" fill="#e2c890"/>`;
      s += palme(60, 236, .8) + palme(740, 240, .9);
      srand(21); for (let i = 0; i < 26; i++) { const x = rnd() * 800; if (x > 340 && x < 520) continue; s += `<path d="M${x} 304 q-3 -40 ${(rnd() - .5) * 16} -${50 + rnd() * 30}" stroke="#6a8a3a" stroke-width="3" fill="none"/>`; }
      return s;
    },
    orken() {
      let s = sky("orSky", "#f2b878", "#f8e4c0");
      s += `<path d="M260 280 L420 90 L470 130 L520 100 L660 280 Z" fill="#a8785a"/><path d="M420 90 L470 130 L520 100 L540 140 L420 140 Z" fill="#b8886a"/>`;
      s += `<path d="M0 270 Q200 230 400 268 T800 250 L800 450 L0 450 Z" fill="#e0b880"/><path d="M0 330 Q300 300 500 334 T800 320 L800 450 L0 450 Z" fill="#e8c890"/>`;
      srand(31); for (let i = 0; i < 12; i++) s += `<ellipse cx="${rnd() * 800}" cy="${350 + rnd() * 90}" rx="${10 + rnd() * 16}" ry="${5 + rnd() * 6}" fill="#c8a070"/>`;
      return s;
    },
    havet() {
      let s = sky("haSky2", "#2a3a6a", "#e8a878");
      s += `<path d="M0 120 Q120 100 260 180 L330 270 L0 300 Z" fill="#2a6a9a"/><path d="M800 120 Q680 100 540 180 L470 270 L800 300 Z" fill="#2a6a9a"/>`;
      s += `<path d="M0 140 Q120 120 260 190 M800 140 Q680 120 540 190" stroke="#e8f4f8" stroke-width="6" fill="none" opacity=".7"/>`;
      for (let i = 0; i < 6; i++) s += `<path d="M${10 + i * 40} ${170 + i * 20} q20 -8 40 0 M${790 - i * 40} ${170 + i * 20} q-20 -8 -40 0" stroke="#9acde0" stroke-width="3" fill="none" opacity=".7"/>`;
      s += `<path d="M330 270 L470 270 L800 300 L800 450 L0 450 L0 300 Z" fill="#c8b890"/>`;
      srand(51); for (let i = 0; i < 18; i++) s += `<ellipse cx="${rnd() * 800}" cy="${320 + rnd() * 120}" rx="${6 + rnd() * 10}" ry="3" fill="#a89870"/>`;
      s += `<path d="M120 380 q8 -6 14 0 q-6 6 -14 0 M640 400 q8 -6 14 0 q-6 6 -14 0" fill="#e08a6a"/>`;
      return s;
    },
    sinai() {
      let s = sky("siSky", "#3a3a5a", "#c8a8a0");
      s += `<path d="M150 300 L400 60 L650 300 Z" fill="#7a6058"/><path d="M400 60 L460 120 L430 140 L400 110 L370 150 L340 118 Z" fill="#8a7068"/>`;
      s += `<ellipse cx="400" cy="70" rx="150" ry="36" fill="#5a5a72" opacity=".9"/><ellipse cx="340" cy="56" rx="80" ry="24" fill="#6a6a82"/><path d="M430 90 L410 130 L428 128 L404 176" stroke="#fff3b0" stroke-width="4" fill="none" class="flakk"/>`;
      s += `<path d="M0 290 Q200 270 400 296 T800 286 L800 450 L0 450 Z" fill="#c8a880"/>`;
      for (const [x, f] of [[90, "#a05a3a"], [170, "#c8a24a"], [630, "#7a4a8a"], [710, "#a05a3a"]]) s += `<path d="M${x - 34} 300 L${x} 256 L${x + 34} 300 Z" fill="${f}"/><path d="M${x} 256 L${x} 300" stroke="${mix(f, -.3)}" stroke-width="2"/>`;
      return s;
    },
    stue() {
      let s = `<rect width="800" height="450" fill="#e8dcc8"/>`;
      for (let x = 0; x < 800; x += 40) s += `<path d="M${x} 0 V300" stroke="#e0d2ba" stroke-width="14"/>`;
      s += gulv(300, "#9a6a40", "#8a5a34");
      s += `<rect x="600" y="50" width="150" height="150" fill="#1d2a4a"/><path d="M675 50 v150 M600 125 h150" stroke="#f4f4f4" stroke-width="6"/><circle cx="720" cy="90" r="14" fill="#fff3b0"/><circle cx="630" cy="80" r="1.6" fill="#fff"/><circle cx="650" cy="160" r="1.4" fill="#fff"/><circle cx="700" cy="170" r="1.8" fill="#fff"/><circle cx="735" cy="140" r="1.2" fill="#fff"/>`;
      s += `<rect x="40" y="70" width="100" height="70" fill="#c9a227"/><rect x="46" y="76" width="88" height="58" fill="#7aa0c8"/>`;
      s += `<rect x="150" y="318" width="500" height="22" fill="#fbfaf5"/><path d="M150 340 L170 360 L630 360 L650 340" fill="#efe8d8"/><rect x="180" y="358" width="10" height="70" fill="#6b3a1f"/><rect x="610" y="358" width="10" height="70" fill="#6b3a1f"/>`;
      s += [230, 570].map(x => `<rect x="${x - 4}" y="284" width="8" height="34" fill="#fbfaf5"/><path d="M${x} 284 q-4 -8 0 -14 q4 6 0 14" fill="#ffcf5a" class="flakk"/>`).join("");
      s += [300, 360, 450, 510].map(x => `<path d="M${x - 9} 318 L${x - 6} 298 L${x + 6} 298 L${x + 9} 318 Z" fill="#a8323e" opacity=".6"/>`).join("");
      return s;
    },
    betlehem() {
      let s = sky("beSky", "#0d1a3a", "#3a4a7a") + stjerner(70, 4);
      s += `<path d="M0 260 Q200 210 400 250 T800 240 L800 450 L0 450 Z" fill="#3a3a52"/>`;
      s += flathus(60, 300, 90, 70, "#d8ccb4") + flathus(170, 300, 70, 90, "#cfc2a8") + flathus(520, 300, 110, 80, "#d8ccb4") + flathus(650, 300, 80, 60, "#cfc2a8");
      s += `<path d="M0 300 L800 300 L800 450 L0 450 Z" fill="#6a5a48"/><path d="M0 330 Q400 316 800 334" stroke="#7a6a58" stroke-width="20" fill="none"/>`;
      s += `<g transform="translate(560 70)">${TING.stjerne()}</g>`;
      return s;
    },
    stall() {
      let s = `<rect width="800" height="450" fill="#5a4030"/>`;
      for (let x = 0; x < 800; x += 46) s += `<rect x="${x}" y="0" width="42" height="320" fill="#6a4a34"/>`;
      s += `<rect y="40" width="800" height="16" fill="#4a3020"/><path d="M0 200 L800 200" stroke="#4a3020" stroke-width="10"/>`;
      s += `<rect x="560" y="70" width="110" height="90" fill="#0d1a3a"/>${`<g transform="translate(615 110) scale(.6)">${TING.stjerne()}</g>`}<rect x="556" y="66" width="118" height="98" fill="none" stroke="#3a2418" stroke-width="8"/>`;
      s += `<rect y="320" width="800" height="130" fill="#b8963a"/>`; srand(61);
      for (let i = 0; i < 80; i++) { const x = rnd() * 800, y = 326 + rnd() * 120; s += `<path d="M${x} ${y} l${8 + rnd() * 10} ${-2 - rnd() * 4}" stroke="#d8b860" stroke-width="2"/>`; }
      s += `<circle cx="400" cy="320" r="200" fill="#fff3b0" opacity=".06"/>`;
      return s;
    },
    veien() {
      let s = sky("veSky", "#8ec3ea", "#f4e2c0");
      s += `<circle cx="120" cy="80" r="30" fill="#fff1b8"/>`;
      s += `<path d="M0 230 L120 150 L230 220 L360 120 L480 230 L620 160 L800 230 L800 450 L0 450 Z" fill="#b8987a"/><path d="M360 120 L400 160 L380 170 Z M620 160 L660 190 L640 196 Z" fill="#c8a88a"/>`;
      s += `<path d="M0 290 Q300 250 800 300 L800 450 L0 450 Z" fill="#d8bc90"/><path d="M0 380 Q300 330 520 350 T800 340" stroke="#e8d0a8" stroke-width="56" fill="none"/>`;
      srand(71); for (let i = 0; i < 14; i++) s += `<ellipse cx="${rnd() * 800}" cy="${300 + rnd() * 140}" rx="${8 + rnd() * 18}" ry="${5 + rnd() * 8}" fill="#a8906a"/>`;
      s += `<g transform="translate(90 300)"><circle cx="0" cy="-20" r="18" fill="#7a8a4a"/><circle cx="16" cy="-14" r="14" fill="#6a7a3a"/></g>`;
      return s;
    },
    jerusalem() {
      let s = sky("jeSky", "#8ec3ea", "#eaf2f6");
      s += `<rect x="300" y="60" width="200" height="110" fill="#e8dcc0"/><rect x="290" y="52" width="220" height="12" fill="#c9a227"/><rect x="330" y="90" width="140" height="80" fill="#d8ccb0"/>${[350, 380, 410, 440].map(x => `<rect x="${x}" y="100" width="8" height="70" fill="#c8bca0"/>`).join("")}`;
      s += `<rect y="170" width="800" height="130" fill="#d8c8a0"/>`; for (let y = 180; y < 300; y += 20) for (let x = (y / 20 % 2) * 30; x < 800; x += 60) s += `<rect x="${x}" y="${y}" width="58" height="18" fill="none" stroke="#c4b48a" stroke-width="1.5"/>`;
      s += `<path d="M330 300 L330 220 Q400 170 470 220 L470 300 Z" fill="#3a3028"/>`;
      for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" y="158" width="24" height="14" fill="#d8c8a0"/>`;
      s += palme(140, 310) + palme(680, 310, 1.1);
      s += `<rect y="300" width="800" height="150" fill="#c8b490"/>`;
      return s;
    },
    gravhage() {
      let s = sky("grSky", "#f4b8a0", "#fbe8c8");
      s += `<circle cx="160" cy="250" r="56" fill="#fff3b0" opacity=".9"/>`;
      s += `<path d="M0 270 Q200 240 400 266 T800 250 L800 450 L0 450 Z" fill="#8aa06a"/><path d="M0 320 Q300 300 800 330 L800 450 L0 450 Z" fill="#9ab07a"/>`;
      for (const [x, y] of [[80, 300], [230, 290], [700, 300]]) s += `<g transform="translate(${x} ${y})"><path d="M-6 0 Q-2 -30 -8 -50 L8 -50 Q4 -30 6 0 Z" fill="#6b5a4a"/><ellipse cx="0" cy="-66" rx="40" ry="26" fill="#7a9a6a"/><ellipse cx="-14" cy="-70" rx="22" ry="16" fill="#8aaa7a"/></g>`;
      srand(81); for (let i = 0; i < 30; i++) s += `<circle cx="${rnd() * 800}" cy="${340 + rnd() * 100}" r="3" fill="${["#fff", "#ffe14d", "#f2a7c0"][i % 3]}"/>`;
      return s;
    },
    kirke() {
      let s = `<rect width="800" height="450" fill="#f2efe6"/>`;
      s += `<path d="M0 0 L400 -40 L800 0 L800 60 L0 60 Z" fill="#8a5a3a"/>`; for (let x = 0; x < 800; x += 80) s += `<path d="M${x} 0 L${x + 40} 60" stroke="#6a4428" stroke-width="6"/>`;
      for (const x of [70, 650]) s += `<path d="M${x} 250 L${x} 120 Q${x + 40} 70 ${x + 80} 120 L${x + 80} 250 Z" fill="#a8c8e8"/><path d="M${x + 40} 92 V250 M${x} 170 H${x + 80}" stroke="#c9a227" stroke-width="4"/><circle cx="${x + 40}" cy="130" r="14" fill="#e8b830" opacity=".7"/>`;
      s += `<rect x="300" y="80" width="200" height="150" fill="#c9a227"/><rect x="310" y="90" width="180" height="130" fill="#3a5a8a"/><path d="M400 110 V200 M370 135 H430" stroke="#f4f1ea" stroke-width="10" stroke-linecap="round"/>`;
      s += gulv(300, "#c8a878", "#b8986a");
      for (const [x, w] of [[30, 200], [570, 200]]) s += `<rect x="${x}" y="330" width="${w}" height="16" fill="#8a5a3a"/><rect x="${x}" y="300" width="${w}" height="10" fill="#7a4a2a"/><rect x="${x}" y="346" width="${w}" height="8" fill="#6a3a1a"/>`;
      s += `<path d="M330 450 L360 300 L440 300 L470 450 Z" fill="#a8323e" opacity=".85"/>`;
      return s;
    },
    mekka() {
      let s = sky("meSky", "#8ec3ea", "#f8e4c0");
      s += `<path d="M0 240 L80 130 L180 210 L280 110 L380 200 L470 120 L580 210 L690 100 L800 220 L800 300 L0 300 Z" fill="#8a6a50"/><path d="M280 110 L310 140 L290 150 Z M690 100 L720 140 L700 146 Z" fill="#9a7a60"/>`;
      s += `<rect y="280" width="800" height="170" fill="#e0c494"/>`;
      for (const [x, f] of [[60, "#c0392b"], [150, "#2f5d9a"], [610, "#d9822b"], [700, "#2e7d32"]]) s += `<path d="M${x - 40} 300 L${x - 30} 250 L${x + 30} 250 L${x + 40} 300" fill="${f}" opacity=".85"/><path d="M${x - 30} 300 v-50 M${x + 30} 300 v-50" stroke="#6b4a2a" stroke-width="3"/>`;
      srand(91); for (let i = 0; i < 16; i++) s += `<ellipse cx="${rnd() * 800}" cy="${320 + rnd() * 120}" rx="${8 + rnd() * 12}" ry="3" fill="#c8a878"/>`;
      return s;
    },
    nur() {
      let s = sky("nuSky", "#081028", "#2a3a6a") + stjerner(90, 7);
      s += `<path d="M560 60 a28 28 0 1 0 22 46 a22 22 0 1 1 -22 -46 Z" fill="#fff3c4"/>`;
      s += `<path d="M0 450 L0 300 L160 140 L300 60 L460 150 L620 230 L800 260 L800 450 Z" fill="#4a3a32"/><path d="M300 60 L340 100 L320 110 Z" fill="#5a4a42"/>`;
      s += `<path d="M0 330 Q300 300 800 340 L800 450 L0 450 Z" fill="#3a2e28"/>`;
      srand(93); for (let i = 0; i < 30; i++) s += `<circle cx="${560 + rnd() * 240}" cy="${290 + rnd() * 30}" r="1.6" fill="#ffd54a" opacity=".7"/>`;
      return s;
    },
    thawr() {
      let s = sky("thSky", "#e88a5a", "#f8d8a8");
      s += `<circle cx="660" cy="200" r="44" fill="#fff1b8" opacity=".9"/>`;
      s += `<path d="M0 260 L120 150 L260 220 L360 120 L520 200 L800 160 L800 450 L0 450 Z" fill="#8a6a50"/>`;
      s += `<path d="M0 310 Q300 290 800 320 L800 450 L0 450 Z" fill="#a8866a"/>`;
      srand(95); for (let i = 0; i < 18; i++) s += `<path d="M${rnd() * 800} ${330 + rnd() * 110} l12 -8 l14 6 l-6 8 Z" fill="#8a6a50"/>`;
      s += `<g transform="translate(110 320)"><path d="M0 0 Q-4 -40 -20 -60 M0 -30 Q10 -50 26 -60" stroke="#6b4a2a" stroke-width="4" fill="none"/><ellipse cx="-20" cy="-66" rx="26" ry="10" fill="#6a8a3a"/><ellipse cx="26" cy="-64" rx="22" ry="9" fill="#7a9a4a"/></g>`;
      return s;
    },
    moske() {
      let s = `<rect width="800" height="450" fill="#f4efe4"/>`;
      s += `<path d="M330 300 L330 130 Q400 50 470 130 L470 300 Z" fill="#2e6a7a"/><path d="M345 300 L345 140 Q400 76 455 140 L455 300 Z" fill="#3a8a9a"/>`;
      s += `<g fill="none" stroke="#e3b53a" stroke-width="2">${[0, 1, 2].map(i => `<path d="M${370 + i * 0} ${170 + i * 30} q30 -16 60 0"/>`).join("")}</g>`;
      for (const x of [60, 200, 540, 680]) s += `<path d="M${x} 250 L${x} 120 Q${x + 30} 80 ${x + 60} 120 L${x + 60} 250 Z" fill="#a8d0e8"/><g stroke="#2e6a7a" stroke-width="2" fill="none"><path d="M${x + 30} 100 v150 M${x} 170 h60"/><circle cx="${x + 30}" cy="170" r="16"/></g>`;
      s += `<path d="M500 300 L500 180 L520 180 L520 200 L540 200 L540 220 L560 220 L560 300 Z" fill="#8a5a3a"/>`;
      s += `<rect y="40" width="800" height="14" fill="#2e6a7a"/><path d="M0 54 Q20 70 40 54 Q60 70 80 54 Q100 70 120 54 Q140 70 160 54 Q180 70 200 54 Q220 70 240 54 Q260 70 280 54 Q300 70 320 54 Q340 70 360 54 Q380 70 400 54 Q420 70 440 54 Q460 70 480 54 Q500 70 520 54 Q540 70 560 54 Q580 70 600 54 Q620 70 640 54 Q660 70 680 54 Q700 70 720 54 Q740 70 760 54 Q780 70 800 54" fill="#3a8a9a"/>`;
      s += `<rect y="300" width="800" height="150" fill="#2e7d5a"/>`; for (let y = 320; y < 450; y += 34) s += `<path d="M0 ${y} H800" stroke="#e3b53a" stroke-width="2" opacity=".6"/>`;
      for (let x = 20; x < 800; x += 60) s += `<path d="M${x} 300 L${x} 450" stroke="#26684a" stroke-width="2"/>`;
      return s;
    },
    ayodhya() {
      let s = sky("ayS", "#9cd0f0", "#fbe8c4");
      const kuppel = (x, y, w, f) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${300 - y}" fill="${f}"/><path d="M${x - w / 2 - 6} ${y} Q${x} ${y - w * .9} ${x + w / 2 + 6} ${y} Z" fill="#e3b53a"/><path d="M${x} ${y - w * .45} v-14" stroke="#c9a227" stroke-width="3"/>`;
      s += kuppel(400, 120, 120, "#f4e2c4") + kuppel(250, 170, 80, "#f0d8b0") + kuppel(550, 170, 80, "#f0d8b0") + kuppel(120, 200, 60, "#ecd2a8") + kuppel(680, 200, 60, "#ecd2a8");
      for (let x = 0; x < 800; x += 50) s += `<path d="M${x + 10} 300 L${x + 10} 250 Q${x + 25} 236 ${x + 40} 250 L${x + 40} 300" fill="#c8622a" opacity=".5"/>`;
      s += `<rect y="300" width="800" height="150" fill="#d8b888"/><path d="M0 340 Q400 320 800 344" stroke="#e8c898" stroke-width="30" fill="none"/>`;
      s += [80, 720].map(x => `<g transform="translate(${x} 300)">${TING.lotus({ s: 1.3 })}</g>`).join("");
      return s;
    },
    skog() {
      let s = sky("skS", "#a8d8c0", "#e8f4d8");
      for (const [x, y, r, f] of [[60, 160, 90, "#3a6a3a"], [200, 140, 110, "#2e5a32"], [620, 150, 110, "#2e5a32"], [760, 170, 90, "#3a6a3a"], [400, 120, 80, "#4a7a3a"]]) s += `<rect x="${x - 10}" y="${y}" width="20" height="${300 - y}" fill="#5a3a1a"/><circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
      s += `<rect y="290" width="800" height="160" fill="#7aa04a"/><path d="M0 300 Q400 280 800 304" stroke="#8ab05a" stroke-width="20" fill="none"/>`;
      srand(101); for (let i = 0; i < 30; i++) s += `<circle cx="${rnd() * 800}" cy="${320 + rnd() * 120}" r="3" fill="${["#fff", "#ffe14d", "#f08a2a"][i % 3]}"/>`;
      return s;
    },
    kyst() {
      let s = sky("kyS", "#7fb6e0", "#f8dcb0");
      s += `<rect y="210" width="800" height="120" fill="#2a7aa8"/>`; for (let y = 222; y < 320; y += 14) s += `<path d="M0 ${y} Q200 ${y - 4} 400 ${y} T800 ${y}" stroke="#5aa0c8" stroke-width="2" fill="none" opacity=".7"/>`;
      s += `<path d="M560 214 Q640 160 760 214 Z" fill="#6a8a4a"/><g fill="#e3b53a">${[600, 630, 660, 690, 720].map((x, i) => `<rect x="${x}" y="${200 - (i % 2) * 14}" width="14" height="${16 + (i % 2) * 14}"/>`).join("")}</g>`;
      s += `<path d="M0 320 Q300 300 800 330 L800 450 L0 450 Z" fill="#e8d4a0"/>`;
      s += palme(50, 330, .9) + palme(760, 336, .8);
      return s;
    },
    ayodhyaNatt() {
      let s = sky("ayN", "#060a1c", "#1a2448") + stjerner(80, 13);
      const kuppel = (x, y, w) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${300 - y}" fill="#1c2238"/><path d="M${x - w / 2 - 6} ${y} Q${x} ${y - w * .9} ${x + w / 2 + 6} ${y} Z" fill="#2a3048"/>`;
      s += kuppel(400, 120, 120) + kuppel(250, 170, 80) + kuppel(550, 170, 80) + kuppel(120, 200, 60) + kuppel(680, 200, 60);
      s += `<rect y="300" width="800" height="150" fill="#2a2420"/>`;
      return s;
    },
    mandir() {
      let s = `<rect width="800" height="450" fill="#f8e0c0"/>`;
      for (const x of [40, 170, 630, 760]) s += `<rect x="${x - 18}" y="40" width="36" height="270" fill="#c8622a"/>${[80, 140, 200, 260].map(y => `<rect x="${x - 22}" y="${y}" width="44" height="8" fill="#e3b53a"/>`).join("")}`;
      s += `<rect y="0" width="800" height="40" fill="#a8401a"/><path d="M0 40 Q40 70 80 40 Q120 70 160 40 Q200 70 240 40 Q280 70 320 40 Q360 70 400 40 Q440 70 480 40 Q520 70 560 40 Q600 70 640 40 Q680 70 720 40 Q760 70 800 40" stroke="#f08a2a" stroke-width="7" fill="none"/>`;
      s += `<path d="M270 300 L270 120 Q400 20 530 120 L530 300 Z" fill="#e8b878"/><path d="M290 300 L290 130 Q400 50 510 130 L510 300 Z" fill="#f4d8a8"/>`;
      s += gulv(310, "#e8d4b0", "#d8c098");
      s += `<g transform="translate(400 400)">${[0, 1, 2].map(i => `<circle r="${70 - i * 22}" fill="none" stroke="${["#e8622a", "#2e7d32", "#c9a227"][i]}" stroke-width="10" transform="scale(1 .3)"/>`).join("")}</g>`;
      return s;
    },
    palass() {
      let s = sky("paS", "#9cd0f0", "#f4ecd8");
      s += `<rect x="0" y="120" width="800" height="180" fill="#f2e2c4"/>`; for (let x = 20; x < 800; x += 90) s += `<path d="M${x} 300 L${x} 190 Q${x + 35} 150 ${x + 70} 190 L${x + 70} 300 Z" fill="#e0c8a0"/>`;
      s += `<rect y="110" width="800" height="14" fill="#c9a227"/>`;
      s += `<rect y="300" width="800" height="150" fill="#8ab06a"/><ellipse cx="560" cy="380" rx="150" ry="34" fill="#5aa0c8"/><ellipse cx="560" cy="380" rx="150" ry="34" fill="none" stroke="#d8c8a0" stroke-width="6"/>`;
      s += [500, 560, 620].map(x => `<g transform="translate(${x} ${378 + (x % 3)})">${TING.lotus({ s: .7 })}</g>`).join("");
      srand(111); for (let i = 0; i < 24; i++) s += `<circle cx="${rnd() * 380}" cy="${320 + rnd() * 120}" r="4" fill="${["#f2a7c0", "#ffe14d", "#fff"][i % 3]}"/>`;
      return s;
    },
    gate() {
      let s = sky("gaS", "#9cc8e8", "#f6e6c8");
      s += flathus(20, 300, 120, 140, "#e8c898") + flathus(160, 300, 100, 110, "#d8b888") + flathus(560, 300, 110, 130, "#e8c898") + flathus(690, 300, 100, 100, "#d8b888");
      s += `<path d="M300 300 L330 230 L470 230 L500 300 Z" fill="#c9a227" opacity=".4"/>`;
      s += `<rect y="300" width="800" height="150" fill="#c8a878"/><path d="M0 360 Q400 340 800 366" stroke="#d8b888" stroke-width="40" fill="none"/>`;
      return s;
    },
    elv() {
      let s = sky("elS", "#a8d0e8", "#f8e8c8");
      s += `<path d="M0 230 Q200 200 400 226 T800 214 L800 300 L0 300 Z" fill="#8aa86a"/>`;
      s += `<rect y="250" width="800" height="50" fill="#5a9ac0"/>`; for (let y = 258; y < 296; y += 10) s += `<path d="M0 ${y} Q200 ${y - 3} 400 ${y} T800 ${y}" stroke="#7ab4d8" stroke-width="2" fill="none" opacity=".7"/>`;
      s += `<path d="M0 296 Q400 284 800 300 L800 450 L0 450 Z" fill="#e2cc98"/>`;
      s += palme(700, 300, .9) + palme(80, 300, .7);
      return s;
    },
    bodhi() {
      let s = sky("boS", "#2a2a5a", "#f0a878") + stjerner(30, 17, 120);
      s += `<path d="M0 300 Q400 270 800 300 L800 450 L0 450 Z" fill="#8a7a4a"/>`;
      s += `<g transform="translate(400 316)">${TING.bodhitre()}</g>`;
      s += `<ellipse cx="400" cy="330" rx="120" ry="14" fill="#a89a6a"/>`;
      return s;
    },
    landsby() {
      let s = sky("laS", "#a8c8e0", "#f2e2c8");
      s += `<path d="M0 220 Q400 190 800 224 L800 300 L0 300 Z" fill="#8aa06a"/>`;
      for (const x of [110, 400, 690]) s += `<rect x="${x - 90}" y="160" width="180" height="140" fill="#d8b888"/><path d="M${x - 104} 164 L${x} 100 L${x + 104} 164 Z" fill="#a8783a"/><rect x="${x - 70}" y="200" width="24" height="24" fill="#5a3a1a"/>`;
      s += `<rect y="300" width="800" height="150" fill="#c8b07a"/><path d="M0 360 Q400 340 800 364" stroke="#d8c08a" stroke-width="40" fill="none"/>`;
      return s;
    },
    pagode() {
      let s = `<rect width="800" height="450" fill="#f8ecd0"/>`;
      for (const x of [60, 200, 600, 740]) s += `<rect x="${x - 16}" y="30" width="32" height="290" fill="#a8261e"/><rect x="${x - 20}" y="30" width="40" height="10" fill="#e3b53a"/>`;
      s += `<rect y="0" width="800" height="34" fill="#7a1a14"/>`;
      s += `<path d="M260 310 L260 110 L540 110 L540 310 Z" fill="#e8c860"/><path d="M240 110 Q400 70 560 110 Z" fill="#a8261e"/><rect x="280" y="130" width="240" height="180" fill="#f4dc88"/>`;
      s += gulv(310, "#b8603a", "#a85030");
      return s;
    },
  };
  Object.assign(K.BG, BG);

  /* ---------- portretter (hodeutsnitt) for de nye figurene ---------- */
  const PVB = {
    lumi: "-34 -128 68 68", glupsk: "-24 -108 64 64", lys: "-36 -196 72 72", flamme: "-36 -196 72 72",
    sander: "-34 -142 68 68", mirjam: "-34 -142 68 68", daniel: "-34 -142 68 68", ingrid: "-34 -142 68 68", yasmin: "-34 -142 68 68", priya: "-34 -142 68 68", linh: "-34 -142 68 68",
    farao: "-46 -232 92 92", engel: "-40 -214 80 80", vismann: "-42 -222 84 84", ravana: "-60 -240 120 120", hanuman: "-40 -224 80 80", rama: "-40 -232 80 80", lakshmana: "-40 -226 80 80",
    suddhodana: "-40 -232 80 80", mara: "-44 -240 88 88", ba: "-36 -206 72 72", siddhartha: "-40 -218 80 80", gammel: "-36 -206 72 72", skadet: "-38 -210 76 76",
    asket: "-40 -218 80 80", buddhaP: "-40 -218 80 80", moses: "-40 -214 80 80", josef: "-40 -214 80 80", gjeter: "-40 -214 80 80", vannselger: "-40 -214 80 80", forfolger: "-40 -214 80 80",
  };
  const gammelPortrett = K.portrett;
  K.portrett = function (navn, o) {
    if (navn === "skadet") return `<svg viewBox="-38 -210 76 76" xmlns="http://www.w3.org/2000/svg">${P({ hud: OST2, har: "#3a2a1a", harType: "kort", skjegg: "stubb", kjole: true, kjoleF: "#d8cfbf", uttrykk: "lei", mager: true }, PY.bandasje())}</svg>`;
    if (PVB[navn] && K.FIG[navn]) return `<svg viewBox="${PVB[navn]}" xmlns="http://www.w3.org/2000/svg">${K.FIG[navn](o || {})}</svg>`;
    return gammelPortrett(navn, o);
  };
})();
