/* ==========================================================================
   TIDSREISEN – historien. Her ligger alle kapitler, scener, replikker og gåter.

   REPLIKK:   ["figur", "vanlig tekst", "humortekst"]   (humortekst kan sløyfes)
              figur = en nøkkel i FIGURER («deg» er spilleren, «forteller» er fortelleren)
   HANDLINGER (objekter i en liste):
     { valg: [ { t: "svar", h: "humorsvar", gjor: [ ... ] }, ... ] }
     { gi: "ting" }  { ta: "ting" }  { kort: "idékort" }  { omgrep: "Omgrep fra revolusjon-data.js" }
     { sett: "flagg" }  { fjern: "flagg" }  { gull: 2 }  { gaa: "scene" }  { gaate: "gåte-id" }
     { hvis: "betingelse", da: [ ... ], ellers: [ ... ] }  { stopp: true }  { ferdig: true }
   BETINGELSER: "flagg", "!flagg", "har:ting", "kort:id", "humor" – flere med &
   PUNKT I EN SCENE:
     { id, navn, x, y (bunnen), w, h (klikkflate), fig | ting, o: {tegne-valg}, skala,
       vis: "betingelse", variant: [{ hvis, o }], klikk: [...], bruk: { ting: [...] }, pynt: true }
   GÅTER: velg, flervalg, sorter, rekkefolge, avling – se eksemplene.
   Et kapittel med «kommer: true» vises på kartet som «Kommer snart».
   ========================================================================== */
