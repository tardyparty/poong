const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;
const maxBalls = 10;

let paddle = { x: canvas.width / 2 - paddleWidth / 2, y: canvas.height - paddleHeight - 10 };
let balls = [{ x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2 }];
let score = 0;

document.addEventListener('keydown', movePaddle);

function movePaddle(e) {
    const key = e.key;
    if (key === 'ArrowLeft' && paddle.x > 0) {
        paddle.x -= 20;
    } else if (key === 'ArrowRight' && paddle.x < canvas.width - paddleWidth) {
        paddle.x += 20;
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
            if (score % 5 === 0 && balls.length < maxBalls) {
                addBall();
            }
        }

        // Ball out of bounds (lose condition)
        if (ball.y - ballRadius > canvas.height) {
            alert('Game Over! Your score is ' + score);
            document.location.reload();
        }
    });
}

function addBall() {
    balls.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 2 * (Math.random() > 0.5 ? 1 : -1),
        dy: 2 * (Math.random() > 0.5 ? 1 : -1)
    });
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
