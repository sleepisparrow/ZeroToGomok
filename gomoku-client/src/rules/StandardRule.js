import { RuleStrategy } from './RuleStrategy';

export class StandardRule extends RuleStrategy {
    checkWin(board, row, col, player) {
        // Directions: Horizontal, Vertical, Diagonal(\), Diagonal(/)
        const directions = [
            [0, 1],   // Horizontal
            [1, 0],   // Vertical
            [1, 1],   // Diagonal \
            [1, -1]   // Diagonal /
        ];

        for (const [dRow, dCol] of directions) {
            // Count stones in both directions (forward + backward)
            const forward = this.countConsecutive(board, row, col, dRow, dCol, player);
            const backward = this.countConsecutive(board, row, col, -dRow, -dCol, player);

            // Total count including the current stone (1)
            if (forward + backward + 1 >= 5) {
                return true;
            }
        }

        return false;
    }
}
