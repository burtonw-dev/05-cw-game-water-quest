// Game configuration and state variables
const GOAL_CANS = 20;
const GAME_DURATION = 30;
const WINNING_MESSAGES = [
  'You win! Great job collecting water cans!',
  'Amazing work! You reached the goal!',
  'Great job! You collected enough cans!'
];
const LOSING_MESSAGES = [
  'Try again! You can do it!',
  'Not quite! Give it another try!',
  'Keep going! You can reach the goal next time!'
];
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;
const scoreDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const resultsDialog = document.getElementById('results-dialog');
const resultsTitle = document.getElementById('results-title');
const resultsMessage = document.getElementById('results-message');
const resultsScore = document.getElementById('results-score');
const startButton = document.getElementById('start-game');

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}


function startGame() {
  if (gameActive) return;
  gameActive = true;
  startButton.textContent = 'Start Game';
  currentCans = 0;
  let timeLeft = GAME_DURATION;
  scoreDisplay.textContent = currentCans;
  timerDisplay.textContent = timeLeft;
  createGrid();
  spawnInterval = setInterval(spawnWaterCan, 1000);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval); 
  const playerWon = currentCans >= GOAL_CANS;
  const messages = playerWon ? WINNING_MESSAGES : LOSING_MESSAGES;
  resultsTitle.textContent = playerWon ? 'You did it!' : "Time's up!";
  resultsMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
  resultsScore.textContent = currentCans;
  startButton.textContent = 'Play Again';
  resultsDialog.showModal();
}


startButton.addEventListener('click', startGame);
document.getElementById('close-results').addEventListener('click', () => {
  resultsDialog.close();
});

document.querySelector('.game-grid').addEventListener('click', (event) => {
  if (!gameActive || !(event.target instanceof Element)) return;

  const cell = event.target.closest('.grid-cell');
  if (!cell) return;

  const waterCan = event.target.closest('.water-can');
  if (waterCan && cell.contains(waterCan)) {
    currentCans += 1;
    waterCan.remove();
  } else {
    currentCans = Math.max(0, currentCans - 1);
  }
  scoreDisplay.textContent = currentCans;
});
