import Game from "../Game.js";
import GElement from "../elements/GElement.js";
import GSceneLayer from "./GSceneLayer.js";
import GEController from "../elements/types/GEController.js";
import GameUtil from "../GameUtil.js";

export default class GScene
{
    id;
    game;
    /**
     * @type {Map<string, GSceneLayer>}
     */
    layers;
    /**
     * @type {GEController}
     */
    controller;

    /**
     * @param {string} name
     * @param {Game} game 
     */
    constructor(id, game)
    {
        this.id = id;
        this.game = game;
        this.layers = new Map();
        this.controller = null;
    }

    /**
     * @abstract
     */
    load() {}

    getGame()
    {
        return this.game;
    }

    /**
     * @param {string} id
     */
    createLayer(id)
    {
        let layer = new GSceneLayer(id, this);
        this.layers.set(id.toLowerCase(), layer);
        return layer;
    }

    /**
     * @param {string} id 
     */
    deleteLayer(id)
    {

    }

    /**
     * @param {GEController} controller 
     */
    setController(controller)
    {
        if(this.controller != null) this.controller.setActive(false);
        this.controller = controller;
        this.controller.setActive(true);
    }

    /**
     * @returns {GEController}
     */
    getController()
    {
        return this.controller;
    }

    process(event, ...args)
    {
        if(event === 'draw') GameUtil.Canvas.getContext().reset();
        this.game.getEvents().call(event, ...args);
        this.layers.forEach((layer, id) =>
        {
            let elements = layer.getElements();
            if(elements.length > 0)
            {
                this.game.events.call(`${event}Layer`, layer, ...args);
                elements.forEach((id) =>
                {
                    let element = layer.getElement(id);
                    if(element.isVisible())
                    {
                        this.game.events.call(`${event}Element`, element, ...args);
                        element[event](...args);
                    }
                });
            }
        });
    }
}