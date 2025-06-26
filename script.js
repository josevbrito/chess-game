const chessboard = document.getElementById('chessboard');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

let board = [];
let selectedPiecePos = null; // {row, col} da peça selecionada
let turn = 'white'; // 'white' ou 'black'
let validMovesForSelectedPiece = []; // Armazena os movimentos válidos para a peça selecionada

// Mapeamento de peças para caracteres Unicode
// Maiúsculas para peças brancas (representação padrão PGN), minúsculas para pretas.
// Isso é importante para diferenciar as cores das peças.
const pieceMap = {
    'R': '&#9814;', 'N': '&#9816;', 'B': '&#9815;', 'Q': '&#9813;', 'K': '&#9812;', 'P': '&#9817;', // Peças Pretas (Dark)
    'r': '&#9820;', 'n': '&#9822;', 'b': '&#9821;', 'q': '&#9819;', 'k': '&#9818;', 'p': '&#9823;'  // Peças Brancas (Light)
};

const pieceValues = { // Usado para uma avaliação básica, útil para IA futura
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0, // Rei não tem valor numérico
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
};

function initializeBoard() {
    // Representação inicial do tabuleiro (peças minúsculas para branco, maiúsculas para preto)
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
    turn = 'white'; // Sempre começa com as brancas
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
                // Brancas são minúsculas (p, r, n, b, q, k), Pretas são maiúsculas (P, R, N, B, Q, K)
                pieceElement.classList.add(isWhite(pieceChar) ? 'white' : 'black');
                square.appendChild(pieceElement);
            }

            // Adiciona classes para o destaque de seleção e movimentos possíveis
            if (selectedPiecePos && selectedPiecePos.row === i && selectedPiecePos.col === j) {
                square.classList.add('selected');
            }
            if (isValidMoveTarget(i, j)) {
                square.classList.add('possible-move');
                // Se for uma captura, adiciona uma classe diferente
                if (board[i][j] !== '') {
                    square.classList.add('capture-target');
                }
            }

            // Destaca o rei em xeque
            if (pieceChar.toLowerCase() === 'k' && isKingInCheck(i, j)) {
                square.classList.add('in-check');
            }


            square.addEventListener('click', handleClick);
            chessboard.appendChild(square);
        }
    }
}

function updateGameStatus() {
    let statusText = `É a vez das ${turn === 'white' ? 'Brancas' : 'Pretas'}`;
    const kingPos = findKing(turn);
    if (kingPos && isKingInCheck(kingPos.row, kingPos.col)) {
        statusText += `<br>O Rei ${turn === 'white' ? 'Branco' : 'Preto'} está em XEQUE!`;
    }
    gameStatus.innerHTML = statusText;
}

// --- Funções Auxiliares de Peças e Tabuleiro ---

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
        case 'p': // Peão
            // Peão branco
            if (pieceColor === 'white') {
                // Movimento para frente
                if (isValidPos(row - 1, col) && currentBoard[row - 1][col] === '') {
                    moves.push({ row: row - 1, col: col });
                    // Primeiro movimento (duas casas)
                    if (row === 6 && currentBoard[row - 2][col] === '' && currentBoard[row - 1][col] === '') {
                        moves.push({ row: row - 2, col: col });
                    }
                }
                // Captura diagonal
                if (isValidPos(row - 1, col - 1) && isBlack(currentBoard[row - 1][col - 1])) {
                    moves.push({ row: row - 1, col: col - 1 });
                }
                if (isValidPos(row - 1, col + 1) && isBlack(currentBoard[row - 1][col + 1])) {
                    moves.push({ row: row - 1, col: col + 1 });
                }
            }
            // Peão preto
            else {
                // Movimento para frente
                if (isValidPos(row + 1, col) && currentBoard[row + 1][col] === '') {
                    moves.push({ row: row + 1, col: col });
                    // Primeiro movimento (duas casas)
                    if (row === 1 && currentBoard[row + 2][col] === '' && currentBoard[row + 1][col] === '') {
                        moves.push({ row: row + 2, col: col });
                    }
                }
                // Captura diagonal
                if (isValidPos(row + 1, col - 1) && isWhite(currentBoard[row + 1][col - 1])) {
                    moves.push({ row: row + 1, col: col - 1 });
                }
                if (isValidPos(row + 1, col + 1) && isWhite(currentBoard[row + 1][col + 1])) {
                    moves.push({ row: row + 1, col: col + 1 });
                }
            }
            break;

        case 'r': // Torre
            // Linha e coluna
            // Direções: [dr, dc]
            const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            moves.push(...getSlidingMoves(row, col, rookDirections, pieceColor, currentBoard));
            break;

        case 'n': // Cavalo
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

        case 'b': // Bispo
            const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            moves.push(...getSlidingMoves(row, col, bishopDirections, pieceColor, currentBoard));
            break;

        case 'q': // Rainha
            const queenDirections = [
                [-1, 0], [1, 0], [0, -1], [0, 1], // Torre
                [-1, -1], [-1, 1], [1, -1], [1, 1]  // Bispo
            ];
            moves.push(...getSlidingMoves(row, col, queenDirections, pieceColor, currentBoard));
            break;

        case 'k': // Rei
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

    // Filtra movimentos que deixariam o próprio rei em xeque
    return moves.filter(move => {
        const newBoard = simulateMove(currentBoard, row, col, move.row, move.col);
        const kingPos = findKing(pieceColor, newBoard);
        return !isKingInCheck(kingPos.row, kingPos.col, newBoard);
    });
}

