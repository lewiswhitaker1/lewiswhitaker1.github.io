import GEEntity from "../scripts/engine/io/elements/types/GEEntity.js";

export default class Player extends GEEntity {
    constructor(id, layer, x, y) {
        super(id, layer);
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 0;
        this.maxSpeed = 500;
        this.acceleration = 200;
        this.deceleration = 100;
        this.turnSpeed = 2.5;

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
        };

        this.sprite = new Image();
        this.sprite.src = './assets/sprites/car1/base_blue.png';
        this.ready = false;
        this.sprite.onload = () => {
            this.ready = true;
            this.width = this.sprite.width;
            this.height = this.sprite.height;
        };
    }

    tick(delta) {
        // Movement
        if (this.keys.w) {
            this.speed += this.acceleration * delta;
        } else if (this.keys.s) {
            this.speed -= this.acceleration * delta;
        } else {
            if (this.speed > 0) {
                this.speed -= this.deceleration * delta;
                if (this.speed < 0) this.speed = 0;
            } else if (this.speed < 0) {
                this.speed += this.deceleration * delta;
                if (this.speed > 0) this.speed = 0;
            }
        }

        this.speed = Math.max(-this.maxSpeed / 2, Math.min(this.maxSpeed, this.speed));

        // Turning
        if (this.speed !== 0) {
            if (this.keys.a) {
                this.angle -= this.turnSpeed * delta;
            }
            if (this.keys.d) {
                this.angle += this.turnSpeed * delta;
            }
        }

        this.x += this.speed * Math.cos(this.angle) * delta;
        this.y += this.speed * Math.sin(this.angle) * delta;
    }

    draw(alpha, context) {
        if (!this.ready) return;

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }

    getX() { return this.x; }
    getY() { return this.y; }
} 