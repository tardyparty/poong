const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;
const maxBalls = 10;
const initialBallSpeed = 4;
const aiSpeed = 5; // AI paddle movement speed

let paddle = { x: canvas.width / 2 - paddleWidth / 2, y: canvas.height - paddleHeight - 10 };
let balls = [];
let score = 0;
let highScore = 0;
let gameRunning = false;
let isAITurn = false;

canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mousedown', startGame);

function handleMouseMove(e) {
    if (gameRunning && !isAITurn) {
        const rect = canvas.getBoundingClientRect();
        paddle.x = e.clientX - rect.left - paddleWidth / 2;
        if (paddle.x < 0) {
            paddle.x = 0;
        } else if (paddle.x + paddleWidth > canvas.width) {
            paddle.x = canvas.width - paddleWidth;
        }
    }
}

function startGame() {
    if (!gameRunning) {
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
    document.getElementById('scoreboard').textContent = `Score: ${score} | High Score: ${highScore} | ${isAITurn ? 'AI' : 'Player'}'s Turn`;
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
    if (score > highScore) {
        highScore = score;
    }
    score = 0;
    balls = [];
    isAITurn = !isAITurn;
    if (isAITurn) {
        startGame();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Player\'s Turn', canvas.width / 2, canvas.height / 2);
    }
}

function gameLoop() {
    if (gameRunning) {
        draw();
        if (isAITurn) {
            movePaddleAI();
        }
        requestAnimationFrame(gameLoop);
    }
}

// Simple AI to move paddle
function movePaddleAI() {
    if (balls.length > 0) {
        let targetBall = getTargetBall();
        if (targetBall) {
            let targetX = predictBallLandingX(targetBall);
            if (targetX < paddle.x) {
                paddle.x -= aiSpeed;
            } else if (targetX > paddle.x) {
                paddle.x += aiSpeed;
            }
            if (paddle.x < 0) {
                paddle.x = 0;
            } else if (paddle.x + paddleWidth > canvas.width) {
                paddle.x = canvas.width - paddleWidth;
            }
        }
    }
}

// Predict where the ball will land on the bottom of the screen
function predictBallLandingX(ball) {
    let predictedX = ball.x + (canvas.height - ball.y) * (ball.dx / ball.dy);
    while (predictedX < 0 || predictedX > canvas.width) {
        if (predictedX < 0) {
            predictedX = -predictedX;
        } else if (predictedX > canvas.width) {
            predictedX = 2 * canvas.width - predictedX;
        }
    }
    return predictedX;
}

// Get the ball most likely to go out of bounds next
function getTargetBall() {
    let minDistance = Infinity;
    let targetBall = null;
    balls.forEach(ball => {
        let distance = canvas.height - ball.y;
        if (distance < minDistance && ball.dy > 0) {
            minDistance = distance;
            targetBall = ball;
        }
    });
    return targetBall;
}

// Initial draw to display the paddle before game starts
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#fff';
ctx.font = '48px Arial';
ctx.textAlign = 'center';
ctx.fillText('Player\'s Turn', canvas.width / 2, canvas.height / 2);
