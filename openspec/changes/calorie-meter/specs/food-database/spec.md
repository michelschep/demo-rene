## ADDED Requirements

### Requirement: Ingebouwde voedingsdatabase
De app SHALL een database bevatten van minimaal 30 veelgebruikte voedingsmiddelen met caloriewaarden, categoriseerd naar voedselgroep.

#### Scenario: Database bevat basisvoedsel
- **WHEN** gebruiker zoekt naar gangbare producten zoals "banaan", "ei", "brood", "kipfilet"
- **THEN** verschijnen deze items als suggestie met hun caloriewaarde

#### Scenario: Database bevat diverse voedselgroepen
- **WHEN** de database wordt geladen
- **THEN** bevat deze items uit minimaal 6 groepen: fruit, groenten, zuivel, vlees/vis, granen, snacks/overig

### Requirement: Zoeksuggesties
De app SHALL tijdens het typen live zoeksuggesties tonen op basis van de voedingsdatabase.

#### Scenario: Typen activeert suggesties
- **WHEN** gebruiker minimaal 2 tekens typt in het zoekveld
- **THEN** verschijnen maximaal 5 overeenkomende items als klikbare suggesties

#### Scenario: Geen resultaat
- **WHEN** gebruiker iets typt dat niet overeenkomt met de database
- **THEN** toont de app "Niet gevonden — voer handmatig in" met een invoerveld voor eigen caloriewaarde

### Requirement: Calorieën per portie
Elk item in de database SHALL een naam, caloriewaarde per standaardportie, en portieomschrijving bevatten.

#### Scenario: Portie-informatie zichtbaar
- **WHEN** gebruiker een item selecteert
- **THEN** toont de app de naam, de standaardportie (bijv. "1 middelgroot, ca. 120g") en de calorieën
