// Voedingsdatabase: ~30 veelgebruikte voedingsmiddelen
// Velden: naam, kcal (per portie), portie (gram), portieOmschrijving, categorie
const foods = [
  // Fruit
  { naam: "Banaan",        kcal: 89,  portie: 120, portieOmschrijving: "1 middelgroot, ca. 120g",  categorie: "fruit" },
  { naam: "Appel",         kcal: 72,  portie: 130, portieOmschrijving: "1 middelgroot, ca. 130g",  categorie: "fruit" },
  { naam: "Sinaasappel",   kcal: 62,  portie: 150, portieOmschrijving: "1 middelgroot, ca. 150g",  categorie: "fruit" },
  { naam: "Aardbei",       kcal: 48,  portie: 150, portieOmschrijving: "1 handvol, ca. 150g",       categorie: "fruit" },
  { naam: "Druiven",       kcal: 104, portie: 150, portieOmschrijving: "1 handvol, ca. 150g",       categorie: "fruit" },

  // Groenten
  { naam: "Broccoli",      kcal: 35,  portie: 150, portieOmschrijving: "1 portie, ca. 150g",        categorie: "groenten" },
  { naam: "Wortel",        kcal: 41,  portie: 100, portieOmschrijving: "1 middelgrote wortel, ca. 100g", categorie: "groenten" },
  { naam: "Komkommer",     kcal: 16,  portie: 100, portieOmschrijving: "5 plakjes, ca. 100g",       categorie: "groenten" },
  { naam: "Tomaat",        kcal: 22,  portie: 120, portieOmschrijving: "1 middelgrote tomaat, ca. 120g", categorie: "groenten" },
  { naam: "Spinazie",      kcal: 23,  portie: 100, portieOmschrijving: "1 portie rauw, ca. 100g",   categorie: "groenten" },

  // Zuivel
  { naam: "Volle melk",    kcal: 122, portie: 200, portieOmschrijving: "1 glas, ca. 200ml",         categorie: "zuivel" },
  { naam: "Griekse yoghurt", kcal: 100, portie: 150, portieOmschrijving: "1 portie, ca. 150g",      categorie: "zuivel" },
  { naam: "Kaas (jong)",   kcal: 120, portie: 30,  portieOmschrijving: "1 plak, ca. 30g",            categorie: "zuivel" },
  { naam: "Ei",            kcal: 78,  portie: 60,  portieOmschrijving: "1 middelgroot ei, ca. 60g",  categorie: "zuivel" },
  { naam: "Kwark",         kcal: 75,  portie: 150, portieOmschrijving: "1 portie, ca. 150g",         categorie: "zuivel" },

  // Vlees & vis
  { naam: "Kipfilet",      kcal: 165, portie: 100, portieOmschrijving: "1 kipfilet, ca. 100g",       categorie: "vlees-vis" },
  { naam: "Zalm",          kcal: 208, portie: 100, portieOmschrijving: "1 portie, ca. 100g",          categorie: "vlees-vis" },
  { naam: "Tonijn (blik)", kcal: 116, portie: 85,  portieOmschrijving: "1 klein blik, uitgelekt ca. 85g", categorie: "vlees-vis" },
  { naam: "Gehakt (rund)", kcal: 254, portie: 100, portieOmschrijving: "1 portie, ca. 100g",          categorie: "vlees-vis" },
  { naam: "Ei (hardgekookt)", kcal: 78, portie: 60, portieOmschrijving: "1 middelgroot ei, ca. 60g", categorie: "vlees-vis" },

  // Granen & brood
  { naam: "Volkorenbrood", kcal: 80,  portie: 35,  portieOmschrijving: "1 snee, ca. 35g",             categorie: "granen" },
  { naam: "Wit brood",     kcal: 79,  portie: 30,  portieOmschrijving: "1 snee, ca. 30g",              categorie: "granen" },
  { naam: "Havermout",     kcal: 150, portie: 40,  portieOmschrijving: "1 portie droog, ca. 40g",      categorie: "granen" },
  { naam: "Rijst (gekookt)", kcal: 130, portie: 100, portieOmschrijving: "1 portie gekookt, ca. 100g", categorie: "granen" },
  { naam: "Pasta (gekookt)", kcal: 158, portie: 100, portieOmschrijving: "1 portie gekookt, ca. 100g", categorie: "granen" },

  // Snacks & overig
  { naam: "Pindakaas",     kcal: 188, portie: 30,  portieOmschrijving: "2 eetlepels, ca. 30g",         categorie: "snacks" },
  { naam: "Noten (gemengd)", kcal: 185, portie: 30, portieOmschrijving: "1 handvol, ca. 30g",          categorie: "snacks" },
  { naam: "Chocolade (puur)", kcal: 170, portie: 30, portieOmschrijving: "3 blokjes, ca. 30g",         categorie: "snacks" },
  { naam: "Chips",         kcal: 152, portie: 30,  portieOmschrijving: "kleine zak, ca. 30g",           categorie: "snacks" },
  { naam: "Honing",        kcal: 86,  portie: 21,  portieOmschrijving: "1 eetlepel, ca. 21g",           categorie: "snacks" },
  { naam: "Avocado",       kcal: 160, portie: 100, portieOmschrijving: "½ avocado, ca. 100g",           categorie: "snacks" },
];
