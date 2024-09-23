const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
canvas.height = canvas.width;

const box = canvas.width / 20; // Size of snake segments
let snake = [{ x: box * 5, y: box * 5 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;

// Draw cute snake part
function drawSnakePart(snakePart) {
  ctx.fillStyle = "#ffeb3b";
  ctx.strokeStyle = "#00796b";
  ctx.beginPath();
  ctx.arc(snakePart.x + box / 2, snakePart.y + box / 2, box / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

// Draw food
function drawFood() {
  ctx.fillStyle = "#ff5722";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
  ctx.fill();
}

// Control snake direction using swipes (for mobile)
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let x1 = null;
let y1 = null;

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  x1 = firstTouch.clientX;
  y1 = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!x1 || !y1) {
    return;
  }

  let x2 = evt.touches[0].clientX;
  let y2 = evt.touches[0].clientY;

  let xDiff = x2 - x1;
  let yDiff = y2 - y1;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (xDiff < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (yDiff > 0 && direction !== "UP") direction = "DOWN";
    else if (yDiff < 0 && direction !== "DOWN") direction = "UP";
  }

  x1 = null;
  y1 = null;
}

// Game Loop
function gameLoop() {
  if (checkCollision(snake[0], snake)) return resetGame();

  moveSnake();
  if (snake[0].x === food.x && snake[0].y === food.y) {
    score++;
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
  } else {
    snake.pop();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  snake.forEach(drawSnakePart);

  requestAnimationFrame(gameLoop);
}

// Move snake
function moveSnake() {
  let newHead = { x: snake[0].x, y: snake[0].y };

  if (direction === "RIGHT") newHead.x += box;
  if (direction === "LEFT") newHead.x -= box;
  if (direction === "UP") newHead.y -= box;
  if (direction === "DOWN") newHead.y += box;

  snake.unshift(newHead);
}

// Check collision
function checkCollision(head, body) {
  for (let i = 1; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) return true;
  }
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) return true;
  return false;
}

// Reset Game
function resetGame() {
  snake = [{ x: box * 5, y: box * 5 }];
  direction = "RIGHT";
  score = 0;
}

// Start the game
gameLoop();
