import { initializeGame, updateGameStatus, makeMove, getTurn, isGameOver, getSelectedPiecePos, setSelectedPiecePos, getValidMovesForSelectedPiece, setValidMovesForSelectedPiece, clearSelection } from './game.js';
import { renderBoard, setBoardReferences, setHandleClick } from './board.js';
import { setBoardReference as setMovesBoardReference, getPieceMoves } from './moves.js'; // Alias to avoid name conflict

// Global state variables, managed by main.js and passed to other modules as needed
let board = [];
let turn = 'white';
let selectedPiecePos = null;
let validMovesForSelectedPiece = [];
let gameOver = false;

const gameStatusElement = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

// Function to initialize the entire game
function initializeBoard() {
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
    turn = 'white';
    selectedPiecePos = null;
    validMovesForSelectedPiece = [];
    gameOver = false; // Reset game over flag

    // Pass references to other modules
    setBoardReferences(board, selectedPiecePos, validMovesForSelectedPiece, turn);
    setMovesBoardReference(board);
    initializeGame(board, turn, gameStatusElement);

    renderBoard();
    updateGameStatus();
}

// Main click handler for the chessboard
function handleClick(event) {
    if (isGameOver()) {
        return;
    }

    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    const clickedPiece = board[row][col];
    const currentSelectedPiecePos = getSelectedPiecePos(); // Get current selected state

    if (currentSelectedPiecePos) {
        if (isValidMoveTarget(row, col)) {
            makeMove(currentSelectedPiecePos.row, currentSelectedPiecePos.col, row, col);
            // Update local state after move from makeMove
            selectedPiecePos = getSelectedPiecePos(); 
            validMovesForSelectedPiece = getValidMovesForSelectedPiece();
            gameOver = isGameOver(); // Update gameOver state
            turn = getTurn(); // Update turn state
        } else {
            // Deselect or select new piece
            clearSelection();
            if (clickedPiece && isPieceOfCurrentTurn(clickedPiece)) {
                selectPiece(row, col);
            }
             // Update local state after selection change
            selectedPiecePos = getSelectedPiecePos(); 
            validMovesForSelectedPiece = getValidMovesForSelectedPiece();
        }
    } else {
        if (clickedPiece && isPieceOfCurrentTurn(clickedPiece)) {
            selectPiece(row, col);
        }
        // Update local state after selection change
        selectedPiecePos = getSelectedPiecePos(); 
        validMovesForSelectedPiece = getValidMovesForSelectedPiece();
    }
    // After any click handling, ensure board references are updated for rendering
    setBoardReferences(board, selectedPiecePos, validMovesForSelectedPiece, turn);
    renderBoard();
}

function isPieceOfCurrentTurn(piece) {
    const pieceColor = piece === piece.toLowerCase() ? 'white' : 'black';
    return pieceColor === getTurn();
}

function isValidMoveTarget(row, col) {
    return getValidMovesForSelectedPiece().some(move => move.row === row && move.col === col);
}

function selectPiece(row, col) {
    setSelectedPiecePos({ row, col });
    setValidMovesForSelectedPiece(getPieceMoves(row, col, board)); // Pass board explicitly
}


// --- Event Listeners ---
resetButton.addEventListener('click', initializeBoard);

// Set the handleClick callback for the board module
setHandleClick(handleClick);

// Initialize the board when the page loads
initializeBoard();