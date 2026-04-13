## Why

Rene wil zijn dagelijkse voedselinname bijhouden zonder droge spreadsheets of klinische apps. Een visueel aantrekkelijke, bewust-leven-georiënteerde p5.js calorie meter past perfect bij een actieve, gezonde levensstijl en maakt voedingsregistratie leuk in plaats van een taak.

## What Changes

- Nieuwe standalone p5.js app (`index.html` + `sketch.js`) die direct in de browser draait
- Visueel dashboard met dagelijkse calorie-inname in "Healthy House" stijl (groen, organisch, warm)
- Voedsel toevoegen via een zoekbalk met ingebouwde voedingsdatabase
- Progressie-visualisatie: dagdoel vs. huidig totaal (cirkel/ring animatie)
- Maaltijdcategorieën (ontbijt, lunch, diner, snack) met kleurcodering
- Lokale opslag via `localStorage` zodat data bewaard blijft na refresh
- Bewuste taal en micro-copy: positief, aanmoedigend, geen schuld-trips

## Capabilities

### New Capabilities
- `food-logging`: Voedsel toevoegen aan dagelijkse log met portiegrootte en calorieën; georganiseerd per maaltijdcategorie
- `calorie-viz`: p5.js animatie die dagelijkse voortgang toont als vullende ring, met kleurovergang van groen naar amber naarmate het doel nadert
- `food-database`: Ingebouwde lijst van ~30 veelgebruikte voedingsmiddelen met caloriewaarden per 100g of standaardportie
- `daily-summary`: Overzicht van de dag: totale calorieën, macros (koolhydraten, eiwitten, vet), en motiverende dagboodschap

### Modified Capabilities
<!-- geen bestaande specs -->

## Impact

- Nieuwe bestanden: `index.html`, `sketch.js`, `style.css`, `data/foods.js`
- Geen backend, geen npm — pure browser-app
- Visuele stijl: aardse tonen (salie groen, warm wit, terracotta accent), ronde vormen, rustige typografie (Google Font: Nunito of DM Sans)
- localStorage als persistentielaag; geen externe dependencies buiten p5.js CDN
