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

// Meal category selector (shown below selected item)
const CATEGORIES    = ['Ontbijt', 'Lunch', 'Diner', 'Snack'];
const CAT_BTN_Y     = SUGG_Y + SUGG_H + 8;   // 158
const CAT_BTN_H     = 34;
const CAT_BTN_GAP   = 4;
const CAT_BTN_W     = (SUGG_W - (CATEGORIES.length - 1) * CAT_BTN_GAP) / CATEGORIES.length; // 72

// Log button (shown below category selector)
const LOG_BTN_Y = CAT_BTN_Y + CAT_BTN_H + 8;  // 200
const LOG_BTN_H = 40;
const LOG_BTN_R = 8;

// Log list layout
const LOG_START_Y  = 420;
const LOG_ITEM_H   = 44;
const LOG_ITEM_GAP = 4;

// Delete button (✕) inside each log item
const DEL_BTN_SIZE = 24;  // hit area width & height
const DEL_BTN_MARGIN = 8; // from right edge of item row

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

// Log state
let dagLog = [];
let selectedMealCategory = 'Snack';

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

  // Clear any active selection when user starts a new search
  selectedFoodItem     = null;
  selectedMealCategory = 'Snack';

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
  if (selectedFoodItem) drawCategorySelector();
  drawDagLog();
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

function drawCategorySelector() {
  CATEGORIES.forEach(function(cat, idx) {
    const btnX    = SUGG_X + idx * (CAT_BTN_W + CAT_BTN_GAP);
    const active  = cat === selectedMealCategory;
    const hovered = !active &&
                    mouseX >= btnX && mouseX <= btnX + CAT_BTN_W &&
                    mouseY >= CAT_BTN_Y && mouseY <= CAT_BTN_Y + CAT_BTN_H;

    if (active) {
      fill(CLR_PRIMARY);
      noStroke();
    } else {
      fill(hovered ? '#EEF5F0' : CLR_WHITE);
      stroke(CLR_PRIMARY);
      strokeWeight(1.5);
    }
    rect(btnX, CAT_BTN_Y, CAT_BTN_W, CAT_BTN_H, 6);

    noStroke();
    fill(active ? CLR_WHITE : CLR_TEXT);
    textSize(12);
    textStyle(active ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    text(cat, btnX + CAT_BTN_W / 2, CAT_BTN_Y + CAT_BTN_H / 2);
    textStyle(NORMAL);
  });
}

function onManualSubmit() {
  const naam     = manualNameField.value().trim();
  const kcalRaw  = parseInt(manualKcalField.value(), 10);
  if (!naam || isNaN(kcalRaw) || kcalRaw <= 0) return;

  selectedFoodItem     = {
    naam:              naam,
    kcal:              kcalRaw,
    portieOmschrijving: 'Handmatig ingevoerd',
    categorie:         'overig'
  };
  selectedMealCategory = 'Snack';
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

  // "Toevoegen aan log" button
  const btnHovered = mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
                     mouseY >= LOG_BTN_Y && mouseY <= LOG_BTN_Y + LOG_BTN_H;
  fill(btnHovered ? '#5A8F67' : CLR_PRIMARY);
  noStroke();
  rect(SUGG_X, LOG_BTN_Y, SUGG_W, LOG_BTN_H, LOG_BTN_R);

  fill(CLR_WHITE);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Toevoegen aan log', SUGG_X + SUGG_W / 2, LOG_BTN_Y + LOG_BTN_H / 2);
  textStyle(NORMAL);
}

function logItemDeleteBounds(idx) {
  const itemY = LOG_START_Y + 12 + idx * (LOG_ITEM_H + LOG_ITEM_GAP);
  const btnX  = SUGG_X + SUGG_W - DEL_BTN_MARGIN - DEL_BTN_SIZE;
  const btnY  = itemY + (LOG_ITEM_H - DEL_BTN_SIZE) / 2;
  return { x: btnX, y: btnY, w: DEL_BTN_SIZE, h: DEL_BTN_SIZE };
}

function removeFromLog(idx) {
  dagLog.splice(idx, 1);
}

function addToLog(item) {
  dagLog.push({
    naam:      item.naam,
    kcal:      item.kcal,
    categorie: selectedMealCategory,
    timestamp: new Date().toISOString()
  });
  selectedMealCategory = 'Snack';
}

function drawDagLog() {
  if (dagLog.length === 0) return;

  noStroke();
  fill(CLR_TEXT);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, BASELINE);
  text('Daglog', SUGG_X, LOG_START_Y);
  textStyle(NORMAL);

  dagLog.forEach(function(entry, idx) {
    const itemY = LOG_START_Y + 12 + idx * (LOG_ITEM_H + LOG_ITEM_GAP);

    fill(CLR_WHITE);
    stroke(204, 204, 204);
    strokeWeight(1);
    rect(SUGG_X, itemY, SUGG_W, LOG_ITEM_H, 8);

    noStroke();
    fill(CLR_TEXT);
    textSize(13);
    textAlign(LEFT, TOP);
    text(entry.naam, SUGG_X + 12, itemY + 8);

    fill(CLR_MUTED);
    textSize(11);
    text(entry.categorie, SUGG_X + 12, itemY + 26);

    fill(CLR_ACCENT);
    textSize(13);
    textAlign(RIGHT, TOP);
    text(entry.kcal + ' kcal', SUGG_X + SUGG_W - DEL_BTN_SIZE - DEL_BTN_MARGIN - 6, itemY + 16);

    // ✕ delete button
    const db      = logItemDeleteBounds(idx);
    const delHov  = mouseX >= db.x && mouseX <= db.x + db.w &&
                    mouseY >= db.y && mouseY <= db.y + db.h;
    noStroke();
    fill(delHov ? '#D94F3B' : CLR_MUTED);
    textSize(16);
    textAlign(CENTER, CENTER);
    text('✕', db.x + db.w / 2, db.y + db.h / 2);
  });
}

