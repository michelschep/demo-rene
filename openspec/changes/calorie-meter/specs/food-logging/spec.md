## ADDED Requirements

### Requirement: Voedsel toevoegen aan daglog
De gebruiker SHALL een voedselitem kunnen toevoegen aan de dagelijkse log door een naam te zoeken of in te typen en de portiegrootte op te geven. Het item wordt gekoppeld aan een maaltijdcategorie.

#### Scenario: Voedsel zoeken en toevoegen
- **WHEN** gebruiker typt in het zoekvenster en selecteert een item uit de suggesties
- **THEN** wordt het item toegevoegd aan de log met de standaardportie en bijbehorende calorieën

#### Scenario: Handmatig item toevoegen
- **WHEN** gebruiker typt een naam die niet in de database staat en voert handmatig calorieën in
- **THEN** wordt het item opgeslagen in de daglog met de ingevoerde caloriewaarde

#### Scenario: Maaltijdcategorie kiezen
- **WHEN** gebruiker voegt een item toe
- **THEN** kan de gebruiker kiezen uit: Ontbijt, Lunch, Diner, Snack (standaard: Snack)

### Requirement: Log-items verwijderen
De gebruiker SHALL een eerder toegevoegd item uit de daglog kunnen verwijderen.

#### Scenario: Item verwijderen
- **WHEN** gebruiker klikt op het verwijder-icoon naast een logitem
- **THEN** wordt het item uit de log verwijderd en het dagelijkse totaal bijgewerkt

### Requirement: Log persisteren
De daglog SHALL bewaard blijven na het sluiten en heropenen van de browser.

#### Scenario: Data herladen
- **WHEN** gebruiker herlaadt de pagina op dezelfde dag
- **THEN** zijn alle eerder toegevoegde items nog zichtbaar in de log

#### Scenario: Nieuwe dag
- **WHEN** gebruiker opent de app op een nieuwe kalenderdag
- **THEN** start de log leeg voor die dag (vorige dagen worden niet getoond)
