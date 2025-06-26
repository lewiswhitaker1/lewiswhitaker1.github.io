import GETexture from "../engine/io/elements/types/GETexture.js";

export default class Player extends GETexture {
    constructor(id, layer, source) {
        super(id, layer, source);
        this.speed = 200;
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
    }

    tick(delta) {
        if (this.keys.w) {
            this.setY(this.getY() - this.speed * delta);
        }
        if (this.keys.a) {
            this.setX(this.getX() - this.speed * delta);
        }
        if (this.keys.s) {
            this.setY(this.getY() + this.speed * delta);
        }
        if (this.keys.d) {
            this.setX(this.getX() + this.speed * delta);
        }
    }
} 