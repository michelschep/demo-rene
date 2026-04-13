// Calorie Meter — p5.js sketch
// Healthy House palette
const CLR_BG      = '#F7F3EE';
const CLR_PRIMARY = '#6B9E78';
const CLR_AMBER   = '#E8A838';
const CLR_ACCENT  = '#C97B4B';
const CLR_TEXT    = '#2C2C2C';
const CLR_WHITE   = '#FFFFFF';
const CLR_MUTED   = '#888888';

const CANVAS_W = 480;
const CANVAS_H = 800;

// Progress ring layout constants
const RING_CX = CANVAS_W / 2;  // 240
const RING_CY = 300;
const RING_R  = 65;
const RING_SW = 16;

// Meal distribution bar (below the ring)
const MEAL_BAR_X = 90;
const MEAL_BAR_Y = RING_CY + RING_R + RING_SW / 2 + 16;  // 389
const MEAL_BAR_W = 300;
const MEAL_BAR_H = 14;
const MEAL_BAR_R = 7;

const CAT_COLORS = {
  'Ontbijt': '#E8A838',
  'Lunch':   '#6B9E78',
  'Diner':   '#C97B4B',
  'Snack':   '#A8C5B0'
};

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
const LOG_CAT_H    = 22;
const LOG_CAT_GAP  = 4;

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

// Settings overlay layout constants
const SETTINGS_ICON_X  = CANVAS_W - 40;
const SETTINGS_ICON_Y  = 10;
const SETTINGS_ICON_W  = 30;
const SETTINGS_ICON_H  = 30;
const SETTINGS_PANEL_W = 280;
const SETTINGS_PANEL_H = 180;
const SETTINGS_PANEL_X = (CANVAS_W - SETTINGS_PANEL_W) / 2;   // 100
const SETTINGS_PANEL_Y = (CANVAS_H - SETTINGS_PANEL_H) / 2;   // 310
const SETTINGS_INPUT_W = 120;
const SETTINGS_INPUT_X = SETTINGS_PANEL_X + (SETTINGS_PANEL_W - SETTINGS_INPUT_W) / 2;  // 180
const SETTINGS_INPUT_Y = SETTINGS_PANEL_Y + 80;
const SETTINGS_SAVE_X  = SETTINGS_PANEL_X + 20;
const SETTINGS_SAVE_W  = SETTINGS_PANEL_W - 40;
const SETTINGS_SAVE_Y  = SETTINGS_PANEL_Y + 124;
const SETTINGS_SAVE_H  = 36;

// Search state
let canvasPos;
let searchInputField;
let searchQueryText   = '';
let filteredFoodItems = [];
let selectedFoodItem  = null;

// Log state
let dagLog = [];
let selectedMealCategory = 'Snack';

// Settings state
let dagDoel = 2000;

// Progress ring animation state
let ringAnim = 0;

// Settings overlay state
let showSettingsOverlay = false;
let settingsGoalField;

function saveSettings() {
  localStorage.setItem('cm_settings', JSON.stringify({ dagDoel: dagDoel }));
}

function loadSettings() {
  const stored = localStorage.getItem('cm_settings');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.dagDoel && parsed.dagDoel > 0) dagDoel = parsed.dagDoel;
  }
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `cm_log_${yyyy}-${mm}-${dd}`;
}

function saveLog() {
  localStorage.setItem(todayKey(), JSON.stringify(dagLog));
}

function loadLog() {
  const stored = localStorage.getItem(todayKey());
  dagLog = stored ? JSON.parse(stored) : [];
}

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

  settingsGoalField = createInput('');
  settingsGoalField.attribute('type', 'number');
  settingsGoalField.attribute('min', '100');
  settingsGoalField.attribute('max', '9999');
  settingsGoalField.size(SETTINGS_INPUT_W);
  settingsGoalField.position(canvasPos.x + SETTINGS_INPUT_X, canvasPos.y + SETTINGS_INPUT_Y);
  settingsGoalField.hide();

  textFont('Nunito');
  loadSettings();
  loadLog();
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

  // Animate ring toward current progress; keep looping until settled
  const totalKcal = dagLog.reduce(function(sum, e) { return sum + e.kcal; }, 0);
  const ringTarget = min(totalKcal / dagDoel, 1.0);
  if (abs(ringTarget - ringAnim) > 0.002) {
    ringAnim = lerp(ringAnim, ringTarget, 0.12);
  } else {
    ringAnim = ringTarget;
    noLoop();
  }
  drawProgressRing(totalKcal);
  drawMealDistributionBar();
  drawMotivationalMessage(totalKcal);

  drawSuggestions();
  if (showManualEntry) drawManualEntry();
  drawSelectedItem();
  if (selectedFoodItem) drawCategorySelector();
  drawDagLog();
  drawSettingsIcon();
  if (showSettingsOverlay) drawSettingsOverlay();
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

