// Game state management
const GameState = {
    carDoor: null,
    firstPick: null,
    revealedDoor: null,
    currentPhase: 'start'
};

// DOM elements
const gameElements = {
    doors: document.querySelectorAll('.door'),
    messageBox: document.getElementById('message'),
    resetButton: document.getElementById('restart')
};

// Initialize game state
function setupGame() {
    // Reset all game state
    Object.assign(GameState, {
        carDoor: null,
        firstPick: null,
        revealedDoor: null,
        currentPhase: 'start'
    });

    // Reset doors appearance
    gameElements.doors.forEach(door => {
        door.classList.remove('opened');
        door.innerHTML = '';
        door.style.cursor = 'pointer';
    });

    // Place car behind random door
    GameState.carDoor = Math.floor(Math.random() * 3) + 1;
    
    // Enable reset button
    gameElements.resetButton.disabled = false;
    
    // Update message
    gameElements.messageBox.textContent = 'Выберите одну из трёх дверей';
}

// Handle door selection
function onDoorSelect(event) {
    const selectedDoor = parseInt(event.currentTarget.dataset.number);

    if (GameState.currentPhase === 'start') {
        // First selection phase
        GameState.firstPick = selectedDoor;
        GameState.currentPhase = 'first-pick';
        
        // Reveal a goat
        revealGoatDoor();
        
        // Update message
        gameElements.messageBox.textContent = 
            `Вы выбрали дверь ${selectedDoor}. ` +
            `Ведущий открыл дверь ${GameState.revealedDoor} с козой. ` +
            `Хотите изменить выбор?`;
    } 
    else if (GameState.currentPhase === 'final-pick') {
        // Final selection phase
        checkResult(selectedDoor);
    }
}

// Reveal a door with a goat
function revealGoatDoor() {
    // Find available doors (not selected and not containing car)
    const availableDoors = Array.from(gameElements.doors).filter(door => {
        const doorNumber = parseInt(door.dataset.number);
        return doorNumber !== GameState.firstPick && 
               doorNumber !== GameState.carDoor;
    });

    if (availableDoors.length > 0) {
        // Randomly select one available door
        const doorToReveal = availableDoors[Math.floor(Math.random() * availableDoors.length)];
        GameState.revealedDoor = parseInt(doorToReveal.dataset.number);

        // Update door appearance
        doorToReveal.classList.add('opened');
        doorToReveal.innerHTML = '<div class="content">🐐</div>';
        doorToReveal.style.cursor = 'default';
    }

    GameState.currentPhase = 'final-pick';
}

// Check final result
function checkResult(finalPick) {
    // Reveal all doors
    gameElements.doors.forEach(door => {
        const doorNumber = parseInt(door.dataset.number);
        door.classList.add('opened');
        door.style.cursor = 'default';

        // Add appropriate content
        if (doorNumber === GameState.carDoor) {
            door.innerHTML = '<div class="content">🚗</div>';
        } else if (doorNumber !== GameState.revealedDoor) {
            door.innerHTML = '<div class="content">🐐</div>';
        }
    });

    // Check if player won
    const isWin = finalPick === GameState.carDoor;

    // Update message
    gameElements.messageBox.textContent = isWin
        ? `Вы выиграли автомобиль. (Машина была за дверью ${GameState.carDoor})`
        : `Вы проиграли. Автомобиль был за дверью ${GameState.carDoor}.`;

    GameState.currentPhase = 'end';
}

// Event listeners
gameElements.doors.forEach(door => {
    door.addEventListener('click', onDoorSelect);
});

gameElements.resetButton.addEventListener('click', setupGame);

// Start the game
setupGame();