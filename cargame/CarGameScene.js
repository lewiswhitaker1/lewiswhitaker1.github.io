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

        
        
        const atlas1Source = './assets/sprites/cars_atlas.png';
        const sprite1Bounds = { x: 0, y: 0, w: 64, h: 64 }; 

        let atlasSprite1     = new GESpriteAtlas('atlas-sprite', layer, atlas1Source, sprite1Bounds);
        atlasSprite1.setX(100);
        atlasSprite1.setY(100);
        layer.createElement(atlasSprite1);

        const atlas2Source = './assets/sprites/cars_atlas.png';
        const sprite2Bounds = { x: 64, y: 0, w: 64, h: 64 }; 

        let atlasSprite2 = new GESpriteAtlas('atlas-sprite', layer, atlas2Source, sprite2Bounds);
        atlasSprite2.setX(200);
        atlasSprite2.setY(200);
        layer.createElement(atlasSprite2);
        
    }
}
