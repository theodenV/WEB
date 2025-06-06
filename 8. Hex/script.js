function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateSimilarColor(originalColor) {
    const letters = '0123456789ABCDEF';
    let newColor = '#';
    for (let i = 1; i < 7; i++) {
        if (Math.random() < 0.3) {
            newColor += letters[Math.floor(Math.random() * 16)];
        } else {
            newColor += originalColor[i];
        }
    }
    return newColor;
}

function createColorBlock() {
    const correctColor = generateRandomColor();
    const block = document.createElement('div');
    block.className = 'color-block';
    block.dataset.correctColor = correctColor;
    
    const square = document.createElement('div');
    square.className = 'color-square';
    square.style.backgroundColor = correctColor;
    
    const options = document.createElement('div');
    options.className = 'options';
    
    const answers = [correctColor];
    while (answers.length < 3) {
        const similarColor = generateSimilarColor(correctColor);
        if (!answers.includes(similarColor)) {
            answers.push(similarColor);
        }
    }
    
    answers.sort(() => Math.random() - 0.5);
    answers.forEach(color => {
        const option = document.createElement('a');
        option.href = '#';
        option.className = 'option';
        option.textContent = color;
        option.onclick = function(e) {
            e.preventDefault();
            handleAnswer(block, color);
            return false;
        };
        options.appendChild(option);
    });
    
    block.appendChild(square);
    block.appendChild(options);
    return block;
}

function handleAnswer(block, selectedColor) {
    const correctColor = block.dataset.correctColor;
    const isCorrect = selectedColor === correctColor;
    
    if (isCorrect) {
        block.classList.add('correct-block');
        block.querySelectorAll('.option').forEach(option => {
            option.style.pointerEvents = 'none'; // Отключаем клики
        });
        
        const allBlocks = document.querySelectorAll('.color-block');
        const allCorrect = Array.from(allBlocks).every(block => block.classList.contains('correct-block'));
        
        if (allCorrect) {
            showGameComplete();
        }
    } else {
        block.classList.add('incorrect');
        setTimeout(() => {
            const newBlock = createColorBlock();
            block.parentNode.replaceChild(newBlock, block);
        }, 500);
    }
}

function showGameComplete() {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'flex';
    resultDiv.innerHTML = `
        <div class="success-message">
            <h2>Поздравляю!</h2>
            <p>Тебе еще не надо к окулисту!</p>
            <button onclick="restartGame()" class="back-button">Начать заново</button>
        </div>
    `;
}

function restartGame() {
    const container = document.getElementById('colorBlocks');
    const resultDiv = document.getElementById('result');
    container.innerHTML = '';
    resultDiv.style.display = 'none';
    for (let i = 0; i < 3; i++) {
        container.appendChild(createColorBlock());
    }
}

document.addEventListener('DOMContentLoaded', restartGame);
