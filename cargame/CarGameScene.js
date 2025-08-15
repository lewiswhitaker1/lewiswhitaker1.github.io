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

        const uiFont = new GELabelFont("Arial", 16);
        const speedometer = new GELabel("speedometer", uiLayer, uiFont, "0 km/h", "white");
        speedometer.setX(12);
        speedometer.setY(24);
        uiLayer.createElement(speedometer);

        const rpmLabel = new GELabel("rpm", uiLayer, uiFont, "RPM: 0", "white");
        rpmLabel.setX(12);
        rpmLabel.setY(24 + 20);
        uiLayer.createElement(rpmLabel);

        const gearLabel = new GELabel("gear", uiLayer, uiFont, "Gear: 1", "white");
        gearLabel.setX(12);
        gearLabel.setY(24 + 40);
        uiLayer.createElement(gearLabel);

        const powerLabel = new GELabel("power", uiLayer, uiFont, "HP: 0", "white");
        powerLabel.setX(12);
        powerLabel.setY(24 + 60);
        uiLayer.createElement(powerLabel);

        const torqueLabel = new GELabel("torque", uiLayer, uiFont, "TQ: 0 Nm", "white");
        torqueLabel.setX(12);
        torqueLabel.setY(24 + 80);
        uiLayer.createElement(torqueLabel);

        this.getGame().getEvents().on('tick', () => {
            const speedKmh = player.getSpeedKmh().toFixed(0);
            speedometer.setText(`${speedKmh} km/h`);
            rpmLabel.setText(`RPM: ${player.getRpm().toFixed(0)}`);
            gearLabel.setText(`Gear: ${player.getGearLabel()}`);
            powerLabel.setText(`HP: ${player.getHp().toFixed(0)}`);
            torqueLabel.setText(`TQ: ${player.getTorqueNm().toFixed(0)} Nm`);
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
