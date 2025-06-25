import GameUtil from "../../GameUtil.js";
import GSceneLayer from "../../scenes/GSceneLayer.js";
import GElement from "../GElement.js";

export default class GETexture extends GElement
{
    ready;
    texture;

    /**
     * @param {string} id 
     * @param {GSceneLayer} layer 
     * @param {string} source 
     */
    constructor(id, layer, source)
    {
        super(id, layer);
        this.ready = false;
        this.texture = new Image();
        this.texture.onload = () => 
        {
            this.ready = true;
            layer.getScene().getGame().getEvents().call('loadTexture', this);
        };
        this.texture.src = source;
    }

    isReady()
    {
        return this.ready;
    }

    getWidth()
    {
        return this.texture.naturalWidth;
    }

    getHeight()
    {
        return this.texture.naturalHeight;
    }

    /**
     * @type {GElement['draw']}
     */
    draw(alpha, context)
    {
        if(this.isReady()) GameUtil.Canvas.drawImage(context, this.texture, this.getX, this.getY, this.getWidth(), this.getHeight())
    }
}