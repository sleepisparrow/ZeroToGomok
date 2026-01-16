import Phaser from 'phaser';
import { StandardRule } from '../rules/StandardRule';
import { RenjuRule } from '../rules/RenjuRule';

export const PLAYERS = {
    NONE: 0,
    BLACK: 1,
    WHITE: 2
};

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.boardSize = 19;
        this.tileSize = 45;
        this.margin = 95;

        this.board = [];
        this.turn = PLAYERS.BLACK;
        this.gameOver = false;

        this.rules = [new StandardRule(), new RenjuRule()];
        this.currentRuleIndex = 0;
        this.rule = this.rules[this.currentRuleIndex];

        // Forbidden spot markers
        this.forbiddenMarkers = [];
    }

    preload() { }

    create() {
        this.initBoard();
        this.drawBoard();
        this.createUI();
        this.updateForbiddenMarkers();

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

        const boardPixelSize = (this.boardSize - 1) * this.tileSize;

        graphics.fillStyle(0xDEB887, 1);
        graphics.fillRect(this.margin - 20, this.margin - 20, boardPixelSize + 40, boardPixelSize + 40);

        for (let i = 0; i < this.boardSize; i++) {
            graphics.moveTo(this.margin, this.margin + i * this.tileSize);
            graphics.lineTo(this.margin + boardPixelSize, this.margin + i * this.tileSize);
            graphics.moveTo(this.margin + i * this.tileSize, this.margin);
            graphics.lineTo(this.margin + i * this.tileSize, this.margin + boardPixelSize);
        }
        graphics.strokePath();

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
            fill: '#000',
            fontStyle: 'bold'
        });

        this.ruleText = this.add.text(50, 60, `Rule: ${this.rule.name}`, {
            fontSize: '16px',
            fill: '#555'
        });

        this.add.text(300, 30, 'Switch Rule', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#007bff',
            padding: { x: 10, y: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => {
                this.switchRule();
            });

        this.add.text(800, 30, 'Reset Game', {
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

    switchRule() {
        this.currentRuleIndex = (this.currentRuleIndex + 1) % this.rules.length;
        this.rule = this.rules[this.currentRuleIndex];
        this.ruleText.setText(`Rule: ${this.rule.name}`);
        console.log(`[RULE] Switched to ${this.rule.name}`);
        this.updateForbiddenMarkers();
    }

    /**
     * Update forbidden spot markers for Renju rule
     */
    updateForbiddenMarkers() {
        // Clear existing markers
        this.forbiddenMarkers.forEach(marker => marker.destroy());
        this.forbiddenMarkers = [];

        // Only show for Renju rule and Black's turn
        if (this.rule.name !== 'Renju' || this.turn !== PLAYERS.BLACK || this.gameOver) {
            return;
        }

        // Scan all empty spots
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === PLAYERS.NONE) {
                    if (!this.rule.validateMove(this.board, row, col, PLAYERS.BLACK)) {
                        // Draw X marker
                        const x = this.margin + col * this.tileSize;
                        const y = this.margin + row * this.tileSize;

                        const graphics = this.add.graphics();
                        graphics.lineStyle(3, 0xff0000, 0.8);
                        graphics.moveTo(x - 8, y - 8);
                        graphics.lineTo(x + 8, y + 8);
                        graphics.moveTo(x + 8, y - 8);
                        graphics.lineTo(x - 8, y + 8);
                        graphics.strokePath();

                        this.forbiddenMarkers.push(graphics);
                    }
                }
            }
        }
    }

    handleInput(pointer) {
        if (this.gameOver) return;

        const col = Math.floor((pointer.x - this.margin + this.tileSize / 2) / this.tileSize);
        const row = Math.floor((pointer.y - this.margin + this.tileSize / 2) / this.tileSize);

        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            this.placeStone(row, col);
        }
    }

    placeStone(row, col) {
        if (this.board[row][col] !== PLAYERS.NONE) return;

        if (!this.rule.validateMove(this.board, row, col, this.turn)) {
            console.log('[RULE] Invalid move blocked');
            return;
        }

        this.board[row][col] = this.turn;

        const x = this.margin + col * this.tileSize;
        const y = this.margin + row * this.tileSize;
        const circle = this.add.circle(x, y, 20, this.turn === PLAYERS.BLACK ? 0x000000 : 0xffffff);
        circle.setStrokeStyle(1, 0x000000);

        if (this.rule.checkWin(this.board, row, col, this.turn)) {
            this.gameOver = true;
            const winner = this.turn === PLAYERS.BLACK ? 'Black' : 'White';
            this.turnText.setText(`${winner} Wins!`);
            this.turnText.setStyle({ color: '#ff0000', fontSize: '32px' });
            console.log(`[WIN] ${winner} wins!`);
            this.updateForbiddenMarkers(); // Clear markers on game over
            return;
        }

        this.turn = this.turn === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;
        this.updateUI();
        this.updateForbiddenMarkers();
    }

    updateUI() {
        this.turnText.setText(this.turn === PLAYERS.BLACK ? "Black's Turn" : "White's Turn");
    }
}
