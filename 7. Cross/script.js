const board = Array(9).fill('');
let gameActive = true;
let currentPlayer = 'X';

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');

const winningMessage = () => `Игрок ${currentPlayer === 'X' ? 'X' : 'O'} победил!`;
const drawMessage = () => `Ничья!`;
const currentPlayerTurn = () => `Ход игрока ${currentPlayer}`;

statusDisplay.textContent = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const condition = board[a] && board[a] === board[b] && board[a] === board[c];
        if (condition) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.textContent = drawMessage();
        gameActive = false;
        return;
    }

    changePlayer();
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = currentPlayerTurn();

    if (currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function checkWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === '') {
            return c;
        }
        if (board[a] === player && board[c] === player && board[b] === '') {
            return b;
        }
        if (board[b] === player && board[c] === player && board[a] === '') {
            return a;
        }
    }
    return -1;
}

function computerMove() {
    const winningMove = checkWinningMove('O');
    if (winningMove !== -1) {
        const cell = cells[winningMove];
        handleCellPlayed(cell, winningMove);
        handleResultValidation();
        return;
    }

    const blockingMove = checkWinningMove('X');
    if (blockingMove !== -1) {
        const cell = cells[blockingMove];
        handleCellPlayed(cell, blockingMove);
        handleResultValidation();
        return;
    }

    const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cell = cells[randomIndex];
        handleCellPlayed(cell, randomIndex);
        handleResultValidation();
    }
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    board.fill('');
    statusDisplay.textContent = currentPlayerTurn();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
