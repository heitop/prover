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
      krage: null, hand: null, skala: 1, briller: false, kappe: null, mager: false, skjegg: null, rosett: null, epaulett: false,
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
    if (o.kappe && o.hermelin) {
      L.push(`<path d="M-30 -138 Q-46 -60 -42 -6 M30 -138 Q46 -60 42 -6" stroke="#fff" stroke-width="6" fill="none"/>`);
      L.push(`<path d="M-30 -146 Q0 -130 30 -146 L28 -128 Q0 -112 -28 -128 Z" fill="#fff"/><path d="M-20 -132 v4 M-8 -126 v4 M6 -126 v4 M18 -132 v4" stroke="#222" stroke-width="2"/>`);
    }
    // armer
    const arm = mix(fr, -.12);
    L.push(`<path d="M${-26 * W} -138 Q${-38 * W} -110 ${-34 * W} -84" stroke="${arm}" stroke-width="12" stroke-linecap="round" fill="none"/>`);
    L.push(`<path d="M${26 * W} -138 Q${38 * W} -110 ${34 * W} -84" stroke="${arm}" stroke-width="12" stroke-linecap="round" fill="none"/>`);
    L.push(`<circle cx="${-34 * W}" cy="-80" r="6.5" fill="${o.hud}"/><circle cx="${34 * W}" cy="-80" r="6.5" fill="${o.hud}"/>`);
    if (o.epaulett) L.push(`<g fill="#e3b53a"><ellipse cx="-25" cy="-140" rx="11" ry="5"/><ellipse cx="25" cy="-140" rx="11" ry="5"/></g><path d="M-34 -137 v6 M-29 -136 v7 M-24 -136 v7 M-19 -137 v6 M19 -137 v6 M24 -136 v7 M29 -136 v7 M34 -137 v6" stroke="#e3b53a" stroke-width="2"/>`);
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
    if (o.skjegg === "langt") L.push(`<path d="M-17 ${hy + 6} Q-16 ${hy + 56} 0 ${hy + 72} Q16 ${hy + 56} 17 ${hy + 6} Q8 ${hy + 20} 0 ${hy + 19} Q-8 ${hy + 20} -17 ${hy + 6} Z" fill="${o.har}"/><path d="M-6 ${hy + 13} Q0 ${hy + 10} 6 ${hy + 13}" stroke="${mix(o.har, -.25)}" stroke-width="2" fill="none"/>`);
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
      tricorn: `<path d="M-34 ${hy - 14} Q0 ${hy - 4} 34 ${hy - 14} Q22 ${hy - 22} 18 ${hy - 36} Q0 ${hy - 28} -18 ${hy - 36} Q-22 ${hy - 22} -34 ${hy - 14} Z" fill="${o.hattF || "#2a2a2a"}"/><path d="M-30 ${hy - 15} Q0 ${hy - 7} 30 ${hy - 15}" stroke="${o.kant || "#c9a227"}" stroke-width="1.6" fill="none"/>`,
      fjaer: `<path d="M-34 ${hy - 14} Q0 ${hy - 4} 34 ${hy - 14} Q22 ${hy - 22} 18 ${hy - 36} Q0 ${hy - 28} -18 ${hy - 36} Q-22 ${hy - 22} -34 ${hy - 14} Z" fill="${o.hattF || "#2a2a2a"}"/><path d="M-30 ${hy - 15} Q0 ${hy - 7} 30 ${hy - 15}" stroke="#c9a227" stroke-width="1.6" fill="none"/>
              <path d="M8 ${hy - 28} Q26 ${hy - 66} 48 ${hy - 50} Q30 ${hy - 46} 14 ${hy - 24} Z" fill="${o.fjaerF || "#fff"}" stroke="#ddd" stroke-width=".8"/>`,
      krone: `<path d="M-18 ${hy - 18} L-19 ${hy - 40} L-9 ${hy - 29} L0 ${hy - 45} L9 ${hy - 29} L19 ${hy - 40} L18 ${hy - 18} Z" fill="#e3b53a" stroke="#a8811c" stroke-width="1.5"/>
              <circle cx="0" cy="${hy - 25}" r="3.2" fill="#c0392b"/><circle cx="-10" cy="${hy - 23}" r="2.2" fill="#1f6fb5"/><circle cx="10" cy="${hy - 23}" r="2.2" fill="#1f6fb5"/>`,
      mitra: `<path d="M-16 ${hy - 16} L-14 ${hy - 44} Q0 ${hy - 66} 14 ${hy - 44} L16 ${hy - 16} Z" fill="#f4f1ea" stroke="#c9a227" stroke-width="2"/><path d="M0 ${hy - 60} V${hy - 18} M-15 ${hy - 30} H15" stroke="#c9a227" stroke-width="2.5"/>`,
      fjaerpynt: `<path d="M-6 ${hy - 56} Q-28 ${hy - 96} -8 ${hy - 106} Q-4 ${hy - 82} -1 ${hy - 58} Z" fill="#fff" stroke="#ddd" stroke-width=".8"/><path d="M4 ${hy - 56} Q20 ${hy - 102} 32 ${hy - 92} Q16 ${hy - 78} 8 ${hy - 56} Z" fill="#f2a7c0"/><circle cx="0" cy="${hy - 56}" r="4.5" fill="#5aa0d8"/>`,
      prest: `<ellipse cx="0" cy="${hy - 14}" rx="34" ry="7" fill="#1d1d1d"/><path d="M-17 ${hy - 14} Q-16 ${hy - 34} 0 ${hy - 34} Q16 ${hy - 34} 17 ${hy - 14} Z" fill="#1d1d1d"/>`,
      kappe: `<path d="M-24 ${hy + 2} Q-26 ${hy - 30} 0 ${hy - 32} Q26 ${hy - 30} 24 ${hy + 2} Q18 ${hy - 18} 0 ${hy - 18} Q-18 ${hy - 18} -24 ${hy + 2} Z" fill="${o.kappe || "#1b1b22"}"/>`,
      bakerlue: `<path d="M-20 ${hy - 14} Q-30 ${hy - 44} -10 ${hy - 46} Q0 ${hy - 58} 10 ${hy - 46} Q30 ${hy - 44} 20 ${hy - 14} Z" fill="#fbfaf5" stroke="#ddd"/>`,
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
      gevaer: `<path d="M41 -36 L41 -196" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round"/><path d="M41 -150 L41 -200" stroke="#888" stroke-width="2.5"/><path d="M39 -200 l2 -18 l2 18 Z" fill="#bbb"/>`,
      stav: `<path d="M40 -2 L37 -200" stroke="#1b1b22" stroke-width="4" stroke-linecap="round"/><circle cx="37" cy="-203" r="7" fill="#c9a227"/>`,
      sverd: `<path d="M-30 -70 L-50 -14" stroke="#c8c8c8" stroke-width="3.5" stroke-linecap="round"/><path d="M-37 -78 L-23 -64" stroke="#c9a227" stroke-width="4" stroke-linecap="round"/>`,
      brod: `<ellipse cx="42" cy="-84" rx="18" ry="8" fill="#c98a3a" transform="rotate(-20 42 -84)"/><path d="M32 -84 l4 -6 M40 -88 l4 -6 M48 -92 l4 -6" stroke="#8a5a1a" stroke-width="2"/>`,
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
    // kapittel 4–5: Versailles og Ballhuset
    kongen: o => person(Object.assign({ hud: "#f6d5bb", har: "#f4f1ea", harType: "parykk", frakk: "#1f3d7a", vest: "#e8c870", bukse: "#e8e0cc", strompe: "#fff", kappe: "#24438a", hermelin: true, hatt: "krone", krage: "jabot", uttrykk: "noytral" }, o)),
    dronning: o => person(Object.assign({ hud: "#fbe0cc", har: "#f4f1ea", harType: "oppsatt", kjole: true, kjoleF: "#f2a7c0", hatt: "fjaerpynt", hand: "vifte", uttrykk: "glad" }, o)),
    markis: o => person(Object.assign({ hud: "#f8dcc6", har: "#f4f1ea", harType: "parykk", frakk: "#e889a8", vest: "#f8ecc8", bukse: "#e889a8", strompe: "#fff", krage: "jabot", hand: "stokk", uttrykk: "lur" }, o)),
    necker: o => person(Object.assign({ hud: "#f0cfb0", har: "#e8e4da", harType: "parykk", frakk: "#5a4a3a", vest: "#d8c8a8", bukse: "#3a2a20", krage: "hvit", hand: "papir", uttrykk: "lei" }, o)),
    biskop: o => person(Object.assign({ hud: "#f0c8a8", har: "#c8c8c8", harType: "skallet", frakk: "#6a2a7a", vest: "#7a3a8a", bukse: "#6a2a7a", strompe: "#6a2a7a", krage: "prest", hatt: "mitra", hand: "kors", uttrykk: "noytral" }, o)),
    adelsmann: o => person(Object.assign({ hud: "#f6d5bb", har: "#f4f1ea", harType: "parykk", frakk: "#2a6a5a", vest: "#e8c870", bukse: "#2a4a3a", krage: "jabot", hatt: "fjaer", hand: "sverd", uttrykk: "lur" }, o)),
    soldat: o => person(Object.assign({ hud: "#efc9a4", har: "#3a2a1a", harType: "kort", frakk: "#1f3d7a", vest: "#f4f1ea", bukse: "#f4f1ea", strompe: "#f4f1ea", sko: "#111", hatt: "tricorn", hattF: "#1b1b22", hand: "gevaer", uttrykk: "noytral" }, o)),
    seremonimester: o => person(Object.assign({ hud: "#d8d2e0", har: "#e8e4da", harType: "parykk", frakk: "#1b1b22", vest: "#c9a227", bukse: "#1b1b22", strompe: "#1b1b22", krage: "jabot", hatt: "fjaer", hattF: "#1b1b22", fjaerF: "#9a8ab0", hand: "stav", uttrykk: "lur" }, o)),
    deputert: o => person(Object.assign({ hud: "#efc9a4", har: "#e8e4da", harType: "parykk", frakk: "#24242a", vest: "#2e2e34", bukse: "#24242a", strompe: "#2a2a30", krage: "hvit", hatt: "tricorn", hattF: "#1b1b22", kant: "#1b1b22", uttrykk: "glad" }, o)),
    duval: o => person(Object.assign({ hud: "#f1c7a3", har: "#2a2a2a", harType: "kort", frakk: "#24242a", vest: "#2e2e34", bukse: "#24242a", strompe: "#2a2a30", briller: true, krage: "hvit", hand: "penn", uttrykk: "glad" }, o)),
    sieyes: o => person(Object.assign({ hud: "#f0cfb0", har: "#d8d2c8", harType: "kort", frakk: "#1d1d1d", vest: "#1d1d1d", bukse: "#1d1d1d", strompe: "#1d1d1d", krage: "prest", hand: "papir", uttrykk: "lur", mager: true }, o)),
    bailly: o => person(Object.assign({ hud: "#f0cfb0", har: "#e8e4da", harType: "parykk", frakk: "#24242a", vest: "#2e2e34", bukse: "#24242a", strompe: "#2a2a30", krage: "hvit", hand: "papir", uttrykk: "noytral", mager: true, skala: 1.05 }, o)),
    guillotin: o => person(Object.assign({ hud: "#f3d2b5", har: "#e8e4da", harType: "parykk", frakk: "#2a2a30", vest: "#3a3a40", bukse: "#24242a", strompe: "#2a2a30", krage: "hvit", hand: "bok", uttrykk: "glad", briller: true }, o)),
    mirabeau: o => person(Object.assign({ hud: "#e2b090", har: "#e8e4da", harType: "parykk", frakk: "#24242a", vest: "#7a1f2b", bukse: "#24242a", strompe: "#2a2a30", krage: "jabot", uttrykk: "sint", skala: 1.1 }, o)),
    dauch: o => person(Object.assign({ hud: "#f1c7a3", har: "#6a4a2a", harType: "kort", frakk: "#24242a", vest: "#2e2e34", bukse: "#24242a", strompe: "#2a2a30", krage: "hvit", hand: "penn", uttrykk: "lei" }, o)),
    landsprest: o => person(Object.assign({ hud: "#e8bc96", har: "#7a5a3a", harType: "kort", frakk: "#1d1d1d", vest: "#1d1d1d", bukse: "#1d1d1d", strompe: "#1d1d1d", krage: "prest", hand: "kors", uttrykk: "glad", mager: true }, o)),
    // kapittel 6–7: Bastillen og Erklæringen
    desmoulins: o => person(Object.assign({ hud: "#f1c7a3", har: "#2a1a10", harType: "rufsete", frakk: "#6a4a2a", vest: "#c9b48a", bukse: "#3a2a20", krage: "hvit", uttrykk: "sint", mager: true }, o)),
    baker: o => person(Object.assign({ hud: "#f3cfae", har: "#6a4a2a", harType: "kort", frakk: "#f4f1ea", vest: "#e8e4da", bukse: "#d8d0c0", strompe: "#e8e4da", hatt: "bakerlue", hand: "brod", uttrykk: "lei" }, o)),
    garde: o => person(Object.assign({ hud: "#e8bc96", har: "#3a2a1a", harType: "kort", frakk: "#1f3d7a", vest: "#c0392b", bukse: "#f4f1ea", strompe: "#f4f1ea", sko: "#111", hatt: "tricorn", hattF: "#1b1b22", hand: "gevaer", uttrykk: "noytral" }, o)),
    fange: o => person(Object.assign({ hud: "#e8d2bc", har: "#ece8e0", harType: "langt", skjegg: "langt", frakk: "#7a7060", vest: "#9a9080", bukse: "#6a6050", strompe: "#9a9080", sko: "#4a4030", uttrykk: "overrasket", mager: true }, o)),
    lafayette: o => person(Object.assign({ hud: "#f3d2b5", har: "#c87a4a", harType: "parykk", frakk: "#1f3d7a", vest: "#f4f1ea", bukse: "#f4f1ea", strompe: "#f4f1ea", sko: "#111", krage: "jabot", hatt: "tricorn", hattF: "#1b1b22", epaulett: true, rosett: true, hand: "sverd", uttrykk: "glad" }, o)),
    jefferson: o => person(Object.assign({ hud: "#f3d2b5", har: "#b8693a", harType: "kort", frakk: "#7a5a3a", vest: "#c0392b", bukse: "#4a3a2a", krage: "hvit", hand: "papir", uttrykk: "glad", mager: true, skala: 1.06 }, o)),
    olympe: o => person(Object.assign({ hud: "#f6d5bb", har: "#7a4a2a", harType: "langt", kjole: true, kjoleF: "#2f6a8a", hatt: "skaut", skautF: "#fbfaf5", hand: "penn", uttrykk: "lur", rosett: true }, o)),
    fiskekone: o => person(Object.assign({ hud: "#e2b48c", har: "#5a3a1e", kjole: true, kjoleF: "#8a3a3a", forkle: "#e8dcc4", hatt: "skaut", skautF: "#e8e0cc", uttrykk: "sint", rosett: true }, o)),
    noailles: o => person(Object.assign({ hud: "#f6d5bb", har: "#f4f1ea", harType: "parykk", frakk: "#7a4a8a", vest: "#e8c870", bukse: "#4a2a5a", krage: "jabot", hand: "sverd", uttrykk: "overrasket" }, o)),
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
    bord: o => `<g>${o && o.duk ? `<path d="M-64 -56 L64 -56 L70 -10 L-70 -10 Z" fill="${o.duk}"/>` : ""}<rect x="-60" y="-56" width="120" height="10" fill="#8a5a3a"/>
      ${o && o.papir ? `<rect x="-44" y="-62" width="34" height="6" fill="#fbf6e8" stroke="#c9b98f"/><rect x="-40" y="-68" width="30" height="6" fill="#f4ecd8" stroke="#c9b98f"/><rect x="-6" y="-63" width="30" height="7" fill="#fbf6e8" stroke="#c9b98f" transform="rotate(-6 9 -60)"/>
        ${[30, 38, 46].map((x, i) => `<ellipse cx="${x}" cy="${-58 - i * 3}" rx="7" ry="2.5" fill="#e3b53a" stroke="#a8811c"/>`).join("")}` : ""}<rect x="-54" y="-46" width="8" height="46" fill="#6b4a2a"/><rect x="46" y="-46" width="8" height="46" fill="#6b4a2a"/>
      ${o && o.bok ? `<rect x="-30" y="-66" width="44" height="10" fill="#7a2e2e"/><rect x="-28" y="-64" width="40" height="6" fill="#f4e7c9"/><path d="M24 -56 L34 -84" stroke="#333" stroke-width="1.5"/><path d="M34 -84 q6 -10 2 -16 q-6 8 -4 16" fill="#f4f1ea"/>` : ""}</g>`,
    bronn: () => `<g><rect x="-40" y="-40" width="80" height="40" fill="#a59c8c"/><ellipse cx="0" cy="-40" rx="40" ry="10" fill="#3a3a40"/><ellipse cx="0" cy="-40" rx="40" ry="10" fill="none" stroke="#bdb3a2" stroke-width="5"/>
      <rect x="-36" y="-110" width="6" height="70" fill="#6b4a2a"/><rect x="30" y="-110" width="6" height="70" fill="#6b4a2a"/><path d="M-44 -108 L0 -132 L44 -108 Z" fill="#7a4a3a"/></g>`,
    oppslag: o => `<g><rect x="-30" y="-140" width="60" height="70" fill="#f4ecd8" stroke="#c9b98f" ${o && o.revet ? 'transform="rotate(-12 0 -105)"' : ""}/>
      ${((o && o.linjer) || ["ALLE", "MENNESKER", "ER LIKE?"]).map((l, i) => `<text x="0" y="${-118 + i * 14}" font-size="9" text-anchor="middle" font-family="Georgia" fill="#2a1a0a">${l}</text>`).join("")}
      ${o && o.stang === false ? "" : `<rect x="-4" y="-70" width="8" height="70" fill="#6b4a2a"/>`}</g>`,
    skrivebord: () => `<g><rect x="-80" y="-70" width="160" height="12" fill="#6b3a1f"/><rect x="-74" y="-58" width="50" height="58" fill="#5a2f18"/><rect x="40" y="-58" width="10" height="58" fill="#5a2f18"/>
      <rect x="-60" y="-84" width="40" height="14" fill="#2e4a7a"/><rect x="-58" y="-96" width="36" height="12" fill="#7a2e2e"/><path d="M10 -70 L10 -84 L26 -84 L26 -70" fill="#f4e7c9"/>
      <rect x="40" y="-92" width="6" height="22" fill="#efe6d0"/><path d="M43 -92 q-4 -8 0 -14 q4 6 0 14" fill="#ffb347"/></g>`,
    prisme: o => `<g><path d="M-18 0 L0 -32 L18 0 Z" fill="#cfe9f5" stroke="#8ab" stroke-width="2" opacity=".9"/>
      ${o && o.lys ? `<path d="M10 -14 L120 10 M10 -14 L120 18 M10 -14 L120 26 M10 -14 L120 34 M10 -14 L120 42 M10 -14 L120 50" stroke-width="5" stroke-linecap="round"
        style="stroke:url(#regnbue)"/>` : ""}<rect x="-24" y="0" width="48" height="6" fill="#6b3a1f"/></g>`,
    globus: () => `<g><circle cx="0" cy="-46" r="26" fill="#5a8ab0" stroke="#c9a227" stroke-width="3"/><path d="M-12 -60 q10 6 4 16 q-6 10 6 16 M8 -66 q8 10 12 20" stroke="#7aa05a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M0 -18 L0 0 M-14 0 L14 0" stroke="#6b4a2a" stroke-width="4"/></g>`,
    dor: o => `<g>${o && o.gull ? `<rect x="-42" y="-178" width="84" height="178" fill="#c9a227"/>` : ""}<rect x="-36" y="-170" width="72" height="170" fill="${(o && o.f) || "#6b3a1f"}"/><rect x="-28" y="-160" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/><rect x="4" y="-160" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/>
      <rect x="-28" y="-80" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/><rect x="4" y="-80" width="24" height="70" fill="${mix((o && o.f) || "#6b3a1f", .1)}"/><circle cx="24" cy="-86" r="4" fill="#c9a227"/>
      ${o && o.laast ? `<path d="M-40 -130 L40 -100 M-40 -60 L40 -90" stroke="#7a5a3a" stroke-width="12"/>
        <rect x="-10" y="-96" width="20" height="16" rx="3" fill="#888"/><path d="M-6 -96 v-6 a6 6 0 0 1 12 0 v6" stroke="#888" stroke-width="3" fill="none"/>` : ""}</g>`,
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
    trone: () => `<g><rect x="-110" y="-40" width="220" height="40" fill="#8a1f2b"/><rect x="-116" y="-46" width="232" height="8" fill="#c9a227"/>
      <path d="M-92 -46 L-92 -250 L92 -250 L92 -46 Z" fill="#24438a"/>${[-60, -20, 20, 60].map(x => [-210, -160, -110].map(y => `<circle cx="${x}" cy="${y}" r="4" fill="#e3b53a"/>`).join("")).join("")}
      <path d="M-104 -250 L104 -250 L94 -222 Q0 -210 -94 -222 Z" fill="#c9a227"/><path d="M-104 -250 Q-120 -150 -100 -46 L-88 -46 Q-100 -150 -92 -250 Z M104 -250 Q120 -150 100 -46 L88 -46 Q100 -150 92 -250 Z" fill="#8a1f2b"/>
      <rect x="-32" y="-150" width="64" height="104" rx="12" fill="#c9a227"/><rect x="-24" y="-140" width="48" height="60" rx="9" fill="#8a1f2b"/><rect x="-38" y="-80" width="76" height="14" rx="4" fill="#8a1f2b"/></g>`,
    peis: o => `<g><rect x="-84" y="-134" width="168" height="16" fill="#e8e0d0"/><rect x="-74" y="-118" width="148" height="118" fill="#d8d0c0"/><rect x="-50" y="-92" width="100" height="92" rx="4" fill="#2a2420"/>
      <path d="M-34 -6 L34 -10 M-30 -12 L30 -4" stroke="#6b4a2a" stroke-width="7" stroke-linecap="round"/>
      ${o && o.av ? "" : `<g class="flakk"><path d="M-30 -8 Q-34 -36 -16 -54 Q-14 -34 0 -64 Q8 -40 16 -52 Q32 -30 28 -8 Z" fill="#ff8a2a"/><path d="M-16 -8 Q-18 -26 -4 -38 Q2 -22 12 -30 Q20 -16 14 -8 Z" fill="#ffd54a"/></g>`}
      <rect x="-60" y="-200" width="120" height="66" rx="4" fill="#c9a227"/><rect x="-54" y="-194" width="108" height="54" fill="#a9c2d6"/></g>`,
    vindebro: o => o && o.nede
      ? `<g><rect x="-50" y="-150" width="100" height="150" rx="50" fill="#1b1a18"/><path d="M-50 0 L-60 40 L60 40 L50 0 Z" fill="#7a5a3a"/><path d="M-56 12 h112 M-58 26 h116" stroke="#5a3a1a" stroke-width="3"/><path d="M-50 -110 L-60 40 M50 -110 L60 40" stroke="#555" stroke-width="3" stroke-dasharray="6 4"/></g>`
      : `<g><rect x="-50" y="-150" width="100" height="150" rx="50" fill="#1b1a18"/><rect x="-54" y="-150" width="108" height="150" fill="#7a5a3a"/><path d="M-54 -120 h108 M-54 -90 h108 M-54 -60 h108 M-54 -30 h108" stroke="#5a3a1a" stroke-width="3"/>
        <path d="M-54 -150 L-80 -200 M54 -150 L80 -200" stroke="#555" stroke-width="4" stroke-dasharray="7 4"/></g>`,
    kokardeskilt: () => `<g><rect x="-3" y="-90" width="6" height="90" fill="#6b4a2a"/><circle cx="0" cy="-104" r="22" fill="#1f3d7a"/><circle cx="0" cy="-104" r="15" fill="#fff"/><circle cx="0" cy="-104" r="8" fill="#c0392b"/></g>`,
    nokkel: o => `<g><rect x="-40" y="-30" width="80" height="30" fill="#6a5a4a"/><path d="M-30 -30 v-6 M30 -30 v-6" stroke="#333" stroke-width="3"/>
      ${o && o.tatt ? "" : `<g transform="translate(0 -60)"><circle cx="0" cy="-10" r="11" fill="none" stroke="#b0832f" stroke-width="5"/><path d="M0 1 V40 M0 30 h10 M0 38 h8" stroke="#b0832f" stroke-width="5"/></g>`}
      <rect x="-4" y="-104" width="8" height="8" fill="#333"/></g>`,
    protokoll: () => `<g><rect x="-50" y="-60" width="100" height="10" fill="#5a4030"/><rect x="-44" y="-50" width="8" height="50" fill="#4a3020"/><rect x="36" y="-50" width="8" height="50" fill="#4a3020"/>
      <path d="M-34 -62 Q-16 -70 0 -64 Q16 -70 34 -62 L34 -60 L-34 -60 Z" fill="#f4ecd8" stroke="#a89060"/><path d="M-28 -64 h20 M8 -64 h20" stroke="#8a7a5a" stroke-width="1"/>
      <rect x="22" y="-76" width="6" height="14" fill="#efe6d0"/><path d="M25 -76 q-4 -8 0 -12 q4 4 0 12" fill="#ffb347"/></g>`,
    seng: () => `<g><rect x="-120" y="-220" width="240" height="14" fill="#c9a227"/><path d="M-120 -206 Q-130 -100 -114 -40 L-100 -40 Q-108 -120 -100 -206 Z M120 -206 Q130 -100 114 -40 L100 -40 Q108 -120 100 -206 Z" fill="#24438a"/>
      <rect x="-104" y="-206" width="208" height="110" fill="#e8dcc0"/><rect x="-110" y="-60" width="220" height="40" rx="8" fill="#f4f1ea"/><rect x="-110" y="-90" width="220" height="34" rx="10" fill="#3e5a8a"/>
      <ellipse cx="-70" cy="-92" rx="30" ry="12" fill="#fff"/><rect x="-116" y="-24" width="8" height="24" fill="#c9a227"/><rect x="108" y="-24" width="8" height="24" fill="#c9a227"/></g>`,
    dagbok: () => `<g><rect x="-26" y="-60" width="52" height="60" fill="#8a5a3a"/><rect x="-30" y="-64" width="60" height="6" fill="#a07a50"/><rect x="-18" y="-74" width="34" height="10" fill="#2e4a7a"/><rect x="-16" y="-72" width="30" height="6" fill="#f4e7c9"/></g>`,
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
    speilsal() {
      let s = `<defs><linearGradient id="speil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6eef4"/><stop offset=".5" stop-color="#b9c9d8"/><stop offset="1" stop-color="#dfe8ef"/></linearGradient></defs>`;
      s += `<rect width="800" height="450" fill="#ead9a8"/><rect width="800" height="64" fill="#7d9cc4"/>`;
      srand(21); for (let i = 0; i < 9; i++) s += `<ellipse cx="${rnd() * 800}" cy="${14 + rnd() * 34}" rx="${30 + rnd() * 30}" ry="9" fill="#fff" opacity=".7"/>`;
      s += `<rect y="58" width="800" height="12" fill="#c9a227"/>`;
      for (let x = 15; x < 800; x += 130) {
        s += `<path d="M${x} 298 V128 A45 45 0 0 1 ${x + 90} 128 V298 Z" fill="url(#speil)" stroke="#c9a227" stroke-width="7"/>`;
        s += `<path d="M${x + 30} 90 V298 M${x + 60} 90 V298 M${x} 160 H${x + 90} M${x} 230 H${x + 90}" stroke="#c9a227" stroke-width="2" opacity=".8"/>`;
        s += `<path d="M${x + 12} 280 L${x + 52} 120" stroke="#fff" stroke-width="7" opacity=".45"/>`;
        s += `<rect x="${x + 100}" y="80" width="20" height="220" fill="#e0c46e"/><circle cx="${x + 110}" cy="96" r="8" fill="#c9a227"/>`;
      }
      s += `<rect y="296" width="800" height="26" fill="#d9be78"/><rect y="320" width="800" height="130" fill="#a8743f"/>`;
      for (let x = -200; x < 1000; x += 46) s += `<path d="M${x} 320 L${x + 130} 450 M${x + 130} 320 L${x} 450" stroke="#8a5a2f" stroke-width="2"/>`;
      [140, 400, 660].forEach(x => { s += `<g transform="translate(${x} 450) scale(.85)">${TING.lysekrone()}</g>`; });
      return s;
    },
    forhall() {
      let s = `<rect width="800" height="450" fill="#ece3d0"/>`;
      for (let x = 20; x < 800; x += 160) s += `<rect x="${x}" y="70" width="120" height="200" fill="none" stroke="#d4c7a8" stroke-width="5"/><rect x="${x + 12}" y="82" width="96" height="176" fill="none" stroke="#c9a227" stroke-width="2" opacity=".6"/>`;
      s += `<rect width="800" height="40" fill="#d8c9a6"/><rect y="38" width="800" height="8" fill="#c9a227"/>`;
      s += `<rect y="300" width="800" height="22" fill="#c9b88f"/><rect y="320" width="800" height="130" fill="#e8e4dc"/>`;
      for (let r = 0; r < 5; r++) for (let x = (r % 2) * 50; x < 800; x += 100) s += `<rect x="${x}" y="${320 + r * 26}" width="50" height="26" fill="#2e2e34" opacity=".85"/>`;
      return s;
    },
    stendersal() {
      let s = `<rect width="800" height="450" fill="#eadfc6"/><rect width="800" height="44" fill="#d6c49c"/><rect y="40" width="800" height="8" fill="#c9a227"/>`;
      s += `<rect y="120" width="800" height="14" fill="#c9a227"/>`;
      srand(31); for (let x = 30; x < 800; x += 26) if (x < 290 || x > 510) s += `<circle cx="${x}" cy="${110 - rnd() * 6}" r="7" fill="${pick(["#f1c7a3", "#e2b48c", "#f6d5bb"])}"/><path d="M${x - 9} 124 q9 -14 18 0" fill="${pick(["#3a4a6a", "#7a2e2e", "#2a2a30", "#6a5a3a"])}"/>`;
      for (let x = 20; x < 800; x += 95) s += `<rect x="${x}" y="48" width="24" height="254" fill="#f6f1e6"/><rect x="${x - 4}" y="48" width="32" height="10" fill="#e0d4b8"/><rect x="${x - 4}" y="292" width="32" height="10" fill="#e0d4b8"/>`;
      s += `<rect y="300" width="800" height="150" fill="#8a5a3a"/><path d="M330 300 L470 300 L560 450 L240 450 Z" fill="#9a2a2a" opacity=".85"/>`;
      const benk = (x, y, w, f, hode, hatt) => {
        let b = `<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="${f}"/><rect x="${x}" y="${y + 16}" width="${w}" height="6" fill="${mix(f, -.3)}"/>`;
        for (let hx = x + 12; hx < x + w - 6; hx += 20) b += `<path d="M${hx - 9} ${y + 2} q9 -22 18 0 Z" fill="${hatt}"/><circle cx="${hx}" cy="${y - 18}" r="7" fill="${hode}"/>${hatt === "#f4f1ea" ? `<circle cx="${hx}" cy="${y - 24}" r="6" fill="#f4f1ea"/>` : `<path d="M${hx - 7} ${y - 22} q7 -8 14 0" fill="${hatt}"/>`}`;
        return b;
      };
      s += benk(20, 320, 200, "#6a3a7a", "#f0c8a8", "#5a2a6a") + benk(40, 352, 180, "#6a3a7a", "#f0c8a8", "#5a2a6a");
      s += benk(580, 320, 200, "#9a2a2a", "#f6d5bb", "#f4f1ea") + benk(580, 352, 180, "#9a2a2a", "#f6d5bb", "#f4f1ea");
      return s;
    },
    regngate() {
      let s = sky("rgSky", "#6f7c8c", "#aeb8c2");
      s += `<rect x="40" y="70" width="720" height="262" fill="#d6cdbc"/><rect x="30" y="58" width="740" height="16" fill="#bfb49e"/><path d="M30 58 L400 18 L770 58 Z" fill="#8a8f99"/>`;
      for (let x = 70; x < 760; x += 90) if (x < 340 || x > 470) s += `<rect x="${x}" y="100" width="44" height="80" fill="#5a6676"/><rect x="${x}" y="210" width="44" height="80" fill="#5a6676"/><path d="M${x + 22} 100 v80 M${x + 22} 210 v80" stroke="#d6cdbc" stroke-width="3"/>`;
      s += `<rect x="350" y="90" width="100" height="40" fill="#bfb49e"/><text x="400" y="116" font-size="11" text-anchor="middle" font-family="Georgia" fill="#4a4030">MENUS-PLAISIRS</text>`;
      s += `<rect y="330" width="800" height="120" fill="#7f7a74"/>`;
      srand(41); for (let i = 0; i < 80; i++) s += `<ellipse cx="${rnd() * 800}" cy="${338 + rnd() * 108}" rx="${9 + rnd() * 8}" ry="${3 + rnd() * 3}" fill="#6c6761"/>`;
      s += `<ellipse cx="180" cy="420" rx="70" ry="9" fill="#a9b8c8" opacity=".6"/><ellipse cx="610" cy="398" rx="50" ry="7" fill="#a9b8c8" opacity=".6"/>`;
      srand(43); let d = ""; for (let i = 0; i < 18; i++) { const x = rnd() * 820 - 10, y = rnd() * 36; for (let k = -1; k < 14; k++) d += `M${x} ${y + k * 36} l-4 14 `; }
      s += `<g class="regn"><path d="${d}" stroke="#e4eef8" stroke-width="1.6" opacity=".55" stroke-linecap="round"/></g>`;
      return s;
    },
    ballhus() {
      let s = `<rect width="800" height="450" fill="#ece6d8"/><rect width="800" height="30" fill="#8a6a4a"/>`;
      for (let x = 30; x < 800; x += 105) {
        s += `<rect x="${x}" y="50" width="60" height="120" fill="#a9bfd0"/><path d="M${x + 30} 50 v120 M${x} 110 h60" stroke="#ece6d8" stroke-width="4"/>`;
        s += `<path d="M${x - 4} 46 Q${x + 18} 110 ${x + 6} 178 L${x - 6} 178 Z" fill="#f4f1ea" opacity=".9"/>`;
      }
      srand(51); for (let x = 30; x < 800; x += 105) for (let i = 0; i < 3; i++) s += `<circle cx="${x + 12 + i * 18}" cy="${150 + rnd() * 6}" r="6" fill="${pick(["#f1c7a3", "#e2b48c", "#f6d5bb"])}"/><path d="M${x + 4 + i * 18} 170 q8 -14 16 0" fill="${pick(["#c0392b", "#2a2a30", "#6a5a3a", "#1f3d7a"])}"/>`;
      s += `<rect y="178" width="800" height="10" fill="#8a6a4a"/><rect y="188" width="800" height="124" fill="#2b2b30"/>`;
      s += `<path d="M0 188 L800 188" stroke="#555" stroke-width="2"/><path d="M0 250 L800 250" stroke="#3a3a40" stroke-width="2" stroke-dasharray="10 8"/>`;
      s += `<rect y="310" width="800" height="140" fill="#cdbfa6"/>`;
      for (let y = 330; y < 450; y += 24) s += `<path d="M0 ${y} H800" stroke="#b8a98e" stroke-width="2"/>`;
      for (let x = -200; x < 1000; x += 80) s += `<path d="M${x} 310 L${(x - 400) * 1.4 + 400} 450" stroke="#b8a98e" stroke-width="2"/>`;
      return s;
    },
    palais() {
      let s = sky("paSky", "#9cc2e4", "#f2e2c4");
      s += `<rect x="0" y="80" width="300" height="250" fill="#e6d8bc"/><path d="M-10 80 L150 30 L310 80 Z" fill="#7a4a3a"/><rect x="0" y="80" width="300" height="10" fill="#c9b79a"/>`;
      s += `<rect x="20" y="200" width="260" height="130" fill="#6a3a2a"/><rect x="34" y="214" width="110" height="80" fill="#f2d9a8"/><rect x="160" y="214" width="56" height="116" fill="#4a2a1a"/>`;
      s += [50, 80, 110].map((x, i) => `<ellipse cx="${x}" cy="${270 - (i % 2) * 6}" rx="14" ry="7" fill="#c98a3a"/>`).join("") + `<ellipse cx="66" cy="252" rx="12" ry="6" fill="#b87a2a"/><ellipse cx="96" cy="250" rx="12" ry="6" fill="#c98a3a"/>`;
      s += `<rect x="30" y="172" width="240" height="24" fill="#c9a227"/><text x="150" y="190" font-size="15" text-anchor="middle" font-family="Georgia" font-weight="700" fill="#3a2a06">BOULANGERIE</text>`;
      s += `<rect x="40" y="110" width="40" height="50" fill="#5a6676"/><rect x="130" y="110" width="40" height="50" fill="#5a6676"/><rect x="220" y="110" width="40" height="50" fill="#5a6676"/>`;
      s += `<rect x="320" y="60" width="480" height="270" fill="#efe6d0"/><rect x="320" y="52" width="480" height="12" fill="#d8c9a6"/>`;
      for (let x = 340; x < 800; x += 64) s += `<path d="M${x} 330 V250 A22 22 0 0 1 ${x + 44} 250 V330 Z" fill="#9aa4a8"/><rect x="${x + 6}" y="96" width="32" height="56" fill="#5a6676"/>`;
      srand(61); [360, 470, 590, 700].forEach(x => { s += `<rect x="${x - 6}" y="250" width="12" height="80" fill="#5a3a24"/>`; for (let i = 0; i < 6; i++) s += `<circle cx="${x + (rnd() - .5) * 70}" cy="${220 + (rnd() - .5) * 50}" r="${22 + rnd() * 10}" fill="${pick(["#4a8a42", "#3f7a3a", "#56984c"])}"/>`; });
      s += `<rect y="330" width="800" height="120" fill="#b8ad9a"/>`;
      srand(63); for (let i = 0; i < 70; i++) s += `<ellipse cx="${rnd() * 800}" cy="${340 + rnd() * 110}" rx="${10 + rnd() * 8}" ry="${4 + rnd() * 3}" fill="#a69c88"/>`;
      return s;
    },
    bastille() {
      let s = sky("baSky", "#8a96a6", "#e8c49a");
      srand(71); for (let i = 0; i < 10; i++) s += `<circle cx="${100 + rnd() * 600}" cy="${30 + rnd() * 80}" r="${20 + rnd() * 30}" fill="#6a6a70" opacity=".35"/>`;
      const torn = x => `<rect x="${x - 46}" y="40" width="92" height="270" fill="#6e6a64"/><ellipse cx="${x}" cy="40" rx="46" ry="10" fill="#7e7a74"/>
        ${[-36, -12, 12, 36].map(d => `<rect x="${x + d - 8}" y="22" width="16" height="18" fill="#6e6a64"/>`).join("")}<rect x="${x - 6}" y="120" width="12" height="24" fill="#2a2826"/><rect x="${x - 6}" y="200" width="12" height="24" fill="#2a2826"/>`;
      s += `<rect x="150" y="70" width="500" height="240" fill="#625e58"/>`;
      for (let y = 80; y < 310; y += 22) s += `<path d="M150 ${y} H650" stroke="#56524c" stroke-width="2"/>`;
      s += torn(150) + torn(330) + torn(470) + torn(650);
      s += `<rect y="300" width="800" height="30" fill="#3a4a52"/><path d="M0 310 Q200 304 400 312 T800 308" stroke="#5a6a72" stroke-width="3" fill="none"/>`;
      s += `<rect y="328" width="800" height="122" fill="#a89a80"/>`;
      srand(73); for (let i = 0; i < 50; i++) s += `<ellipse cx="${rnd() * 800}" cy="${340 + rnd() * 110}" rx="${8 + rnd() * 8}" ry="${3 + rnd() * 3}" fill="#968a72"/>`;
      srand(75); for (let x = 0; x < 800; x += 22) if (x < 340 || x > 470) s += `<circle cx="${x}" cy="${332 - rnd() * 6}" r="8" fill="${pick(["#e2b48c", "#f1c7a3", "#d9a37a"])}"/><path d="M${x - 10} 350 q10 -16 20 0" fill="${pick(["#c0392b", "#2a2a30", "#6a5a3a", "#1f3d7a", "#8a7350"])}"/>`;
      return s;
    },
    celle() {
      let s = `<rect width="800" height="450" fill="#5a5650"/>`;
      srand(81); for (let y = 0; y < 330; y += 30) for (let x = (y / 30 % 2) * 40 - 40; x < 800; x += 80) s += `<rect x="${x + 2}" y="${y + 2}" width="76" height="26" rx="3" fill="${pick(["#625e58", "#6a665f", "#5e5a54"])}"/>`;
      s += `<rect x="330" y="60" width="90" height="70" fill="#9ab0c4"/>${[345, 360, 375, 390, 405].map(x => `<rect x="${x}" y="60" width="5" height="70" fill="#2a2826"/>`).join("")}`;
      s += `<path d="M330 130 L420 130 L560 330 L360 330 Z" fill="#fff6c8" opacity=".12"/>`;
      s += `<path d="M120 120 l6 30 l-6 30 l6 30" stroke="#3a3836" stroke-width="5" fill="none"/><path d="M150 120 l6 30 l-6 30 l6 30" stroke="#3a3836" stroke-width="5" fill="none"/>`;
      s += `<g stroke="#3a3836" stroke-width="2.5">${Array.from({ length: 4 }, (_, g) => `<path d="M${480 + g * 34} 160 v24 M${487 + g * 34} 160 v24 M${494 + g * 34} 160 v24 M${501 + g * 34} 160 v24 M${476 + g * 34} 178 l30 -14"/>`).join("")}</g>`;
      s += `<text x="190" y="250" font-size="16" font-family="Georgia" fill="#3a3836" transform="rotate(-6 190 250)">F.-M. A. 1717</text>`;
      s += `<rect y="330" width="800" height="120" fill="#4a463f"/>`;
      srand(83); for (let i = 0; i < 90; i++) { const x = rnd() * 800, y = 336 + rnd() * 110; s += `<path d="M${x} ${y} l${8 + rnd() * 10} ${-3 + rnd() * 6}" stroke="#b8a060" stroke-width="2" opacity=".7"/>`; }
      return s;
    },
    soverom() {
      let s = `<rect width="800" height="450" fill="#e8dcc0"/>`;
      for (let x = 20; x < 800; x += 160) s += `<rect x="${x}" y="60" width="120" height="220" fill="#3e5a8a"/><rect x="${x + 8}" y="68" width="104" height="204" fill="none" stroke="#c9a227" stroke-width="3"/>`;
      s += `<rect width="800" height="44" fill="#d8c9a6"/><rect y="42" width="800" height="8" fill="#c9a227"/>`;
      s += `<rect x="640" y="80" width="110" height="180" fill="#1d2a4a"/><circle cx="700" cy="120" r="14" fill="#f4f1d0"/><path d="M695 80 v180 M640 170 h110" stroke="#e8d8b0" stroke-width="6"/>`;
      s += `<rect y="300" width="800" height="22" fill="#d9be78"/><rect y="320" width="800" height="130" fill="#a8743f"/>`;
      for (let x = -200; x < 1000; x += 46) s += `<path d="M${x} 320 L${x + 130} 450 M${x + 130} 320 L${x} 450" stroke="#8a5a2f" stroke-width="2"/>`;
      s += `<rect width="800" height="450" fill="#0a1030" opacity=".28"/>`;
      return s;
    },
    stendersalNatt() {
      let s = BG.stendersal() + `<rect width="800" height="450" fill="#0a1030" opacity=".5"/>`;
      [90, 250, 550, 710].forEach(x => { s += `<circle cx="${x}" cy="280" r="40" fill="#ffd36a" opacity=".16"/><rect x="${x - 3}" y="282" width="6" height="18" fill="#f4f1ea"/><path d="M${x} 282 q-4 -8 0 -14 q4 6 0 14" fill="#ffcf5a"/>`; });
      return s;
    },
    slottsport() {
      let s = sky("spSky", "#6f7c8c", "#b8c0c8");
      s += `<rect x="60" y="110" width="680" height="150" fill="#e0d4b8"/><rect x="50" y="98" width="700" height="14" fill="#bfb49e"/><path d="M50 98 L400 60 L750 98 Z" fill="#7a8a99"/>`;
      for (let x = 80; x < 730; x += 52) if (x < 360 || x > 430) s += `<rect x="${x}" y="130" width="26" height="46" fill="#5a6676"/><rect x="${x}" y="196" width="26" height="46" fill="#5a6676"/>`;
      s += `<rect x="350" y="120" width="100" height="74" fill="#5a6676"/><rect x="340" y="190" width="120" height="8" fill="#c9a227"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${344 + i * 14}" y="198" width="3" height="18" fill="#c9a227"/>`).join("")}<rect x="340" y="214" width="120" height="5" fill="#c9a227"/>`;
      s += `<rect y="258" width="800" height="72" fill="#a59c8c"/>`;
      for (let x = 0; x < 800; x += 18) if (x < 330 || x > 470) s += `<path d="M${x} 330 V270" stroke="#2a2a2a" stroke-width="4"/><path d="M${x - 4} 272 L${x} 260 L${x + 4} 272 Z" fill="#c9a227"/>`;
      s += `<path d="M0 290 H330 M470 290 H800 M0 318 H330 M470 318 H800" stroke="#2a2a2a" stroke-width="4"/><path d="M330 330 V240 M470 330 V240" stroke="#2a2a2a" stroke-width="8"/><circle cx="330" cy="234" r="9" fill="#c9a227"/><circle cx="470" cy="234" r="9" fill="#c9a227"/>`;
      s += `<rect y="330" width="800" height="120" fill="#7a6e60"/>`;
      srand(91); for (let i = 0; i < 40; i++) s += `<ellipse cx="${rnd() * 800}" cy="${340 + rnd() * 108}" rx="${18 + rnd() * 20}" ry="${3 + rnd() * 3}" fill="#6a5e50"/>`;
      srand(93); let d = ""; for (let i = 0; i < 18; i++) { const x = rnd() * 820 - 10, y = rnd() * 36; for (let k = -1; k < 14; k++) d += `M${x} ${y + k * 36} l-4 14 `; }
      s += `<g class="regn"><path d="${d}" stroke="#e4eef8" stroke-width="1.6" opacity=".5" stroke-linecap="round"/></g>`;
      return s;
    },
    kart() { return `<rect width="800" height="450" fill="#f2e6c8"/>`; },
  };

  /* ---------- portrett: hodeutsnitt av en figur (viewBox per figur, ellers standard) ---------- */
  const PVB = { ugle: "-34 -100 68 68", barn: "-34 -142 68 68", forteller: "-34 -194 68 68", madame: "-40 -236 80 80", kant: "-36 -194 72 72",
    lafayette: "-40 -216 80 80", fange: "-40 -214 80 80", baker: "-40 -224 80 80",
    dronning: "-44 -246 88 88", kongen: "-40 -218 80 80", biskop: "-42 -236 84 84", mirabeau: "-42 -232 84 84", bailly: "-40 -222 80 80", seremonimester: "-40 -216 80 80", adelsmann: "-40 -216 80 80" };
  function portrett(navn, o) {
    if (navn === "deg") {
      if (window.Gull) return Gull.tegn(Gull.tilstand(), { bakgrunn: false, venn: false, vb: "62 22 116 116" });
      return `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="#ccc"/></svg>`;
    }
    const f = FIG[navn]; if (!f) return "";
    const vb = PVB[navn] || "-38 -210 76 76";
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${f(o || {})}</svg>`;
  }

  window.KUNST = { person, ugle, FIG, fig: FIG, TING, ting: TING, BG, bg: BG, portrett, mix };
})();
