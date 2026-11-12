/* ==========================================================================
   TIDSREISEN – tegningene (SVG). Verden er 800 × 450.
   - KUNST.bg[navn]()        tegner en hel bakgrunn
   - KUNST.ting[navn](o)     tegner en ting med bunnen midt på (0,0)
   - KUNST.fig[navn](o)      tegner en person/figur med føttene i (0,0)
   - KUNST.portrett(navn)    et hode-utsnitt til dialogboksen
   Nye figurer lages enklest med KUNST.person({...}) – se forhåndsvalgene i FIG.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- hjelpere ---------- */
  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const srand = s => { seed = s; };
  const mix = (hex, f) => {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = f < 0 ? 0 : 255, p = Math.abs(f);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  const pick = a => a[Math.floor(rnd() * a.length)];

  /* ======================================================================
     PERSONER
     ====================================================================== */
  function person(o) {
    o = Object.assign({
      hud: "#f1c7a3", har: "#5b3a1e", harType: "kort", frakk: "#4a6fa5", vest: "#e9dcc0", bukse: "#3b3b46",
      strompe: "#f2efe6", sko: "#2a2420", kjole: false, kjoleF: "#a0526e", forkle: null, uttrykk: "glad",
      krage: null, hand: null, skala: 1, briller: false, kappe: null, mager: false, skjegg: null, rosett: null,
    }, o);
    const hudM = mix(o.hud, -.18), L = [];
    const W = o.mager ? 0.86 : 1;
    L.push(`<ellipse cx="0" cy="0" rx="34" ry="6" fill="#000" opacity=".16"/>`);
    if (o.kappe) L.push(`<path d="M-30 -138 Q-46 -60 -42 -6 L42 -6 Q46 -60 30 -138 Z" fill="${o.kappe}"/>`);
    // bein
    if (!o.kjole) {
      L.push(`<rect x="${-15 * W}" y="-74" width="${11 * W}" height="36" rx="4" fill="${o.bukse}"/><rect x="${4 * W}" y="-74" width="${11 * W}" height="36" rx="4" fill="${o.bukse}"/>`);
      L.push(`<rect x="${-14 * W}" y="-42" width="${9 * W}" height="38" rx="3" fill="${o.strompe}"/><rect x="${5 * W}" y="-42" width="${9 * W}" height="38" rx="3" fill="${o.strompe}"/>`);
      L.push(`<ellipse cx="${-11 * W}" cy="-4" rx="10" ry="5" fill="${o.sko}"/><ellipse cx="${11 * W}" cy="-4" rx="10" ry="5" fill="${o.sko}"/>`);
    } else {
      L.push(`<ellipse cx="-10" cy="-4" rx="9" ry="4.5" fill="${o.sko}"/><ellipse cx="10" cy="-4" rx="9" ry="4.5" fill="${o.sko}"/>`);
      L.push(`<path d="M${-21 * W} -98 Q${-40 * W} -40 ${-42 * W} -6 Q0 2 ${42 * W} -6 Q${40 * W} -40 ${21 * W} -98 Z" fill="${o.kjoleF}"/>`);
      L.push(`<path d="M${-36 * W} -24 Q0 -16 ${36 * W} -24" stroke="${mix(o.kjoleF, -.2)}" stroke-width="3" fill="none"/>`);
      if (o.forkle) L.push(`<path d="M-15 -96 L-20 -14 Q0 -8 20 -14 L15 -96 Z" fill="${o.forkle}"/>`);
    }
    // kropp / frakk
    const fr = o.kjole ? o.kjoleF : o.frakk;
    if (!o.kjole) {
      L.push(`<path d="M${-27 * W} -140 Q${-31 * W} -100 ${-30 * W} -46 L${-6} -52 L0 -100 L6 -52 L${30 * W} -46 Q${31 * W} -100 ${27 * W} -140 Q0 -150 ${-27 * W} -140 Z" fill="${fr}"/>`);
      L.push(`<path d="M-9 -140 L-7 -76 Q0 -72 7 -76 L9 -140 Z" fill="${o.vest}"/>`);
      L.push(`<circle cx="0" cy="-120" r="1.8" fill="${mix(o.vest, -.35)}"/><circle cx="0" cy="-106" r="1.8" fill="${mix(o.vest, -.35)}"/><circle cx="0" cy="-92" r="1.8" fill="${mix(o.vest, -.35)}"/>`);
    } else {
      L.push(`<path d="M${-22 * W} -140 Q${-25 * W} -115 ${-21 * W} -96 L${21 * W} -96 Q${25 * W} -115 ${22 * W} -140 Q0 -148 ${-22 * W} -140 Z" fill="${fr}"/>`);
      L.push(`<path d="M-14 -141 Q0 -128 14 -141" fill="${mix(fr, .35)}"/>`);
    }
    // armer
    const arm = mix(fr, -.12);
    L.push(`<path d="M${-26 * W} -138 Q${-38 * W} -110 ${-34 * W} -84" stroke="${arm}" stroke-width="12" stroke-linecap="round" fill="none"/>`);
    L.push(`<path d="M${26 * W} -138 Q${38 * W} -110 ${34 * W} -84" stroke="${arm}" stroke-width="12" stroke-linecap="round" fill="none"/>`);
    L.push(`<circle cx="${-34 * W}" cy="-80" r="6.5" fill="${o.hud}"/><circle cx="${34 * W}" cy="-80" r="6.5" fill="${o.hud}"/>`);
    // hals og krage
    L.push(`<rect x="-6" y="-150" width="12" height="12" fill="${hudM}"/>`);
    if (o.krage === "jabot") L.push(`<path d="M-7 -142 Q0 -120 7 -142 Q4 -128 0 -118 Q-4 -128 -7 -142 Z" fill="#fff" stroke="#ddd" stroke-width=".8"/>`);
    if (o.krage === "prest") L.push(`<rect x="-8" y="-146" width="16" height="6" rx="2" fill="#fff"/>`);
    if (o.krage === "hvit") L.push(`<path d="M-14 -144 Q0 -134 14 -144 L10 -138 Q0 -130 -10 -138 Z" fill="#fff"/>`);
    if (o.rosett) L.push(`<circle cx="-16" cy="-130" r="5" fill="#1f3d7a"/><circle cx="-16" cy="-130" r="3.4" fill="#fff"/><circle cx="-16" cy="-130" r="1.8" fill="#c0392b"/>`);
    // hode
    const hy = -168;
    if (o.harType === "parykkLang" || o.harType === "krollLang") L.push(`<path d="M-24 ${hy - 6} Q-34 ${hy + 30} -26 ${hy + 40} L-14 ${hy + 34} L-16 ${hy} Z M24 ${hy - 6} Q34 ${hy + 30} 26 ${hy + 40} L14 ${hy + 34} L16 ${hy} Z" fill="${o.har}"/>`);
    if (o.harType === "langt") L.push(`<path d="M-22 ${hy - 4} Q-28 ${hy + 26} -20 ${hy + 34} L20 ${hy + 34} Q28 ${hy + 26} 22 ${hy - 4} Z" fill="${o.har}"/>`);
    L.push(`<circle cx="-21" cy="${hy + 2}" r="5" fill="${o.hud}"/><circle cx="21" cy="${hy + 2}" r="5" fill="${o.hud}"/>`);
    L.push(`<ellipse cx="0" cy="${hy}" rx="21" ry="23" fill="${o.hud}"/>`);
    // ansikt
    const ey = hy - 1;
    const oye = x => o.uttrykk === "lukket" ? `<path d="M${x - 4} ${ey} Q${x} ${ey + 3} ${x + 4} ${ey}" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${x}" cy="${ey}" rx="3" ry="${o.uttrykk === "overrasket" ? 4.2 : 3.4}" fill="#222"/><circle cx="${x + 1}" cy="${ey - 1.2}" r="1" fill="#fff"/>`;
    L.push(oye(-8) + oye(8));
    const bryn = { sint: [`M-13 ${ey - 9} L-4 ${ey - 5}`, `M13 ${ey - 9} L4 ${ey - 5}`], lei: [`M-13 ${ey - 5} L-4 ${ey - 8}`, `M13 ${ey - 5} L4 ${ey - 8}`],
      overrasket: [`M-13 ${ey - 10} Q-8 ${ey - 13} -3 ${ey - 10}`, `M13 ${ey - 10} Q8 ${ey - 13} 3 ${ey - 10}`], lur: [`M-13 ${ey - 7} L-4 ${ey - 7}`, `M13 ${ey - 9} L4 ${ey - 6}`] }[o.uttrykk]
      || [`M-13 ${ey - 7} Q-8 ${ey - 10} -3 ${ey - 7}`, `M13 ${ey - 7} Q8 ${ey - 10} 3 ${ey - 7}`];
    L.push(`<path d="${bryn[0]} ${bryn[1]}" stroke="${mix(o.har === "#f4f1ea" || o.har === "#e8e4da" ? "#8a8a8a" : o.har, -.2)}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`);
    L.push(`<path d="M0 ${ey + 2} Q3 ${ey + 8} -1 ${ey + 10}" stroke="${mix(o.hud, -.3)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
    const my = hy + 13;
    const munn = { glad: `<path d="M-7 ${my} Q0 ${my + 7} 7 ${my}" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
      lei: `<path d="M-6 ${my + 4} Q0 ${my - 1} 6 ${my + 4}" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
      sint: `<path d="M-7 ${my + 3} L7 ${my + 1}" stroke="#7a3b2e" stroke-width="2.6" stroke-linecap="round"/>`,
      overrasket: `<ellipse cx="0" cy="${my + 2}" rx="4" ry="5" fill="#7a3b2e"/>`,
      lur: `<path d="M-6 ${my + 1} Q2 ${my + 6} 8 ${my - 2}" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
      noytral: `<path d="M-5 ${my + 2} L5 ${my + 2}" stroke="#7a3b2e" stroke-width="2.4" stroke-linecap="round"/>`,
      lukket: `<path d="M-6 ${my} Q0 ${my + 5} 6 ${my}" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>` }[o.uttrykk] || "";
    L.push(munn);
    L.push(`<circle cx="-13" cy="${hy + 7}" r="4" fill="#ff7a7a" opacity=".25"/><circle cx="13" cy="${hy + 7}" r="4" fill="#ff7a7a" opacity=".25"/>`);
    if (o.skjegg === "stubb") L.push(`<path d="M-15 ${hy + 8} Q0 ${hy + 26} 15 ${hy + 8} Q0 ${hy + 20} -15 ${hy + 8} Z" fill="${mix(o.har, .1)}" opacity=".45"/>`);
    if (o.briller) L.push(`<g stroke="#333" stroke-width="1.6" fill="none"><circle cx="-8" cy="${ey}" r="6"/><circle cx="8" cy="${ey}" r="6"/><path d="M-2 ${ey} L2 ${ey}"/></g>`);
    // hår og hodeplagg
    const h = o.har, hk = mix(h, -.18);
    const HAR = {
      kort: `<path d="M-21 ${hy - 4} Q-22 ${hy - 26} 0 ${hy - 25} Q22 ${hy - 26} 21 ${hy - 4} Q14 ${hy - 16} 0 ${hy - 15} Q-12 ${hy - 16} -21 ${hy - 4} Z" fill="${h}"/>`,
      rufsete: `<path d="M-22 ${hy - 2} L-24 ${hy - 14} L-17 ${hy - 20} L-18 ${hy - 28} L-6 ${hy - 25} L0 ${hy - 31} L7 ${hy - 25} L18 ${hy - 28} L17 ${hy - 19} L24 ${hy - 14} L22 ${hy - 2} Q12 ${hy - 14} 0 ${hy - 13} Q-12 ${hy - 14} -22 ${hy - 2} Z" fill="${h}"/>`,
      parykk: `<path d="M-22 ${hy - 2} Q-24 ${hy - 26} 0 ${hy - 26} Q24 ${hy - 26} 22 ${hy - 2} Q14 ${hy - 14} 0 ${hy - 14} Q-14 ${hy - 14} -22 ${hy - 2} Z" fill="${h}"/>
               <circle cx="-23" cy="${hy - 2}" r="5" fill="${h}" stroke="${hk}" stroke-width=".8"/><circle cx="-23" cy="${hy + 8}" r="5" fill="${h}" stroke="${hk}" stroke-width=".8"/>
               <circle cx="23" cy="${hy - 2}" r="5" fill="${h}" stroke="${hk}" stroke-width=".8"/><circle cx="23" cy="${hy + 8}" r="5" fill="${h}" stroke="${hk}" stroke-width=".8"/>`,
      parykkLang: `<path d="M-23 ${hy + 4} Q-27 ${hy - 28} 0 ${hy - 27} Q27 ${hy - 28} 23 ${hy + 4} Q18 ${hy - 12} 0 ${hy - 14} Q-18 ${hy - 12} -23 ${hy + 4} Z" fill="${h}"/>`,
      krollLang: `<path d="M-23 ${hy + 4} Q-27 ${hy - 28} 0 ${hy - 27} Q27 ${hy - 28} 23 ${hy + 4} Q18 ${hy - 12} 0 ${hy - 14} Q-18 ${hy - 12} -23 ${hy + 4} Z" fill="${h}"/>`,
      langt: `<path d="M-22 ${hy + 2} Q-24 ${hy - 26} 0 ${hy - 26} Q24 ${hy - 26} 22 ${hy + 2} Q16 ${hy - 14} 2 ${hy - 16} Q-14 ${hy - 10} -22 ${hy + 2} Z" fill="${h}"/>`,
      oppsatt: `<path d="M-21 ${hy - 2} Q-22 ${hy - 26} 0 ${hy - 25} Q22 ${hy - 26} 21 ${hy - 2} Q12 ${hy - 14} 0 ${hy - 14} Q-12 ${hy - 14} -21 ${hy - 2} Z" fill="${h}"/>
               <ellipse cx="0" cy="${hy - 40}" rx="18" ry="20" fill="${h}"/><circle cx="-9" cy="${hy - 50}" r="5" fill="${mix(h, .25)}"/><circle cx="8" cy="${hy - 34}" r="4" fill="${mix(h, .25)}"/>
               <path d="M10 ${hy - 58} q8 -14 16 -4" stroke="#c0392b" stroke-width="3" fill="none"/>`,
      skallet: `<path d="M-21 ${hy - 2} Q-22 ${hy - 10} -18 ${hy - 12} M21 ${hy - 2} Q22 ${hy - 10} 18 ${hy - 12}" stroke="${h}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    };
    L.push(HAR[o.harType] || HAR.kort);
    const HATT = {
      lue: `<path d="M-23 ${hy - 10} Q-20 ${hy - 34} 4 ${hy - 33} Q26 ${hy - 30} 23 ${hy - 10} Z" fill="${o.lueF || "#8b3a2b"}"/><path d="M-24 ${hy - 10} L24 ${hy - 10}" stroke="${mix(o.lueF || "#8b3a2b", -.2)}" stroke-width="5" stroke-linecap="round"/>`,
      rodlue: `<path d="M-22 ${hy - 10} Q-18 ${hy - 36} 6 ${hy - 34} Q30 ${hy - 30} 34 ${hy - 14} Q26 ${hy - 20} 22 ${hy - 12} Z" fill="#c0392b"/><path d="M-23 ${hy - 10} L23 ${hy - 10}" stroke="#9a2a20" stroke-width="5" stroke-linecap="round"/>`,
      skaut: `<path d="M-25 ${hy + 6} Q-28 ${hy - 30} 0 ${hy - 30} Q28 ${hy - 30} 25 ${hy + 6} Q20 ${hy - 14} 0 ${hy - 16} Q-20 ${hy - 14} -25 ${hy + 6} Z" fill="${o.skautF || "#e8e0cc"}"/>`,
      tricorn: `<path d="M-34 ${hy - 14} Q0 ${hy - 4} 34 ${hy - 14} Q22 ${hy - 22} 18 ${hy - 36} Q0 ${hy - 28} -18 ${hy - 36} Q-22 ${hy - 22} -34 ${hy - 14} Z" fill="${o.hattF || "#2a2a2a"}"/><path d="M-30 ${hy - 15} Q0 ${hy - 7} 30 ${hy - 15}" stroke="#c9a227" stroke-width="1.6" fill="none"/>`,
      prest: `<ellipse cx="0" cy="${hy - 14}" rx="34" ry="7" fill="#1d1d1d"/><path d="M-17 ${hy - 14} Q-16 ${hy - 34} 0 ${hy - 34} Q16 ${hy - 34} 17 ${hy - 14} Z" fill="#1d1d1d"/>`,
      kappe: `<path d="M-24 ${hy + 2} Q-26 ${hy - 30} 0 ${hy - 32} Q26 ${hy - 30} 24 ${hy + 2} Q18 ${hy - 18} 0 ${hy - 18} Q-18 ${hy - 18} -24 ${hy + 2} Z" fill="${o.kappe || "#1b1b22"}"/>`,
      topphatt: `<rect x="-17" y="${hy - 58}" width="34" height="40" rx="3" fill="#1b1b22"/><ellipse cx="0" cy="${hy - 18}" rx="30" ry="6" fill="#1b1b22"/><rect x="-17" y="${hy - 28}" width="34" height="5" fill="#6a1f2b"/>`,
    };
    if (o.hatt) L.push(HATT[o.hatt] || "");
    // ting i hånda
    const HAND = {
      penn: `<path d="M38 -84 L54 -122" stroke="#333" stroke-width="1.6"/><path d="M54 -122 Q64 -138 58 -150 Q48 -134 50 -120 Z" fill="#f4f1ea" stroke="#bbb" stroke-width=".8"/>`,
      bok: `<rect x="24" y="-96" width="22" height="28" rx="2" fill="#7a2e2e"/><rect x="26" y="-94" width="4" height="24" fill="#f4e7c9"/>`,
      hakke: `<path d="M-36 -40 L-36 -150" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/><path d="M-36 -150 Q-52 -150 -60 -140 L-36 -144 Z" fill="#888"/>`,
      stokk: `<path d="M38 -78 L44 -2" stroke="#4a3220" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="-80" r="5" fill="#c9a227"/>`,
      vifte: `<path d="M36 -84 L22 -112 Q36 -120 50 -112 Z" fill="#f3c6d3" stroke="#c78a9c" stroke-width="1"/>`,
      papir: `<rect x="26" y="-104" width="26" height="32" rx="1" fill="#fbf6e8" stroke="#c9b98f" transform="rotate(8 38 -88)"/><path d="M30 -96 h16 M30 -90 h18 M30 -84 h14" stroke="#9a8a6a" stroke-width="1.4" transform="rotate(8 38 -88)"/>`,
      eple: `<circle cx="40" cy="-84" r="8" fill="#c8312b"/><path d="M40 -92 q2 -6 6 -6" stroke="#4a3220" stroke-width="1.6" fill="none"/>`,
      kors: `<path d="M0 -128 v20 M-6 -122 h12" stroke="#c9a227" stroke-width="3" stroke-linecap="round"/>`,
      pung: `<path d="M28 -86 Q24 -64 40 -62 Q56 -64 52 -86 Q40 -92 28 -86 Z" fill="#8a6a2a"/><path d="M30 -88 Q40 -94 50 -88" stroke="#5a4316" stroke-width="2" fill="none"/>`,
    };
    if (o.hand) L.push(HAND[o.hand] || "");
    if (o.hand === "kors") L.push("");
    return `<g transform="scale(${o.skala})">${L.join("")}</g>`;
  }

  /* Minerva – mekanisk ugle i messing. Bunnen (føttene) i (0,0). */
  function ugle(o) {
    o = Object.assign({ blunk: false, skala: 1 }, o);
    const b = "#b0832f", bm = "#8a6320", bl = "#d9b25c";
    const oye = x => o.blunk ? `<path d="M${x - 9} -60 Q${x} -54 ${x + 9} -60" stroke="#3a2a10" stroke-width="3" fill="none"/>`
      : `<circle cx="${x}" cy="-60" r="11" fill="#f6e7b0" stroke="${bm}" stroke-width="3"/><circle cx="${x}" cy="-60" r="5.5" fill="#1d3557"/><circle cx="${x + 2}" cy="-62" r="1.8" fill="#fff"/>`;
    return `<g transform="scale(${o.skala})">
      <ellipse cx="0" cy="0" rx="26" ry="4" fill="#000" opacity=".16"/>
      <path d="M-12 -2 l-4 4 M-8 -2 l0 5 M8 -2 l0 5 M12 -2 l4 4" stroke="${bm}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="0" cy="-34" rx="26" ry="32" fill="${b}"/>
      <ellipse cx="0" cy="-28" rx="16" ry="20" fill="${bl}"/>
      <path d="M-8 -36 q4 4 8 0 q4 4 8 0 M-10 -26 q5 4 10 0 q5 4 10 0 M-8 -16 q4 4 8 0 q4 4 8 0" stroke="${bm}" stroke-width="1.6" fill="none"/>
      <path d="M-26 -42 Q-36 -20 -20 -6 Q-24 -26 -20 -40 Z" fill="${bm}"/><path d="M26 -42 Q36 -20 20 -6 Q24 -26 20 -40 Z" fill="${bm}"/>
      <path d="M-22 -72 L-26 -92 L-10 -78 Z M22 -72 L26 -92 L10 -78 Z" fill="${bm}"/>
      <ellipse cx="0" cy="-62" rx="25" ry="18" fill="${b}"/>
      ${oye(-11)}${oye(11)}
      <path d="M-4 -52 L0 -44 L4 -52 Z" fill="#e0a030"/>
      <g transform="translate(0 -24)"><circle r="5" fill="none" stroke="${bm}" stroke-width="2"/><path d="M0 -7 v3 M0 4 v3 M-7 0 h3 M4 0 h3" stroke="${bm}" stroke-width="2"/></g>
    </g>`;
  }

  /* ---------- forhåndsvalg for figurene ---------- */
  const FIG = {
    ugle: o => ugle(o),
    bonde: o => person(Object.assign({ hud: "#e2b48c", har: "#4a3424", harType: "rufsete", frakk: "#8a7350", vest: "#c9b48a", bukse: "#6b5a3e", strompe: "#a89a7a", sko: "#4a3a2a", uttrykk: "lei", hatt: "lue", lueF: "#6b4a2a", mager: true, hand: "hakke", skjegg: "stubb" }, o)),
    kone: o => person(Object.assign({ hud: "#e8bc96", har: "#6a4228", kjole: true, kjoleF: "#7a6a8a", forkle: "#d9cfb8", hatt: "skaut", skautF: "#efe7d4", uttrykk: "lei", mager: true }, o)),
    barn: o => person(Object.assign({ hud: "#efc9a4", har: "#8a5a2a", harType: "rufsete", frakk: "#9a8a6a", vest: "#d9cfb8", bukse: "#7a6a4a", strompe: "#efc9a4", sko: "#5a4a3a", uttrykk: "lei", skala: .62, mager: true }, o)),
    prest: o => person(Object.assign({ hud: "#f0c8a8", har: "#7a7a7a", harType: "skallet", frakk: "#1d1d1d", vest: "#1d1d1d", bukse: "#1d1d1d", strompe: "#1d1d1d", krage: "prest", hatt: "prest", hand: "kors", uttrykk: "noytral" }, o)),
    skattefogd: o => person(Object.assign({ hud: "#f1c7a3", har: "#e8e4da", harType: "parykk", frakk: "#5a2a3a", vest: "#d9b25c", bukse: "#3a2a2a", hatt: "tricorn", hand: "pung", uttrykk: "lur" }, o)),
    forvalter: o => person(Object.assign({ hud: "#f3cfae", har: "#3a2a1a", harType: "kort", frakk: "#2a4a3a", vest: "#c9b48a", bukse: "#2a3a2a", hatt: "tricorn", hattF: "#3a2a1a", hand: "papir", uttrykk: "noytral" }, o)),
    skriver: o => person(Object.assign({ hud: "#f1c7a3", har: "#2a2a2a", harType: "kort", frakk: "#2b3e5a", vest: "#efe6d0", bukse: "#2a2a35", briller: true, krage: "hvit", hand: "penn", uttrykk: "glad", rosett: false }, o)),
    smed: o => person(Object.assign({ hud: "#d9a37a", har: "#2a1a10", harType: "kort", frakk: "#6a3a2a", vest: "#4a3a2a", bukse: "#3a2a20", strompe: "#3a2a20", uttrykk: "sint", skjegg: "stubb" }, o)),
    greve: o => person(Object.assign({ hud: "#f6d5bb", har: "#f4f1ea", harType: "parykk", frakk: "#6a2a7a", vest: "#e8c870", bukse: "#4a2a5a", krage: "jabot", hatt: "tricorn", hand: "stokk", uttrykk: "lur" }, o)),
    glemsel: o => person(Object.assign({ hud: "#d8d2e0", har: "#1b1b22", harType: "kort", frakk: "#1b1b22", vest: "#3a2a4a", bukse: "#1b1b22", strompe: "#1b1b22", sko: "#000", kappe: "#2a1b3a", hatt: "topphatt", uttrykk: "lur" }, o)),
    sensor: o => person(Object.assign({ hud: "#d8d2e0", har: "#e8e4da", harType: "parykk", frakk: "#2a2a35", vest: "#555", bukse: "#2a2a35", hatt: "tricorn", hand: "papir", uttrykk: "sint", briller: true }, o)),
    newton: o => person(Object.assign({ hud: "#f3d2b5", har: "#e8e4da", harType: "parykkLang", frakk: "#5a3a6a", vest: "#d8c8a8", bukse: "#3a2a3a", krage: "hvit", uttrykk: "lei" }, o)),
    madame: o => person(Object.assign({ hud: "#f7d8c0", har: "#f4f1ea", harType: "oppsatt", kjole: true, kjoleF: "#3a7a8a", uttrykk: "glad", hand: "vifte" }, o)),
    locke: o => person(Object.assign({ hud: "#f0cfb0", har: "#7a5a3a", harType: "langt", frakk: "#3a3a3a", vest: "#3a3a3a", bukse: "#2a2a2a", krage: "hvit", hand: "bok", uttrykk: "glad", mager: true }, o)),
    montesquieu: o => person(Object.assign({ hud: "#f3d2b5", har: "#f4f1ea", harType: "parykk", frakk: "#7a1f2b", vest: "#e8d8b0", bukse: "#3a1f2b", krage: "jabot", hand: "bok", uttrykk: "noytral" }, o)),
    voltaire: o => person(Object.assign({ hud: "#f0cfb0", har: "#d8cfbf", harType: "krollLang", frakk: "#7a5a2a", vest: "#efe0b8", bukse: "#4a3a2a", krage: "jabot", hand: "penn", uttrykk: "lur", mager: true }, o)),
    rousseau: o => person(Object.assign({ hud: "#e8c4a0", har: "#4a3424", harType: "kort", frakk: "#4a5a3a", vest: "#c9b48a", bukse: "#3a3a2a", uttrykk: "sint", hand: "papir" }, o)),
    kant: o => person(Object.assign({ hud: "#f3d8c0", har: "#f4f1ea", harType: "parykk", frakk: "#3a4a6a", vest: "#d8d0c0", bukse: "#2a3040", krage: "hvit", hand: "stokk", uttrykk: "noytral", mager: true, skala: .92 }, o)),
    // portrettbilder til dialog for ting/forteller
    forteller: () => `<g><circle cx="0" cy="-160" r="30" fill="#f2eadb"/><text x="0" y="-148" font-size="34" text-anchor="middle">📜</text></g>`,
  };

  /* ======================================================================
     TING (bunnen midt på i 0,0)
     ====================================================================== */
  const TING = {
    plakatvegg(o) {
      o = o || {};
      const f = o.blek ? .25 : 1;
      const p = (x, farge, ikon, tekst) => `<g transform="translate(${x} 0)"><rect x="-38" y="-130" width="76" height="100" rx="4" fill="#fff" stroke="#d6d6d6"/>
        <rect x="-38" y="-130" width="76" height="26" rx="4" fill="${farge}" opacity="${f}"/><text x="0" y="-74" font-size="28" text-anchor="middle" opacity="${f}">${ikon}</text>
        <text x="0" y="-44" font-size="11" font-family="Atkinson Hyperlegible,Arial" font-weight="700" text-anchor="middle" fill="#333" opacity="${f}">${tekst}</text></g>`;
      return `<g class="${o.blek ? "flakk" : ""}">${p(-84, "#c0392b", "🗣️", "YTRINGSFRIHET")}${p(0, "#1f3d7a", "🗳️", "STEMMERETT")}${p(84, "#2e7d32", "⚖️", "LIKE FOR LOVEN")}</g>`;
    },
    teleskop: () => `<g><path d="M-30 0 L0 -70 L30 0 M0 -70 L0 0" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round" fill="none"/>
      <g transform="rotate(-28 0 -76)"><rect x="-56" y="-88" width="112" height="22" rx="6" fill="#c9a227"/><rect x="40" y="-92" width="24" height="30" rx="5" fill="#b0832f"/>
      <rect x="-70" y="-84" width="16" height="14" rx="3" fill="#8a6320"/><path d="M-30 -88 v22 M10 -88 v22" stroke="#8a6320" stroke-width="3"/></g>
      <text x="0" y="-8" font-size="10" text-anchor="middle" fill="#5a3a1a" font-family="Georgia">1687</text></g>`,
    monter: o => `<g><rect x="-44" y="-40" width="88" height="40" fill="#6b4a2a"/><rect x="-48" y="-44" width="96" height="8" fill="#8a6a4a"/>
      <g transform="translate(0 -44)">${ugle({ blunk: !o || !o.vaken })}</g>
      ${o && o.vaken ? "" : `<rect x="-42" y="-150" width="84" height="106" fill="#bfe3f0" opacity=".28" stroke="#9cc" stroke-width="2"/>`}</g>`,
    bokhylle: () => {
      srand(7); let s = `<rect x="-90" y="-250" width="180" height="250" fill="#8a6a4a"/><rect x="-84" y="-244" width="168" height="238" fill="#5a4030"/>`;
      for (let r = 0; r < 4; r++) {
        const y = -244 + r * 60; s += `<rect x="-86" y="${y + 54}" width="172" height="6" fill="#8a6a4a"/>`;
        let x = -82; while (x < 76) { const w = 8 + Math.floor(rnd() * 8), h = 34 + Math.floor(rnd() * 16); s += `<rect x="${x}" y="${y + 54 - h}" width="${w}" height="${h}" fill="${pick(["#c0392b", "#1f3d7a", "#2e7d32", "#c9a227", "#6a2a7a", "#e67e22", "#16a085", "#7f8c8d"])}"/>`; x += w + 1; }
      }
      return s;
    },
    matpakke: () => `<g><rect x="-22" y="-16" width="44" height="16" rx="3" fill="#cfd8dc" stroke="#90a4ae"/><rect x="-24" y="-20" width="48" height="6" rx="3" fill="#b0bec5"/></g>`,
    sekker: o => {
      const n = o && o.n != null ? o.n : 12; let s = "";
      for (let i = 0; i < n; i++) { const x = (i % 6) * 26 - 66, y = -Math.floor(i / 6) * 26; s += `<g transform="translate(${x} ${y})"><path d="M-12 0 Q-15 -20 -8 -26 L8 -26 Q15 -20 12 0 Z" fill="#c9a66b" stroke="#8a6a3a" stroke-width="1.5"/><path d="M-8 -26 L-4 -31 L4 -31 L8 -26" fill="#b08a50"/></g>`; }
      return s;
    },
    stabbe: () => `<g><rect x="-24" y="-30" width="48" height="30" fill="#7a5a3a"/><ellipse cx="0" cy="-30" rx="24" ry="7" fill="#a07a50"/></g>`,
    slott: () => `<g><rect x="-60" y="-50" width="120" height="50" fill="#bdb7ab"/><rect x="-74" y="-80" width="24" height="80" fill="#aaa498"/><rect x="50" y="-80" width="24" height="80" fill="#aaa498"/>
      <path d="M-78 -80 L-62 -104 L-46 -80 Z M46 -80 L62 -104 L78 -80 Z" fill="#3e5a7a"/><path d="M-60 -50 L0 -76 L60 -50 Z" fill="#3e5a7a"/>
      ${[-40, -20, 0, 20, 40].map(x => `<rect x="${x - 4}" y="-40" width="8" height="12" fill="#5a6a7a"/>`).join("")}<rect x="-8" y="-22" width="16" height="22" fill="#5a4030"/></g>`,
    kirke: () => `<g><rect x="-40" y="-60" width="80" height="60" fill="#c9bfae"/><path d="M-46 -60 L0 -92 L46 -60 Z" fill="#7a4a3a"/>
      <rect x="20" y="-120" width="26" height="120" fill="#bdb3a2"/><path d="M16 -120 L33 -160 L50 -120 Z" fill="#5a3a2a"/><path d="M33 -172 v14 M27 -166 h12" stroke="#c9a227" stroke-width="3"/>
      <rect x="-12" y="-30" width="20" height="30" rx="10" fill="#5a4030"/></g>`,
    gard: () => `<g><rect x="-80" y="-90" width="160" height="90" fill="#c9b79a"/><path d="M-92 -88 L0 -150 L92 -88 Z" fill="#c9a24a"/><path d="M-92 -88 L0 -150 L92 -88" stroke="#a07e30" stroke-width="4" fill="none"/>
      <rect x="-20" y="-56" width="34" height="56" fill="#6b4a2a"/><rect x="34" y="-64" width="28" height="22" fill="#3a3020"/><path d="M48 -64 v22 M34 -53 h28" stroke="#6b4a2a" stroke-width="3"/>
      ${[[-70, -70], [-50, -40], [60, -30]].map(([x, y]) => `<rect x="${x}" y="${y}" width="14" height="8" fill="#b0a080" opacity=".7"/>`).join("")}</g>`,
    skilt: o => `<g><rect x="-3" y="-80" width="6" height="80" fill="#6b4a2a"/><path d="${o && o.venstre ? "M30 -78 L-34 -78 L-46 -64 L-34 -50 L30 -50 Z" : "M-30 -78 L34 -78 L46 -64 L34 -50 L-30 -50 Z"}" fill="#a07a50" stroke="#6b4a2a" stroke-width="2"/>
      <text x="${o && o.venstre ? -4 : 4}" y="-59" font-size="12" font-family="Atkinson Hyperlegible,Arial" font-weight="700" text-anchor="middle" fill="#2a1a0a">${(o && o.tekst) || ""}</text></g>`,
    bord: o => `<g><rect x="-60" y="-56" width="120" height="10" fill="#8a5a3a"/><rect x="-54" y="-46" width="8" height="46" fill="#6b4a2a"/><rect x="46" y="-46" width="8" height="46" fill="#6b4a2a"/>
      ${o && o.bok ? `<rect x="-30" y="-66" width="44" height="10" fill="#7a2e2e"/><rect x="-28" y="-64" width="40" height="6" fill="#f4e7c9"/><path d="M24 -56 L34 -84" stroke="#333" stroke-width="1.5"/><path d="M34 -84 q6 -10 2 -16 q-6 8 -4 16" fill="#f4f1ea"/>` : ""}</g>`,
    bronn: () => `<g><rect x="-40" y="-40" width="80" height="40" fill="#a59c8c"/><ellipse cx="0" cy="-40" rx="40" ry="10" fill="#3a3a40"/><ellipse cx="0" cy="-40" rx="40" ry="10" fill="none" stroke="#bdb3a2" stroke-width="5"/>
      <rect x="-36" y="-110" width="6" height="70" fill="#6b4a2a"/><rect x="30" y="-110" width="6" height="70" fill="#6b4a2a"/><path d="M-44 -108 L0 -132 L44 -108 Z" fill="#7a4a3a"/></g>`,
    oppslag: o => `<g><rect x="-30" y="-140" width="60" height="70" fill="#f4ecd8" stroke="#c9b98f" ${o && o.revet ? 'transform="rotate(-12 0 -105)"' : ""}/>
      <text x="0" y="-118" font-size="9" text-anchor="middle" font-family="Georgia" fill="#2a1a0a">ALLE</text><text x="0" y="-104" font-size="9" text-anchor="middle" font-family="Georgia" fill="#2a1a0a">MENNESKER</text>
      <text x="0" y="-90" font-size="9" text-anchor="middle" font-family="Georgia" fill="#2a1a0a">ER LIKE?</text><rect x="-4" y="-70" width="8" height="70" fill="#6b4a2a"/></g>`,
    skrivebord: () => `<g><rect x="-80" y="-70" width="160" height="12" fill="#6b3a1f"/><rect x="-74" y="-58" width="50" height="58" fill="#5a2f18"/><rect x="40" y="-58" width="10" height="58" fill="#5a2f18"/>
      <rect x="-60" y="-84" width="40" height="14" fill="#2e4a7a"/><rect x="-58" y="-96" width="36" height="12" fill="#7a2e2e"/><path d="M10 -70 L10 -84 L26 -84 L26 -70" fill="#f4e7c9"/>
      <rect x="40" y="-92" width="6" height="22" fill="#efe6d0"/><path d="M43 -92 q-4 -8 0 -14 q4 6 0 14" fill="#ffb347"/></g>`,
    prisme: o => `<g><path d="M-18 0 L0 -32 L18 0 Z" fill="#cfe9f5" stroke="#8ab" stroke-width="2" opacity=".9"/>
      ${o && o.lys ? `<path d="M10 -14 L120 10 M10 -14 L120 18 M10 -14 L120 26 M10 -14 L120 34 M10 -14 L120 42 M10 -14 L120 50" stroke-width="5" stroke-linecap="round"
        style="stroke:url(#regnbue)"/>` : ""}<rect x="-24" y="0" width="48" height="6" fill="#6b3a1f"/></g>`,
    globus: () => `<g><circle cx="0" cy="-46" r="26" fill="#5a8ab0" stroke="#c9a227" stroke-width="3"/><path d="M-12 -60 q10 6 4 16 q-6 10 6 16 M8 -66 q8 10 12 20" stroke="#7aa05a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M0 -18 L0 0 M-14 0 L14 0" stroke="#6b4a2a" stroke-width="4"/></g>`,
    dor: o => `<g><rect x="-36" y="-170" width="72" height="170" fill="${(o && o.f) || "#6b3a1f"}"/><rect x="-28" y="-160" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/><rect x="4" y="-160" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/>
      <rect x="-28" y="-80" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/><rect x="4" y="-80" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/><circle cx="24" cy="-86" r="4" fill="#c9a227"/></g>`,
    epletre: o => `<g><path d="M-14 0 Q-10 -80 -18 -150 L18 -150 Q10 -80 14 0 Z" fill="#6b4a2a"/>
      <circle cx="-60" cy="-190" r="60" fill="#3f7a3a"/><circle cx="40" cy="-210" r="70" fill="#4a8a42"/><circle cx="-10" cy="-250" r="56" fill="#56984c"/><circle cx="70" cy="-160" r="44" fill="#3f7a3a"/>
      ${[[-70, -200], [-30, -170], [30, -240], [60, -190], [0, -280], [90, -150], [-90, -170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#c8312b"/>`).join("")}
      ${o && o.ark ? `<rect x="20" y="-180" width="28" height="22" fill="#fbf6e8" stroke="#c9b98f" transform="rotate(14 34 -169)"/>` : ""}</g>`,
    benk: () => `<g><rect x="-60" y="-36" width="120" height="8" fill="#8a5a3a"/><rect x="-60" y="-60" width="120" height="6" fill="#8a5a3a"/><rect x="-52" y="-28" width="6" height="28" fill="#6b4a2a"/><rect x="46" y="-28" width="6" height="28" fill="#6b4a2a"/></g>`,
    katt: o => `<g><ellipse cx="0" cy="-12" rx="26" ry="12" fill="#e08a3a"/><circle cx="-22" cy="-22" r="11" fill="#e08a3a"/><path d="M-30 -30 L-28 -40 L-22 -32 M-18 -32 L-14 -40 L-12 -30" fill="#e08a3a" stroke="#e08a3a"/>
      <path d="M-27 -22 q3 2 5 0 M-19 -22 q3 2 5 0" stroke="#333" stroke-width="1.5" fill="none"/><path d="M24 -10 q18 -4 14 -22" stroke="#e08a3a" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${o && o.sover !== false ? `<text x="-4" y="-40" font-size="14" fill="#555" font-family="Arial">z z</text>` : ""}</g>`,
    sofa: () => `<g><rect x="-110" y="-60" width="220" height="40" rx="12" fill="#b04a5a"/><rect x="-110" y="-100" width="220" height="46" rx="18" fill="#c45a6a"/><rect x="-124" y="-74" width="28" height="56" rx="12" fill="#b04a5a"/><rect x="96" y="-74" width="28" height="56" rx="12" fill="#b04a5a"/>
      <path d="M-104 -20 l-4 20 M104 -20 l4 20" stroke="#c9a227" stroke-width="5"/></g>`,
    cembalo: o => `<g><path d="M-90 -80 L60 -80 Q110 -80 110 -60 L110 -50 L-90 -50 Z" fill="#2a4a3a"/><rect x="-90" y="-50" width="200" height="8" fill="#c9a227"/>
      <rect x="-86" y="-62" width="70" height="10" fill="#f4f1ea"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${-84 + i * 8}" y="-62" width="3" height="6" fill="#222"/>`).join("")}
      <path d="M-80 -42 l-4 42 M90 -42 l4 42" stroke="#c9a227" stroke-width="5"/>${o && o.skjult ? `<rect x="10" y="-88" width="30" height="10" fill="#fbf6e8" stroke="#c9b98f" transform="rotate(-6 25 -83)"/>` : ""}</g>`,
    lysekrone: () => `<g><path d="M0 -450 L0 -380" stroke="#c9a227" stroke-width="3"/><ellipse cx="0" cy="-370" rx="70" ry="14" fill="none" stroke="#c9a227" stroke-width="5"/>
      ${[-60, -30, 0, 30, 60].map(x => `<rect x="${x - 3}" y="-392" width="6" height="16" fill="#f4f1ea"/><path d="M${x} -392 q-4 -8 0 -14 q4 6 0 14" fill="#ffcf5a"/><circle cx="${x}" cy="-398" r="14" fill="#ffd36a" opacity=".18"/>`).join("")}</g>`,
    idekort: o => `<g><rect x="-26" y="-36" width="52" height="36" rx="5" fill="#fff8e0" stroke="#c9a227" stroke-width="2.5"/><text x="0" y="-11" font-size="18" text-anchor="middle">${(o && o.ikon) || "💡"}</text></g>`,
    pil: o => `<g><circle cx="0" cy="-24" r="24" fill="#fff" opacity=".85"/><path d="${o && o.venstre ? "M8 -36 L-6 -24 L8 -12" : "M-8 -36 L6 -24 L-8 -12"}" stroke="#1f3d7a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  };

  /* ======================================================================
     BAKGRUNNER (800 × 450)
     ====================================================================== */
  const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="450" fill="url(#${id})"/>`;
  const BG = {
    bibliotek() {
      srand(3);
      let s = `<rect width="800" height="450" fill="#dfe6ea"/><rect y="330" width="800" height="120" fill="#c49a6c"/>`;
      for (let x = 0; x < 800; x += 50) s += `<path d="M${x} 330 L${x - 30} 450" stroke="#b08a5c" stroke-width="2"/>`;
      s += `<rect x="40" y="60" width="150" height="190" fill="#9cc8e6"/><path d="M40 160 h150 M115 60 v190" stroke="#f4f4f4" stroke-width="6"/><rect x="36" y="56" width="158" height="198" fill="none" stroke="#f4f4f4" stroke-width="8"/>
        <circle cx="160" cy="100" r="18" fill="#fff3b0"/><path d="M50 230 q20 -30 50 -10 q30 -20 60 0 q20 -10 30 10 Z" fill="#7ab06a"/>`;
      s += `<g transform="translate(330 330)">${TING.bokhylle()}</g><g transform="translate(520 330)">${TING.bokhylle()}</g>`;
      s += `<ellipse cx="420" cy="400" rx="200" ry="26" fill="#a0453a" opacity=".55"/>`;
      s += `<rect x="0" y="322" width="800" height="10" fill="#b08a5c"/>`;
      return s;
    },
    aker() {
      let s = sky("akSky", "#9cc2e4", "#f6dcab");
      s += `<circle cx="660" cy="90" r="34" fill="#fff1b8" opacity=".9"/>`;
      s += `<path d="M0 230 Q160 170 320 210 T640 190 T800 210 L800 450 L0 450 Z" fill="#9db27a"/>`;
      s += `<g transform="translate(620 200) scale(.8)">${TING.slott()}</g>`;
      s += `<g transform="translate(250 235) scale(.75)">${TING.kirke()}</g>`;
      s += `<path d="M0 260 Q200 240 400 262 T800 252 L800 450 L0 450 Z" fill="#d9b860"/>`;
      for (let y = 280; y < 450; y += 16) s += `<path d="M0 ${y} Q400 ${y - 10} 800 ${y}" stroke="#c4a04a" stroke-width="3" fill="none"/>`;
      s += `<path d="M330 450 Q380 330 470 262 L500 262 Q440 330 430 450 Z" fill="#b89a6a"/>`;
      return s;
    },
    torget() {
      let s = sky("toSky", "#a9cdea", "#e9eef2");
      const hus = (x, w, h, f, tak) => `<rect x="${x}" y="${330 - h}" width="${w}" height="${h}" fill="${f}"/><path d="M${x - 8} ${330 - h} L${x + w / 2} ${330 - h - 46} L${x + w + 8} ${330 - h} Z" fill="${tak}"/>
        <path d="M${x} ${330 - h + 40} h${w} M${x} ${330 - h + 90} h${w}" stroke="#6b4a2a" stroke-width="5"/>${[0.25, 0.75].map(t => `<rect x="${x + w * t - 12}" y="${330 - h + 54}" width="24" height="26" fill="#3a4a5a"/>`).join("")}`;
      s += hus(10, 150, 190, "#efe2c4", "#8a4a3a") + hus(180, 130, 160, "#e6d2b0", "#6a3a2a") + hus(500, 140, 200, "#efe6d0", "#7a4a3a") + hus(660, 140, 170, "#e2cfa8", "#8a5a3a");
      s += `<rect y="330" width="800" height="120" fill="#b8ad9a"/>`;
      srand(11); for (let i = 0; i < 70; i++) s += `<ellipse cx="${rnd() * 800}" cy="${340 + rnd() * 110}" rx="${10 + rnd() * 8}" ry="${4 + rnd() * 3}" fill="#a69c88"/>`;
      return s;
    },
    studerkammer() {
      let s = `<rect width="800" height="450" fill="#7a5236"/>`;
      for (let x = 0; x < 800; x += 100) s += `<rect x="${x + 8}" y="40" width="84" height="230" fill="#86603f" stroke="#6b4428" stroke-width="3"/>`;
      s += `<rect y="300" width="800" height="150" fill="#5a3a24"/>`;
      for (let x = 0; x < 800; x += 70) s += `<path d="M${x} 300 L${x + 10} 450" stroke="#4a2e1c" stroke-width="2"/>`;
      s += `<rect x="250" y="50" width="130" height="160" fill="#cfe3f0"/><path d="M315 50 v160 M250 130 h130" stroke="#6b4428" stroke-width="6"/><rect x="246" y="46" width="138" height="168" fill="none" stroke="#6b4428" stroke-width="8"/>`;
      s += `<path d="M380 70 L470 300 L540 300 L380 120 Z" fill="#fff6c8" opacity=".18"/>`;
      s += `<defs><linearGradient id="regnbue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#ff5252"/><stop offset=".4" stop-color="#ffd740"/><stop offset=".6" stop-color="#69f0ae"/><stop offset=".8" stop-color="#40c4ff"/><stop offset="1" stop-color="#b388ff"/></linearGradient></defs>`;
      return s;
    },
    hage() {
      let s = sky("haSky", "#8ec3ea", "#e6f2f8");
      s += `<rect y="220" width="800" height="100" fill="#b5533c"/>`;
      for (let y = 226; y < 320; y += 14) for (let x = (y / 14 % 2) * 20; x < 800; x += 40) s += `<rect x="${x}" y="${y}" width="38" height="12" fill="#c2603f"/>`;
      s += `<rect y="210" width="800" height="12" fill="#9a4430"/>`;
      s += `<rect y="320" width="800" height="130" fill="#6aa04a"/><path d="M0 360 Q400 330 800 370" stroke="#7ab05a" stroke-width="30" fill="none"/>`;
      srand(5); for (let i = 0; i < 40; i++) { const x = rnd() * 800, y = 330 + rnd() * 110; s += `<circle cx="${x}" cy="${y}" r="3" fill="${pick(["#fff", "#ffe14d", "#ff8fb0"])}"/>`; }
      return s;
    },
    salong() {
      let s = `<rect width="800" height="450" fill="#cfe0e8"/>`;
      for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" y="0" width="14" height="320" fill="#bcd2dc"/>`;
      s += `<rect y="300" width="800" height="20" fill="#e8d8b0"/><rect y="320" width="800" height="130" fill="#7a4a2a"/>`;
      for (let x = 0; x < 800; x += 60) for (let y = 320; y < 450; y += 30) s += `<rect x="${x + ((y / 30) % 2) * 30}" y="${y}" width="30" height="30" fill="#6b3f22"/>`;
      const vindu = x => `<rect x="${x}" y="50" width="100" height="210" rx="50" fill="#1d2a4a"/><circle cx="${x + 70}" cy="100" r="12" fill="#f4f1d0"/><path d="M${x + 50} 50 v210 M${x} 150 h100" stroke="#e8d8b0" stroke-width="6"/>
        <rect x="${x - 4}" y="46" width="108" height="218" rx="54" fill="none" stroke="#e8d8b0" stroke-width="8"/><path d="M${x - 20} 40 Q${x - 6} 160 ${x - 16} 270 L${x + 8} 270 Q${x + 2} 160 ${x + 10} 40 Z" fill="#8a2a3a"/>`;
      s += vindu(70) + vindu(630);
      s += `<rect x="330" y="70" width="140" height="170" rx="10" fill="#e8f0f4" stroke="#c9a227" stroke-width="8"/><path d="M345 90 l40 120 M380 90 l40 120" stroke="#fff" stroke-width="8" opacity=".6"/>`;
      s += `<g transform="translate(400 450)">${TING.lysekrone()}</g>`;
      return s;
    },
    kart() { return `<rect width="800" height="450" fill="#f2e6c8"/>`; },
  };

  /* ---------- portrett: hodeutsnitt av en figur ---------- */
  function portrett(navn, o) {
    if (navn === "deg") {
      if (window.Gull) return Gull.tegn(Gull.tilstand(), { bakgrunn: false, venn: false, vb: "62 22 116 116" });
      return `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="#ccc"/></svg>`;
    }
    const f = FIG[navn]; if (!f) return "";
    const vb = navn === "ugle" ? "-34 -100 68 68" : navn === "barn" ? "-34 -142 68 68" : navn === "forteller" ? "-34 -194 68 68" : navn === "madame" ? "-40 -236 80 80" : navn === "kant" ? "-36 -194 72 72" : "-38 -210 76 76";
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${f(o || {})}</svg>`;
  }

  window.KUNST = { person, ugle, FIG, fig: FIG, TING, ting: TING, BG, bg: BG, portrett, mix };
})();
