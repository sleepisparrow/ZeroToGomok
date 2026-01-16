export class RuleStrategy {
    constructor() {
        if (this.constructor === RuleStrategy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * Validate if a move is allowed
     * @param {number[][]} board 
     * @param {number} row 
     * @param {number} col 
     * @param {number} player 
     * @returns {boolean}
     */
    validateMove(board, row, col, player) {
        if (board[row][col] !== 0) return false;
        return true; // Default behavior: allow if empty
    }

    /**
     * Check if the last move resulted in a win
     * @param {number[][]} board 
     * @param {number} row 
     * @param {number} col 
     * @param {number} player 
     * @returns {boolean}
     */
    checkWin(board, row, col, player) {
        throw new Error("Method 'checkWin' must be implemented.");
    }

    /**
     * Helper to count consecutive stones in a direction
     */
    countConsecutive(board, row, col, dRow, dCol, player) {
        let count = 0;
        let r = row + dRow;
        let c = col + dCol;

        while (
            r >= 0 && r < board.length &&
            c >= 0 && c < board[0].length &&
            board[r][c] === player
        ) {
            count++;
            r += dRow;
            c += dCol;
        }
        return count;
    }
}
