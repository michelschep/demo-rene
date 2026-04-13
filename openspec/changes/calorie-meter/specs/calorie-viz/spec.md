## ADDED Requirements

### Requirement: Dagelijkse voortgangsring
De app SHALL een geanimeerde cirkelring tonen die de dagelijkse calorie-inname weergeeft als percentage van het gestelde doel.

#### Scenario: Ring vult op bij toevoegen
- **WHEN** gebruiker een voedselitem toevoegt
- **THEN** animeert de ring soepel naar het nieuwe percentage

#### Scenario: Kleurovergang op basis van voortgang
- **WHEN** dagelijkse inname onder 70% van het doel is
- **THEN** is de ring salie groen (#6B9E78)

#### Scenario: Waarschuwingskleur
- **WHEN** dagelijkse inname tussen 70% en 90% van het doel is
- **THEN** is de ring amber (#E8A838)

#### Scenario: Doel bereikt of overschreden
- **WHEN** dagelijkse inname 90% of meer van het doel bereikt
- **THEN** is de ring terracotta (#C97B4B) en verschijnt een positieve boodschap

### Requirement: Calorieteller in ring
De ring SHALL in het midden het actuele aantal calorieën en het dagdoel tonen.

#### Scenario: Teller bijwerken
- **WHEN** de log verandert
- **THEN** toont het midden van de ring "X / Y kcal" waarbij X het huidig totaal is en Y het doel

### Requirement: Maaltijdverdeling balkdiagram
De app SHALL onder de ring een horizontale balk tonen die de verdeling van calorieën per maaltijdcategorie visualiseert.

#### Scenario: Segmenten per categorie
- **WHEN** er items in meerdere maaltijdcategorieën zijn gelogd
- **THEN** toont de balk gekleurde segmenten proportioneel aan de calorieën per categorie
