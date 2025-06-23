export default class GEventHandler
{
    /**
     * @type {Map<string, Function[]}
     */
    events;

    constructor()
    {
        this.events = new Map();
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