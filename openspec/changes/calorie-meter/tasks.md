## 1. Project Setup

- [x] 1.1 Maak `index.html` aan met p5.js CDN-link, Google Font (Nunito), en verwijzing naar `sketch.js` en `data/foods.js`
- [x] 1.2 Maak `style.css` aan met minimale CSS reset, achtergrondkleur `#F7F3EE`, font-instelling en basisstijl voor p5-canvas
- [x] 1.3 Maak `data/foods.js` aan met een array van ~30 voedingsmiddelen (naam, kcal, portie, portieomschrijving, categorie)

## 2. Voedingsdatabase & Zoekfunctie

- [x] 2.1 Implementeer live zoekfunctie in `sketch.js`: filter `foods`-array op ingevoerde tekst (minimaal 2 tekens)
- [x] 2.2 Toon maximaal 5 zoeksuggesties als klikbare elementen onder het zoekveld
- [x] 2.3 Implementeer "Niet gevonden" flow: toon handmatig invoerveld voor naam + calorieën wanneer geen resultaten

## 3. Voedsel Loggen

- [x] 3.1 Implementeer het toevoegen van een geselecteerd item aan de daglog (naam, kcal, maaltijdcategorie, timestamp)
- [x] 3.2 Voeg maaltijdcategorie-selector toe (Ontbijt / Lunch / Diner / Snack) met standaard "Snack"
- [x] 3.3 Implementeer verwijder-functie per logitem (klik op ✕-icoon verwijdert item uit log en herberekent totaal)

## 4. localStorage Persistentie

- [x] 4.1 Sla daglog op in `localStorage` onder sleutel `cm_log_YYYY-MM-DD` bij elke wijziging
- [x] 4.2 Laad bestaande daglog uit `localStorage` bij opstarten; start leeg op een nieuwe dag
- [x] 4.3 Sla dagdoel op in `localStorage` onder `cm_settings`; gebruik 2000 kcal als standaard

## 5. Calorie Visualisatie

- [x] 5.1 Teken geanimeerde cirkelring die dagelijkse voortgang toont (percentage van doel)
- [x] 5.2 Implementeer kleurovergang: groen (0-70%) → amber (70-90%) → terracotta (90%+)
- [x] 5.3 Toon "X / Y kcal" in het midden van de ring, bijgewerkt bij elke log-wijziging
- [x] 5.4 Teken horizontale maaltijdverdeling-balk onder de ring met gekleurde segmenten per categorie

## 6. Dagelijks Overzicht

- [x] 6.1 Render loglijst gegroepeerd per maaltijdcategorie met naam en kcal per item
- [x] 6.2 Implementeer lege-staat boodschap wanneer de log leeg is
- [x] 6.3 Implementeer contextgevoelige motiverende boodschap op basis van voortgangspercentage (zie specs)

## 7. Instellingen

- [x] 7.1 Voeg instellingen-icoon (⚙) toe aan de app; toon bij klik een overlay met dagdoel-invoerveld
- [x] 7.2 Sla nieuw dagdoel op in `localStorage` en update ring en teller direct

## 8. Afronding & Stijl

- [x] 8.1 Controleer alle kleuren op overeenkomst met Healthy House palet (salie groen, terracotta, warm wit)
- [x] 8.2 Verifieer dat geen p5.js gereserveerde namen gebruikt worden als variabelen (`width`, `height`, `color`, etc.)
- [x] 8.3 Test in browser: console vrij van errors, data persistent na refresh, animaties soepel
- [ ] 8.4 Commit als `feat: add calorie-meter p5.js app`
