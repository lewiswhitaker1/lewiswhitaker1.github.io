import GESpriteAtlas from "./GESpriteAtlas.js";

export default class Player extends GESpriteAtlas {
    constructor(id, layer, x, y) {
        const atlasSource = './assets/sprites/cars_atlas.png';
        const carSpriteBounds = { x: 0, y: 0, w: 64, h: 64 };
        super(id, layer, atlasSource, carSpriteBounds);
        this.setX(x);
        this.setY(y);
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

        this.setX(this.getX() + this.speed * Math.cos(this.angle) * delta);
        this.setY(this.getY() + this.speed * Math.sin(this.angle) * delta);
    }

    draw(alpha, context) {
        if (!this.isReady()) return;

        context.save();
        context.translate(this.getX(), this.getY());
        context.rotate(this.angle);
        context.drawImage(
            this.texture,
            this.atlasRect.x,
            this.atlasRect.y,
            this.atlasRect.w,
            this.atlasRect.h,
            -this.getWidth() / 2,
            -this.getHeight() / 2,
            this.getWidth(),
            this.getHeight()
        );
        context.restore();
    }
}