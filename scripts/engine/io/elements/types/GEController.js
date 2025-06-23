import GSceneLayer from "../../scenes/GSceneLayer.js";
import GElement from "../GElement.js";

export default class GEController extends GElement
{
    keys;
    active;

    /**
     * @param {string} id 
     * @param {GSceneLayer} layer 
     */
    constructor(id, layer)
    {
        super(id, layer);
        this.keys = {};
        this.active = false;
        let game = layer.getScene().getGame();
        window.addEventListener('keypress', (event) =>
        {
            if(this.isActive())
            {
                this.keys[event.key.toLowerCase()] = true;
                game.getEvents().call('keyPress', (this, event.key));
            }
        });
        window.addEventListener('keyup', (event) =>
        {
            if(this.isActive())
            {
                this.keys[event.key.toLowerCase()] = false;
                game.getEvents().call('keyRelease', (this, event.key));
            }
        });
    }

    /**
     * 
     * @param {string} key 
     * @returns {boolean}
     */
    isPressed(key)
    {
        return !!this.keys[key];
    }

    setActive(active)
    {
        this.active = active;
        if(!this.active)
        {
            let keys = Object.keys(this.keys);
            keys.forEach(key => this.keys[key] = false);
        }
    }

    isActive()
    {
        return this.active;
    }
}