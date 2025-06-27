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
        
        const atlasSource = './assets/sprites/cars_atlas.png';
        const roadRightSpriteBounds = { x: 192, y: 0, w: 64, h: 64 };

        // Create a horizontal road
        const roadY = canvas.height / 2;
        const roadTileWidth = roadRightSpriteBounds.w;
        const numTiles = Math.ceil(canvas.width / roadTileWidth);

        for (let i = 0; i < numTiles; i++) {
            const roadSegment = new GESpriteAtlas(`road-segment-${i}`, layer, atlasSource, roadRightSpriteBounds);
            roadSegment.setX(i * roadTileWidth);
            roadSegment.setY(roadY);
            layer.createElement(roadSegment);
        }

        let player = new Player('player', layer, canvas.width / 2, canvas.height / 2);
        layer.createElement(player);

        let controller = new CarController('carController', layer, player);
        this.setController(controller);
        controller.load();
        
    }
}