function getMotivationalMessage(pct) {
  if (pct >= 0.4 && pct < 0.7)    return 'Lekker bezig! 💚';
  if (pct >= 0.95 && pct <= 1.05) return 'Perfect in balans! 🎯 Goed gedaan.';
  if (pct > 1.10)                  return 'Vandaag wat extra energie 😊 Morgen weer een nieuwe kans.';
  return '';
}

function drawMotivationalMessage(totalKcal) {
  if (dagLog.length === 0) return;
  const msg = getMotivationalMessage(totalKcal / dagDoel);
  if (!msg) return;

  noStroke();
  fill(CLR_TEXT);
  textSize(11);
  textAlign(CENTER, CENTER);
  text(msg, CANVAS_W / 2, MEAL_BAR_Y + MEAL_BAR_H + 11);
}

function drawMealDistributionBar() {
  if (dagLog.length === 0) return;

  const totalKcal = dagLog.reduce(function(s, e) { return s + e.kcal; }, 0);
  if (totalKcal === 0) return;

  const kcalByCat = {};
  CATEGORIES.forEach(function(cat) { kcalByCat[cat] = 0; });
  dagLog.forEach(function(e) { kcalByCat[e.categorie] = (kcalByCat[e.categorie] || 0) + e.kcal; });

  // Background track
  noStroke();
  fill(220, 220, 210);
  rect(MEAL_BAR_X, MEAL_BAR_Y, MEAL_BAR_W, MEAL_BAR_H, MEAL_BAR_R);

  // Clip to rounded bar shape, then draw proportional segments
  drawingContext.save();
  drawingContext.beginPath();
  const r = MEAL_BAR_R, x = MEAL_BAR_X, y = MEAL_BAR_Y, w = MEAL_BAR_W, h = MEAL_BAR_H;
  drawingContext.moveTo(x + r, y);
  drawingContext.lineTo(x + w - r, y);
  drawingContext.arcTo(x + w, y, x + w, y + r, r);
  drawingContext.lineTo(x + w, y + h - r);
  drawingContext.arcTo(x + w, y + h, x + w - r, y + h, r);
  drawingContext.lineTo(x + r, y + h);
  drawingContext.arcTo(x, y + h, x, y + h - r, r);
  drawingContext.lineTo(x, y + r);
  drawingContext.arcTo(x, y, x + r, y, r);
  drawingContext.closePath();
  drawingContext.clip();

  let curX = MEAL_BAR_X;
  CATEGORIES.forEach(function(cat) {
    const kcal = kcalByCat[cat] || 0;
    if (kcal > 0) {
      const segW = (kcal / totalKcal) * MEAL_BAR_W;
      fill(CAT_COLORS[cat]);
      noStroke();
      rect(curX, MEAL_BAR_Y, segW, MEAL_BAR_H);
      curX += segW;
    }
  });

  drawingContext.restore();
}

function drawProgressRing(totalKcal) {
  // Background track (full circle)
  noFill();
  stroke(220, 220, 210);
  strokeWeight(RING_SW);
  strokeCap(ROUND);
  ellipse(RING_CX, RING_CY, RING_R * 2, RING_R * 2);

  // Animated progress arc — colour codes by progress zone
  if (ringAnim > 0.001) {
    let ringClr;
    if (ringAnim < 0.7) {
      ringClr = CLR_PRIMARY;   // green  0–70 %
    } else if (ringAnim < 0.9) {
      ringClr = CLR_AMBER;     // amber 70–90 %
    } else {
      ringClr = CLR_ACCENT;    // terracotta 90 %+
    }
    stroke(ringClr);
    const sweepAngle = ringAnim * TWO_PI;
    arc(RING_CX, RING_CY, RING_R * 2, RING_R * 2, -HALF_PI, -HALF_PI + sweepAngle);
  }

  noStroke();

  // "X / Y" centred in ring
  fill(CLR_TEXT);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(totalKcal + ' / ' + dagDoel, RING_CX, RING_CY - 8);
  textStyle(NORMAL);

  fill(CLR_MUTED);
  textSize(11);
  text('kcal', RING_CX, RING_CY + 10);
}

