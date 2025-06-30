import { pieceMap, isWhite, getPieceColor } from './utils.js';
import { isKingInCheck, getPieceMoves } from './moves.js';

const chessboard = document.getElementById('chessboard');
let boardReference;
let selectedPiecePosReference;
let validMovesForSelectedPieceReference;
let turnReference;

// Function to set references from main.js
export function setBoardReferences(board, selectedPiecePos, validMovesForSelectedPiece, turn) {
    boardReference = board;
    selectedPiecePosReference = selectedPiecePos;
    validMovesForSelectedPieceReference = validMovesForSelectedPiece;
    turnReference = turn;
}

export function renderBoard() {
    chessboard.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = i;
            square.dataset.col = j;

            const pieceChar = boardReference[i][j];
            if (pieceChar) {
                const pieceElement = document.createElement('span');
                pieceElement.innerHTML = pieceMap[pieceChar];
                pieceElement.classList.add('piece');
                pieceElement.classList.add(isWhite(pieceChar) ? 'white' : 'black');
                square.appendChild(pieceElement);
            }

            if (selectedPiecePosReference && selectedPiecePosReference.row === i && selectedPiecePosReference.col === j) {
                square.classList.add('selected');
            }
            // Use validMovesForSelectedPieceReference
            if (validMovesForSelectedPieceReference.some(move => move.row === i && move.col === j)) {
                square.classList.add('possible-move');
                if (boardReference[i][j] !== '') {
                    square.classList.add('capture-target');
                }
            }

            // Highlight king in check
            if (pieceChar.toLowerCase() === 'k' && isKingInCheck(i, j, boardReference)) {
                square.classList.add('in-check');
            }

            square.addEventListener('click', handleClickWrapper); // Wrapper to pass event
            chessboard.appendChild(square);
        }
    }
}

// Wrapper for handleClick to allow passing it from main.js
let handleClickCallback;
export function setHandleClick(callback) {
    handleClickCallback = callback;
}

function handleClickWrapper(event) {
    if (handleClickCallback) {
        handleClickCallback(event);
    }
}