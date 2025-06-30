import { isWhite, isBlack, getPieceColor, simulateMove } from './utils.js';
import { findKing, isKingInCheck, getPieceMoves } from './moves.js';
import { renderBoard } from './board.js';

let board;
let turn;
let gameOver;
let selectedPiecePos;
let validMovesForSelectedPiece;
let gameStatusElement; // Reference to the DOM element for game status

// Function to initialize game variables and elements
export function initializeGame(initialBoard, initialTurn, gameStatusEl) {
    board = initialBoard;
    turn = initialTurn;
    gameOver = false;
    selectedPiecePos = null;
    validMovesForSelectedPiece = [];
    gameStatusElement = gameStatusEl;
    updateGameStatus();
}

export function updateGameStatus() {
    let statusText = `It's ${turn === 'white' ? 'White\'s' : 'Black\'s'} turn`;
    const kingPos = findKing(turn, board);

    if (kingPos) {
        const kingColor = getPieceColor(board[kingPos.row][kingPos.col]);
        if (isKingInCheck(kingPos.row, kingPos.col, board)) {
            if (isCheckmate(kingColor)) {
                statusText = `CHECKMATE! ${kingColor === 'white' ? 'Black' : 'White'} wins!`;
                gameOver = true;
            } else {
                statusText += `<br>${kingColor === 'white' ? 'White' : 'Black'} King is in CHECK!`;
            }
        } else {
            if (hasNoLegalMoves(kingColor)) {
                statusText = `STALEMATE! It's a draw!`;
                gameOver = true;
            }
        }
    }
    gameStatusElement.innerHTML = statusText;
}

// Function to check if a player has any legal moves
function hasNoLegalMoves(color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) === color) {
                if (getPieceMoves(r, c, board).length > 0) { // Pass board explicitly
                    return false;
                }
            }
        }
    }
    return true;
}

// Function to check for checkmate
function isCheckmate(color) {
    const kingPos = findKing(color, board);
    if (!kingPos || !isKingInCheck(kingPos.row, kingPos.col, board)) {
        return false;
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) === color) {
                const legalMoves = getPieceMoves(r, c, board); // Pass board explicitly
                if (legalMoves.length > 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

export function makeMove(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';

    // Pawn promotion logic
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

export function switchTurn() {
    turn = turn === 'white' ? 'black' : 'white';
}

export function getTurn() {
    return turn;
}

export function isGameOver() {
    return gameOver;
}

export function getSelectedPiecePos() {
    return selectedPiecePos;
}

export function getValidMovesForSelectedPiece() {
    return validMovesForSelectedPiece;
}

export function setSelectedPiecePos(pos) {
    selectedPiecePos = pos;
}

export function setValidMovesForSelectedPiece(moves) {
    validMovesForSelectedPiece = moves;
}

export function clearSelection() {
    selectedPiecePos = null;
    validMovesForSelectedPiece = [];
}