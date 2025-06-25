import GSceneLayer from "../scenes/GSceneLayer.js";

export default class GElement
{
    id;
    /**
     * @type {GSceneLayer}
     */
    layer;
    position;
    visible;

    /**
     * @param {string} id
     * @param {GSceneLayer} layer
     */
    constructor(id, layer)
    {
        this.id = id;
        this.layer = layer;
        this.position =
        {
            x: 0,
            y: 0
        };
        this.visible = true;
    }

    /**
     * @abstract
     * @
     */
    load() {}

    getID()
    {
        let scene = this.getLayer().getScene();
        return `${scene.id}/${this.layer.id}/${this.id}`;
    }

    getType()
    {
        return this.constructor;
    }

    /**
     * @returns {GSceneLayer}
     */
    getLayer()
    {
        return this.layer;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    setPosition(x, y)
    {
        this.position.x = x;
        this.position.y = y;
    }

    /**
     * @param {number} x 
     */
    setX(x)
    {
        this.position.x = x;
    }

    getX()
    {
        return this.position.x;
    }

    /**
     * @param {number} y
     */
    setY(y)
    {
        this.position.y = y;
    }


    getY()
    {
        return this.position.y;
    }

    getPosition()
    {
        return this.position;
    }

    /**
     * @param {boolean} visible 
     */
    setVisible(visible)
    {
        this.visible = visible;
    }

    isVisible()
    {
        return this.visible;
    }

    /**
     * @param {GElement} element
     */
    isElement(element)
    {
        return this.getID() === element.getID();
    }

    /**
     * @abstract
     * @param {number} delta 
     */
    tick(delta) {}

    /**
     * @abstract
     * @param {number} alpha 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(alpha, context) {}
}