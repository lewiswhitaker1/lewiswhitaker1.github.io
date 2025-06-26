import GEController from "../engine/io/elements/types/GEController.js";
import Player from "./Player.js";

export default class CarController extends GEController {
    constructor(id, layer, player) {
        super(id, layer);
        this.player = player;
    }

    load() {
        document.addEventListener('keydown', (event) => this.handleKeyEvent(event, true));
        document.addEventListener('keyup', (event) => this.handleKeyEvent(event, false));
    }

    handleKeyEvent(event, isDown) {
        if (this.player) {
            switch (event.key.toLowerCase()) {
                case 'w':
                    this.player.keys.w = isDown;
                    break;
                case 'a':
                    this.player.keys.a = isDown;
                    break;
                case 's':
                    this.player.keys.s = isDown;
                    break;
                case 'd':
                    this.player.keys.d = isDown;
                    break;
            }
        }
    }
} 