/**
 * @typedef {import('../Game.js').default} Game
 * @typedef {import('../scenes/GScene.js').default} Scene
 * @typedef {import('../scenes/GSceneLayer.js').default} Layer
 * @typedef {import('../elements/GElement.js').default} GElement
 * @typedef {import('../elements/types/GEController.js').default} GEController
 */

/**
 * @typedef {Object} GEvent
 * 
 * @property {(game: Game)} process
 * 
 * @property {(game: Game)} load
 * @property {(scene: Scene)} loadScene
 * @property {(element: GElement)} loadElement
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
 * @property {(controller: GEController, key: string)} keyPress
 * @property {(controller: GEController, key: string)} keyRelease
 */