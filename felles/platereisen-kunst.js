/* ==========================================================================
   PLATEREISEN – tegningene (SVG). Verden er 800 × 450.
   Bygger på tidsreisen-kunst.js (KUNST.person m.m.) og legger til egne figurer,
   ting og bakgrunner. Lastes ETTER tidsreisen-kunst.js (ikke sammen med
   fortellingsreisen-kunst.js – begge har nøklene «gate», «kurv» og «lykt»).

   Respekt: Spillet handler om slaveriet og afroamerikansk musikk. Alle figurer
   tegnes med samme omsorg: naturlige, varierte hudtoner og vanlige ansiktstrekk
   fra person(). Ingen lenker, pisker, sår eller vold i noen tegning.
   Skurken DJ Glatt har en fantasifarge (lys lilla-grå) som ikke er en hudfarge.
   ========================================================================== */
(function () {
  "use strict";
  const K = window.KUNST; if (!K) return;
  const person = K.person, mix = K.mix;

  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const srand = s => { seed = s; };
  const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="450" fill="url(#${id})"/>`;
  const esc = t => String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const FONT = "Atkinson Hyperlegible,Arial,sans-serif";
  const hy = -168, ey = hy - 1, my = hy + 13; // hode, øyne og munn i person()

  /* hudtoner (varierte, naturlige) */
  const H = { a: "#8d5a3b", b: "#6b4228", c: "#a8714a", d: "#5a3a24", e: "#7a4e30" };
  const LYS = "#f1c7a3";
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };

  /* messing, noter */
  const B = "#d9a830", BM = "#a87a18", BL = "#f3d97a";
  const note = (x, y, s, f, dobbel) => `<g transform="translate(${x} ${y}) scale(${s || 1})" fill="${f}">` + (dobbel
    ? `<ellipse cx="-8" cy="0" rx="5" ry="3.6" transform="rotate(-20 -8 0)"/><ellipse cx="8" cy="-4" rx="5" ry="3.6" transform="rotate(-20 8 -4)"/><path d="M-3.6 -1 V-22 M12.4 -5 V-26" stroke="${f}" stroke-width="2"/><path d="M-3.6 -22 L12.4 -26" stroke="${f}" stroke-width="4.5"/>`
    : `<ellipse cx="0" cy="0" rx="5" ry="3.6" transform="rotate(-20)"/><path d="M4.4 -1 V-22 q7 3 7 11" stroke="${f}" stroke-width="2" fill="none"/>`) + `</g>`;
  const noter = (pos, cls) => `<g class="${cls || "svev"}">${pos.map(([x, y, s, f, d]) => note(x, y, s, f, d)).join("")}</g>`;

  /* ---------- armer: person() tegner armene hengende; noen figurer trenger egne ---------- */
  const ARM_RE = /<path d="M-?[\d.]+ -138 Q-?[\d.]+ -110 -?[\d.]+ -84"[^>]*\/>/g;
  const HAND_RE = /<circle cx="-?[\d.]+" cy="-80" r="6\.5"[^>]*\/>/g;
  const arm = (f, x1, y1, cx, cy, x2, y2) => `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${mix(f, -.12)}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
  const hand = (hud, x, y) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${hud}"/>`;
  const armV = f => arm(f, -26, -138, -38, -110, -34, -84);   // venstre (sett fra oss) hengende
  const armH = f => arm(f, 26, -138, 38, -110, 34, -84);      // høyre hengende

  /* P: person med pynt foran/bak; utenArmer fjerner standardarmene (figuren tegner egne i «foran») */
  function P(o, foran, bak, utenArmer) {
    const sk = o.skala || 1;
    let s = person(Object.assign({}, o, { skala: 1 }));
    if (lum(o.hud || LYS) < .52) s = s.split("#7a3b2e").join("#2e140e"); // tydelig munn på mørk hud
    if (utenArmer) s = s.replace(ARM_RE, "").replace(HAND_RE, "");
    return `<g transform="scale(${sk})">${bak || ""}${s}${foran || ""}</g>`;
  }

  /* ---------- hodeplagg, hår og pynt oppå person() ---------- */
  const PY = {
    straahatt: c => { c = c || "#e2c278"; return `<ellipse cx="0" cy="${hy - 12}" rx="35" ry="7" fill="${c}"/><path d="M-17 ${hy - 12} Q-18 ${hy - 37} 0 ${hy - 37} Q18 ${hy - 37} 17 ${hy - 12} Z" fill="${mix(c, -.08)}"/>
      <rect x="-17" y="${hy - 20}" width="34" height="5" fill="#8a5a2a"/><path d="M-30 ${hy - 11} H30 M-24 ${hy - 8} H24 M-10 ${hy - 30} q10 -4 20 0" stroke="${mix(c, -.22)}" stroke-width="1" fill="none"/>`; },
    fedora: c => { c = c || "#3a342e"; return `<ellipse cx="0" cy="${hy - 14}" rx="31" ry="6" fill="${c}"/><path d="M-18 ${hy - 14} L-16 ${hy - 34} Q-8 ${hy - 38} 0 ${hy - 32} Q8 ${hy - 38} 16 ${hy - 34} L18 ${hy - 14} Z" fill="${c}"/>
      <rect x="-17.5" y="${hy - 21}" width="35" height="5" fill="${mix(c, -.35)}"/>`; },
    bowler: c => { c = c || "#1b1b22"; return `<path d="M-29 ${hy - 13} Q0 ${hy - 6} 29 ${hy - 13} Q30 ${hy - 18} 24 ${hy - 17} Q0 ${hy - 12} -24 ${hy - 17} Q-30 ${hy - 18} -29 ${hy - 13} Z" fill="${c}"/>
      <path d="M-19 ${hy - 15} Q-21 ${hy - 44} 0 ${hy - 44} Q21 ${hy - 44} 19 ${hy - 15} Z" fill="${c}"/><rect x="-19" y="${hy - 21}" width="38" height="5" fill="${mix(c, .18)}"/>
      <path d="M-10 ${hy - 38} Q-4 ${hy - 42} 4 ${hy - 41}" stroke="#fff" stroke-width="2" opacity=".25" fill="none"/>`; },
    kirkehatt: (c, blomst) => { c = c || "#2f5d9a"; return `<ellipse cx="0" cy="${hy - 14}" rx="37" ry="8" fill="${c}" transform="rotate(-6 0 ${hy - 14})"/><path d="M-17 ${hy - 15} Q-16 ${hy - 36} 0 ${hy - 36} Q16 ${hy - 36} 17 ${hy - 15} Z" fill="${mix(c, -.1)}"/>
      <rect x="-17" y="${hy - 22}" width="34" height="5" fill="#fbfaf5"/>${[[12, -25, "#f2a7c0"], [19, -22, "#fbfaf5"], [6, -21, "#f4d03f"]].map(([x, y, f]) => `<circle cx="${x}" cy="${hy + y}" r="4.5" fill="${f}"/><circle cx="${x}" cy="${hy + y}" r="1.6" fill="#c9a227"/>`).join("")}`; },
    hodeomslag: c => { c = c || "#c0392b"; return `<path d="M-24 ${hy + 2} Q-29 ${hy - 34} 0 ${hy - 36} Q29 ${hy - 34} 24 ${hy + 2} Q20 ${hy - 15} 0 ${hy - 17} Q-20 ${hy - 15} -24 ${hy + 2} Z" fill="${c}"/>
      <path d="M-20 ${hy - 18} Q0 ${hy - 30} 20 ${hy - 20} M-22 ${hy - 8} Q0 ${hy - 22} 22 ${hy - 10}" stroke="${mix(c, -.22)}" stroke-width="2" fill="none"/>
      <ellipse cx="-2" cy="${hy - 37}" rx="9" ry="6" fill="${mix(c, .08)}" transform="rotate(-24 -2 ${hy - 37})"/><ellipse cx="11" cy="${hy - 37}" rx="8" ry="5.5" fill="${mix(c, .08)}" transform="rotate(28 11 ${hy - 37})"/><circle cx="5" cy="${hy - 34}" r="4" fill="${mix(c, -.12)}"/>`; },
    lue: c => `<path d="M-22 ${hy - 8} Q-20 ${hy - 32} 2 ${hy - 31} Q24 ${hy - 30} 22 ${hy - 8} Z" fill="${c}"/><path d="M-23 ${hy - 8} L23 ${hy - 8}" stroke="${mix(c, -.2)}" stroke-width="5" stroke-linecap="round"/><circle cx="2" cy="${hy - 33}" r="4" fill="${mix(c, .25)}"/>`,
    slikk: c => `<path d="M-21 ${hy - 2} Q-23 ${hy - 29} 0 ${hy - 29} Q23 ${hy - 29} 21 ${hy - 2} Q18 ${hy - 16} 0 ${hy - 18} Q-18 ${hy - 16} -21 ${hy - 2} Z" fill="${c}"/>
      <path d="M-13 ${hy - 21} Q0 ${hy - 27} 13 ${hy - 21} M-9 ${hy - 25} Q2 ${hy - 29} 11 ${hy - 25}" stroke="#fff" stroke-width="1.6" opacity=".45" fill="none"/>`,
    bolge: c => `<path d="M-22 ${hy + 4} Q-26 ${hy - 29} 0 ${hy - 28} Q26 ${hy - 29} 22 ${hy + 4} Q19 ${hy - 10} 9 ${hy - 14} Q-3 ${hy - 9} -10 ${hy - 15} Q-19 ${hy - 10} -22 ${hy + 4} Z" fill="${c}"/>
      <path d="M-19 ${hy - 16} q5 -6 10 0 q5 6 10 0 q5 -6 10 0 M-16 ${hy - 23} q5 -5 10 0 q5 5 10 0 q5 -5 8 0" stroke="${mix(c, .28)}" stroke-width="1.6" fill="none"/>
      <path d="M-6 ${hy - 13} q-6 4 -2 8 q4 -1 2 -4" stroke="${c}" stroke-width="2" fill="none"/>`,
    pompadour: c => `<path d="M-21 ${hy - 4} Q-25 ${hy - 30} -9 ${hy - 38} Q6 ${hy - 49} 22 ${hy - 38} Q30 ${hy - 28} 21 ${hy - 6} Q15 ${hy - 22} 0 ${hy - 21} Q-12 ${hy - 19} -21 ${hy - 4} Z" fill="${c}"/>
      <path d="M-6 ${hy - 36} Q8 ${hy - 46} 20 ${hy - 36}" stroke="#fff" stroke-width="2" opacity=".35" fill="none"/>
      <path d="M-21 ${hy - 8} V${hy + 9} M21 ${hy - 8} V${hy + 9}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
    flattop: c => `<path d="M-21 ${hy - 2} L-21 ${hy - 24} Q-20 ${hy - 31} -13 ${hy - 31} L13 ${hy - 31} Q20 ${hy - 31} 21 ${hy - 24} L21 ${hy - 2} Q14 ${hy - 14} 0 ${hy - 14} Q-14 ${hy - 14} -21 ${hy - 2} Z" fill="${c}"/>`,
    hestehale: c => `<path d="M8 ${hy - 22} Q40 ${hy - 24} 38 ${hy + 8} Q36 ${hy + 30} 26 ${hy + 42} Q28 ${hy + 14} 12 ${hy - 6} Z" fill="${c}"/>`,
    sloyfeHar: c => `<path d="M14 ${hy - 26} l-8 -6 l1 12 Z M14 ${hy - 26} l9 -5 l-2 12 Z" fill="${c}"/><circle cx="14" cy="${hy - 25}" r="2.6" fill="${mix(c, -.2)}"/>`,
    solbriller: () => `<g><rect x="-16" y="${ey - 5}" width="13" height="9" rx="3" fill="#15151c"/><rect x="3" y="${ey - 5}" width="13" height="9" rx="3" fill="#15151c"/>
      <path d="M-3 ${ey - 2} h6 M-16 ${ey - 2} L-21 ${ey - 4} M16 ${ey - 2} L21 ${ey - 4}" stroke="#15151c" stroke-width="2"/><path d="M-13 ${ey - 3} l4 -1 M6 ${ey - 3} l4 -1" stroke="#fff" stroke-width="1.3" opacity=".7"/></g>`,
    briller: () => `<g stroke="#2a2a2a" stroke-width="1.8" fill="none"><rect x="-15" y="${ey - 5}" width="12" height="10" rx="3"/><rect x="3" y="${ey - 5}" width="12" height="10" rx="3"/><path d="M-3 ${ey - 1} L3 ${ey - 1}"/></g>`,
    telefonerHals: () => `<path d="M-19 -147 Q0 -126 19 -147" stroke="#4a4a52" stroke-width="4" fill="none"/>
      <ellipse cx="-20" cy="-146" rx="7" ry="9" fill="#2a2a30" stroke="#c8ccd6" stroke-width="2"/><ellipse cx="20" cy="-146" rx="7" ry="9" fill="#2a2a30" stroke="#c8ccd6" stroke-width="2"/>`,
    telefonerHode: (c) => `<path d="M-24 ${hy - 2} Q-27 ${hy - 37} 0 ${hy - 37} Q27 ${hy - 37} 24 ${hy - 2}" stroke="${c || "#2a2a2a"}" stroke-width="4" fill="none"/>
      <rect x="-30" y="${hy - 10}" width="10" height="19" rx="4" fill="#33333a"/><rect x="20" y="${hy - 10}" width="10" height="19" rx="4" fill="#33333a"/>`,
    hodesett: () => `<path d="M-24 ${hy - 2} Q-27 ${hy - 37} 0 ${hy - 37} Q27 ${hy - 37} 24 ${hy - 2}" stroke="#3a3a3a" stroke-width="3.5" fill="none"/>
      <rect x="-30" y="${hy - 9}" width="10" height="17" rx="4" fill="#33333a"/><rect x="21" y="${hy - 4}" width="5" height="8" rx="2" fill="#33333a"/>
      <path d="M-25 ${hy + 6} Q-20 ${hy + 16} -8 ${my}" stroke="#3a3a3a" stroke-width="2.4" fill="none"/><circle cx="-7" cy="${my}" r="3" fill="#1b1b1b"/>`,
    slips: c => `<path d="M-3.5 -145 L3.5 -145 L5 -138 L2.5 -106 L0 -101 L-2.5 -106 L-5 -138 Z" fill="${c}"/><rect x="-4" y="-146" width="8" height="6" rx="1.5" fill="${mix(c, -.15)}"/>`,
    sloyfe: c => `<path d="M0 -143 L-10 -148 L-10 -138 Z M0 -143 L10 -148 L10 -138 Z" fill="${c}"/><circle cx="0" cy="-143" r="2.6" fill="${mix(c, -.2)}"/>`,
    perler: (lang) => { let s = ""; const n = lang ? 15 : 11, d = lang ? 22 : 12; for (let i = 0; i <= n; i++) { const t = i / n, x = (1 - t) * (1 - t) * -14 + 2 * (1 - t) * t * 0 + t * t * 14, y = (1 - t) * (1 - t) * -144 + 2 * (1 - t) * t * (-144 + d * 2) + t * t * -144; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.3" fill="#fbf8f0" stroke="#c8c0b0" stroke-width=".6"/>`; } return s; },
    fjaerplagg: () => `<path d="M6 ${hy - 24} Q-34 ${hy - 70} -10 ${hy - 100} Q-2 ${hy - 66} 10 ${hy - 26} Z" fill="#fbfaf5" stroke="#dcd6c8" stroke-width="1"/>
      <path d="M8 ${hy - 24} Q34 ${hy - 82} 44 ${hy - 70} Q28 ${hy - 50} 13 ${hy - 23} Z" fill="#f2a7c0" stroke="#d886a2" stroke-width="1"/>
      <path d="M7 ${hy - 26} Q4 ${hy - 82} 16 ${hy - 98} Q18 ${hy - 60} 11 ${hy - 26} Z" fill="#fff3d0" stroke="#e0d2a8" stroke-width="1"/>
      <path d="M2 ${hy - 40} l-10 -6 M-2 ${hy - 54} l-11 -5 M-4 ${hy - 70} l-10 -3 M18 ${hy - 44} l9 -6 M24 ${hy - 56} l9 -4 M10 ${hy - 50} l5 -4 M11 ${hy - 66} l5 -3" stroke="#c8bfae" stroke-width="1" opacity=".8"/>
      <path d="M-22 ${hy - 13} Q0 ${hy - 25} 22 ${hy - 13}" stroke="#e3b53a" stroke-width="5" fill="none"/>
      ${[-14, -7, 14].map(x => `<circle cx="${x}" cy="${hy - 19 + Math.abs(x) * .22}" r="1.6" fill="#fbfaf5"/>`).join("")}<circle cx="7" cy="${hy - 21}" r="5.5" fill="#2a8a8a" stroke="#e3b53a" stroke-width="2"/>`,
    storsmil: () => `<path d="M-9.5 ${my - 1} Q0 ${my + 11} 9.5 ${my - 1} Z" fill="#fff" stroke="#3a1a14" stroke-width="1.8" stroke-linejoin="round"/>`,
    syng: hud => `<ellipse cx="0" cy="${my + 1.5}" rx="9" ry="4.6" fill="${hud}"/><ellipse cx="0" cy="${my + 2}" rx="4.6" ry="5.6" fill="#4a1e18"/><ellipse cx="0" cy="${my + 5}" rx="2.8" ry="1.8" fill="#c0605a"/>`,
    skjorte: (bukse, belte) => `<path d="M-30.5 -76 L30.5 -76 L30 -46 L-30 -46 Z" fill="${bukse}"/><rect x="-30.5" y="-80" width="61" height="6" fill="${belte || "#2a2018"}"/><rect x="-4" y="-80" width="8" height="6" rx="1" fill="#c9a227"/>`,
    glimt: () => `<g fill="#fff" class="flakk"><path d="M-14 -120 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z"/><path d="M16 -92 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z"/><path d="M-20 -64 l1.2 -3 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 Z"/></g>`,
  };

  /* ---------- instrumenter som figurene holder ---------- */
  function trompet(L) { // munnstykket i (0,0), peker mot +x
    L = L || 1; const e = 30 * L;
    return `<g><rect x="-2" y="-1.6" width="9" height="3.2" rx="1" fill="#c8ccd2"/><path d="M6 0 H${e}" stroke="${B}" stroke-width="4"/>
      <path d="M10 6 Q10 12 17 12 H${e - 5} Q${e} 12 ${e} 6" stroke="${B}" stroke-width="3.4" fill="none"/>
      ${[0, 1, 2].map(i => `<rect x="${12 + i * 6}" y="-7" width="4.2" height="15" rx="1" fill="${BM}"/><circle cx="${14.1 + i * 6}" cy="-9" r="2.4" fill="${BL}"/>`).join("")}
      <path d="M${e} -2.5 L${e + 14 * L} -9 Q${e + 18 * L} 0 ${e + 14 * L} 9 L${e} 2.5 Z" fill="${B}"/><ellipse cx="${e + 15 * L}" cy="0" rx="3" ry="9.5" fill="${BM}"/></g>`;
  }
  function gitarForm(f) { // (0,0) = lydhullet; kroppen ned til y=34, halsen opp til y=-106
    f = f || "#c8843a";
    return `<g><path d="M0 -27 C12 -27 16 -18 14 -8 C12 -2 13 0 18 4 C24 12 22 34 0 34 C-22 34 -24 12 -18 4 C-13 0 -12 -2 -14 -8 C-16 -18 -12 -27 0 -27 Z" fill="${f}" stroke="${mix(f, -.4)}" stroke-width="1.6"/>
      <circle cx="0" cy="0" r="7.5" fill="none" stroke="${mix(f, -.3)}" stroke-width="1.5"/><circle cx="0" cy="0" r="5.5" fill="#2a1a10"/><rect x="-7" y="17" width="14" height="3.5" rx="1" fill="#3a2414"/>
      <rect x="-3.5" y="-92" width="7" height="66" fill="#4a2e18"/>${[-34, -42, -50, -58, -66, -74, -82].map(y => `<path d="M-3.5 ${y} H3.5" stroke="#c8c0b0" stroke-width=".8"/>`).join("")}
      <path d="M-4.5 -92 L-6 -107 L6 -107 L4.5 -92 Z" fill="#3a2414"/>${[-102, -97].map(y => `<circle cx="-7.5" cy="${y}" r="1.8" fill="#d8d0c0"/><circle cx="7.5" cy="${y}" r="1.8" fill="#d8d0c0"/>`).join("")}
      <path d="M-1.8 19 V-104 M-.6 19 V-104 M.6 19 V-104 M1.8 19 V-104" stroke="#f4f1ea" stroke-width=".5"/></g>`;
  }
  function elgitarForm(f) { // (0,0) = midt på kroppen
    f = f || "#c8202e";
    return `<g><path d="M-5 -22 C-9 -36 -21 -32 -17 -18 C-15 -12 -23 -6 -21 6 C-19 27 19 29 21 8 C23 -4 15 -10 17 -16 C21 -29 12 -37 6 -24 Z" fill="${f}" stroke="${mix(f, -.4)}" stroke-width="1.6"/>
      <path d="M-6 -20 L6 -20 L12 -6 Q14 10 2 14 L-10 12 Q-16 2 -10 -10 Z" fill="#fbfaf5"/><rect x="-6" y="-14" width="12" height="4" rx="1.5" fill="#2a2a2a"/><rect x="-6" y="-3" width="12" height="4" rx="1.5" fill="#2a2a2a"/><rect x="-7" y="9" width="14" height="3" fill="#b8bcc4"/>
      <circle cx="13" cy="10" r="2.6" fill="#e8e0cc"/><circle cx="9" cy="17" r="2.6" fill="#e8e0cc"/>
      <rect x="-3.2" y="-92" width="6.4" height="72" fill="#e0b878"/>${[-30, -38, -46, -54, -62, -70, -78, -86].map(y => `<path d="M-3.2 ${y} H3.2" stroke="#9a7a4a" stroke-width=".8"/>`).join("")}${[-42, -58, -74].map(y => `<circle cx="0" cy="${y + 4}" r="1" fill="#3a2a1a"/>`).join("")}
      <path d="M-3.5 -92 L-5 -110 Q0 -114 6 -108 L3.5 -92 Z" fill="#e0b878" stroke="#b8925a" stroke-width=".8"/>${[-110, -104, -98].map(y => `<circle cx="-6.5" cy="${y + 2}" r="1.6" fill="#c8ccd2"/>`).join("")}
      <path d="M-1.8 11 V-106 M-.6 11 V-106 M.6 11 V-106 M1.8 11 V-106" stroke="#e8e8ee" stroke-width=".5"/></g>`;
  }
  // gitar holdt foran kroppen: kropp nede til venstre, hals opp mot høyre
  const gitarHoldt = (f, el) => `<g transform="translate(-8 -84) rotate(50) scale(.9)">${el ? elgitarForm(f) : gitarForm(f)}</g>`;
  const gitarArmer = (frakk, hud) => arm(frakk, -26, -138, -46, -104, -18, -78) + arm(frakk, 26, -138, 46, -132, 35, -121);
  const gitarHender = hud => hand(hud, -18, -76) + hand(hud, 35, -119);

  /* ======================================================================
     FIGURER
     ====================================================================== */
  function platon(o) {
    o = o || {};
    const C = -56, sk = o.matt ? "#4a4a52" : "#16161a", lab = o.matt ? "#9a6a6e" : "#c8202e", ink = o.matt ? "#3a2a2a" : "#2a0e10";
    const oye = (x, lukk) => lukk ? `<path d="M${x - 3.5} ${C - 4} Q${x} ${C - 1} ${x + 3.5} ${C - 4}" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="${x}" cy="${C - 5}" rx="2.6" ry="3.4" fill="${ink}"/><circle cx="${x + .9}" cy="${C - 6.3}" r=".9" fill="#fff"/>`;
    const munn = o.matt ? `<path d="M-4 ${C + 8} Q0 ${C + 9} 4 ${C + 8}" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
      : `<path d="M-6 ${C + 6} Q0 ${C + 12} 6 ${C + 6}" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return `<g><ellipse cx="0" cy="0" rx="22" ry="4" fill="#000" opacity=".16"/>
      <g class="svev">
      <path d="M-10 -26 L-12 -6 M10 -26 L12 -6" stroke="#16161a" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-14" cy="-4" rx="8" ry="4" fill="#c8202e"/><ellipse cx="14" cy="-4" rx="8" ry="4" fill="#c8202e"/>
      <path d="M-31 -52 Q-44 -46 -48 -36 M31 -52 Q44 -46 48 -36" stroke="#16161a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="-48" cy="-34" r="5.5" fill="#fbfaf5" stroke="#c8c0b0" stroke-width="1"/><circle cx="48" cy="-34" r="5.5" fill="#fbfaf5" stroke="#c8c0b0" stroke-width="1"/>
      <circle cx="0" cy="${C}" r="34" fill="${sk}"/>
      ${[30, 27, 24, 21].map(r => `<circle cx="0" cy="${C}" r="${r}" fill="none" stroke="${mix(sk, .14)}" stroke-width="1"/>`).join("")}
      <path d="M-24 ${C - 20} A31 31 0 0 1 8 ${C - 30}" stroke="#fff" stroke-width="3" opacity="${o.matt ? .12 : .28}" fill="none" stroke-linecap="round"/>
      <circle cx="0" cy="${C}" r="17" fill="${lab}"/><circle cx="0" cy="${C}" r="17" fill="none" stroke="${mix(lab, .3)}" stroke-width="1"/>
      <path d="M-11 ${C - 11} A14 14 0 0 1 11 ${C - 11}" stroke="${mix(lab, .45)}" stroke-width="1.4" fill="none"/>
      ${oye(-6, o.matt)}${oye(6, o.matt || o.blunk)}
      <circle cx="0" cy="${C + 1}" r="1.6" fill="${ink}"/>${munn}
      ${o.matt ? "" : `<circle cx="-10" cy="${C + 3}" r="2.6" fill="#ff9a9a" opacity=".5"/><circle cx="10" cy="${C + 3}" r="2.6" fill="#ff9a9a" opacity=".5"/>`}
      ${o.matt ? `<text x="26" y="${C - 30}" font-size="11" font-family="${FONT}" fill="#8a8a96">z z</text>` : ""}
      </g></g>`;
  }

  function glatt(o) {
    o = Object.assign({ hud: "#d8d2e0", har: "#1b1b22", harType: "kort", frakk: "#b8bcc8", vest: "#2a2a35", bukse: "#a8acb8", strompe: "#a8acb8", sko: "#111", uttrykk: "lur", mager: true, skala: 1.1 }, o);
    const glans = `<path d="M-20 -136 Q-24 -100 -22 -60 M18 -132 Q22 -100 20 -66" stroke="#fff" stroke-width="3" opacity=".45" fill="none"/>`;
    return P(o, glans + PY.slips("#8a3ab0") + PY.slikk(o.har) + PY.solbriller() + PY.telefonerHals() + PY.glimt());
  }

  function hornspiller(o, def, instr, hender) {
    o = Object.assign(def, o);
    const f = o.frakk;
    return P(o, (o.bak2 || "") + hender.armer(f) + instr + hender.hand(o.hud), o.bakForm || "", true);
  }

  const FIG = {
    platon: o => platon(o),
    glatt: o => glatt(o),
    // havna 1700-tallet
    kaptein: o => P(Object.assign({ hud: "#f0c8a4", har: "#6a4a2a", harType: "kort", frakk: "#1f3d7a", vest: "#f4f1ea", bukse: "#f4f1ea", strompe: "#f4f1ea", sko: "#111", hatt: "tricorn", hattF: "#1b1b22", epaulett: true, hand: "papir", uttrykk: "noytral" }, o)),
    matros: o => {
      o = Object.assign({ hud: "#e8bc96", har: "#7a5a3a", harType: "kort", frakk: "#f4f1ea", vest: "#f4f1ea", bukse: "#3a4a6a", strompe: "#3a4a6a", sko: "#2a2420", skjegg: "stubb", uttrykk: "glad" }, o);
      return P(o, [-128, -116, -104, -92, -80, -68, -56].map(y => `<path d="M-22 ${y} H22" stroke="#1f3d7a" stroke-width="5"/>`).join("") + PY.sloyfe("#c0392b") + PY.lue("#a8242c"));
    },
    // bomullsmarka
    forsanger: o => {
      o = Object.assign({ hud: H.b, har: "#1a1410", harType: "kort", frakk: "#efe6d2", vest: "#e2d6bc", bukse: "#7a6a52", strompe: "#7a6a52", sko: "#4a3a2a", uttrykk: "glad", synger: true }, o);
      const f = o.frakk, munn = o.synger ? PY.syng(o.hud) + noter([[-50, -186, .8, "#2a2a2a"], [44, -200, .9, "#2a2a2a", true]], "flakk") : "";
      if (!o.synger) return P(o, PY.straahatt());
      return P(o, munn + PY.straahatt() + armH(f) + hand(o.hud, 34, -80) + arm(f, -26, -138, -52, -136, -25, -153) + hand(o.hud, -25, -152), "", true);
    },
    arbeider: o => P(Object.assign({ hud: H.d, har: "#141010", harType: "kort", frakk: "#d8ccb0", vest: "#c8bc9e", bukse: "#5a4a3a", strompe: "#5a4a3a", sko: "#3a2a1a", hand: "hakke", uttrykk: "noytral", skjegg: "stubb" }, o), PY.lue("#6a5a44")),
    arbeiderske: o => {
      o = Object.assign({ hud: H.e, har: "#1a1410", harType: "kort", kjole: true, kjoleF: "#7a6a8a", forkle: "#e8dcc4", uttrykk: "glad" }, o);
      const kurv = `<path d="M20 -88 Q22 -62 38 -62 Q54 -62 56 -88 Z" fill="#c9a050" stroke="#8a6a2a" stroke-width="1.5"/>${[26, 33, 40, 47].map(x => `<path d="M${x} -86 Q${x + 1} -74 ${x} -64" stroke="#8a6a2a" stroke-width="1.2" fill="none"/>`).join("")}
        ${[[24, -91], [31, -95], [38, -92], [45, -96], [51, -91], [35, -99]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fbfaf5" stroke="#e0dccf" stroke-width=".8"/>`).join("")}<ellipse cx="38" cy="-88" rx="18" ry="3.5" fill="#a88a40"/>`;
      return P(o, PY.hodeomslag("#c0392b") + kurv + hand(o.hud, 30, -84));
    },
    // kirka
    predikant: o => {
      o = Object.assign({ hud: H.b, har: "#3a3430", harType: "kort", frakk: "#1d1d1d", vest: "#1d1d1d", bukse: "#1d1d1d", strompe: "#1d1d1d", krage: "prest", uttrykk: "glad" }, o);
      return P(o, `<rect x="24" y="-100" width="22" height="28" rx="2" fill="#1b1b22" stroke="#4a4a52" stroke-width="1"/><path d="M35 -94 v14 M30 -89 h10" stroke="#c9a227" stroke-width="2"/>` + hand(o.hud, 30, -78));
    },
    korleder: o => {
      o = Object.assign({ hud: H.a, har: "#1a1410", harType: "kort", kjole: true, kjoleF: "#6a2a5a", krage: "hvit", uttrykk: "glad" }, o);
      const f = o.kjoleF;
      return P(o, PY.kirkehatt("#2f5d9a") + armV(f) + hand(o.hud, -34, -80) + arm(f, 26, -138, 48, -146, 40, -172) + hand(o.hud, 40, -174), "", true);
    },
    // blues
    bluesmann: o => {
      o = Object.assign({ hud: H.d, har: "#141010", harType: "kort", frakk: "#e8dcc4", vest: "#e8dcc4", bukse: "#4a4038", strompe: "#4a4038", sko: "#2a2018", uttrykk: "glad" }, o);
      const vest = `<path d="M-24 -138 L-6 -138 L-2 -100 L-6 -60 L-26 -60 Q-28 -100 -24 -138 Z M24 -138 L6 -138 L2 -100 L6 -60 L26 -60 Q28 -100 24 -138 Z" fill="#5a4a3a"/>`;
      return P(o, vest + PY.fedora("#4a3e30") + gitarArmer(o.frakk) + gitarHoldt("#c8843a") + gitarHender(o.hud), "", true);
    },
    bessie: o => {
      o = Object.assign({ hud: H.b, har: "#1a1410", harType: "kort", kjole: true, kjoleF: "#efe2c2", uttrykk: "glad" }, o);
      const f = o.kjoleF;
      srand(5); let perl = ""; for (let i = 0; i < 26; i++) { const y = -92 + rnd() * 84, w = 18 + (y + 92) * .26; perl += `<circle cx="${((rnd() - .5) * 2 * w).toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="#c9a227" opacity=".8"/>`; }
      const frynser = `<path d="M-40 -12 ${Array.from({ length: 17 }, (_, i) => `L${-40 + i * 5} ${i % 2 ? -2 : -12}`).join(" ")}" stroke="${mix(f, -.18)}" stroke-width="1.4" fill="none"/>`;
      return P(o, perl + frynser + PY.perler(true) + PY.fjaerplagg() + armV(f) + hand(o.hud, -34, -80) + arm(f, 26, -138, 52, -124, 52, -146) + hand(o.hud, 52, -148), "", true);
    },
    mamie: o => P(Object.assign({ hud: H.a, har: "#1a1410", harType: "kort", kjole: true, kjoleF: "#2a2440", uttrykk: "glad" }, o), PY.bolge("#1a1410") + PY.perler(true) + `<circle cx="-12" cy="${hy + 10}" r="2" fill="#fbf8f0"/><circle cx="12" cy="${hy + 10}" r="2" fill="#fbf8f0"/>`),
    plateprodusent: o => P(Object.assign({ hud: LYS, har: "#3a2a1a", harType: "kort", frakk: "#6a5a44", vest: "#efe6d0", bukse: "#5a4c3a", strompe: "#5a4c3a", sko: "#2a2018", hand: "papir", briller: true, uttrykk: "lur" }, o), PY.slips("#7a2e2e") + PY.fedora("#5a4c3a")),
    // jazz
    oliver: o => o && o.uten ? P(Object.assign({ hud: H.d, har: "#141010", harType: "kort", frakk: "#2a2a3a", vest: "#f4f1ea", bukse: "#2a2a3a", strompe: "#2a2a3a", sko: "#111", uttrykk: "lei", skala: 1.08 }, o), PY.sloyfe("#8a1f2b") + PY.bowler("#1b1b22")) : hornspiller(o, { hud: H.d, har: "#141010", harType: "kort", frakk: "#2a2a3a", vest: "#f4f1ea", bukse: "#2a2a3a", strompe: "#2a2a3a", sko: "#111", uttrykk: "glad", skala: 1.08,
      bakForm: `<path d="M-36 -136 Q-46 -96 -38 -48 L38 -48 Q46 -96 36 -136 Q0 -150 -36 -136 Z" fill="#2a2a3a"/>`, bak2: PY.sloyfe("#8a1f2b") + PY.bowler("#1b1b22") },
      `<g transform="translate(5 ${my + 1})">${trompet(.9)}</g>`,
      { armer: f => arm(f, -26, -138, -32, -110, 12, -146) + arm(f, 26, -138, 48, -120, 24, -145), hand: h => hand(h, 12, -146) + hand(h, 24, -145) }),
    louis: o => {
      o = Object.assign({ hud: H.b, har: "#141010", harType: "kort", frakk: "#3a4a6a", vest: "#f4f1ea", bukse: "#3a4a6a", strompe: "#3a4a6a", sko: "#111", uttrykk: "glad", spiller: false, lommetorkle: false }, o);
      const f = o.frakk;
      if (o.spiller) return P(o, PY.sloyfe("#c0392b") + arm(f, -26, -138, -32, -110, 12, -146) + arm(f, 26, -138, 48, -120, 24, -145) + `<g transform="translate(5 ${my + 1})">${trompet(1.25)}</g>` + hand(o.hud, 12, -146) + hand(o.hud, 24, -145), "", true);
      const tork = o.lommetorkle ? `<path d="M-36 -86 Q-50 -70 -42 -52 Q-36 -60 -30 -54 Q-32 -70 -28 -84 Z" fill="#fbfaf5" stroke="#d8d4cc" stroke-width="1"/>` : "";
      return P(o, PY.sloyfe("#c0392b") + PY.storsmil() + `<g transform="translate(34 -78) rotate(-78) translate(-22 0)">${trompet(1.25)}</g>` + hand(o.hud, 34, -80) + tork + (o.lommetorkle ? hand(o.hud, -34, -80) : ""));
    },
    klarinettist: o => {
      o = Object.assign({ hud: H.c, har: "#2a1a10", harType: "kort", frakk: "#5a3a2a", vest: "#f4f1ea", bukse: "#4a3022", strompe: "#4a3022", sko: "#1b1410", uttrykk: "glad" }, o);
      if (o.uten) return P(o, PY.sloyfe("#2a2a2a"));
      const f = o.frakk;
      const kl = `<path d="M1 ${my - 1} L15 -90" stroke="#1d1d22" stroke-width="5.5" stroke-linecap="round"/><path d="M1 ${my - 2} L3 -146" stroke="#3a3a42" stroke-width="4"/>
        <path d="M12 -96 L20 -80 L8 -82 Z" fill="#1d1d22"/>${[-140, -132, -124, -116, -108, -100].map(y => `<circle cx="${1 + (y - my) / (-90 - my) * 14 + 2}" cy="${y}" r="1.2" fill="#c8ccd2"/>`).join("")}`;
      return P(o, PY.sloyfe("#2a2a2a") + arm(f, -26, -138, -36, -112, 5, -132) + arm(f, 26, -138, 40, -108, 11, -106) + kl + hand(o.hud, 5, -132) + hand(o.hud, 11, -106), "", true);
    },
    trombonist: o => {
      o = Object.assign({ hud: H.d, har: "#141010", harType: "kort", frakk: "#2e4a3a", vest: "#f4f1ea", bukse: "#2a3a2e", strompe: "#2a3a2e", sko: "#111", uttrykk: "glad" }, o);
      if (o.uten) return P(o, PY.sloyfe("#c9a227"));
      const f = o.frakk;
      const tb = `<rect x="-1" y="${my - 1.5}" width="8" height="3" rx="1" fill="#c8ccd2"/>
        <path d="M6 ${my - 1} L52 ${my - 6}" stroke="${B}" stroke-width="3.6"/><path d="M52 ${my - 3} L66 ${my - 14} Q72 ${my - 4} 68 ${my + 6} L52 ${my - 8} Z" fill="${B}"/><ellipse cx="68" cy="${my - 4}" rx="3" ry="10" fill="${BM}"/>
        <path d="M6 ${my + 5} H86 Q92 ${my + 5} 92 ${my + 10} Q92 ${my + 15} 86 ${my + 15} H40" stroke="${B}" stroke-width="3.4" fill="none"/>
        <path d="M20 ${my - 2} V${my + 5} M44 ${my - 4} V${my + 15}" stroke="${BM}" stroke-width="2.5"/>`;
      return P(o, PY.sloyfe("#c9a227") + arm(f, -26, -138, -32, -112, 14, -147) + arm(f, 26, -138, 52, -118, 64, -144) + tb + hand(o.hud, 14, -147) + hand(o.hud, 64, -143), "", true);
    },
    // 1950-tallet
    radiodj: o => { o = Object.assign({ hud: H.c, har: "#1a1410", harType: "kort", frakk: "#d8e4f0", vest: "#d8e4f0", bukse: "#3a3a46", strompe: "#3a3a46", sko: "#1b1b1b", uttrykk: "glad" }, o);
      return P(o, PY.skjorte(o.bukse) + PY.slips("#c0392b") + PY.slikk(o.har) + PY.telefonerHode("#2a2a2a")); },
    fats: o => { o = Object.assign({ hud: H.d, har: "#141010", harType: "kort", frakk: "#3a5a8a", vest: "#f4f1ea", bukse: "#3a5a8a", strompe: "#3a5a8a", sko: "#111", uttrykk: "glad", skala: 1.05 }, o);
      const f = o.frakk;
      return P(o, PY.slips("#e3b53a") + PY.flattop(o.har) + arm(f, -30, -138, -48, -110, -44, -84) + arm(f, 30, -138, 48, -110, 44, -84) + hand(o.hud, -44, -80) + hand(o.hud, 44, -80) + `<circle cx="-44" cy="-81" r="2.2" fill="#e3b53a"/>`,
        `<path d="M-36 -138 Q-46 -94 -38 -48 L38 -48 Q46 -94 36 -138 Q0 -150 -36 -138 Z" fill="${f}"/>`, true); },
    boone: o => P(Object.assign({ hud: "#f6d5bb", har: "#6a4a2a", harType: "kort", frakk: "#f4ecd8", vest: "#8aa8c8", bukse: "#8a8a92", strompe: "#8a8a92", sko: "#fbfaf5", uttrykk: "glad" }, o),
      `<path d="M-9 -140 L0 -110 L9 -140" stroke="#e2d8c0" stroke-width="3" fill="none"/><path d="M-30 -52 Q0 -56 30 -52" stroke="#e2d8c0" stroke-width="7" fill="none"/><path d="M-26 -55 v6 M-18 -56 v6 M-10 -57 v6 M10 -57 v6 M18 -56 v6 M26 -55 v6" stroke="#d0c4a8" stroke-width="1"/><path d="M-40 -88 H-28 M28 -88 H40" stroke="#e2d8c0" stroke-width="5"/>` + [-126, -112, -98, -84].map(y => `<circle cx="-11" cy="${y}" r="1.8" fill="#c8c0b0"/>`).join("") + PY.slikk("#6a4a2a") + PY.storsmil()),
    phillips: o => P(Object.assign({ hud: LYS, har: "#3a2a1a", harType: "kort", frakk: "#eef2f6", vest: "#eef2f6", bukse: "#4a4a52", strompe: "#4a4a52", sko: "#2a2020", uttrykk: "glad" }, o), PY.skjorte("#4a4a52") + PY.slips("#7a2e2e") + PY.slikk((o && o.har) || "#3a2a1a") + `<path d="M-40 -94 H-28 M28 -94 H40" stroke="#d8dee6" stroke-width="5"/>`),
    elvis: o => {
      o = Object.assign({ hud: "#f3d2b5", har: "#141418", harType: "kort", frakk: "#e889a8", vest: "#1b1b22", bukse: "#1b1b22", strompe: "#1b1b22", sko: "#fbfaf5", uttrykk: "lur" }, o);
      const krage = `<path d="M-9 -142 L-18 -134 L-10 -122 Z M9 -142 L18 -134 L10 -122 Z" fill="#1b1b22"/>`;
      return P(o, krage + PY.pompadour(o.har) + gitarArmer(o.frakk) + gitarHoldt("#b06a2a") + gitarHender(o.hud), "", true);
    },
    tenaaring: o => {
      o = Object.assign({ hud: "#f0cfb0", har: "#7a4a22", harType: "kort", frakk: "#f8f2e4", vest: "#f8f2e4", bukse: (o && o.hud) || "#f0cfb0", strompe: "#fbfaf5", sko: "#1b1b22", uttrykk: "glad", skala: .88, skjort: "#f2a7c0", sloyfe: "#e53950" }, o);
      const sk = o.skjort, skjort = `<path d="M-20 -100 Q-44 -64 -50 -40 Q0 -28 50 -40 Q44 -64 20 -100 Z" fill="${sk}"/><path d="M-48 -42 Q0 -30 48 -42" stroke="#fbfaf5" stroke-width="3" fill="none"/>
        <g transform="translate(-20 -60)" fill="#fbfaf5"><circle r="5"/><circle cx="7" cy="-5" r="3.4"/><circle cx="-6" cy="-4" r="2.6"/><path d="M-3 4 v8 M3 4 v8" stroke="#fbfaf5" stroke-width="2"/></g><path d="M-14 -66 q10 -8 16 -24" stroke="#1b1b22" stroke-width="1" fill="none"/>
        <rect x="-21" y="-104" width="42" height="7" rx="2" fill="${mix(sk, -.25)}"/>`;
      return P(o, skjort + hand(o.hud, -34, -80) + hand(o.hud, 34, -80) + `<path d="M-8 -144 Q0 -136 8 -144" stroke="#fbfaf5" stroke-width="3" fill="none"/>` + PY.sloyfeHar(o.sloyfe), PY.hestehale(o.har));
    },
    kameramann: o => P(Object.assign({ hud: "#e8bc96", har: "#4a3424", harType: "kort", frakk: "#5a6a7a", vest: "#d8d0c0", bukse: "#3a3a46", strompe: "#3a3a46", sko: "#2a2420", uttrykk: "noytral" }, o), PY.hodesett()),
  };
  Object.assign(K.FIG, FIG);

  /* ======================================================================
     TING (bunnen midt på i 0,0)
     ====================================================================== */
  const tekstStr = (t, maksB, maksF) => Math.min(maksF, maksB / Math.max(1, String(t).length * .62));
  function pil(p0, c, p1, farge, nr) {
    const dx = p1[0] - c[0], dy = p1[1] - c[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, s = 9;
    const a = [p1[0] + ux * 4, p1[1] + uy * 4], b1 = [p1[0] - ux * s - uy * s * .7, p1[1] - uy * s + ux * s * .7], b2 = [p1[0] - ux * s + uy * s * .7, p1[1] - uy * s - ux * s * .7];
    const m = [.25 * p0[0] + .5 * c[0] + .25 * p1[0], .25 * p0[1] + .5 * c[1] + .25 * p1[1]];
    return `<path d="M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${p1[0] - ux * 5} ${p1[1] - uy * 5}" stroke="${farge}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b1[0].toFixed(1)} ${b1[1].toFixed(1)} L${b2[0].toFixed(1)} ${b2[1].toFixed(1)} Z" fill="${farge}"/>
      <circle cx="${m[0]}" cy="${m[1]}" r="8" fill="#fff" stroke="${farge}" stroke-width="2.5"/><text x="${m[0]}" y="${m[1] + 4}" font-size="11" font-weight="700" text-anchor="middle" fill="${farge}" font-family="${FONT}">${nr}</text>`;
  }
  const skive = (cx, cy, r, lab, hull) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#141418"/>${[.88, .76, .64, .52].map(k => `<circle cx="${cx}" cy="${cy}" r="${(r * k).toFixed(1)}" fill="none" stroke="#2c2c34" stroke-width="1"/>`).join("")}
    <circle cx="${cx}" cy="${cy}" r="${(r * .38).toFixed(1)}" fill="${lab}"/>${hull ? `<circle cx="${cx}" cy="${cy}" r="${(r * .15).toFixed(1)}" fill="#e8e0cc"/>` : `<circle cx="${cx}" cy="${cy}" r="1.6" fill="#141418"/>`}
    <path d="M${cx - r * .7} ${cy - r * .5} A${r * .86} ${r * .86} 0 0 1 ${cx + r * .1} ${cy - r * .86}" stroke="#fff" stroke-width="2" opacity=".25" fill="none"/>`;

  const TING = {
    platespiller: o => {
      o = o || {};
      const plate = o.spiller ? `<ellipse cx="-12" cy="-70" rx="37" ry="8" fill="#141418"/><ellipse cx="-12" cy="-70" rx="28" ry="6" fill="none" stroke="#2e2e36" stroke-width="1"/><ellipse cx="-12" cy="-70" rx="20" ry="4.4" fill="none" stroke="#2e2e36" stroke-width="1"/><ellipse cx="-12" cy="-70" rx="10" ry="2.4" fill="#c8202e"/>` : "";
      return `<g><rect x="-66" y="-50" width="132" height="50" rx="3" fill="#8a5a3a"/><rect x="-60" y="-44" width="58" height="38" rx="2" fill="#7a4a2e"/><rect x="2" y="-44" width="58" height="38" rx="2" fill="#7a4a2e"/>
        <circle cx="-8" cy="-25" r="2.5" fill="#d8b878"/><circle cx="8" cy="-25" r="2.5" fill="#d8b878"/>
        <rect x="-60" y="-66" width="120" height="16" rx="3" fill="#2e2e34"/><rect x="-60" y="-56" width="120" height="6" rx="2" fill="#24242a"/>
        <ellipse cx="-12" cy="-67" rx="40" ry="9" fill="#9a9aa2"/><ellipse cx="-12" cy="-69" rx="40" ry="9" fill="#b8bcc4"/>${plate}
        <circle cx="42" cy="-68" r="6" fill="#c8ccd2"/>${o.spiller ? `<path d="M42 -70 Q34 -80 12 -73" stroke="#d8dce4" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="8" y="-76" width="8" height="5" rx="1" fill="#4a4a52"/>`
          : `<path d="M42 -70 L50 -62" stroke="#d8dce4" stroke-width="3" stroke-linecap="round"/>`}
        <circle cx="48" cy="-58" r="2" fill="${o.spiller ? "#4caf50" : "#666"}"/>
        ${o.spiller ? noter([[-36, -96, 1, "#c8202e"], [-4, -112, 1.1, "#1f3d7a", true], [28, -100, .9, "#2e7d32"]]) : ""}</g>`;
    },
    platehylle: o => {
      o = o || {};
      srand(17); let s = `<rect x="-86" y="-190" width="172" height="190" rx="3" fill="#8a5a3a"/><rect x="-80" y="-184" width="160" height="178" fill="#4a2e1e"/>`;
      const farger = ["#c8202e", "#1f3d7a", "#e3b53a", "#2e7d32", "#7a4a8a", "#e67e22", "#16a085", "#fbfaf5", "#1b1b22", "#f2a7c0"];
      for (let r = 0; r < 3; r++) {
        const yb = -126 + r * 60; s += `<rect x="-82" y="${yb}" width="164" height="6" fill="#8a5a3a"/>`;
        let x = -78, hull = 0;
        while (x < 72) {
          const w = 5 + Math.floor(rnd() * 3), h = 44 + Math.floor(rnd() * 8), tom = o.tom && rnd() < .62;
          if (!tom) { s += `<rect x="${x}" y="${yb - h}" width="${w}" height="${h}" fill="${farger[Math.floor(rnd() * farger.length)]}" stroke="#2a1a10" stroke-width=".5"/>`; hull = 0; }
          else if (++hull === 3) s += `<rect x="${x - 8}" y="${yb - 46}" width="5" height="46" fill="${farger[Math.floor(rnd() * farger.length)]}" transform="rotate(-24 ${x - 6} ${yb})" stroke="#2a1a10" stroke-width=".5"/>`;
          x += w + 1;
        }
      }
      return s;
    },
    gitar: o => `<g><path d="M0 -50 L-20 0 M0 -50 L20 0 M0 -50 L0 -2" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/><path d="M-14 -24 Q0 -18 14 -24" stroke="#2a2a2a" stroke-width="4" fill="none"/>
      <g transform="translate(0 -40)">${gitarForm((o && o.f) || "#c8843a")}</g><path d="M-6 -126 L6 -126" stroke="#2a2a2a" stroke-width="3"/></g>`,
    elgitar: o => `<g><path d="M0 -40 L-20 0 M0 -40 L20 0 M0 -40 L0 -2" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/><path d="M-14 -22 Q0 -16 14 -22" stroke="#2a2a2a" stroke-width="4" fill="none"/>
      <g transform="translate(0 -38)">${elgitarForm((o && o.f) || "#c8202e")}</g></g>`,
    trommesett: () => {
      const skall = "#c8202e";
      return `<g>
        <path d="M-92 0 L-92 -100 M-104 0 L-92 -30 L-80 0" stroke="#8a8e96" stroke-width="2.5" fill="none"/><ellipse cx="-92" cy="-100" rx="19" ry="3.6" fill="#d9b44a"/><ellipse cx="-92" cy="-104" rx="19" ry="3.6" fill="#e3c060" stroke="#b8902a" stroke-width=".8"/>
        <path d="M70 0 L70 -124 M58 0 L70 -30 L82 0" stroke="#8a8e96" stroke-width="2.5" fill="none"/><ellipse cx="70" cy="-124" rx="24" ry="4.5" fill="#e3c060" stroke="#b8902a" stroke-width=".8" transform="rotate(-12 70 -124)"/>
        <rect x="40" y="-52" width="42" height="46" rx="3" fill="${skall}"/><ellipse cx="61" cy="-52" rx="21" ry="5" fill="#f4f1ea" stroke="#c8ccd2" stroke-width="1.5"/><path d="M44 -6 v6 M78 -6 v6" stroke="#8a8e96" stroke-width="2.5"/>
        <circle cx="0" cy="-40" r="38" fill="${skall}"/><circle cx="0" cy="-40" r="32" fill="#f4f1ea"/><circle cx="0" cy="-40" r="32" fill="none" stroke="#c8ccd2" stroke-width="2"/>
        <circle cx="0" cy="-40" r="13" fill="${skall}" opacity=".85"/><text x="0" y="-36" font-size="11" font-weight="700" text-anchor="middle" fill="#fbfaf5" font-family="${FONT}">♪</text>
        <path d="M-26 -8 L-34 0 M26 -8 L34 0" stroke="#8a8e96" stroke-width="3"/>
        <rect x="6" y="-98" width="34" height="22" rx="3" fill="${skall}"/><ellipse cx="23" cy="-98" rx="17" ry="4.5" fill="#f4f1ea" stroke="#c8ccd2" stroke-width="1.2"/>
        <rect x="-80" y="-66" width="42" height="16" rx="2" fill="${skall}"/><ellipse cx="-59" cy="-66" rx="21" ry="5" fill="#f4f1ea" stroke="#c8ccd2" stroke-width="1.5"/><path d="M-59 -50 L-59 -24 M-70 0 L-59 -24 L-48 0" stroke="#8a8e96" stroke-width="2.5" fill="none"/>
        <path d="M-50 -74 L-20 -90 M-46 -72 L-14 -82" stroke="#e8d4a8" stroke-width="3" stroke-linecap="round"/></g>`;
    },
    piano: () => {
      let keys = ""; for (let i = 0; i < 26; i++) keys += `<path d="M${-78 + i * 6} -72 V-60" stroke="#c8c4bc" stroke-width=".8"/>`;
      const sv = [1, 2, 4, 5, 6]; for (let i = 0; i < 25; i++) if (sv.includes(i % 7)) keys += `<rect x="${-79.8 + i * 6}" y="-72" width="3.6" height="7" fill="#1b1b1b"/>`;
      return `<g><rect x="-80" y="-132" width="160" height="132" rx="3" fill="#3a2418"/><rect x="-86" y="-138" width="172" height="10" rx="3" fill="#4a2e1e"/>
        <rect x="-68" y="-122" width="136" height="40" rx="3" fill="#4a2e1e"/><rect x="-24" y="-118" width="48" height="32" fill="#fbf8ee" stroke="#c8c0a8"/>
        ${[-110, -104, -98, -92].map(y => `<path d="M-20 ${y} H20" stroke="#8a8a8a" stroke-width=".7"/>`).join("")}${note(-8, -96, .45, "#2a2a2a")}${note(8, -100, .45, "#2a2a2a")}
        <rect x="-86" y="-76" width="172" height="18" rx="2" fill="#2a1a10"/><rect x="-78" y="-72" width="156" height="12" fill="#fbfaf5"/>${keys}
        <rect x="-74" y="-54" width="148" height="44" rx="3" fill="#4a2e1e"/><rect x="-66" y="-48" width="132" height="32" rx="3" fill="none" stroke="#5a3a24" stroke-width="2"/>
        <rect x="-82" y="-60" width="8" height="60" fill="#3a2418"/><rect x="74" y="-60" width="8" height="60" fill="#3a2418"/>
        <ellipse cx="-8" cy="-6" rx="4" ry="2.4" fill="#c9a227"/><ellipse cx="8" cy="-6" rx="4" ry="2.4" fill="#c9a227"/></g>`;
    },
    kart: o => {
      const n = Math.max(0, Math.min(3, (o && o.piler) || 0));
      const land = "#c8b07a", kant = "#8a6a3a";
      let s = `<g><path d="M-92 0 L-62 -236 M92 0 L62 -236 M0 -6 L0 -60" stroke="#8a5a3a" stroke-width="7" stroke-linecap="round"/>
        <rect x="-134" y="-236" width="268" height="178" rx="3" fill="#6b4a2a"/><rect x="-128" y="-230" width="256" height="166" fill="#9cc8e6"/>
        ${[-206, -176, -146, -116, -86].map(y => `<path d="M-128 ${y} H128" stroke="#b8daf0" stroke-width="1"/>`).join("")}${[-80, -20, 40, 100].map(x => `<path d="M${x} -230 V-64" stroke="#b8daf0" stroke-width="1"/>`).join("")}
        <path d="M-128 -230 L-56 -230 Q-52 -210 -70 -196 Q-84 -182 -96 -172 Q-104 -160 -96 -150 L-110 -146 Q-120 -152 -128 -156 Z" fill="${land}" stroke="${kant}" stroke-width="1.5"/>
        <path d="M-100 -140 Q-84 -142 -70 -128 Q-58 -116 -66 -100 Q-78 -84 -86 -66 L-94 -66 Q-96 -90 -104 -108 Q-112 -124 -100 -140 Z" fill="${land}" stroke="${kant}" stroke-width="1.5"/>
        <ellipse cx="-86" cy="-150" rx="6" ry="2.5" fill="${land}" stroke="${kant}"/><ellipse cx="-74" cy="-146" rx="4" ry="2" fill="${land}" stroke="${kant}"/>
        <path d="M30 -230 L128 -230 L128 -182 Q112 -178 98 -174 Q82 -176 68 -182 Q56 -178 46 -186 Q36 -196 40 -206 Q28 -214 30 -230 Z" fill="${land}" stroke="${kant}" stroke-width="1.5"/>
        <path d="M42 -166 Q70 -170 96 -164 Q116 -156 122 -140 Q116 -124 108 -108 Q100 -86 88 -70 L80 -66 Q72 -92 64 -116 Q48 -124 40 -140 Q32 -152 42 -166 Z" fill="${land}" stroke="${kant}" stroke-width="1.5"/>
        <text x="-92" y="-196" font-size="12" font-weight="700" text-anchor="middle" fill="#3a2a10" font-family="${FONT}">AMERIKA</text>
        <text x="86" y="-202" font-size="12" font-weight="700" text-anchor="middle" fill="#3a2a10" font-family="${FONT}">EUROPA</text>
        <text x="84" y="-128" font-size="12" font-weight="700" text-anchor="middle" fill="#3a2a10" font-family="${FONT}">AFRIKA</text>
        <text x="-10" y="-74" font-size="9" font-style="italic" text-anchor="middle" fill="#3a6a8a" font-family="${FONT}">ATLANTERHAVET</text>`;
      if (n >= 1) s += pil([32, -204], [-14, -178], [34, -150], "#c0392b", 1);
      if (n >= 2) s += pil([36, -134], [-18, -104], [-64, -138], "#2a2a6a", 2);
      if (n >= 3) s += pil([-56, -182], [-14, -224], [28, -212], "#2e7d32", 3);
      return s + `<rect x="-140" y="-62" width="280" height="8" rx="2" fill="#8a5a3a"/></g>`;
    },
    kasse: o => {
      const t = (o && o.tekst) || "", fs = tekstStr(t, 58, 15);
      return `<g><rect x="-34" y="-48" width="68" height="48" fill="#b8864a" stroke="#7a5428" stroke-width="2"/>${[-36, -24, -12].map(y => `<path d="M-34 ${y} H34" stroke="#9a6a38" stroke-width="1.4"/>`).join("")}
        <path d="M-34 -48 L-26 -48 L-26 0 L-34 0 Z M34 -48 L26 -48 L26 0 L34 0 Z" fill="#a0723c"/><path d="M-26 -46 L26 -2" stroke="#a0723c" stroke-width="6"/>
        ${t ? `<rect x="-24" y="-32" width="48" height="18" fill="#c89858" opacity=".9"/><text x="0" y="${-23 + fs * .36}" font-size="${fs.toFixed(1)}" font-weight="700" text-anchor="middle" fill="#3a220e" font-family="${FONT}" letter-spacing="1">${esc(t)}</text>` : ""}</g>`;
    },
    tonne: o => {
      const t = (o && o.tekst) || "", fs = tekstStr(t, 42, 12);
      return `<g><path d="M-24 -64 Q-33 -32 -24 0 L24 0 Q33 -32 24 -64 Z" fill="#a86a3a"/>${[-14, -5, 5, 14].map(x => `<path d="M${x} -64 Q${x * 1.3} -32 ${x} 0" stroke="#8a5428" stroke-width="1.2" fill="none"/>`).join("")}
        <path d="M-27 -54 Q0 -50 27 -54 M-30 -32 Q0 -28 30 -32 M-27 -10 Q0 -6 27 -10" stroke="#4a4a4a" stroke-width="4" fill="none"/><ellipse cx="0" cy="-64" rx="24" ry="5" fill="#8a5428"/>
        ${t ? `<rect x="-23" y="-46" width="46" height="12" rx="1" fill="#ead8b0"/><text x="0" y="${-40 + fs * .36}" font-size="${fs.toFixed(1)}" font-weight="700" text-anchor="middle" fill="#3a220e" font-family="${FONT}">${esc(t)}</text>` : ""}</g>`;
    },
    bomullsballe: () => `<g><rect x="-42" y="-54" width="84" height="54" rx="12" fill="#ece6d6"/><path d="M-42 -40 Q-40 -54 -28 -54 L28 -54 Q40 -54 42 -40 L42 -14 Q40 0 28 0 L-28 0 Q-40 0 -42 -14 Z" fill="#c8a878" opacity=".75"/>
      ${[-28, -8, 12, 30].map(x => `<path d="M${x} -54 V0" stroke="#6a5a4a" stroke-width="3"/>`).join("")}${[[-36, -54], [-18, -56], [2, -55], [22, -57], [38, -50], [-41, -30], [41, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fbfaf5"/>`).join("")}</g>`,
    skip: () => {
      const seil = (x, y1, y2, w) => `<path d="M${x - w} ${y1} Q${x} ${y1 - 6} ${x + w} ${y1} L${x + w - 3} ${y2} Q${x} ${y2 + 9} ${x - w + 3} ${y2} Z" fill="#f4ecd8" stroke="#c8b890" stroke-width="1.2"/><path d="M${x - w - 4} ${y1} H${x + w + 4}" stroke="#4a2e18" stroke-width="3"/>`;
      return `<g><path d="M-120 -64 L118 -64 L176 -112" stroke="#3a2a1a" stroke-width="1" fill="none"/>
        <path d="M-58 -64 V-232 M4 -64 V-266 M66 -64 V-240" stroke="#4a2e18" stroke-width="5"/>
        <path d="M-58 -232 L-140 -84 M4 -266 L-58 -232 M4 -266 L66 -240 M66 -240 L170 -106 M4 -266 L130 -84" stroke="#3a2a1a" stroke-width=".9"/>
        ${seil(-58, -222, -180, 32)}${seil(-58, -172, -118, 38)}${seil(4, -256, -214, 36)}${seil(4, -206, -158, 44)}${seil(4, -150, -96, 50)}${seil(66, -230, -190, 32)}${seil(66, -182, -132, 40)}
        <path d="M74 -232 L168 -110 L84 -112 Z" fill="#f4ecd8" stroke="#c8b890" stroke-width="1.2"/>
        <path d="M4 -266 L4 -282 L26 -276 L4 -270" fill="#c0392b"/>
        <path d="M-148 -80 L-118 -66 L120 -66 L150 -78 Q140 -30 112 0 L-118 0 Q-140 -30 -148 -80 Z" fill="#6b3e22"/>
        <path d="M-146 -76 L-118 -64 L120 -64 L150 -76" stroke="#4a2a14" stroke-width="3" fill="none"/>
        <path d="M-142 -52 Q0 -42 144 -52" stroke="#c9a227" stroke-width="5" fill="none"/>${[-96, -66, -36, -6, 24, 54, 84].map(x => `<rect x="${x}" y="-40" width="10" height="9" fill="#2a1a10"/>`).join("")}
        <path d="M-136 -26 Q0 -16 132 -26" stroke="#5a3218" stroke-width="2" fill="none"/>
        <rect x="-150" y="-108" width="46" height="30" fill="#7a4a2a"/><rect x="-154" y="-112" width="54" height="6" fill="#4a2a14"/>${[-142, -128, -114].map(x => `<rect x="${x}" y="-100" width="8" height="10" fill="#f2d48a"/>`).join("")}
        <path d="M150 -78 L178 -112" stroke="#4a2e18" stroke-width="4"/><path d="M112 0 Q0 6 -118 0" stroke="#3a2210" stroke-width="2" fill="none"/></g>`;
    },
    bomull: () => {
      srand(29); let s = "<g>";
      for (const x0 of [-46, 0, 46]) {
        s += `<path d="M${x0} 0 L${x0} -26 M${x0} -14 L${x0 - 12} -30 M${x0} -18 L${x0 + 12} -34" stroke="#6a4a2a" stroke-width="3"/>`;
        for (let i = 0; i < 7; i++) s += `<ellipse cx="${(x0 + (rnd() - .5) * 46).toFixed(1)}" cy="${(-28 - rnd() * 30).toFixed(1)}" rx="9" ry="6" fill="${["#4a7a3a", "#5a8a42", "#3e6a32"][i % 3]}"/>`;
        for (let i = 0; i < 6; i++) { const x = x0 + (rnd() - .5) * 44, y = -30 - rnd() * 34; s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path d="M-5 3 L0 6 L5 3" stroke="#7a5a3a" stroke-width="2" fill="none"/><circle cx="-3" cy="0" r="4.2" fill="#fbfaf5"/><circle cx="3" cy="0" r="4.2" fill="#fbfaf5"/><circle cx="0" cy="-3.5" r="4.2" fill="#fff"/></g>`; }
      }
      return s + "</g>";
    },
    kurv: o => `<g><path d="M-26 -50 Q0 -78 26 -50" stroke="#8a6a2a" stroke-width="4" fill="none"/><path d="M-30 -34 L-22 0 L22 0 L30 -34 Z" fill="#c9a050" stroke="#8a6a2a" stroke-width="2"/>
      ${[-24, -16, -8, 0, 8, 16, 24].map(x => `<path d="M${x} -33 L${x * .76} -1" stroke="#8a6a2a" stroke-width="1.2"/>`).join("")}<path d="M-28 -22 H28 M-26 -11 H26" stroke="#a8843a" stroke-width="1.4"/>
      ${o && o.tom ? "" : [[-20, -38], [-10, -42], [0, -38], [10, -43], [20, -38], [-4, -47], [12, -35], [-15, -34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#fbfaf5" stroke="#e0dccf" stroke-width=".8"/>`).join("")}
      <ellipse cx="0" cy="-34" rx="30" ry="4" fill="none" stroke="#a88a40" stroke-width="3"/></g>`,
    tromme: () => `<g><path d="M-22 -70 Q-24 -46 -8 -36 L-12 0 L12 0 L8 -36 Q24 -46 22 -70 Z" fill="#8a4a22"/>
      <path d="M-11 -14 l5 -10 l5 10 l5 -10 l5 10 M-10 -6 h20" stroke="#e8c070" stroke-width="1.6" fill="none"/>
      <path d="M-21 -66 L-8 -38 M-12 -68 L-4 -38 M-3 -68 L0 -38 M6 -68 L4 -38 M15 -68 L8 -38 M-21 -66 L-12 -38" stroke="#e8dcc0" stroke-width="1.3" opacity=".9"/>
      <path d="M-8 -38 Q0 -34 8 -38" stroke="#e8dcc0" stroke-width="3" fill="none"/>
      <ellipse cx="0" cy="-70" rx="23" ry="5.5" fill="#e8d8b8" stroke="#6a3a1a" stroke-width="2.5"/></g>`,
    banjo: () => `<g><rect x="-3.5" y="-122" width="7" height="82" fill="#8a5a2a"/><path d="M-5 -122 L-5 -132 L5 -132 L5 -122 Z" fill="#6a4020"/>${[-130, -125].map(y => `<path d="M-8 ${y} h3 M5 ${y} h3" stroke="#d8d0c0" stroke-width="2"/>`).join("")}<path d="M3 -84 h6" stroke="#d8d0c0" stroke-width="2"/>
      <circle cx="0" cy="-23" r="22" fill="#c89a50"/><circle cx="0" cy="-23" r="16" fill="#f0e2c0" stroke="#a87a3a" stroke-width="1.5"/>
      <rect x="-6" y="-17" width="12" height="3" fill="#6a4020"/><path d="M-1.5 -16 V-130 M-.5 -16 V-130 M.5 -16 V-130 M1.5 -16 V-130 M4 -16 V-84" stroke="#e8e4da" stroke-width=".55"/></g>`,
    balafon: () => {
      let s = `<g><path d="M-62 -36 L-70 0 M62 -36 L70 0 M-60 -26 L-52 0 M60 -26 L52 0" stroke="#6a4020" stroke-width="4" stroke-linecap="round"/>`;
      for (let i = 0; i < 9; i++) { const x = -56 + i * 14, r = 9 - i * .45; s += `<circle cx="${x}" cy="${-24 + (8 - r)}" r="${r.toFixed(1)}" fill="#d8a050" stroke="#a87a30" stroke-width="1"/>`; }
      s += `<path d="M-64 -38 H64 M-64 -32 H64" stroke="#5a3418" stroke-width="3"/>`;
      for (let i = 0; i < 9; i++) { const x = -56 + i * 14, h = 28 - i * 1.4; s += `<rect x="${x - 5.5}" y="${-35 - h / 2}" width="11" height="${h.toFixed(1)}" rx="2" fill="${i % 2 ? "#b8783a" : "#c88a48"}" stroke="#7a4a20" stroke-width="1"/>`; }
      return s + `<path d="M-30 -60 L-6 -46 M18 -60 L36 -46" stroke="#5a3418" stroke-width="2.5"/><circle cx="-6" cy="-46" r="4" fill="#3a2a1a"/><circle cx="36" cy="-46" r="4" fill="#3a2a1a"/></g>`;
    },
    salmebok: () => `<g><path d="M-38 -4 Q-20 -14 0 -8 Q20 -14 38 -4 L38 -46 Q20 -56 0 -50 Q-20 -56 -38 -46 Z" fill="#3a2418"/>
      <path d="M-34 -10 Q-18 -18 -1 -12 L-1 -50 Q-18 -56 -34 -48 Z" fill="#fbf3dc"/><path d="M34 -10 Q18 -18 1 -12 L1 -50 Q18 -56 34 -48 Z" fill="#fbf3dc"/>
      ${[-44, -40, -36, -32, -28].map(y => `<path d="M-30 ${y + 1} Q-17 ${y - 4} -4 ${y + 1}" stroke="#9a9080" stroke-width=".7" fill="none"/>`).join("")}${note(-22, -32, .32, "#2a2a2a")}${note(-12, -36, .32, "#2a2a2a")}
      ${[-42, -36, -30, -24, -18].map(y => `<path d="M5 ${y + 1} Q18 ${y - 4} 30 ${y + 1}" stroke="#8a7a5a" stroke-width="1.4" fill="none" stroke-dasharray="5 2"/>`).join("")}
      <path d="M2 -12 L4 6 L7 0 L9 4 L8 -13" fill="#c0392b"/></g>`,
    lykt: o => `<g>${o && o.av ? "" : `<circle cx="0" cy="-36" r="36" fill="#ffd54a" opacity=".22" class="flakk"/>`}
      <path d="M-12 -58 Q0 -80 12 -58" stroke="#4a4a4a" stroke-width="2.5" fill="none"/><rect x="-11" y="-60" width="22" height="6" rx="2" fill="#7a2a1e"/>
      <ellipse cx="0" cy="-34" rx="13" ry="19" fill="${o && o.av ? "#d8e0e0" : "#fff3c0"}" opacity=".92"/>${o && o.av ? "" : `<path d="M0 -26 q-5 -8 0 -16 q5 8 0 16" fill="#ffb300"/>`}
      <path d="M-11 -54 L-12 -14 M11 -54 L12 -14 M0 -54 V-50" stroke="#5a5a5a" stroke-width="1.6"/><rect x="-16" y="-14" width="32" height="14" rx="3" fill="#7a2a1e"/><rect x="-9" y="-20" width="18" height="6" fill="#5a1e14"/></g>`,
    avis: o => {
      const t = String((o && o.tekst) || "NYHETER"), navn = esc((o && o.navn) || "DAILY NEWS");
      const ord = t.split(/\s+/), linjer = [""];
      for (const w of ord) { const l = linjer[linjer.length - 1]; if (l && (l + " " + w).length > Math.max(12, Math.ceil(t.length / 3))) linjer.push(w); else linjer[linjer.length - 1] = l ? l + " " + w : w; }
      const lengst = Math.max(...linjer.map(l => l.length)), fs = Math.min(16, 94 / (lengst * .6), 42 / (linjer.length * 1.1));
      const y0 = -78 + (42 - linjer.length * fs * 1.1) / 2 + fs * .85;
      return `<g transform="rotate(-3 0 -50)"><rect x="-54" y="-102" width="108" height="102" fill="#f4efe2" stroke="#bdb59c" stroke-width="1.5"/>
        <text x="0" y="-88" font-size="10" font-family="Georgia,serif" font-weight="700" text-anchor="middle" fill="#2a2a2a">${navn}</text><path d="M-48 -83 H48 M-48 -81 H48" stroke="#2a2a2a" stroke-width=".8"/>
        ${linjer.map((l, i) => `<text x="0" y="${(y0 + i * fs * 1.1).toFixed(1)}" font-size="${fs.toFixed(1)}" font-weight="700" text-anchor="middle" fill="#111" font-family="${FONT}">${esc(l)}</text>`).join("")}
        <rect x="-48" y="-32" width="36" height="26" fill="#b8b2a4"/>${[-30, -24, -18, -12, -6].map(y => `<path d="M-6 ${y} H48" stroke="#a8a294" stroke-width="2"/>`).join("")}</g>`;
    },
    grammofon: () => `<g><rect x="-36" y="-32" width="72" height="32" rx="2" fill="#8a5a2a"/><rect x="-30" y="-27" width="60" height="22" rx="2" fill="none" stroke="#6a4020" stroke-width="2"/>
      <path d="M36 -18 h10 v12" stroke="#c9a227" stroke-width="3" fill="none"/><circle cx="46" cy="-4" r="3" fill="#2a2a2a"/>
      <ellipse cx="-6" cy="-33" rx="28" ry="6" fill="#141418"/><ellipse cx="-6" cy="-33" rx="8" ry="2" fill="#c8202e"/>
      <path d="M18 -36 L14 -46" stroke="#c9a227" stroke-width="3"/>
      <path d="M13 -46 Q-7 -82 2 -119 L-50 -89 Q-14 -78 8 -42 Z" fill="${B}" stroke="${BM}" stroke-width="1.2"/>
      <ellipse cx="-24" cy="-104" rx="30" ry="9" fill="#7a5a14" stroke="${BM}" stroke-width="2" transform="rotate(-29.5 -24 -104)"/>
      <path d="M-8 -60 Q-20 -84 -10 -110 M-28 -84 Q-6 -78 6 -60" stroke="${BL}" stroke-width="1.4" fill="none" opacity=".7"/></g>`,
    mikrofon: () => `<g><path d="M0 -2 V-100 M-24 0 L0 -18 L24 0" stroke="#4a4a4a" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="-10" y="-108" width="20" height="10" rx="2" fill="#3a3a3a"/>
      <path d="M44 -126 L44 -110 L-2 -104 Q-30 -94 -52 -86 L-52 -150 Q-30 -142 -2 -132 Z" fill="#c8a24a" stroke="#8a6a20" stroke-width="1.5"/>
      <ellipse cx="-52" cy="-118" rx="9" ry="32" fill="#5a4210" stroke="#8a6a20" stroke-width="2"/><path d="M-20 -136 Q10 -128 40 -124" stroke="#f3d97a" stroke-width="2" fill="none" opacity=".6"/>
      <rect x="40" y="-132" width="20" height="28" rx="3" fill="#5a4a3a"/><circle cx="50" cy="-118" r="5" fill="#2a2a2a"/></g>`,
    kornett: () => `<g><ellipse cx="0" cy="-2" rx="44" ry="4" fill="#000" opacity=".14"/><rect x="-44" y="-20" width="88" height="20" rx="9" fill="#8a1f2b"/><rect x="-40" y="-24" width="80" height="10" rx="5" fill="#a8323e"/>
      <g transform="translate(-36 -38) scale(1.5)">${trompet(.9)}</g></g>`,
    klarinett: () => `<g><path d="M-14 0 L0 -12 L14 0 M0 -12 V-2" stroke="#4a4a4a" stroke-width="3" fill="none"/><path d="M0 -14 V-100" stroke="#1d1d22" stroke-width="8" stroke-linecap="round"/>
      <path d="M-8 -6 Q0 -22 8 -6 Z" fill="#1d1d22"/><path d="M0 -100 V-112" stroke="#3a3a42" stroke-width="5" stroke-linecap="round"/>${[-88, -76, -64, -52, -40, -28].map(y => `<circle cx="2" cy="${y}" r="1.6" fill="#c8ccd2"/><path d="M-3 ${y + 4} h6" stroke="#c8ccd2" stroke-width="1"/>`).join("")}</g>`,
    trombone: () => `<g><ellipse cx="0" cy="-2" rx="76" ry="4" fill="#000" opacity=".14"/><g transform="translate(-72 -24)">
      <rect x="0" y="-1.5" width="9" height="3" rx="1" fill="#c8ccd2"/><path d="M8 0 L82 -8" stroke="${B}" stroke-width="4.5"/><path d="M80 -4 L100 -20 Q108 -6 102 8 L80 -12 Z" fill="${B}"/><ellipse cx="102" cy="-6" rx="4" ry="14" fill="${BM}"/>
      <path d="M8 10 H130 Q138 10 138 16 Q138 22 130 22 H52" stroke="${B}" stroke-width="4" fill="none"/><path d="M28 0 V10 M60 -3 V22" stroke="${BM}" stroke-width="3"/></g></g>`,
    tuba: () => `<g><ellipse cx="0" cy="-2" rx="32" ry="4" fill="#000" opacity=".14"/><path d="M-18 -36 Q-20 -8 0 -8 Q20 -8 18 -36" stroke="${B}" stroke-width="14" fill="none"/>
      <path d="M-18 -36 V-96" stroke="${B}" stroke-width="12"/><path d="M11 -36 L14 -110 L36 -110 L25 -36 Z" fill="${B}"/><ellipse cx="25" cy="-112" rx="30" ry="7" fill="${BM}" stroke="${B}" stroke-width="3"/>
      ${[-8, -1, 6].map(x => `<rect x="${x - 2.5}" y="-82" width="5" height="22" rx="1" fill="${BM}"/><circle cx="${x}" cy="-85" r="3" fill="${BL}"/>`).join("")}<path d="M-18 -70 H14 M-18 -60 H14" stroke="${B}" stroke-width="4"/>
      <path d="M-18 -96 Q-18 -112 -32 -114" stroke="${B}" stroke-width="5" fill="none"/><rect x="-40" y="-117" width="9" height="5" rx="1" fill="#c8ccd2"/><path d="M-12 -40 Q-14 -20 0 -16" stroke="${BL}" stroke-width="2" fill="none" opacity=".7"/></g>`,
    notestativ: () => `<g><path d="M0 -24 L-24 0 M0 -24 L24 0 M0 -24 L0 0 M0 -24 V-96" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round"/>
      <path d="M-38 -140 L38 -140 L36 -96 L-36 -96 Z" fill="#2a2a2a"/><rect x="-30" y="-136" width="60" height="38" fill="#fbf8ee"/>
      ${[0, 1].map(r => [0, 1, 2, 3, 4].map(i => `<path d="M-26 ${-130 + r * 16 + i * 2.4} H26" stroke="#7a7a7a" stroke-width=".6"/>`).join("")).join("")}
      ${note(-16, -122, .38, "#1b1b1b")}${note(-4, -126, .38, "#1b1b1b")}${note(10, -124, .38, "#1b1b1b", true)}${note(-12, -106, .38, "#1b1b1b")}${note(6, -110, .38, "#1b1b1b")}<path d="M-38 -96 H38" stroke="#2a2a2a" stroke-width="4"/></g>`,
    tekstark: o => {
      const t = (o && o.tekst) || "", fs = tekstStr(t, 42, 9);
      return `<g transform="rotate(-4 0 -34)"><path d="M-26 -68 L16 -68 L26 -58 L26 0 L-26 0 Z" fill="#fbf6e8" stroke="#c9b98f" stroke-width="1.4"/><path d="M16 -68 L16 -58 L26 -58" fill="#ece2c8" stroke="#c9b98f" stroke-width="1"/>
        ${t ? `<text x="-2" y="-56" font-size="${fs.toFixed(1)}" font-weight="700" text-anchor="middle" fill="#2a1a0a" font-family="${FONT}">${esc(t)}</text>` : ""}
        ${[-46, -40, -34, -28, -22, -16, -10].map((y, i) => `<path d="M-20 ${y} H${i % 3 === 2 ? 6 : 18}" stroke="#8a7a5a" stroke-width="1.6"/>`).join("")}</g>`;
    },
    hitliste: o => {
      o = o || {};
      let rb = o.rb || ["Fats Domino", "Ruth Brown", "Big Joe Turner", "The Clovers"];
      let hv = o.hoved || (o.crossover ? ["Perry Como", "Patti Page", "Fats Domino", "Bill Haley"] : ["Perry Como", "Patti Page", "Bill Haley", "The Crew-Cuts"]);
      if (o.boone) rb = ["Pat Boone"].concat(rb.filter(n => n !== "Pat Boone")).slice(0, 4);
      const kol = (x, tittel, farge, liste) => `<rect x="${x}" y="-196" width="116" height="22" rx="3" fill="${farge}"/><text x="${x + 58}" y="-180" font-size="12" font-weight="700" text-anchor="middle" fill="#fff" font-family="${FONT}">${tittel}</text>`
        + liste.map((n, i) => { const y = -164 + i * 30, hl = (o.crossover && n === "Fats Domino") || (o.boone && n === "Pat Boone" && liste === rb);
          return `${hl ? `<rect x="${x - 2}" y="${y - 2}" width="120" height="26" rx="3" fill="#ffe680" stroke="#e0a800" stroke-width="2"/>` : ""}<text x="${x + 6}" y="${y + 16}" font-size="12" font-weight="700" fill="#555" font-family="${FONT}">${i + 1}.</text><text x="${x + 22}" y="${y + 16}" font-size="12" font-weight="${hl ? 700 : 400}" fill="#1b1b1b" font-family="${FONT}">${esc(n)}</text>`; }).join("");
      let s = `<g><path d="M-100 0 L-94 -40 M100 0 L94 -40" stroke="#6b4a2a" stroke-width="6" stroke-linecap="round"/>
        <rect x="-132" y="-206" width="264" height="168" rx="4" fill="#6b4a2a"/><rect x="-126" y="-200" width="252" height="156" fill="#fbfaf5"/><path d="M0 -196 V-50" stroke="#d8d4cc" stroke-width="1.5"/>
        ${kol(-122, "R&amp;B-LISTA", "#c8202e", rb)}${kol(6, "HOVEDLISTA", "#1f3d7a", hv)}`;
      if (o.crossover) { const a = rb.indexOf("Fats Domino"), b = hv.indexOf("Fats Domino"); if (a >= 0 && b >= 0) { const y1 = -152 + a * 30, y2 = -152 + b * 30; s += `<path d="M-8 ${y1} Q0 ${(y1 + y2) / 2 - 10} 2 ${y2}" stroke="#e0a800" stroke-width="3" fill="none"/><path d="M8 ${y2} L-1 ${y2 - 6} L-1 ${y2 + 6} Z" fill="#e0a800"/>`; } }
      return s + `</g>`;
    },
    radio: o => `<g><rect x="-44" y="-56" width="88" height="56" rx="12" fill="#c8423a"/><rect x="-44" y="-56" width="88" height="10" rx="8" fill="${mix("#c8423a", .15)}"/>
      <rect x="-36" y="-46" width="40" height="38" rx="4" fill="#f0e4c4"/>${[-40, -34, -28, -22, -16].map(y => `<path d="M-32 ${y} H0" stroke="#c8b890" stroke-width="2"/>`).join("")}
      <circle cx="22" cy="-32" r="13" fill="#f6eed6" stroke="#c9a227" stroke-width="2.5"/>${[-60, -30, 0, 30, 60].map(a => `<path d="M${22 + Math.sin(a * Math.PI / 180) * 9} ${-32 - Math.cos(a * Math.PI / 180) * 9} L${22 + Math.sin(a * Math.PI / 180) * 12} ${-32 - Math.cos(a * Math.PI / 180) * 12}" stroke="#8a7a5a" stroke-width="1"/>`).join("")}<path d="M22 -32 L28 -42" stroke="#c0392b" stroke-width="1.6"/>
      <circle cx="14" cy="-10" r="4" fill="#f6eed6"/><circle cx="30" cy="-10" r="4" fill="#f6eed6"/>
      ${o && o.spiller ? noter([[-30, -70, .9, "#1f3d7a"], [0, -84, 1, "#c8202e", true], [30, -72, .8, "#2e7d32"]]) : ""}</g>`,
    singel: () => `<g><rect x="-40" y="-58" width="54" height="54" rx="2" fill="#e8b830"/><circle cx="-13" cy="-31" r="20" fill="none" stroke="#c0392b" stroke-width="5"/><text x="-13" y="-8" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a06" font-family="${FONT}">45</text>
      <path fill-rule="evenodd" fill="#141418" d="M-20 -27 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0 Z M2 -27 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 Z"/>
      ${[22, 19, 16].map(r => `<circle cx="6" cy="-27" r="${r}" fill="none" stroke="#2c2c34" stroke-width="1"/>`).join("")}
      <path fill-rule="evenodd" fill="#2f6ab0" d="M-5 -27 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z M2 -27 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 Z"/><path d="M-12 -40 A24 24 0 0 1 8 -52" stroke="#fff" stroke-width="2" opacity=".25" fill="none"/></g>`,
    jukeboks: o => `<g><path d="M-52 0 L-52 -112 Q-52 -164 0 -164 Q52 -164 52 -112 L52 0 Z" fill="#7a3a24"/>
      <path d="M-44 -4 L-44 -112 Q-44 -156 0 -156 Q44 -156 44 -112 L44 -4" stroke="#f08a2a" stroke-width="6" fill="none"/><path d="M-36 -4 L-36 -112 Q-36 -148 0 -148 Q36 -148 36 -112 L36 -4" stroke="#ffd54a" stroke-width="4" fill="none"/>
      <rect x="-30" y="-130" width="60" height="38" rx="5" fill="#2a2a3a"/>${[0, 1, 2, 3].map(i => `<ellipse cx="0" cy="${-100 - i * 6}" rx="24" ry="4" fill="#141418" stroke="#3a3a48" stroke-width="1"/>`).join("")}<ellipse cx="0" cy="-118" rx="7" ry="1.6" fill="#c8202e"/>
      <rect x="-30" y="-86" width="60" height="14" rx="2" fill="#f4ecd0"/>${[-24, -16, -8, 0, 8, 16, 24].map(x => `<rect x="${x - 2.5}" y="-83" width="5" height="8" rx="1" fill="#c8202e"/>`).join("")}
      <rect x="-30" y="-66" width="60" height="50" rx="4" fill="#c9a227"/>${[-58, -50, -42, -34, -26].map(y => `<path d="M-26 ${y} H26" stroke="#8a6a10" stroke-width="2.5"/>`).join("")}
      <rect x="-50" y="-10" width="100" height="10" fill="#4a2414"/>
      ${o && o.spiller ? noter([[-44, -176, .9, "#c8202e"], [0, -188, 1, "#1f3d7a", true], [44, -176, .9, "#2e7d32"]]) : ""}</g>`,
    tvkamera: o => `<g><g transform="scale(${o && o.snu ? 1 : -1} 1)"><path d="M-30 -6 L30 -6 M0 -6 V-88" stroke="#5a5e66" stroke-width="7" stroke-linecap="round"/>${[-30, 0, 30].map(x => `<circle cx="${x}" cy="-5" r="5" fill="#2a2a2a"/>`).join("")}
      <rect x="-14" y="-96" width="28" height="10" rx="2" fill="#3a3e46"/>
      <rect x="-40" y="-142" width="74" height="48" rx="5" fill="#4a4e56"/><rect x="-36" y="-136" width="20" height="14" rx="2" fill="#8a9098"/>
      <rect x="-30" y="-158" width="44" height="16" rx="3" fill="#3a3e46"/><circle cx="6" cy="-162" r="4" fill="#e53935"/>
      <circle cx="40" cy="-118" r="16" fill="#2a2a2e"/>${[[48, -128], [50, -110], [36, -104]].map(([x, y], i) => `<rect x="${x - 2}" y="${y - 6 + i}" width="${14 - i * 3}" height="${12 - i * 2}" rx="2" fill="#1b1b1e" stroke="#6a6e76" stroke-width="1"/>`).join("")}
      <circle cx="61" cy="-122" r="3" fill="#6a8ab8" opacity=".8"/>
      <path d="M-40 -110 L-72 -100 M-40 -126 L-70 -122" stroke="#3a3e46" stroke-width="4" stroke-linecap="round"/></g>
      <text x="${o && o.snu ? -26 : 26}" y="-125" font-size="9" font-weight="700" text-anchor="middle" fill="#2a2a2a" font-family="${FONT}">TV</text></g>`,
    kinoplakat: () => `<g><path d="M-30 0 L-24 -12 M30 0 L24 -12" stroke="#4a4a4a" stroke-width="4"/>
      <rect x="-46" y="-140" width="92" height="130" rx="2" fill="#c9a227"/><rect x="-42" y="-136" width="84" height="122" fill="#1d2440"/>
      <rect x="-30" y="-128" width="60" height="38" fill="#2f4a3a" stroke="#8a6a4a" stroke-width="3"/><text x="-16" y="-104" font-size="11" fill="#f4f4ec" font-family="Georgia,serif" opacity=".85">ABC</text>${note(16, -102, .5, "#f4f4ec")}<path d="M-24 -96 q10 -6 20 0" stroke="#f4f4ec" stroke-width="1.2" fill="none" opacity=".7"/>
      <text x="0" y="-72" font-size="11.5" font-weight="700" text-anchor="middle" fill="#ffd54a" font-family="${FONT}">BLACKBOARD</text>
      <text x="0" y="-52" font-size="19" font-weight="700" text-anchor="middle" fill="#ffd54a" font-family="${FONT}">JUNGLE</text>
      <rect x="-20" y="-44" width="40" height="18" rx="2" fill="#c8202e"/><text x="0" y="-30" font-size="13" font-weight="700" text-anchor="middle" fill="#fff" font-family="${FONT}">1955</text></g>`,
    mikrofon50: () => `<g><ellipse cx="0" cy="-4" rx="22" ry="5" fill="#4a4a52"/><ellipse cx="0" cy="-6" rx="22" ry="5" fill="#6a6e76"/><path d="M0 -8 V-132" stroke="#b8bcc4" stroke-width="4"/><path d="M1.2 -10 V-130" stroke="#fff" stroke-width="1" opacity=".5"/>
      <path d="M-14 -150 Q-16 -136 0 -132 Q16 -136 14 -150" stroke="#9a9ea6" stroke-width="3" fill="none"/>
      <rect x="-12" y="-176" width="24" height="38" rx="11" fill="#d8dce4" stroke="#8a8e96" stroke-width="1.5"/>${[-168, -163, -158, -153, -148, -143].map(y => `<path d="M-10 ${y} H10" stroke="#8a8e96" stroke-width="1.6"/>`).join("")}
      <path d="M0 -176 V-138" stroke="#8a8e96" stroke-width="1.6"/><path d="M-7 -172 Q-9 -158 -7 -144" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/></g>`,
  };
  Object.assign(K.TING, TING);

  /* ======================================================================
     BAKGRUNNER (800 × 450)
     ====================================================================== */
  const gulv = (y, f, l, dx) => { let s = `<rect y="${y}" width="800" height="${450 - y}" fill="${f}"/>`; for (let x = 0; x < 860; x += 60) s += `<path d="M${x} ${y} L${x - (dx == null ? 24 : dx)} 450" stroke="${l}" stroke-width="2"/>`; return s; };
  const stjerner = (n, s, maks) => { srand(s); let r = ""; for (let i = 0; i < n; i++) r += `<circle cx="${(rnd() * 800).toFixed(1)}" cy="${(rnd() * (maks || 200)).toFixed(1)}" r="${(.7 + rnd() * 1.5).toFixed(1)}" fill="#fff" opacity="${(.4 + rnd() * .6).toFixed(2)}"/>`; return r; };
  const vindu = (x, y, w, h, glass, ramme) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${glass}"/><path d="M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}" stroke="${ramme}" stroke-width="5"/><rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${h + 6}" fill="none" stroke="${ramme}" stroke-width="7"/>`;
  const lampe = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 30}" fill="#ffd54a" opacity=".18" class="flakk"/>`;
  const tre = (x, y, s, f, mose) => { let t = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 0 Q-6 -60 -14 -120 L14 -120 Q8 -60 10 0 Z" fill="${mix(f, -.3)}"/><path d="M-6 -100 Q-50 -120 -80 -110 M6 -96 Q50 -126 84 -112" stroke="${mix(f, -.3)}" stroke-width="8" fill="none"/>
      <ellipse cx="0" cy="-160" rx="90" ry="54" fill="${f}"/><ellipse cx="-60" cy="-126" rx="50" ry="32" fill="${mix(f, .06)}"/><ellipse cx="62" cy="-130" rx="52" ry="30" fill="${mix(f, .06)}"/>`;
    if (mose) { srand(Math.round(x)); for (let i = 0; i < 9; i++) { const mx = -90 + rnd() * 180, my2 = -130 + rnd() * 30; t += `<path d="M${mx.toFixed(1)} ${my2.toFixed(1)} q-3 18 1 ${(28 + rnd() * 24).toFixed(1)}" stroke="${mose}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>`; } }
    return t + `</g>`; };

  const BG = {
    musikkrom() {
      let s = `<rect width="800" height="450" fill="#eef0e6"/><rect y="250" width="800" height="80" fill="#c9dbe2"/><rect y="246" width="800" height="6" fill="#a9bfc8"/>`;
      s += gulv(328, "#c49a6c", "#b08a5c");
      s += vindu(36, 60, 130, 170, "#a8d0ec", "#f4f4f4") + `<path d="M44 222 q20 -26 46 -10 q26 -18 56 0 q14 -8 22 10 Z" fill="#7ab06a"/><circle cx="140" cy="94" r="14" fill="#fff3b0"/>`;
      s += `<rect x="240" y="44" width="320" height="168" fill="#2f4a3a" stroke="#8a6a4a" stroke-width="10"/><text x="400" y="82" font-size="22" font-weight="700" text-anchor="middle" fill="#f4f4ec" font-family="${FONT}">MUSIKKHISTORIE</text>`;
      s += [0, 1, 2, 3, 4].map(i => `<path d="M270 ${120 + i * 9} H530" stroke="#f4f4ec" stroke-width="1.4" opacity=".75"/>`).join("");
      s += `<text x="286" y="160" font-size="40" fill="#f4f4ec" opacity=".85" font-family="Georgia,serif">𝄞</text>` + [[340, 151], [372, 142], [404, 133], [436, 147], [468, 138], [500, 129]].map(([x, y], i) => note(x, y, .8, "#f4f4ec", i === 2)).join("");
      s += `<path d="M262 194 q40 -6 80 2 M400 196 q50 -8 110 0" stroke="#f4f4ec" stroke-width="2" fill="none" opacity=".55"/><rect x="240" y="212" width="320" height="8" fill="#8a6a4a"/><rect x="300" y="214" width="20" height="5" fill="#fbfaf5"/>`;
      const plakat = (x, f, inn, t) => `<g transform="translate(${x} 70)"><rect x="-44" y="0" width="88" height="118" rx="4" fill="#fff" stroke="#d6d6d6"/><rect x="-44" y="0" width="88" height="22" rx="4" fill="${f}"/>${inn}
        <text x="0" y="108" font-size="10" font-weight="700" text-anchor="middle" fill="#333" font-family="${FONT}">${t}</text></g>`;
      s += plakat(640, "#c8202e", `<g transform="translate(4 68) rotate(-30) scale(.46)">${gitarForm("#c8843a")}</g>`, "BLUES");
      s += plakat(744, "#1f3d7a", `<g transform="translate(-28 62) scale(1.15)">${trompet(1)}</g>`, "JAZZ");
      s += `<g transform="translate(206 40)"><circle r="16" fill="#fbfaf5" stroke="#3a3a3a" stroke-width="3"/><path d="M0 0 V-10 M0 0 L7 4" stroke="#3a3a3a" stroke-width="2" stroke-linecap="round"/></g>`;
      return s;
    },
    havn() {
      let s = sky("prHavS", "#8ec0e4", "#f6e6c8");
      srand(201); for (let i = 0; i < 6; i++) { const x = rnd() * 800, y = 30 + rnd() * 90; s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${40 + rnd() * 30}" ry="11" fill="#fff" opacity=".75"/><ellipse cx="${(x + 26).toFixed(0)}" cy="${(y - 7).toFixed(0)}" rx="26" ry="10" fill="#fff" opacity=".75"/>`; }
      s += `<path d="M0 252 L40 252 L40 236 L58 236 L58 252 L90 252 L90 230 L104 210 L118 230 L118 252 L160 252 L160 240 L200 240 L200 252 Z" fill="#9aa8b8"/><path d="M104 210 V196" stroke="#9aa8b8" stroke-width="2"/>`;
      s += `<rect y="250" width="800" height="100" fill="#3a7aa8"/>`; for (let y = 262; y < 348; y += 13) s += `<path d="M0 ${y} Q100 ${y - 5} 200 ${y} T400 ${y} T600 ${y} T800 ${y}" stroke="#5a9ac4" stroke-width="2" fill="none" opacity=".7"/>`;
      const hus = (x, w, h, f, tak) => `<rect x="${x}" y="${346 - h}" width="${w}" height="${h}" fill="${f}"/><path d="M${x - 6} ${346 - h} L${x + w / 2} ${346 - h - 38} L${x + w + 6} ${346 - h} Z" fill="${tak}"/>
        <rect x="${x + w / 2 - 14}" y="${346 - 44}" width="28" height="44" fill="${mix(f, -.45)}"/>${[.22, .78].map(t => `<rect x="${x + w * t - 9}" y="${346 - h + 24}" width="18" height="22" fill="#4a5a6a"/>`).join("")}<rect x="${x + w / 2 - 8}" y="${346 - h - 22}" width="16" height="14" fill="#4a5a6a"/>`;
      s += hus(590, 100, 150, "#c8a07a", "#7a3a2a") + hus(700, 110, 170, "#b88a62", "#6a3a2a");
      s += `<path d="M560 346 V170 L520 180 M560 176 L620 166" stroke="#5a3a1a" stroke-width="7" fill="none"/><path d="M523 182 V250" stroke="#3a2a1a" stroke-width="1.5"/><rect x="514" y="250" width="18" height="14" fill="#a8864a"/>`;
      s += `<rect y="344" width="800" height="14" fill="#8a8274"/>`; for (let x = 0; x < 800; x += 40) s += `<rect x="${x + 1}" y="345" width="38" height="12" fill="#9a9284"/>`;
      s += `<rect y="358" width="800" height="92" fill="#b8ad9a"/>`; srand(203); for (let i = 0; i < 60; i++) s += `<ellipse cx="${(rnd() * 800).toFixed(0)}" cy="${(366 + rnd() * 84).toFixed(0)}" rx="${(9 + rnd() * 8).toFixed(0)}" ry="${(3 + rnd() * 3).toFixed(0)}" fill="#a69c88"/>`;
      s += [60, 320, 470].map(x => `<rect x="${x - 8}" y="330" width="16" height="20" rx="4" fill="#3a3a3a"/><ellipse cx="${x}" cy="330" rx="10" ry="4" fill="#4a4a4a"/>`).join("");
      s += `<g fill="none" stroke="#3a3a3a" stroke-width="2"><path d="M300 60 q8 -8 16 0 q8 -8 16 0"/><path d="M420 90 q6 -6 12 0 q6 -6 12 0"/></g>`;
      return s;
    },
    bomullsmark() {
      let s = sky("prBomS", "#f6c47a", "#fbeac4") + `<circle cx="650" cy="96" r="70" fill="#fff6c8" opacity=".35"/><circle cx="650" cy="96" r="42" fill="#fff1b8"/>`;
      s += `<path d="M0 236 Q200 214 400 230 T800 222 L800 260 L0 260 Z" fill="#9aa86a"/>`;
      s += `<g transform="translate(600 226) scale(.55)"><rect x="-80" y="-80" width="160" height="80" fill="#f4efe4"/><path d="M-92 -80 L0 -120 L92 -80 Z" fill="#8a8a92"/>${[-64, -32, 0, 32, 64].map(x => `<rect x="${x - 3}" y="-76" width="6" height="76" fill="#fff"/>`).join("")}<rect x="-80" y="-44" width="160" height="5" fill="#d8d0c0"/></g>`;
      s += [[150, 248], [200, 250], [250, 247], [300, 250]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.4)"><rect x="-26" y="-34" width="52" height="34" fill="#8a6a4a"/><path d="M-32 -34 L0 -56 L32 -34 Z" fill="#6a4a30"/><rect x="-6" y="-22" width="12" height="22" fill="#4a3020"/><rect x="14" y="-62" width="8" height="18" fill="#7a5a3a"/></g>`).join("");
      s += tre(70, 262, .45, "#5a7a3a") + tre(470, 252, .3, "#5a7a3a");
      s += `<path d="M0 256 Q400 244 800 258 L800 450 L0 450 Z" fill="#b8805a"/>`;
      const rader = [[268, .35], [288, .5], [314, .66], [346, .84]];
      srand(207); for (const [y, k] of rader) {
        s += `<path d="M0 ${y + 6 * k} Q400 ${y - 4} 800 ${y + 6 * k}" stroke="#a06a46" stroke-width="${8 * k}" fill="none"/>`;
        for (let x = -10 + rnd() * 20; x < 810; x += 34 * k + rnd() * 10 * k) {
          s += `<ellipse cx="${x.toFixed(0)}" cy="${(y - 8 * k).toFixed(0)}" rx="${(13 * k).toFixed(1)}" ry="${(9 * k).toFixed(1)}" fill="${rnd() > .5 ? "#5a8a42" : "#4a7a3a"}"/>`;
          for (let j = 0; j < 3; j++) s += `<circle cx="${(x + (rnd() - .5) * 18 * k).toFixed(1)}" cy="${(y - 8 * k - rnd() * 10 * k).toFixed(1)}" r="${(3.4 * k).toFixed(1)}" fill="#fbfaf5"/>`;
        }
      }
      s += `<path d="M0 370 Q400 356 800 372 L800 450 L0 450 Z" fill="#c8946a"/>`; srand(209); for (let i = 0; i < 30; i++) s += `<ellipse cx="${(rnd() * 800).toFixed(0)}" cy="${(380 + rnd() * 66).toFixed(0)}" rx="${(5 + rnd() * 9).toFixed(0)}" ry="2.5" fill="#b8845a"/>`;
      return s;
    },
    trekirke() {
      let s = `<rect width="800" height="450" fill="#8a6040"/>`; for (let x = 0; x < 800; x += 32) s += `<path d="M${x} 0 V330" stroke="#7a5236" stroke-width="2"/>`;
      s += `<path d="M0 0 H800 V40 L400 70 L0 40 Z" fill="#5a3a24"/><path d="M0 40 L400 70 L800 40" stroke="#4a2e1a" stroke-width="8" fill="none"/>`;
      for (const x of [70, 230, 530, 690]) s += `<path d="M${x} 230 V120 Q${x + 40} 84 ${x + 80} 120 V230 Z" fill="#2a3a6a"/><path d="M${x + 40} 98 V230 M${x} 170 H${x + 80}" stroke="#6a4a2e" stroke-width="5"/><path d="M${x} 230 V120 Q${x + 40} 84 ${x + 80} 120 V230 Z" fill="none" stroke="#5a3a24" stroke-width="7"/><circle cx="${x + 22}" cy="140" r="1.6" fill="#fff"/>`;
      s += `<path d="M400 96 V196 M374 124 H426" stroke="#c9a46a" stroke-width="10" stroke-linecap="round"/>`;
      for (const x of [170, 630]) s += lampe(x, 170, 44) + `<rect x="${x - 3}" y="176" width="6" height="20" fill="#5a3a1a"/><rect x="${x - 9}" y="152" width="18" height="24" rx="3" fill="#fff3c0" stroke="#4a4a4a" stroke-width="2"/><path d="M${x} 170 q-3 -6 0 -12 q3 6 0 12" fill="#ffb300"/>`;
      s += `<rect y="316" width="800" height="6" fill="#4a2e1a"/><rect y="322" width="800" height="128" fill="#5a3c26"/>`; for (let y = 334; y < 450; y += 15) s += `<path d="M0 ${y} H800" stroke="#4a3020" stroke-width="2"/>`;
      for (const [x, w] of [[10, 240], [550, 240]]) for (let r = 0; r < 2; r++) { const y = 322 + r * 36;
        s += `<rect x="${x}" y="${y - 24}" width="${w}" height="8" fill="#4a2e1a"/><rect x="${x + 8}" y="${y - 16}" width="6" height="16" fill="#3a2414"/><rect x="${x + w - 14}" y="${y - 16}" width="6" height="16" fill="#3a2414"/>
          <rect x="${x}" y="${y}" width="${w}" height="10" fill="#6a4428"/><rect x="${x}" y="${y + 10}" width="${w}" height="5" fill="#3a2414"/><rect x="${x + 6}" y="${y + 15}" width="6" height="12" fill="#3a2414"/><rect x="${x + w - 12}" y="${y + 15}" width="6" height="12" fill="#3a2414"/>`; }
      s += `<defs><radialGradient id="prTkGlow" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#ffd54a" stop-opacity=".12"/><stop offset="1" stop-color="#ffd54a" stop-opacity="0"/></radialGradient></defs>`;
      s += `<rect width="800" height="450" fill="#1a1030" opacity=".18"/><rect width="800" height="450" fill="url(#prTkGlow)"/>`;
      return s;
    },
    elvnatt() {
      let s = sky("prElvS", "#0c1430", "#2a3a6a") + stjerner(70, 211, 200);
      s += `<circle cx="620" cy="82" r="60" fill="#fff6d0" opacity=".12"/><circle cx="620" cy="82" r="30" fill="#f6f2d8"/><circle cx="610" cy="76" r="5" fill="#e4dec0"/><circle cx="628" cy="92" r="4" fill="#e4dec0"/>`;
      s += `<path d="M0 250 Q60 214 120 236 Q180 206 250 232 Q320 208 400 236 Q480 214 560 238 Q640 210 720 234 Q770 220 800 236 L800 262 L0 262 Z" fill="#14242a"/>`;
      s += `<rect y="258" width="800" height="84" fill="#22406a"/>`; for (let y = 268; y < 340; y += 11) s += `<path d="M0 ${y} Q200 ${y - 3} 400 ${y} T800 ${y}" stroke="#3a5a8a" stroke-width="1.6" fill="none" opacity=".7"/>`;
      s += [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${620 + (i % 2 ? 8 : -6)}" cy="${270 + i * 12}" rx="${30 - i * 3}" ry="2.4" fill="#f6f2d8" opacity="${.6 - i * .07}"/>`).join("");
      s += `<path d="M0 336 Q400 326 800 340 L800 450 L0 450 Z" fill="#33452a"/>`; srand(213); for (let i = 0; i < 40; i++) { const x = rnd() * 800, y = 346 + rnd() * 100; s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-3 -9 M${x.toFixed(0)} ${y.toFixed(0)} l2 -11 M${x.toFixed(0)} ${y.toFixed(0)} l5 -8" stroke="#3a4a2a" stroke-width="2"/>`; }
      s += tre(40, 380, .95, "#1a2a1e", "#4a5a4a") + tre(790, 390, 1.05, "#1a2a1e", "#4a5a4a");
      srand(215); s += `<g class="flakk">`; for (let i = 0; i < 14; i++) s += `<circle cx="${(rnd() * 800).toFixed(0)}" cy="${(220 + rnd() * 160).toFixed(0)}" r="2" fill="#f4e46a"/>`; s += `</g>`;
      return s;
    },
    veranda() {
      let s = `<defs><linearGradient id="prVerS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a8a"/><stop offset=".55" stop-color="#f0905a"/><stop offset="1" stop-color="#ffd890"/></linearGradient></defs><rect width="800" height="450" fill="url(#prVerS)"/>`;
      s += `<circle cx="560" cy="250" r="44" fill="#ffe8a0"/><circle cx="560" cy="250" r="80" fill="#ffe8a0" opacity=".2"/>`;
      s += `<rect y="250" width="800" height="70" fill="#5a5a3a"/><path d="M200 262 Q500 254 800 262" stroke="#7a7a4a" stroke-width="6" fill="none"/>`;
      for (const [x, h] of [[330, 70], [380, 54], [700, 80], [760, 60]]) s += `<path d="M${x} 252 L${x - 7} 252 L${x - 2} ${252 - h} Z M${x} 252 L${x + 7} 252 L${x + 2} ${252 - h} Z" fill="#2a2a1e"/><ellipse cx="${x}" cy="${252 - h * .6}" rx="9" ry="${h * .45}" fill="#2a2a1e"/>`;
      s += `<rect x="0" y="0" width="230" height="320" fill="#b89a70"/>`; for (let y = 10; y < 320; y += 16) s += `<path d="M0 ${y} H230" stroke="#a0845e" stroke-width="2"/>`;
      s += `<rect x="40" y="100" width="70" height="90" fill="#3a3a4a"/><path d="M75 100 v90 M40 145 h70" stroke="#f4efe4" stroke-width="5"/><rect x="36" y="96" width="78" height="98" fill="none" stroke="#f4efe4" stroke-width="6"/><rect x="140" y="140" width="62" height="180" fill="#6a4a2a"/><circle cx="192" cy="236" r="4" fill="#c9a227"/>`;
      s += `<rect x="0" y="0" width="800" height="36" fill="#7a5a3a"/><rect y="34" width="800" height="8" fill="#5a3e24"/>`;
      s += `<rect x="230" y="262" width="570" height="8" fill="#8a6a44"/><rect x="230" y="300" width="570" height="6" fill="#8a6a44"/>`; for (let x = 240; x < 800; x += 18) s += `<rect x="${x}" y="270" width="6" height="30" fill="#a07e54"/>`;
      for (const x of [230, 500, 784]) s += `<rect x="${x}" y="42" width="16" height="280" fill="#9a7a50"/>`;
      s += gulv(318, "#9a7650", "#86643e", -30);
      return s;
    },
    telt() {
      let s = `<rect width="800" height="450" fill="#3a1a1a"/>`;
      for (let i = -3; i < 12; i++) { const x1 = i * 100 - 100, x2 = x1 + 100; s += `<path d="M400 -40 L${x1} 320 L${x2} 320 Z" fill="${i % 2 ? "#b83a3a" : "#f2e6cc"}"/>`; }
      s += `<rect width="800" height="320" fill="#2a1030" opacity=".22"/>`;
      for (const x of [140, 660]) s += `<rect x="${x - 6}" y="0" width="12" height="320" fill="#6a4a2a"/>`;
      const slynge = (y0, sag, n) => { let d = `M0 ${y0}`, b = ""; for (let k = 0; k < 4; k++) { const x0 = k * 200; d += ` Q${x0 + 100} ${y0 + sag * 2} ${x0 + 200} ${y0}`;
        for (let i = 1; i < n; i++) { const t = i / n, x = x0 + 200 * t, y = y0 + 4 * t * (1 - t) * sag; b += `<circle cx="${x.toFixed(0)}" cy="${(y + 5).toFixed(0)}" r="4" fill="#ffe680"/><circle cx="${x.toFixed(0)}" cy="${(y + 5).toFixed(0)}" r="9" fill="#ffe680" opacity=".25"/>`; } }
        return `<path d="${d}" stroke="#2a2a2a" stroke-width="1.5" fill="none"/>` + b; };
      s += `<g class="flakk">${slynge(64, 26, 4)}</g>${slynge(108, 20, 5)}`;
      s += `<rect x="220" y="130" width="360" height="130" fill="#8a1f2b"/>${[240, 280, 320, 360, 400, 440, 480, 520, 560].map(x => `<path d="M${x} 130 V260" stroke="#6a1420" stroke-width="5"/>`).join("")}<path d="M216 130 H584" stroke="#c9a227" stroke-width="8"/>${Array.from({ length: 23 }, (_, i) => `<path d="M${222 + i * 16} 134 v8" stroke="#c9a227" stroke-width="3"/>`).join("")}`;
      s += `<rect x="200" y="258" width="400" height="12" fill="#8a5a30"/><rect x="200" y="270" width="400" height="38" fill="#6a3a1a"/>${[230, 290, 350, 410, 470, 530, 570].map(x => `<ellipse cx="${x}" cy="270" rx="8" ry="4" fill="#ffe680"/>`).join("")}`;
      s += `<rect y="306" width="800" height="144" fill="#c8a870"/>`; srand(221); for (let i = 0; i < 90; i++) s += `<circle cx="${(rnd() * 800).toFixed(0)}" cy="${(312 + rnd() * 136).toFixed(0)}" r="${(1 + rnd() * 1.6).toFixed(1)}" fill="#a8885a"/>`;
      return s;
    },
    gate() {
      let s = sky("prGatS", "#2a2a5a", "#e8905a") + stjerner(18, 223, 70);
      const hus = (x, w, f) => { let h = `<rect x="${x}" y="70" width="${w}" height="252" fill="${f}"/><rect x="${x}" y="62" width="${w}" height="12" fill="${mix(f, -.18)}"/>`;
        const n = Math.floor(w / 60);
        for (let i = 0; i < n; i++) { const wx = x + 14 + i * (w - 28) / n + ((w - 28) / n - 34) / 2;
          h += `<rect x="${wx}" y="90" width="34" height="64" fill="${(i + x) % 3 ? "#f2c64a" : "#3a3a5a"}"/><rect x="${wx - 10}" y="88" width="9" height="68" fill="#2e6a4a"/><rect x="${wx + 35}" y="88" width="9" height="68" fill="#2e6a4a"/>`;
          h += `<rect x="${wx}" y="214" width="34" height="108" fill="${(i + x) % 3 === 1 ? "#d8b060" : "#4a3a3a"}"/><rect x="${wx - 10}" y="212" width="9" height="110" fill="#2e6a4a"/><rect x="${wx + 35}" y="212" width="9" height="110" fill="#2e6a4a"/>`; }
        h += `<rect x="${x - 8}" y="176" width="${w + 16}" height="7" fill="#2a2a2a"/>`;
        for (let bx = x - 4; bx < x + w + 4; bx += 7) h += `<path d="M${bx} 156 V176" stroke="#1b1b1b" stroke-width="1.6"/>`;
        h += `<path d="M${x - 8} 156 H${x + w + 8} M${x - 8} 166 H${x + w + 8}" stroke="#1b1b1b" stroke-width="2.4"/>`;
        for (let bx = x; bx < x + w; bx += 14) h += `<path d="M${bx} 166 q7 -8 14 0" stroke="#1b1b1b" stroke-width="1.4" fill="none"/>`;
        h += `<path d="M${x - 4} 183 V322 M${x + w + 4} 183 V322" stroke="#1b1b1b" stroke-width="4"/>`;
        h += `<path d="M${x + 10} 150 q6 10 0 18 q-6 -8 0 -18 M${x + w - 12} 150 q6 10 0 18 q-6 -8 0 -18" fill="#4a8a3a"/>`;
        return h; };
      s += hus(0, 250, "#d88a6a") + hus(270, 260, "#e8c86a") + hus(552, 250, "#7aa0a8");
      s += `<rect width="800" height="330" fill="#2a1a4a" opacity=".26"/>`;
      s += `<rect y="320" width="800" height="22" fill="#8a8078"/><rect y="340" width="800" height="110" fill="#5a524c"/>`; srand(225); for (let i = 0; i < 70; i++) s += `<ellipse cx="${(rnd() * 800).toFixed(0)}" cy="${(348 + rnd() * 100).toFixed(0)}" rx="${(10 + rnd() * 8).toFixed(0)}" ry="${(3 + rnd() * 3).toFixed(0)}" fill="#4c4540"/>`;
      for (const x of [140, 680]) s += lampe(x, 220, 60) + `<path d="M${x} 222 V336" stroke="#1b1b1b" stroke-width="5"/><path d="M${x - 10} 222 L${x - 13} 200 L${x} 192 L${x + 13} 200 L${x + 10} 222 Z" fill="#ffe08a" stroke="#1b1b1b" stroke-width="2.5"/><rect x="${x - 8}" y="334" width="16" height="6" fill="#1b1b1b"/>`;
      return s;
    },
    klubb() {
      let s = `<rect width="800" height="450" fill="#3a1a24"/>`;
      for (let x = 50; x < 800; x += 140) { if (x > 200 && x < 600) continue; s += `<g transform="translate(${x} 180)" stroke="#c9a227" stroke-width="2.4" fill="none" opacity=".8"><path d="M-40 0 A40 40 0 0 1 40 0 Z"/>${[-60, -30, 0, 30, 60].map(a => `<path d="M0 0 L${(Math.sin(a * Math.PI / 180) * 40).toFixed(1)} ${(-Math.cos(a * Math.PI / 180) * 40).toFixed(1)}"/>`).join("")}<path d="M-26 0 A26 26 0 0 1 26 0"/></g>`; }
      s += `<rect y="0" width="800" height="28" fill="#1b0e14"/><path d="M0 30 H800" stroke="#c9a227" stroke-width="4"/>`;
      s += `<path d="M210 290 V110 L240 110 L240 90 L270 90 L270 70 L530 70 L530 90 L560 90 L560 110 L590 110 V290 Z" fill="#c9a227"/><path d="M222 290 V122 L252 122 L252 102 L282 102 L282 82 L518 82 L518 102 L548 102 L548 122 L578 122 V290 Z" fill="#7a1e2c"/>`;
      s += [250, 290, 330, 370, 410, 450, 490, 530].map(x => `<path d="M${x} 104 V290" stroke="#641624" stroke-width="5"/>`).join("");
      s += `<path d="M300 30 L250 290 L350 290 Z M500 30 L450 290 L550 290 Z" fill="#fff3c0" opacity=".08"/>`;
      s += `<rect x="200" y="286" width="400" height="10" fill="#8a5a30"/><rect x="200" y="296" width="400" height="22" fill="#4a2a1a"/>`;
      for (const x of [300, 500]) s += `<path d="M${x} 30 V46" stroke="#c9a227" stroke-width="2"/><path d="M${x - 14} 46 L${x + 14} 46 L${x + 6} 60 L${x - 6} 60 Z" fill="#c9a227"/><circle cx="${x}" cy="62" r="5" fill="#ffe680"/>`;
      s += `<rect y="316" width="800" height="134" fill="#2a1612"/>`; for (let r = 0; r < 5; r++) for (let x = (r % 2) * 50 - 50; x < 800; x += 100) s += `<rect x="${x}" y="${316 + r * 27}" width="50" height="27" fill="#4a2a1e"/>`;
      for (const [x, y] of [[70, 300], [160, 312], [640, 312], [730, 300]]) s += `<ellipse cx="${x}" cy="${y}" rx="34" ry="8" fill="#f4efe4"/><path d="M${x - 34} ${y} L${x - 28} ${y + 18} L${x + 28} ${y + 18} L${x + 34} ${y}" fill="#e8e0d0"/><rect x="${x - 3}" y="${y - 22}" width="6" height="18" fill="#c9a227"/><path d="M${x - 10} ${y - 22} L${x + 10} ${y - 22} L${x + 6} ${y - 32} L${x - 6} ${y - 32} Z" fill="#e8a040"/>` + lampe(x, y - 26, 22);
      return s;
    },
    radiostudio() {
      let s = `<defs><pattern id="prPerf" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#e8e2d0"/><circle cx="6" cy="6" r="1.4" fill="#bdb6a0"/></pattern></defs>`;
      s += `<rect width="800" height="450" fill="url(#prPerf)"/>`; for (let x = 0; x < 800; x += 96) s += `<path d="M${x} 0 V320" stroke="#cfc8b2" stroke-width="3"/>`; for (let y = 0; y < 320; y += 96) s += `<path d="M0 ${y} H800" stroke="#cfc8b2" stroke-width="3"/>`;
      s += `<rect x="420" y="80" width="330" height="160" rx="4" fill="#5a6a7a" stroke="#8a8a8a" stroke-width="10"/><rect x="430" y="90" width="310" height="140" fill="#2a3a4a"/>`;
      s += `<rect x="440" y="186" width="290" height="44" fill="#4a4e56"/>${[470, 520, 570, 620, 670, 710].map(x => `<circle cx="${x}" cy="200" r="5" fill="#c8ccd2"/>`).join("")}<rect x="600" y="150" width="40" height="30" rx="2" fill="#f4e8b0"/><path d="M606 176 L624 160" stroke="#c0392b" stroke-width="1.6"/>`;
      s += `<circle cx="520" cy="146" r="16" fill="#1b2430"/><path d="M500 186 Q500 164 520 164 Q540 164 540 186 Z" fill="#1b2430"/><path d="M450 96 L490 226 M470 96 L510 226" stroke="#fff" stroke-width="5" opacity=".08"/>`;
      s += lampe(355, 70, 54) + `<rect x="300" y="52" width="110" height="36" rx="5" fill="#3a3a3a"/><rect x="305" y="57" width="100" height="26" rx="3" fill="#e53935"/><text x="355" y="77" font-size="18" font-weight="700" text-anchor="middle" fill="#fff" font-family="${FONT}">ON AIR</text>`;
      s += `<g transform="translate(150 110)"><circle r="30" fill="#fbfaf5" stroke="#3a3a3a" stroke-width="5"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${(Math.sin(i * Math.PI / 6) * 24).toFixed(1)} ${(-Math.cos(i * Math.PI / 6) * 24).toFixed(1)} L${(Math.sin(i * Math.PI / 6) * 28).toFixed(1)} ${(-Math.cos(i * Math.PI / 6) * 28).toFixed(1)}" stroke="#3a3a3a" stroke-width="2"/>`).join("")}<path d="M0 0 V-18 M0 0 L12 6" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/><path d="M0 0 L-8 22" stroke="#c0392b" stroke-width="1.5"/></g>`;
      s += `<rect y="300" width="800" height="20" fill="#7a5a3a"/>` + gulv(320, "#4a4e5a", "#3e424c", 0);
      for (let y = 350; y < 450; y += 34) s += `<path d="M0 ${y} H800" stroke="#3e424c" stroke-width="2"/>`;
      return s;
    },
    studio() {
      let s = `<defs><pattern id="prPerf2" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f0ead8"/><circle cx="5" cy="5" r="1.2" fill="#c8c0a8"/></pattern></defs>`;
      s += `<rect width="800" height="450" fill="url(#prPerf2)"/>`;
      s += `<path d="M0 0 H800 V36 L0 36 Z" fill="#d8d0b8"/>${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 40} 0 L${i * 40 + 20} 36 L${i * 40 + 40} 0" stroke="#c0b89e" stroke-width="2" fill="none"/>`).join("")}`;
      for (let x = 0; x < 800; x += 80) s += `<path d="M${x} 36 V250" stroke="#d8d0b8" stroke-width="2"/>`;
      s += `<rect y="250" width="800" height="72" fill="#8a6040"/>`; for (let x = 0; x < 800; x += 40) s += `<path d="M${x} 250 V322" stroke="#7a5236" stroke-width="2"/>`; s += `<rect y="246" width="800" height="6" fill="#6a4428"/>`;
      s += `<rect x="520" y="96" width="230" height="124" rx="3" fill="#6a4428"/><rect x="530" y="106" width="210" height="104" fill="#2a3440"/><rect x="540" y="170" width="190" height="40" fill="#4a4e56"/>${[560, 590, 620, 650, 680, 710].map(x => `<circle cx="${x}" cy="186" r="4.5" fill="#c8ccd2"/>`).join("")}`;
      s += `<rect x="560" y="122" width="48" height="36" rx="3" fill="#3a3e46"/><circle cx="574" cy="140" r="9" fill="#5a5e66" stroke="#2a2a2a"/><circle cx="596" cy="140" r="9" fill="#5a5e66" stroke="#2a2a2a"/><path d="M540 112 L570 206" stroke="#fff" stroke-width="5" opacity=".08"/>`;
      s += `<rect x="585" y="62" width="100" height="26" rx="4" fill="#3a3a3a"/><rect x="590" y="66" width="90" height="18" rx="2" fill="#7a2a24"/><text x="635" y="80" font-size="12" font-weight="700" text-anchor="middle" fill="#f4c0b8" font-family="${FONT}">RECORDING</text>`;
      s += `<rect x="60" y="80" width="120" height="80" fill="#fbf8ee" stroke="#8a6040" stroke-width="5"/><text x="120" y="112" font-size="14" font-weight="700" text-anchor="middle" fill="#3a2a1a" font-family="${FONT}">MEMPHIS</text><text x="120" y="134" font-size="12" text-anchor="middle" fill="#7a5a3a" font-family="${FONT}">1953</text>${note(150, 150, .5, "#c0392b")}`;
      s += gulv(320, "#b08454", "#9a7044");
      s += `<ellipse cx="380" cy="400" rx="220" ry="34" fill="#8a3a2a" opacity=".55"/>`;
      return s;
    },
    tvstudio() {
      let s = `<rect width="800" height="450" fill="#22222c"/>`;
      s += `<path d="M0 26 H800" stroke="#4a4a56" stroke-width="6"/>`;
      for (const x of [170, 330, 470, 630]) s += `<path d="M${x - 20} 50 L${x - 120} 300 L${x + 120} 300 L${x + 20} 50 Z" fill="#fff8d0" opacity=".07"/><rect x="${x - 4}" y="26" width="8" height="12" fill="#5a5a66"/><path d="M${x - 16} 38 L${x + 16} 38 L${x + 20} 58 L${x - 20} 58 Z" fill="#6a6a76"/><ellipse cx="${x}" cy="58" rx="20" ry="5" fill="#fff8d0"/>`;
      s += `<rect x="110" y="80" width="580" height="220" fill="#2a3f8a"/>${Array.from({ length: 15 }, (_, i) => `<path d="M${130 + i * 38} 80 V300" stroke="#1f2f6a" stroke-width="10"/>`).join("")}`;
      s += `<path d="M104 72 H696 V100 Q400 112 104 100 Z" fill="#c9a227"/><path d="M104 100 Q400 112 696 100" stroke="#8a6a10" stroke-width="2" fill="none"/>`;
      s += `<ellipse cx="400" cy="300" rx="190" ry="24" fill="#fff8d0" opacity=".1"/>`;
      s += `<rect x="90" y="296" width="620" height="10" fill="#8a8a96"/><rect x="90" y="306" width="620" height="26" fill="#3a3a46"/>`;
      s += `<rect y="330" width="800" height="120" fill="#5a5a62"/>`; for (let y = 350; y < 450; y += 30) s += `<path d="M0 ${y} H800" stroke="#4e4e56" stroke-width="2"/>`;
      s += `<path d="M20 450 Q80 380 160 420 T300 400 M800 420 Q720 360 640 410 T520 440" stroke="#1b1b1b" stroke-width="4" fill="none"/>`;
      s += `<rect x="30" y="100" width="64" height="200" fill="#3a3a46"/><rect x="706" y="100" width="64" height="200" fill="#3a3a46"/>`;
      s += `<rect x="20" y="40" width="80" height="26" rx="4" fill="#3a1a1a"/><text x="60" y="58" font-size="11" font-weight="700" text-anchor="middle" fill="#ff6a5a" font-family="${FONT}">APPLAUSE</text>`;
      return s;
    },
  };
  Object.assign(K.BG, BG);

  /* ---------- portretter (hodeutsnitt) ---------- */
  const pv = (s, ekstra) => { s = s || 1; ekstra = ekstra || 0; const w = 76 * s + ekstra; return `${(-w / 2).toFixed(1)} ${(-210 * s - ekstra).toFixed(1)} ${w.toFixed(1)} ${w.toFixed(1)}`; };
  const PVB = {
    platon: "-44 -100 88 88", glatt: pv(1.1, 6), kaptein: pv(1, 8), matros: pv(1, 4), forsanger: pv(1, 12), arbeider: pv(1, 4), arbeiderske: pv(1, 10),
    predikant: pv(1), korleder: pv(1, 10), bluesmann: pv(1, 8), bessie: "-52 -238 104 104", mamie: pv(1, 2), plateprodusent: pv(1, 8),
    oliver: pv(1.08, 12), louis: pv(1), klarinettist: pv(1), trombonist: pv(1), radiodj: pv(1, 6), fats: pv(1.05, 4), boone: pv(1), phillips: pv(1),
    elvis: pv(1, 12), tenaaring: pv(.88, 6), kameramann: pv(1, 6),
  };
  const gammelPortrett = K.portrett;
  K.portrett = function (navn, o) {
    if (PVB[navn] && K.FIG[navn]) return `<svg viewBox="${PVB[navn]}" xmlns="http://www.w3.org/2000/svg">${K.FIG[navn](o || {})}</svg>`;
    return gammelPortrett(navn, o);
  };
  K.PVB_PLATE = PVB;
})();
