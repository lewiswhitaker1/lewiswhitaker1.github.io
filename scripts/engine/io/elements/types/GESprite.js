import GETexture from "./GETexture.js";

export default class GESprite extends GETexture
{
    animation;

    constructor(id, layer, source, frames, speed)
    {
        super(id, layer, source);
        this.animation = {
            
        }
    }

    play(amount = 0)
    {

    }

    /**
     * @type {GElement['draw']}
     */
    draw()
    {

    }
}