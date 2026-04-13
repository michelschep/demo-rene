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

// Search state
let searchInputField;
let searchQueryText   = '';
let filteredFoodItems = [];

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

  const startX  = 90;
  const startY  = 102;
  const itemH   = 48;
  const itemW   = 300;
  const radius  = 8;

  filteredFoodItems.forEach(function(item, idx) {
    const rowY = startY + idx * (itemH + 4);

    // Row background
    fill(CLR_WHITE);
    stroke(CLR_PRIMARY);
    strokeWeight(1.5);
    rect(startX, rowY, itemW, itemH, radius);

    // Item name
    noStroke();
    fill(CLR_TEXT);
    textSize(14);
    textAlign(LEFT, TOP);
    text(item.naam, startX + 12, rowY + 8);

    // Portion description
    fill(CLR_MUTED);
    textSize(11);
    text(item.portieOmschrijving, startX + 12, rowY + 26);

    // Calories (right-aligned)
    fill(CLR_ACCENT);
    textSize(13);
    textAlign(RIGHT, TOP);
    text(item.kcal + ' kcal', startX + itemW - 10, rowY + 16);
  });
}
