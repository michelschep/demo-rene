// Calorie Meter — p5.js sketch
// Healthy House palette
const CLR_BG      = '#F7F3EE';
const CLR_PRIMARY = '#6B9E78';
const CLR_ACCENT  = '#C97B4B';
const CLR_TEXT    = '#2C2C2C';
const CLR_WHITE   = '#FFFFFF';
const CLR_MUTED   = '#888888';

const CANVAS_W = 480;
const CANVAS_H = 800;

// Suggestion layout constants
const SUGG_X   = 90;
const SUGG_Y   = 102;
const SUGG_W   = 300;
const SUGG_H   = 48;
const SUGG_GAP = 4;
const SUGG_R   = 8;

// Manual entry layout constants
const MANUAL_NOT_FOUND_Y = SUGG_Y + 14;   // "Niet gevonden" label centre-Y
const MANUAL_INPUT_Y     = SUGG_Y + 42;   // DOM input row Y (canvas-relative)
const MANUAL_NAME_W      = 185;
const MANUAL_KCAL_W      = 99;
const MANUAL_BTN_Y       = SUGG_Y + 100;  // drawn button top Y
const MANUAL_BTN_H       = 44;
const MANUAL_BTN_R       = 8;

// Search state
let canvasPos;
let searchInputField;
let searchQueryText   = '';
let filteredFoodItems = [];
let selectedFoodItem  = null;

// Manual entry state
let manualNameField;
let manualKcalField;
let showManualEntry = false;

function setup() {
  let cnv = createCanvas(CANVAS_W, CANVAS_H);
  cnv.parent(document.body);
  canvasPos = cnv.position();

  searchInputField = createInput('');
  searchInputField.attribute('placeholder', 'Zoek voedsel… (typ min. 2 tekens)');
  searchInputField.size(300);
  searchInputField.position(canvasPos.x + SUGG_X, canvasPos.y + 64);
  searchInputField.input(onSearchInput);

  manualNameField = createInput('');
  manualNameField.attribute('placeholder', 'Naam voedsel');
  manualNameField.size(MANUAL_NAME_W);
  manualNameField.position(canvasPos.x + SUGG_X, canvasPos.y + MANUAL_INPUT_Y);
  manualNameField.hide();

  manualKcalField = createInput('');
  manualKcalField.attribute('placeholder', 'kcal');
  manualKcalField.attribute('type', 'number');
  manualKcalField.attribute('min', '1');
  manualKcalField.size(MANUAL_KCAL_W);
  manualKcalField.position(canvasPos.x + SUGG_X + MANUAL_NAME_W + 8, canvasPos.y + MANUAL_INPUT_Y);
  manualKcalField.hide();

  textFont('Nunito');
}

function onSearchInput() {
  searchQueryText   = searchInputField.value().trim();
  filteredFoodItems = filterFoods(searchQueryText);

  const noResults = searchQueryText.length >= 2 && filteredFoodItems.length === 0;
  if (noResults !== showManualEntry) {
    showManualEntry = noResults;
    if (showManualEntry) {
      manualNameField.show();
      manualKcalField.show();
    } else {
      manualNameField.hide();
      manualKcalField.hide();
    }
  }

  redraw();
}

function filterFoods(query) {
  if (query.length < 2) return [];
  const q = query.toLowerCase();
  return foods.filter(f => f.naam.toLowerCase().includes(q)).slice(0, 5);
}

function draw() {
  background(CLR_BG);
  drawAppTitle();
  drawSearchLabel();
  drawSuggestions();
  if (showManualEntry) drawManualEntry();
  drawSelectedItem();
  noLoop(); // only redraw on input changes
}

function drawManualEntry() {
  // "Niet gevonden" label
  noStroke();
  fill(CLR_MUTED);
  textSize(13);
  textAlign(CENTER, CENTER);
  text('Niet gevonden — voer handmatig in', CANVAS_W / 2, MANUAL_NOT_FOUND_Y);

  // "Toevoegen" drawn button
  const btnHovered = mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
                     mouseY >= MANUAL_BTN_Y && mouseY <= MANUAL_BTN_Y + MANUAL_BTN_H;
  fill(btnHovered ? '#5A8F67' : CLR_PRIMARY);
  noStroke();
  rect(SUGG_X, MANUAL_BTN_Y, SUGG_W, MANUAL_BTN_H, MANUAL_BTN_R);

  fill(CLR_WHITE);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Toevoegen', SUGG_X + SUGG_W / 2, MANUAL_BTN_Y + MANUAL_BTN_H / 2);
  textStyle(NORMAL);
}

