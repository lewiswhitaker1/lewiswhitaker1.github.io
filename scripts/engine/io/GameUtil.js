import { GELabelFont } from "./elements/types/GELabel.js";

export default class GameUtil
{
    static Canvas = 
    {
        /**
         * @returns {HTMLCanvasElement}
         */
        getCanvas()
        {
            return document.getElementById('engine');
        },
        /**
         * @returns {CanvasRenderingContext2D}
         */
        getContext()
        {
            return this.getCanvas().getContext('2d');
        },
        /**
         * @param {CanvasRenderingContext2D} context
         * @param {GELabelFont} font 
         * @param {string} color
         * @param {number} x 
         * @param {number} y 
         * @param {string} text
         */
        drawText(context, font, color, x, y, text)
        {
            context.save();
            context.font = font.getFont();
            context.fillStyle = color;
            context.fillText(text, x, y + font.getTextHeight());
            context.restore();
        }
    }
}