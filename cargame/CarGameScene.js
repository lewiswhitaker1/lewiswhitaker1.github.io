import GScene from "../scripts/engine/io/scenes/GScene.js";
import Player from "./Player.js";
import CarController from "./CarController.js";
import GameUtil from "../scripts/engine/io/GameUtil.js";
import GESpriteAtlas from "./GESpriteAtlas.js";
import GELabel, { GELabelFont } from "../scripts/engine/io/elements/types/GELabel.js";

export default class CarGameScene extends GScene {
    constructor(id, game) {
        super(id, game);
    }

    load() {
        const canvas = GameUtil.Canvas.getCanvas();
        let backgroundLayer = this.createLayer('background');
        let playerLayer = this.createLayer('player');
        let uiLayer = this.createLayer('ui');
        
        let player = new Player('player', playerLayer, canvas.width / 2, canvas.height / 2);
        playerLayer.createElement(player);

        let controller = new CarController('carController', playerLayer, player);
        this.setController(controller);
        controller.load();

        const speedometerFont = new GELabelFont("Arial", 24);
        const speedometer = new GELabel("speedometer", uiLayer, speedometerFont, "0 km/h", "white");
        speedometer.setX(canvas.width / 2 - speedometer.getFont().getWidth("0 km/h") / 2);
        speedometer.setY(canvas.height - 50);
        uiLayer.createElement(speedometer);

        this.getGame().getEvents().on('tick', () => {
            const speed = player.speed;
            const speedKmh = (speed / 10).toFixed(0);
            speedometer.setText(`${speedKmh} km/h`);
            speedometer.setX(canvas.width / 2 - speedometer.getFont().getWidth(speedometer.getText()) / 2);
        });

        const atlasSource = './assets/sprites/cars_atlas.png';
        const roadRightSpriteBounds = { x: 192, y: 0, w: 64, h: 64 };

        // Create a horizontal road
        const roadY = canvas.height / 2;
        const roadTileWidth = roadRightSpriteBounds.w;
        const numTiles = Math.ceil(canvas.width / roadTileWidth);

        for (let i = 0; i < numTiles; i++) {
            const roadSegment = new GESpriteAtlas(`road-segment-${i}`, backgroundLayer, atlasSource, roadRightSpriteBounds);
            roadSegment.setX(i * roadTileWidth);
            roadSegment.setY(roadY);
            backgroundLayer.createElement(roadSegment);
        }
        
    }
}
