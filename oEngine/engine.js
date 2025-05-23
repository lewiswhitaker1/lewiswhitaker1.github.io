const GAME_SETTINGS = {
    GRAVITY: 0.25,
    INITIAL_X_VELOCITY_SCALE: 10,
    BALL_RESTITUTION: 0.7,
    CLICK_IMPULSE_STRENGTH: 15,
    CLICK_ANIMATION_DURATION_FRAMES: 30,
    CLICK_ANIMATION_PULSE_SCALE: 0.3,
    NUM_BALLS: 30,
    MIN_BALL_RADIUS: 10,
    MAX_BALL_RADIUS_ADDITION: 35,
    DEFAULT_BALL_COLOR: '#4CAF50',
    CLICK_BALL_COLOR: '#FF4081',
    BACKGROUND_COLOR: '#1a1a1a',
    GLOW_BLUR_RADIUS: 20,
    INITIAL_BALL_MAX_Y_FACTOR: 0.5
};

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.velocityY = 0;
        this.velocityX = (Math.random() - 0.5) * GAME_SETTINGS.INITIAL_X_VELOCITY_SCALE;
        this.restitution = GAME_SETTINGS.BALL_RESTITUTION;
        this.clickAnimation = {
            active: false,
            duration: GAME_SETTINGS.CLICK_ANIMATION_DURATION_FRAMES,
            currentFrame: 0,
            color: GAME_SETTINGS.DEFAULT_BALL_COLOR
        };
    }

    isPointInside(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        return (dx * dx + dy * dy) <= (this.radius * this.radius);
    }

    applyRandomImpulse() {
        const direction = Math.floor(Math.random() * 3) - 1;
        const strength = GAME_SETTINGS.CLICK_IMPULSE_STRENGTH;
        this.velocityY = -strength;
        this.velocityX = direction * strength;
        
        this.clickAnimation.active = true;
        this.clickAnimation.currentFrame = 0;
        this.clickAnimation.color = GAME_SETTINGS.CLICK_BALL_COLOR;
    }

    updateAnimation() {
        if (this.clickAnimation.active) {
            this.clickAnimation.currentFrame++;
            
            const progress = this.clickAnimation.currentFrame / this.clickAnimation.duration;
            
            const pulseScale = 1 + Math.sin(progress * Math.PI) * GAME_SETTINGS.CLICK_ANIMATION_PULSE_SCALE;
            this.radius = this.baseRadius * pulseScale;
            
            if (progress >= 1) {
                this.clickAnimation.active = false;
                this.radius = this.baseRadius;
                this.clickAnimation.color = GAME_SETTINGS.DEFAULT_BALL_COLOR;
            }
        }
    }

    updatePhysicsAndWallCollisions(gravity, canvasWidth, canvasHeight) {
        this.velocityY += gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.velocityY = -this.velocityY * this.restitution;
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocityY = -this.velocityY * this.restitution;
        }

        if (this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
            this.velocityX = -this.velocityX * this.restitution;
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocityX = -this.velocityX * this.restitution;
        }
    }
}

class Engine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fpsCounter = document.getElementById('fpsCounter');
        this.balls = [];
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        this.gravity = GAME_SETTINGS.GRAVITY;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        for (let i = 0; i < GAME_SETTINGS.NUM_BALLS; i++) {
            this.balls.push(new Ball(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height * GAME_SETTINGS.INITIAL_BALL_MAX_Y_FACTOR,
                GAME_SETTINGS.MIN_BALL_RADIUS + Math.random() * GAME_SETTINGS.MAX_BALL_RADIUS_ADDITION
            ));
        }
        
        this.gameLoop();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    update(deltaTime) {
        for (let ball of this.balls) {
            ball.updatePhysicsAndWallCollisions(this.gravity, this.canvas.width, this.canvas.height);
            ball.updateAnimation();
        }

        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const ball1 = this.balls[i];
                const ball2 = this.balls[j];

                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < ball1.radius + ball2.radius) {
                    const nx = dx / distance;
                    const ny = dy / distance;

                    const relativeVelocityX = ball2.velocityX - ball1.velocityX;
                    const relativeVelocityY = ball2.velocityY - ball1.velocityY;
                    const relativeSpeed = relativeVelocityX * nx + relativeVelocityY * ny;

                    if (relativeSpeed > 0) continue;

                    const restitution = Math.min(ball1.restitution, ball2.restitution);
                    const impulse = -(1 + restitution) * relativeSpeed;
                    const mass1 = ball1.radius * ball1.radius;
                    const mass2 = ball2.radius * ball2.radius;
                    const totalMass = mass1 + mass2;

                    const impulseX = impulse * nx;
                    const impulseY = impulse * ny;

                    ball1.velocityX -= (mass2 / totalMass) * impulseX;
                    ball1.velocityY -= (mass2 / totalMass) * impulseY;
                    ball2.velocityX += (mass1 / totalMass) * impulseX;
                    ball2.velocityY += (mass1 / totalMass) * impulseY;

                    const overlap = (ball1.radius + ball2.radius - distance) / 2;
                    ball1.x -= overlap * nx;
                    ball1.y -= overlap * ny;
                    ball2.x += overlap * nx;
                    ball2.y += overlap * ny;
                }
            }
        }
    }
    
    render() {
        this.ctx.fillStyle = GAME_SETTINGS.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let ball of this.balls) {
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.clickAnimation.color;
            
            if (ball.clickAnimation.active) {
                this.ctx.shadowColor = ball.clickAnimation.color;
                this.ctx.shadowBlur = GAME_SETTINGS.GLOW_BLUR_RADIUS;
            }
            
            this.ctx.fill();
            this.ctx.closePath();
            
            this.ctx.shadowBlur = 0;
        }
    }
    
    updateFPS() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFpsUpdate;
        
        if (deltaTime >= 1) {
            const fps = ((this.frameCount * 1000) / deltaTime).toFixed(3);
            this.fpsCounter.textContent = `FPS: ${fps}`;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
        
        this.frameCount++;
    }
    
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 16.67;
        
        this.update(deltaTime);
        this.render();
        this.updateFPS();
        
        this.lastTime = currentTime;
        requestAnimationFrame(() => this.gameLoop());
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let ball of this.balls) {
            if (ball.isPointInside(x, y)) {
                ball.applyRandomImpulse();
                break;
            }
        }
    }
}

window.onload = () => {
    new Engine();
}; 