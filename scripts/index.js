import Game from './engine/io/Game.js';
import CarGame from './cargame/CarGame.js';

window.onload = function() {
    let game = new Game('game', 60);
    game.setScene(new CarGame('cargame', game));
}