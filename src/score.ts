import { storage } from './constant.js'

class Score {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    score: number
    bestScore: number

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.context = context

        this.score = 0
        this.bestScore = this.getBestScore()
    }

    draw() {
        const scoreText = `Score: ${this.score}, Best score: ${this.bestScore} `
        this.context.font = '20px serif'
        this.context.textBaseline = 'middle'
        this.context.fillText(scoreText, 10, this.canvas.height - 25)
    }

    add() {
        this.score++
    }

    updateBestScore() {
        if (this.score > this.bestScore) {
            localStorage.setItem(storage.bestScore, this.score.toString())
        }
    }

    getBestScore() {
        const bestScore = localStorage.getItem(storage.bestScore)
        return bestScore ? parseInt(bestScore) : 0
    }
}

export default Score
