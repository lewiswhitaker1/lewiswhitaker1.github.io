import GameUtil from "../engine/io/GameUtil.js";
import GScene from "../engine/io/scenes/GScene.js";
import ExampleLabel from '../example/ExampleLabel.js'

export default class Example extends GScene
{
    /**
     * @param {string} id
     * @param {Game} game
     */
    constructor(id, game)
    {
        super(id, game);
    }

    load()
    {
        let layer = this.createLayer('layer');
        let label = new ExampleLabel('label', layer, GameUtil.Font.getFont('test', 32), 3, 5, 3, 'There will be something here.', '#FFFFFF');
        layer.createElement(label);
    }
}