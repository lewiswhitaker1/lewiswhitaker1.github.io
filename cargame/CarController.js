import GEController from "../scripts/engine/io/elements/types/GEController.js";
import Player from "./Player.js";

export default class CarController extends GEController {
    /**
     * @param {string} id 
     * @param {import("../scripts/engine/io/scenes/GSceneLayer.js").default} layer 
     * @param {Player} player 
     */
    constructor(id, layer, player) {
        super(id, layer);
        this.player = player;
        this.active = false;
    }

    load() {
        document.addEventListener('keydown', (event) => this.handleKeyEvent(event, true));
        document.addEventListener('keyup', (event) => this.handleKeyEvent(event, false));
    }

    setActive(active) {
        this.active = active;
    }

    handleKeyEvent(event, isDown) {
        if (this.active && this.player && this.player.keys) {
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
                case 'q':
                    if (isDown) this.player.shiftDown();
                    break;
                case 'e':
                    if (isDown) this.player.shiftUp();
                    break;
            }
        }
    }
} 