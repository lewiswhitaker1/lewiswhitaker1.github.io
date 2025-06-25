import GScene from "./GScene.js";
import GElement from "../elements/GElement.js";

export default class GSceneLayer
{
    id;
    scene;
    /**
     * @type {Map<string, GElement>}
     */
    elements;

    /**
     * @param {string} id 
     * @param {GScene} scene 
     */
    constructor(id, scene)
    {
        this.id = id;
        this.scene = scene;
        this.elements = new Map();
    }

    getScene()
    {
        return this.scene;
    }

    /**
     * @param {GElement} element 
     */
    createElement(element)
    {
        element.load();
        this.elements.set(element.id.replaceAll(' ', '_').toLowerCase(), element);
        this.getScene().getGame().getEvents().call('loadElement', (element));
        return element;
    }

    /**
     * @param {string} id
     */
    removeElement(id)
    {
        this.elements.delete(id.replaceAll(' ', '_').toLowerCase())
    }

    /**
     * @param {string} id
     */
    getElement(id)
    {
        return this.elements.get(id.replaceAll(' ', '_').toLowerCase());
    }

    /**
     * @param {string} id
     */
    hasElement(id)
    {
        return this.elements.has(id.replaceAll(' ', '_').toLowerCase());
    }

    /**
     * @returns {string[]}
     */
    getElements()
    {
        let max = 0;
        this.elements.forEach((element, id) =>
        {
            let y = Math.floor(element.getY());
            if(y > max) max = y;
        });
        let elements = [];
        let padding = max.toString().length;
        this.elements.forEach((element, id) =>
        {
            let order = `${Math.floor(element.getY())}`;
            order = order.padStart(padding, '0');
            order = `${order} ${id}`;
            elements.push(order);
        });
        elements = elements.sort();
        for(let i = 0; i < elements.length; i++)
        {
            let id = elements[i];
            id = id.split(' ')[1];
            elements[i] = id;
        }
        return elements;
    }
}