## Context

Een standalone p5.js browser-app zonder build tooling, backend of npm. De app draait volledig client-side. Persistentie via `localStorage`. Visuele stijl volgt "Healthy House": organisch, warm, bewust — aardse tonen, ronde vormen, positieve micro-copy.

Stack: HTML5 + p5.js (CDN) + vanilla JS-modules via `<script type="module">`.

## Goals / Non-Goals

**Goals:**
- Eenvoudig voedsel toevoegen en calorieën loggen per dag
- Visueel aantrekkelijke voortgangsindicator (animerende ring)
- Ingebouwde voedingsdatabase (~30 producten)
- Dagelijks overzicht met totalen en motiverende boodschap
- Data bewaard na page refresh via localStorage

**Non-Goals:**
- Geen gebruikersaccounts of cloud-sync
- Geen eigen recepten aanmaken
- Geen historische trends over meerdere weken
- Geen barcode scanner of externe voedingsdatabase API
- Geen PWA/offline-first (buiten scope voor v1)

## Decisions

### D1: p5.js voor UI én visualisatie
**Keuze**: Volledige p5.js canvas voor de app, inclusief knoppen en invoervelden via p5.dom.
**Reden**: Consistent met de "Healthy House" woke stijl en past bij Michel's voorkeur voor p5.js als creatief medium. Alternatief (HTML/CSS + p5 alleen voor ring) zou twee stijlsystemen vereisen.
**Alternatief overwogen**: HTML form + p5 canvas alleen voor de ring — meer DOM-controle maar minder visuele cohesie.

### D2: localStorage als enige persistentielaag
**Keuze**: Alle data (daglog, instellingen) opslaan in `localStorage` als JSON.
**Reden**: Zero-setup voor de gebruiker, geen backend nodig, voldoende voor persoonlijk gebruik.
**Sleutelstructuur**:
- `cm_log_YYYY-MM-DD` → array van logitems voor die dag
- `cm_settings` → dagdoel calorieën, naam gebruiker

### D3: Bestandsstructuur
```
index.html          ← app shell, p5.js CDN
sketch.js           ← hoofd p5 sketch (setup/draw/events)
data/foods.js       ← voedingsdatabase als JS-array (export)
style.css           ← minimale CSS reset + font import
```
Geen modules/bundler — alles global of via `<script>` tags in volgorde.

### D4: Kleurpalet & typografie
- Achtergrond: `#F7F3EE` (warm wit)
- Primair: `#6B9E78` (salie groen)
- Accent: `#C97B4B` (terracotta)
- Tekst: `#2C2C2C`
- Font: `Nunito` via Google Fonts (round, friendly)
- Ring kleuren: groen (0-70% doel) → amber (70-90%) → terracotta (90-100%+)

### D5: Dagdoel standaard
**Keuze**: Standaard 2000 kcal, aanpasbaar via instellingen-knop.

## Risks / Trade-offs

- [localStorage limiet ~5MB] → Niet relevant voor dagelijkse tekstdata; risico verwaarloosbaar
- [p5.js tekstvelden zijn beperkt] → Gebruik `createInput()` via p5.dom; stijl via CSS; kan lastig zijn op mobiel
- [Geen validatie voedingsdatabase] → Gebruiker kan handmatig kcal invoeren; database is indicatief
- [Datumsessies] → App toont altijd vandaag; geen navigatie naar gisteren in v1

## Open Questions

- Wil Rene ook eiwitten/vetten/koolhydraten bijhouden of alleen calorieën? → *Aanname: alleen calorieën in v1, macro-overzicht als bonus indien data beschikbaar*
- Mobiele ondersteuning prioriteit? → *Aanname: desktop-first, responsive als bonus*
