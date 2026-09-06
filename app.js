const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('currentScore');
const shareBtn = document.getElementById('shareBtn');

let playerAngle = 0;
let rings = [];
let score = 0;
let gameOver = true;
let animId = null;
let keys = {};

const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;
const PLAYER_DIST = 130;
const PLAYER_SIZE = 8;
const GAP_SIZE = Math.PI / 2.5;

function spawnRing() {
    rings.push({
        radius: 10,
        gapAngle: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.min(score * 0.05, 2.5),
        passed: false
    });
}

function initGame() {
    playerAngle = 0;
    rings = [];
    score = 0;
    gameOver = false;
    scoreEl.textContent = score;
    shareBtn.style.display = 'none';
    spawnRing();
    loop();
}

function drawPlayer() {
    const x = CENTER_X + Math.cos(playerAngle) * PLAYER_DIST;
    const y = CENTER_Y + Math.sin(playerAngle) * PLAYER_DIST;
    
    ctx.beginPath();
    ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 0;
}

function drawRings() {
    rings.forEach(ring => {
        ctx.beginPath();
        ctx.arc(
            CENTER_X, 
            CENTER_Y, 
            ring.radius, 
            ring.gapAngle + GAP_SIZE / 2, 
            ring.gapAngle - GAP_SIZE / 2 + Math.PI * 2
        );
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4;
        ctx.stroke();
    });
}

function checkCollision(ring) {
    let normalizedPlayer = (playerAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    let normalizedGap = (ring.gapAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    
    let diff = Math.abs(normalizedPlayer - normalizedGap);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    
    return diff > (GAP_SIZE / 2 - 0.1);
}

function update() {
    if (keys['ArrowLeft']) playerAngle -= 0.07;
    if (keys['ArrowRight']) playerAngle += 0.07;

    for (let i = rings.length - 1; i >= 0; i--) {
        let ring = rings[i];
        ring.radius += ring.speed;

        if (Math.abs(ring.radius - PLAYER_DIST) < 4) {
            if (checkCollision(ring)) {
                gameOver = true;
                shareBtn.style.display = 'inline-block';
            } else if (!ring.passed) {
                ring.passed = true;
                score++;
                scoreEl.textContent = score;
            }
        }

        if (ring.radius > 160) {
            rings.splice(i, 1);
        }
    }

    const lastRing = rings[rings.length - 1];
    if (!lastRing || lastRing.radius > 60) {
        spawnRing();
    }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameOver) {
        update();
        drawRings();
        drawPlayer();
        animId = requestAnimationFrame(loop);
    } else {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CENTER_X, CENTER_Y - 10);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Click to Restart', CENTER_X, CENTER_Y + 15);
    }
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

canvas.addEventListener('click', () => {
    if (gameOver) initGame();
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameOver) {
        initGame();
        return;
    }
    const touchX = e.touches[0].clientX;
    const rect = canvas.getBoundingClientRect();
    if (touchX < rect.left + rect.width / 2) {
        playerAngle -= 0.2;
    } else {
        playerAngle += 0.2;
    }
});

shareBtn.onclick = () => {
    const text = `I dodged ${score} pulses in Pulse Dodge on the Evrion Gaming Hub! Can you beat my score?`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
};

loop();


