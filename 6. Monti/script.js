const GameState = {
    carDoor: null,
    firstPick: null,
    revealedDoor: null,
    currentPhase: 'start'
};

const gameElements = {
    doors: document.querySelectorAll('.door'),
    messageBox: document.getElementById('message'),
    resetButton: document.getElementById('restart')
};

function setupGame() {
    Object.assign(GameState, {
        carDoor: null,
        firstPick: null,
        revealedDoor: null,
        currentPhase: 'start'
    });
    gameElements.doors.forEach(door => {
        door.classList.remove('opened');
        door.innerHTML = '';
        door.style.cursor = 'pointer';
    });

    GameState.carDoor = Math.floor(Math.random() * 3) + 1;

    gameElements.resetButton.disabled = false;
    
    gameElements.messageBox.textContent = 'Выберите одну из трёх дверей';
}

function onDoorSelect(event) {
    const selectedDoor = parseInt(event.currentTarget.dataset.number);

    if (GameState.currentPhase === 'start') {

        GameState.firstPick = selectedDoor;
        GameState.currentPhase = 'first-pick';

        revealGoatDoor();

        gameElements.messageBox.textContent = 
            `Вы выбрали дверь ${selectedDoor}. ` +
            `Ведущий открыл дверь ${GameState.revealedDoor} с козой. ` +
            `Хотите изменить выбор?`;
    } 
    else if (GameState.currentPhase === 'final-pick') {
        checkResult(selectedDoor);
    }
}

function revealGoatDoor() {

    const availableDoors = Array.from(gameElements.doors).filter(door => {
        const doorNumber = parseInt(door.dataset.number);
        return doorNumber !== GameState.firstPick && 
               doorNumber !== GameState.carDoor;
    });

    if (availableDoors.length > 0) {

        const doorToReveal = availableDoors[Math.floor(Math.random() * availableDoors.length)];
        GameState.revealedDoor = parseInt(doorToReveal.dataset.number);

        doorToReveal.classList.add('opened');
        doorToReveal.innerHTML = '<div class="content">🐐</div>';
        doorToReveal.style.cursor = 'default';
    }

    GameState.currentPhase = 'final-pick';
}

function checkResult(finalPick) {

    gameElements.doors.forEach(door => {
        const doorNumber = parseInt(door.dataset.number);
        door.classList.add('opened');
        door.style.cursor = 'default';

        if (doorNumber === GameState.carDoor) {
            door.innerHTML = '<div class="content">🚗</div>';
        } else if (doorNumber !== GameState.revealedDoor) {
            door.innerHTML = '<div class="content">🐐</div>';
        }
    });

    const isWin = finalPick === GameState.carDoor;

    gameElements.messageBox.textContent = isWin
        ? `Вы выиграли автомобиль. (Машина была за дверью ${GameState.carDoor})`
        : `Вы проиграли. Автомобиль был за дверью ${GameState.carDoor}.`;

    GameState.currentPhase = 'end';
}

gameElements.doors.forEach(door => {
    door.addEventListener('click', onDoorSelect);
});

gameElements.resetButton.addEventListener('click', setupGame);

setupGame();