function openSettingsOverlay() {
  showSettingsOverlay = true;
  settingsGoalField.value(String(dagDoel));
  settingsGoalField.show();
  loop();
}

function closeSettingsOverlay() {
  showSettingsOverlay = false;
  settingsGoalField.hide();
  redraw();
}

function drawSettingsIcon() {
  const hovered = mouseX >= SETTINGS_ICON_X && mouseX <= SETTINGS_ICON_X + SETTINGS_ICON_W &&
                  mouseY >= SETTINGS_ICON_Y && mouseY <= SETTINGS_ICON_Y + SETTINGS_ICON_H;
  noStroke();
  fill(hovered ? CLR_PRIMARY : CLR_MUTED);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('⚙', SETTINGS_ICON_X + SETTINGS_ICON_W / 2, SETTINGS_ICON_Y + SETTINGS_ICON_H / 2);
}

function drawSettingsOverlay() {
  // Dim background
  noStroke();
  fill(0, 0, 0, 140);
  rect(0, 0, CANVAS_W, CANVAS_H);

  // Panel
  fill(CLR_WHITE);
  stroke(220, 220, 210);
  strokeWeight(1);
  rect(SETTINGS_PANEL_X, SETTINGS_PANEL_Y, SETTINGS_PANEL_W, SETTINGS_PANEL_H, 12);

  // Title
  noStroke();
  fill(CLR_TEXT);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Dagdoel instellen', CANVAS_W / 2, SETTINGS_PANEL_Y + 18);
  textStyle(NORMAL);

  // Label above input
  fill(CLR_MUTED);
  textSize(12);
  textAlign(CENTER, TOP);
  text('Dagelijks caloriedoel (kcal)', CANVAS_W / 2, SETTINGS_PANEL_Y + 54);

  // Opslaan button
  const saveBtnHovered = mouseX >= SETTINGS_SAVE_X && mouseX <= SETTINGS_SAVE_X + SETTINGS_SAVE_W &&
                         mouseY >= SETTINGS_SAVE_Y && mouseY <= SETTINGS_SAVE_Y + SETTINGS_SAVE_H;
  fill(saveBtnHovered ? '#5A8F67' : CLR_PRIMARY);
  noStroke();
  rect(SETTINGS_SAVE_X, SETTINGS_SAVE_Y, SETTINGS_SAVE_W, SETTINGS_SAVE_H, 8);

  fill(CLR_WHITE);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Opslaan', CANVAS_W / 2, SETTINGS_SAVE_Y + SETTINGS_SAVE_H / 2);
  textStyle(NORMAL);
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

// Returns flat array of layout rows for the grouped log.
// Each row: { type: 'header', cat, y }  or  { type: 'item', entry, idx, y }
function buildLogLayout() {
  const rows = [];
  let curY = LOG_START_Y + 20; // space below the "Daglog" heading

  CATEGORIES.forEach(function(cat) {
    const catItems = [];
    dagLog.forEach(function(entry, i) {
      if (entry.categorie === cat) catItems.push({ entry: entry, idx: i });
    });
    if (catItems.length === 0) return;

    rows.push({ type: 'header', cat: cat, y: curY });
    curY += LOG_CAT_H + LOG_CAT_GAP;

    catItems.forEach(function(x) {
      rows.push({ type: 'item', entry: x.entry, idx: x.idx, y: curY });
      curY += LOG_ITEM_H + LOG_ITEM_GAP;
    });

    curY += 4; // extra gap between category groups
  });

  return rows;
}

function logItemDeleteBounds(logIdx) {
  const row = buildLogLayout().find(function(r) { return r.type === 'item' && r.idx === logIdx; });
  if (!row) return { x: -9999, y: -9999, w: 0, h: 0 };
  return {
    x: SUGG_X + SUGG_W - DEL_BTN_MARGIN - DEL_BTN_SIZE,
    y: row.y + (LOG_ITEM_H - DEL_BTN_SIZE) / 2,
    w: DEL_BTN_SIZE,
    h: DEL_BTN_SIZE
  };
}

function removeFromLog(idx) {
  dagLog.splice(idx, 1);
  saveLog();
}

function addToLog(item) {
  dagLog.push({
    naam:      item.naam,
    kcal:      item.kcal,
    categorie: selectedMealCategory,
    timestamp: new Date().toISOString()
  });
  selectedMealCategory = 'Snack';
  saveLog();
}

function drawDagLog() {
  noStroke();
  fill(CLR_TEXT);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, BASELINE);
  text('Daglog', SUGG_X, LOG_START_Y);
  textStyle(NORMAL);

  if (dagLog.length === 0) {
    fill(CLR_MUTED);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Begin de dag goed — voeg je eerste maaltijd toe! 🌱', CANVAS_W / 2, LOG_START_Y + 30);
    return;
  }

  buildLogLayout().forEach(function(row) {
    if (row.type === 'header') {
      // Category header with colour dot
      noStroke();
      fill(CAT_COLORS[row.cat] || CLR_MUTED);
      ellipse(SUGG_X + 7, row.y + LOG_CAT_H / 2, 8, 8);

      fill(CLR_TEXT);
      textSize(12);
      textStyle(BOLD);
      textAlign(LEFT, CENTER);
      text(row.cat, SUGG_X + 18, row.y + LOG_CAT_H / 2);
      textStyle(NORMAL);

    } else { // item
      const entry = row.entry;
      const itemY = row.y;

      fill(CLR_WHITE);
      stroke(204, 204, 204);
      strokeWeight(1);
      rect(SUGG_X, itemY, SUGG_W, LOG_ITEM_H, 8);

      noStroke();
      fill(CLR_TEXT);
      textSize(13);
      textAlign(LEFT, CENTER);
      text(entry.naam, SUGG_X + 12, itemY + LOG_ITEM_H / 2);

      fill(CLR_ACCENT);
      textSize(13);
      textAlign(RIGHT, CENTER);
      text(entry.kcal + ' kcal', SUGG_X + SUGG_W - DEL_BTN_SIZE - DEL_BTN_MARGIN - 6, itemY + LOG_ITEM_H / 2);

      const db     = logItemDeleteBounds(row.idx);
      const delHov = mouseX >= db.x && mouseX <= db.x + db.w &&
                     mouseY >= db.y && mouseY <= db.y + db.h;
      noStroke();
      fill(delHov ? '#D94F3B' : CLR_MUTED);
      textSize(16);
      textAlign(CENTER, CENTER);
      text('✕', db.x + db.w / 2, db.y + db.h / 2);
    }
  });
}

