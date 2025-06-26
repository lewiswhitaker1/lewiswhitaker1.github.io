import Game from "./engine/io/Game.js";
import Example from "./example/Example.js";

const game = new Game(); 
game.setScene(new Example('example', game));