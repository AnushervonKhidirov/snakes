import Snake from './snake.js'
import Meal from './meal.js'
import Score from './score.js'
import { events } from './constant.js'

class SnakesGame {
    wrapper: Element
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    started: boolean
    animation: any

    // snake
    snake: Snake
    meal: Meal
    score: Score

    constructor(gameWrapper: Element) {
        this.wrapper = gameWrapper
        this.canvas = document.createElement('canvas')
        this.canvas.width = 600
        this.canvas.height = 650

        this.context = this.canvas.getContext('2d')!

        this.started = false

        this.snake = new Snake(this.canvas, this.context)
        this.meal = new Meal(this.canvas, this.context)
        this.score = new Score(this.canvas, this.context)
    }

    init() {
        this.wrapper.appendChild(this.canvas)
        this.snake.init()

        this.meal.update()
        this.snake.sendMealPosition(this.meal.getPosition())

        this.drawScreen()

        window.addEventListener('keydown', () => {
            if (!this.started) {
                this.started = true
                this.animation = setInterval(this.drawScreen.bind(this), 50)
            }
        })

        this.canvas.addEventListener(events.lose, () => {
            clearInterval(this.animation)
            this.score.updateBestScore()
        })

        this.canvas.addEventListener(events.eaten, () => {
            this.meal.update()
            this.snake.sendMealPosition(this.meal.getPosition())
            this.score.add()
        })
    }

    drawScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.renderBorder()
        this.snake.draw()
        this.meal.draw()
        this.score.draw()
    }

    renderBorder() {
        this.context.strokeStyle = '#000'
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height - 50)
    }
}

export default SnakesGame
