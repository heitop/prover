/* ==========================================================
   SPILLISTE – legg nye spill til her (brukes av forsiden og avatarsiden).
   fag:   overskriften spillet havner under (nye fag lages automatisk)
   fil:   filnavnet i rotmappen
   lagt:  publiseringsdato (ÅÅÅÅ-MM-DD) – gir «Ny»-merke i 14 dager
   gull:  false hvis spillet ikke gir gull (f.eks. jukseark)
   trinn: hvilke trinn spillet passer for, f.eks. [4] eller [4, 8]. Uten trinn vises spillet for alle.
   prover: kommende prøver, f.eks. [{ dato: "2026-11-19", navn: "Gloseprøve: skolen" }].
           Gir nedtelling på forsiden, dagens oppdrag og dobbelt gull de tre siste dagene før prøven.
           Barna kan også legge inn prøver selv på forsiden (lagres bare på enheten).
           Spill for flere trinn: gi prøven egen trinn, f.eks. { dato, navn, trinn: [4] }.
   ========================================================== */
window.SPILL = [
  { fag: "Musikk", ikon: "🎷", tittel: "Blå toner",     fil: "blaa-tonar.html", trinn: [8],         lagt: "2026-11-05",
    prover: [{ dato: "2026-11-20", navn: "Musikkprøve: afroamerikansk musikkhistorie" }],
    beskrivelse: "Musikkhistorie: spirituals, blues, jazz og rock (bokmål)" },
  { fag: "Musikk", ikon: "🎺", tittel: "Blå tonar",     fil: "blaa-tonar-nynorsk.html", trinn: [8], lagt: "2026-11-05",
    beskrivelse: "Same prøve på nynorsk" },
  { fag: "Musikk", ikon: "💿", tittel: "Platereisen",   fil: "platereisen.html", trinn: [8],       lagt: "2026-11-15",
    prover: [{ dato: "2026-11-20", navn: "Musikkprøve: afroamerikansk musikkhistorie" }],
    beskrivelse: "Pek-og-klikk-eventyr gjennom musikkhistorien: arbeidssang, spirituals, blues, jazz, R&B og rock and roll. Lytt, løs gåter og samle platekort – humormodus låses opp" },
  { fag: "Musikk", ikon: "📜", tittel: "Musikk-juksearket", fil: "musikk-jukseark.html", trinn: [8], lagt: "2026-11-19", gull: false,
    beskrivelse: "Alle seks sjangrene, slaveriet, tidslinjen og begrepene – les det rett før prøven, eller skriv det ut" },
  { fag: "Matte",  ikon: "🍕", tittel: "Brøkmester",    fil: "brokmester.html", trinn: [8],         lagt: "2026-11-05",
    prover: [{ dato: "2026-11-27", navn: "Matteprøve: brøk" }],
    beskrivelse: "Øv på brøk" },
  { fag: "Matte",  ikon: "🐸", tittel: "Gangestien",    fil: "gangestien.html", trinn: [4],         lagt: "2026-11-07",
    beskrivelse: "Den lille og den store gangetabellen – i ditt eget tempo" },
  { fag: "Matte",  ikon: "🧮", tittel: "Regneverkstedet", fil: "regneverkstedet.html", trinn: [4], lagt: "2026-11-12",
    beskrivelse: "Pluss og minus med 2- og 3-sifrede tall: oppstilling med mente og lån, hoderegning, finn feilen og tekstoppgaver" },
  { fag: "Matte",  ikon: "🍪", tittel: "Delefabrikken", fil: "delefabrikken.html", trinn: [4], lagt: "2026-11-12",
    beskrivelse: "Deling opp til 200: små tall med gangetabellen baklengs, store tall som deles opp. Hoderegning, hva mangler, del opp og tekstoppgaver" },
  { fag: "Norsk",  ikon: "🏰", tittel: "Eventyrprøven", fil: "eventyrproven.html", trinn: [8],      lagt: "2026-11-05",
    beskrivelse: "Sjangeren eventyr" },
  { fag: "Norsk",  ikon: "📜", tittel: "Eventyr-juksearket", fil: "eventyr-jukseark.html", trinn: [8], lagt: "2026-11-08", gull: false,
    beskrivelse: "Det viktigste på ett ark – les det rett før prøven, eller skriv det ut" },
  { fag: "Norsk",  ikon: "✌️", tittel: "Dobbeltrøbbel", fil: "dobbel-konsonant.html", trinn: [4], lagt: "2026-11-12",
    beskrivelse: "Dobbel konsonant: katt eller kat, tak eller takk? Regler, velg riktig, feiljakt, skriv ordet og lynrunde" },
  { fag: "Spansk", ikon: "💃", tittel: "Spanske gloser", fil: "spansk-gloser.html", trinn: [8], lagt: "2026-11-09",
    prover: [{ dato: "2026-11-18", navn: "Spanskprøve: pronomen, verb og familien" }],
    beskrivelse: "Gloseprøvene – nå: familien og «Mi madre se llama …» (18.11). Koble, velg, skriv, setninger og bøying" },
  { fag: "Spansk", ikon: "🗣️", tittel: "Spanske verb", fil: "spansk-ar-verb.html", trinn: [8], lagt: "2026-11-11",
    prover: [{ dato: "2026-11-18", navn: "Spanskprøve: pronomen, verb og familien" }],
    beskrivelse: "Personlige pronomen og regelrette -ar-, -er- og -ir-verb: regelen, bøying, finn personen, oversetting, øvearkene (-ar, -er, -ir) og prøveprøve" },
  { fag: "Spansk", ikon: "📜", tittel: "Spansk-juksearket", fil: "spansk-jukseark.html", trinn: [8], lagt: "2026-11-16", gull: false,
    beskrivelse: "Det viktigste til spanskprøven på ett ark: pronomen, endingene for -ar, -er og -ir, verbene og familien" },
  { fag: "Samfunnsfag", ikon: "⚖️", tittel: "Kampen for rettigheter", fil: "revolusjon.html", trinn: [8], lagt: "2026-11-12",
    beskrivelse: "Opplysningstiden, den franske revolusjonen og Napoleon: omgrep, standssamfunnet, filosofene, tidslinja og prøveprøve" },
  { fag: "Samfunnsfag", ikon: "🦉", tittel: "Tidsreisen", fil: "tidsreisen.html", trinn: [8], lagt: "2026-11-12",
    beskrivelse: "Pek-og-klikk-eventyr: reis til 1789 og redd idékortene. Humormodus låses opp for hvert kapittel" },
  { fag: "KRLE", ikon: "📖", tittel: "Fortellingsreisen", fil: "fortellingsreisen.html", trinn: [4], lagt: "2026-11-12",
    beskrivelse: "Pek-og-klikk-eventyr gjennom de store fortellingene: Moses, Jesus, profeten Muhammad, Rama og Sita og Buddha. Samle symbolkort – humormodus låses opp" },
  { fag: "Engelsk", ikon: "🌍", tittel: "Engelske gloser", fil: "engelsk-gloser.html", trinn: [4, 8], lagt: "2026-11-23",
    prover: [{ dato: "2026-11-27", navn: "Engelsk gloseprøve", trinn: [4] }],
    beskrivelse: "Gloseprøvene – 4. trinn: pro, wheelchair, through, above … (27.11). 8. trinn: et flerkulturelt samfunn. Koble, velg, skriv, lytt og setninger" },
];
