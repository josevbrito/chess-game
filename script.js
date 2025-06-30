const chessboard = document.getElementById('chessboard');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

let board = [];
let selectedPiecePos = null; // {row, col} of the selected piece
let turn = 'white'; // 'white' or 'black'
let validMovesForSelectedPiece = []; // Stores valid moves for the selected piece

// Unicode character mapping for chess pieces
// Uppercase for Black pieces (standard PGN representation), lowercase for White.
// This is important for differentiating piece colors.
const pieceMap = {
    'R': '&#9814;', 'N': '&#9816;', 'B': '&#9815;', 'Q': '&#9813;', 'K': '&#9812;', 'P': '&#9817;', // Black Pieces (Dark)
    'r': '&#9820;', 'n': '&#9822;', 'b': '&#9821;', 'q': '&#9819;', 'k': '&#9818;', 'p': '&#9823;'  // White Pieces (Light)
};

const pieceValues = { // Used for basic evaluation, useful for future AI
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0, // King has no numerical value
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
};

function initializeBoard() {
    // Initial board representation (lowercase for white pieces, uppercase for black)
    board = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];
    turn = 'white'; // Always starts with white
    selectedPiecePos = null;
    validMovesForSelectedPiece = [];
    renderBoard();
    updateGameStatus();
}

function renderBoard() {
    chessboard.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = i;
            square.dataset.col = j;

            const pieceChar = board[i][j];
            if (pieceChar) {
                const pieceElement = document.createElement('span');
                pieceElement.innerHTML = pieceMap[pieceChar];
                pieceElement.classList.add('piece');
                // White pieces are lowercase (p, r, n, b, q, k), Black are uppercase (P, R, N, B, Q, K)
                pieceElement.classList.add(isWhite(pieceChar) ? 'white' : 'black');
                square.appendChild(pieceElement);
            }

            // Add classes for selection highlight and possible moves
            if (selectedPiecePos && selectedPiecePos.row === i && selectedPiecePos.col === j) {
                square.classList.add('selected');
            }
            if (isValidMoveTarget(i, j)) {
                square.classList.add('possible-move');
                // If it's a capture, add a different class
                if (board[i][j] !== '') {
                    square.classList.add('capture-target');
                }
            }

            // Highlight king in check
            if (pieceChar.toLowerCase() === 'k' && isKingInCheck(i, j)) {
                square.classList.add('in-check');
            }


            square.addEventListener('click', handleClick);
            chessboard.appendChild(square);
        }
    }
}

function updateGameStatus() {
    let statusText = `It's ${turn === 'white' ? 'White\'s' : 'Black\'s'} turn`;
    const kingPos = findKing(turn);
    if (kingPos && isKingInCheck(kingPos.row, kingPos.col)) {
        statusText += `<br>${turn === 'white' ? 'White' : 'Black'} King is in CHECK!`;
    }
    gameStatus.innerHTML = statusText;
}

// --- Helper Functions for Pieces and Board ---

function isWhite(piece) {
    return piece === piece.toLowerCase() && piece !== '';
}

function isBlack(piece) {
    return piece === piece.toUpperCase() && piece !== '';
}

function getPieceColor(piece) {
    if (!piece) return null;
    return isWhite(piece) ? 'white' : 'black';
}

