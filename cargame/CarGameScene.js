import GScene from "../scripts/engine/io/scenes/GScene.js";
import Player from "./Player.js";
import CarController from "./CarController.js";
import GameUtil from "../scripts/engine/io/GameUtil.js";

export default class CarGameScene extends GScene {
    constructor(id, game) {
        super(id, game);
    }

    load() {
        const canvas = GameUtil.Canvas.getCanvas();
        let layer = this.createLayer('main');
        let player = new Player('player', layer, canvas.width / 2, canvas.height / 2);
        layer.createElement(player);

        let controller = new CarController('carController', layer, player);
        this.setController(controller);
        controller.load();
    }
} 