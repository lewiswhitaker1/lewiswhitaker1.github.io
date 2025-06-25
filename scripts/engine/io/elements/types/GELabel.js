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
     * @typedef {(alpha: number, context: CanvasRenderingContext2D,
     * label: {font: GELabelFont, text: string, color: string, letter: string, index: number},
     * shadow: {color: string, blur: number, x: number, y: number},
     * position: {x: number, y: number}) => void} GELabelEffect
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
                        letter: this.text[i],
                        index: i
                    };
                    let shadow =
                    {
                        color: '#00000000',
                        blur: 0,
                        x: 0,
                        y: 0
                    };
                    let position =
                    {
                        x: this.getX() + this.font.getWidth(this.text.substring(0, i)),
                        y: this.getY()
                    };
                    this.effects.forEach(process =>
                    {
                        process(alpha, context, label, shadow, position);
                        GameUtil.Canvas.drawText(context, { font: label.font, color: label.color, text: label.letter },
                            position.x, position.y, { color: shadow.color, blur: shadow.blur, x: shadow.x, y: shadow.y });
                    });
                }
            }
            else GameUtil.Canvas.drawText(context, { font: this.font, color: this.color, text: this.text }, this.getX(), this.getY());
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

    /**
     * @param {string} id
     */
    setFont(id)
    {
        this.id = id;
    }

    getFont()
    {
        return `${this.size}px ${this.id}`;
    }

    /**
     * @param {number} size 
     */
    setSize(size)
    {
        this.size = size;
    }

    getSize()
    {
        return this.size;
    }

    getMetrics(text = 'A')
    {
        let context = GameUtil.Canvas.getContext();
        context.save();
        context.font = this.getFont();
        let metrics = context.measureText(text);
        context.restore();
        return metrics;
    }

    getWidth(text)
    {
        return this.getMetrics(text).width;
    }

    getHeight()
    {
        return this.getMetrics().actualBoundingBoxAscent;
    }
}