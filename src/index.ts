import SnakesGame from './snakes-game.js'

const gameElement = document.querySelector('#game')
const game = gameElement && new SnakesGame(gameElement)

if (game) game.init()
