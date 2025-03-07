let scores = {
    wins: 0,
    losses: 0,
    ties: 0
};

const moveOptions = document.querySelectorAll('.move-option');
const computerChoice = document.getElementById('computer-choice');
const result = document.getElementById('result');
const resetButton = document.getElementById('reset-score');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');
const tiesDisplay = document.getElementById('ties');

const moves = ['rock', 'paper', 'scissors'];


moveOptions.forEach(option => {
    option.addEventListener('click', function() {
        moveOptions.forEach(opt => opt.style.border = 'none');
        this.style.border = '3px solid blue';
        
        playGame(this.dataset.move);
    });
});

resetButton.addEventListener('click', function() {
    scores = { wins: 0, losses: 0, ties: 0 };
    updateScoreDisplay();
    result.textContent = 'Choose your move to start the game!';
    moveOptions.forEach(opt => opt.style.border = 'none');
    computerChoice.src = 'images/question-mark.png';
});

function playGame(playerMove) {
    let counter = 0;
    
    let thinking = setInterval(function() {
        computerChoice.src = `images/${moves[counter % 3]}.png`;
        counter++;
        
        if (counter >= 6) {
            clearInterval(thinking);
            let computerMove = moves[Math.floor(Math.random() * 3)];
            computerChoice.src = `images/${computerMove}.png`;
            
            checkWinner(playerMove, computerMove);
        }
    }, 500);
}

function checkWinner(playerMove, computerMove) {
    if (playerMove === computerMove) {
        result.textContent = "It's a tie!";
        scores.ties++;
    } else if (
        (playerMove === 'rock' && computerMove === 'scissors') ||
        (playerMove === 'paper' && computerMove === 'rock') ||
        (playerMove === 'scissors' && computerMove === 'paper')
    ) {
        result.textContent = 'You win!';
        scores.wins++;
    } else {
        result.textContent = 'Computer wins!';
        scores.losses++;
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    winsDisplay.textContent = scores.wins;
    lossesDisplay.textContent = scores.losses;
    tiesDisplay.textContent = scores.ties;
}
