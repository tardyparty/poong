const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
let paddle2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2 };

document.addEventListener('keydown', movePaddles);

function movePaddles(e) {
    const key = e.key;
    if (key === 'ArrowUp' && paddle2.y > 0) {
        paddle2.y -= 20;
    } else if (key === 'ArrowDown' && paddle2.y < canvas.height - paddleHeight) {
        paddle2.y += 20;
    }
    if (key === 'w' && paddle1.y > 0) {
        paddle1.y -= 20;
    } else if (key === 's' && paddle1.y < canvas.height - paddleHeight) {
        paddle1.y += 20;
    }
}

function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(paddle1);
    drawPaddle(paddle2);
    drawBall();
    updateBall();
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ballRadius > canvas.height || ball.y - ballRadius < 0) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (
        (ball.x - ballRadius < paddle1.x + paddleWidth && ball.y > paddle1.y && ball.y < paddle1.y + paddleHeight) ||
        (ball.x + ballRadius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddleHeight)
    ) {
        ball.dx = -ball.dx;
    }

    // Ball out of bounds
    if (ball.x + ballRadius > canvas.width || ball.x - ballRadius < 0) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1);
    }
}

setInterval(draw, 10);
