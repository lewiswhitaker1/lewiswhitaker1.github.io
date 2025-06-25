import GScene from "./scenes/GScene.js";
import GEventHandler from "./events/GEventHandler.js";
import GameUtil from "./GameUtil.js";

export default class Game
{
    id;
    debug;
    /**
     * @type {GScene}
     */
    scene;
    frames;
    update;
    events;

    /**
     * @param {string} id 
     * @param {number} update 
     */
    constructor(id = 'engine', update = 60, timeout = 1000)
    {
        this.id = id;
        this.debug = false;
        this.scene = null;
        this.update =
        {
            time: 0,
            step: 1 / update,
            delta: 1000 / update,
            alpha: 0,
            overall: 0,
            timeout: timeout
        };
        this.frames = 
        {
            time: 0,
            current: 0,
            average: 0
        };
        this.events = new GEventHandler();
        this.loop = this.loop.bind(this);
        this.load();
        this.loop();
    }

    load()
    {
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', this.id);
        document.body.appendChild(canvas);
        this.events.call('resize', canvas);
        this.events.call('load', this);
        this.events.on('process', () =>
        {
            this.frames.current++;
            let time = performance.now();
            if(time - this.frames.time >= 1000)
            {
                this.frames.time = time;
                this.frames.average = this.frames.current;
                this.frames.current = 0;
            }
            let font = GameUtil.Font.getFont('consolas', 12);
            let canvas = GameUtil.Canvas.getCanvas();
            let context = GameUtil.Canvas.getContext();
            GameUtil.Canvas.drawText(context, { font: font, color: '#FFFFFF64', text: GameUtil.Engine.getVersion() }, 1, canvas.height - font.getHeight() - 1);
        });
    }
    
    loop()
    {
        let time = performance.now();
        let delta = time - this.update.time;
        this.update.time = time;
        if(this.scene != null)
        {
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
                this.events.call('process', (this));
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
}