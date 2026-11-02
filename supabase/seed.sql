-- ═══════════════════════════════════════════════════════════════════════════
-- BALDI'S LAB — Supabase Seed Data
-- supabase/seed.sql  ·  Run after migrations/001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

SET session_replication_role = replica;   -- Disable triggers during seed

-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENTS (30 total)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.ingredients
  (id, name, category, abv, color_hex, color_opacity, description, origin, flavor_notes, is_effervescent)
VALUES
  -- Bitter
  (1,  'Aperol',          'Bitter',      11,    '#E67E22', 0.90, 'Bitter arancio a bassa gradazione, base dell''Aperol Spritz', 'Padova, Italia, 1919', ARRAY['arancia','rabarbaro','genziana'], false),
  (2,  'Campari',         'Bitter',      25,    '#C0392B', 0.92, 'Il bitter italiano più iconico. Blend segreto di erbe e radici', 'Milano, Italia, 1860', ARRAY['arancia amara','rabarbaro','erbe'], false),
  (3,  'Angostura',       'Bitter',      44.7,  '#6B1010', 0.88, 'Il bitter aromatico più usato al mondo. Indispensabile', 'Trinidad, 1824', ARRAY['spezie','chiodi di garofano','cannella'], false),
  -- Gin
  (4,  'Gin London Dry',  'Gin',         40,    '#D8EEFF', 0.55, 'Il gin classico inglese. Ginepro dominante, coriandolo, angelica', 'Londra, UK, 1800s', ARRAY['ginepro','coriandolo','angelica','agrumi'], false),
  (5,  'Gin Premium',     'Gin',         40,    '#C8E0FF', 0.50, 'Gin artigianale con botaniche selezionate. Complessità superiore', 'UK/Europa, 2000s', ARRAY['ginepro','botaniche esotiche','floreale'], false),
  -- Vodka
  (6,  'Vodka',           'Vodka',       40,    '#E8F4FF', 0.35, 'La vodka neutra per eccellenza. Pulita, versatile, inodore', 'Russia/Polonia, 1400s', ARRAY['neutro','pulito','cereali'], false),
  (7,  'Vodka Citrus',    'Vodka',       40,    '#F0F8C8', 0.38, 'Vodka aromatizzata agli agrumi. Fresca e vibrante', 'USA, 1990s', ARRAY['limone','arancia','agrumi'], false),
  -- Rum
  (8,  'Rum Bianco',      'Rum',         37.5,  '#FFFCE8', 0.48, 'Rum leggero e fresco dei Caraibi. Base di Daiquiri e Mojito', 'Caraibi, 1600s', ARRAY['canna da zucchero','tropicale','leggero'], false),
  (9,  'Rum Scuro',       'Rum',         40,    '#6B3000', 0.90, 'Rum invecchiato con note profonde di caramello e spezie', 'Caraibi/Giamaica', ARRAY['caramello','vaniglia','spezie','melassa'], false),
  -- Tequila / Mezcal
  (10, 'Tequila Blanco',  'Tequila',     38,    '#FFFCC8', 0.52, '100% agave blu, imbottigliata fresca. Terrosa e agrumata', 'Jalisco, Messico', ARRAY['agave','pepe','agrumi','erbaceo'], false),
  (11, 'Mezcal',          'Tequila',     40,    '#FFF8C0', 0.50, 'Distillato di agave affumicato. Complessità artigianale unica', 'Oaxaca, Messico', ARRAY['agave affumicata','terroso','fruttato','fumo'], false),
  -- Whisky
  (12, 'Bourbon',         'Whisky',      45,    '#C07830', 0.88, 'Whiskey americano da mais. Dolce, vanigliato, caldo', 'Kentucky, USA, 1800s', ARRAY['vaniglia','caramello','quercia','mais'], false),
  (13, 'Scotch',          'Whisky',      40,    '#A86020', 0.86, 'Whisky scozzese invecchiato. Da delicato a intensamente torbato', 'Scozia, UK', ARRAY['malto','torba','frutta secca','quercia'], false),
  -- Vino / Spumante
  (14, 'Prosecco',        'Vino',        11,    '#FFF8D8', 0.62, 'Il vino spumante italiano per eccellenza. Fruttato, fresco', 'Veneto, Italia', ARRAY['pesca','mela','acacia','frizzante'], true),
  (15, 'Vermut Rosso',    'Vino',        16,    '#8B2020', 0.87, 'Vino aromatizzato rosso. Speziato, erbaceo, dolce-amaro', 'Torino, Italia, 1786', ARRAY['artemisia','vaniglia','caramello','spezie'], false),
  (16, 'Vermut Dry',      'Vino',        18,    '#FFEC C8', 0.58, 'Vermut bianco secco. Floreale, erbaceo, meno dolce del rosso', 'Francia/Italia', ARRAY['erbe','fiori','agrumi','secco'], false),
  -- Liquori
  (17, 'Triple Sec',      'Liquori',     40,    '#FFE080', 0.52, 'Liquore all''arancia dolce. Base di Margarita e Cosmopolitan', 'Francia, 1834', ARRAY['arancia dolce','scorza','zucchero'], false),
  (18, 'Kahlúa',          'Liquori',     20,    '#1A0800', 0.95, 'Liquore al caffè messicano. Dolce, intenso, aromatico', 'Messico, 1936', ARRAY['caffè arabica','vaniglia','zucchero di canna'], false),
  (19, 'Amaretto',        'Liquori',     28,    '#A06818', 0.85, 'Liquore alla mandorla amara. Dolce, morbido, profumato', 'Saronno, Italia, 1600s', ARRAY['mandorla amara','albicocca','vaniglia'], false),
  (20, 'Cointreau',       'Liquori',     40,    '#FFE080', 0.50, 'Il triple sec premium di Saint-Cointreau. Puro e aromatico', 'Angers, Francia, 1875', ARRAY['scorza arancia dolce','scorza arancia amara','pulito'], false),
  -- Succhi
  (21, 'Lime',            'Succhi',      0,     '#A8D000', 0.85, 'Succo di lime fresco. Acido, agrumato, essenziale nella mixology', 'Tropicale', ARRAY['lime','acido','agrumato'], false),
  (22, 'Arancia',         'Succhi',      0,     '#FF8C00', 0.90, 'Succo d''arancia fresco. Dolce, agrumato, ricco di vitamina C', 'Mediterraneo/Tropicale', ARRAY['arancia','dolce','agrumato'], false),
  (23, 'Limone',          'Succhi',      0,     '#FFE060', 0.85, 'Succo di limone fresco. Acido, agrumato, brillante', 'Mediterraneo', ARRAY['limone','acido','fresco'], false),
  (24, 'Cranberry',       'Succhi',      0,     '#C01040', 0.90, 'Succo di mirtillo rosso. Acido-dolce, rosso brillante, fruttato', 'Nord America', ARRAY['mirtillo rosso','acido','fruttato'], false),
  (25, 'Ananas',          'Succhi',      0,     '#FFD700', 0.88, 'Succo d''ananas. Tropicale, dolce, con acidità naturale', 'Tropicale', ARRAY['ananas','tropicale','dolce','fresco'], false),
  -- Sciroppi
  (26, 'Sciroppo',        'Sciroppi',    0,     '#FFFAC8', 0.65, 'Sciroppo semplice (1:1 zucchero:acqua). Dolcificante neutro', 'Universale', ARRAY['zucchero','dolce','neutro'], false),
  -- Soft Drinks
  (27, 'Soda Water',      'Soft Drinks', 0,     '#DCF0FF', 0.40, 'Acqua frizzante neutra. Allunga senza aggiungere sapore', 'Universale', ARRAY['neutro','frizzante','acqua'], true),
  (28, 'Acqua Tonica',    'Soft Drinks', 0,     '#DCF0FF', 0.45, 'Acqua tonica con chinino. Leggermente amara e frizzante', 'UK, 1858', ARRAY['chinino','amaro lieve','frizzante'], true),
  -- Altro
  (29, 'Espresso',        'Altro',       0,     '#100500', 0.95, 'Caffè espresso ristretto. Intenso, aromatico, energizzante', 'Italia, 1901', ARRAY['caffè','amaricante','aromatico','tostato'], false),
  (30, 'Panna',           'Altro',       0,     '#FFF8F0', 0.82, 'Panna fresca liquida. Ammorbidisce, arrotonda i sapori intensi', 'Universale', ARRAY['cremoso','latteo','dolce','morbido'], false)
