const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 25;
const canvasSize = 500;
let snake = [{x: 250, y: 250}];
let direction = "RIGHT";
let food = generateFoodPosition();

const snakeHeadImage = new Image();
snakeHeadImage.src = 'images/head.png';
const snakeBodyImage = new Image();
snakeBodyImage.src = 'images/snake.png';
const foodImage = new Image();
foodImage.src = 'images/food.png';

Promise.all([
    new Promise(resolve => snakeHeadImage.onload = resolve),
    new Promise(resolve => snakeBodyImage.onload = resolve),
    new Promise(resolve => foodImage.onload = resolve)
]).then(() => {
    console.log('All images loaded successfully.');
    startGame();
});

let gameSpeed = 120;
let gameInterval;
let isSpacePressed = false;

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.save();
            ctx.translate(segment.x + box / 2, segment.y + box / 2);
            if (direction === "LEFT") ctx.rotate(Math.PI / 2);
            if (direction === "UP") ctx.rotate(Math.PI);
            if (direction === "RIGHT") ctx.rotate(-Math.PI / 2);
            ctx.drawImage(snakeHeadImage, -box / 2, -box / 2, box, box);
            ctx.restore();
        } else {
            ctx.drawImage(snakeBodyImage, segment.x, segment.y, box, box);
        }
    });
}

function drawFood() {
    ctx.drawImage(foodImage, food.x, food.y, box, box);
}

function generateFoodPosition() {
    let newFoodPosition;
    let isOnSnake;

    do {
        isOnSnake = false;
        newFoodPosition = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };

        snake.forEach(segment => {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                isOnSnake = true;
            }
        });
    } while (isOnSnake);

    return newFoodPosition;
}

function moveSnake() {
    let head = {x: snake[0].x, y: snake[0].y};

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFoodPosition();
    } else {
        snake.pop();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnake();
    drawSnake();
    drawFood();

    if (snake[0].x < 0 || snake[0].x >= canvasSize || snake[0].y < 0 || snake[0].y >= canvasSize) {
        clearInterval(gameInterval);
        alert('Game Over');
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            clearInterval(gameInterval);
            alert('Game Over');
            return;
        }
    }
}

function startGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function resetGame() {
    snake = [{x: 200, y: 200}];
    direction = "RIGHT";
    food = generateFoodPosition();
    isSpacePressed = false;
    gameSpeed = 120;
    startGame();
}

document.addEventListener('keydown', event => {
    if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "w" && direction !== "DOWN") direction = "UP";
    if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "s" && direction !== "UP") direction = "DOWN";

    if (event.key === " " && !isSpacePressed) {
        isSpacePressed = true;
        gameSpeed = 50;
        startGame();
    }
    if (event.key.toLowerCase() === "r") {
        resetGame();
    }
});

document.addEventListener('keyup', event => {
    if (event.key === " " && isSpacePressed) {
        isSpacePressed = false;
        gameSpeed = 120;
        startGame();
    }
});

startGame();
