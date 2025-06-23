import GScene from "./scenes/GScene.js";
import GEventHandler from "./events/GEventHandler.js";
import GameUtil from "./GameUtil.js";

export default class Game
{
    id;
    scene;
    update;
    events;

    /**
     * @param {string} id 
     * @param {number} update 
     */
    constructor(id = 'engine', update = 60, timeout = 1000)
    {
        this.id = id;
        this.scene = null;
        this.update = {
            time: 0,
            step: 1 / update,
            delta: 1000 / update,
            alpha: 0,
            overall: 0,
            timeout: timeout
        }
        this.events = new GEventHandler();
        this.loop = this.loop.bind(this);
        this.load();
        this.loop();
    }

    load()
    {
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', this.id);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () =>
        {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        document.body.appendChild(canvas);
        this.events.call('load', this);
    }
    
    loop()
    {
        let time = performance.now();
        let delta = time - this.update.time;
        this.update.time = time;
        if(this.scene != null)
        {
            this.events.call('process', (this));
            if(delta <= this.update.timeout)
            {
                this.update.alpha += delta;
                this.update.overall += delta;
                while(this.update.alpha >= this.update.delta)
                {
                    this.update.alpha -= this.update.delta;
                    this.scene.process('tick', this.update.step);
                }
                this.scene.process('draw', this.update.overall, GameUtil.Canvas.getContext());
            }
        }
        requestAnimationFrame(this.loop);
    }

    /**
     * @param {GScene} scene 
     */
    setScene(scene)
    {
        scene.load();
        this.scene = scene;
        this.events.call('loadScene', this.scene);
        return this.scene;
    }

    /**
     * @returns {GScene}
     */
    getScene()
    {
        return this.scene;
    }

    /**
     * @returns {GEventHandler}
     */
    getEvents()
    {
        return this.events;
    }

    static util =
    {
        clear()
        {
            let canvas = this.getCanvas();
            let context = this.get2DContext();
            context.fillStyle = 'black';
            context.fillRect(0, 0, canvas.width, canvas.height);
        },
        /**
         * @returns {HTMLCanvasElement}
         */
        getCanvas()
        {
            return document.getElementById('game');
        },
        get2DContext()
        {
            return this.getCanvas().getContext('2d');
        },
        /**
         * @param {CanvasRenderingContext2D} context 
         * @param {*} font 
         * @param {*} size 
         * @param {*} string 
         * @returns {number}
         */
        getTextWidth(context, font, size, string)
        {
            context.save();
            context.font = `${size}px ${font}`;
            let width = context.measureText(string).width;
            context.restore();
            return width;
        },
        /**
         * @param {CanvasRenderingContext2D} context 
         * @param {*} font 
         * @param {*} size 
         * @returns {number}
         */
        getTextHeight(context, font, size)
        {
            context.save();
            context.font = `${size}px ${font}`;
            let height = context.measureText(' ').actualBoundingBoxAscent;
            context.restore();
            return height;
        },
        /**
         * @param {CanvasRenderingContext2D} context
         * @param {string} size 
         * @param {string} font 
         * @param {string} color 
         * @param {number} x 
         * @param {number} y 
         * @param {string} string 
         */
        drawText(context, size, font, color, x, y, string)
        {
            context.save();
            context.font = `${size}px ${font}`;
            context.fillStyle = color;
            context.fillText(string, x, y);
            context.restore();
        },
        /**
         * @param {CanvasRenderingContext2D} context
         * @param {HTMLImageElement} image
         * @param {number} x
         * @param {number} y
         * @param {number} imageX
         * @param {number} imageY
         * @param {number} imageW
         * @param {number} imageH
         */
        drawImage(context, image, x, y, imageX, imageY, imageW, imageH)
        {
            let w = imageW;
            let h = imageH;
            context.drawImage(image, imageX, imageY, imageW, imageH, x, y, w, h);
        }
    }
}