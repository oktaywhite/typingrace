const wordsDiv = document.querySelector('.words');
const inputBox = document.querySelector('.input');
const timer = document.querySelector('.timer');

let wordList = [];
let shuffledWords = [];
let currentWordIndex = 0;
let wordsToDisplay = [];
let currentDisplayIndex = 0;
let correctWords = 0;
let incorrectWords = 0;
let correctCharacters = 0;
let countdown;
const countdownDuration = 60;
let timeRemaining = countdownDuration;

document.addEventListener('DOMContentLoaded', () => {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            wordList = data.words;
            shuffledWords = wordList.sort(() => Math.random() - 0.5);
            sliceWords(16);
            printAllWords();
            inputBox.addEventListener('keydown', handleKeydown);
            checkInput();
        })
        .catch(error => console.error('JSON dosyasi alinamadi:', error));
});

function sliceWords(sliceSize) {
    wordsToDisplay = shuffledWords.slice(currentDisplayIndex, currentDisplayIndex + sliceSize);
    currentDisplayIndex += sliceSize;
}

const printAllWords = () => {
    wordsDiv.innerHTML = '';
    if (currentDisplayIndex > shuffledWords.length) {
        console.log('Tüm kelimeler tamamlandi.');
        inputBox.value = '';
        inputBox.disabled = true;
        clearInterval(countdown);
        const elapsedTime = countdownDuration - timeRemaining;
        const wps = (correctCharacters / elapsedTime).toFixed(2);
        const wpm = ((correctCharacters / 5) / (elapsedTime / 60)).toFixed(2);
        alert(`Correct: ${correctWords}\nIncorrect: ${incorrectWords}\nWPS: ${wps}\nWPM: ${wpm}`);
        return;
    }
    sliceWords(16);
    inputBox.value = '';
    wordsToDisplay.forEach(word => {
        const wordElement = document.createElement('li');
        wordElement.classList.add('word');
        wordElement.textContent = word;
        wordsDiv.appendChild(wordElement);
    });
    getAllWordElements('active');
};

const getNextWord = () => {
    currentWordIndex++;
    if (currentWordIndex < wordsToDisplay.length) {
        inputBox.value = '';
        clearClasses();
        getAllWordElements('active');
    } else if (currentDisplayIndex < shuffledWords.length) {
        printAllWords();
        currentWordIndex = 0;
    } else {
        inputBox.disabled = true;
        clearInterval(countdown);
        alert(`Game Over! Correct: ${correctWords}, Incorrect: ${incorrectWords}`);
    }
};

const clearClasses = () => {
    const currentWordElement = wordsDiv.querySelectorAll('li')[currentWordIndex];
    if (currentWordElement) {
        currentWordElement.classList.remove('active', 'incorrect');
    }
};

const handleKeydown = (event) => {
    const userValue = inputBox.value.trim();
    const currentWord = wordsToDisplay[currentWordIndex];

    if (event.code === 'Space') {
        if (userValue === '') {
            //
        } else if (userValue === currentWord) {
            correctWords++;
            correctCharacters += currentWord.length;
            wordsDiv.querySelectorAll('li')[currentWordIndex].classList.add('correct');
            console.log(`Space basıldı. Doğru kelime: ${currentWord} - counter: ${currentWordIndex} , correct: ${correctWords} | incorrect: ${incorrectWords}`);
            getNextWord();
        } else {
            incorrectWords++;
            wordsDiv.querySelectorAll('li')[currentWordIndex].classList.add('incorrect');
            console.log(`Space basıldı. Yanlış kelime: ${userValue} (${currentWord}) - counter: ${currentWordIndex} , correct: ${correctWords} | incorrect: ${incorrectWords}`);
            getNextWord();
        }

        event.preventDefault();
    }
};

const checkInput = () => {
    inputBox.addEventListener('input', () => {
        if (!countdown) {
            startCountdown();
        }

        const userValue = inputBox.value.trim();
        const currentWord = wordsToDisplay[currentWordIndex];

        if (userValue === '') {
            clearClasses();
            getAllWordElements('active');
        } else if (currentWord.startsWith(userValue)) {
            getAllWordElements('active', 'incorrect');
        } else {
            getAllWordElements('incorrect', 'active');
        }
    });
};

const getAllWordElements = (classNameAdd, classNameRemove) => {
    const allWordElements = wordsDiv.querySelectorAll('li');
    if (allWordElements[currentWordIndex]) {
        allWordElements[currentWordIndex].classList.add(classNameAdd);
        if (classNameRemove) {
            allWordElements[currentWordIndex].classList.remove(classNameRemove);
        }
    }
};

const startCountdown = () => {
    timeRemaining = countdownDuration;
    updateTimerDisplay();
    countdown = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            inputBox.value = '';
            inputBox.disabled = true;
            const elapsedTime = countdownDuration - timeRemaining;
            const wps = (correctCharacters / elapsedTime).toFixed(2);
            const wpm = ((correctCharacters / 5) / (elapsedTime / 60)).toFixed(2);
            alert(`Correct: ${correctWords}\nIncorrect: ${incorrectWords}\nWPS: ${wps}\nWPM: ${wpm}`);
        }
    }, 1000);
};

const updateTimerDisplay = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
