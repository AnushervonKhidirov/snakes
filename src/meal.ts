import type { TCoordinate } from './types.js'
import { events } from './constant.js'

class Meal {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    mealCoordinate: TCoordinate
    mealUpdatedEvent: Event
    mealSize = 10

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.context = context
        this.mealUpdatedEvent = new CustomEvent(events.mealUpdated)
        this.mealCoordinate = this.createMealCoordinate()
    }

    draw() {
        this.context.fillRect(this.mealCoordinate.x, this.mealCoordinate.y, this.mealSize, this.mealSize)
    }

    update() {
        this.mealCoordinate = this.createMealCoordinate()
        this.canvas.dispatchEvent(this.mealUpdatedEvent)
    }

    getPosition() {
        return this.mealCoordinate
    }

    createMealCoordinate() {
        return {
            x: Math.round(Math.random() * ((this.canvas.width - this.mealSize) / this.mealSize)) * this.mealSize,
            y: Math.round(Math.random() * ((this.canvas.height - this.mealSize - 50) / this.mealSize)) * this.mealSize,
        }
    }
}

export default Meal
