import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   BALDI'S LAB — Premium Digital Mixology Platform
   ══════════════════════════════════════════════════════════════════════════ */

// ─── DESIGN TOKENS (6 THEMES) ────────────────────────────────────────────────
const T = {
  night: {
    id:"night",     label:"🌙 Night",
    bg:"radial-gradient(ellipse at 18% 60%, #150b2a 0%, #080810 52%, #0a0e1e 100%)",
    surface:"rgba(14,8,24,0.92)", border:"rgba(201,168,76,0.16)",
    gold:"#C9A84C", goldRgb:"201,168,76", goldSoft:"rgba(201,168,76,0.18)",
    copper:"#B07340", text:"#F5EDD8",
    textMuted:"rgba(245,237,216,0.50)", textSub:"rgba(245,237,216,0.30)",
    nav:"rgba(5,4,11,0.96)", card:"rgba(12,7,22,0.88)",
    input:"rgba(255,255,255,0.05)", inpBdr:"rgba(201,168,76,0.25)",
    tag:"rgba(201,168,76,0.12)", glassStr:"rgba(255,255,255,0.40)",
  },
  day: {
    id:"day",       label:"☀️ Day",
    bg:"radial-gradient(ellipse at 28% 20%, #fffbf5 0%, #f2e8d8 50%, #e4d4bc 100%)",
    surface:"rgba(255,250,240,0.95)", border:"rgba(140,96,28,0.18)",
    gold:"#8A6518", goldRgb:"138,101,24", goldSoft:"rgba(138,101,24,0.16)",
    copper:"#8B4513", text:"#1A1008",
    textMuted:"rgba(26,16,8,0.55)", textSub:"rgba(26,16,8,0.32)",
    nav:"rgba(252,246,238,0.98)", card:"rgba(255,252,244,0.94)",
    input:"rgba(26,16,8,0.04)", inpBdr:"rgba(138,101,24,0.22)",
    tag:"rgba(138,101,24,0.10)", glassStr:"rgba(50,30,10,0.32)",
  },
  summer: {
    id:"summer",    label:"🌅 Estate",
    bg:"radial-gradient(ellipse at 50% 95%, #FF6B35 0%, #C4183C 20%, #0E0814 62%, #0A0E1E 100%)",
    surface:"rgba(28,8,18,0.92)", border:"rgba(255,140,60,0.2)",
    gold:"#FFB347", goldRgb:"255,179,71", goldSoft:"rgba(255,179,71,0.18)",
    copper:"#FF6B35", text:"#FFF5E0",
    textMuted:"rgba(255,245,224,0.52)", textSub:"rgba(255,245,224,0.30)",
    nav:"rgba(10,5,10,0.97)", card:"rgba(28,10,18,0.88)",
    input:"rgba(255,179,71,0.05)", inpBdr:"rgba(255,179,71,0.28)",
    tag:"rgba(255,179,71,0.12)", glassStr:"rgba(255,220,160,0.38)",
  },
  winter: {
    id:"winter",    label:"❄️ Inverno",
    bg:"radial-gradient(ellipse at 50% 18%, #162235 0%, #070918 50%, #030810 100%)",
    surface:"rgba(8,12,24,0.92)", border:"rgba(168,216,240,0.16)",
    gold:"#A8D8F0", goldRgb:"168,216,240", goldSoft:"rgba(168,216,240,0.15)",
    copper:"#7EC8E3", text:"#E8F4F8",
    textMuted:"rgba(232,244,248,0.52)", textSub:"rgba(232,244,248,0.30)",
    nav:"rgba(4,6,14,0.97)", card:"rgba(8,12,22,0.90)",
    input:"rgba(168,216,240,0.05)", inpBdr:"rgba(168,216,240,0.22)",
    tag:"rgba(168,216,240,0.10)", glassStr:"rgba(200,230,255,0.40)",
  },
  halloween: {
    id:"halloween", label:"🎃 Halloween",
    bg:"radial-gradient(ellipse at 40% 60%, #2D0A3A 0%, #0F0510 55%, #180408 100%)",
    surface:"rgba(20,5,28,0.92)", border:"rgba(255,107,0,0.18)",
    gold:"#FF6B00", goldRgb:"255,107,0", goldSoft:"rgba(255,107,0,0.15)",
    copper:"#CC2200", text:"#FFE8D0",
    textMuted:"rgba(255,232,208,0.52)", textSub:"rgba(255,232,208,0.30)",
    nav:"rgba(10,3,14,0.97)", card:"rgba(18,5,24,0.88)",
    input:"rgba(255,107,0,0.05)", inpBdr:"rgba(255,107,0,0.22)",
    tag:"rgba(255,107,0,0.12)", glassStr:"rgba(255,200,150,0.35)",
  },
  christmas: {
    id:"christmas", label:"🎄 Natale",
    bg:"radial-gradient(ellipse at 30% 40%, #0D2018 0%, #050D0A 55%, #180808 100%)",
    surface:"rgba(5,12,8,0.92)", border:"rgba(255,215,0,0.18)",
    gold:"#FFD700", goldRgb:"255,215,0", goldSoft:"rgba(255,215,0,0.15)",
    copper:"#CC0000", text:"#FFF8E8",
    textMuted:"rgba(255,248,232,0.52)", textSub:"rgba(255,248,232,0.30)",
    nav:"rgba(3,8,5,0.97)", card:"rgba(5,12,8,0.90)",
    input:"rgba(255,215,0,0.04)", inpBdr:"rgba(255,215,0,0.20)",
    tag:"rgba(255,215,0,0.10)", glassStr:"rgba(255,230,150,0.35)",
  },
};

// ─── GLASS DEFINITIONS ───────────────────────────────────────────────────────
const GLASSES = {
  martini:     {id:"martini",     name:"Martini",    emoji:"🍸", viewBox:"0 0 120 185", capacity:90,
    bowlPts:"8,22 112,22 60,148",  stemD:"M60,148 L60,170", baseD:"M40,170 L80,170 L82,175 L38,175 Z", rimY:24, bottomY:146, cx:60},
  highball:    {id:"highball",    name:"Highball",   emoji:"🥤", viewBox:"0 0 100 205", capacity:250,
    bowlPts:"16,15 84,15 80,192 20,192", stemD:"", baseD:"", rimY:17, bottomY:190, cx:50},
  oldfashioned:{id:"oldfashioned",name:"Rocks",      emoji:"🥃", viewBox:"0 0 110 125", capacity:120,
    bowlPts:"12,12 98,12 94,118 16,118",  stemD:"", baseD:"", rimY:14, bottomY:116, cx:55},
  wine:        {id:"wine",        name:"Wine/Spritz",emoji:"🍷", viewBox:"0 0 120 200", capacity:200,
    bowlPts:"22,18 98,18 108,78 78,132 42,132 12,78", stemD:"M60,132 L60,168", baseD:"M38,168 L82,168 L84,173 L36,173 Z", rimY:20, bottomY:130, cx:60},
  coupe:       {id:"coupe",       name:"Coupe",      emoji:"🥂", viewBox:"0 0 130 195", capacity:140,
    bowlPts:"8,48 122,48 105,118 68,136 62,136 25,118", stemD:"M65,136 L65,168", baseD:"M44,168 L86,168 L88,173 L42,173 Z", rimY:50, bottomY:134, cx:65},
  margarita:   {id:"margarita",   name:"Margarita",  emoji:"🍹", viewBox:"0 0 150 200", capacity:210,
    bowlPts:"5,18 145,18 116,108 88,132 62,132 34,108", stemD:"M75,132 L75,168", baseD:"M53,168 L97,168 L99,173 L51,173 Z", rimY:20, bottomY:130, cx:75},
};

