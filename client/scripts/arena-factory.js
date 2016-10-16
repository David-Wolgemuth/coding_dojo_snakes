
var SnakeGame = require("./game");
module.exports = [
function ArenaFactory () {
    var factory = {
        
    };
    factory.makeNewGame = function (bots) {
        factory.game = new SnakeGame(bots, true);
        factory.game.setup();
        return factory.game;
    };
    factory.getCurrentGame = function (code) {
        return factory.game;
    };
    return factory;
}];