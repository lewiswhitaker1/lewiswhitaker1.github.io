import Game from "../../Game.js";
import GameUtil from "../../GameUtil.js";
import GSceneLayer from "../../scenes/GSceneLayer.js";
import GElement from "../GElement.js";

export default class GELabel extends GElement
{
    /**
     * @type {GELabelFont}
     */
    font;
    /**
     * @type {string}
     */
    text;
    /**
     * @type {string}
     */
    color;
    /**
     * @typedef {(alpha: number, context: CanvasRenderingContext2D, label: {font: GELabelFont, text: string, letter: string, index: number}, position: {x: number, y: number}) => void} GELabelEffect
     * @type {GELabelEffect[]}
     */
    effects;

    /**
     * @param {string} id 
     * @param {GSceneLayer} layer 
     * @param {GELabelFont} font 
     * @param {string} color
     */
    constructor(id, layer, font, text = '', color = 'white')
    {
        super(id, layer);
        this.font = font;
        this.text = text;
        this.color = color;
        this.effects = [];
    }
    
    /**
     * @param {GELabelFont} font 
     */
    setFont(font)
    {
        this.font = font;
    }

    getFont()
    {
        return this.font;
    }

    /**
     * @param {string} text 
     */
    setText(text)
    {
        this.text = text;
    }

    getText()
    {
        return this.text;
    }

    /**
     * @param {GELabelEffect} effect 
     */
    createEffect(effect)
    {
        this.effects.push(effect);
    }

    /**
     * @type {GElement['draw']}
     */
    draw(alpha, context)
    {
        if(this.text != null)
        {
            if(this.effects.length > 0)
            {
                for(let i = 0; i < this.text.length; i++)
                {
                    let label =
                    {
                        font: this.font,
                        text: this.text,
                        color: this.color,
                        index: i,
                        letter: this.text[i]
                    };
                    let position =
                    {
                        x: this.getX() + this.font.getTextWidth(this.text.substring(0, i)),
                        y: this.getY()
                    }
                    this.effects.forEach(process =>
                    {
                        process(alpha, context, label, position);
                        GameUtil.Canvas.drawText(context, label.font, label.color, position.x, position.y, label.letter);
                    });
                }
            }
            else GameUtil.Canvas.drawText(context, this.font, this.color, this.getX(), this.getY(), this.text);
        }
    }
}

export class GELabelFont
{
    id;
    size;

    /**
     * @param {string} id 
     * @param {number} size 
     */
    constructor(id, size)
    {
        this.id = id;
        this.size = size;
    }

    setFont(id)
    {
        this.id = id;
    }

    getFont()
    {
        return `${this.size}px ${this.id}`;
    }

    getMetrics(text = '')
    {
        let context = GameUtil.Canvas.getContext();
        context.save();
        context.font = this.getFont();
        let metrics = context.measureText(text);
        context.restore();
        return metrics;
    }

    getTextWidth(text)
    {
        return this.getMetrics(text).width;
    }

    getTextHeight(text)
    {
        let metrics = this.getMetrics(text);
        return metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent;
    }
}