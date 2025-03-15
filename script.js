const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройки размеров холста
canvas.width = 400;
canvas.height = 600;

// Платформа
const paddle = {
    width: 80,
    height: 15,
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    dx: 5,
};

// Мяч
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 3,
    dy: -3,
};

// Блоки
const blockRows = 5;
const blockCols = 8;
const blockWidth = 45;
const blockHeight = 20;
const blockPadding = 10;
const blocks = [];

for (let row = 0; row < blockRows; row++) {
    for (let col = 0; col < blockCols; col++) {
        blocks.push({
            x: col * (blockWidth + blockPadding) + 35,
            y: row * (blockHeight + blockPadding) + 30,
            width: blockWidth,
            height: blockHeight,
            visible: true,
        });
    }
}

// Управление платформой
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && paddle.x + paddle.width < canvas.width) {
        paddle.x += paddle.dx;
    } else if (e.key === 'ArrowLeft' && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
});

// Отрисовка платформы
function drawPaddle() {
    ctx.fillStyle = '#00f';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Отрисовка мяча
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f00';
    ctx.fill();
    ctx.closePath();
}

// Отрисовка блоков
function drawBlocks() {
    blocks.forEach((block) => {
        if (block.visible) {
            ctx.fillStyle = '#0f0';
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    });
}

// Обновление мяча
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Отскок от стен
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Отскок от платформы
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y
    ) {
        ball.dy *= -1;
    }

    // Столкновение с блоками
    blocks.forEach((block) => {
        if (block.visible) {
            if (
                ball.x > block.x &&
                ball.x < block.x + block.width &&
                ball.y > block.y &&
                ball.y < block.y + block.height
            ) {
                ball.dy *= -1;
                block.visible = false;
            }
        }
    });

    // Проигрыш
    if (ball.y + ball.radius > canvas.height) {
        alert('Игра окончена!');
        document.location.reload();
    }
}

// Основной игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawBall();
    drawBlocks();
    updateBall();

    requestAnimationFrame(gameLoop);
}

gameLoop();
