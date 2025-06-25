import GSceneLayer from "../../scenes/GSceneLayer.js";
import GETexture from "./GETexture.js";

export default class GESprite extends GETexture
{
    animation;

    /**
     * @param {string} id 
     * @param {GSceneLayer} layer 
     * @param {string} source 
     * @param {number} frames 
     * @param {number} speed 
     */
    constructor(id, layer, source, frames, speed)
    {
        super(id, layer, source);
        this.animation =
        {
            
        };
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