function isValidPos(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getPieceMoves(row, col, currentBoard = board) {
    const piece = currentBoard[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();
    const pieceColor = getPieceColor(piece);
    let moves = [];

    switch (pieceType) {
        case 'p': // Pawn
            // White pawn
            if (pieceColor === 'white') {
                // Move forward
                if (isValidPos(row - 1, col) && currentBoard[row - 1][col] === '') {
                    moves.push({ row: row - 1, col: col });
                    // First move (two squares)
                    if (row === 6 && currentBoard[row - 2][col] === '' && currentBoard[row - 1][col] === '') {
                        moves.push({ row: row - 2, col: col });
                    }
                }
                // Diagonal capture
                if (isValidPos(row - 1, col - 1) && isBlack(currentBoard[row - 1][col - 1])) {
                    moves.push({ row: row - 1, col: col - 1 });
                }
                if (isValidPos(row - 1, col + 1) && isBlack(currentBoard[row - 1][col + 1])) {
                    moves.push({ row: row - 1, col: col + 1 });
                }
            }
            // Black pawn
            else {
                // Move forward
                if (isValidPos(row + 1, col) && currentBoard[row + 1][col] === '') {
                    moves.push({ row: row + 1, col: col });
                    // First move (two squares)
                    if (row === 1 && currentBoard[row + 2][col] === '' && currentBoard[row + 1][col] === '') {
                        moves.push({ row: row + 2, col: col });
                    }
                }
                // Diagonal capture
                if (isValidPos(row + 1, col - 1) && isWhite(currentBoard[row + 1][col - 1])) {
                    moves.push({ row: row + 1, col: col - 1 });
                }
                if (isValidPos(row + 1, col + 1) && isWhite(currentBoard[row + 1][col + 1])) {
                    moves.push({ row: row + 1, col: col + 1 });
                }
            }
            break;

        case 'r': // Rook
            // Row and column
            // Directions: [dr, dc]
            const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            moves.push(...getSlidingMoves(row, col, rookDirections, pieceColor, currentBoard));
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
                    const targetPiece = currentBoard[newRow][newCol];
                    if (!targetPiece || getPieceColor(targetPiece) !== pieceColor) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
            break;

        case 'b': // Bishop
            const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            moves.push(...getSlidingMoves(row, col, bishopDirections, pieceColor, currentBoard));
            break;

        case 'q': // Queen
            const queenDirections = [
                [-1, 0], [1, 0], [0, -1], [0, 1], // Rook moves
                [-1, -1], [-1, 1], [1, -1], [1, 1]  // Bishop moves
            ];
            moves.push(...getSlidingMoves(row, col, queenDirections, pieceColor, currentBoard));
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
                    const targetPiece = currentBoard[newRow][newCol];
                    if (!targetPiece || getPieceColor(targetPiece) !== pieceColor) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
            break;
    }

    // Filter out moves that would leave the king in check
    return moves.filter(move => {
        const newBoard = simulateMove(currentBoard, row, col, move.row, move.col);
        const kingPos = findKing(pieceColor, newBoard);
        return !isKingInCheck(kingPos.row, kingPos.col, newBoard);
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

function findKing(color, currentBoard = board) {
    const kingChar = color === 'white' ? 'k' : 'K';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (currentBoard[r][c] === kingChar) {
                return { row: r, col: c };
            }
        }
    }
    return null; // Should not happen in a valid game
}

function isKingInCheck(kingRow, kingCol, currentBoard = board) {
    const kingColor = getPieceColor(currentBoard[kingRow][kingCol]);
    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = currentBoard[r][c];
            if (piece && getPieceColor(piece) === opponentColor) {
                // Get opponent's piece moves (without filtering for check)
                const opponentPieceMoves = getPieceMovesUnfiltered(r, c, currentBoard);
                for (const move of opponentPieceMoves) {
                    if (move.row === kingRow && move.col === kingCol) {
                        return true; // The king is under attack
                    }
                }
            }
        }
    }
    return false;
}

// Returns all possible moves for a piece, without checking if the king would be in check.
// Used specifically by the isKingInCheck function to see if the king IS being attacked.
function getPieceMovesUnfiltered(row, col, currentBoard = board) {
    const piece = currentBoard[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();
    const pieceColor = getPieceColor(piece);
    let moves = [];

    switch (pieceType) {
        case 'p': // Pawn
            if (pieceColor === 'white') {
                if (isValidPos(row - 1, col) && currentBoard[row - 1][col] === '') moves.push({ row: row - 1, col: col });
                if (row === 6 && currentBoard[row - 2][col] === '' && currentBoard[row - 1][col] === '') moves.push({ row: row - 2, col: col });
                if (isValidPos(row - 1, col - 1)) moves.push({ row: row - 1, col: col - 1 }); // Always add for attack calculation
                if (isValidPos(row - 1, col + 1)) moves.push({ row: row - 1, col: col + 1 });
            } else { // Black pawn
                if (isValidPos(row + 1, col) && currentBoard[row + 1][col] === '') moves.push({ row: row + 1, col: col });
                if (row === 1 && currentBoard[row + 2][col] === '' && currentBoard[row + 1][col] === '') moves.push({ row: row + 2, col: col });
                if (isValidPos(row + 1, col - 1)) moves.push({ row: row + 1, col: col - 1 });
                if (isValidPos(row + 1, col + 1)) moves.push({ row: row + 1, col: col + 1 });
            }
            break;
        case 'r':
        case 'b':
        case 'q':
            const directions = (pieceType === 'r') ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : // Rook
                             (pieceType === 'b') ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : // Bishop
                             [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]; // Queen
            moves.push(...getSlidingMovesUnfiltered(row, col, directions, pieceColor, currentBoard));
            break;
        case 'n':
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            for (const [dr, dc] of knightMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidPos(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
            break;
        case 'k':
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            for (const [dr, dc] of kingMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidPos(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
            break;
    }
    return moves;
}

function getSlidingMovesUnfiltered(row, col, directions, pieceColor, currentBoard) {
    const moves = [];
    for (const [dr, dc] of directions) {
        let newRow = row + dr;
        let newCol = col + dc;
        while (isValidPos(newRow, newCol)) {
            const targetPiece = currentBoard[newRow][newCol];
            if (targetPiece && getPieceColor(targetPiece) === pieceColor) {
                // Stop if a piece of the same color is found
                break;
            }
            moves.push({ row: newRow, col: newCol });
            if (targetPiece && getPieceColor(targetPiece) !== pieceColor) {
                // If it's an enemy piece, it can capture, but cannot jump over
                break;
            }
            newRow += dr;
            newCol += dc;
        }
    }
    return moves;
}


// Simulates a move on a temporary board and returns it
function simulateMove(currentBoard, fromRow, fromCol, toRow, toCol) {
    const newBoard = currentBoard.map(arr => [...arr]); // Create a deep copy of the board
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = '';
    return newBoard;
}

function isValidMoveTarget(row, col) {
    return validMovesForSelectedPiece.some(move => move.row === row && move.col === col);
}

// --- Click and Game Logic ---

function handleClick(event) {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    const clickedPiece = board[row][col];

    // 1. If a piece is already selected (selectedPiecePos is not null)
    if (selectedPiecePos) {
        // If the click is on one of the valid moves
        if (isValidMoveTarget(row, col)) {
            makeMove(selectedPiecePos.row, selectedPiecePos.col, row, col);
        } else {
            // If the click was outside valid moves, deselect
            // or select a new piece (if it's the current turn's piece)
            clearSelection();
            if (clickedPiece && getPieceColor(clickedPiece) === turn) {
                selectPiece(row, col);
            }
        }
    }
    // 2. No piece selected (selectedPiecePos is null)
    else {
        if (clickedPiece && getPieceColor(clickedPiece) === turn) {
            selectPiece(row, col);
        }
    }
}

function selectPiece(row, col) {
    selectedPiecePos = { row, col };
    validMovesForSelectedPiece = getPieceMoves(row, col);
    renderBoard(); // Render to highlight selection and possible moves
}

function clearSelection() {
    selectedPiecePos = null;
    validMovesForSelectedPiece = [];
    renderBoard(); // Render to remove highlights
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';

    // Pawn promotion logic (basic, without piece choice)
    const movedPiece = board[toRow][toCol];
    if (movedPiece.toLowerCase() === 'p') {
        if (isWhite(movedPiece) && toRow === 0) {
            board[toRow][toCol] = 'q'; // Promote to White Queen
        } else if (isBlack(movedPiece) && toRow === 7) {
            board[toRow][toCol] = 'Q'; // Promote to Black Queen
        }
    }

    clearSelection();
    switchTurn();
    renderBoard();
    updateGameStatus();
}

function switchTurn() {
    turn = turn === 'white' ? 'black' : 'white';
}

// --- Event Listeners ---
resetButton.addEventListener('click', initializeBoard);

// Initialize the board when the page loads
initializeBoard();