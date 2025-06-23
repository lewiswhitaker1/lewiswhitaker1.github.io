import GELabel, { GELabelFont } from "../engine/io/elements/types/GELabel.js";
import Game from "../engine/io/Game.js";
import GameUtil from "../engine/io/GameUtil.js";
import GScene from "../engine/io/scenes/GScene.js";
import ExampleLabel from "./ExampleLabel.js";

export default class Example extends GScene
{
    constructor(id, game)
    {
        super(id, game);
    }

    load()
    {
        let canvas = GameUtil.Canvas.getCanvas();
        let layer = this.createLayer('layer');
        layer.createElement(new ExampleLabel('label', layer, new GELabelFont('dr', 32), 3, 5, 2, 'There was something here.', 'white'));
    }
}