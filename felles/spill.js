/* ==========================================================
   SPILLISTE – legg nye spill til her (brukes av forsiden og avatarsiden).
   fag:   overskriften spillet havner under (nye fag lages automatisk)
   fil:   filnavnet i rotmappen
   lagt:  publiseringsdato (ÅÅÅÅ-MM-DD) – gir «Ny»-merke i 14 dager
   gull:  false hvis spillet ikke gir gull (f.eks. jukseark)
   ========================================================== */
window.SPILL = [
  { fag: "Musikk", ikon: "🎷", tittel: "Blå toner",     fil: "blaa-tonar.html",         lagt: "2026-11-05",
    beskrivelse: "Musikkhistorie: spirituals, blues, jazz og rock (bokmål)" },
  { fag: "Musikk", ikon: "🎺", tittel: "Blå tonar",     fil: "blaa-tonar-nynorsk.html", lagt: "2026-11-05",
    beskrivelse: "Same prøve på nynorsk" },
  { fag: "Matte",  ikon: "🍕", tittel: "Brøkmester",    fil: "brokmester.html",         lagt: "2026-11-05",
    beskrivelse: "Øv på brøk" },
  { fag: "Matte",  ikon: "🐸", tittel: "Gangestien",    fil: "gangestien.html",         lagt: "2026-11-07",
    beskrivelse: "Den lille og den store gangetabellen – i ditt eget tempo" },
  { fag: "Norsk",  ikon: "🏰", tittel: "Eventyrprøven", fil: "eventyrproven.html",      lagt: "2026-11-05",
    beskrivelse: "Sjangeren eventyr" },
  { fag: "Norsk",  ikon: "📜", tittel: "Eventyr-juksearket", fil: "eventyr-jukseark.html", lagt: "2026-11-08", gull: false,
    beskrivelse: "Det viktigste på ett ark – les det rett før prøven, eller skriv det ut" },
  { fag: "Spansk", ikon: "💃", tittel: "Spanske gloser", fil: "spansk-gloser.html", lagt: "2026-11-09",
    beskrivelse: "Gloseprøvene – nå: familien (11.11). Koble, velg, skriv, setninger og bøying" },
  { fag: "Engelsk", ikon: "🌍", tittel: "Engelske gloser", fil: "engelsk-gloser.html", lagt: "2026-11-10",
    beskrivelse: "Gloseprøvene – nå: et flerkulturelt samfunn. Koble, velg, skriv, lytt, setninger og ordformer" },
];