// ─── COCKTAIL DATABASE ────────────────────────────────────────────────────────
const COCKTAILS = [
  {id:1, name:"Negroni",         cat:"Aperitivo",    glass:"oldfashioned", abv:25, diff:1, time:3,  cal:184, year:1919, origin:"Firenze, Italia",
   desc:"Il re degli aperitivi italiani. Amaro, aromatico, senza compromessi. Un equilibrio perfetto di tre forze opposte.",
   method:"Metti ghiaccio nel bicchiere. Versa gin, Campari e vermut. Mescola con cura. Guarnisci.",
   color:"#C0392B", gradient:"135deg,#7B1818,#C0392B,#E74C3C",
   ings:[{name:"Gin",amount:30,color:"rgba(210,235,255,0.6)"},{name:"Campari",amount:30,color:"#C0392B"},{name:"Vermut Rosso",amount:30,color:"#8B2020"}],
   garnish:"Scorza d'arancia", tags:["amaro","aperitivo","classico","stirred"]},
  {id:2, name:"Aperol Spritz",   cat:"Aperitivo",    glass:"wine",         abv:11, diff:1, time:2,  cal:148, year:2003, origin:"Veneto, Italia",
   desc:"L'icona dell'aperitivo moderno. Fresco, vivace, irresistibile. Il cocktail più fotografato al mondo.",
   method:"Riempi il calice con ghiaccio. Aggiungi Aperol, poi Prosecco e infine soda. Non mescolare eccessivamente.",
   color:"#E67E22", gradient:"135deg,#C35000,#E67E22,#F39C12",
   ings:[{name:"Aperol",amount:60,color:"#E67E22"},{name:"Prosecco",amount:90,color:"rgba(255,248,220,0.7)"},{name:"Soda",amount:30,color:"rgba(210,235,255,0.5)"}],
   garnish:"Fetta d'arancia", tags:["fresco","aperitivo","frizzante","easy"]},
  {id:3, name:"Mojito",          cat:"Longdrink",    glass:"highball",     abv:12, diff:2, time:5,  cal:168, year:1920, origin:"L'Avana, Cuba",
   desc:"Cuba in un bicchiere. Rum bianco, menta fresca, lime e zucchero di canna: un'estate senza fine.",
   method:"Pesta menta con zucchero e lime. Aggiungi rum e ghiaccio tritato. Completa con soda. Garnish generoso.",
   color:"#27AE60", gradient:"135deg,#145A32,#27AE60,#52BE80",
   ings:[{name:"Rum Bianco",amount:50,color:"rgba(210,235,255,0.5)"},{name:"Lime",amount:25,color:"#A8D000"},{name:"Zucchero",amount:10,color:"rgba(255,252,210,0.7)"},{name:"Soda",amount:100,color:"rgba(210,235,255,0.45)"}],
   garnish:"Menta + Lime", tags:["fresco","menta","tropicale","shaken"]},
  {id:4, name:"Old Fashioned",   cat:"Whisky",       glass:"oldfashioned", abv:35, diff:2, time:4,  cal:196, year:1806, origin:"Louisville, Kentucky",
   desc:"Il più antico dei classici. Bourbon, bitter, zucchero. L'essenza pura del cocktail senza orpelli.",
   method:"Sciogli zucchero con bitter. Aggiungi bourbon e ghiaccio. Mescola 30 secondi. Guarnisci con scorza.",
   color:"#A0522D", gradient:"135deg,#4A1E08,#8B4513,#C68642",
   ings:[{name:"Bourbon",amount:60,color:"#C07830"},{name:"Angostura",amount:3,color:"#6B1010"},{name:"Zucchero",amount:5,color:"rgba(255,252,210,0.7)"}],
   garnish:"Scorza arancia + Ciliegia", tags:["whiskey","amaro","classico","stirred"]},
  {id:5, name:"Espresso Martini",cat:"After Dinner", glass:"martini",      abv:18, diff:2, time:5,  cal:220, year:1983, origin:"Londra, UK",
   desc:"La rivoluzione del dopo cena. Energia e stile in un bicchiere. Creato da Dick Bradsell per una supermodella.",
   method:"Shaker con ghiaccio. Aggiungi vodka, Kahlúa e espresso. Agita vigorosamente. Versa doppio colino.",
   color:"#2C1000", gradient:"135deg,#0A0500,#3D1A00,#6B3010",
   ings:[{name:"Vodka",amount:50,color:"rgba(210,235,255,0.4)"},{name:"Kahlúa",amount:30,color:"#1A0800"},{name:"Espresso",amount:30,color:"#0A0400"}],
   garnish:"3 chicchi di caffè", tags:["caffè","dolce","after dinner","shaken"]},
  {id:6, name:"Margarita",       cat:"Tequila",      glass:"margarita",    abv:20, diff:2, time:4,  cal:162, year:1938, origin:"Messico",
   desc:"Il manifesto della mixology messicana. Tequila, triple sec, lime. L'equilibrio tra forza e freschezza.",
   method:"Bagna il bordo con sale. Shaker con ghiaccio: tequila, triple sec, lime. Agita bene. Versa.",
   color:"#D4B800", gradient:"135deg,#7A6200,#D4B800,#F0E060",
   ings:[{name:"Tequila Blanco",amount:50,color:"rgba(255,248,200,0.55)"},{name:"Triple Sec",amount:25,color:"rgba(255,220,80,0.5)"},{name:"Lime",amount:25,color:"#A8D000"}],
   garnish:"Sale + Lime", tags:["tequila","agrumato","classico","shaken"]},
  {id:7, name:"Gin Tonic",       cat:"Longdrink",    glass:"highball",     abv:10, diff:1, time:2,  cal:115, year:1857, origin:"India Britannica",
   desc:"La semplicità elevata ad arte. Gin premium e acqua tonica premium. Infinitamente personalizzabile.",
   method:"Riempi il bicchiere con ghiaccio. Versa gin. Aggiungi tonica fredda versando sul dorso del cucchiaio.",
   color:"#87CEEB", gradient:"135deg,#3060A0,#6090C8,#A8D8F0",
   ings:[{name:"Gin Premium",amount:50,color:"rgba(200,228,255,0.55)"},{name:"Acqua Tonica",amount:150,color:"rgba(210,235,255,0.45)"}],
   garnish:"Lime + Botaniche", tags:["fresco","botanico","leggero","easy"]},
  {id:8, name:"Cosmopolitan",    cat:"Contemporary", glass:"martini",      abv:20, diff:2, time:4,  cal:175, year:1988, origin:"New York, USA",
   desc:"Il simbolo di un'era. Rosa, elegante, urban. L'iconico cocktail che ha definito gli anni '90.",
   method:"Shaker con ghiaccio: vodka citrus, triple sec, cranberry, lime. Agita bene. Doppio colino.",
   color:"#FF1493", gradient:"135deg,#8B0040,#D40070,#FF69B4",
   ings:[{name:"Vodka Citrus",amount:40,color:"rgba(210,235,255,0.4)"},{name:"Triple Sec",amount:15,color:"rgba(255,220,80,0.5)"},{name:"Cranberry",amount:30,color:"#C01040"},{name:"Lime",amount:15,color:"#A8D000"}],
   garnish:"Scorza di lime", tags:["dolce","agrumato","rosa","shaken"]},
  {id:9, name:"Whisky Sour",     cat:"Sour",         glass:"coupe",        abv:22, diff:2, time:5,  cal:175, year:1870, origin:"USA",
   desc:"Il progenitore di tutti i sour. Bourbon, limone, zucchero e albume d'uovo per una schiuma vellutata.",
   method:"Dry shake (senza ghiaccio) tutti gli ingredienti. Poi agita con ghiaccio. Doppio colino.",
   color:"#E8B850", gradient:"135deg,#8B6000,#C89020,#E8B850",
   ings:[{name:"Bourbon",amount:60,color:"#C07830"},{name:"Limone",amount:30,color:"#FFE060"},{name:"Sciroppo",amount:20,color:"rgba(255,248,200,0.7)"},{name:"Albume",amount:20,color:"rgba(255,252,245,0.6)"}],
   garnish:"Scorza limone + Angostura", tags:["sour","whiskey","cremoso","shaken"]},
  {id:10,name:"Daiquiri",        cat:"Classic",      glass:"coupe",        abv:20, diff:1, time:3,  cal:145, year:1898, origin:"Santiago de Cuba",
   desc:"Tre ingredienti, perfezione infinita. Il cocktail prediletto di Ernest Hemingway.",
   method:"Shaker con ghiaccio: rum, lime, zucchero. Agita vigorosamente. Versa doppio colino.",
   color:"#F0E8A0", gradient:"135deg,#8B8000,#C8B400,#F0E8A0",
   ings:[{name:"Rum Bianco",amount:60,color:"rgba(210,235,255,0.5)"},{name:"Lime",amount:30,color:"#A8D000"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Fetta di lime", tags:["rum","sour","classico","shaken"]},
  {id:11,name:"Moscow Mule",     cat:"Longdrink",    glass:"highball",     abv:10, diff:1, time:3,  cal:120, year:1941, origin:"USA",
   desc:"Vodka, ginger beer e lime in un iconico bicchiere di rame. Fresco, piccante, inconfondibile.",
   method:"Riempi il mug con ghiaccio. Aggiungi vodka e lime. Completa con ginger beer. Garnish.",
   color:"#A8D060", gradient:"135deg,#4A7000,#7AA030,#A8D060",
   ings:[{name:"Vodka",amount:50,color:"rgba(210,235,255,0.4)"},{name:"Lime",amount:25,color:"#A8D000"},{name:"Ginger Beer",amount:100,color:"rgba(255,240,180,0.55)"}],
   garnish:"Lime + Zenzero", tags:["fresco","vodka","piccante","easy"]},
  {id:12,name:"Pornstar Martini",cat:"Contemporary", glass:"martini",      abv:16, diff:2, time:5,  cal:220, year:2002, origin:"Londra, UK",
   desc:"Il cocktail più ordinato al mondo. Frutto della passione, vaniglia, vodka. Seguito da shot di Prosecco.",
   method:"Shaker con ghiaccio: vodka vaniglia, passoa, frutto della passione, lime, sciroppo. Agita. Colino doppio.",
   color:"#FF8C00", gradient:"135deg,#8B4000,#CC6600,#FF8C00",
   ings:[{name:"Vodka Vaniglia",amount:40,color:"rgba(220,235,255,0.5)"},{name:"Passoa",amount:20,color:"#FF4500"},{name:"Passion Fruit",amount:30,color:"#FF8C00"},{name:"Lime",amount:15,color:"#A8D000"}],
   garnish:"1/2 frutto della passione + shot Prosecco", tags:["dolce","tropicale","vodka","shaken"]},
  // ── SPRINT 2: 23 nuovi cocktail ──────────────────────────────────────────
  {id:13,name:"Tom Collins",    cat:"Longdrink",   glass:"highball",     abv:11,diff:1,time:3, cal:120,year:1876,origin:"Londra, UK",
   desc:"Il gin fizz più famoso. Fresco, agrumato, con la soda che esalta ogni botanica.",
   method:"Agita gin, limone e sciroppo. Versa su ghiaccio. Completa con soda. Garnish.",
   color:"#C8E890",gradient:"135deg,#4A5A00,#8B9800,#C8E890",
   ings:[{name:"Gin London Dry",amount:50,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:30,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"},{name:"Soda Water",amount:80,color:"rgba(215,235,255,0.45)"}],
   garnish:"Fetta limone + Ciliegia",tags:["gin","fresco","fizz","easy"]},
  {id:14,name:"Piña Colada",    cat:"Tropical",    glass:"highball",     abv:13,diff:1,time:4, cal:260,year:1954,origin:"Puerto Rico",
   desc:"Il cocktail tropicale per eccellenza. Rum, cocco e ananas. Spiagge caraibiche in ogni sorso.",
   method:"Frulla rum, crema di cocco e succo d'ananas con ghiaccio tritato. Versa e guarnisci.",
   color:"#FFFEF0",gradient:"135deg,#4A4A00,#C8B800,#FFFEF0",
   ings:[{name:"Rum Bianco",amount:50,color:"rgba(210,235,255,0.5)"},{name:"Cocco",amount:30,color:"rgba(255,252,240,0.8)"},{name:"Ananas",amount:60,color:"#FFD700"}],
   garnish:"Fetta ananas + Ciliegia",tags:["rum","tropicale","dolce","blended"]},
  {id:15,name:"Tequila Sunrise",cat:"Longdrink",   glass:"highball",     abv:14,diff:1,time:3, cal:175,year:1972,origin:"California, USA",
   desc:"Il cocktail che imita un'alba messicana. Tequila, arancia e granatina. Visivo e delizioso.",
   method:"Versa tequila e arancia su ghiaccio. Aggiungi la granatina sul fondo senza mescolare.",
   color:"#FF6B00",gradient:"135deg,#8B0000,#FF4500,#FF8C00",
   ings:[{name:"Tequila Blanco",amount:50,color:"rgba(255,248,200,0.55)"},{name:"Arancia",amount:100,color:"#FF8C00"},{name:"Granatina",amount:15,color:"#8B0000"}],
   garnish:"Fetta arancia + Ciliegia",tags:["tequila","tropicale","visivo","easy"]},
  {id:16,name:"Cuba Libre",     cat:"Longdrink",   glass:"highball",     abv:10,diff:1,time:2, cal:120,year:1900,origin:"L'Avana, Cuba",
   desc:"Rum, cola e lime. Tres simple, tres perfecto. Il cocktail più venduto al mondo.",
   method:"Premi il lime sul ghiaccio. Versa rum. Completa con cola fredda. Mescola delicatamente.",
   color:"#1A0800",gradient:"135deg,#0A0500,#3A1500,#C07000",
   ings:[{name:"Rum Bianco",amount:50,color:"rgba(210,235,255,0.5)"},{name:"Cola",amount:100,color:"rgba(15,6,0,0.95)"},{name:"Lime",amount:15,color:"#A8D000"}],
   garnish:"Fetta lime",tags:["rum","cola","easy","longdrink"]},
  {id:17,name:"Sex on the Beach",cat:"Tropical",  glass:"highball",     abv:12,diff:1,time:3, cal:185,year:1987,origin:"Florida, USA",
   desc:"Nome audace, sapore fruttato. Vodka, pesca e cranberry per un cocktail estivo irresistibile.",
   method:"Versa vodka e succo di pesca su ghiaccio. Aggiungi cranberry delicatamente.",
   color:"#FF4500",gradient:"135deg,#8B0000,#CC2200,#FF6B35",
   ings:[{name:"Vodka",amount:40,color:"rgba(220,240,255,0.4)"},{name:"Arancia",amount:40,color:"#FF8C00"},{name:"Cranberry",amount:40,color:"#C01040"}],
   garnish:"Fetta arancia",tags:["vodka","fruttato","tropicale","easy"]},
  {id:18,name:"Dark 'n' Stormy", cat:"Longdrink",  glass:"highball",     abv:14,diff:1,time:2, cal:140,year:1806,origin:"Bermuda",
   desc:"Rum scuro e ginger beer. La tempesta delle Bermuda in un bicchiere. Piccante e intenso.",
   method:"Riempi con ghiaccio e ginger beer. Versa il rum scuro galleggiante sopra con cura.",
   color:"#6B3000",gradient:"135deg,#2A1000,#6B3000,#A86020",
   ings:[{name:"Rum Scuro",amount:60,color:"#6B3000"},{name:"Ginger Beer",amount:100,color:"rgba(255,240,180,0.55)"}],
   garnish:"Fetta lime",tags:["rum","piccante","ginger","easy"]},
  {id:19,name:"Paloma",          cat:"Tequila",    glass:"highball",     abv:12,diff:1,time:3, cal:130,year:1950,origin:"Messico",
   desc:"Il cocktail più bevuto in Messico. Tequila e pompelmo: più popolare della Margarita in patria.",
   method:"Bagna il bordo con sale. Versa tequila e lime su ghiaccio. Completa con soda al pompelmo.",
   color:"#FFB0B0",gradient:"135deg,#8B3A3A,#CC5050,#FFB0B0",
   ings:[{name:"Tequila Blanco",amount:50,color:"rgba(255,248,200,0.55)"},{name:"Pompelmo",amount:80,color:"#FFB0B0"},{name:"Lime",amount:15,color:"#A8D000"}],
   garnish:"Sale + Fetta pompelmo",tags:["tequila","agrumato","messicano","easy"]},
  {id:20,name:"French 75",       cat:"Classic",    glass:"coupe",        abv:14,diff:2,time:4, cal:145,year:1915,origin:"Parigi, Francia",
   desc:"Il cocktail della Prima Guerra Mondiale. Gin, champagne e agrumi. Potente come un cannone da 75mm.",
   method:"Agita gin, limone e sciroppo con ghiaccio. Versa nella coupe. Completa con Prosecco.",
   color:"#F0E8D0",gradient:"135deg,#6A5800,#B09000,#F0E8D0",
   ings:[{name:"Gin London Dry",amount:30,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:15,color:"#FFE060"},{name:"Sciroppo",amount:10,color:"rgba(255,248,200,0.7)"},{name:"Prosecco",amount:60,color:"rgba(255,248,215,0.65)"}],
   garnish:"Scorza limone",tags:["gin","champagne","classico","elegante"]},
  {id:21,name:"Bellini",         cat:"Aperitivo",  glass:"wine",         abv:7, diff:1,time:2, cal:90, year:1948,origin:"Venezia, Italia",
   desc:"Harry's Bar di Venezia, 1948. Prosecco e purea di pesca bianca. Il brunch cocktail per eccellenza.",
   method:"Versa la purea di pesca. Aggiungi il Prosecco freddo mescolando con delicatezza.",
   color:"#FFD0A0",gradient:"135deg,#6A3A00,#CC7030,#FFD0A0",
   ings:[{name:"Prosecco",amount:100,color:"rgba(255,248,215,0.65)"},{name:"Purea Pesca",amount:30,color:"#FFB060"}],
   garnish:"Fetta pesca",tags:["prosecco","fruttato","brunch","italiano"]},
  {id:22,name:"Kir Royale",      cat:"Aperitivo",  glass:"coupe",        abv:12,diff:1,time:2, cal:100,year:1945,origin:"Borgogna, Francia",
   desc:"Il gioiello della Borgogna. Crème de cassis e Champagne. Semplice ed elegantissimo.",
   method:"Versa un cucchiaino di cassis. Aggiungi il Prosecco freddo lentamente lungo la parete.",
   color:"#8B0050",gradient:"135deg,#3A0028,#8B0050,#C060A0",
   ings:[{name:"Prosecco",amount:100,color:"rgba(255,248,215,0.65)"},{name:"Cassis",amount:15,color:"#4A0030"}],
   garnish:"Mora o Ribes",tags:["champagne","fruttato","elegante","easy"]},
  {id:23,name:"White Russian",   cat:"After Dinner",glass:"oldfashioned",abv:22,diff:1,time:2, cal:280,year:1965,origin:"USA",
   desc:"Vodka, Kahlúa e panna. Il cocktail del Drugo. Cremoso, dolce, assolutamente indulgente.",
   method:"Riempi con ghiaccio. Versa vodka e Kahlúa. Float di panna fresca sopra.",
   color:"#C89060",gradient:"135deg,#0A0500,#3D1A00,#C89060",
   ings:[{name:"Vodka",amount:50,color:"rgba(220,240,255,0.4)"},{name:"Kahlúa",amount:20,color:"#1A0800"},{name:"Panna",amount:30,color:"rgba(255,250,245,0.85)"}],
   garnish:"Nessuno",tags:["vodka","caffè","cremoso","after dinner"]},
  {id:24,name:"Black Russian",   cat:"After Dinner",glass:"oldfashioned",abv:28,diff:1,time:2, cal:180,year:1949,origin:"Bruxelles, Belgio",
   desc:"La versione dark senza panna. Vodka e Kahlúa, diretto e senza compromessi.",
   method:"Riempi il bicchiere con ghiaccio. Versa vodka e poi Kahlúa.",
   color:"#0A0400",gradient:"135deg,#050200,#1A0800,#3D1A00",
   ings:[{name:"Vodka",amount:50,color:"rgba(220,240,255,0.4)"},{name:"Kahlúa",amount:20,color:"#1A0800"}],
   garnish:"Nessuno",tags:["vodka","caffè","secco","easy"]},
  {id:25,name:"Amaretto Sour",   cat:"Sour",        glass:"coupe",        abv:15,diff:2,time:4, cal:165,year:1970,origin:"USA",
   desc:"L'amaretto italiano incontra la tradizione sour americana. Dolce, acido, vellutato.",
   method:"Dry shake con albume. Poi agita con ghiaccio. Doppio colino nella coupe.",
   color:"#C08040",gradient:"135deg,#5A3000,#9A5808,#C08040",
   ings:[{name:"Amaretto",amount:60,color:"#A06818"},{name:"Limone",amount:30,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Scorza arancia + Angostura",tags:["amaretto","sour","dolce","cremoso"]},
  {id:26,name:"New York Sour",   cat:"Sour",        glass:"coupe",        abv:20,diff:3,time:6, cal:195,year:1883,origin:"Chicago, USA",
   desc:"Whisky Sour con float di vino rosso. Due strati di sapore che si incontrano in ogni sorso.",
   method:"Agita bourbon, limone e sciroppo. Versa nella coupe. Float di vino rosso sul cucchiaino.",
   color:"#8B1010",gradient:"135deg,#3A0808,#8B1010,#C84020",
   ings:[{name:"Bourbon",amount:60,color:"#C07830"},{name:"Limone",amount:30,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"},{name:"Vino Rosso",amount:20,color:"#6B0010"}],
   garnish:"Scorza limone",tags:["whiskey","sour","float","artigianale"]},
  {id:27,name:"Lemon Drop",      cat:"Contemporary",glass:"martini",      abv:20,diff:2,time:4, cal:155,year:1970,origin:"San Francisco, USA",
   desc:"Vodka, triple sec e limone. Un martini agrumato e limpido. Rim di zucchero obbligatorio.",
   method:"Bagna il bordo con zucchero. Agita vodka, triple sec e limone. Doppio colino.",
   color:"#FFE080",gradient:"135deg,#8B7000,#C8A800,#FFE080",
   ings:[{name:"Vodka",amount:50,color:"rgba(220,240,255,0.4)"},{name:"Triple Sec",amount:20,color:"rgba(255,220,80,0.5)"},{name:"Limone",amount:25,color:"#FFE060"}],
   garnish:"Zucchero + Scorza limone",tags:["vodka","agrumato","dolce","shaken"]},
  {id:28,name:"Sidecar",         cat:"Classic",     glass:"coupe",        abv:25,diff:2,time:4, cal:165,year:1922,origin:"Parigi, Francia",
   desc:"Cognac, triple sec e limone. Un classico del dopoguerra parigino. Elegante e raffinato.",
   method:"Bagna il bordo con zucchero. Agita cognac, triple sec e limone. Doppio colino.",
   color:"#C8A860",gradient:"135deg,#5A4000,#9A7010,#C8A860",
   ings:[{name:"Cognac",amount:50,color:"#C07830"},{name:"Triple Sec",amount:20,color:"rgba(255,220,80,0.5)"},{name:"Limone",amount:20,color:"#FFE060"}],
   garnish:"Zucchero + Scorza limone",tags:["cognac","sour","classico","parigino"]},
  {id:29,name:"Aviation",        cat:"Classic",     glass:"coupe",        abv:20,diff:3,time:5, cal:160,year:1916,origin:"New York, USA",
   desc:"Il cocktail color cielo. Gin, maraschino, violette e limone. Un capolavoro estetico e gustativo.",
   method:"Agita tutti gli ingredienti con ghiaccio. Doppio colino nella coupe.",
   color:"#8080D0",gradient:"135deg,#202070,#4040A0,#8080D0",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Maraschino",amount:15,color:"rgba(255,180,200,0.6)"},{name:"Violette",amount:7,color:"#6060B0"},{name:"Limone",amount:15,color:"#FFE060"}],
   garnish:"Ciliegia Luxardo",tags:["gin","floreale","viola","artigianale"]},
  {id:30,name:"Last Word",       cat:"Classic",     glass:"coupe",        abv:25,diff:2,time:4, cal:170,year:1916,origin:"Detroit, USA",
   desc:"Parti uguali di quattro ingredienti perfetti. L'equilibrio assoluto della mixology.",
   method:"Agita parti uguali di tutti gli ingredienti con ghiaccio. Doppio colino.",
   color:"#60A040",gradient:"135deg,#204010,#408030,#60A040",
   ings:[{name:"Gin London Dry",amount:22,color:"rgba(210,235,255,0.6)"},{name:"Chartreuse",amount:22,color:"#7AC000"},{name:"Maraschino",amount:22,color:"rgba(255,180,200,0.6)"},{name:"Lime",amount:22,color:"#A8D000"}],
   garnish:"Scorza lime",tags:["gin","verde","equilibrio","artigianale"]},
  {id:31,name:"Clover Club",     cat:"Classic",     glass:"coupe",        abv:18,diff:3,time:6, cal:175,year:1908,origin:"Filadelfia, USA",
   desc:"Il cocktail rosa vellutato del Prohibition. Gin, lampone e albume per una schiuma preziosa.",
   method:"Dry shake gin, sciroppo lampone, limone e albume. Poi agita con ghiaccio. Doppio colino.",
   color:"#FF80A0",gradient:"135deg,#600030,#C02060,#FF80A0",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Sciroppo Lampone",amount:15,color:"#C02060"},{name:"Limone",amount:20,color:"#FFE060"}],
   garnish:"Lamponi freschi",tags:["gin","rosa","sour","cremoso"]},
  {id:32,name:"Blue Lagoon",     cat:"Contemporary",glass:"highball",     abv:12,diff:1,time:3, cal:145,year:1972,origin:"Europa",
   desc:"Elettrico, visivo, iconico degli anni '80. Vodka e Blue Curaçao. Il cocktail più colorato.",
   method:"Riempi con ghiaccio. Versa vodka e Blue Curaçao. Completa con limonata. Non mescolare.",
   color:"#0080FF",gradient:"135deg,#002080,#0040C0,#0080FF",
   ings:[{name:"Vodka",amount:40,color:"rgba(220,240,255,0.4)"},{name:"Blue Curaçao",amount:20,color:"#0055CC"},{name:"Limonata",amount:80,color:"rgba(255,248,200,0.6)"}],
   garnish:"Fetta limone",tags:["vodka","blu","colorato","visivo"]},
  {id:33,name:"Harvey Wallbanger",cat:"Longdrink",  glass:"highball",     abv:12,diff:1,time:3, cal:180,year:1952,origin:"California, USA",
   desc:"Il classico degli anni '70. Vodka, arancia e Galliano galleggiante. Dal nome leggendario.",
   method:"Riempi con ghiaccio. Versa vodka e arancia. Float di Galliano con cucchiaio.",
   color:"#FF9520",gradient:"135deg,#5A3000,#C06000,#FF9520",
   ings:[{name:"Vodka",amount:40,color:"rgba(220,240,255,0.4)"},{name:"Arancia",amount:80,color:"#FF8C00"},{name:"Galliano",amount:15,color:"#FFD700"}],
   garnish:"Fetta arancia",tags:["vodka","arancia","classico","anni70"]},
  {id:34,name:"Singapore Sling", cat:"Tropical",    glass:"highball",     abv:14,diff:3,time:6, cal:200,year:1915,origin:"Raffles Hotel, Singapore",
   desc:"Il capolavoro coloniale del Raffles Hotel. Gin, Cherry Heering e una miscela esotica leggendaria.",
   method:"Agita gin, cherry brandy, succo limone e ananas con ghiaccio. Completa con soda.",
   color:"#FF4060",gradient:"135deg,#600020,#CC2040,#FF4060",
   ings:[{name:"Gin London Dry",amount:40,color:"rgba(210,235,255,0.6)"},{name:"Cherry Brandy",amount:20,color:"#8B0030"},{name:"Ananas",amount:40,color:"#FFD700"},{name:"Soda Water",amount:40,color:"rgba(215,235,255,0.45)"}],
   garnish:"Ananas + Ciliegia",tags:["gin","tropicale","complesso","storico"]},
  {id:35,name:"Virgin Mojito",   cat:"Analcolico",  glass:"highball",     abv:0, diff:1,time:4, cal:80, year:2000,origin:"Internazionale",
   desc:"Tutta la freschezza del Mojito senza alcol. Menta, lime e soda per un'estate rinfrescante.",
   method:"Pesta menta con zucchero e lime. Aggiungi ghiaccio tritato. Completa con soda.",
   color:"#60C070",gradient:"135deg,#204010,#408030,#60C070",
   ings:[{name:"Lime",amount:30,color:"#A8D000"},{name:"Menta",amount:8,color:"#2E8B57"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"},{name:"Soda Water",amount:100,color:"rgba(215,235,255,0.45)"}],
   garnish:"Menta + Lime",tags:["analcolico","fresco","menta","easy"]},
  // ── SPRINT 3: 25 nuovi cocktail (totale 60) ──────────────────────────────
  {id:36,name:"Americano",       cat:"Aperitivo",  glass:"oldfashioned",abv:11,diff:1,time:2,cal:130,year:1861,origin:"Milano, Italia",
   desc:"Il nonno del Negroni. Campari, vermut e soda: l'aperitivo che conquistò il mondo intero.",
   method:"Versa Campari e vermut su ghiaccio. Aggiungi soda. Guarnisci con scorza d'arancia.",
   color:"#C0392B",gradient:"135deg,#7B1818,#C0392B,#E74C3C",
   ings:[{name:"Campari",amount:30,color:"#C0392B"},{name:"Vermut Rosso",amount:30,color:"#8B2020"},{name:"Soda Water",amount:60,color:"rgba(215,235,255,0.45)"}],
   garnish:"Scorza arancia",tags:["amaro","aperitivo","classico","easy","italiano"]},
  {id:37,name:"Gimlet",          cat:"Classic",    glass:"coupe",       abv:22,diff:1,time:3,cal:140,year:1928,origin:"Marina Britannica",
   desc:"Gin e lime cordial. La semplicità assoluta che ha attraversato due secoli di storia.",
   method:"Agita gin, lime e sciroppo con ghiaccio. Doppio colino nella coupe raffreddata.",
   color:"#C8E890",gradient:"135deg,#4A5A00,#8B9800,#C8E890",
   ings:[{name:"Gin London Dry",amount:60,color:"rgba(210,235,255,0.6)"},{name:"Lime",amount:20,color:"#A8D000"},{name:"Sciroppo",amount:10,color:"rgba(255,248,200,0.7)"}],
   garnish:"Fetta lime",tags:["gin","agrumato","classico","easy","stirred"]},
  {id:38,name:"Bee's Knees",     cat:"Classic",    glass:"coupe",       abv:22,diff:2,time:4,cal:155,year:1921,origin:"Prohibition, USA",
   desc:"Il miele mascherava il sapore del gin di contrabbando. Ora è un capolavoro del Prohibition era.",
   method:"Agita gin, limone e miele (sciolto a caldo) con ghiaccio. Doppio colino.",
   color:"#FFE060",gradient:"135deg,#8B7000,#C8A800,#FFE060",
   ings:[{name:"Gin London Dry",amount:50,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:25,color:"#FFE060"},{name:"Sciroppo Miele",amount:20,color:"#FFA000"}],
   garnish:"Scorza limone",tags:["gin","dolce","agrumato","storico","shaken"]},
  {id:39,name:"Penicillin",      cat:"Contemporary",glass:"oldfashioned",abv:22,diff:3,time:6,cal:175,year:2005,origin:"New York, USA",
   desc:"Sam Ross, Milk & Honey 2005. Scotch, miele, zenzero e limone. Un moderno classico istantaneo.",
   method:"Agita blended scotch, limone, sciroppo miele-zenzero. Float di scotch torbato sopra.",
   color:"#C8A040",gradient:"135deg,#5A3800,#9A6808,#C8A040",
   ings:[{name:"Scotch",amount:50,color:"#A86020"},{name:"Limone",amount:25,color:"#FFE060"},{name:"Sciroppo",amount:20,color:"#FFA000"}],
   garnish:"Zenzero candito + Scorza limone",tags:["whiskey","agrumato","dolce","artigianale","contemporaneo"]},
  {id:40,name:"Paper Plane",     cat:"Contemporary",glass:"coupe",      abv:24,diff:2,time:4,cal:168,year:2008,origin:"New York, USA",
   desc:"Parti uguali di quattro ingredienti straordinari. Il cocktail più replicato degli ultimi vent'anni.",
   method:"Agita parti uguali di bourbon, Aperol, Amaro Nonino e lime. Doppio colino.",
   color:"#FF8040",gradient:"135deg,#6A2800,#C04800,#FF8040",
   ings:[{name:"Bourbon",amount:22,color:"#C07830"},{name:"Aperol",amount:22,color:"#E67E22"},{name:"Triple Sec",amount:22,color:"rgba(255,220,80,0.5)"},{name:"Lime",amount:22,color:"#A8D000"}],
   garnish:"Scorza arancia",tags:["bourbon","agrumato","amaro","artigianale","contemporaneo"]},
  {id:41,name:"Jungle Bird",     cat:"Tropical",   glass:"wine",        abv:16,diff:2,time:4,cal:180,year:1978,origin:"Kuala Lumpur, Malaysia",
   desc:"Il cocktail del Kuala Lumpur Hilton. Rum, Campari e ananas in un equilibrio tropicale perfetto.",
   method:"Agita rum, Campari, ananas, lime e sciroppo con ghiaccio. Versa su ghiaccio.",
   color:"#C03020",gradient:"135deg,#5A1010,#C03020,#FF5030",
   ings:[{name:"Rum Scuro",amount:45,color:"#6B3000"},{name:"Campari",amount:20,color:"#C0392B"},{name:"Ananas",amount:45,color:"#FFD700"},{name:"Lime",amount:15,color:"#A8D000"}],
   garnish:"Fetta ananas",tags:["rum","tropicale","amaro","artigianale","storico"]},
  {id:42,name:"Oaxacan Old Fash.",cat:"Whisky",    glass:"oldfashioned",abv:36,diff:2,time:4,cal:198,year:2007,origin:"New York, USA",
   desc:"Phil Ward, Death & Co 2007. Mezcal e tequila reposado al posto del whiskey. Fumé e complesso.",
   method:"Mescola mezcal, tequila, Angostura e agave su ghiaccio per 30 secondi. Scorza arancia.",
   color:"#A06020",gradient:"135deg,#4A2A00,#8B5018,#C08030",
   ings:[{name:"Mezcal",amount:45,color:"rgba(255,242,180,0.55)"},{name:"Tequila Blanco",amount:15,color:"rgba(255,248,200,0.55)"},{name:"Angostura",amount:3,color:"#6B1010"}],
   garnish:"Scorza arancia fiammeggiata",tags:["mezcal","affumicato","amaro","artigianale","stirred"]},
  {id:43,name:"Naked and Famous",cat:"Contemporary",glass:"coupe",     abv:24,diff:2,time:4,cal:170,year:2011,origin:"New York, USA",
   desc:"Quattro parti uguali con mezcal. Il Paper Plane con anima messicana e fumé.",
   method:"Agita parti uguali di mezcal, Aperol, Chartreuse giallo e lime con ghiaccio.",
   color:"#60A040",gradient:"135deg,#204010,#508030,#80C050",
   ings:[{name:"Mezcal",amount:22,color:"rgba(255,242,180,0.55)"},{name:"Aperol",amount:22,color:"#E67E22"},{name:"Triple Sec",amount:22,color:"rgba(255,220,80,0.5)"},{name:"Lime",amount:22,color:"#A8D000"}],
   garnish:"Scorza lime",tags:["mezcal","affumicato","agrumato","contemporaneo","artigianale"]},
  {id:44,name:"Vieux Carré",     cat:"Classic",    glass:"oldfashioned",abv:30,diff:3,time:5,cal:200,year:1938,origin:"New Orleans, USA",
   desc:"Il cocktail del French Quarter di New Orleans. Bourbon, cognac, vermut e Benedictine.",
   method:"Mescola tutti gli ingredienti con abbondante ghiaccio per 30 secondi. Versa sul ghiaccio.",
   color:"#8B4020",gradient:"135deg,#3A1808,#6B3010,#9B5028",
   ings:[{name:"Bourbon",amount:22,color:"#C07830"},{name:"Cognac",amount:22,color:"#C07830"},{name:"Vermut Rosso",amount:22,color:"#8B2020"},{name:"Angostura",amount:3,color:"#6B1010"}],
   garnish:"Scorza limone",tags:["whiskey","classico","complesso","stirred","storico"]},
  {id:45,name:"Southside",       cat:"Classic",    glass:"coupe",       abv:20,diff:2,time:4,cal:148,year:1920,origin:"Chicago, USA",
   desc:"Il Gimlet con menta. Il cocktail dei gangster di Chicago. Elegante, fresco, memorabile.",
   method:"Pesta menta. Agita gin, limone, sciroppo e menta con ghiaccio. Doppio colino.",
   color:"#A0D080",gradient:"135deg,#3A6010,#70A030,#A0D080",
   ings:[{name:"Gin London Dry",amount:50,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:25,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Menta fresca",tags:["gin","fresco","menta","classico","shaken"]},
  {id:46,name:"Corpse Reviver #2",cat:"Classic",   glass:"coupe",       abv:22,diff:2,time:4,cal:155,year:1930,origin:"Londra, UK",
   desc:"'Da consumare ogni mattina'. Gin, Cointreau, Lillet e limone. Il rimedio post-sbornia dei lord.",
   method:"Agita gin, Cointreau, Lillet Blanc, limone e Pernod. Doppio colino. Twist arancia.",
   color:"#FFD870",gradient:"135deg,#7A6000,#C0A000,#FFD870",
   ings:[{name:"Gin London Dry",amount:22,color:"rgba(210,235,255,0.6)"},{name:"Cointreau",amount:22,color:"rgba(255,215,80,0.5)"},{name:"Limone",amount:22,color:"#FFE060"},{name:"Vermut Dry",amount:22,color:"rgba(255,240,200,0.6)"}],
   garnish:"Scorza arancia",tags:["gin","agrumato","classico","storico","shaken"]},
  {id:47,name:"Ramos Gin Fizz",  cat:"Classic",    glass:"highball",    abv:10,diff:3,time:12,cal:190,year:1888,origin:"New Orleans, USA",
   desc:"Il cocktail che richiedeva 12 minuti di shaking. Gin, panna, albume e fiori d'arancio.",
   method:"Dry shake 5 min. Aggiungi ghiaccio, shaker altri 5 min. Doppio colino. Topping soda.",
   color:"#FFFFF0",gradient:"135deg,#6A6A00,#A0A000,#FFFFF0",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:15,color:"#FFE060"},{name:"Panna",amount:30,color:"rgba(255,250,245,0.85)"},{name:"Soda Water",amount:30,color:"rgba(215,235,255,0.45)"}],
   garnish:"Nessuno",tags:["gin","cremoso","classico","storico","complesso"]},
  {id:48,name:"Horse's Neck",    cat:"Longdrink",  glass:"highball",    abv:12,diff:1,time:3,cal:145,year:1890,origin:"USA",
   desc:"Bourbon, ginger beer e la spirale di scorza di limone che da il nome al cocktail.",
   method:"Appendi la spirale di limone nel bicchiere. Aggiungi bourbon su ghiaccio. Completa con ginger beer.",
   color:"#C07830",gradient:"135deg,#5A3000,#9A5800,#C07830",
   ings:[{name:"Bourbon",amount:50,color:"#C07830"},{name:"Ginger Beer",amount:100,color:"rgba(255,240,180,0.55)"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Spirale limone",tags:["whiskey","piccante","ginger","easy","longdrink"]},
  {id:49,name:"Painkiller",      cat:"Tropical",   glass:"highball",    abv:14,diff:1,time:4,cal:230,year:1971,origin:"Isole Vergini Britanniche",
   desc:"Il cocktail ufficiale dei Soggy Dollar Bar. Rum, cocco, ananas e arancia. Paradiso liquido.",
   method:"Agita rum, cocco, ananas e arancia con ghiaccio. Versa su ghiaccio tritato. Noce moscata.",
   color:"#FFB040",gradient:"135deg,#5A3800,#A07010,#FFB040",
   ings:[{name:"Rum Bianco",amount:60,color:"rgba(210,235,255,0.5)"},{name:"Cocco",amount:30,color:"rgba(255,252,240,0.8)"},{name:"Ananas",amount:40,color:"#FFD700"},{name:"Arancia",amount:30,color:"#FF8C00"}],
   garnish:"Noce moscata + Arancia",tags:["rum","tropicale","dolce","easy","caraibico"]},
  {id:50,name:"Rusty Nail",      cat:"Whisky",     glass:"oldfashioned",abv:36,diff:1,time:2,cal:195,year:1960,origin:"USA",
   desc:"Scotch e Drambuie. Il liquore scozzese al miele trasforma il whisky in qualcosa di magico.",
   method:"Versa scotch e Drambuie su un grande cubo di ghiaccio. Mescola delicatamente.",
   color:"#B07020",gradient:"135deg,#4A2A00,#8B5010,#C07828",
   ings:[{name:"Scotch",amount:50,color:"#A86020"},{name:"Kahlúa",amount:25,color:"#1A0800"}],
   garnish:"Scorza limone",tags:["whiskey","dolce","classico","easy","stirred"]},
  {id:51,name:"Bamboo",          cat:"Classic",    glass:"coupe",       abv:16,diff:1,time:3,cal:100,year:1890,origin:"Yokohama, Giappone",
   desc:"Louis Eppinger, Grand Hotel Yokohama. Sherry e vermut. Il cocktail più elegante e sobrio.",
   method:"Mescola sherry, vermut dry e angostura con ghiaccio per 30 secondi. Doppio colino.",
   color:"#E8D888",gradient:"135deg,#6A5800,#A89000,#E8D888",
   ings:[{name:"Vermut Dry",amount:45,color:"rgba(255,240,200,0.6)"},{name:"Vermut Rosso",amount:45,color:"#8B2020"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Scorza limone",tags:["classico","storico","leggero","elegante","stirred"]},
  {id:52,name:"Hanky Panky",     cat:"Classic",    glass:"coupe",       abv:24,diff:2,time:4,cal:168,year:1925,origin:"Londra, UK",
   desc:"Ada Coleman, Savoy Hotel. 'That is the real hanky-panky!' disse il cliente. Il nome nacque così.",
   method:"Mescola gin, vermut e Fernet-Branca con ghiaccio per 30 secondi. Doppio colino.",
   color:"#6B2820",gradient:"135deg,#2A1008,#5B2818,#8B4830",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Vermut Rosso",amount:45,color:"#8B2020"},{name:"Amaretto",amount:7,color:"#A06818"}],
   garnish:"Scorza arancia",tags:["gin","amaro","classico","storico","stirred","erbaceo"]},
  {id:53,name:"Toronto",         cat:"After Dinner",glass:"coupe",      abv:28,diff:2,time:4,cal:178,year:1922,origin:"Canada",
   desc:"Rye whisky e Fernet-Branca. Il cocktail canadese che mostra la complessità del whisky nordamericano.",
   method:"Mescola rye, Fernet, sciroppo e Angostura con ghiaccio. Doppio colino.",
   color:"#8B4020",gradient:"135deg,#3A1808,#6B3010,#9B5028",
   ings:[{name:"Bourbon",amount:56,color:"#C07830"},{name:"Amaretto",amount:7,color:"#A06818"},{name:"Sciroppo",amount:7,color:"rgba(255,248,200,0.7)"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Scorza arancia",tags:["whiskey","amaro","classico","complesso","stirred","erbaceo"]},
  {id:54,name:"Bicicletta",      cat:"Aperitivo",  glass:"wine",        abv:10,diff:1,time:2,cal:120,year:1950,origin:"Italia",
   desc:"Campari, vino bianco secco e soda. Il rivale dell'Aperol Spritz. Milanese, autentico, perfetto.",
   method:"Versa Campari e vino bianco su ghiaccio in calice. Aggiungi soda. Scorza di limone.",
   color:"#C04020",gradient:"135deg,#6A1808,#C03020,#E06040",
   ings:[{name:"Campari",amount:60,color:"#C0392B"},{name:"Vermut Dry",amount:60,color:"rgba(255,240,200,0.6)"},{name:"Soda Water",amount:30,color:"rgba(215,235,255,0.45)"}],
   garnish:"Scorza limone",tags:["campari","aperitivo","italiano","fresco","easy"]},
  {id:55,name:"New Orleans Buck", cat:"Longdrink", glass:"highball",    abv:12,diff:1,time:3,cal:135,year:1900,origin:"New Orleans, USA",
   desc:"Gin, arancia fresca, lime e ginger beer. Il Buck classico della città del jazz.",
   method:"Premi lime e arancia sul ghiaccio. Aggiungi gin. Completa con ginger beer fredda.",
   color:"#FF8040",gradient:"135deg,#5A2800,#B06010,#FF8040",
   ings:[{name:"Gin London Dry",amount:50,color:"rgba(210,235,255,0.6)"},{name:"Arancia",amount:30,color:"#FF8C00"},{name:"Lime",amount:15,color:"#A8D000"},{name:"Ginger Beer",amount:80,color:"rgba(255,240,180,0.55)"}],
   garnish:"Fetta arancia",tags:["gin","piccante","ginger","agrumato","easy","longdrink"]},
  {id:56,name:"Tequila Sour",    cat:"Sour",       glass:"coupe",       abv:20,diff:2,time:5,cal:155,year:1970,origin:"Messico",
   desc:"La tequila nel formato sour. Agave, lime e albume per una schiuma vellutata e agrumata.",
   method:"Dry shake tequila, lime, sciroppo e albume. Poi agita con ghiaccio. Doppio colino.",
   color:"#E8D050",gradient:"135deg,#7A6000,#C0A000,#E8D050",
   ings:[{name:"Tequila Blanco",amount:50,color:"rgba(255,248,200,0.55)"},{name:"Lime",amount:25,color:"#A8D000"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Scorza lime + Angostura",tags:["tequila","sour","cremoso","agrumato","shaken"]},
  {id:57,name:"Black Velvet",    cat:"Aperitivo",  glass:"wine",        abv:7, diff:1,time:2,cal:95, year:1861,origin:"Londra, UK",
   desc:"Creato nel 1861 in lutto per il Principe Alberto. Stout irlandese e champagne. Unico.",
   method:"Versa champagne nel calice. Aggiungi delicatamente la stout versando sul dorso del cucchiaio.",
   color:"#1A0A00",gradient:"135deg,#0A0500,#2A1500,#5A3010",
   ings:[{name:"Prosecco",amount:100,color:"rgba(255,248,215,0.65)"},{name:"Cola",amount:100,color:"rgba(15,6,0,0.95)"}],
   garnish:"Nessuno",tags:["champagne","stout","classico","storico","elegante","easy"]},
  {id:58,name:"Paloma Frozen",   cat:"Tequila",    glass:"margarita",   abv:12,diff:1,time:5,cal:145,year:1980,origin:"Messico",
   desc:"La Paloma trasformata in slushie. Tequila, pompelmo e lime frullati con ghiaccio tritato.",
   method:"Frulla tequila, succo pompelmo, lime, sciroppo e ghiaccio. Versa nel bicchiere saltato.",
   color:"#FF9090",gradient:"135deg,#8B3030,#CC5050,#FF9090",
   ings:[{name:"Tequila Blanco",amount:50,color:"rgba(255,248,200,0.55)"},{name:"Pompelmo",amount:80,color:"#FFB0B0"},{name:"Lime",amount:20,color:"#A8D000"}],
   garnish:"Sale + Lime",tags:["tequila","tropicale","fresco","blended","visivo"]},
  {id:59,name:"Royal Hawaiian",  cat:"Tropical",   glass:"martini",     abv:18,diff:2,time:4,cal:195,year:1927,origin:"Honolulu, Hawaii",
   desc:"Il cocktail dell'hotel Royal Hawaiian di Honolulu. Gin, ananas e orgeat. Esotico e dolce.",
   method:"Agita gin, succo ananas, succo limone e sciroppo di mandorle con ghiaccio. Colino doppio.",
   color:"#FFD080",gradient:"135deg,#5A3800,#A07010,#FFD080",
   ings:[{name:"Gin Premium",amount:45,color:"rgba(200,228,255,0.5)"},{name:"Ananas",amount:30,color:"#FFD700"},{name:"Limone",amount:15,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Fiore tropicale",tags:["gin","tropicale","dolce","storico","shaken"]},
  {id:60,name:"Venezuelan Rum Sour",cat:"Sour",    glass:"coupe",       abv:18,diff:2,time:5,cal:160,year:2010,origin:"Venezuela",
   desc:"Rum venezolano, lime fresco e sciroppo di canna grezzo. La purezza dei Caraibi in formato sour.",
   method:"Dry shake rum, lime e sciroppo con albume. Poi agita con ghiaccio. Doppio colino.",
   color:"#C09840",gradient:"135deg,#5A3800,#9A6818,#C09840",
   ings:[{name:"Rum Bianco",amount:60,color:"rgba(210,235,255,0.5)"},{name:"Lime",amount:25,color:"#A8D000"},{name:"Sciroppo",amount:20,color:"rgba(255,248,200,0.7)"}],
   garnish:"Scorza lime",tags:["rum","sour","cremoso","agrumato","artigianale","shaken"]},
  // ── SPRINT 5: 20 nuovi cocktail (totale 80) ──────────────────────────────
  {id:61,name:"Caipirinha",        cat:"Classic",      glass:"oldfashioned",abv:20,diff:2,time:4,cal:175,year:1918,origin:"Brasile",
   desc:"Il cocktail nazionale brasiliano. Cachaça, lime fresco e zucchero di canna. Rustico, autentico, irresistibile.",
   method:"Pesta lime e zucchero nel bicchiere. Aggiungi ghiaccio tritato e cachaça. Mescola energicamente.",
   color:"#A8D000",gradient:"135deg,#4A6000,#90C000,#C8E840",
   ings:[{name:"Cachaça",amount:50,color:"rgba(240,250,200,0.5)"},{name:"Lime",amount:30,color:"#A8D000"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Fetta lime",tags:["agrumato","classico","brasiliano","fresco","facile"]},
  {id:62,name:"Caipiroska",        cat:"Contemporary", glass:"oldfashioned",abv:20,diff:1,time:4,cal:165,year:1990,origin:"Brasile/Russia",
   desc:"La Caipirinha con la vodka. Più neutra, più pulita. Infinitamente declinabile con frutta fresca.",
   method:"Pesta lime e zucchero nel bicchiere. Aggiungi vodka e ghiaccio tritato. Mescola.",
   color:"#B5E030",gradient:"135deg,#507000,#98C010,#C8E060",
   ings:[{name:"Vodka",amount:50,color:"rgba(220,240,255,0.4)"},{name:"Lime",amount:30,color:"#A8D000"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"}],
   garnish:"Fetta lime + Menta",tags:["vodka","agrumato","fresco","easy","contemporaneo"]},
  {id:63,name:"Sbagliato",         cat:"Aperitivo",    glass:"wine",        abv:11,diff:1,time:2,cal:130,year:1972,origin:"Milano, Italia",
   desc:"L'errore più felice della mixology. Prosecco al posto del gin nel Negroni. Fresco, frizzante, iconico.",
   method:"Versa Campari e vermut nel calice con ghiaccio. Completa con Prosecco freddo. Scorza arancia.",
   color:"#C0392B",gradient:"135deg,#7B1818,#C0392B,#E74C3C",
   ings:[{name:"Campari",amount:30,color:"#C0392B"},{name:"Vermut Rosso",amount:30,color:"#8B2020"},{name:"Prosecco",amount:60,color:"rgba(255,248,215,0.65)"}],
   garnish:"Scorza arancia",tags:["amaro","aperitivo","frizzante","italiano","easy"]},
  {id:64,name:"Garibaldi",         cat:"Aperitivo",    glass:"highball",    abv:11,diff:1,time:2,cal:110,year:1860,origin:"Italia",
   desc:"Campari e succo d'arancia. Due colori, due sapori. L'aperitivo italiano più semplice e più bello.",
   method:"Versa Campari su ghiaccio. Aggiungi succo d'arancia fresco appena spremuto. Non mescolare.",
   color:"#E67E22",gradient:"135deg,#C03000,#E67E22,#F39C12",
   ings:[{name:"Campari",amount:50,color:"#C0392B"},{name:"Arancia",amount:150,color:"#FF8C00"}],
   garnish:"Fetta arancia",tags:["amaro","aperitivo","agrumato","italiano","easy"]},
  {id:65,name:"Mi-To",             cat:"Aperitivo",    glass:"oldfashioned",abv:18,diff:1,time:2,cal:140,year:1850,origin:"Milano-Torino",
   desc:"Milano-Torino: Campari e Punt e Mes. L'aperitivo che ha preceduto il Negroni di mezzo secolo.",
   method:"Versa Campari e vermut su ghiaccio. Mescola delicatamente. Scorza di limone.",
   color:"#9B1B1B",gradient:"135deg,#5A0808,#9B1B1B,#C02020",
   ings:[{name:"Campari",amount:45,color:"#C0392B"},{name:"Vermut Rosso",amount:45,color:"#8B2020"}],
   garnish:"Scorza limone",tags:["amaro","aperitivo","italiano","stirred","storico"]},
  {id:66,name:"Bramble",           cat:"Contemporary", glass:"oldfashioned",abv:18,diff:2,time:5,cal:165,year:1984,origin:"Londra, UK",
   desc:"Dick Bradsell, 1984. Gin, limone e crème de mûre versata sul ghiaccio tritato. Bello come il tramonto.",
   method:"Agita gin, limone e sciroppo. Versa su ghiaccio tritato nel bicchiere. Aggiungi crème de mûre galleggiante.",
   color:"#6B1A8A",gradient:"135deg,#3A0850,#6B1A8A,#9B40BA",
   ings:[{name:"Gin London Dry",amount:50,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:25,color:"#FFE060"},{name:"Sciroppo",amount:12,color:"rgba(255,248,200,0.7)"},{name:"Cassis",amount:15,color:"#4A0030"}],
   garnish:"Mora + Fetta limone",tags:["gin","fruttato","viola","artigianale","contemporaneo"]},
  {id:67,name:"Pisco Sour",        cat:"Sour",         glass:"coupe",       abv:17,diff:2,time:5,cal:168,year:1920,origin:"Lima, Perù",
   desc:"Il gioiello del Sud America. Pisco, lime, sciroppo e albume per una schiuma nuvola. Amaricanto bitters.",
   method:"Dry shake pisco, lime, sciroppo e albume. Poi agita con ghiaccio. Doppio colino. Angostura drops.",
   color:"#FFFFC0",gradient:"135deg,#7A7A00,#C0C000,#FFFFC0",
   ings:[{name:"Pisco",amount:60,color:"rgba(255,248,220,0.6)"},{name:"Lime",amount:30,color:"#A8D000"},{name:"Sciroppo",amount:20,color:"rgba(255,248,200,0.7)"}],
   garnish:"Angostura drops + Menta",tags:["sour","cremoso","peruviano","shaken","storico"]},
  {id:68,name:"Gin Basil Smash",   cat:"Contemporary", glass:"oldfashioned",abv:18,diff:2,time:5,cal:158,year:2008,origin:"Amburgo, Germania",
   desc:"Jörg Meyer, 2008. Gin e basilico fresco pestati insieme. Erbaceo, fresco, moderno. Un successo immediato.",
   method:"Pesta basilico con sciroppo nello shaker. Aggiungi gin, limone e ghiaccio. Agita bene. Doppio colino.",
   color:"#80C040",gradient:"135deg,#305010,#609030,#80C040",
   ings:[{name:"Gin London Dry",amount:60,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:30,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"},{name:"Basilico",amount:8,color:"#2E8B57"}],
   garnish:"Foglie di basilico",tags:["gin","erbaceo","fresco","contemporaneo","shaken"]},
  {id:69,name:"White Negroni",     cat:"Contemporary", glass:"coupe",       abv:24,diff:2,time:4,cal:185,year:2001,origin:"Bordeaux, Francia",
   desc:"Wayne Collins, 2001. Gin, Suze e Lillet Blanc. Amaro ma luminoso, il Negroni del XXI secolo.",
   method:"Mescola gin, Suze e Lillet con ghiaccio per 30 secondi. Versa nella coupe. Scorza limone.",
   color:"#F8F0C0",gradient:"135deg,#6A6000,#B0A000,#F8F0C0",
   ings:[{name:"Gin Premium",amount:30,color:"rgba(200,228,255,0.5)"},{name:"Suze",amount:30,color:"rgba(255,240,160,0.7)"},{name:"Vermut Dry",amount:30,color:"rgba(255,240,200,0.6)"}],
   garnish:"Scorza limone",tags:["amaro","gin","elegante","contemporaneo","stirred"]},
  {id:70,name:"Strawberry Daiquiri",cat:"Tropical",   glass:"coupe",       abv:16,diff:1,time:5,cal:165,year:1960,origin:"USA/Cuba",
   desc:"Il Daiquiri trasformato in festa. Fragole fresche, rum bianco e lime per un cocktail estivo indimenticabile.",
   method:"Frulla rum, fragole fresche, lime e sciroppo con ghiaccio tritato. Versa nella coupe.",
   color:"#FF3060",gradient:"135deg,#8B0030,#CC1050,#FF3060",
   ings:[{name:"Rum Bianco",amount:50,color:"rgba(210,235,255,0.5)"},{name:"Fragole",amount:40,color:"#FF1040"},{name:"Lime",amount:20,color:"#A8D000"},{name:"Sciroppo",amount:10,color:"rgba(255,248,200,0.7)"}],
   garnish:"Fragola + Lime",tags:["rum","fruttato","tropicale","dolce","blended"]},
  {id:71,name:"Mezcal Mule",       cat:"Longdrink",   glass:"highball",    abv:12,diff:1,time:3,cal:140,year:2010,origin:"Messico/USA",
   desc:"Il Moscow Mule reinventato con mezcal. Piccante, affumicato, zenzero. Per chi ama i sapori intensi.",
   method:"Versa mezcal e lime su ghiaccio. Completa con ginger beer fredda. Non mescolare.",
   color:"#D0A040",gradient:"135deg,#6A4800,#B08020,#D0A040",
   ings:[{name:"Mezcal",amount:50,color:"rgba(255,242,180,0.55)"},{name:"Lime",amount:20,color:"#A8D000"},{name:"Ginger Beer",amount:100,color:"rgba(255,240,180,0.55)"}],
   garnish:"Fetta lime + Zenzero",tags:["mezcal","affumicato","piccante","ginger","easy"]},
  {id:72,name:"Aperol Collins",    cat:"Longdrink",   glass:"highball",    abv:8, diff:1,time:3,cal:120,year:2000,origin:"Italia/UK",
   desc:"L'Aperol incontro il Tom Collins. Leggero, frizzante, agrumato. Perfetto a qualsiasi ora del giorno.",
   method:"Agita Aperol, limone e sciroppo con ghiaccio. Versa su ghiaccio. Completa con soda frizzante.",
   color:"#FF7020",gradient:"135deg,#8B2800,#CC5010,#FF7020",
   ings:[{name:"Aperol",amount:50,color:"#E67E22"},{name:"Limone",amount:25,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"},{name:"Soda Water",amount:80,color:"rgba(215,235,255,0.45)"}],
   garnish:"Fetta arancia + Ciliegia",tags:["aperitivo","fresco","agrumato","frizzante","easy"]},
  {id:73,name:"Hugo Spritz",       cat:"Aperitivo",   glass:"wine",        abv:7, diff:1,time:2,cal:95, year:2005,origin:"Alto Adige, Italia",
   desc:"L'aperitivo delle Dolomiti. Sambuco, Prosecco, soda e menta fresca. Floreale, delicato, estivo.",
   method:"Versa sciroppo di sambuco nel calice con ghiaccio e menta. Aggiungi Prosecco e soda.",
   color:"#E0F0C0",gradient:"135deg,#507030,#90C060,#E0F0C0",
   ings:[{name:"Sciroppo Sambuco",amount:30,color:"rgba(240,255,200,0.7)"},{name:"Prosecco",amount:90,color:"rgba(255,248,215,0.65)"},{name:"Soda Water",amount:30,color:"rgba(215,235,255,0.45)"}],
   garnish:"Menta + Fetta limone",tags:["aperitivo","floreale","fresco","frizzante","easy","italiano"]},
  {id:74,name:"Monte Carlo",       cat:"Classic",     glass:"coupe",       abv:28,diff:2,time:4,cal:180,year:1948,origin:"USA",
   desc:"Rye whisky e Bénédictine. Due ingredienti, complessità infinita. La semplicità dei grandi cocktail.",
   method:"Mescola rye, Bénédictine e Angostura su ghiaccio per 30 secondi. Versa nella coupe.",
   color:"#C09040",gradient:"135deg,#5A3800,#9A6810,#C09040",
   ings:[{name:"Bourbon",amount:56,color:"#C07830"},{name:"Triple Sec",amount:28,color:"rgba(255,220,80,0.5)"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Scorza limone",tags:["whiskey","dolce","classico","stirred","complesso"]},
  {id:75,name:"Revolver",          cat:"Contemporary",glass:"coupe",       abv:28,diff:2,time:4,cal:180,year:2004,origin:"San Francisco, USA",
   desc:"Jon Santer, 2004. Bourbon, Kahlúa e orange bitters. Caffè e whiskey in un cerchio perfetto.",
   method:"Mescola bourbon, Kahlúa e orange bitters su ghiaccio per 25 secondi. Versa nella coupe.",
   color:"#8B3000",gradient:"135deg,#3A1000,#6B2800,#9B4010",
   ings:[{name:"Bourbon",amount:50,color:"#C07830"},{name:"Kahlúa",amount:20,color:"#1A0800"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Scorza arancia fiammeggiata",tags:["whiskey","caffè","contemporaneo","stirred","artigianale"]},
  {id:76,name:"Army and Navy",     cat:"Classic",     glass:"coupe",       abv:20,diff:2,time:4,cal:150,year:1941,origin:"USA",
   desc:"Gin, limone e sciroppo di orgeat. La mandorla trasforma il sour in qualcosa di straordinariamente morbido.",
   method:"Agita gin, limone e orgeat con ghiaccio. Doppio colino nella coupe raffreddata.",
   color:"#FFE090",gradient:"135deg,#7A6000,#C0A000,#FFE090",
   ings:[{name:"Gin London Dry",amount:55,color:"rgba(210,235,255,0.6)"},{name:"Limone",amount:20,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,220,100,0.7)"}],
   garnish:"Scorza limone",tags:["gin","dolce","sour","classico","storico","shaken"]},
  {id:77,name:"Woo Woo",           cat:"Contemporary",glass:"highball",    abv:14,diff:1,time:3,cal:175,year:1980,origin:"USA",
   desc:"Vodka, peach schnapps e cranberry. Dolce, fruttato, rosa brillante. Un classico dei cocktail bar degli anni '80.",
   method:"Riempi con ghiaccio. Versa vodka, peach schnapps e cranberry. Agita delicatamente.",
   color:"#CC2060",gradient:"135deg,#700030,#BB1050,#CC2060",
   ings:[{name:"Vodka",amount:40,color:"rgba(220,240,255,0.4)"},{name:"Triple Sec",amount:30,color:"rgba(255,220,80,0.5)"},{name:"Cranberry",amount:60,color:"#C01040"}],
   garnish:"Fetta lime",tags:["vodka","dolce","fruttato","rosa","easy","anni80"]},
  {id:78,name:"Blue Hawaiian",     cat:"Tropical",    glass:"highball",    abv:14,diff:1,time:4,cal:195,year:1957,origin:"Honolulu, Hawaii",
   desc:"Harry Yee, 1957, Royal Hawaiian Hotel. Rum, Blue Curaçao e ananas. Il cocktail che profuma di Hawaii.",
   method:"Agita rum bianco, Blue Curaçao, succo ananas e cocco con ghiaccio. Versa su ghiaccio.",
   color:"#0090FF",gradient:"135deg,#004090,#0060C0,#0090FF",
   ings:[{name:"Rum Bianco",amount:40,color:"rgba(210,235,255,0.5)"},{name:"Blue Curaçao",amount:20,color:"#0055CC"},{name:"Ananas",amount:60,color:"#FFD700"},{name:"Cocco",amount:20,color:"rgba(255,252,240,0.8)"}],
   garnish:"Ananas + Ciliegia + Ombrellino",tags:["rum","tropicale","blu","dolce","visivo","storico"]},
  {id:79,name:"Cucumber Collins",  cat:"Longdrink",   glass:"highball",    abv:10,diff:2,time:5,cal:110,year:2005,origin:"UK",
   desc:"Gin, cetriolo, menta e soda. La freschezza più pura in un bicchiere. Il cocktail del giardino inglese.",
   method:"Pesta cetriolo e menta con sciroppo. Agita gin, limone e ghiaccio. Versa su ghiaccio. Soda.",
   color:"#80D080",gradient:"135deg,#305030,#609060,#80D080",
   ings:[{name:"Gin Premium",amount:50,color:"rgba(200,228,255,0.5)"},{name:"Cetriolo",amount:40,color:"#50A850"},{name:"Limone",amount:20,color:"#FFE060"},{name:"Soda Water",amount:80,color:"rgba(215,235,255,0.45)"}],
   garnish:"Fette cetriolo + Menta",tags:["gin","fresco","erbaceo","estivo","leggero","easy"]},
  {id:80,name:"Pisco Punch",       cat:"Classic",     glass:"wine",        abv:14,diff:2,time:5,cal:185,year:1872,origin:"San Francisco, USA",
   desc:"Il punch leggendario del Bank Exchange di San Francisco. Pisco, ananasso, ananas e agrumi. Un mito.",
   method:"Mescola pisco, succo ananas, lime, sciroppo e soda. Versa su ghiaccio nel calice.",
   color:"#FFD050",gradient:"135deg,#7A5000,#C08800,#FFD050",
   ings:[{name:"Pisco",amount:50,color:"rgba(255,248,220,0.6)"},{name:"Ananas",amount:30,color:"#FFD700"},{name:"Limone",amount:20,color:"#FFE060"},{name:"Soda Water",amount:60,color:"rgba(215,235,255,0.45)"}],
   garnish:"Fetta ananas",tags:["rum","tropicale","fruttato","storico","frizzante"]},
  // ── SPRINT 6: 20 nuovi cocktail (totale 100) ─────────────────────────────
  {id:81,name:"Manhattan",         cat:"Classic",      glass:"coupe",       abv:30,diff:2,time:4,cal:175,year:1880,origin:"New York, USA",
   desc:"Il fratello newyorkese del Negroni. Whiskey, vermut rosso e Angostura. Eleganza assoluta nel bicchiere.",
   method:"Mescola rye, vermut rosso e Angostura su ghiaccio per 30 secondi. Doppio colino nella coupe.",
   color:"#8B2818",gradient:"135deg,#3A1008,#6B2010,#9B4020",
   ings:[{name:"Bourbon",amount:60,color:"#C07830"},{name:"Vermut Rosso",amount:30,color:"#8B2020"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Ciliegia Luxardo",tags:["whiskey","classico","stirred","storico","elegante"]},
  {id:82,name:"Boulevardier",      cat:"Classic",      glass:"oldfashioned",abv:28,diff:2,time:4,cal:190,year:1927,origin:"Parigi, Francia",
   desc:"Il Negroni con il whiskey al posto del gin. Più caldo, più rotondo, perfetto per le serate autunnali.",
   method:"Mescola bourbon, Campari e vermut su ghiaccio per 30 secondi. Versa sul ghiaccio.",
   color:"#A02818",gradient:"135deg,#4A1008,#7A2010,#A84028",
   ings:[{name:"Bourbon",amount:30,color:"#C07830"},{name:"Campari",amount:30,color:"#C0392B"},{name:"Vermut Rosso",amount:30,color:"#8B2020"}],
   garnish:"Scorza arancia",tags:["whiskey","amaro","classico","stirred"]},
  {id:83,name:"Martinez",          cat:"Classic",      glass:"coupe",       abv:22,diff:2,time:4,cal:158,year:1860,origin:"California, USA",
   desc:"L'antenato del Martini. Gin Old Tom, vermut rosso, maraschino e bitter. Più dolce e complesso del suo discendente.",
   method:"Mescola gin, vermut, maraschino e bitter su ghiaccio per 30 secondi. Doppio colino.",
   color:"#A89040",gradient:"135deg,#4A4000,#807010,#A89040",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Vermut Rosso",amount:45,color:"#8B2020"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Scorza arancia + Ciliegia",tags:["gin","classico","stirred","storico","complesso"]},
  {id:84,name:"Dry Martini",       cat:"Classic",      glass:"martini",     abv:32,diff:2,time:3,cal:165,year:1900,origin:"USA",
   desc:"Il re dei cocktail. Gin e vermut dry in proporzioni che dividono i puristi da un secolo.",
   method:"Mescola gin e vermut con ghiaccio per 30 secondi. Doppio colino nel martini glass.",
   color:"#D8E8C0",gradient:"135deg,#6A7A30,#A8B860,#D8E8C0",
   ings:[{name:"Gin London Dry",amount:60,color:"rgba(210,235,255,0.6)"},{name:"Vermut Dry",amount:10,color:"rgba(255,240,200,0.6)"}],
   garnish:"Oliva o Scorza limone",tags:["gin","classico","stirred","secco","elegante"]},
  {id:85,name:"Vesper",            cat:"Classic",      glass:"martini",     abv:35,diff:3,time:4,cal:185,year:1953,origin:"Letteratura, UK",
   desc:"Il martini di James Bond. Gin, vodka e Lillet Blanc. Agitato, non mescolato.",
   method:"Agita gin, vodka e Lillet con ghiaccio. Doppio colino nel martini glass.",
   color:"#F0E8B0",gradient:"135deg,#7A7000,#B8A800,#F0E8B0",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Vodka",amount:15,color:"rgba(220,240,255,0.4)"},{name:"Vermut Dry",amount:7,color:"rgba(255,240,200,0.6)"}],
   garnish:"Scorza limone",tags:["gin","vodka","classico","shaken","elegante"]},
  {id:86,name:"Negroni Sbagliato", cat:"Aperitivo",    glass:"oldfashioned",abv:14,diff:1,time:2,cal:140,year:1972,origin:"Milano, Italia",
   desc:"Variante frizzante del Negroni classico, con Prosecco al posto del gin nel bicchiere basso.",
   method:"Versa Campari e vermut su ghiaccio. Completa con Prosecco. Mescola delicatamente.",
   color:"#C0392B",gradient:"135deg,#7B1818,#C0392B,#E74C3C",
   ings:[{name:"Campari",amount:30,color:"#C0392B"},{name:"Vermut Rosso",amount:30,color:"#8B2020"},{name:"Prosecco",amount:30,color:"rgba(255,248,215,0.65)"}],
   garnish:"Scorza arancia",tags:["amaro","aperitivo","frizzante","italiano"]},
  {id:87,name:"Brooklyn",          cat:"Classic",      glass:"coupe",       abv:26,diff:2,time:4,cal:165,year:1908,origin:"New York, USA",
   desc:"Il rivale del Manhattan dall'altra parte del ponte. Rye, vermut dry, maraschino e Amer Picon.",
   method:"Mescola rye, vermut dry, maraschino e bitter su ghiaccio per 30 secondi.",
   color:"#9B7030",gradient:"135deg,#4A3008,#7A5818,#9B7030",
   ings:[{name:"Bourbon",amount:60,color:"#C07830"},{name:"Vermut Dry",amount:30,color:"rgba(255,240,200,0.6)"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Ciliegia Luxardo",tags:["whiskey","classico","stirred","storico"]},
  {id:88,name:"Mai Tai",           cat:"Tropical",     glass:"oldfashioned",abv:24,diff:2,time:5,cal:215,year:1944,origin:"Oakland, USA",
   desc:"Trader Vic, 1944. Il re dei tiki drink. Rum, orgeat, triple sec e lime in equilibrio perfetto.",
   method:"Agita rum scuro e bianco, triple sec, lime e orgeat con ghiaccio. Versa su ghiaccio tritato.",
   color:"#C87010",gradient:"135deg,#5A2800,#9A5008,#C87010",
   ings:[{name:"Rum Bianco",amount:30,color:"rgba(210,235,255,0.5)"},{name:"Rum Scuro",amount:30,color:"#6B3000"},{name:"Triple Sec",amount:15,color:"rgba(255,220,80,0.5)"},{name:"Lime",amount:25,color:"#A8D000"}],
   garnish:"Menta + Lime + Ombrellino",tags:["rum","tropicale","tiki","complesso","storico"]},
  {id:89,name:"Zombie",            cat:"Tropical",     glass:"highball",    abv:30,diff:3,time:7,cal:260,year:1934,origin:"Hollywood, USA",
   desc:"Donn Beach, 1934. Il tiki drink leggendario con sei tipi di rum. Famoso per i suoi effetti devastanti.",
   method:"Agita rum multipli, lime, sciroppi e bitter con ghiaccio. Versa su ghiaccio tritato.",
   color:"#8B3010",gradient:"135deg,#3A1000,#6B2008,#9B5020",
   ings:[{name:"Rum Bianco",amount:30,color:"rgba(210,235,255,0.5)"},{name:"Rum Scuro",amount:30,color:"#6B3000"},{name:"Lime",amount:25,color:"#A8D000"},{name:"Ananas",amount:20,color:"#FFD700"}],
   garnish:"Menta + Ananas + Ombrellino",tags:["rum","tropicale","tiki","complesso","forte"]},
  {id:90,name:"Hemingway Daiquiri",cat:"Classic",      glass:"coupe",       abv:18,diff:2,time:5,cal:155,year:1930,origin:"L'Avana, Cuba",
   desc:"Il Daiquiri preferito di Hemingway al Floridita. Rum, pompelmo, maraschino e lime senza zucchero.",
   method:"Agita rum, pompelmo, maraschino e lime con ghiaccio. Doppio colino nella coupe.",
   color:"#FFA0A0",gradient:"135deg,#8B3030,#CC6060,#FFA0A0",
   ings:[{name:"Rum Bianco",amount:60,color:"rgba(210,235,255,0.5)"},{name:"Pompelmo",amount:30,color:"#FFB0B0"},{name:"Lime",amount:15,color:"#A8D000"}],
   garnish:"Scorza lime",tags:["rum","agrumato","classico","storico","shaken"]},
  {id:91,name:"Suffering Bastard", cat:"Tropical",     glass:"highball",    abv:18,diff:2,time:5,cal:185,year:1942,origin:"Il Cairo, Egitto",
   desc:"Nato per curare i postumi della sbornia degli ufficiali britannici in Egitto. Gin, bourbon e ginger beer.",
   method:"Agita gin, bourbon, lime e Angostura con ghiaccio. Versa su ghiaccio. Ginger beer.",
   color:"#C89040",gradient:"135deg,#5A4000,#9A6818,#C89040",
   ings:[{name:"Gin London Dry",amount:30,color:"rgba(210,235,255,0.6)"},{name:"Bourbon",amount:30,color:"#C07830"},{name:"Lime",amount:20,color:"#A8D000"},{name:"Ginger Beer",amount:60,color:"rgba(255,240,180,0.55)"}],
   garnish:"Menta + Fetta lime",tags:["gin","whiskey","piccante","storico","complesso"]},
  {id:92,name:"Trinidad Sour",     cat:"Sour",         glass:"coupe",       abv:14,diff:3,time:5,cal:160,year:2010,origin:"New York, USA",
   desc:"Giuseppe Gonzalez, 2010. Capovolge le regole: 1 oz Angostura come base, non come accento. Audace e geniale.",
   method:"Agita Angostura, orgeat, limone e rye con ghiaccio. Doppio colino nella coupe.",
   color:"#8B1818",gradient:"135deg,#4A0808,#7A1010,#8B1818",
   ings:[{name:"Angostura",amount:30,color:"#6B1010"},{name:"Sciroppo",amount:20,color:"rgba(255,220,100,0.7)"},{name:"Limone",amount:20,color:"#FFE060"},{name:"Bourbon",amount:15,color:"#C07830"}],
   garnish:"Nessuno",tags:["amaro","sour","contemporaneo","artigianale","audace"]},
  {id:93,name:"Jungle Bird Spritz",cat:"Tropical",     glass:"wine",        abv:13,diff:2,time:4,cal:160,year:2015,origin:"Contemporaneo",
   desc:"Variante spritz del classico Jungle Bird. Rum, Campari e ananas alleggeriti dal Prosecco.",
   method:"Versa rum, Campari e ananas su ghiaccio nel calice. Completa con Prosecco.",
   color:"#C84030",gradient:"135deg,#5A1010,#9A3020,#C84030",
   ings:[{name:"Rum Scuro",amount:30,color:"#6B3000"},{name:"Campari",amount:15,color:"#C0392B"},{name:"Ananas",amount:30,color:"#FFD700"},{name:"Prosecco",amount:60,color:"rgba(255,248,215,0.65)"}],
   garnish:"Fetta ananas",tags:["rum","tropicale","amaro","frizzante","contemporaneo"]},
  {id:94,name:"Cable Car",         cat:"Contemporary", glass:"coupe",       abv:24,diff:2,time:4,cal:170,year:1996,origin:"San Francisco, USA",
   desc:"Tony Abou-Ganim, 1996. Rum speziato, triple sec, limone e cannella. Un omaggio ai tram di San Francisco.",
   method:"Rim di zucchero e cannella. Agita rum, triple sec e limone con ghiaccio. Doppio colino.",
   color:"#D0A050",gradient:"135deg,#6A4800,#A87810,#D0A050",
   ings:[{name:"Rum Scuro",amount:45,color:"#6B3000"},{name:"Triple Sec",amount:15,color:"rgba(255,220,80,0.5)"},{name:"Limone",amount:20,color:"#FFE060"},{name:"Sciroppo",amount:10,color:"rgba(255,248,200,0.7)"}],
   garnish:"Zucchero e cannella sul bordo",tags:["rum","speziato","contemporaneo","shaken"]},
  {id:95,name:"Sazerac",           cat:"Classic",      glass:"oldfashioned",abv:32,diff:2,time:4,cal:175,year:1850,origin:"New Orleans, USA",
   desc:"Il cocktail ufficiale di New Orleans. Rye, Peychaud's bitters e un risciacquo di absinthe. Rituale e tradizione.",
   method:"Risciacqua il bicchiere con absinthe. Mescola rye, zucchero e bitter su ghiaccio. Versa.",
   color:"#A85020",gradient:"135deg,#4A2008,#7A3810,#A85020",
   ings:[{name:"Bourbon",amount:60,color:"#C07830"},{name:"Angostura",amount:3,color:"#6B1010"},{name:"Sciroppo",amount:5,color:"rgba(255,248,200,0.7)"}],
   garnish:"Scorza limone",tags:["whiskey","classico","stirred","storico","rituale"]},
  {id:96,name:"Floridita",         cat:"Classic",      glass:"coupe",       abv:18,diff:2,time:5,cal:160,year:1930,origin:"L'Avana, Cuba",
   desc:"La versione originale del Daiquiri al Floridita, con maraschino e una punta di Cointreau.",
   method:"Agita rum, maraschino, lime e Cointreau con ghiaccio. Doppio colino nella coupe.",
   color:"#FFC0A0",gradient:"135deg,#8B5030,#CC8050,#FFC0A0",
   ings:[{name:"Rum Bianco",amount:50,color:"rgba(210,235,255,0.5)"},{name:"Cointreau",amount:15,color:"rgba(255,215,80,0.5)"},{name:"Lime",amount:20,color:"#A8D000"}],
   garnish:"Scorza lime",tags:["rum","agrumato","classico","storico","shaken"]},
  {id:97,name:"El Diablo",         cat:"Tequila",      glass:"highball",    abv:16,diff:2,time:4,cal:165,year:1940,origin:"Messico/USA",
   desc:"Trader Vic. Tequila, crème de cassis, lime e ginger beer. Piccante e fruttato, con un tocco diabolico.",
   method:"Agita tequila, cassis e lime con ghiaccio. Versa su ghiaccio. Completa con ginger beer.",
   color:"#8B2050",gradient:"135deg,#4A1030,#7A1840,#8B2050",
   ings:[{name:"Tequila Blanco",amount:45,color:"rgba(255,248,200,0.55)"},{name:"Cassis",amount:15,color:"#4A0030"},{name:"Lime",amount:20,color:"#A8D000"},{name:"Ginger Beer",amount:60,color:"rgba(255,240,180,0.55)"}],
   garnish:"Fetta lime",tags:["tequila","piccante","fruttato","ginger","storico"]},
  {id:98,name:"Tuxedo",            cat:"Classic",      glass:"martini",     abv:30,diff:3,time:4,cal:165,year:1890,origin:"USA",
   desc:"Il gemello elegante del Martini. Gin, vermut dry, maraschino e absinthe. Sofisticazione vittoriana.",
   method:"Mescola gin, vermut, maraschino e bitter con ghiaccio per 30 secondi. Doppio colino.",
   color:"#E8E0C8",gradient:"135deg,#6A6048,#A8A088,#E8E0C8",
   ings:[{name:"Gin London Dry",amount:45,color:"rgba(210,235,255,0.6)"},{name:"Vermut Dry",amount:45,color:"rgba(255,240,200,0.6)"},{name:"Angostura",amount:2,color:"#6B1010"}],
   garnish:"Oliva + Scorza limone",tags:["gin","classico","stirred","storico","elegante"]},
  {id:99,name:"Tijuana Sling",     cat:"Tequila",      glass:"highball",    abv:16,diff:2,time:5,cal:175,year:1970,origin:"Messico",
   desc:"Tequila, limone, granatina e soda. Versione messicana del classico sling inglese, dolce e fresca.",
   method:"Agita tequila, limone e granatina con ghiaccio. Versa su ghiaccio. Soda.",
   color:"#FF5070",gradient:"135deg,#8B1838,#CC3058,#FF5070",
   ings:[{name:"Tequila Blanco",amount:50,color:"rgba(255,248,200,0.55)"},{name:"Limone",amount:25,color:"#FFE060"},{name:"Sciroppo",amount:15,color:"rgba(255,248,200,0.7)"},{name:"Soda Water",amount:60,color:"rgba(215,235,255,0.45)"}],
   garnish:"Fetta limone",tags:["tequila","dolce","agrumato","messicano","easy"]},
  {id:100,name:"Corpse Reviver #1",cat:"Classic",      glass:"coupe",       abv:30,diff:3,time:4,cal:175,year:1930,origin:"Londra, UK",
   desc:"Il fratello più forte e meno conosciuto del Corpse Reviver #2. Cognac, calvados e vermut rosso.",
   method:"Mescola cognac, calvados e vermut con ghiaccio per 30 secondi. Doppio colino.",
   color:"#A86838",gradient:"135deg,#4A3018,#7A5028,#A86838",
   ings:[{name:"Cognac",amount:40,color:"#C07830"},{name:"Vermut Rosso",amount:20,color:"#8B2020"},{name:"Triple Sec",amount:20,color:"rgba(255,220,80,0.5)"}],
   garnish:"Scorza limone",tags:["classico","forte","stirred","storico","complesso"]},
];

// ─── SIMULATOR INGREDIENTS ────────────────────────────────────────────────────
const INGS = [
  {id:1,  name:"Aperol",         cat:"Bitter",      color:"#E67E22",              abv:11,   ml:30},
  {id:2,  name:"Campari",        cat:"Bitter",      color:"#C0392B",              abv:25,   ml:30},
  {id:3,  name:"Angostura",      cat:"Bitter",      color:"#6B1010",              abv:44.7, ml:5 },
  {id:4,  name:"Gin London Dry", cat:"Gin",         color:"rgba(210,235,255,0.6)",abv:40,   ml:30},
  {id:5,  name:"Gin Premium",    cat:"Gin",         color:"rgba(200,228,255,0.5)",abv:40,   ml:30},
  {id:6,  name:"Vodka",          cat:"Vodka",       color:"rgba(220,240,255,0.4)",abv:40,   ml:30},
  {id:7,  name:"Vodka Citrus",   cat:"Vodka",       color:"rgba(240,248,200,0.4)",abv:40,   ml:30},
  {id:8,  name:"Rum Bianco",     cat:"Rum",         color:"rgba(255,248,225,0.5)",abv:37.5, ml:30},
  {id:9,  name:"Rum Scuro",      cat:"Rum",         color:"#6B3000",              abv:40,   ml:30},
  {id:10, name:"Tequila Blanco", cat:"Tequila",     color:"rgba(255,248,200,0.55)",abv:38,  ml:30},
  {id:11, name:"Mezcal",         cat:"Tequila",     color:"rgba(255,242,180,0.5)",abv:40,   ml:30},
  {id:12, name:"Bourbon",        cat:"Whisky",      color:"#C07830",              abv:45,   ml:30},
  {id:13, name:"Scotch",         cat:"Whisky",      color:"#A86020",              abv:40,   ml:30},
  {id:14, name:"Prosecco",       cat:"Vino",        color:"rgba(255,248,215,0.65)",abv:11,  ml:60},
  {id:15, name:"Vermut Rosso",   cat:"Vino",        color:"#8B2020",              abv:16,   ml:30},
  {id:16, name:"Vermut Dry",     cat:"Vino",        color:"rgba(255,240,200,0.6)",abv:18,   ml:20},
  {id:17, name:"Triple Sec",     cat:"Liquori",     color:"rgba(255,220,80,0.5)", abv:40,   ml:20},
  {id:18, name:"Kahlúa",         cat:"Liquori",     color:"#1A0800",              abv:20,   ml:20},
  {id:19, name:"Amaretto",       cat:"Liquori",     color:"#A06818",              abv:28,   ml:20},
  {id:20, name:"Cointreau",      cat:"Liquori",     color:"rgba(255,215,80,0.5)", abv:40,   ml:20},
  {id:21, name:"Lime",           cat:"Succhi",      color:"#A8D000",              abv:0,    ml:25},
  {id:22, name:"Arancia",        cat:"Succhi",      color:"#FF8C00",              abv:0,    ml:60},
  {id:23, name:"Limone",         cat:"Succhi",      color:"#FFE060",              abv:0,    ml:25},
  {id:24, name:"Cranberry",      cat:"Succhi",      color:"#C01040",              abv:0,    ml:30},
  {id:25, name:"Ananas",         cat:"Succhi",      color:"#FFD700",              abv:0,    ml:30},
  {id:26, name:"Sciroppo",       cat:"Sciroppi",    color:"rgba(255,248,200,0.7)",abv:0,    ml:15},
  {id:27, name:"Soda Water",     cat:"Soft Drinks", color:"rgba(215,235,255,0.45)",abv:0,   ml:60},
  {id:28, name:"Acqua Tonica",   cat:"Soft Drinks", color:"rgba(218,238,255,0.5)",abv:0,    ml:100},
  {id:29, name:"Espresso",       cat:"Altro",       color:"#100500",              abv:0,    ml:30},
  {id:30, name:"Panna",          cat:"Altro",       color:"rgba(255,250,245,0.85)",abv:0,   ml:30},
];
const ING_CATS = ["Tutti","Bitter","Gin","Vodka","Rum","Tequila","Whisky","Vino","Liquori","Succhi","Sciroppi","Soft Drinks","Altro"];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function parseClr(s) {
  if (!s) return {r:160,g:130,b:80,a:0.85};
  const m = s.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([\d.]+))?\)/);
  if (m) return {r:+m[1],g:+m[2],b:+m[3],a:m[4]!=null?+m[4]:0.9};
  const h = s.replace('#','');
  if (h.length===6) return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:0.9};
  return {r:160,g:130,b:80,a:0.85};
}

function blendColors(arr) {
  if (!arr?.length) return "rgba(160,130,80,0)";
  const tot = arr.reduce((s,i)=>s+(i.amount||i.ml||1),0);
  let r=0,g=0,b=0,a=0;
  arr.forEach(i=>{
    const w=(i.amount||i.ml||1)/tot, c=parseClr(i.color);
    r+=c.r*w; g+=c.g*w; b+=c.b*w; a+=c.a*w;
  });
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${Math.min(a,0.95).toFixed(2)})`;
}

function calcStats(layers) {
  const vol = layers.reduce((s,l)=>s+l.amount,0);
  const alcMl = layers.reduce((s,l)=>{
    const ig=INGS.find(i=>i.name===l.name);
    return s+l.amount*((ig?.abv||0)/100);
  },0);
  const abv = vol>0?(alcMl/vol*100):0;
  const cal = layers.reduce((s,l)=>{
    const ig=INGS.find(i=>i.name===l.name);
    return s+l.amount*((ig?.abv||0)/100*0.789*7+((ig?.abv||0)>0?0.04:0.1));
  },0);
  return {vol:Math.round(vol), abv:abv.toFixed(1), cal:Math.round(cal)};
}

function matchCocktail(layers) {
  if (!layers.length) return null;
  const ns = layers.map(l=>l.name.toLowerCase());
  let best=null, bs=0;
  for (const c of COCKTAILS) {
    const cn = c.ings.map(i=>i.name.toLowerCase());
    const hits = cn.filter(n=>ns.some(u=>u.includes(n.split(' ')[0])||n.includes(u.split(' ')[0]))).length;
    const score = hits/Math.max(cn.length,ns.length);
    if (score>bs&&score>=0.58){bs=score;best=c;}
  }
  return best;
}

// ─── HOOK: ANIMATED VALUE ─────────────────────────────────────────────────────
function useAnimVal(target, ms=700) {
  const [v, setV] = useState(0);
  const cur = useRef(0);
  const raf = useRef(null);
  useEffect(()=>{
    const from=cur.current, to=target;
    if(Math.abs(from-to)<0.001) return;
    const t0=performance.now();
    const go=now=>{
      const t=Math.min((now-t0)/ms,1);
      const e=t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      const val=from+(to-from)*e;
      cur.current=val; setV(val);
      if(t<1) raf.current=requestAnimationFrame(go);
    };
    if(raf.current) cancelAnimationFrame(raf.current);
    raf.current=requestAnimationFrame(go);
    return ()=>cancelAnimationFrame(raf.current);
  },[target, ms]);
  return v;
}

// ─── GARNISH RENDERER ────────────────────────────────────────────────────────
function GarnishSVG({garnish, gDef}) {
  if (!garnish || garnish==="Nessuno") return null;
  const pts=gDef.bowlPts.split(' ').map(p=>p.split(',').map(Number));
  const rx=pts[1][0], ry=pts[1][1], cx=gDef.cx;
  const g = garnish.toLowerCase();
  if (g.includes("lime") || g.includes("fetta lime")) return (
    <g>
      <circle cx={rx-5} cy={ry-9} r={9} fill="#4A8E00" opacity={0.9}/>
      <circle cx={rx-5} cy={ry-9} r={7} fill="#7DB000" opacity={0.95}/>
      {[0,1,2,3,4,5].map(i=>(
        <line key={i} x1={rx-5} y1={ry-9}
          x2={rx-5+Math.cos(i*Math.PI/3)*6.5} y2={ry-9+Math.sin(i*Math.PI/3)*6.5}
          stroke="#3A7200" strokeWidth={0.5} opacity={0.7}/>
      ))}
    </g>
  );
  if (g.includes("arancia") || g.includes("fetta arancia")) return (
    <g>
      <circle cx={rx-5} cy={ry-9} r={9} fill="#B85000" opacity={0.85}/>
      <circle cx={rx-5} cy={ry-9} r={7} fill="#FF8C00" opacity={0.95}/>
      {[0,1,2,3,4,5,6].map(i=>(
        <line key={i} x1={rx-5} y1={ry-9}
          x2={rx-5+Math.cos(i*Math.PI*2/7)*6.5} y2={ry-9+Math.sin(i*Math.PI*2/7)*6.5}
          stroke="#CC5500" strokeWidth={0.5} opacity={0.6}/>
      ))}
    </g>
  );
  if (g.includes("ciliegia")) return (
    <g>
      <path d={`M${cx} ${ry-4} Q${cx+6} ${ry-14} ${cx+2} ${ry-20}`} stroke="#2D5A1B" strokeWidth={1.2} fill="none" strokeLinecap="round"/>
      <circle cx={cx+2} cy={ry-20} r={5.5} fill="#8B0000"/>
      <ellipse cx={cx+4} cy={ry-22} rx={2} ry={1.2} fill="rgba(255,255,255,0.3)"/>
    </g>
  );
  if (g.includes("menta")) return (
    <g>
      {[[-5,0],[ 0,-6],[5,0]].map(([ox,oy],i)=>(
        <ellipse key={i} cx={cx+ox} cy={ry-9+oy} rx={4} ry={6.5}
          fill="#2E8B57" opacity={0.92}
          transform={`rotate(${ox*10},${cx+ox},${ry-9+oy})`}/>
      ))}
    </g>
  );
  if (g.includes("ombrellino")) return (
    <g>
      <path d={`M${cx-12} ${ry-18} A12,5 0 0,0 ${cx+12} ${ry-18}`} fill="#FF6B00" stroke="#CC4400" strokeWidth={0.8}/>
      <path d={`M${cx-12} ${ry-18} A12,5 0 0,0 ${cx} ${ry-13}`} fill="#FFD700" stroke="none"/>
      <path d={`M${cx} ${ry-13} A12,5 0 0,0 ${cx+12} ${ry-18}`} fill="#FF1493" stroke="none"/>
      <line x1={cx} y1={ry-18} x2={cx} y2={ry-4} stroke="#8B4513" strokeWidth={1.2} strokeLinecap="round"/>
    </g>
  );
  if (g.includes("sale") || g.includes("zucchero")) return (
    <line x1={pts[0][0]-3} y1={ry-3} x2={pts[1][0]+3} y2={ry-3}
      stroke="rgba(255,255,255,0.65)" strokeWidth={4} strokeDasharray="2 2" strokeLinecap="round"/>
  );
  return null;
}

// ─── GLASS SVG (core visual component) ───────────────────────────────────────
function GlassSVG({gDef, layers=[], ice=null, salt=false, pour=null, garnish=null, size=180}) {
  const total = layers.reduce((s,l)=>s+l.amount,0);
  const fill = useAnimVal(Math.min(total/(gDef.capacity*0.88),1));
  const [,,W,H] = gDef.viewBox.split(' ').map(Number);
  const svgH=size*(H/W), glH=gDef.bottomY-gDef.rimY;
  const fillH=glH*fill, surY=gDef.bottomY-fillH;
  const tot2=Math.max(total,0.001);
  let stackY=gDef.bottomY;
  const sLayers=layers.map((l,i)=>{
    const lh=glH*(l.amount/tot2)*fill, ly=stackY-lh;
    stackY=ly;
    return {...l,sy:ly,sh:Math.max(lh,0.5)};
  });
  const eff=layers.some(l=>/prosecco|soda|tonica|tonic|sparkling|champagne|ginger/i.test(l.name));
  const uid=gDef.id;
  const pts=gDef.bowlPts.split(' ').map(p=>p.split(',').map(Number));
  return (
    <svg viewBox={gDef.viewBox} width={size} height={svgH} style={{overflow:"visible",filter:"drop-shadow(0 12px 32px rgba(0,0,0,0.5))"}}>
      <defs>
        <clipPath id={`cl-${uid}`}><polygon points={gDef.bowlPts}/></clipPath>
        <linearGradient id={`sh-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
          <stop offset="22%" stopColor="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.07)"/>
        </linearGradient>
        <linearGradient id={`su-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
          <stop offset="50%" stopColor="rgba(255,255,255,0.32)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <radialGradient id={`gl-${uid}`} cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <g clipPath={`url(#cl-${uid})`}>
        {sLayers.map((l,i)=>(
          <rect key={i} x={0} y={l.sy} width={W} height={l.sh} fill={l.color} opacity={0.93}/>
        ))}
        {fill>0.02&&<rect x={0} y={surY-1} width={W} height={3} fill={`url(#su-${uid})`}/>}
        {eff&&fill>0.05&&[0.28,0.5,0.7].map((xr,i)=>(
          <line key={i} x1={W*xr} y1={gDef.bottomY-fillH*0.08} x2={W*xr+(i===1?1.5:-1)} y2={surY+2}
            stroke="rgba(255,255,255,0.2)" strokeWidth={0.7} strokeDasharray="1.5 4"
            style={{animation:`bdash ${1.4+i*0.35}s linear ${i*0.3}s infinite`}}/>
        ))}
        {ice==="cubes"&&fill>0.08&&[[0.15,0.72],[0.38,0.52],[0.62,0.68]].map(([xr,yr],i)=>(
          <rect key={i} x={W*xr} y={gDef.bottomY-fillH*yr} width={W*0.14} height={W*0.12} rx={2}
            fill="rgba(210,235,255,0.3)" stroke="rgba(255,255,255,0.52)" strokeWidth={0.7}/>
        ))}
        {ice==="crushed"&&fill>0.08&&[[0.12,0.3],[0.28,0.5],[0.44,0.18],[0.6,0.4],[0.72,0.22],[0.2,0.65],[0.5,0.55]].map(([xr,yr],i)=>(
          <ellipse key={i} cx={W*(xr+0.06)} cy={gDef.bottomY-fillH*(0.1+yr*0.8)} rx={W*(0.04+(i%3)*0.01)} ry={W*0.025}
            fill="rgba(210,235,255,0.28)" stroke="rgba(255,255,255,0.42)" strokeWidth={0.6}/>
        ))}
        {ice==="sphere"&&fill>0.08&&(
          <circle cx={gDef.cx} cy={gDef.bottomY-fillH*0.52} r={Math.min(W*0.14,fillH*0.4)}
            fill="rgba(210,235,255,0.22)" stroke="rgba(255,255,255,0.45)" strokeWidth={0.8}/>
        )}
        {ice==="stick"&&fill>0.08&&(
          <rect x={gDef.cx-3} y={surY+4} width={6} height={fillH*0.72} rx={3}
            fill="rgba(210,235,255,0.28)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.7}/>
        )}
      </g>
      <polygon points={gDef.bowlPts} fill={`url(#gl-${uid})`} stroke={`rgba(255,255,255,0.42)`} strokeWidth={1.5} strokeLinejoin="round"/>
      <polygon points={gDef.bowlPts} fill={`url(#sh-${uid})`} clipPath={`url(#cl-${uid})`}/>
      <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[1][0]} y2={pts[1][1]}
        stroke="rgba(255,255,255,0.62)" strokeWidth={2} strokeLinecap="round"/>
      {salt&&<line x1={pts[0][0]-3} y1={pts[0][1]-3} x2={pts[1][0]+3} y2={pts[1][1]-3}
        stroke="rgba(255,255,255,0.68)" strokeWidth={4} strokeDasharray="2 2" strokeLinecap="round"/>}
      {gDef.stemD&&<path d={gDef.stemD} stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} fill="none" strokeLinecap="round"/>}
      {gDef.baseD&&<path d={gDef.baseD} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.22)" strokeWidth={1}/>}
      {pour&&fill>0&&(
        <line x1={gDef.cx} y1={gDef.rimY-20} x2={gDef.cx} y2={surY+2}
          stroke={pour} strokeWidth={4} strokeLinecap="round" opacity={0.88}
          style={{animation:"pourS 0.8s ease-out forwards"}}/>
      )}
      {garnish&&<GarnishSVG garnish={garnish} gDef={gDef}/>}
    </svg>
  );
}

function MiniGlass({cocktail, size=52}) {
  const gDef=GLASSES[cocktail.glass]||GLASSES.oldfashioned;
  const [,,W,H]=gDef.viewBox.split(' ').map(Number);
  const svgH=size*(H/W);
  const fs=gDef.rimY+(gDef.bottomY-gDef.rimY)*0.1;
  const fe=gDef.bottomY-(gDef.bottomY-gDef.rimY)*0.06;
  const uid=`mc-${cocktail.id}`;
  const stops=cocktail.ings.length>1
    ? cocktail.ings.map((ing,i)=><stop key={i} offset={`${(i/(cocktail.ings.length-1))*100}%`} stopColor={ing.color} stopOpacity="0.92"/>)
    : [<stop key={0} offset="0%" stopColor={cocktail.ings[0]?.color||"#888"} stopOpacity="0.92"/>];
  return (
    <svg viewBox={gDef.viewBox} width={size} height={svgH} style={{overflow:"visible",filter:"drop-shadow(0 4px 14px rgba(0,0,0,0.45))"}}>
      <defs>
        <clipPath id={uid}><polygon points={gDef.bowlPts}/></clipPath>
        <linearGradient id={`mg-${cocktail.id}`} x1="0" y1="1" x2="0" y2="0">{stops}</linearGradient>
      </defs>
      <g clipPath={`url(#${uid})`}>
        <rect x={0} y={fs} width={W} height={fe-fs} fill={`url(#mg-${cocktail.id})`}/>
        <rect x={0} y={fs} width={W} height={2.5} fill="rgba(255,255,255,0.28)"/>
      </g>
      <polygon points={gDef.bowlPts} fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.48)" strokeWidth={1.5}/>
      {gDef.stemD&&<path d={gDef.stemD} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} fill="none"/>}
      {gDef.baseD&&<path d={gDef.baseD} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1}/>}
    </svg>
  );
}

// ─── AGE GATE ─────────────────────────────────────────────────────────────────
function AgeGate({onVerify}) {
  const [dd,setDd]=useState(""); const [mm,setMm]=useState(""); const [yy,setYy]=useState("");
  const [err,setErr]=useState("");
  function verify() {
    const d=parseInt(dd), m=parseInt(mm), y=parseInt(yy);
    if (!d||!m||!y||y<1900||y>2100) { setErr("Inserisci una data valida."); return; }
    const birth=new Date(y,m-1,d);
    const age=(Date.now()-birth.getTime())/(1000*60*60*24*365.25);
    if (isNaN(age)||age<18) { setErr("Devi avere almeno 18 anni per accedere."); return; }
    onVerify();
  }
  const inp={background:"rgba(255,255,255,0.07)",border:"1px solid rgba(201,168,76,0.3)",
    borderRadius:8,padding:"12px",color:"#F5EDD8",fontFamily:"Cormorant Garamond, serif",
    fontSize:22,textAlign:"center",outline:"none",width:"100%",boxSizing:"border-box",
    transition:"border-color 0.2s"};
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",
      justifyContent:"center",padding:20,
      background:"radial-gradient(ellipse at 18% 60%, #150b2a 0%, #060610 55%, #0a0e1e 100%)"}}>
      {/* ambient rings */}
      {[160,280,400,520].map(r=>(
        <div key={r} style={{position:"absolute",width:r,height:r,borderRadius:"50%",
          border:"1px solid rgba(201,168,76,0.08)",top:"50%",left:"50%",
          transform:"translate(-50%,-50%)"}}/>
      ))}
      <div style={{position:"relative",maxWidth:420,width:"100%",
        background:"rgba(14,8,24,0.95)",border:"1px solid rgba(201,168,76,0.25)",
        borderRadius:20,padding:"48px 36px",textAlign:"center",
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)"}}>
        <div style={{width:48,height:1,background:"#C9A84C",margin:"0 auto 28px",opacity:0.6}}/>
        <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:36,fontWeight:600,
          color:"#C9A84C",letterSpacing:"0.1em",marginBottom:4}}>BALDI'S LAB</div>
        <div style={{fontFamily:"Raleway, sans-serif",fontSize:11,letterSpacing:"0.3em",
          color:"rgba(245,237,216,0.4)",textTransform:"uppercase",marginBottom:36}}>
          Premium Mixology Platform
        </div>
        <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:22,color:"#F5EDD8",
          marginBottom:8}}>Verifica dell'Età</div>
        <p style={{fontFamily:"Raleway, sans-serif",fontSize:13,
          color:"rgba(245,237,216,0.5)",lineHeight:1.65,marginBottom:28}}>
          Questo sito tratta contenuti relativi all'alcol.<br/>
          Devi avere <strong style={{color:"#C9A84C"}}>18 anni compiuti</strong> per accedere.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.6fr",gap:10,marginBottom:8}}>
          {[["GG",dd,setDd,2],["MM",mm,setMm,2],["AAAA",yy,setYy,4]].map(([ph,val,set,mx])=>(
            <input key={ph} placeholder={ph} value={val} maxLength={mx}
              onChange={e=>set(e.target.value.replace(/\D/g,""))}
              style={inp}
              onFocus={e=>e.target.style.borderColor="#C9A84C"}
              onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.3)"}/>
          ))}
        </div>
        {err&&<p style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:"#FF6B6B",
          marginBottom:12}}>{err}</p>}
        <button onClick={verify} style={{width:"100%",marginTop:10,
          background:"linear-gradient(135deg,#B07340,#C9A84C)",border:"none",
          borderRadius:8,padding:"14px",cursor:"pointer",
          fontFamily:"Raleway, sans-serif",fontWeight:700,letterSpacing:"0.12em",
          textTransform:"uppercase",fontSize:12,color:"#0a0810",
          boxShadow:"0 4px 20px rgba(201,168,76,0.35)",transition:"all 0.2s"}}>
          Confermo di avere 18+ anni
        </button>
        <p style={{fontFamily:"Raleway, sans-serif",fontSize:11,
          color:"rgba(245,237,216,0.3)",marginTop:20,lineHeight:1.6}}>
          Bevi responsabilmente. Baldi's Lab promuove il consumo consapevole degli alcolici.
        </p>
      </div>
    </div>
  );
}

// ─── AMBIENT DECOR (seasonal) ─────────────────────────────────────────────────
function AmbientDecor({theme}) {
  const cfgs={
    winter:   {chars:["❄","✦","❅","·"], count:14, opacity:0.22},
    halloween:{chars:["◆","⬡","✦","◇"], count:10, opacity:0.18},
    christmas:{chars:["✦","★","❄","·"], count:12, opacity:0.20},
    summer:   {chars:["✦","○","◆","·"], count:8,  opacity:0.16},
  };
  const c=cfgs[theme]; if(!c) return null;
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {Array.from({length:c.count},(_,i)=>{
        const x=(i*17+5)%92, y=(i*23+12)%88;
        const sz=9+(i%4)*5, dur=3.5+i%4, delay=i*0.38;
        const col={winter:"rgba(168,216,240,",halloween:"rgba(255,107,0,",christmas:"rgba(255,215,0,",summer:"rgba(255,179,71,"}[theme];
        return (
          <div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,
            color:`${col}${c.opacity})`,fontSize:sz,
            animation:`floatGlass ${dur}s ease-in-out ${delay}s infinite`,
            userSelect:"none",fontFamily:"serif"}}>
            {c.chars[i%c.chars.length]}
          </div>
        );
      })}
    </div>
  );
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  {id:"home",     label:"Home"},
  {id:"simulator",label:"Laboratory"},
  {id:"library",  label:"Cocktails"},
  {id:"ai",       label:"AI Bartender"},
  {id:"encyclopedia",label:"Enciclopedia"},
  {id:"cabinet",  label:"Bar Cabinet"},
];

function NavBar({t, theme, setTheme, page, setPage, user=null, onAuthClick}) {
  const [open, setOpen] = useState(false);
  const allLinks = [...NAV_LINKS, ...(user ? [{id:"profile",label:"👤 Profilo"}] : [])];
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,
      background:t.nav, borderBottom:`1px solid ${t.border}`,
      backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)"}}>
      <div style={{maxWidth:1300,margin:"0 auto",padding:"0 24px",height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {/* Logo */}
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
          <span style={{fontFamily:"Cormorant Garamond, serif",fontSize:22,fontWeight:600,
            color:t.gold,letterSpacing:"0.08em"}}>BALDI'S</span>
          <span style={{fontFamily:"Cormorant Garamond, serif",fontSize:22,fontWeight:300,
            color:t.text,letterSpacing:"0.08em"}}> LAB</span>
        </button>
        {/* Desktop links */}
        <div style={{display:"flex",gap:4}} className="nav-desktop">
          {NAV_LINKS.filter(l=>l.id!=="home").map(l=>(
            <button key={l.id} onClick={()=>setPage(l.id)}
              style={{background:page===l.id?t.goldSoft:"none",border:"none",cursor:"pointer",
                padding:"6px 12px",borderRadius:6,color:page===l.id?t.gold:t.textMuted,
                fontFamily:"Raleway, sans-serif",fontWeight:page===l.id?600:400,fontSize:12,
                letterSpacing:"0.04em",transition:"all 0.2s"}}>
              {l.label}
            </button>
          ))}
        </div>
        {/* Right controls */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <select value={theme} onChange={e=>setTheme(e.target.value)}
            style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,
              padding:"6px 10px",cursor:"pointer",color:t.gold,fontSize:11,
              fontFamily:"Raleway, sans-serif",fontWeight:500,outline:"none",
              maxWidth:120,transition:"all 0.2s"}}>
            {Object.values(T).map(th=>(
              <option key={th.id} value={th.id} style={{background:"#0a0810",color:"#F5EDD8"}}>{th.label}</option>
            ))}
          </select>
          {/* Auth / Profile button */}
          {user ? (
            <button onClick={()=>setPage("profile")}
              style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
                background:`linear-gradient(135deg,${t.copper},${t.gold})`,
                border:`2px solid ${page==="profile"?t.gold:t.border}`,
                cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",
                justifyContent:"center",transition:"all 0.2s"}}
              title={user.displayName}>
              🍸
            </button>
          ) : (
            <button onClick={onAuthClick}
              style={{background:`linear-gradient(135deg,${t.copper},${t.gold})`,border:"none",
                borderRadius:8,padding:"8px 14px",cursor:"pointer",
                color:theme==="day"?"#2a1808":"#0a0810",
                fontFamily:"Raleway, sans-serif",fontWeight:700,fontSize:11,
                letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.2s",
                whiteSpace:"nowrap"}}>
              ACCEDI
            </button>
          )}
          <button onClick={()=>setOpen(!open)} className="nav-hamburger"
            style={{background:"none",border:"none",cursor:"pointer",color:t.text,fontSize:20,padding:4}}>
            {open?"✕":"☰"}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {open&&(
        <div style={{padding:"12px 24px 16px",borderTop:`1px solid ${t.border}`,display:"flex",flexDirection:"column",gap:4}} className="nav-mobile-menu">
          {allLinks.map(l=>(
            <button key={l.id} onClick={()=>{setPage(l.id);setOpen(false);}}
              style={{background:page===l.id?t.goldSoft:"none",border:"none",textAlign:"left",
                cursor:"pointer",padding:"10px 14px",borderRadius:6,color:page===l.id?t.gold:t.text,
                fontFamily:"Raleway, sans-serif",fontWeight:500,fontSize:14,transition:"all 0.2s"}}>
              {l.label}
            </button>
          ))}
          {!user&&(
            <button onClick={()=>{onAuthClick();setOpen(false);}}
              style={{background:`linear-gradient(135deg,${t.copper},${t.gold})`,border:"none",
                borderRadius:8,padding:"11px 14px",cursor:"pointer",
                color:theme==="day"?"#2a1808":"#0a0810",textAlign:"left",marginTop:6,
                fontFamily:"Raleway, sans-serif",fontWeight:700,fontSize:13}}>
              🔑 Accedi / Registrati
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({t, theme, setPage, setModal, favorites=new Set(), onToggleFav}) {
  const heroLayers=[
    {name:"Gin",amount:30,color:"rgba(210,235,255,0.6)"},
    {name:"Campari",amount:30,color:"#C0392B"},
    {name:"Vermut Rosso",amount:30,color:"#8B2020"},
  ];
  const features=[
    {icon:"🤖",title:"AI Bartender",desc:"Chiedi all'intelligenza artificiale di creare il cocktail perfetto per te.",cta:"Prova ora",page:"ai"},
    {icon:"🧪",title:"Simulatore",desc:"Costruisci visivamente il tuo cocktail con animazioni in tempo reale.",cta:"Apri il Lab",page:"simulator"},
    {icon:"📚",title:"Enciclopedia",desc:"Tecniche, ingredienti, storia. Tutto ciò che serve per diventare un maestro.",cta:"Scopri",page:"encyclopedia"},
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 24px 40px",
        maxWidth:1300,margin:"0 auto",gap:40,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 420px",minWidth:280}}>
          <div style={{fontSize:11,letterSpacing:"0.25em",color:t.gold,fontFamily:"Raleway, sans-serif",
            fontWeight:600,textTransform:"uppercase",marginBottom:20,opacity:0.85}}>
            Laboratorio Digitale di Mixology
          </div>
          <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(60px,8vw,100px)",
            lineHeight:0.9,fontWeight:600,marginBottom:8,color:t.text}}>
            BALDI'S
          </h1>
          <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(60px,8vw,100px)",
            lineHeight:0.9,fontWeight:300,marginBottom:32,color:t.gold,fontStyle:"italic"}}>
            LAB
          </h1>
          <div style={{width:60,height:1,background:t.gold,marginBottom:32,opacity:0.6}}/>
          <p style={{fontSize:17,lineHeight:1.7,color:t.textMuted,maxWidth:460,marginBottom:36,
            fontFamily:"Raleway, sans-serif",fontWeight:300}}>
            Un laboratorio premium dove la scienza incontra l'arte.
            Crea, esplora e perfeziona ogni cocktail con strumenti da professionista.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button onClick={()=>setPage("simulator")}
              style={{background:`linear-gradient(135deg,${t.copper},${t.gold})`,border:"none",
                color:theme==="night"?"#0a0810":"#2a1808",cursor:"pointer",
                fontFamily:"Raleway, sans-serif",fontWeight:700,letterSpacing:"0.1em",
                textTransform:"uppercase",fontSize:12,padding:"14px 32px",borderRadius:4,
                boxShadow:`0 4px 24px rgba(${t.goldRgb},0.35)`,transition:"all 0.3s"}}>
              Apri il Laboratory
            </button>
            <button onClick={()=>setPage("library")}
              style={{background:"none",border:`1px solid ${t.gold}`,color:t.gold,cursor:"pointer",
                fontFamily:"Raleway, sans-serif",fontWeight:600,letterSpacing:"0.08em",
                textTransform:"uppercase",fontSize:12,padding:"14px 32px",borderRadius:4,
                transition:"all 0.3s"}}>
              Esplora i Cocktail
            </button>
          </div>
        </div>
        {/* Hero glass */}
        <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{animation:"floatGlass 4s ease-in-out infinite"}}>
            <GlassSVG gDef={GLASSES.oldfashioned} layers={heroLayers} ice="cubes" size={220}/>
          </div>
          <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:14,color:t.textMuted,
            letterSpacing:"0.1em",textTransform:"uppercase",fontStyle:"italic"}}>
            Negroni
          </div>
        </div>
      </section>

      {/* Featured Cocktails */}
      <section style={{padding:"60px 24px",maxWidth:1300,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:36,flexWrap:"wrap",gap:12}}>
          <h2 style={{fontFamily:"Cormorant Garamond, serif",fontSize:38,fontWeight:600,color:t.text,letterSpacing:"0.02em"}}>
            Cocktail in Evidenza
          </h2>
          <button onClick={()=>setPage("library")}
            style={{background:"none",border:"none",color:t.gold,cursor:"pointer",
              fontFamily:"Raleway, sans-serif",fontSize:13,letterSpacing:"0.06em",
              fontWeight:500,textDecoration:"underline",textUnderlineOffset:3}}>
            Vedi tutti →
          </button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
          {COCKTAILS.slice(0,8).map(c=>(
            <CocktailCard key={c.id} cocktail={c} t={t} onClick={()=>setModal(c)}
              favorites={favorites} onToggleFav={onToggleFav}/>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{padding:"60px 24px 80px",maxWidth:1300,margin:"0 auto"}}>
        <div style={{width:50,height:1,background:t.gold,margin:"0 auto 20px",opacity:0.5}}/>
        <h2 style={{fontFamily:"Cormorant Garamond, serif",fontSize:38,fontWeight:600,color:t.text,
          textAlign:"center",marginBottom:48,letterSpacing:"0.02em"}}>
          Strumenti da Professionista
        </h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
          {features.map(f=>(
            <div key={f.page} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,
              padding:"36px 28px",textAlign:"center",transition:"all 0.3s",cursor:"pointer"}}
              onClick={()=>setPage(f.page)}
              className="feat-card">
              <div style={{fontSize:44,marginBottom:16}}>{f.icon}</div>
              <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:12}}>{f.title}</h3>
              <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.textMuted,lineHeight:1.65,marginBottom:20}}>{f.desc}</p>
              <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,fontWeight:700,
                letterSpacing:"0.12em",textTransform:"uppercase",color:t.gold}}>{f.cta} →</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CocktailCard({cocktail, t, onClick, favorites=null, onToggleFav=null}) {
  const isFav = favorites ? favorites.has(cocktail.id) : false;
  const diffDots=["●","●","●"].map((d,i)=>(
    <span key={i} style={{color:i<cocktail.diff?t.gold:t.textSub,fontSize:10}}>{d}</span>
  ));
  return (
    <div className="cocktail-card" style={{background:t.card,border:`1px solid ${t.border}`,
      borderRadius:14,padding:20,cursor:"pointer",transition:"all 0.3s",overflow:"hidden",position:"relative"}}
      onClick={onClick}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,
        background:`linear-gradient(90deg,transparent,${cocktail.color},transparent)`}}/>
      {onToggleFav&&(
        <button onClick={e=>{e.stopPropagation();onToggleFav(cocktail.id);}}
          style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",
            fontSize:17,lineHeight:1,color:isFav?"#FF4466":t.textSub,transition:"all 0.2s",padding:4,
            filter:isFav?"drop-shadow(0 0 4px #FF4466)":"none"}}>
          {isFav?"♥":"♡"}
        </button>
      )}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
        <div style={{flex:1,paddingRight:onToggleFav?20:0}}>
          <div style={{fontSize:10,letterSpacing:"0.15em",color:t.textSub,fontFamily:"Raleway, sans-serif",
            textTransform:"uppercase",marginBottom:6,fontWeight:600}}>{cocktail.cat}</div>
          <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:6,lineHeight:1.1}}>{cocktail.name}</h3>
          <div style={{fontSize:11,color:t.textMuted,fontFamily:"Raleway, sans-serif",
            fontStyle:"italic",marginBottom:12}}>{cocktail.origin}</div>
        </div>
        <div style={{flexShrink:0}}>
          <MiniGlass cocktail={cocktail} size={48}/>
        </div>
      </div>
      <p style={{fontSize:13,color:t.textMuted,fontFamily:"Raleway, sans-serif",lineHeight:1.6,
        marginBottom:14,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
        {cocktail.desc}
      </p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:8}}>
          <span style={{background:t.tag,color:t.gold,fontSize:11,padding:"3px 9px",borderRadius:12,
            fontFamily:"Raleway, sans-serif",fontWeight:600}}>
            {cocktail.abv>0?`${cocktail.abv}% Vol`:"Analcolico"}
          </span>
          <span style={{background:t.tag,color:t.gold,fontSize:11,padding:"3px 9px",borderRadius:12,
            fontFamily:"Raleway, sans-serif",fontWeight:600}}>{cocktail.time} min</span>
        </div>
        <div style={{display:"flex",gap:2}}>{diffDots}</div>
      </div>
    </div>
  );
}

// ─── COCKTAIL MODAL ───────────────────────────────────────────────────────────
function CocktailModal({cocktail: initC, t, onClose, favorites=new Set(), onToggleFav, ratings={}, onRate}) {
  const [cocktail, setCocktail] = useState(initC);
  const [showExport, setShowExport] = useState(false);
  // Reset when parent passes a new cocktail
  useEffect(() => { setCocktail(initC); setShowExport(false); }, [initC?.id]);
  if (!cocktail) return null;
  const isFav = favorites.has(cocktail.id);
  const userRating = ratings[cocktail.id] || 0;
  // Related cocktails (share ≥ 2 tags)
  const related = COCKTAILS
    .filter(c => c.id !== cocktail.id)
    .filter(c => c.tags.filter(tag => cocktail.tags.includes(tag)).length >= 2)
    .slice(0, 3);
  const gDef=GLASSES[cocktail.glass]||GLASSES.oldfashioned;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,
      background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:t.surface,border:`1px solid ${t.border}`,
        borderRadius:20,maxWidth:700,width:"100%",maxHeight:"90vh",overflowY:"auto",padding:"36px 32px",
        position:"relative",boxShadow:`0 24px 80px rgba(0,0,0,0.6)`}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",
          border:"none",cursor:"pointer",color:t.textMuted,fontSize:22,lineHeight:1}}>✕</button>
        {onToggleFav&&(
          <button onClick={()=>onToggleFav(cocktail.id)}
            style={{position:"absolute",top:16,right:52,background:"none",border:"none",
              cursor:"pointer",fontSize:22,lineHeight:1,
              color:isFav?"#FF4466":t.textMuted,
              filter:isFav?"drop-shadow(0 0 6px #FF4466)":"none",transition:"all 0.2s"}}>
            {isFav?"♥":"♡"}
          </button>
        )}
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"20px 20px 0 0",
          background:`linear-gradient(90deg,transparent,${cocktail.color},transparent)`}}/>
        <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:220}}>
            <div style={{fontSize:10,letterSpacing:"0.2em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",marginBottom:8,fontWeight:600}}>{cocktail.cat} · {cocktail.origin}</div>
            <h2 style={{fontFamily:"Cormorant Garamond, serif",fontSize:44,color:t.text,marginBottom:12,lineHeight:1}}>{cocktail.name}</h2>
            <p style={{fontSize:15,color:t.textMuted,fontFamily:"Raleway, sans-serif",lineHeight:1.7,marginBottom:24}}>{cocktail.desc}</p>
            <div style={{marginBottom:24}}>
              <h4 style={{fontFamily:"Cormorant Garamond, serif",fontSize:18,color:t.text,marginBottom:12}}>Ingredienti</h4>
              {cocktail.ings.map((ing,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:ing.color,
                    border:"1px solid rgba(255,255,255,0.3)",flexShrink:0}}/>
                  <span style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.text,flex:1}}>{ing.name}</span>
                  <span style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.gold,fontWeight:600}}>{ing.amount} ml</span>
                </div>
              ))}
            </div>
            <div style={{marginBottom:20}}>
              <h4 style={{fontFamily:"Cormorant Garamond, serif",fontSize:18,color:t.text,marginBottom:8}}>Metodo</h4>
              <p style={{fontSize:14,color:t.textMuted,fontFamily:"Raleway, sans-serif",lineHeight:1.7}}>{cocktail.method}</p>
            </div>
            <div style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted,fontStyle:"italic"}}>
              🍊 Garnish: {cocktail.garnish}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <GlassSVG gDef={GLASSES[cocktail.glass]||GLASSES.oldfashioned} layers={cocktail.ings} ice="cubes" size={160}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,width:"100%"}}>
              {[["ABV",`${cocktail.abv}%`],["Cal",`~${cocktail.cal}`],["Tempo",`${cocktail.time} min`],["Diff",["•","••","•••"][cocktail.diff-1]]].map(([k,v])=>(
                <div key={k} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:t.textSub,fontFamily:"Raleway, sans-serif",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{k}</div>
                  <div style={{fontSize:16,color:t.gold,fontFamily:"Cormorant Garamond, serif",fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:20}}>
          {cocktail.tags.map(tag=>(
            <span key={tag} style={{background:t.tag,color:t.gold,fontSize:11,padding:"4px 12px",
              borderRadius:20,fontFamily:"Raleway, sans-serif",fontWeight:500}}>#{tag}</span>
          ))}
        </div>
        {/* Rating */}
        {onRate&&(
          <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${t.border}`}}>
            <div style={{fontSize:10,letterSpacing:"0.18em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",marginBottom:8,fontWeight:600}}>La Tua Valutazione</div>
            <RatingStars cocktailId={cocktail.id} ratings={ratings} onRate={onRate} t={t} size={22}/>
          </div>
        )}
        {/* Potrebbe piacerti */}
        {related.length>0&&(
          <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${t.border}`}}>
            <div style={{fontSize:10,letterSpacing:"0.18em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Potrebbe Piacerti</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {related.map(c=>(
                <div key={c.id} onClick={()=>setCocktail(c)}
                  style={{display:"flex",alignItems:"center",gap:10,
                    background:t.card,border:`1px solid ${t.border}`,
                    borderRadius:10,padding:"8px 12px",cursor:"pointer",
                    flex:"1 1 150px",transition:"all 0.2s"}}
                  className="cocktail-card">
                  <MiniGlass cocktail={c} size={32}/>
                  <div>
                    <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:16,color:t.text,lineHeight:1.1}}>{c.name}</div>
                    <div style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.textMuted}}>{c.cat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Export / Share button */}
        <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${t.border}`,
          display:"flex",justifyContent:"center"}}>
          <button onClick={()=>setShowExport(true)}
            style={{background:t.goldSoft,border:`1px solid ${t.gold}`,borderRadius:8,
              padding:"10px 24px",cursor:"pointer",color:t.gold,
              fontFamily:"Raleway, sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.08em",
              display:"flex",alignItems:"center",gap:8,transition:"all 0.2s"}}>
            📤 Condividi Ricetta
          </button>
        </div>
      </div>
      {showExport&&<RecipeExportCard cocktail={cocktail} t={t} onClose={()=>setShowExport(false)}/>}
    </div>
  );
}

// ─── SIMULATOR PAGE ───────────────────────────────────────────────────────────
const GARNISHES = ["Nessuno","Scorza Arancia","Scorza Lime","Fetta Lime","Fetta Arancia","Menta","Ciliegia","Ombrellino","Sale","Zucchero"];
const ICE_TYPES = [
  {id:null,   label:"Nessuno", emoji:"🚫"},
  {id:"cubes",label:"Cubetti", emoji:"🧊"},
  {id:"crushed",label:"Crushed",emoji:"❄️"},
  {id:"sphere",label:"Sfera",  emoji:"⚪"},
  {id:"stick", label:"Stick",  emoji:"➖"},
];

function SimulatorPage({t, theme}) {
  const [glassKey, setGlassKey] = useState("oldfashioned");
  const [layers, setLayers] = useState([]);
  const [ice, setIce] = useState(null);
  const [garnish, setGarnish] = useState("Nessuno");
  const [salt, setSalt] = useState(false);
  const [pour, setPour] = useState(null);
  const [ingCat, setIngCat] = useState("Tutti");
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState({});
  const gDef = GLASSES[glassKey];
  const stats = calcStats(layers);
  const match = matchCocktail(layers);
  const filteredIngs = INGS.filter(i=>
    (ingCat==="Tutti"||i.cat===ingCat) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  function addIng(ing) {
    const amt = amounts[ing.id]||ing.ml;
    setLayers(prev=>{
      const ex=prev.find(l=>l.name===ing.name);
      if(ex) return prev.map(l=>l.name===ing.name?{...l,amount:l.amount+amt}:l);
      return [...prev,{name:ing.name,amount:amt,color:ing.color}];
    });
    setPour(ing.color);
    setTimeout(()=>setPour(null),900);
  }

  function removeLayer(name) { setLayers(prev=>prev.filter(l=>l.name!==name)); }
  function adjustLayer(name,delta) {
    setLayers(prev=>prev.map(l=>l.name===name?{...l,amount:Math.max(5,l.amount+delta)}:l));
  }
  function reset() { setLayers([]); setIce(null); setSalt(false); setGarnish("Nessuno"); }

  const pct = Math.min(100,Math.round(layers.reduce((s,l)=>s+l.amount,0)/(gDef.capacity*0.88)*100));

  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"90px 20px 40px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:40,color:t.text,marginBottom:4}}>
            🧪 Laboratory
          </h1>
          <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.textMuted}}>
            Costruisci il tuo cocktail ingrediente per ingrediente
          </p>
        </div>
        <button onClick={reset} style={{background:"none",border:`1px solid ${t.border}`,
          color:t.textMuted,cursor:"pointer",borderRadius:8,padding:"8px 18px",
          fontFamily:"Raleway, sans-serif",fontSize:13,transition:"all 0.2s"}}>
          ↺ Reset
        </button>
      </div>

      {/* Recognition Banner */}
      {match&&layers.length>0&&(
        <div style={{background:`linear-gradient(135deg,rgba(${t.goldRgb},0.15),rgba(${t.goldRgb},0.06))`,
          border:`1px solid rgba(${t.goldRgb},0.35)`,borderRadius:12,padding:"14px 20px",
          marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>✨</span>
          <div>
            <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:20,color:t.gold,fontWeight:600}}>
              Stai preparando un {match.name}!
            </div>
            <div style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted}}>{match.desc}</div>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"260px 1fr 220px",gap:20,alignItems:"start"}} className="sim-grid">
        {/* Left: Glass selector + Ingredients */}
        <div>
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:16,marginBottom:16}}>
            <div style={{fontSize:11,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Bicchiere</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {Object.values(GLASSES).map(g=>(
                <button key={g.id} onClick={()=>{setGlassKey(g.id);setLayers([]);}}
                  style={{background:glassKey===g.id?t.goldSoft:"none",
                    border:`1px solid ${glassKey===g.id?t.gold:t.border}`,
                    borderRadius:8,padding:"8px 6px",cursor:"pointer",
                    color:glassKey===g.id?t.gold:t.textMuted,
                    fontFamily:"Raleway, sans-serif",fontSize:11,fontWeight:500,
                    display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.2s"}}>
                  <span style={{fontSize:18}}>{g.emoji}</span>
                  <span>{g.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Ingredient Panel */}
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:11,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Ingredienti</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca..."
              style={{width:"100%",background:t.input,border:`1px solid ${t.inpBdr}`,borderRadius:6,
                padding:"7px 10px",color:t.text,fontFamily:"Raleway, sans-serif",fontSize:13,
                outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
              {["Tutti","Gin","Vodka","Rum","Whisky","Tequila","Bitter","Liquori","Succhi","Soft Drinks"].map(c=>(
                <button key={c} onClick={()=>setIngCat(c)}
                  style={{background:ingCat===c?t.goldSoft:"none",border:`1px solid ${ingCat===c?t.gold:t.border}`,
                    borderRadius:20,padding:"2px 8px",cursor:"pointer",color:ingCat===c?t.gold:t.textSub,
                    fontFamily:"Raleway, sans-serif",fontSize:10,fontWeight:500,transition:"all 0.15s"}}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{maxHeight:340,overflowY:"auto"}}>
              {filteredIngs.map(ing=>(
                <div key={ing.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 4px",
                  borderBottom:`1px solid ${t.border}`,transition:"background 0.15s",borderRadius:4}}
                  className="ing-row">
                  <span style={{width:8,height:8,borderRadius:"50%",background:ing.color,
                    border:"1px solid rgba(255,255,255,0.3)",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.text,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                    {ing.abv>0&&<div style={{fontFamily:"Raleway, sans-serif",fontSize:10,color:t.textSub}}>{ing.abv}% vol</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <input type="number" value={amounts[ing.id]||ing.ml} min={5} max={250} step={5}
                      onChange={e=>setAmounts(prev=>({...prev,[ing.id]:+e.target.value}))}
                      style={{width:38,background:t.input,border:`1px solid ${t.inpBdr}`,
                        borderRadius:4,padding:"2px 4px",color:t.gold,fontFamily:"Raleway, sans-serif",
                        fontSize:11,textAlign:"center",outline:"none"}}/>
                    <button onClick={()=>addIng(ing)} style={{background:t.goldSoft,border:`1px solid ${t.gold}`,
                      borderRadius:4,padding:"3px 8px",cursor:"pointer",color:t.gold,
                      fontSize:14,lineHeight:1,fontWeight:600,transition:"all 0.15s",flexShrink:0}}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Animated Glass */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <div style={{position:"relative",padding:"24px 0"}}>
            <GlassSVG gDef={gDef} layers={layers} ice={ice} salt={salt} pour={pour}
              garnish={garnish!=="Nessuno"?garnish:null} size={210}/>
          </div>
          {/* Fill progress */}
          <div style={{width:210}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.textSub}}>Riempimento</span>
              <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.gold,fontWeight:600}}>{pct}%</span>
            </div>
            <div style={{height:3,background:`rgba(${t.goldRgb},0.12)`,borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${t.copper},${t.gold})`,
                borderRadius:2,transition:"width 0.5s ease"}}/>
            </div>
          </div>
          {/* Active layers */}
          {layers.length>0&&(
            <div style={{width:"100%",maxWidth:340}}>
              <div style={{fontSize:11,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
                textTransform:"uppercase",fontWeight:600,marginBottom:10,textAlign:"center"}}>Composizione</div>
              {layers.map((l,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",
                  background:t.card,border:`1px solid ${t.border}`,borderRadius:8,marginBottom:6}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:l.color,
                    border:"1px solid rgba(255,255,255,0.3)",flexShrink:0}}/>
                  <span style={{flex:1,fontFamily:"Raleway, sans-serif",fontSize:13,color:t.text}}>{l.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <button onClick={()=>adjustLayer(l.name,-5)} style={{background:t.input,border:`1px solid ${t.border}`,
                      borderRadius:3,width:20,height:20,cursor:"pointer",color:t.textMuted,fontSize:14,lineHeight:1}}>−</button>
                    <span style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.gold,
                      minWidth:36,textAlign:"center",fontWeight:600}}>{l.amount}ml</span>
                    <button onClick={()=>adjustLayer(l.name,5)} style={{background:t.input,border:`1px solid ${t.border}`,
                      borderRadius:3,width:20,height:20,cursor:"pointer",color:t.textMuted,fontSize:14,lineHeight:1}}>+</button>
                    <button onClick={()=>removeLayer(l.name)} style={{background:"none",border:"none",
                      cursor:"pointer",color:t.textSub,fontSize:14,marginLeft:2,padding:0,lineHeight:1}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {layers.length===0&&(
            <div style={{textAlign:"center",color:t.textSub,fontFamily:"Raleway, sans-serif",fontSize:13,
              fontStyle:"italic",padding:"20px 0"}}>
              Aggiungi ingredienti per iniziare...
            </div>
          )}
        </div>

        {/* Right: Ice, Garnish, Stats */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Ice */}
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:11,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Ghiaccio</div>
            {ICE_TYPES.map(i=>(
              <button key={String(i.id)} onClick={()=>setIce(i.id)}
                style={{display:"flex",alignItems:"center",gap:8,width:"100%",
                  background:ice===i.id?t.goldSoft:"none",border:`1px solid ${ice===i.id?t.gold:t.border}`,
                  borderRadius:7,padding:"7px 10px",cursor:"pointer",marginBottom:5,
                  color:ice===i.id?t.gold:t.textMuted,fontFamily:"Raleway, sans-serif",fontSize:13,
                  fontWeight:ice===i.id?600:400,transition:"all 0.2s"}}>
                <span style={{fontSize:16}}>{i.emoji}</span> {i.label}
              </button>
            ))}
          </div>
          {/* Garnish */}
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:11,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Guarnizione</div>
            <select value={garnish} onChange={e=>setGarnish(e.target.value)}
              style={{width:"100%",background:t.input,border:`1px solid ${t.inpBdr}`,
                borderRadius:6,padding:"8px 10px",color:t.text,fontFamily:"Raleway, sans-serif",
                fontSize:13,outline:"none",cursor:"pointer"}}>
              {GARNISHES.map(g=><option key={g} value={g} style={{background:"#1a1025"}}>{g}</option>)}
            </select>
            <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8}}>
              <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                <input type="checkbox" checked={salt} onChange={e=>setSalt(e.target.checked)}
                  style={{accentColor:t.gold}}/>
                <span style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted}}>Sale/Zucchero sul bordo</span>
              </label>
            </div>
          </div>
          {/* Stats */}
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:11,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
              textTransform:"uppercase",fontWeight:600,marginBottom:14}}>Statistiche</div>
            {[
              ["Volume",`${stats.vol} ml / ${gDef.capacity} ml`],
              ["ABV",`${stats.abv}%`],
              ["Calorie",`~${stats.cal} kcal`],
              ["Bicchiere",gDef.name],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
                <span style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.textMuted}}>{k}</span>
                <span style={{fontFamily:"Cormorant Garamond, serif",fontSize:15,color:t.gold,fontWeight:600}}>{v}</span>
              </div>
            ))}
            {garnish!=="Nessuno"&&(
              <div style={{marginTop:10,padding:"8px 10px",background:t.tag,borderRadius:6}}>
                <span style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.gold}}>
                  🍊 {garnish}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI BARTENDER ─────────────────────────────────────────────────────────────
