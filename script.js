const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;
const maxBalls = 10;
const initialBallSpeed = 4;
const paddleSpeed = 30;

let paddle = { x: canvas.width / 2 - paddleWidth / 2, y: canvas.height - paddleHeight - 10 };
let balls = [];
let score = 0;
let gameRunning = false;

document.addEventListener('keydown', handleKeydown);

function handleKeydown(e) {
    const key = e.key;
    if (key === 'ArrowLeft' && paddle.x > 0) {
        paddle.x -= paddleSpeed;
    } else if (key === 'ArrowRight' && paddle.x < canvas.width - paddleWidth) {
        paddle.x += paddleSpeed;
    }

    if (!gameRunning && (key === 'ArrowLeft' || key === 'ArrowRight')) {
        gameRunning = true;
        addBall();
        requestAnimationFrame(gameLoop);
    }
}

function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    balls.forEach(drawBall);
    updateBalls();
    document.getElementById('scoreboard').textContent = `Score: ${score}`;
}

function updateBalls() {
    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top, left, and right walls
        if (ball.y - ballRadius < 0) {
            ball.dy = -ball.dy;
        }
        if (ball.x + ballRadius > canvas.width || ball.x - ballRadius < 0) {
            ball.dx = -ball.dx;
        }

        // Ball collision with paddle
        if (
            ball.y + ballRadius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddleWidth
        ) {
            ball.dy = -ball.dy;
            score++;
            if (score % 3 === 0 && balls.length < maxBalls) {
                addBall();
            }
        }

        // Ball out of bounds (lose condition)
        if (ball.y - ballRadius > canvas.height) {
            endGame();
        }
    });
}

function addBall() {
    balls.push({
        x: canvas.width / 2,
        y: 50,
        dx: initialBallSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: initialBallSpeed * (Math.random() > 0.5 ? 1 : -1)
    });
}

function endGame() {
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2, canvas.height / 2);
    balls = [];
}

function gameLoop() {
    if (gameRunning) {
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Initial draw to display the paddle before game starts
draw();
