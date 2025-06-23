import GElement from "../GElement.js";

export default class GETexture extends GElement
{
    texture;

    constructor(id, layer, source)
    {
        super(id, layer);
        this.texture = new HTMLImageElement();
        this.texture.src = source;
    }

    /**
     * @type {GElement['draw']}
     */
    draw(alpha, context)
    {

    }
}