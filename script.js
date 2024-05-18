const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

let snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 },
    { x: 100, y: 160 }
];
let dx = 20;
let dy = 0;
let foodX;
let foodY;
let score = 0;
let changingDirection = false;
let gameActive = false;
let gameInterval;
let gameTimeout;

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);

function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 },
        { x: 100, y: 160 }
    ];
    dx = 20;
    dy = 0;
    scoreElement.textContent = score;
    createFood();
    gameInterval = setInterval(main, 100);
    gameTimeout = setTimeout(endGame, 60000); // 60 seconds
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    alert(`Game over! Your score was: ${score}`);
}

function main() {
    if (hasGameEnded()) {
        endGame();
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = "#aad751";
    ctx.strokestyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'blue';
    ctx.strokestyle = 'darkblue';
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        score += 1;
        scoreElement.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - 20)) / 20) * 20;
    foodY = Math.round((Math.random() * (canvas.height - 20)) / 20) * 20;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}
