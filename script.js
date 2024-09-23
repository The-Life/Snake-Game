const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
canvas.height = canvas.width;

const box = canvas.width / 20; // Size of snake segments
let snake = [{ x: box * 5, y: box * 5 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;

// Listen for keyboard events
document.addEventListener("keydown", changeDirection);

// Swipe controls for mobile
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

// Draw the snake and food
function drawSnakePart(snakePart) {
    ctx.fillStyle = "#ffeb3b"; // Yellow snake body
    ctx.strokeStyle = "#00796b"; // Border color
    ctx.beginPath();
    ctx.arc(snakePart.x + box / 2, snakePart.y + box / 2, box / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawFood() {
    ctx.fillStyle = "#ff5722"; // Food color
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
    ctx.fill();
}

// Change direction based on key input
function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (keyPressed === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (keyPressed === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (keyPressed === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

// Handle touch events (swipes) for mobile
let x1 = null;
let y1 = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!x1 || !y1) return;

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

// Move the snake
function moveSnake() {
    let newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "RIGHT") newHead.x += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;

    snake.unshift(newHead);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop();
    }
}

// Check for collision with walls or itself
function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
    ) {
        return true;
    }

    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Reset the game
function resetGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    direction = "RIGHT";
    score = 0;
}

// Game loop
function gameLoop() {
    if (checkCollision()) {
        resetGame();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    snake.forEach(drawSnakePart);
    moveSnake();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
