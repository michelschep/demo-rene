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
const SUGG_X    = 90;
const SUGG_Y    = 102;
const SUGG_W    = 300;
const SUGG_H    = 48;
const SUGG_GAP  = 4;
const SUGG_R    = 8;

// Search state
let searchInputField;
let searchQueryText   = '';
let filteredFoodItems = [];
let selectedFoodItem  = null;

function setup() {
  let cnv = createCanvas(CANVAS_W, CANVAS_H);
  cnv.parent(document.body);

  searchInputField = createInput('');
  searchInputField.attribute('placeholder', 'Zoek voedsel… (typ min. 2 tekens)');
  searchInputField.size(300);
  // Position relative to canvas top-left
  searchInputField.position(cnv.position().x + 90, cnv.position().y + 64);
  searchInputField.input(onSearchInput);

  textFont('Nunito');
}

function onSearchInput() {
  searchQueryText   = searchInputField.value().trim();
  filteredFoodItems = filterFoods(searchQueryText);
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
  drawSelectedItem();
  noLoop(); // only redraw on input changes
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
  if (filteredFoodItems.length > 0) redraw();
}

function mousePressed() {
  filteredFoodItems.forEach(function(item, idx) {
    const rowY = SUGG_Y + idx * (SUGG_H + SUGG_GAP);
    if (mouseX >= SUGG_X && mouseX <= SUGG_X + SUGG_W &&
        mouseY >= rowY   && mouseY <= rowY + SUGG_H) {
      selectedFoodItem  = item;
      searchQueryText   = '';
      filteredFoodItems = [];
      searchInputField.value('');
      redraw();
    }
  });
}