async function askAI(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system:`Sei il maestro bartender dell'AI di Baldi's Lab, un laboratorio digitale di mixology premium.
Rispondi con passione, competenza e uno stile elegante.
Quando suggerisci cocktail, menziona sempre: ingredienti principali, tecnica corretta, bicchiere consigliato, guarnizione.
Mantieni le risposte concise (max 3 paragrafi) ma ricche di dettagli tecnici.
Puoi rispondere in italiano o nella lingua dell'utente.`,
      messages: messages.map(m=>({role:m.role,content:m.content})),
    })
  });
  const d = await res.json();
  return d.content?.[0]?.text || "Mi dispiace, si è verificato un errore. Riprova.";
}

function AIPage({t, theme}) {
  const [msgs, setMsgs] = useState([
    {role:"assistant",content:"Benvenuto nel Baldi's Lab! 🍸 Sono il tuo AI Bartender. Dimmi cosa hai nel tuo bar o quale emozione vuoi creare questa sera, e ti suggerirò il cocktail perfetto."}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  async function send() {
    if (!input.trim()||loading) return;
    const userMsg = {role:"user",content:input.trim()};
    setMsgs(p=>[...p,userMsg]);
    setInput(""); setLoading(true);
    try {
      const all = [...msgs,userMsg];
      const reply = await askAI(all);
      setMsgs(p=>[...p,{role:"assistant",content:reply}]);
    } catch(e) {
      setMsgs(p=>[...p,{role:"assistant",content:"Si è verificato un errore di connessione. Riprova tra un momento."}]);
    } finally { setLoading(false); }
  }

  const suggestions=["Cosa posso fare con gin, Campari e vermut?","Suggeriscimi un cocktail estivo senza alcol","Qual è la tecnica corretta per un Dry Martini?","Ho vodka, lime e zenzero, cosa posso preparare?"];

  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"90px 20px 20px",height:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:40,color:t.text,marginBottom:4}}>
          🤖 AI Bartender
        </h1>
        <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.textMuted}}>
          Il tuo maestro barman digitale, disponibile 24/7
        </p>
      </div>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",marginBottom:16,paddingRight:4}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:14}}>
            {m.role==="assistant"&&(
              <div style={{width:32,height:32,borderRadius:"50%",background:t.goldSoft,
                border:`1px solid ${t.gold}`,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:14,marginRight:10,flexShrink:0,alignSelf:"flex-end"}}>🍸</div>
            )}
            <div style={{maxWidth:"76%",background:m.role==="user"?t.goldSoft:t.card,
              border:`1px solid ${m.role==="user"?t.gold:t.border}`,
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              padding:"12px 16px"}}>
              <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.text,
                lineHeight:1.7,margin:0,whiteSpace:"pre-wrap"}}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:t.goldSoft,
              border:`1px solid ${t.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🍸</div>
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:"16px 16px 16px 4px",padding:"12px 20px"}}>
              <span style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted,
                animation:"loadingDot 1.2s ease-in-out infinite"}}>Elaborando la risposta...</span>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {/* Suggestions */}
      {msgs.length===1&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>setInput(s)}
              style={{background:t.tag,border:`1px solid ${t.border}`,borderRadius:20,
                padding:"6px 14px",cursor:"pointer",color:t.textMuted,
                fontFamily:"Raleway, sans-serif",fontSize:12,transition:"all 0.2s"}}>
              {s}
            </button>
          ))}
        </div>
      )}
      {/* Input */}
      <div style={{display:"flex",gap:10,padding:"14px 16px",background:t.card,
        border:`1px solid ${t.border}`,borderRadius:14}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),send())}
          placeholder="Chiedi al tuo bartender AI..."
          style={{flex:1,background:"none",border:"none",color:t.text,outline:"none",
            fontFamily:"Raleway, sans-serif",fontSize:14}}/>
        <button onClick={send} disabled={loading||!input.trim()}
          style={{background:loading||!input.trim()?"none":`linear-gradient(135deg,${t.copper},${t.gold})`,
            border:`1px solid ${loading||!input.trim()?t.border:t.gold}`,
            borderRadius:8,padding:"8px 20px",cursor:loading||!input.trim()?"default":"pointer",
            color:loading||!input.trim()?t.textSub:(theme==="night"?"#0a0810":"#2a1808"),
            fontFamily:"Raleway, sans-serif",fontSize:13,fontWeight:600,transition:"all 0.2s"}}>
          Invia
        </button>
      </div>
    </div>
  );
}

// ─── RECIPE EXPORT CARD ───────────────────────────────────────────────────────
function RecipeExportCard({cocktail, t, onClose}) {
  const gDef = GLASSES[cocktail.glass]||GLASSES.oldfashioned;
  const canvasRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  function drawRoundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  async function exportPNG(){
    setExporting(true);
    try{
      const W=720, H=960, pad=56;
      const canvas=canvasRef.current;
      canvas.width=W; canvas.height=H;
      const ctx=canvas.getContext("2d");

      // Background gradient
      const bgGrad=ctx.createLinearGradient(0,0,W*0.4,H);
      bgGrad.addColorStop(0,"#0E0820");
      bgGrad.addColorStop(0.6,"#080810");
      bgGrad.addColorStop(1,"#0A0E1E");
      ctx.fillStyle=bgGrad;
      drawRoundRect(ctx,0,0,W,H,32);
      ctx.fill();

      // Top accent bar
      const accentGrad=ctx.createLinearGradient(0,0,W,0);
      accentGrad.addColorStop(0,"rgba(0,0,0,0)");
      accentGrad.addColorStop(0.5,cocktail.color);
      accentGrad.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=accentGrad;
      ctx.fillRect(0,0,W,6);

      // Category label
      ctx.fillStyle="rgba(201,168,76,0.65)";
      ctx.font="600 20px Raleway, sans-serif";
      ctx.textBaseline="top";
      ctx.fillText(cocktail.cat.toUpperCase(), pad, pad);

      // Cocktail name (large serif)
      ctx.fillStyle="#F5EDD8";
      ctx.font="600 64px Georgia, serif";
      ctx.fillText(cocktail.name, pad, pad+34);

      // Origin
      ctx.fillStyle="rgba(245,237,216,0.45)";
      ctx.font="italic 22px Georgia, serif";
      ctx.fillText(cocktail.origin, pad, pad+110);

      // Divider
      ctx.strokeStyle="rgba(201,168,76,0.2)";
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(pad,pad+165); ctx.lineTo(W-pad,pad+165);
      ctx.stroke();

      // Ingredients header
      let y=pad+200;
      ctx.fillStyle="#C9A84C";
      ctx.font="600 18px Raleway, sans-serif";
      ctx.fillText("INGREDIENTI", pad, y);
      y+=40;

      // Ingredients list
      cocktail.ings.forEach(ing=>{
        // Color dot
        ctx.beginPath();
        ctx.arc(pad+8, y+10, 7, 0, Math.PI*2);
        ctx.fillStyle=ing.color.startsWith("rgba")?ing.color:ing.color;
        ctx.fill();
        ctx.strokeStyle="rgba(255,255,255,0.25)";
        ctx.lineWidth=1;
        ctx.stroke();
        // Name
        ctx.fillStyle="rgba(245,237,216,0.88)";
        ctx.font="24px Raleway, sans-serif";
        ctx.fillText(ing.name, pad+30, y);
        // Amount (right aligned)
        ctx.fillStyle="#C9A84C";
        ctx.font="600 24px Georgia, serif";
        ctx.textAlign="right";
        ctx.fillText(`${ing.amount} ml`, W-pad, y);
        ctx.textAlign="left";
        y+=42;
      });

      y+=20;
      // Garnish box
      ctx.fillStyle="rgba(201,168,76,0.08)";
      drawRoundRect(ctx,pad,y,W-pad*2,56,10);
      ctx.fill();
      ctx.fillStyle="rgba(245,237,216,0.75)";
      ctx.font="italic 20px Georgia, serif";
      ctx.fillText(`🍊  ${cocktail.garnish}`, pad+16, y+18);
      y+=90;

      // Stats boxes
      const stats=[["ABV",cocktail.abv>0?`${cocktail.abv}%`:"0%"],["TEMPO",`${cocktail.time} min`],["CALORIE",`~${cocktail.cal}`]];
      const boxW=(W-pad*2-24)/3;
      stats.forEach(([k,v],i)=>{
        const bx=pad+i*(boxW+12);
        ctx.fillStyle="rgba(255,255,255,0.04)";
        ctx.strokeStyle="rgba(201,168,76,0.18)";
        ctx.lineWidth=1;
        drawRoundRect(ctx,bx,y,boxW,86,10);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle="rgba(245,237,216,0.4)";
        ctx.font="600 14px Raleway, sans-serif";
        ctx.textAlign="center";
        ctx.fillText(k, bx+boxW/2, y+16);
        ctx.fillStyle="#C9A84C";
        ctx.font="600 30px Georgia, serif";
        ctx.fillText(v, bx+boxW/2, y+40);
        ctx.textAlign="left";
      });
      y+=86+40;

      // Tags
      let tx=pad;
      ctx.font="16px Raleway, sans-serif";
      cocktail.tags.slice(0,5).forEach(tag=>{
        const label=`#${tag}`;
        const tw=ctx.measureText(label).width+24;
        if(tx+tw>W-pad){ tx=pad; y+=38; }
        ctx.fillStyle="rgba(201,168,76,0.12)";
        drawRoundRect(ctx,tx,y,tw,30,15);
        ctx.fill();
        ctx.fillStyle="#C9A84C";
        ctx.fillText(label, tx+12, y+7);
        tx+=tw+8;
      });

      // Footer
      ctx.strokeStyle="rgba(201,168,76,0.12)";
      ctx.beginPath();
      ctx.moveTo(pad,H-70); ctx.lineTo(W-pad,H-70);
      ctx.stroke();
      ctx.fillStyle="rgba(201,168,76,0.55)";
      ctx.font="600 22px Georgia, serif";
      ctx.fillText("BALDI'S LAB", pad, H-52);
      ctx.fillStyle="rgba(245,237,216,0.3)";
      ctx.font="14px Raleway, sans-serif";
      ctx.textAlign="right";
      ctx.fillText("Premium Mixology Platform", W-pad, H-48);
      ctx.textAlign="left";

      // Trigger download
      const dataUrl=canvas.toDataURL("image/png");
      const link=document.createElement("a");
      link.download=`baldislab-${cocktail.name.toLowerCase().replace(/\s+/g,"-")}.png`;
      link.href=dataUrl;
      link.click();
      setExported(true);
      setTimeout(()=>setExported(false),2500);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,
      background:"rgba(0,0,0,0.82)",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <div onClick={e=>e.stopPropagation()} style={{width:360,
        background:"linear-gradient(160deg,#0E0820 0%,#080810 60%,#0A0E1E 100%)",
        border:"1px solid rgba(201,168,76,0.3)",borderRadius:20,overflow:"hidden",
        boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
        {/* Header bar */}
        <div style={{height:3,background:`linear-gradient(90deg,transparent,${cocktail.color},transparent)`}}/>
        <div style={{padding:"28px 28px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div>
              <div style={{fontSize:10,letterSpacing:"0.25em",color:"rgba(201,168,76,0.6)",
                fontFamily:"Raleway, sans-serif",textTransform:"uppercase",marginBottom:4}}>{cocktail.cat}</div>
              <h2 style={{fontFamily:"Cormorant Garamond, serif",fontSize:34,
                color:"#F5EDD8",lineHeight:1,fontWeight:600}}>{cocktail.name}</h2>
              <div style={{fontFamily:"Raleway, sans-serif",fontSize:11,
                color:"rgba(245,237,216,0.4)",fontStyle:"italic",marginTop:4}}>{cocktail.origin}</div>
            </div>
            <GlassSVG gDef={gDef} layers={cocktail.ings} size={80}/>
          </div>
          {/* Ingredients */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:10,letterSpacing:"0.2em",color:"#C9A84C",
              fontFamily:"Raleway, sans-serif",textTransform:"uppercase",marginBottom:10}}>Ingredienti</div>
            {cocktail.ings.map((ing,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:ing.color,
                  border:"1px solid rgba(255,255,255,0.2)",flexShrink:0}}/>
                <span style={{flex:1,fontFamily:"Raleway, sans-serif",fontSize:13,
                  color:"rgba(245,237,216,0.85)"}}>{ing.name}</span>
                <span style={{fontFamily:"Cormorant Garamond, serif",fontSize:14,
                  color:"#C9A84C",fontWeight:600}}>{ing.amount} ml</span>
              </div>
            ))}
          </div>
          {/* Garnish */}
          <div style={{padding:"10px 12px",background:"rgba(201,168,76,0.07)",
            borderRadius:8,marginBottom:18,
            fontFamily:"Raleway, sans-serif",fontSize:12,color:"rgba(245,237,216,0.7)"}}>
            🍊 <em>{cocktail.garnish}</em>
          </div>
          {/* Stats row */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {[["ABV",`${cocktail.abv>0?cocktail.abv+"%" :"0%"}`],["Tempo",`${cocktail.time}min`],["Cal",`~${cocktail.cal}`]].map(([k,v])=>(
              <div key={k} style={{flex:1,background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(201,168,76,0.15)",borderRadius:8,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:9,letterSpacing:"0.15em",color:"rgba(245,237,216,0.4)",
                  fontFamily:"Raleway, sans-serif",marginBottom:3}}>{k}</div>
                <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:16,
                  color:"#C9A84C",fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Download button */}
          <button onClick={exportPNG} disabled={exporting}
            style={{width:"100%",marginBottom:18,padding:"12px",
              background:exported?"rgba(76,175,80,0.18)":"rgba(201,168,76,0.12)",
              border:`1px solid ${exported?"rgba(76,175,80,0.5)":"rgba(201,168,76,0.35)"}`,
              borderRadius:8,cursor:exporting?"default":"pointer",
              color:exported?"#4CAF50":"#C9A84C",
              fontFamily:"Raleway, sans-serif",fontWeight:600,fontSize:13,
              letterSpacing:"0.05em",transition:"all 0.2s",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {exporting?"Generando...":exported?"✓ Scaricato!":"⬇ Scarica come PNG"}
          </button>
        </div>
        {/* Footer */}
        <div style={{padding:"12px 28px",borderTop:"1px solid rgba(201,168,76,0.1)",
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"Cormorant Garamond, serif",fontSize:13,
            color:"rgba(201,168,76,0.5)",letterSpacing:"0.08em"}}>BALDI'S LAB</span>
          <span style={{fontFamily:"Raleway, sans-serif",fontSize:10,
            color:"rgba(245,237,216,0.3)"}}>Immagine 720×960px, pronta per i social</span>
        </div>
      </div>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",
        border:"none",cursor:"pointer",color:"rgba(245,237,216,0.4)",fontSize:24,lineHeight:1}}>✕</button>
    </div>
  );
}

// ─── LIBRARY PAGE ─────────────────────────────────────────────────────────────
const CATEGORIES=["Tutti","Preferiti","Aperitivo","Classic","Longdrink","Whisky","Tequila","After Dinner","Sour","Contemporary","Tropical","Analcolico"];
const ABV_FILTERS=[{id:null,label:"Tutti"},{id:"analcolico",label:"0% Analcolico"},{id:"light",label:"1–13%"},{id:"mid",label:"14–22%"},{id:"strong",label:"23–30%"},{id:"vstrong",label:"31%+"}];
const FLAVOR_TAGS=["amaro","dolce","agrumato","fresco","tropicale","cremoso","classico","easy","affumicato","erbaceo","complesso"];

function LibraryPage({t, setModal, favorites=new Set(), onToggleFav}) {
  const [search,   setSearch]  = useState("");
  const [cat,      setCat]     = useState("Tutti");
  const [abvF,     setAbvF]    = useState(null);
  const [flavors,  setFlavors] = useState([]);
  const [diffF,    setDiffF]   = useState(null);
  const [glassF,   setGlassF]  = useState(null);
  const [showAdv,  setShowAdv] = useState(false);

  const toggleFlavor = f => setFlavors(prev => prev.includes(f)?prev.filter(x=>x!==f):[...prev,f]);
  const clearAll = () => { setAbvF(null); setFlavors([]); setDiffF(null); setGlassF(null); };
  const activeFilters = (abvF?1:0)+flavors.length+(diffF?1:0)+(glassF?1:0);

  const matchAbv = c => {
    if (!abvF) return true;
    if (abvF==="analcolico") return c.abv===0;
    if (abvF==="light")  return c.abv>0  && c.abv<=13;
    if (abvF==="mid")    return c.abv>=14 && c.abv<=22;
    if (abvF==="strong") return c.abv>=23 && c.abv<=30;
    if (abvF==="vstrong")return c.abv>30;
    return true;
  };

  const filtered = COCKTAILS.filter(c => {
    if (cat==="Preferiti") return favorites.has(c.id);
    return (cat==="Tutti"||c.cat===cat) &&
      (!search||c.name.toLowerCase().includes(search.toLowerCase())||c.tags.some(tg=>tg.includes(search.toLowerCase()))) &&
      matchAbv(c) &&
      (flavors.length===0||flavors.every(f=>c.tags.includes(f))) &&
      (!diffF||c.diff===diffF) &&
      (!glassF||c.glass===glassF);
  });

  return (
    <div style={{maxWidth:1300,margin:"0 auto",padding:"90px 20px 60px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
        <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:40,color:t.text}}>🍸 Cocktail</h1>
        {favorites.size>0&&(
          <span style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.gold,cursor:"pointer",
            textDecoration:"underline",textUnderlineOffset:3}} onClick={()=>setCat("Preferiti")}>
            ♥ {favorites.size} preferiti
          </span>
        )}
      </div>
      <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.textMuted,marginBottom:20}}>
        {COCKTAILS.length} ricette · mostrando {filtered.length}
      </p>

      {/* Search + category row */}
      <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Cerca cocktail, ingrediente o tag..."
          style={{flex:"1 1 240px",background:t.input,border:`1px solid ${t.inpBdr}`,borderRadius:8,
            padding:"10px 14px",color:t.text,fontFamily:"Raleway, sans-serif",fontSize:14,outline:"none"}}/>
        <button onClick={()=>setShowAdv(!showAdv)}
          style={{background:showAdv||activeFilters>0?t.goldSoft:"none",
            border:`1px solid ${showAdv||activeFilters>0?t.gold:t.border}`,
            borderRadius:8,padding:"10px 16px",cursor:"pointer",
            color:showAdv||activeFilters>0?t.gold:t.textMuted,
            fontFamily:"Raleway, sans-serif",fontSize:12,fontWeight:500,transition:"all 0.2s",
            display:"flex",alignItems:"center",gap:6}}>
          ⚙ Filtri{activeFilters>0?` (${activeFilters})`:""}
        </button>
      </div>

      {/* Category pills */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            style={{background:cat===c?t.goldSoft:"none",border:`1px solid ${cat===c?t.gold:t.border}`,
              borderRadius:20,padding:"5px 14px",cursor:"pointer",color:cat===c?t.gold:t.textMuted,
              fontFamily:"Raleway, sans-serif",fontSize:12,fontWeight:cat===c?600:400,transition:"all 0.2s"}}>
            {c==="Preferiti"?"♥ Preferiti":c}
          </button>
        ))}
      </div>

      {/* Advanced filters panel */}
      {showAdv&&(
        <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,
          padding:"20px 24px",marginBottom:20,animation:"fadeSlideUp 0.25s ease-out"}}>
          <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
            {/* ABV */}
            <div style={{flex:"1 1 200px"}}>
              <div style={{fontSize:10,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
                textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Gradazione</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {ABV_FILTERS.map(f=>(
                  <button key={String(f.id)} onClick={()=>setAbvF(abvF===f.id?null:f.id)}
                    style={{background:abvF===f.id?t.goldSoft:"none",border:`1px solid ${abvF===f.id?t.gold:t.border}`,
                      borderRadius:20,padding:"4px 12px",cursor:"pointer",color:abvF===f.id?t.gold:t.textMuted,
                      fontFamily:"Raleway, sans-serif",fontSize:11,transition:"all 0.15s"}}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Flavor */}
            <div style={{flex:"1 1 280px"}}>
              <div style={{fontSize:10,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
                textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Profilo di Sapore</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {FLAVOR_TAGS.map(f=>(
                  <button key={f} onClick={()=>toggleFlavor(f)}
                    style={{background:flavors.includes(f)?t.goldSoft:"none",border:`1px solid ${flavors.includes(f)?t.gold:t.border}`,
                      borderRadius:20,padding:"4px 12px",cursor:"pointer",color:flavors.includes(f)?t.gold:t.textMuted,
                      fontFamily:"Raleway, sans-serif",fontSize:11,textTransform:"capitalize",transition:"all 0.15s"}}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {/* Difficulty + Glass */}
            <div style={{flex:"1 1 200px",display:"flex",gap:24,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:10,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
                  textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Difficoltà</div>
                <div style={{display:"flex",gap:6}}>
                  {[1,2,3].map(d=>(
                    <button key={d} onClick={()=>setDiffF(diffF===d?null:d)}
                      style={{background:diffF===d?t.goldSoft:"none",border:`1px solid ${diffF===d?t.gold:t.border}`,
                        borderRadius:8,padding:"5px 12px",cursor:"pointer",color:diffF===d?t.gold:t.textMuted,
                        fontSize:12,transition:"all 0.15s"}}>
                      {"●".repeat(d)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:"0.15em",color:t.gold,fontFamily:"Raleway, sans-serif",
                  textTransform:"uppercase",fontWeight:600,marginBottom:10}}>Bicchiere</div>
                <select value={glassF||""} onChange={e=>setGlassF(e.target.value||null)}
                  style={{background:t.input,border:`1px solid ${t.inpBdr}`,borderRadius:8,
                    padding:"5px 10px",color:t.text,fontFamily:"Raleway, sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                  <option value="">Tutti</option>
                  {Object.values(GLASSES).map(g=><option key={g.id} value={g.id} style={{background:"#0a0810"}}>{g.emoji} {g.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          {activeFilters>0&&(
            <button onClick={clearAll} style={{marginTop:14,background:"none",border:"none",
              cursor:"pointer",color:t.textMuted,fontFamily:"Raleway, sans-serif",fontSize:12,
              textDecoration:"underline",textUnderlineOffset:2,padding:0}}>
              ✕ Cancella tutti i filtri ({activeFilters})
            </button>
          )}
        </div>
      )}

      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:60,color:t.textMuted,fontFamily:"Cormorant Garamond, serif",
          fontSize:24,fontStyle:"italic"}}>
          {cat==="Preferiti"?"Nessun preferito. Clicca ♡ su un cocktail.":"Nessun cocktail trovato."}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
        {filtered.map(c=>(
          <CocktailCard key={c.id} cocktail={c} t={t} onClick={()=>setModal(c)}
            favorites={favorites} onToggleFav={onToggleFav}/>
        ))}
      </div>
    </div>
  );
}

// ─── ENCYCLOPEDIA ─────────────────────────────────────────────────────────────
const ENC_INGS=[
  {name:"Campari",cat:"Bitter",origin:"Milano, 1860",abv:25,color:"#C0392B",
   desc:"Bitter italiano con un blend segreto di erbe e frutti. Intenso, amaro, iconico.",
   notes:"Rabarbaro, arancia, vaniglia, erbe aromatiche"},
  {name:"Aperol",cat:"Bitter",origin:"Padova, 1919",abv:11,color:"#E67E22",
   desc:"Il bitter più leggero d'Italia. Arancio, rabarbaro e genziana in perfetto equilibrio.",
   notes:"Arancia, rabarbaro, genziana, chinchona"},
  {name:"Gin London Dry",cat:"Gin",origin:"Londra, 1800s",abv:40,color:"rgba(210,235,255,0.6)",
   desc:"Il classico gin inglese. Ginepro dominante, coriandolo e angelica. Base di innumerevoli cocktail.",
   notes:"Ginepro, coriandolo, angelica, scorza di agrumi"},
  {name:"Bourbon",cat:"Whisky",origin:"Kentucky, 1800s",abv:45,color:"#C07830",
   desc:"Whisky americano prodotto per almeno il 51% da mais. Dolce, caldo, con note di vaniglia e caramello.",
   notes:"Vaniglia, caramello, quercia, spezie dolci"},
  {name:"Tequila Blanco",cat:"Tequila",origin:"Jalisco, Messico",abv:38,color:"rgba(255,248,200,0.55)",
   desc:"100% agave blu, imbottigliata subito dopo la distillazione. Fresca, erbacea, con note di pepe.",
   notes:"Agave, pepe verde, agrumi, erbaceo"},
  {name:"Vermut Rosso",cat:"Vino Aromatizzato",origin:"Torino, 1786",abv:16,color:"#8B2020",
   desc:"Vino aromatizzato con erbe, radici e spezie. L'ingrediente segreto di Negroni e Manhattan.",
   notes:"Artemisia, vaniglia, caramello, spezie orientali"},
  {name:"Rum Bianco",cat:"Rum",origin:"Caraibi, 1600s",abv:37.5,color:"rgba(255,248,225,0.5)",
   desc:"Rum trasparente, giovane e vivace. La base di Daiquiri, Mojito e Cuba Libre.",
   notes:"Canna da zucchero, cocco, frutta tropicale"},
  {name:"Kahlúa",cat:"Liquore al Caffè",origin:"Messico, 1936",abv:20,color:"#1A0800",
   desc:"Il liquore al caffè messicano per eccellenza. Dolce, intenso, perfetto nell'Espresso Martini.",
   notes:"Caffè arabica, vaniglia, zucchero di canna"},
];

const TECH=[
  {name:"Shaking",icon:"🤝",desc:"Agitazione energica in shaker con ghiaccio. Raffredda, diluisce e aeraealcocktail."},
  {name:"Stirring",icon:"🔄",desc:"Mescolatura delicata con cucchiaino. Per cocktail all spirit, mantiene la limpidezza."},
  {name:"Muddling",icon:"🪵",desc:"Pestatura di frutta, erbe o zucchero per estrarne aromi ed essenze."},
  {name:"Building",icon:"🏗️",desc:"Costruzione diretta nel bicchiere di servizio, senza shaker. Per cocktail semplici."},
  {name:"Double Strain",icon:"🫗",desc:"Filtraggio doppio per cocktail shakerati, rimuove tutti i frammenti di ghiaccio."},
  {name:"Dry Shake",icon:"💨",desc:"Agitazione senza ghiaccio per emulsionare ingredienti come l'albume d'uovo."},
];

function EncyclopediaPage({t}) {
  const [tab, setTab]=useState("ingredienti");
  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"90px 20px 60px"}}>
      <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:40,color:t.text,marginBottom:8}}>📚 Enciclopedia</h1>
      <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.textMuted,marginBottom:28}}>
        La conoscenza del bartender professionista
      </p>
      <div style={{display:"flex",gap:8,marginBottom:28}}>
        {["ingredienti","tecniche","bicchieri"].map(tb=>(
          <button key={tb} onClick={()=>setTab(tb)}
            style={{background:tab===tb?t.goldSoft:"none",border:`1px solid ${tab===tb?t.gold:t.border}`,
              borderRadius:8,padding:"8px 20px",cursor:"pointer",color:tab===tb?t.gold:t.textMuted,
              fontFamily:"Raleway, sans-serif",fontSize:13,fontWeight:tab===tb?600:400,
              textTransform:"capitalize",letterSpacing:"0.04em",transition:"all 0.2s"}}>
            {tb}
          </button>
        ))}
      </div>
      {tab==="ingredienti"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
          {ENC_INGS.map(ing=>(
            <div key={ing.name} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:22,
              borderLeft:`3px solid ${ing.color}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{width:14,height:14,borderRadius:"50%",background:ing.color,flexShrink:0}}/>
                <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:22,color:t.text,flex:1}}>{ing.name}</h3>
                <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.gold,
                  background:t.tag,padding:"2px 8px",borderRadius:10}}>{ing.abv}%</span>
              </div>
              <div style={{fontSize:10,color:t.textSub,fontFamily:"Raleway, sans-serif",
                letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{ing.cat} · {ing.origin}</div>
              <p style={{fontSize:13,color:t.textMuted,fontFamily:"Raleway, sans-serif",lineHeight:1.65,marginBottom:10}}>{ing.desc}</p>
              <div style={{fontSize:12,color:t.gold,fontFamily:"Raleway, sans-serif",fontStyle:"italic"}}>
                🌿 {ing.notes}
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="tecniche"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18}}>
          {TECH.map(tc=>(
            <div key={tc.name} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:24}}>
              <div style={{fontSize:36,marginBottom:12}}>{tc.icon}</div>
              <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:8}}>{tc.name}</h3>
              <p style={{fontSize:14,color:t.textMuted,fontFamily:"Raleway, sans-serif",lineHeight:1.65}}>{tc.desc}</p>
            </div>
          ))}
        </div>
      )}
      {tab==="bicchieri"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:18}}>
          {Object.values(GLASSES).map(g=>(
            <div key={g.id} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,
              padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <GlassSVG gDef={g} layers={[]} size={100}/>
              <div style={{textAlign:"center"}}>
                <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:20,color:t.text,marginBottom:4}}>{g.name}</h3>
                <div style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.textMuted}}>Capacità: ~{g.capacity}ml</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BAR CABINET ──────────────────────────────────────────────────────────────
function CabinetPage({t, theme, setPage}) {
  const [owned, setOwned]=useState(new Set([1,3,4,6,12,14,15,21,26,27,28]));
  const toggle=id=>setOwned(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const suggestions=COCKTAILS.filter(c=>
    c.ings.filter(i=>INGS.some(ing=>owned.has(ing.id)&&(ing.name.toLowerCase().includes(i.name.toLowerCase().split(' ')[0])||i.name.toLowerCase().includes(ing.name.toLowerCase().split(' ')[0])))).length >= c.ings.length-1
  ).slice(0,4);
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"90px 20px 60px"}}>
      <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:40,color:t.text,marginBottom:8}}>🗄 Bar Cabinet</h1>
      <p style={{fontFamily:"Raleway, sans-serif",fontSize:14,color:t.textMuted,marginBottom:28}}>
        Gestisci il tuo bar personale · {owned.size} ingredienti disponibili
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,flexWrap:"wrap"}} className="cabinet-grid">
        <div>
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:20}}>
            <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:18}}>
              I miei ingredienti
            </h3>
            {ING_CATS.filter(c=>c!=="Tutti").map(cat=>{
              const catIngs=INGS.filter(i=>i.cat===cat);
              return (
                <div key={cat} style={{marginBottom:18}}>
                  <div style={{fontSize:10,color:t.gold,fontFamily:"Raleway, sans-serif",
                    letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>{cat}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {catIngs.map(i=>(
                      <button key={i.id} onClick={()=>toggle(i.id)}
                        style={{background:owned.has(i.id)?t.goldSoft:"none",
                          border:`1px solid ${owned.has(i.id)?t.gold:t.border}`,
                          borderRadius:20,padding:"4px 12px",cursor:"pointer",
                          color:owned.has(i.id)?t.gold:t.textMuted,
                          fontFamily:"Raleway, sans-serif",fontSize:12,
                          fontWeight:owned.has(i.id)?600:400,transition:"all 0.2s",
                          display:"flex",alignItems:"center",gap:5}}>
                        {owned.has(i.id)&&<span style={{width:6,height:6,borderRadius:"50%",background:i.color,flexShrink:0}}/>}
                        {i.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:20,marginBottom:20}}>
            <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:4}}>
              Puoi preparare
            </h3>
            <p style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted,marginBottom:18}}>
              Cocktail realizzabili con il tuo inventario attuale
            </p>
            {suggestions.length>0
              ? suggestions.map(c=>(
                  <div key={c.id} onClick={()=>setPage("library")}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                      background:t.input,border:`1px solid ${t.border}`,borderRadius:10,marginBottom:8,
                      cursor:"pointer",transition:"all 0.2s"}} className="cab-suggestion">
                    <MiniGlass cocktail={c} size={38}/>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:18,color:t.text}}>{c.name}</div>
                      <div style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.textMuted}}>{c.ings.length} ingredienti · {c.abv}% vol</div>
                    </div>
                    <span style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:t.gold}}>→</span>
                  </div>
                ))
              : <p style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted,fontStyle:"italic",
                  textAlign:"center",padding:"20px 0"}}>Aggiungi ingredienti al tuo cabinet per ricevere suggerimenti.</p>
            }
          </div>
          <div style={{background:`linear-gradient(135deg,rgba(${t.goldRgb},0.12),rgba(${t.goldRgb},0.04))`,
            border:`1px solid rgba(${t.goldRgb},0.25)`,borderRadius:14,padding:20,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>🤖</div>
            <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:22,color:t.text,marginBottom:8}}>
              Chiedi all'AI Bartender
            </h3>
            <p style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted,marginBottom:16,lineHeight:1.65}}>
              Descrivi i tuoi ingredienti all'AI e ricevi suggerimenti personalizzati.
            </p>
            <button onClick={()=>setPage("ai")}
              style={{background:`linear-gradient(135deg,${t.copper},${t.gold})`,border:"none",
                color:theme==="night"?"#0a0810":"#2a1808",cursor:"pointer",
                fontFamily:"Raleway, sans-serif",fontWeight:700,letterSpacing:"0.1em",
                textTransform:"uppercase",fontSize:11,padding:"11px 24px",borderRadius:4}}>
              Chiedi ora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RATING STARS ─────────────────────────────────────────────────────────────
function RatingStars({cocktailId, ratings, onRate, t, size=18}) {
  const [hover, setHover] = useState(0);
  const current = ratings[cocktailId] || 0;
  return (
    <div style={{display:"flex",gap:3,alignItems:"center"}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s}
          onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
          onClick={()=>onRate(cocktailId, s===current ? 0 : s)}
          style={{fontSize:size,cursor:"pointer",lineHeight:1,
            color:(hover||current)>=s?"#FFD700":"rgba(255,215,0,0.2)",
            transition:"color 0.15s",userSelect:"none"}}>
          ★
        </span>
      ))}
      {current>0&&<span style={{fontFamily:"Raleway, sans-serif",fontSize:11,
        color:t.textMuted,marginLeft:4}}>{current}/5</span>}
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({t, onClose, onLogin}) {
  const [mode, setMode]   = useState("login");   // login | register
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [name, setName]   = useState("");
  const [err, setErr]     = useState("");

  function handleSubmit() {
    if (!email.includes("@") || pass.length < 6) {
      setErr("Email valida e password di almeno 6 caratteri.");
      return;
    }
    // Mock auth — in production connects to Supabase
    onLogin({ email, displayName: name || email.split("@")[0], mode });
  }

  const inp = {
    width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(201,168,76,0.25)",
    borderRadius:8, padding:"12px 14px", color:"#F5EDD8",
    fontFamily:"Raleway, sans-serif", fontSize:14, outline:"none",
    transition:"border-color 0.2s", boxSizing:"border-box",
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,
      background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,
        background:"radial-gradient(160deg,#0E0820 0%,#080810 100%)",
        border:"1px solid rgba(201,168,76,0.28)",borderRadius:20,padding:"40px 36px",
        boxShadow:"0 32px 80px rgba(0,0,0,0.8)"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:20,background:"none",
          border:"none",cursor:"pointer",color:"rgba(245,237,216,0.4)",fontSize:22}}>✕</button>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:26,fontWeight:600,
            color:"#C9A84C",letterSpacing:"0.1em"}}>BALDI'S LAB</div>
          <div style={{fontFamily:"Raleway, sans-serif",fontSize:11,letterSpacing:"0.25em",
            color:"rgba(245,237,216,0.35)",textTransform:"uppercase",marginTop:3}}>
            {mode==="login"?"Accedi al tuo account":"Crea il tuo account"}
          </div>
        </div>

        {/* Social buttons */}
        {["🌐  Continua con Google","🍎  Continua con Apple"].map((label,i)=>(
          <button key={i} onClick={()=>onLogin({provider:i===0?"google":"apple"})}
            style={{width:"100%",marginBottom:10,padding:"12px",
              background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:8,cursor:"pointer",color:"#F5EDD8",
              fontFamily:"Raleway, sans-serif",fontSize:13,fontWeight:500,
              transition:"all 0.2s"}}>
            {label}
          </button>
        ))}

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}>
          <div style={{flex:1,height:1,background:"rgba(201,168,76,0.15)"}}/>
          <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,
            color:"rgba(245,237,216,0.3)",letterSpacing:"0.1em"}}>oppure</span>
          <div style={{flex:1,height:1,background:"rgba(201,168,76,0.15)"}}/>
        </div>

        {/* Fields */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {mode==="register"&&(
            <input placeholder="Nome visualizzato" value={name} onChange={e=>setName(e.target.value)} style={inp}
              onFocus={e=>e.target.style.borderColor="#C9A84C"}
              onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
          )}
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inp}
            onFocus={e=>e.target.style.borderColor="#C9A84C"}
            onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
          <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={inp}
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            onFocus={e=>e.target.style.borderColor="#C9A84C"}
            onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
        </div>

        {err&&<p style={{fontFamily:"Raleway, sans-serif",fontSize:12,color:"#FF6B6B",marginBottom:10}}>{err}</p>}

        <button onClick={handleSubmit}
          style={{width:"100%",padding:"13px",
            background:"linear-gradient(135deg,#B07340,#C9A84C)",border:"none",
            borderRadius:8,cursor:"pointer",color:"#0a0810",
            fontFamily:"Raleway, sans-serif",fontWeight:700,fontSize:13,
            letterSpacing:"0.1em",textTransform:"uppercase",
            boxShadow:"0 4px 20px rgba(201,168,76,0.3)"}}>
          {mode==="login"?"Accedi":"Registrati"}
        </button>

        <p style={{textAlign:"center",marginTop:16,fontFamily:"Raleway, sans-serif",
          fontSize:12,color:"rgba(245,237,216,0.4)"}}>
          {mode==="login"
            ? <>Non hai un account?{" "}<span onClick={()=>setMode("register")}
                style={{color:"#C9A84C",cursor:"pointer",textDecoration:"underline"}}>Registrati</span></>
            : <>Hai già un account?{" "}<span onClick={()=>setMode("login")}
                style={{color:"#C9A84C",cursor:"pointer",textDecoration:"underline"}}>Accedi</span></>
          }
        </p>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({t, user, favorites, ratings, history, onLogout, setPage, setModal}) {
  const favCocktails  = COCKTAILS.filter(c => favorites.has(c.id));
  const ratedCocktails= COCKTAILS.filter(c => ratings[c.id]);
  const histCocktails = history.slice(0,8).map(id => COCKTAILS.find(c=>c.id===id)).filter(Boolean);

  const StatBox = ({label, value, sub}) => (
    <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,
      padding:"18px",textAlign:"center"}}>
      <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:36,color:t.gold,fontWeight:600}}>{value}</div>
      <div style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.textMuted,
        textTransform:"uppercase",letterSpacing:"0.12em",marginTop:4}}>{label}</div>
      {sub&&<div style={{fontFamily:"Raleway, sans-serif",fontSize:10,color:t.textSub,marginTop:2}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"90px 20px 60px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:40,flexWrap:"wrap"}}>
        <div style={{width:72,height:72,borderRadius:"50%",
          background:`linear-gradient(135deg,${t.copper},${t.gold})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:28,flexShrink:0,border:`2px solid ${t.gold}`}}>
          🍸
        </div>
        <div>
          <h1 style={{fontFamily:"Cormorant Garamond, serif",fontSize:36,color:t.text,marginBottom:4}}>
            {user.displayName}
          </h1>
          <div style={{fontFamily:"Raleway, sans-serif",fontSize:13,color:t.textMuted}}>{user.email}</div>
        </div>
        <button onClick={onLogout} style={{marginLeft:"auto",background:"none",
          border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 18px",cursor:"pointer",
          color:t.textMuted,fontFamily:"Raleway, sans-serif",fontSize:12,transition:"all 0.2s"}}>
          Esci
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:36}}>
        <StatBox label="Preferiti" value={favorites.size}/>
        <StatBox label="Valutati" value={Object.keys(ratings).length}/>
        <StatBox label="Visti" value={history.length}/>
        <StatBox label="Stella Media" value={
          Object.values(ratings).length
            ? (Object.values(ratings).reduce((a,b)=>a+b,0)/Object.values(ratings).length).toFixed(1)+"★"
            : "—"
        }/>
      </div>

      {/* Recent history */}
      {histCocktails.length>0&&(
        <div style={{marginBottom:36}}>
          <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:16}}>
            Recentemente Visti
          </h3>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
            {histCocktails.map(c=>(
              <div key={c.id} onClick={()=>setModal(c)}
                style={{flexShrink:0,cursor:"pointer",background:t.card,
                  border:`1px solid ${t.border}`,borderRadius:12,padding:"12px 16px",
                  display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}
                className="cocktail-card">
                <MiniGlass cocktail={c} size={32}/>
                <div>
                  <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:16,color:t.text}}>{c.name}</div>
                  <div style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.textMuted}}>{c.cat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites grid */}
      {favCocktails.length>0&&(
        <div style={{marginBottom:36}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:16}}>
            <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text}}>
              ♥ I Tuoi Preferiti
            </h3>
            <button onClick={()=>setPage("library")}
              style={{background:"none",border:"none",cursor:"pointer",color:t.gold,
                fontFamily:"Raleway, sans-serif",fontSize:13,textDecoration:"underline"}}>
              Vedi tutti →
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
            {favCocktails.slice(0,4).map(c=>(
              <CocktailCard key={c.id} cocktail={c} t={t} onClick={()=>setModal(c)}/>
            ))}
          </div>
        </div>
      )}

      {/* Rated cocktails */}
      {ratedCocktails.length>0&&(
        <div>
          <h3 style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.text,marginBottom:16}}>
            ★ Le Tue Valutazioni
          </h3>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ratedCocktails.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:14,
                background:t.card,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 16px"}}>
                <MiniGlass cocktail={c} size={36}/>
                <span style={{flex:1,fontFamily:"Cormorant Garamond, serif",fontSize:18,color:t.text}}>{c.name}</span>
                <div style={{display:"flex",gap:2}}>
                  {[1,2,3,4,5].map(s=>(
                    <span key={s} style={{color:ratings[c.id]>=s?"#FFD700":"rgba(255,215,0,0.2)",fontSize:16}}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {favCocktails.length===0&&ratedCocktails.length===0&&histCocktails.length===0&&(
        <div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:48,marginBottom:16}}>🍸</div>
          <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:t.textMuted,fontStyle:"italic"}}>
            Inizia a esplorare i cocktail!
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────────
function GlobalCSS({t, theme}) {
  const night = theme==="night";
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { overflow-x: hidden; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(${t.goldRgb},0.3); border-radius: 3px; }
      input[type=number]::-webkit-inner-spin-button { opacity: 0; }
      input[type=number]::-webkit-outer-spin-button { opacity: 0; }
      input[type=number] { -moz-appearance: textfield; }
      
      @keyframes floatGlass {
        0%,100% { transform: translateY(0px) rotate(-1deg); }
        50%      { transform: translateY(-10px) rotate(1deg); }
      }
      @keyframes pourS {
        0%   { opacity: 0.9; stroke-width: 5; }
        60%  { opacity: 0.6; stroke-width: 3; }
        100% { opacity: 0;   stroke-width: 1; }
      }
      @keyframes bdash {
        0%   { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -24; }
      }
      @keyframes loadingDot {
        0%,100% { opacity: 0.4; }
        50%      { opacity: 1;   }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
      
      .feat-card:hover {
        border-color: ${t.gold} !important;
        box-shadow: 0 8px 32px rgba(${t.goldRgb},0.2);
        transform: translateY(-3px);
      }
      .cocktail-card:hover {
        border-color: rgba(${t.goldRgb},0.5) !important;
        box-shadow: 0 6px 28px rgba(${t.goldRgb},0.18);
        transform: translateY(-2px);
      }
      .ing-row:hover { background: rgba(${t.goldRgb},0.06); }
      .cab-suggestion:hover {
        border-color: rgba(${t.goldRgb},0.4) !important;
        background: rgba(${t.goldRgb},0.06) !important;
      }
      
      /* Responsive */
      .nav-hamburger { display: none; }
      .nav-mobile-menu { display: none; }
      @media (max-width: 900px) {
        .nav-desktop { display: none !important; }
        .nav-hamburger { display: block !important; }
        .sim-grid { grid-template-columns: 1fr !important; }
        .cabinet-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 480px) {
        .nav-mobile-menu { display: flex !important; }
      }
      @media (min-width: 481px) {
        .nav-mobile-menu { display: flex !important; }
      }

      /* Seasonal theme overrides */
      ${theme==="summer" ? `
        .cocktail-card:hover { box-shadow: 0 6px 28px rgba(255,179,71,0.22) !important; }
        .feat-card:hover { box-shadow: 0 8px 32px rgba(255,179,71,0.22) !important; }
      ` : ""}
      ${theme==="winter" ? `
        .cocktail-card:hover { box-shadow: 0 6px 28px rgba(168,216,240,0.22) !important; }
        .feat-card:hover { box-shadow: 0 8px 32px rgba(168,216,240,0.22) !important; }
      ` : ""}
      ${theme==="halloween" ? `
        .cocktail-card:hover { box-shadow: 0 6px 28px rgba(255,107,0,0.25) !important; }
        .feat-card:hover { box-shadow: 0 8px 32px rgba(255,107,0,0.25) !important; }
      ` : ""}
      ${theme==="christmas" ? `
        .cocktail-card:hover { box-shadow: 0 6px 28px rgba(255,215,0,0.22) !important; }
        .feat-card:hover { box-shadow: 0 8px 32px rgba(255,215,0,0.22) !important; }
      ` : ""}
    `}</style>
  );
}

// ─── APP (default export) ─────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]      = useState("night");
  const [page, setPage]        = useState("home");
  const [modal, setModal]      = useState(null);
  const [ageOk, setAgeOk]      = useState(false);
  const [favorites, setFavs]   = useState(new Set());
  const [ratings, setRatings]  = useState({});
  const [history, setHistory]  = useState([]);
  const [user, setUser]        = useState(null);
  const [showAuth, setShowAuth]= useState(false);
  const t = T[theme];

  const toggleFav   = (id) => setFavs(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const ratecocktail= (id,stars) => setRatings(prev => stars===0?(({[id]:_,...r})=>r)(prev):{...prev,[id]:stars});
  const openModal   = (c)  => { setModal(c); setHistory(prev=>[c.id,...prev.filter(x=>x!==c.id)].slice(0,20)); };
  const handleLogin = (d)  => { setUser({email:d.email||`${d.provider}@baldislab.app`,displayName:d.displayName||(d.provider==="google"?"Utente Google":"Utente Apple")}); setShowAuth(false); };
  const handleLogout= ()   => { setUser(null); setPage("home"); };

  // Load fonts
  useEffect(()=>{
    if (!document.getElementById("baldi-fonts")) {
      const el = Object.assign(document.createElement("link"),{
        id:"baldi-fonts", rel:"stylesheet",
        href:"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap",
      });
      document.head.appendChild(el);
    }
  },[]);

  // Age gate
  if (!ageOk) return (
    <>
      <GlobalCSS t={T.night} theme="night"/>
      <AgeGate onVerify={()=>setAgeOk(true)}/>
    </>
  );

  const isLight = theme==="day";
  const grainStyle = {
    position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1,
    opacity:isLight?0.018:0.04,
    backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize:"128px 128px",
  };

  return (
    <div style={{minHeight:"100vh",background:t.bg,color:t.text,
      fontFamily:"Raleway, sans-serif",position:"relative",overflowX:"hidden",
      transition:"background 0.5s ease, color 0.3s ease"}}>
      <GlobalCSS t={t} theme={theme}/>
      <div style={grainStyle}/>
      <AmbientDecor theme={theme}/>

      {/* Ambient gold orb */}
      <div style={{position:"fixed",top:-200,left:"30%",width:600,height:600,
        borderRadius:"50%",pointerEvents:"none",zIndex:0,
        background:`radial-gradient(circle,rgba(${t.goldRgb},0.07) 0%,transparent 70%)`}}/>
      <div style={{position:"fixed",bottom:-150,right:"10%",width:400,height:400,
        borderRadius:"50%",pointerEvents:"none",zIndex:0,
        background:`radial-gradient(circle,rgba(${t.goldRgb},0.04) 0%,transparent 70%)`}}/>

      <NavBar t={t} theme={theme} setTheme={setTheme} page={page} setPage={setPage}
        user={user} onAuthClick={()=>setShowAuth(true)}/>

      <main style={{position:"relative",zIndex:2}}>
        {page==="home"         && <HomePage         t={t} theme={theme} setPage={setPage} setModal={openModal}
                                     favorites={favorites} onToggleFav={toggleFav}/>}
        {page==="simulator"    && <SimulatorPage    t={t} theme={theme}/>}
        {page==="ai"           && <AIPage           t={t} theme={theme}/>}
        {page==="library"      && <LibraryPage      t={t} setModal={openModal}
                                     favorites={favorites} onToggleFav={toggleFav}/>}
        {page==="encyclopedia" && <EncyclopediaPage t={t}/>}
        {page==="cabinet"      && <CabinetPage      t={t} theme={theme} setPage={setPage}
                                     favorites={favorites} onToggleFav={toggleFav}/>}
        {page==="profile"      && <ProfilePage      t={t} user={user} favorites={favorites}
                                     ratings={ratings} history={history}
                                     onLogout={handleLogout} setPage={setPage} setModal={openModal}/>}
      </main>

      {/* Footer */}
      <footer style={{position:"relative",zIndex:2,borderTop:`1px solid ${t.border}`,
        padding:"28px 24px",display:"flex",alignItems:"center",justifyContent:"center",
        gap:16,flexWrap:"wrap"}}>
        <span style={{fontFamily:"Cormorant Garamond, serif",fontSize:16,
          color:t.textSub,letterSpacing:"0.08em"}}>
          BALDI'S LAB
        </span>
        <span style={{color:t.border}}>·</span>
        <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.textSub,letterSpacing:"0.06em"}}>
          {COCKTAILS.length} COCKTAIL · 6 BICCHIERI · AI BARTENDER
        </span>
        <span style={{color:t.border}}>·</span>
        <span style={{fontFamily:"Raleway, sans-serif",fontSize:11,color:t.textSub}}>
          🔞 Bevi responsabilmente
        </span>
      </footer>

      {/* Cocktail Modal */}
      {modal && <CocktailModal cocktail={modal} t={t} onClose={()=>setModal(null)}
                  favorites={favorites} onToggleFav={toggleFav}
                  ratings={ratings} onRate={ratecocktail}/>}

      {/* Auth Modal */}
      {showAuth && <AuthModal t={t} onClose={()=>setShowAuth(false)} onLogin={handleLogin}/>}
    </div>
  );
}
