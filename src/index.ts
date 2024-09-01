import type { TCoordinate, TSnakeCoordinates } from './types'

class SnakesGame {
    wrapper: Element
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    scorePlacement: HTMLSpanElement
    direction: TCoordinate
    mealCoordinate: TCoordinate
    snakeCoordinates: TSnakeCoordinates
    animation: any
    loosed = false
    started = false
    elemSize = 10
    score = 0

    constructor(gameWrapper: Element) {
        this.wrapper = gameWrapper
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')!
        this.scorePlacement = document.createElement('div')

        this.snakeCoordinates = []

        this.direction = {
            x: 0,
            y: -1,
        }

        this.mealCoordinate = this.createMealCoordinate()
    }

    init() {
        this.createScore()
        this.createCanvas()
        this.createSnake()

        this.directionControl()
        this.drawScreen()

        this.animation = setInterval(() => {
            if (this.loosed) {
                clearInterval(this.animation)
            } else {
                if (this.started) this.drawScreen()
            }
        }, 50)
    }

    createCanvas() {
        const maxWidth = 600
        const maxHeight = 600

        const screenWidth = Math.round((window.screen.width - 20) / 10) * 10
        const screenHeight = Math.round((window.screen.height - 20) / 10) * 10

        this.canvas.width = Math.min(screenWidth, maxWidth)
        this.canvas.height = Math.min(screenHeight, maxHeight)
        this.wrapper.appendChild(this.canvas)
    }

    createScore() {
        this.scorePlacement.innerHTML = this.getScoreMarkup()
        this.wrapper.appendChild(this.scorePlacement)
    }

    createSnake() {
        const xPos = Math.round((this.canvas.width / 10) / 2) * 10
        const yPos = Math.round((this.canvas.height / 10) / 2) * 10
        const snakeLength = 8

        for (let i = 0; i < snakeLength; i++) {
            this.snakeCoordinates.push({
                x: xPos,
                y: yPos + this.elemSize * i
            })
        }
    }

    directionControl() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.key
            this.started = true

            if (key === 'ArrowUp') {
                if (this.direction.y === 1) return

                this.direction = {
                    x: 0,
                    y: -1,
                }
            }

            if (key === 'ArrowDown') {
                if (this.direction.y === -1) return

                this.direction = {
                    x: 0,
                    y: 1,
                }
            }

            if (key === 'ArrowRight') {
                if (this.direction.x === -1) return

                this.direction = {
                    x: 1,
                    y: 0,
                }
            }

            if (key === 'ArrowLeft') {
                if (this.direction.x === 1) return

                this.direction = {
                    x: -1,
                    y: 0,
                }
            }
        })
    }

    drawScreen() {
        this.clearScreen()
        this.renderBorder()
        this.renderSnake()
        this.renderMeal()
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    renderBorder() {
        this.context.strokeStyle = '#000'
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)
    }

    renderMeal() {
        const xPosition = this.mealCoordinate.x
        const yPosition = this.mealCoordinate.y

        this.context.fillStyle = '#000'
        this.context.fillRect(xPosition, yPosition, this.elemSize, this.elemSize)
    }

    renderSnake() {
        this.context.fillStyle = '#000'

        this.snakeCoordinates.forEach(coordinate => {
            this.context.fillRect(coordinate.x, coordinate.y, this.elemSize, this.elemSize)
        })

        this.moveSnake()
    }

    moveSnake() {
        const newX = this.snakeCoordinates[0].x + this.direction.x * this.elemSize
        const newY = this.snakeCoordinates[0].y + this.direction.y * this.elemSize
        const maxX = this.canvas.width - this.elemSize
        const maxY = this.canvas.height - this.elemSize

        const newPosition = {
            x: newX > maxX ? 0 : newX < 0 ? maxX : newX,
            y: newY > maxY ? 0 : newY < 0 ? maxY : newY,
        }

        if (this.isMealEaten()) {
            this.mealCoordinate = this.createMealCoordinate()
            this.updateScore()
        } else {
            this.snakeCoordinates.pop()
        }

        this.snakeCoordinates.unshift(newPosition)
        this.isSnakeBitten()
    }

    createMealCoordinate() {
        return {
            x: Math.round(Math.random() * ((this.canvas.width - this.elemSize) / this.elemSize)) * this.elemSize,
            y: Math.round(Math.random() * ((this.canvas.height - this.elemSize) / this.elemSize)) * this.elemSize,
        }
    }

    updateScore() {
        const record = localStorage.getItem('record')

        this.score++

        if (record && this.score > parseInt(record)) {
            localStorage.setItem('record', this.score.toString())
        }

        this.scorePlacement.innerHTML = this.getScoreMarkup()
    }

    updateRecord(record: number) {
        localStorage.setItem('record', record.toString())
    }

    getScoreMarkup() {
        return `Score: ${this.score}<br /> Record: ${localStorage.getItem('record')}`
    }

    isMealEaten() {
        const isXEqual = this.snakeCoordinates[0].x === this.mealCoordinate.x
        const isYEqual = this.snakeCoordinates[0].y === this.mealCoordinate.y
        return isXEqual && isYEqual
    }

    isSnakeBitten() {
        const snakeHead = this.snakeCoordinates[0]

        this.snakeCoordinates.forEach((coordinate, index) => {
            if (index === 0) return

            const isXEqual = snakeHead.x === coordinate.x
            const isYEqual = snakeHead.y === coordinate.y

            if (isXEqual && isYEqual) this.loosed = true
        })
    }
}

// =========
const gameElement = document.querySelector('#game')
const game = gameElement ? new SnakesGame(gameElement) : null

if (game) game.init()