function mouseMoved() {
  if (filteredFoodItems.length > 0 || showManualEntry || selectedFoodItem) redraw();
  if (dagLog.length > 0) redraw();
}

function mousePressed() {
  filteredFoodItems.forEach(function(item, idx) {
    const rowY = SUGG_Y + idx * (SUGG_H + SUGG_GAP);
    if (mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
        mouseY >= rowY   && mouseY <= rowY + SUGG_H) {
      selectedFoodItem     = item;
      selectedMealCategory = 'Snack';
      clearSearch();
      redraw();
    }
  });

  if (showManualEntry &&
      mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
      mouseY >= MANUAL_BTN_Y && mouseY <= MANUAL_BTN_Y + MANUAL_BTN_H) {
    onManualSubmit();
  }

  // Category selector clicks
  if (selectedFoodItem && mouseY >= CAT_BTN_Y && mouseY <= CAT_BTN_Y + CAT_BTN_H) {
    CATEGORIES.forEach(function(cat, idx) {
      const btnX = SUGG_X + idx * (CAT_BTN_W + CAT_BTN_GAP);
      if (mouseX >= btnX && mouseX <= btnX + CAT_BTN_W) {
        selectedMealCategory = cat;
        redraw();
      }
    });
  }

  if (selectedFoodItem &&
      mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
      mouseY >= LOG_BTN_Y && mouseY <= LOG_BTN_Y + LOG_BTN_H) {
    addToLog(selectedFoodItem);
    selectedFoodItem = null;
    redraw();
  }

  // Delete log item via ✕ button
  for (let i = 0; i < dagLog.length; i++) {
    const db = logItemDeleteBounds(i);
    if (mouseX >= db.x && mouseX <= db.x + db.w &&
        mouseY >= db.y && mouseY <= db.y + db.h) {
      removeFromLog(i);
      redraw();
      return;
    }
  }
}