function mouseMoved() {
  if (filteredFoodItems.length > 0 || showManualEntry || selectedFoodItem) redraw();
  if (dagLog.length > 0) redraw();
  if (showSettingsOverlay) redraw();
  if (mouseX >= SETTINGS_ICON_X && mouseX <= SETTINGS_ICON_X + SETTINGS_ICON_W &&
      mouseY >= SETTINGS_ICON_Y && mouseY <= SETTINGS_ICON_Y + SETTINGS_ICON_H) redraw();
}

function mousePressed() {
  // Settings icon — open overlay
  if (!showSettingsOverlay &&
      mouseX >= SETTINGS_ICON_X && mouseX <= SETTINGS_ICON_X + SETTINGS_ICON_W &&
      mouseY >= SETTINGS_ICON_Y && mouseY <= SETTINGS_ICON_Y + SETTINGS_ICON_H) {
    openSettingsOverlay();
    return;
  }

  // Settings overlay interactions
  if (showSettingsOverlay) {
    // Opslaan button (save logic in task 7.2 — for now just close)
    if (mouseX >= SETTINGS_SAVE_X && mouseX <= SETTINGS_SAVE_X + SETTINGS_SAVE_W &&
        mouseY >= SETTINGS_SAVE_Y && mouseY <= SETTINGS_SAVE_Y + SETTINGS_SAVE_H) {
      closeSettingsOverlay();
      return;
    }
    // Click outside panel closes overlay
    if (mouseX < SETTINGS_PANEL_X || mouseX > SETTINGS_PANEL_X + SETTINGS_PANEL_W ||
        mouseY < SETTINGS_PANEL_Y || mouseY > SETTINGS_PANEL_Y + SETTINGS_PANEL_H) {
      closeSettingsOverlay();
      return;
    }
    return; // Swallow all other overlay clicks
  }

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
    loop(); // triggers ring animation
  }

  // Delete log item via ✕ button
  for (let i = 0; i < dagLog.length; i++) {
    const db = logItemDeleteBounds(i);
    if (mouseX >= db.x && mouseX <= db.x + db.w &&
        mouseY >= db.y && mouseY <= db.y + db.h) {
      removeFromLog(i);
      loop(); // triggers ring animation
      return;
    }
  }
}
