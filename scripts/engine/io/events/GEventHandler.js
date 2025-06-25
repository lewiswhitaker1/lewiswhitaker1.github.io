import GameUtil from "../GameUtil.js";

export default class GEventHandler
{
    keys;
    /**
     * @type {Map<string, Function[]}
     */
    events;

    constructor()
    {
        //TODO: move keys over here
        this.keys = {};
        this.events = new Map();
        window.addEventListener('resize', () =>
        {
            let canvas = GameUtil.Canvas.getCanvas();
            this.call('resize', canvas);
        });
        window.addEventListener('keydown', (e) =>
        {
            let key = e.key;
            this.call('keyPress', key);
        });
        window.addEventListener('keyup', (e) =>
        {
            let key = e.key;
            this.call('keyRelease', key);
        });
        window.addEventListener('mousemove', (e) =>
        {
            let x = e.clientX;
            let y = e.clientY;
            this.call('mouseMove', x, y);
        });
        window.addEventListener('mousedown', (e) =>
        {
            let button = e.button;
            let x = e.clientX;
            let y = e.clientY;
            this.call('mousePress', button, x, y);
        });
        window.addEventListener('mouseup', (e) =>
        {
            let button = e.button;
            let x = e.clientX;
            let y = e.clientY;
            this.call('mouseRelease', button, x, y);
        });
        this.on('resize', (canvas) =>
        {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    /**
     * @template {keyof GEvent} E
     * @param {E} event
     * @param {GEvent[E]} script
     */
    on(event, script)
    {
        event = event.toLowerCase();
        if(this.events.has(event)) this.events.get(event).push(script);
        else
        {
            let scripts = [script];
            this.events.set(event, scripts);
        }
    }

    /**
     * @template {keyof GEvent} E
     * @param {E} event
     * @param {GEvent[E]} args
     */
    call(event, ...args)
    {
        event = event.toLowerCase();
        if(this.events.has(event))
        {
            let scripts = this.events.get(event);
            scripts.forEach(script => script(...args));
        }
    }
}