## ADDED Requirements

### Requirement: Dagelijks overzichtsscherm
De app SHALL een overzichtsgebied tonen met het totaal aantal calorieën van de dag, een lijst van alle gelogde items en een motiverende boodschap.

#### Scenario: Totaal calorieën zichtbaar
- **WHEN** de app geladen is
- **THEN** toont het overzicht het gecumuleerde aantal calorieën van vandaag

#### Scenario: Loglijst per maaltijdcategorie
- **WHEN** er items gelogd zijn
- **THEN** toont de lijst de items gegroepeerd per maaltijdcategorie (Ontbijt, Lunch, Diner, Snack) met naam en calorieën per item

#### Scenario: Lege dag
- **WHEN** nog geen items zijn toegevoegd
- **THEN** toont de app een vriendelijke lege-staat boodschap zoals "Begin de dag goed — voeg je eerste maaltijd toe! 🌱"

### Requirement: Motiverende dagboodschap
De app SHALL een contextgevoelige positieve boodschap tonen op basis van de voortgang.

#### Scenario: Goed op weg
- **WHEN** de inname tussen 40% en 70% van het doel is
- **THEN** toont de app een aanmoedigende boodschap zoals "Lekker bezig! 💚"

#### Scenario: Doel bereikt
- **WHEN** de inname 95-105% van het doel bereikt
- **THEN** toont de app een feliciterende boodschap zoals "Perfect in balans! 🎯 Goed gedaan."

#### Scenario: Doel overschreden
- **WHEN** de inname meer dan 110% van het doel is
- **THEN** toont de app een milde, niet-beschuldigende boodschap zoals "Vandaag wat extra energie 😊 Morgen weer een nieuwe kans."

### Requirement: Dagdoel instellen
De gebruiker SHALL het dagelijkse caloriedoel kunnen aanpassen.

#### Scenario: Doel wijzigen
- **WHEN** gebruiker het instellingen-icoon aanklikt en een nieuw getal invult
- **THEN** wordt het doel opgeslagen in localStorage en bijgewerkt in de visualisatie

#### Scenario: Standaard doel
- **WHEN** de app voor het eerst wordt geopend
- **THEN** is het dagdoel ingesteld op 2000 kcal
