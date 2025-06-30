import { isValidPos, getPieceColor, isWhite, isBlack, simulateMove } from './utils.js';

let currentBoardReference; // This will hold a reference to the 'board' array from main.js

// Function to set the board reference
export function setBoardReference(board) {
    currentBoardReference = board;
}


// Function to get all legal moves for a piece at (row, col)
export function getPieceMoves(row, col) {
    const board = currentBoardReference; // Use the referenced board
    const piece = board[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();
    const pieceColor = getPieceColor(piece);
    let moves = [];

    switch (pieceType) {
        case 'p': // Pawn
            if (pieceColor === 'white') {
                if (isValidPos(row - 1, col) && board[row - 1][col] === '') {
                    moves.push({ row: row - 1, col: col });
                    if (row === 6 && board[row - 2][col] === '' && board[row - 1][col] === '') {
                        moves.push({ row: row - 2, col: col });
                    }
                }
                if (isValidPos(row - 1, col - 1) && isBlack(board[row - 1][col - 1])) {
                    moves.push({ row: row - 1, col: col - 1 });
                }
                if (isValidPos(row - 1, col + 1) && isBlack(board[row - 1][col + 1])) {
                    moves.push({ row: row - 1, col: col + 1 });
                }
            }
            else { // Black pawn
                if (isValidPos(row + 1, col) && board[row + 1][col] === '') {
                    moves.push({ row: row + 1, col: col });
                    if (row === 1 && board[row + 2][col] === '' && board[row + 1][col] === '') {
                        moves.push({ row: row + 2, col: col });
                    }
                }
                if (isValidPos(row + 1, col - 1) && isWhite(board[row + 1][col - 1])) {
                    moves.push({ row: row + 1, col: col - 1 });
                }
                if (isValidPos(row + 1, col + 1) && isWhite(board[row + 1][col + 1])) {
                    moves.push({ row: row + 1, col: col + 1 });
                }
            }
            break;

        case 'r': // Rook
            const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            moves.push(...getSlidingMoves(row, col, rookDirections, pieceColor, board));
            break;

        case 'n': // Knight
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            for (const [dr, dc] of knightMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidPos(newRow, newCol)) {
                    const targetPiece = board[newRow][newCol];
                    if (!targetPiece || getPieceColor(targetPiece) !== pieceColor) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
            break;

        case 'b': // Bishop
            const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            moves.push(...getSlidingMoves(row, col, bishopDirections, pieceColor, board));
            break;

        case 'q': // Queen
            const queenDirections = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ];
            moves.push(...getSlidingMoves(row, col, queenDirections, pieceColor, board));
            break;

        case 'k': // King
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            for (const [dr, dc] of kingMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidPos(newRow, newCol)) {
                    const targetPiece = board[newRow][newCol];
                    if (!targetPiece || getPieceColor(targetPiece) !== pieceColor) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
            break;
    }

    // Filter out moves that would leave the king in check
    return moves.filter(move => {
        const newBoard = simulateMove(board, row, col, move.row, move.col);
        const kingPos = findKing(pieceColor, newBoard);
        // Important: check if kingPos is not null before using it
        return kingPos && !isKingInCheck(kingPos.row, kingPos.col, newBoard);
    });
}

// Helper function for pieces that move in straight lines (Rook, Bishop, Queen)
function getSlidingMoves(row, col, directions, pieceColor, currentBoard) {
    const moves = [];
    for (const [dr, dc] of directions) {
        let newRow = row + dr;
        let newCol = col + dc;
        while (isValidPos(newRow, newCol)) {
            const targetPiece = currentBoard[newRow][newCol];
            if (!targetPiece) { // Empty square
                moves.push({ row: newRow, col: newCol });
            } else { // There's a piece in the way
                if (getPieceColor(targetPiece) !== pieceColor) { // Opponent's piece (capture)
                    moves.push({ row: newRow, col: newCol });
                }
                break; // Stop searching in this direction
            }
            newRow += dr;
            newCol += dc;
        }
    }
    return moves;
}

export function findKing(color, currentBoard = currentBoardReference) { // Use reference here
    const kingChar = color === 'white' ? 'k' : 'K';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (currentBoard[r][c] === kingChar) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

// Checks if the king at (kingRow, kingCol) is in check on currentBoard
export function isKingInCheck(kingRow, kingCol, currentBoard = currentBoardReference) { // Use reference here
    const kingColor = getPieceColor(currentBoard[kingRow][kingCol]);
    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = currentBoard[r][c];
            if (piece && getPieceColor(piece) === opponentColor) {
                const opponentPieceAttacks = getPieceAttacks(r, c, currentBoard);
                for (const attackMove of opponentPieceAttacks) {
                    if (attackMove.row === kingRow && attackMove.col === kingCol) {
                        return true; // The king is under attack
                    }
                }
            }
        }
    }
    return false;
}

// This function gets all squares a piece *attacks*, even if the move itself would be illegal due to putting own king in check.
// This is essential for correctly determining if an opponent's piece is attacking the king.
export function getPieceAttacks(row, col, currentBoard = currentBoardReference) { // Use reference here
    const piece = currentBoard[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();
    const pieceColor = getPieceColor(piece);
    let attacks = [];

    switch (pieceType) {
        case 'p': // Pawn
            if (pieceColor === 'white') {
                if (isValidPos(row - 1, col - 1)) attacks.push({ row: row - 1, col: col - 1 });
                if (isValidPos(row - 1, col + 1)) attacks.push({ row: row - 1, col: col + 1 });
            } else { // Black pawn
                if (isValidPos(row + 1, col - 1)) attacks.push({ row: row + 1, col: col - 1 });
                if (isValidPos(row + 1, col + 1)) attacks.push({ row: row + 1, col: col + 1 });
            }
            break;
        case 'r': // Rook
            const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            attacks.push(...getSlidingAttacks(row, col, rookDirections, pieceColor, currentBoard));
            break;
        case 'n': // Knight
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            for (const [dr, dc] of knightMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidPos(newRow, newCol)) {
                    attacks.push({ row: newRow, col: newCol });
                }
            }
            break;
        case 'b': // Bishop
            const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            attacks.push(...getSlidingAttacks(row, col, bishopDirections, pieceColor, currentBoard));
            break;
        case 'q': // Queen
            const queenDirections = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ];
            attacks.push(...getSlidingAttacks(row, col, queenDirections, pieceColor, currentBoard));
            break;
        case 'k': // King
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            for (const [dr, dc] of kingMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidPos(newRow, newCol)) {
                    attacks.push({ row: newRow, col: newCol });
                }
            }
            break;
    }
    return attacks;
}

// Helper for sliding pieces to get all squares they *attack*
function getSlidingAttacks(row, col, directions, pieceColor, currentBoard) {
    const attacks = [];
    for (const [dr, dc] of directions) {
        let newRow = row + dr;
        let newCol = col + dc;
        while (isValidPos(newRow, newCol)) {
            const targetPiece = currentBoard[newRow][newCol];
            if (targetPiece && getPieceColor(targetPiece) === pieceColor) {
                attacks.push({ row: newRow, col: newCol });
                break;
            }
            attacks.push({ row: newRow, col: newCol });
            if (targetPiece && getPieceColor(targetPiece) !== pieceColor) {
                break;
            }
            newRow += dr;
            newCol += dc;
        }
    }
    return attacks;
}