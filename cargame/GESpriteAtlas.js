import GETexture from '../scripts/engine/io/elements/types/GETexture.js';

export default class GESpriteAtlas extends GETexture {
    
    constructor(id, layer, source, atlasRect) {
        super(id, layer, source);
        this.atlasRect = atlasRect;
    }

    
    draw(alpha, context) {
        if (this.isReady()) {
            
            context.drawImage(
                this.texture,      
                this.atlasRect.x,  
                this.atlasRect.y,  
                this.atlasRect.w,  
                this.atlasRect.h,  
                this.getX(),       
                this.getY(),       
                this.atlasRect.w,  
                this.atlasRect.h   
            );
        }
    }

    
    getWidth() {
        return this.atlasRect.w;
    }

    
    getHeight() {
        return this.atlasRect.h;
    }
}
