import Game from "../scripts/engine/io/Game.js";
import CarGameScene from "./CarGameScene.js";

const game = new Game();
game.setScene(new CarGameScene('car-game', game)); 