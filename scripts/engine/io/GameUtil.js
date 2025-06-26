import GELabel, { GELabelFont } from "./elements/types/GELabel.js";

export default class GameUtil
{
    static Engine =
    {
        getSource()
        {
            return 'https://github.com/morxwx/morxwx.github.io'
        },
        getVersion()
        {
            return document.querySelector('meta[name="engine"]')?.content;
        }
    }
    static Font =
    {
        /**
         * @param {string} id 
         * @param {number} size 
         */
        getFont(id, size)
        {
            return new GELabelFont(id, size);
        },
        getFonts()
        {
            return Array.from(document.fonts, font => font.family);
        }
    }
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
         * @param {{font: GELabelFont, color: string, text: string}} label
         * @param {number} x
         * @param {number} y
         * @param {{color: string, blur: number, x: number, y: number}} [shadow]
         */
        drawText(context, label, x, y, shadow = {color: '#00000000', blur: 0, x: 0, y: 0})
        {
            let font = label.font;
            let metrics = font.getMetrics();
            context.save();
            context.font = font.getFont();
            context.fillStyle = label.color;
            context.shadowColor = shadow.color;
            context.shadowBlur = shadow.blur;
            context.shadowOffsetX = shadow.x;
            context.shadowOffsetY = shadow.y;
            context.fillText(label.text, x + metrics.actualBoundingBoxLeft, y + metrics.actualBoundingBoxAscent);
            context.restore();
        },
        /**
         * @param {CanvasRenderingContext2D} context 
         * @param {HTMLImageElement} image
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        drawImage(context, image, x, y, width, height)
        {
            context.drawImage(image, x, y, width, height);
        },
        /**
         * @param {*} context 
         * @param {*} x1 
         * @param {*} y1 
         * @param {*} x2 
         * @param {*} y2 
         */
        drawLine(context, x1, y1, x2, y2)
        {

        },
        /**
         * @param {CanvasRenderingContext2D} context 
         * @param {number} x 
         * @param {number} y 
         * @param {number} width 
         * @param {number} height 
         * @param {string} colorLine 
         * @param {string} colorFill 
         */
        drawRect(context, x, y, width, height, colorLine, colorFill)
        {
            
        }
    }
}