// Função auxiliar para peças que se movem em linha reta (Torre, Bispo, Rainha)
function getSlidingMoves(row, col, directions, pieceColor, currentBoard) {
    const moves = [];
    for (const [dr, dc] of directions) {
        let newRow = row + dr;
        let newCol = col + dc;
        while (isValidPos(newRow, newCol)) {
            const targetPiece = currentBoard[newRow][newCol];
            if (!targetPiece) { // Quadrado vazio
                moves.push({ row: newRow, col: newCol });
            } else { // Há uma peça no caminho
                if (getPieceColor(targetPiece) !== pieceColor) { // Peça do oponente (captura)
                    moves.push({ row: newRow, col: newCol });
                }
                break; // Para de procurar nesta direção
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
    return null; // Não deveria acontecer em um jogo válido
}

function isKingInCheck(kingRow, kingCol, currentBoard = board) {
    const kingColor = getPieceColor(currentBoard[kingRow][kingCol]);
    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = currentBoard[r][c];
            if (piece && getPieceColor(piece) === opponentColor) {
                // Pega os movimentos da peça do oponente (sem filtrar para xeque)
                const opponentPieceMoves = getPieceMovesUnfiltered(r, c, currentBoard);
                for (const move of opponentPieceMoves) {
                    if (move.row === kingRow && move.col === kingCol) {
                        return true; // O rei está sob ataque
                    }
                }
            }
        }
    }
    return false;
}

// Retorna todos os movimentos possíveis de uma peça, sem verificar se o rei ficaria em xeque.
// Usado especificamente para a função isKingInCheck para ver se o rei ESTÁ sendo atacado.
function getPieceMovesUnfiltered(row, col, currentBoard = board) {
    const piece = currentBoard[row][col];
    if (!piece) return [];

    const pieceType = piece.toLowerCase();
    const pieceColor = getPieceColor(piece);
    let moves = [];

    switch (pieceType) {
        case 'p': // Peão
            if (pieceColor === 'white') {
                if (isValidPos(row - 1, col) && currentBoard[row - 1][col] === '') moves.push({ row: row - 1, col: col });
                if (row === 6 && currentBoard[row - 2][col] === '' && currentBoard[row - 1][col] === '') moves.push({ row: row - 2, col: col });
                if (isValidPos(row - 1, col - 1)) moves.push({ row: row - 1, col: col - 1 }); // Sempre adiciona para cálculo de ataque
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
            const directions = (pieceType === 'r') ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : // Torre
                             (pieceType === 'b') ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : // Bispo
                             [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]; // Rainha
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
                // Parar se encontrar uma peça da mesma cor
                break;
            }
            moves.push({ row: newRow, col: newCol });
            if (targetPiece && getPieceColor(targetPiece) !== pieceColor) {
                // Se for peça inimiga, pode capturar, mas não pode pular
                break;
            }
            newRow += dr;
            newCol += dc;
        }
    }
    return moves;
}


// Simula um movimento em um tabuleiro temporário e o retorna
function simulateMove(currentBoard, fromRow, fromCol, toRow, toCol) {
    const newBoard = currentBoard.map(arr => [...arr]); // Cria uma cópia profunda do tabuleiro
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = '';
    return newBoard;
}

function isValidMoveTarget(row, col) {
    return validMovesForSelectedPiece.some(move => move.row === row && move.col === col);
}

// --- Lógica de Clique e Jogo ---

function handleClick(event) {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);
    const clickedPiece = board[row][col];

    // 1. Se uma peça já está selecionada (selectedPiecePos não é nulo)
    if (selectedPiecePos) {
        // Se o clique for em um dos movimentos válidos
        if (isValidMoveTarget(row, col)) {
            makeMove(selectedPiecePos.row, selectedPiecePos.col, row, col);
        } else {
            // Se o clique foi fora dos movimentos válidos, deseleciona
            // ou seleciona uma nova peça (se for do turno atual)
            clearSelection();
            if (clickedPiece && getPieceColor(clickedPiece) === turn) {
                selectPiece(row, col);
            }
        }
    }
    // 2. Nenhuma peça selecionada (selectedPiecePos é nulo)
    else {
        if (clickedPiece && getPieceColor(clickedPiece) === turn) {
            selectPiece(row, col);
        }
    }
}

function selectPiece(row, col) {
    selectedPiecePos = { row, col };
    validMovesForSelectedPiece = getPieceMoves(row, col);
    renderBoard(); // Renderiza para destacar a seleção e os movimentos possíveis
}

function clearSelection() {
    selectedPiecePos = null;
    validMovesForSelectedPiece = [];
    renderBoard(); // Renderiza para remover destaques
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';

    // Lógica para promoção de peão (básica, sem escolha de peça)
    const movedPiece = board[toRow][toCol];
    if (movedPiece.toLowerCase() === 'p') {
        if (isWhite(movedPiece) && toRow === 0) {
            board[toRow][toCol] = 'q'; // Promove para Rainha Branca
        } else if (isBlack(movedPiece) && toRow === 7) {
            board[toRow][toCol] = 'Q'; // Promove para Rainha Preta
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

// Inicializa o tabuleiro ao carregar a página
initializeBoard();