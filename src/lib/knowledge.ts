// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — Bar knowledge (shared by the Encyclopedia and the AI Bartender)
// src/lib/knowledge.ts
// ─────────────────────────────────────────────────────────────────────────────

export const ENC_INGREDIENTS = [
  { name: 'Campari',        cat: 'Bitter',            origin: 'Milano, 1860',     abv: 25,   color: '#C0392B', desc: 'Bitter italiano con un blend segreto di erbe e frutti. Intenso, amaro, iconico.', notes: 'Rabarbaro, arancia amara, vaniglia, erbe' },
  { name: 'Aperol',         cat: 'Bitter',            origin: 'Padova, 1919',     abv: 11,   color: '#E67E22', desc: 'Il bitter più leggero d’Italia: arancia, rabarbaro e genziana in equilibrio.', notes: 'Arancia, rabarbaro, genziana, china' },
  { name: 'Gin London Dry', cat: 'Gin',               origin: 'Londra, 1800',     abv: 40,   color: '#cfe3f5', desc: 'Il classico gin inglese. Ginepro dominante, base di innumerevoli cocktail.', notes: 'Ginepro, coriandolo, angelica, agrumi' },
  { name: 'Bourbon',        cat: 'Whisky',            origin: 'Kentucky, 1800',   abv: 45,   color: '#C07830', desc: 'Whisky americano da almeno 51% di mais, invecchiato in botti nuove tostate.', notes: 'Vaniglia, caramello, rovere tostato, spezie' },
  { name: 'Tequila Blanco', cat: 'Tequila',           origin: 'Jalisco, Messico', abv: 38,   color: '#f2ecc4', desc: '100% agave blu, imbottigliata subito dopo la distillazione. Fresca ed erbacea.', notes: 'Agave cotta, pepe verde, agrumi' },
  { name: 'Vermut Rosso',   cat: 'Vino aromatizzato', origin: 'Torino, 1786',     abv: 16,   color: '#8B2020', desc: 'Vino aromatizzato con erbe, radici e spezie. L’anima del Negroni e del Manhattan.', notes: 'Artemisia, vaniglia, caramello, spezie' },
  { name: 'Rum Bianco',     cat: 'Rum',               origin: 'Caraibi, 1600',    abv: 37.5, color: '#f3eedd', desc: 'Rum giovane e vivace. Base di Daiquiri, Mojito e Cuba Libre.', notes: 'Canna da zucchero, cocco, frutta tropicale' },
  { name: 'Kahlúa',         cat: 'Liquore al caffè',  origin: 'Messico, 1936',    abv: 20,   color: '#3a1a08', desc: 'Il liquore al caffè per eccellenza. Indispensabile nell’Espresso Martini.', notes: 'Arabica, vaniglia, zucchero di canna' },
];

export const TECHNIQUES = [
  { name: 'Shake',         desc: 'Agitazione energica nello shaker con ghiaccio, 10–15 secondi. Raffredda, diluisce (~25%) e aera. Per drink con succhi, sciroppi, panna o uovo.' },
  { name: 'Stir',          desc: 'Mescolatura nel mixing glass con il bar spoon, 20–30 secondi. Diluisce ~20% mantenendo il drink limpido e setoso. Per cocktail di soli distillati.' },
  { name: 'Build',         desc: 'Costruzione direttamente nel bicchiere di servizio, ghiaccio prima e top di soda per ultimo. Gin Tonic, Cuba Libre, Spritz.' },
  { name: 'Muddle',        desc: 'Pestare frutta, erbe o zucchero per estrarre oli ed essenze. Con la menta premi appena: se la strappi diventa amara.' },
  { name: 'Double strain', desc: 'Filtrare con lo strainer dello shaker e un colino fine insieme, per eliminare schegge di ghiaccio e polpa.' },
  { name: 'Dry shake',     desc: 'Shakerare senza ghiaccio per emulsionare l’albume, poi di nuovo con ghiaccio. Schiuma densa e stabile.' },
  { name: 'Float',         desc: 'Versare lentamente sul dorso di un cucchiaio per far galleggiare un liquido meno denso sopra un altro.' },
  { name: 'Flame',         desc: 'Spremere una scorza d’arancia vicino a una fiamma sopra il drink: gli oli caramellano e profumano la superficie.' },
];
