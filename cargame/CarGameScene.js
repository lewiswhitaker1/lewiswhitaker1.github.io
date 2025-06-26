import GScene from "../scripts/engine/io/scenes/GScene.js";
import Player from "./Player.js";
import CarController from "./CarController.js";
import GameUtil from "../scripts/engine/io/GameUtil.js";
import GESpriteAtlas from "./GESpriteAtlas.js";

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


        const atlasSource = './assets/sprites/cars_atlas.png';
        const roadRightSpriteBounds = { x: 192, y: 0, w: 64, h: 64 }; 

        let roadRight = new GESpriteAtlas('road-right', layer, atlasSource, roadRightSpriteBounds);
        roadRight.setX(300);
        roadRight.setY(300);
        layer.createElement(roadRight);

        let roadRight2 = new GESpriteAtlas('road-right2', layer, atlasSource, roadRightSpriteBounds);
        roadRight2.setX(300);
        roadRight2.setY(300);
        layer.createElement(roadRight2);
        
    }
}
