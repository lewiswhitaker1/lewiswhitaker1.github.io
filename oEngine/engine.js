class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityY = 0;
        this.velocityX = (Math.random() - 0.5) * 5;
        this.restitution = 0.7;
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
        
        this.gravity = 0.5;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        for (let i = 0; i < 10; i++) {
            this.balls.push(new Ball(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height * 0.5,
                10 + Math.random() * 20
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
            ball.velocityY += this.gravity;
            
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            
            if (ball.y + ball.radius > this.canvas.height) {
                ball.y = this.canvas.height - ball.radius;
                ball.velocityY = -ball.velocityY * ball.restitution;
            }
            
            if (ball.x + ball.radius > this.canvas.width) {
                ball.x = this.canvas.width - ball.radius;
                ball.velocityX = -ball.velocityX * ball.restitution;
            }
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.velocityX = -ball.velocityX * ball.restitution;
            }
        }
    }
    
    render() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let ball of this.balls) {
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
    
    updateFPS() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFpsUpdate;
        
        if (deltaTime >= 10) {
            const fps = Math.round((this.frameCount * 10) / deltaTime);
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
}

window.onload = () => {
    new Engine();
}; 