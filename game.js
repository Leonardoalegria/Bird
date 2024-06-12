const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Cannon {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.width = 50;
        this.height = 30;
        this.angle = 0;
    }

    draw() {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.fillStyle = 'black';
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }

    update(mouseX) {
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    }
}

class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 5;
        this.angle = angle;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
    }
}

class Bird {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2;
        this.radius = 15;
        this.speed = Math.random() * 2 + 1;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'blue';
        context.fill();
        context.closePath();
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }
}

const cannon = new Cannon();
const bullets = [];
const birds = [];

function spawnBirds() {
    for (let i = 0; i < 5; i++) {
        birds.push(new Bird());
    }
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    cannon.draw();

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    birds.forEach((bird, birdIndex) => {
        bird.update();
        bird.draw();
        bullets.forEach((bullet, bulletIndex) => {
            const dx = bullet.x - bird.x;
            const dy = bullet.y - bird.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.radius + bird.radius) {
                birds.splice(birdIndex, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - cannon.y, event.clientX - cannon.x);
    bullets.push(new Bullet(cannon.x, cannon.y, angle));
});

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cannon.update(mouseX);
});

spawnBirds();
animate();
