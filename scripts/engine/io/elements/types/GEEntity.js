import GElement from "../GElement.js";
import GESprite from "./GESprite.js";

export default class GEEntity extends GElement
{
    /**
     * @type {Map<string, GESprite>}
     */
    sprites;

    constructor(id, layer)
    {
        super(id, layer);
        this.sprites = new Map();
        let game = this.layer.getScene().getGame();
        game.getEvents().on('tickElement', (element, delta) =>
        {
            if(this.isVisible() ** !this.isElement(element))
            {
                
            }
        });
    }
}