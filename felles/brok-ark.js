/* ==========================================================
   BRØK-ARK – felles kode for brok-jukseark.html (jukseark + øveark) og brok-prover.html (to prøver).
   Alle fasitsvar regnes ut her fra oppgavedataene, så fasiten alltid stemmer med oppgaven.
   Oppgaver er data:
     { type:'forkort', n, d }                       forkort så enkelt som mulig
     { type:'utvid', n, d, k }                      utvid n/d med k
     { type:'op', a, o, b }                         a og b: tall (3), brøk [n,d] eller blandet tall [w,n,d]; o: + − · :
     { type:'blandet', n, d } / { type:'uekte', w, n, d }
     { type:'storst', a:[n,d], b:[n,d] }
     { type:'av', a:[n,d], tall, enhet }
     { type:'figur', n, d, form:'pai'|'bar' }
     { type:'tabell', rader:[{n,d,gitt:'b'|'d'|'p'}] }
     { type:'tekst', q, losn:()=>html, svar:'html' }  (tekstoppgaver med egen utregning)
   ========================================================== */
(function () {
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const lcm = (a, b) => a / gcd(a, b) * b;
  const F = (n, d) => { const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
  const komma = x => String(Math.round(x * 1e6) / 1e6).replace('.', ',');

  // ---------- visning ----------
  const fr = (n, d) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  const mx = (w, n, d) => `<span class="mx">${w}${fr(n, d)}</span>`;
  const OP = { '+': '+', '-': '−', '−': '−', '*': '·', '·': '·', ':': ':' };
  /* tall, [n,d] eller [w,n,d] → html */
  function vis(x) {
    if (typeof x === 'number') return `${x}`;
    if (x.length === 3) return mx(x[0], x[1], x[2]);
    return fr(x[0], x[1]);
  }
  /* tall, [n,d] eller [w,n,d] → {n,d} (ikke forkortet) */
  function tilF(x) {
    if (typeof x === 'number') return { n: x, d: 1 };
    if (x.length === 3) return { n: x[0] * x[2] + x[1], d: x[2] };
    return { n: x[0], d: x[1] };
  }
  /* ferdig svar: forkortet, og som blandet tall hvis det er mer enn 1 hel */
  function svar(n, d) {
    const f = F(n, d);
    if (f.d === 1) return `${f.n}`;
    if (f.n > f.d) return mx(Math.floor(f.n / f.d), f.n % f.d, f.d);
    return fr(f.n, f.d);
  }
  /* rå brøk n/d → «n/d = forkortet = blandet tall», siste ledd i fet skrift */
  function ferdig(n, d) {
    const deler = [];
    if (d !== 1) deler.push(fr(n, d));
    const f = F(n, d);
    if (f.d === 1) deler.push(`${f.n}`);
    else {
      if (f.n !== n) deler.push(fr(f.n, f.d));
      if (f.n > f.d) deler.push(mx(Math.floor(f.n / f.d), f.n % f.d, f.d));
    }
    deler[deler.length - 1] = `<b>${deler[deler.length - 1]}</b>`;
    return deler.join(' = ');
  }

  // ---------- figurer ----------
  function pai(n, d, s = 76) {
    const c = s / 2, r = c - 3; let p = '';
    for (let i = 0; i < d; i++) {
      const a0 = 2 * Math.PI * i / d - Math.PI / 2, a1 = 2 * Math.PI * (i + 1) / d - Math.PI / 2;
      const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0), x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
      p += `<path d="M${c},${c} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" class="${i < n ? 'fyll' : 'tom'}"/>`;
    }
    return `<svg class="fig" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" role="img" aria-label="Sirkel delt i ${d} like deler">${p}</svg>`;
  }
  function bar(n, d, o = {}) {
    const W = o.w || 180, H = o.h || 30, sw = (W - 4) / d; let p = '';
    for (let i = 0; i < d; i++) p += `<rect x="${(2 + i * sw).toFixed(2)}" y="2" width="${sw.toFixed(2)}" height="${H - 4}" class="${i < n ? (o.fyll || 'fyll') : 'tom'}"/>`;
    return `<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stripe delt i ${d} like deler">${p}</svg>`;
  }

  // ---------- løsning av regneoppgaver ----------
  function losOp(it) {
    const A = tilF(it.a), B = tilF(it.b), o = OP[it.o], steg = [];
    // blandet tall gjøres om til uekte brøk først
    const blandet = [it.a, it.b].some(x => Array.isArray(x) && x.length === 3);
    if (blandet) steg.push(`${it.a.length === 3 ? fr(A.n, A.d) : vis(it.a)} ${o} ${it.b.length === 3 ? fr(B.n, B.d) : vis(it.b)}`);
    if (o === '+' || o === '−') {
      const L = lcm(A.d, B.d), an = A.n * L / A.d, bn = B.n * L / B.d, r = o === '+' ? an + bn : an - bn;
      if (A.d !== B.d) steg.push(`${fr(an, L)} ${o} ${fr(bn, L)}`);
      steg.push(ferdig(r, L));
      return { losn: steg.join(' = '), n: r, d: L, merk: A.d !== B.d ? `Fellesnevner ${L}.` : '' };
    }
    let X = A, Y = B, merk = '';
    if (o === ':') {
      Y = { n: B.d, d: B.n };
      steg.push(`${A.d === 1 ? fr(A.n, 1) : fr(A.n, A.d)} · ${fr(Y.n, Y.d)}`);
    }
    const kryss = gcd(X.n, Y.d) > 1 || gcd(Y.n, X.d) > 1;
    if (X.d === 1) steg.push(fr(`${X.n} · ${Y.n}`, Y.d));
    else if (Y.d === 1) steg.push(fr(`${X.n} · ${Y.n}`, X.d));
    else steg.push(fr(`${X.n} · ${Y.n}`, `${X.d} · ${Y.d}`));
    steg.push(ferdig(X.n * Y.n, X.d * Y.d));
    if (kryss && X.d * Y.d > 12 && X.d !== 1 && Y.d !== 1) merk = (merk ? merk + ' ' : '') + 'Smartere: forkort på kryss før du ganger.';
    return { losn: steg.join(' = '), n: X.n * Y.n, d: X.d * Y.d, merk };
  }

  /* spørsmålet som html */
  function sporsmal(it) {
    switch (it.type) {
      case 'forkort': return `${fr(it.n, it.d)} =`;
      case 'utvid': return `Utvid ${fr(it.n, it.d)} med ${it.k}`;
      case 'op': return `${vis(it.a)} ${OP[it.o]} ${vis(it.b)} =`;
      case 'blandet': return `Skriv ${fr(it.n, it.d)} som blandet tall`;
      case 'uekte': return `Skriv ${mx(it.w, it.n, it.d)} som uekte brøk`;
      case 'storst': return `${fr(it.a[0], it.a[1])} eller ${fr(it.b[0], it.b[1])}`;
      case 'av': return `${fr(it.a[0], it.a[1])} av ${it.tall}${it.enhet ? ' ' + it.enhet : ''}`;
      case 'figur': return it.form === 'bar' ? bar(it.n, it.d, { w: 170, h: 34 }) : pai(it.n, it.d);
      case 'tabell': return `<table class="tab"><tr><th>Brøk</th><th>Desimaltall</th><th>Prosent</th></tr>${it.rader.map(r =>
        `<tr><td>${r.gitt === 'b' ? fr(r.n, r.d) : ''}</td><td>${r.gitt === 'd' ? komma(r.n / r.d) : ''}</td><td>${r.gitt === 'p' ? komma(100 * r.n / r.d) + ' %' : ''}</td></tr>`).join('')}</table>`;
      case 'tekst': return it.q;
    }
    return '';
  }

  /* { kort: kort svar, losn: utregning (html) } */
  function fasit(it) {
    switch (it.type) {
      case 'forkort': {
        const g = gcd(it.n, it.d), f = F(it.n, it.d);
        return { kort: svar(f.n, f.d), losn: `${fr(`${it.n} : ${g}`, `${it.d} : ${g}`)} = <b>${svar(f.n, f.d)}</b>`, merk: g >= 6 ? `Største tall som går opp i både ${it.n} og ${it.d}, er ${g}. Du kan også forkorte i flere steg.` : '' };
      }
      case 'utvid': return { kort: fr(it.n * it.k, it.d * it.k), losn: `${fr(`${it.n} · ${it.k}`, `${it.d} · ${it.k}`)} = <b>${fr(it.n * it.k, it.d * it.k)}</b>` };
      case 'op': { const r = losOp(it); return { kort: svar(r.n, r.d), losn: r.losn, merk: r.merk }; }
      case 'blandet': {
        const w = Math.floor(it.n / it.d), r = it.n % it.d;
        return { kort: svar(it.n, it.d), losn: `${it.n} : ${it.d} = ${w} med rest ${r}, så ${fr(it.n, it.d)} = <b>${svar(it.n, it.d)}</b>` };
      }
      case 'uekte': {
        const n = it.w * it.d + it.n;
        return { kort: fr(n, it.d), losn: `${fr(`${it.w} · ${it.d} + ${it.n}`, it.d)} = <b>${fr(n, it.d)}</b>` };
      }
      case 'storst': {
        const [a, b] = [it.a, it.b], L = lcm(a[1], b[1]), an = a[0] * L / a[1], bn = b[0] * L / b[1], st = an > bn ? a : b;
        return { kort: fr(st[0], st[1]), losn: `Fellesnevner ${L}: ${fr(a[0], a[1])} = ${fr(an, L)} og ${fr(b[0], b[1])} = ${fr(bn, L)}. <b>${fr(st[0], st[1])}</b> er størst.` };
      }
      case 'av': {
        const del = it.tall / it.a[1], r = del * it.a[0], e = it.enhet ? ' ' + it.enhet : '';
        return { kort: `${komma(r)}${e}`, losn: `${it.tall} : ${it.a[1]} = ${komma(del)}, og ${it.a[0]} · ${komma(del)} = <b>${komma(r)}${e}</b>` };
      }
      case 'figur': return { kort: fr(it.n, it.d), losn: `<b>${fr(it.n, it.d)}</b> (${it.n} av ${it.d} like store deler)` };
      case 'tabell': return {
        kort: '', losn: `<table class="tab"><tr><th>Brøk</th><th>Desimaltall</th><th>Prosent</th></tr>${it.rader.map(r =>
          `<tr><td>${r.gitt === 'b' ? fr(r.n, r.d) : `<b>${fr(r.n, r.d)}</b>`}</td><td>${r.gitt === 'd' ? komma(r.n / r.d) : `<b>${komma(r.n / r.d)}</b>`}</td><td>${r.gitt === 'p' ? komma(100 * r.n / r.d) + ' %' : `<b>${komma(100 * r.n / r.d)} %</b>`}</td></tr>`).join('')}</table>`
      };
      case 'tekst': return { kort: it.svar, losn: it.losn() };
    }
    return { kort: '', losn: '' };
  }

  // ---------- tilfeldige oppgaver til øvearket ----------
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function lagOvelser(seed) {
    const r = rng(seed), R = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = a => a[Math.floor(r() * a.length)];
    const ekte = (dMin, dMax) => { let n, d; do { d = R(dMin, dMax); n = R(1, d - 1); } while (gcd(n, d) !== 1); return [n, d]; };
    const unik = (lag, antall) => { const ut = [], sett = new Set(); let v = 0; while (ut.length < antall && v++ < 500) { const it = lag(ut.length); const k = JSON.stringify(it); if (!sett.has(k)) { sett.add(k); ut.push(it); } } return ut; };

    const forkort = unik(i => {
      const niv = Math.floor(i / 3), [n, d] = ekte(niv === 0 ? 3 : 4, niv === 2 ? 12 : 9);
      const k = pick([[2, 3, 5], [4, 6, 8, 9, 10], [12, 14, 15, 16, 18, 24]][niv]);
      return { type: 'forkort', n: n * k, d: d * k, niv: niv + 1 };
    }, 9);

    const gange = unik(i => {
      const niv = Math.floor(i / 3);
      if (niv === 0) {
        if (i % 3 === 0) return { type: 'op', a: R(2, 6), o: '·', b: ekte(3, 12), niv: 1 };
        return { type: 'op', a: ekte(2, 6), o: '·', b: ekte(2, 6), niv: 1 };
      }
      if (niv === 1) { // bygd for kryssforkorting
        let A, B, v = 0;
        do {
          const p1 = R(1, 4), q1 = R(2, 5), p2 = R(1, 4), q2 = R(2, 5), g1 = R(2, 4), g2 = R(2, 5);
          A = [p1 * g1, q1 * g2]; B = [p2 * g2, q2 * g1];
        } while ((gcd(A[0], A[1]) !== 1 || gcd(B[0], B[1]) !== 1 || A[0] >= A[1] || B[0] >= B[1]) && v++ < 200);
        return { type: 'op', a: A, o: '·', b: B, niv: 2 };
      }
      const [n, d] = ekte(2, 5);
      return { type: 'op', a: [R(1, 3), n, d], o: '·', b: ekte(2, 6), niv: 3 };
    }, 9);

    const dele = unik(i => {
      const niv = Math.floor(i / 3);
      if (niv === 0) { const d = pick([2, 3, 4, 5, 6, 8, 10]), k = R(2, 7), L = F(k, d); return { type: 'op', a: L.d === 1 ? L.n : (L.n > L.d ? [Math.floor(L.n / L.d), L.n % L.d, L.d] : [L.n, L.d]), o: ':', b: [1, d], niv: 1 }; }
      if (niv === 1) {
        const v = i % 3;
        if (v === 0) return { type: 'op', a: ekte(2, 9), o: ':', b: ekte(2, 9), niv: 2 };
        if (v === 1) return { type: 'op', a: ekte(2, 9), o: ':', b: R(2, 5), niv: 2 };
        return { type: 'op', a: R(2, 6), o: ':', b: ekte(2, 7), niv: 2 };
      }
      const [n, d] = ekte(2, 6);
      return { type: 'op', a: [R(1, 4), n, d], o: ':', b: ekte(2, 8), niv: 3 };
    }, 9);

    const MAL = [
      () => { const d = pick([4, 6, 8, 10]), k = R(5, 15), L = F(k, d), Lv = L.d === 1 ? L.n : L.n > L.d ? [Math.floor(L.n / L.d), L.n % L.d, L.d] : [L.n, L.d];
        const it = { a: Lv, o: ':', b: [1, d] };
        return { type: 'tekst', q: `En snor er ${vis(Lv)} m lang. Du klipper den i biter som er ${fr(1, d)} m. Hvor mange biter blir det?`, losn: () => `${vis(Lv)} : ${fr(1, d)} = ${losOp(it).losn}`, svar: `${k} biter` }; },
      () => { const [n, d] = ekte(2, 5), p = R(2, 5), it = { a: [n, d], o: ':', b: p }, r = losOp(it);
        return { type: 'tekst', q: `En mugge har ${fr(n, d)} liter saft. ${p} venner deler saften likt. Hvor mye får hver?`, losn: () => `${fr(n, d)} : ${p} = ${r.losn} liter`, svar: `${svar(r.n, r.d)} liter` }; },
      () => { const [n, d] = ekte(3, 10), p = R(2, 6), it = { a: p, o: '·', b: [n, d] }, r = losOp(it);
        return { type: 'tekst', q: `Du går ${fr(n, d)} km til skolen. Hvor langt går du på ${p} skoledager (bare til skolen)?`, losn: () => `${p} · ${fr(n, d)} = ${r.losn} km`, svar: `${svar(r.n, r.d)} km` }; },
      () => { const a = pick([[1, 2], [3, 4], [2, 3], [1, 3]]), b = pick([[1, 2], [1, 3], [1, 4], [2, 3]]), it = { a: b, o: '·', b: a }, r = losOp(it);
        return { type: 'tekst', q: `Det er ${fr(a[0], a[1])} pizza igjen. Du spiser ${fr(b[0], b[1])} av det som er igjen. Hvor stor del av en hel pizza spiser du?`, losn: () => `«av» betyr gange: ${fr(b[0], b[1])} · ${fr(a[0], a[1])} = ${r.losn}`, svar: `${svar(r.n, r.d)} pizza` }; },
      () => { const c = pick([[3, 4], [2, 3], [1, 2], [2, 5]]), k = R(3, 7), tot = F(k * c[0], c[1]), tv = tot.d === 1 ? tot.n : [Math.floor(tot.n / tot.d), tot.n % tot.d, tot.d], it = { a: tv, o: ':', b: c };
        return { type: 'tekst', q: `Ett brett boller trenger ${fr(c[0], c[1])} kg mel. Du har ${vis(tv)} kg mel. Hvor mange brett kan du bake?`, losn: () => `${vis(tv)} : ${fr(c[0], c[1])} = ${losOp(it).losn}`, svar: `${k} brett` }; }
    ];
    const rekke = MAL.map((_, i) => i).sort(() => r() - 0.5).slice(0, 4);
    const tekst = rekke.map(i => MAL[i]());
    return { forkort, gange, dele, tekst };
  }

  window.BrokArk = { gcd, lcm, F, fr, mx, vis, svar, ferdig, komma, pai, bar, sporsmal, fasit, losOp, lagOvelser, tilF };
})();