function onManualSubmit() {
  const naam     = manualNameField.value().trim();
  const kcalRaw  = parseInt(manualKcalField.value(), 10);
  if (!naam || isNaN(kcalRaw) || kcalRaw <= 0) return;

  selectedFoodItem = {
    naam:              naam,
    kcal:              kcalRaw,
    portieOmschrijving: 'Handmatig ingevoerd',
    categorie:         'overig'
  };
  clearSearch();
  redraw();
}

function clearSearch() {
  searchQueryText   = '';
  filteredFoodItems = [];
  searchInputField.value('');
  showManualEntry = false;
  manualNameField.hide();
  manualNameField.value('');
  manualKcalField.hide();
  manualKcalField.value('');
}

function drawAppTitle() {
  noStroke();
  fill(CLR_PRIMARY);
  textSize(22);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Calorie Meter', CANVAS_W / 2, 20);
  textStyle(NORMAL);
}

function drawSearchLabel() {
  noStroke();
  fill(CLR_TEXT);
  textSize(13);
  textAlign(LEFT, BASELINE);
  text('Voeg voedsel toe:', 90, 58);
}

function drawSuggestions() {
  if (filteredFoodItems.length === 0) return;

  filteredFoodItems.forEach(function(item, idx) {
    const rowY     = SUGG_Y + idx * (SUGG_H + SUGG_GAP);
    const hovered  = mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
                     mouseY >= rowY   && mouseY <= rowY + SUGG_H;

    // Row background — tint on hover
    fill(hovered ? '#EEF5F0' : CLR_WHITE);
    stroke(CLR_PRIMARY);
    strokeWeight(hovered ? 2 : 1.5);
    rect(SUGG_X, rowY, SUGG_W, SUGG_H, SUGG_R);

    // Item name
    noStroke();
    fill(CLR_TEXT);
    textSize(14);
    textAlign(LEFT, TOP);
    text(item.naam, SUGG_X + 12, rowY + 8);

    // Portion description
    fill(CLR_MUTED);
    textSize(11);
    text(item.portieOmschrijving, SUGG_X + 12, rowY + 26);

    // Calories (right-aligned)
    fill(CLR_ACCENT);
    textSize(13);
    textAlign(RIGHT, TOP);
    text(item.kcal + ' kcal', SUGG_X + SUGG_W - 10, rowY + 16);
  });
}

function drawSelectedItem() {
  if (!selectedFoodItem) return;

  const boxY = SUGG_Y;
  fill(CLR_WHITE);
  stroke(CLR_PRIMARY);
  strokeWeight(2);
  rect(SUGG_X, boxY, SUGG_W, SUGG_H, SUGG_R);

  // Checkmark badge
  fill(CLR_PRIMARY);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text('✓', SUGG_X + 10, boxY + 14);

  // Item name
  fill(CLR_TEXT);
  textSize(14);
  text(selectedFoodItem.naam, SUGG_X + 34, boxY + 8);

  // Calories
  fill(CLR_ACCENT);
  textSize(13);
  textAlign(RIGHT, TOP);
  text(selectedFoodItem.kcal + ' kcal', SUGG_X + SUGG_W - 10, boxY + 16);

  // Portion
  fill(CLR_MUTED);
  textSize(11);
  textAlign(LEFT, TOP);
  text(selectedFoodItem.portieOmschrijving, SUGG_X + 34, boxY + 28);
}

function mouseMoved() {
  if (filteredFoodItems.length > 0 || showManualEntry) redraw();
}

function mousePressed() {
  filteredFoodItems.forEach(function(item, idx) {
    const rowY = SUGG_Y + idx * (SUGG_H + SUGG_GAP);
    if (mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
        mouseY >= rowY   && mouseY <= rowY + SUGG_H) {
      selectedFoodItem = item;
      clearSearch();
      redraw();
    }
  });

  if (showManualEntry &&
      mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
      mouseY >= MANUAL_BTN_Y && mouseY <= MANUAL_BTN_Y + MANUAL_BTN_H) {
    onManualSubmit();
  }
}
