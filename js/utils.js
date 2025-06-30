export function isWhite(piece) {
    return piece === piece.toLowerCase() && piece !== '';
}

export function isBlack(piece) {
    return piece === piece.toUpperCase() && piece !== '';
}

export function getPieceColor(piece) {
    if (!piece) return null;
    return isWhite(piece) ? 'white' : 'black';
}

export function isValidPos(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function simulateMove(currentBoard, fromRow, fromCol, toRow, toCol) {
    const newBoard = currentBoard.map(arr => [...arr]); // Create a deep copy of the board
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = '';
    return newBoard;
}

export const pieceMap = {
    'R': '&#9814;', 'N': '&#9816;', 'B': '&#9815;', 'Q': '&#9813;', 'K': '&#9812;', 'P': '&#9817;', // Black Pieces (Dark)
    'r': '&#9820;', 'n': '&#9822;', 'b': '&#9821;', 'q': '&#9819;', 'k': '&#9818;', 'p': '&#9823;'  // White Pieces (Light)
};

export const pieceValues = { // Used for basic evaluation, useful for future AI
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0, // King has no numerical value
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
};