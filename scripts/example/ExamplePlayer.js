import GEController from "../engine/io/elements/types/GEController.js";

export default class ExamplePlayer extends GEController
{
    constructor(name, layer)
    {
        super(name, layer);
    }

    load()
    {
        let game = this.getLayer().getScene().getGame();
        game.getEvents().on('tickElement', (element, delta) =>
        {
            if(this.isElement(element) && this.isActive())
            {
                if(this.isPressed('w'))
                {
                    
                }
            }
        })
    }
}