window.TIDSREISEN = {

FIGURER: {
  deg: { navn: "Du" },
  forteller: { navn: "", fig: "forteller" },
  ugle: { navn: "Minerva", fig: "ugle" },
  jacques: { navn: "Jacques", fig: "bonde" },
  marie: { navn: "Marie", fig: "kone" },
  louison: { navn: "Louison", fig: "barn" },
  skriver: { navn: "Skriveren Duval", fig: "skriver" },
  smed: { navn: "Smeden", fig: "smed" },
  newton: { navn: "Isaac Newton", fig: "newton" },
  madame: { navn: "Madame Lumière", fig: "madame" },
  locke: { navn: "John Locke", fig: "locke" },
  montesquieu: { navn: "Montesquieu", fig: "montesquieu" },
  voltaire: { navn: "Voltaire", fig: "voltaire" },
  rousseau: { navn: "Jean-Jacques Rousseau", fig: "rousseau" },
  kant: { navn: "Immanuel Kant", fig: "kant" },
  sensor: { navn: "Kongens sensor", fig: "sensor" },
  glemsel: { navn: "Grev Glemsel", fig: "glemsel" },
},

/* Ting i sekken. kap = kapitlet tingen hører til (fjernes hvis kapitlet spilles på nytt). */
TING: {
  kikkert:  { navn: "Tidskikkerten", ikon: "🔭", om: "En gammel messingkikkert fra 1687. Den tar deg gjennom tiden." },
  matpakke: { navn: "Matpakke", ikon: "🥪", om: "To brødskiver med brunost.", kap: "prolog" },
  klagebok: { navn: "Klageboka", ikon: "📕", om: "Landsbyens klagebok til kongen – med alt folk vil ha endret." },
  side1: { navn: "Side 1", ikon: "📄", om: "En side fra Newtons manuskript – om lys og farger.", kap: "k2" },
  side2: { navn: "Side 2", ikon: "📄", om: "En side fra Newtons manuskript – om Kopernikus.", kap: "k2" },
  side3: { navn: "Side 3", ikon: "📄", om: "En side fra Newtons manuskript – om tyngdekraften.", kap: "k2" },
  skrift: { navn: "Forbudt skrift", ikon: "📰", om: "Voltaires skrift som gjør narr av kongen og kirken. Må ikke bli funnet!", kap: "k3" },
},

/* Idékortene – samlingen spilleren bygger opp gjennom spillet. */
IDEKORT: {
  naturlov:    { navn: "Naturlov", ikon: "🍎", fra: "Isaac Newton", tekst: "Naturen følger faste lover som gjelder for alle. Kanskje har alle mennesker også de samme naturlige rettighetene?" },
  rettigheter: { navn: "Naturlige rettigheter", ikon: "📜", fra: "John Locke", tekst: "Alle er født med rett til liv, frihet og eiendom. Bryter kongen dem, kan folket ta makten tilbake." },
  makt:        { navn: "Maktfordeling", ikon: "⚖️", fra: "Montesquieu", tekst: "Makten deles i lovgivende, utøvende og dømmende makt – så ingen kan bestemme alt." },
  ytring:      { navn: "Ytringsfrihet", ikon: "✒️", fra: "Voltaire", tekst: "Alle skal få si, skrive og tro det de vil. Sensur er galt." },
  folk:        { navn: "Folkesuverenitet", ikon: "🤝", fra: "Jean-Jacques Rousseau", tekst: "Makten tilhører folket. Lovene skal bygge på det folket vil sammen." },
  tenk:        { navn: "Tenk selv!", ikon: "🕰️", fra: "Immanuel Kant", tekst: "Sapere aude – våg å bruke din egen forstand, i stedet for å la andre tenke for deg." },
},

KAPITLER: [

/* =====================================================================
   PROLOG – BIBLIOTEKET
   ===================================================================== */
{ id: "prolog", nr: 0, tittel: "Biblioteket", sted: "Skolebiblioteket", aar: "I dag", ikon: "📚",
  om: "Plakatene om rettighetene dine blekner. Hva er det som skjer?",
  start: "bibliotek",
  scener: {
    bibliotek: {
      tittel: "Skolebiblioteket", bg: "bibliotek", spillerX: 140,
      hint: "Se på plakatene på veggen, og sjekk den gamle glassmonteren.",
      inngang: [
        ["forteller", "Fredag, siste time. Du skal finne en bok om opplysningstiden til presentasjonen din.",
                      "Fredag, siste time. Læreren sa «finn en bok om opplysningstiden». Du har funnet en bok om dinosaurer. Nesten."],
        ["forteller", "Men det er noe rart med plakatene på veggen …",
                      "Men det er noe rart med plakatene på veggen. Og det er ikke bare at de henger skjevt."],
      ],
      punkter: [
        { id: "vindu", navn: "Vinduet", x: 115, y: 252, w: 160, h: 200,
          klikk: [["forteller", "Ute er det en helt vanlig fredag. Ingen konger, ingen stender – bare en måke som stjeler en pølse.",
                                "Ute stjeler en måke en pølse fra en førsteklassing. Det er det mest urettferdige du har sett i dag. Foreløpig."]] },
        { id: "hylle", navn: "Bokhylla", x: 330, y: 330, w: 180, h: 250,
          klikk: [["forteller", "Bøker om dinosaurer, fotball – og én om opplysningstiden. Den har en ugle på forsiden. Merkelig.",
                                "Bøker om dinosaurer, fotball og «Dinosaurer som spiller fotball». Og én om opplysningstiden – med en ugle på forsiden. Mistenkelig."]] },
        { id: "monter", navn: "Glassmonteren", x: 250, y: 422, w: 110, h: 170, ting: "monter", variant: [{ hvis: "vaken", o: { vaken: true } }],
          klikk: [{ hvis: "!plakat", da: [
              ["forteller", "En gammel mekanisk ugle står i en glassmonter. På lappen står det: «Minerva – visdommens ugle».",
                            "En mekanisk ugle i en glassmonter. Lappen sier «Minerva – visdommens ugle». Den ser ut som den dømmer deg litt."],
            ], ellers: [{ hvis: "!vaken", da: [
              ["forteller", "Uglas øyne lyser opp. Tannhjul begynner å surre, og glasset glir til side!",
                            "Det knaser og surrer. Uglas øyne lyser. Glasset glir til side som en veldig dramatisk heisdør."],
              { sett: "vaken" },
              ["ugle", "Endelig! Noen som ser at plakatene blekner. Jeg heter Minerva.",
                       "ENDELIG! Jeg har stått i den monteren siden 1987. Jeg heter Minerva. Visdommens ugle. Du kan klappe nå."],
              ["ugle", "Hør her: Grev Glemsel har reist bakover i tiden. Han vil stoppe ideene som ga folk rettigheter.",
                       "Krise: Grev Glemsel – verdens mest glemsomme skurk, men han husker akkurat hvordan man ødelegger ting – har reist bakover i tiden."],
              ["ugle", "Lykkes han, får kongene beholde all makten. Da forsvinner ytringsfrihet, stemmerett og likhet for loven. Derfor blekner plakatene.",
                       "Lykkes han, får kongene all makt for alltid. Ingen ytringsfrihet. Ingen stemmerett. Og verst av alt: ingen rett til å klage på skolematen."],
              ["deg", "Vent litt. Hva er egentlig en rettighet?", "Vent litt. Hva er egentlig en rettighet? Er det noe man spiser?"],
              { gaate: "rettighet" },
              { omgrep: "Rettigheter" },
              ["ugle", "Nettopp. Vi må reise tilbake og redde ideene – idékortene – før Glemsel får tak i dem. Ta tidskikkerten der borte!",
                       "Nettopp! Og nei, man spiser dem ikke. Ta tidskikkerten der borte. Den er fra 1687 og har aldri vært på service."],
            ], ellers: [
              ["ugle", "Tidskikkerten står der borte. Skynd deg!", "Kikkerten! Den messingtingen! Tiden er knapp. Det er litt min greie."],
            ] }] }] },
        { id: "matpakke", navn: "En glemt matpakke", x: 610, y: 412, w: 70, h: 40, ting: "matpakke", vis: "!har:matpakke & !tattMat",
          klikk: [{ gi: "matpakke" }, { sett: "tattMat" },
            ["forteller", "Noen har glemt matpakka si. To skiver med brunost. Den kan komme godt med.",
                          "Noen har glemt matpakka si. Brunost. Den har ligget her en stund. Du tar den med. Man vet aldri."]] },
        { id: "teleskop", navn: "Den gamle kikkerten", x: 470, y: 400, w: 160, h: 120, ting: "teleskop",
          klikk: [{ hvis: "!vaken", da: [
              ["forteller", "En gammel messingkikkert på et stativ. Det står «1687» på foten, og den er full av støv.",
                            "En gammel messingkikkert merket «1687». Støvet på den er eldre enn læreren din."],
            ], ellers: [
              { hvis: "!har:kikkert", da: [{ gi: "kikkert" }] },
              ["ugle", "Se gjennom den, så reiser vi. Første stopp: Frankrike, høsten 1788!",
                       "Hold deg fast. Første stopp: Frankrike, 1788. Ikke spis noe hvis du ikke vet hva det er."],
              ["forteller", "Du kikker gjennom linsen. Rommet begynner å snurre …", "Du kikker gjennom linsen. Rommet snurrer. Magen din snurrer enda mer."],
              { ferdig: true },
            ] }] },
        { id: "plakater", navn: "Plakatene", x: 662, y: 300, w: 260, h: 150, ting: "plakatvegg", o: { blek: true },
          klikk: [{ hvis: "!plakat", da: [
              ["forteller", "«Ytringsfrihet», «Stemmerett», «Like for loven» … Bokstavene blir blassere mens du ser på dem!",
                            "«Ytringsfrihet», «Stemmerett», «Like for loven» … Bokstavene blekner. Enten er det magi, eller så trenger skolen ny skriver."],
              ["deg", "Hva i all verden …?", "Hallo? Vaktmester? Plakatene forsvinner!"],
              { sett: "plakat" },
            ], ellers: [
              ["forteller", "Plakatene blafrer. Det er nesten ikke farge igjen.", "Plakatene er så bleke at de ser ut som de har vært på ferie i Syden uten solkrem."],
            ] }] },
      ],
    },
  },
  gaater: {
    rettighet: { type: "velg", sporsmal: "Hva er en rettighet?", riktig: "Det du har krav på og lov til",
      feil: ["En regel du må følge", "En gave fra kongen som han kan ta tilbake", "En type skatt"],
      forklaring: "For eksempel retten til å si hva du mener, eller retten til å gå på skole." },
  },
},

/* =====================================================================
   KAPITTEL 1 – BONDEGÅRDEN
   ===================================================================== */
{ id: "k1", nr: 1, tittel: "Bondegården", sted: "Landsbygda i Frankrike", aar: "1788–1789", ikon: "🌾",
  om: "Tredjestanden, skattene og privilegiene – og en klagebok til kongen.",
  start: "aker",
  scener: {
    aker: {
      tittel: "Åkeren til familien Bonhomme", bg: "aker", spillerX: 210,
      hint: "Snakk med bonden Jacques. Kirka og slottet i bakgrunnen kan også fortelle noe.",
      inngang: [
        ["forteller", "Du lander med et dunk midt i en kornåker. Det lukter jord og gris.", "DUNK. Du lander midt i en kornåker. Det lukter jord, gris og … mer gris."],
        ["ugle", "Frankrike, høsten 1788. Nesten alle her bor på landet, og de fleste er bønder. Se, der borte er en familie.",
                 "Frankrike, 1788. Ingen mobiler, ingen dusj, og alle sier «monsieur». Se – en familie som trenger hjelp!"],
      ],
      punkter: [
        { id: "kirke", navn: "Kirka", x: 255, y: 235, w: 80, h: 135,
          klikk: [
            ["ugle", "Landsbykirka. Presten tilhører førstestanden – presteskapet. Kirken eier mye jord og slipper å betale skatt.",
                     "Kirka! Presteskapet er førstestanden. De ber for deg – og så tar de tiende. Amen."],
            ["ugle", "Kirken krever også tiende: en tidel av avlingen til bøndene.", "Tiende er en tidel av alt du dyrker. Og nei, du kan ikke betale med bønner. Jeg har spurt."],
            { omgrep: "Førstestanden" }] },
        { id: "slott", navn: "Slottet på åsen", x: 620, y: 205, w: 170, h: 95,
          klikk: [
            ["ugle", "Slottet til godseieren. Han er adelsmann – andrestanden. Han eier jorda Jacques dyrker, og Jacques må betale avgift til ham.",
                     "Godseierens slott. Adel – andrestanden. Han eier jorda, krever avgift og har en egen parykk-stylist."],
            ["ugle", "Adelen betaler ikke skatt til kongen. De får også de fineste stillingene i hæren og ved hoffet.",
                     "Adelen betaler ingen skatt. Hvorfor? Fordi de har bestemt det selv. Smart. Og urettferdig."],
            { omgrep: "Andrestanden" }] },
        { id: "hus", navn: "Huset", x: 100, y: 345, w: 190, h: 150, ting: "gard", skala: .85,
          klikk: [["forteller", "Et lite steinhus med stråtak. Familien deler det med en gris og fire høner.",
                                "Et lite hus med stråtak. Familien deler det med en gris. Grisen har den beste sengeplassen."]] },
        { id: "sekker", navn: "Kornsekkene", x: 330, y: 425, w: 170, h: 60, ting: "sekker", o: { n: 12 }, variant: [{ hvis: "avling", o: { n: 3 } }],
          klikk: [{ hvis: "!avling", da: [["forteller", "Tolv sekker korn. Hele årets avling.", "Tolv sekker korn. Ikke rør dem. Jacques teller."]],
                    ellers: [["forteller", "Tre sekker igjen. Det må holde for fem personer hele vinteren.", "Tre sekker. Fem personer. Hele vinteren. Pluss grisen."]] }] },
        { id: "jacques", navn: "Jacques, bonden", x: 480, y: 420, w: 70, h: 190, fig: "jacques",
          klikk: [{ hvis: "!avling", da: [
              ["jacques", "Hvem er du? Du har rare klær. Er du fra Paris?", "Hvem er du? Du har rare klær. Er det motene i Paris nå? Skrekkelig."],
              { valg: [
                { t: "Jeg er bare på besøk. Hvorfor ser du så bekymret ut?", gjor: [] },
                { t: "Fin hakke!", h: "Fin hakke! Er den fra IKEA?", gjor: [
                  ["jacques", "Takk. Den var min fars. Men hakka er ikke problemet.", "IKEA? Er det en adelsmann? Nei, hakka var min fars. Den er eldre enn kongen."]] },
              ] },
              ["jacques", "Avlingen i år er elendig. Først kom tørke, så kom haglet. Og snart kommer de og tar sin del.",
                          "Avlingen er elendig. Først tørke. Så hagl. Så spiste grisen salaten. Og snart kommer de og tar sin del."],
              ["deg", "Hvem er «de»?", "Hvem er «de»? Ninjaer?"],
              ["jacques", "Presten, forvalteren til godseieren og kongens skattefogd. Hjelp meg å telle sekkene, så skal du få se.",
                          "Verre enn ninjaer: presten, godseierens forvalter og kongens skattefogd. Hjelp meg å telle sekkene, så skjønner du."],
              { gaate: "avling" },
              { sett: "avling" },
              ["jacques", "Ser du? Av tolv sekker har vi tre igjen. Og vi er fem munner å mette hele vinteren.", "Tolv sekker inn, tre sekker igjen. Det er matte jeg ikke liker."],
              ["ugle", "Dette er standssamfunnet. Du blir født inn i en stand, og standen bestemmer nesten alt i livet ditt.",
                       "Velkommen til standssamfunnet: Du blir født inn i en stand, og så sitter du fast der. Som en heis som bare går ned."],
              { omgrep: "Standssamfunn" },
              ["ugle", "Jacques tilhører tredjestanden – ca. 95 % av folket. De betaler nesten all skatten. Adelen og presteskapet slipper. Det kalles et privilegium.",
                       "Jacques er tredjestanden – ca. 95 % av folket. De betaler nesten ALL skatten. De andre slipper. Det heter privilegium: urettferdig, men med fint navn."],
              { omgrep: "Tredjestanden" }, { omgrep: "Privilegium" },
              ["jacques", "Gå ned til torget. Skriveren Duval samler klager til kongen. Kanskje du kan hjelpe ham.",
                          "Gå til torget. Skriveren Duval samler klager til kongen. Han har mye blekk og enda flere meninger."],
            ], ellers: [
              ["jacques", "Gå til torget. Skriveren Duval samler klager til kongen der.", "Torget er den veien. Ikke den andre veien. Der er bare grisen."],
            ] }] },
        { id: "marie", navn: "Marie", x: 570, y: 420, w: 70, h: 190, fig: "marie",
          klikk: [
            ["marie", "Et brød i Paris koster nå over halve dagslønna til en arbeider. Her ute er det ikke stort bedre.",
                      "Brødet er så dyrt at vi snart må betale med grisen. Grisen er ikke enig."],
            ["marie", "Godseieren på slottet har mer mat enn han klarer å spise. Det er ikke rettferdig.",
                      "Godseieren har så mye mat at han sikkert bader i suppe. Tror jeg. Jeg har aldri vært der."]] },
        { id: "louison", navn: "Louison", x: 630, y: 424, w: 50, h: 125, fig: "louison",
          klikk: [{ hvis: "!matGitt", da: [
              ["louison", "Jeg er så sulten …", "Jeg er så sulten at jeg kunne spist grisen. Ikke si det til grisen."],
              { hvis: "har:matpakke", da: [["ugle", "Har du noe i sekken som kan hjelpe? Trykk på tingen i sekken, og så på Louison.",
                                                    "Psst. Sekken din! Trykk på en ting i sekken og så på Louison. Det kalles «å være snill»."]] },
            ], ellers: [
              ["louison", "Brunost er det beste jeg har smakt! Kommer det fra Paris?", "Brunost! Det smaker som karamell og føtter. Jeg ELSKER det!"],
            ] }],
          bruk: { matpakke: [{ ta: "matpakke" }, { sett: "matGitt" },
            ["louison", "Til meg? Takk! Hva er dette brune?", "Hva er dette brune? Ost? Som er BRUN? Dere fremtidsfolk er gale. Det er nydelig!"],
            ["marie", "Takk. Det er ikke ofte noen gir oss noe. Som regel tar de.", "Takk! Vanligvis er det bare folk som TAR fra oss. Du er den første som gir siden 1600-tallet."],
            { gull: 2 }] } },
        { id: "tiltorget", navn: "Til torget", x: 760, y: 330, w: 60, h: 60, ting: "pil",
          klikk: [{ hvis: "avling", da: [{ gaa: "torget" }],
                    ellers: [["ugle", "Vent – hjelp Jacques først.", "Vent! Først Jacques. Han ser ut som han trenger en klem. Eller en kalkulator."]] }] },
      ],
    },
    torget: {
      tittel: "Landsbytorget, våren 1789", bg: "torget", spillerX: 110,
      hint: "Snakk med skriveren ved bordet. Se også på oppslaget ved brønnen.",
      inngang: [
        ["ugle", "Kikkerten hoppet litt fram i tid. Nå er det våren 1789. Kongen har kalt inn stenderforsamlingen – et stort møte med alle tre stendene.",
                 "Kikkerten hoppet et halvt år fram. Den gjør sånt. Det er våren 1789, og kongen har kalt inn stenderforsamlingen – et kjempemøte for alle tre stendene."],
        ["ugle", "Kongen trenger penger, for staten er nesten konkurs. Derfor får hver landsby skrive en klagebok med det folk vil ha endret.",
                 "Kongen er blakk. SKIKKELIG blakk. Derfor får alle landsbyer skrive en klagebok. Endelig en bok folk faktisk vil skrive i!"],
      ],
      etter: [{ hvis: "har:klagebok & glemselSett", da: [
        ["ugle", "Vi har klageboka, og vi vet hva Glemsel er ute etter. Men før Versailles må vi finne ut hvor de nye ideene kommer fra.",
                 "Klagebok: sjekk. Glemsel-nys: sjekk. Før Versailles må vi finne kilden til ideene. Det hele starter med … et eple."],
        ["ugle", "Det begynte med vitenskapen. Hold deg fast – vi drar til England, 1687!", "Hold deg fast. England, 1687. Ta på deg noe varmt. Det regner. Det regner alltid i England."],
        { ferdig: true }] }],
      punkter: [
        { id: "tilaker", navn: "Tilbake til åkeren", x: 40, y: 330, w: 60, h: 60, ting: "pil", o: { venstre: true }, klikk: [{ gaa: "aker" }] },
        { id: "bronn", navn: "Brønnen", x: 590, y: 395, w: 100, h: 140, ting: "bronn",
          klikk: [["forteller", "Landsbybrønnen. Her henter alle vann – og alle nyhetene.", "Landsbybrønnen. Her henter folk vann og sladder. Mest sladder."]] },
        { id: "smed", navn: "Smeden", x: 250, y: 425, w: 70, h: 190, fig: "smed",
          klikk: [
            ["smed", "Jeg slår jern fra morgen til kveld, og halve lønna går til skatt. Greven på slottet betaler ingenting!",
                     "Jeg slår jern hele dagen, og så kommer skattefogden og slår MEG – i lommeboka. Greven betaler null. NULL!"],
            ["smed", "Hører ikke kongen på oss nå, vet jeg ikke hva som skjer.", "Hører ikke kongen på oss nå, blir det bråk. Jeg har en hammer, bare så det er sagt."]] },
        { id: "bord", pynt: true, x: 470, y: 425, ting: "bord", o: { bok: true } },
        { id: "skriver", navn: "Skriveren Duval", x: 400, y: 428, w: 70, h: 190, fig: "skriver",
          klikk: [{ hvis: "!har:klagebok", da: [
              ["skriver", "Bonjour! Jeg er Duval, advokat og skriver. Jeg hører også til tredjestanden – i borgerskapet.",
                          "Bonjour! Duval heter jeg. Advokat, skriver og eier av Frankrikes skarpeste fjærpenn."],
              { hvis: "!sortert", da: [
                ["skriver", "Men først: Folk her krangler om hvem som hører til hvilken stand. Hjelper du meg å sortere dem?",
                            "Men først: Folk krangler om hvem som hører til hvilken stand. En baron påsto at han var bonde for å slippe kø. Hjelp meg å sortere!"],
                { gaate: "stender" }, { sett: "sortert" },
              ] },
              ["skriver", "Utmerket! Nå til klageboka. Hva skal vi be kongen om?", "Magnifique! Nå klageboka. Ta fram blekket. Og sinnet."],
              { gaate: "klager" },
              { gi: "klagebok" }, { omgrep: "Stenderforsamlingen" },
              ["skriver", "Ta klageboka med til Versailles. Tredjestanden må bli hørt!", "Ta den med til Versailles! Og ikke søl suppe på den. Det er en offisiell klagebok."],
            ], ellers: [
              ["skriver", "Klageboka er ferdig. Nå må den til Versailles!", "Pass godt på klageboka. Den er tyngre enn den ser ut – full av sinne."],
            ] }] },
        { id: "oppslag", navn: "Oppslaget", x: 690, y: 425, w: 70, h: 145, ting: "oppslag", variant: [{ hvis: "glemselSett", o: { revet: true } }],
          klikk: [{ hvis: "!glemselSett", da: [
              ["forteller", "Et håndskrevet oppslag: «Alle mennesker er født like?» Noen har tegnet et stort spørsmålstegn etter.",
                            "Oppslaget sier: «Alle mennesker er født like?» Under har noen skrevet: «Nei. Hilsen Greven.»"],
              { sett: "glemselSett" },
              ["forteller", "Bak brønnen skimter du en mann i svart kappe og høy hatt. Han river i oppslaget – og forsvinner i en grå sky.",
                            "En mann i svart kappe og altfor høy hatt river i oppslaget, nyser, og forsvinner i en sky av grått pulver."],
              ["ugle", "Grev Glemsel! Han vil få folk til å glemme de nye ideene. Ideene om likhet kommer fra opplysningstidens filosofer – det er dem vi må finne.",
                       "Grev Glemsel! Den nysingen kjenner jeg igjen hvor som helst. Ideene han vil stoppe, kommer fra filosofene – dem må vi finne!"],
            ], ellers: [
              ["forteller", "Oppslaget henger skjevt. Noen har prøvd å rive det ned.", "Oppslaget henger skjevt. Som Grev Glemsels moral."],
            ] }] },
      ],
    },
  },
  gaater: {
    avling: { type: "avling", tittel: "Hvem tar hva av avlingen?", sekker: 12,
      steg: [
        { tekst: "En mann i svart kappe med et kors rundt halsen banker på. Han krever tiende – en tidel av avlingen til kirken.",
          h: "En mann i svart kappe og kors banker på. «Tiende, takk!» sier han, og smiler som en tannlege.",
          sporsmal: "Hvem er han?", riktig: "Presten – førstestanden", feil: ["Godseieren – andrestanden", "Kongens skattefogd"], tar: 1, merke: "⛪ Tiende" },
        { tekst: "Så kommer forvalteren fra slottet på åsen. Godseieren eier jorda, og Jacques må betale avgift for å få dyrke den.",
          h: "Så kommer forvalteren fra slottet: «Godseieren eier jorda. Og lufta. Og antagelig deg.» Han vil ha avgift.",
          sporsmal: "Hvilken stand tilhører godseieren?", riktig: "Andrestanden – adelen", feil: ["Førstestanden – presteskapet", "Tredjestanden – folket"], tar: 3, merke: "🎩 Avgift" },
        { tekst: "Til slutt kommer kongens skattefogd. Han vil ha skatt til kongen.",
          h: "Til slutt kommer skattefogden med en pung som er større enn hodet hans.",
          sporsmal: "Hvem må betale skatt til kongen?", riktig: "Bare tredjestanden", feil: ["Alle tre stendene likt", "Bare adelen"], tar: 4, merke: "👑 Skatt" },
        { tekst: "Jacques legger bort én sekk med såkorn, så han har noe å så til neste vår.",
          h: "Jacques gjemmer én sekk såkorn under senga. Grisen vet hvor den er. Grisen sier ingenting.",
          sporsmal: "Hvor mange sekker har familien igjen å spise av?", riktig: "3", feil: ["6", "8", "12"], tar: 1, merke: "🌱 Såkorn", forst: true },
      ],
      forklaring: "Tallene er omtrentlige, men mange bønder satt igjen med under halvparten av det de dyrket." },
    stender: { type: "sorter", tittel: "Hvem hører til hvilken stand?",
      kurver: [{ id: "1", navn: "Førstestanden", ikon: "⛪" }, { id: "2", navn: "Andrestanden", ikon: "🎩" }, { id: "3", navn: "Tredjestanden", ikon: "🧑‍🌾" }],
      ting: [["Biskop", "1"], ["Munk", "1"], ["Prest", "1"], ["Greve", "2"], ["Hertug", "2"], ["Baron", "2"], ["Bonde", "3"], ["Smed", "3"], ["Advokat", "3"], ["Kjøpmann", "3"], ["Tjenestepike", "3"]],
      forklaring: "Kirkens folk = første, adelen = andre, alle andre = tredje. Også rike kjøpmenn og advokater hørte til tredjestanden!" },
    klager: { type: "flervalg", sporsmal: "Hva skal stå i klageboka? Velg alle som passer.",
      riktige: ["Adelen og presteskapet må også betale skatt", "Brødet må bli billigere", "Tredjestanden må få mer å si"],
      feil: ["Kongen må få enda mer makt", "Bøndene må betale mer tiende"],
      forklaring: "Ekte klagebøker fra 1789 handlet nettopp om skatt, brødpriser og at tredjestanden ville bli hørt." },
  },
},

/* =====================================================================
   KAPITTEL 2 – EPLET SOM FALT
   ===================================================================== */
{ id: "k2", nr: 2, tittel: "Eplet som falt", sted: "England", aar: "1687", ikon: "🍎",
  om: "Vitenskapsrevolusjonen: Newton og naturlovene.",
  start: "studerkammer",
  scener: {
    studerkammer: {
      tittel: "Newtons arbeidsrom", bg: "studerkammer", spillerX: 110,
      hint: "Sidene er gjemt der Newton forsker: ved prismet, på skrivebordet og ute i hagen.",
      inngang: [
        ["ugle", "England, 1687. Dette er arbeidsrommet til Isaac Newton – en av de største forskerne i historien.",
                 "England, 1687. Det regner, som lovet. Dette er arbeidsrommet til Isaac Newton – supergeni og verdensmester i parykk."],
        ["newton", "Katastrofe! Manuskriptet mitt – «Principia» – tre sider er borte! Noen har vært her og nyst over hele pulten.",
                   "KATASTROFE! Tre sider av manuskriptet mitt er borte! Og noen har nyst på pulten min. Uhøflig!"],
        ["ugle", "Glemsel! Uten Newtons bok stopper vitenskapsrevolusjonen. Vi må finne de tre sidene.",
                 "Glemsel igjen! Uten Newtons bok blir det ingen opplysningstid. Finn de tre sidene!"],
      ],
      punkter: [
        { id: "globus", navn: "Globusen", x: 335, y: 425, w: 60, h: 80, ting: "globus",
          klikk: [["forteller", "En globus. For hundre og femti år siden trodde nesten alle at jorda sto stille midt i universet.",
                                "En globus. Før trodde folk at jorda var midten av universet. Litt som enkelte i klassen tror om seg selv."]] },
        { id: "skrivebord", navn: "Skrivebordet", x: 190, y: 425, w: 170, h: 110, ting: "skrivebord",
          klikk: [{ hvis: "!side2funnet", da: [
              ["forteller", "På pulten ligger bøker av Kopernikus og Galilei. Mellom dem stikker det fram et ark.",
                            "Bøker av Kopernikus og Galilei. Og et ark med nyseflekker. Ekkelt, men nyttig."],
              { gaate: "kopernikus" }, { gi: "side2" }, { sett: "side2funnet" },
            ], ellers: [
              ["forteller", "Pulten er full av regnestykker. Newton fant opp en helt ny type matematikk.",
                            "Pulten er full av regnestykker. Newton fant opp en helt ny type matte. Takk for det, sier alle som tar realfag."],
            ] }] },
        { id: "bord", pynt: true, x: 470, y: 425, ting: "bord" },
        { id: "prisme", navn: "Prismet", x: 470, y: 369, w: 70, h: 50, ting: "prisme", variant: [{ hvis: "prisme", o: { lys: true } }],
          klikk: [{ hvis: "!side1funnet", da: [
              ["forteller", "Du snur prismet mot sollyset. Det hvite lyset deler seg i alle regnbuens farger!",
                            "Du snur prismet mot lyset. PANG – regnbue! Newton blir så glad at han nesten mister parykken."],
              { sett: "prisme" },
              ["newton", "Mitt forsøk! Hvitt lys er egentlig alle fargene blandet. Det fant jeg ut ved å teste – ikke ved å lese gamle bøker.",
                         "Mitt forsøk! Hvitt lys er alle fargene blandet. Det fant jeg ut ved å teste – og ved å sitte i mørket i ukesvis. Mamma var bekymret."],
              { gaate: "lys" }, { gi: "side1" }, { sett: "side1funnet" },
              ["forteller", "Under prismet lå en av de forsvunne sidene!", "Under prismet lå en side! Glemsel er dårlig på å gjemme ting."],
            ], ellers: [
              ["forteller", "Regnbuen danser over gulvet.", "Regnbuen danser over gulvet. Katten i hagen hadde elsket dette."],
            ] }] },
        { id: "newton", navn: "Isaac Newton", x: 590, y: 425, w: 70, h: 195, fig: "newton",
          klikk: [{ hvis: "har:side1 & har:side2 & har:side3", da: [
              ["newton", "Du fant alle sidene! Hjelp meg å legge dem i riktig rekkefølge. De forteller hvordan vi lærte å forstå himmelen.",
                         "Alle tre! Du er mer nyttig enn assistenten min. Han spiste en side i fjor. Legg dem i rekkefølge, er du snill."],
              { gaate: "rekke" }, { ta: "side1" }, { ta: "side2" }, { ta: "side3" },
              ["newton", "Nå ser du det: Naturen følger faste lover. Tyngdeloven gjelder for epler, for månen – og for kongen!",
                         "Naturen følger faste lover! Tyngdeloven gjelder for epler, månen og kongen. Kongen faller også hvis han snubler. Det er vitenskap."],
              ["ugle", "Og så tenkte filosofene: Hvis naturen har lover som gjelder for alle, har kanskje alle mennesker også de samme naturlige rettighetene.",
                       "Og så tenkte filosofene: Hvis naturen har lover for alle, har kanskje alle mennesker de samme rettighetene? BOOM. Opplysningstiden. Takk, eple."],
              { kort: "naturlov" }, { omgrep: "Naturlov" }, { omgrep: "Vitenskapsrevolusjonen" },
              ["ugle", "Nå skal vi møte filosofene selv. Jeg har en plan – en salong i Paris. Kom!", "Neste stopp: en salong i Paris. Ta på deg pene sko. Ikke de der."],
              { ferdig: true },
            ], ellers: [
              ["newton", "Tre sider mangler! Uten dem blir boka aldri ferdig.", "Tre sider mangler! Uten dem blir det bare «Principi». Det høres ut som en pizza."],
            ] }] },
        { id: "dor", navn: "Døra til hagen", x: 720, y: 425, w: 76, h: 175, ting: "dor", klikk: [{ gaa: "hage" }] },
      ],
    },
    hage: {
      tittel: "Hagen", bg: "hage", spillerX: 130,
      hint: "Det henger noe i epletreet …",
      inngang: [["forteller", "En liten hage med en murvegg og et stort epletre.", "En hage med et epletre. Et veldig berømt epletre. Det vet det ikke selv."]],
      punkter: [
        { id: "inn", navn: "Tilbake inn", x: 40, y: 340, w: 60, h: 60, ting: "pil", o: { venstre: true }, klikk: [{ gaa: "studerkammer" }] },
        { id: "tre", navn: "Epletreet", x: 430, y: 425, w: 220, h: 330, ting: "epletre", o: { ark: true }, variant: [{ hvis: "side3funnet", o: { ark: false } }],
          klikk: [{ hvis: "!side3funnet", da: [
              ["forteller", "Høyt oppe i treet sitter et ark fast mellom greinene.", "Høyt oppe i treet sitter et ark fast. Og et ekorn som ser skyldig ut."],
              { valg: [
                { t: "Rist treet", gjor: [] },
                { t: "Klatre opp", h: "Klatre opp (i joggesko fra 2026)", gjor: [
                  ["forteller", "Greinene er for tynne. Du må finne en annen måte.", "Du kommer en halv meter opp før greina sier KNAKK. Prøv noe annet, Tarzan."],
                  { stopp: true }] },
              ] },
              ["forteller", "Du rister i treet. Et eple faller ned – rett i hodet ditt. Au! Arket seiler etter.",
                            "Du rister. BONK! Et eple rett i hodet. Arket daler ned. Ekornet ler av deg. Ekorn er slemme."],
              { gaate: "eple" }, { gi: "side3" }, { sett: "side3funnet" },
            ], ellers: [
              ["forteller", "Epletreet står der i all sin ro. Det aner ikke hvor berømt det kommer til å bli.",
                            "Epletreet står der. Det aner ikke at det er med i alle fysikkbøker i verden. Ikke si det. Det blir bare høy på seg selv."],
            ] }] },
        { id: "benk", navn: "Benken", x: 680, y: 425, w: 130, h: 70, ting: "benk",
          klikk: [["forteller", "En benk der Newton pleier å sitte og tenke.", "En benk. Newton sitter her og tenker. Ofte så lenge at han glemmer å spise."]] },
        { id: "katt", navn: "Katten", x: 690, y: 389, w: 70, h: 50, ting: "katt",
          klikk: [["forteller", "Det sies at Newton fant opp kattelemmen. Det er nok bare en historie – men katten virker fornøyd.",
                                "Det sies at Newton fant opp kattelemmen. Det er nok bare en myte. Katten nekter å kommentere."]] },
      ],
    },
  },
  gaater: {
    lys: { type: "velg", sporsmal: "Hvordan fant Newton ut at hvitt lys består av mange farger?", riktig: "Han gjorde forsøk og så nøye etter",
      feil: ["Han leste det i en gammel bok", "Kongen fortalte ham det", "Han drømte det"],
      forklaring: "Forsøk og observasjoner – det er kjernen i vitenskapsrevolusjonen." },
    kopernikus: { type: "velg", sporsmal: "Hva fant Kopernikus ut i 1543?", riktig: "At jorda går rundt sola",
      feil: ["At jorda er flat", "At sola går rundt jorda", "At månen er laget av ost"],
      forklaring: "Før trodde nesten alle at jorda sto stille i midten av universet. Kirken likte ikke den nye ideen." },
    eple: { type: "velg", sporsmal: "Hvorfor faller eplet ned og ikke opp?", riktig: "Tyngdekraften trekker det mot jorda",
      feil: ["Eplet er lat", "Vinden blåser det ned", "Kongen har bestemt det"],
      forklaring: "Newtons tyngdelov: Alle ting trekker på hverandre. Den samme kraften holder månen i bane rundt jorda." },
    rekke: { type: "rekkefolge", tittel: "Legg sidene i riktig rekkefølge – det som skjedde først, øverst",
      ting: [
        { t: "Oldtiden: Jorda står stille i midten av universet", aar: "Oldtiden" },
        { t: "Kopernikus: Jorda går rundt sola", aar: "1543" },
        { t: "Galilei ser Jupiters måner gjennom kikkerten", aar: "1610" },
        { t: "Newton forklarer tyngdeloven", aar: "1687" },
      ] },
  },
},

/* =====================================================================
   KAPITTEL 3 – DRØMMESALONGEN
   ===================================================================== */
{ id: "k3", nr: 3, tittel: "Drømmesalongen", sted: "Paris", aar: "1700-tallet", ikon: "🕯️",
  om: "Fem filosofer, fem idékort – og en sensor som nyser.",
  start: "salong",
  scener: {
    salong: {
      tittel: "Salongen til Madame Lumière", bg: "salong", spillerX: 120,
      hint: "Snakk med alle de fem filosofene. Voltaire har et problem som haster!",
      inngang: [
        ["madame", "Velkommen til salongen min! Her møtes de klokeste hodene for å snakke om kunst, vitenskap og politikk.",
                   "Bienvenue! Velkommen til salongen min! Her diskuterer vi kunst, vitenskap, politikk og hvem som har verst parykk."],
        { omgrep: "Salongmøte" },
        ["ugle", "I kveld er det en helt spesiell salong. Jeg har hentet filosofer fra hele opplysningstiden, så du kan møte alle på én gang. En drømmesalong!",
                 "Psst: Jeg har jukset litt og hentet filosofer fra forskjellige tiår. Det er en drømmesalong. Ikke si det til historielæreren."],
        ["ugle", "Hver av dem har et idékort. Overbevis filosofene, så gir de deg kortene sine – før Glemsel får tak i dem.",
                 "Hver filosof har et idékort. Samle alle fem før Glemsel gjør det. Tips: Filosofer elsker når du er enig med dem."],
      ],
      etter: [{ hvis: "kort:rettigheter & kort:makt & kort:ytring & kort:folk & kort:tenk", da: [
        ["madame", "Fem idékort! Fra salongene sprer ideene seg i bøker og aviser – ut til hele Frankrike.", "Fem kort! Nå sprer ideene seg ut i hele Frankrike. Som sladder, bare nyttig."],
        ["ugle", "Snart havner alle disse ideene i ett dokument. Men først: Versailles, mai 1789. Kongen har kalt inn stenderforsamlingen – og vi har klageboka!",
                 "Neste stopp: Versailles, mai 1789. Kongen, hoffet og verdens største speilsal. Ta med klageboka. Og solbriller."],
        { ferdig: true }] }],
      punkter: [
        { id: "dor", navn: "Døra", x: 40, y: 330, w: 70, h: 170, ting: "dor", o: { f: "#e8d8b0" }, skala: .9,
          klikk: [["forteller", "Døra ut til trappa. Ingen går herfra før kvelden er over.", "Døra. Bak den står det en lakei som nekter å slippe deg ut før du har smakt på makronene."]] },
        { id: "cembalo", navn: "Cembaloet", x: 170, y: 352, w: 210, h: 95, ting: "cembalo", variant: [{ hvis: "skjult", o: { skjult: true } }],
          klikk: [["forteller", "Et cembalo – et slags gammelt piano. Ingen spiller på det i kveld.", "Et cembalo. Det er et piano som høres ut som en sint gitar."]],
          bruk: { skrift: [
            { ta: "skrift" }, { sett: "skjult" },
            ["forteller", "Du gjemmer skriftet inni cembaloet.", "Du stapper skriftet inn i cembaloet. Det spiller en falsk tone. Ingen merker forskjell."],
            ["sensor", "Hm! Ingenting her … Men jeg kommer tilbake! Atsjo!", "Ingenting?! Umulig! ATSJO! Jeg … kommer … tilbake!"],
            ["forteller", "Sensoren nyser så hardt at parykken flyr av. Under den sitter en høy, svart hatt! Han løper ut.",
                          "Sensoren nyser så hardt at parykken flyr av – og under den er det en høy svart hatt! Han løper ut døra."],
            ["ugle", "Grev Glemsel – forkledd som sensor! Han ville stoppe ytringsfriheten.", "GREV GLEMSEL! Forkledd som sensor! Det eldste trikset i boka. Og boka er sensurert."],
            { fjern: "sensor" },
            ["voltaire", "Takk, min venn! Sensur er når makthaverne bestemmer hva folk får lese og si. Det er farlig.",
                         "Merci! Sensur er når makthaverne bestemmer hva vi får lese. Da blir alt urettferdig. Og kjedelig. Mest kjedelig."],
            { gaate: "sensur" }, { omgrep: "Sensur" },
            ["voltaire", "Alle skal ha rett til å si og skrive det de mener. Her – ta kortet mitt.", "Alle skal få si hva de mener. Selv Rousseau. Dessverre. Her – kortet mitt."],
            { kort: "ytring" }, { omgrep: "Ytringsfrihet" }] } },
        { id: "sofa", navn: "Sofaen", x: 560, y: 345, w: 250, h: 100, ting: "sofa",
          klikk: [["forteller", "En myk sofa med gullben.", "En sofa med gullben. Den er så myk at Rousseau klager på den."]],
          bruk: { skrift: [["ugle", "Under sofaputen? Der leter alle først!", "Under sofaputen? Der leter ALLE. Også foreldrene dine når de finner sjokoladen din."]] } },
        { id: "locke", navn: "John Locke", x: 240, y: 428, w: 66, h: 190, fig: "locke",
          klikk: [{ hvis: "!kort:rettigheter", da: [
              ["locke", "God kveld. John Locke, fra England. Jeg er lege – og filosof.", "John Locke. Lege, filosof og engelskmann. Jeg har tatt med egen te. Fransk te er … fransk."],
              ["locke", "Jeg mener at alle mennesker er født med naturlige rettigheter. Ingen konge kan ta dem fra oss. Vet du hvilke?",
                        "Alle mennesker er født med naturlige rettigheter. Ingen konge kan ta dem. Ikke engang hvis han spør pent. Vet du hvilke?"],
              { gaate: "locke1" },
              ["locke", "Riktig! Staten finnes for å beskytte rettighetene våre. Men hva om kongen bryter dem?", "Korrekt! Staten skal beskytte rettighetene. Men hva om kongen er en dust og bryter dem?"],
              { gaate: "locke2" },
              ["locke", "Nettopp. Folket gir makten til herskeren – og kan ta den tilbake. Her er kortet mitt.", "Nettopp! Folket kan kaste ham. Høflig, selvsagt. Med et brev først. Her – kortet mitt."],
              { kort: "rettigheter" },
            ], ellers: [["locke", "Liv, frihet og eiendom – husk det!", "Liv, frihet og eiendom. Og te. Det siste er ikke offisielt."]] }] },
        { id: "montesquieu", navn: "Montesquieu", x: 330, y: 428, w: 66, h: 190, fig: "montesquieu",
          klikk: [{ hvis: "!kort:makt", da: [
              ["montesquieu", "Montesquieu. Jeg er baron og dommer, og jeg har skrevet «Om lovenes ånd».",
                              "Montesquieu: baron, dommer og forfatter av «Om lovenes ånd». Jeg brukte tjue år på den. Leser du den på en kveld, blir jeg fornærmet."],
              ["montesquieu", "Den som har all makt, vil misbruke den. Derfor må makten deles i tre. Kan du sortere disse oppgavene?",
                              "Gi én person all makt, og han blir en tyrann. Eller verre: en tyrann med dårlig smak. Sorter disse oppgavene!"],
              { gaate: "makt" },
              ["montesquieu", "Utmerket! Makt må stanse makt. Kortet er ditt.", "Parfait! Makt må stanse makt – som stein, saks, papir. Kortet er ditt."],
              { kort: "makt" }, { omgrep: "Maktfordeling" },
            ], ellers: [["montesquieu", "Lovgivende, utøvende, dømmende. Tre makter – ingen tyrann.", "Tre makter. Ingen tyrann. Og ingen får siste kakestykke uten avstemning."]] }] },
        { id: "madame", navn: "Madame Lumière", x: 420, y: 428, w: 76, h: 200, fig: "madame",
          klikk: [["madame", "Snakk med gjestene mine! Hver av dem har en idé som kan forandre verden.",
                             "Snakk med gjestene! Men ikke la Rousseau og Voltaire sitte ved siden av hverandre. Sist kastet de kake."],
                  ["ugle", "Salongene ble ofte ledet av rike, utdannede kvinner. Her ble opplysningsideene diskutert og spredt.",
                           "Visste du? Salongene ble ofte ledet av smarte, rike kvinner. De var tidens influensere. Bare med mer kake."]] },
        { id: "voltaire", navn: "Voltaire", x: 510, y: 428, w: 66, h: 190, fig: "voltaire",
          klikk: [{ hvis: "kort:ytring", da: [
              ["voltaire", "Jeg er kanskje uenig i det du sier, men alle skal få lov til å si det.", "Jeg er uenig med alle om alt. Men alle skal få si hva de mener. Selv Rousseau. Dessverre."],
            ], ellers: [{ hvis: "sensor", da: [
              ["voltaire", "Gjem skriftet, fort!", "GJEM DET! Jeg er for gammel og for vittig for fengsel!"],
            ], ellers: [
              ["voltaire", "Ah, en ung tenker! Jeg heter Voltaire. Jeg har nettopp skrevet et lite skrift som gjør narr av både kirken og kongen.",
                           "Voltaire, til tjeneste. Jeg har nettopp skrevet et skrift som gjør narr av kongen. Han kommer til å HATE det. Jeg gleder meg."],
              ["voltaire", "Problemet er at kongens sensor er på vei. Finner han det, havner jeg i Bastillen – igjen!",
                           "Men kongens sensor er på vei. Finner han det, havner jeg i Bastillen. Igjen. Maten der er forferdelig – jeg har skrevet en anmeldelse."],
              ["voltaire", "Kan du gjemme det for meg? Et lurt sted her i salongen.", "Gjem det! Et lurt sted. Ikke under sofaputen, det er der alle leter."],
              { gi: "skrift" }, { sett: "sensor" },
              ["forteller", "Døra går opp. En mann i grå frakk og briller kommer inn.", "Døra smeller opp. En mann i grå frakk kommer inn. Han nyser. Mistenkelig."],
              ["sensor", "Kongens sensor! Jeg leter etter forbudte skrifter. Ingen rører seg!", "Kongens sensor! Jeg leter etter forbudte skrifter, morsomme vitser og annet ulovlig!"],
              ["ugle", "Fort – trykk på skriftet i sekken, og så på et godt gjemmested!",
                       "Fort! Trykk på skriftet i sekken, og så på et gjemmested. Ingen leter i et instrument ingen kan spille …"],
            ] }] }] },
        { id: "rousseau", navn: "Jean-Jacques Rousseau", x: 600, y: 428, w: 66, h: 190, fig: "rousseau",
          klikk: [{ hvis: "!kort:folk", da: [
              ["rousseau", "Hmpf. Jean-Jacques Rousseau. Jeg liker egentlig ikke fine salonger. Og ikke Voltaire.", "Hmpf. Rousseau. Jeg hater fine salonger. Og Voltaire. Og den sofaen. Den er for myk."],
              ["voltaire", "Og jeg liker ikke deg heller, Jean-Jacques!", "Gjensidig, Jean-Jacques! Bøkene dine får meg til å ville gå på alle fire og spise gress!"],
              ["rousseau", "«Mennesket er født fritt, og overalt er det i lenker.» Svar meg på dette:",
                           "«Mennesket er født fritt, og overalt er det i lenker.» Den beste setningen jeg har skrevet. Svar meg på dette, og ikke se på Voltaire:"],
              { gaate: "rousseau" },
              ["rousseau", "Ja! Folket er den egentlige herskeren. Det kalles folkesuverenitet. Ta kortet – før jeg ombestemmer meg.",
                           "Ja! Folket bestemmer! Folkesuverenitet! Ta kortet før jeg blir sur igjen. Det tar ca. tre sekunder."],
              { kort: "folk" }, { omgrep: "Folkesuverenitet" },
            ], ellers: [["rousseau", "Makten tilhører folket. Ikke kongen. Og absolutt ikke Voltaire.", "Folket bestemmer. Ikke kongen. Og ALDRI Voltaire."]] }] },
        { id: "kant", navn: "Immanuel Kant", x: 700, y: 428, w: 62, h: 180, fig: "kant",
          klikk: [{ hvis: "!kort:tenk", da: [
              ["kant", "Immanuel Kant, fra Königsberg. Jeg har nøyaktig tolv minutter før kveldsturen min.",
                       "Immanuel Kant. Jeg har nøyaktig 11 minutter og 40 sekunder før kveldsturen. Folk stiller klokka etter meg."],
              ["kant", "Kortet mitt må du fortjene – ved å tenke selv. Hva er opplysning?", "Kortet mitt får du ikke gratis. Hva er opplysning? Og nei, det er ikke lyspærer."],
              ["ugle", "(hvisker) Psst! Svar «å gjøre det ugla sier»!", "(hvisker) Psst! Svar «å gjøre det ugla sier». Stol på meg. Jeg er en ugle."],
              { gaate: "kant" },
              ["kant", "Riktig! Og du lot ikke ugla tenke for deg. Sapere aude – våg å bruke din egen forstand!",
                       "Utmerket! Du ignorerte ugla. Det er opplysning på høyt nivå. Sapere aude! Latin for «tenk selv» – og for «nå må jeg gå tur»."],
              ["ugle", "Hehe. Det var en test. Jeg er tross alt visdommens ugle.", "Det var … en test. Selvsagt. Helt planlagt. Jeg er visdommens ugle. Hoo."],
              { kort: "tenk" },
            ], ellers: [["kant", "Tenk selv! Og nå: kveldsturen.", "Klokka er 15.30. Jeg går tur nå. Det har jeg gjort hver dag i årevis. Kjedelig? Nei. Presist."]] }] },
        { id: "sensor", navn: "Kongens sensor", x: 110, y: 434, w: 66, h: 190, fig: "sensor", vis: "sensor",
          klikk: [["sensor", "Hvor er det forbudte skriftet? Jeg vet det er her!", "Jeg LUKTER forbudt litteratur. Det lukter blekk og frekkhet."]],
          bruk: { skrift: [["ugle", "Gi det til sensoren?! Nei! Gjem det!", "IKKE gi det til sensoren! Det er som å gi godteriet ditt til tannlegen!"]] } },
      ],
    },
  },
  gaater: {
    locke1: { type: "velg", sporsmal: "Hvilke tre naturlige rettigheter har alle mennesker ifølge Locke?", riktig: "Liv, frihet og eiendom",
      feil: ["Makt, penger og titler", "Mat, søvn og fotball", "Konge, kirke og adel"] },
    locke2: { type: "velg", sporsmal: "Hva kan folket gjøre hvis kongen bryter rettighetene deres, ifølge Locke?", riktig: "Avsette ham – folket kan ta makten tilbake",
      feil: ["Ingenting – kongen har makten fra Gud", "Betale mer skatt", "Flytte til England"],
      forklaring: "Denne ideen ble brukt både i USA i 1776 og i Frankrike i 1789." },
    makt: { type: "sorter", tittel: "Hvilken makt er dette?",
      kurver: [{ id: "lov", navn: "Lovgivende", ikon: "📜" }, { id: "ut", navn: "Utøvende", ikon: "🏛️" }, { id: "dom", navn: "Dømmende", ikon: "⚖️" }],
      ting: [["Lager nye lover", "lov"], ["Bestemmer skattene", "lov"], ["Styrer landet etter lovene", "ut"], ["Leder hæren og politiet", "ut"], ["Dømmer en tyv", "dom"], ["Avgjør hvem som har rett i en krangel", "dom"]],
      forklaring: "I Norge i dag: Stortinget (lovgivende), regjeringen (utøvende) og domstolene (dømmende)." },
    sensur: { type: "velg", sporsmal: "Hva kalles det når makthaverne forbyr bøker og bestemmer hva folk får si?", riktig: "Sensur",
      feil: ["Salong", "Privilegium", "Tiende"] },
    rousseau: { type: "velg", sporsmal: "Hvem skal makten i landet tilhøre ifølge Rousseau?", riktig: "Folket", feil: ["Kongen", "Kirken", "Adelen"],
      forklaring: "Folkesuverenitet: Lovene skal bygge på det folket vil sammen – allmennviljen." },
    kant: { type: "velg", sporsmal: "Hva er opplysning ifølge Kant?", riktig: "Å tenke selv og bruke sin egen forstand",
      feil: [{ t: "Å gjøre det ugla sier", f: "Ha! Da lot du jo ugla tenke for deg. Prøv igjen – og tenk selv!" }, "Å tenne flere lys i byene", "Å lese alt kongen skriver"] },
  },
},

/* =====================================================================
   KOMMENDE KAPITLER – legg inn scener og gåter, og fjern «kommer: true».
   ===================================================================== */
{ id: "k4", nr: 4, tittel: "Versailles", sted: "Versailles", aar: "Mai 1789", ikon: "👑", kommer: true, om: "Hoffet, eneveldet og stenderforsamlingen." },
{ id: "k5", nr: 5, tittel: "Ballhuseden", sted: "Versailles", aar: "Juni 1789", ikon: "✋", kommer: true, om: "Tredjestanden gjør opprør og lover å lage en grunnlov." },
{ id: "k6", nr: 6, tittel: "Bastillen", sted: "Paris", aar: "14. juli 1789", ikon: "🔥", kommer: true, om: "Folket stormer fengselet som er symbolet på kongens makt." },
{ id: "k7", nr: 7, tittel: "Erklæringen", sted: "Paris", aar: "August 1789", ikon: "📃", kommer: true, om: "Bygg menneskerettighetserklæringen av idékortene dine." },
{ id: "k8", nr: 8, tittel: "Terroren", sted: "Paris", aar: "1793–1794", ikon: "⚔️", kommer: true, om: "Når revolusjonen spiser sine egne barn." },
{ id: "k9", nr: 9, tittel: "Keiseren", sted: "Europa", aar: "1799–1815", ikon: "🎖️", kommer: true, om: "Napoleon tar makten – og Europa endres for alltid." },
{ id: "epilog", nr: 10, tittel: "Hjem igjen", sted: "Norge", aar: "1814 og i dag", ikon: "🦁", kommer: true, om: "Ideene finner veien til Eidsvoll – og til plakatene på skolen din." },
],
};
