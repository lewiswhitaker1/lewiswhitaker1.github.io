import GSceneLayer from "../../scenes/GSceneLayer.js";
import GElement from "../GElement.js";

export default class GEController extends GElement
{
    /**
     * @param {string} id 
     * @param {GSceneLayer} layer 
     */
    constructor(id, layer)
    {
        super(id, layer);
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

    isActive()
    {
        return this.isElement(this.layer.getScene().getController());
    }
}