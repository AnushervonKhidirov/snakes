import type { TCoordinate, TDirection, TSnakeCoordinates } from './types.js'
import { events } from './constant.js'

class Snake {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    snakeCoordinates: TSnakeCoordinates
    curDirection: TDirection
    hasEat: boolean
    biteItselfEvent: Event
    eatenEvent: Event
    directions: { [key: string]: TCoordinate }
    snakeWide = 10
    defaultSnakeLength = 8

    mealPosition: TCoordinate | null

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.context = context

        this.biteItselfEvent = new CustomEvent(events.lose)
        this.eatenEvent = new CustomEvent(events.eaten)

        this.hasEat = false

        this.mealPosition = null
        this.snakeCoordinates = []

        this.curDirection = 'up'

        this.directions = {
            up: {
                x: 0,
                y: -1,
            },
            down: {
                x: 0,
                y: 1,
            },
            left: {
                x: -1,
                y: 0,
            },
            right: {
                x: 1,
                y: 0,
            },
        }
    }

    init() {
        const halfSnake = Math.round(this.snakeWide * (this.defaultSnakeLength / 2))
        const xPos = Math.round(this.canvas.width / 10 / 2) * 10
        const yPos = Math.round(this.canvas.height / 10 / 2) * 10

        for (let i = 0; i < this.defaultSnakeLength; i++) {
            this.snakeCoordinates.push({
                x: xPos,
                y: yPos + this.snakeWide * i - halfSnake,
            })
        }

        this.draw()
        this.addControls()
    }

    draw() {
        this.snakeCoordinates.forEach(coordinate => {
            this.context.fillRect(coordinate.x, coordinate.y, this.snakeWide, this.snakeWide)
        })

        this.eating()
        this.update()
        this.isBiteItself()
    }

    update() {
        const newX = this.snakeCoordinates[0].x + this.directions[this.curDirection].x * this.snakeWide
        const newY = this.snakeCoordinates[0].y + this.directions[this.curDirection].y * this.snakeWide
        const maxX = this.canvas.width - this.snakeWide
        const maxY = this.canvas.height - this.snakeWide - 50

        const newPosition = {
            x: newX > maxX ? 0 : newX < 0 ? maxX : newX,
            y: newY > maxY ? 0 : newY < 0 ? maxY : newY,
        }

        if (!this.hasEat) this.snakeCoordinates.pop()
        this.snakeCoordinates.unshift(newPosition)
        this.hasEat = false
    }

    eating() {
        if (!this.mealPosition) return
        const snakeHead = this.snakeCoordinates[0]
        const isXEqual = snakeHead.x === this.mealPosition.x
        const isYEqual = snakeHead.y === this.mealPosition.y

        if (isXEqual && isYEqual) {
            this.canvas.dispatchEvent(this.eatenEvent)
            this.hasEat = true
        }
    }

    sendMealPosition(coordinate: TCoordinate) {
        this.mealPosition = coordinate
    }

    addControls() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.code

            if (key === 'ArrowUp') this.moveTo('up')
            if (key === 'ArrowDown') this.moveTo('down')
            if (key === 'ArrowLeft') this.moveTo('left')
            if (key === 'ArrowRight') this.moveTo('right')
        })
    }

    moveTo(direction: TDirection) {
        const oppositeSides: { [key: string]: TDirection } = {
            left: 'right',
            right: 'left',
            up: 'down',
            down: 'up',
        }

        if (oppositeSides[this.curDirection] !== direction) {
            this.curDirection = direction
        }
    }

    isBiteItself() {
        const snakeHead = this.snakeCoordinates[0]

        this.snakeCoordinates.forEach((coordinate, index) => {
            if (index === 0) return

            const isXEqual = snakeHead.x === coordinate.x
            const isYEqual = snakeHead.y === coordinate.y

            if (isXEqual && isYEqual) this.canvas.dispatchEvent(this.biteItselfEvent)
        })
    }
}

export default Snake
