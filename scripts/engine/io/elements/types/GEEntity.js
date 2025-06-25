import GElement from "../GElement.js";
import GESprite from "./GESprite.js";

export default class GEEntity extends GElement
{
    hitbox;
    /**
     * @type {Map<string, GESprite>}
     */
    sprites;

    constructor(id, layer)
    {
        super(id, layer);
        this.hitbox =
        {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.sprites = new Map();
        let game = this.layer.getScene().getGame();
        game.getEvents().on('tickElement', (element, delta) =>
        {
            if(element instanceof GEEntity && !this.isElement(element))
            {
                //TODO: cuboid interaction
            }
        });
    }


}