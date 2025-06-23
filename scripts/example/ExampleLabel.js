import GELabel, { GELabelFont } from "../engine/io/elements/types/GELabel.js";
import GameUtil from "../engine/io/GameUtil.js";

export default class ExampleLabel extends GELabel
{
    speed;
    strength;
    frequency;

    constructor(id, layer, font, speed, strength, frequency, text = '', color = '')
    {
        super(id, layer, font, text, color);
        this.speed = speed;
        this.strength = strength;
        this.frequency = frequency;
    }

    load()
    {
        let game = this.getLayer().getScene().getGame();
        game.getEvents().on('drawElement', (element, alpha, context) =>
        {
            if(this.isElement(element))
            {
                let canvas = GameUtil.Canvas.getCanvas();
                this.setPosition(
                    canvas.width / 2 - this.font.getTextWidth(this.getText()) / 2,
                    canvas.height / 2 - this.font.getTextHeight() / 2);
            }
        })
        this.createEffect((alpha, context, label, position) =>
        {
            let shift = (label.index / label.text.length) * Math.PI * this.frequency;
            position.y += Math.sin(alpha / 1000 * this.speed + shift) * this.strength;
        });
    }
}