import GScene from "../engine/io/scenes/GScene.js";
import Player from "./Player.js";
import CarController from "./CarController.js";

export default class CarGame extends GScene {
    constructor(id, game) {
        super(id, game);
    }

    load() {
        let layer = this.createLayer('main');
        let player = new Player('player', layer, 'assets/sprites/car1/base_purple.png');
        layer.createElement(player);

        let controller = new CarController('carController', layer, player);
        layer.createElement(controller);
        this.setController(controller);
    }
} 