ON CONFLICT (id) DO UPDATE SET
  description  = EXCLUDED.description,
  flavor_notes = EXCLUDED.flavor_notes;

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAILS (80 total — Sprint 1-5)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.cocktails
  (id, name, category, glass_type, abv, difficulty, time_minutes, calories, year_created, origin, description, method, garnish, color_hex, is_published)
VALUES
  (1,  'Negroni',          'Aperitivo',    'oldfashioned', 25, 'easy',   3,  184, 1919, 'Firenze, Italia',           'Il re degli aperitivi italiani. Amaro, aromatico, senza compromessi.',                           'Metti ghiaccio nel bicchiere. Versa gin, Campari e vermut. Mescola. Guarnisci.',                    'Scorza d''arancia', '#C0392B', true),
  (2,  'Aperol Spritz',    'Aperitivo',    'wine',         11, 'easy',   2,  148, 2003, 'Veneto, Italia',            'L''icona dell''aperitivo moderno. Fresco, vivace, irresistibile.',                                 'Riempi con ghiaccio. Aggiungi Aperol, Prosecco e soda.',                                           'Fetta d''arancia', '#E67E22', true),
  (3,  'Mojito',           'Longdrink',    'highball',     12, 'medium', 5,  168, 1920, 'L''Avana, Cuba',            'Cuba in un bicchiere. Rum bianco, menta fresca, lime e zucchero di canna.',                        'Pesta menta con zucchero e lime. Aggiungi rum e ghiaccio tritato. Soda.',                           'Menta + Lime',      '#27AE60', true),
  (4,  'Old Fashioned',    'Whisky',       'oldfashioned', 35, 'medium', 4,  196, 1806, 'Louisville, Kentucky',      'Il più antico dei classici. Bourbon, bitter, zucchero. Nient''altro.',                             'Sciogli zucchero con bitter. Aggiungi bourbon e ghiaccio. Mescola 30s.',                            'Scorza arancia + Ciliegia', '#A0522D', true),
  (5,  'Espresso Martini', 'After Dinner', 'martini',      18, 'medium', 5,  220, 1983, 'Londra, UK',                'La rivoluzione del dopo cena. Energia e stile in un solo bicchiere.',                              'Agita vodka, Kahlúa e espresso. Doppio colino.',                                                   '3 chicchi di caffè', '#2C1000', true),
  (6,  'Margarita',        'Tequila',      'margarita',    20, 'medium', 4,  162, 1938, 'Messico',                   'Il manifesto della mixology messicana. Tequila, triple sec, lime.',                                'Bagna il bordo con sale. Agita tequila, triple sec e lime con ghiaccio.',                           'Sale + Lime',       '#D4B800', true),
  (7,  'Gin Tonic',        'Longdrink',    'highball',     10, 'easy',   2,  115, 1857, 'India Britannica',          'La semplicità elevata ad arte. Gin premium e acqua tonica. Infinitamente personalizzabile.',       'Riempi con ghiaccio. Versa gin. Completa con tonica fredda.',                                      'Lime + Botaniche',  '#87CEEB', true),
  (8,  'Cosmopolitan',     'Contemporary', 'martini',      20, 'medium', 4,  175, 1988, 'New York, USA',             'Il simbolo di un''era. Rosa, elegante, urban.',                                                    'Agita vodka citrus, triple sec, cranberry e lime. Doppio colino.',                                 'Scorza di lime',    '#FF1493', true),
  (9,  'Whisky Sour',      'Sour',         'coupe',        22, 'medium', 5,  175, 1870, 'USA',                       'Il progenitore di tutti i sour. Bourbon, limone e albume per una schiuma vellutata.',             'Dry shake. Poi agita con ghiaccio. Doppio colino nella coupe.',                                    'Scorza limone + Angostura', '#E8B850', true),
  (10, 'Daiquiri',         'Classic',      'coupe',        20, 'easy',   3,  145, 1898, 'Santiago de Cuba',          'Tre ingredienti, perfezione infinita. Il cocktail prediletto di Hemingway.',                       'Agita rum, lime e sciroppo. Doppio colino.',                                                       'Fetta di lime',     '#F0E8A0', true),
  (11, 'Moscow Mule',      'Longdrink',    'highball',     10, 'easy',   3,  120, 1941, 'USA',                       'Vodka, ginger beer e lime nel classico bicchiere di rame.',                                       'Versa vodka e lime su ghiaccio. Completa con ginger beer.',                                        'Lime + Zenzero',    '#A8D060', true),
  (12, 'Pornstar Martini', 'Contemporary', 'martini',      16, 'medium', 5,  220, 2002, 'Londra, UK',                'Il cocktail più ordinato al mondo. Frutto della passione e vodka.',                                'Agita vodka vaniglia, passoa, frutto della passione. Doppio colino.',                               '½ frutto della passione + Prosecco', '#FF8C00', true),
  -- Sprint 2 cocktails (13-35)
  (13, 'Tom Collins',      'Longdrink',    'highball',     11, 'easy',   3,  120, 1876, 'Londra, UK',                'Il gin fizz più famoso. Fresco, agrumato, con soda.',                                              'Agita gin, limone e sciroppo. Versa su ghiaccio. Soda.',                                           'Fetta limone + Ciliegia', '#C8E890', true),
  (14, 'Piña Colada',      'Tropical',     'highball',     13, 'easy',   4,  260, 1954, 'Puerto Rico',               'Il cocktail tropicale per eccellenza.',                                                            'Frulla rum, cocco e ananas con ghiaccio tritato.',                                                 'Fetta ananas + Ciliegia', '#FFFEF0', true),
  (15, 'Tequila Sunrise',  'Longdrink',    'highball',     14, 'easy',   3,  175, 1972, 'California, USA',           'Il cocktail che imita un''alba messicana.',                                                        'Versa tequila e arancia su ghiaccio. Aggiungi granatina senza mescolare.',                          'Fetta arancia + Ciliegia', '#FF6B00', true),
  (16, 'Cuba Libre',       'Longdrink',    'highball',     10, 'easy',   2,  120, 1900, 'L''Avana, Cuba',            'Rum, cola e lime. Il cocktail più venduto al mondo.',                                              'Premi lime. Versa rum. Completa con cola fredda.',                                                 'Fetta lime',        '#1A0800', true),
  (17, 'Sex on the Beach', 'Tropical',     'highball',     12, 'easy',   3,  185, 1987, 'Florida, USA',              'Vodka, pesca e cranberry per un cocktail estivo.',                                                 'Versa vodka e arancia su ghiaccio. Aggiungi cranberry delicatamente.',                              'Fetta arancia',     '#FF4500', true),
  (18, 'Dark ''n'' Stormy', 'Longdrink',   'highball',     14, 'easy',   2,  140, 1806, 'Bermuda',                   'Rum scuro e ginger beer. Piccante e intenso.',                                                     'Riempi con ghiaccio e ginger beer. Float di rum scuro sopra.',                                     'Fetta lime',        '#6B3000', true),
  (19, 'Paloma',           'Tequila',      'highball',     12, 'easy',   3,  130, 1950, 'Messico',                   'Il cocktail più bevuto in Messico. Tequila e pompelmo.',                                           'Bagna il bordo con sale. Versa tequila e lime. Completa con soda al pompelmo.',                     'Sale + Fetta pompelmo', '#FFB0B0', true),
  (20, 'French 75',        'Classic',      'coupe',        14, 'medium', 4,  145, 1915, 'Parigi, Francia',           'Gin, champagne e agrumi. Potente come un cannone da 75mm.',                                       'Agita gin, limone e sciroppo. Completa con Prosecco.',                                             'Scorza limone',     '#F0E8D0', true),
  (21, 'Bellini',          'Aperitivo',    'wine',         7,  'easy',   2,  90,  1948, 'Venezia, Italia',           'Harry''s Bar, 1948. Prosecco e purea di pesca.',                                                   'Versa purea di pesca. Aggiungi Prosecco freddo.',                                                  'Fetta pesca',       '#FFD0A0', true),
  (22, 'Kir Royale',       'Aperitivo',    'coupe',        12, 'easy',   2,  100, 1945, 'Borgogna, Francia',         'Crème de cassis e Champagne. Semplice ed elegantissimo.',                                          'Versa cassis. Aggiungi Prosecco.',                                                                 'Mora o Ribes',      '#8B0050', true),
  (23, 'White Russian',    'After Dinner', 'oldfashioned', 22, 'easy',   2,  280, 1965, 'USA',                       'Vodka, Kahlúa e panna. Cremoso e indulgente.',                                                     'Versa vodka e Kahlúa su ghiaccio. Float di panna sopra.',                                          'Nessuno',           '#C89060', true),
  (24, 'Black Russian',    'After Dinner', 'oldfashioned', 28, 'easy',   2,  180, 1949, 'Bruxelles, Belgio',         'Vodka e Kahlúa. La versione dark senza panna.',                                                    'Versa vodka e Kahlúa su ghiaccio.',                                                                'Nessuno',           '#0A0400', true),
  (25, 'Amaretto Sour',    'Sour',         'coupe',        15, 'medium', 4,  165, 1970, 'USA',                       'Amaretto e limone. Dolce, acido, vellutato.',                                                      'Dry shake con albume. Agita con ghiaccio. Doppio colino.',                                         'Scorza arancia + Angostura', '#C08040', true),
  (26, 'New York Sour',    'Sour',         'coupe',        20, 'hard',   6,  195, 1883, 'Chicago, USA',              'Whisky Sour con float di vino rosso.',                                                             'Agita bourbon, limone e sciroppo. Float di vino rosso.',                                           'Scorza limone',     '#8B1010', true),
  (27, 'Lemon Drop',       'Contemporary', 'martini',      20, 'medium', 4,  155, 1970, 'San Francisco, USA',        'Vodka, triple sec e limone. Rim di zucchero obbligatorio.',                                        'Rim di zucchero. Agita vodka, triple sec e limone.',                                               'Zucchero + Scorza limone', '#FFE080', true),
  (28, 'Sidecar',          'Classic',      'coupe',        25, 'medium', 4,  165, 1922, 'Parigi, Francia',           'Cognac, triple sec e limone. Un classico parigino.',                                               'Rim di zucchero. Agita cognac, triple sec e limone.',                                              'Zucchero + Scorza limone', '#C8A860', true),
  (29, 'Aviation',         'Classic',      'coupe',        20, 'hard',   5,  160, 1916, 'New York, USA',             'Gin, maraschino, violette e limone. Il cocktail color cielo.',                                     'Agita tutti gli ingredienti. Doppio colino.',                                                      'Ciliegia Luxardo',  '#8080D0', true),
  (30, 'Last Word',        'Classic',      'coupe',        25, 'medium', 4,  170, 1916, 'Detroit, USA',              'Parti uguali di quattro ingredienti perfetti. Equilibrio assoluto.',                               'Agita parti uguali. Doppio colino.',                                                               'Scorza lime',       '#60A040', true),
  -- Sprint 3 cocktails (36-60)
  (36, 'Americano',        'Aperitivo',    'oldfashioned', 11, 'easy',   2,  130, 1861, 'Milano, Italia',            'Il nonno del Negroni. Campari, vermut e soda.',                                                    'Versa Campari e vermut su ghiaccio. Completa con soda.',                                           'Scorza arancia',    '#C0392B', true),
  (37, 'Gimlet',           'Classic',      'coupe',        22, 'easy',   3,  140, 1928, 'Marina Britannica',         'Gin e lime cordial. La semplicità assoluta.',                                                      'Agita gin, lime e sciroppo. Doppio colino.',                                                       'Fetta lime',        '#C8E890', true),
  (38, 'Bee''s Knees',     'Classic',      'coupe',        22, 'medium', 4,  155, 1921, 'Prohibition, USA',          'Il miele mascherava il gin di contrabbando. Era del Prohibition.',                                 'Agita gin, limone e miele. Doppio colino.',                                                        'Scorza limone',     '#FFE060', true),
  (39, 'Penicillin',       'Contemporary', 'oldfashioned', 22, 'hard',   6,  175, 2005, 'New York, USA',             'Sam Ross, Milk & Honey 2005. Un moderno classico istantaneo.',                                     'Agita blended scotch, limone, miele-zenzero. Float di torbato.',                                   'Zenzero + Scorza limone', '#C8A040', true),
  (40, 'Paper Plane',      'Contemporary', 'coupe',        24, 'medium', 4,  168, 2008, 'New York, USA',             'Parti uguali di quattro straordinari ingredienti.',                                                'Agita parti uguali: bourbon, Aperol, Amaro Nonino, lime.',                                         'Scorza arancia',    '#FF8040', true),
  (44, 'Vieux Carré',      'Classic',      'oldfashioned', 30, 'hard',   5,  200, 1938, 'New Orleans, USA',          'Il cocktail del French Quarter. Bourbon, cognac, vermut e Bénédictine.',                           'Mescola tutti gli ingredienti su ghiaccio per 30 secondi.',                                        'Scorza limone',     '#8B4020', true),
  (47, 'Ramos Gin Fizz',   'Classic',      'highball',     10, 'hard',   12, 190, 1888, 'New Orleans, USA',          'Il cocktail che richiedeva 12 minuti di shaking. Gin, panna e albume.',                            'Dry shake 5 min. Ghiaccio, altri 5 min. Soda.',                                                    'Nessuno',           '#FFFFF0', true),
  -- Sprint 5 cocktails (61-80)
  (61, 'Caipirinha',       'Classic',      'oldfashioned', 20, 'medium', 4,  175, 1918, 'Brasile',                   'Il cocktail nazionale brasiliano. Cachaça, lime e zucchero.',                                      'Pesta lime e zucchero. Aggiungi ghiaccio tritato e cachaça.',                                      'Fetta lime',        '#A8D000', true),
  (62, 'Caipiroska',       'Contemporary', 'oldfashioned', 20, 'easy',   4,  165, 1990, 'Brasile/Russia',            'La Caipirinha con la vodka. Più neutra, più pulita.',                                              'Pesta lime e zucchero. Aggiungi vodka e ghiaccio tritato.',                                        'Fetta lime + Menta','#B5E030', true),
  (63, 'Sbagliato',        'Aperitivo',    'wine',         11, 'easy',   2,  130, 1972, 'Milano, Italia',            'L''errore più felice della mixology. Prosecco al posto del gin.',                                  'Versa Campari e vermut. Completa con Prosecco.',                                                   'Scorza arancia',    '#C0392B', true),
  (64, 'Garibaldi',        'Aperitivo',    'highball',     11, 'easy',   2,  110, 1860, 'Italia',                    'Campari e succo d''arancia fresco. L''aperitivo più semplice.',                                    'Versa Campari su ghiaccio. Aggiungi arancia fresca.',                                              'Fetta arancia',     '#E67E22', true),
  (65, 'Mi-To',            'Aperitivo',    'oldfashioned', 18, 'easy',   2,  140, 1850, 'Milano-Torino',             'Milano-Torino. L''aperitivo che ha preceduto il Negroni.',                                         'Versa Campari e vermut su ghiaccio. Scorza limone.',                                               'Scorza limone',     '#9B1B1B', true),
  (66, 'Bramble',          'Contemporary', 'oldfashioned', 18, 'medium', 5,  165, 1984, 'Londra, UK',                'Dick Bradsell, 1984. Gin e crème de mûre. Bello come il tramonto.',                                'Agita gin, limone e sciroppo. Ghiaccio tritato. Float crème de mûre.',                             'Mora + Fetta limone', '#6B1A8A', true),
  (67, 'Pisco Sour',       'Sour',         'coupe',        17, 'medium', 5,  168, 1920, 'Lima, Perù',                'Pisco, lime, sciroppo e albume. Schiuma nuvola con drops di Angostura.',                           'Dry shake pisco, lime, sciroppo e albume. Poi agita con ghiaccio.',                                'Angostura drops + Menta', '#FFFFC0', true),
  (68, 'Gin Basil Smash',  'Contemporary', 'oldfashioned', 18, 'medium', 5,  158, 2008, 'Amburgo, Germania',         'Jörg Meyer, 2008. Gin e basilico fresco pestati insieme.',                                         'Pesta basilico con sciroppo. Agita gin, limone e ghiaccio.',                                       'Foglie di basilico', '#80C040', true),
  (69, 'White Negroni',    'Contemporary', 'coupe',        24, 'medium', 4,  185, 2001, 'Bordeaux, Francia',         'Gin, Suze e Lillet Blanc. Il Negroni del XXI secolo.',                                             'Mescola gin, Suze e Lillet su ghiaccio 30s.',                                                      'Scorza limone',     '#F8F0C0', true),
  (70, 'Strawberry Daiquiri','Tropical',   'coupe',        16, 'easy',   5,  165, 1960, 'USA/Cuba',                  'Il Daiquiri con fragole fresche. Un cocktail estivo.',                                             'Frulla rum, fragole, lime e sciroppo con ghiaccio.',                                               'Fragola + Lime',    '#FF3060', true),
  (71, 'Mezcal Mule',      'Longdrink',    'highball',     12, 'easy',   3,  140, 2010, 'Messico/USA',               'Il Moscow Mule reinventato con mezcal. Affumicato e piccante.',                                    'Versa mezcal e lime su ghiaccio. Completa con ginger beer.',                                       'Lime + Zenzero',    '#D0A040', true),
  (72, 'Aperol Collins',   'Longdrink',    'highball',     8,  'easy',   3,  120, 2000, 'Italia/UK',                 'L''Aperol nel formato Collins. Leggero, frizzante, agrumato.',                                     'Agita Aperol, limone e sciroppo. Completa con soda.',                                              'Fetta arancia + Ciliegia', '#FF7020', true),
  (73, 'Hugo Spritz',      'Aperitivo',    'wine',         7,  'easy',   2,  95,  2005, 'Alto Adige, Italia',        'L''aperitivo delle Dolomiti. Sambuco, Prosecco e menta fresca.',                                   'Sciroppo di sambuco con menta. Aggiungi Prosecco e soda.',                                         'Menta + Limone',    '#E0F0C0', true),
  (74, 'Monte Carlo',      'Classic',      'coupe',        28, 'medium', 4,  180, 1948, 'USA',                       'Rye e Bénédictine. Due ingredienti, complessità infinita.',                                        'Mescola bourbon, triple sec e Angostura su ghiaccio.',                                             'Scorza limone',     '#C09040', true),
  (75, 'Revolver',         'Contemporary', 'coupe',        28, 'medium', 4,  180, 2004, 'San Francisco, USA',        'Jon Santer, 2004. Bourbon, Kahlúa e orange bitters.',                                             'Mescola bourbon, Kahlúa e bitters su ghiaccio.',                                                   'Scorza arancia fiammeggiata', '#8B3000', true),
  (76, 'Army and Navy',    'Classic',      'coupe',        20, 'medium', 4,  150, 1941, 'USA',                       'Gin, limone e orgeat. La mandorla trasforma il sour.',                                             'Agita gin, limone e orgeat con ghiaccio.',                                                         'Scorza limone',     '#FFE090', true),
  (77, 'Woo Woo',          'Contemporary', 'highball',     14, 'easy',   3,  175, 1980, 'USA',                       'Vodka, peach schnapps e cranberry. Un classico degli anni ''80.',                                  'Versa vodka, schnapps e cranberry su ghiaccio.',                                                   'Fetta lime',        '#CC2060', true),
  (78, 'Blue Hawaiian',    'Tropical',     'highball',     14, 'easy',   4,  195, 1957, 'Honolulu, Hawaii',          'Harry Yee, 1957. Rum, Blue Curaçao e ananas. Il cocktail delle Hawaii.',                           'Agita rum, Blue Curaçao, ananas e cocco con ghiaccio.',                                            'Ananas + Ciliegia + Ombrellino', '#0090FF', true),
  (79, 'Cucumber Collins', 'Longdrink',    'highball',     10, 'medium', 5,  110, 2005, 'UK',                        'Gin, cetriolo, menta e soda. La freschezza più pura.',                                             'Pesta cetriolo e menta. Agita gin e limone. Soda.',                                                'Fette cetriolo + Menta', '#80D080', true),
  (80, 'Pisco Punch',      'Classic',      'wine',         14, 'medium', 5,  185, 1872, 'San Francisco, USA',        'Il punch leggendario del Bank Exchange. Pisco, ananas e agrumi.',                                  'Mescola pisco, ananas, lime e sciroppo. Soda.',                                                    'Fetta ananas',      '#FFD050', true)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  method      = EXCLUDED.method;

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAIL INGREDIENTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.cocktail_ingredients (cocktail_id, ingredient_id, amount_ml, display_order) VALUES
  -- Negroni
  (1, 4, 30, 1), (1, 2, 30, 2), (1, 15, 30, 3),
  -- Aperol Spritz
  (2, 1, 60, 1), (2, 14, 90, 2), (2, 27, 30, 3),
  -- Mojito
  (3, 8, 50, 1), (3, 21, 25, 2), (3, 26, 10, 3), (3, 27, 100, 4),
  -- Old Fashioned
  (4, 12, 60, 1), (4, 3, 3, 2), (4, 26, 5, 3),
  -- Espresso Martini
  (5, 6, 50, 1), (5, 18, 30, 2), (5, 29, 30, 3),
  -- Margarita
  (6, 10, 50, 1), (6, 17, 25, 2), (6, 21, 25, 3),
  -- Gin Tonic
  (7, 5, 50, 1), (7, 28, 150, 2),
  -- Cosmopolitan
  (8, 7, 40, 1), (8, 17, 15, 2), (8, 24, 30, 3), (8, 21, 15, 4),
  -- Whisky Sour
  (9, 12, 60, 1), (9, 23, 30, 2), (9, 26, 20, 3),
  -- Daiquiri
  (10, 8, 60, 1), (10, 21, 30, 2), (10, 26, 15, 3),
  -- Moscow Mule
  (11, 6, 50, 1), (11, 21, 25, 2),
  -- Caipirinha
  (61, 8, 50, 1), (61, 21, 30, 2), (61, 26, 15, 3),
  -- Caipiroska
  (62, 6, 50, 1), (62, 21, 30, 2), (62, 26, 15, 3),
  -- Sbagliato
  (63, 2, 30, 1), (63, 15, 30, 2), (63, 14, 60, 3),
  -- Garibaldi
  (64, 2, 50, 1), (64, 22, 150, 2),
  -- Mi-To
  (65, 2, 45, 1), (65, 15, 45, 2),
  -- Gin Basil Smash
  (68, 4, 60, 1), (68, 23, 30, 2), (68, 26, 15, 3),
  -- White Negroni
  (69, 5, 30, 1), (69, 16, 30, 2), (69, 16, 30, 3),
  -- Strawberry Daiquiri
  (70, 8, 50, 1), (70, 21, 20, 2), (70, 26, 10, 3),
  -- Mezcal Mule
  (71, 11, 50, 1), (71, 21, 20, 2),
  -- Blue Hawaiian
  (78, 8, 40, 1), (78, 20, 20, 2), (78, 25, 60, 3)
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- COCKTAIL TAGS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.cocktail_tags (cocktail_id, tag) VALUES
  (1,'amaro'),(1,'aperitivo'),(1,'classico'),(1,'stirred'),(1,'italiano'),
  (2,'fresco'),(2,'aperitivo'),(2,'frizzante'),(2,'easy'),(2,'italiano'),
  (3,'fresco'),(3,'menta'),(3,'tropicale'),(3,'shaken'),
  (4,'whiskey'),(4,'amaro'),(4,'classico'),(4,'stirred'),
  (5,'caffè'),(5,'dolce'),(5,'after dinner'),(5,'shaken'),
  (6,'tequila'),(6,'agrumato'),(6,'classico'),(6,'shaken'),
  (7,'fresco'),(7,'botanico'),(7,'leggero'),(7,'easy'),
  (8,'dolce'),(8,'agrumato'),(8,'rosa'),(8,'shaken'),
  (9,'whiskey'),(9,'sour'),(9,'cremoso'),(9,'shaken'),
  (10,'rum'),(10,'sour'),(10,'classico'),(10,'shaken'),
  (11,'vodka'),(11,'piccante'),(11,'ginger'),(11,'easy'),
  (61,'agrumato'),(61,'classico'),(61,'brasiliano'),(61,'fresco'),
  (62,'vodka'),(62,'agrumato'),(62,'fresco'),(62,'easy'),
  (63,'amaro'),(63,'aperitivo'),(63,'frizzante'),(63,'italiano'),(63,'easy'),
  (64,'amaro'),(64,'aperitivo'),(64,'agrumato'),(64,'italiano'),(64,'easy'),
  (65,'amaro'),(65,'aperitivo'),(65,'italiano'),(65,'stirred'),(65,'storico'),
  (66,'gin'),(66,'fruttato'),(66,'viola'),(66,'artigianale'),(66,'contemporaneo'),
  (67,'sour'),(67,'cremoso'),(67,'peruviano'),(67,'shaken'),
  (68,'gin'),(68,'erbaceo'),(68,'fresco'),(68,'contemporaneo'),(68,'shaken'),
  (69,'amaro'),(69,'gin'),(69,'elegante'),(69,'contemporaneo'),(69,'stirred'),
  (70,'rum'),(70,'fruttato'),(70,'tropicale'),(70,'dolce'),(70,'blended'),
  (71,'mezcal'),(71,'affumicato'),(71,'piccante'),(71,'ginger'),(71,'easy'),
  (72,'aperitivo'),(72,'fresco'),(72,'agrumato'),(72,'frizzante'),(72,'easy'),
  (73,'aperitivo'),(73,'floreale'),(73,'fresco'),(73,'frizzante'),(73,'easy'),(73,'italiano'),
  (74,'whiskey'),(74,'dolce'),(74,'classico'),(74,'stirred'),
  (75,'whiskey'),(75,'caffè'),(75,'contemporaneo'),(75,'stirred'),
  (76,'gin'),(76,'dolce'),(76,'sour'),(76,'classico'),(76,'shaken'),
  (77,'vodka'),(77,'dolce'),(77,'fruttato'),(77,'rosa'),(77,'easy'),
  (78,'rum'),(78,'tropicale'),(78,'blu'),(78,'dolce'),(78,'visivo'),
  (79,'gin'),(79,'fresco'),(79,'erbaceo'),(79,'estivo'),(79,'easy'),
  (80,'rum'),(80,'tropicale'),(80,'fruttato'),(80,'storico')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Re-enable triggers
-- ─────────────────────────────────────────────────────────────────────────────
SET session_replication_role = DEFAULT;

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  RAISE NOTICE 'Seed complete: % cocktails, % ingredients, % tags',
    (SELECT COUNT(*) FROM public.cocktails),
    (SELECT COUNT(*) FROM public.ingredients),
    (SELECT COUNT(*) FROM public.cocktail_tags);
END $$;
