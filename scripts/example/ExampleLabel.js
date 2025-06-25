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
                    canvas.width / 2 - this.font.getWidth(this.getText()) / 2,
                    canvas.height / 2 - this.font.getHeight() / 2);
            }
        })
        this.createEffect((alpha, context, label, shadow, position) =>
        {
            let clamp = 50;
            let saturation = Math.sin(alpha / 1000) * clamp + clamp;
            label.color = `hsl(${(alpha / 10 + label.index * 15) % 360}, ${saturation}%, 50%)`;
            shadow.color = label.color;
            shadow.blur = 25 * (saturation / 100);
            let shift = (label.index / label.text.length) * Math.PI * this.frequency;
            position.y += Math.sin(alpha / 1000 * this.speed + shift) * this.strength;
        });
    }
}