/**
 * @typedef {import('../Game.js').default} Game
 * @typedef {import('../scenes/GScene.js').default} Scene
 * @typedef {import('../scenes/GSceneLayer.js').default} Layer
 * @typedef {import('../elements/GElement.js').default} GElement
 * @typedef {import('../elements/types/GETexture.js').default} GETexture
 * @typedef {import('../elements/types/GEController.js').default} GEController
 */

/**
 * @typedef {Object} GEvent
 * 
 * @property {(game: Game)} process
 * @property {(canvas: HTMLCanvasElement)} resize
 * 
 * @property {(game: Game)} load
 * @property {(scene: Scene)} loadScene
 * @property {(element: GElement)} loadElement
 * @property {(texture: GETexture)} loadTexture
 * 
 * @property {(game: Game, delta: number)} tick
 * @property {(scene: Scene, delta: number)} tickScene
 * @property {(layer: Layer, delta: number)} tickLayer
 * @property {(element: GElement, delta: number)} tickElement
 * 
 * @property {(game: Game, alpha: number, context: CanvasRenderingContext2D)} draw
 * @property {(scene: Scene, alpha: number, context: CanvasRenderingContext2D)} drawScene
 * @property {(layer: Layer, alpha: number, context: CanvasRenderingContext2D)} drawLayer
 * @property {(element: GElement, alpha: number, context: CanvasRenderingContext2D)} drawElement
 * 
 * @property {(key: string)} keyPress
 * @property {(key: string)} keyRelease
 * 
 * @property {(x: number, y: number)} mouseMove
 * @property {(button: number, x: number, y: number)} mousePress
 * @property {(button: number, x: number, y: number)} mouseRelease
 */