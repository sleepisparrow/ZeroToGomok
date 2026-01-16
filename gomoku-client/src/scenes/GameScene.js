import Phaser from 'phaser';

export const PLAYERS = {
    NONE: 0,
    BLACK: 1,
    WHITE: 2
};

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.boardSize = 19;
        // Increased tile size for better spacing as requested
        this.tileSize = 45;
        // Calculated margin to center the board on 1000x1000 canvas
        // Board width = (19-1) * 45 = 810px
        // (1000 - 810) / 2 = 95px
        this.margin = 95;

        this.board = [];
        this.turn = PLAYERS.BLACK;
        this.gameOver = false;
    }

    preload() {
        // No assets to preload for now
    }

    create() {
        this.initBoard();
        this.drawBoard();
        this.createUI();

        this.input.on('pointerdown', this.handleInput, this);
    }

    initBoard() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(PLAYERS.NONE));
        this.turn = PLAYERS.BLACK;
        this.gameOver = false;
    }

    drawBoard() {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x000000, 1);

        // Background
        const boardPixelSize = (this.boardSize - 1) * this.tileSize;

        // Draw wood background with some padding
        graphics.fillStyle(0xDEB887, 1); // Wood color
        graphics.fillRect(this.margin - 20, this.margin - 20, boardPixelSize + 40, boardPixelSize + 40);

        // Grid lines
        for (let i = 0; i < this.boardSize; i++) {
            // Horizontal
            graphics.moveTo(this.margin, this.margin + i * this.tileSize);
            graphics.lineTo(this.margin + boardPixelSize, this.margin + i * this.tileSize);

            // Vertical
            graphics.moveTo(this.margin + i * this.tileSize, this.margin);
            graphics.lineTo(this.margin + i * this.tileSize, this.margin + boardPixelSize);
        }
        graphics.strokePath();

        // Hwajom (Star points) for 19x19
        const starPoints = [3, 9, 15];
        graphics.fillStyle(0x000000, 1);
        starPoints.forEach(row => {
            starPoints.forEach(col => {
                graphics.fillCircle(this.margin + col * this.tileSize, this.margin + row * this.tileSize, 4);
            });
        });
    }

    createUI() {
        this.turnText = this.add.text(50, 30, "Black's Turn", {
            fontSize: '24px',
            fill: '#000'
        });

        const resetButton = this.add.text(800, 30, 'Reset Game', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 10, y: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.restart();
            });
    }

    handleInput(pointer) {
        if (this.gameOver) return;

        // Calculate grid position
        // Add half tile size to snap to nearest intersection
        const col = Math.floor((pointer.x - this.margin + this.tileSize / 2) / this.tileSize);
        const row = Math.floor((pointer.y - this.margin + this.tileSize / 2) / this.tileSize);

        // Boundary check
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            this.placeStone(row, col);
        }
    }

    placeStone(row, col) {
        if (this.board[row][col] !== PLAYERS.NONE) return;

        // Update state
        this.board[row][col] = this.turn;

        // DEBUG: Verify state update for User
        console.log(`[STATE CHECK] Stone placed at [${row}, ${col}] by Player ${this.turn}`);
        console.log('[STATE CHECK] Current Board Row State:', this.board[row]);

        // Draw stone
        const x = this.margin + col * this.tileSize;
        const y = this.margin + row * this.tileSize;

        // Stone radius slightly smaller than half tile size (45/2 = 22.5) -> 20
        const circle = this.add.circle(x, y, 20, this.turn === PLAYERS.BLACK ? 0x000000 : 0xffffff);
        circle.setStrokeStyle(1, 0x000000); // Outline for white stones

        // Switch turn
        this.turn = this.turn === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;
        this.updateUI();
    }

    updateUI() {
        this.turnText.setText(this.turn === PLAYERS.BLACK ? "Black's Turn" : "White's Turn");
    }
}
